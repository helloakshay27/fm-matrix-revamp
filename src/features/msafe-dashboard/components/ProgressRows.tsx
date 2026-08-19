type Row = { label: string; pct: number; val: string; color: string; onClick?: () => void };

export function ProgressRows({ rows }: { rows: Row[] }) {
  return (
    <div style={{ padding: '4px 0' }}>
      {rows.map((r) => (
        <div key={r.label} className="pb-row" onClick={r.onClick} role={r.onClick ? 'button' : undefined}>
          <span className="pb-label">{r.label}</span>
          <div className="pb-wrap">
            <div className="pb-fill" style={{ width: `${r.pct}%`, background: r.color }} />
          </div>
          <span className="pb-val">{r.val}</span>
        </div>
      ))}
    </div>
  );
}
