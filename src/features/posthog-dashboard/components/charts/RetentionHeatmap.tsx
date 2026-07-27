interface RetentionHeatmapProps {
  cohorts: (number | null)[][];
  rowLabels: string[];
}

export function RetentionHeatmap({ cohorts, rowLabels }: RetentionHeatmapProps) {
  const cols = cohorts[0]?.length ?? 8;
  return (
    <table className="phg-rt">
      <thead>
        <tr>
          <th className="phg-rt-lbl">Cohort</th>
          {Array.from({ length: cols }, (_, w) => <th key={w}>Week {w}</th>)}
        </tr>
      </thead>
      <tbody>
        {cohorts.map((curve, i) => (
          <tr key={i}>
            <td className="phg-rt-lbl">{rowLabels[i]}</td>
            {curve.map((val, w) => {
              if (val == null) return <td key={w} style={{ background: '#f6f4ec', color: '#c9c6ba' }}>·</td>;
              const t = val / 100;
              const bg = `rgba(217,119,87,${(0.12 + t * 0.8).toFixed(2)})`;
              const col = t > 0.55 ? '#fff' : 'var(--phg-ink)';
              return <td key={w} style={{ background: bg, color: col }}>{val}%</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
