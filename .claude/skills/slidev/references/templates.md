# Template Structure Reference

## Folder Structure

Each template lives in `slide-templates/{template-name}/`:

```
slide-templates/{template-name}/
├── description.md   # Usage documentation
├── example.md       # Example with concrete content
├── slide.md         # Template with placeholders
└── screenshots/     # Click-state images
    ├── click-0.png  # Initial state
    ├── click-1.png  # After first click
    └── click-N.png  # Up to clicks value
```

## File Purposes

### description.md

Documentation explaining how to use the template.

**Typical sections**:
- Purpose - What the template is for
- When to Use - Scenarios where this template fits
- Template Variables - List of `{{placeholder}}` variables
- Animation Behavior - How v-clicks work
- Visual Features - Key design elements

### slide.md

The template file with Handlebars-style placeholders.

**Syntax**:
- `{{variable}}` - Simple text replacement
- `{{{variable}}}` - HTML content (triple braces, no escaping)
- `{{#each items}}...{{/each}}` - Loop over arrays
- `{{#if condition}}...{{/if}}` - Conditional content

**Structure**:
```markdown
---
theme: ../
layout: default
---

<div class="...">
  {{title}}

  {{#each items}}
  <div v-click>{{this.content}}</div>
  {{/each}}
</div>

<!--
{{speaker_notes}}
-->
```

### example.md

A working example with concrete content and v-click annotations.

**Purpose**:
- Shows template in use with real content
- Defines the click animation pattern
- Used as `source` in templates.json for screenshot capture

**Structure**:
```markdown
---
theme: ../
layout: default
---

<div class="...">
  Actual Title Here

  <v-click>
  <div>First item content</div>
  </v-click>

  <v-click>
  <div>Second item content</div>
  </v-click>
</div>
```

### screenshots/

Directory containing click-state images captured by Playwright MCP.

**Naming**: `click-{n}.png` where n = 0, 1, 2, ...

**Count**: Total files = `clicks` + 1 (includes initial state)

## templates.json Schema

The registry file at project root listing all templates.

```json
{
  "slides": [
    {
      "order": "00",
      "template": "title",
      "source": "slide.md",
      "clicks": 0
    },
    {
      "order": "01",
      "template": "column-cards",
      "source": "example.md",
      "clicks": 3
    }
  ]
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `order` | string | 2-digit position (e.g., "00", "04", "99") |
| `template` | string | Folder name in `slide-templates/` |
| `source` | string | Which file to render ("slide.md" or "example.md") |
| `clicks` | number | Total v-click transitions (0 = no animations) |

### Ordering

- Order determines slide position in presentation
- "00" is first, "99" is conventionally last (conclusion)
- New templates typically use next available number (e.g., "08", "09")

### Source Selection

- `"source": "slide.md"` - Template with placeholders (for generation)
- `"source": "example.md"` - Concrete example (for screenshots/preview)

Most templates use `example.md` for screenshots since it has actual content to display.

## Current Templates

| Order | Template | Clicks | Screenshots |
|-------|----------|--------|-------------|
| 00 | title | 0 | 1 |
| 01 | column-cards | 3 | 4 |
| 02 | about-me | 0 | 1 |
| 03 | icon-list-content | 2 | 3 |
| 04 | continuum-diagram | 4 | 5 |
| 05 | extremes-to-middle | 2 | 3 |
| 06 | continuum-middle-ground | 3 | 4 |
| 07 | three-to-one-takeaway | 4 | 5 |
| 99 | conclusion-lets-connect | 0 | 1 |

**Total**: 9 templates, 27 screenshots
