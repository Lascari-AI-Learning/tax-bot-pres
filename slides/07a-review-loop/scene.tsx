import {makeScene2D, Rect, Txt, Layout, Line} from '@motion-canvas/2d';
import {all, createRef, createRefArray, sequence, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../_shared/theme';

/**
 * Phase 3 — Review animation.
 *
 * Left: vertical flow with arrows between each step:
 *   Read Section → [Personal Context | This Document | Section Overview]
 *   → Ask Clarifying Question → User Answers → Update final/
 * Right: resolved Q&As filling up as the loop iterates.
 */
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const readStep = createRef<Rect>();
  const sourceCards = createRefArray<Rect>();
  const askStep = createRef<Rect>();
  const userStep = createRef<Rect>();
  const updateStep = createRef<Rect>();
  const connectors = createRefArray<Line>();
  const loopArrow = createRef<Line>();
  const repeatLabel = createRef<Txt>();
  const fileCard = createRef<Rect>();
  const qaRefs = createRefArray<Rect>();

  const cx = -520;
  const stepW = 440;
  const stepH = 60;

  const readY = -350;
  const srcY = -220;
  const askY = -60;
  const userY = 120;
  const updateY = 290;

  const sources = [
    {label: 'Personal\nContext', sub: 'intake.md', color: COLORS.user},
    {label: 'This\nDocument', sub: 'final/income.md', color: COLORS.assistant},
    {label: 'Section\nOverview', sub: 'raw/income.md', color: COLORS.toolResult},
  ];

  const questions = [
    {q: 'Home Depot · $1,247 — business or personal?', a: 'Personal (kitchen reno)'},
    {q: 'Stripe · $8,200 — which entity?', a: 'Side project (Schedule C)'},
    {q: 'Uber · $340 — business travel?', a: 'Yes — client site visit'},
    {q: 'Best Buy · $3,500 — expense or asset?', a: 'Asset (home office computer)'},
    {q: 'Anthem · $14,400 — premium or HSA?', a: 'Premium (1095-A reconcile)'},
  ];

  view.add(
    <>
      {/* Step 1: Read Section */}
      <Rect
        ref={readStep}
        x={cx} y={readY}
        fill={COLORS.userBg}
        stroke={COLORS.user}
        lineWidth={3}
        radius={14}
        padding={[26, 44]}
        width={stepW}
        opacity={0}
      >
        <Txt text="Read Section" fill={COLORS.white} fontFamily={FONT} fontSize={28} />
      </Rect>

      {/* Arrow: Read → Sources */}
      <Line
        ref={connectors}
        stroke={COLORS.arrow}
        lineWidth={2}
        endArrow arrowSize={10}
        points={[[cx, readY + 38], [cx, srcY - 55]]}
        opacity={0}
      />

      {/* Source cards row */}
      <Layout x={cx} y={srcY} direction="row" gap={12} alignItems="stretch" layout>
        {sources.map((s) => (
          <Rect
            ref={sourceCards}
            fill={COLORS.context}
            stroke={s.color}
            lineWidth={2}
            radius={10}
            padding={[20, 22]}
            width={140}
            gap={8}
            direction="column"
            alignItems="center"
            justifyContent="center"
            opacity={0}
            layout
          >
            <Txt text={s.label} fill={s.color} fontFamily={FONT} fontSize={16} textAlign="center" />
            <Txt text={s.sub} fill={COLORS.dimText} fontFamily={FONT} fontSize={12} />
          </Rect>
        ))}
      </Layout>

      {/* Arrow: Sources → Ask */}
      <Line
        ref={connectors}
        stroke={COLORS.arrow}
        lineWidth={2}
        endArrow arrowSize={10}
        points={[[cx, srcY + 55], [cx, askY - 38]]}
        opacity={0}
      />

      {/* Step 2: Ask Clarifying Question */}
      <Rect
        ref={askStep}
        x={cx} y={askY}
        fill={COLORS.assistantBg}
        stroke={COLORS.assistant}
        lineWidth={3}
        radius={14}
        padding={[26, 44]}
        width={stepW}
        opacity={0}
      >
        <Txt text="Ask Clarifying Question" fill={COLORS.white} fontFamily={FONT} fontSize={28} />
      </Rect>

      {/* Arrow: Ask → User Answers */}
      <Line
        ref={connectors}
        stroke={COLORS.arrow}
        lineWidth={2}
        endArrow arrowSize={10}
        points={[[cx, askY + 38], [cx, userY - 38]]}
        opacity={0}
      />

      {/* Step 3: User Answers */}
      <Rect
        ref={userStep}
        x={cx} y={userY}
        fill={COLORS.toolResultBg}
        stroke={COLORS.toolResult}
        lineWidth={3}
        radius={14}
        padding={[26, 44]}
        width={stepW}
        opacity={0}
      >
        <Txt text="User Answers" fill={COLORS.white} fontFamily={FONT} fontSize={28} />
      </Rect>

      {/* Arrow: User Answers → Update */}
      <Line
        ref={connectors}
        stroke={COLORS.arrow}
        lineWidth={2}
        endArrow arrowSize={10}
        points={[[cx, userY + 38], [cx, updateY - 38]]}
        opacity={0}
      />

      {/* Step 4: Update final/ */}
      <Rect
        ref={updateStep}
        x={cx} y={updateY}
        fill={COLORS.toolCallBg}
        stroke={COLORS.toolCall}
        lineWidth={3}
        radius={14}
        padding={[26, 44]}
        width={stepW}
        opacity={0}
      >
        <Txt text="Update final/" fill={COLORS.white} fontFamily={FONT} fontSize={28} />
      </Rect>

      {/* Loop arrow: bottom of Update back up to top of Read */}
      <Line
        ref={loopArrow}
        stroke={COLORS.dimText}
        lineWidth={3}
        lineDash={[10, 8]}
        endArrow arrowSize={16}
        points={[
          [cx + stepW / 2 + 10, updateY],
          [cx + stepW / 2 + 60, updateY],
          [cx + stepW / 2 + 60, readY],
          [cx + stepW / 2 + 10, readY],
        ]}
        opacity={0}
      />
      <Txt
        ref={repeatLabel}
        text="REPEAT"
        x={cx + stepW / 2 + 100}
        y={(readY + updateY) / 2}
        rotation={-90}
        fill={COLORS.dimText}
        fontFamily={FONT}
        fontSize={22}
        opacity={0}
      />

      {/* RIGHT: resolved items filling up */}
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
        <Txt text="Resolved Items" fill={COLORS.accent} fontFamily={FONT} fontSize={36} />
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

  // 1. Read Section fades in
  yield* readStep().opacity(1, 0.45);
  yield* waitFor(0.2);

  // 2. Arrow down, then source cards
  yield* connectors[0].opacity(1, 0.3);
  yield* sequence(0.12, ...sourceCards.map((c) => c.opacity(1, 0.4)));
  yield* waitFor(0.25);

  // 3. Arrow down, then Ask step
  yield* connectors[1].opacity(1, 0.3);
  yield* askStep().opacity(1, 0.45);
  yield* waitFor(0.15);

  // 4. Arrow down, then User Answers
  yield* connectors[2].opacity(1, 0.3);
  yield* userStep().opacity(1, 0.45);
  yield* waitFor(0.15);

  // 5. Arrow down, then Update final/
  yield* connectors[3].opacity(1, 0.3);
  yield* updateStep().opacity(1, 0.45);
  yield* waitFor(0.2);

  // 6. Loop arrow, repeat label, and file card
  yield* all(
    loopArrow().opacity(1, 0.45),
    repeatLabel().opacity(1, 0.45),
    fileCard().opacity(1, 0.55),
  );
  yield* waitFor(0.4);

  // 7. Run loop: pulse each step in sequence, then add Q&A
  for (let i = 0; i < questions.length; i++) {
    // Pulse Read + sources
    yield* all(readStep().scale(1.06, 0.12), readStep().lineWidth(5, 0.12));
    yield* all(...sourceCards.map((c) => c.scale(1.05, 0.1)));
    yield* all(
      readStep().scale(1, 0.12), readStep().lineWidth(3, 0.12),
      ...sourceCards.map((c) => c.scale(1, 0.1)),
    );

    // Pulse Ask
    yield* all(askStep().scale(1.06, 0.12), askStep().lineWidth(5, 0.12));
    yield* all(askStep().scale(1, 0.12), askStep().lineWidth(3, 0.12));

    // Pulse User Answers
    yield* all(userStep().scale(1.06, 0.12), userStep().lineWidth(5, 0.12));
    yield* all(userStep().scale(1, 0.12), userStep().lineWidth(3, 0.12));

    // Pulse Update final/
    yield* all(updateStep().scale(1.06, 0.12), updateStep().lineWidth(5, 0.12));
    yield* all(updateStep().scale(1, 0.12), updateStep().lineWidth(3, 0.12));

    // Add resolved Q&A
    yield* qaRefs[i].opacity(1, 0.45);
    yield* waitFor(0.2);
  }

  // REQUIRED: hold the final frame
  yield* waitFor(10);
});
