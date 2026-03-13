# Storyboard Template

This is an example file tree storyboard showing how PLAN phase output should look.

## Format

The storyboard uses a file tree structure with comments describing each slide's content:

```
slides/
├── {NN}-{slug}/
│   └── index.md
│       # Key message for this slide
│       # Supporting points (bullets or prose)
│       # Hook/transition to next slide (optional)
│       # (template: template-name) ← optional hint
```

## Example: AI Agents Presentation (20 min)

```
slides/
├── 00-title/
│   └── index.md
│       # "The Future of AI Agents"
│       # Subtitle: "From Automation to Collaboration"
│       # QR code linking to live slides
│       # (template: title)
│
├── 01-about-me/
│   └── index.md
│       # Speaker introduction
│       # Background in AI/ML, current role at Acme Corp
│       # Credibility: "Built 50+ agent systems"
│       # (template: about-me)
│
├── 02-agenda/
│   └── index.md
│       # Three sections we'll cover:
│       # 1. The Problem - Why agents matter now
│       # 2. The Approach - How they work
│       # 3. The Demo - See it in action
│       # (template: column-cards, columns=3)
│
├── 03-the-problem/
│   └── index.md
│       # Hook: "You spend 40% of your day on repetitive tasks"
│       # Three pain points:
│       #   - Manual data entry
│       #   - Copy-paste between systems
│       #   - Routine email responses
│       # Transition: "What if software could handle this?"
│
├── 04-why-now/
│   └── index.md
│       # Three enablers that make agents viable:
│       #   - LLMs can understand context
│       #   - Tool use is reliable
│       #   - Cost has dropped 10x
│       # Key insight: "The gap between 'possible' and 'practical' has closed"
│
├── 05-approaches/
│   └── index.md
│       # Compare three approaches:
│       #   - Scripts: Fast, brittle, no adaptation
│       #   - RPA: Visual, fragile, expensive
│       #   - AI Agents: Flexible, learning, conversational
│       # (template: column-cards, columns=3)
│
├── 06-how-agents-work/
│   └── index.md
│       # High-level architecture:
│       #   - Perception: Understand the task
│       #   - Planning: Break into steps
│       #   - Action: Execute with tools
│       #   - Reflection: Learn from results
│       # Keep it simple - one diagram
│
├── 07-demo-intro/
│   └── index.md
│       # "Let's see an agent in action"
│       # Scenario: Triaging incoming support tickets
│       # What the agent will do:
│       #   - Read ticket
│       #   - Classify urgency
│       #   - Route to team
│       #   - Draft response
│
├── 08-demo/
│   └── index.md
│       # Live demo slide
│       # Terminal or screen recording
│       # Pause points for explanation
│
├── 09-key-takeaway/
│   └── index.md
│       # ONE thing to remember:
│       # "Agents don't replace humans - they amplify them"
│       # Supporting stat: "Teams using agents ship 2x faster"
│
└── 99-conclusion/
    └── index.md
        # Call to action: "Start with one workflow"
        # Resources: Link to getting started guide
        # Contact QR codes
        # (template: conclusion-lets-connect)
```

## Guidelines

### Slide Numbering
- Use `00-` for title, `99-` for conclusion
- Sequential `01-`, `02-`, etc. for body slides
- Gaps are fine if you want room to insert later

### Content Per Slide
- **Required**: Key message (what is this slide saying?)
- **Optional**: Supporting points, transitions, template hints
- **Keep brief**: 2-5 lines per slide is ideal

### Template Hints
Template hints are optional. Include when:
- You know which template fits best
- The slide has a standard structure (title, about-me, conclusion)
- You want to specify columns or layout

Omit when:
- Unsure which template to use
- Custom layout needed
- BUILD can infer from content

### Narrative Flow
The storyboard should read like an outline of your talk:
- Does each slide connect to the next?
- Is there a clear arc (problem → solution → demo → takeaway)?
- Would someone understand your argument just from this?
