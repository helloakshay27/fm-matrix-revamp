interface DateRangeBarProps {
  activePreset: string;
  fromDate: string;
  toDate: string;
  activeLabel: string;
  onPreset: (label: string, from: string, to: string) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onApply: () => void;
}

const PRESETS = [
  { label: 'Today', from: '2026-05-07', to: '2026-05-07' },
  { label: 'This Week', from: '2026-05-05', to: '2026-05-11' },
  { label: 'This Month', from: '2026-05-01', to: '2026-05-31' },
  { label: 'Last Month', from: '2026-04-01', to: '2026-04-30' },
  { label: 'Last 3 Months', from: '2026-02-01', to: '2026-05-07' },
  { label: 'All Time', from: '2023-01-01', to: '2026-05-07' },
];

export default function DateRangeBar({
  activePreset,
  fromDate,
  toDate,
  activeLabel,
  onPreset,
  onFromChange,
  onToChange,
  onApply,
}: DateRangeBarProps) {
  return (
    <div className="dr-bar">
      <div className="dr-label">Period</div>
      <div className="dr-presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`dr-chip${activePreset === p.label ? ' active' : ''}`}
            onClick={() => onPreset(p.label, p.from, p.to)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="dr-divider" />
      <div className="dr-custom">
        <span className="dr-custom-label">Custom</span>
        <input
          type="date"
          className="dr-input"
          value={fromDate}
          title="From date"
          onChange={(e) => onFromChange(e.target.value)}
        />
        <span className="dr-custom-label">→</span>
        <input
          type="date"
          className="dr-input"
          value={toDate}
          title="To date"
          onChange={(e) => onToChange(e.target.value)}
        />
        <button className="dr-apply" onClick={onApply}>
          Apply
        </button>
      </div>
      <div className="dr-active-badge">
        <div className="dr-active-dot" />
        <span>{activeLabel}</span>
      </div>
    </div>
  );
}
