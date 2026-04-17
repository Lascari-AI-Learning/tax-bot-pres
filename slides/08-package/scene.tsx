import {makeScene2D, Rect, Txt, Line} from '@motion-canvas/2d';
import {all, createRef, createRefArray, sequence, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../_shared/theme';

export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const stage1Zone = createRef<Rect>();
  const stage2Zone = createRef<Rect>();

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

  const rowSpacing = 96;
  const rows = sections.map((_, i) => (i - 2) * rowSpacing);

  const finalsX = -700;
  const agentsX = -390;
  const jsonsX = -80;

  const boxW = 200;
  const boxH = 56;

  const pipelineSteps = [
    {label: 'merge_sections.py', border: COLORS.user, bg: COLORS.userBg},
    {label: 'build_xlsx.py', border: COLORS.assistant, bg: COLORS.assistantBg},
    {label: 'validate_xlsx.py', border: COLORS.toolCall, bg: COLORS.toolCallBg},
  ];
  const pipelineX = 260;
  const pipelineSpacing = 120;
  const pipelineRows = pipelineSteps.map((_, i) => (i - 1) * pipelineSpacing);

  const pipeW = 220;
  const pipeH = 68;

  const outputX = 620;

  // Zone bounding boxes — full height
  const zoneTop = -400;
  const zoneBottom = 400;

  const z1Left = finalsX - boxW / 2 - 25;
  const z1Right = jsonsX + boxW / 2 + 25;

  const z2Left = pipelineX - pipeW / 2 - 25;
  const z2Right = outputX + 160 + 25;

  view.add(
    <>
      {/* Stage 1 bounding zone */}
      <Rect
        ref={stage1Zone}
        x={(z1Left + z1Right) / 2}
        y={(zoneTop + zoneBottom) / 2}
        width={z1Right - z1Left}
        height={zoneBottom - zoneTop}
        stroke={COLORS.boundary}
        lineWidth={1.5}
        radius={16}
        opacity={0}
      />

      {/* Stage 1 label — inside zone top */}
      <Txt
        ref={stage1Label}
        text="STAGE 1 — PARALLEL SUBAGENTS"
        x={(z1Left + z1Right) / 2}
        y={zoneTop + 22}
        fill={COLORS.dimText}
        fontFamily={FONT}
        fontSize={18}
        opacity={0}
      />

      {/* Stage 2 bounding zone */}
      <Rect
        ref={stage2Zone}
        x={(z2Left + z2Right) / 2}
        y={(zoneTop + zoneBottom) / 2}
        width={z2Right - z2Left}
        height={zoneBottom - zoneTop}
        stroke={COLORS.boundary}
        lineWidth={1.5}
        radius={16}
        opacity={0}
      />

      {/* Stage 2 label — inside zone top */}
      <Txt
        ref={stage2Label}
        text="STAGE 2 — PIPELINE"
        x={(z2Left + z2Right) / 2}
        y={zoneTop + 22}
        fill={COLORS.dimText}
        fontFamily={FONT}
        fontSize={18}
        opacity={0}
      />

      {/* final/*.md source files — left column */}
      {sections.map((s, i) => (
        <Rect
          ref={finals}
          x={finalsX}
          y={rows[i]}
          fill={COLORS.context}
          stroke={COLORS.label}
          lineWidth={2}
          radius={10}
          padding={[8, 10]}
          width={boxW}
          height={boxH}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={1}
        >
          <Txt text="final/" fill={COLORS.dimText} fontFamily={FONT} fontSize={12} />
          <Txt text={`${s.label} 2025.md`} fill={COLORS.white} fontFamily={FONT} fontSize={17} />
        </Rect>
      ))}

      {/* Horizontal arrows: final → agent */}
      {sections.map((_, i) => (
        <Line
          ref={spawnLines}
          stroke={COLORS.arrow}
          lineWidth={2}
          endArrow
          arrowSize={10}
          points={[
            [finalsX + boxW / 2 + 5, rows[i]],
            [agentsX - boxW / 2 - 5, rows[i]],
          ]}
          opacity={0}
        />
      ))}

      {/* tax-package agents — middle column */}
      {sections.map((s, i) => (
        <Rect
          ref={agents}
          x={agentsX}
          y={rows[i]}
          fill={COLORS.toolResultBg}
          stroke={COLORS.toolResult}
          lineWidth={2}
          radius={10}
          padding={[8, 10]}
          width={boxW}
          height={boxH}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={1}
        >
          <Txt text="tax-package" fill={COLORS.toolResult} fontFamily={FONT} fontSize={13} />
          <Txt text={s.label} fill={COLORS.white} fontFamily={FONT} fontSize={18} />
        </Rect>
      ))}

      {/* Horizontal arrows: agent → JSON */}
      {sections.map((_, i) => (
        <Line
          ref={writeLines}
          stroke={COLORS.accent}
          lineWidth={2}
          endArrow
          arrowSize={10}
          points={[
            [agentsX + boxW / 2 + 5, rows[i]],
            [jsonsX - boxW / 2 - 5, rows[i]],
          ]}
          opacity={0}
        />
      ))}

      {/* Section JSON files — third column */}
      {sections.map((s, i) => (
        <Rect
          ref={jsons}
          x={jsonsX}
          y={rows[i]}
          fill={COLORS.toolCallBg}
          stroke={COLORS.accent}
          lineWidth={2}
          radius={8}
          padding={[8, 10]}
          width={boxW}
          height={boxH}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={1}
        >
          <Txt text="sections/" fill={COLORS.dimText} fontFamily={FONT} fontSize={12} />
          <Txt text={s.file} fill={COLORS.white} fontFamily={FONT} fontSize={16} />
        </Rect>
      ))}

      {/* Convergence lines: JSONs fan into merge_sections.py */}
      {sections.map((_, i) => (
        <Line
          ref={aggLines}
          stroke={COLORS.toolResult}
          lineWidth={1.5}
          points={[
            [jsonsX + boxW / 2 + 5, rows[i]],
            [pipelineX - pipeW / 2 - 5, pipelineRows[0]],
          ]}
          opacity={0}
        />
      ))}

      {/* Pipeline boxes — stacked vertically */}
      {pipelineSteps.map((step, i) => (
        <Rect
          ref={pipelineBoxes}
          x={pipelineX}
          y={pipelineRows[i]}
          fill={step.bg}
          stroke={step.border}
          lineWidth={3}
          radius={12}
          padding={[10, 16]}
          width={pipeW}
          height={pipeH}
          opacity={0}
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Txt text={step.label} fill={COLORS.white} fontFamily={FONT} fontSize={18} />
        </Rect>
      ))}

      {/* Vertical arrows between pipeline steps */}
      {pipelineSteps.slice(0, -1).map((_, i) => (
        <Line
          ref={pipelineArrows}
          stroke={COLORS.arrow}
          lineWidth={3}
          endArrow
          arrowSize={14}
          points={[
            [pipelineX, pipelineRows[i] + pipeH / 2 + 5],
            [pipelineX, pipelineRows[i + 1] - pipeH / 2 - 5],
          ]}
          opacity={0}
        />
      ))}

      {/* Arrow from validate → final output */}
      <Line
        ref={finalArrow}
        stroke={COLORS.accent}
        lineWidth={3}
        endArrow
        arrowSize={14}
        points={[
          [pipelineX + pipeW / 2 + 5, pipelineRows[2]],
          [outputX - 160 - 5, 0],
        ]}
        opacity={0}
      />

      {/* Final output */}
      <Rect
        ref={finalOutput}
        x={outputX}
        y={0}
        fill={COLORS.context}
        stroke={COLORS.accent}
        lineWidth={3}
        radius={14}
        padding={[12, 20]}
        width={320}
        height={160}
        opacity={0}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        gap={8}
      >
        <Txt text="FINAL OUTPUT" fill={COLORS.accent} fontFamily={FONT} fontSize={16} />
        <Txt text="tax_data.json" fill={COLORS.white} fontFamily={FONT} fontSize={18} />
        <Txt text="CPA Tax Package.xlsx" fill={COLORS.white} fontFamily={FONT} fontSize={18} />
      </Rect>
    </>,
  );

  // Stage 1 — zone border + label, then content
  yield* all(
    stage1Zone().opacity(1, 0.7),
    stage1Label().opacity(1, 0.7),
  );
  yield* waitFor(0.3);
  yield* sequence(0.1, ...finals.map((f) => f.opacity(1, 0.5)));
  yield* waitFor(0.5);

  yield* sequence(0.08, ...spawnLines.map((l) => l.opacity(1, 0.4)));
  yield* waitFor(0.2);
  yield* sequence(0.1, ...agents.map((a) => a.opacity(1, 0.5)));
  yield* waitFor(0.5);

  yield* all(
    ...writeLines.map((l) => l.opacity(1, 0.45)),
    ...jsons.map((f, i) => sequence(0.08 * i, f.opacity(1, 0.55))),
  );
  yield* waitFor(0.7);

  // Stage 2 — zone border + label, then convergence + pipeline
  yield* all(
    stage2Zone().opacity(1, 0.6),
    stage2Label().opacity(1, 0.6),
  );
  yield* waitFor(0.3);
  yield* all(...aggLines.map((l) => l.opacity(1, 0.5)));
  yield* waitFor(0.4);

  for (let i = 0; i < pipelineBoxes.length; i++) {
    yield* pipelineBoxes[i].opacity(1, 0.5);
    yield* all(
      pipelineBoxes[i].scale(1.06, 0.25),
      pipelineBoxes[i].lineWidth(5, 0.25),
    );
    yield* all(
      pipelineBoxes[i].scale(1, 0.25),
      pipelineBoxes[i].lineWidth(3, 0.25),
    );
    if (i < pipelineBoxes.length - 1) {
      yield* waitFor(0.15);
      yield* pipelineArrows[i].opacity(1, 0.4);
      yield* waitFor(0.1);
    }
  }
  yield* waitFor(0.4);

  yield* finalArrow().opacity(1, 0.45);
  yield* finalOutput().opacity(1, 0.7);

  yield* waitFor(10);
});
