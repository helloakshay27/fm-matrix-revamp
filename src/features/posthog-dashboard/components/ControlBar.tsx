import { SITES, REGIONS, GOALS } from '../data/constants';
import { useDashboard } from '../context/DashboardContext';
import type { Tier, Device, DateRange } from '../data/constants';

const TIER_OPTIONS: { value: Tier; label: string }[] = [
  { value: 't1', label: 'Site Manager' },
  { value: 't2', label: 'Regional' },
  { value: 't3', label: 'Management' },
];

function ScopeOptions({ tier }: { tier: Tier }) {
  if (tier === 't1') return <>{SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</>;
  if (tier === 't2') return <>{REGIONS.map((r) => <option key={r} value={r}>{r} region</option>)}</>;
  return (
    <>
      <option value="org">All sites (org)</option>
      {REGIONS.map((r) => <option key={r} value={r}>↳ {r} region</option>)}
    </>
  );
}

export function ControlBar() {
  const { vm, setTier, setScope, setDate, setDev, togglePrev } = useDashboard();
  const { state, core } = vm;

  return (
    <div className="phg-controlbar">
      <div className="phg-wrap">
        <div className="phg-seg phg-tier">
          {TIER_OPTIONS.map((t) => (
            <button key={t.value} className={state.tier === t.value ? 'on' : ''} onClick={() => setTier(t.value)}>{t.label}</button>
          ))}
        </div>

        <label className="phg-ctrl">
          <span className="phg-ic">◎</span>
          <select value={state.scope} onChange={(e) => setScope(e.target.value)}>
            <ScopeOptions tier={state.tier} />
          </select>
        </label>

        <label className="phg-ctrl">
          <span className="phg-ic">▤</span>
          <select value={state.date} onChange={(e) => setDate(Number(e.target.value) as DateRange)}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </label>

        <div className="phg-devtoggle" title="Platform">
          {(['all', 'desktop', 'mobile'] as Device[]).map((d) => (
            <button key={d} className={state.dev === d ? 'on' : ''} onClick={() => setDev(d)}>
              {d === 'all' ? 'All' : d === 'desktop' ? '🖥' : '📱'}
            </button>
          ))}
        </div>

        <span className="phg-pill"><span className="phg-dot" /><span><b>{core.live}</b>&nbsp;recently online</span></span>

        <div className="phg-spacer" />

        <label className="phg-ctrl">
          <span className="phg-ic">▽</span>
          <select defaultValue={GOALS[0].value}>
            {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </label>

        <label className={`phg-ctrl${state.prev ? ' toggle-on' : ''}`} onClick={togglePrev}>
          <span className="phg-ic">⟲</span> Previous period {state.prev ? '✓' : ''}
        </label>
      </div>
    </div>
  );
}
