# Spec: Add Agent View / Walkthrough Slide

> **FINALIZED** — 2026-01-29

**Session ID**: `2026-01-29_agent-view-walkthrough-slide_p4w8n3`
**Date**: 2026-01-29
**Status**: Finalized

## Overview

Create a slide that uses the existing `AgentView.vue` component to showcase an AI agent "mind walkthrough" — showing the step-by-step reasoning, tool calls, and file operations an agent performs. Also move the existing "How Skills Work" slide into the presentation as a separate slide. This gives the user two slides to compare: one using the AgentView component, one using the manual HTML scene pattern — both telling the same skills/PDF extraction story.

## Context

### Existing Assets
- **AgentView.vue** component exists in `to_add/agent_view/AgentView.vue` — to be moved to `components/`
- Component supports event types: `user`, `thought`, `tool-call`, `tool-result`, `assistant`, `status`, `files-explored`, `files-edited`, `files-read`
- Has `stepByStep` mode using Slidev's `v-click` for progressive reveal
- Supports a query input area and scrollable content area (dark terminal aesthetic)
- Uses `markdown-it` for rendering markdown content within events
- An existing slide `08-how-skills-work.md` in `to_add/` walks through skills using manual HTML scenes with `v-if="$clicks >= N"` pattern

### Nature of this Slide
- "Pseudo-template" — something reused by sampling/adapting rather than strict generation
- Agent mind walkthroughs are niche but very effective when used
- Think of it as a "recipe" or "reference slide" more than a template

### Strategic Purpose
- This slide serves as a **visual prototype** — user hasn't seen AgentView rendered and wants to evaluate it
- Having both the AgentView slide AND the How Skills Work slide in the deck lets the user compare approaches
- Getting this working first lets the user plan out more complex slide layouts with confidence

## High-Level Goals

1. Move the AgentView component into `components/` as a first-class Slidev component
2. Create a new slide using AgentView with the PDF extraction skills scenario
3. Move the existing "How Skills Work" slide from `to_add/` into the slide deck as its own numbered slide
4. Give the user two reference slides showing the same story told two different ways

## Mid-Level Goals

1. Move `to_add/agent_view/AgentView.vue` → `components/AgentView/AgentView.vue`
2. Create a new numbered slide folder (e.g., `12-agent-walkthrough/index.md`) that imports and uses the AgentView component
3. Populate the AgentView with skills-themed events:
   - User query: "Extract tables from invoice.pdf"
   - Agent thought: recognizing the pdf-processing skill
   - Tool call: Read `.claude/skills/pdf-processing/SKILL.md`
   - Tool result: SKILL.md contents
   - Tool call: Read `references/advanced-extraction.md`
   - Tool result: extraction instructions
   - Tool call: Bash `python scripts/extract.py invoice.pdf`
   - Tool result: extraction output
   - Assistant: summary of extracted tables
4. Move `to_add/08-how-skills-work.md` → a new slide folder (e.g., `13-how-skills-work/index.md`), adapting the frontmatter
5. Run `npm run build:slides` to regenerate index.md

## Requirements

### AgentView Component
- Must work within Slidev's component auto-import system
- The `stepByStep` v-click integration must work with Slidev's click navigation
- Component needs `markdown-it` as a dependency (check if already installed)

### Agent Walkthrough Slide
- Uses the skills/PDF extraction scenario for direct comparison
- Should use `stepByStep: true` so each event reveals on click
- Events should cover multiple event types (thought, tool-call, tool-result, assistant, files-read)

### How Skills Work Slide
- Needs frontmatter `theme: ../` path adjusted for new location in `slides/` directory
- All `v-if` / `v-click` logic should work as-is

## Scope

### In Scope
- Moving AgentView component to `components/`
- Creating an agent walkthrough demo slide with skills scenario
- Moving How Skills Work slide into the deck
- Ensuring both slides render correctly in Slidev

### Out of Scope
- Redesigning the AgentView component itself (evaluate first, modify later)
- Creating a formal `slide-templates/` entry for agent-view
- Reworking the How Skills Work content into AgentView format (future task)
- Modifying the AgentView styling or behavior

## Key Decisions

1. **Not a strict template** — Reference implementation, meant to be copied and adapted.
2. **Compare side by side** — Both slides in the deck using the same skills story, different visual approaches.
3. **Move component to components/** — AgentView becomes a first-class component alongside FileTree, Terminal, etc.
4. **Skills scenario** — Same PDF extraction story as How Skills Work, enabling direct visual comparison.
5. **Layout TBD** — User hasn't seen AgentView rendered yet; layout decisions deferred until visual evaluation.
