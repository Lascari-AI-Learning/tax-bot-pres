# Icon List Content Template

## Purpose
This template creates a slide with multiple sections, each featuring an icon, heading, and bullet points. Sections can be revealed progressively with click animations. Perfect for presenting problems, features, or sequential concepts.

## When to Use
- Presenting a series of problems or challenges
- Listing features or benefits
- Showing a progression of ideas
- Any content that benefits from icon-based visual hierarchy

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{title}}` | Main slide title | "The Modern Engineer's Dilemma" |
| `{{sections}}` | Array of section objects | See section structure below |
| `{{speaker_notes}}` | Speaker notes for the slide | "The landscape of AI coding tools..." |
| `{{custom_colors}}` | Optional: Define custom colors | [{"name": "green-500", "value": "#10b981"}] |

### Section Structure
Each section in the `{{sections}}` array should have:

| Property | Description | Example |
|----------|-------------|---------|
| `heading` | Section heading | "Every Month, A New 'Game Changer'" |
| `icon_path` | SVG path for the icon | "M10.325 4.317c.426-1.756..." |
| `color` | Icon background color (if solid) | "blue-500" |
| `gradient` | Optional: Gradient colors | {"from": "green-500", "to": "orange-500"} |
| `points` | Array of bullet points (HTML supported) | ["Copilot, Cursor, Devin..."] |

## Usage Example

```bash
npm run generate:slide -- --template=icon-list-content --name=03-modern-dilemma \
  --title="The Modern Engineer's Dilemma" \
  --sections='[
    {
      "heading": "Every Month, A New \"Game Changer\"",
      "color": "blue-500",
      "icon_path": "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724...",
      "points": ["Copilot, Cursor, Devin, Codex, Windsurf, Aider, Claude Code, Bolt, Lovable..."]
    },
    {
      "heading": "Another $20/month, Another Learning Curve",
      "gradient": {"from": "green-500", "to": "orange-500"},
      "icon_path": "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      "points": [
        "Which tool is worth my <span class=\"text-green-600 font-semibold\">money</span>, and more importantly, my <span class=\"text-orange-500 font-semibold\">time</span>?"
      ]
    },
    {
      "heading": "The Fundamental Question",
      "color": "purple-500",
      "icon_path": "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      "points": ["Which tools perform <span class=\"text-purple-500 font-semibold italic\">real engineering work</span>?"]
    }
  ]' \
  --custom_colors='[
    {"name": "green-500", "value": "#10b981"},
    {"name": "orange-500", "value": "#f97316"},
    {"name": "purple-500", "value": "#a855f7"}
  ]' \
  --speaker_notes="The landscape of AI coding tools has exploded..."
```

## Visual Features
- Large icons with customizable backgrounds
- Support for solid colors or gradients
- Progressive reveal (v-click) for all sections except the first
- Consistent spacing and typography
- HTML support in bullet points for emphasis

## Icon Resources
Find SVG paths at:
- [Heroicons](https://heroicons.com/)
- [Tabler Icons](https://tabler-icons.io/)
- [Lucide Icons](https://lucide.dev/)

## HTML Support in Points
You can use HTML in bullet points for emphasis:
- `<span class="text-green-600">text</span>` for colored text
- `<strong>` or `font-semibold` for bold
- `<em>` or `italic` for italics

## Notes
- First section appears immediately, others on click
- Icons are 48x48px with 8px stroke width
- Custom colors are optional but useful for non-standard colors
- Keep headings concise for better visual balance