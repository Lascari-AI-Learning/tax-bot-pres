# Three-to-One Takeaway Template

This template presents three key ideas that lead to one powerful takeaway message. It uses a visual progression with animated reveals (v-clicks) to build up to the main conclusion.

## Features
- Title at the top
- Three colored boxes with ideas (appear one by one)
- Each box has a lead-in statement and an emphasized result
- A centered takeaway box appears last with the main message
- Customizable colors for each element
- Responsive grid layout

## Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `title` | Main title of the slide | "What This Means For YOU" |
| `idea1_lead` | Lead-in text for first idea | "Your deep understanding of systems..." |
| `idea1_action` | Action verb for first idea | "becomes" |
| `idea1_emphasis` | Emphasized word (colored) | "MORE" |
| `idea1_result` | Result/outcome | "valuable" |
| `idea1_color` | Tailwind color name | "emerald" |
| `idea2_lead` | Lead-in text for second idea | "Your ability to architect solutions..." |
| `idea2_action` | Action verb for second idea | "becomes" |
| `idea2_emphasis` | Emphasized word (colored) | "MORE" |
| `idea2_result` | Result/outcome | "critical" |
| `idea2_color` | Tailwind color name | "sky" |
| `idea3_lead` | Lead-in text for third idea | "Your judgment about trade-offs..." |
| `idea3_action` | Action verb for third idea | "becomes" |
| `idea3_emphasis` | Emphasized word (colored) | "MORE" |
| `idea3_result` | Result/outcome | "essential" |
| `idea3_color` | Tailwind color name | "amber" |
| `takeaway_statement` | First part of takeaway | "AI Doesn't Replace Expertise." |
| `takeaway_preemphasis` | Text before emphasis | "It" |
| `takeaway_emphasis` | Emphasized word (colored) | "AMPLIFIES" |
| `takeaway_postemphasis` | Text after emphasis | "it." |
| `takeaway_color` | Tailwind color name | "red" |

## Usage

```bash
npm run generate:slide -- --template=three-to-one-takeaway --name=09-key-takeaway \
  --title="What This Means For YOU" \
  --idea1_lead="Your deep understanding of systems..." \
  --idea1_action="becomes" \
  --idea1_emphasis="MORE" \
  --idea1_result="valuable" \
  --idea1_color="emerald" \
  --idea2_lead="Your ability to architect solutions..." \
  --idea2_action="becomes" \
  --idea2_emphasis="MORE" \
  --idea2_result="critical" \
  --idea2_color="sky" \
  --idea3_lead="Your judgment about trade-offs..." \
  --idea3_action="becomes" \
  --idea3_emphasis="MORE" \
  --idea3_result="essential" \
  --idea3_color="amber" \
  --takeaway_statement="AI Doesn't Replace Expertise." \
  --takeaway_preemphasis="It" \
  --takeaway_emphasis="AMPLIFIES" \
  --takeaway_postemphasis="it." \
  --takeaway_color="red"
```

## Best Practices
- Keep lead-in statements concise (1-2 lines max)
- Use contrasting colors for the three ideas
- Make the takeaway statement punchy and memorable
- The emphasis words should be short and impactful
- Consider the flow: three supporting points → one conclusion