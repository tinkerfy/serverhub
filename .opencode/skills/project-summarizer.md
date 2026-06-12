# Project Summarizer Skill

## Purpose
Summarize project changes, milestones, and issues for the ServerHub project.

## When to Use
- After completing a phase or significant task
- When requested to provide a project status update
- Before deployment or major releases
- When onboarding new team members

## Reference Files
Always read these files first:
- `memory/MEMORY.md` - Main project memory and context
- `plans/PLAN.md` - Master plan overview
- `plans/phase*.md` - Individual phase plans

## Output Format

### Project Summary Template
```markdown
# Project Status: [Date]

## Recent Changes
- [File/Component]: [What changed]
- [File/Component]: [What changed]

## Milestones Achieved
### Phase [N]: [Phase Name]
- [ ] Task 1: [Status]
- [ ] Task 2: [Status]
- [ ] Task 3: [Status]

## Current Phase
**Phase [N]**: [Phase Name]
- Progress: [X]% complete
- Next: [Next task to work on]

## Issues & Blockers
- [Issue description] - [Status/Resolution]

## Next Steps
1. [Action item]
2. [Action item]
```

## Change Tracking
When updating MEMORY.md after work:
1. Add entry to "Recent Changes" section with date
2. Update milestone status in relevant phase
3. Note any new issues or blockers
4. Update current phase progress

## Commands
- `summarize` - Generate full project summary
- `status` - Quick status of current phase
- `milestones` - List all milestones and completion status
- `issues` - List all known issues and their status

## Rules
- Always reference MEMORY.md as source of truth
- Be concise - focus on actionable information
- Update MEMORY.md after each session
- Track both completed and in-progress work
- Note any deviations from the plan
