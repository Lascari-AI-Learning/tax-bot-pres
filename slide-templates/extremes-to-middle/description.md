# Extremes to Middle Template

A slide template for showing how combining two extremes or opposing concepts leads to a balanced middle ground solution. Perfect for presenting synthesis of ideas, best-of-both-worlds approaches, or finding balance between competing priorities.

## Variables

### Required Variables
- `title` - The slide title (e.g., "Closing the Gap", "Finding Balance")
- `extreme1_label` - Label for the first extreme (e.g., "Agentic", "Speed", "Innovation")
- `extreme1_color` - Tailwind color for the first extreme (e.g., "red", "blue", "green")
- `extreme2_label` - Label for the second extreme (e.g., "Controllable", "Quality", "Stability")
- `extreme2_color` - Tailwind color for the second extreme (e.g., "sky", "purple", "orange")

### Optional Variables
- `show_details` - Whether to show the benefits breakdown (default: true)
- `extreme1_benefits` - Array of benefits for the first extreme
- `extreme2_benefits` - Array of benefits for the second extreme
- `show_result` - Whether to show the final result (default: true)
- `result_label` - The label for the combined result (e.g., "Real Engineering Work")
- `result_color` - Tailwind color for the result box (default: "purple")
- `speaker_notes` - Speaker notes for the slide

## Usage Examples

### Basic Example
```bash
npm run generate:slide -- --template=extremes-to-middle --name=06-closing-the-gap \
  --title="Closing the Gap" \
  --extreme1_label="Agentic" \
  --extreme1_color="red" \
  --extreme2_label="Controllable" \
  --extreme2_color="sky"
```

### Full Example with Details
```bash
npm run generate:slide -- --template=extremes-to-middle --name=08-balance \
  --title="Finding the Perfect Balance" \
  --extreme1_label="Speed" \
  --extreme1_color="orange" \
  --extreme2_label="Quality" \
  --extreme2_color="blue" \
  --show_details=true \
  --extreme1_benefits='["Rapid iteration", "Quick feedback", "Time to market"]' \
  --extreme2_benefits='["Robust code", "Fewer bugs", "Maintainable"]' \
  --show_result=true \
  --result_label="Sustainable Development" \
  --result_color="green" \
  --speaker_notes="This slide shows how we don't have to choose between speed and quality. By combining the best aspects of both approaches, we can achieve sustainable development practices."
```

### Simple Concept Example
```bash
npm run generate:slide -- --template=extremes-to-middle --name=10-approach \
  --title="Our Approach" \
  --extreme1_label="Innovation" \
  --extreme1_color="purple" \
  --extreme2_label="Reliability" \
  --extreme2_color="gray" \
  --show_details=false \
  --show_result=false
```

## Visual Features

- **Clean Layout**: Two colored boxes at the top showing the extremes with a "+" between them
- **Progressive Reveal**: Uses v-click to reveal details and results step by step
- **Color Coding**: Each extreme has its own color scheme that flows through the slide
- **Benefit Lists**: Optional detailed benefits for each extreme
- **Visual Flow**: Arrows guide the eye from extremes to the combined result
- **Responsive Grid**: Uses Tailwind grid system for proper alignment

## Best Practices

1. **Choose Contrasting Colors**: Select colors that clearly differentiate the two extremes
2. **Keep Labels Concise**: Use short, punchy labels for the extremes (1-2 words)
3. **Balance Benefits**: Try to list equal numbers of benefits for each extreme
4. **Clear Result**: Make the final result compelling and easy to understand
5. **Use Speaker Notes**: Add context about why this synthesis matters

## Common Use Cases

- Presenting a balanced approach to competing methodologies
- Showing how your solution combines the best of both worlds
- Explaining trade-offs and how to optimize for both
- Demonstrating synthesis of opposing viewpoints
- Illustrating product positioning between extremes