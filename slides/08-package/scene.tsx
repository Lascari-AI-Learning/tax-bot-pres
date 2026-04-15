import {makeScene2D, Rect, Txt, Line} from '@motion-canvas/2d';
import {all, createRef, createRefArray, sequence, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../_shared/theme';

/**
 * Phase 4 — Package animation.
 *
 * Stage 1 — Parallel subagents: final/*.md → tax-package → section JSONs.
 * Stage 2 — Sequential pipeline: merge_sections.py → build_xlsx.py → validate_xlsx.py.
 *             → final deliverable (tax_data.json + xlsx).
 */
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const finals = createRefArray<Rect>();
  const spawnLines = createRefArray<Line>();
  const agents = createRefArray<Rect>();
  const writeLines = createRefArray<Line>();
  const jsons = createRefArray<Rect>();
  const aggLines = createRefArray<Line>();

  const stage1Label = createRef<Txt>();
  const stage2Label = createRef<Txt>();

  const pipelineBoxes = createRefArray<Rect>();
  const pipelineArrows = createRefArray<Line>();

  const finalArrow = createRef<Line>();
  const finalOutput = createRef<Rect>();

  const sections = [
    {label: 'Income', file: 'income.json'},
    {label: 'Business', file: 'business.json'},
    {label: 'Deductions', file: 'deductions.json'},
    {label: 'Estimated', file: 'estimated.json'},
    {label: 'Health', file: 'health.json'},
  ];

  const colSpacing = 270;
  const startX = -((sections.length - 1) * colSpacing) / 2;

  // Compressed vertical layout so Stage 1 fits on-screen.
  const finalY = -340;
  const agentY = -170;
  const jsonY = 0;
  const pipelineY = 180;
  const outputY = 350;

  const pipelineSteps = [
    {label: 'merge_sections.py', border: COLORS.user, bg: COLORS.userBg},
    {label: 'build_xlsx.py', border: COLORS.assistant, bg: COLORS.assistantBg},
    {label: 'validate_xlsx.py', border: COLORS.toolCall, bg: COLORS.toolCallBg},
  ];
  const pipelineSpacing = 440;
  const pipelineStartX = -((pipelineSteps.length - 1) * pipelineSpacing) / 2;

  view.add(
    <>
      {/* Stage 1 label */}
      <Txt
        ref={stage1Label}
        text="STAGE 1 — PARALLEL SUBAGENTS"
        x={-720}
        y={-420}
        fill={COLORS.dimText}
        fontFamily={FONT}
        fontSize={22}
        opacity={0}
      />

      {/* final/*.md source files */}
      {sections.map((s, i) => (
        <Rect
          ref={finals}
          x={startX + i * colSpacing}
          y={finalY}
          fill={COLORS.context}
          stroke={COLORS.label}
          lineWidth={2}
          radius={10}
          padding={[10, 12]}
          width={230}
          height={72}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Txt text="final/" fill={COLORS.dimText} fontFamily={FONT} fontSize={14} />
          <Txt text={`${s.label} 2025.md`} fill={COLORS.white} fontFamily={FONT} fontSize={20} />
        </Rect>
      ))}

      {/* Spawn arrows: final → agent */}
      {sections.map((_, i) => (
        <Line
          ref={spawnLines}
          stroke={COLORS.arrow}
          lineWidth={2}
          endArrow
          arrowSize={10}
          points={[
            [startX + i * colSpacing, finalY + 40],
            [startX + i * colSpacing, agentY - 40],
          ]}
          opacity={0}
        />
      ))}

      {/* tax-package agents (parallel) */}
      {sections.map((s, i) => (
        <Rect
          ref={agents}
          x={startX + i * colSpacing}
          y={agentY}
          fill={COLORS.toolResultBg}
          stroke={COLORS.toolResult}
          lineWidth={2}
          radius={10}
          padding={[10, 12]}
          width={230}
          height={78}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Txt text="tax-package" fill={COLORS.toolResult} fontFamily={FONT} fontSize={16} />
          <Txt text={s.label} fill={COLORS.white} fontFamily={FONT} fontSize={22} />
        </Rect>
      ))}

      {/* Write arrows: agent → JSON */}
      {sections.map((_, i) => (
        <Line
          ref={writeLines}
          stroke={COLORS.accent}
          lineWidth={2}
          endArrow
          arrowSize={10}
          points={[
            [startX + i * colSpacing, agentY + 42],
            [startX + i * colSpacing, jsonY - 36],
          ]}
          opacity={0}
        />
      ))}

      {/* Section JSON files */}
      {sections.map((s, i) => (
        <Rect
          ref={jsons}
          x={startX + i * colSpacing}
          y={jsonY}
          fill={COLORS.toolCallBg}
          stroke={COLORS.accent}
          lineWidth={2}
          radius={8}
          padding={[8, 10]}
          width={230}
          height={68}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Txt text="output/sections/" fill={COLORS.dimText} fontFamily={FONT} fontSize={13} />
          <Txt text={s.file} fill={COLORS.white} fontFamily={FONT} fontSize={18} />
        </Rect>
      ))}

      {/* Stage 2 label */}
      <Txt
        ref={stage2Label}
        text="STAGE 2 — SEQUENTIAL PIPELINE"
        x={-720}
        y={110}
        fill={COLORS.dimText}
        fontFamily={FONT}
        fontSize={22}
        opacity={0}
      />

      {/* Aggregation lines: JSONs converge into merge_sections.py (first pipeline step) */}
      {sections.map((_, i) => (
        <Line
          ref={aggLines}
          stroke={COLORS.toolResult}
          lineWidth={1.5}
          points={[
            [startX + i * colSpacing, jsonY + 34],
            [pipelineStartX, pipelineY - 38],
          ]}
          opacity={0}
        />
      ))}

      {/* Pipeline boxes */}
      {pipelineSteps.map((step, i) => (
        <Rect
          ref={pipelineBoxes}
          x={pipelineStartX + i * pipelineSpacing}
          y={pipelineY}
          fill={step.bg}
          stroke={step.border}
          lineWidth={3}
          radius={12}
          padding={[12, 20]}
          width={340}
          height={76}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Txt text={step.label} fill={COLORS.white} fontFamily={FONT} fontSize={24} />
        </Rect>
      ))}

      {/* Pipeline arrows between boxes */}
      {pipelineSteps.slice(0, -1).map((_, i) => (
        <Line
          ref={pipelineArrows}
          stroke={COLORS.arrow}
          lineWidth={3}
          endArrow
          arrowSize={14}
          points={[
            [pipelineStartX + i * pipelineSpacing + 175, pipelineY],
            [pipelineStartX + (i + 1) * pipelineSpacing - 175, pipelineY],
          ]}
          opacity={0}
        />
      ))}

      {/* Arrow from pipeline → final output */}
      <Line
        ref={finalArrow}
        stroke={COLORS.accent}
        lineWidth={3}
        endArrow
        arrowSize={14}
        points={[
          [0, pipelineY + 44],
          [0, outputY - 46],
        ]}
        opacity={0}
      />

      {/* Final output */}
      <Rect
        ref={finalOutput}
        y={outputY}
        fill={COLORS.context}
        stroke={COLORS.accent}
        lineWidth={3}
        radius={14}
        padding={[12, 36]}
        width={720}
        height={88}
        opacity={0}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
      >
        <Txt text="FINAL DELIVERABLE" fill={COLORS.accent} fontFamily={FONT} fontSize={18} />
        <Txt text="tax_data.json + 2025 CPA Tax Package.xlsx" fill={COLORS.white} fontFamily={FONT} fontSize={22} />
      </Rect>
    </>,
  );

  // Stage 1 — label + source files
  yield* stage1Label().opacity(1, 0.7);
  yield* waitFor(0.3);
  yield* sequence(0.14, ...finals.map((f) => f.opacity(1, 0.6)));
  yield* waitFor(0.6);

  // Fan out to agents in parallel
  yield* sequence(0.12, ...spawnLines.map((l) => l.opacity(1, 0.5)));
  yield* waitFor(0.25);
  yield* sequence(0.14, ...agents.map((a) => a.opacity(1, 0.6)));
  yield* waitFor(0.6);

  // Agents write section JSONs (parallel)
  yield* all(
    ...writeLines.map((l) => l.opacity(1, 0.55)),
    ...jsons.map((f, i) =>
      sequence(0.1 * i, f.opacity(1, 0.65)),
    ),
  );
  yield* waitFor(0.8);

  // Stage 2 — label + aggregation lines converging into merge_sections.py
  yield* stage2Label().opacity(1, 0.6);
  yield* waitFor(0.3);
  yield* all(...aggLines.map((l) => l.opacity(1, 0.55)));
  yield* waitFor(0.45);

  // Sequential pipeline — each step appears, pulses, then the arrow draws to the next
  for (let i = 0; i < pipelineBoxes.length; i++) {
    yield* pipelineBoxes[i].opacity(1, 0.6);
    yield* all(
      pipelineBoxes[i].scale(1.06, 0.3),
      pipelineBoxes[i].lineWidth(5, 0.3),
    );
    yield* all(
      pipelineBoxes[i].scale(1, 0.3),
      pipelineBoxes[i].lineWidth(3, 0.3),
    );
    if (i < pipelineBoxes.length - 1) {
      yield* waitFor(0.2);
      yield* pipelineArrows[i].opacity(1, 0.45);
      yield* waitFor(0.15);
    }
  }
  yield* waitFor(0.5);

  // Final output lights up
  yield* finalArrow().opacity(1, 0.5);
  yield* finalOutput().opacity(1, 0.8);

  // REQUIRED: hold the final frame
  yield* waitFor(10);
});
