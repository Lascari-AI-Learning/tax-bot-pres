# Chart Grid Template

## Purpose
A multi-chart grid layout for displaying multiple charts side-by-side on a single slide. Useful for comparing different visualizations, showcasing chart variety, or presenting related metrics together.

## When to Use
- Comparing multiple datasets or chart types side-by-side
- Showcasing available chart types (e.g., all 8 Chart.js types)
- Dashboard-style slides with multiple metrics
- Presenting the same data in different visual formats

## Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{title}}` | The slide's main heading | "Chart Types" |
| `{{columns}}` | Number of grid columns (2-4) | 4 |
| `{{charts}}` | Array of chart objects | See chart structure below |
| `{{speaker_notes}}` | Speaker notes for the slide | "Here we can see..." |

### Chart Object Structure
Each object in the `{{charts}}` array should have:

| Property | Description | Example |
|----------|-------------|---------|
| `label` | Display label above the chart | "Bar" |
| `type` | Chart type | "bar", "line", "doughnut", etc. |
| `labels` | Data labels (triple-braces in template) | `['Jan', 'Feb', 'Mar']` |
| `datasets` | Dataset array (triple-braces in template) | `[{ label: 'Sales', data: [12, 19, 3] }]` |
| `height` | Chart height in pixels | 200 |

## Usage Example

```bash
npm run generate:slide -- --template=chart-grid --name=09-charts \
  --title="Performance Metrics" \
  --columns=3 \
  --charts='[
    {
      "label": "Revenue",
      "type": "bar",
      "labels": "[\"Q1\", \"Q2\", \"Q3\", \"Q4\"]",
      "datasets": "[{ label: \"2024\", data: [30, 40, 35, 50] }]",
      "height": 250
    },
    {
      "label": "Trend",
      "type": "line",
      "labels": "[\"Q1\", \"Q2\", \"Q3\", \"Q4\"]",
      "datasets": "[{ label: \"Growth\", data: [10, 25, 30, 45] }]",
      "height": 250
    },
    {
      "label": "Distribution",
      "type": "doughnut",
      "labels": "[\"Product A\", \"Product B\", \"Product C\"]",
      "datasets": "[{ data: [45, 30, 25] }]",
      "height": 250
    }
  ]'
```

## Supported Chart Types
- **bar** — Vertical bars for comparing categories
- **line** — Lines for showing trends over time
- **doughnut** — Circular with hollow center for proportions
- **pie** — Full circle for proportions
- **radar** — Radial grid for multivariate comparison
- **polarArea** — Equal-angle segments with varying radius
- **scatter** — X/Y data points for correlations
- **bubble** — X/Y with size dimension

## Visual Features
- Configurable grid columns (2-4)
- Compact chart sizing for multi-chart layouts
- Uppercase labels above each chart
- Consistent spacing and alignment
- All charts share the same height

## Notes
- Use `columns=4` with `height=200` for 8 charts (4x2 grid)
- Use `columns=3` with `height=250` for 3-6 charts
- Use `columns=2` with `height=300` for 2-4 charts
- For a single focused chart, use the **chart** template instead
- Each chart can have completely different data and type
