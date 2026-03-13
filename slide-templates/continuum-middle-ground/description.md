# Continuum Middle Ground Template

A slide template for showing a continuum with two extremes and highlighting the optimal middle ground. Perfect for demonstrating balanced approaches, best practices between extremes, or positioning strategies.

## Variables

### Required Variables
- `title` - The slide title (e.g., "Winning = a modular approach")
- `continuum_color` - Hex color for the continuum line (e.g., "#006b7d")
- `left_title` - Title for the left extreme
- `left_description` - Description for the left extreme
- `right_title` - Title for the right extreme  
- `right_description` - Description for the right extreme
- `middle_title` - Title for the middle/optimal position
- `middle_description` - Description for the middle position
- `middle_border_color` - Hex color for the middle box border (e.g., "#00d9a3")

### Optional Variables
- `use_icons` - Whether to import and use Lucide icons (default: false)
- `left_icon` - Icon component name for left extreme (e.g., "X")
- `left_icon_bg` - Background color for left icon (e.g., "#ff8b94")
- `right_icon` - Icon component name for right extreme (e.g., "X")
- `right_icon_bg` - Background color for right icon (e.g., "#ff8b94")
- `middle_icon` - Icon component name for middle position (e.g., "Check")
- `middle_icon_bg` - Background color for middle icon (e.g., "#00d9a3")
- `fade_extremes` - Whether to fade the extremes when middle appears (default: false)
- `fade_at_click` - Click number when to fade extremes (default: 3)
- `extra_icons` - Additional icon imports if needed
- `speaker_notes` - Speaker notes for the slide

## Usage Examples

### Basic Example (No Icons)
```bash
npm run generate:slide -- --template=continuum-middle-ground --name=07-approach \
  --title="Finding the Sweet Spot" \
  --continuum_color="#006b7d" \
  --left_title="Too Complex" \
  --left_description="Over-engineered solutions that take forever" \
  --right_title="Too Simple" \
  --right_description="Quick fixes that don't scale" \
  --middle_title="Just Right" \
  --middle_description="Balanced approach that delivers value quickly and sustainably" \
  --middle_border_color="#00d9a3"
```

### Full Example with Icons and Fading
```bash
npm run generate:slide -- --template=continuum-middle-ground --name=08-ai-strategy \
  --title="Winning = a modular approach" \
  --continuum_color="#006b7d" \
  --use_icons=true \
  --left_title="Reinventing the AI wheel" \
  --left_description="Teams spend months or years developing custom models & infrastructure" \
  --left_icon="X" \
  --left_icon_bg="#ff8b94" \
  --right_title="Black box use of AI" \
  --right_description="Teams implement only the most basic AI features like chatbots" \
  --right_icon="X" \
  --right_icon_bg="#ff8b94" \
  --middle_title="LEGO block use of AI" \
  --middle_description="Teams assemble differentiated AI features by integrating the best available AI capabilities with their product's data and functionality" \
  --middle_icon="Check" \
  --middle_icon_bg="#00d9a3" \
  --middle_border_color="#00d9a3" \
  --fade_extremes=true \
  --fade_at_click=3
```

### Product Positioning Example
```bash
npm run generate:slide -- --template=continuum-middle-ground --name=09-market-position \
  --title="Our Market Position" \
  --continuum_color="#1a73e8" \
  --left_title="Enterprise Giants" \
  --left_description="Slow, expensive, over-featured" \
  --right_title="Basic Tools" \
  --right_description="Limited features, poor support" \
  --middle_title="Our Solution" \
  --middle_description="Enterprise-grade features with startup agility and fair pricing" \
  --middle_border_color="#34a853"
```

## Visual Features

- **Horizontal Continuum**: A visually striking arrow line showing the spectrum
- **Progressive Reveal**: Three-step animation revealing extremes then the middle
- **Visual Hierarchy**: Middle position highlighted with border and shadow
- **Connection Lines**: Visual connectors from each box to the continuum
- **Optional Icons**: Support for Lucide icons to enhance visual communication
- **Fade Effect**: Optional fading of extremes to emphasize the middle ground

## Best Practices

1. **Clear Extremes**: Make the left and right positions clearly undesirable
2. **Compelling Middle**: The middle ground should be obviously superior
3. **Concise Descriptions**: Keep descriptions short and punchy
4. **Visual Balance**: Use consistent colors and spacing
5. **Progressive Story**: Build tension with extremes, then reveal the solution

## Animation Sequence

1. **Click 1**: Shows the left extreme
2. **Click 2**: Shows the right extreme  
3. **Click 3**: Shows the middle position (optionally fades extremes)

## Common Use Cases

- Product positioning between competitors
- Methodology comparisons (waterfall vs chaos vs agile)
- Technology adoption strategies
- Business model positioning
- Feature complexity decisions
- Investment strategies