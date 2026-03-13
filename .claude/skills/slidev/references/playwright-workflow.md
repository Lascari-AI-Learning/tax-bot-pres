# Playwright Workflow Reference

Screenshot capture for Slidev templates using Playwright MCP tools.

## Prerequisites

- Local development server running: `npm run dev` (starts at http://localhost:3030)
- Playwright MCP connection active

## Tools Used

### browser_navigate

Navigate to a slide URL.

```
mcp__playwright__browser_navigate(url: "http://localhost:3030/1")
mcp__playwright__browser_navigate(url: "http://localhost:3030/5?clicks=2")
```

**URL Format**: `http://localhost:3030/{slide_number}?clicks={n}`

### browser_wait_for

Wait for slide to fully render before capturing.

```
mcp__playwright__browser_wait_for(time: 1)
```

**Note**: 1 second wait is typically sufficient for Slidev animations to complete.

### browser_take_screenshot

Capture the current viewport to a file.

```
mcp__playwright__browser_take_screenshot(
    filename: "slide-templates/title/screenshots/click-0.png"
)
```

**Important**: Files are saved with `.playwright-mcp/` prefix. Move to final location:

```bash
mv .playwright-mcp/slide-templates/{template}/screenshots/click-{n}.png \
   slide-templates/{template}/screenshots/click-{n}.png
```

## Screenshot Capture Pattern

Complete workflow for capturing one click state:

```
1. Navigate to URL
   mcp__playwright__browser_navigate(url: "http://localhost:3030/{slide}?clicks={n}")

2. Wait for render
   mcp__playwright__browser_wait_for(time: 1)

3. Capture screenshot
   mcp__playwright__browser_take_screenshot(
       filename: "slide-templates/{template}/screenshots/click-{n}.png"
   )

4. Move to final location
   mv .playwright-mcp/slide-templates/{template}/screenshots/click-{n}.png \
      slide-templates/{template}/screenshots/click-{n}.png
```

## Full Template Capture Loop

For a template with `clicks: 3`, capture 4 screenshots (n = 0, 1, 2, 3):

```
# Ensure directory exists
mkdir -p slide-templates/{template}/screenshots/

# For each click state...
for n in 0, 1, 2, 3:
    if n == 0:
        url = "http://localhost:3030/{slide}"
    else:
        url = "http://localhost:3030/{slide}?clicks={n}"

    browser_navigate(url)
    browser_wait_for(time: 1)
    browser_take_screenshot(filename: "slide-templates/{template}/screenshots/click-{n}.png")
    mv .playwright-mcp/... to final location
```

## URL Calculation

From templates.json entry:

```json
{ "order": "04", "template": "continuum-diagram", "clicks": 4 }
```

Calculate slide number:
```
slide_number = parseInt("04") + 1 = 5
```

URLs to capture:
- click-0: `http://localhost:3030/5`
- click-1: `http://localhost:3030/5?clicks=1`
- click-2: `http://localhost:3030/5?clicks=2`
- click-3: `http://localhost:3030/5?clicks=3`
- click-4: `http://localhost:3030/5?clicks=4`

## Error Handling

### Navigation errors
- Verify dev server is running (`npm run dev`)
- Check slide number is valid

### Screenshot errors
- Ensure screenshots directory exists
- Verify write permissions

### Missing click states
- Check `clicks` value in templates.json
- Verify v-click elements in example.md

## File Location Note

Playwright MCP saves files to a `.playwright-mcp/` prefixed path. The workflow commands include a move step to relocate files to the correct location:

```
.playwright-mcp/slide-templates/title/screenshots/click-0.png
                 ↓ move ↓
slide-templates/title/screenshots/click-0.png
```

Always include this move step after each screenshot capture.
