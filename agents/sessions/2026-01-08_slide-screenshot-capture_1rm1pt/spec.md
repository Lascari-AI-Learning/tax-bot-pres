# Slidev Template Workflow Commands

> **Session**: `2026-01-08_slide-screenshot-capture_1rm1pt`
> **Status**: ✅ FINALIZED
> **Created**: 2026-01-08
> **Updated**: 2026-01-18
> **Finalized**: 2026-01-18

## Overview

A set of workflow-style slash commands that use **Playwright MCP** to manage Slidev slide templates. These commands enable agents to:
1. Sync all template screenshots when slides are out-of-date
2. Capture screenshots for a specific template
3. Add new templates with proper structure and screenshots

The commands use workflow prompts that guide the agent through dynamic iteration and proper file organization.

## Problem Statement

*What problem are we solving? Why does it matter?*

When agents need to create new slides from templates, they lack visual reference of what the final rendered slide looks like. Additionally, maintaining template screenshots and adding new templates requires a documented workflow that agents can follow consistently.

## Goals

### High-Level Goals

*The north star - what does ultimate success look like?*

- **Enable agents to understand slide storytelling** - Screenshots show layout, visual styling, AND the progression of elements at each click state
- **Self-maintaining template system** - Agents can sync screenshots and add new templates without manual intervention
- **Workflow-driven commands** - Each command contains workflow prompts that guide agents through the process dynamically

### Mid-Level Goals

*Major capabilities or milestones needed to achieve high-level goals.*

- **Sync-all command** - Iterate through `templates.json`, capture screenshots for each template using Playwright MCP
- **Sync-single command** - Capture screenshots for a specific template (useful when one template changes)
- **Add-template command** - Full workflow for adding a new template: create folder structure, add to templates.json, capture screenshots
- **Slidev skill** - Document the template system structure and conventions

### Detailed Goals

*Specific behaviors or features.*

- **Template folder structure**:
  - `description.md` - Usage documentation
  - `example.md` - Example usage with content
  - `slide.md` - Template with placeholders
  - `screenshots/` - Click-state images (click-0.png, click-1.png, etc.)
- **Dynamic iteration** - Commands read `templates.json` and iterate through entries, using `clicks` field to know how many states to capture
- **Playwright MCP tools** - Use `browser_navigate` and `browser_take_screenshot` for capture

## Non-Goals

*What we are explicitly NOT building*

- **Sync time tracking** - No `last_synced` field; manual re-run is sufficient
- **Auto-discovery of click counts** - Using explicit `clicks` field in templates.json
- **Automated/scheduled runs** - Manual invocation only
- **Local dev server screenshots** - Using live deployed URL only

## Success Criteria

*How do we know we're done? Testable outcomes*

- [x] `templates.json` has `clicks` field for each slide entry ✓ (already done)
- [ ] `/slidev:sync-all` command exists - iterates all templates
- [ ] `/slidev:sync-template` command exists - syncs specific template
- [ ] `/slidev:add-template` command exists - full new template workflow
- [ ] Screenshots saved to `slide-templates/{template}/screenshots/click-{n}.png`
- [ ] Slidev skill documents structure, workflow, and conventions
- [ ] Commands contain workflow prompts explaining the iteration process

## Context & Background

### Live URL Pattern
```
https://lascari-ai-learning.github.io/SlidevTemplate/{slide_number}?clicks={click_number}
```
- Slide numbers are 1-indexed (order "00" → URL /1, order "04" → URL /5)
- clicks=0 is the initial state (can omit query param)
- clicks=1, clicks=2, etc. for progressive reveal states

### templates.json Structure (Current)
```json
{
  "slides": [
    { "order": "00", "template": "title", "source": "slide.md", "clicks": 0 },
    { "order": "01", "template": "intro-what-well-cover", "source": "example.md", "clicks": 3 },
    ...
  ]
}
```

### Template Folder Structure
```
slide-templates/{template-name}/
├── description.md   # Usage documentation
├── example.md       # Example usage (some templates)
├── slide.md         # Template with placeholders
└── screenshots/     # Click-state images
    ├── click-0.png  # Initial state
    ├── click-1.png  # After first click
    └── ...          # As many as clicks field specifies
```

### Playwright MCP Tools Used
- `browser_navigate` - Navigate to slide URL
- `browser_take_screenshot` - Capture current viewport
- `browser_wait_for` - Wait for slide to render (if needed)

## Proposed Commands

### 1. `/slidev:sync-all`
**Purpose**: Sync screenshots for ALL templates in templates.json

**Workflow**:
1. Read `templates.json` to get all slides
2. For each slide entry:
   - Create `screenshots/` folder if needed
   - Calculate URL: `/{parseInt(order)+1}`
   - For clicks 0 through `clicks` value:
     - Navigate to URL (with `?clicks=n` if n > 0)
     - Take screenshot, save as `click-{n}.png`
3. Report summary of captured screenshots

### 2. `/slidev:sync-template --template=<name>`
**Purpose**: Sync screenshots for a SINGLE template

**Workflow**:
1. Read `templates.json`, find entry matching template name
2. Create `screenshots/` folder if needed
3. For clicks 0 through `clicks` value:
   - Navigate to URL
   - Take screenshot
4. Report completion

### 3. `/slidev:add-template`
**Purpose**: Add a new template with full folder structure (interactive)

**Workflow**:
1. **Prompt for template name** - kebab-case identifier (e.g., "two-column-compare")
2. **Prompt for template purpose** - what kind of content it presents
3. **Prompt for layout/structure** - ask about columns, sections, visual elements
4. **Prompt for animation pattern** - how should elements reveal (v-click strategy)
5. **Create folder structure** in `slide-templates/{name}/`:
   - `description.md` - generated from prompts
   - `slide.md` - template with placeholders based on structure
   - `example.md` - example with sample content
   - `screenshots/` folder
6. **Analyze v-clicks** in example.md to determine click count
7. **Add entry to `templates.json`** with order, template, source, clicks
8. **Prompt user to deploy** - remind to run build/deploy
9. **Capture screenshots** using Playwright MCP after deployment

## Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Use Playwright MCP | Works better than Firecrawl, runs locally, no API key needed | 2026-01-18 |
| Workflow-style commands | Prompts guide agents through dynamic iteration; more flexible than rigid scripts | 2026-01-18 |
| Three separate commands | Single-purpose commands are clearer than one command with many flags | 2026-01-18 |
| No validate command | Keep it simple with three commands; validation can be part of sync | 2026-01-18 |
| Interactive add-template | Prompt for name, purpose, layout, animation pattern during creation | 2026-01-18 |
| Use explicit metadata for click counts | `clicks` field in templates.json - simpler than auto-discovery | 2026-01-08 |
| Screenshots in subfolder | `screenshots/` keeps template folder clean | 2026-01-08 |

## Open Questions

*No remaining questions - ready for finalization*

## Diagrams

```mermaid
flowchart TD
    A[/slidev:sync-all] --> B[Read templates.json]
    B --> C[For each slide entry]
    C --> D[Create screenshots/ folder]
    D --> E[For clicks 0 to N]
    E --> F[browser_navigate to URL]
    F --> G[browser_take_screenshot]
    G --> H{More clicks?}
    H -->|Yes| E
    H -->|No| I{More templates?}
    I -->|Yes| C
    I -->|No| J[Report Summary]
```

## Notes

- Playwright MCP handles browser automation locally - no external API needed
- Commands are workflow prompts, not executable scripts - they guide agent behavior
- `templates.json` clicks field already populated from prior work
- Consider adding validation step to check live URL matches expected template

---
*This spec is a living document until finalized.*
