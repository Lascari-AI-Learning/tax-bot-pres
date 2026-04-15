# Motion Canvas Animation Slide Template

## Purpose
Embeds a full-screen Motion Canvas animation in a Slidev slide. The animation plays automatically when the slide becomes visible and resets when you navigate away and back.

## When to Use
- When you need animated diagrams, data visualizations, or process flows
- When static images or CSS transitions aren't sufficient
- When you want programmatic control over timing and sequencing

## Prerequisites
Motion Canvas dependencies must be installed. If not already present, run:
```bash
npm install @motion-canvas/2d @motion-canvas/core @motion-canvas/player @motion-canvas/vite-plugin @motion-canvas/ui
```

## Template Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `{{name}}` | Yes | Slide folder name (matches the animation bundle filename) | `03-my-animation` |
| `{{speaker_notes}}` | No | Speaker notes for the slide | "This animation shows..." |

## Usage Example

### Step 1: Generate the Slide
```bash
npm run generate:slide -- --template=motion-canvas --name=03-my-animation
```

### Step 2: Create the Scene File
Create `slides/03-my-animation/scene.tsx`:
```tsx
import {makeScene2D, Rect, Txt, Layout} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {COLORS, FONT, SIZES} from '../_shared/theme';

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const box = createRef<Rect>();

  view.add(
    <Rect
      ref={box}
      fill={COLORS.accent}
      radius={SIZES.tokenRadius}
      padding={SIZES.tokenPadding}
      opacity={0}
    >
      <Txt
        text="Hello Motion Canvas"
        fill={COLORS.white}
        fontFamily={FONT}
        fontSize={SIZES.tokenFont}
      />
    </Rect>
  );

  // Fade in
  yield* box().opacity(1, 0.5);

  // Wait a beat
  yield* waitFor(1);

  // Move right
  yield* box().x(200, 0.5);

  // REQUIRED: Hold the final frame
  yield* waitFor(10);
});
```

### Step 3: Build the Animation
```bash
npm run build:animations -- 03-my-animation
```

### Step 4: Preview
Navigate to the slide at http://localhost:3030 — the animation starts automatically when the slide becomes active.

## Important Notes

### Canvas Coordinates
- Canvas is 1920x1080 with (0,0) at center
- Left edge: `x = -960`, Right edge: `x = 960`
- Top edge: `y = -540`, Bottom edge: `y = 540`

### Always End with `waitFor(10)`
Every scene MUST end with `yield* waitFor(10)` to hold the final frame. Without it, the animation resets to blank when it finishes. Do NOT use values larger than 10 — very large values freeze the player.

### Shared Theme
Import colors and sizes from `slides/_shared/theme.ts` for visual consistency. Customize that file per-presentation to match your color scheme.

### Curly Braces in Slidev HTML
Vue chokes on `{` and `}` in slide markdown. If you need braces in your `index.md`, use `&#123;` and `&#125;`. This does NOT apply to `scene.tsx` files.

### Build Commands
```bash
npm run build:animations                  # Build all animations
npm run build:animations -- <slide-name>  # Build one animation
npm run dev:animations                    # Motion Canvas editor (port 9000)
```

## Visual Features
- Full-screen dark canvas (16:9 aspect ratio)
- Controls hidden by default, visible on hover
- Auto-play when slide enters viewport
- Auto-reset when navigating back to the slide
- No click required to start playback

## Architecture
See `ai_docs/motion-canvas.md` for the full technical guide covering:
- How the build pipeline works
- The blob URL workaround for Vite
- Deferred playback via IntersectionObserver
- API quick reference for Motion Canvas components and animations
