---
description: Enter spec mode to capture presentation essentials through focused interview
argument-hint: [topic | session-id | finalize] [description]
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
model: opus
---

# Presentation Spec Mode

Capture the presentation essentials through a focused interview.

## Skill Reference

Read the presentation-session skill for templates and full documentation:
- Skill: `.claude/skills/presentation-session/SKILL.md`
- Spec Phase: `.claude/skills/presentation-session/spec/OVERVIEW.md`
- Template: `.claude/skills/presentation-session/spec/templates/presentation-spec.md`
- Working directory: `agents/sessions/`

## Variables

```
$1 = Primary argument (session-id, topic, or "finalize")
$2 = Optional description or "finalize" flag
SESSIONS_DIR = agents/sessions
TEMPLATES_DIR = .claude/skills/presentation-session/spec/templates
```

## Instructions

Parse `$1` and `$2`:

1. **`$1` matches existing session ID**: Load that session
   - If `$2 = "finalize"`: Jump to finalization
2. **`$1` is a topic string**: Create new session with `$1` as topic
3. **`$1` is empty**: Prompt user for topic

Then: Create session → Interview → Finalize

## Core Principles

- **Interview, don't interrogate** - Conversational flow, not a form
- **Key message first** - Everything else supports this
- **No research** - External data/reports provided by user
- **Capture the WHY** - Understanding intent helps BUILD phase
- **Atomic saves** - Update spec.md after each meaningful exchange

## Workflow

<workflow name="presentation_spec">
    <phase name="1_parse_inputs">
        <inputs>
            - `$1`: session ID, topic, or empty
            - `$2`: "finalize" or additional context
        </inputs>
    </phase>

    <phase name="2_resolve_session">
        <branch condition="$1 matches existing session ID">
            <action>Load session from SESSIONS_DIR/$1/</action>
        </branch>
        <branch condition="$1 is topic or empty">
            <action>Create new session</action>
            <steps>
                <step>If $1 empty, prompt for topic</step>
                <step>Generate ID: {YYYY-MM-DD}_{topic-slug}_{6-char-random}</step>
                <step>Create: SESSIONS_DIR/{session_id}/</step>
                <step>Initialize state.json with topic, current_phase: "spec"</step>
                <step>Create spec.md from template</step>
            </steps>
        </branch>
    </phase>

    <phase name="3_interview">
        <description>Conversational interview focused on 4 core questions</description>
        <core_questions>
            1. What's the one thing you want the audience to remember?
            2. Who is the audience?
            3. How much time do you have?
            4. What are you NOT covering?
        </core_questions>
        <follow_ups>
            - What do they already know?
            - What's the call to action?
            - Specific examples or demos?
            - What's the context? (conference, internal, training)
        </follow_ups>
        <after_each_answer>
            1. Acknowledge understanding
            2. Update spec.md immediately
            3. Update state.json if needed
            4. Ask next question or summarize
        </after_each_answer>
    </phase>

    <phase name="4_finalize">
        <trigger>User signals ready or answers complete</trigger>
        <steps>
            <step>Review spec.md completeness</step>
            <step>Confirm with user</step>
            <step>Update state.json: phases.spec.status = "finalized"</step>
            <step>Report: "Spec finalized. Ready for `/presentation-session:plan`"</step>
        </steps>
    </phase>
</workflow>

## Behavior Constraints

DURING SPEC MODE:
- DO NOT write outside session directory
- DO NOT create slide structure (that's PLAN phase)
- DO NOT make template choices (that's BUILD phase)
- DO capture the WHY behind answers

ALLOWED WRITES:
- `agents/sessions/{session_id}/**`

## User Output Examples

### New Session
```markdown
## Presentation Session Started

**Session ID**: `{session_id}`
**Topic**: {topic}
**Location**: `agents/sessions/{session_id}/`

Let's capture the essentials of your presentation.

**What's the one thing you want the audience to remember?**
```

### Resume Session
```markdown
## Presentation Session Resumed

**Session ID**: `{session_id}`
**Topic**: {topic}

### Current Understanding
{Brief summary of spec.md}

{Continue with next question or ask where to focus}
```

### Finalized
```markdown
## Spec Finalized ✓

**Session**: `{session_id}`
**Topic**: {topic}

Ready for storyboarding. Run `/presentation-session:plan {session_id}` to create the slide structure.
```
