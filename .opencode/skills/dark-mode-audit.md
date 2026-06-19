# Dark Mode Audit Skill

## Purpose
Check every page and component for dark mode compliance — no hardcoded colors without `dark:` variants.

## When to Use
- Before merging UI changes
- After adding new pages or components
- When `npm run build` passes but visual dark mode looks broken
- Run `dark-audit` to invoke

## How to Audit

### Step 1: Find violations
Search all `.tsx` and `.ts` files in `app/` for hardcoded Tailwind color classes that lack dark mode support:

```
bg-gray-*, bg-white, bg-black, bg-blue-*, bg-red-*, bg-green-*, bg-yellow-*, bg-purple-*, bg-indigo-*, bg-pink-*, bg-orange-*, bg-teal-*, bg-cyan-*, bg-lime-*, bg-emerald-*
text-gray-*, text-white, text-black, text-blue-*, text-red-*, text-green-*, text-yellow-*, text-purple-*, text-indigo-*, text-pink-*, text-orange-*, text-teal-*, text-cyan-*, text-lime-*, text-emerald-*
border-gray-*, border-white, border-black, border-blue-*, border-red-*, border-green-*
```

Also check for:
- `bg-opacity-*` without dark equivalent
- `shadow-lg`, `shadow-md` on colored backgrounds (may need dark variants)
- Inline `style={{ color: ... }}` or `style={{ backgroundColor: ... }}` with hardcoded values

### Step 2: Verify allowed patterns
These are OK without `dark:` variants:
- `bg-background`, `bg-card`, `bg-muted`, `bg-primary`, `bg-success`, `bg-warning`, `bg-error`, `bg-info` — semantic tokens
- `text-foreground`, `text-muted-foreground`, `text-primary`, `text-success`, `text-warning`, `text-error`, `text-info` — semantic tokens
- `border-border` — semantic token
- `ring-primary` — semantic token
- Classes inside `dark:` conditional blocks (e.g., `className={isDark ? 'bg-gray-900' : 'bg-white'}`)
- SVG `fill` / `stroke` attributes (handled separately)

### Step 3: Check each file
For every violation found, verify:
1. There is a corresponding `dark:` variant (e.g., `bg-gray-50 dark:bg-gray-900`)
2. If no dark variant exists, flag it as an issue
3. Note the line number and file path

### Step 4: Check globals.css
Verify `app/globals.css` has complete light/dark values for all CSS variables:
- `--background`, `--foreground`, `--primary`, `--primary-dark`, `--primary-foreground`
- `--card`, `--card-foreground`
- `--muted`, `--muted-foreground`
- `--border`, `--ring`
- `--success`, `--success-background`, `--success-foreground`
- `--warning`, `--warning-background`, `--warning-foreground`
- `--error`, `--error-background`, `--error-foreground`
- `--info`, `--info-background`, `--info-foreground`
- `--purple`, `--purple-background`, `--purple-foreground`
- `--footer`, `--footer-foreground`

### Step 5: Check ThemeProvider
Verify `app/components/ThemeProvider.tsx` wraps the root layout and uses `next-themes` with:
- `defaultTheme="system"`
- `enableSystem`
- `attribute="class"`

## Output Format

```markdown
# Dark Mode Audit Report

## Summary
- Total files checked: N
- Files with violations: N
- Total violations: N

## Violations by File

### app/path/to/file.tsx
| Line | Class | Issue | Fix |
|------|-------|-------|-----|
| 42 | `bg-gray-50` | No dark: variant | Add `dark:bg-gray-900` |
| 88 | `text-white` | No dark: variant | Use `text-card-foreground` or add `dark:text-gray-100` |

## Missing CSS Variables
- `--purple-background` — referenced but not defined in globals.css

## Recommendations
1. [Priority action]
2. [Priority action]
```

## Rules
- Never skip files — check every `.tsx` and `.ts` in `app/`
- Be specific: report exact line numbers and class names
- When suggesting fixes, prefer semantic tokens over hardcoded dark colors
- If a class is conditionally dark (e.g., via `dark:`), it's compliant
- Report false positives only if the class is inside a `dark:` block or SVG
