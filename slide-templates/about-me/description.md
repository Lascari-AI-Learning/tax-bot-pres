# About Me / Speaker Introduction Template

## Purpose
This template creates a professional speaker introduction slide with a photo, name, role, and key accomplishments or background information organized in sections.

## When to Use
- Early in the presentation to establish credibility
- When introducing yourself as the speaker
- For team member introductions
- Any time you need a professional bio slide

## Layout
This template uses `layout: default` with fully inlined HTML and CSS — no external Vue layout dependency. All styling is self-contained within the slide's `<style>` block.

## Assets Convention
Place your speaker photo in the slide's `assets/` subfolder and reference it with a relative path:
```
slides/02-about-me/
├── index.md
└── assets/
    └── avatar.jpeg
```

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{name}}` | Speaker's full name | "Ford Lascari" |
| `{{role}}` | Current role or title | "Applied AI Engineer & Consultant" |
| `{{image_path}}` | Relative path to speaker's photo | "./assets/avatar.jpeg" |
| `{{sections}}` | Array of content sections | See section structure below |
| `{{speaker_notes}}` | Speaker notes for the slide | "I've been in the trenches..." |

### Section Structure
Each section in the `{{sections}}` array should have:

| Property | Description | Example |
|----------|-------------|---------|
| `title` | Section heading | "What I've Done" |
| `points` | Array of bullet points | ["3 years Full-time in Gen AI", "Built <strong>30+ Gen AI Projects</strong>"] |

## Usage Example

```bash
npm run generate:slide -- --template=about-me --name=02-about-me \
  --name="Ford Lascari" \
  --role="Applied AI Engineer & Consultant" \
  --image_path="./assets/avatar.jpeg" \
  --sections='[
    {
      "title": "What I'\''ve Done",
      "points": [
        "3 years Full-time in Gen AI",
        "Built <strong class=\"text-iron-ochre font-semibold\">30+ Gen AI Projects</strong>"
      ]
    },
    {
      "title": "Why I'\''m here",
      "points": [
        "Build AI Systems that Provide <strong class=\"text-iron-ochre font-semibold\">Real Value</strong>",
        "Turn Years of Hard-Won Knowledge into an <strong class=\"text-iron-ochre font-semibold\">Unfair Advantage</strong>"
      ]
    }
  ]' \
  --speaker_notes="Speaker notes: I'\''ve been in the trenches for 3 years..."
```

## Visual Features
- Two-column layout: content on left, photo on right
- Professional gradient background
- Rounded photo frame with shadow
- Hover effects on list items
- Custom typography using Styrene fonts
- Emphasis colors for important points

## HTML Support
The bullet points support HTML for emphasis:
- Use `<strong>` tags for bold text
- Add classes like `text-iron-ochre` for custom colors
- Include `font-semibold` or `font-bold` for weight variations

## Notes
- Photo should be square for best results
- Place the photo in the slide's `assets/` subfolder for self-contained slides
- The layout is optimized for 2-3 sections
- Keep bullet points concise for readability
- The photo container has fixed dimensions (280x280px)
- No external layout dependency — all HTML/CSS is inlined in the slide
