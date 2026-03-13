# Spec Phase

Capture the presentation essentials through a focused interview.

## Purpose

The SPEC phase is a **conversation** to understand what the presentation is about before structuring it. It captures:
- The **key message** - what should stick with the audience
- The **audience** - who they are and what they know
- The **constraints** - time, format, non-goals

## Core Questions

Use these as a guide, not a rigid script. Flow naturally based on the conversation.

| Question | Why It Matters |
|----------|----------------|
| **What's the one thing you want the audience to remember?** | Forces clarity on the core message |
| **Who is the audience?** | Shapes language, depth, and examples |
| **How much time do you have?** | Determines scope and pacing |
| **What are you NOT covering?** | Prevents scope creep, sets expectations |

### Follow-up Questions

Adapt based on the topic:
- What do they already know about this?
- What's the call to action (if any)?
- Are there specific examples or demos to include?
- What's the context? (conference, internal meeting, training)

## Principles

1. **Interview, don't interrogate** - Conversational flow, not a form
2. **Key message first** - Everything else supports this
3. **No research** - External data/reports provided by user
4. **Capture the WHY** - Understanding intent helps BUILD phase

## Workflow

```
1. User provides topic
     ↓
2. Create session
     ↓
3. Interview: Key message → Audience → Time → Non-goals
     ↓
4. Clarify and refine
     ↓
5. Write spec.md
     ↓
6. Finalize → Ready for PLAN
```

## Output: spec.md

Keep it simple - this isn't a PRD. Sections:

| Section | Purpose |
|---------|---------|
| **Overview** | One sentence on what this presentation is |
| **Key Message** | The single most important takeaway |
| **Audience** | Who they are, what they know |
| **Time/Format** | Duration, setting, any constraints |
| **Non-Goals** | What you're explicitly NOT covering |
| **Context** | Background info, related materials |
| **Key Decisions** | Important choices made during spec |

## Template

→ See [templates/presentation-spec.md](templates/presentation-spec.md)

## Commands

| Command | Description |
|---------|-------------|
| `/presentation-session:spec [topic]` | Start new session |
| `/presentation-session:spec [session-id]` | Resume session |
| `/presentation-session:spec [session-id] finalize` | Finalize spec |
