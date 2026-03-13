# Expand Animations with Detailed v-clicks

> **Session**: `2026-01-29_expand-animations-vclicks_yfpe74`
> **Status**: ✅ Finalized (2026-01-29)
> **Created**: 2026-01-29

## Overview

Improve slide animations by replacing unreliable `v-click` / `v-click.hide` directives with `$clicks`-based `v-if` expressions across ALL slides. This addresses a known Slidev hydration issue where v-click directives may not properly apply their hidden state on initial page load.

This is a **two-part effort**:
1. **Migrate all existing slides** from v-click directives to `$clicks`-based `v-if` patterns
2. **Update the Slidev skill** (`.claude/skills/slidev/SKILL.md`) with animation pattern guidance so the system understands WHEN to use which pattern and HOW to implement them safely

**Reference implementation**: `to_add/08-how-skills-work.md` — uses the "scene" pattern with `v-if="$clicks >= N && $clicks < M"` for sequential content that replaces itself at each click step.

## Problem Statement

Slidev's `v-click` directives can fail to properly apply their hidden state on initial page load before the click system fully hydrates. This causes content to flash or appear incorrectly. The `$clicks` reactive variable (`v-if="$clicks >= N && $clicks < M"`) is always accurate and avoids this issue.

Beyond reliability, the `$clicks`-based approach enables more sophisticated animation patterns like the "scene" pattern (where content replaces itself) used in the How Skills Work slide.

The continuum diagram slides (04, 06) are the most problematic — they use complex sequenced reveals with `v-click at="N"` and reactive opacity that frequently exhibit hydration issues.

## Goals

### High-Level Goals

- **Reliable animations**: Every slide's click-driven animations work correctly on initial load, every time — no hydration flashing
- **System-level knowledge**: The Slidev skill teaches the system the different `$clicks` patterns and when to use each one

### Mid-Level Goals

- Migrate all 6 slides currently using `v-click`/`v-clicks` to use `$clicks`-based `v-if`
- Update slide templates in `slide-templates/` to use `$clicks` pattern in their `slide.md` and `example.md`
- Add animation pattern reference to the Slidev skill (`.claude/skills/slidev/SKILL.md` or a new `references/animation-patterns.md`)
- Document **when to use which pattern** (additive vs. scene replacement vs. reactive styling) based on the use case

### Detailed Goals

- **Additive reveals** (`v-if="$clicks >= N"`) — use for simple sequential content that should accumulate on screen (e.g., column cards, icon lists, bullet points)
- **Scene replacement** (`v-if="$clicks >= N && $clicks < M"`) — use for complex slides where content needs to hide/replace (e.g., continuum diagrams, multi-step walkthroughs like "How Skills Work")
- **Reactive styling** (`:class="{ 'opacity-40': $clicks >= N }"`) — use for elements that need to visually de-emphasize but stay visible (e.g., fading out extremes when middle ground appears)
- The system should understand these patterns and choose the right one based on the slide's needs

## Non-Goals

- Not redesigning slide content or layout — just fixing the animation mechanism
- Not adding new animation types beyond what Slidev supports
- Not updating CLAUDE.md directly — animation guidance lives in the Slidev skill

## Success Criteria

- [ ] All slides use `$clicks`-based `v-if` instead of `v-click` directives
- [ ] Slide templates use `$clicks` pattern in their template/example files
- [ ] Slidev skill includes animation pattern guidance with all three patterns documented
- [ ] Continuum diagram slides work reliably on first load
- [ ] Pattern selection guidance explains WHEN to use each pattern

## Context & Background

### Slides Requiring Migration
1. **01-column-cards** — uses `<v-clicks>` to wrap three card divs for sequential reveal → **additive pattern**
2. **03-icon-list-content** — uses `<v-click>` for section reveals (2nd and 3rd sections) → **additive pattern**
3. **04-continuum-diagram** — uses `<v-click at="N">` for sequenced reveals → **scene or reactive pattern** (most problematic)
4. **05-extremes-to-middle** — uses `<v-click>` for progressive content reveal (2 sections) → **additive pattern**
5. **06-continuum-middle-ground** — uses `<v-click at="N">` + `$slidev.nav.clicks` reactive opacity → **scene + reactive pattern** (most problematic)
6. **07-three-to-one-takeaway** — uses `<v-clicks>` + `<v-click>` for card + takeaway reveals → **additive pattern**

### Slidev Skill Location
Animation pattern guidance will be added to the existing Slidev skill at `.claude/skills/slidev/`:
- Currently has: SKILL.md, references/playwright-workflow.md, references/templates.md
- Will add: animation pattern documentation (either in SKILL.md or as `references/animation-patterns.md`)

### Reference: "How Skills Work" Slide Pattern
The `to_add/08-how-skills-work.md` slide demonstrates the ideal scene replacement pattern:
- Frontmatter declares `clicks: 8` (total click count)
- Uses `v-if="$clicks >= N && $clicks < M"` for "scene" transitions
- Content is absolutely positioned within a relative container so scenes replace each other
- Last scene uses `v-if="$clicks >= 7"` (no upper bound) to persist
- Final element uses `v-click="8"` for a simple reveal (mixing is acceptable for simple cases)

### Four Animation Patterns
1. **Additive Reveal**: `v-if="$clicks >= N"` — content appears at click N and stays forever. Good for building up content in standalone sections or vertical stacks.
2. **Layout-Preserving Reveal**: `:class="$clicks >= N ? 'opacity-100' : 'opacity-0 pointer-events-none'"` with `transition-opacity duration-300` — content is always in the DOM but invisible until click N. **Use instead of Additive Reveal when elements share a grid/flex container** and removing one would cause layout shifts (e.g., 3-column card grids, continuum characteristics rows).
3. **Scene Replacement**: `v-if="$clicks >= N && $clicks < M"` — content appears at click N and disappears at click M. Good for walkthroughs, step-by-step explanations.
4. **Reactive Styling**: `:class="{ 'opacity-40': $clicks >= N }"` with `style="transition: opacity 0.5s;"` — element stays but changes appearance. Good for de-emphasizing to draw focus elsewhere.

## Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Use `$clicks`-based `v-if` as standard | Avoids hydration bug; more expressive than v-click directives | 2026-01-29 |
| Apply to ALL animated slides | Consistency across the whole presentation; prevents mixed patterns | 2026-01-29 |
| Update Slidev skill for animation guidance | Skill is the right place — loaded when working on slides, keeps CLAUDE.md concise | 2026-01-29 |
| Keep additive reveals for simple slides | Most slides just need items to appear and stay — scene replacement is overkill for these | 2026-01-29 |
| Scene replacement for complex slides | Continuum diagrams and multi-step walkthroughs benefit from content that hides/replaces | 2026-01-29 |
| Document pattern selection guidance | The system needs to understand WHEN to use which pattern, not just blindly apply one | 2026-01-29 |

## Open Questions

- [ ] Should the animation guidance be added directly to SKILL.md or as a separate `references/animation-patterns.md`?
- [ ] Should templates include animation by default, or should animation be an opt-in variable in template generation?

## Notes

- Known Slidev issue: v-click directives may not properly apply hidden state on initial page load before click system hydrates
- Fix pattern: `v-if="$clicks >= N && $clicks < M"` replaces `v-click="N" v-click.hide="M"`
- The "How Skills Work" slide is the gold standard reference for the scene-based pattern
- Slide 06 already uses `$slidev.nav.clicks` for reactive opacity — `$clicks` is the shorthand equivalent
- User's mental model: "There should be knowledge about how to use advanced v-clicks depending on the use case" — the key deliverable is **teaching the system** the right patterns, not just fixing individual slides

---
*Spec finalized on 2026-01-29. Open questions deferred to planning phase.*
