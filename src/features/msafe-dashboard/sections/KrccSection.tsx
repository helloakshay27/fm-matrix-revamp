import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { DonutChart, SideLegendDonut, SliceBarChart } from '../components/DonutChart';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import type { Persona } from '../data/constants';

type Slice = { name: string; value: number; color: string };
type CircleBar = { name: string; pct: number; totalUsers: number; approvedUsers: number; color: string };
type CircleDays = { name: string; days: number; color: string };
type AgingRow = { label: string; pct: number; val: string; color: string };

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

async function fetchMsafeKrccJson(
  endpoint: string,
  extraParams?: Record<string, string>,
  signal?: AbortSignal,
): Promise<unknown> {
  const token = localStorage.getItem('token') || '';
  const companyId =
    localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '';
  const params = new URLSearchParams({ company_id: companyId, ...extraParams });
  if (token) {
    params.set('access_token', token);
    params.set('token', token);
  }
  const url = `${getMsafeBaseUrl()}/msafe_krcc_dashboard/${endpoint}?${params.toString()}`;
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

const SLICE_PALETTE = [C.terra, C.ok, C.vi, C.warn, C.sage, C.blue, C.teal, C.lav, '#B4A38A'];

function colorForStatusName(name: string): string {
  const s = name.toLowerCase();
  if (/clear|complete|pass|approved/.test(s)) return C.ok;
  if (/pending|progress|initiated/.test(s)) return C.warn;
  if (/not.?started|fail|reject/.test(s)) return C.err;
  return C.sage;
}

const STATUS_FLAT_FIELDS: [string[], string][] = [
  [['approved', 'completed', 'cleared'], 'Approved'],
  [['pending'], 'Pending'],
  [['not_started'], 'Not Started'],
];

function normalizeStatus(payload: unknown): Slice[] {
  const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};

  const flatSlices = STATUS_FLAT_FIELDS.map(([keys, label]) => {
    const value = getNumber(record, keys);
    if (value === null) return null;
    return { name: label, value, color: colorForStatusName(label) };
  }).filter((item): item is Slice => Boolean(item));
  if (flatSlices.length > 0) return flatSlices;

  const list = unwrapList(payload, ['data', 'result', 'status', 'statuses']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const itemRecord = item as Record<string, unknown>;
      const name = getString(itemRecord, ['status', 'status_name', 'name', 'label', 'title']);
      if (!name) return null;
      const value = getNumber(itemRecord, ['count', 'value', 'total', 'users_count']);
      if (value === null) return null;
      return { name, value, color: colorForStatusName(name) };
    })
    .filter((item): item is Slice => Boolean(item));
}

function extractClearancePercentage(payload: unknown): string | null {
  const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const value = getNumber(record, ['approved_percentage', 'clearance_percentage', 'cleared_percentage']);
  return value === null ? null : `${value}%`;
}

function colorForAgingLabel(label: string): string {
  const nums = label.match(/\d+/g)?.map(Number) ?? [];
  const upper = nums.length ? Math.max(...nums) : 0;
  const isPlus = /\+/.test(label);
  if (isPlus || upper >= 15) return C.vi;
  if (upper >= 8) return C.warn;
  if (upper >= 4) return C.teal;
  return C.ok;
}

const AGING_FLAT_FIELDS: [string, string][] = [
  ['days_0_3', '0 – 3 days'],
  ['days_4_7', '4 – 7 days'],
  ['days_8_14', '8 – 14 days'],
  ['days_15_plus', '15+ days'],
];

const AGING_BUCKET_LABELS: Record<string, string> = {
  '0-3': '0 – 3 days',
  '4-7': '4 – 7 days',
  '8-14': '8 – 14 days',
};

// Youngest-to-oldest display order, regardless of the order the API happens
// to return buckets/records in.
const AGING_LABEL_ORDER = AGING_FLAT_FIELDS.map(([, label]) => label);
function agingSortRank(label: string): number {
  const idx = AGING_LABEL_ORDER.indexOf(label);
  return idx === -1 ? AGING_LABEL_ORDER.length : idx;
}

/** Turns a raw bucket key like "0-3" or "15+" into the same label style as
 *  AGING_FLAT_FIELDS, for buckets not already covered by that fixed list. */
function humanizeAgingBucket(bucket: string): string {
  if (AGING_BUCKET_LABELS[bucket]) return AGING_BUCKET_LABELS[bucket];
  const [lo, hi] = bucket.split('-');
  if (/\+/.test(bucket) || (lo && !hi && Number(lo) >= 15)) {
    return `${bucket.replace(/\+$/, '')}+ days`;
  }
  return hi ? `${lo} – ${hi} days` : `${bucket} days`;
}

function normalizeAging(payload: unknown): AgingRow[] {
  const root = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const flatSource =
    root.data && typeof root.data === 'object' && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root;

  const flatRows = AGING_FLAT_FIELDS.map(([key, label]) => {
    const count = getNumber(flatSource, [key]);
    if (count === null) return null;
    return { label, count, explicitPct: null as number | null, color: colorForAgingLabel(label) };
  }).filter((item): item is { label: string; count: number; explicitPct: number | null; color: string } =>
    Boolean(item),
  );

  const bucketRows =
    flatRows.length > 0
      ? []
      : unwrapList(payload, ['data', 'result', 'buckets', 'aging', 'ranges'])
        .map((item) => {
          if (!item || typeof item !== 'object') return null;
          const record = item as Record<string, unknown>;
          // Raw bucket keys ("15+", "0-3") need humanizing into a display label;
          // an already human-formatted label/name (older shape) is used as-is.
          const rawBucket = getString(record, ['ageing_bucket', 'aging_bucket', 'bucket', 'range', 'age_range']);
          const plainLabel = getString(record, ['label', 'name']);
          const label = rawBucket ? humanizeAgingBucket(rawBucket) : plainLabel;
          if (!label) return null;
          const count = getNumber(record, ['pending_krcc_count', 'count', 'value', 'total', 'users_count']);
          if (count === null) return null;
          const explicitPct = getNumber(record, ['pct', 'percentage', 'percent']);
          return { label, count, explicitPct, color: colorForAgingLabel(label) };
        })
        .filter(
          (item): item is { label: string; count: number; explicitPct: number | null; color: string } =>
            Boolean(item),
        );

  // The response can also be one row per pending KRCC record — { krcc_id, aging_bucket, ... } —
  // rather than pre-aggregated counts, so tally how many records fall into each aging_bucket.
  let recordRows: { label: string; count: number; explicitPct: number | null; color: string }[] = [];
  if (flatRows.length === 0 && bucketRows.length === 0) {
    const records = unwrapList(payload, ['data', 'result', 'records']);
    const order: string[] = [];
    const totals = new Map<string, number>();
    for (const item of records) {
      if (!item || typeof item !== 'object') continue;
      const bucket = getString(item as Record<string, unknown>, ['aging_bucket']);
      if (!bucket) continue;
      if (!totals.has(bucket)) order.push(bucket);
      totals.set(bucket, (totals.get(bucket) ?? 0) + 1);
    }
    recordRows = order.map((bucket) => {
      const label = humanizeAgingBucket(bucket);
      return { label, count: totals.get(bucket) ?? 0, explicitPct: null, color: colorForAgingLabel(label) };
    });
  }

  const rows = (flatRows.length > 0 ? flatRows : bucketRows.length > 0 ? bucketRows : recordRows)
    .slice()
    .sort((a, b) => agingSortRank(a.label) - agingSortRank(b.label));

  const maxCount = Math.max(1, ...rows.map((r) => r.count));
  return rows.map((r) => ({
    label: r.label,
    val: r.count.toLocaleString('en-IN'),
    pct: r.explicitPct ?? Math.round((r.count / maxCount) * 100),
    color: r.color,
  }));
}

// Carries approved_percentage directly on each pie slice (rather than in a
// separate parallel array cross-referenced by category name) so the hover
// tooltip can read it straight off the exact slice being hovered — immune to
// any category-name mismatch between two independently-built arrays.
type CategorySlice = Slice & { approvedPercentage: number | null };

function normalizeCategory(payload: unknown): CategorySlice[] {
  const list = unwrapList(payload, ['data', 'result', 'categories']);
  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['category_name', 'category', 'name', 'label', 'title']);
      if (!name) return null;
      const value = getNumber(record, ['approved', 'count', 'value', 'total', 'cleared_count']);
      if (value === null) return null;
      const approvedPercentage = getNumber(record, ['approved_percentage', 'approved_pct']);
      return { name, value, color: SLICE_PALETTE[index % SLICE_PALETTE.length], approvedPercentage };
    })
    .filter((item): item is CategorySlice => Boolean(item));
}

function colorForTurnaroundDays(days: number): string {
  if (days <= 4) return C.ok;
  if (days <= 5) return C.teal;
  if (days <= 7) return C.warn;
  return C.vi;
}

function normalizeTurnaround(payload: unknown): CircleDays[] {
  const list = unwrapList(payload, ['data', 'result', 'circles']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['circle_name', 'circle', 'name', 'label']);
      if (!name) return null;
      const days = getNumber(record, ['avg_days', 'days', 'turnaround_days', 'avg_turnaround']);
      if (days === null) return null;
      return { name, days, color: colorForTurnaroundDays(days) };
    })
    .filter((item): item is CircleDays => Boolean(item));
}

// RAG thresholds standardized across the dashboard: Green >=98%, Amber 95-98%, Red <95%.
function colorForClearancePct(pct: number): string {
  if (pct >= 98) return C.ok;
  if (pct >= 95) return C.warn;
  return C.err;
}

function normalizeClearanceByCircle(payload: unknown): CircleBar[] {
  const list = unwrapList(payload, ['data', 'result', 'circles']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['circle_name', 'circle', 'name', 'label']);
      if (!name) return null;
      const rawPct = getNumber(record, ['clearance_percentage', 'approved_percentage', 'cleared_percentage', 'percentage', 'pct']);
      if (rawPct === null) return null;
      // Defensively clamp to 0–100 — a single out-of-range value (bad data upstream)
      // would otherwise blow out the chart's Y-axis scale and shrink every other bar.
      const pct = Math.min(100, Math.max(0, rawPct));
      const totalUsers = getNumber(record, ['total_users', 'total']) ?? 0;
      const approvedUsers = getNumber(record, ['approved_users', 'approved']) ?? 0;
      return { name, pct, totalUsers, approvedUsers, color: colorForClearancePct(pct) };
    })
    .filter((item): item is CircleBar => Boolean(item));
}

function warnIfEmpty(endpoint: string, normalized: unknown[], payload: unknown): void {
  if (normalized.length === 0) {
    console.warn(
      `M-Safe ${endpoint} returned no usable rows — check the raw response shape below and update the normalizer's field candidates if needed.`,
      payload,
    );
  }
}

function DataState({ loading, empty, label }: { loading: boolean; empty: boolean; label: string }) {
  if (!loading && !empty) return null;
  return (
    <div style={{ fontSize: 12, color: C.sage, padding: '24px 0', textAlign: 'center' }}>
      {loading ? 'Loading…' : `No ${label} available`}
    </div>
  );
}

export function KrccSection() {
  const { openDrill, persona, appliedFilters } = useMsafeDashboard();
  const [statusMode, setStatusMode] = useState('donut');
  const [catMode, setCatMode] = useState('donut');
  const [tatMode, setTatMode] = useState('bar');

  const [statusData, setStatusData] = useState<Slice[]>([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [apiClearedPct, setApiClearedPct] = useState<string | null>(null);
  const [agingData, setAgingData] = useState<AgingRow[]>([]);
  const [agingLoading, setAgingLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<CategorySlice[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [turnaroundData, setTurnaroundData] = useState<CircleDays[]>([]);
  const [turnaroundLoading, setTurnaroundLoading] = useState(true);
  const [circlePctData, setCirclePctData] = useState<CircleBar[]>([]);
  const [circlePctLoading, setCirclePctLoading] = useState(true);

  // "KRCC Clearance Status" card hidden per request — API call disabled too.
  // useEffect(() => {
  //   const controller = new AbortController();
  //   setStatusLoading(true);
  //   (async () => {
  //     try {
  //       const payload = await fetchMsafeKrccJson(
  //         'krcc_clearance_status.json',
  //         buildFilterParams(persona, appliedFilters),
  //         controller.signal,
  //       );
  //       const normalized = normalizeStatus(payload);
  //       warnIfEmpty('krcc_clearance_status.json', normalized, payload);
  //       if (!controller.signal.aborted) {
  //         setStatusData(normalized);
  //         setApiClearedPct(extractClearancePercentage(payload));
  //       }
  //     } catch (err) {
  //       if ((err as Error).name !== 'AbortError') console.warn('M-Safe krcc-clearance-status API failed.', err);
  //     } finally {
  //       if (!controller.signal.aborted) setStatusLoading(false);
  //     }
  //   })();
  //   return () => controller.abort();
  // }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setAgingLoading(true);
    (async () => {
      try {
        // This is a snapshot of how long currently-pending KRCCs have been waiting
        // as of today (each record's aging_days is computed against "today_date"),
        // not a historical view scoped to an arbitrary range — sending from_date/
        // to_date here would misleadingly imply the applied date filter changes it.
        // Drop the date range, keep every other filter.
        const { from_date, to_date, ...agingParams } = buildFilterParams(persona, appliedFilters);
        const payload = await fetchMsafeKrccJson('krcc_pending_aging.json', agingParams, controller.signal);
        const normalized = normalizeAging(payload);
        warnIfEmpty('krcc_pending_aging.json', normalized, payload);
        if (!controller.signal.aborted) setAgingData(normalized);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe krcc-pending-aging API failed.', err);
      } finally {
        if (!controller.signal.aborted) setAgingLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setCategoryLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeKrccJson(
          'krcc_cleared_by_category.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        const normalized = normalizeCategory(payload);
        warnIfEmpty('krcc_cleared_by_category.json', normalized, payload);
        if (!controller.signal.aborted) setCategoryData(normalized);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe krcc-cleared-by-category API failed.', err);
      } finally {
        if (!controller.signal.aborted) setCategoryLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  // KRCC Turnaround Time by Circle chart is hidden (see JSX below) — API call commented out
  // so it's not fetched.
  // useEffect(() => {
  //   const controller = new AbortController();
  //   setTurnaroundLoading(true);
  //   (async () => {
  //     try {
  //       const payload = await fetchMsafeKrccJson(
  //         'krcc_turnaround_time_by_circle.json',
  //         buildFilterParams(persona, appliedFilters),
  //         controller.signal,
  //       );
  //       const normalized = normalizeTurnaround(payload);
  //       warnIfEmpty('krcc_turnaround_time_by_circle.json', normalized, payload);
  //       if (!controller.signal.aborted) setTurnaroundData(normalized);
  //     } catch (err) {
  //       if ((err as Error).name !== 'AbortError') console.warn('M-Safe krcc-turnaround-time API failed.', err);
  //     } finally {
  //       if (!controller.signal.aborted) setTurnaroundLoading(false);
  //     }
  //   })();
  //   return () => controller.abort();
  // }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setCirclePctLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeKrccJson(
          'krcc_cleared_user_percentage_by_circle.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        const normalized = normalizeClearanceByCircle(payload);
        warnIfEmpty('krcc_cleared_user_percentage_by_circle.json', normalized, payload);
        if (!controller.signal.aborted) setCirclePctData(normalized);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe krcc-cleared-user-percentage API failed.', err);
      } finally {
        if (!controller.signal.aborted) setCirclePctLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  const totalStatus = statusData.reduce((sum, s) => sum + s.value, 0);
  const clearedStatus = statusData.find((s) => /clear|complete|approved/i.test(s.name))?.value ?? 0;
  const clearedPct =
    apiClearedPct ?? (totalStatus > 0 ? `${((clearedStatus / totalStatus) * 100).toFixed(1)}%` : '—');

  // Reads approvedPercentage directly off the hovered slice's own data (attached
  // by normalizeCategory) instead of cross-referencing a second array by name —
  // guaranteed correct even if two categories ever share the same display name.
  const renderCategoryTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;
    const slice = payload[0]?.payload as CategorySlice | undefined;
    if (!slice) return null;
    return (
      <div className="msafe-chart-tip">
        <div className="msafe-chart-tip-title">{slice.name}</div>
        <div className="msafe-chart-tip-row">
          <span className="msafe-chart-tip-sw" style={{ background: C.ok }} />
          <span>
            Approved : {slice.value.toLocaleString('en-IN')}
            {slice.approvedPercentage !== null ? ` (${slice.approvedPercentage}%)` : ''}
          </span>
        </div>
      </div>
    );
  };

  const renderClearanceTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;
    const circle = payload[0]?.payload as CircleBar | undefined;
    if (!circle) return null;

    return (
      <div className="msafe-chart-tip">
        <div className="msafe-chart-tip-title">{circle.name}</div>
        <div className="msafe-chart-tip-row">
          <span>Approved Users: {circle.approvedUsers.toLocaleString('en-IN')}</span>
        </div>
        <div className="msafe-chart-tip-row">
          <span>Total Users: {circle.totalUsers.toLocaleString('en-IN')}</span>
        </div>
        <div className="msafe-chart-tip-row">
          <span>Clearance Percentage: {circle.pct.toFixed(2)}%</span>
        </div>
      </div>
    );
  };

  return (
    <AccordionShell
      title="KRCC — Key Risk Compliance Check"
      sub="Status, ageing, and where clearance is falling behind"
      excelLabel="KRCC"
    >
      {/* "KRCC Clearance Status" card hidden per request — API call disabled too. */}
      <div className="g g2" style={{ alignItems: 'start' }}>
        <ChartCard
          title="KRCC Ageing — Pending Requests"
          sub="How long pending KRCCs have been waiting · always as of today, not affected by the date filter"
          infoKey="krcc-ageing"
          showPdf
          pdfLabel="KRCC Ageing - Pending Requests"
          reportExportFor="krcc_pending"
          reportExcludeDateRange
          exportData={agingData.map((d) => ({ 'Ageing Bucket': d.label, Value: d.val }))}
        >
          {agingLoading || agingData.length === 0 ? (
            <DataState loading={agingLoading} empty={agingData.length === 0} label="aging data" />
          ) : (
            <div style={{ minHeight: 220 }}>
              <ProgressRows rows={agingData} />
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="KRCC Cleared by Category"
          sub="Which check category makes up cleared KRCCs"
          infoKey="krcc-category"
          showPdf
          pdfLabel="KRCC by Category"
          reportPath="msafe_dashboard_report/krcc_cleared_by_category"
          exportData={categoryData.map((d) => ({
            Category: d.name,
            Approved: d.value,
            'Approved %': d.approvedPercentage,
          }))}
          chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={catMode} onChange={setCatMode} />}
        >
          {categoryLoading || categoryData.length === 0 ? (
            <DataState loading={categoryLoading} empty={categoryData.length === 0} label="category data" />
          ) : (
            <>
              {catMode === 'donut' && <DonutChart data={categoryData} tooltipContent={renderCategoryTooltip} />}
              {catMode === 'bar' && <SliceBarChart data={categoryData} tooltipContent={renderCategoryTooltip} />}
              {catMode === 'table' && (
                <div className="chart-as-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Approved</th>
                        <th>Approved %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryData.map((d) => (
                        <tr key={d.name}>
                          <td>{d.name}</td>
                          <td>{d.value.toLocaleString('en-IN')}</td>
                          <td>{d.approvedPercentage !== null ? `${d.approvedPercentage}%` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </ChartCard>
      </div>

      <ChartCard
        title="KRCC Clearance % by Circle"
        sub="Green ≥98% · Amber 95–<98% · Red <95%"
        infoKey="krcc-circle"
        showPdf
        pdfLabel="KRCC by Circle"
        reportExportFor="circle_clearance"
        exportData={circlePctData.map((d) => ({
          Circle: d.name,
          'Approved Users': d.approvedUsers,
          'Total Users': d.totalUsers,
          'Clearance %': d.pct,
        }))}
        style={{ marginTop: 16 }}
      >
        {circlePctLoading || circlePctData.length === 0 ? (
          <DataState loading={circlePctLoading} empty={circlePctData.length === 0} label="circle data" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: Math.max(700, circlePctData.length * 55) }}>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={circlePctData} margin={{ top: 20, right: 16, left: 0, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={90}
                    tick={{ fontSize: 10, fill: C.sage }}
                  />
                  <YAxis domain={[0, 100]} allowDataOverflow tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip content={renderClearanceTooltip} />
                  <Bar dataKey="pct" name="Clearance %" radius={[5, 5, 0, 0]}>
                    {circlePctData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                    <LabelList
                      dataKey="pct"
                      position="top"
                      style={{ fontSize: 10, fill: C.dark, fontWeight: 600 }}
                      formatter={(v: number) => `${v}%`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </ChartCard>

      {/* KRCC Turnaround Time by Circle hidden — kept for reference, API call above is also commented out.
      <ChartCard
        title="KRCC Turnaround Time by Circle"
        sub="Avg calendar days from initiation to clearance"
        infoKey="krcc-turnaround"
        showPdf
        pdfLabel="KRCC Turnaround"
        exportData={turnaroundData.map((d) => ({ Circle: d.name, 'Avg Days to Clear': d.days }))}
        style={{ marginTop: 16 }}
        chartSwitch={<ChartSwitch modes={['bar', 'table']} value={tatMode} onChange={setTatMode} />}
      >
        {turnaroundLoading || turnaroundData.length === 0 ? (
          <DataState loading={turnaroundLoading} empty={turnaroundData.length === 0} label="turnaround data" />
        ) : tatMode === 'table' ? (
          <div className="chart-as-table">
            <table>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Avg Days to Clear</th>
                </tr>
              </thead>
              <tbody>
                {turnaroundData.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ maxHeight: 560, overflowY: 'auto' }}>
            <ResponsiveContainer width="100%" height={Math.max(320, turnaroundData.length * 24)}>
              <BarChart
                data={turnaroundData}
                layout="vertical"
                margin={{ top: 4, right: 32, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                <XAxis type="number" tick={{ fontSize: 10, fill: C.sage }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={150}
                  interval={0}
                  tick={{ fontSize: 10, fill: C.sage }}
                />
                <Tooltip
                  contentStyle={{
                    background: C.dark,
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 11,
                    color: '#fff',
                  }}
                  formatter={(value) => [`${value} days`, 'Avg Days to Clear']}
                />
                <Bar dataKey="days" radius={[0, 5, 5, 0]} name="Avg Days to Clear">
                  {turnaroundData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                  <LabelList
                    dataKey="days"
                    position="right"
                    style={{ fontSize: 10, fill: C.dark, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
      */}
    </AccordionShell>
  );
}
