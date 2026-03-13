# Implementation Plan

> **Session**: `2026-01-29_expand-animations-vclicks_yfpe74`
> **Status**: Complete
> **Spec**: [./spec.md](./spec.md)
> **Created**: 2026-01-29
> **Updated**: 2026-01-29

---

## Overview

- **Checkpoints**: 3 (0 complete)
- **Total Tasks**: 14

## ⬜ Checkpoint 1: Tracer bullet: Migrate one simple + one complex slide

**Goal**: Prove both animation patterns work end-to-end by migrating 01-column-cards (additive) and 06-continuum-middle-ground (scene + reactive). This validates the $clicks approach for both simple and complex cases before bulk migration.

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `slides/01-column-cards/index.md` | 📄 exists | Uses <v-clicks> wrapper for 3 card divs |
| Before | `slides/06-continuum-middle-ground/index.md` | 📄 exists | Uses <v-click at='N'> + $slidev.nav.clicks reactive opacity — most problematic slide |
| Before | `to_add/08-how-skills-work.md` | 📄 exists | Reference implementation of scene replacement pattern |
| After | `slides/01-column-cards/index.md` | 📝 modified | Uses v-if="$clicks >= N" additive pattern |
| After | `slides/06-continuum-middle-ground/index.md` | 📝 modified | Uses v-if="$clicks >= N" + :class with $clicks reactive styling |

**Projected Structure**:
```
slides/
  01-column-cards/index.md  ($clicks additive)
  06-continuum-middle-ground/index.md  ($clicks scene+reactive)
```

### Testing Strategy

**Approach**: Visual verification via dev server

**Verification Steps**:
- [ ] `Run npm run dev`
- [ ] `Navigate to slide 2 (01-column-cards) and verify cards appear one-by-one on click`
- [ ] `Navigate to slide 7 (06-continuum-middle-ground) and verify: left extreme appears click 1, right extreme click 2, both fade + middle appears click 3`
- [ ] `Reload each slide page and confirm no hydration flash on initial load`

### ⬜ Task Group 1.1: Migrate 01-column-cards (additive pattern)

**Objective**: Replace <v-clicks> wrapper with individual v-if="$clicks >= N" on each card div. Add clicks frontmatter. Proves the simplest $clicks pattern.

#### ⬜ Task 1.1.1: Replace v-clicks with $clicks additive pattern in 01-column-cards

**File**: `slides/01-column-cards/index.md`

**Description**: The slide wraps 3 card <div>s inside <v-clicks>...</v-clicks> for sequential reveal. Migrate to $clicks additive pattern: add clicks:3 to frontmatter, remove <v-clicks> and </v-clicks> wrapper tags, add v-if="$clicks >= N" to each of the 3 card divs (N=1 for Title & About, N=2 for Content, N=3 for Diagrams).

**Context to Load**:
- `to_add/08-how-skills-work.md` (lines 1-20) - Reference pattern — see how clicks frontmatter and v-if=$clicks are structured
- `slides/01-column-cards/index.md` (lines all) - Current slide content to migrate — note <v-clicks> on line 9 and </v-clicks> on line 74

**Actions**:
- ⬜ **1.1.1.1**: ADD frontmatter field clicks: 3 to the YAML frontmatter block (`slides/01-column-cards/index.md`)
- ⬜ **1.1.1.2**: REMOVE <v-clicks> opening tag (line 9) and </v-clicks> closing tag (line 74) (`slides/01-column-cards/index.md`)
- ⬜ **1.1.1.3**: ADD v-if="$clicks >= 1" to first card div (Title & About, ~line 11), ADD v-if="$clicks >= 2" to second card div (Content, ~line 33), ADD v-if="$clicks >= 3" to third card div (Diagrams, ~line 54) (`slides/01-column-cards/index.md`)

### ⬜ Task Group 1.2: Migrate 06-continuum-middle-ground (scene + reactive pattern)

**Objective**: Replace <v-click at='N'> with v-if="$clicks >= N" for element reveals. Replace $slidev.nav.clicks with $clicks in reactive :class bindings. Add clicks frontmatter. Remove .slidev-vclick-hidden style. Proves the complex pattern.

#### ⬜ Task 1.2.1: Replace v-click at directives and $slidev.nav.clicks with $clicks pattern in 06-continuum-middle-ground

**File**: `slides/06-continuum-middle-ground/index.md`

**Description**: The slide uses 3 <v-click at='N'> blocks (at=1,2,3) for reveals and $slidev.nav.clicks in :class bindings for reactive opacity fading. Migrate: add clicks:3 to frontmatter, unwrap each <v-click at='N'>...</v-click> by removing the wrapper tags and adding v-if="$clicks >= N" to the inner card div, replace $slidev.nav.clicks with $clicks in :class bindings (2 occurrences on Left Extreme and Right Extreme cards), remove .slidev-vclick-hidden style block.

**Context to Load**:
- `to_add/08-how-skills-work.md` (lines 1-20) - Reference pattern for clicks frontmatter and v-if structure
- `slides/06-continuum-middle-ground/index.md` (lines all) - Current slide — note v-click at='1' on line 24, at='2' on line 46, at='3' on line 68, $slidev.nav.clicks on lines 27 and 49, .slidev-vclick-hidden style on lines 87-91

**Actions**:
- ⬜ **1.2.1.1**: ADD frontmatter field clicks: 3 to the YAML frontmatter block (`slides/06-continuum-middle-ground/index.md`)
- ⬜ **1.2.1.2**: REPLACE <v-click at="1">...</v-click> wrapper: REMOVE <v-click at="1"> and </v-click> tags, ADD v-if="$clicks >= 1" to the inner card div (Left Extreme card, class includes absolute left-[0%]) (`slides/06-continuum-middle-ground/index.md`)
- ⬜ **1.2.1.3**: REPLACE <v-click at="2">...</v-click> wrapper: REMOVE <v-click at="2"> and </v-click> tags, ADD v-if="$clicks >= 2" to the inner card div (Right Extreme card, class includes absolute right-[0%]) (`slides/06-continuum-middle-ground/index.md`)
- ⬜ **1.2.1.4**: REPLACE <v-click at="3">...</v-click> wrapper: REMOVE <v-click at="3"> and </v-click> tags, ADD v-if="$clicks >= 3" to the inner card div (Sweet Spot card, class includes absolute left-1/2) (`slides/06-continuum-middle-ground/index.md`)
- ⬜ **1.2.1.5**: REPLACE $slidev.nav.clicks with $clicks in all :class bindings (2 occurrences: Left Extreme card :class="{ 'opacity-40': $slidev.nav.clicks >= 3 }" and Right Extreme card :class="{ 'opacity-40': $slidev.nav.clicks >= 3 }") (`slides/06-continuum-middle-ground/index.md`)
- ⬜ **1.2.1.6**: REMOVE the <style> block containing .slidev-vclick-hidden { opacity: 0; } rule (no longer needed with v-if approach) (`slides/06-continuum-middle-ground/index.md`)

---

## ⬜ Checkpoint 2: Migrate remaining 4 animated slides

**Goal**: Apply proven $clicks patterns to the remaining slides: 03-icon-list-content (additive), 04-continuum-diagram (scene/additive), 05-extremes-to-middle (additive), 07-three-to-one-takeaway (additive).

**Prerequisites**: Checkpoints 1

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `slides/03-icon-list-content/index.md` | 📄 exists | Uses <v-click> for sections 2 and 3 |
| Before | `slides/04-continuum-diagram/index.md` | 📄 exists | Uses <v-click> and <v-click at='N'> for sequenced reveals |
| Before | `slides/05-extremes-to-middle/index.md` | 📄 exists | Uses <v-click> for 2 progressive sections |
| Before | `slides/07-three-to-one-takeaway/index.md` | 📄 exists | Uses <v-clicks> + <v-click> for cards + takeaway |
| After | `slides/03-icon-list-content/index.md` | 📝 modified | Uses $clicks additive pattern |
| After | `slides/04-continuum-diagram/index.md` | 📝 modified | Uses $clicks additive pattern with ordered reveals |
| After | `slides/05-extremes-to-middle/index.md` | 📝 modified | Uses $clicks additive pattern |
| After | `slides/07-three-to-one-takeaway/index.md` | 📝 modified | Uses $clicks additive pattern |

**Projected Structure**:
```
slides/
  03-icon-list-content/index.md  ($clicks additive)
  04-continuum-diagram/index.md  ($clicks additive)
  05-extremes-to-middle/index.md  ($clicks additive)
  07-three-to-one-takeaway/index.md  ($clicks additive)
```

### Testing Strategy

**Approach**: Visual verification via dev server

**Verification Steps**:
- [ ] `Navigate to each migrated slide and click through all states`
- [ ] `Verify animation order matches original behavior`
- [ ] `Reload each slide and confirm no hydration flash`

### ⬜ Task Group 2.1: Migrate simple additive slides (03, 05, 07)

**Objective**: Three slides with straightforward v-click/v-clicks → $clicks additive migration. All use simple sequential reveals.

#### ⬜ Task 2.1.1: Migrate 03-icon-list-content to $clicks additive

**File**: `slides/03-icon-list-content/index.md`

**Description**: The slide has 3 sections. Section 1 is always visible. Section 2 is wrapped in <v-click> (appears at click 1). Section 3 is wrapped in <v-click> (appears at click 2). Migrate: add clicks:2 to frontmatter, remove <v-click> and </v-click> tags around sections 2 and 3, add v-if="$clicks >= 1" to section 2 outer div and v-if="$clicks >= 2" to section 3 outer div.

**Context to Load**:
- `slides/03-icon-list-content/index.md` (lines all) - Current slide — <v-click> around section 2 (~lines 25,42) and section 3 (~lines 43,60)
- `slides/01-column-cards/index.md` (lines all) - Reference: already-migrated slide showing $clicks additive pattern (after CP1)

**Actions**:
- ⬜ **2.1.1.1**: ADD clicks: 2 to frontmatter (`slides/03-icon-list-content/index.md`)
- ⬜ **2.1.1.2**: REMOVE <v-click> and </v-click> wrapper tags around section 2 (~lines 25,42) (`slides/03-icon-list-content/index.md`)
- ⬜ **2.1.1.3**: REMOVE <v-click> and </v-click> wrapper tags around section 3 (~lines 43,60) (`slides/03-icon-list-content/index.md`)
- ⬜ **2.1.1.4**: ADD v-if="$clicks >= 1" to section 2 outer div, ADD v-if="$clicks >= 2" to section 3 outer div (`slides/03-icon-list-content/index.md`)

#### ⬜ Task 2.1.2: Migrate 05-extremes-to-middle to $clicks additive

**File**: `slides/05-extremes-to-middle/index.md`

**Description**: The slide has an always-visible top section (two extremes), then two <v-click> wrapped sections: middle detail (arrows + benefit lists, click 1) and conclusion (arrows + 'Best of Both Worlds', click 2). Migrate: add clicks:2 to frontmatter, remove <v-click>/<v-click> wrappers, add v-if="$clicks >= 1" to middle section, v-if="$clicks >= 2" to conclusion section.

**Context to Load**:
- `slides/05-extremes-to-middle/index.md` (lines all) - Current slide — <v-click> around middle section (~lines 21,53) and conclusion (~lines 55,74)

**Actions**:
- ⬜ **2.1.2.1**: ADD clicks: 2 to frontmatter (`slides/05-extremes-to-middle/index.md`)
- ⬜ **2.1.2.2**: REMOVE <v-click> and </v-click> wrapper around middle section (~lines 21,53) (`slides/05-extremes-to-middle/index.md`)
- ⬜ **2.1.2.3**: REMOVE <v-click> and </v-click> wrapper around conclusion section (~lines 55,74) (`slides/05-extremes-to-middle/index.md`)
- ⬜ **2.1.2.4**: ADD v-if="$clicks >= 1" to middle section outer div, ADD v-if="$clicks >= 2" to conclusion section outer div (`slides/05-extremes-to-middle/index.md`)

#### ⬜ Task 2.1.3: Migrate 07-three-to-one-takeaway to $clicks additive

**File**: `slides/07-three-to-one-takeaway/index.md`

**Description**: The slide has 3 card divs wrapped in <v-clicks> (sequential reveal at clicks 1,2,3) and a takeaway div wrapped in <v-click> (appears at click 4). Migrate: add clicks:4 to frontmatter, remove <v-clicks>/<v-clicks> wrapper, remove <v-click>/<v-click> wrapper, add v-if="$clicks >= 1" to card 1, v-if="$clicks >= 2" to card 2, v-if="$clicks >= 3" to card 3, v-if="$clicks >= 4" to takeaway div.

**Context to Load**:
- `slides/07-three-to-one-takeaway/index.md` (lines all) - Current slide — <v-clicks> around 3 cards (~lines 9,25), <v-click> around takeaway (~lines 28,38)

**Actions**:
- ⬜ **2.1.3.1**: ADD clicks: 4 to frontmatter (`slides/07-three-to-one-takeaway/index.md`)
- ⬜ **2.1.3.2**: REMOVE <v-clicks> and </v-clicks> wrapper around card divs (~lines 9,25) (`slides/07-three-to-one-takeaway/index.md`)
- ⬜ **2.1.3.3**: REMOVE <v-click> and </v-click> wrapper around takeaway div (~lines 28,38) (`slides/07-three-to-one-takeaway/index.md`)
- ⬜ **2.1.3.4**: ADD v-if="$clicks >= 1" to card 1 div, v-if="$clicks >= 2" to card 2 div, v-if="$clicks >= 3" to card 3 div (`slides/07-three-to-one-takeaway/index.md`)
- ⬜ **2.1.3.5**: ADD v-if="$clicks >= 4" to takeaway outer div (`slides/07-three-to-one-takeaway/index.md`)

### ⬜ Task Group 2.2: Migrate 04-continuum-diagram (ordered additive with v-click at)

**Objective**: This slide uses v-click and v-click at='N' for non-sequential reveal order (DOM order differs from click order). Needs careful click numbering to preserve the original reveal sequence.

#### ⬜ Task 2.2.1: Migrate 04-continuum-diagram to $clicks additive with ordered reveals

**File**: `slides/04-continuum-diagram/index.md`

**Description**: The slide uses: <v-click> (default, click 1) for left chars, <v-click at='3'> for sweet spot center, <v-click at='2'> for right chars, <v-click at='4'> for bottom text. The DOM order differs from click order — right chars appear after sweet spot in DOM but should reveal at click 2. Migrate: add clicks:4 to frontmatter, unwrap all v-click tags, add v-if="$clicks >= 1" to left chars div, v-if="$clicks >= 3" to sweet spot div, v-if="$clicks >= 2" to right chars div, v-if="$clicks >= 4" to bottom text div.

**Context to Load**:
- `slides/04-continuum-diagram/index.md` (lines all) - Current slide — v-click at lines 34, 40, 52, 60. Note non-sequential ordering.

**Actions**:
- ⬜ **2.2.1.1**: ADD clicks: 4 to frontmatter (`slides/04-continuum-diagram/index.md`)
- ⬜ **2.2.1.2**: REMOVE <v-click> and </v-click> around left chars div (~lines 34,39), ADD v-if="$clicks >= 1" to the inner div (`slides/04-continuum-diagram/index.md`)
- ⬜ **2.2.1.3**: REMOVE <v-click at="3"> and </v-click> around sweet spot div (~lines 40,51), ADD v-if="$clicks >= 3" to the inner div (`slides/04-continuum-diagram/index.md`)
- ⬜ **2.2.1.4**: REMOVE <v-click at="2"> and </v-click> around right chars div (~lines 52,57), ADD v-if="$clicks >= 2" to the inner div (`slides/04-continuum-diagram/index.md`)
- ⬜ **2.2.1.5**: REMOVE <v-click at="4"> and </v-click> around bottom text (~lines 60,64), ADD v-if="$clicks >= 4" to the inner div (`slides/04-continuum-diagram/index.md`)

---

## ⬜ Checkpoint 3: Update templates and add animation pattern guidance to Slidev skill

**Goal**: Update slide-templates (slide.md + example.md) to use $clicks patterns instead of v-click directives. Add comprehensive animation pattern documentation to the Slidev skill (references/animation-patterns.md) covering all three patterns with when-to-use guidance. Update SKILL.md itself to understand the more complicated $clicks process for complex slides — the skill should teach agents HOW to properly implement click-driven animations, not just list the patterns.

**Prerequisites**: Checkpoints 1, 2

### File Context

| State | File | Status | Description |
|-------|------|--------|-------------|
| Before | `slide-templates/column-cards/slide.md` | 📄 exists | Template using v-clicks |
| Before | `slide-templates/column-cards/example.md` | 📄 exists | Example using v-clicks |
| Before | `slide-templates/icon-list-content/slide.md` | 📄 exists | Template using v-click |
| Before | `slide-templates/icon-list-content/example.md` | 📄 exists | Example using v-click |
| Before | `slide-templates/continuum-diagram/slide.md` | 📄 exists | Template using v-click at |
| Before | `slide-templates/continuum-diagram/example.md` | 📄 exists | Example using v-click at |
| Before | `slide-templates/continuum-middle-ground/slide.md` | 📄 exists | Template using v-click at + reactive |
| Before | `slide-templates/continuum-middle-ground/example.md` | 📄 exists | Example using v-click at + reactive |
| Before | `slide-templates/extremes-to-middle/slide.md` | 📄 exists | Template using v-click |
| Before | `slide-templates/extremes-to-middle/example.md` | 📄 exists | Example using v-click |
| Before | `slide-templates/three-to-one-takeaway/slide.md` | 📄 exists | Template using v-clicks + v-click |
| Before | `slide-templates/three-to-one-takeaway/example.md` | 📄 exists | Example using v-clicks + v-click |
| Before | `.claude/skills/slidev/SKILL.md` | 📄 exists | Slidev skill - no animation guidance yet |
| After | `slide-templates/*/slide.md` | 📝 modified | All animated templates use $clicks pattern |
| After | `slide-templates/*/example.md` | 📝 modified | All animated examples use $clicks pattern |
| After | `.claude/skills/slidev/references/animation-patterns.md` | ✨ new | Animation pattern guide: additive, scene replacement, reactive styling |
| After | `.claude/skills/slidev/SKILL.md` | 📝 modified | Updated to reference animation-patterns.md |

**Projected Structure**:
```
slide-templates/
  (6 template folders with $clicks patterns)
.claude/skills/slidev/
  SKILL.md  (references animation-patterns.md)
  references/
    animation-patterns.md  (NEW)
```

### Testing Strategy

**Approach**: Template generation test + documentation review

**Verification Steps**:
- [ ] `Generate a test slide from column-cards template, verify it uses $clicks`
- [ ] `Review animation-patterns.md covers all three patterns with examples`
- [ ] `Verify SKILL.md references the new animation documentation`
- [ ] `Check that pattern selection guidance explains WHEN to use each pattern`

### ⬜ Task Group 3.1: Update slide template files (slide.md + example.md)

**Objective**: Migrate all 6 animated template folders to use $clicks patterns in both slide.md (template) and example.md (sample content).

#### ⬜ Task 3.1.1: Migrate column-cards template to $clicks

**File**: `slide-templates/column-cards/slide.md`

**Description**: Update column-cards template files. slide.md: Replace <v-clicks>/<v-clicks> wrapper with v-if="$clicks >= N" on each card div, add clicks frontmatter. example.md: Same migration — replace <v-clicks> with individual v-if on each card.

**Context to Load**:
- `slide-templates/column-cards/slide.md` (lines all) - Current template — <v-clicks> on line 9, </v-clicks> on line 33
- `slide-templates/column-cards/example.md` (lines all) - Current example with v-clicks
- `slides/01-column-cards/index.md` (lines all) - Already-migrated slide as reference (after CP1)

**Actions**:
- ⬜ **3.1.1.1**: UPDATE slide-templates/column-cards/slide.md: ADD clicks frontmatter, REMOVE <v-clicks>/<v-clicks>, ADD v-if="$clicks >= N" to each card div (`slide-templates/column-cards/slide.md`)
- ⬜ **3.1.1.2**: UPDATE slide-templates/column-cards/example.md: ADD clicks frontmatter, REPLACE v-clicks with v-if="$clicks >= N" on each card (`slide-templates/column-cards/example.md`)

#### ⬜ Task 3.1.2: Migrate icon-list-content template to $clicks

**File**: `slide-templates/icon-list-content/slide.md`

**Description**: Update icon-list-content template files. slide.md uses Handlebars conditional {{#if @index}}<v-click>{{/if}} to wrap non-first sections. Replace with v-if="$clicks >= {{@index}}" pattern. example.md: Replace <v-click> wrappers with v-if.

**Context to Load**:
- `slide-templates/icon-list-content/slide.md` (lines all) - Current template — conditional v-click on lines 9, 27
- `slide-templates/icon-list-content/example.md` (lines all) - Current example with v-click
- `slides/03-icon-list-content/index.md` (lines all) - Already-migrated slide as reference (after CP2)

**Actions**:
- ⬜ **3.1.2.1**: UPDATE slide-templates/icon-list-content/slide.md: REPLACE {{#if @index}}<v-click>{{/if}} with v-if="$clicks >= {{@index}}" (only on non-first items), ADD clicks frontmatter based on section count (`slide-templates/icon-list-content/slide.md`)
- ⬜ **3.1.2.2**: UPDATE slide-templates/icon-list-content/example.md: ADD clicks frontmatter, REPLACE <v-click> wrappers with v-if on each section (`slide-templates/icon-list-content/example.md`)

#### ⬜ Task 3.1.3: Migrate continuum-diagram template to $clicks

**File**: `slide-templates/continuum-diagram/slide.md`

**Description**: Update continuum-diagram template files. slide.md uses conditional v-click with optional at attribute via Handlebars. Replace with v-if="$clicks >= N" pattern. example.md: Replace v-click at with v-if.

**Context to Load**:
- `slide-templates/continuum-diagram/slide.md` (lines all) - Current template — v-click with Handlebars conditionals on lines 41, 58, 64, 68
- `slide-templates/continuum-diagram/example.md` (lines all) - Current example with v-click at
- `slides/04-continuum-diagram/index.md` (lines all) - Already-migrated slide as reference (after CP2)

**Actions**:
- ⬜ **3.1.3.1**: UPDATE slide-templates/continuum-diagram/slide.md: REPLACE v-click Handlebars conditionals with v-if="$clicks >= N" pattern, ADD clicks frontmatter, update template variables for click numbering (`slide-templates/continuum-diagram/slide.md`)
- ⬜ **3.1.3.2**: UPDATE slide-templates/continuum-diagram/example.md: ADD clicks frontmatter, REPLACE v-click at with v-if on each element (`slide-templates/continuum-diagram/example.md`)

#### ⬜ Task 3.1.4: Migrate continuum-middle-ground template to $clicks

**File**: `slide-templates/continuum-middle-ground/slide.md`

**Description**: Update continuum-middle-ground template files. slide.md uses v-click at='N' and $slidev.nav.clicks for reactive opacity. Replace v-click at with v-if, replace $slidev.nav.clicks with $clicks. example.md: Same.

**Context to Load**:
- `slide-templates/continuum-middle-ground/slide.md` (lines all) - Current template — v-click at on lines 29, 56, 83
- `slide-templates/continuum-middle-ground/example.md` (lines all) - Current example with v-click at + reactive
- `slides/06-continuum-middle-ground/index.md` (lines all) - Already-migrated slide as reference (after CP1)

**Actions**:
- ⬜ **3.1.4.1**: UPDATE slide-templates/continuum-middle-ground/slide.md: REPLACE v-click at='N' wrappers with v-if="$clicks >= N" on inner divs, REPLACE $slidev.nav.clicks with $clicks, ADD clicks frontmatter, REMOVE .slidev-vclick-hidden style if present (`slide-templates/continuum-middle-ground/slide.md`)
- ⬜ **3.1.4.2**: UPDATE slide-templates/continuum-middle-ground/example.md: Same migration as slide.md (`slide-templates/continuum-middle-ground/example.md`)

#### ⬜ Task 3.1.5: Migrate extremes-to-middle template to $clicks

**File**: `slide-templates/extremes-to-middle/slide.md`

**Description**: Update extremes-to-middle template files. slide.md: Replace <v-click> wrappers with v-if on section divs. example.md: Same.

**Context to Load**:
- `slide-templates/extremes-to-middle/slide.md` (lines all) - Current template — <v-click> on lines 21, 55, 58, 77
- `slide-templates/extremes-to-middle/example.md` (lines all) - Current example with v-click
- `slides/05-extremes-to-middle/index.md` (lines all) - Already-migrated slide as reference (after CP2)

**Actions**:
- ⬜ **3.1.5.1**: UPDATE slide-templates/extremes-to-middle/slide.md: ADD clicks frontmatter, REMOVE <v-click>/<v-click> wrappers, ADD v-if="$clicks >= N" to each section div (`slide-templates/extremes-to-middle/slide.md`)
- ⬜ **3.1.5.2**: UPDATE slide-templates/extremes-to-middle/example.md: Same migration as slide.md (`slide-templates/extremes-to-middle/example.md`)

#### ⬜ Task 3.1.6: Migrate three-to-one-takeaway template to $clicks

**File**: `slide-templates/three-to-one-takeaway/slide.md`

**Description**: Update three-to-one-takeaway template files. slide.md: Replace <v-clicks> around cards and <v-click> around takeaway with v-if on each element. example.md: Same.

**Context to Load**:
- `slide-templates/three-to-one-takeaway/slide.md` (lines all) - Current template — <v-clicks> on line 9, </v-clicks> on line 25, <v-click> on line 28
- `slide-templates/three-to-one-takeaway/example.md` (lines all) - Current example with v-clicks + v-click
- `slides/07-three-to-one-takeaway/index.md` (lines all) - Already-migrated slide as reference (after CP2)

**Actions**:
- ⬜ **3.1.6.1**: UPDATE slide-templates/three-to-one-takeaway/slide.md: ADD clicks frontmatter, REMOVE <v-clicks>/<v-clicks> and <v-click>/<v-click>, ADD v-if="$clicks >= N" to each card and takeaway div (`slide-templates/three-to-one-takeaway/slide.md`)
- ⬜ **3.1.6.2**: UPDATE slide-templates/three-to-one-takeaway/example.md: Same migration (`slide-templates/three-to-one-takeaway/example.md`)

### ⬜ Task Group 3.2: Create animation-patterns.md reference and update SKILL.md

**Objective**: Create comprehensive animation pattern documentation in the Slidev skill. The reference doc teaches agents HOW to properly implement click-driven animations, with decision guidance for WHEN to use each pattern. Update SKILL.md to reference it.

#### ⬜ Task 3.2.1: Create animation-patterns.md reference document

**File**: `.claude/skills/slidev/references/animation-patterns.md`

**Description**: Create a comprehensive animation pattern guide at .claude/skills/slidev/references/animation-patterns.md. Must cover: (1) WHY use $clicks over v-click directives — explain the Slidev hydration bug where v-click may not apply hidden state on initial load. (2) Three patterns with full code examples: ADDITIVE REVEAL (v-if="$clicks >= N" — content appears and stays), SCENE REPLACEMENT (v-if="$clicks >= N && $clicks < M" — content appears then disappears), REACTIVE STYLING (:class="{ 'opacity-40': $clicks >= N }" — element stays but changes appearance). (3) Decision tree / pattern selection guide: WHEN to use each pattern based on use case (simple sequential → additive, step-by-step walkthrough → scene, de-emphasis → reactive). (4) Implementation checklist: always add clicks:N to frontmatter, use v-if not v-click, $clicks not $slidev.nav.clicks. (5) Reference to_add/08-how-skills-work.md as gold-standard scene example. (6) Common patterns: mixing additive with reactive (e.g., show element at click N, fade it at click M).

**Context to Load**:
- `to_add/08-how-skills-work.md` (lines all) - Gold-standard reference for scene replacement pattern — copy code examples from here
- `slides/06-continuum-middle-ground/index.md` (lines all) - Reference for reactive styling pattern (after CP1 migration)
- `slides/01-column-cards/index.md` (lines all) - Reference for additive reveal pattern (after CP1 migration)
- `.claude/skills/slidev/references/templates.md` (lines all) - Existing reference doc style — match formatting conventions

**Actions**:
- ⬜ **3.2.1.1**: CREATE .claude/skills/slidev/references/animation-patterns.md with full animation pattern guide covering all three patterns, decision tree, implementation checklist, and code examples (`.claude/skills/slidev/references/animation-patterns.md`)

#### ⬜ Task 3.2.2: Update SKILL.md with animation guidance section

**File**: `.claude/skills/slidev/SKILL.md`

**Description**: Add an animation section to SKILL.md that: (1) States that $clicks-based v-if is REQUIRED for all click-driven animations (not optional — v-click directives have hydration issues). (2) Briefly summarizes the three patterns (additive, scene, reactive) with one-liner descriptions. (3) References animation-patterns.md for full details and code examples. (4) Adds animation-patterns.md to the References section at the bottom. The tone should make it clear this is a mandatory practice, not a suggestion.

**Context to Load**:
- `.claude/skills/slidev/SKILL.md` (lines all) - Current SKILL.md — add animation section, update References
- `.claude/skills/slidev/references/animation-patterns.md` (lines 1-10) - The new reference doc (after task 3.2.1) — verify title and structure to reference correctly

**Depends On**: Tasks 3.2.1

**Actions**:
- ⬜ **3.2.2.1**: UPDATE .claude/skills/slidev/SKILL.md: ADD new '## Animation & Click Patterns' section BEFORE the '## References' section, explaining $clicks is required, summarizing three patterns, and linking to animation-patterns.md (`.claude/skills/slidev/SKILL.md`)
- ⬜ **3.2.2.2**: UPDATE .claude/skills/slidev/SKILL.md: ADD animation-patterns.md entry to the References section at the bottom (`.claude/skills/slidev/SKILL.md`)

---

---
*Auto-generated from plan.json on 2026-01-29 14:54*