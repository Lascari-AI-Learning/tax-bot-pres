# Implementation Plan

> **Session**: `2026-01-20_slide-folder-structure_k7m3x9`
> **Status**: Complete
> **Spec**: [./spec.md](./spec.md)
> **Created**: 2026-01-29
> **Updated**: 2026-01-29

---

## Overview

- **Checkpoints**: 4 (0 complete)
- **Total Tasks**: 11

## ⬜ Checkpoint 1: Single Slide Migration + Build Script

**Goal**: Migrate one slide (00-title) to folder structure and update build.ts to discover slides from folders (index.md). Verify the presentation renders with npm run dev.

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `slides/00-title.md` | 📄 exists | Flat title slide markdown |
| Before | `scripts/build.ts` | 📄 exists | Build script that globs *.md in slides/ |
| After | `slides/00-title/index.md` | ✨ new | Title slide in folder structure |
| After | `scripts/build.ts` | 📝 modified | Build script discovers folders with index.md |

**Projected Structure**:
```
slides/
├── 00-title/
│   └── index.md
scripts/
├── build.ts
```

### Testing Strategy

**Approach**: Manual verification via dev server

**Verification Steps**:
- [ ] `npm run build:slides`
- [ ] `npm run dev -- verify presentation loads and title slide renders`

### ⬜ Task Group 1.1: Create folder structure for title slide

**Objective**: Move 00-title.md into slides/00-title/index.md, preserving content exactly

#### ⬜ Task 1.1.1: Move title slide to folder structure

**File**: `slides/00-title/index.md`

**Description**: Create the directory slides/00-title/ and move the content of slides/00-title.md into slides/00-title/index.md. Then delete the original flat file slides/00-title.md. This is the first slide being migrated to the new folder-based architecture where each slide is a folder with index.md as the entry point.

**Context to Load**:
- `slides/00-title.md` (lines all) - Read the full content of the title slide to move into the new folder structure

**Actions**:
- ⬜ **1.1.1.1**: MOVE slides/00-title.md to slides/00-title/index.md: Create directory slides/00-title/, copy content exactly, delete original slides/00-title.md (`slides/00-title/index.md`)

### ⬜ Task Group 1.2: Update build script for folder discovery

**Objective**: Modify scripts/build.ts to discover slides from folder/index.md pattern instead of flat *.md files

#### ⬜ Task 1.2.1: Update build.ts glob pattern and src path generation

**File**: `scripts/build.ts`

**Description**: Update scripts/build.ts to discover slides from folder structure. Currently it globs '*.md' in the slides directory and generates 'src: ./slides/<file>' references. Change it to glob '*/index.md' to find folders containing index.md, then generate 'src: ./slides/<folder>/index.md' references. The sort order should use the folder name (e.g., '00-title') for ordering, same as before.

**Context to Load**:
- `scripts/build.ts` (lines all) - Understand current glob pattern and src generation logic to update for folder-based discovery

**Depends On**: Tasks 1.1.1

**Actions**:
- ⬜ **1.2.1.1**: UPDATE scripts/build.ts: REPLACE glob pattern '*.md' with '*/index.md' to discover folder-based slides (`scripts/build.ts`)
- ⬜ **1.2.1.2**: UPDATE scripts/build.ts: UPDATE src path generation to output './slides/<folder>/index.md' format, extracting folder name from glob result for sorting (`scripts/build.ts`)

### ⬜ Task Group 1.3: Verify end-to-end rendering

**Objective**: Run build:slides and dev to confirm the title slide renders correctly from folder structure

#### ⬜ Task 1.3.1: Verify build and rendering

**File**: `None`

**Description**: Run 'npm run build:slides' to regenerate index.md from the new folder structure. Verify the generated index.md contains the correct src path (./slides/00-title/index.md). This validates the entire pipeline: folder structure → build script discovery → correct index.md output.

**Context to Load**:
- `index.md` (lines all) - Verify the generated index.md contains correct folder-based src paths

**Depends On**: Tasks 1.2.1

**Actions**:
- ⬜ **1.3.1.1**: VERIFY: Run 'npm run build:slides' and confirm it succeeds
- ⬜ **1.3.1.2**: VERIFY: Check index.md contains 'src: ./slides/00-title/index.md' (`index.md`)

---

## ⬜ Checkpoint 2: Complete Slide Migration

**Goal**: Migrate all 8 remaining slides to folder structure. Verify full presentation renders correctly with npm run dev and npm run build.

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `slides/01-column-cards.md` | 📄 exists | Flat column-cards slide |
| Before | `slides/02-about-me.md` | 📄 exists | Flat about-me slide |
| Before | `slides/03-icon-list-content.md` | 📄 exists | Flat icon-list-content slide |
| Before | `slides/04-continuum-diagram.md` | 📄 exists | Flat continuum-diagram slide |
| Before | `slides/05-extremes-to-middle.md` | 📄 exists | Flat extremes-to-middle slide |
| Before | `slides/06-continuum-middle-ground.md` | 📄 exists | Flat continuum-middle-ground slide |
| Before | `slides/07-three-to-one-takeaway.md` | 📄 exists | Flat three-to-one-takeaway slide |
| Before | `slides/99-conclusion-lets-connect.md` | 📄 exists | Flat conclusion slide |
| After | `slides/01-column-cards/index.md` | ✨ new | Folder-based column-cards slide |
| After | `slides/02-about-me/index.md` | ✨ new | Folder-based about-me slide |
| After | `slides/03-icon-list-content/index.md` | ✨ new | Folder-based icon-list-content slide |
| After | `slides/04-continuum-diagram/index.md` | ✨ new | Folder-based continuum-diagram slide |
| After | `slides/05-extremes-to-middle/index.md` | ✨ new | Folder-based extremes-to-middle slide |
| After | `slides/06-continuum-middle-ground/index.md` | ✨ new | Folder-based continuum-middle-ground slide |
| After | `slides/07-three-to-one-takeaway/index.md` | ✨ new | Folder-based three-to-one-takeaway slide |
| After | `slides/99-conclusion-lets-connect/index.md` | ✨ new | Folder-based conclusion slide |

**Projected Structure**:
```
slides/
├── 00-title/
│   └── index.md
├── 01-column-cards/
│   └── index.md
├── ...
└── 99-conclusion-lets-connect/
    └── index.md
```

### Testing Strategy

**Approach**: Full presentation verification

**Verification Steps**:
- [ ] `npm run build:slides`
- [ ] `npm run dev -- verify all slides render correctly`
- [ ] `npm run build -- verify production build succeeds`

### ⬜ Task Group 2.1: Migrate all remaining slides to folders

**Objective**: Move 8 remaining flat .md slides into folder/index.md structure

#### ⬜ Task 2.1.1: Migrate slides 01-07 and 99 to folder structure

**File**: `slides/`

**Description**: For each of the 8 remaining flat slide files, create a folder with the same name (minus .md extension) and move the content into index.md within that folder. Then delete the original flat files. This follows the exact same pattern established in CP1 task 1.1.1 for the title slide. The 8 slides to migrate are: 01-column-cards, 02-about-me, 03-icon-list-content, 04-continuum-diagram, 05-extremes-to-middle, 06-continuum-middle-ground, 07-three-to-one-takeaway, 99-conclusion-lets-connect.

**Context to Load**:
- `slides/01-column-cards.md` (lines all) - Content to move into folder
- `slides/02-about-me.md` (lines all) - Content to move into folder
- `slides/03-icon-list-content.md` (lines all) - Content to move into folder
- `slides/04-continuum-diagram.md` (lines all) - Content to move into folder
- `slides/05-extremes-to-middle.md` (lines all) - Content to move into folder
- `slides/06-continuum-middle-ground.md` (lines all) - Content to move into folder
- `slides/07-three-to-one-takeaway.md` (lines all) - Content to move into folder
- `slides/99-conclusion-lets-connect.md` (lines all) - Content to move into folder

**Actions**:
- ⬜ **2.1.1.1**: MOVE slides/01-column-cards.md to slides/01-column-cards/index.md: Create dir, copy content, delete original (`slides/01-column-cards/index.md`)
- ⬜ **2.1.1.2**: MOVE slides/02-about-me.md to slides/02-about-me/index.md: Create dir, copy content, delete original (`slides/02-about-me/index.md`)
- ⬜ **2.1.1.3**: MOVE slides/03-icon-list-content.md to slides/03-icon-list-content/index.md: Create dir, copy content, delete original (`slides/03-icon-list-content/index.md`)
- ⬜ **2.1.1.4**: MOVE slides/04-continuum-diagram.md to slides/04-continuum-diagram/index.md: Create dir, copy content, delete original (`slides/04-continuum-diagram/index.md`)
- ⬜ **2.1.1.5**: MOVE slides/05-extremes-to-middle.md to slides/05-extremes-to-middle/index.md: Create dir, copy content, delete original (`slides/05-extremes-to-middle/index.md`)
- ⬜ **2.1.1.6**: MOVE slides/06-continuum-middle-ground.md to slides/06-continuum-middle-ground/index.md: Create dir, copy content, delete original (`slides/06-continuum-middle-ground/index.md`)
- ⬜ **2.1.1.7**: MOVE slides/07-three-to-one-takeaway.md to slides/07-three-to-one-takeaway/index.md: Create dir, copy content, delete original (`slides/07-three-to-one-takeaway/index.md`)
- ⬜ **2.1.1.8**: MOVE slides/99-conclusion-lets-connect.md to slides/99-conclusion-lets-connect/index.md: Create dir, copy content, delete original (`slides/99-conclusion-lets-connect/index.md`)

### ⬜ Task Group 2.2: Verify full presentation

**Objective**: Run build:slides, dev, and build to confirm all slides render correctly

#### ⬜ Task 2.2.1: Verify full presentation renders

**File**: `None`

**Description**: Run npm run build:slides to regenerate index.md. Verify the generated index.md contains all 9 slides referenced with folder-based paths. Run npm run build to verify production build succeeds. This validates the complete migration is working end-to-end.

**Context to Load**:
- `index.md` (lines all) - Verify all 9 slides referenced with folder paths

**Depends On**: Tasks 2.1.1

**Actions**:
- ⬜ **2.2.1.1**: VERIFY: Run 'npm run build:slides' and confirm success
- ⬜ **2.2.1.2**: VERIFY: Check index.md contains all 9 slides with folder-based src paths (./slides/XX-name/index.md) (`index.md`)
- ⬜ **2.2.1.3**: VERIFY: Run 'npm run build' and confirm production build succeeds

---

## ⬜ Checkpoint 3: Template Generation System Update

**Goal**: Update generate-slide.ts to output slides as folders (slides/XX-name/index.md instead of slides/XX-name.md). Verify npm run generate:slide creates correct structure.

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `scripts/generate-slide.ts` | 📄 exists | Generates slides as flat files (slides/name.md) |
| After | `scripts/generate-slide.ts` | 📝 modified | Generates slides as folders (slides/name/index.md) |

**Projected Structure**:
```
scripts/
├── generate-slide.ts
```

### Testing Strategy

**Approach**: Generate a test slide and verify folder output

**Verification Steps**:
- [ ] `npm run generate:slide -- --template=title --name=99-test --title='Test' --subtitle='Test'`
- [ ] `Verify slides/99-test/index.md was created`
- [ ] `Clean up test slide`

### ⬜ Task Group 3.1: Update generate-slide.ts output path

**Objective**: Change output from slides/name.md to slides/name/index.md, creating the directory first

#### ⬜ Task 3.1.1: Update output path logic in generate-slide.ts

**File**: `scripts/generate-slide.ts`

**Description**: Update the generate-slide.ts script to output slides as folders instead of flat files. Currently the script writes to slides/<name>.md (line 122: const outputFile = path.join(slidesDir, `${config.name}.md`)). Change this to write to slides/<name>/index.md instead. Also add directory creation (fs.mkdir with recursive:true) before writing the file, since the folder won't exist yet.

**Context to Load**:
- `scripts/generate-slide.ts` (lines 100-153) - Understand the main() function, specifically the outputFile path construction (line 122) and file writing (line 142)

**Actions**:
- ⬜ **3.1.1.1**: UPDATE scripts/generate-slide.ts: REPLACE outputFile path from `path.join(slidesDir, `${config.name}.md`)` to `path.join(slidesDir, config.name, 'index.md')` (`scripts/generate-slide.ts`)
- ⬜ **3.1.1.2**: ADD scripts/generate-slide.ts: INSERT `await fs.mkdir(path.join(slidesDir, config.name), { recursive: true })` BEFORE the writeFile call to create the slide folder (`scripts/generate-slide.ts`)

### ⬜ Task Group 3.2: Verify template generation

**Objective**: Test that generate:slide creates folder-based slide structure

#### ⬜ Task 3.2.1: Test generate:slide creates folder output

**File**: `None`

**Description**: Run the generate:slide command with the title template to verify it creates a folder-based slide (slides/98-test/index.md) instead of a flat file. Then clean up the test slide.

**Depends On**: Tasks 3.1.1

**Actions**:
- ⬜ **3.2.1.1**: VERIFY: Run 'npm run generate:slide -- --template=title --name=98-test --title=Test --subtitle=Test' and confirm slides/98-test/index.md is created
- ⬜ **3.2.1.2**: DELETE slides/98-test/ directory to clean up test slide

---

## ⬜ Checkpoint 4: Slidev Skill & Documentation Update

**Goal**: Update .claude/skills/slidev/ and CLAUDE.md to reflect the new folder-based slide structure, conventions, and workflows.

**Prerequisites**: Checkpoints 1, 2, 3

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/skills/slidev/SKILL.md` | 📄 exists | Slidev skill documentation |
| Before | `.claude/skills/slidev/references/templates.md` | 📄 exists | Template reference docs |
| Before | `CLAUDE.md` | 📄 exists | Project instructions for Claude Code |
| After | `.claude/skills/slidev/SKILL.md` | 📝 modified | Updated with folder-based structure conventions |
| After | `.claude/skills/slidev/references/templates.md` | 📝 modified | Updated template references for folder output |
| After | `CLAUDE.md` | 📝 modified | Updated architecture docs for folder structure |

**Projected Structure**:
```
.claude/skills/slidev/
├── SKILL.md
├── references/
│   ├── templates.md
│   └── playwright-workflow.md
CLAUDE.md
```

### Testing Strategy

**Approach**: Documentation review

**Verification Steps**:
- [ ] `Review all updated docs reference folder structure correctly`
- [ ] `Verify no references to old flat-file structure remain`

### ⬜ Task Group 4.1: Update Slidev skill docs

**Objective**: Update .claude/skills/slidev/ documentation to reflect folder-based slide structure

#### ⬜ Task 4.1.1: Update SKILL.md conventions section

**File**: `.claude/skills/slidev/SKILL.md`

**Description**: Update the Slidev skill documentation to reflect the new folder-based slide structure. The Naming conventions section (line 107) currently references flat files like '01-about-me.md'. Change these to folder-based references like '01-about-me/index.md'. Also add a new section documenting the slide folder convention: each slide is a folder with index.md as entry point, optional assets/ subfolder, and room for future complexity (components, code files).

**Context to Load**:
- `.claude/skills/slidev/SKILL.md` (lines 100-122) - Understand current Conventions and Folder Structure sections to update for folder-based slides

**Actions**:
- ⬜ **4.1.1.1**: UPDATE .claude/skills/slidev/SKILL.md: UPDATE Naming section line 107 - Change slide file reference from '01-about-me.md, 02-introduction.md' to '01-about-me/index.md, 02-introduction/index.md' folder pattern (`.claude/skills/slidev/SKILL.md`)
- ⬜ **4.1.1.2**: ADD .claude/skills/slidev/SKILL.md: ADD new 'Slide Folder Structure' section AFTER Naming section documenting: each slide = folder with index.md entry point, optional assets/ for images/videos, permissive structure for future complexity (Vue components, code files) (`.claude/skills/slidev/SKILL.md`)

#### ⬜ Task 4.1.2: Update templates.md reference

**File**: `.claude/skills/slidev/references/templates.md`

**Description**: Review and update templates.md to ensure any references to slide files reflect the new folder-based structure. This file primarily documents slide-templates/ (which doesn't change), but may reference slides/ flat files that need updating.

**Context to Load**:
- `.claude/skills/slidev/references/templates.md` (lines all) - Check for any references to flat slide files that need updating to folder paths

**Actions**:
- ⬜ **4.1.2.1**: UPDATE .claude/skills/slidev/references/templates.md: UPDATE any references to flat slide files (slides/*.md) to folder-based paths (slides/*/index.md) if present (`.claude/skills/slidev/references/templates.md`)

### ⬜ Task Group 4.2: Update CLAUDE.md

**Objective**: Update project instructions to reflect folder-based slide architecture

#### ⬜ Task 4.2.1: Update CLAUDE.md architecture and workflow sections

**File**: `CLAUDE.md`

**Description**: Update CLAUDE.md to reflect the new folder-based slide structure throughout. Key areas: (1) Slide System description - change from 'markdown files in slides/' to 'folders in slides/ with index.md entry points', (2) Key Directories - update slides/ description, (3) Slide Template System - update template output description to reference folder creation, (4) Development Workflow - update steps to reflect folder-based generation. Also update any examples showing flat file patterns.

**Context to Load**:
- `CLAUDE.md` (lines all) - Identify all references to flat slide files that need updating to folder structure

**Actions**:
- ⬜ **4.2.1.1**: UPDATE CLAUDE.md: UPDATE 'Slide System' description - change from 'stored as markdown files' to 'stored as folders with index.md entry points' (`CLAUDE.md`)
- ⬜ **4.2.1.2**: UPDATE CLAUDE.md: UPDATE 'Key Directories' slides/ description to reflect folder-based structure with index.md and optional assets/ (`CLAUDE.md`)
- ⬜ **4.2.1.3**: UPDATE CLAUDE.md: UPDATE Slide Template System section to note generate:slide creates folders (slides/XX-name/index.md) (`CLAUDE.md`)
- ⬜ **4.2.1.4**: UPDATE CLAUDE.md: UPDATE Development Workflow steps to reference folder-based slide generation and editing (`CLAUDE.md`)

### ⬜ Task Group 4.3: Verify no stale references

**Objective**: Confirm no documentation still references old flat-file slide pattern

#### ⬜ Task 4.3.1: Search for old flat-file patterns in docs

**File**: `None`

**Description**: Grep across documentation files (.md) for patterns like 'slides/*.md', '01-about-me.md', or other flat-file references that should now be folder-based. Fix any remaining stale references.

**Depends On**: Tasks 4.1.1, 4.1.2, 4.2.1

**Actions**:
- ⬜ **4.3.1.1**: VERIFY: Grep for flat-file slide references (e.g., 'slides/*.md', '01-about-me.md' pattern) across CLAUDE.md and .claude/skills/slidev/ to ensure none remain

---

---
*Auto-generated from plan.json on 2026-01-29 12:26*