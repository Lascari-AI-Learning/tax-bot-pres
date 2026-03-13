---
description: Enter plan mode to design presentation storyboard as a file tree
argument-hint: [session-id] [finalize]
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
model: opus
---

# Presentation Plan Mode

Design the presentation structure as a file tree storyboard.

## Skill Reference

- Skill: `.claude/skills/presentation-session/SKILL.md`
- Plan Phase: `.claude/skills/presentation-session/plan/OVERVIEW.md`
- Template: `.claude/skills/presentation-session/plan/templates/storyboard.md`
- Slidev Skill: `.claude/skills/slidev/SKILL.md`
- Working directory: `agents/sessions/`

## Variables

```
$1 = session-id   (required)
$2 = "finalize"   (optional)
SESSIONS_DIR = agents/sessions
TEMPLATES_DIR = slide-templates
```

## Instructions

1. **Load session**: Read `SESSIONS_DIR/$1/state.json` and `spec.md`
2. **Verify spec finalized**: Error if `phases.spec.status !== "finalized"`
3. **If `$2 = "finalize"`**: Jump to finalization
4. **Generate storyboard**: Go slide by slide
5. **User confirms**: Revise if needed
6. **Finalize**: Write `storyboard.md`, update state

## Workflow

<workflow name="presentation_plan">
    <phase name="1_load_session">
        <steps>
            <step>Read SESSIONS_DIR/$1/state.json</step>
            <step>Verify phases.spec.status === "finalized"</step>
            <step>Read SESSIONS_DIR/$1/spec.md</step>
            <step>Extract: key message, audience, time, non-goals</step>
        </steps>
    </phase>

    <phase name="2_design_storyboard">
        <description>Go slide by slide to outline the narrative arc</description>
        <guiding_questions>
            - What is each slide saying?
            - How does it connect to the next?
            - Does the flow lead to the key message?
        </guiding_questions>
        <output_format>
            File tree storyboard showing:
            - Slide folder names (numbered)
            - Key message per slide
            - Supporting points
            - Optional template hints
        </output_format>
    </phase>

    <phase name="3_user_review">
        <description>Show storyboard, get approval</description>
        <options>
            - "Approve" - Continue to finalize
            - "Revise" - Adjust slides
            - "Add slides" - Insert more content
            - "Remove slides" - Cut content
        </options>
    </phase>

    <phase name="4_finalize">
        <steps>
            <step>Write storyboard.md to session directory</step>
            <step>Update state.json:
                - current_phase: "build"
                - phases.plan.status: "finalized"
                - phases.plan.finalized_at: now()
            </step>
            <step>Report: "Plan finalized. Ready for BUILD."</step>
        </steps>
    </phase>
</workflow>

## Storyboard Format

The file tree IS the plan:

```
slides/
├── 00-title/
│   └── index.md
│       # Main title: "Presentation Title"
│       # Subtitle: "Supporting subtitle"
│       # (template: title)
│
├── 01-about-me/
│   └── index.md
│       # Speaker intro
│       # (template: about-me)
│
├── 02-the-problem/
│   └── index.md
│       # Pain point description
│       # Supporting examples
│       # Hook to next slide
│
└── 99-conclusion/
    └── index.md
        # Key takeaway (reinforces key message)
        # Call to action
        # (template: conclusion-lets-connect)
```

## Bird's Eye View Principle

Show WHAT each slide says, not HOW it looks:

```
❌ Too detailed (BUILD's job):
   # <div class="grid grid-cols-3">...

✅ Right level (content):
   # Pain point: Manual workflows are slow
   # Three examples
```

## Behavior Constraints

DURING PLAN MODE:
- DO NOT create actual slide files (that's BUILD)
- DO NOT specify CSS/layout (that's BUILD)
- DO capture the narrative arc
- DO suggest template hints (optional)

ALLOWED WRITES:
- `agents/sessions/{session_id}/storyboard.md`
- `agents/sessions/{session_id}/state.json`

## User Output Examples

### Starting Plan
```markdown
## Planning Presentation

**Session**: `{session_id}`
**Key Message**: {from spec}
**Audience**: {from spec}
**Time**: {from spec}

Let me outline a storyboard slide by slide...

{File tree storyboard}

Does this structure capture what you want to say?
```

### Finalized
```markdown
## Plan Finalized ✓

**Session**: `{session_id}`
**Slides**: {count}

Storyboard saved to `agents/sessions/{session_id}/storyboard.md`.

Ready to build. Run:
- `/presentation-session:build {session_id}` - Generate all slides
- `/presentation-session:slide {session_id} [slide]` - Work on a specific slide
```
