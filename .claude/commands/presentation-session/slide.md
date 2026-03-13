---
description: Iterate on a specific slide (single slide mode)
argument-hint: [session-id] [target]
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, AskUserQuestion
model: opus
---

# Presentation Build Mode - Single Slide

Work on a specific slide to iterate and refine.

## Skill Reference

- Skill: `.claude/skills/presentation-session/SKILL.md`
- Build Phase: `.claude/skills/presentation-session/build/OVERVIEW.md`
- Slidev Skill: `.claude/skills/slidev/SKILL.md`
- Templates: `slide-templates/`

## Variables

```
$1 = session-id   (required)
$2 = target       (slide folder name, number, or description)
SESSIONS_DIR = agents/sessions
SLIDES_DIR = slides
```

## Targeting Methods

Three ways to specify which slide:

| Method | Example | How It Resolves |
|--------|---------|-----------------|
| **Folder name** | `03-the-question` | Exact match to `slides/{folder}/` |
| **Slide number** | `3` | Third slide folder (by numeric order) |
| **Conversational** | `"the problem slide"` | Search storyboard + slide content for match |

## Workflow

<workflow name="single_slide_build">
    <phase name="1_load_context">
        <purpose>Understand the overall presentation even for single slide</purpose>
        <steps>
            <step>Read SESSIONS_DIR/$1/state.json</step>
            <step>Read SESSIONS_DIR/$1/spec.md (key idea, audience, tone)</step>
            <step>Read SESSIONS_DIR/$1/storyboard.md (where this slide fits)</step>
        </steps>
    </phase>

    <phase name="2_resolve_target">
        <branch condition="$2 is folder name">
            <action>Find slides/{$2}/index.md</action>
        </branch>
        <branch condition="$2 is number">
            <action>List slides/*, find Nth by numeric order</action>
        </branch>
        <branch condition="$2 is description">
            <action>Search storyboard + slides for best match</action>
            <action>Use AskUserQuestion to confirm if ambiguous</action>
        </branch>
    </phase>

    <phase name="3_read_current">
        <step>If slide exists, read current content</step>
        <step>Show user what's there</step>
    </phase>

    <phase name="4_generate_or_refine">
        <branch condition="slide doesn't exist">
            <action>Generate from storyboard using template</action>
        </branch>
        <branch condition="slide exists">
            <action>Discuss changes with user</action>
            <action>Apply refinements</action>
        </branch>
    </phase>

    <phase name="5_build_index">
        <step>Run: npm run build:slides</step>
    </phase>
</workflow>

## Context-Aware Editing

Even when working on one slide, the agent understands:
- **Key message** - What the presentation is trying to say
- **Audience** - Who they are and what they know
- **Narrative arc** - How this slide connects to others

This ensures every edit serves the overall story.

## Behavior

- Always load spec and storyboard first (context matters)
- Show current slide content before proposing changes
- Explain HOW changes fit the narrative
- Run build:slides after each change

ALLOWED WRITES:
- `slides/{target}/**` (target slide only)
- `agents/sessions/{session_id}/state.json`

## Slide Structure

Each slide lives in its folder:
```
slides/{folder}/
├── index.md         # Slide content (required)
└── assets/          # Optional images/media
    └── image.png
```

Reference assets with: `./assets/image.png`

## Animation Patterns (from slidev skill)

Use `$clicks`-based patterns:
- `v-if="$clicks >= N"` - Additive reveal
- `:class="$clicks >= N ? 'opacity-100' : 'opacity-0'"` - Layout-preserving
- Add `clicks: N` to frontmatter

**DO NOT use**: `<v-click>`, `v-click` directives (hydration bug)

## User Output Examples

### Slide Found
```markdown
## Editing Slide: 03-the-question

**Session**: `{session_id}`
**Narrative context**: This is after the intro, setting up the problem...

### Current Content
{show existing index.md}

What would you like to change?
```

### Slide Doesn't Exist
```markdown
## Creating Slide: 03-the-question

**Session**: `{session_id}`
**From storyboard**:
  - Pain point description
  - Supporting examples
  - Hook to next slide

I'll generate this using the column-cards template. Ready?
```

### After Edit
```markdown
## Slide Updated ✓

**Slide**: 03-the-question

{show new content}

Preview at: http://localhost:3030/4

Other slides to refine?
```
