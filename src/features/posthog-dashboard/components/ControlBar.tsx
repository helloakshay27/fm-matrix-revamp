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

  // Label shown on the trigger button
  const label =
    all
      ? `All sites (${sites.length})`
      : selectedIds.length === 1
        ? sites.find((s) => s.id === selectedIds[0])?.name ?? selectedIds[0]
        : `${selectedIds.length} sites selected`;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <button
        type="button"
        className="phg-site-dd-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={all ? 'All sites' : selectedIds.join(', ')}
      >
        <span className="phg-ic" style={{ opacity: 0.55, fontSize: 13 }}>◎</span>
        <span className="phg-site-dd-label">{label}</span>
        <span style={{ opacity: 0.4, fontSize: 10, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="phg-site-dd-panel">
          {/* Search box */}
          <div className="phg-site-dd-search">
            <input
              autoFocus
              type="text"
              placeholder="Search sites…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Select all */}
          <label className={`phg-site-dd-item phg-site-dd-all${all ? ' checked' : ''}`}>
            <input type="checkbox" checked={all} onChange={selectAll} />
            <span>All sites ({sites.length})</span>
          </label>

          <div className="phg-site-dd-divider" />

          {/* Site list */}
          <div className="phg-site-dd-list">
            {filtered.length === 0 && (
              <div className="phg-site-dd-empty">No sites match</div>
            )}
            {filtered.map((s) => {
              const checked = selectedIds.includes(s.id);
              return (
                <label key={s.id} className={`phg-site-dd-item${checked ? ' checked' : ''}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(s.id)} />
                  <span>{s.name}</span>
                </label>
              );
            })}
          </div>

          {/* Footer */}
          {selectedIds.length > 0 && (
            <div className="phg-site-dd-footer">
              <button type="button" onClick={selectAll}>Clear selection</button>
              <span>{selectedIds.length} selected</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ControlBar() {
  const { vm, setTier, setScope, setDate, setDev, refreshAll } = useDashboard();
  const { state, sites, groups, sitesLoading, traffic, range } = vm;

  const tierAvailable = (t: Tier) => t === 't1' || t === 't3';

  const selectedSiteIds = state.tier === 't1' && state.scope !== 'all'
    ? state.scope.split(',')
    : [];

  return (
    <div className="phg-controlbar">
      <div className="phg-wrap">
        {/* Tier tabs */}
        <div className="phg-seg phg-tier">
          {TIER_OPTIONS.map((t) => (
            <button
              key={t.value}
              className={state.tier === t.value ? 'on' : ''}
              disabled={!tierAvailable(t.value)}
              title={tierAvailable(t.value) ? t.hint : 'Needs a company grouping — the site list has no company_id'}
              onClick={() => tierAvailable(t.value) && setTier(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Site multi-select — only in Site Manager tab */}
        {state.tier === 't1' && (
          sitesLoading ? (
            <span className="phg-ctrl phg-scope phg-ctrl-note">
              <span className="phg-spin" /> Loading sites…
            </span>
          ) : sites.length === 0 ? (
            <span className="phg-ctrl phg-scope phg-ctrl-note">All sites · tenant-wide</span>
          ) : (
            <SiteMultiSelect
              sites={sites}
              selectedIds={selectedSiteIds}
              onChange={(ids) => setScope(ids.length === 0 ? 'all' : ids.join(','))}
            />
          )
        )}

        {/* Date range */}
        <label className="phg-ctrl">
          <span className="phg-ic">▤</span>
          <select value={state.date} onChange={(e) => setDate(Number(e.target.value) as DateRange)}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </label>

        {/* Device */}
        <div className="phg-devtoggle" title="Platform (device_type)">
          {(['all', 'desktop', 'mobile'] as Device[]).map((d) => (
            <button key={d} className={state.dev === d ? 'on' : ''} onClick={() => setDev(d)}>
              {d === 'all' ? 'All' : d === 'desktop' ? '🖥' : '📱'}
            </button>
          ))}
        </div>

        {/* Live pill */}
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
