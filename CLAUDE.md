# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Slidev presentation about Claude Code. Slidev is a Vue.js-based presentation framework that uses markdown files for slides.

**Live Template URL:** https://lascari-ai-learning.github.io/SlidevTemplate/

## Common Commands

```bash
# Install dependencies (uses pnpm)
npm run install

# Start development server (http://localhost:3030)
npm run dev

# Build for production
npm run build

# Export presentation to PDF/PNG/PNGs
npm run export

# Auto-generate index.md from slides directory
npm run build:slides

# Generate a new slide from a template
npm run generate:slide -- --template=<template-name> --name=<slide-name> [--variable=value ...]

# List all available templates
npm run list:templates

# Show template usage help
npm run template:help
```

## Architecture

### Slide System
- Each slide is a folder under `slides/` with `index.md` as the entry point
- Slide folders are numbered (e.g., `01-about-me/index.md`, `02-introduction/index.md`) for automatic ordering
- Folders can optionally contain an `assets/` subfolder for slide-specific images/media
- `scripts/build.ts` generates `index.md` by discovering `*/index.md` files in numerical order
- Each slide can have frontmatter for theme and layout configuration

### Key Directories
- `slides/` - Individual slide folders, each with `index.md` entry point and optional `assets/`
- `slide-templates/` - Reusable slide templates with documentation and examples
- `ai_docs/` - AI-related documentation including speaker profile and brand guidelines
- `public/` - Static assets accessible in slides
- `scripts/` - Build and generation scripts

### Theming
- Uses custom fonts: Styrene A (headings) and Styrene B (body text)
- Custom color palette defined in styles
- Light color scheme by default
- Tailwind/Windi CSS for styling

## Slide Template System

### Overview
The project uses a template-based system for creating slides. Instead of using Slidev's built-in Vue layouts, we have a custom template structure that provides:
- Visual examples (screenshots) of each template
- Detailed documentation for each template
- Easy generation of new slides from templates
- Consistent structure across presentations

### Template Structure
Each template is stored in `slide-templates/<template-name>/` with:
```
slide-templates/
├── [template-name]/        # Template for overview/agenda slides
│   ├── slide.md            # The template file with placeholders
│   ├── description.md      # Usage documentation
│   └── preview.png         # Screenshot showing the template
└── ... (other templates)
```

### Available Templates

#### Core Templates (Essential for most presentations)
1. **title** - Opening slide with title, subtitle, and optional QR code
2. **column-cards** - Flexible column layout with icon cards (2-4 columns)
3. **about-me** - Speaker introduction with photo and background
4. **conclusion-lets-connect** - Closing slide with contact QR codes

#### Content Templates
5. **icon-list-content** - Multiple sections with icons and bullet points
6. **continuum-diagram** - Visual spectrum showing items along a gradient

### Using Templates

To generate a new slide from a template:
```bash
npm run generate:slide -- --template=title --name=00-my-title \
  --title="My Presentation" \
  --subtitle="An Amazing Talk" \
  --qr_link="https://example.com" \
  --qr_label="Follow Along"
```

Each template has different variables. Check the template's `description.md` file for:
- Required and optional variables
- Usage examples
- Visual features
- Best practices

### Creating New Templates

To create a new template:
1. Create a new folder in `slide-templates/`
2. Add `slide.md` with the template structure using `{{variable}}` placeholders
3. Write `description.md` with usage instructions
4. Optionally add a `preview.png` screenshot

Template syntax supports:
- Simple variables: `{{title}}`
- HTML variables: `{{{html_content}}}`
- Conditionals: `{{#if variable}}...{{/if}}`
- Loops: `{{#each items}}...{{/each}}`

## Slide Formatting Rules

When creating or editing slides, always follow these formatting standards:

### Cards & Borders
- **Always wrap content in a card with a visible border** — use `bg-white border-{color}-600 border-1 rounded-lg p-4`
- Use `border-2` for emphasized or important callouts
- Accent colors: `blue-600`, `green-600`, `purple-600`, `orange-600`, `amber-600`, `red-600`

### Text & Typography
- **Title Case everything** — capitalize the first letter of each word in headings, labels, card titles, and bullet points
- **Bold + capitalize for emphasis** — when a word or phrase needs to stand out, make it both bold and capitalized (e.g., `<span class="font-bold">IMPORTANT CONCEPT</span>`)
- **Avoid light grey text** — do not use `text-gray-300` or `text-gray-400`. The lightest acceptable text color is `text-gray-500`, and only for small labels/captions. Body text should be `text-gray-900` or `text-gray-700`

### Quick Reference
| Element | Classes |
|---|---|
| Standard card | `bg-white border-{color}-600 border-1 rounded-lg p-4` |
| Emphasized card | `bg-white border-{color}-600 border-2 rounded-lg p-4` |
| Body text | `text-sm text-gray-900` |
| Small label | `text-xs font-semibold text-gray-500 uppercase tracking-wide` |
| Emphasis text | `font-bold` + uppercase the word |
| Colored accent | `text-{color}-600 font-bold` |

### HTML Block Structure (Slidev + Vue Reactivity)

**Critical rule: keep sibling HTML blocks "touching" — no blank lines between them.**

Slidev uses a markdown parser that treats blank lines as paragraph breaks. When you separate two `<div>` blocks with a blank line, the parser wraps each in its own `<p>`, which breaks Vue directive reactivity inside them (e.g. `:class="$clicks >= 1 ? ... : ..."` stops updating on click). The fix is simple: put adjacent sibling divs directly next to each other with no blank line between them.

**Do this:**
```html
<div class="grid grid-cols-2 gap-6">
  <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0'" class="...">Card A</div>
  <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="...">Card B</div>
</div>
<div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0'" class="...">Footer callout</div>
```

**Not this** (blank lines break `$clicks` reactivity):
```html
<div class="grid grid-cols-2 gap-6">
  <div :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0'" class="...">Card A</div>

  <div :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0'" class="...">Card B</div>
</div>

<div :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0'" class="...">Footer callout</div>
```

Guidelines:
- No blank lines between sibling `<div>`s, especially when ANY of them use `$clicks`, `v-if`, `:class`, or other Vue bindings
- Blank lines ARE fine before/after the outermost block, and between HTML and frontmatter
- Use HTML comments (`<!-- ... -->`) for labels instead of blank-line separators
- Indentation inside a block is fine — only the empty lines between blocks cause the issue

## Development Workflow

1. Choose a template: `npm run list:templates`
2. Generate a slide: `npm run generate:slide -- --template=<name> --name=<slide-name> [variables]` (creates `slides/<slide-name>/index.md`)
3. Edit the generated slide in `slides/<slide-name>/index.md` if needed
4. Run `npm run build:slides` to regenerate index.md
5. Use `npm run dev` to preview changes
6. Slides support standard markdown, Vue components, and inline styles

## Deployment
- Configured for both Netlify and Vercel
- Build command: `pnpm build`
- Output directory: `dist`