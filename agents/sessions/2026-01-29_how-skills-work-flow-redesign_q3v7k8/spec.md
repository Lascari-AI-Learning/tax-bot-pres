# Design Updated How Skills Work Flow

> **Session**: `2026-01-29_how-skills-work-flow-redesign_q3v7k8`
> **Status**: Draft
> **Created**: 2026-01-29
> **Prior Session**: `2026-01-29_agent-view-walkthrough-slide_p4w8n3`

## Overview

Redesign the "How Skills Work" slide (currently `slides/13-how-skills-work/index.md`). The current slide uses 8 click-driven scenes with `v-if="$clicks >= N"` to walk through skill creation and a worked example. This spec captures the vision for an updated flow.

### Prior Context

The prior session added both an AgentView walkthrough slide and this How Skills Work slide to the deck. The How Skills Work slide was moved from `to_add/` into `slides/13-how-skills-work/`. It uses manual HTML scenes with absolute positioning for overlays, color-coded borders, and a 3-column grid layout. The current flow is:

1. **Click 1** - Step 1: Create a SKILL.md file (minimum spec)
2. **Click 2** - Step 2: Add Instructions (markdown body)
3. **Click 3** - Step 3: Add Supporting Files (folder structure)
4. **Click 4** - What the Agent Sees at Startup (XML block)
5. **Clicks 5-7** - Worked Example (3 progressive reads)
6. **Click 8** - Trust callout message

## Problem Statement

*What problem are we solving? Why does it matter?*

## Goals

### High-Level Goals

*The north star - what does ultimate success look like? Include WHY this matters.*

### Mid-Level Goals

*Major capabilities or milestones needed to achieve high-level goals. Capture the reasoning behind each.*

### Detailed Goals

*Specific behaviors or features - added as conversation progresses. Note user's preferences and "taste".*

## Non-Goals

*What we are explicitly NOT building - prevents scope creep*

-

## Success Criteria

*How do we know we're done? Testable outcomes*

- [ ]

## Context & Background

*Relevant existing systems, prior art, stakeholder input. Include user's mental model and design philosophy when relevant.*

## Key Decisions

*Capture the WHY behind decisions, not just the WHAT. Include user's reasoning and preferences.*

| Decision | Rationale | Date |
|----------|-----------|------|
|          |           |      |

## Open Questions

- [ ] What specifically feels wrong or needs improvement about the current flow?
- [ ] Should this remain one slide or be split into multiple slides?
- [ ] What's the ideal number of click steps?
- [ ] Should the visual style change?

## Diagrams

*Mermaid or ASCII diagrams as understanding develops*

## Notes

*Working notes, ideas, considerations*

---
*This spec is a living document until finalized.*
