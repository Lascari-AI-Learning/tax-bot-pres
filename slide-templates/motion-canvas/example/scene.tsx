import {makeScene2D, Rect, Txt, Layout, Circle} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {COLORS, FONT, SIZES} from '../../slides/_shared/theme';

/**
 * Example Motion Canvas animation: animated card with staggered elements.
 *
 * This demonstrates:
 * - Using the shared theme (COLORS, FONT, SIZES)
 * - Creating refs and animating properties
 * - Parallel animations with all()
 * - Staggered animations with sequence()
 * - Layout component for flexbox positioning
 * - The required waitFor(10) at the end
 */
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  // -- Refs --
  const title = createRef<Txt>();
  const card = createRef<Rect>();
  const dot1 = createRef<Circle>();
  const dot2 = createRef<Circle>();
  const dot3 = createRef<Circle>();
  const subtitle = createRef<Txt>();

  // -- Scene tree --
  view.add(
    <Layout direction="column" alignItems="center" gap={40} layout>
      {/* Title */}
      <Txt
        ref={title}
        text="Motion Canvas + Slidev"
        fill={COLORS.white}
        fontFamily={FONT}
        fontSize={SIZES.titleFont}
        opacity={0}
        y={-20}
      />

      {/* Card with colored dots */}
      <Rect
        ref={card}
        fill={COLORS.context}
        radius={SIZES.tokenRadius}
        padding={[32, 48]}
        opacity={0}
        scale={0.9}
      >
        <Layout direction="row" gap={32} alignItems="center" layout>
          <Circle ref={dot1} size={48} fill={COLORS.user} opacity={0} />
          <Circle ref={dot2} size={48} fill={COLORS.accent} opacity={0} />
          <Circle ref={dot3} size={48} fill={COLORS.toolResult} opacity={0} />
        </Layout>
      </Rect>

      {/* Subtitle */}
      <Txt
        ref={subtitle}
        text="Programmatic Animations for Presentations"
        fill={COLORS.dimText}
        fontFamily={FONT}
        fontSize={SIZES.labelFont}
        opacity={0}
      />
    </Layout>,
  );

  // -- Animation sequence --

  // 1. Fade in title with upward motion
  yield* all(
    title().opacity(1, 0.6),
    title().y(0, 0.6),
  );

  yield* waitFor(0.3);

  // 2. Scale in the card
  yield* all(
    card().opacity(1, 0.4),
    card().scale(1, 0.4),
  );

  yield* waitFor(0.2);

  // 3. Stagger the dots
  yield* sequence(
    0.15,
    dot1().opacity(1, 0.3),
    dot2().opacity(1, 0.3),
    dot3().opacity(1, 0.3),
  );

  yield* waitFor(0.3);

  // 4. Fade in subtitle
  yield* subtitle().opacity(1, 0.5);

  yield* waitFor(0.5);

  // 5. Color pulse on the accent dot
  yield* dot2().scale(1.3, 0.2);
  yield* dot2().scale(1, 0.2);

  // REQUIRED: Hold the final frame
  yield* waitFor(10);
});
