import {makeScene2D, Rect, Txt, Layout, Line} from '@motion-canvas/2d';
import {all, createRef, createRefArray, sequence, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../_shared/theme';

/**
 * Phase 1 — Intake animation.
 *
 * Left: the 4-step interview loop (Read → Ask → Answer → Update).
 * Right: intake.md being progressively filled one section per loop iteration.
 */
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const stepRefs = createRefArray<Rect>();
  const loopArrow = createRef<Line>();
  const repeatLabel = createRef<Txt>();
  const fileCard = createRef<Rect>();
  const sectionRefs = createRefArray<Rect>();

  const steps = [
    {label: 'Read Source Docs', bg: COLORS.userBg, border: COLORS.user},
    {label: 'Ask User Question', bg: COLORS.assistantBg, border: COLORS.assistant},
    {label: 'User Answers', bg: COLORS.toolResultBg, border: COLORS.toolResult},
    {label: 'Update intake.md', bg: COLORS.toolCallBg, border: COLORS.toolCall},
  ];

  const sections = [
    {title: '## Filer Info', detail: 'John Doe · MFJ · LLC'},
    {title: '## Dependents', detail: '2 children'},
    {title: '## Income', detail: '1099-NEC · W-2 · K-1'},
    {title: '## Deductions', detail: 'Mortgage · SALT · charity'},
    {title: '## Credits', detail: 'CTC · Dependent Care'},
  ];

  view.add(
    <>
      {/* LEFT: 4-step loop stack */}
      <Layout x={-520} direction="column" gap={28} alignItems="center" layout>
        {steps.map((s) => (
          <Rect
            ref={stepRefs}
            fill={s.bg}
            stroke={s.border}
            lineWidth={3}
            radius={14}
            padding={[22, 36]}
            width={420}
            opacity={0}
          >
            <Txt text={s.label} fill={COLORS.white} fontFamily={FONT} fontSize={30} />
          </Rect>
        ))}
      </Layout>

      {/* Loop arrow on the right edge of the stack */}
      <Line
        ref={loopArrow}
        stroke={COLORS.dimText}
        lineWidth={3}
        lineDash={[10, 8]}
        endArrow
        arrowSize={16}
        points={[
          [-300, 170],
          [-210, 170],
          [-210, -170],
          [-300, -170],
        ]}
        opacity={0}
      />
      <Txt
        ref={repeatLabel}
        text="REPEAT"
        x={-170}
        y={0}
        rotation={-90}
        fill={COLORS.dimText}
        fontFamily={FONT}
        fontSize={22}
        opacity={0}
      />

      {/* RIGHT: File being filled in */}
      <Rect
        ref={fileCard}
        x={420}
        fill={COLORS.context}
        stroke={COLORS.label}
        lineWidth={2}
        radius={14}
        padding={[32, 36]}
        gap={14}
        direction="column"
        alignItems="start"
        width={720}
        height={760}
        opacity={0}
        layout
      >
        <Txt text="intake.md" fill={COLORS.accent} fontFamily={FONT} fontSize={38} />
        <Rect fill={COLORS.label} height={2} width={648} />
        {sections.map((sec) => (
          <Rect
            ref={sectionRefs}
            fill={COLORS.subtle}
            stroke={COLORS.accent}
            lineWidth={1}
            radius={10}
            padding={[16, 20]}
            gap={8}
            direction="column"
            alignItems="start"
            width={648}
            opacity={0}
            layout
          >
            <Txt text={sec.title} fill={COLORS.white} fontFamily={FONT} fontSize={26} />
            <Txt text={sec.detail} fill={COLORS.contextText} fontFamily={FONT} fontSize={22} />
          </Rect>
        ))}
      </Rect>
    </>,
  );

  // 1. Fade in the loop steps from top to bottom
  yield* sequence(0.12, ...stepRefs.map((r) => r.opacity(1, 0.4)));

  // 2. Loop arrow, repeat label, and file card appear together
  yield* all(
    loopArrow().opacity(1, 0.4),
    repeatLabel().opacity(1, 0.4),
    fileCard().opacity(1, 0.5),
  );
  yield* waitFor(0.35);

  // 3. Run the loop once per section: pulse each step, then add that section to the file
  for (let i = 0; i < sections.length; i++) {
    for (let s = 0; s < stepRefs.length; s++) {
      yield* all(
        stepRefs[s].scale(1.06, 0.13),
        stepRefs[s].lineWidth(5, 0.13),
      );
      yield* all(
        stepRefs[s].scale(1, 0.13),
        stepRefs[s].lineWidth(3, 0.13),
      );
    }
    yield* sectionRefs[i].opacity(1, 0.4);
    yield* waitFor(0.15);
  }

  // REQUIRED: hold the final frame
  yield* waitFor(10);
});
