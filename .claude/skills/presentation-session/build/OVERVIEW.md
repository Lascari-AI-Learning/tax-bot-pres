# Build Phase

Execute the presentation - generate slides from the storyboard.

## Two Modes

| Mode | Command | Purpose |
|------|---------|---------|
| **Full Draft** | `/presentation-session:build` | Generate entire presentation from storyboard |
| **Single Slide** | `/presentation-session:slide` | Iterate on a specific slide |

## Full Draft Mode

Generates the complete presentation from start to finish.

**Process**:
1. Reads spec (key idea, audience, non-goals)
2. Reads plan (storyboard file tree)
3. Creates each slide folder in sequence
4. Uses templates when specified, infers appropriate template when not
5. Runs `npm run build:slides` to regenerate index.md

**Best for**: Initial generation, fresh starts, complete overhauls.

## Single Slide Mode

Hone in on one slide to iterate and refine.

### Targeting Methods

Three ways to specify which slide:

| Method | Example | Notes |
|--------|---------|-------|
| **Folder name** | `/slide 03-the-question` | Exact match to slides/ folder |
| **Slide number** | `/slide 3` | Third slide in order |
| **Conversational** | "let's work on the problem slide" | Agent resolves from context |

### Context-Aware Editing

Single-slide mode always reads:
- **spec.md** - The key idea, audience, tone
- **plan storyboard** - Where this slide fits in the narrative

Even when editing one slide, the agent understands the overall flow.

### Single-Slide Process

1. Identify target slide (from folder, number, or description)
2. Load spec and plan for narrative context
3. Read current slide content (if exists)
4. Generate or refine the slide
5. Run `npm run build:slides` to update index

**Best for**: Refinement, iteration, fixing specific issues.

## Build Conventions

### Slide Structure

Each slide lives in its own folder:
```
slides/
├── 00-title/
│   └── index.md
├── 01-about-me/
│   └── index.md
│   └── assets/
│       └── headshot.png
├── 02-the-problem/
│   └── index.md
└── 99-conclusion/
    └── index.md
```

### Template Usage

When the storyboard specifies a template:
```
slides/03-benefits/
├── index.md
└── template: column-cards  # Use this template
```

When no template is specified, BUILD:
1. Reviews the content requirements
2. Checks available templates in `slide-templates/`
3. Selects the most appropriate template
4. Or creates custom layout if no template fits

### Animation Patterns

Use `$clicks`-based patterns (NOT v-click directives):
- `v-if="$clicks >= N"` - Additive reveal
- `:class="$clicks >= N ? 'opacity-100' : 'opacity-0'"` - Layout-preserving reveal
- Always add `clicks: N` to frontmatter for animated slides

See `.claude/skills/slidev/SKILL.md` for full animation documentation.

## Commands

### Full Draft
```
/presentation-session:build [session-id]

Arguments:
  session-id   Session to build (required)
```

### Single Slide
```
/presentation-session:slide [session-id] [target]

Arguments:
  session-id   Session context (required)
  target       Slide to work on (folder name, number, or description)
```

## Session Context

BUILD always operates within a session context:

```
agents/sessions/{session-id}/
├── state.json    # Session state
├── spec.md       # Key idea, audience (from SPEC phase)
└── plan.md       # Storyboard file tree (from PLAN phase)
```

The spec and plan provide:
- **What** the presentation is trying to say
- **Who** the audience is
- **How** the story flows slide to slide

This context ensures every slide serves the overall narrative.
