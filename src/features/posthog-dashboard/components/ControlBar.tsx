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

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      const next = selectedIds.filter((x) => x !== id);
      onChange(next); // empty = "all"
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => onChange([]);

  // Label shown on the trigger button — shows IDs comma-separated when multiple selected
  const label =
    all
      ? `All sites (${sites.length})`
      : selectedIds.length === 1
        ? sites.find((s) => s.id === selectedIds[0])?.name ?? selectedIds[0]
        : selectedIds.join(',');

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <label
        className="ctrl"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={all ? 'All sites' : selectedIds.join(', ')}
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

          {/* Select all */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
            <input type="checkbox" checked={all} onChange={selectAll} />
            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>All sites ({sites.length})</span>
          </label>

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

          {/* Site list */}
          <div>
            {filtered.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--faint)' }}>No sites match</div>
            )}
            {filtered.map((s) => {
              const checked = selectedIds.includes(s.id);
              return (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(s.id)} />
                  <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{s.name}</span>
                </label>
              );
            })}
          </div>

          {/* Footer */}
          {selectedIds.length > 0 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)',
              fontSize: 12
            }}>
              <button type="button" onClick={selectAll} style={{ background: 'none', border: 'none', color: 'var(--blue)', cursor: 'pointer' }}>Clear</button>
              <span style={{ color: 'var(--faint)' }}>{selectedIds.length} selected</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ControlBar() {
  const { vm, setScope, setDate, setToken, setDev, togglePrev, refreshAll, isRefreshing } = useDashboard();
  const { state, sites, groups, sitesLoading, traffic } = vm;

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
      <label className="ctrl">
        <span className="ic">▤</span>
        <select value={state.date} onChange={(e) => setDate(Number(e.target.value) as DateRange)}>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
        <span className="chev">▼</span>
      </label>

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
