import {makeScene2D, Rect, Txt, Layout, Line} from '@motion-canvas/2d';
import {all, createRef, createRefArray, sequence, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../_shared/theme';

/**
 * Phase 2 — Extract animation.
 *
 * Orchestrator at top fans out parallel tax-extract sub-agents.
 * Each sub-agent writes to a per-file extraction. The extractions are then
 * aggregated and collapsed into a small set of category files.
 */
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const orchestrator = createRef<Rect>();
  const agents = createRefArray<Rect>();
  const spawnLines = createRefArray<Line>();
  const extractions = createRefArray<Rect>();
  const writeLines = createRefArray<Line>();
  const aggLines = createRefArray<Line>();
  const aggregate = createRef<Rect>();
  const catLines = createRefArray<Line>();
  const categories = createRefArray<Rect>();

  const agentData = [
    {label: 'Biz Jan', file: 'biz-jan.md'},
    {label: 'Biz Feb', file: 'biz-feb.md'},
    {label: 'Personal', file: 'personal.md'},
    {label: '1099-NEC', file: '1099-nec.md'},
    {label: 'K-1', file: 'k-1.md'},
    {label: 'Q1 Est', file: 'q1-est.md'},
  ];
  const categoryLabels = ['income.md', 'business.md', 'personal.md', 'credits.md', 'estimated.md'];

  const agentSpacing = 260;
  const agentStartX = -((agentData.length - 1) * agentSpacing) / 2;
  const agentY = -180;
  const extractionY = 40;

  const catSpacing = 280;
  const catStartX = -((categoryLabels.length - 1) * catSpacing) / 2;
  const aggregateY = 240;
  const categoryY = 400;

  view.add(
    <>
      {/* Orchestrator */}
      <Rect
        ref={orchestrator}
        y={-420}
        fill={COLORS.userBg}
        stroke={COLORS.user}
        lineWidth={3}
        radius={14}
        padding={[20, 40]}
        width={580}
        height={100}
        opacity={0}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={6}
      >
        <Txt text="ORCHESTRATOR" fill={COLORS.user} fontFamily={FONT} fontSize={20} />
        <Txt text="/cpa-tax-prep:extract 2025" fill={COLORS.white} fontFamily={FONT} fontSize={30} />
      </Rect>

      {/* Spawn lines: orchestrator → each agent */}
      {agentData.map((_, i) => (
        <Line
          ref={spawnLines}
          stroke={COLORS.arrow}
          lineWidth={2}
          endArrow
          arrowSize={12}
          points={[
            [0, -370],
            [agentStartX + i * agentSpacing, agentY - 60],
          ]}
          opacity={0}
        />
      ))}

      {/* Agents (parallel sub-agents) */}
      {agentData.map((a, i) => (
        <Rect
          ref={agents}
          x={agentStartX + i * agentSpacing}
          y={agentY}
          fill={COLORS.assistantBg}
          stroke={COLORS.assistant}
          lineWidth={2}
          radius={10}
          padding={[12, 14]}
          width={220}
          height={92}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Txt text="tax-extract" fill={COLORS.assistant} fontFamily={FONT} fontSize={18} />
          <Txt text={a.label} fill={COLORS.white} fontFamily={FONT} fontSize={22} />
        </Rect>
      ))}

      {/* Write lines: each agent → its extraction file */}
      {agentData.map((_, i) => (
        <Line
          ref={writeLines}
          stroke={COLORS.accent}
          lineWidth={2}
          endArrow
          arrowSize={10}
          points={[
            [agentStartX + i * agentSpacing, agentY + 52],
            [agentStartX + i * agentSpacing, extractionY - 36],
          ]}
          opacity={0}
        />
      ))}

      {/* Extraction files */}
      {agentData.map((a, i) => (
        <Rect
          ref={extractions}
          x={agentStartX + i * agentSpacing}
          y={extractionY}
          fill={COLORS.toolCallBg}
          stroke={COLORS.accent}
          lineWidth={2}
          radius={8}
          padding={[10, 10]}
          width={220}
          height={72}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Txt text="extractions/" fill={COLORS.dimText} fontFamily={FONT} fontSize={14} />
          <Txt text={a.file} fill={COLORS.white} fontFamily={FONT} fontSize={18} />
        </Rect>
      ))}

      {/* Aggregation lines: extractions converge to aggregate */}
      {agentData.map((_, i) => (
        <Line
          ref={aggLines}
          stroke={COLORS.toolResult}
          lineWidth={1.5}
          points={[
            [agentStartX + i * agentSpacing, extractionY + 36],
            [0, aggregateY - 36],
          ]}
          opacity={0}
        />
      ))}

      {/* Aggregate box */}
      <Rect
        ref={aggregate}
        y={aggregateY}
        fill={COLORS.toolResultBg}
        stroke={COLORS.toolResult}
        lineWidth={3}
        radius={12}
        padding={[16, 36]}
        width={500}
        height={72}
        opacity={0}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Txt text="AGGREGATE BY CATEGORY" fill={COLORS.toolResult} fontFamily={FONT} fontSize={18} />
        <Txt text="raw/*.md" fill={COLORS.white} fontFamily={FONT} fontSize={24} />
      </Rect>

      {/* Category fan-out lines */}
      {categoryLabels.map((_, i) => (
        <Line
          ref={catLines}
          stroke={COLORS.toolResult}
          lineWidth={2}
          endArrow
          arrowSize={10}
          points={[
            [0, aggregateY + 36],
            [catStartX + i * catSpacing, categoryY - 36],
          ]}
          opacity={0}
        />
      ))}

      {/* Category files */}
      {categoryLabels.map((label, i) => (
        <Rect
          ref={categories}
          x={catStartX + i * catSpacing}
          y={categoryY}
          fill={COLORS.context}
          stroke={COLORS.toolResult}
          lineWidth={2}
          radius={10}
          padding={[12, 16]}
          width={240}
          height={72}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Txt text="raw/" fill={COLORS.dimText} fontFamily={FONT} fontSize={14} />
          <Txt text={label} fill={COLORS.white} fontFamily={FONT} fontSize={22} />
        </Rect>
      ))}
    </>,
  );

  // 1. Orchestrator appears
  yield* orchestrator().opacity(1, 0.7);
  yield* waitFor(0.5);

  // 2. Spawn lines sweep out, then agents pop in (parallel fan-out)
  yield* sequence(0.12, ...spawnLines.map((l) => l.opacity(1, 0.45)));
  yield* waitFor(0.2);
  yield* sequence(0.12, ...agents.map((a) => a.opacity(1, 0.55)));
  yield* waitFor(0.6);

  // 3. Each agent writes to its extraction file in parallel
  yield* all(
    ...writeLines.map((l) => l.opacity(1, 0.55)),
    ...extractions.map((f, i) =>
      sequence(
        0.08 * i,
        f.opacity(1, 0.6),
      ),
    ),
  );
  yield* waitFor(0.75);

  // 4. Aggregation lines draw + aggregate box appears
  yield* all(...aggLines.map((l) => l.opacity(1, 0.55)));
  yield* waitFor(0.15);
  yield* aggregate().opacity(1, 0.7);
  yield* waitFor(0.55);

  // 5. Category files fan out
  yield* all(...catLines.map((l) => l.opacity(1, 0.55)));
  yield* sequence(0.2, ...categories.map((c) => c.opacity(1, 0.6)));

  // REQUIRED: hold the final frame
  yield* waitFor(10);
});
