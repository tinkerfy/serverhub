"""Simple MLX LM server using FastAPI + uvicorn.

Usage:
    python3 mlx_server.py --model mlx-community/Qwen3.6-35B-A3B-4bit

This loads the model once at startup and exposes a /generate endpoint.
"""

import argparse
import sys
import time
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    import mlx_lm
    from mlx_lm import load as mlx_load
    from mlx_lm import generate as mlx_generate
    from mlx_lm.sample_utils import make_sampler
except ImportError:
    print("ERROR: mlx_lm is not installed. Run: pip3 install mlx-lm")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 512
    temperature: float = 0.7
    top_p: float = 0.9
    repetition_penalty: float = 1.0
    stream: bool = False


class GenerateResponse(BaseModel):
    text: str
    total_tokens: int
    load_time: float
    generate_time: float


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

model = None
tokenizer = None
load_time: float = 0.0


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer, load_time

    if not MODEL:
        yield
        return

    print(f"Loading model: {MODEL}", flush=True)
    t0 = time.time()
    result = mlx_load(MODEL)
    # load() returns (model, tokenizer) or (model, tokenizer, config)
    model = result[0]
    tokenizer = result[1]
    load_time = time.time() - t0
    print(f"Model loaded in {load_time:.1f}s", flush=True)

    yield

    # Clean up on shutdown
    del model, tokenizer


app = FastAPI(
    title="MLX LM Server",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}


@app.post("/generate", response_model=GenerateResponse)
def generate_text(req: GenerateRequest):
    try:
        if model is None or tokenizer is None:
            raise HTTPException(
                status_code=503,
                detail="Model not loaded. Start the server with --model <path>",
            )

        t0 = time.time()

        # Create a sampler from the request parameters
        sampler = make_sampler(
            temp=req.temperature,
            top_p=float(req.top_p),
        )

        output = mlx_generate(
            model,
            tokenizer,
            prompt=req.prompt,
            max_tokens=req.max_tokens,
            sampler=sampler,
            verbose=False,
        )
        gen_time = time.time() - t0

        # count tokens roughly (the model may return a list of tokens)
        if isinstance(output, str):
            text = output
            token_count = len(output.split())
        else:
            text = str(output)
            token_count = len(output)

        return GenerateResponse(
            text=text,
            total_tokens=token_count,
            load_time=round(load_time, 2),
            generate_time=round(gen_time, 2),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="MLX LM REST API server")
    parser.add_argument(
        "--model",
        default="mlx-community/Qwen3.6-35B-A3B-4bit",
        help="Model path or HuggingFace repo ID",
    )
    parser.add_argument(
        "--host", default="0.0.0.0", help="Bind address"
    )
    parser.add_argument("--port", type=int, default=8080, help="Port")
    parser.add_argument(
        "--no-model",
        action="store_true",
        help="Skip model loading (API will be empty)",
    )
    args = parser.parse_args()

    global MODEL
    MODEL = None if args.no_model else args.model

    import uvicorn

    uvicorn.run(app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()
