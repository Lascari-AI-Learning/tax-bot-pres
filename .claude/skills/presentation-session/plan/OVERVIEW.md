# Plan Phase

Design the presentation structure as a file tree storyboard - the visual outline of what each slide says.

## Purpose

The plan phase creates a **bird's eye view** of the presentation:
- Go slide by slide to outline content
- Output a file tree showing each slide and its message
- Template specification is OPTIONAL (BUILD can infer)
- Simpler than agent-session - no checkpoints, no IDK, just a storyboard

## Prerequisites

- Finalized spec (`phases.spec.status: "finalized"` in state.json)
- Session in plan phase (`current_phase: "plan"`)

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  PLAN PHASE - File Tree Storyboard                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Read finalized spec                                     │
│     └── Key message, audience, time, non-goals              │
│                                                             │
│  2. Go slide by slide                                       │
│     └── "What is this slide saying?"                        │
│     └── "How does it connect to the next?"                  │
│                                                             │
│  3. Output file tree storyboard                             │
│     └── Each slide folder + key content                     │
│     └── Optional template hints                             │
│                                                             │
│  4. User confirms storyboard                                │
│     └── Revise if needed                                    │
│                                                             │
│  5. Finalize plan                                           │
│     └── Write storyboard.md to session directory            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## File Tree Storyboard Format

The storyboard IS the plan. It shows what each slide folder will contain:

```
slides/
├── 00-title/
│   └── index.md
│       # Main title: "The Future of AI Agents"
│       # Subtitle: "From Automation to Collaboration"
│       # QR code: link to slides
│       # (template: title)
│
├── 01-about-me/
│   └── index.md
│       # Speaker introduction
│       # Role, company, relevant background
│       # (template: about-me)
│
├── 02-the-problem/
│   └── index.md
│       # Pain point: Manual workflows are slow
│       # Three specific examples of wasted time
│       # Hook: "What if this could be automated?"
│
├── 03-three-approaches/
│   └── index.md
│       # Compare: Scripts vs. RPA vs. AI Agents
│       # Show tradeoffs of each approach
│       # (template: column-cards)
│
├── 04-demo/
│   └── index.md
│       # Live demonstration of the solution
│       # Step-by-step walkthrough
│
└── 99-conclusion/
    └── index.md
        # One key takeaway (reinforces key message)
        # Call to action
        # Contact QR codes
        # (template: conclusion-lets-connect)
```

### What to Include Per Slide

Each slide entry shows:

| Element | Required | Example |
|---------|----------|---------|
| Key message | ✓ | "Pain point: Manual workflows are slow" |
| Supporting points | Optional | "Three specific examples" |
| Hook/transition | Optional | "What if this could be automated?" |
| Template hint | Optional | `(template: column-cards)` |

**Template hints** help BUILD automate, but are not required. If omitted, BUILD will:
1. Infer appropriate template from content
2. Ask user to confirm before generating

## Key Principle: Bird's Eye View

The storyboard answers: **"What is the narrative arc?"**

```
❌ Too detailed (this is BUILD's job):
   02-the-problem/
   └── index.md
       # <div class="grid grid-cols-3">
       #   <div class="bg-white border-1...
       (Implementation details)

✅ Right level (content + intent):
   02-the-problem/
   └── index.md
       # Pain point: Manual workflows are slow
       # Three specific examples of wasted time
       # Hook: "What if this could be automated?"
```

## Commands

| Command | Description |
|---------|-------------|
| `/presentation-session:plan [session-id]` | Start/resume planning |
| `/presentation-session:plan [session-id] finalize` | Finalize storyboard for build |

## Outputs

- `storyboard.md` - File tree storyboard (source of truth for BUILD)
- `state.json` - Updated with `current_phase: "build"` after finalization

## Templates

- [storyboard.md](templates/storyboard.md) - Example storyboard format

## Cross-References

- See [slidev skill](../../slidev/SKILL.md) for template conventions
- See `slide-templates/*/description.md` for template documentation
