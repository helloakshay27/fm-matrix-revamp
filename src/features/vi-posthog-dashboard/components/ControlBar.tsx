import { useState } from 'react';
import type { DateRange, Tier } from '@/features/posthog-dashboard/data/constants';
import { useViDashboard, type ViPlatform } from '../context/viDashboardStore';

/**
 * The reference (§7.1, cross-cutting controls) is explicit that Vi my Workspace has no admin
 * scope or persona tier — one product, one persona, employees and contractors undifferentiated.
 * So the FM three-tier selector collapses into a single Circle control here. Tier still exists
 * underneath because the shared `scopeSites`/`normalizeScope` helpers key off it; it just isn't
 * a thing the viewer picks.
 */
const ALL_CIRCLES = 'all-circles';

/** Vi my Workspace is a mobile app — the platform choice is iOS vs Android, not desktop vs mobile. */
const PLATFORMS: { value: ViPlatform; label: string; title: string }[] = [
  { value: 'all', label: 'All', title: 'Both platforms' },
  { value: 'iOS', label: 'iOS', title: 'iOS only' },
  { value: 'Android', label: 'Android', title: 'Android only' },
];

function circleValue(tier: Tier, scope: string): string {
  if (tier === 't3' && scope === 'org') return ALL_CIRCLES;
  return scope;
}

export function ControlBar() {
  const {
    vm, setCircle, setDate, setCustomRange, customRange, platform, setPlatform,
    togglePrev, refreshAll, isRefreshing,
  } = useViDashboard();
  const { state, sites, groups, sitesLoading, traffic } = vm;

  const [customOpen, setCustomOpen] = useState(false);
  const [draft, setDraft] = useState({ from: '', to: '' });


  return (
    <div className="filterbar">
      <label
        className="ctrl"
        title="Circle — labels the view. Mobile-app events carry no site, so site_id is not sent and the metrics below are tenant-wide."
      >
        <span className="ic">◎</span>
        {sitesLoading ? (
          <span>Loading circles…</span>
        ) : (
          <select
            value={circleValue(state.tier, state.scope)}
            onChange={(e) => {
              const v = e.target.value;
              if (v === ALL_CIRCLES) setCircle('t3', 'org');
              else if (groups.some((g) => g.id === v)) setCircle('t3', v);
              else setCircle('t1', v);
            }}
          >
            <option value={ALL_CIRCLES}>All Circles{sites.length ? ` (${sites.length})` : ''}</option>
            {groups.length > 0 && (
              <optgroup label="Companies">
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.siteIds.length})
                  </option>
                ))}
              </optgroup>
            )}
            {sites.length > 0 && (
              <optgroup label="Circles / sites">
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        )}
        <span className="chev">▾</span>
      </label>

      <label className="ctrl" title="Date range">
        <span className="ic">📅</span>
        <select
          value={customRange ? 'custom' : state.date}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              // Seed the pickers from whatever window is on screen right now.
              setDraft({ from: vm.range.from, to: vm.range.to });
              setCustomOpen(true);
              return;
            }
            setDate(Number(e.target.value) as DateRange);
          }}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value="custom">
            {customRange ? `${customRange.from} → ${customRange.to}` : 'Custom range…'}
          </option>
        </select>
        <span className="chev">▾</span>
      </label>

      {customOpen && (
        <div className="daterange-inline">
          <input
            type="date"
            value={draft.from}
            max={draft.to || undefined}
            onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
            aria-label="From date"
          />
          <span className="dr-to">–</span>
          <input
            type="date"
            value={draft.to}
            min={draft.from || undefined}
            onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
            aria-label="To date"
          />
          <button
            type="button"
            className="dr-apply"
            disabled={!draft.from || !draft.to || draft.from > draft.to}
            onClick={() => {
              setCustomRange(draft.from, draft.to);
              setCustomOpen(false);
            }}
          >
            Apply
          </button>
          <button
            type="button"
            className="dr-cancel"
            onClick={() => setCustomOpen(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="devtoggle" title="Platform (os)">
        {PLATFORMS.map((p) => (
          <button
            key={p.value}
            type="button"
            title={p.title}
            className={platform === p.value ? 'on' : undefined}
            onClick={() => setPlatform(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>


      <button
        type="button"
        className={`ctrl${state.prev ? ' toggle-on' : ''}`}
        onClick={togglePrev}
        title="Overlay the immediately preceding period of equal length"
      >
        <span className="ic">↺</span> Previous period {state.prev ? '✓' : ''}
      </button>

      <button
        type="button"
        className="ctrl"
        onClick={refreshAll}
        disabled={isRefreshing}
        aria-busy={isRefreshing}
        title={isRefreshing ? 'Refreshing metrics…' : 'Refetch every metric'}
      >
        {isRefreshing ? (
          <>
            <span className="spin" aria-hidden="true" /> Refreshing…
          </>
        ) : (
          <>
            <span className="ic">⟳</span> Refresh
          </>
        )}
      </button>

      <div className="spacer" />

      <span className="pill" title="Distinct users active in the last 30 minutes (U6)">
        <span className="dot" />
        <span>
          <b>{traffic.liveKv ?? '—'}</b>&nbsp;recently online
        </span>
      </span>
    </div>
  );
}
