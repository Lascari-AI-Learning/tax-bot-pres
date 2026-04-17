import {makeScene2D, Rect, Txt, Line} from '@motion-canvas/2d';
import {all, createRef, createRefArray, sequence, waitFor} from '@motion-canvas/core';
import {COLORS, FONT} from '../_shared/theme';

/**
 * Phase 2 — Extract: Full left-to-right flow.
 *
 * ORCHESTRATOR → 10 docs → 10 extractions → per-section aggregate → 5 category files
 */
export default makeScene2D(function* (view) {
  view.fill(COLORS.bg);

  const orchestrator = createRef<Rect>();
  const spawnLines = createRefArray<Line>();
  const docs = createRefArray<Rect>();
  const writeLines = createRefArray<Line>();
  const extractions = createRefArray<Rect>();
  const aggInLines = createRefArray<Line>();
  const aggBoxes = createRefArray<Rect>();
  const aggOutLines = createRefArray<Line>();
  const categories = createRefArray<Rect>();

  const docData = [
    {label: '1099-NEC.pdf',       ext: 'PDF', mdName: '1099-nec.md',     cat: 0},
    {label: 'K-1.pdf',            ext: 'PDF', mdName: 'k-1.md',          cat: 0},
    {label: 'Brokerage.csv',      ext: 'CSV', mdName: 'brokerage.md',    cat: 0},
    {label: 'Biz Jan.pdf',        ext: 'PDF', mdName: 'biz-jan.md',      cat: 1},
    {label: 'Biz Feb.pdf',        ext: 'PDF', mdName: 'biz-feb.md',      cat: 1},
    {label: 'Biz Mar.pdf',        ext: 'PDF', mdName: 'biz-mar.md',      cat: 1},
    {label: 'Personal Jan.csv',   ext: 'CSV', mdName: 'personal-jan.md', cat: 2},
    {label: 'Personal Feb.csv',   ext: 'CSV', mdName: 'personal-feb.md', cat: 2},
    {label: 'Health.csv',         ext: 'CSV', mdName: 'health.md',       cat: 3},
    {label: 'Q1 Est.pdf',         ext: 'PDF', mdName: 'q1-est.md',       cat: 4},
  ];

  const categoryData = [
    {label: 'raw/income.md',    aggLabel: 'Aggregate\nIncome',     color: COLORS.user},
    {label: 'raw/business.md',  aggLabel: 'Aggregate\nBusiness',   color: COLORS.assistant},
    {label: 'raw/personal.md',  aggLabel: 'Aggregate\nPersonal',   color: COLORS.toolResult},
    {label: 'raw/credits.md',   aggLabel: 'Aggregate\nCredits',    color: COLORS.accent},
    {label: 'raw/estimated.md', aggLabel: 'Aggregate\nEstimated',  color: '#f59e0b'},
  ];

  const docCount = docData.length;
  const catCount = categoryData.length;

  // Layout x-positions
  const orchX = -800;
  const docX = -480;
  const extX = -190;
  const aggX = 200;
  const catX = 580;

  // Vertical spread for 10 docs
  const docSpacing = 86;
  const docStartY = -((docCount - 1) * docSpacing) / 2;

  // Vertical spread for 5 categories
  const catSpacing = 110;
  const catStartY = -((catCount - 1) * catSpacing) / 2;

  const boxW = 190;
  const boxH = 56;
  const extBoxW = 170;
  const aggBoxW = 160;
  const aggBoxH = 64;
  const catBoxW = 210;
  const catBoxH = 64;

  const catY = (i: number) => catStartY + i * catSpacing;

  view.add(
    <>
      {/* Orchestrator */}
      <Rect
        ref={orchestrator}
        x={orchX}
        y={0}
        fill={COLORS.userBg}
        stroke={COLORS.user}
        lineWidth={3}
        radius={14}
        padding={[16, 24]}
        width={200}
        height={80}
        opacity={0}
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Txt text="ORCHESTRATOR" fill={COLORS.user} fontFamily={FONT} fontSize={18} />
      </Rect>

      {/* Spawn lines */}
      {docData.map((_, i) => {
        const y = docStartY + i * docSpacing;
        return (
          <Line
            ref={spawnLines}
            stroke={COLORS.arrow}
            lineWidth={1.5}
            endArrow
            arrowSize={8}
            points={[
              [orchX + 100, 0],
              [docX - boxW / 2, y],
            ]}
            opacity={0}
          />
        );
      })}

      {/* Doc boxes */}
      {docData.map((d, i) => {
        const y = docStartY + i * docSpacing;
        const isPdf = d.ext === 'PDF';
        return (
          <Rect
            ref={docs}
            x={docX}
            y={y}
            fill={isPdf ? COLORS.userBg : COLORS.assistantBg}
            stroke={isPdf ? COLORS.user : COLORS.assistant}
            lineWidth={1.5}
            radius={8}
            padding={[6, 10]}
            width={boxW}
            height={boxH}
            opacity={0}
            layout
            alignItems="center"
            justifyContent="center"
          >
            <Txt text={d.label} fill={COLORS.white} fontFamily={FONT} fontSize={14} />
          </Rect>
        );
      })}

      {/* Write lines */}
      {docData.map((_, i) => {
        const y = docStartY + i * docSpacing;
        return (
          <Line
            ref={writeLines}
            stroke={COLORS.accent}
            lineWidth={1.5}
            endArrow
            arrowSize={8}
            points={[
              [docX + boxW / 2, y],
              [extX - extBoxW / 2, y],
            ]}
            opacity={0}
          />
        );
      })}

      {/* Extraction .md boxes */}
      {docData.map((d, i) => {
        const y = docStartY + i * docSpacing;
        const targetColor = categoryData[d.cat].color;
        return (
          <Rect
            ref={extractions}
            x={extX}
            y={y}
            fill={COLORS.toolCallBg}
            stroke={targetColor}
            lineWidth={1.5}
            radius={8}
            padding={[6, 10]}
            width={extBoxW}
            height={boxH}
            opacity={0}
            layout
            alignItems="center"
            justifyContent="center"
          >
            <Txt text={d.mdName} fill={COLORS.white} fontFamily={FONT} fontSize={13} />
          </Rect>
        );
      })}

      {/* Aggregation-in lines: extraction → its aggregate box */}
      {docData.map((d, i) => {
        const fromY = docStartY + i * docSpacing;
        const toY = catY(d.cat);
        return (
          <Line
            ref={aggInLines}
            stroke={categoryData[d.cat].color}
            lineWidth={1.5}
            endArrow
            arrowSize={8}
            points={[
              [extX + extBoxW / 2, fromY],
              [aggX - aggBoxW / 2, toY],
            ]}
            opacity={0}
          />
        );
      })}

      {/* Per-section aggregate boxes */}
      {categoryData.map((c, i) => {
        const y = catY(i);
        return (
          <Rect
            ref={aggBoxes}
            x={aggX}
            y={y}
            fill={COLORS.context}
            stroke={c.color}
            lineWidth={2}
            radius={10}
            padding={[8, 12]}
            width={aggBoxW}
            height={aggBoxH}
            opacity={0}
            layout
            alignItems="center"
            justifyContent="center"
          >
            <Txt text={c.aggLabel} fill={c.color} fontFamily={FONT} fontSize={14} textAlign="center" />
          </Rect>
        );
      })}

      {/* Aggregation-out lines: aggregate box → category file */}
      {categoryData.map((c, i) => {
        const y = catY(i);
        return (
          <Line
            ref={aggOutLines}
            stroke={c.color}
            lineWidth={2}
            endArrow
            arrowSize={10}
            points={[
              [aggX + aggBoxW / 2, y],
              [catX - catBoxW / 2, y],
            ]}
            opacity={0}
          />
        );
      })}

      {/* Category files */}
      {categoryData.map((c, i) => {
        const y = catY(i);
        return (
          <Rect
            ref={categories}
            x={catX}
            y={y}
            fill={COLORS.context}
            stroke={c.color}
            lineWidth={2.5}
            radius={10}
            padding={[10, 14]}
            width={catBoxW}
            height={catBoxH}
            opacity={0}
            layout
            alignItems="center"
            justifyContent="center"
          >
            <Txt text={c.label} fill={COLORS.white} fontFamily={FONT} fontSize={16} />
          </Rect>
        );
      })}
    </>,
  );

  // 1. Orchestrator
  yield* orchestrator().opacity(1, 0.6);
  yield* waitFor(0.3);

  // 2. Spawn lines
  yield* sequence(0.04, ...spawnLines.map((l) => l.opacity(1, 0.3)));
  yield* waitFor(0.15);

  // 3. Doc boxes
  yield* sequence(0.06, ...docs.map((d) => d.opacity(1, 0.4)));
  yield* waitFor(0.4);

  // 4. Write arrows + extractions
  yield* all(
    sequence(0.04, ...writeLines.map((l) => l.opacity(1, 0.35))),
    sequence(0.06, ...extractions.map((f) => f.opacity(1, 0.4))),
  );
  yield* waitFor(0.5);

  // 5. Aggregation-in lines
  yield* sequence(0.05, ...aggInLines.map((l) => l.opacity(1, 0.4)));
  yield* waitFor(0.2);

  // 6. Aggregate boxes
  yield* sequence(0.12, ...aggBoxes.map((b) => b.opacity(1, 0.5)));
  yield* waitFor(0.3);

  // 7. Aggregation-out lines + category files
  yield* all(
    sequence(0.1, ...aggOutLines.map((l) => l.opacity(1, 0.4))),
    sequence(0.12, ...categories.map((c) => c.opacity(1, 0.5))),
  );

  // REQUIRED: hold the final frame
  yield* waitFor(10);
});
