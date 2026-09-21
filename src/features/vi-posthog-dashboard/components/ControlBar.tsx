import { useEffect, useRef, useState } from 'react';
import type { DateRange } from '@/features/posthog-dashboard/data/constants';
import { useViDashboard, type ViPlatform } from '../context/viDashboardStore';

/**
 * The reference (§7.1, cross-cutting controls) is explicit that Vi my Workspace has no admin
 * scope or persona tier — one product, one persona, employees and contractors undifferentiated.
 * There is no Circle control either: mobile-app events carry no site, so `site_id` is never
 * sent and every metric is tenant-wide. A selector that could only relabel the header, never
 * filter the numbers under it, is left out rather than shown as if it did something.
 */

const PRESETS: DateRange[] = [7, 30, 90];

const RANGE_LABELS: Record<DateRange, string> = {
  7: 'Last 7 days',
  30: 'Last 30 days',
  90: 'Last 90 days',
};

/** '2026-06-22' -> 'Jun 22', the button label the reference shows for a custom window. */
function shortDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Vi my Workspace is a mobile app — the platform choice is iOS vs Android, not desktop vs mobile. */
const PLATFORMS: { value: ViPlatform; label: string; title: string }[] = [
  { value: 'all', label: 'All', title: 'Both platforms' },
  { value: 'iOS', label: 'iOS', title: 'iOS only' },
  { value: 'Android', label: 'Android', title: 'Android only' },
];

export function ControlBar() {
  const {
    vm, setDate, setCustomRange, customRange, platform, setPlatform,
    togglePrev, refreshAll, isRefreshing,
  } = useViDashboard();
  const { state, traffic } = vm;

  const [customOpen, setCustomOpen] = useState(false);
  const [draft, setDraft] = useState({ from: '', to: '' });
  const dateRef = useRef<HTMLDivElement>(null);

  /* Click anywhere outside the control closes the popover, as in the reference. */
  useEffect(() => {
    if (!customOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setCustomOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [customOpen]);

  const rangeLabel = customRange
    ? `${shortDate(customRange.from)} – ${shortDate(customRange.to)}`
    : RANGE_LABELS[state.date];


  return (
    <div className="filterbar">
      <div className={`daterange${customOpen ? ' open' : ''}`} ref={dateRef}>
        <button
          type="button"
          className="ctrl"
          title="Date range"
          onClick={(e) => {
            e.stopPropagation();
            // Seed the pickers from whatever window is on screen right now.
            setDraft({ from: vm.range.from, to: vm.range.to });
            setCustomOpen((o) => !o);
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
                  setDate(days);
                  setCustomOpen(false);
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
                setCustomOpen(false);
              }}
            >
              {customRange ? 'Range applied ✓' : 'Apply custom range'}
            </button>
          </div>
        </div>
      </div>

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
