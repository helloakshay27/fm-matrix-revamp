import { useEffect, useRef, useState } from 'react';
import { RANGE_LABELS, type DateRange, type Device } from '../data/constants';
import { useCalendarDashboard } from '../context/calendarDashboardStore';

const PRESETS: DateRange[] = [7, 30, 90];

/** Calendar App ships on iOS and Android, so the platform toggle is those two. */
const DEVICES: Array<{ key: Device; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'ios', label: 'iOS' },
  { key: 'android', label: 'Android' },
];

/**
 * Cross-cutting filters.
 *
 * Calendar App is a single-persona product with no site or tier dimension, so where FM Matrix
 * has a scope selector and Vi has a Circle selector, this has none — there is nothing to scope
 * by and the endpoints take no such parameter.
 */
export function ControlBar() {
  const {
    vm, setPreset, setCustomRange, customRange, setDev, togglePrev,
  } = useCalendarDashboard();
  const { range } = vm;

  const [preset, setPresetLabel] = useState<DateRange>(30);
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
      <div className={`daterange${open ? ' open' : ''}`} id="dateRange" ref={popRef}>
        <button
          type="button"
          className="ctrl"
          id="dateRangeBtn"
          onClick={(e) => {
            e.stopPropagation();
            setDraft({ from: range.from, to: range.to });
            setOpen((o) => !o);
          }}
        >
          <span className="ic">&#128197;</span>
          <span id="dateRangeLabel">{rangeLabel}</span>
          <span className="chev">&#9662;</span>
        </button>
        <div className="daterange-pop" id="dateRangePop">
          <div className="dr-presets">
            {PRESETS.map((days) => (
              <button
                key={days}
                type="button"
                className={`dr-preset${!customRange && preset === days ? ' on' : ''}`}
                data-range={days}
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
                id="dateFrom"
                value={draft.from}
                max={draft.to || undefined}
                onChange={(e) => setDraft((d) => ({ ...d, from: e.target.value }))}
                aria-label="From date"
              />
              <span className="dr-to">&ndash;</span>
              <input
                type="date"
                id="dateTo"
                value={draft.to}
                min={draft.from || undefined}
                onChange={(e) => setDraft((d) => ({ ...d, to: e.target.value }))}
                aria-label="To date"
              />
            </div>
            <button
              type="button"
              id="dateApplyBtn"
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

      <div className="devtoggle" id="devToggle" title="Platform">
        {DEVICES.map((d) => (
          <button
            key={d.key}
            type="button"
            data-dev={d.key}
            className={vm.dev === d.key ? 'on' : undefined}
            onClick={() => setDev(d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        id="prevBtn"
        className={`ctrl${vm.prev ? ' toggle-on' : ''}`}
        onClick={togglePrev}
        title="Overlay the immediately preceding period of equal length"
      >
        <span className="ic">&#8634;</span> Previous period {vm.prev ? '✓' : ''}
      </button>

      <div className="spacer" />

      <span className="pill" title="Distinct users with an event in the last 30 minutes">
        <span className="dot" />
        <span id="liveCount">
          {vm.traffic.tiles.find((t) => t.id === 'recentlyOnline')?.disp ?? '—'} recently online
        </span>
      </span>
    </div>
  );
}
