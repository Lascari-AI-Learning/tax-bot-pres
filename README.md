# Slidev Starter Template

To start the slide show:

- `npm install`
- `npm run dev`
- visit <http://localhost:3030>

Edit the markdown files in the [slides](./slides/) directory to see the changes.

## Building Slides

To build all slides in the `slides/` directory:

```bash
npm run build:slides
```

This will:
- Build each `.md` file in the `slides/` directory
- Output the built slides to the `dist/` directory
- Generate an index page with links to all slides

## Template Showcase

This project serves as both a template library and a showcase presentation. Each template in `slide-templates/` contains:

- `slide.md` - The template file (layout-based templates are directly usable, others contain `{{variable}}` placeholders)
- `example.md` - A rendered example with real content (for complex templates)
- `description.md` - Documentation explaining the template's usage

### Generating the Showcase

To generate a presentation showcasing all templates:

```bash
npm run generate:showcase
```

This reads `templates.json` and copies the appropriate source file (`slide.md` or `example.md`) from each template into `slides/`, then builds the index.

### Template Structure

| Template | Type | Description |
|----------|------|-------------|
| `title` | Layout-based | Opening slide with title, subtitle, and QR code |
| `about-me` | Layout-based | Speaker introduction using the `speaker` layout |
| `column-cards` | Complex | Flexible column layout with icon cards |
| `icon-list-content` | Complex | Sections with icons and bullet points |
| `continuum-diagram` | Complex | Items positioned along a gradient spectrum |
| `continuum-middle-ground` | Complex | Left/right extremes with a middle sweet spot |
| `extremes-to-middle` | Complex | Two approaches combining into one result |
| `three-to-one-takeaway` | Complex | Three ideas leading to one takeaway |
| `conclusion-lets-connect` | Complex | Closing slide with contact QR codes |

### Customizing the Showcase

Edit `templates.json` to control which templates appear and in what order:

```json
{
  "slides": [
    { "order": "00", "template": "title", "source": "slide.md" },
    { "order": "01", "template": "column-cards", "source": "example.md" }
  ]
}
```

- `order` - Numeric prefix for slide ordering
- `template` - Folder name in `slide-templates/`
- `source` - Which file to copy (`slide.md` for layout-based, `example.md` for complex)
