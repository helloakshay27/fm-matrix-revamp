import { useDashboard } from '../context/DashboardContext';
import type { Device, DateRange, Tier } from '../data/constants';

const TIER_OPTIONS: { value: Tier; label: string; hint: string }[] = [
  { value: 't1', label: 'Site Manager', hint: 'One site at a time' },
  { value: 't2', label: 'Regional', hint: 'One company and all of its sites' },
  { value: 't3', label: 'Management', hint: 'The whole tenant, drillable by company' },
];

export function ControlBar() {
  const { vm, setTier, setScope, setDate, setDev, refreshAll } = useDashboard();
  const { state, sites, groups, sitesLoading, traffic, range } = vm;

  // Regional/Management drilldown need a company grouping; sites without a company_id
  // can't be grouped, so those tiers are offered only when the data supports them.
  const tierAvailable = (t: Tier) => t === 't1' || t === 't3' || groups.length > 0;

  /** What `scope` means depends on the tier: a site (t1), a company (t2), or both (t3). */
  function ScopeOptions() {
    if (state.tier === 't1') {
      return (
        <>
          <option value="all">All sites ({sites.length})</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </>
      );
    }
    if (state.tier === 't2') {
      return (
        <>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name} ({g.siteIds.length})</option>
          ))}
        </>
      );
    }
    return (
      <>
        <option value="org">All sites ({sites.length})</option>
        {groups.map((g) => (
          <option key={g.id} value={g.id}>↳ {g.name} ({g.siteIds.length})</option>
        ))}
      </>
    );
  }

  return (
    <div className="phg-controlbar">
      <div className="phg-wrap">
        <div className="phg-seg phg-tier">
          {TIER_OPTIONS.map((t) => (
            <button
              key={t.value}
              className={state.tier === t.value ? 'on' : ''}
              disabled={!tierAvailable(t.value)}
              title={
                tierAvailable(t.value)
                  ? t.hint
                  : 'Needs a company grouping — the site list has no company_id'
              }
              onClick={() => tierAvailable(t.value) && setTier(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* While the site list is loading or unavailable the control shows its own state
            rather than putting a fake, unselectable row inside the dropdown. */}
        <label
          className="phg-ctrl phg-scope"
          title={
            sitesLoading
              ? 'Loading the site list…'
              : sites.length
                ? `${sites.length} site(s) · scope every metric to one site`
                : 'Site list unavailable — metrics cover the whole tenant'
          }
        >
          <span className="phg-ic">◎</span>
          {sitesLoading ? (
            <span className="phg-ctrl-note"><span className="phg-spin" /> Loading sites…</span>
          ) : sites.length === 0 ? (
            <span className="phg-ctrl-note">All sites · tenant-wide</span>
          ) : (
            <select value={state.scope} onChange={(e) => setScope(e.target.value)}>
              <ScopeOptions />
            </select>
          )}
        </label>

        <label className="phg-ctrl">
          <span className="phg-ic">▤</span>
          <select value={state.date} onChange={(e) => setDate(Number(e.target.value) as DateRange)}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </label>

        <div className="phg-devtoggle" title="Platform (device_type)">
          {(['all', 'desktop', 'mobile'] as Device[]).map((d) => (
            <button key={d} className={state.dev === d ? 'on' : ''} onClick={() => setDev(d)}>
              {d === 'all' ? 'All' : d === 'desktop' ? '🖥' : '📱'}
            </button>
          ))}
        </div>



        <span className="phg-pill" title="Distinct users active in the last 30 minutes (U8)">
          <span className="phg-dot" />
          <span><b>{traffic.liveKv ?? '—'}</b>&nbsp;recently online</span>
        </span>

        <div className="phg-spacer" />

        <span className="phg-range">{range.from} → {range.to}</span>

        <button className="phg-ctrl phg-refresh" onClick={refreshAll} title="Refetch every metric">
          <span className="phg-ic">⟳</span> Refresh
        </button>
      </div>
    </div>
  );
}
