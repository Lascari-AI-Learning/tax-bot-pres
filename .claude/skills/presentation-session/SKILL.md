---
name: presentation-session
description: Presentation workflow for Slidev. Use when creating new presentations - streamlined SPEC → PLAN → BUILD optimized for linear slide creation.
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Presentation Session

Streamlined workflow for creating presentations: **SPEC → PLAN → BUILD**

## Purpose

A **Presentation Session** guides you through creating a complete presentation:
- **SPEC** - Interview to capture the key idea and constraints
- **PLAN** - File tree storyboard showing each slide
- **BUILD** - Generate slides (full draft or single slide)

## When to Use

Use this skill when:
- Creating a new presentation from scratch
- You have a topic but need to structure your thoughts
- You want a bird's eye view before writing slides
- You need consistent narrative arc across slides

**Don't use this for**:
- Quick single-slide edits (use slidev skill directly)
- Existing presentations that just need tweaks
- Non-Slidev formats (PowerPoint, Google Slides)

## Workflow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   SPEC   │────▶│   PLAN   │────▶│  BUILD   │
│  (WHAT)  │     │  (VIEW)  │     │  (DO)    │
└──────────┘     └──────────┘     └──────────┘
```

### SPEC Phase
Interview to capture presentation essentials:
- **Key Message** - What's the one thing the audience should remember?
- **Audience** - Who are they? What do they already know?
- **Time** - How long is the presentation?
- **Non-Goals** - What are you NOT covering?

→ **Read**: [spec/OVERVIEW.md](spec/OVERVIEW.md)

### PLAN Phase
Output a file tree storyboard - bird's eye view of your presentation:
- Each slide as a numbered folder
- Key content/message per slide
- Optional template hints

→ **Read**: [plan/OVERVIEW.md](plan/OVERVIEW.md)

### BUILD Phase
Two modes available:
- **Full Draft** - Generate entire presentation from storyboard
- **Single Slide** - Iterate on a specific slide

→ **Read**: [build/OVERVIEW.md](build/OVERVIEW.md)

## Commands

| Command | Arguments | Description |
|---------|-----------|-------------|
| `/presentation-session:spec` | `[topic]` | Start new session with topic |
| `/presentation-session:spec` | `[session-id]` | Resume existing session |
| `/presentation-session:spec` | `[session-id] finalize` | Finalize spec, ready for plan |
| `/presentation-session:plan` | `[session-id]` | Create file tree storyboard |
| `/presentation-session:plan` | `[session-id] finalize` | Finalize plan, ready for build |
| `/presentation-session:build` | `[session-id]` | Generate all slides from storyboard |
| `/presentation-session:slide` | `[session-id] [target]` | Work on single slide by name, number, or description |

## Session Directory

Sessions are stored in `agents/sessions/`:

```
agents/sessions/{session-id}/
├── state.json       # Session state and phase tracking
├── spec.md          # Key message, audience, time, constraints
└── storyboard.md    # File tree plan (created in PLAN phase)
```

**Session ID format**: `{YYYY-MM-DD}_{topic-slug}_{6-char-random}`
Example: `2026-02-03_ai-agents-talk_x7k9m2`

## Slide Templates

This skill uses the **slidev** template system for slide generation:

```
slide-templates/
├── title/              # Opening title slides
├── about-me/           # Speaker introduction
├── column-cards/       # Flexible column layouts
├── icon-list-content/  # Sections with icons
├── continuum-diagram/  # Visual spectrums
└── conclusion-*/       # Closing slides with CTAs
```

Templates are referenced in the storyboard with `(template: name)` hints.

→ **Read**: `.claude/skills/slidev/SKILL.md` for template conventions, animation patterns

## Presentation vs Agent Session

| Aspect | presentation-session | agent-session |
|--------|---------------------|---------------|
| **Purpose** | Create slide decks | Build software features |
| **SPEC** | Interview (4 questions) | Requirements document |
| **PLAN** | File tree storyboard | Checkpoints with tasks |
| **BUILD** | Generate slides | Execute tasks with verification |
| **Complexity** | Linear, predictable | Adaptive, iterative |

**Use presentation-session** when creating talks. **Use agent-session** when building code.

## Related Skills

- **slidev** - Template system, animation patterns, slide conventions
- **agent-session** - Full checkpoint-based development workflow
