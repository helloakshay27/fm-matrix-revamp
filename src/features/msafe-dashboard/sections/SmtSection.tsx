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
import { DonutChart } from '../components/DonutChart';
import { MsafeChartTooltip } from '../components/MsafeChartTooltip';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import type { Persona } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';

type CircleRow = { name: string; n: number };
type Slice = { name: string; value: number; color: string };
type RecentVisit = { name: string; func: string; circle: string; area: string; date: string };
type ProgressRow = { label: string; pct: number; val: string; color: string };

const SLICE_PALETTE = [C.sage, C.terra, C.blue, C.teal, C.warn, C.lav, C.err, C.ok, '#B4A38A'];

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

async function fetchMsafeSmtJson(
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
  const url = `${getMsafeBaseUrl()}/msafe_smt_visit_dashboard/${endpoint}?${params.toString()}`;
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

function normalizeVisitsPerCircle(payload: unknown): CircleRow[] {
  const list = unwrapList(payload, ['data', 'result', 'circles']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['circle_name', 'circle', 'name', 'label']);
      if (!name) return null;
      const n = getNumber(record, ['total_visits', 'count', 'value', 'n', 'total', 'visits']);
      if (n === null) return null;
      return { name, n };
    })
    .filter((item): item is CircleRow => Boolean(item));
}

function normalizeVisitsPerDepartment(payload: unknown): Slice[] {
  const list = unwrapList(payload, ['data', 'result', 'departments', 'functions']);
  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, [
        'department_name',
        'department',
        'function_name',
        'function',
        'name',
        'label',
      ]);
      if (!name) return null;
      const value = getNumber(record, ['total_visits', 'count', 'value', 'total', 'visits']);
      if (value === null) return null;
      return { name, value, color: SLICE_PALETTE[index % SLICE_PALETTE.length] };
    })
    .filter((item): item is Slice => Boolean(item));
}

function formatDateDMY(raw: string): string {
  if (!raw || raw === '—') return raw;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${parsed.getFullYear()}`;
}

function normalizeRecentVisits(payload: unknown): RecentVisit[] {
  const list = unwrapList(payload, ['data', 'result', 'visits', 'records']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['done_by', 'user_name', 'employee_name', 'name']);
      if (!name) return null;
      const func = getString(record, ['function_name', 'function', 'func', 'department']) ?? '—';
      const circle = getString(record, ['circle_name', 'circle']) ?? '—';
      const area = getString(record, ['area_visited', 'area', 'location', 'site']) ?? '—';
      const date = formatDateDMY(getString(record, ['visit_date', 'date', 'created_at']) ?? '—');
      return { name, func, circle, area, date };
    })
    .filter((item): item is RecentVisit => Boolean(item));
}

// RAG thresholds standardized across the dashboard: Green >=98%, Amber 95-98%, Red <95%.
function colorForVisitProgressPct(pct: number): string {
  if (pct >= 98) return C.ok;
  if (pct >= 95) return C.warn;
  return C.err;
}

function normalizeVisitProgress(payload: unknown): ProgressRow[] {
  const list = unwrapList(payload, ['data', 'result', 'circles']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const label = getString(record, ['circle_name', 'circle', 'name', 'label']);
      if (!label) return null;

      const progressStr = getString(record, ['visit_progress', 'progress']);
      const match = progressStr?.match(/(\d+)\s*\/\s*(\d+)/);
      if (match) {
        const visits = Number(match[1]);
        const target = Number(match[2]);
        const pct = target > 0 ? Math.round((visits / target) * 100) : 0;
        return { label, pct, val: `${visits}/${target}`, color: colorForVisitProgressPct(pct) };
      }

      const visits = getNumber(record, ['visits', 'count', 'value', 'completed']);
      if (visits === null) return null;
      const target = getNumber(record, ['target', 'target_visits', 'goal']) ?? 20;
      const explicitPct = getNumber(record, ['pct', 'percentage', 'percent']);
      const pct = explicitPct ?? Math.round((visits / target) * 100);
      return { label, pct, val: `${visits}/${target}`, color: colorForVisitProgressPct(pct) };
    })
    .filter((item): item is ProgressRow => Boolean(item));
}

function colorForFrequencyLabel(label: string): string {
  const nums = label.match(/\d+/g)?.map(Number) ?? [];
  const lower = nums.length ? Math.min(...nums) : 0;
  const isPlus = /\+/.test(label);
  if (isPlus || lower >= 7) return C.ok;
  if (lower >= 4) return C.teal;
  if (lower >= 2) return C.warn;
  return C.vi;
}

function normalizeVisitFrequency(payload: unknown): ProgressRow[] {
  const list = unwrapList(payload, ['data', 'result', 'buckets', 'frequency']);
  const rows = list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const label = getString(record, ['visit_frequency', 'bucket', 'frequency_range', 'range', 'label', 'name']);
      if (!label) return null;
      const count = getNumber(record, ['total_sites', 'count', 'value', 'val', 'total', 'sites']);
      if (count === null) return null;
      const explicitPct = getNumber(record, ['pct', 'percentage', 'percent']);
      return { label, count, explicitPct, color: colorForFrequencyLabel(label) };
    })
    .filter(
      (item): item is { label: string; count: number; explicitPct: number | null; color: string } =>
        Boolean(item),
    );

  const maxCount = Math.max(1, ...rows.map((r) => r.count));
  return rows.map((r) => ({
    label: r.label,
    val: r.count.toLocaleString('en-IN'),
    pct: r.explicitPct ?? Math.round((r.count / maxCount) * 100),
    color: r.color,
  }));
}

// Raw per-record shape: one row per (circle, role) record as returned by the
// API, carrying its own monthly_data array — kept separate from the grouped
// chart rows so duplicate (circle_id, role_id) records can be summed
// month-by-month before the chart ever sees them. circleId/roleId are the
// true uniqueness keys — circle/role are just the display names, which can
// coincidentally repeat across different circles/roles.
type RawRoleMonthlyRecord = {
  circleId: string;
  circle: string;
  roleId: string;
  role: string;
  monthly: { month: string; visits: number }[];
};

function normalizeSmtRoleWiseRaw(payload: unknown): RawRoleMonthlyRecord[] {
  const circles = unwrapList(payload, ['data', 'result']);
  const rows: RawRoleMonthlyRecord[] = [];

  for (const circleItem of circles) {
    if (!circleItem || typeof circleItem !== 'object') continue;
    const circleRecord = circleItem as Record<string, unknown>;
    const circle = getString(circleRecord, ['circle_name', 'circle']) ?? '—';
    const circleIdNum = getNumber(circleRecord, ['circle_id']);
    const circleId = circleIdNum !== null ? String(circleIdNum) : circle;
    const records = circleRecord.records;
    if (!Array.isArray(records)) continue;

    for (const item of records) {
      if (!item || typeof item !== 'object') continue;
      const record = item as Record<string, unknown>;
      const role = getString(record, ['role_name']);
      if (!role) continue;
      const roleIdNum = getNumber(record, ['role_id']);
      const roleId = roleIdNum !== null ? String(roleIdNum) : role;
      const monthlyData = record.monthly_data;
      if (!Array.isArray(monthlyData)) continue;

      const monthly: { month: string; visits: number }[] = [];
      for (const entry of monthlyData) {
        if (!entry || typeof entry !== 'object') continue;
        const monthRecord = entry as Record<string, unknown>;
        const month = getString(monthRecord, ['month']);
        const visits = getNumber(monthRecord, ['smt_visits', 'visits', 'count']);
        if (!month || visits === null) continue;
        monthly.push({ month, visits });
      }
      if (monthly.length > 0) rows.push({ circleId, circle, roleId, role, monthly });
    }
  }

  return rows;
}

// "Apr 2026" -> a comparable number (year * 12 + month index), so months sort
// chronologically regardless of what order the API returns them in.
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function monthSortKey(month: string): number {
  const [abbr, yearStr] = month.split(' ');
  const monthIndex = MONTH_ABBR.indexOf(abbr);
  const year = Number(yearStr);
  if (monthIndex === -1 || !Number.isFinite(year)) return Number.MAX_SAFE_INTEGER;
  return year * 12 + monthIndex;
}

type CircleOption = { id: string; name: string };
type RoleOption = { id: string; name: string };

// A single circle+role+month lookup, built once per API response — the chart
// then just reads out of it for whichever circle/month is currently
// selected, instead of re-deriving anything. Keying by circle_id + role_id
// (not names) means the same role_name under two different circles, or two
// different role_ids sharing a name, is never mixed up. `roles` carries every
// unique role_id seen across ALL circles, in a fixed order, so the X-axis
// stays identical (11 roles) no matter which circle is selected — a circle
// missing a given role simply has no lookup entry, which reads back as 0.
type RoleCircleMonthlyIndex = {
  circles: CircleOption[];
  roles: RoleOption[];
  months: string[];
  lookup: Map<string, number>; // key: `${circleId}||${roleId}||${month}`
};

const EMPTY_ROLE_INDEX: RoleCircleMonthlyIndex = { circles: [], roles: [], months: [], lookup: new Map() };

function buildRoleCircleMonthlyIndex(raw: RawRoleMonthlyRecord[]): RoleCircleMonthlyIndex {
  const circleOrder: string[] = [];
  const circleNames = new Map<string, string>();
  const roleOrder: string[] = [];
  const roleNames = new Map<string, string>();
  const monthSet = new Set<string>();
  const lookup = new Map<string, number>();

  for (const record of raw) {
    if (!circleNames.has(record.circleId)) {
      circleOrder.push(record.circleId);
      circleNames.set(record.circleId, record.circle);
    }
    if (!roleNames.has(record.roleId)) {
      roleOrder.push(record.roleId);
      roleNames.set(record.roleId, record.role);
    }
    for (const { month, visits } of record.monthly) {
      monthSet.add(month);
      const key = `${record.circleId}||${record.roleId}||${month}`;
      lookup.set(key, (lookup.get(key) ?? 0) + visits);
    }
  }

  return {
    circles: circleOrder.map((id) => ({ id, name: circleNames.get(id)! })),
    // Sort roles consistently, alphabetically by display name, so the X-axis
    // order never shuffles as the user navigates between circles.
    roles: [...roleOrder]
      .sort((a, b) => roleNames.get(a)!.localeCompare(roleNames.get(b)!))
      .map((id) => ({ id, name: roleNames.get(id)! })),
    months: Array.from(monthSet).sort((a, b) => monthSortKey(a) - monthSortKey(b)),
    lookup,
  };
}

function DataState({ loading, empty, label }: { loading: boolean; empty: boolean; label: string }) {
  if (!loading && !empty) return null;
  return (
    <div style={{ fontSize: 12, color: C.sage, padding: '24px 0', textAlign: 'center' }}>
      {loading ? 'Loading…' : `No ${label} available`}
    </div>
  );
}

export function SmtSection() {
  const { openDrill, persona, appliedFilters } = useMsafeDashboard();
  const [circleMode, setCircleMode] = useState('bar');
  const [circleData, setCircleData] = useState<CircleRow[]>([]);
  const [circleLoading, setCircleLoading] = useState(true);
  const [funcData, setFuncData] = useState<Slice[]>([]);
  const [funcLoading, setFuncLoading] = useState(true);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressRow[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [freqData, setFreqData] = useState<ProgressRow[]>([]);
  const [freqLoading, setFreqLoading] = useState(true);
  const [roleWiseMode, setRoleWiseMode] = useState('bar');
  const [roleIndex, setRoleIndex] = useState<RoleCircleMonthlyIndex>(EMPTY_ROLE_INDEX);
  const [selectedCircleIdx, setSelectedCircleIdx] = useState(0);
  const [roleWiseLoading, setRoleWiseLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setCircleLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson(
          'visits_per_circle.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setCircleData(normalizeVisitsPerCircle(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe visits-per-circle API failed.', err);
      } finally {
        if (!controller.signal.aborted) setCircleLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setFuncLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson(
          'visits_per_department.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setFuncData(normalizeVisitsPerDepartment(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe visits-per-department API failed.', err);
      } finally {
        if (!controller.signal.aborted) setFuncLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setRoleWiseLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson(
          'smt_monthly_role_wise.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) {
          const raw = normalizeSmtRoleWiseRaw(payload);
          const index = buildRoleCircleMonthlyIndex(raw);
          setRoleIndex(index);
          // Reset to the first circle whenever fresh data comes in (filters
          // changed) — mirrors "initially display the first circle".
          setSelectedCircleIdx(0);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe smt-monthly-role-wise API failed.', err);
      } finally {
        if (!controller.signal.aborted) setRoleWiseLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setRecentLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson(
          'recent_smt_visits.json',
          { ...buildFilterParams(persona, appliedFilters), type: 'department' },
          controller.signal,
        );
        if (!controller.signal.aborted) setRecentVisits(normalizeRecentVisits(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe recent-smt-visits API failed.', err);
      } finally {
        if (!controller.signal.aborted) setRecentLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  // "SMT Visit Progress by Circle" card hidden per request — API call disabled too.
  // useEffect(() => {
  //   const controller = new AbortController();
  //   setProgressLoading(true);
  //   (async () => {
  //     try {
  //       const payload = await fetchMsafeSmtJson(
  //         'smt_visit_progress_by_circle.json',
  //         buildFilterParams(persona, appliedFilters),
  //         controller.signal,
  //       );
  //       if (!controller.signal.aborted) setProgressData(normalizeVisitProgress(payload));
  //     } catch (err) {
  //       if ((err as Error).name !== 'AbortError') console.warn('M-Safe smt-visit-progress-by-circle API failed.', err);
  //     } finally {
  //       if (!controller.signal.aborted) setProgressLoading(false);
  //     }
  //   })();
  //   return () => controller.abort();
  // }, [appliedFilters, persona]);

  // "Visit Frequency" card hidden per request — API call disabled too.
  // useEffect(() => {
  //   const controller = new AbortController();
  //   setFreqLoading(true);
  //   (async () => {
  //     try {
  //       const payload = await fetchMsafeSmtJson(
  //         'visit_frequency.json',
  //         buildFilterParams(persona, appliedFilters),
  //         controller.signal,
  //       );
  //       if (!controller.signal.aborted) setFreqData(normalizeVisitFrequency(payload));
  //     } catch (err) {
  //       if ((err as Error).name !== 'AbortError') console.warn('M-Safe visit-frequency API failed.', err);
  //     } finally {
  //       if (!controller.signal.aborted) setFreqLoading(false);
  //     }
  //   })();
  //   return () => controller.abort();
  // }, [appliedFilters, persona]);

  // Derived from the lookup for whichever circle is currently selected — the
  // 11 roles never change. Each role is a SINGLE bar (value = that role's
  // visits summed across every month for this circle); the full month-by-
  // month breakdown is kept on the row (`monthly`) purely for the tooltip.
  const selectedCircle = roleIndex.circles[selectedCircleIdx];
  const roleChartRows = roleIndex.roles.map((role, index) => {
    const monthly = roleIndex.months.map((month) => ({
      month,
      visits: selectedCircle ? roleIndex.lookup.get(`${selectedCircle.id}||${role.id}||${month}`) ?? 0 : 0,
    }));
    return {
      name: role.name,
      value: monthly.reduce((sum, m) => sum + m.visits, 0),
      color: SLICE_PALETTE[index % SLICE_PALETTE.length],
      monthly,
    };
  });
  const canGoPrevCircle = selectedCircleIdx > 0;
  const canGoNextCircle = selectedCircleIdx < roleIndex.circles.length - 1;

  // Circle is fixed by the navigation above the chart; hovering a role's
  // single bar shows that role's full month-by-month breakdown (attached to
  // the row above) rather than just the bar's total.
  const renderRoleWiseTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;
    const row = payload[0]?.payload as (typeof roleChartRows)[number] | undefined;
    if (!row) return null;

    return (
      <div className="msafe-chart-tip" style={{ maxHeight: 320, overflowY: 'auto' }}>
        <div className="msafe-chart-tip-row">
          <span>Circle: {selectedCircle?.name ?? '—'}</span>
        </div>
        <div className="msafe-chart-tip-row">
          <span>Role: {row.name}</span>
        </div>
        <div className="msafe-chart-tip-row" style={{ fontWeight: 600, marginTop: 2 }}>
          <span>Total SMT Visits: {row.value.toLocaleString('en-IN')}</span>
        </div>
        {row.monthly.map((m) => (
          <div key={m.month} className="msafe-chart-tip-row">
            <span className="msafe-chart-tip-sw" style={{ background: row.color }} />
            <span>
              {m.month}: {m.visits.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AccordionShell
      title="SMT — Senior Management Tour Field Visits"
      sub="Field visit coverage across circles and functions"
      excelLabel="SMT Visits"
    >
      <ChartCard
        title="Visits per Circle "
        sub="Ranked by SMT field visit count"
        infoKey="smt-circle"
        showPdf
                showPdf
        pdfLabel="Visits per Circle"
        reportPath="msafe_dashboard_report/smt_details"
        exportData={circleData.map((d) => ({ Circle: d.name, Visits: d.n }))}
        chartSwitch={<ChartSwitch modes={['bar', 'table']} value={circleMode} onChange={setCircleMode} />}
      >
        {circleLoading || circleData.length === 0 ? (
          <DataState loading={circleLoading} empty={circleData.length === 0} label="circle visit data" />
        ) : circleMode === 'table' ? (
          <div className="chart-as-table" style={{ maxHeight: 420 }}>
            <table>
              <thead>
                <tr>
                  <th>Circle</th>
                  <th>Visits</th>
                </tr>
              </thead>
              <tbody>
                {circleData.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td className="num">{d.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ maxHeight: 560, overflowY: 'auto' }}>
            <ResponsiveContainer width="100%" height={Math.max(320, circleData.length * 22)}>
              <BarChart data={circleData} layout="vertical" margin={{ top: 4, right: 32, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                <XAxis type="number" tick={{ fontSize: 10, fill: C.sage }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={170}
                  interval={0}
                  tick={{ fontSize: 10, fill: C.sage }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(44,44,44,.04)' }}
                  content={(props) => <MsafeChartTooltip {...props} bodyLabel="Visits" />}
                />
                <Bar dataKey="n" fill={C.lav} radius={[0, 5, 5, 0]} name="Visits">
                  <LabelList dataKey="n" position="right" style={{ fontSize: 10, fill: C.dark, fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard
        title="SMT Visits – Role-wise Trend"
        sub="One circle at a time · same 11 roles on every screen · hover a bar for its full month-by-month breakdown"
        infoKey="smt-role-wise"
        showPdf
        pdfLabel="SMT Role-wise Trend"
        reportPath="msafe_dashboard_report/smt_summary"
        exportData={roleChartRows.map((row) => {
          const record: Record<string, unknown> = {
            Circle: selectedCircle?.name ?? '',
            Role: row.name,
            'Total SMT Visits': row.value,
          };
          row.monthly.forEach((m) => { record[m.month] = m.visits; });
          return record;
        })}
        style={{ marginTop: 16 }}
        chartSwitch={<ChartSwitch modes={['bar', 'table']} value={roleWiseMode} onChange={setRoleWiseMode} />}
      >
        {roleWiseLoading || roleIndex.circles.length === 0 ? (
          <DataState loading={roleWiseLoading} empty={roleIndex.circles.length === 0} label="role-wise visit data" />
        ) : (
          <>
            {/* Circle navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 10 }}>
              <button
                type="button"
                onClick={() => setSelectedCircleIdx((i) => Math.max(0, i - 1))}
                disabled={!canGoPrevCircle}
                style={{
                  border: `1px solid ${C.border}`,
                  background: canGoPrevCircle ? '#fff' : '#F2EEE4',
                  color: canGoPrevCircle ? C.terra : '#B9B2A0',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: canGoPrevCircle ? 'pointer' : 'not-allowed',
                }}
              >
                ← Previous
              </button>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.dark, minWidth: 160, textAlign: 'center' }}>
                {selectedCircle?.name ?? '—'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCircleIdx((i) => Math.min(roleIndex.circles.length - 1, i + 1))}
                disabled={!canGoNextCircle}
                style={{
                  border: `1px solid ${C.border}`,
                  background: canGoNextCircle ? '#fff' : '#F2EEE4',
                  color: canGoNextCircle ? C.terra : '#B9B2A0',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: canGoNextCircle ? 'pointer' : 'not-allowed',
                }}
              >
                Next →
              </button>
            </div>

            {roleWiseMode === 'table' ? (
              <div className="tbl-scroll" style={{ maxHeight: 420, overflowX: 'auto' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Total SMT Visits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleChartRows.map((row) => (
                      <tr key={row.name}>
                        <td className="cell-strong">{row.name}</td>
                        <td>{row.value.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: Math.max(700, roleChartRows.length * 90) }}>
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart data={roleChartRows} margin={{ top: 4, right: 16, left: 0, bottom: 110 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                      <XAxis
                        type="category"
                        dataKey="name"
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={130}
                        tick={{ fontSize: 10, fill: C.sage }}
                        label={{ value: 'Role', position: 'insideBottom', offset: -125, fontSize: 11, fill: C.dark }}
                      />
                      <YAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fontSize: 10, fill: C.sage }}
                        label={{ value: 'SMT Visits', angle: -90, position: 'insideLeft', fontSize: 11, fill: C.dark }}
                      />
                      <Tooltip content={renderRoleWiseTooltip} />
                      <Bar dataKey="value" name="SMT Visits" radius={[5, 5, 0, 0]}>
                        {roleChartRows.map((row) => (
                          <Cell key={row.name} fill={row.color} />
                        ))}
                        <LabelList dataKey="value" position="top" style={{ fontSize: 10, fill: C.dark, fontWeight: 600 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </ChartCard>

      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard
          title="SMT by Function"
          sub="Which functions are doing the visits"
          infoKey="smt-func"
          showPdf
          pdfLabel="SMT by Function"
          reportPath="msafe_dashboard_report/smt_details"
        >
          {funcLoading || funcData.length === 0 ? (
            <DataState loading={funcLoading} empty={funcData.length === 0} label="function visit data" />
          ) : (
            <DonutChart data={funcData} bodyLabel="Visits" height={Math.max(220, funcData.length * 26)} />
          )}
        </ChartCard>

        <ChartCard
          title="Recent SMT Visits"
          sub="Latest field verifications logged"
          infoKey="smt-recent"
          showPdf
          pdfLabel="Recent SMT Visits"
          exportData={recentVisits.map((s) => ({
            'Done By': s.name,
            Function: s.func,
            Circle: s.circle,
            'Area Visited': s.area,
            Date: s.date,
          }))}
          tag={<span className="card-tag">Last 20</span>}
        >
          {recentLoading || recentVisits.length === 0 ? (
            <DataState loading={recentLoading} empty={recentVisits.length === 0} label="recent visits" />
          ) : (
            <div className="tbl-scroll">
              <table className="tbl tbl--recent-visits">
                <thead>
                  <tr>
                    <th>Done By</th>
                    <th>Function</th>
                    <th>Circle</th>
                    <th>Area Visited</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVisits.map((s) => (
                    <tr
                      key={s.name + s.date}
                    // onClick={() => openDrill('smt-visit', s.name)}
                    >
                      <td className="cell-strong" title={s.name}>{s.name}</td>
                      <td title={s.func}>{s.func}</td>
                      <td title={s.circle}>{s.circle}</td>
                      <td title={s.area}>{s.area}</td>
                      <td>{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>

        {/* "Visit Frequency" and "SMT Visit Progress by Circle" cards hidden per
            request — see the commented-out fetch effects above for the disabled
            API calls. */}
      </div>
    </AccordionShell>
  );
}
