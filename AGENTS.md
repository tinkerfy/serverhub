<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Context Management Rules

- **Update MEMORY and PLAN files** when context length reaches 80% of maximum
- Always keep `memory/MEMORY.md` and `plans/PLAN.md` in sync with current project state
- After completing any phase or major task, update these files with:
  - New milestones completed
  - Current issues or blockers
  - Next steps
  - Architecture changes
- Run `npm run build` after changes to verify nothing is broken
