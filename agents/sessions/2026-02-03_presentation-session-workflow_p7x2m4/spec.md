# Presentation Session Workflow

> **Session**: `2026-02-03_presentation-session-workflow_p7x2m4`
> **Status**: FINALIZED
> **Created**: 2026-02-03
> **Finalized**: 2026-02-03
> **Prior Context**: `2025-01-07_agent-skills-presentation_k8m3x9`

## Overview

Adapting the agent-session workflow (SPEC → PLAN → BUILD) to be specifically tailored for creating presentations in Slidev or PowerPoint. The prior session successfully used the generic flow to create a full presentation about agent skills, and this session aims to restructure that experience into a specialized, reusable presentation workflow.

### Prior Session Context

The `agent-skills-presentation` session demonstrated:
- Using SPEC phase to brainstorm content, define thesis, capture key decisions
- Using PLAN phase to create detailed slide outline with checkpoints
- Using BUILD phase to generate actual slides checkpoint by checkpoint
- Completed 6 checkpoints producing 14 slides in ~4 hours of build time

## Problem Statement

The generic agent-session workflow is designed for complex coding tasks that need to adapt to anything - services, APIs, unpredictable integrations. Presentations are fundamentally **simpler and more linear**. Once you know what each slide should do, building it is mostly template application.

The current flow is overkill for presentations - we need a streamlined version that:
- Focuses SPEC on understanding the key idea (no research - external data provided manually)
- Outputs PLAN as a visual file tree storyboard
- Simplifies BUILD to two modes: full draft or single slide iteration

## Goals

### High-Level Goals

Create a presentation-specific session workflow that produces a complete slide deck from topic to finished slides, optimized for the linear nature of presentation creation rather than the adaptive nature of code implementation.

### Mid-Level Goals

1. **SPEC phase**: Interview focused purely on understanding the key idea - what is this presentation trying to say? Who's the audience? What's the core message? No research - external data provided manually by user.
2. **PLAN phase**: Go through slide by slide, output a file tree showing each slide and what it should contain. This IS the storyboard.
3. **BUILD phase**: Two modes:
   - **Full draft**: Generate the entire presentation as a first draft
   - **Single slide**: Hone in on a specific slide to iterate/refine

### Detailed Goals

**PLAN file tree format:**
- Pseudo-structured, free-form - not rigidly defined fields
- Primary purpose: bird's eye view of what the presentation is saying
- Each slide folder shows the key content/message for that slide
- Template specification is OPTIONAL (e.g., `template: column-cards`)
- When template is specified, it helps BUILD phase automate; when not, BUILD figures it out

**SPEC core questions (guide, not rigid):**
- What's the one thing you want the audience to remember?
- Who is the audience?
- How much time do you have?
- What are you explicitly NOT covering?
- (Flow naturally, adapt based on conversation)

**BUILD single slide invocation:**
- By folder name: `/build 03-the-question`
- By slide number: `/build slide 3`
- Conversational: "let's work on the problem slide" → BUILD resolves which slide
- Always reads spec/plan doc first for context - understands overall narrative even when working on one slide

## Non-Goals

- Not reimagining the session flow - just adapting it for presentations
- Not adding complexity beyond what's needed for the three phases

## Success Criteria

- [ ] SPEC phase captures the key idea through pseudo-structured interview
- [ ] PLAN phase outputs a readable file tree storyboard
- [ ] BUILD full draft mode generates all slides from the storyboard
- [ ] BUILD single slide mode can target a specific slide (by name, number, or description)

## Context & Background

*Relevant existing systems, prior art, stakeholder input. Include user's mental model and design philosophy when relevant.*

### Existing Agent-Session Structure

```
SPEC (WHAT) → PLAN (HOW) → BUILD (DO)
```

- **Spec Phase**: Interview-driven exploration of requirements
- **Plan Phase**: Checkpoint-based implementation planning
- **Build Phase**: Execute checkpoints with verification

### Slidev Template System (Current)

- Templates in `slide-templates/` with `slide.md`, `description.md`, `preview.png`
- Slide generation via `npm run generate:slide`
- Slide folders numbered for ordering (e.g., `01-about-me/`)
- Build script auto-generates `index.md` from slide folders

## Key Decisions

*Capture the WHY behind decisions, not just the WHAT. Include user's reasoning and preferences.*

| Decision | Rationale | Date |
|----------|-----------|------|
| Simplify workflow to match presentation linearity | Presentations are more predictable than code - once you know what each slide should do, it's mostly template application. Generic agent-session is overkill. | 2026-02-03 |
| No research capabilities in SPEC | Keep it simple - SPEC just captures the key idea. External data/reports provided manually by user when needed. | 2026-02-03 |
| PLAN is pseudo-structured free-form file tree | Primary purpose is bird's eye view of what you're saying. Template specification is optional - helps BUILD but not required. | 2026-02-03 |
| Slidev only | No PowerPoint support - this is built for the Slidev template system in this repo. | 2026-02-03 |
| Two BUILD modes: full draft and single slide | Full draft generates entire presentation at once. Single slide mode for iterating on specific slides. | 2026-02-03 |
| SPEC questions are pseudo-structured | Core questions as guide (audience, takeaway, time, non-goals) but flows naturally, not hyper-rigid. | 2026-02-03 |

## Open Questions

- [x] What specific pain points did you encounter using the generic agent-session flow for presentations? → Too complex; presentations are linear, not adaptive like code
- [x] What presentation-specific phases or stages would replace or augment SPEC/PLAN/BUILD? → Same phases, but optimized: SPEC=understand idea, PLAN=file tree outline, BUILD=template application
- [x] What research capabilities should SPEC have? → None - cut research. External data provided manually by user.
- [x] What's the exact file tree format for PLAN output? → Pseudo-structured free-form file tree. Bird's eye view of what you're saying. Template is OPTIONAL (helps BUILD but not required).
- [x] Should this support both Slidev and PowerPoint, or focus on Slidev? → Slidev only.
- [x] How does BUILD work? → Two modes: (1) Full draft - generate entire presentation, (2) Single slide - hone in on a specific slide
- [x] For single slide mode, how does the user specify which slide? → All three: (1) folder name `03-the-question`, (2) slide number `slide 3`, (3) conversational description
- [x] Does single slide mode need context from the PLAN? → Yes - reads spec/plan doc to understand overall flow and narrative, even when working on one slide
- [x] What specific questions should SPEC ask? → Pseudo-structured. Core questions as guide, but flows naturally. Not hyper-rigid.

## Diagrams

```
Presentation Session Flow
─────────────────────────

┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      SPEC       │     │      PLAN       │     │      BUILD      │
│   (Interview)   │────▶│  (Storyboard)   │────▶│                 │
│                 │     │                 │     │  ┌───────────┐  │
│ • Key idea      │     │ • File tree     │     │  │Full Draft │  │
│ • Audience      │     │ • Slide-by-slide│     │  └───────────┘  │
│ • Time          │     │ • Optional      │     │        or       │
│ • Non-goals     │     │   template hints│     │  ┌───────────┐  │
│                 │     │                 │     │  │Single Slide│  │
└─────────────────┘     └─────────────────┘     │  └───────────┘  │
                                                └─────────────────┘
```

## Notes

- Replicating the agent-session flow, simplified for presentations
- Presentations are linear - once you know what each slide does, it's template application
- Keep it simple: interview → storyboard → build

---
*Spec finalized on 2026-02-03. Ready for `/plan` phase.*
