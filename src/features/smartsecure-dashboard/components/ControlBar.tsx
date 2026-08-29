import { useEffect, useRef, useState } from 'react';
import { useSmartSecureDashboard } from '../context/DashboardContext';
import { PROJECTS } from '../data/constants';
import type { DateRangeDays, Device } from '../data/types';

const RANGE_LABELS: Record<DateRangeDays, string> = { 7: 'Last 7 days', 30: 'Last 30 days', 90: 'Last 90 days' };

function DateRangeControl() {
  const { state, setRange, setCustomRange } = useSmartSecureDashboard();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(state.rangeFrom);
  const [to, setTo] = useState(state.rangeTo);
  const [applied, setApplied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className={`daterange ${open ? 'open' : ''}`} ref={ref}>
      <button className="ctrl" onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}>
        <span className="ic">📅</span>
        <span>{state.rangeLabel}</span>
        <span className="chev">▾</span>
      </button>
      <div className="daterange-pop">
        <div className="dr-presets">
          {([7, 30, 90] as DateRangeDays[]).map((d) => (
            <button
              key={d}
              className={`dr-preset ${state.range === d ? 'on' : ''}`}
              onClick={() => { setRange(d, RANGE_LABELS[d]); setApplied(false); setOpen(false); }}
            >
              {RANGE_LABELS[d]}
            </button>
          ))}
        </div>
        <div className="dr-custom">
          <div className="dr-custom-label">Custom range</div>
          <div className="dr-custom-row">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <span className="dr-to">–</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <button
            className={`dr-apply ${applied ? 'applied' : ''}`}
            onClick={() => {
              if (!from || !to) return;
              const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              setCustomRange(from, to, `${fmt(from)} – ${fmt(to)}`);
              setApplied(true);
            }}
          >
            {applied ? 'Range applied ✓' : 'Apply custom range'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ControlBar() {
  const { state, setDev, togglePrev, setSociety } = useSmartSecureDashboard();

  return (
    <div className="filterbar">
      <DateRangeControl />

      <label className="ctrl">
        <span className="ic">🏘</span>
        <select value={state.society} onChange={(e) => setSociety(e.target.value)}>
          <option>All Societies</option>
          {PROJECTS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <span className="chev">▾</span>
      </label>

      <div className="devtoggle" title="Platform">
        {(['all', 'ios', 'android'] as Device[]).map((d) => (
          <button key={d} className={state.dev === d ? 'on' : ''} onClick={() => setDev(d)} title={d === 'all' ? undefined : `${d} only`}>
            {d === 'all' ? 'All' : d === 'ios' ? 'iOS' : 'Android'}
          </button>
        ))}
      </div>

      <label className={`ctrl ${state.prev ? 'toggle-on' : ''}`} onClick={togglePrev}>
        <span className="ic">↺</span> Previous period {state.prev ? '✓' : ''}
      </label>

      <div className="spacer" />

      {/* The wireframe's own #liveCount span is never wired to a value anywhere in its
          script — it always reads this static placeholder. Ported as-is. */}
      <span className="pill">
        <span className="dot" />
        <span>— recently online</span>
      </span>
    </div>
  );
}
