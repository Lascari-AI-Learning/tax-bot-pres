# Animation Patterns Reference

## Why $clicks Instead of v-click Directives

Slidev's `<v-click>` and `<v-clicks>` directives have a **hydration bug**: on initial page load or reload, elements wrapped in `<v-click>` may briefly flash visible before being hidden. This creates a jarring visual glitch during presentations.

The `$clicks` reactive variable avoids this entirely because `v-if` removes elements from the DOM — there is nothing to flash.

**Rule: Always use `$clicks`-based `v-if` for all click-driven animations. Never use `<v-click>`, `<v-clicks>`, or `v-click` directives.**

## Required Setup

Every slide with click animations MUST have `clicks: N` in frontmatter, where N is the total number of click states:

```yaml
---
clicks: 3
---
```

## Three Animation Patterns

### 1. Additive Reveal

Content appears on click and **stays visible**. The most common pattern.

**When to use**: Sequential lists, card grids, bullet points — anything where items accumulate.

```html
<!-- First section always visible -->
<div class="section">Always visible content</div>

<!-- Appears at click 1, stays visible -->
<div v-if="$clicks >= 1" class="section">Second item</div>

<!-- Appears at click 2, stays visible -->
<div v-if="$clicks >= 2" class="section">Third item</div>
```

**Real example** (column-cards pattern):
```yaml
---
clicks: 3
---
```
```html
<div class="grid grid-cols-3 gap-6">
  <div v-if="$clicks >= 1" class="card">Card 1</div>
  <div v-if="$clicks >= 2" class="card">Card 2</div>
  <div v-if="$clicks >= 3" class="card">Card 3</div>
</div>
```

### 2. Scene Replacement

Content appears at one click and **disappears** at a later click. Used for step-by-step walkthroughs where each scene replaces the previous one.

**When to use**: Multi-step explanations, wizard-style flows, before/after comparisons.

```html
<div class="relative min-h-96">
  <!-- Scene 1: visible only at click 1 -->
  <div v-if="$clicks >= 1 && $clicks < 2" class="absolute inset-0">
    Scene 1 content
  </div>

  <!-- Scene 2: visible only at click 2 -->
  <div v-if="$clicks >= 2 && $clicks < 3" class="absolute inset-0">
    Scene 2 content
  </div>

  <!-- Scene 3: visible from click 3 onward (last scene stays) -->
  <div v-if="$clicks >= 3" class="absolute inset-0">
    Scene 3 content
  </div>
</div>
```

**Key details**:
- Use `absolute inset-0` positioning so scenes stack in the same space
- The last scene typically uses `$clicks >= N` (no upper bound) so it persists
- See `to_add/08-how-skills-work.md` for a complete 7-scene example

### 3. Layout-Preserving Reveal

Content appears on click and **stays visible**, but uses opacity instead of `v-if` so the element **always occupies its grid/flex space**. This prevents layout shifts when sibling elements depend on consistent spacing.

**When to use**: Grid or flex layouts where removing an element from the DOM would cause remaining elements to shift or collapse (e.g., 3-column grids, characteristics rows with a center block).

```html
<div class="grid grid-cols-3 gap-6">
  <!-- All three columns always occupy space; opacity controls visibility -->
  <div
    :class="$clicks >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    class="card transition-opacity duration-300"
  >Card 1</div>
  <div
    :class="$clicks >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    class="card transition-opacity duration-300"
  >Card 2</div>
  <div
    :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    class="card transition-opacity duration-300"
  >Card 3</div>
</div>
```

**Key details**:
- Use `:class` ternary instead of `v-if` — the element stays in the DOM
- `pointer-events-none` prevents interaction with invisible elements
- `transition-opacity duration-300` provides a smooth fade-in
- **Prefer this over Additive Reveal** when elements are inside a shared grid/flex container and spacing must remain stable across click states

### 4. Reactive Styling

Element stays visible but **changes appearance** based on click state. Used for emphasis/de-emphasis effects.

**When to use**: Fading out earlier items when a new one appears, highlighting the current step, progressive styling changes.

```html
<div
  v-if="$clicks >= 1"
  class="card"
  :class="{ 'opacity-40': $clicks >= 3 }"
  style="transition: opacity 0.5s;"
>
  This card appears at click 1, then fades at click 3
</div>
```

**Key details**:
- Use `:class` binding with `$clicks` conditions (NOT `$slidev.nav.clicks`)
- Add `style="transition: opacity 0.5s;"` for smooth visual transitions
- Can combine with additive reveal (`v-if` + `:class` on the same element)

## Pattern Selection Guide

| Use Case | Pattern | Example |
|----------|---------|---------|
| Items appear one by one and stay | Additive | Standalone sections, independent blocks |
| Items in a shared grid/flex that must maintain spacing | Layout-Preserving | 3-column card grids, continuum characteristics |
| Step-by-step walkthrough | Scene Replacement | Tutorial steps, flow diagrams |
| Earlier items fade when new ones appear | Layout-Preserving + Reactive | Continuum with middle emphasis |
| Content cycles through states | Scene Replacement | Before/after, A vs B |
| Non-sequential reveal order | Additive (custom numbering) | DOM order differs from click order |

### Additive vs. Layout-Preserving: When to Choose

- **Additive (`v-if`)**: Use when elements are independent — each stands alone or is in a vertical stack where adding/removing doesn't shift siblings.
- **Layout-Preserving (`opacity`)**: Use when elements share a grid or flex container and their presence affects the layout of siblings. If removing one element would cause others to reflow or collapse, use opacity instead of `v-if`.

## Mixing Patterns

Patterns can be combined on the same slide. A common combination is **layout-preserving + reactive** for grids where items fade but must keep their space:

```html
<div class="grid grid-cols-9 gap-4">
  <!-- Appears at click 1, fades at click 3 — always occupies grid space -->
  <div
    :class="$clicks >= 1 ? ($clicks >= 3 ? 'opacity-40' : 'opacity-100') : 'opacity-0 pointer-events-none'"
    class="col-span-2 card transition-opacity duration-300"
  >
    Left extreme
  </div>

  <!-- Center block: invisible until click 3, preserves grid spacing -->
  <div
    :class="$clicks >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    class="col-span-5 transition-opacity duration-300"
  >
    The sweet spot (highlighted by contrast)
  </div>

  <!-- Appears at click 2, fades at click 3 — always occupies grid space -->
  <div
    :class="$clicks >= 2 ? ($clicks >= 3 ? 'opacity-40' : 'opacity-100') : 'opacity-0 pointer-events-none'"
    class="col-span-2 card transition-opacity duration-300"
  >
    Right extreme
  </div>
</div>
```

## Non-Sequential Reveal Order

When DOM order differs from desired click order, simply assign click numbers that match the reveal sequence, not the DOM position:

```html
<!-- In DOM: left, center, right -->
<!-- Reveal order: left (1), right (2), center (3) -->
<div v-if="$clicks >= 1">Left</div>
<div v-if="$clicks >= 3">Center (appears last)</div>
<div v-if="$clicks >= 2">Right (appears second)</div>
```

## Implementation Checklist

When adding click animations to any slide:

1. **Add `clicks: N` to frontmatter** — N = total number of click states
2. **Choose the right reveal method**:
   - `v-if="$clicks >= N"` for standalone elements (Additive)
   - `:class="$clicks >= N ? 'opacity-100' : 'opacity-0 pointer-events-none'"` for elements in shared grid/flex containers (Layout-Preserving)
3. **Use `$clicks`** — never `$slidev.nav.clicks`, `<v-click>`, or `<v-clicks>`
4. **Never add `.slidev-vclick-hidden` styles** — not needed with these approaches
5. **Add transitions** — `transition-opacity duration-300` for layout-preserving reveals, `style="transition: opacity 0.5s;"` for reactive styling
6. **Test by reloading the slide page** — verify no flash on initial load and no layout shifts
