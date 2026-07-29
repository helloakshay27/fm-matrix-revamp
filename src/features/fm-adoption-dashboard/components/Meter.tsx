interface MeterProps {
  label: string;
  value: number; // 0..1
  valueLabel: string;
  sublabel?: string;
}

export function Meter({ label, value, valueLabel, sublabel }: MeterProps) {
  const pct = Math.min(1, Math.max(0, value)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-brand-body-5 font-medium text-brand-text-light">{label}</span>
        <span className="text-brand-body-2 font-semibold text-brand-text">{valueLabel}</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-brand-light">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
      {sublabel && <div className="mt-1.5 text-brand-body-5 text-brand-text-light">{sublabel}</div>}
    </div>
  );
}
