# CPA Tax Prep Skill

Compiles and organizes all financial documents for a
self-employed individual to send to their CPA.

## Pipeline
initialize → intake → extract → review → package

## Key Patterns
- Parallelism: Named subagents run concurrently
- Resume Support: STATUS markers enable restart
- JSON-First: All data converges to JSON before xlsx
- Flagging: "?" / "ASK CPA:" / "NOTE:" markers
- No Mutation: Source documents are read-only
- Extensibility: Add new doc types with one command
