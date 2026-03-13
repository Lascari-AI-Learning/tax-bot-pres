---
description: Generate entire presentation from storyboard (full draft mode)
argument-hint: [session-id]
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, AskUserQuestion
model: opus
---

# Presentation Build Mode - Full Draft

Generate the complete presentation from the storyboard.

## Skill Reference

- Skill: `.claude/skills/presentation-session/SKILL.md`
- Build Phase: `.claude/skills/presentation-session/build/OVERVIEW.md`
- Slidev Skill: `.claude/skills/slidev/SKILL.md`
- Templates: `slide-templates/`
- Working directory: `agents/sessions/`

## Variables

```
$1 = session-id   (required)
SESSIONS_DIR = agents/sessions
TEMPLATES_DIR = slide-templates
SLIDES_DIR = slides
```

## Prerequisites

- Finalized plan (`phases.plan.status: "finalized"` in state.json)
- Storyboard exists (`storyboard.md` in session directory)

## Workflow

<workflow name="full_draft_build">
    <phase name="1_load_context">
        <steps>
            <step>Read SESSIONS_DIR/$1/state.json</step>
            <step>Verify phases.plan.status === "finalized"</step>
            <step>Read SESSIONS_DIR/$1/spec.md (key idea, audience)</step>
            <step>Read SESSIONS_DIR/$1/storyboard.md (slide structure)</step>
        </steps>
    </phase>

    <phase name="2_generate_slides">
        <description>Create each slide folder in sequence</description>
        <for_each_slide>
            <step>Parse slide from storyboard (folder name, content, template hint)</step>
            <step>If template specified, read slide-templates/{template}/slide.md</step>
            <step>If no template, infer best match or create custom layout</step>
            <step>Create slides/{folder}/index.md</step>
            <step>Copy assets if needed</step>
        </for_each_slide>
    </phase>

    <phase name="3_build_index">
        <step>Run: npm run build:slides</step>
        <purpose>Regenerate index.md from slide folders</purpose>
    </phase>

    <phase name="4_update_state">
        <step>Update state.json:
            - phases.build.status: "in_progress" or "complete"
            - phases.build.started_at: now()
        </step>
    </phase>
</workflow>

## Template Usage

When storyboard specifies `(template: X)`:
1. Read `slide-templates/X/slide.md`
2. Read `slide-templates/X/description.md` for usage
3. Fill template with content from storyboard

When NO template specified:
1. Review content requirements
2. Check `slide-templates/` for best match
3. Use AskUserQuestion if uncertain
4. Generate custom layout if no template fits

## Slide Generation Pattern

For each slide, follow this structure:

```markdown
---
layout: default
title: {slide title}
{if animated}clicks: {max click count}{/if}
---

{slide content following CLAUDE.md formatting rules}
```

## Formatting Rules (from CLAUDE.md)

- **Cards**: Always wrap content in `bg-white border-{color}-600 border-1 rounded-lg p-4`
- **Title Case**: Capitalize first letter of each word in headings/labels
- **Bold emphasis**: Use `<span class="font-bold">KEYWORD</span>` for emphasis
- **No light grey text**: Use `text-gray-500` minimum, prefer `text-gray-900`

## Animation Patterns

Use `$clicks`-based patterns (from slidev skill):
- `v-if="$clicks >= N"` - Additive reveal
- `:class="$clicks >= N ? 'opacity-100' : 'opacity-0'"` - Layout-preserving
- Add `clicks: N` to frontmatter

## Behavior

- Generate slides in sequence from storyboard
- Show progress: "Creating slide 1/N: {name}"
- Run build:slides once at the end
- Update state.json when complete

ALLOWED WRITES:
- `slides/**` (slide folders and content)
- `agents/sessions/{session_id}/state.json`

## User Output Examples

### Starting Build
```markdown
## Building Presentation

**Session**: `{session_id}`
**Slides**: {count} from storyboard

Generating slides...

1. ✓ 00-title
2. ✓ 01-about-me
3. ⟳ 02-the-problem (in progress)
...
```

### Complete
```markdown
## Build Complete ✓

**Session**: `{session_id}`
**Slides Generated**: {count}

Run `npm run dev` to preview at http://localhost:3030

To refine a specific slide:
`/presentation-session:slide {session_id} [slide-name-or-number]`
```
