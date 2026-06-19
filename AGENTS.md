<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Quick Start

```bash
npm run dev     # Dev server (port 3000)
npm run build   # Verify nothing is broken
npm run lint    # ESLint
```

## Architecture

- **Next.js 16** (App Router) — e-commerce for pre-owned server equipment
- **PostgreSQL** at `localhost:5432` / user `postgres` / password `postgress` / db `serverhub` (see `drizzle.config.ts`)
- **Drizzle ORM** — schema at `app/db/schema.ts`, repos at `app/db/repositories/`
- **JWT auth** — token stored in `localStorage` (not httpOnly cookie), role-based redirects
- **React Context** for Cart and Auth state (no Redux/Zustand)
- **Tailwind CSS v4** — semantic CSS variables for theming (see `app/globals.css`), use `bg-background`, `text-foreground`, `bg-card`, `border-border`, etc. — never hardcoded colors
- **`@/*` path alias** maps to root (e.g. `@/app/db/schema`)
- **Currency**: Philippine Peso (₱) everywhere
- **Addresses**: Philippines-only with cascading Province → City → Barangay dropdowns (`app/db/ph_regions.ts`)

## Key Entry Points

| Area | Path |
|------|------|
| Root layout | `app/layout.tsx` |
| Landing page | `app/page.tsx` |
| DB connection | `app/db/index.ts` |
| DB schema | `app/db/schema.ts` |
| Auth utils | `app/lib/auth.ts` |
| Email sender | `app/lib/email.ts` |
| Auth context | `app/context/AuthContext.tsx` |
| Cart context | `app/context/CartContext.tsx` |
| Header (in root layout) | `app/components/Header.tsx` |

## Database

```bash
npm run db:generate   # Generate migration files
npm run db:migrate    # Apply migrations
npm run db:push       # Push schema to DB (dev only)
npm run db:seed       # Seed sample data
npm run db:studio     # Open Drizzle Studio
```

## Environment

- `.env.local` required: `DATABASE_URL`, `JWT_SECRET`
- Email (optional): `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_FROM`

## Conventions

- Server actions for all write operations (`app/actions/`)
- API routes for data fetching (`app/api/`)
- Admin pages at `/admin/*` — role-protected, dark-themed sidebar layout
- On admin routes, Header hides nav links and centers the ServerHub logo
- All pages/components must support dark mode via `dark:` variants
- No hardcoded colors — use semantic CSS variables from `globals.css`
- `searchParams` in client components must be unwrapped with `use()` (Next.js 16)

## Context Management

- Update `memory/MEMORY.md` and `plans/PLAN.md` when context reaches 80%
- Run `npm run build` after changes to verify nothing is broken
