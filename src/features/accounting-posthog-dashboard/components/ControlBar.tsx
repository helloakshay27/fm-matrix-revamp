import { useEffect, useRef, useState } from 'react';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { RANGE_LABELS, type DateRange } from '../data/constants';
import { useAccountingDashboard } from '../context/accountingDashboardStore';
import { ACCOUNTING_APP_ID } from '../api/adoptionApi';

const PRESETS: DateRange[] = [7, 30, 90];

/**
 * Cross-cutting filters, per the Accounting wireframe: date range, previous-period overlay,
 * refresh and live count. No platform or provider control — the API scope is app_id=29 with
 * the default device_type=mobile, the same params as the Recent Activity call.
 */
export function ControlBar() {
  const queryClient = useQueryClient();
  const accountingQueryKey = ['accounting-adoption', 'app', ACCOUNTING_APP_ID] as const;
  const isRefreshing = useIsFetching({ queryKey: accountingQueryKey }) > 0;
  const {
    vm, setPreset, setCustomRange, customRange, togglePrev,
  } = useAccountingDashboard();
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

      <button
        type="button"
        id="prevBtn"
        className={`ctrl${vm.prev ? ' toggle-on' : ''}`}
        onClick={togglePrev}
        title="Overlay the immediately preceding period of equal length"
      >
        <span className="ic">&#8634;</span> Previous period {vm.prev ? '✓' : ''}
      </button>

      <button
        type="button"
        className="ctrl refresh-data-btn"
        aria-label="Refresh dashboard data"
        aria-busy={isRefreshing}
        title={isRefreshing ? 'Refreshing dashboard data' : 'Refresh dashboard data'}
        disabled={isRefreshing}
        onClick={() => {
          void queryClient.invalidateQueries({ queryKey: accountingQueryKey, refetchType: 'active' });
        }}
      >
        <RefreshCw aria-hidden="true" />
        Refresh
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
