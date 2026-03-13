# Implementation Plan

> **Session**: `2026-02-03_presentation-session-workflow_p7x2m4`
> **Status**: Complete
> **Spec**: [./spec.md](./spec.md)
> **Created**: 2026-02-03
> **Updated**: 2026-02-03

---

## Overview

- **Checkpoints**: 5 (0 complete)
- **Total Tasks**: 11

## ⬜ Checkpoint 1: Create Presentation-Session Skill Structure

**Goal**: Establish the basic skill folder structure and SKILL.md entry point for the presentation-session workflow. Create minimal SPEC phase that can interview a user about a presentation topic.

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/skills/agent-session/SKILL.md` | 📄 exists | Generic agent-session skill to reference |
| After | `.claude/skills/presentation-session/SKILL.md` | ✨ new | Main skill entry point |
| After | `.claude/skills/presentation-session/spec/OVERVIEW.md` | ✨ new | Spec phase instructions |

**Projected Structure**:
```
.claude/skills/
├── presentation-session/
│   ├── SKILL.md
│   └── spec/
│       └── OVERVIEW.md
├── agent-session/
└── slidev/
```

### Testing Strategy

**Approach**: Manual verification of skill structure and content

**Verification Steps**:
- [ ] `Verify .claude/skills/presentation-session/SKILL.md exists`
- [ ] `Verify .claude/skills/presentation-session/spec/OVERVIEW.md exists`
- [ ] `Check that SKILL.md references spec phase correctly`

### ⬜ Task Group 1.1: Create Skill Foundation

**Objective**: Create the presentation-session skill folder and main SKILL.md entry point

#### ⬜ Task 1.1.1: Create SKILL.md entry point

**File**: `.claude/skills/presentation-session/SKILL.md`

**Description**: Create the main skill entry point with frontmatter and basic structure. This is a presentation-specific workflow (SPEC → PLAN → BUILD) optimized for linear slide creation rather than adaptive code implementation.

**Context to Load**:
- `.claude/skills/agent-session/SKILL.md` (lines all) - Reference the generic agent-session structure and adapt for presentations

**Actions**:
- ⬜ **1.1.1.1**: CREATE .claude/skills/presentation-session/SKILL.md with frontmatter (name: presentation-session, description: Presentation workflow for Slidev) and basic SPEC → PLAN → BUILD overview (`.claude/skills/presentation-session/SKILL.md`)

### ⬜ Task Group 1.2: Create SPEC Phase

**Objective**: Create the spec/OVERVIEW.md with interview-focused workflow for presentations

#### ⬜ Task 1.2.1: Create spec/OVERVIEW.md

**File**: `.claude/skills/presentation-session/spec/OVERVIEW.md`

**Description**: Create the SPEC phase documentation. Focus on pseudo-structured interview for capturing: (1) key idea/takeaway, (2) audience, (3) time constraints, (4) non-goals. No research - external data provided manually. Flow naturally, adapt to conversation.

**Context to Load**:
- `.claude/skills/agent-session/spec/OVERVIEW.md` (lines all) - Reference generic spec phase and simplify for presentations
- `agents/sessions/2026-02-03_presentation-session-workflow_p7x2m4/spec.md` (lines 38-72) - Reference the spec's detailed goals for SPEC phase requirements

**Depends On**: Tasks 1.1.1

**Actions**:
- ⬜ **1.2.1.1**: CREATE .claude/skills/presentation-session/spec/OVERVIEW.md with presentation-focused interview workflow. Core questions: (1) What's the one thing audience should remember? (2) Who is the audience? (3) How much time? (4) What are you NOT covering? Flow naturally, not rigid. (`.claude/skills/presentation-session/spec/OVERVIEW.md`)

#### ⬜ Task 1.2.2: Create spec template

**File**: `.claude/skills/presentation-session/spec/templates/presentation-spec.md`

**Description**: Create a presentation-specific spec template that captures: overview, key message, audience, time, non-goals, and context. Simpler than generic spec - focused on presentation essentials.

**Context to Load**:
- `.claude/skills/agent-session/spec/templates/spec.md` (lines all) - Reference generic spec template and adapt for presentations

**Depends On**: Tasks 1.2.1

**Actions**:
- ⬜ **1.2.2.1**: CREATE .claude/skills/presentation-session/spec/templates/presentation-spec.md with sections: Overview, Key Message, Audience, Time/Format, Non-Goals, Context, Key Decisions (`.claude/skills/presentation-session/spec/templates/presentation-spec.md`)

---

## ⬜ Checkpoint 2: Implement PLAN Phase with File Tree Storyboard

**Goal**: Create the PLAN phase that outputs a pseudo-structured file tree storyboard showing each slide and its content. The file tree IS the storyboard - bird's eye view of the presentation.

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/skills/presentation-session/SKILL.md` | 📄 exists | From checkpoint 1 |
| Before | `.claude/skills/presentation-session/spec/OVERVIEW.md` | 📄 exists | From checkpoint 1 |
| After | `.claude/skills/presentation-session/plan/OVERVIEW.md` | ✨ new | Plan phase instructions |
| After | `.claude/skills/presentation-session/plan/templates/storyboard.md` | ✨ new | File tree storyboard template |

**Projected Structure**:
```
.claude/skills/presentation-session/
├── SKILL.md
├── spec/
│   └── OVERVIEW.md
└── plan/
    ├── OVERVIEW.md
    └── templates/
        └── storyboard.md
```

### Testing Strategy

**Approach**: Manual verification of plan phase structure

**Verification Steps**:
- [ ] `Verify plan/OVERVIEW.md exists and documents file tree output format`
- [ ] `Verify storyboard template shows pseudo-structured format`
- [ ] `Check that SKILL.md references plan phase`

### ⬜ Task Group 2.1: Create Plan Phase Documentation

**Objective**: Create plan/OVERVIEW.md explaining the file tree storyboard approach

#### ⬜ Task 2.1.1: Create plan/OVERVIEW.md

**File**: `.claude/skills/presentation-session/plan/OVERVIEW.md`

**Description**: Create the PLAN phase documentation. Explain the file tree storyboard approach: go through slide by slide, output shows each slide folder and what it should contain. Template specification is OPTIONAL - helps BUILD but user may not know templates. Primary purpose: bird's eye view of what you're saying.

**Context to Load**:
- `.claude/skills/agent-session/plan/OVERVIEW.md` (lines all) - Reference generic plan phase and adapt for presentations (much simpler)
- `agents/sessions/2026-02-03_presentation-session-workflow_p7x2m4/spec.md` (lines 46-58) - Reference the spec's detailed goals for PLAN file tree format

**Actions**:
- ⬜ **2.1.1.1**: CREATE .claude/skills/presentation-session/plan/OVERVIEW.md with file tree storyboard workflow. Explain: (1) Go slide by slide, (2) Output is file tree showing each slide + content, (3) Template is optional, (4) Primary purpose is bird's eye view (`.claude/skills/presentation-session/plan/OVERVIEW.md`)

### ⬜ Task Group 2.2: Create Storyboard Template

**Objective**: Create the file tree storyboard template with optional template hints

#### ⬜ Task 2.2.1: Create storyboard template

**File**: `.claude/skills/presentation-session/plan/templates/storyboard.md`

**Description**: Create an example storyboard template showing the pseudo-structured file tree format. Include: numbered slide folders, key content/message for each slide, optional template hints (e.g., template: column-cards). This is what PLAN outputs - the visual outline.

**Context to Load**:
- `.claude/skills/slidev/SKILL.md` (lines 106-140) - Reference actual slide folder structure conventions
- `slide-templates/column-cards/description.md` (lines all) - Example template description to understand template hint format

**Depends On**: Tasks 2.1.1

**Actions**:
- ⬜ **2.2.1.1**: CREATE .claude/skills/presentation-session/plan/templates/storyboard.md showing example file tree format with slide folders, content descriptions, and optional template hints (`.claude/skills/presentation-session/plan/templates/storyboard.md`)

---

## ⬜ Checkpoint 3: Implement BUILD Phase with Dual Modes

**Goal**: Create the BUILD phase with two modes: full-draft (generate entire presentation) and single-slide (iterate on specific slide). Single-slide supports targeting by folder name, slide number, or conversational description.

**Prerequisites**: Checkpoints 2

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/skills/presentation-session/SKILL.md` | 📄 exists | From checkpoint 1 |
| Before | `.claude/skills/presentation-session/spec/OVERVIEW.md` | 📄 exists | From checkpoint 1 |
| Before | `.claude/skills/presentation-session/plan/OVERVIEW.md` | 📄 exists | From checkpoint 2 |
| After | `.claude/skills/presentation-session/build/OVERVIEW.md` | ✨ new | Build phase instructions with both modes |

**Projected Structure**:
```
.claude/skills/presentation-session/
├── SKILL.md
├── spec/
│   └── OVERVIEW.md
├── plan/
│   ├── OVERVIEW.md
│   └── templates/
└── build/
    └── OVERVIEW.md
```

### Testing Strategy

**Approach**: Manual verification of build phase structure

**Verification Steps**:
- [ ] `Verify build/OVERVIEW.md documents both full-draft and single-slide modes`
- [ ] `Verify single-slide targeting methods are documented (folder name, number, conversational)`
- [ ] `Check that build mode reads spec/plan for context`

### ⬜ Task Group 3.1: Create Build Phase Documentation

**Objective**: Create build/OVERVIEW.md explaining dual modes and slide targeting

#### ⬜ Task 3.1.1: Create build/OVERVIEW.md

**File**: `.claude/skills/presentation-session/build/OVERVIEW.md`

**Description**: Create the BUILD phase documentation with two modes: (1) Full-draft mode - generate entire presentation from storyboard, (2) Single-slide mode - hone in on specific slide to iterate/refine. Single-slide targeting supports: folder name (03-the-question), slide number (slide 3), or conversational description. BUILD always reads spec/plan for context - understands overall narrative even when working on one slide.

**Context to Load**:
- `.claude/skills/agent-session/build/OVERVIEW.md` (lines all) - Reference generic build phase and adapt for presentations (much simpler)
- `agents/sessions/2026-02-03_presentation-session-workflow_p7x2m4/spec.md` (lines 60-70) - Reference the spec's detailed goals for BUILD phase requirements
- `.claude/skills/slidev/SKILL.md` (lines all) - Reference slidev conventions for actual slide generation

**Actions**:
- ⬜ **3.1.1.1**: CREATE .claude/skills/presentation-session/build/OVERVIEW.md with dual modes: (1) Full-draft - generate all slides, (2) Single-slide - target by folder name, number, or description. Both modes read spec/plan for context. (`.claude/skills/presentation-session/build/OVERVIEW.md`)

---

## ⬜ Checkpoint 4: Create Skill Commands and Integration

**Goal**: Create the slash commands that invoke each phase and wire them into the settings.json. Ensure commands can be invoked and the skill is discoverable.

**Prerequisites**: Checkpoints 3

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/skills/presentation-session/` | 📄 exists | Complete skill structure from checkpoints 1-3 |
| After | `.claude/commands/presentation-session/spec.md` | ✨ new | Spec phase command |
| After | `.claude/commands/presentation-session/plan.md` | ✨ new | Plan phase command |
| After | `.claude/commands/presentation-session/build.md` | ✨ new | Full draft build command |
| After | `.claude/commands/presentation-session/slide.md` | ✨ new | Single slide build command |

**Projected Structure**:
```
.claude/commands/presentation-session/
├── spec.md
├── plan.md
├── build.md
└── slide.md
```

### Testing Strategy

**Approach**: Verify command files exist and settings.json is updated

**Verification Steps**:
- [ ] `Verify all command files exist in .claude/commands/presentation-session/`
- [ ] `Verify commands reference the skill correctly`
- [ ] `Check that commands follow the existing command patterns in the repo`

### ⬜ Task Group 4.1: Create Command Files

**Objective**: Create the slash command files for spec, plan, build, and slide modes

#### ⬜ Task 4.1.1: Create spec command

**File**: `.claude/commands/presentation-session/spec.md`

**Description**: Create the /presentation-session:spec command. This invokes the SPEC phase interview workflow. Support: new session (with topic), resume session (by ID), or finalize. SIMPLER than agent-session - pseudo-structured interview for presentations only.

**Context to Load**:
- `.claude/commands/agent-session/spec.md` (lines all) - Reference generic spec command and simplify for presentations
- `.claude/skills/presentation-session/spec/OVERVIEW.md` (lines all) - Reference the presentation-session spec phase instructions

**Actions**:
- ⬜ **4.1.1.1**: CREATE .claude/commands/presentation-session/spec.md with frontmatter and simplified interview workflow for presentations (`.claude/commands/presentation-session/spec.md`)

#### ⬜ Task 4.1.2: Create plan command

**File**: `.claude/commands/presentation-session/plan.md`

**Description**: Create the /presentation-session:plan command. This invokes the PLAN phase to output a file tree storyboard. Goes slide by slide to build the visual outline. SIMPLER than agent-session - no checkpoints/IDK, just file tree output.

**Context to Load**:
- `.claude/commands/agent-session/plan.md` (lines all) - Reference generic plan command and simplify for presentations
- `.claude/skills/presentation-session/plan/OVERVIEW.md` (lines all) - Reference the presentation-session plan phase instructions

**Depends On**: Tasks 4.1.1

**Actions**:
- ⬜ **4.1.2.1**: CREATE .claude/commands/presentation-session/plan.md with frontmatter and file tree storyboard workflow (`.claude/commands/presentation-session/plan.md`)

#### ⬜ Task 4.1.3: Create build command

**File**: `.claude/commands/presentation-session/build.md`

**Description**: Create the /presentation-session:build command. This invokes the BUILD phase in full-draft mode - generates entire presentation from the storyboard. Reads spec/plan for context, generates all slides using slidev conventions.

**Context to Load**:
- `.claude/commands/agent-session/build.md` (lines all) - Reference generic build command and simplify for presentations
- `.claude/skills/presentation-session/build/OVERVIEW.md` (lines all) - Reference the presentation-session build phase instructions

**Depends On**: Tasks 4.1.2

**Actions**:
- ⬜ **4.1.3.1**: CREATE .claude/commands/presentation-session/build.md with frontmatter and full-draft generation workflow (`.claude/commands/presentation-session/build.md`)

#### ⬜ Task 4.1.4: Create slide command

**File**: `.claude/commands/presentation-session/slide.md`

**Description**: Create the /presentation-session:slide command. This invokes single-slide mode - target a specific slide to iterate/refine. Supports: folder name (03-the-question), slide number (slide 3), or conversational description. Reads spec/plan for narrative context.

**Context to Load**:
- `.claude/skills/presentation-session/build/OVERVIEW.md` (lines all) - Reference the single-slide targeting documentation
- `.claude/skills/slidev/SKILL.md` (lines all) - Reference slidev conventions for slide generation

**Depends On**: Tasks 4.1.3

**Actions**:
- ⬜ **4.1.4.1**: CREATE .claude/commands/presentation-session/slide.md with frontmatter and single-slide targeting workflow (folder name, number, or description) (`.claude/commands/presentation-session/slide.md`)

---

## ⬜ Checkpoint 5: Polish and Documentation

**Goal**: Update SKILL.md with complete documentation, add examples, and ensure the workflow is self-documenting. Cross-reference with slidev skill for template information.

**Prerequisites**: Checkpoints 4

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/skills/presentation-session/` | 📄 exists | Complete skill from checkpoints 1-4 |
| Before | `.claude/commands/presentation-session/` | 📄 exists | Commands from checkpoint 4 |
| After | `.claude/skills/presentation-session/SKILL.md` | 📝 modified | Complete documentation with examples |
| After | `.claude/skills/presentation-session/references/` | ✨ new | Reference documentation |

**Projected Structure**:
```
.claude/skills/presentation-session/
├── SKILL.md (enhanced)
├── spec/
├── plan/
├── build/
└── references/
```

### Testing Strategy

**Approach**: Review documentation completeness

**Verification Steps**:
- [ ] `Verify SKILL.md has complete command table`
- [ ] `Verify workflow diagram is included`
- [ ] `Check cross-references to slidev skill`

### ⬜ Task Group 5.1: Complete SKILL.md Documentation

**Objective**: Update SKILL.md with complete command table, workflow diagram, and cross-references

#### ⬜ Task 5.1.1: Enhance SKILL.md with complete documentation

**File**: `.claude/skills/presentation-session/SKILL.md`

**Description**: Update the SKILL.md created in Checkpoint 1 with: (1) Complete command table showing all 4 commands, (2) ASCII workflow diagram showing SPEC → PLAN → BUILD flow, (3) Session directory structure, (4) Cross-reference to slidev skill for template information, (5) When to use this skill vs agent-session

**Context to Load**:
- `.claude/skills/presentation-session/SKILL.md` (lines all) - Read existing SKILL.md from Checkpoint 1 to enhance
- `.claude/skills/agent-session/SKILL.md` (lines all) - Reference agent-session SKILL.md structure for consistency
- `.claude/skills/slidev/SKILL.md` (lines all) - Reference slidev skill for cross-reference section

**Actions**:
- ⬜ **5.1.1.1**: UPDATE .claude/skills/presentation-session/SKILL.md: ADD command table with all 4 commands (`.claude/skills/presentation-session/SKILL.md`)
- ⬜ **5.1.1.2**: UPDATE .claude/skills/presentation-session/SKILL.md: ADD ASCII workflow diagram (SPEC → PLAN → BUILD) (`.claude/skills/presentation-session/SKILL.md`)
- ⬜ **5.1.1.3**: UPDATE .claude/skills/presentation-session/SKILL.md: ADD session directory structure (`.claude/skills/presentation-session/SKILL.md`)
- ⬜ **5.1.1.4**: UPDATE .claude/skills/presentation-session/SKILL.md: ADD cross-reference to slidev skill for templates (`.claude/skills/presentation-session/SKILL.md`)
- ⬜ **5.1.1.5**: UPDATE .claude/skills/presentation-session/SKILL.md: ADD 'When to Use' section distinguishing from agent-session (`.claude/skills/presentation-session/SKILL.md`)

---

---
*Auto-generated from plan.json on 2026-02-03 11:34*