# Add Chart and Terminal Templates

> **Session**: `2026-01-29_chart-terminal-templates_x7k9m2`
> **Status**: ✅ Finalized (2026-01-29)
> **Created**: 2026-01-29

## Overview

Add two new slide template types to the Slidev presentation template system:
1. **Chart template** - for displaying data visualizations using Chart.js (bar, line, doughnut)
2. **Terminal template** - for displaying terminal/CLI output in a realistic terminal window

Both templates already have **pre-built Vue components** in `to_add/jason_to_add/` (`Chart.vue` and `Terminal.vue`). The work is primarily about integrating these components, creating slide templates that wrap them, and adding the proper dependencies.

The chart template should showcase that various chart types are available, with each click revealing a different chart type — demonstrating the template's versatility.

## Problem Statement

Presenters frequently need to show terminal/CLI interactions and data visualizations in slides. Currently there's no template for either, forcing manual HTML/CSS each time. Having reusable templates ensures consistent styling across presentations and reduces per-slide effort.

## Goals

### High-Level Goals

- **Showcase template variety**: Demonstrate that the Slidev template system supports rich interactive components beyond text/images — charts and terminals are key proof points
- **Reusable, consistent templates**: Any presenter can generate a chart or terminal slide via `npm run generate:slide` with minimal effort

### Mid-Level Goals

1. **Integrate pre-built components**: Move `Chart.vue` and `Terminal.vue` from `to_add/jason_to_add/` into `components/`
2. **Add Chart.js dependencies**: Install `chart.js` and `vue-chartjs` as project dependencies
3. **Create chart slide template**: Template in `slide-templates/chart/` that showcases multiple chart types with v-click progression
4. **Create terminal slide template**: Template in `slide-templates/terminal/` supporting both static and animated modes
5. **Add template documentation**: `description.md` and `slide.md` for both templates

### Detailed Goals

#### Chart Template
- Uses pre-built `Chart.vue` component (supports bar, line, doughnut)
- **v-click progression**: Each click shows a different chart type, so the audience can see all available options
- Props-driven via `type`, `labels`, `datasets`, `title`, `height`
- Modern color palette: Blue (#3B82F6), Emerald (#10B981), Violet (#8B5CF6)
- Dark mode and light mode support
- Responsive with configurable height (default 400px)

#### Terminal Template
- Uses pre-built `Terminal.vue` component with Shiki syntax highlighting
- **Static mode**: Pre-written commands and output displayed in a styled terminal window
- **Animated mode** (v-click driven):
  1. Presenter clicks → command types character by character (~50ms/char)
  2. Brief pause (~300ms) after command finishes
  3. Output appears instantly
  4. Blinking cursor visible during typing
- **Data format**: Array of step objects, each with `command` and `output` fields
- **Visual style**: Current component uses a VS Code-style header; user wants **macOS-style window chrome** with traffic light dots (red/yellow/green)
- Syntax highlighting via Shiki for commands (bash, zsh, powershell, cmd)
- JSON auto-detection for output highlighting
- Copy-to-clipboard for commands
- Configurable: title, prompt symbol, shell type, height

## Non-Goals

- **Interactive terminal**: Not building a live terminal where presenters type commands
- **Chart editor**: Not building a GUI for creating charts — data is passed via props
- **Additional chart types beyond Chart.js basics**: Not adding radar, scatter, area, etc. at this time
- **AgentView template**: The `AgentView.vue` component in `to_add/` is a separate effort

## Success Criteria

- [ ] `Chart.vue` and `Terminal.vue` are in `components/` and working
- [ ] `chart.js` and `vue-chartjs` are installed as dependencies
- [ ] `slide-templates/chart/` exists with `slide.md`, `description.md`
- [ ] `slide-templates/terminal/` exists with `slide.md`, `description.md`
- [ ] Chart template demo slide shows multiple chart types cycling via v-click
- [ ] Terminal template demo slide shows commands with syntax highlighting
- [ ] Both templates can be generated via `npm run generate:slide`
- [ ] Dev server runs without errors with new templates

## Context & Background

### Pre-built Components (in `to_add/jason_to_add/`)

**Chart.vue** — Full Chart.js integration:
- Registers: CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler
- Chart types: bar, line, doughnut
- Smart defaults: auto-colors per dataset, responsive, modern tooltips
- Dark mode via `dark:bg-[#1e1e1e]`

**Terminal.vue** — Shiki-highlighted terminal:
- Interface: `TerminalLine { command: string; output?: string; prompt?: string }`
- Supports single command or array of lines
- Shell types: bash, zsh, powershell, cmd
- JSON auto-detection for output
- Copy-to-clipboard with hover reveal
- Current header: VS Code-style (needs update to macOS traffic lights)

### Dependencies Needed
```json
{
  "chart.js": "^4.5.1",
  "vue-chartjs": "^5.3.3"
}
```

### Existing Template System
- Templates live in `slide-templates/<template-name>/` with `slide.md`, `description.md`, and `preview.png`
- Templates use Handlebars syntax (`{{variable}}`, `{{#if}}`, `{{#each}}`)
- Generated via `npm run generate:slide -- --template=<name> --name=<slide-name> [--variables]`

## Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Terminal: both static + animated modes | Maximum flexibility for different presentation contexts | 2026-01-29 |
| Terminal: array of step objects for data | Clean separation of command vs output; easier to author than line-by-line | 2026-01-29 |
| Terminal: macOS-style window chrome | Polished aesthetic that matches presentation quality; familiar to audiences | 2026-01-29 |
| Chart: use Chart.js via vue-chartjs | Lightweight (~60KB), well-supported, built-in animations, great Vue integration | 2026-01-29 |
| Chart: v-click progression through chart types | Showcases template versatility; each click reveals a different chart type | 2026-01-29 |
| Integrate existing components from to_add/ | Components already built and tested; avoid reimplementing | 2026-01-29 |
| Terminal: update header to macOS traffic lights | Polished window chrome matching user's earlier preference | 2026-01-29 |
| Terminal: build typing animation now (not deferred) | User wants full-featured template from the start | 2026-01-29 |
| Terminal: v-click triggers per command | Presenter controls pace; matches Slidev conventions | 2026-01-29 |
| Components: flat in components/ directory | Simple structure; Slidev auto-imports from components/ | 2026-01-29 |

## Open Questions

- [x] What does "terminal template" mean? → **Both static and animated modes**, configurable per slide
- [x] What charting library? → **Chart.js via vue-chartjs**
- [x] What chart types? → **Bar, line, doughnut** (what's in the existing component)
- [x] Data format for charts? → **Props-driven** (type, labels, datasets)
- [x] Should the Terminal.vue header be updated to macOS traffic lights? → **Yes, update to macOS-style**
- [x] Should animated typing mode be built now or deferred? → **Build now** — include typing animation in this phase
- [x] Where should components live? → **Flat in `components/`**: `components/Chart.vue` and `components/Terminal.vue`
- [x] Animation trigger? → **v-click per command** — each click reveals next command+output pair
- [x] Animation details? → **~50ms/char typing, ~300ms pause, then instant output. Blinking cursor during typing.**

## Diagrams

*Mermaid or ASCII diagrams as understanding develops*

## Notes

- The existing `Terminal.vue` does NOT have animated typing — it's static with syntax highlighting. Adding animation would be new work.
- The `to_add/jason_to_add/README.md` has comprehensive documentation for both components including all props and usage examples.
- Also in `to_add/`: `AgentView.vue` (agent workflow visualizer) — separate from this spec.

---
*Spec finalized on 2026-01-29. Ready for `/plan` phase.*
