# Implementation Plan

> **Session**: `2026-01-29_file-tree-template_cd0amg`
> **Status**: Complete
> **Spec**: [./spec.md](./spec.md)
> **Created**: 2026-01-29
> **Updated**: 2026-01-29

---

## Overview

- **Checkpoints**: 3 (0 complete)
- **Total Tasks**: 15

## ⬜ Checkpoint 1: Working File Explorer Slide

**Goal**: Move FileExplorer.vue and FileTreeItem.vue into components/, create example file tree data in the slide's assets/filetree/ folder, create a numbered slide (08-file-explorer/index.md) that uses the component, rebuild index.md, and verify it renders end-to-end with npm run dev.

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `to_add/filetree/FileExplorer.vue` | 📄 exists | Source file explorer component (298 lines) with glob loading from ../decks/**/* |
| Before | `to_add/filetree/FileTreeItem.vue` | 📄 exists | Source recursive tree item component (84 lines) |
| After | `components/FileExplorer.vue` | ✨ new | File explorer component with glob path updated to ../slides/**/assets/filetree/**/* |
| After | `components/FileTreeItem.vue` | ✨ new | Tree item child component (unchanged from source) |
| After | `slides/08-file-explorer/index.md` | ✨ new | Slide using FileExplorer component |
| After | `slides/08-file-explorer/assets/filetree/my-fastapi-app/main.py` | ✨ new | Example file tree data |
| After | `slides/08-file-explorer/assets/filetree/my-fastapi-app/models.py` | ✨ new | Example file tree data |
| After | `slides/08-file-explorer/assets/filetree/my-fastapi-app/routes/api.py` | ✨ new | Example file tree data |
| After | `slides/08-file-explorer/assets/filetree/my-fastapi-app/requirements.txt` | ✨ new | Example file tree data |
| After | `slides/08-file-explorer/assets/filetree/my-fastapi-app/README.md` | ✨ new | Example file tree data |

**Projected Structure**:
```
components/
├── FileExplorer.vue
└── FileTreeItem.vue
slides/08-file-explorer/
├── index.md
└── assets/
    └── filetree/
        └── my-fastapi-app/
            ├── main.py
            ├── models.py
            ├── routes/
            │   └── api.py
            ├── requirements.txt
            └── README.md
```

### Testing Strategy

**Approach**: Manual verification via dev server

**Verification Steps**:
- [ ] `npm run build:slides`
- [ ] `npm run dev`
- [ ] `Navigate to the file explorer slide and verify the tree renders with example files`
- [ ] `Click files in the tree and verify syntax-highlighted code appears in the right panel`

### ⬜ Task Group 1.1: Register Components

**Objective**: Move FileExplorer.vue and FileTreeItem.vue into components/ and update the glob import path to load from slides/**/assets/filetree/**/*

#### ⬜ Task 1.1.1: Create FileExplorer.vue in components/

**File**: `components/FileExplorer.vue`

**Description**: Copy FileExplorer.vue from to_add/filetree/ into components/ (Slidev auto-registers components from this directory). Update the import.meta.glob path from '../decks/**/*' to '../slides/**/assets/filetree/**/*' so it scans file tree data from slide asset folders. Update the tree-building logic to parse the new path structure — the dir prop format will be '<slide-folder>/filetree/<project-name>' and the glob results will contain paths like '../slides/08-file-explorer/assets/filetree/my-fastapi-app/main.py'. The path parsing needs to extract the relative path after the filetree/<project-name>/ segment.

**Context to Load**:
- `to_add/filetree/FileExplorer.vue` (lines 1-298) - Source component to copy and modify. Contains glob path on line 14, tree-building logic in fileTree computed (lines 33-94), and path parsing that needs updating.

**Actions**:
- ⬜ **1.1.1.1**: CREATE components/FileExplorer.vue: MIRROR to_add/filetree/FileExplorer.vue (`components/FileExplorer.vue`)
- ⬜ **1.1.1.2**: UPDATE components/FileExplorer.vue: REPLACE glob path '../decks/**/*' with '../slides/**/assets/filetree/**/*' on line 14 (`components/FileExplorer.vue`)
- ⬜ **1.1.1.3**: UPDATE components/FileExplorer.vue: UPDATE fileTree computed (lines 33-94) to parse new glob path structure. The targetDirFull should match against 'slides/<dir-part>/assets/filetree/<project-part>' pattern. Extract relative file path after the full dir match. (`components/FileExplorer.vue`)
- ⬜ **1.1.1.4**: UPDATE components/FileExplorer.vue: UPDATE FileTreeItem import path from './FileTreeItem.vue' to './FileTreeItem.vue' (stays the same since both are in components/) (`components/FileExplorer.vue`)

#### ⬜ Task 1.1.2: Create FileTreeItem.vue in components/

**File**: `components/FileTreeItem.vue`

**Description**: Copy FileTreeItem.vue from to_add/filetree/ into components/. No modifications needed — this component is a pure recursive tree renderer with no path dependencies.

**Context to Load**:
- `to_add/filetree/FileTreeItem.vue` (lines 1-84) - Source component to copy. Pure recursive tree node renderer with no external dependencies.

**Actions**:
- ⬜ **1.1.2.1**: CREATE components/FileTreeItem.vue: MIRROR to_add/filetree/FileTreeItem.vue exactly (no modifications needed) (`components/FileTreeItem.vue`)

### ⬜ Task Group 1.2: Create Example File Tree Data

**Objective**: Create a realistic example project file structure under slides/08-file-explorer/assets/filetree/ for the FileExplorer component to display.

#### ⬜ Task 1.2.1: Create example FastAPI project files

**File**: `slides/08-file-explorer/assets/filetree/my-fastapi-app/`

**Description**: Create a small but realistic FastAPI project structure with real Python code. The files should be concise (10-30 lines each) and demonstrate a believable project structure. Files: main.py (FastAPI app setup), models.py (Pydantic models), routes/api.py (API endpoints), requirements.txt (dependencies), README.md (project description).

**Actions**:
- ⬜ **1.2.1.1**: CREATE slides/08-file-explorer/assets/filetree/my-fastapi-app/main.py: FastAPI app initialization with uvicorn runner (~15 lines) (`slides/08-file-explorer/assets/filetree/my-fastapi-app/main.py`)
- ⬜ **1.2.1.2**: CREATE slides/08-file-explorer/assets/filetree/my-fastapi-app/models.py: Pydantic models for User and Item (~20 lines) (`slides/08-file-explorer/assets/filetree/my-fastapi-app/models.py`)
- ⬜ **1.2.1.3**: CREATE slides/08-file-explorer/assets/filetree/my-fastapi-app/routes/api.py: CRUD API endpoints using models (~25 lines) (`slides/08-file-explorer/assets/filetree/my-fastapi-app/routes/api.py`)
- ⬜ **1.2.1.4**: CREATE slides/08-file-explorer/assets/filetree/my-fastapi-app/requirements.txt: Python dependencies list (~5 lines) (`slides/08-file-explorer/assets/filetree/my-fastapi-app/requirements.txt`)
- ⬜ **1.2.1.5**: CREATE slides/08-file-explorer/assets/filetree/my-fastapi-app/README.md: Short project description (~10 lines) (`slides/08-file-explorer/assets/filetree/my-fastapi-app/README.md`)

### ⬜ Task Group 1.3: Create the Slide

**Objective**: Create the file explorer slide markdown and rebuild the presentation index.

#### ⬜ Task 1.3.1: Create file explorer slide markdown

**File**: `slides/08-file-explorer/index.md`

**Description**: Create the slide markdown file with standard Slidev frontmatter (theme: ../, layout: default) and the FileExplorer component. The component should use dir='08-file-explorer/filetree/my-fastapi-app' to point to the example file tree data in this slide's assets folder.

**Context to Load**:
- `slides/00-title/index.md` (lines 1-24) - Reference for standard Slidev slide frontmatter format

**Depends On**: Tasks 1.1.1, 1.2.1

**Actions**:
- ⬜ **1.3.1.1**: CREATE slides/08-file-explorer/index.md: Slidev slide with frontmatter (theme: ../, layout: default) and <FileExplorer dir='08-file-explorer/filetree/my-fastapi-app' /> component (`slides/08-file-explorer/index.md`)

#### ⬜ Task 1.3.2: Rebuild presentation index

**File**: `index.md`

**Description**: Run npm run build:slides to regenerate the root index.md file, which auto-discovers all slides/*/index.md files and creates src references in numerical order. This adds the new 08-file-explorer slide to the presentation.

**Context to Load**:
- `scripts/build.ts` (lines 1-28) - Understand the build script that generates index.md from slides/

**Depends On**: Tasks 1.3.1

**Actions**:
- ⬜ **1.3.2.1**: RUN npm run build:slides (`index.md`)

---

## ⬜ Checkpoint 2: Visual Polish

**Goal**: Upgrade the styling of FileExplorer.vue and FileTreeItem.vue — better spacing, transitions, color alignment, optional title prop, and slide-optimized height. Make it presentation-ready.

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `components/FileExplorer.vue` | 📄 exists | Working component with basic styling, h-[400px] fixed height |
| Before | `components/FileTreeItem.vue` | 📄 exists | Working tree item with basic styling |
| Before | `slides/08-file-explorer/index.md` | 📄 exists | Slide using FileExplorer without title |
| After | `components/FileExplorer.vue` | 📝 modified | Polished with title prop, dynamic height, improved colors, smooth transitions |
| After | `components/FileTreeItem.vue` | 📝 modified | Polished with expand/collapse animation, better spacing, more icons |
| After | `slides/08-file-explorer/index.md` | 📝 modified | May be updated to demonstrate title prop |

### Testing Strategy

**Approach**: Visual verification via dev server

**Verification Steps**:
- [ ] `npm run dev`
- [ ] `Verify improved visual quality on the file explorer slide`
- [ ] `Test with and without title prop`
- [ ] `Verify folder expand/collapse transitions are smooth`
- [ ] `Verify code panel content transitions`

### ⬜ Task Group 2.1: Style FileExplorer.vue

**Objective**: Add title prop, dynamic height, improved color scheme, and smooth transitions to the main file explorer component.

#### ⬜ Task 2.1.1: Add optional title prop

**File**: `components/FileExplorer.vue`

**Description**: Add an optional 'title' string prop to FileExplorer.vue. When provided, render a styled title (text-4xl font-bold, matching other slide templates) above the explorer container. When absent, the explorer should fill the full available slide height. This follows the pattern from other templates like column-cards which have a main_title above content.

**Context to Load**:
- `components/FileExplorer.vue` (lines 1-10) - Current props definition to extend with title
- `components/FileExplorer.vue` (lines 220-277) - Current template structure to add title rendering
- `slides/01-column-cards/index.md` (lines 1-10) - Reference for title styling pattern used in other templates

**Actions**:
- ⬜ **2.1.1.1**: UPDATE components/FileExplorer.vue: ADD prop 'title' with type string | undefined (optional) (`components/FileExplorer.vue`)
- ⬜ **2.1.1.2**: UPDATE components/FileExplorer.vue: ADD title rendering in template — v-if='title' div with text-4xl font-bold text-center mb-6 BEFORE the explorer container (`components/FileExplorer.vue`)

#### ⬜ Task 2.1.2: Update height to slide-optimized

**File**: `components/FileExplorer.vue`

**Description**: Replace the fixed h-[400px] height with dynamic height that fills available slide space. Use h-full or a calc-based approach. The outer container should expand to fill the parent. When a title is present, the explorer should take remaining space below the title.

**Context to Load**:
- `components/FileExplorer.vue` (lines 220-222) - Current h-[400px] class on the main container div

**Depends On**: Tasks 2.1.1

**Actions**:
- ⬜ **2.1.2.1**: UPDATE components/FileExplorer.vue: REPLACE h-[400px] with flex-1 or h-full on the main explorer container, WRAP template in a flex flex-col h-full parent (`components/FileExplorer.vue`)

#### ⬜ Task 2.1.3: Improve color scheme

**File**: `components/FileExplorer.vue`

**Description**: Update the color scheme of the file explorer to look more polished for presentations. Improve sidebar/code panel contrast. The current dark theme colors (bg-[#1e1e1e], bg-[#252526], bg-[#0d1117]) work but could be refined. Consider aligning with the presentation's overall visual style while keeping the VS Code aesthetic.

**Context to Load**:
- `components/FileExplorer.vue` (lines 220-298) - Current template and styles with color values to refine

**Actions**:
- ⬜ **2.1.3.1**: UPDATE components/FileExplorer.vue: REFACTOR color values in template — improve sidebar bg, code panel bg, border colors, tab header colors for better visual hierarchy and contrast (`components/FileExplorer.vue`)

#### ⬜ Task 2.1.4: Add smooth transitions for code panel

**File**: `components/FileExplorer.vue`

**Description**: Add CSS transitions for when the code panel content changes (file selection). Use a fade or crossfade effect so switching between files feels smooth rather than an instant swap.

**Context to Load**:
- `components/FileExplorer.vue` (lines 258-270) - Current code content rendering section to add transitions
- `components/FileExplorer.vue` (lines 279-298) - Current scoped styles to add transition CSS

**Actions**:
- ⬜ **2.1.4.1**: UPDATE components/FileExplorer.vue: WRAP code content area with Vue <Transition> component for fade effect on file switch (`components/FileExplorer.vue`)
- ⬜ **2.1.4.2**: UPDATE components/FileExplorer.vue: ADD transition CSS classes (fade-enter-active, fade-leave-active, etc.) to scoped styles (`components/FileExplorer.vue`)

### ⬜ Task Group 2.2: Style FileTreeItem.vue

**Objective**: Add expand/collapse animation, improve spacing and hover states, and add more file type icons to the tree item component.

#### ⬜ Task 2.2.1: Add expand/collapse transition

**File**: `components/FileTreeItem.vue`

**Description**: Add a smooth expand/collapse animation for folder children. When a folder is toggled open or closed, the children should slide in/out rather than appearing/disappearing instantly. Use Vue's <Transition> or CSS height transitions.

**Context to Load**:
- `components/FileTreeItem.vue` (lines 38-68) - Current template with v-if='isExpanded' for folder children rendering

**Actions**:
- ⬜ **2.2.1.1**: UPDATE components/FileTreeItem.vue: WRAP folder children div with Vue <Transition> or CSS slide transition for smooth expand/collapse (`components/FileTreeItem.vue`)

#### ⬜ Task 2.2.2: Improve spacing and hover states

**File**: `components/FileTreeItem.vue`

**Description**: Improve the visual spacing between tree items and enhance hover states for better visual hierarchy. Current padding is functional but could be more generous for presentation readability. Hover states could have smoother transitions.

**Context to Load**:
- `components/FileTreeItem.vue` (lines 38-82) - Current template with padding, hover classes, and spacing

**Actions**:
- ⬜ **2.2.2.1**: UPDATE components/FileTreeItem.vue: UPDATE padding values for better spacing, ADD transition-colors duration-150 to hover states, REFACTOR selection highlight for smoother feel (`components/FileTreeItem.vue`)

#### ⬜ Task 2.2.3: Add more file type icons

**File**: `components/FileTreeItem.vue`

**Description**: Extend the getFileIcon function to support more file types. Currently supports .py, .md, .ts, .json. Add icons for: .vue, .yaml/.yml, .sh/.bash, .html, .css, .js, .toml, Dockerfile, Makefile, .txt, .env, .gitignore, and other common types using the i-vscode-icons icon set.

**Context to Load**:
- `components/FileTreeItem.vue` (lines 29-35) - Current getFileIcon function to extend with more file types
- `components/FileExplorer.vue` (lines 139-145) - FileExplorer also has a getFileIcon function that should be kept in sync

**Actions**:
- ⬜ **2.2.3.1**: UPDATE components/FileTreeItem.vue: ADD file type icon mappings for .vue, .yaml, .yml, .sh, .bash, .html, .css, .js, .jsx, .tsx, .toml, .txt, .env, .gitignore, Dockerfile, Makefile to getFileIcon function (`components/FileTreeItem.vue`)
- ⬜ **2.2.3.2**: UPDATE components/FileExplorer.vue: ADD same file type icon mappings to the getFileIcon function in FileExplorer.vue to keep both in sync (`components/FileExplorer.vue`)

---

## ⬜ Checkpoint 3: Extract Slide Template

**Goal**: Create slide-templates/file-explorer/ with slide.md (Handlebars template) and description.md. Verify the template generation works with npm run generate:slide.

**Prerequisites**: Checkpoints 2

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `slides/08-file-explorer/index.md` | 📄 exists | Working polished slide to use as template basis |
| Before | `components/FileExplorer.vue` | 📄 exists | Polished component with title and dir props |
| After | `slide-templates/file-explorer/slide.md` | ✨ new | Handlebars template for generating file explorer slides |
| After | `slide-templates/file-explorer/description.md` | ✨ new | Usage documentation for the file explorer template |

### Testing Strategy

**Approach**: Template generation test

**Verification Steps**:
- [ ] `npm run list:templates — verify file-explorer appears in list`
- [ ] `npm run generate:slide -- --template=file-explorer --name=test-fe --dir=08-file-explorer/filetree/my-fastapi-app`
- [ ] `Verify generated slide content matches expected output`
- [ ] `Clean up test slide after verification`

### ⬜ Task Group 3.1: Create Template Files

**Objective**: Create the Handlebars template and documentation files for the file explorer slide template.

#### ⬜ Task 3.1.1: Create slide.md template

**File**: `slide-templates/file-explorer/slide.md`

**Description**: Create the Handlebars template file for generating file explorer slides. Should include standard Slidev frontmatter (theme: ../, layout: default) and the FileExplorer component with {{dir}} variable. Support optional {{title}} variable using {{#if title}} conditional. Follow the same pattern as other templates like slide-templates/column-cards/slide.md.

**Context to Load**:
- `slide-templates/column-cards/slide.md` (lines 1-37) - Reference template showing Handlebars syntax, frontmatter, and conditional patterns
- `slides/08-file-explorer/index.md` (lines all) - The working slide to templatize — extract the structure and replace values with Handlebars variables

**Actions**:
- ⬜ **3.1.1.1**: CREATE slide-templates/file-explorer/slide.md: Handlebars template with frontmatter (theme: ../, layout: default), optional {{#if title}} title div, and <FileExplorer dir='{{dir}}' {{#if title}}title='{{title}}'{{/if}} /> component. USE slide-templates/column-cards/slide.md as structural reference. (`slide-templates/file-explorer/slide.md`)

#### ⬜ Task 3.1.2: Create description.md documentation

**File**: `slide-templates/file-explorer/description.md`

**Description**: Create usage documentation for the file explorer template. Include: purpose, when to use, template variables table (dir required, title optional), usage example with npm run generate:slide command, visual features, data setup instructions (how to create the assets/filetree/ folder structure), and notes. Follow the same format as slide-templates/column-cards/description.md.

**Context to Load**:
- `slide-templates/column-cards/description.md` (lines 1-83) - Reference documentation showing format, sections, and style to follow

**Depends On**: Tasks 3.1.1

**Actions**:
- ⬜ **3.1.2.1**: CREATE slide-templates/file-explorer/description.md: Template documentation with Purpose, When to Use, Template Variables table, Usage Example, Data Setup instructions, Visual Features, and Notes sections. MIRROR format from slide-templates/column-cards/description.md. (`slide-templates/file-explorer/description.md`)

### ⬜ Task Group 3.2: Verify Template System

**Objective**: Verify the template appears in the template list and can generate a slide correctly.

#### ⬜ Task 3.2.1: Verify template registration and generation

**File**: `None`

**Description**: Run npm run list:templates to confirm the file-explorer template appears in the list. Then run npm run generate:slide with test parameters to verify the template generates a valid slide. Clean up the test slide after verification.

**Context to Load**:
- `scripts/generate-slide.ts` (lines 1-161) - Understand how the generation script discovers and processes templates

**Depends On**: Tasks 3.1.1, 3.1.2

**Actions**:
- ⬜ **3.2.1.1**: RUN npm run list:templates — VERIFY file-explorer appears
- ⬜ **3.2.1.2**: RUN npm run generate:slide -- --template=file-explorer --name=test-fe-gen --dir=08-file-explorer/filetree/my-fastapi-app --title='Test Title'
- ⬜ **3.2.1.3**: VERIFY generated slides/test-fe-gen/index.md contains correct FileExplorer component with dir and title props (`slides/test-fe-gen/index.md`)
- ⬜ **3.2.1.4**: DELETE slides/test-fe-gen/ — cleanup test slide

---

---
*Auto-generated from plan.json on 2026-01-29 16:43*