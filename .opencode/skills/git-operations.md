# Git Operations Skill

## Purpose
Enforce consistent git practices for the ServerHub project.

## Commit Conventions (enforced)

Use Conventional Commits format:

| Prefix | When | Example |
|--------|------|---------|
| `feat:` | New feature | `feat: add dark mode toggle` |
| `fix:` | Bug fix | `fix: handle empty cart in checkout` |
| `refactor:` | Code restructuring, no behavior change | `refactor: extract StoreInfo component` |
| `style:` | Formatting, linting, no logic change | `style: replace hardcoded colors with semantic tokens` |
| `chore:` | Build, deps, config, scripts | `chore: update AGENTS.md` |
| `docs:` | Documentation only | `docs: add dark mode audit skill` |
| `test:` | Tests (none currently) | — |
| `db:` | Schema changes, migrations | `db: add settings table migration` |
| `ui:` | Visual/UI changes | `ui: update hero section text` |

## Commit Message Rules

1. **Format**: `type: summary` — one line
2. **Summary**: 1-2 sentences max, imperative mood ("add" not "added")
3. **Body** (optional): only if the change needs context beyond the summary
4. **No period** at end of summary line
5. **Wrap body** at 72 characters

### Good Examples
```
feat: add SettingsContext for dynamic store config

- Create SettingsContext to fetch store info from API
- Replace hardcoded contact details in contact and quote pages
- Wire cart totals to use dynamic tax rate and shipping threshold
```

```
fix: settings table not in database

The table existed in migrations but was never applied.
Created it directly and updated the drizzle journal.
```

### Bad Examples
```
fix stuff
update
wip
fix: updated the settings context and stuff
```

## Migration Safety

Before committing, always check:

```bash
npm run db:generate  # Will show "No schema changes" if clean
```

If migration files were generated, **commit them separately** with `db:` prefix:
```
db: generate migration for settings table
```

Never mix migration files with feature/fix commits.

## Pre-Commit Checklist

Before committing, run:

```bash
npm run build   # Must pass
npm run lint    # Must pass
```

If either fails, fix the errors before committing.

## .env.local Protection

- Never commit `.env.local`
- If `.env` files appear in `git status`, add them to `.gitignore`
- Document required env vars in `AGENTS.md` instead

## Branch Naming (suggested)

When creating branches, use:

```
<type>/<short-description>
```

Examples:
- `feat/dark-mode-audit`
- `fix/settings-table`
- `refactor/cart-totals`
- `docs/agents-md`

## Workflow

1. **Inspect changes**: `git diff --stat` to see what's being changed
2. **Run checks**: `npm run build && npm run lint`
3. **Stage**: `git add <files>` — stage related files together
4. **Write commit**: Use the format above, summarize in 1-2 sentences
5. **Verify**: `git log -1` to confirm the message

## Agent Behavior

When committing, the agent should:
1. Run `git diff --stat` to understand the scope
2. Run `npm run build && npm run lint` to verify
3. Categorize the change (feat/fix/refactor/style/chore/docs/db/ui)
4. Write a concise 1-line summary or short body if needed
5. Stage files logically (group by concern)
6. Commit with the message
7. If migrations were generated, commit them separately first
