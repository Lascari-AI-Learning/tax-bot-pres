import {makeScene2D, Rect, Txt, Layout, Line} from '@motion-canvas/2d';
import {all, createRef, createRefArray, sequence, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../_shared/theme';

/**
 * Phase 3 — Review animation.
 *
 * Mirrors the Intake animation's 4-step loop, but now the questions are
 * clarifications on extracted data ("What is this vague expense?").
 * Left: 4-step review loop (Read Section → Ask Clarifying Q → User Answers → Update final/).
 * Right: final/review.md being filled with resolved Q&As, one per loop iteration.
 */
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const stepRefs = createRefArray<Rect>();
  const loopArrow = createRef<Line>();
  const repeatLabel = createRef<Txt>();
  const fileCard = createRef<Rect>();
  const qaRefs = createRefArray<Rect>();

  const steps = [
    {label: 'Read Section', bg: COLORS.userBg, border: COLORS.user},
    {label: 'Ask Clarifying Question', bg: COLORS.assistantBg, border: COLORS.assistant},
    {label: 'User Answers', bg: COLORS.toolResultBg, border: COLORS.toolResult},
    {label: 'Update final/', bg: COLORS.toolCallBg, border: COLORS.toolCall},
  ];

  // Flagged items the agent asks about — vague or ambiguous extractions.
  const questions = [
    {q: 'Home Depot · $1,247 — business or personal?', a: 'Personal (kitchen reno)'},
    {q: 'Stripe · $8,200 — which entity?', a: 'Side project (Schedule C)'},
    {q: 'Uber · $340 — business travel?', a: 'Yes — client site visit'},
    {q: 'Best Buy · $3,500 — expense or asset?', a: 'Asset (home office computer)'},
    {q: 'Anthem · $14,400 — premium or HSA?', a: 'Premium (1095-A reconcile)'},
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
            width={440}
            opacity={0}
          >
            <Txt text={s.label} fill={COLORS.white} fontFamily={FONT} fontSize={28} />
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
          [-290, 170],
          [-200, 170],
          [-200, -170],
          [-290, -170],
        ]}
        opacity={0}
      />
      <Txt
        ref={repeatLabel}
        text="REPEAT"
        x={-160}
        y={0}
        rotation={-90}
        fill={COLORS.dimText}
        fontFamily={FONT}
        fontSize={22}
        opacity={0}
      />

      {/* RIGHT: final/review.md filling up with resolved Q&As */}
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
        width={760}
        height={780}
        opacity={0}
        layout
      >
        <Txt text="final/review.md" fill={COLORS.accent} fontFamily={FONT} fontSize={36} />
        <Rect fill={COLORS.label} height={2} width={688} />
        {questions.map((item) => (
          <Rect
            ref={qaRefs}
            fill={COLORS.subtle}
            stroke={COLORS.accent}
            lineWidth={1}
            radius={10}
            padding={[14, 20]}
            gap={6}
            direction="column"
            alignItems="start"
            width={688}
            opacity={0}
            layout
          >
            <Txt text={`Q: ${item.q}`} fill={COLORS.white} fontFamily={FONT} fontSize={22} />
            <Txt text={`A: ${item.a}`} fill={COLORS.contextText} fontFamily={FONT} fontSize={22} />
          </Rect>
        ))}
      </Rect>
    </>,
  );

  // 1. Fade in the loop steps from top to bottom
  yield* sequence(0.14, ...stepRefs.map((r) => r.opacity(1, 0.45)));

  // 2. Loop arrow, repeat label, and file card appear together
  yield* all(
    loopArrow().opacity(1, 0.45),
    repeatLabel().opacity(1, 0.45),
    fileCard().opacity(1, 0.55),
  );
  yield* waitFor(0.4);

  // 3. Run the loop once per question: pulse each step, then add that Q&A to the file
  for (let i = 0; i < questions.length; i++) {
    for (let s = 0; s < stepRefs.length; s++) {
      yield* all(
        stepRefs[s].scale(1.06, 0.15),
        stepRefs[s].lineWidth(5, 0.15),
      );
      yield* all(
        stepRefs[s].scale(1, 0.15),
        stepRefs[s].lineWidth(3, 0.15),
      );
    }
    yield* qaRefs[i].opacity(1, 0.45);
    yield* waitFor(0.2);
  }

  // REQUIRED: hold the final frame
  yield* waitFor(10);
});
