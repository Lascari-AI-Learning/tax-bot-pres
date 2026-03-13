# Conclusion / Let's Connect Template

## Purpose
This template creates a closing slide with QR codes and links for audience members to connect with you across different platforms. It supports featuring one primary connection method while displaying others as secondary options.

## When to Use
- As the final slide of your presentation
- When you want to share contact information
- To encourage follow-up conversations
- For networking and community building

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{main_title}}` | The slide's main heading | "Let's Connect" |
| `{{connections}}` | Array of connection objects | See connection structure below |
| `{{footer_text}}` | Optional footer message | "Questions? Want to discuss your AI engineering challenges?" |
| `{{speaker_notes}}` | Speaker notes for the slide | "Thank you for joining me today..." |

### Connection Structure
Each connection in the `{{connections}}` array should have:

| Property | Description | Example |
|----------|-------------|---------|
| `label` | Display name for the platform | "My Website", "LinkedIn", "X (Twitter)" |
| `color` | Color theme (tailwind colors) | "purple", "blue", "emerald" |
| `qr_data` | URL for the QR code | "https://linkedin.com/in/ford-lascari/" |
| `link` | Clickable link URL | "https://linkedin.com/in/ford-lascari/" |
| `featured` | Optional: make this the featured/center item | true/false |

## Usage Example

```bash
npm run generate:slide -- --template=conclusion-lets-connect --name=11-conclusion \
  --main_title="Let's Connect" \
  --connections='[
    {
      "label": "X (Twitter)",
      "color": "blue",
      "qr_data": "https://x.com/intent/follow?screen_name=FJ000RD",
      "link": "https://x.com/intent/follow?screen_name=FJ000RD"
    },
    {
      "label": "My Website",
      "color": "purple",
      "qr_data": "https://lascari.ai/consulting/",
      "link": "https://lascari.ai/consulting/",
      "featured": true
    },
    {
      "label": "LinkedIn",
      "color": "emerald",
      "qr_data": "https://www.linkedin.com/in/ford-lascari/",
      "link": "https://www.linkedin.com/in/ford-lascari/"
    }
  ]' \
  --footer_text="Questions? Want to discuss your AI engineering challenges?" \
  --speaker_notes="Thank you for joining me today..."
```

## Layout Structure
- Uses a 13-column grid for precise positioning
- Non-featured items take 4 columns each
- Featured item takes 5 columns (center position)
- Automatically positions items: first (left), featured (center), last (right)

## Visual Features
- Gradient backgrounds matching the platform colors
- QR codes generated dynamically
- Featured item has:
  - Larger QR code (140x140 vs 120x120)
  - Thicker border and more padding
  - Bolder typography
- Hover effects on links
- Professional shadow effects

## Color Options
Use standard Tailwind color names:
- `blue` - Good for Twitter/X
- `purple` - Good for websites/portfolios
- `emerald` - Good for LinkedIn
- `red` - Good for YouTube
- `gray` - Good for GitHub
- `indigo` - Good for Discord

## Notes
- Always include exactly 3 connections for optimal layout
- The featured connection will be centered and emphasized
- QR codes are generated using the qr-server API
- Links open in new tabs (`target="_blank"`)