# Title Slide Template

## Purpose
The title slide template creates an impactful opening slide with a large title, subtitle, and optional QR code for audience engagement.

## When to Use
- As the first slide of your presentation
- When you need a strong visual introduction
- When you want to provide a QR code for audience participation

## Layout
This template uses `layout: default` with fully inlined HTML — no external Vue layout dependency. All structure is self-contained within the slide markdown.

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{title}}` | Main presentation title | "What is Claude Code?" |
| `{{subtitle}}` | Secondary title or tagline | "...and Why You Should Care" |
| `{{qr_link}}` | URL for the QR code (optional) | "https://example.com/presentation" |
| `{{qr_label}}` | Text above the QR code | "Scan to Follow Along" |
| `{{speaker_notes}}` | Speaker notes for the slide | "Welcome everyone, today we'll explore..." |

## Usage Example

```bash
npm run generate:slide -- --template=title --name=00-title \
  --title="What is Claude Code?" \
  --subtitle="...and Why You Should Care" \
  --qr_link="https://lascari-ai.github.io/what-is-claude-code/" \
  --qr_label="Scan to Follow Along" \
  --speaker_notes="Let's cut through the hype..."
```

## Visual Features
- Large, bold typography for maximum impact
- Centered layout for focus
- Optional QR code with customizable label
- Elegant shadow effects on the QR code container
- Custom color scheme using the presentation's theme

## Notes
- The QR code is generated dynamically using the qr-server API
- If `qr_link` is omitted, the QR section is not rendered
- The slide uses custom fonts (Styrene A/B) defined in the theme
- No external layout dependency — all HTML is inlined in the slide
