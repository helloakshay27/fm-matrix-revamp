import { useEffect, useRef, useState } from 'react';
import { RANGE_LABELS, type DateRange, type Device } from '../data/constants';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

const PRESETS: DateRange[] = [7, 30, 90];

/** The API's `device_type` is Desktop/Mobile only — see data/constants.ts. */
const DEVICES: Array<{ key: Device; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'desktop', label: 'Desktop' },
  { key: 'mobile', label: 'Mobile' },
];

/**
 * Cross-cutting filters.
 *
 * Calendar App is a single-persona product with no site or tier dimension, so where FM Matrix
 * has a scope selector and Vi has a Circle selector, this has none — there is nothing to scope
 * by and the endpoints take no such parameter.
 *
 * The wireframe's Provider dropdown (Google / Outlook / iCloud / Exchange) is likewise absent:
 * `calendar_account_connected{provider}` is a real catalogue property, but none of the nine
 * endpoints accepts a provider filter, so the control could only ever have been decorative.
 */
export function ControlBar() {
  const {
    vm, setPreset, setCustomRange, customRange, setDev, togglePrev, refreshAll, isRefreshing,
  } = useCalendarDashboard();
  const { state, traffic, range } = vm;

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

  const rangeLabel = customRange ? `${customRange.from} → ${customRange.to}` : RANGE_LABELS[state.date];

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
                className={`dr-preset${!customRange && state.date === days ? ' on' : ''}`}
                onClick={() => {
                  setPreset(days);
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

      <div className="devtoggle" title="Platform (device_type)">
        {DEVICES.map((d) => (
          <button
            key={d.key}
            type="button"
            className={state.dev === d.key ? 'on' : undefined}
            onClick={() => setDev(d.key)}
          >
            {d.label}
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

      <span className="pill" title="Distinct users with an event in the last 30 minutes">
        <span className="dot" />
        <span>
          <b>{traffic.liveKv ?? '—'}</b>&nbsp;recently online
        </span>
      </span>
    </div>
  );
}
