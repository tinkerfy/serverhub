"""OpenAI-compatible API wrapper around the MLX LM server.

Translates OpenAI chat.completion requests into /generate calls
against the local MLX server, then formats the response as OpenAI JSON.

Usage:
    python3 mlx_openai_wrapper.py [--mlx-port 8080] [--api-port 1234]
"""

import argparse
import json
import sys
import time
import urllib.request
import urllib.error
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------

MLX_PORT = 8080
API_PORT = 1234


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _call_mlx_generate(prompt: str, max_tokens: int = 512,
                       temperature: float = 0.7, top_p: float = 0.9) -> dict:
    """Call the MLX server /generate endpoint."""
    url = f"http://127.0.0.1:{MLX_PORT}/generate"
    payload = json.dumps({
        "prompt": prompt,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": top_p,
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=300) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _token_count(text: str) -> int:
    """Rough token count."""
    return len(text.split())


# ---------------------------------------------------------------------------
# Response builders
# ---------------------------------------------------------------------------

def _build_openai_response(messages, model: str, max_tokens: int) -> dict:
    """Build an OpenAI chat.completion response from MLX output."""
    # Extract system prompt
    system_msgs = [m for m in messages if m.get("role") == "system"]
    system_text = "\n".join(m["content"] for m in system_msgs)

    # Build user prompt (non-system messages)
    user_msgs = [m for m in messages if m.get("role") != "system"]
    prompt_parts = []
    for m in user_msgs:
        role = m.get("role", "user").capitalize()
        prompt_parts.append(f"{role}: {m['content']}")
    user_prompt = "\n".join(prompt_parts)

    full_prompt = user_prompt
    if system_text:
        full_prompt = f"{system_text}\n\n{user_prompt}"

    # Call MLX server
    result = _call_mlx_generate(
        full_prompt,
        max_tokens=max_tokens,
        temperature=next((m.get("temperature", 0.7) for m in [{}]), 0.7),
        top_p=0.9,
    )

    text = result.get("text", "")
    total_tokens = result.get("total_tokens", 0)

    prompt_tokens = _token_count(full_prompt)
    completion_tokens = total_tokens if total_tokens > 0 else _token_count(text)

    return {
        "id": f"chatcmpl-{int(time.time() * 1000)}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": text},
                "finish_reason": "stop",
            }
        ],
        "usage": {
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": prompt_tokens + completion_tokens,
        },
    }


# ---------------------------------------------------------------------------
# HTTP handler (OpenAI-compatible endpoints)
# ---------------------------------------------------------------------------

class OpenAIHandler(BaseHTTPRequestHandler):
    """Handles OpenAI-compatible API requests, proxies to MLX server."""

    def log_message(self, format, *args):  # noqa: A002
        """Suppress default logging."""
        pass

    def _read_body(self) -> bytes:
        length = int(self.headers.get("Content-Length", 0))
        return self.rfile.read(length)

    def _send_json(self, data: dict, status: int = 200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/health":
            # Proxy health check to MLX server
            try:
                url = f"http://127.0.0.1:{MLX_PORT}/health"
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req, timeout=5) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    data["wrapper"] = "mlx-openai"
                    self._send_json(data)
            except Exception as e:
                self._send_json({"status": "error", "detail": str(e)}, 502)

        elif parsed.path == "/v1/models":
            self._send_json({
                "object": "list",
                "data": [
                    {
                        "id": "mlx/qwen3.6-35b",
                        "object": "model",
                        "created": int(time.time()),
                        "owned_by": "mlx",
                    }
                ],
            })

        else:
            self._send_json(
                {"error": "Not found"}, 404
            )

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/v1/chat/completions":
            try:
                body = json.loads(self._read_body())
                messages = body.get("messages", [])
                model = body.get("model", "mlx/qwen3.6-35b")
                max_tokens = body.get("max_tokens", 512)
                temperature = body.get("temperature", 0.7)
                top_p = body.get("top_p", 0.9)

                # Build prompt for MLX
                system_msgs = [m for m in messages if m.get("role") == "system"]
                system_text = "\n".join(m["content"] for m in system_msgs)

                user_msgs = [m for m in messages if m.get("role") != "system"]
                prompt_parts = []
                for m in user_msgs:
                    role = m.get("role", "user").capitalize()
                    prompt_parts.append(f"{role}: {m['content']}")
                user_prompt = "\n".join(prompt_parts)

                full_prompt = user_prompt
                if system_text:
                    full_prompt = f"{system_text}\n\n{user_prompt}"

                result = _call_mlx_generate(
                    full_prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                )

                text = result.get("text", "")
                total_tokens = result.get("total_tokens", 0)

                prompt_tokens = _token_count(full_prompt)
                completion_tokens = total_tokens if total_tokens > 0 else _token_count(text)

                response = {
                    "id": f"chatcmpl-{int(time.time() * 1000)}",
                    "object": "chat.completion",
                    "created": int(time.time()),
                    "model": model,
                    "choices": [
                        {
                            "index": 0,
                            "message": {"role": "assistant", "content": text},
                            "finish_reason": "stop",
                        }
                    ],
                    "usage": {
                        "prompt_tokens": prompt_tokens,
                        "completion_tokens": completion_tokens,
                        "total_tokens": prompt_tokens + completion_tokens,
                    },
                }
                self._send_json(response)

            except urllib.error.URLError as e:
                self._send_json(
                    {"error": f"MLX server not reachable: {str(e)}"}, 502
                )
            except Exception as e:
                self._send_json(
                    {"error": f"Internal error: {str(e)}"}, 500
                )

        else:
            self._send_json({"error": "Not found"}, 404)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="OpenAI-compatible wrapper for MLX LM server"
    )
    parser.add_argument(
        "--mlx-port", type=int, default=8080,
        help="Port of the running MLX server (default: 8080)",
    )
    parser.add_argument(
        "--api-port", type=int, default=1234,
        help="Port for the OpenAI-compatible API (default: 1234)",
    )
    args = parser.parse_args()

    global MLX_PORT, API_PORT
    MLX_PORT = args.mlx_port
    API_PORT = args.api_port

    server = HTTPServer(("0.0.0.0", API_PORT), OpenAIHandler)
    print(f"OpenAI-compatible API running on http://0.0.0.0:{API_PORT}")
    print(f"  Proxying to MLX server on port {MLX_PORT}")
    print(f"Endpoints:")
    print(f"  POST /v1/chat/completions  — chat completions")
    print(f"  GET  /v1/models            — list models")
    print(f"  GET  /health               — health check")
    print()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.server_close()


if __name__ == "__main__":
    main()
