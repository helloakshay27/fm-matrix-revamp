import { useEffect, useRef, useState } from 'react';
import { RANGE_LABELS, type DateRange, type Device } from '../data/constants';
import { PROVIDERS } from '../data/sampleData';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

const PRESETS: DateRange[] = [7, 30, 90];

/** Calendar App ships on iOS and Android, so the platform toggle is those two. */
const DEVICES: Array<{ key: Device; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'ios', label: 'iOS' },
  { key: 'android', label: 'Android' },
];

/** Connected-calendar providers, from the real `calendar_account_connected{provider}`. */
const PROVIDER_OPTIONS = ['All Providers', ...PROVIDERS];

/**
 * Cross-cutting filters.
 *
 * Calendar App is a single-persona product with no site or tier dimension, so where FM Matrix
 * has a scope selector and Vi has a Circle selector, this has none — there is nothing to scope
 * by and the endpoints take no such parameter.
 *
 * The Provider dropdown reads the real `calendar_account_connected{provider}` values. Like the
 * rest of this wireframe it does not requery anything — the Provider-wise breakdown on
 * Adoption & Engagement already lists every provider side by side.
 */
export function ControlBar() {
  const {
    vm, setPreset, setCustomRange, customRange, setDev, togglePrev,
  } = useCalendarDashboard();
  const { range } = vm;

  const [preset, setPresetLabel] = useState<DateRange>(30);
  const [provider, setProvider] = useState(PROVIDER_OPTIONS[0]);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ from: range.from, to: range.to });
  const popRef = useRef<HTMLDivElement>(null);

  /* Click anywhere outside the control closes the popover, as in the original. */
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [open]);

  const rangeLabel = customRange ? `${customRange.from} → ${customRange.to}` : RANGE_LABELS[preset];

  return (
    <div className="filterbar">
      <div className={`daterange${open ? ' open' : ''}`} ref={popRef}>
        <button
          type="button"
          className="ctrl"
          onClick={(e) => {
            e.stopPropagation();
            setDraft({ from: range.from, to: range.to });
            setOpen((o) => !o);
          }}
        >
          <span className="ic">📅</span>
          <span>{rangeLabel}</span>
          <span className="chev">▾</span>
        </button>
        <div className="daterange-pop">
          <div className="dr-presets">
            {PRESETS.map((days) => (
              <button
                key={days}
                type="button"
                className={`dr-preset${!customRange && preset === days ? ' on' : ''}`}
                onClick={() => {
                  setPreset(days);
                  setPresetLabel(days);
                  setOpen(false);
                }}
              >
                {RANGE_LABELS[days]}
              </button>
            ))}
          </div>
          <div className="dr-custom">
            <div className="dr-custom-label">Custom range</div>
            <div className="dr-custom-row">
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
            </div>
            <button
              type="button"
              className={`dr-apply${customRange ? ' applied' : ''}`}
              disabled={!draft.from || !draft.to || draft.from > draft.to}
              onClick={() => {
                setCustomRange(draft.from, draft.to);
                setOpen(false);
              }}
            >
              {customRange ? 'Range applied ✓' : 'Apply custom range'}
            </button>
          </div>
        </div>
      </div>

      <label className="ctrl">
        <span className="ic">📅</span>
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          {PROVIDER_OPTIONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <span className="chev">▾</span>
      </label>

      <div className="devtoggle" title="Platform">
        {DEVICES.map((d) => (
          <button
            key={d.key}
            type="button"
            className={vm.dev === d.key ? 'on' : undefined}
            onClick={() => setDev(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`ctrl${vm.prev ? ' toggle-on' : ''}`}
        onClick={togglePrev}
        title="Overlay the immediately preceding period of equal length"
      >
        <span className="ic">↺</span> Previous period {vm.prev ? '✓' : ''}
      </button>

      {/* No Refresh control: nothing is fetched, so there is nothing to refetch. */}

      <div className="spacer" />

      <span className="pill" title="Distinct users with an event in the last 30 minutes">
        <span className="dot" />
        <span>
          <b>{vm.traffic.tiles.find((t) => t.id === 'recentlyOnline')?.disp ?? '—'}</b>
          &nbsp;recently online
        </span>
      </span>
    </div>
  );
}
