# Spec: Add File Tree Template Slide

**Session ID**: `2026-01-29_file-tree-template_cd0amg`
**Date**: 2026-01-29
**Status**: Finalized
**Finalized**: 2026-01-29T22:07:00Z

## Overview

Create a new slide template for the Slidev presentation system that displays a navigable file explorer — a file tree sidebar with a syntax-highlighted code viewer. This is essentially the existing `FileExplorer.vue` component, polished up visually and integrated into the slide template system.

## Existing Implementation Reference

### FileExplorer.vue (`to_add/filetree/FileExplorer.vue`)

A working file explorer component that solves the core technical challenges:

- **Data loading**: Uses `import.meta.glob('../decks/**/*', { as: 'raw', eager: true })` to read all files from a directory at build time via Vite's glob import
- **Props**: Takes a `dir` string prop that specifies which subdirectory to display
- **Tree building**: Parses glob results into a recursive `FileNode` tree structure (name, path, type, children, content)
- **Interaction**: Click to select files, click to expand/collapse folders. All folders auto-expanded on mount. First file auto-selected.
- **Content panel**: Right side shows syntax-highlighted file content using Shiki (`codeToHtml`), with a VS Code-style tab header showing the filename
- **Styling**: VS Code-inspired dark/light theme with proper icons (`i-vscode-icons:*`), indentation, hover states, selection highlighting
- **Companion**: Uses `FileTreeItem.vue` for recursive tree node rendering

### Key Technical Pattern
The glob path `../decks/**/*` is relative to where the component lives. Files are stored under a `decks/` directory structure, and the `dir` prop selects which subtree to show. The actual files on disk ARE the tree data — no JSON config needed.

## Vision & Feel

- **A mini VS Code on the slide** — file tree sidebar on the left, syntax-highlighted code on the right
- **Polished styling** — take the visual quality up a notch from the current FileExplorer.vue, drawing from the interactive_file_tree app's styling (better spacing, transitions, visual hierarchy)
- **Not a wide-panel app** — this is constrained to slide dimensions; the layout should feel compact and purposeful
- **Simple and focused** — just file tree + code viewer, no descriptions panel, no toolbar, no extras
- **Primary use cases**:
  1. Showing a project's folder structure to explain architecture
  2. Navigating through files live during a presentation to show code
  3. Walking through a codebase in a talk

## Interaction Model

- **All files/folders visible from the start** — all folders auto-expanded on mount
- **Presenter navigates manually** — clicking files in the tree during the live presentation
- **Code panel updates on selection** — clicking a file shows its syntax-highlighted content
- **Folders expand/collapse** — standard tree behavior
- **Vue component with local reactive state** (selected item, expanded folders)

## Data Architecture

### Convention-Based Folder Structure (via Vite Glob Import)

Following the proven `FileExplorer.vue` pattern:

- The tree structure is defined by **literally creating the folder/file structure** on disk
- `import.meta.glob` reads it at build time — no build script or JSON config needed
- The `dir` prop selects which subtree to render

Example usage:
```
decks/
└── components/
    └── example_fs/
        └── my-fastapi-app/
            ├── src/
            │   ├── main.py
            │   ├── models.py
            │   └── routes/
            │       └── api.py
            ├── requirements.txt
            └── README.md
```

Slide uses: `<FileExplorer dir="components/example_fs/my-fastapi-app" />`

## High-Level Goals

- Create a polished, reusable file explorer slide component
- Build on the existing `FileExplorer.vue` and `FileTreeItem.vue` — improve styling, not rewrite
- Register as a global Slidev component for easy use in any slide
- Create slide template files for the generation system

## Mid-Level Goals

- Move `FileExplorer.vue` and `FileTreeItem.vue` into the project's component system
- Polish the visual styling (better spacing, transitions, colors aligned with the interactive file tree)
- Ensure the glob import path works correctly from the component's registered location
- Create template files (slide.md, description.md, example.md) for the slide generation system
- Include example file tree data for the template

## Constraints

- Must work within Slidev's slide rendering
- Must follow existing template patterns (Handlebars slide.md, description.md, example.md)
- Should build on the existing FileExplorer.vue rather than starting from scratch
- Should use the project's existing Tailwind/styling conventions and icon system (`i-vscode-icons:*`)
- Layout must fit comfortably on a slide (not too cramped)

## Scope

### In Scope
- File tree sidebar with expand/collapse
- Syntax-highlighted code viewer panel
- File-type-aware icons (VS Code icon set)
- Convention-based folder structure via Vite glob import
- Visual polish / improved styling
- Slide template files for generation system

### Out of Scope
- Description metadata / description panel
- Drag and drop
- Search / filter
- Toolbar with actions
- Slidev `$clicks`-based progressive reveal

## Key Decisions

1. **Code viewer only** — the right panel shows syntax-highlighted file content, no description panel. There isn't enough slide real estate for descriptions, and the code speaks for itself
2. **Genuinely interactive** — the tree is navigable live during the presentation, not static
3. **Convention-based folder structure via Vite glob** — files on disk ARE the tree data, using `import.meta.glob`
4. **Build on FileExplorer.vue** — adapt and polish the existing component, don't rewrite
5. **Style upgrade** — improve visual quality to match the interactive file tree app's polish (better spacing, transitions, visual hierarchy) while keeping the same fundamental layout
6. **Optional title** — slide can have a title above the explorer if provided; otherwise the explorer fills the entire slide for maximum code readability
