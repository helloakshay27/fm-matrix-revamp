import { useEffect, useRef, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Device, DateRange, Tier, Site } from '../data/constants';

const TIER_OPTIONS: { value: Tier; label: string; hint: string }[] = [
  { value: 't1', label: 'Site Manager', hint: 'One or more sites' },
  { value: 't2', label: 'Regional', hint: 'One company and all of its sites' },
  { value: 't3', label: 'Management', hint: 'All sites for the organisation' },
];

/** Compact multi-select dropdown for picking sites. Matches the phg control-bar theme. */
function SiteMultiSelect({
  sites,
  selectedIds,
  onChange,
}: {
  sites: Site[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const all = selectedIds.length === 0;
  const filtered = sites.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // An empty selection still means "all sites" to the rest of the dashboard; here it is
  // shown as every site ticked, and an explicit list that covers every site collapses
  // back to "all".
  const isChecked = (id: string) => all || selectedIds.includes(id);
  const commit = (ids: string[]) => onChange(ids.length === sites.length ? [] : ids);

  const toggle = (id: string) => {
    const current = all ? sites.map((s) => s.id) : selectedIds;
    if (current.includes(id)) {
      const next = current.filter((x) => x !== id);
      // Keep at least one site — an empty list would silently flip back to "all".
      if (next.length > 0) commit(next);
    } else {
      commit([...current, id]);
    }
  };

  /** Clear: drop the selection and fall back to the first site only. */
  const clear = () => {
    if (sites.length > 0) commit([sites[0].id]);
  };

  // Ticking "All sites" selects every site; unticking it behaves like Clear.
  const toggleAll = () => (all ? clear() : onChange([]));

  // Label shown on the trigger button — site names, not IDs. Beyond two selections the
  // rest collapse into "+N", matching the scope subtitle ("Dadar, Dombiwali +1").
  const selectedNames = selectedIds.map((id) => sites.find((s) => s.id === id)?.name ?? id);
  const label = all
    ? `All sites (${sites.length})`
    : selectedNames.length > 2
      ? `${selectedNames.slice(0, 2).join(', ')} +${selectedNames.length - 2}`
      : selectedNames.join(', ');

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <label
        className="ctrl"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={all ? 'All sites' : selectedNames.join(', ')}
      >
        <span className="ic">◎</span>
        <span style={{ maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        <span className="chev">▼</span>
      </label>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 100,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-sm)', boxShadow: 'var(--shadow-pop)',
          marginTop: 4, padding: 8, minWidth: 220, maxHeight: 300, overflowY: 'auto'
        }}>
          {/* Search box */}
          <div style={{ marginBottom: 8 }}>
            <input
              autoFocus
              type="text"
              placeholder="Search sites…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '6px 8px',
                border: '1px solid var(--border)', borderRadius: 'var(--r-xs)',
                background: 'var(--surface)', color: 'var(--ink)'
              }}
            />
          </div>

          {/* Select all + Clear on one row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
              <input type="checkbox" checked={all} onChange={toggleAll} />
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>All sites ({sites.length})</span>
            </label>
            <button
              type="button"
              onClick={clear}
              style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: 'var(--blue)', cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

          {/* Site list */}
          <div>
            {filtered.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--faint)' }}>No sites match</div>
            )}
            {filtered.map((s) => {
              const checked = isChecked(s.id);
              return (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(s.id)} />
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{s.name}</span>
                </label>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}

export function ControlBar() {
  const { vm, setScope, setDate, setCustomDateRange, setToken, setDev, togglePrev, refreshAll, isRefreshing } = useDashboard();
  const { state, sites, groups, sitesLoading, traffic } = vm;
  const [dateOpen, setDateOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState(vm.range.from);
  const [draftTo, setDraftTo] = useState(vm.range.to);
  const dateControlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dateOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (dateControlRef.current && !dateControlRef.current.contains(event.target as Node)) {
        setDateOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDateOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dateOpen]);

  const selectedSiteIds = state.tier === 't1' && state.scope !== 'all'
    ? state.scope.split(',')
    : [];

  // Regional/Management scope selector logic
  const renderScopeSelect = () => {
    if (state.tier === 't1') {
      if (sitesLoading) {
        return <span className="ctrl">Loading sites...</span>;
      }
      if (sites.length === 0) {
        return <span className="ctrl">All sites</span>;
      }
      return (
        <SiteMultiSelect
          sites={sites}
          selectedIds={selectedSiteIds}
          onChange={(ids) => setScope(ids.length === 0 ? 'all' : ids.join(','))}
        />
      );
    }
    
    // For t2 (Regional) or t3 (Management), we can show a native select for groups
    if (state.tier === 't2' || state.tier === 't3') {
      return (
        <label className="ctrl">
          <span className="ic">◎</span>
          <select value={state.scope} onChange={(e) => setScope(e.target.value)}>
            {state.tier === 't3' && <option value="org">All Companies</option>}
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <span className="chev">▼</span>
        </label>
      );
    }
    return null;
  };

  return (
    <div className="filterbar">
      {renderScopeSelect()}

      {/* Date range */}
      <div className="date-range-control" ref={dateControlRef}>
        <button
          type="button"
          className="ctrl date-range-trigger"
          onClick={() => {
            if (!dateOpen) {
              setDraftFrom(vm.range.from);
              setDraftTo(vm.range.to);
            }
            setDateOpen((open) => !open);
          }}
          aria-haspopup="dialog"
          aria-expanded={dateOpen}
        >
          <span className="ic">▤</span>
          <span>{vm.dateLabel}</span>
          <span className="chev">▼</span>
        </button>
        {dateOpen && (
          <div className="date-range-panel" role="dialog" aria-label="Date range filter">
            <div className="date-range-presets" role="group" aria-label="Quick date ranges">
              {([7, 30, 90] as DateRange[]).map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`date-range-option ${!state.customDateRange && state.date === days ? 'selected' : ''}`}
                  onClick={() => {
                    setDate(days);
                    setDateOpen(false);
                  }}
                >
                  Last {days} days
                </button>
              ))}
            </div>
            <div className="date-range-custom-label">Custom range</div>
            <div className="date-range-inputs">
              <label>
                <span>From</span>
                <input
                  type="date"
                  value={draftFrom}
                  max={draftTo || undefined}
                  onChange={(event) => setDraftFrom(event.target.value)}
                />
              </label>
              <label>
                <span>To</span>
                <input
                  type="date"
                  value={draftTo}
                  min={draftFrom || undefined}
                  onChange={(event) => setDraftTo(event.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              className="date-range-apply"
              disabled={!draftFrom || !draftTo || draftFrom > draftTo}
              onClick={() => {
                setCustomDateRange({ from: draftFrom, to: draftTo });
                setDateOpen(false);
              }}
            >
              Apply custom range
            </button>
          </div>
        )}
      </div>

      {/* Device */}
      <div className="devtoggle" title="Platform (device_type)">
        {(['all', 'desktop', 'mobile'] as Device[]).map((d) => (
          <button key={d} className={state.dev === d ? 'on' : ''} onClick={() => setDev(d)}>
            {d === 'all' ? 'All' : d === 'desktop' ? 'Desktop' : 'Mobile'}
          </button>
        ))}
      </div>

      <label className={`ctrl ${state.prev ? 'toggle-on' : ''}`} onClick={togglePrev}>
        <span className="ic">↺</span> Previous period {state.prev ? '✓' : ''}
      </label>

      <button
        className={`ctrl ${isRefreshing ? 'is-refreshing' : ''}`}
        onClick={refreshAll}
        disabled={isRefreshing}
        aria-busy={isRefreshing}
        title={isRefreshing ? "Refreshing metrics…" : "Refetch every metric"}
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

      {/* Live pill */}
      <span className="pill" title="Distinct users active in the last 30 minutes (U8)">
        <span className="dot" />
        <span><b>{traffic.liveKv ?? '—'}</b>&nbsp;recently online</span>
      </span>
    </div>
  );
}
