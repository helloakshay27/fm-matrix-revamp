export interface BarListItem {
  label: string;
  value: number;
  meta?: string;
}

interface BarListProps {
  items: BarListItem[];
  valueSuffix?: string;
}

export function BarList({ items, valueSuffix = "" }: BarListProps) {
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const max = Math.max(...sorted.map((i) => i.value), 1);

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((item) => (
        <div key={item.label} title={`${item.label}: ${item.value.toLocaleString()}${valueSuffix}`}>
          <div className="mb-1 flex items-center justify-between gap-3 text-brand-body-5">
            <span className="truncate font-medium text-brand-text">{item.label}</span>
            <span className="shrink-0 text-brand-text-light">
              {item.value.toLocaleString()}
              {valueSuffix}
              {item.meta ? ` · ${item.meta}` : ""}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-bg">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
