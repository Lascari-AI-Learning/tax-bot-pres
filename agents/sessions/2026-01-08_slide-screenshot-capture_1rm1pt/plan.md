# Implementation Plan

> **Session**: `2026-01-08_slide-screenshot-capture_1rm1pt`
> **Status**: Complete
> **Spec**: [./spec.md](./spec.md)
> **Created**: 2026-01-18
> **Updated**: 2026-01-18

---

## Overview

- **Checkpoints**: 4 (0 complete)
- **Total Tasks**: 39

## ⬜ Checkpoint 1: Single Template Screenshot Capture

**Goal**: Create /slidev:sync-template command that captures screenshots for one template - proving the end-to-end workflow with Playwright MCP

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `templates.json` | 📄 exists | Slide entries with clicks metadata |
| Before | `slide-templates/*/` | 📄 exists | Template folders without screenshots (or old screenshots) |
| After | `.claude/commands/slidev/sync-template.md` | ✨ new | Command for syncing single template |
| After | `slide-templates/{template}/screenshots/click-{n}.png` | ✨ new | Screenshot files for tested template |

**Projected Structure**:
```
.claude/commands/slidev/
└── sync-template.md
```

### Testing Strategy

**Approach**: Manual execution of command on one template

**Verification Steps**:
- [ ] `Run /slidev:sync-template --template=title`
- [ ] `Verify screenshots appear in slide-templates/title/screenshots/`
- [ ] `Verify click-0.png exists (title has clicks=0)`

### ⬜ Task Group 1.1: Create Command Structure

**Objective**: Set up the slidev command directory and create the sync-template command file with proper frontmatter

#### ⬜ Task 1.1.1: Create slidev commands directory

**File**: `.claude/commands/slidev/`

**Description**: Create the slidev namespace directory for commands. This establishes the location for all slidev-related workflow commands.

**Context to Load**:
- `.claude/commands/git/commit.md` (lines 1-10) - Reference existing command structure and frontmatter pattern

**Actions**:
- ⬜ **1.1.1.1**: CREATE .claude/commands/slidev/ directory (`.claude/commands/slidev/`)

#### ⬜ Task 1.1.2: Create sync-template.md command file

**File**: `.claude/commands/slidev/sync-template.md`

**Description**: Create the command file with frontmatter specifying allowed-tools (Read, mcp__playwright__*), description, and arguments. Include placeholder workflow header.

**Context to Load**:
- `.claude/commands/git/commit.md` (lines 1-30) - Reference command frontmatter structure

**Depends On**: Tasks 1.1.1

**Actions**:
- ⬜ **1.1.2.1**: CREATE .claude/commands/slidev/sync-template.md with frontmatter: allowed-tools=Read,mcp__playwright__*, description='Capture screenshots for a specific slide template', arguments='--template=<name>' (`.claude/commands/slidev/sync-template.md`)

### ⬜ Task Group 1.2: Implement Screenshot Workflow

**Objective**: Write the workflow prompt that guides agents through reading templates.json, calculating URLs, and using Playwright MCP to capture screenshots

#### ⬜ Task 1.2.1: Write workflow introduction and context

**File**: `.claude/commands/slidev/sync-template.md`

**Description**: Add workflow overview section explaining what the command does, required inputs (--template argument), and high-level steps.

**Context to Load**:
- `agents/sessions/2026-01-08_slide-screenshot-capture_1rm1pt/spec.md` (lines 116-140) - Reference the sync-template workflow specification

**Depends On**: Tasks 1.1.2

**Actions**:
- ⬜ **1.2.1.1**: UPDATE .claude/commands/slidev/sync-template.md: ADD section '# Sync Template Screenshots' with purpose and required input documentation (`.claude/commands/slidev/sync-template.md`)

#### ⬜ Task 1.2.2: Write template lookup logic

**File**: `.claude/commands/slidev/sync-template.md`

**Description**: Add instructions for reading templates.json, finding the entry matching the --template argument, extracting order and clicks fields, with error handling if template not found.

**Context to Load**:
- `templates.json` (lines 1-15) - Understand the structure of template entries

**Depends On**: Tasks 1.2.1

**Actions**:
- ⬜ **1.2.2.1**: UPDATE .claude/commands/slidev/sync-template.md: ADD section '## Step 1: Find Template' with instructions to read templates.json, find matching entry, extract order/clicks (`.claude/commands/slidev/sync-template.md`)

#### ⬜ Task 1.2.3: Write URL calculation logic

**File**: `.claude/commands/slidev/sync-template.md`

**Description**: Add instructions for calculating slide URL from order field. Formula: slide_number = parseInt(order) + 1. Base URL pattern with click query parameter.

**Context to Load**:
- `agents/sessions/2026-01-08_slide-screenshot-capture_1rm1pt/spec.md` (lines 79-85) - Reference the URL pattern specification

**Depends On**: Tasks 1.2.2

**Actions**:
- ⬜ **1.2.3.1**: UPDATE .claude/commands/slidev/sync-template.md: ADD section '## Step 2: Calculate URL' with formula slide_number=parseInt(order)+1, base URL https://lascari-ai-learning.github.io/SlidevTemplate/{slide_number}, click pattern ?clicks={n} (`.claude/commands/slidev/sync-template.md`)

#### ⬜ Task 1.2.4: Write screenshot capture loop

**File**: `.claude/commands/slidev/sync-template.md`

**Description**: Add instructions for iterating through click states (0 to clicks value) and capturing screenshots using Playwright MCP tools: browser_navigate and browser_take_screenshot.

**Context to Load**:
- `.claude/skills/browser-mcp/references/tools.md` (lines all) - Reference Playwright MCP tool signatures

**Depends On**: Tasks 1.2.3

**Actions**:
- ⬜ **1.2.4.1**: UPDATE .claude/commands/slidev/sync-template.md: ADD section '## Step 3: Capture Screenshots' with loop for n=0 to clicks, browser_navigate to URL, browser_take_screenshot with filename (`.claude/commands/slidev/sync-template.md`)

#### ⬜ Task 1.2.5: Write file save instructions

**File**: `.claude/commands/slidev/sync-template.md`

**Description**: Add instructions for saving screenshots to slide-templates/{template}/screenshots/click-{n}.png, creating the screenshots directory if needed, and completion summary.

**Context to Load**:
- `agents/sessions/2026-01-08_slide-screenshot-capture_1rm1pt/spec.md` (lines 98-107) - Reference the file structure specification

**Depends On**: Tasks 1.2.4

**Actions**:
- ⬜ **1.2.5.1**: UPDATE .claude/commands/slidev/sync-template.md: ADD section '## Step 4: Save Screenshots' with directory path slide-templates/{template}/screenshots/, filename pattern click-{n}.png, mkdir instruction (`.claude/commands/slidev/sync-template.md`)

### ⬜ Task Group 1.3: Test and Validate

**Objective**: Execute the sync-template command on test templates and verify screenshots are captured correctly

#### ⬜ Task 1.3.1: Execute sync-template on title template

**File**: `None`

**Description**: Run /slidev:sync-template --template=title and observe the workflow execution. Title template has clicks=0, so only click-0.png should be created.

**Context to Load**:
- `templates.json` (lines 3) - Verify title has clicks=0
- `.claude/commands/slidev/sync-template.md` (lines all) - Understand the workflow being tested

**Depends On**: Tasks 1.2.5

**Actions**:
- ⬜ **1.3.1.1**: RUN /slidev:sync-template --template=title
- ⬜ **1.3.1.2**: VERIFY Playwright MCP tools invoked correctly (browser_navigate, browser_take_screenshot)

#### ⬜ Task 1.3.2: Verify screenshots created

**File**: `slide-templates/title/screenshots/`

**Description**: Confirm the screenshots directory was created and click-0.png exists with correct content showing the title slide.

**Depends On**: Tasks 1.3.1

**Actions**:
- ⬜ **1.3.2.1**: CHECK slide-templates/title/screenshots/ directory exists (`slide-templates/title/screenshots/`)
- ⬜ **1.3.2.2**: VERIFY click-0.png file exists and shows title slide correctly (`slide-templates/title/screenshots/click-0.png`)

#### ⬜ Task 1.3.3: Test on template with multiple clicks

**File**: `slide-templates/intro-what-well-cover/screenshots/`

**Description**: Run /slidev:sync-template --template=intro-what-well-cover (clicks=3) and verify click-0.png through click-3.png are created showing progressive reveal states.

**Context to Load**:
- `templates.json` (lines 4) - Verify intro-what-well-cover has clicks=3

**Depends On**: Tasks 1.3.2

**Actions**:
- ⬜ **1.3.3.1**: RUN /slidev:sync-template --template=intro-what-well-cover
- ⬜ **1.3.3.2**: VERIFY click-0.png, click-1.png, click-2.png, click-3.png exist in slide-templates/intro-what-well-cover/screenshots/ (`slide-templates/intro-what-well-cover/screenshots/`)
- ⬜ **1.3.3.3**: VERIFY each screenshot shows progressive reveal states

---

## ⬜ Checkpoint 2: Sync All Templates Command

**Goal**: Create /slidev:sync-all command that iterates through templates.json and captures all screenshots

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/commands/slidev/sync-template.md` | 📄 exists | Working single-template command |
| After | `.claude/commands/slidev/sync-all.md` | ✨ new | Command for syncing all templates |
| After | `slide-templates/*/screenshots/` | 📄 updated | Screenshots for all templates |

**Projected Structure**:
```
.claude/commands/slidev/
├── sync-all.md
└── sync-template.md
```

### Testing Strategy

**Approach**: Execute sync-all and verify all template screenshots

**Verification Steps**:
- [ ] `Run /slidev:sync-all`
- [ ] `Verify screenshots exist for all 9 templates in templates.json`
- [ ] `Verify click count matches the clicks field for each template`

### ⬜ Task Group 2.1: Create sync-all Command File

**Objective**: Create the command file with frontmatter and workflow structure

#### ⬜ Task 2.1.1: Create sync-all.md command file

**File**: `.claude/commands/slidev/sync-all.md`

**Description**: Create the command file with frontmatter specifying allowed-tools (Read, mcp__playwright__*) and description for syncing all templates.

**Context to Load**:
- `.claude/commands/slidev/sync-template.md` (lines 1-10) - Reference existing command frontmatter pattern

**Actions**:
- ⬜ **2.1.1.1**: CREATE .claude/commands/slidev/sync-all.md with frontmatter: allowed-tools=Read,mcp__playwright__*, description='Capture screenshots for all slide templates' (`.claude/commands/slidev/sync-all.md`)

### ⬜ Task Group 2.2: Implement Iteration Workflow

**Objective**: Write workflow that loops through all templates in templates.json and captures screenshots for each

#### ⬜ Task 2.2.1: Write workflow overview

**File**: `.claude/commands/slidev/sync-all.md`

**Description**: Add workflow purpose explaining sync-all captures screenshots for ALL templates in templates.json.

**Context to Load**:
- `agents/sessions/2026-01-08_slide-screenshot-capture_1rm1pt/spec.md` (lines 116-128) - Reference the sync-all workflow specification

**Depends On**: Tasks 2.1.1

**Actions**:
- ⬜ **2.2.1.1**: UPDATE .claude/commands/slidev/sync-all.md: ADD section '# Sync All Template Screenshots' with purpose documentation (`.claude/commands/slidev/sync-all.md`)

#### ⬜ Task 2.2.2: Write template iteration logic

**File**: `.claude/commands/slidev/sync-all.md`

**Description**: Add instructions for reading templates.json and iterating through each slide entry.

**Context to Load**:
- `templates.json` (lines 1-15) - Understand the structure of template entries

**Depends On**: Tasks 2.2.1

**Actions**:
- ⬜ **2.2.2.1**: UPDATE .claude/commands/slidev/sync-all.md: ADD section '## Step 1: Load Templates' with instructions to read templates.json and get slides array (`.claude/commands/slidev/sync-all.md`)

#### ⬜ Task 2.2.3: Write per-template capture logic

**File**: `.claude/commands/slidev/sync-all.md`

**Description**: Add instructions for capturing screenshots for each template using the same pattern as sync-template.

**Context to Load**:
- `.claude/commands/slidev/sync-template.md` (lines all) - Reference the capture workflow to reuse

**Depends On**: Tasks 2.2.2

**Actions**:
- ⬜ **2.2.3.1**: UPDATE .claude/commands/slidev/sync-all.md: ADD section '## Step 2: Iterate and Capture' with for-each loop over slides, URL calculation, screenshot capture for each click state (`.claude/commands/slidev/sync-all.md`)

#### ⬜ Task 2.2.4: Write completion summary

**File**: `.claude/commands/slidev/sync-all.md`

**Description**: Add instructions for reporting total templates synced and screenshot counts.

**Depends On**: Tasks 2.2.3

**Actions**:
- ⬜ **2.2.4.1**: UPDATE .claude/commands/slidev/sync-all.md: ADD section '## Step 3: Report Summary' with total templates synced, total screenshots captured (`.claude/commands/slidev/sync-all.md`)

### ⬜ Task Group 2.3: Test and Validate

**Objective**: Run sync-all and verify all 9 templates have correct screenshots

#### ⬜ Task 2.3.1: Execute sync-all command

**File**: `None`

**Description**: Run /slidev:sync-all and observe iteration through all templates.

**Context to Load**:
- `.claude/commands/slidev/sync-all.md` (lines all) - Understand the workflow being tested

**Depends On**: Tasks 2.2.4

**Actions**:
- ⬜ **2.3.1.1**: RUN /slidev:sync-all

#### ⬜ Task 2.3.2: Verify all templates have screenshots

**File**: `slide-templates/*/screenshots/`

**Description**: Confirm all 9 templates have correct number of screenshots matching their clicks field.

**Context to Load**:
- `templates.json` (lines 1-15) - Reference expected click counts for each template

**Depends On**: Tasks 2.3.1

**Actions**:
- ⬜ **2.3.2.1**: VERIFY all 9 templates have screenshots directory with correct click count: title(0), intro-what-well-cover(3), about-me(0), icon-list-content(2), continuum-diagram(4), extremes-to-middle(2), continuum-middle-ground(3), three-to-one-takeaway(4), conclusion-lets-connect(0) (`slide-templates/*/screenshots/`)

---

## ⬜ Checkpoint 3: Add Template Command

**Goal**: Create /slidev:add-template command with interactive prompts for creating new templates

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/commands/slidev/sync-template.md` | 📄 exists | Working single-template command |
| Before | `templates.json` | 📄 exists | Current template entries |
| After | `.claude/commands/slidev/add-template.md` | ✨ new | Interactive command for adding templates |

**Projected Structure**:
```
.claude/commands/slidev/
├── add-template.md
├── sync-all.md
└── sync-template.md
```

### Testing Strategy

**Approach**: Execute add-template workflow and verify structure created

**Verification Steps**:
- [ ] `Run /slidev:add-template (interactive)`
- [ ] `Verify new folder created in slide-templates/`
- [ ] `Verify description.md, slide.md, example.md created`
- [ ] `Verify templates.json updated with new entry`

### ⬜ Task Group 3.1: Create add-template Command File

**Objective**: Create the command file with frontmatter and workflow header

#### ⬜ Task 3.1.1: Create add-template.md command file

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Create command file with frontmatter specifying allowed-tools (AskUserQuestion, Write, Edit, Read, mcp__playwright__*) for interactive template creation workflow.

**Context to Load**:
- `.claude/commands/slidev/sync-template.md` (lines 1-10) - Reference existing command frontmatter pattern

**Actions**:
- ⬜ **3.1.1.1**: CREATE .claude/commands/slidev/add-template.md with frontmatter: allowed-tools=AskUserQuestion,Write,Edit,Read,mcp__playwright__*, description='Interactive workflow for adding new slide templates' (`.claude/commands/slidev/add-template.md`)

### ⬜ Task Group 3.2: Implement Interactive Prompts

**Objective**: Write workflow sections for prompting user for template details

#### ⬜ Task 3.2.1: Write prompt for template name

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add AskUserQuestion section for kebab-case template identifier (e.g., 'two-column-compare').

**Context to Load**:
- `agents/sessions/2026-01-08_slide-screenshot-capture_1rm1pt/spec.md` (lines 143-157) - Reference add-template workflow specification

**Depends On**: Tasks 3.1.1

**Actions**:
- ⬜ **3.2.1.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 1: Template Name' with AskUserQuestion for kebab-case identifier (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.2.2: Write prompt for template purpose

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add AskUserQuestion section for what kind of content the template presents.

**Depends On**: Tasks 3.2.1

**Actions**:
- ⬜ **3.2.2.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 2: Template Purpose' with AskUserQuestion for content type description (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.2.3: Write prompt for layout structure

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add AskUserQuestion section for columns, sections, visual elements.

**Depends On**: Tasks 3.2.2

**Actions**:
- ⬜ **3.2.3.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 3: Layout Structure' with AskUserQuestion for columns/sections/elements (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.2.4: Write prompt for animation pattern

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add AskUserQuestion section for v-click reveal strategy.

**Depends On**: Tasks 3.2.3

**Actions**:
- ⬜ **3.2.4.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 4: Animation Pattern' with AskUserQuestion for v-click strategy (`.claude/commands/slidev/add-template.md`)

### ⬜ Task Group 3.3: Implement File Creation

**Objective**: Write workflow for creating template folder structure

#### ⬜ Task 3.3.1: Write folder creation instructions

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add instructions for creating slide-templates/{name}/ folder and screenshots/ subdirectory.

**Context to Load**:
- `agents/sessions/2026-01-08_slide-screenshot-capture_1rm1pt/spec.md` (lines 98-107) - Reference template folder structure

**Depends On**: Tasks 3.2.4

**Actions**:
- ⬜ **3.3.1.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 5: Create Folder Structure' with mkdir instructions for template folder (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.3.2: Write description.md generation

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add instructions for generating description.md from user inputs (purpose, layout, usage examples).

**Context to Load**:
- `slide-templates/continuum-diagram/description.md` (lines 1-50) - Reference existing description.md structure

**Depends On**: Tasks 3.3.1

**Actions**:
- ⬜ **3.3.2.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 6: Generate description.md' with template for documentation file (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.3.3: Write slide.md generation

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add instructions for generating slide.md template with {{placeholder}} variables based on layout structure.

**Context to Load**:
- `slide-templates/continuum-diagram/slide.md` (lines all) - Reference existing slide.md structure with placeholders

**Depends On**: Tasks 3.3.2

**Actions**:
- ⬜ **3.3.3.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 7: Generate slide.md' with template structure and placeholder syntax (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.3.4: Write example.md generation

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add instructions for generating example.md with sample content and v-click annotations.

**Context to Load**:
- `slide-templates/continuum-diagram/example.md` (lines all) - Reference existing example.md structure

**Depends On**: Tasks 3.3.3

**Actions**:
- ⬜ **3.3.4.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 8: Generate example.md' with sample content including v-click annotations (`.claude/commands/slidev/add-template.md`)

### ⬜ Task Group 3.4: Implement Templates.json Update

**Objective**: Write workflow for adding entry to templates.json and triggering screenshot capture

#### ⬜ Task 3.4.1: Write v-click analysis instructions

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add instructions for counting v-click elements in example.md to determine clicks field value.

**Depends On**: Tasks 3.3.4

**Actions**:
- ⬜ **3.4.1.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 9: Analyze Click Count' with instructions to count v-click elements (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.4.2: Write templates.json update instructions

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add instructions for adding new entry to templates.json with order, template, source, clicks fields.

**Context to Load**:
- `templates.json` (lines 1-15) - Reference templates.json structure for new entry

**Depends On**: Tasks 3.4.1

**Actions**:
- ⬜ **3.4.2.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 10: Update templates.json' with instructions to add new slide entry (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.4.3: Write deployment reminder

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add reminder to run build/deploy before screenshot capture so the live URL is updated.

**Depends On**: Tasks 3.4.2

**Actions**:
- ⬜ **3.4.3.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 11: Deploy' with reminder to build and deploy for live URL (`.claude/commands/slidev/add-template.md`)

#### ⬜ Task 3.4.4: Write screenshot capture trigger

**File**: `.claude/commands/slidev/add-template.md`

**Description**: Add instructions to invoke sync-template workflow after deployment to capture screenshots.

**Context to Load**:
- `.claude/commands/slidev/sync-template.md` (lines all) - Reference sync-template command to invoke

**Depends On**: Tasks 3.4.3

**Actions**:
- ⬜ **3.4.4.1**: UPDATE .claude/commands/slidev/add-template.md: ADD section '## Step 12: Capture Screenshots' with instructions to run sync-template for new template (`.claude/commands/slidev/add-template.md`)

### ⬜ Task Group 3.5: Test and Validate

**Objective**: Run add-template workflow and verify full structure created

#### ⬜ Task 3.5.1: Execute add-template workflow

**File**: `None`

**Description**: Run /slidev:add-template and complete interactive prompts to create a test template.

**Context to Load**:
- `.claude/commands/slidev/add-template.md` (lines all) - Understand the workflow being tested

**Depends On**: Tasks 3.4.4

**Actions**:
- ⬜ **3.5.1.1**: RUN /slidev:add-template and complete prompts for test template

#### ⬜ Task 3.5.2: Verify template structure created

**File**: `slide-templates/{new-template}/`

**Description**: Confirm new template folder created with description.md, slide.md, example.md, and templates.json updated.

**Depends On**: Tasks 3.5.1

**Actions**:
- ⬜ **3.5.2.1**: VERIFY slide-templates/{new-template}/ contains description.md, slide.md, example.md (`slide-templates/{new-template}/`)
- ⬜ **3.5.2.2**: VERIFY templates.json contains new entry with correct order, template, source, clicks (`templates.json`)

---

## ⬜ Checkpoint 4: Slidev Skill Documentation

**Goal**: Create comprehensive skill documentation that agents can reference for template conventions

**Prerequisites**: Checkpoints 1, 2, 3

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `.claude/commands/slidev/` | 📄 exists | All three commands complete |
| After | `.claude/skills/slidev/SKILL.md` | ✨ new | Main skill documentation |
| After | `.claude/skills/slidev/references/templates.md` | ✨ new | Template structure reference |
| After | `.claude/skills/slidev/references/playwright-workflow.md` | ✨ new | Playwright MCP usage patterns |

**Projected Structure**:
```
.claude/skills/slidev/
├── SKILL.md
└── references/
    ├── playwright-workflow.md
    └── templates.md
```

### Testing Strategy

**Approach**: Review documentation completeness and accuracy

**Verification Steps**:
- [ ] `Verify SKILL.md covers template structure conventions`
- [ ] `Verify references document Playwright MCP usage`
- [ ] `Verify all commands are documented with usage examples`

### ⬜ Task Group 4.1: Create Skill Directory Structure

**Objective**: Set up .claude/skills/slidev/ directory with references folder

#### ⬜ Task 4.1.1: Create slidev skill directory

**File**: `.claude/skills/slidev/`

**Description**: Create the slidev skill directory and references subdirectory.

**Context to Load**:
- `.claude/skills/git/SKILL.md` (lines 1-30) - Reference existing skill structure

**Actions**:
- ⬜ **4.1.1.1**: CREATE .claude/skills/slidev/ directory (`.claude/skills/slidev/`)
- ⬜ **4.1.1.2**: CREATE .claude/skills/slidev/references/ directory (`.claude/skills/slidev/references/`)

### ⬜ Task Group 4.2: Create Main Skill Documentation

**Objective**: Write SKILL.md with overview, commands, and conventions

#### ⬜ Task 4.2.1: Write SKILL.md overview section

**File**: `.claude/skills/slidev/SKILL.md`

**Description**: Create SKILL.md with overview explaining the Slidev template system and its purpose.

**Context to Load**:
- `.claude/skills/git/SKILL.md` (lines all) - Reference existing skill documentation format

**Depends On**: Tasks 4.1.1

**Actions**:
- ⬜ **4.2.1.1**: CREATE .claude/skills/slidev/SKILL.md with overview section explaining template system purpose (`.claude/skills/slidev/SKILL.md`)

#### ⬜ Task 4.2.2: Write commands documentation

**File**: `.claude/skills/slidev/SKILL.md`

**Description**: Add documentation for /slidev:sync-all, /slidev:sync-template, and /slidev:add-template commands with usage examples.

**Context to Load**:
- `.claude/commands/slidev/sync-all.md` (lines all) - Reference command details
- `.claude/commands/slidev/sync-template.md` (lines all) - Reference command details
- `.claude/commands/slidev/add-template.md` (lines all) - Reference command details

**Depends On**: Tasks 4.2.1

**Actions**:
- ⬜ **4.2.2.1**: UPDATE .claude/skills/slidev/SKILL.md: ADD section '## Commands' with documentation for all three commands (`.claude/skills/slidev/SKILL.md`)

#### ⬜ Task 4.2.3: Write conventions documentation

**File**: `.claude/skills/slidev/SKILL.md`

**Description**: Add documentation for template naming conventions, folder structure, and URL patterns.

**Context to Load**:
- `agents/sessions/2026-01-08_slide-screenshot-capture_1rm1pt/spec.md` (lines 79-107) - Reference structure conventions

**Depends On**: Tasks 4.2.2

**Actions**:
- ⬜ **4.2.3.1**: UPDATE .claude/skills/slidev/SKILL.md: ADD section '## Conventions' with naming, folder structure, URL patterns (`.claude/skills/slidev/SKILL.md`)

### ⬜ Task Group 4.3: Create Reference Documentation

**Objective**: Write templates.md and playwright-workflow.md reference files

#### ⬜ Task 4.3.1: Write templates.md reference

**File**: `.claude/skills/slidev/references/templates.md`

**Description**: Create templates.md documenting template folder structure, file purposes, and templates.json schema.

**Context to Load**:
- `templates.json` (lines all) - Reference templates.json structure
- `slide-templates/continuum-diagram/` - Reference example template structure

**Depends On**: Tasks 4.1.1

**Actions**:
- ⬜ **4.3.1.1**: CREATE .claude/skills/slidev/references/templates.md with template folder structure documentation (`.claude/skills/slidev/references/templates.md`)

#### ⬜ Task 4.3.2: Write playwright-workflow.md reference

**File**: `.claude/skills/slidev/references/playwright-workflow.md`

**Description**: Create playwright-workflow.md documenting Playwright MCP tools used for screenshot capture (browser_navigate, browser_take_screenshot).

**Context to Load**:
- `.claude/skills/browser-mcp/references/tools.md` (lines all) - Reference Playwright MCP tools

**Depends On**: Tasks 4.1.1

**Actions**:
- ⬜ **4.3.2.1**: CREATE .claude/skills/slidev/references/playwright-workflow.md with Playwright MCP usage patterns for screenshot capture (`.claude/skills/slidev/references/playwright-workflow.md`)

### ⬜ Task Group 4.4: Review and Validate

**Objective**: Verify documentation is complete and accurate

#### ⬜ Task 4.4.1: Review documentation completeness

**File**: `None`

**Description**: Review all skill documentation files to ensure completeness and accuracy.

**Context to Load**:
- `.claude/skills/slidev/SKILL.md` (lines all) - Review main documentation
- `.claude/skills/slidev/references/templates.md` (lines all) - Review templates reference
- `.claude/skills/slidev/references/playwright-workflow.md` (lines all) - Review playwright reference

**Depends On**: Tasks 4.2.3, 4.3.1, 4.3.2

**Actions**:
- ⬜ **4.4.1.1**: VERIFY SKILL.md covers all commands with usage examples (`.claude/skills/slidev/SKILL.md`)
- ⬜ **4.4.1.2**: VERIFY templates.md documents folder structure and templates.json schema (`.claude/skills/slidev/references/templates.md`)
- ⬜ **4.4.1.3**: VERIFY playwright-workflow.md documents MCP tool usage patterns (`.claude/skills/slidev/references/playwright-workflow.md`)

---

---
*Auto-generated from plan.json on 2026-01-18 14:05*