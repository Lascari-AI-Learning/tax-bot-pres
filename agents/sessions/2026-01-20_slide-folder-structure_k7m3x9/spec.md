# Slide Folder Structure

> **Session**: `2026-01-20_slide-folder-structure_k7m3x9`
> **Status**: ✅ Finalized (2026-01-29)
> **Created**: 2026-01-20

## Overview

Restructure the slide system from flat markdown files (`slides/*.md`) to a folder-based architecture where each slide has its own directory containing an `index.md` file and optionally an `assets/` folder for slide-specific resources like images and videos.

## Problem Statement

*What problem are we solving? Why does it matter?*

Currently, slides are stored as flat markdown files in the `slides/` directory. This creates challenges:

1. **Asset ownership is unclear** - Images and other assets go in a shared `public/` folder, making it hard to know which assets belong to which slides
2. **Complex slides are hard to manage** - As slides evolve to include more than just markdown (images, videos, state management, interactive components), keeping everything together becomes difficult
3. **No vertical slice encapsulation** - Related files are scattered, making slide management cumbersome

The user envisions slides becoming significantly more complex over time - including interactive components like a "file tree selector" slide with its own state management. The current flat structure doesn't support this evolution.

## Goals

### High-Level Goals

*The north star - what does ultimate success look like? Include WHY this matters.*

- **Vertical slice encapsulation**: Each slide is a self-contained unit with all its assets, making management intuitive and portable
- **Future-proof for complexity**: Support slides that go beyond markdown - interactive components, state management, multimedia - without architectural friction

### Mid-Level Goals

*Major capabilities or milestones needed to achieve high-level goals. Capture the reasoning behind each.*

- Folder-based slide structure where each slide owns its assets
- Build process that discovers and assembles slides from folder structure
- Template system that generates folder-based slides
- Slidev skill updated with new structure rules and conventions
- Complete migration of all existing slides (not gradual)

### Detailed Goals

*Specific behaviors or features - added as conversation progresses. Note user's preferences and "taste".*

- Support for images, videos, and other static assets per slide
- Support for complex interactive slides (e.g., file tree selector with state management)
- Clear, predictable organization that scales with slide complexity

### Design Philosophy (User's Mental Model)

**"Setting the stage"** - The user hasn't built complex slides yet but wants an architecture that doesn't constrain future complexity. The folder structure should be:

- **Permissive, not prescriptive** - Allow whatever a complex slide might need without mandating structure
- **Simple slides stay simple** - A basic markdown slide shouldn't need boilerplate
- **Complex slides have room to grow** - When a slide needs `assets/`, `code/`, or custom components, the structure accommodates it naturally
- **True vertical slices** - Everything about a slide lives in its folder. Reference assets with relative paths (`./assets/image.png`), not absolute paths to public/. The build system handles making this work with Slidev.

**Example vision**: A file tree selector slide might have:
```
slides/15-file-tree-demo/
├── index.md          # The slide markdown
├── assets/           # Images, videos
└── code/             # Source files that get rendered as a file tree
```

The exact mechanism (Vue component? Slidev feature?) is TBD - will be figured out during implementation. The architecture just needs to not block this.

## Non-Goals

*What we are explicitly NOT building - prevents scope creep*

- Complex interactive slide implementations (that's future work - we're just setting the stage)
- New slide content - this is purely structural migration
- Changes to Slidev core or how presentations render

## Success Criteria

*How do we know we're done? Testable outcomes*

- [ ] All 9 existing slides migrated to folder structure (`slides/00-title/index.md`, etc.)
- [ ] Build script (`scripts/build.ts`) discovers slides from folders and generates `index.md`
- [ ] `npm run dev` works - presentation renders correctly
- [ ] `npm run build` works - production build succeeds
- [ ] Templates updated to generate folder structure
- [ ] `npm run generate:slide` creates `slides/XX-name/index.md`
- [ ] Slidev skill (`.claude/skills/slidev/`) updated with new structure conventions
- [ ] Relative asset paths work (if any slide has assets to test with)

## Context & Background

*Relevant existing systems, prior art, stakeholder input. Include user's mental model and design philosophy when relevant.*

### Current Architecture
- Slides stored in `slides/` as numbered markdown files (e.g., `00-title.md`, `01-column-cards.md`)
- `scripts/build.ts` concatenates slides in numerical order to generate `index.md`
- Assets currently go in `public/` directory
- Templates exist in `slide-templates/` for generating new slides

## Key Decisions

*Capture the WHY behind decisions, not just the WHAT. Include user's reasoning and preferences.*

| Decision | Rationale | Date |
|----------|-----------|------|
| Folder naming keeps `00-name` pattern | Allows easy scripting for building top-level index.md - same ordering logic | 2026-01-20 |
| Entry point is `index.md` | React-style convention - index is the main file for a folder. Fallback to `slide.md` if naming conflicts arise | 2026-01-20 |
| Simple slides = just `index.md` | Stays flat when no assets needed. Complexity expands organically by adding folders/components | 2026-01-20 |
| Architecture is permissive | "Set the stage" for future complexity without prescribing structure | 2026-01-20 |
| Relative paths for assets | Use `./assets/image.png` from index.md - keeps vertical slice self-contained. Build system handles resolution. | 2026-01-20 |
| Big bang migration | Update all slides, build script, templates, and Slidev skill together. Not gradual adoption. | 2026-01-20 |

## Open Questions

*All key questions answered - ready for finalization*

## Diagrams

*Mermaid or ASCII diagrams as understanding develops*

```
Current Structure:
slides/
├── 00-title.md
├── 01-column-cards.md
├── 02-about-me.md
└── ...

Proposed Structure (React-style folder convention):
slides/
├── 00-title/
│   └── index.md                    # Simple slide - just the entry point
├── 01-column-cards/
│   ├── index.md
│   └── assets/
│       └── diagram.png             # Slide-specific asset
├── 15-file-tree-demo/
│   ├── index.md                    # Entry point, imports components
│   ├── assets/
│   │   └── preview.png
│   ├── code/                       # Source files rendered as tree
│   │   └── example-project/
│   └── FileTreeSelector.vue        # Complex component (future)
└── ...

Key: The folder IS the slide. index.md is the entry point.
     Complexity grows organically by adding files/folders as needed.
```

## Notes

*Working notes, ideas, considerations*

- React-style mental model: folder = component, index.md = entry point
- Build system needs to handle relative path resolution for assets
- This is foundational work - complex interactive slides will come later
- Scope includes: slides, build script, templates, Slidev skill documentation

---
*This spec was finalized on 2026-01-29. Ready for planning phase.*
