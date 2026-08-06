type Item = { name: string; meta: string; value: string | number; onClick?: () => void };

export function Leaderboard({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={item.name} className="lb-row" onClick={item.onClick} role={item.onClick ? 'button' : undefined}>
          <div className="lb-rank">{i + 1}</div>
          <div className="lb-info">
            <div className="lb-name">{item.name}</div>
            <div className="lb-meta">{item.meta}</div>
          </div>
          <div className="lb-val">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
