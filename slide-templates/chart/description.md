# Chart Template

## Purpose
A single chart slide displaying one chart type with full customization. Supports all 8 Chart.js chart types: bar, line, doughnut, pie, radar, polarArea, scatter, and bubble.

## When to Use
- Displaying a single data visualization prominently
- Presenting specific metrics or statistics
- Any slide that needs one focused chart

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{title}}` | The slide's main heading | "Monthly Revenue" |
| `{{type}}` | Chart type | "bar", "line", "doughnut", "pie", "radar", "polarArea", "scatter", "bubble" |
| `{{{labels}}}` | JSON array of label strings (triple-braces for raw) | `['Jan', 'Feb', 'Mar']` |
| `{{{datasets}}}` | JSON array of dataset objects (triple-braces for raw) | `[{ label: 'Sales', data: [12, 19, 3] }]` |
| `{{height}}` | Optional chart height in pixels | 400 |
| `{{chart_title}}` | Optional title displayed inside the chart | "Revenue Trend" |
| `{{speaker_notes}}` | Speaker notes for the slide | "This shows our Q1 growth..." |

### Dataset Structure
Each object in the `{{{datasets}}}` array supports:

| Property | Description | Example |
|----------|-------------|---------|
| `label` | Dataset label shown in legend | "Revenue" |
| `data` | Array of data points (numbers, or {x,y} for scatter, {x,y,r} for bubble) | [12, 19, 3, 5] |
| `backgroundColor` | Optional fill color(s) | "#3B82F6" or array for pie/doughnut |
| `borderColor` | Optional border color | "#2563EB" |

## Usage Example

```bash
# Bar chart
npm run generate:slide -- --template=chart --name=09-revenue \
  --title="Monthly Revenue" \
  --type="bar" \
  --labels="['Jan', 'Feb', 'Mar', 'Apr']" \
  --datasets="[{ label: 'Revenue', data: [12, 19, 8, 15] }]"

# Radar chart
npm run generate:slide -- --template=chart --name=09-comparison \
  --title="Product Comparison" \
  --type="radar" \
  --labels="['Speed', 'Reliability', 'Cost', 'UX', 'Support']" \
  --datasets="[{ label: 'Ours', data: [90, 85, 70, 95, 80] }, { label: 'Competitor', data: [75, 90, 85, 60, 70] }]"
```

## Supported Chart Types
- **bar** — Vertical bars for comparing categories
- **line** — Lines for showing trends over time
- **doughnut** — Circular with hollow center for proportions
- **pie** — Full circle for proportions
- **radar** — Radial grid for multivariate comparison
- **polarArea** — Equal-angle segments with varying radius
- **scatter** — X/Y data points for correlations (data: [{x, y}])
- **bubble** — X/Y with size dimension (data: [{x, y, r}])

## Visual Features
- Centered chart at 75% width for prominent display
- Auto-enhanced colors (blue, emerald, violet palette)
- Responsive sizing within container
- Bottom-positioned legend with square point style
- Dark tooltips with rounded corners

## Notes
- For multi-chart layouts, use the **chart-grid** template instead
- Chart auto-applies default colors if none specified in datasets
- Height defaults to 400px if not provided
