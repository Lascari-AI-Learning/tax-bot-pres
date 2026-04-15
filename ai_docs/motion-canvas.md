# How to Use Motion Canvas in This Project

This project embeds Motion Canvas animations inside Slidev slides. Each slide can have its own `scene.tsx` file — a "vertical slice" where the animation lives alongside the slide content.

## Architecture

```
slides/03-token-by-token/
├── index.md       # Slidev slide — embeds the animation
└── scene.tsx      # Motion Canvas scene (TypeScript + JSX)

public/animations/
└── 03-token-by-token.js   # Built bundle (self-contained, no external imports)

animations/
├── vite.config.ts          # Dev server config (port 9000)
└── vite.build.config.ts    # Library-mode build config

components/
└── MotionCanvas.vue        # Vue wrapper that loads the player

scripts/
└── build-animations.ts     # Per-slide build orchestrator
```

### How the Pieces Fit Together

1. You write a **scene.tsx** inside a slide folder — this is a Motion Canvas scene using `makeScene2D()`.
2. The **build script** (`scripts/build-animations.ts`) wraps your scene in a temporary Motion Canvas project, builds it with Vite in library mode, and outputs a self-contained JS bundle to `public/animations/`.
3. The Slidev slide's **index.md** uses the `<MotionCanvas>` Vue component to embed the animation.
4. The **MotionCanvas.vue** component fetches the bundle, creates a blob URL, and passes it to the `<motion-canvas-player>` web component.

### Why the Blob URL Workaround?

Vite blocks dynamic `import()` of files in `public/` — it returns a 500 error saying "This file is in /public and will be copied as-is during build without going through plugin transforms, and therefore should not be imported from source code."

The `<motion-canvas-player>` web component internally does `import(src)` to load the animation module. To get around Vite's restriction, `MotionCanvas.vue` fetches the JS file as text via `fetch()`, wraps it in a Blob with `type: 'application/javascript'`, creates a blob URL with `URL.createObjectURL()`, and passes that blob URL to the player instead. This works because:
- The bundle has zero external imports (everything is inlined)
- The blob URL bypasses Vite's module pipeline entirely
- The browser treats the blob URL as a valid ES module

### Why the Build Script Generates a Temp Project File

The Motion Canvas vite plugin requires scene files to be imported with a `?scene` query parameter (e.g., `import scene from './scene.tsx?scene'`). This query triggers the plugin's scene transformation. The build script:
1. Reads the slide name from the command args
2. Writes a temporary `animations/src/_build_project.ts` that imports the scene with the `?scene` query
3. Runs `vite build` with the Motion Canvas plugin
4. Deletes the temp file

This lets each slide own its scene without needing a central project registry.

## Commands

```bash
# Build ALL slide animations (finds every slides/*/scene.tsx)
npm run build:animations

# Build a single slide's animation
npm run build:animations -- 03-token-by-token

# Open Motion Canvas editor for dev/preview (port 9000)
npm run dev:animations
```

## Creating an Animation for a Slide

### Step 1: Write the Scene

Create `slides/<slide-name>/scene.tsx`:

```tsx
import {makeScene2D, Rect, Txt, Layout} from '@motion-canvas/2d';
import {all, createRef, createRefArray, waitFor} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  view.fill('#0f0f0f');

  const box = createRef<Rect>();

  view.add(
    <Rect
      ref={box}
      fill="#2dd4bf"
      radius={14}
      padding={[16, 28]}
      opacity={0}
    >
      <Txt text="Hello" fill="#ffffff" fontFamily="monospace" fontSize={48} />
    </Rect>
  );

  // Fade in over 0.5 seconds
  yield* box().opacity(1, 0.5);

  // Wait 1 second
  yield* waitFor(1);

  // Move right
  yield* box().x(200, 0.5);

  // Hold the final frame (required — see "Playback Behavior" section)
  yield* waitFor(10);
});
```

### Step 2: Embed in the Slide

Create or edit `slides/<slide-name>/index.md`:

```md
---
theme: ../
layout: default
---

<MotionCanvas src="/animations/<slide-name>.js" />
```

### Step 3: Build

```bash
npm run build:animations -- <slide-name>
```

### Step 4: Preview

Navigate to the slide at http://localhost:3030 — the animation starts automatically when the slide becomes active.

## Playback Behavior (Important)

The `MotionCanvas.vue` component integrates with Slidev's navigation lifecycle to ensure animations play at the right time. Understanding these behaviors is critical when authoring scenes.

### Deferred Playback

Animations do **not** auto-play on mount. Slidev pre-mounts nearby slides before you navigate to them, so if animations played immediately they'd be finished by the time you arrive. Instead:

- The component uses an `IntersectionObserver` on the container element to detect when the slide is actually visible in the viewport (at least 50% visible).
- Playback only starts when the slide scrolls into view.
- If the player hasn't finished loading yet when the slide becomes visible, it polls until ready, then starts.
- This approach is purely DOM-based and does not depend on Slidev's internal hooks.

This is handled automatically by `MotionCanvas.vue` — no per-slide configuration needed.

### Hold the Final Frame with `waitFor(10)`

Every scene should end with a **10-second hold** to keep the final frame visible while you're presenting:

```tsx
export default makeScene2D(function* (view) {
  // ... your animation logic ...

  // REQUIRED: Hold the final frame
  yield* waitFor(10);
});
```

**Why 10 seconds?** Motion Canvas computes the full animation timeline upfront. A very large value (like `86400` for 24 hours) causes the player to hang because it tries to process an impossibly long timeline. 10 seconds is long enough that you'll never see the animation end during a presentation, but short enough that the player handles it without issue.

**Do NOT use:**
- `waitFor(86400)` or any very large value — freezes the player
- No `waitFor()` at all — the animation will end and the player will show a blank/reset state

### Reset on Re-Entry

When you navigate away from a slide and come back, the animation automatically resets to the beginning and replays. The `IntersectionObserver` detects the slide leaving the viewport (pauses playback) and re-entering (seeks to frame 0 and replays). No extra code needed in your scene.

### Summary of MotionCanvas.vue Lifecycle

| Event | Behavior |
|-------|----------|
| Component mounts | Player element created, animation bundle loaded, but **no playback** |
| Slide enters viewport | `IntersectionObserver` fires → seek to 0, start playback (or wait for player ready) |
| Slide leaves viewport | `IntersectionObserver` fires → pause playback |
| Component unmounts | Player removed, blob URL revoked, observers cleaned up |

## Key Gotchas

### Canvas Coordinates
The canvas is 1920x1080 with (0,0) at center. This means:
- `x: -960` is the left edge, `x: 960` is the right edge
- `y: -540` is the top edge, `y: 540` is the bottom edge
- Font sizes of 40-60px are readable for tokens/body text
- Use 24-32px for labels and secondary text

### Curly Braces in Slidev HTML
Vue's template compiler chokes on `{` and `}` in slide HTML content. If you need to show JSON or code in a Slidev slide (not in a Motion Canvas animation), use:
- HTML entities: `&#123;` for `{` and `&#125;` for `}`
- Single-line `<p>` tags instead of multi-line `<div>` blocks
- Multi-line `<div>` blocks with bare braces **will break the build**

This does NOT apply to `scene.tsx` files — those are pure TypeScript and can use braces freely.

### Playback is Managed by MotionCanvas.vue
The `<motion-canvas-player>` web component is set to `auto="false"`. Playback is triggered programmatically by the Vue component when the slide becomes active — no manual click needed. Do not set the `auto` attribute to `true` on the player, as that would bypass the deferred playback logic and cause animations to run before you navigate to the slide.

### Bundle is Fully Self-Contained
The build output has zero external `import` statements. All Motion Canvas runtime code is inlined. This is what makes the blob URL approach work — the browser doesn't need to resolve any dependencies.

### Vite's optimizeDeps Config
The root `vite.config.ts` excludes `@motion-canvas/player` from Vite's dependency pre-bundling. This preserves the `@vite-ignore` comment in the player's source, which prevents Vite from intercepting the player's internal `import()` call. Don't remove this config.

## Motion Canvas API Quick Reference

### Scene Structure

```tsx
export default makeScene2D(function* (view) {
  view.fill('#0f0f0f');          // Set background
  view.add(<Rect />);            // Add elements to the scene tree

  yield* waitFor(1);              // Pause for 1 second
  yield* rect.opacity(1, 0.5);   // Animate a property over 0.5s
  yield* all(                     // Run animations in parallel
    a.x(100, 0.3),
    b.opacity(1, 0.3),
  );
});
```

### Common Components

| Component | Use |
|-----------|-----|
| `Rect` | Rectangles, cards, token boxes |
| `Txt` | Text rendering |
| `Layout` | Flex container (direction, gap, alignItems) |
| `Circle` | Circles and arcs |
| `Line` | Lines and arrows |
| `Code` | Syntax-highlighted code blocks |
| `Img` | Images |
| `Node` | Base component (grouping) |

### Refs

```tsx
// Single ref
const box = createRef<Rect>();
<Rect ref={box} />
box().opacity(1, 0.5);  // Note the () to unwrap

// Array of refs
const items = createRefArray<Rect>();
<Rect ref={items} />  // Each instance auto-appends
items[0].opacity(1, 0.5);  // No () needed for array refs
```

### Flow Control

```tsx
yield* waitFor(1);                    // Wait N seconds
yield* all(a(), b());                 // Parallel — wait for all
yield* sequence(0.2, a(), b(), c());  // Staggered — 0.2s between each start
yield* chain(a(), b());              // Sequential — one after another
yield* delay(0.5, a());              // Delay before starting
yield* loop(5, () => a());           // Repeat N times
```

### Property Animation

```tsx
// Animate to a value over duration
yield* node.x(100, 0.5);
yield* node.opacity(1, 0.3);
yield* node.scale(1.2, 0.3);
yield* node.fill('#ff0000', 0.5);
yield* node.rotation(360, 1);

// With easing (import from @motion-canvas/core)
import {easeInOutCubic} from '@motion-canvas/core';
yield* node.x(100, 0.5, easeInOutCubic);
```

### Layout (Flexbox)

```tsx
<Layout
  direction="row"        // "row" | "column"
  gap={16}               // Gap between children
  alignItems="center"    // Flex align-items
  justifyContent="center"
  layout                 // Enable flex layout (required)
>
  <Rect />
  <Rect />
</Layout>
```

## Visual Language

Use these consistently across all animations (customize in `slides/_shared/theme.ts`):

| Element | Background | Text Color | Notes |
|---------|-----------|------------|-------|
| Scene background | `#0f0f0f` | — | Near-black |
| Context tokens | `#1e1e2e` | `#8888aa` | Dimmed purple-grey |
| Predicted/accent token | `#2dd4bf` | `#ffffff` | Teal, bold weight |
| Row labels | — | `#444455` | Small, monospace |
| Arrows | — | `#555566` | Between context and prediction |
| User messages | blue | white | Agent loop sections |
| Assistant messages | green | white | Agent loop sections |
| Tool calls | teal | white | Ties back to accent color |
| Tool results | purple | white | Infrastructure response |

**Font**: monospace at all times. 40-60px for tokens, 24-32px for labels.
