# Tax Prep

> **Session**: `2026-03-13_tax-prep_ox5g4c`
> **Status**: Finalized
> **Created**: 2026-03-13

## Overview

YouTube video presentation about a tax preparation agent built with Claude Code. The video demonstrates a system that takes a small business owner's bank statements and financial documents, processes them through a multi-phase pipeline (Intake → Extract → Review → Package), and produces a clean 8-tab spreadsheet + CPA summary document — reducing hours of manual organizing and weeks of CPA back-and-forth to ~30 minutes of involvement.

The video has multiple execution formats: talking head segments, screen recordings/demos, and presentation slides. The Slidev presentation covers the slide-based portions.

## Problem Statement

Small business owners, freelancers, and sole proprietors face a painful annual tax prep process: manually digging through bank statements, organizing expenses, and enduring weeks of back-and-forth with their CPA. Existing tools either charge high monthly fees or don't handle edge cases (e.g., mixed personal/business spending, home office deductions from Venmo rent payments). Ford built a Claude Code-based agent to solve this.

## Goals

### High-Level Goals

- Create Slidev presentation slides that support the YouTube video's slide-based segments
- Slides should clearly communicate the system's architecture, value proposition, and workflow

### Mid-Level Goals

- **"Why It Matters"** — single slide. Core message: existing tools don't capture the nuance of your specific situation, and that nuance is what gets you the most money back
- **"How It Works — Architecture"** slides — the 4-phase pipeline (Intake, Extract, Review, Package) with architecture diagrams and file structure visuals
- **"Why This Is Different / Key Results"** — single slide. Key points: adaptable to your changing situation year-over-year, no extra cost (uses existing Claude subscription), massive time savings (30 min vs hours + weeks of back-and-forth). Template selection deferred to plan phase.

### Detailed Goals

#### "Why It Matters" Slide
Single slide — most of the detail lives in the speaker notes / voiceover. The slide itself should land the core message visually:

- **The problem**: Maximizing your tax situation requires capturing nuance — mixed personal/business accounts, payments through unexpected channels (Venmo rent from personal account = home office deduction), services paid from the "wrong" account. Existing tools handle general categorization fine but miss the specific, situational deductions that actually save you money.
- **The CPA angle**: Your CPA is juggling tons of clients. The better organized and more complete the package you hand them, the more they can do for you. If deductions aren't surfaced and documented, they get missed — and that costs you money.
- **The takeaway**: This system captures YOUR nuance — your accounts, your edge cases, your specific situation — and packages it so nothing falls through the cracks.

**Visual approach**: Use the **three-to-one-takeaway** template (see `slides/07-three-to-one-takeaway/`). Three pain point cards click in one at a time, then the takeaway card lands the core message:

- Card 1: Pain — existing tools handle general categorization but miss situational deductions
- Card 2: Pain — multiple accounts, mixed personal/business, payments through unexpected channels
- Card 3: Pain — CPAs juggling tons of clients, whatever you don't surface gets missed
- **Takeaway**: None of this fits YOUR exact life, YOUR exact scenario — this system gives you a bespoke, customized experience

This ties directly into Ford's core brand message: "Built for everyone. Built for no one." Generic tools handle the general case but miss the nuance that actually saves you money. The takeaway isn't just about taxes — it's about the principle that bespoke AI systems built around YOUR specific life will always outperform one-size-fits-all tools. This is the exact "villain → hero → guide → victory" arc from the brand strategy, applied to tax prep.

#### Architecture Section Flow
The architecture slides should feel like a progressive walkthrough of the file directory — the viewer watches data materialize through the folder structure as each phase runs. The narrative is:

1. **System Overview** — Show the `.claude/` directory with the agents and commands. "These are the agents, these are the commands." Establishes that this is a Claude Code skill-based system.
2. **Initialize** — Sets up the empty folder scaffold. Show the directory structure it creates. "You drop your documents in here."
3. **Intake** — The agent interviews you, updating one file (`intake.md`). Show the directory with intake.md now populated. The agent pre-reads the docs you dropped in.
4. **Extract** — Parallel subagents fire off, writing extraction files into the directory. Show extractions/ filling up, then raw/ aggregated files appearing. Visualize the flow of data within the file directory.
5. **Review** — Human confirms, final/ directory appears with reviewed copies.
6. **Package** — Output materializes: JSON sections → merged JSON → xlsx + summary. Show final output/ directory.

The key narrative device: **the file directory IS the visualization of data flow**. Each phase adds to it, and the viewer can see the pipeline's progress by watching the folder grow. This is more concrete than abstract flowcharts — you're showing what actually exists on disk.

#### Phase Slide Layout
Each phase slide combines existing Slidev components to simulate the real experience of running the system:

- **Terminal component** — shows the slash command being run (e.g., `/cpa-tax-prep:intake 2025`), then the agent's output / questions / process
- **FileExplorer component** — shows the file directory at this stage, so the viewer sees what gets created
- **AgentView component** (where applicable) — for showing the agent thinking, reading files, asking questions in the conversational loop phases

The key insight: since this system runs in the terminal, the slides should feel like watching someone use it. You see the command run, the agent doing its thing, and the resulting file structure. For the parallel subagent phases (Extract, Package), the terminal/agent view shows the orchestration while the file explorer shows the output materializing.

#### Diagram Complexity Per Phase
Not every phase needs a full agent diagram on the right side — some are simpler interactions:
- **Initialize**: No diagram — file tree only with heading. Just shows the scaffold it creates.
- **Intake**: Simple **loop diagram** — read source docs → ask question → user confirms → update intake.md → repeat. Shows the conversational cycle.
- **Extract**: **HEAVY diagram** — orchestrator spawning parallel `tax-extract` subagents, one per PDF, all running simultaneously. This is the key visual for showing parallel processing.
- **Review**: Simple **loop diagram** — same pattern as Intake: read section → present to user → user confirms/corrects → update final/ file → repeat. Reuses the loop concept so viewer recognizes the pattern.
- **Package**: **HEAVY diagram** — parallel `tax-package` subagents → section JSONs → merge_sections.py → build_xlsx.py → validate_xlsx.py pipeline. Shows both parallelism and deterministic assembly.

Intake and Review share the same loop pattern (read → ask → update → repeat), which is a nice visual echo. Extract and Package are where the parallel subagent diagrams show the real architectural complexity.

#### Available Slide Components
The project already has these Vue components we can leverage:
- **Terminal** — animated command typing with output, click-to-advance (see `slides/11-terminal-demo/`)
- **AgentView** — step-by-step agent walkthrough with thoughts, file reads, tool calls, results (see `slides/12-agent-walkthrough/`)
- **FileExplorer** — interactive file tree viewer (see `slides/08-file-explorer/`)
- These can be combined on a single slide (e.g., Terminal on left, FileExplorer on right) to simulate the real experience

## Non-Goals

- No slides for talking head segments (Hook, Intro, Skip-Ahead, Close)
- No slides for screen recording segments (Output Flash, System Walkthrough)
- No standalone title or conclusion slides for this presentation
- Not building a full standalone deck — these slides support specific video segments only

## Success Criteria

- [ ] "Why It Matters" slide uses three-to-one-takeaway template and lands the bespoke > generic message
- [ ] System Overview slide shows actual `.claude/` directory with cpa-tax-prep agents, commands, and skill
- [ ] Each phase slide (Initialize → Intake → Extract → Review → Package) shows Terminal + FileExplorer with progressive directory growth
- [ ] Extract and Package slides have parallel subagent diagrams
- [ ] Intake and Review slides have loop diagrams
- [ ] "Key Results" slide communicates adaptability, low cost, and time savings
- [ ] All slides use existing project conventions (Tailwind, bordered cards, Title Case, no light grey text)
- [ ] Slides render correctly in `npm run dev`

## Context & Background

### Video Context
- This is a YouTube video, not a standalone presentation — slides support specific segments
- The video uses multiple formats: talking head, screen recording, and presentation/slides
- Slide-based segments: "Why It Matters", "How It Works — Architecture", "Why This Is Different / Key Results"
- Ford is an AI engineer who builds AI systems for startups and real-life use cases

### Brand & Audience Context (from `ai_docs/profiles/`)
- **Core brand mission**: "Rewire how people relate to AI — from passive consumers renting generic tools to active architects building bespoke systems woven into their actual lives."
- **Key philosophy**: "If you don't own your AI, AI will own you." / "Built for everyone. Built for no one." / "Own the build, own the outcome."
- **Target avatar**: "The Stuck Engineer" — mid-career software engineer, technically strong, knows AI is reshaping his field but can't find a credible path from "strong engineer" to "strong engineer who builds with AI"
- **Content structure**: Pain → Reveal → Build → Takeaway
- **Core tension**: The bottleneck isn't the technology — it's understanding. Bespoke > generic.
- **Sign-off**: "Own the build, own the outcome."
- This tax prep video is a proof-of-concept for the brand philosophy — it demonstrates building a bespoke AI system for a real life problem, showing that customization to YOUR specific situation is what makes AI actually valuable

### Source System Reference
- Full system lives at `references/tax-prep` (symlinked to Life-Agents/tax-prep)
- `ARCHITECTURE.md` — detailed ASCII diagrams of all 4 phases + data lineage
- `README.md` — user-facing docs with folder structures, expense categories, 8-tab spreadsheet breakdown

### Actual `.claude/` Directory Structure (for System Overview slide)
```
.claude/
├── settings.json
├── agents/
│   ├── tax-extract.md          ← Subagent: extracts ONE source doc (model: sonnet)
│   └── tax-package.md          ← Subagent: packages ONE finalized file to JSON (model: sonnet)
├── commands/
│   └── cpa-tax-prep/
│       ├── initialize.md       ← Phase 0: creates folder scaffold
│       ├── intake.md           ← Phase 1: 9-section interview
│       ├── extract.md          ← Phase 2: parallel extraction
│       ├── review.md           ← Phase 3: human-in-the-loop review
│       ├── package.md          ← Phase 4: parallel assembly → xlsx + summary
│       └── add-vertical.md     ← Utility: add new document types
└── skills/
    ├── cpa-tax-prep/
    │   ├── SKILL.md
    │   ├── references/         ← 7 docs (schemas, instructions, templates, checklists)
    │   └── scripts/            ← 4 Python scripts (init, merge, build_xlsx, validate)
    ├── pdf/                    ← (exists but not shown in detail on slide)
    └── xlsx/                   ← (exists but not shown in detail on slide)
```

### System Details (from references)
- **5 commands** run in order: initialize → intake → extract → review → package
- **Intake**: 9-section conversational interview, agent pre-reads source docs, STATUS markers for resume
- **Extract**: Parallel `tax-extract` subagents (one per PDF), YAML front matter on each extraction, aggregation into raw/ category files
- **Review**: Section-by-section human confirmation, flagging system ("?" = uncertain, "ASK CPA:" = needs pro input, "NOTE:" = informational)
- **Package**: Parallel `tax-package` subagents → section JSONs → merge_sections.py → build_xlsx.py → validate_xlsx.py → final output
- **8 spreadsheet tabs**: Summary, Income, Business Expenses, Personal Deductions, Home Office, Estimated Taxes, Health Insurance, Retirement
- **Key patterns**: Parallelism, Resume Support, JSON-First, Flagging, No Mutation, Extensibility
- **Data lineage**: source PDFs → extractions/*.md → raw/*.md → final/*.md → output/sections/*.json → tax_data.json → xlsx + summary

### File Structure Evolution
Ford wants to show the file structure at each phase — this is central to understanding the architecture. The folder grows as data flows through the pipeline:
- Phase 0 (Initialize): scaffold with source-documents/ folders + empty intake.md
- Phase 1 (Intake): populated intake.md with all 9 sections complete
- Phase 2 (Extract): extractions/ per-file outputs + raw/ aggregated category files
- Phase 3 (Review): final/ confirmed copies with corrections applied
- Phase 4 (Package): output/ with sections/*.json, tax_data.json, xlsx, summary

## Key Decisions

*Capture the WHY behind decisions, not just the WHAT. Include user's reasoning and preferences.*

| Decision | Rationale | Date |
|----------|-----------|------|

## Resolved Questions

- **Slide scope**: 3 sections — Why It Matters, Architecture, Key Results
- **Diagram approach**: CSS/HTML, not Mermaid (Ford doesn't like Mermaid's look)
- **Source material**: ARCHITECTURE.md + README.md from actual system, full `.claude/` tree
- **File structure presentation**: Progressive walkthrough — directory IS the data flow visualization
- **Components**: Terminal + FileExplorer + AgentView (existing Vue components)
- **System overview**: Show actual `.claude/` file names, only cpa-tax-prep in detail (pdf/xlsx just listed)

## Deferred to Plan Phase

- Template selection for "Key Results" slide
- Exact slide count and ordering
- Detailed component configuration per slide
- Whether any slides need v-click animations or are static

## Notes

- Script outline is in `context/outline.md`
- Brand profiles are in `ai_docs/profiles/` (About Me, Core Avatar, Propaganda Strategy)
- The "Architecture" section calls for specific diagrams at each phase plus a full data lineage diagram
- Video sign-off: "Own the build, own the outcome."

---
> **Finalized**: 2026-03-13
