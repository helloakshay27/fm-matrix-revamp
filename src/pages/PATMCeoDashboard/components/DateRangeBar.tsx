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

function pad(n: number) { return String(n).padStart(2, '0'); }

function fmtDateStr(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function computePresets() {
  const now = new Date();
  const today = fmtDateStr(now);
  const weekStart = new Date(now);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  return [
    { label: 'Today', from: today, to: today },
    { label: 'This Week', from: fmtDateStr(weekStart), to: fmtDateStr(weekEnd) },
    { label: 'This Month', from: fmtDateStr(monthStart), to: fmtDateStr(monthEnd) },
    { label: 'Last Month', from: fmtDateStr(lastMonthStart), to: fmtDateStr(lastMonthEnd) },
    { label: 'Last 3 Months', from: fmtDateStr(threeMonthsAgo), to: today },
    { label: 'All Time', from: '2023-01-01', to: today },
  ];
}

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
        {computePresets().map((p) => (
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
