# Implementation Plan

> **Session**: `2026-01-29_agent-view-walkthrough-slide_p4w8n3`
> **Status**: Complete
> **Spec**: [./spec.md](./spec.md)
> **Created**: 2026-01-29
> **Updated**: 2026-01-29

---

## Overview

- **Checkpoints**: 3 (0 complete)
- **Total Tasks**: 5

## ⬜ Checkpoint 1: Move AgentView component and install dependency

**Goal**: Move AgentView.vue into components/AgentView/ as a first-class Slidev component and ensure the markdown-it dependency is available. Verify the component loads in Slidev without errors.

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `to_add/agent_view/AgentView.vue` | 📄 exists | AgentView component in staging area |
| Before | `package.json` | 📄 exists | Project dependencies (missing markdown-it) |
| After | `components/AgentView/AgentView.vue` | ✨ new | AgentView component in components directory |
| After | `package.json` | 📝 modified | markdown-it added as dependency |

**Projected Structure**:
```
components/
├── AgentView/
│   └── AgentView.vue
├── Chart.vue
├── Terminal.vue
└── FileTree/
    ├── FileExplorer.vue
    └── FileTreeItem.vue
```

### Testing Strategy

**Approach**: Start dev server and verify component loads without console errors

**Verification Steps**:
- [ ] `npm run dev (check for compilation errors)`
- [ ] `Verify markdown-it resolves in the component import`

### ⬜ Task Group 1.1: Install markdown-it dependency

**Objective**: Add markdown-it to project dependencies so AgentView can render markdown content

#### ⬜ Task 1.1.1: Add markdown-it package

**File**: `package.json`

**Description**: AgentView.vue imports markdown-it for rendering markdown content within agent events. This dependency is not currently in package.json. Install it via pnpm along with its TypeScript types.

**Context to Load**:
- `package.json` (lines all) - Check current dependencies
- `to_add/agent_view/AgentView.vue` (lines 1-10) - Confirm markdown-it import statement

**Actions**:
- ⬜ **1.1.1.1**: RUN pnpm add markdown-it (`package.json`)
- ⬜ **1.1.1.2**: RUN pnpm add -D @types/markdown-it (`package.json`)

### ⬜ Task Group 1.2: Move AgentView to components directory

**Objective**: Move AgentView.vue from to_add/agent_view/ into components/AgentView/ to follow existing component organization pattern

#### ⬜ Task 1.2.1: Move AgentView.vue to components/AgentView/

**File**: `components/AgentView/AgentView.vue`

**Description**: Move the AgentView.vue component from to_add/agent_view/ into components/AgentView/ to match the project's component organization pattern (e.g., components/FileTree/). Slidev auto-imports components from the components/ directory.

**Context to Load**:
- `to_add/agent_view/AgentView.vue` (lines all) - Source file to move
- `components/FileTree/FileExplorer.vue` (lines 1-5) - Verify component organization pattern

**Actions**:
- ⬜ **1.2.1.1**: CREATE components/AgentView/ directory (`components/AgentView/`)
- ⬜ **1.2.1.2**: MOVE to_add/agent_view/AgentView.vue to components/AgentView/AgentView.vue (`components/AgentView/AgentView.vue`)

---

## ⬜ Checkpoint 2: Create agent walkthrough demo slide with AgentView

**Goal**: Create a new numbered slide (12-agent-walkthrough) that imports and uses the AgentView component with the skills/PDF extraction scenario events. Verify it renders and v-click stepping works.

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `components/AgentView/AgentView.vue` | 📄 exists | AgentView component (from CP1) |
| After | `slides/12-agent-walkthrough/index.md` | ✨ new | AgentView demo slide with skills scenario |

**Projected Structure**:
```
slides/
├── 00-title/
├── ...
├── 11-terminal-demo/
└── 12-agent-walkthrough/
```

### Testing Strategy

**Approach**: Visual verification in dev server with click-through navigation

**Verification Steps**:
- [ ] `npm run dev and navigate to the agent-walkthrough slide`
- [ ] `Click through each event step to verify v-click progression`
- [ ] `Verify all event types render correctly (thought, tool-call, tool-result, assistant, files-read)`

### ⬜ Task Group 2.1: Create the agent-walkthrough slide

**Objective**: Create slides/12-agent-walkthrough/index.md with proper Slidev frontmatter and an AgentView component populated with the skills/PDF extraction scenario events, using stepByStep mode for v-click progression.

#### ⬜ Task 2.1.1: Create slides/12-agent-walkthrough/index.md with AgentView and skills events

**File**: `slides/12-agent-walkthrough/index.md`

**Description**: Create a new Slidev slide that uses the AgentView component to display a skills/PDF extraction walkthrough. The slide should use frontmatter (theme: ../, layout: default, clicks: 8), pass query='Extract tables from invoice.pdf', stepByStep=true, height=420, and define ~8 events: (1) thought: recognizing pdf-processing skill, (2) files-read: Read SKILL.md, (3) tool-result: SKILL.md contents, (4) files-read: Read advanced-extraction.md, (5) tool-result: extraction instructions, (6) tool-call: Bash python scripts/extract.py, (7) tool-result: extraction output, (8) assistant: summary of extracted tables.

**Context to Load**:
- `components/AgentView/AgentView.vue` (lines all) - Understand props interface (events, query, stepByStep, height) and AgentEvent type definition
- `slides/11-terminal-demo/index.md` (lines all) - Reference for Slidev frontmatter pattern and component usage in slides

**Depends On**: Tasks 1.2.1

**Actions**:
- ⬜ **2.1.1.1**: CREATE slides/12-agent-walkthrough/ directory (`slides/12-agent-walkthrough/`)
- ⬜ **2.1.1.2**: CREATE slides/12-agent-walkthrough/index.md: ADD frontmatter (theme: ../, layout: default, clicks: 8), ADD AgentView component with query='Extract tables from invoice.pdf' stepByStep=true height=420, ADD events array with 8 skills/PDF extraction events covering thought, files-read, tool-result, tool-call, assistant types. USE components/AgentView/AgentView.vue props interface as reference. USE slides/11-terminal-demo/index.md as slide structure reference. (`slides/12-agent-walkthrough/index.md`)

---

## ⬜ Checkpoint 3: Move How Skills Work slide into deck and rebuild

**Goal**: Move the existing 08-how-skills-work.md from to_add/ into a new slide folder (13-how-skills-work), adapt frontmatter, run build:slides to regenerate index.md, and verify both slides render in the deck.

**Prerequisites**: Checkpoints 2

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `to_add/agent_view/08-how-skills-work.md` | 📄 exists | How Skills Work slide in staging |
| Before | `slides/12-agent-walkthrough/index.md` | 📄 exists | AgentView demo slide (from CP2) |
| After | `slides/13-how-skills-work/index.md` | ✨ new | How Skills Work slide in deck |
| After | `index.md` | 📝 modified | Regenerated slide index |

**Projected Structure**:
```
slides/
├── 00-title/
├── ...
├── 11-terminal-demo/
├── 12-agent-walkthrough/
└── 13-how-skills-work/
```

### Testing Strategy

**Approach**: Dev server verification of both slides and overall deck navigation

**Verification Steps**:
- [ ] `npm run build:slides (regenerate index.md)`
- [ ] `npm run dev and navigate through full deck`
- [ ] `Verify How Skills Work slide renders with all click steps`
- [ ] `Verify AgentView slide still renders correctly`
- [ ] `Confirm both slides are accessible in deck navigation`

### ⬜ Task Group 3.1: Move How Skills Work slide into slides directory

**Objective**: Copy 08-how-skills-work.md from to_add/ into slides/13-how-skills-work/index.md

#### ⬜ Task 3.1.1: Move 08-how-skills-work.md to slides/13-how-skills-work/index.md

**File**: `slides/13-how-skills-work/index.md`

**Description**: Move to_add/agent_view/08-how-skills-work.md into slides/13-how-skills-work/index.md. The frontmatter already has 'theme: ../' and 'layout: default' which is the correct pattern for slides in the slides/ directory. No frontmatter changes needed. The slide uses v-if='$clicks >= N' pattern for progressive reveal across 8 scenes showing how skills work.

**Context to Load**:
- `to_add/agent_view/08-how-skills-work.md` (lines all) - Source file to move — verify frontmatter and content
- `slides/11-terminal-demo/index.md` (lines 1-5) - Verify frontmatter pattern matches

**Actions**:
- ⬜ **3.1.1.1**: CREATE slides/13-how-skills-work/ directory (`slides/13-how-skills-work/`)
- ⬜ **3.1.1.2**: MOVE to_add/agent_view/08-how-skills-work.md to slides/13-how-skills-work/index.md (`slides/13-how-skills-work/index.md`)

### ⬜ Task Group 3.2: Rebuild slide index

**Objective**: Run build:slides to regenerate index.md, ensuring both new slides (12-agent-walkthrough and 13-how-skills-work) appear in the deck

#### ⬜ Task 3.2.1: Run build:slides to regenerate index.md

**File**: `index.md`

**Description**: Run 'npm run build:slides' to regenerate the root index.md file. The build script (scripts/build.ts) discovers all */index.md files in the slides/ directory in numerical order and generates the master index.md. This will pick up both slides/12-agent-walkthrough/ and slides/13-how-skills-work/.

**Context to Load**:
- `scripts/build.ts` (lines 1-20) - Understand how the build script discovers and orders slides

**Depends On**: Tasks 3.1.1

**Actions**:
- ⬜ **3.2.1.1**: RUN npm run build:slides (`index.md`)

---

---
*Auto-generated from plan.json on 2026-01-29 20:34*