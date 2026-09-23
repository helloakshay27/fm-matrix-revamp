import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Sparkles, Loader2, RefreshCw, AlertTriangle, Eye, ChevronDown, ChevronUp, ChevronRight,
  Lightbulb, SearchX, TrendingUp,
} from 'lucide-react';
import {
  dashboardAiInsightsAPI,
  pollForInsights,
  type InsightsResult,
  type InsightItem,
} from '@/services/dashboardAiInsightsAPI';

const BRAND = '#C72030';

/**
 * "AI Insights" for one dashboard chart.
 *
 * Renders TWO things from one component so they share state:
 *   1. a toggle button, absolutely positioned on the card's heading row
 *   2. a collapsible panel BELOW the chart, in normal flow
 *
 * Mount it AFTER the chart in JSX. The button ignores flow order because it is
 * absolutely positioned, so it still lands at the top; the panel lands underneath the
 * chart, which is where findings belong.
 *
 * WHY mousedown IS STOPPED
 *
 * These cards live inside react-grid-layout, which begins a drag on mousedown and
 * swallows the click that would have followed — a button without this does nothing at
 * all when pressed. AddToDashboardButton (the "+") solves it the same way: a `no-drag`
 * class plus stopPropagation on mousedown.
 *
 * Nothing is fetched until the button is pressed. 72 charts each firing a model call on
 * page load would be slow and expensive, and most panels are never opened.
 */

const SECTIONS = [
  { key: 'insights' as const, label: 'Insights', Icon: Lightbulb,
    bg: 'bg-blue-50',  border: 'border-blue-200',  dot: '#2563eb' },
  { key: 'gaps' as const, label: 'Gaps', Icon: SearchX,
    bg: 'bg-amber-50', border: 'border-amber-200', dot: '#d97706' },
  { key: 'patterns' as const, label: 'Patterns', Icon: TrendingUp,
    bg: 'bg-emerald-50', border: 'border-emerald-200', dot: '#059669' },
];

/**
 * Which chart_codes the backend catalogue knows. Asked once per page load and shared by
 * every button, so 72 mounts cost one request.
 */
let knownPromise: Promise<Set<string>> | null = null;
const loadKnown = (): Promise<Set<string>> => {
  knownPromise ||= dashboardAiInsightsAPI
    .charts()
    .then((mods) => new Set(Object.values(mods).flat().map((c) => c.code)))
    // On failure assume everything is known rather than hiding the feature entirely.
    .catch(() => new Set<string>());
  return knownPromise;
};

interface Props {
  chartCode: string;
  /** The grid-layout item id, so the parent can grow the right card. */
  chartId?: string;
  siteIds: (string | number)[];
  fromDate?: string;
  toDate?: string;
  /**
   * Reports the panel's real rendered height in px (0 when collapsed). The dashboard
   * turns that into extra grid rows so the card grows to fit instead of the panel
   * being clipped by the fixed row height or overlapping the chart below.
   */
  onHeightChange?: (chartId: string, px: number) => void;
}

export const ChartAiInsights: React.FC<Props> = ({
  chartCode, chartId, siteIds, fromDate, toDate, onHeightChange,
}) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<InsightsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSql, setShowSql] = useState(false);
  // undefined = catalogue not fetched yet. Deliberately not `true`: starting optimistic
  // renders the button on every chart, then hides it on uncatalogued ones a moment
  // later, which reads as the control flickering in and out.
  const [supported, setSupported] = useState<boolean | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Measure the panel and tell the parent, so the grid row grows to fit. A
  // ResizeObserver rather than a fixed guess: the height changes as content arrives,
  // as the SQL block is toggled, and when the chart itself is resized.
  useEffect(() => {
    const id = chartId;
    if (!id || !onHeightChange) return;

    if (!open) { onHeightChange(id, 0); return; }

    const el = panelRef.current;
    if (!el) return;

    const report = () => onHeightChange(id, el.getBoundingClientRect().height);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => { ro.disconnect(); onHeightChange(id, 0); };
  }, [open, chartId, onHeightChange, data, loading, error, showSql]);

  useEffect(() => {
    let alive = true;
    loadKnown().then((known) => {
      if (!alive) return;
      setSupported(known.size === 0 ? true : known.has(chartCode));
    });
    return () => { alive = false; };
  }, [chartCode]);

  const load = useCallback(async (refresh = false) => {
    if (!siteIds?.length) { setError('Select at least one site first.'); return; }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    try {
      const queued = await dashboardAiInsightsAPI.request({
        chartCode, siteIds, fromDate, toDate, refresh, signal: ctrl.signal,
      });
      const done = await pollForInsights(queued.request_id, { signal: ctrl.signal });
      if (done.success) setData(done);
      else setError(done.error || 'No insights available for this chart.');
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError((e as Error).message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [chartCode, siteIds, fromDate, toDate]);

  // The filters define what the insight is ABOUT, so a stale panel would be actively
  // misleading. Drop it, and refetch only if the panel is actually open.
  useEffect(() => {
    setData(null);
    setError(null);
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteIds?.join(','), fromDate, toDate]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // react-grid-layout drags on mousedown and eats the click that follows.
  const stopDrag = (e: React.MouseEvent | React.PointerEvent) => e.stopPropagation();

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !open;
    setOpen(next);
    if (next && !data && !loading) load();
  };

  if (supported !== true) return null;

  const ins = data?.insights;
  const hasAny = !!ins && SECTIONS.some((s) => (ins[s.key] || []).length > 0);

  return (
    <>
      {/* 1. toggle — on the card's heading row, beside the "+" */}
      <div data-no-drag className="no-drag absolute right-14 top-3 z-30">
        <button
          type="button"
          onClick={toggle}
          onMouseDown={stopDrag}
          onPointerDown={stopDrag}
          title="AI Insights"
          className="no-drag flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1
                     text-[11px] font-medium shadow-sm transition hover:shadow"
          style={{
            borderColor: open ? BRAND : '#f0c9cc',
            color: open ? '#ffffff' : BRAND,
            backgroundColor: open ? BRAND : '#fdf3f4',
          }}
        >
          {loading
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <Sparkles className="h-3.5 w-3.5" />}
          AI Insights
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* 2. panel — below the chart, in flow, collapsible */}
      {open && (
        <div
          data-no-drag
          onMouseDown={stopDrag}
          onPointerDown={stopDrag}
          ref={panelRef}
          className="no-drag mt-2 rounded-lg border bg-white px-3 py-2.5"
          style={{ borderColor: '#f0c9cc' }}
        >
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: BRAND }} />
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: BRAND }}>
              AI Insights
            </span>
            <span className="truncate text-[10px] text-gray-400">
              {fromDate && toDate ? `${fromDate} → ${toDate}` : 'All time'}
              {siteIds?.length ? ` · ${siteIds.length} site${siteIds.length === 1 ? '' : 's'}` : ''}
              {data?.meta?.cached ? ' · cached' : ''}
            </span>
            <button
              onClick={(e) => { stopDrag(e); load(true); }}
              onMouseDown={stopDrag}
              disabled={loading}
              title="Regenerate"
              className="ml-auto rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={(e) => { stopDrag(e); setOpen(false); }}
              onMouseDown={stopDrag}
              title="Collapse"
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* The loader lives inside THIS chart's panel, so two charts generating at
              once never show each other's progress. */}
          {loading && !ins && (
            <div className="space-y-2 py-6 text-center">
              <Loader2 className="mx-auto h-5 w-5 animate-spin" style={{ color: BRAND }} />
              <p className="text-[11px] text-gray-500">
                Querying this chart&apos;s data and analysing it…
              </p>
              <p className="text-[10px] text-gray-400">usually 5–15 seconds</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-2.5 py-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
              <p className="text-[11px] text-red-700">{error}</p>
            </div>
          )}

          {ins && (
            <div className="space-y-2.5">
              <p className="text-sm font-semibold leading-snug text-gray-900">{ins.headline}</p>
              {ins.summary && (
                <p className="text-[11px] leading-relaxed text-gray-600">{ins.summary}</p>
              )}

              {!!ins.metrics?.length && (
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {ins.metrics.map((m, i) => (
                    <div key={i} className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5">
                      <div className="truncate text-[10px] uppercase tracking-wide text-gray-500"
                           title={m.label}>{m.label}</div>
                      <div className="truncate text-sm font-semibold text-gray-900"
                           title={String(m.value)}>{m.value}</div>
                      {m.hint && <div className="truncate text-[10px] text-gray-400">{m.hint}</div>}
                    </div>
                  ))}
                </div>
              )}

              {/* Insights, gaps and patterns are kept apart on purpose. "Gaps" is where
                  the data is missing or impossible, and it is usually worth more than
                  another average — folded into one list it gets skimmed past. */}
              {SECTIONS.map(({ key, label, Icon, bg, border, dot }) => {
                const items = (ins[key] || []) as InsightItem[];
                if (!items.length) return null;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className="h-3 w-3" style={{ color: dot }} />
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        {label} ({items.length})
                      </span>
                    </div>
                    {items.map((f, i) => (
                      <div key={i} className={`rounded-md border ${border} ${bg} px-2.5 py-1.5`}>
                        <div className="text-[11px] font-medium text-gray-900">{f.title}</div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-gray-700">{f.detail}</p>
                      </div>
                    ))}
                  </div>
                );
              })}

              {!hasAny && (
                <p className="text-[11px] italic text-gray-500">
                  No distinct insights, gaps or patterns were found in this data.
                </p>
              )}

              {!!ins.recommendations?.length && (
                <div className="rounded-md border border-gray-200 px-2.5 py-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    Suggested next step{ins.recommendations.length > 1 ? 's' : ''}
                  </div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] text-gray-700">
                    {ins.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {/* Provenance. An insight nobody can audit is an insight nobody should
                  act on, so the query is one click away rather than hidden. */}
              {data?.meta?.sql && (
                <div className="border-t border-gray-100 pt-1.5">
                  <button
                    onClick={(e) => { stopDrag(e); setShowSql((v) => !v); }}
                    onMouseDown={stopDrag}
                    className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-700"
                  >
                    {showSql ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    <Eye className="h-3 w-3" />
                    How this was worked out
                    <span className="text-gray-400">
                      · {data.meta.row_count} rows from {data.chart?.source?.table}
                      {data.meta.attempts > 1 ? ` · ${data.meta.attempts} attempts` : ''}
                    </span>
                  </button>
                  {showSql && (
                    <pre className="mt-1.5 max-h-40 overflow-auto rounded bg-gray-900 p-2 text-[10px]
                                    leading-relaxed text-gray-100">{data.meta.sql}</pre>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChartAiInsights;
