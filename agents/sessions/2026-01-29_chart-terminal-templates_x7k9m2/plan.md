# Implementation Plan

> **Session**: `2026-01-29_chart-terminal-templates_x7k9m2`
> **Status**: Complete
> **Spec**: [./spec.md](./spec.md)
> **Created**: 2026-01-29
> **Updated**: 2026-01-29

---

## Overview

- **Checkpoints**: 3 (0 complete)
- **Total Tasks**: 13

## ⬜ Checkpoint 1: Chart component + full-featured chart slide with v-click progression

**Goal**: Install chart.js/vue-chartjs deps, copy Chart.vue into components/, create the chart slide template with v-click progression through bar → line → doughnut chart types, create template docs, and verify the slide renders in dev server. Full chart pipeline in one checkpoint.

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `to_add/jason_to_add/Chart.vue` | 📄 exists | Pre-built Chart.js component supporting bar/line/doughnut |
| Before | `to_add/jason_to_add/README.md` | 📄 exists | Component documentation with props and usage |
| Before | `package.json` | 📄 exists | Project dependencies (no chart.js yet) |
| After | `components/Chart.vue` | ✨ new | Chart component in auto-import location |
| After | `slide-templates/chart/slide.md` | ✨ new | Chart template with v-click progression through 3 chart types |
| After | `slide-templates/chart/description.md` | ✨ new | Chart template documentation |
| After | `package.json` | 📝 modified | Added chart.js ^4.5.1 and vue-chartjs ^5.3.3 |

### Testing Strategy

**Approach**: Dev server visual verification

**Verification Steps**:
- [ ] `Run pnpm install to install chart.js and vue-chartjs`
- [ ] `Run npm run dev and verify no build errors`
- [ ] `Navigate to chart demo slide and verify bar chart renders`
- [ ] `Click through to verify line and doughnut charts appear via v-click`

### ⬜ Task Group 1.1: Install dependencies and integrate Chart component

**Objective**: Add chart.js and vue-chartjs to package.json dependencies, run install, and copy Chart.vue from to_add/jason_to_add/ into components/ where Slidev auto-imports it.

#### ⬜ Task 1.1.1: Add chart.js and vue-chartjs to package.json

**File**: `package.json`

**Description**: Add chart.js ^4.5.1 and vue-chartjs ^5.3.3 as project dependencies so the Chart component can import from them. These are runtime deps needed for rendering charts.

**Context to Load**:
- `package.json` (lines all) - Understand current dependency structure to add new deps correctly
- `to_add/jason_to_add/Chart.vue` (lines 1-16) - Verify the exact imports needed (chart.js and vue-chartjs)

**Actions**:
- ⬜ **1.1.1.1**: UPDATE package.json: ADD 'chart.js': '^4.5.1' and 'vue-chartjs': '^5.3.3' to dependencies object (`package.json`)
- ⬜ **1.1.1.2**: RUN pnpm install to install the new dependencies

#### ⬜ Task 1.1.2: Copy Chart.vue into components/

**File**: `components/Chart.vue`

**Description**: Copy the pre-built Chart.vue from to_add/jason_to_add/ into components/ where Slidev auto-imports it. The component is ready to use as-is — no modifications needed.

**Context to Load**:
- `to_add/jason_to_add/Chart.vue` (lines all) - The source component to copy
- `to_add/jason_to_add/README.md` (lines 150-225) - Understand Chart component props and usage

**Depends On**: Tasks 1.1.1

**Actions**:
- ⬜ **1.1.2.1**: CREATE components/Chart.vue: MIRROR to_add/jason_to_add/Chart.vue exactly (copy file contents) (`components/Chart.vue`)

### ⬜ Task Group 1.2: Create chart slide template with v-click progression

**Objective**: Create slide-templates/chart/ with slide.md (Handlebars template showing 3 chart types via v-click: bar → line → doughnut) and description.md (usage documentation).

#### ⬜ Task 1.2.1: Create chart template slide.md with v-click chart type progression

**File**: `slide-templates/chart/slide.md`

**Description**: Create a Handlebars template that renders a slide with a title and three Chart components appearing via v-click: click 1 shows a bar chart, click 2 shows a line chart, click 3 shows a doughnut chart. Each chart uses the same labels/datasets but different 'type' prop. Template variables: title (slide heading), labels (shared x-axis labels), datasets (shared data), height (optional chart height). Use $clicks-based v-if for progressive reveal, similar to column-cards template pattern.

**Context to Load**:
- `slide-templates/column-cards/slide.md` (lines all) - Reference for Handlebars template structure with v-click progression pattern
- `to_add/jason_to_add/Chart.vue` (lines 42-48) - Chart component props: type, labels, datasets, title, height
- `to_add/jason_to_add/README.md` (lines 150-225) - Chart component usage examples

**Depends On**: Tasks 1.1.2

**Actions**:
- ⬜ **1.2.1.1**: CREATE slide-templates/chart/slide.md: Slidev frontmatter (theme: ../, layout: default, clicks: 3) + title div + grid of 3 Chart components with v-if='$clicks >= N' for bar (click 1), line (click 2), doughnut (click 3). USE Handlebars {{title}}, {{labels}}, {{datasets}} variables. MIRROR column-cards/slide.md pattern for v-click structure. (`slide-templates/chart/slide.md`)

#### ⬜ Task 1.2.2: Create chart template description.md

**File**: `slide-templates/chart/description.md`

**Description**: Create documentation for the chart template following the same structure as column-cards/description.md. Include: Purpose, When to Use, Template Variables table (title, labels, datasets, height), Usage Example (npm run generate:slide command), Visual Features, and Notes sections.

**Context to Load**:
- `slide-templates/column-cards/description.md` (lines all) - Reference for description.md structure and format
- `slide-templates/chart/slide.md` (lines all) - The template this doc describes — need to know the variables used

**Depends On**: Tasks 1.2.1

**Actions**:
- ⬜ **1.2.2.1**: CREATE slide-templates/chart/description.md: MIRROR column-cards/description.md structure. Include Purpose (data visualization with v-click chart type progression), When to Use, Template Variables (title, labels, datasets, height), Usage Example with npm run generate:slide command, Visual Features, Notes. (`slide-templates/chart/description.md`)

### ⬜ Task Group 1.3: Generate and verify demo chart slide

**Objective**: Generate a demo chart slide using the template, rebuild the slide index, and verify the chart renders correctly with v-click progression in the dev server.

#### ⬜ Task 1.3.1: Generate demo chart slide and rebuild index

**File**: `None`

**Description**: Run npm run generate:slide with the chart template to create a demo slide under slides/ (e.g., slides/09-chart-demo/index.md). Then run npm run build:slides to regenerate the main index.md. Finally run npm run dev and verify the chart slide renders all three chart types with v-click progression.

**Context to Load**:
- `slide-templates/chart/description.md` (lines all) - Get the generate:slide command syntax and required variables
- `slide-templates/chart/slide.md` (lines all) - Understand what variables need to be passed

**Depends On**: Tasks 1.2.2

**Actions**:
- ⬜ **1.3.1.1**: RUN npm run generate:slide -- --template=chart --name=09-chart-demo with appropriate variable values for title, labels, and datasets
- ⬜ **1.3.1.2**: RUN npm run build:slides to regenerate index.md with the new slide
- ⬜ **1.3.1.3**: RUN npm run dev and VERIFY chart slide renders bar/line/doughnut charts with v-click progression

---

## ⬜ Checkpoint 2: Terminal component with macOS chrome + working terminal slide end-to-end

**Goal**: Copy Terminal.vue into components/, update the header from VS Code style to macOS traffic-light window chrome (red/yellow/green dots), create the terminal slide template (slide.md + description.md), and generate a demo slide that renders static terminal output with syntax highlighting. Proves the terminal pipeline works end-to-end.

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `to_add/jason_to_add/Terminal.vue` | 📄 exists | Pre-built Terminal component with VS Code-style header |
| Before | `to_add/jason_to_add/README.md` | 📄 exists | Component documentation |
| After | `components/Terminal.vue` | ✨ new | Terminal component with macOS traffic-light window chrome |
| After | `slide-templates/terminal/slide.md` | ✨ new | Terminal slide template for static commands |
| After | `slide-templates/terminal/description.md` | ✨ new | Terminal template documentation |

### Testing Strategy

**Approach**: Dev server visual verification

**Verification Steps**:
- [ ] `Run npm run dev and verify terminal slide renders`
- [ ] `Verify macOS traffic light dots (red/yellow/green) appear in header`
- [ ] `Verify syntax highlighting works for bash commands`
- [ ] `Verify copy-to-clipboard works`

### ⬜ Task Group 2.1: Integrate Terminal component with macOS window chrome

**Objective**: Copy Terminal.vue from to_add/jason_to_add/ into components/, then update the header from VS Code style to macOS traffic-light window chrome (red/yellow/green dots + centered title). Keep all existing functionality intact.

#### ⬜ Task 2.1.1: Copy Terminal.vue and update to macOS window chrome

**File**: `components/Terminal.vue`

**Description**: Copy Terminal.vue from to_add/jason_to_add/ into components/. Then update the terminal header section: replace the VS Code-style header (plain text label with uppercase styling) with macOS-style window chrome featuring three traffic-light dots on the left (red #FF5F56, yellow #FFBD2E, green #27C93F as small circles) and the title centered in the header bar. Keep all other functionality intact: Shiki syntax highlighting, copy-to-clipboard, multi-line support, shell type support.

**Context to Load**:
- `to_add/jason_to_add/Terminal.vue` (lines all) - The source component — understand full structure, especially the header section (lines 163-169) that needs to be replaced with macOS chrome
- `to_add/jason_to_add/README.md` (lines 299-358) - Terminal component props and features documentation

**Actions**:
- ⬜ **2.1.1.1**: CREATE components/Terminal.vue: MIRROR to_add/jason_to_add/Terminal.vue as starting point (`components/Terminal.vue`)
- ⬜ **2.1.1.2**: UPDATE components/Terminal.vue: REPLACE the Terminal Header div (VS Code-style with text-xs font-bold uppercase) with macOS window chrome: a flex container with 3 traffic-light circle divs (w-3 h-3 rounded-full) colored #FF5F56 (red), #FFBD2E (yellow), #27C93F (green) on the left, and centered title text. Keep the same overall header styling (px-4 py-2, border-b, bg-gray-50/dark bg). (`components/Terminal.vue`)

### ⬜ Task Group 2.2: Create terminal slide template

**Objective**: Create slide-templates/terminal/ with slide.md (Handlebars template for displaying terminal commands with output) and description.md (usage documentation with all variables and examples).

#### ⬜ Task 2.2.1: Create terminal template slide.md

**File**: `slide-templates/terminal/slide.md`

**Description**: Create a Handlebars template that renders a slide with a title and a Terminal component. Template variables: title (slide heading), terminal_title (terminal window title), lines (JSON array of {command, output} objects), shell (bash/zsh/powershell/cmd, default bash), prompt (default $), height (optional). The template should render the Terminal component with :lines bound to the lines data.

**Context to Load**:
- `slide-templates/column-cards/slide.md` (lines all) - Reference for Handlebars template structure and frontmatter pattern
- `components/Terminal.vue` (lines 11-24) - Terminal component props to know what to bind in template

**Depends On**: Tasks 2.1.1

**Actions**:
- ⬜ **2.2.1.1**: CREATE slide-templates/terminal/slide.md: Slidev frontmatter (theme: ../, layout: default) + title div + Terminal component with :lines, :title, :shell, :prompt, :height props bound to Handlebars variables. USE column-cards/slide.md as structural reference. (`slide-templates/terminal/slide.md`)

#### ⬜ Task 2.2.2: Create terminal template description.md

**File**: `slide-templates/terminal/description.md`

**Description**: Create documentation for the terminal template following column-cards/description.md structure. Include: Purpose, When to Use, Template Variables table (title, terminal_title, lines, shell, prompt, height), Lines Structure (command, output, prompt fields), Usage Example, Visual Features (macOS chrome, syntax highlighting, copy-to-clipboard), Notes.

**Context to Load**:
- `slide-templates/column-cards/description.md` (lines all) - Reference for description.md structure and format
- `slide-templates/terminal/slide.md` (lines all) - The template this doc describes

**Depends On**: Tasks 2.2.1

**Actions**:
- ⬜ **2.2.2.1**: CREATE slide-templates/terminal/description.md: MIRROR column-cards/description.md structure. Include Purpose (terminal/CLI output display), When to Use, Template Variables, Lines Structure, Usage Example with npm run generate:slide command, Visual Features (macOS chrome, Shiki highlighting, copy), Notes. (`slide-templates/terminal/description.md`)

### ⬜ Task Group 2.3: Generate and verify demo terminal slide

**Objective**: Generate a demo terminal slide using the template, rebuild the slide index, and verify the terminal renders correctly with macOS chrome and syntax highlighting in the dev server.

#### ⬜ Task 2.3.1: Generate demo terminal slide and verify

**File**: `None`

**Description**: Run npm run generate:slide with the terminal template to create a demo slide under slides/ (e.g., slides/10-terminal-demo/index.md). Then run npm run build:slides. Finally run npm run dev and verify: macOS traffic lights visible, commands syntax-highlighted, copy button works on hover.

**Context to Load**:
- `slide-templates/terminal/description.md` (lines all) - Get the generate:slide command syntax and required variables
- `slide-templates/terminal/slide.md` (lines all) - Understand what variables need to be passed

**Depends On**: Tasks 2.2.2

**Actions**:
- ⬜ **2.3.1.1**: RUN npm run generate:slide -- --template=terminal --name=10-terminal-demo with sample commands (e.g., npm install, npm run dev with outputs)
- ⬜ **2.3.1.2**: RUN npm run build:slides to regenerate index.md
- ⬜ **2.3.1.3**: RUN npm run dev and VERIFY terminal slide renders with macOS chrome, syntax highlighting, and copy-to-clipboard

---

## ⬜ Checkpoint 3: Terminal typing animation + v-click per command

**Goal**: Add animated typing mode to Terminal.vue: new 'animated' boolean prop. When animated=true, v-click triggers each command to type character-by-character (~50ms/char), brief pause (~300ms), then output appears instantly. Blinking cursor visible during typing. Update terminal slide template to support animated mode. Both static and animated modes work correctly.

**Prerequisites**: Checkpoints 2

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `components/Terminal.vue` | 📄 exists | Static terminal with macOS chrome from CP2 |
| Before | `slide-templates/terminal/slide.md` | 📄 exists | Terminal template from CP2 |
| After | `components/Terminal.vue` | 📝 modified | Terminal with animated typing mode (animated prop) |
| After | `slide-templates/terminal/slide.md` | 📝 modified | Template supporting animated variable |

### Testing Strategy

**Approach**: Dev server visual verification

**Verification Steps**:
- [ ] `Run npm run dev and navigate to terminal demo slide`
- [ ] `Verify v-click triggers typing animation for each command`
- [ ] `Verify blinking cursor appears during typing`
- [ ] `Verify output appears after typing animation completes`
- [ ] `Verify static mode still works without animated prop`

### ⬜ Task Group 3.1: Add animated typing mode to Terminal.vue

**Objective**: Add 'animated' boolean prop to Terminal.vue. When animated=true, each command types character-by-character with blinking cursor, then output appears after a brief pause. v-click controls progression between commands.

#### ⬜ Task 3.1.1: Add animated prop and typing animation logic to Terminal.vue

**File**: `components/Terminal.vue`

**Description**: Add 'animated' boolean prop (default false) to Terminal.vue. When animated=true, implement typing animation: (1) Each terminal line is hidden until activated (via internal state, triggered by v-click or prop change). (2) When a line activates: command text types character-by-character at ~50ms/char using setInterval. (3) A blinking cursor (CSS @keyframes, thin vertical bar) appears at the current typing position. (4) After command finishes typing: ~300ms pause, then output appears instantly. (5) Cursor moves to next line's prompt position. When animated=false: existing static rendering behavior is completely unchanged. Implementation approach: add reactive state (visibleLines count, currentCharIndex, isTyping, showOutput map), typing functions using setInterval, and conditional template rendering based on animated mode.

**Context to Load**:
- `components/Terminal.vue` (lines all) - The current Terminal component — understand full structure, props, template, and existing rendering logic to add animation alongside it

**Actions**:
- ⬜ **3.1.1.1**: UPDATE components/Terminal.vue: ADD prop 'animated' Boolean with default false to the defineProps (`components/Terminal.vue`)
- ⬜ **3.1.1.2**: UPDATE components/Terminal.vue: ADD reactive state refs for animation: visibleLines (number, starts at 0), currentCharIndex (number), isTyping (boolean), showOutputMap (Map<number, boolean>) (`components/Terminal.vue`)
- ⬜ **3.1.1.3**: UPDATE components/Terminal.vue: ADD FUNCTION startTyping(lineIndex: number) that uses setInterval at ~50ms to increment currentCharIndex, showing one more character of the command each tick. When done, calls onTypingComplete. (`components/Terminal.vue`)
- ⬜ **3.1.1.4**: UPDATE components/Terminal.vue: ADD FUNCTION onTypingComplete(lineIndex: number) that waits ~300ms via setTimeout, then sets showOutputMap.set(lineIndex, true) to reveal output instantly. (`components/Terminal.vue`)
- ⬜ **3.1.1.5**: UPDATE components/Terminal.vue: ADD FUNCTION activateNextLine() that increments visibleLines and calls startTyping for the new line. This is the function v-click or external trigger calls. (`components/Terminal.vue`)
- ⬜ **3.1.1.6**: UPDATE components/Terminal.vue template: ADD conditional rendering — when animated=true, only show lines up to visibleLines count, show partial command text (substring 0 to currentCharIndex) for the currently typing line, show blinking cursor span after partial text, show output only when showOutputMap has true for that line. When animated=false, keep existing static template unchanged. (`components/Terminal.vue`)
- ⬜ **3.1.1.7**: UPDATE components/Terminal.vue styles: ADD CSS @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } } and .cursor class with animation: blink 1s step-end infinite, display: inline-block, width: 2px, height: 1em, background: #fff, vertical-align: text-bottom (`components/Terminal.vue`)

### ⬜ Task Group 3.2: Update terminal template for animated mode

**Objective**: Update slide-templates/terminal/slide.md and description.md to support the new animated variable, allowing template users to generate animated terminal slides.

#### ⬜ Task 3.2.1: Update terminal slide.md template with animated option

**File**: `slide-templates/terminal/slide.md`

**Description**: Update the terminal slide template to support an 'animated' Handlebars variable. When animated is true, add :animated='true' to the Terminal component props. Use Handlebars {{#if animated}} conditional.

**Context to Load**:
- `slide-templates/terminal/slide.md` (lines all) - The existing template to update

**Depends On**: Tasks 3.1.1

**Actions**:
- ⬜ **3.2.1.1**: UPDATE slide-templates/terminal/slide.md: ADD {{#if animated}}:animated='true'{{/if}} to the Terminal component props in the template (`slide-templates/terminal/slide.md`)

#### ⬜ Task 3.2.2: Update terminal description.md with animated documentation

**File**: `slide-templates/terminal/description.md`

**Description**: Update the terminal template documentation to include the animated variable in the Template Variables table, add an animated usage example, and describe the animation behavior in Visual Features.

**Context to Load**:
- `slide-templates/terminal/description.md` (lines all) - The existing documentation to update

**Depends On**: Tasks 3.2.1

**Actions**:
- ⬜ **3.2.2.1**: UPDATE slide-templates/terminal/description.md: ADD 'animated' variable to Template Variables table (boolean, default false, enables typing animation). ADD animated usage example. ADD animation behavior description to Visual Features section. (`slide-templates/terminal/description.md`)

### ⬜ Task Group 3.3: Verify both static and animated modes

**Objective**: Run the dev server and verify that both static terminal mode (no animation) and animated terminal mode (typing animation with v-click) work correctly.

#### ⬜ Task 3.3.1: Verify animated and static terminal modes end-to-end

**File**: `None`

**Description**: Run npm run dev and test both terminal modes: (1) Static mode — existing terminal demo slide should render all commands immediately with no animation. (2) Animated mode — create or update a slide with :animated='true' and verify: v-click triggers typing, blinking cursor appears during typing, output appears after typing completes, multiple commands work sequentially.

**Context to Load**:
- `components/Terminal.vue` (lines all) - Verify the animated prop and typing logic are implemented

**Depends On**: Tasks 3.2.2

**Actions**:
- ⬜ **3.3.1.1**: RUN npm run dev and VERIFY static terminal mode still works (no animation, all commands visible immediately)
- ⬜ **3.3.1.2**: VERIFY animated terminal mode: typing animation at ~50ms/char, blinking cursor, ~300ms pause, instant output reveal, v-click progression between commands

---

---
*Auto-generated from plan.json on 2026-01-29 18:58*