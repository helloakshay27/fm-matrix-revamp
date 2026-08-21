import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { ChartTable, DonutChart, SliceBarChart } from '../components/DonutChart';
import { Leaderboard } from '../components/Leaderboard';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import type { Persona } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';

type DailyRow = { d: string; n: number };
type WeekRow = { label: string; pct: number; val: string; color: string };
type ManagerRow = { name: string; department: string; circle: string; count: number };
type Slice = { name: string; value: number; color: string };
type TrendRow = { m: string; n: number };

const SLICE_PALETTE = [C.terra, C.sage, C.blue, C.teal, C.warn, C.err, C.lav, C.ok, '#B4A38A'];

function getMsafeBaseUrl(): string {
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
}

/** Circle Manager filter bar values, applied as query params once the user clicks Apply.
 *  Pan India now uses the exact same filter bar as Circle Manager, so every field applies
 *  the same way regardless of persona. */
function buildFilterParams(persona: Persona, f: AppliedFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (f.circleIds.length > 0) params.circle_id = f.circleIds.join(',');
  if (f.functionIds.length > 0) params.function_id = f.functionIds.join(',');
  if (f.zoneId) params.zone_id = f.zoneId;
  if (f.empTypeId) params.employee_type = f.empTypeId;
  if (f.startDate) params.from_date = f.startDate;
  if (f.endDate) params.to_date = f.endDate;
  return params;
}

async function fetchMsafeLmcJson(
  endpoint: string,
  extraQuery?: Record<string, string>,
  signal?: AbortSignal,
): Promise<unknown> {
  const token = localStorage.getItem('token') || '';
  const companyId =
    localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '';
  const params = new URLSearchParams({ company_id: companyId, ...extraQuery });
  if (token) {
    params.set('access_token', token);
    params.set('token', token);
  }
  const url = `${getMsafeBaseUrl()}/msafe_lmc_dashboard/${endpoint}?${params.toString()}`;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { signal, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function unwrapList(payload: unknown, arrayKeys: string[]): unknown[] {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  if (Array.isArray(source)) return source;
  for (const key of arrayKeys) {
    const candidate = (source as Record<string, unknown>)?.[key];
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function getNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    if (typeof raw === 'string' && raw.trim() && Number.isFinite(Number(raw))) return Number(raw);
  }
  return null;
}

function getString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

// Raw per-record shape from the API: one row per (date, circle) combination,
// e.g. { circle_name, date, volume }. Kept separate from the aggregated chart
// data so the "table" view can show the full circle-wise breakdown.
type DailyCircleRow = { date: string; circle: string; volume: number };

function normalizeDailyVolumeByCircle(payload: unknown): DailyCircleRow[] {
  const list = unwrapList(payload, ['data', 'result', 'daily', 'days', 'records']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const date = getString(record, ['date', 'day', 'day_label', 'd', 'label', 'name']);
      if (!date) return null;
      const volume = getNumber(record, ['volume', 'count', 'value', 'n', 'total', 'lmc_count', 'sign_offs']);
      if (volume === null) return null;
      const circle = getString(record, ['circle_name', 'circle']) ?? '—';
      return { date, circle, volume };
    })
    .filter((item): item is DailyCircleRow => Boolean(item));
}

// The API returns one row per (date, circle) — the line/bar chart needs one
// point per day, so volumes are summed across every circle for that date.
function normalizeDailyVolume(rows: DailyCircleRow[]): DailyRow[] {
  const totals = new Map<string, number>();
  const order: string[] = [];
  for (const row of rows) {
    if (!totals.has(row.date)) order.push(row.date);
    totals.set(row.date, (totals.get(row.date) ?? 0) + row.volume);
  }
  return order.map((d) => ({ d, n: totals.get(d) ?? 0 }));
}

function colorForWeekPct(pct: number): string {
  if (pct >= 90) return C.ok;
  if (pct >= 70) return C.teal;
  return C.warn;
}

type WeeklyDayRecord = { label: string; actual: number; target: number | null; explicitPct: number | null };

/** Reads one circle's `records` array (each `{ date, day_name, actual_lmc_completion, ... }`)
 *  into flat day rows carrying a unique day_name+date label. */
function readCircleWeeklyRecords(records: unknown[]): WeeklyDayRecord[] {
  return records
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const dayName = getString(record, ['day_name', 'day']);
      const date = getString(record, ['date']);
      const label = dayName && date ? `${dayName} · ${date}` : dayName ?? date ?? getString(record, ['label']);
      if (!label) return null;
      const actual = getNumber(record, [
        'actual_lmc_completion',
        'actual',
        'actual_signed',
        'completed',
        'completed_count',
        'lmc_signed',
        'signed_count',
        'count',
        'value',
        'val',
        'sign_offs',
      ]);
      if (actual === null) return null;
      const target = getNumber(record, ['daily_target', 'target']);
      const explicitPct = getNumber(record, ['pct', 'percentage', 'completion_percentage', 'percent']);
      return { label, actual, target, explicitPct };
    })
    .filter((item): item is WeeklyDayRecord => Boolean(item));
}

// The response is now grouped per circle — { data: [ { circle_name, records: [...] }, ... ] } —
// with each circle contributing its own day_name+date rows. Sum actual_lmc_completion (and any
// explicit target/pct) across every circle for the same date so each day appears once overall,
// instead of once per circle.
function normalizeWeeklyCompletion(payload: unknown): WeekRow[] {
  const circles = unwrapList(payload, ['data', 'result', 'circles']);

  const perCircleRows: WeeklyDayRecord[] = circles.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const record = item as Record<string, unknown>;
    const records = record.records;
    if (Array.isArray(records)) return readCircleWeeklyRecords(records);
    // Fall back to treating this entry itself as a flat day row, for a plain (non-circle-wise) shape.
    return readCircleWeeklyRecords([item]);
  });

  const order: string[] = [];
  const totals = new Map<string, { actual: number; target: number | null; explicitPct: number | null }>();
  for (const r of perCircleRows) {
    if (!totals.has(r.label)) {
      order.push(r.label);
      totals.set(r.label, { actual: 0, target: null, explicitPct: null });
    }
    const acc = totals.get(r.label)!;
    acc.actual += r.actual;
    if (r.target !== null) acc.target = (acc.target ?? 0) + r.target;
  }

  const rows = order.map((label) => ({ label, ...totals.get(label)! }));
  const maxActual = Math.max(1, ...rows.map((r) => r.actual));
  return rows.map((r) => {
    const pct =
      r.explicitPct ??
      (r.target !== null && r.target > 0
        ? Math.round((r.actual / r.target) * 100)
        : Math.round((r.actual / maxActual) * 100));
    return { label: r.label, pct, val: r.actual.toLocaleString('en-IN'), color: colorForWeekPct(pct) };
  });
}

function normalizeManagers(payload: unknown): ManagerRow[] {
  const list = unwrapList(payload, ['data', 'result', 'managers', 'records']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['manager_name', 'name', 'employee_name']);
      if (!name) return null;
      const department = getString(record, ['department_name', 'department', 'function', 'func']) ?? '—';
      const circle = getString(record, ['circle', 'circle_name']) ?? '—';
      const count = getNumber(record, [
        'total_lmc_created',
        'total_lmc_signed',
        'count',
        'value',
        'sign_offs',
        'lmc_count',
        'total',
      ]);
      if (count === null) return null;
      return { name, department, circle, count };
    })
    .filter((item): item is ManagerRow => Boolean(item));
}

function normalizeByFunction(payload: unknown): Slice[] {
  const list = unwrapList(payload, ['data', 'result', 'functions']);
  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['function_name', 'function', 'func', 'name', 'label', 'title']);
      if (!name) return null;
      const value = getNumber(record, ['percentage', 'pct', 'value', 'count', 'sign_offs', 'total']);
      if (value === null) return null;
      return { name, value, color: SLICE_PALETTE[index % SLICE_PALETTE.length] };
    })
    .filter((item): item is Slice => Boolean(item));
}

function colorForStatusLabel(label: string): string {
  const s = label.toLowerCase();
  if (/complete|cleared|done/.test(s)) return C.ok;
  if (/progress/.test(s)) return C.teal;
  if (/pending|initiated|open/.test(s)) return C.warn;
  return C.err;
}

function humanizeStatusKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// The API returns a flat object of status → count under `data`, e.g.
// { data: { completed: 46520, pending: 436 } } — the set of statuses is
// whatever keys the response has, not a fixed list, so build rows dynamically
// from those keys instead of assuming "completed"/"pending".
function normalizeLmcStatus(payload: unknown): WeekRow[] {
  const source =
    payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
  const statusObj =
    source && typeof source.data === 'object' && source.data !== null && !Array.isArray(source.data)
      ? (source.data as Record<string, unknown>)
      : source && !Array.isArray(source)
        ? source
        : null;

  if (statusObj) {
    const rows = Object.entries(statusObj)
      .map(([key, raw]) => {
        const count =
          typeof raw === 'number' && Number.isFinite(raw)
            ? raw
            : typeof raw === 'string' && raw.trim() && Number.isFinite(Number(raw))
              ? Number(raw)
              : null;
        if (count === null) return null;
        return { label: humanizeStatusKey(key), count, color: colorForStatusLabel(key) };
      })
      .filter((item): item is { label: string; count: number; color: string } => Boolean(item));

    const total = rows.reduce((sum, r) => sum + r.count, 0) || 1;
    return rows.map((r) => ({
      label: r.label,
      val: r.count.toLocaleString('en-IN'),
      pct: Math.round((r.count / total) * 100),
      color: r.color,
    }));
  }

  const list = unwrapList(payload, ['data', 'result', 'status', 'statuses']);
  const rows = list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const label = getString(record, ['status', 'status_name', 'label', 'name']);
      if (!label) return null;
      const count = getNumber(record, ['total_lmc_records', 'count', 'value', 'val', 'total']);
      if (count === null) return null;
      const explicitPct = getNumber(record, ['pct', 'percentage', 'percent']);
      return { label, count, explicitPct, color: colorForStatusLabel(label) };
    })
    .filter(
      (item): item is { label: string; count: number; explicitPct: number | null; color: string } =>
        Boolean(item),
    );

  const total = rows.reduce((sum, r) => sum + r.count, 0) || 1;
  return rows.map((r) => ({
    label: r.label,
    val: r.count.toLocaleString('en-IN'),
    pct: r.explicitPct ?? Math.round((r.count / total) * 100),
    color: r.color,
  }));
}

type TrendCircleRow = { month: string; circle: string; volume: number };

// Raw per-record shape from the API: one row per (circle, month) combination —
// { circle_name, month, lmc_volume }. Kept separate from the aggregated trend
// data so the hover tooltip can show the full circle-wise breakdown per month.
function normalizeMonthlyTrendByCircle(payload: unknown): TrendCircleRow[] {
  const list = unwrapList(payload, ['data', 'result', 'months', 'trend']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const month = getString(record, ['month', 'month_name', 'm', 'label', 'name']);
      if (!month) return null;
      const volume = getNumber(record, [
        'lmc_volume',
        'total_lmc_signoff_volume',
        'count',
        'value',
        'n',
        'total',
        'sign_offs',
      ]);
      if (volume === null) return null;
      const circle = getString(record, ['circle_name', 'circle']) ?? '—';
      return { month, circle, volume };
    })
    .filter((item): item is TrendCircleRow => Boolean(item));
}

// The response is one row per (circle, month) — { circle_name, month, lmc_volume } — so
// volumes are summed across every circle for the same month, same approach as the daily
// volume and weekly completion normalizers above.
function normalizeMonthlyTrend(rows: TrendCircleRow[]): TrendRow[] {
  const order: string[] = [];
  const totals = new Map<string, number>();
  for (const r of rows) {
    if (!totals.has(r.month)) order.push(r.month);
    totals.set(r.month, (totals.get(r.month) ?? 0) + r.volume);
  }
  return order.map((m) => ({ m, n: totals.get(m) ?? 0 }));
}

function DataState({ loading, empty, label }: { loading: boolean; empty: boolean; label: string }) {
  if (!loading && !empty) return null;
  return (
    <div style={{ fontSize: 12, color: C.sage, padding: '24px 0', textAlign: 'center' }}>
      {loading ? 'Loading…' : `No ${label} available`}
    </div>
  );
}

export function LmcSection() {
  const { openDrill, persona, appliedFilters } = useMsafeDashboard();
  const [dailyMode, setDailyMode] = useState('line');
  const [funcMode, setFuncMode] = useState('donut');
  const [funcTab, setFuncTab] = useState<'function' | 'circle'>('function');
  const [trendMode, setTrendMode] = useState('line');
  const [dailyData, setDailyData] = useState<DailyRow[]>([]);
  const [dailyCircleData, setDailyCircleData] = useState<DailyCircleRow[]>([]);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [weekData, setWeekData] = useState<WeekRow[]>([]);
  const [weekLoading, setWeekLoading] = useState(true);
  const [managerData, setManagerData] = useState<ManagerRow[]>([]);
  const [managerLoading, setManagerLoading] = useState(true);
  const [funcData, setFuncData] = useState<Slice[]>([]);
  const [funcLoading, setFuncLoading] = useState(true);
  const [statusData, setStatusData] = useState<WeekRow[]>([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [trendData, setTrendData] = useState<TrendRow[]>([]);
  const [trendCircleData, setTrendCircleData] = useState<TrendCircleRow[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setDailyLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeLmcJson(
          'daily_lmc_volume.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) {
          const circleRows = normalizeDailyVolumeByCircle(payload);
          setDailyCircleData(circleRows);
          setDailyData(normalizeDailyVolume(circleRows));
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe daily-lmc-volume API failed.', err);
      } finally {
        if (!controller.signal.aborted) setDailyLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setWeekLoading(true);
    (async () => {
      try {
        const filterParams = buildFilterParams(persona, appliedFilters);
        const payload = await fetchMsafeLmcJson(
          'lmc_weekly_completion.json',
          { from_date: filterParams.from_date ?? '', end_date: filterParams.to_date ?? '' },
          controller.signal,
        );
        if (!controller.signal.aborted) setWeekData(normalizeWeeklyCompletion(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe lmc-weekly-completion API failed.', err);
      } finally {
        if (!controller.signal.aborted) setWeekLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setManagerLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeLmcJson(
          'lmc_signoffs_by_manager.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setManagerData(normalizeManagers(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe lmc-signoffs-by-manager API failed.', err);
      } finally {
        if (!controller.signal.aborted) setManagerLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setFuncLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeLmcJson(
          'lmc_signoffs_by_function.json',
          { type: funcTab, ...buildFilterParams(persona, appliedFilters) },
          controller.signal,
        );
        if (!controller.signal.aborted) setFuncData(normalizeByFunction(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe lmc-signoffs-by-function API failed.', err);
      } finally {
        if (!controller.signal.aborted) setFuncLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona, funcTab]);

  useEffect(() => {
    const controller = new AbortController();
    setStatusLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeLmcJson(
          'lmc_status.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setStatusData(normalizeLmcStatus(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe lmc-status API failed.', err);
      } finally {
        if (!controller.signal.aborted) setStatusLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setTrendLoading(true);
    (async () => {
      try {
        // This card is a fixed trailing-12-months view, not scoped to whatever date
        // range is currently applied elsewhere — sending from_date/to_date here would
        // clip it down to just the applied range (e.g. only 1-2 months), contradicting
        // its own "Last 12 Months" title. Drop the date range, keep every other filter.
        const { from_date, to_date, ...trendParams } = buildFilterParams(persona, appliedFilters);
        const payload = await fetchMsafeLmcJson(
          'monthly_lmc_signoff_volume.json',
          trendParams,
          controller.signal,
        );
        const circleRows = normalizeMonthlyTrendByCircle(payload);
        if (!controller.signal.aborted) {
          setTrendCircleData(circleRows);
          setTrendData(normalizeMonthlyTrend(circleRows));
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe monthly-lmc-signoff-volume API failed.', err);
      } finally {
        if (!controller.signal.aborted) setTrendLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  // "Daily LMC Volume" chart points are totals summed across every circle for
  // that date — this looks up the per-circle breakdown for the hovered date so
  // the tooltip can list each circle's sign-off count, not just the day total.
  const renderDailyVolumeTooltip = ({ active, label }: { active?: boolean; label?: string }) => {
    if (!active || !label) return null;
    const circleRows = dailyCircleData.filter((r) => r.date === label);
    const total = circleRows.reduce((sum, r) => sum + r.volume, 0);
    return (
      <div className="msafe-chart-tip">
        <div className="msafe-chart-tip-title">{label}</div>
        {circleRows.map((r) => (
          <div key={r.circle} className="msafe-chart-tip-row">
            <span className="msafe-chart-tip-sw" style={{ background: C.vi }} />
            <span>
              {r.circle}: {r.volume.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
        <div className="msafe-chart-tip-row" style={{ fontWeight: 600 }}>
          <span>Total: {total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    );
  };

  // "LMC Completion Trend" points are totals summed across every circle for that
  // month — this looks up the per-circle breakdown for the hovered month so the
  // tooltip can list each circle's sign-off volume, not just the month total.
  const renderTrendTooltip = ({ active, label }: { active?: boolean; label?: string }) => {
    if (!active || !label) return null;
    const circleRows = trendCircleData.filter((r) => r.month === label);
    const total = circleRows.reduce((sum, r) => sum + r.volume, 0);
    return (
      <div className="msafe-chart-tip">
        <div className="msafe-chart-tip-title">{label}</div>
        {circleRows.map((r) => (
          <div key={r.circle} className="msafe-chart-tip-row">
            <span className="msafe-chart-tip-sw" style={{ background: C.sage }} />
            <span>
              {r.circle}: {r.volume.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
        <div className="msafe-chart-tip-row" style={{ fontWeight: 600 }}>
          <span>Total: {total.toLocaleString('en-IN')}</span>
        </div>
      </div>
    );
  };

  return (
    <AccordionShell
      title="LMC — Line Manager Check Activity"
      sub="Daily sign-off volume and manager engagement"
      excelLabel="LMC"
    >
      <ChartCard
        title="Daily LMC Volume — Last 30 Days"
        sub="Number of LMC sign-offs recorded per day"
        infoKey="lmc-daily"
        showPdf
        pdfLabel="Daily LMC Volume"
        exportData={dailyCircleData.map((r) => ({ Date: r.date, Circle: r.circle, 'LMC Sign-offs': r.volume }))}
        chartSwitch={<ChartSwitch modes={['line', 'bar', 'table']} value={dailyMode} onChange={setDailyMode} />}
      >
        {dailyLoading || dailyData.length === 0 ? (
          <DataState loading={dailyLoading} empty={dailyData.length === 0} label="daily volume data" />
        ) : dailyMode === 'table' ? (
          <div className="tbl-scroll" style={{ maxHeight: 420, overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Circle</th>
                  <th>LMC Sign-offs</th>
                </tr>
              </thead>
              <tbody>
                {dailyCircleData.map((r, idx) => (
                  <tr key={`${r.date}-${r.circle}-${idx}`}>
                    <td className="cell-strong">{r.date}</td>
                    <td>{r.circle}</td>
                    <td>{r.volume.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: Math.max(700, dailyData.length * 26) }}>
              <ResponsiveContainer width="100%" height={380}>
                {dailyMode === 'line' ? (
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <XAxis dataKey="d" tick={{ fontSize: 8, fill: C.sage }} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                    <Tooltip content={renderDailyVolumeTooltip} />
                    <Area
                      type="monotone"
                      dataKey="n"
                      stroke={C.vi}
                      fill="rgba(238,39,55,.10)"
                      strokeWidth={2.5}
                      name="LMC Sign-offs"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <XAxis dataKey="d" tick={{ fontSize: 8, fill: C.sage }} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                    <Tooltip content={renderDailyVolumeTooltip} />
                    <Bar dataKey="n" fill={C.vi} radius={[5, 5, 0, 0]} name="LMC Sign-offs" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </ChartCard>

      <div className="g g3" style={{ marginTop: 16, alignItems: 'start' }}>
        <ChartCard title="Top LMC Managers — Last 30 Days" sub="Most active line managers" infoKey="lmc-managers">
          {managerLoading || managerData.length === 0 ? (
            <DataState loading={managerLoading} empty={managerData.length === 0} label="manager data" />
          ) : (
            <div style={{ minHeight: 420, maxHeight: 420, overflowY: 'auto' }}>
              <Leaderboard
                items={managerData.map((m) => ({
                  name: m.name,
                  meta: `${m.department} · ${m.circle}`,
                  value: m.count,
                  onClick: () => openDrill('user-detail', m.name),
                }))}
              />
            </div>
          )}
        </ChartCard>

        <ChartCard title="LMC Completion" sub="Daily target vs actual" infoKey="lmc-week">
          {weekLoading || weekData.length === 0 ? (
            <DataState loading={weekLoading} empty={weekData.length === 0} label="weekly completion data" />
          ) : (
            <div style={{ minHeight: 420, maxHeight: 420, overflowY: 'auto' }}>
              <ProgressRows rows={weekData} />
            </div>
          )}
        </ChartCard>

        <ChartCard title="LMC Status Breakdown" sub="All LMCs " infoKey="lmc-status">
          {statusLoading || statusData.length === 0 ? (
            <DataState loading={statusLoading} empty={statusData.length === 0} label="status data" />
          ) : (
            <div style={{ minHeight: 420 }}>
            <ProgressRows rows={statusData} />
            </div>
          )}
        </ChartCard>
      </div>

      {/* Full-width, not a 3-column grid slot — the Circle tab can have 20+ circles,
          which was getting squeezed into a third of the row's width and rendering badly. */}
      <ChartCard
        title={funcTab === 'circle' ? 'LMC by Circle' : 'LMC by Function'}
        sub={
          funcTab === 'circle'
            ? "Which circle's managers are most active"
            : "Which function's managers are most active"
        }
        infoKey="lmc-func"
        style={{ marginTop: 16 }}
        tag={<ChartSwitch modes={['function', 'circle']} value={funcTab} onChange={(v) => setFuncTab(v as 'function' | 'circle')} />}
        chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={funcMode} onChange={setFuncMode} />}
      >
        {funcLoading || funcData.length === 0 ? (
          <DataState loading={funcLoading} empty={funcData.length === 0} label="function data" />
        ) : (
          <>
            {funcMode === 'donut' && (
              <DonutChart
                data={funcData}
                height={Math.min(420, Math.max(220, Math.ceil(funcData.length / 2) * 26))}
              />
            )}
            {funcMode === 'bar' && (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: Math.max(700, funcData.length * 55) }}>
                  <SliceBarChart data={funcData} height={420} />
                </div>
              </div>
            )}
            {funcMode === 'table' && <ChartTable data={funcData} valueLabel="LMC %" />}
          </>
        )}
      </ChartCard>

      <ChartCard
        title="LMC Completion Trend — Last 12 Months"
        sub="Monthly LMC sign-off volume, long-term view"
        infoKey="lmc-trend-12mo"
        showPdf
        pdfLabel="LMC Completion Trend"
        exportData={trendData.map((d) => ({ Month: d.m, 'Sign-offs': d.n }))}
        style={{ marginTop: 16 }}
        chartSwitch={<ChartSwitch modes={['line', 'bar', 'table']} value={trendMode} onChange={setTrendMode} />}
      >
        {trendLoading || trendData.length === 0 ? (
          <DataState loading={trendLoading} empty={trendData.length === 0} label="trend data" />
        ) : trendMode === 'table' ? (
          <div className="chart-as-table">
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Sign-offs</th>
                </tr>
              </thead>
              <tbody>
                {trendData.map((r) => (
                  <tr key={r.m}>
                    <td>{r.m}</td>
                    <td className="num">{r.n.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              {trendMode === 'line' ? (
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip content={renderTrendTooltip} />
                  <Area
                    type="monotone"
                    dataKey="n"
                    stroke={C.sage}
                    fill="rgba(121,140,94,.10)"
                    strokeWidth={2.5}
                    name="LMC Sign-offs"
                  />
                </AreaChart>
              ) : (
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip content={renderTrendTooltip} />
                  <Bar dataKey="n" fill={C.sage} radius={[5, 5, 0, 0]} name="LMC Sign-offs" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </AccordionShell>
  );
}
