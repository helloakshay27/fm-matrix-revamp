interface RetentionHeatmapProps {
  cohorts: (number | null)[][];
  rowLabels: string[];
}

/**
 * Weekly-cohort retention grid. Cell shading is the wireframe's single-hue ramp,
 * expressed against the `--heat-*` tokens so a theme flip re-colours it with no JS.
 */
export function RetentionHeatmap({ cohorts, rowLabels }: RetentionHeatmapProps) {
  const cols = cohorts[0]?.length ?? 8;
  return (
    <table className="rt">
      <thead>
        <tr>
          <th className="lbl">Cohort</th>
          {Array.from({ length: cols }, (_, w) => <th key={w}>Week {w}</th>)}
        </tr>
      </thead>
      <tbody>
        {cohorts.map((curve, i) => (
          <tr key={i}>
            <td className="lbl">{rowLabels[i]}</td>
            {curve.map((val, w) => {
              if (val == null) {
                return <td key={w} style={{ background: 'var(--surface-2)', color: 'var(--faint)' }}>·</td>;
              }
              const t = val / 100;
              const bg = `rgba(var(--heat-rgb), calc(var(--heat-a0) + ${t.toFixed(3)} * var(--heat-a1)))`;
              const col = t > 0.55 ? 'var(--on-heat)' : 'var(--ink)';
              return <td key={w} style={{ background: bg, color: col }}>{val}%</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
