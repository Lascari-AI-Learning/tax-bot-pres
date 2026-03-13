# Continuum Diagram Template

## Purpose
This template creates a visual continuum or spectrum diagram showing different items positioned along a gradient line. Perfect for showing tool comparisons, maturity models, or any concept that exists on a spectrum between two extremes.

## When to Use
- Comparing tools or technologies on a spectrum
- Showing progression or maturity levels
- Illustrating trade-offs between two extremes
- Positioning items relative to each other on a scale

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{title}}` | Main slide title | "The AI Coding Tool Continuum" |
| `{{background_color}}` | Background color of the diagram | "#E3DACC" |
| `{{left_label}}` | Label for the left extreme | "Fully <br>Autonomous <br> (Agentic)" |
| `{{left_color}}` | Color for left label | "rose-600" |
| `{{right_label}}` | Label for the right extreme | "Low Level<br>Control" |
| `{{right_color}}` | Color for right label | "sky-600" |
| `{{gradient_from}}` | Start color of gradient | "rose-400" |
| `{{gradient_via}}` | Middle color of gradient | "purple-400" |
| `{{gradient_to}}` | End color of gradient | "sky-400" |
| `{{markers}}` | Array of items on continuum | See marker structure below |
| `{{characteristics}}` | Optional: Descriptions below | See characteristics structure |
| `{{footer}}` | Optional: Footer text | "What Tool Bridges the Gap?" |
| `{{footer_v_click_at}}` | Optional: When footer appears | "4" |
| `{{speaker_notes}}` | Speaker notes | "This continuum represents..." |

### Marker Structure
Each marker in the `{{markers}}` array should have:

| Property | Description | Example |
|----------|-------------|---------|
| `label` | Display name | "Claude Code", "Cursor", "Aider" |
| `percentage` | Position on line (0-100) | 50 |
| `color` | Marker color | "purple-500" |
| `position` | CSS position classes | "-top-8.5" or "-bottom-8.5" |
| `above` | If label is above marker | true/false |
| `featured` | Make this item stand out | true/false |
| `ring_color` | Ring color if featured | "purple-200" |
| `highlight_bg` | Background if featured | "purple-100" |
| `highlight_border` | Border if featured | "purple-500" |

### Characteristics Structure
Optional characteristics below the continuum:

| Property | Description | Example |
|----------|-------------|---------|
| `lines` | Array of text lines | ["Describe → Get Code", "Little Visibility"] |
| `span` | Grid columns to span | 2, 5, etc. |
| `center` | Center the content | true/false |
| `center_margin` | Add margin if centered | true/false |
| `v_click` | Use click animation | true/false |
| `v_click_at` | Specific click timing | "3" |
| `special_content` | Use special formatting | true/false |
| `special_title` | Title for special content | "The Sweet Spot:" |
| `special_text` | HTML text for special | See example below |
| `special_gradient` | Gradient for special | "#fb7185, #a78bfa, #38bdf8" |

## Usage Example

```bash
npm run generate:slide -- --template=continuum-diagram --name=04-continuum \
  --title="The AI Coding Tool Continuum" \
  --background_color="#E3DACC" \
  --left_label="Fully <br>Autonomous <br> (Agentic)" \
  --left_color="rose-600" \
  --right_label="Low Level<br>Control" \
  --right_color="sky-600" \
  --gradient_from="rose-400" \
  --gradient_via="purple-400" \
  --gradient_to="sky-400" \
  --markers='[
    {
      "label": "Devin, Codex, etc.",
      "percentage": 5,
      "color": "rose-500",
      "position": "-top-8.5",
      "above": true
    },
    {
      "label": "Claude Code",
      "percentage": 50,
      "color": "purple-500",
      "position": "-bottom-12",
      "above": false,
      "featured": true,
      "ring_color": "purple-200",
      "highlight_bg": "purple-100",
      "highlight_border": "purple-500"
    },
    {
      "label": "Aider",
      "percentage": 95,
      "color": "sky-400",
      "position": "-top-8.5",
      "above": true
    }
  ]' \
  --characteristics='[
    {
      "lines": ["Describe → Get Code", "Little to No Visibility", "Take it or Leave it"],
      "span": 2,
      "v_click": true
    },
    {
      "span": 5,
      "center": true,
      "center_margin": true,
      "v_click": true,
      "v_click_at": "3",
      "special_content": true,
      "special_title": "The Sweet Spot:",
      "special_text": "<span class=\"text-red-600 font-bold\">Agentic</span> with <span class=\"text-purple-600 font-bold\">Visibility</span> and <span class=\"text-sky-600 font-bold\">Control</span>",
      "special_gradient": "#fb7185, #a78bfa, #38bdf8"
    },
    {
      "lines": ["You Drive Everything", "Full Transparency", "High Cognitive Load"],
      "span": 2,
      "v_click": true,
      "v_click_at": "2"
    }
  ]' \
  --footer="What Tool Bridges the Gap?" \
  --footer_v_click_at="4"
```

## Visual Features
- Gradient line showing the spectrum
- Items positioned precisely along the continuum
- Featured items with rings and special styling
- Optional characteristics grid below
- Progressive reveal animations
- Custom background colors

## Notes
- Use percentages (0-100) for precise positioning
- Alternate items above/below the line for clarity
- Featured items should be used sparingly (1-2 max)
- The grid below uses 9 columns for flexible layouts
- HTML is supported in labels and text