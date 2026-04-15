# Implementation Plan

> **Session**: `2026-03-13_tax-prep_ox5g4c`
> **Status**: Complete
> **Spec**: [./spec.md](./spec.md)
> **Created**: 2026-03-13
> **Updated**: 2026-03-13

---

## Overview

- **Checkpoints**: 5 (0 complete)
- **Total Tasks**: 21

## ⬜ Checkpoint 1: Why It Matters Slide

**Goal**: First complete slide using three-to-one-takeaway template. Three pain cards (generic tools miss nuance, multiple accounts/channels, CPAs miss what you don't surface) plus takeaway card (bespoke > generic). Validates full pipeline: template → slide → index.md → dev server.

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `slide-templates/three-to-one-takeaway/slide.md` | 📄 exists | Template with Handlebars placeholders for 3 idea cards + takeaway |
| Before | `slides/07-three-to-one-takeaway/index.md` | 📄 exists | Existing example slide using the template (will serve as reference) |
| Before | `index.md` | 📄 exists | Root slide assembly file |
| After | `slides/20-why-it-matters/index.md` | ✨ new | Why It Matters slide with tax-specific content |
| After | `index.md` | 📝 modified | Updated to include new slide |

**Projected Structure**:
```
slides/
├── ...
├── 20-why-it-matters/
│   └── index.md
└── 99-conclusion-lets-connect/
```

### Testing Strategy

**Approach**: Visual verification in dev server

**Verification Steps**:
- [ ] `npm run build:slides`
- [ ] `npm run dev — verify slide renders with 4 click states`

### ⬜ Task Group 1.1: Create Why It Matters Slide

**Objective**: Create the slide markdown file using three-to-one-takeaway template with tax-specific pain points and bespoke > generic takeaway, then rebuild index.md.

#### ⬜ Task 1.1.1: Create Why It Matters slide markdown

**File**: `slides/20-why-it-matters/index.md`

**Description**: Create the Why It Matters slide using the three-to-one-takeaway template structure. Three pain point cards reveal sequentially (clicks 1-3), then a takeaway card lands the core message (click 4). Content maps spec's pain points to template variables. Uses slides/07-three-to-one-takeaway/index.md as structural reference.

**Context to Load**:
- `slides/07-three-to-one-takeaway/index.md` - Structural reference — exact HTML/CSS pattern to follow
- `slide-templates/three-to-one-takeaway/description.md` - Template variable documentation
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 33-46) - Why It Matters content requirements and card definitions

**Actions**:
- ⬜ **1.1.1.1**: CREATE FILE slides/20-why-it-matters/index.md: MIRROR slides/07-three-to-one-takeaway/index.md structure. USE frontmatter: theme ../ layout center clicks 4. MAKE title 'Why It Matters'. MAKE card 1 (blue): lead='Tax software handles general categories fine — income, standard deductions, basic expenses...' action='But it' emphasis='MISSES' result='the situational deductions that actually save you money'. MAKE card 2 (green): lead='Multiple bank accounts, mixed personal and business spending, payments through unexpected channels...' action='Your real financial life is' emphasis='MESSY' result='and no template captures it'. MAKE card 3 (purple): lead='Your CPA is juggling tons of clients. Whatever you don't organize and surface for them...' action='Simply' emphasis='GETS MISSED' result='— and that costs you money'. MAKE takeaway (orange): statement='Generic tools are built for everyone. Built for no one.' preemphasis='This system captures' emphasis='YOUR NUANCE' postemphasis='— your accounts, your edge cases, your exact situation.' (`slides/20-why-it-matters/index.md`)

#### ⬜ Task 1.1.2: Rebuild index.md with new slide

**File**: `index.md`

**Description**: Run npm run build:slides to auto-regenerate the root index.md, which discovers all slides/*/index.md files in numerical order. This adds slides/20-why-it-matters/ to the presentation.

**Context to Load**:
- `scripts/build.ts` - Understand how build:slides discovers and orders slide files

**Depends On**: Tasks 1.1.1

**Actions**:
- ⬜ **1.1.2.1**: RUN npm run build:slides to regenerate index.md with new slide included (`index.md`)

---

## ⬜ Checkpoint 2: System Overview Slide

**Goal**: Establish FileExplorer pattern with .claude/ directory visualization. Shows agents, commands, and skill structure. Only cpa-tax-prep expanded in detail; pdf/xlsx just listed.

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `components/FileTree/FileExplorer.vue` | 📄 exists | FileExplorer Vue component |
| Before | `slides/08-file-explorer/index.md` | 📄 exists | Existing FileExplorer example for reference |
| Before | `slides/08-file-explorer/assets/filetree/my-fastapi-app/` | 📄 exists | Example filetree assets pattern |
| After | `slides/21-system-overview/index.md` | ✨ new | System overview slide with FileExplorer |
| After | `slides/21-system-overview/assets/filetree/` | ✨ new | Filetree assets for .claude/ directory |
| After | `index.md` | 📝 modified | Updated to include new slide |

**Projected Structure**:
```
slides/
├── ...
├── 20-why-it-matters/
├── 21-system-overview/
│   ├── index.md
│   └── assets/filetree/claude-config/
│       ├── settings.json
│       ├── agents/
│       ├── commands/cpa-tax-prep/
│       └── skills/cpa-tax-prep/
└── 99-conclusion-lets-connect/
```

### Testing Strategy

**Approach**: Visual verification in dev server

**Verification Steps**:
- [ ] `npm run build:slides`
- [ ] `npm run dev — verify FileExplorer renders with correct tree and file contents`

### ⬜ Task Group 2.1: Create FileTree Assets

**Objective**: Create the file directory structure representing the .claude/ config as real files that the FileExplorer component can render. Each file needs representative content that looks realistic in the file viewer.

#### ⬜ Task 2.1.1: Create root config and agent definition files

**File**: `slides/21-system-overview/assets/filetree/claude-config/`

**Description**: Create 3 filetree asset files: settings.json (allowedTools, permissions, model prefs ~10 lines), agents/tax-extract.md (model sonnet, extracts ONE source doc ~8-12 lines), agents/tax-package.md (model sonnet, packages ONE finalized file to JSON ~8-12 lines).

**Context to Load**:
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 127-148) - Actual .claude/ directory structure to replicate
- `slides/08-file-explorer/assets/filetree/my-fastapi-app/main.py` - Example of filetree asset file content style
- `references/tax-prep/ARCHITECTURE.md` (lines 86-139) - Extract phase details for tax-extract agent description

**Actions**:
- ⬜ **2.1.1.1**: CREATE FILE slides/21-system-overview/assets/filetree/claude-config/settings.json: JSON with allowedTools, permissions, model preferences. Brief representative content (~10 lines). (`slides/21-system-overview/assets/filetree/claude-config/settings.json`)
- ⬜ **2.1.1.2**: CREATE FILE slides/21-system-overview/assets/filetree/claude-config/agents/tax-extract.md: Agent definition with model (sonnet), description (extracts ONE source document), instructions summary (~8-12 lines). (`slides/21-system-overview/assets/filetree/claude-config/agents/tax-extract.md`)
- ⬜ **2.1.1.3**: CREATE FILE slides/21-system-overview/assets/filetree/claude-config/agents/tax-package.md: Agent definition with model (sonnet), description (packages ONE finalized file to JSON), instructions summary (~8-12 lines). (`slides/21-system-overview/assets/filetree/claude-config/agents/tax-package.md`)

#### ⬜ Task 2.1.2: Create cpa-tax-prep command files

**File**: `slides/21-system-overview/assets/filetree/claude-config/commands/cpa-tax-prep/`

**Description**: Create 6 command markdown files (initialize, intake, extract, review, package, add-vertical). Each has a brief header + description showing what the command does (~6-10 lines each).

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` - Phase descriptions for each command
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 127-148) - Command file names and annotations

**Actions**:
- ⬜ **2.1.2.1**: CREATE FILE commands/cpa-tax-prep/initialize.md: 'Creates folder scaffold and blank intake.md. User drops source documents into appropriate folders.' (~6-8 lines) (`slides/21-system-overview/assets/filetree/claude-config/commands/cpa-tax-prep/initialize.md`)
- ⬜ **2.1.2.2**: CREATE FILE commands/cpa-tax-prep/intake.md: '9-section conversational interview. Pre-reads source docs. STATUS markers for resume support.' (~8-10 lines) (`slides/21-system-overview/assets/filetree/claude-config/commands/cpa-tax-prep/intake.md`)
- ⬜ **2.1.2.3**: CREATE FILE commands/cpa-tax-prep/extract.md: 'Spawns parallel tax-extract subagents, one per PDF. Aggregates into raw/ category files.' (~8-10 lines) (`slides/21-system-overview/assets/filetree/claude-config/commands/cpa-tax-prep/extract.md`)
- ⬜ **2.1.2.4**: CREATE FILE commands/cpa-tax-prep/review.md: 'Human-in-the-loop review. Walks through extracted data section by section. Flags items.' (~8-10 lines) (`slides/21-system-overview/assets/filetree/claude-config/commands/cpa-tax-prep/review.md`)
- ⬜ **2.1.2.5**: CREATE FILE commands/cpa-tax-prep/package.md: 'Parallel tax-package subagents → section JSONs → merge → build_xlsx → validate.' (~8-10 lines) (`slides/21-system-overview/assets/filetree/claude-config/commands/cpa-tax-prep/package.md`)
- ⬜ **2.1.2.6**: CREATE FILE commands/cpa-tax-prep/add-vertical.md: 'Utility to add new document types. Interviews for fields, schema, and layout.' (~6 lines) (`slides/21-system-overview/assets/filetree/claude-config/commands/cpa-tax-prep/add-vertical.md`)

#### ⬜ Task 2.1.3: Create skill files (cpa-tax-prep detail + pdf/xlsx stubs)

**File**: `slides/21-system-overview/assets/filetree/claude-config/skills/`

**Description**: Create skill files: cpa-tax-prep/SKILL.md (~15-20 lines), references/extraction-schema.md (~10 lines), references/tax-data-schema.md (~12 lines), scripts/merge_sections.py (~15 lines), scripts/build_xlsx.py (~15 lines), pdf/SKILL.md (~3 lines), xlsx/SKILL.md (~3 lines).

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` (lines 251-306) - Key patterns and data lineage for skill description
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 127-148) - Skill structure

**Actions**:
- ⬜ **2.1.3.1**: CREATE FILE skills/cpa-tax-prep/SKILL.md: Skill overview — purpose, 5-phase pipeline, key patterns (parallelism, resume, JSON-first, flagging) (~15-20 lines) (`slides/21-system-overview/assets/filetree/claude-config/skills/cpa-tax-prep/SKILL.md`)
- ⬜ **2.1.3.2**: CREATE FILE skills/cpa-tax-prep/references/extraction-schema.md: YAML front matter fields (source, document_type, period, status) (~10 lines) (`slides/21-system-overview/assets/filetree/claude-config/skills/cpa-tax-prep/references/extraction-schema.md`)
- ⬜ **2.1.3.3**: CREATE FILE skills/cpa-tax-prep/references/tax-data-schema.md: JSON schema showing 8-tab structure (~12 lines) (`slides/21-system-overview/assets/filetree/claude-config/skills/cpa-tax-prep/references/tax-data-schema.md`)
- ⬜ **2.1.3.4**: CREATE FILE skills/cpa-tax-prep/scripts/merge_sections.py: Python stub — imports, main function, merge logic outline (~15 lines) (`slides/21-system-overview/assets/filetree/claude-config/skills/cpa-tax-prep/scripts/merge_sections.py`)
- ⬜ **2.1.3.5**: CREATE FILE skills/cpa-tax-prep/scripts/build_xlsx.py: Python stub — imports (openpyxl), main function, tab creation outline (~15 lines) (`slides/21-system-overview/assets/filetree/claude-config/skills/cpa-tax-prep/scripts/build_xlsx.py`)
- ⬜ **2.1.3.6**: CREATE FILE skills/pdf/SKILL.md: Minimal stub — 'PDF processing skill. Reads and extracts content from PDF documents.' (~3 lines) (`slides/21-system-overview/assets/filetree/claude-config/skills/pdf/SKILL.md`)
- ⬜ **2.1.3.7**: CREATE FILE skills/xlsx/SKILL.md: Minimal stub — 'Spreadsheet skill. Reads, creates, and validates Excel workbooks.' (~3 lines) (`slides/21-system-overview/assets/filetree/claude-config/skills/xlsx/SKILL.md`)

### ⬜ Task Group 2.2: Create System Overview Slide

**Objective**: Build the slide markdown with FileExplorer component showing the .claude/ directory, plus heading and brief text establishing this is a Claude Code skill-based system.

#### ⬜ Task 2.2.1: Create system overview slide with FileExplorer

**File**: `slides/21-system-overview/index.md`

**Description**: Create the system overview slide with heading 'How It Works — The System', brief descriptive text, and FileExplorer component (dir='21-system-overview/filetree/claude-config'). Uses slides/08-file-explorer/index.md as structural reference.

**Context to Load**:
- `slides/08-file-explorer/index.md` - Reference for FileExplorer slide structure
- `components/FileTree/FileExplorer.vue` (lines 1-16) - Component props interface

**Depends On**: Tasks 2.1.1, 2.1.2, 2.1.3

**Actions**:
- ⬜ **2.2.1.1**: CREATE FILE slides/21-system-overview/index.md: USE frontmatter theme ../ layout center. MAKE heading 'How It Works — The System' (text-3xl text-gray-900). ADD brief text 'A Claude Code skill with agents, commands, and references'. ADD FileExplorer component with dir='21-system-overview/filetree/claude-config'. MIRROR slides/08-file-explorer/index.md layout. USE full height flexbox (h-full). (`slides/21-system-overview/index.md`)

#### ⬜ Task 2.2.2: Rebuild index.md with system overview slide

**File**: `index.md`

**Description**: Run npm run build:slides to regenerate index.md including slides/21-system-overview/.

**Context to Load**:
- `scripts/build.ts` - Build script reference

**Depends On**: Tasks 2.2.1

**Actions**:
- ⬜ **2.2.2.1**: RUN npm run build:slides (`index.md`)

---

## ⬜ Checkpoint 3: Simple Phase Slides (Initialize + Intake + Review)

**Goal**: Create three simpler phase slides. Initialize is file-tree-only (no diagram). Intake and Review share a loop diagram pattern (read → ask → update → repeat). Establishes the phase slide layout.

**Prerequisites**: Checkpoints 2

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `components/Terminal.vue` | 📄 exists | Terminal component for command display |
| Before | `components/AgentView/AgentView.vue` | 📄 exists | AgentView component for agent walkthrough |
| Before | `references/tax-prep/ARCHITECTURE.md` | 📄 exists | Architecture reference for phase details |
| After | `slides/22-initialize/index.md` | ✨ new | Initialize phase slide |
| After | `slides/22-initialize/assets/filetree/` | ✨ new | Empty scaffold directory |
| After | `slides/23-intake/index.md` | ✨ new | Intake phase slide with loop diagram |
| After | `slides/23-intake/assets/filetree/` | ✨ new | Directory with populated intake.md |
| After | `slides/25-review/index.md` | ✨ new | Review phase slide with loop diagram |
| After | `slides/25-review/assets/filetree/` | ✨ new | Directory with final/ folder |
| After | `index.md` | 📝 modified | Updated with 3 new slides |

**Projected Structure**:
```
slides/
├── ...
├── 20-why-it-matters/
├── 21-system-overview/
├── 22-initialize/
├── 23-intake/
├── 25-review/
└── 99-conclusion-lets-connect/
```

### Testing Strategy

**Approach**: Visual verification in dev server

**Verification Steps**:
- [ ] `npm run build:slides`
- [ ] `npm run dev — verify all 3 phase slides render`
- [ ] `Verify progressive file tree growth across slides`
- [ ] `Verify loop diagrams display correctly on Intake and Review`

### ⬜ Task Group 3.1: Create Phase FileTree Assets

**Objective**: Create filetree asset files for three phases showing progressive directory growth: Initialize (empty scaffold), Intake (populated intake.md), Review (extractions/ + raw/ + final/).

#### ⬜ Task 3.1.1: Create Initialize phase filetree assets

**File**: `slides/22-initialize/assets/filetree/tax-2025/`

**Description**: Create files for empty scaffold after /cpa-tax-prep:initialize. Shows source-documents/ with README placeholder and write-up/ with blank intake.md template (9 section headers, all STATUS: pending). ~2 files.

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` (lines 22-42) - Initialize phase output structure
- `slides/08-file-explorer/assets/filetree/my-fastapi-app/main.py` - Example filetree asset content

**Actions**:
- ⬜ **3.1.1.1**: CREATE FILE source-documents/README.md: Drop bank statements, 1099s, insurance docs into subfolders (~5 lines) (`slides/22-initialize/assets/filetree/tax-2025/source-documents/README.md`)
- ⬜ **3.1.1.2**: CREATE FILE write-up/intake.md: Blank template with 9 section headers (Filer Info, Accounts, Home Office, Health Insurance, Internet/Utilities, Quarterly Taxes, Retirement, Income, Special Considerations) all STATUS: pending (~20 lines) (`slides/22-initialize/assets/filetree/tax-2025/write-up/intake.md`)

#### ⬜ Task 3.1.2: Create Intake phase filetree assets

**File**: `slides/23-intake/assets/filetree/tax-2025/`

**Description**: Create files showing directory after Intake completes. intake.md is populated with 9 sections (brief sample content, all STATUS: complete). Source-documents/ has README noting docs are present. ~2 files.

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` (lines 46-83) - Intake phase details and 9 sections

**Actions**:
- ⬜ **3.1.2.1**: CREATE FILE source-documents/README.md: Same as init but noting docs are present (`slides/23-intake/assets/filetree/tax-2025/source-documents/README.md`)
- ⬜ **3.1.2.2**: CREATE FILE write-up/intake.md: Populated with 9 sections, sample content per section, all STATUS: complete (~40-50 lines) (`slides/23-intake/assets/filetree/tax-2025/write-up/intake.md`)

#### ⬜ Task 3.1.3: Create Review phase filetree assets

**File**: `slides/25-review/assets/filetree/tax-2025/`

**Description**: Create files showing directory after Review completes. Includes: intake.md (populated), extractions/ with 2 sample files (from Extract phase), raw/ with 3 aggregated category files, and final/ with 3 reviewed copies. Shows full Extract→Review progression. ~9 files.

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` (lines 86-173) - Extract and Review phase file outputs

**Actions**:
- ⬜ **3.1.3.1**: CREATE FILE write-up/intake.md: Populated intake (reuse content from 3.1.2.2) (`slides/25-review/assets/filetree/tax-2025/write-up/intake.md`)
- ⬜ **3.1.3.2**: CREATE FILE write-up/extractions/business-2025-01.md: YAML front matter (source, type, period, status:complete) + brief extracted transactions (~15 lines) (`slides/25-review/assets/filetree/tax-2025/write-up/extractions/business-2025-01.md`)
- ⬜ **3.1.3.3**: CREATE FILE write-up/extractions/personal-2025-01.md: Same pattern, personal account (~15 lines) (`slides/25-review/assets/filetree/tax-2025/write-up/extractions/personal-2025-01.md`)
- ⬜ **3.1.3.4**: CREATE FILE write-up/raw/Income 2025.md: Aggregated income from all extractions (~10 lines) (`slides/25-review/assets/filetree/tax-2025/write-up/raw/Income 2025.md`)
- ⬜ **3.1.3.5**: CREATE FILE write-up/raw/Expenses Business 2025.md: Aggregated business expenses (~12 lines) (`slides/25-review/assets/filetree/tax-2025/write-up/raw/Expenses Business 2025.md`)
- ⬜ **3.1.3.6**: CREATE FILE write-up/raw/Personal Deductions 2025.md: Aggregated personal deductions (~10 lines) (`slides/25-review/assets/filetree/tax-2025/write-up/raw/Personal Deductions 2025.md`)
- ⬜ **3.1.3.7**: CREATE FILE write-up/final/Income 2025.md: Reviewed copy with corrections applied (~10 lines) (`slides/25-review/assets/filetree/tax-2025/write-up/final/Income 2025.md`)
- ⬜ **3.1.3.8**: CREATE FILE write-up/final/Expenses Business 2025.md: Reviewed copy (~12 lines) (`slides/25-review/assets/filetree/tax-2025/write-up/final/Expenses Business 2025.md`)
- ⬜ **3.1.3.9**: CREATE FILE write-up/final/Personal Deductions 2025.md: Reviewed copy (~10 lines) (`slides/25-review/assets/filetree/tax-2025/write-up/final/Personal Deductions 2025.md`)

### ⬜ Task Group 3.2: Create Initialize Slide

**Objective**: Simplest phase slide — Terminal showing /cpa-tax-prep:initialize command + FileExplorer showing empty scaffold. No diagram needed.

#### ⬜ Task 3.2.1: Create Initialize phase slide

**File**: `slides/22-initialize/index.md`

**Description**: Simplest phase slide. Layout: heading 'Phase 0 — Initialize', Terminal component showing /cpa-tax-prep:initialize 2025 command with output, FileExplorer showing empty scaffold. Two-column layout: Terminal on left, FileExplorer on right. No diagram needed per spec.

**Context to Load**:
- `slides/11-terminal-demo/index.md` - Terminal component usage reference
- `slides/08-file-explorer/index.md` - FileExplorer component usage reference
- `components/Terminal.vue` (lines 1-15) - Terminal props interface

**Depends On**: Tasks 3.1.1

**Actions**:
- ⬜ **3.2.1.1**: CREATE FILE slides/22-initialize/index.md: USE frontmatter theme ../ layout center. MAKE heading 'Phase 0 — Initialize' (text-3xl text-gray-900). ADD two-column grid (grid-cols-2 gap-4). Left: Terminal lines=[{command:'/cpa-tax-prep:initialize 2025', output:'Creating scaffold...\n✓ source-documents/ created\n✓ intake.md template created'}] shell='bash'. Right: FileExplorer dir='22-initialize/filetree/tax-2025'. USE h-full flexbox. (`slides/22-initialize/index.md`)

### ⬜ Task Group 3.3: Create Intake Slide

**Objective**: Terminal + FileExplorer + CSS loop diagram (read source docs → ask question → user confirms → update intake.md → repeat).

#### ⬜ Task 3.3.1: Create Intake phase slide with loop diagram

**File**: `slides/23-intake/index.md`

**Description**: Phase slide with three elements. Heading 'Phase 1 — Intake'. Layout: Terminal (/cpa-tax-prep:intake 2025) and FileExplorer on left, CSS/HTML loop diagram on right showing conversational cycle: Read Source Docs → Ask Question → User Confirms → Update intake.md → Repeat. Diagram uses Tailwind CSS bordered cards with arrows (no Mermaid). Use v-click for progressive reveal.

**Context to Load**:
- `slides/22-initialize/index.md` - Previous phase slide layout for consistency
- `references/tax-prep/ARCHITECTURE.md` (lines 46-83) - Intake loop details
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 71-73) - Intake diagram spec (simple loop)

**Depends On**: Tasks 3.1.2

**Actions**:
- ⬜ **3.3.1.1**: CREATE FILE slides/23-intake/index.md: USE frontmatter theme ../ layout center clicks [TBD]. MAKE heading 'Phase 1 — Intake'. ADD layout: Terminal+FileExplorer left, loop diagram right. Terminal: lines=[{command:'/cpa-tax-prep:intake 2025', output:'Pre-reading source documents...\nStarting 9-section interview...'}]. FileExplorer: dir='23-intake/filetree/tax-2025'. Loop diagram: CSS/HTML boxes 'Read Source Docs' → 'Ask Question' → 'User Confirms' → 'Update intake.md' → arrow back. USE Tailwind bg-white border-{color}-600 border-1 rounded-lg for boxes. USE v-click animations. (`slides/23-intake/index.md`)

### ⬜ Task Group 3.4: Create Review Slide

**Objective**: Terminal + FileExplorer + CSS loop diagram (same pattern as Intake: read section → present → user confirms → update final/ → repeat).

#### ⬜ Task 3.4.1: Create Review phase slide with loop diagram

**File**: `slides/25-review/index.md`

**Description**: Same layout as Intake slide. Heading 'Phase 3 — Review'. Terminal (/cpa-tax-prep:review 2025) + FileExplorer on left, loop diagram on right: Read Section → Present to User → User Confirms/Corrects → Update final/ → Repeat. MIRROR slides/23-intake/index.md layout, change content to Review specifics. Use different accent color for visual distinction.

**Context to Load**:
- `slides/23-intake/index.md` - Loop diagram pattern to mirror
- `references/tax-prep/ARCHITECTURE.md` (lines 143-173) - Review phase details
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 74) - Review diagram spec

**Depends On**: Tasks 3.1.3

**Actions**:
- ⬜ **3.4.1.1**: CREATE FILE slides/25-review/index.md: MIRROR slides/23-intake/index.md layout. MAKE heading 'Phase 3 — Review'. Terminal: lines=[{command:'/cpa-tax-prep:review 2025', output:'Loading extracted data...\nStarting section-by-section review...'}]. FileExplorer: dir='25-review/filetree/tax-2025'. Loop diagram: 'Read Section' → 'Present to User' → 'User Confirms/Corrects' → 'Update final/' → arrow back. REPLACE Intake accent colors with Review-specific colors. (`slides/25-review/index.md`)

#### ⬜ Task 3.4.2: Rebuild index.md with 3 new phase slides

**File**: `index.md`

**Description**: Run npm run build:slides to include slides 22, 23, 25.

**Depends On**: Tasks 3.2.1, 3.3.1, 3.4.1

**Actions**:
- ⬜ **3.4.2.1**: RUN npm run build:slides (`index.md`)

---

## ⬜ Checkpoint 4: Complex Phase Slides (Extract + Package)

**Goal**: Create the two architecturally complex slides with parallel subagent diagrams. Extract shows orchestrator spawning parallel tax-extract subagents. Package shows parallel tax-package subagents feeding into a deterministic Python pipeline.

**Prerequisites**: Checkpoints 3

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `references/tax-prep/ARCHITECTURE.md` | 📄 exists | Detailed ASCII diagrams of Extract and Package phases |
| Before | `slides/23-intake/index.md` | 📄 exists | Reference for phase slide layout pattern |
| After | `slides/24-extract/index.md` | ✨ new | Extract phase slide with parallel subagent diagram |
| After | `slides/24-extract/assets/filetree/` | ✨ new | Directory with extractions/ and raw/ |
| After | `slides/26-package/index.md` | ✨ new | Package phase slide with pipeline diagram |
| After | `slides/26-package/assets/filetree/` | ✨ new | Directory with output/ folder |
| After | `index.md` | 📝 modified | Updated with 2 new slides |

**Projected Structure**:
```
slides/
├── ...
├── 22-initialize/
├── 23-intake/
├── 24-extract/
├── 25-review/
├── 26-package/
└── 99-conclusion-lets-connect/
```

### Testing Strategy

**Approach**: Visual verification in dev server

**Verification Steps**:
- [ ] `npm run build:slides`
- [ ] `npm run dev — verify parallel subagent diagrams render on Extract and Package`
- [ ] `Verify file tree shows correct directory state per phase`
- [ ] `Verify full progressive growth sequence across all 5 phase slides`

### ⬜ Task Group 4.1: Create Extract + Package FileTree Assets

**Objective**: Create filetree assets for Extract (extractions/ + raw/) and Package (output/ with sections/*.json, tax_data.json, xlsx, summary).

#### ⬜ Task 4.1.1: Create Extract phase filetree assets

**File**: `slides/24-extract/assets/filetree/tax-2025/`

**Description**: Directory after Extract completes. Shows: intake.md (populated), extractions/ with 3 per-file markdown outputs (YAML front matter + transactions), raw/ with 3 aggregated category files. ~7 files.

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` (lines 86-139) - Extract phase file outputs and aggregation

**Actions**:
- ⬜ **4.1.1.1**: CREATE FILE write-up/intake.md: Populated intake (reuse pattern from 3.1.2.2) (`slides/24-extract/assets/filetree/tax-2025/write-up/intake.md`)
- ⬜ **4.1.1.2**: CREATE FILE write-up/extractions/business-2025-01.md: YAML front matter + extracted transactions (~15 lines) (`slides/24-extract/assets/filetree/tax-2025/write-up/extractions/business-2025-01.md`)
- ⬜ **4.1.1.3**: CREATE FILE write-up/extractions/business-2025-02.md: Same pattern, Feb 2025 (`slides/24-extract/assets/filetree/tax-2025/write-up/extractions/business-2025-02.md`)
- ⬜ **4.1.1.4**: CREATE FILE write-up/extractions/personal-2025-01.md: Same pattern, personal acct (`slides/24-extract/assets/filetree/tax-2025/write-up/extractions/personal-2025-01.md`)
- ⬜ **4.1.1.5**: CREATE FILE write-up/raw/Income 2025.md: Aggregated income (~10 lines) (`slides/24-extract/assets/filetree/tax-2025/write-up/raw/Income 2025.md`)
- ⬜ **4.1.1.6**: CREATE FILE write-up/raw/Expenses Business 2025.md: Aggregated expenses (~12 lines) (`slides/24-extract/assets/filetree/tax-2025/write-up/raw/Expenses Business 2025.md`)
- ⬜ **4.1.1.7**: CREATE FILE write-up/raw/Personal Deductions 2025.md: Aggregated deductions (~10 lines) (`slides/24-extract/assets/filetree/tax-2025/write-up/raw/Personal Deductions 2025.md`)

#### ⬜ Task 4.1.2: Create Package phase filetree assets

**File**: `slides/26-package/assets/filetree/tax-2025/`

**Description**: Directory showing final output. Includes: final/ with 3 reviewed files, output/sections/ with 3 JSON files, output/2025_tax_data.json (merged), output/2025 CPA Tax Package.txt (xlsx placeholder), output/2025 CPA Summary.md. ~9 files.

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` (lines 177-247) - Package phase output structure

**Actions**:
- ⬜ **4.1.2.1**: CREATE FILE write-up/final/Income 2025.md: Reviewed income (~10 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/final/Income 2025.md`)
- ⬜ **4.1.2.2**: CREATE FILE write-up/final/Expenses Business 2025.md: Reviewed expenses (~12 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/final/Expenses Business 2025.md`)
- ⬜ **4.1.2.3**: CREATE FILE write-up/final/Personal Deductions 2025.md: Reviewed deductions (~10 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/final/Personal Deductions 2025.md`)
- ⬜ **4.1.2.4**: CREATE FILE write-up/output/sections/income.json: JSON section (~15 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/output/sections/income.json`)
- ⬜ **4.1.2.5**: CREATE FILE write-up/output/sections/business_expenses.json: JSON section (~15 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/output/sections/business_expenses.json`)
- ⬜ **4.1.2.6**: CREATE FILE write-up/output/sections/personal_deductions.json: JSON section (~15 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/output/sections/personal_deductions.json`)
- ⬜ **4.1.2.7**: CREATE FILE write-up/output/2025_tax_data.json: Merged JSON with meta block (~20 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/output/2025_tax_data.json`)
- ⬜ **4.1.2.8**: CREATE FILE write-up/output/2025 CPA Tax Package.txt: Placeholder noting xlsx with 8 tabs (~5 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/output/2025 CPA Tax Package.txt`)
- ⬜ **4.1.2.9**: CREATE FILE write-up/output/2025 CPA Summary.md: One-page CPA overview (~20 lines) (`slides/26-package/assets/filetree/tax-2025/write-up/output/2025 CPA Summary.md`)

### ⬜ Task Group 4.2: Create Extract Slide

**Objective**: Terminal + FileExplorer + HEAVY parallel subagent CSS diagram showing orchestrator spawning tax-extract subagents.

#### ⬜ Task 4.2.1: Create Extract phase slide with parallel subagent diagram

**File**: `slides/24-extract/index.md`

**Description**: HEAVY diagram slide. Heading 'Phase 2 — Extract'. Layout: FileExplorer on left, parallel subagent CSS diagram on right. Diagram: Orchestrator box → 3 parallel tax-extract subagent boxes (Business Jan, Business Feb, Personal Jan) → extractions/ → aggregation → raw/. Built with Tailwind CSS. Use v-click progressive reveal.

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` (lines 86-139) - Extract phase detailed diagram
- `slides/23-intake/index.md` - Phase slide layout consistency
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 73) - Extract diagram spec (HEAVY)

**Depends On**: Tasks 4.1.1

**Actions**:
- ⬜ **4.2.1.1**: CREATE FILE slides/24-extract/index.md: USE frontmatter theme ../ layout center clicks [TBD]. MAKE heading 'Phase 2 — Extract'. ADD two-column: FileExplorer left (dir='24-extract/filetree/tax-2025'), diagram right. Diagram: Top 'Orchestrator' card (border-blue-600) → Middle 3 parallel 'tax-extract' cards (border-green-600) labeled per PDF → Bottom-mid 'extractions/' → Bottom 'Aggregate → raw/' card. USE v-click, USE Tailwind bg-white border-{color}-600 border-1 rounded-lg. (`slides/24-extract/index.md`)

### ⬜ Task Group 4.3: Create Package Slide

**Objective**: Terminal + FileExplorer + HEAVY pipeline CSS diagram showing parallel subagents → JSON → Python scripts → final output.

#### ⬜ Task 4.3.1: Create Package phase slide with pipeline diagram

**File**: `slides/26-package/index.md`

**Description**: HEAVY diagram slide. Heading 'Phase 4 — Package'. Layout: FileExplorer on left, pipeline CSS diagram on right. Two stages: Stage 1 (parallel) 3 tax-package subagent boxes → section JSONs. Stage 2 (sequential) merge_sections.py → build_xlsx.py → validate_xlsx.py → final output. Built with Tailwind CSS. Use v-click progressive reveal.

**Context to Load**:
- `references/tax-prep/ARCHITECTURE.md` (lines 177-247) - Package phase detailed diagram
- `slides/24-extract/index.md` - Parallel subagent diagram pattern
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 75) - Package diagram spec (HEAVY)

**Depends On**: Tasks 4.1.2

**Actions**:
- ⬜ **4.3.1.1**: CREATE FILE slides/26-package/index.md: USE frontmatter theme ../ layout center clicks [TBD]. MAKE heading 'Phase 4 — Package'. ADD two-column: FileExplorer left (dir='26-package/filetree/tax-2025'), diagram right. Stage 1: 3 'tax-package' cards (border-purple-600) → section JSONs. Stage 2: 'merge_sections.py' (border-blue-600) → 'build_xlsx.py' (border-green-600) → 'validate_xlsx.py' (border-orange-600). Final: 'tax_data.json + xlsx + summary' card (border-amber-600 border-2). USE v-click, USE Tailwind. (`slides/26-package/index.md`)

#### ⬜ Task 4.3.2: Rebuild index.md with Extract and Package slides

**File**: `index.md`

**Description**: Run npm run build:slides to include slides 24, 26.

**Depends On**: Tasks 4.2.1, 4.3.1

**Actions**:
- ⬜ **4.3.2.1**: RUN npm run build:slides (`index.md`)

---

## ⬜ Checkpoint 5: Key Results + Final Assembly

**Goal**: Complete the presentation with Key Results slide (adaptability, low cost, time savings) and full integration verification. Template selection based on visual balance with existing slides.

**Prerequisites**: Checkpoints 4

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `slide-templates/column-cards/slide.md` | 📄 exists | Candidate template for Key Results |
| Before | `slide-templates/icon-list-content/slide.md` | 📄 exists | Candidate template for Key Results |
| After | `slides/27-key-results/index.md` | ✨ new | Key Results slide |
| After | `index.md` | 📝 modified | Final slide ordering with all 8 new slides |

**Projected Structure**:
```
slides/
├── ...
├── 20-why-it-matters/
├── 21-system-overview/
├── 22-initialize/
├── 23-intake/
├── 24-extract/
├── 25-review/
├── 26-package/
├── 27-key-results/
└── 99-conclusion-lets-connect/
```

### Testing Strategy

**Approach**: Full deck visual verification

**Verification Steps**:
- [ ] `npm run build:slides`
- [ ] `npm run dev — verify all 8 new slides render correctly`
- [ ] `Verify slide ordering matches video segment flow`
- [ ] `Verify all slides follow conventions (bordered cards, Title Case, no light grey text)`

### ⬜ Task Group 5.1: Create Key Results Slide

**Objective**: Create the closing content slide using column-cards template. Three cards: Adaptable, No Extra Cost, 30 Minutes. Sign-off: Own the build, own the outcome.

#### ⬜ Task 5.1.1: Create Key Results slide with column-cards

**File**: `slides/27-key-results/index.md`

**Description**: Create Key Results slide using column-cards template pattern. 3 cards with progressive reveal: (1) Adaptable — system grows with your changing situation, add new doc types with one command. (2) No Extra Cost — uses existing Claude subscription, no SaaS fees. (3) 30 Minutes — replaces hours of manual work + weeks of back-and-forth. Include 'Own the build, own the outcome.' sign-off at bottom.

**Context to Load**:
- `slides/01-column-cards/index.md` - Column-cards template usage reference
- `slide-templates/column-cards/description.md` - Template variable documentation
- `agents/sessions/2026-03-13_tax-prep_ox5g4c/spec.md` (lines 28) - Key Results content requirements

**Actions**:
- ⬜ **5.1.1.1**: CREATE FILE slides/27-key-results/index.md: MIRROR slides/01-column-cards/index.md structure. USE frontmatter theme ../ layout center clicks 3. MAKE title 'Why This Is Different'. Card 1 (green): icon=refresh, title='Adaptable', subtitle='Grows With You', points=['Adapts to your changing situation year-over-year', 'Add new document types with one command', 'YOUR system, YOUR rules']. Card 2 (blue): icon=currency, title='No Extra Cost', subtitle='Uses What You Have', points=['Runs on your existing Claude subscription', 'No monthly SaaS fees', 'You own the code']. Card 3 (orange): icon=clock, title='30 Minutes', subtitle='Not Hours, Not Weeks', points=['Replaces hours of manual organizing', 'Eliminates weeks of CPA back-and-forth', '~30 minutes of your involvement']. ADD sign-off: 'Own the build, own the outcome.' (text-lg font-bold text-gray-700 text-center mt-4). (`slides/27-key-results/index.md`)

### ⬜ Task Group 5.2: Final Assembly + Verification

**Objective**: Rebuild index.md with all 8 new slides in correct order. Verify complete presentation renders.

#### ⬜ Task 5.2.1: Final index.md rebuild and verification

**File**: `index.md`

**Description**: Run npm run build:slides to regenerate index.md with all 8 new slides (20-27) in correct order. Verify ordering matches video segment flow: Why It Matters → System Overview → Initialize → Intake → Extract → Review → Package → Key Results.

**Context to Load**:
- `scripts/build.ts` - Build script reference

**Depends On**: Tasks 5.1.1

**Actions**:
- ⬜ **5.2.1.1**: RUN npm run build:slides (`index.md`)
- ⬜ **5.2.1.2**: VERIFY slide ordering in index.md: 20, 21, 22, 23, 24, 25, 26, 27 (`index.md`)

---

---
*Auto-generated from plan.json on 2026-03-13 07:54*