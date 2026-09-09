import { Fragment, useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { DonutChart } from '../components/DonutChart';
import { MsafeChartTooltip } from '../components/MsafeChartTooltip';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import type { Persona } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';

type ClusterRow = { name: string; n: number };
type Slice = { name: string; value: number; color: string };
type RecentVisit = { name: string; func: string; cluster: string; area: string; date: string };
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
  if (f.clusterIds.length > 0) params.cluster_id = f.clusterIds.join(',');
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

function normalizeVisitsPerCluster(payload: unknown): ClusterRow[] {
  const list = unwrapList(payload, ['data', 'result', 'clusters']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['cluster', 'cluster_name', 'circle_name', 'circle', 'name', 'label']);
      if (!name) return null;
      const n = getNumber(record, ['total_visits', 'count', 'value', 'n', 'total', 'visits']);
      if (n === null) return null;
      return { name, n };
    })
    .filter((item): item is ClusterRow => Boolean(item));
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
      const cluster = getString(record, ['cluster_name', 'cluster', 'circle_name', 'circle']) ?? '—';
      const area = getString(record, ['area_visited', 'area', 'location', 'site']) ?? '—';
      const date = formatDateDMY(getString(record, ['visit_date', 'date', 'created_at']) ?? '—');
      return { name, func, cluster, area, date };
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

// Raw per-record shape: one row per (cluster, role) record as returned by the
// API, carrying its own monthly_data array — kept separate from the grouped
// chart rows so duplicate (cluster_id, role_id) records can be summed
// month-by-month before the chart ever sees them. clusterId/roleId are the
// true uniqueness keys — cluster/role are just the display names, which can
// coincidentally repeat across different clusters/roles.
type RawRoleMonthlyRecord = {
  clusterId: string;
  cluster: string;
  roleId: string;
  role: string;
  monthly: { month: string; visits: number }[];
  /** API-reported total for this (cluster, role) — falls back to summing `monthly` if absent. */
  totalVisits: number;
};

function normalizeSmtRoleWiseRaw(payload: unknown): RawRoleMonthlyRecord[] {
  const clusters = unwrapList(payload, ['data', 'result']);
  const rows: RawRoleMonthlyRecord[] = [];

  for (const clusterItem of clusters) {
    if (!clusterItem || typeof clusterItem !== 'object') continue;
    const clusterRecord = clusterItem as Record<string, unknown>;
    const cluster = getString(clusterRecord, ['cluster_name', 'cluster', 'circle_name', 'circle']) ?? '—';
    const clusterIdNum = getNumber(clusterRecord, ['cluster_id', 'circle_id']);
    const clusterId = clusterIdNum !== null ? String(clusterIdNum) : cluster;
    const records = clusterRecord.records;
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
      if (monthly.length > 0) {
        const totalVisits =
          getNumber(record, ['total_smt_visits', 'total_visits', 'total']) ??
          monthly.reduce((sum, m) => sum + m.visits, 0);
        rows.push({ clusterId, cluster, roleId, role, monthly, totalVisits });
      }
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

type ClusterOption = { id: string; name: string };
type RoleOption = { id: string; name: string };

// A single cluster+role+month lookup, built once per API response — the chart
// then just reads out of it for whichever cluster/month is currently
// selected, instead of re-deriving anything. Keying by cluster_id + role_id
// (not names) means the same role_name under two different clusters, or two
// different role_ids sharing a name, is never mixed up. `roles` carries every
// unique role_id seen across ALL clusters, in a fixed order, so the X-axis
// stays identical (11 roles) no matter which cluster is selected — a cluster
// missing a given role simply has no lookup entry, which reads back as 0.
type RoleClusterMonthlyIndex = {
  clusters: ClusterOption[];
  roles: RoleOption[];
  months: string[];
  lookup: Map<string, number>; // key: `${clusterId}||${roleId}||${month}`
  totalLookup: Map<string, number>; // key: `${clusterId}||${roleId}`
};

const EMPTY_ROLE_INDEX: RoleClusterMonthlyIndex = {
  clusters: [],
  roles: [],
  months: [],
  lookup: new Map(),
  totalLookup: new Map(),
};

function buildRoleClusterMonthlyIndex(raw: RawRoleMonthlyRecord[]): RoleClusterMonthlyIndex {
  const clusterOrder: string[] = [];
  const clusterNames = new Map<string, string>();
  const roleOrder: string[] = [];
  const roleNames = new Map<string, string>();
  const monthSet = new Set<string>();
  const lookup = new Map<string, number>();
  const totalLookup = new Map<string, number>();

  for (const record of raw) {
    if (!clusterNames.has(record.clusterId)) {
      clusterOrder.push(record.clusterId);
      clusterNames.set(record.clusterId, record.cluster);
    }
    if (!roleNames.has(record.roleId)) {
      roleOrder.push(record.roleId);
      roleNames.set(record.roleId, record.role);
    }
    for (const { month, visits } of record.monthly) {
      monthSet.add(month);
      const key = `${record.clusterId}||${record.roleId}||${month}`;
      lookup.set(key, (lookup.get(key) ?? 0) + visits);
    }
    const totalKey = `${record.clusterId}||${record.roleId}`;
    totalLookup.set(totalKey, (totalLookup.get(totalKey) ?? 0) + record.totalVisits);
  }

  return {
    clusters: clusterOrder.map((id) => ({ id, name: clusterNames.get(id)! })),
    // Sort roles consistently, alphabetically by display name, so the X-axis
    // order never shuffles as the user navigates between clusters.
    roles: [...roleOrder]
      .sort((a, b) => roleNames.get(a)!.localeCompare(roleNames.get(b)!))
      .map((id) => ({ id, name: roleNames.get(id)! })),
    months: Array.from(monthSet).sort((a, b) => monthSortKey(a) - monthSortKey(b)),
    lookup,
    totalLookup,
  };
}

// Matches the reference bubble-matrix legend: 0 grey, 1-19 purple, 20-30 orange, 31+ red.
function colorForSmtCellCount(n: number): string {
  if (n <= 0) return '#B9B2A0';
  if (n <= 19) return C.lav;
  if (n <= 30) return C.warn;
  return C.err;
}

// Area-proportional (sqrt) bubble sizing so differences at the high end don't
// dwarf everything else — a flat/linear scale would make small counts invisible.
function smtBubbleRadius(count: number, maxCount: number): number {
  if (count <= 0) return 8;
  const minR = 12;
  const maxR = 22;
  if (maxCount <= 0) return minR;
  return minR + Math.sqrt(count / maxCount) * (maxR - minR);
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
  const [clusterMode, setClusterMode] = useState('bar');
  const [clusterData, setClusterData] = useState<ClusterRow[]>([]);
  const [clusterLoading, setClusterLoading] = useState(true);
  const [funcData, setFuncData] = useState<Slice[]>([]);
  const [funcLoading, setFuncLoading] = useState(true);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [progressData, setProgressData] = useState<ProgressRow[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [freqData, setFreqData] = useState<ProgressRow[]>([]);
  const [freqLoading, setFreqLoading] = useState(true);
  const [roleIndex, setRoleIndex] = useState<RoleClusterMonthlyIndex>(EMPTY_ROLE_INDEX);
  const [roleWiseLoading, setRoleWiseLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setClusterLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson(
          'visits_per_cluster.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setClusterData(normalizeVisitsPerCluster(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe visits-per-cluster API failed.', err);
      } finally {
        if (!controller.signal.aborted) setClusterLoading(false);
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
          const index = buildRoleClusterMonthlyIndex(raw);
          setRoleIndex(index);
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

  // Every (role, cluster) pair as one bubble-matrix cell — Cluster on the X-axis,
  // Role on the Y-axis, bubble size/color driven by that pair's total SMT visits.
  const smtGridMax = Math.max(
    0,
    ...roleIndex.roles.flatMap((role) =>
      roleIndex.clusters.map((cluster) => roleIndex.totalLookup.get(`${cluster.id}||${role.id}`) ?? 0),
    ),
  );

  const smtGridExportRows = roleIndex.roles.flatMap((role) =>
    roleIndex.clusters.map((cluster) => ({
      Cluster: cluster.name,
      Role: role.name,
      'Total SMT Visits': roleIndex.totalLookup.get(`${cluster.id}||${role.id}`) ?? 0,
    })),
  );

  return (
    <AccordionShell
      title="SMT — Senior Management Tour Field Visits"
      sub="Field visit coverage across circles and functions"
      excelLabel="SMT Visits"
    >
      <ChartCard
        title="Visits per Cluster "
        sub="Ranked by SMT field visit count"
        infoKey="smt-cluster"
        showPdf
        pdfLabel="Visits per Cluster"
        reportPath="msafe_dashboard_report/smt_details"
        exportData={clusterData.map((d) => ({ Cluster: d.name, Visits: d.n }))}
        chartSwitch={<ChartSwitch modes={['bar', 'table']} value={clusterMode} onChange={setClusterMode} />}
      >
        {clusterLoading || clusterData.length === 0 ? (
          <DataState loading={clusterLoading} empty={clusterData.length === 0} label="cluster visit data" />
        ) : clusterMode === 'table' ? (
          <div className="chart-as-table" style={{ maxHeight: 420 }}>
            <table>
              <thead>
                <tr>
                  <th>Cluster</th>
                  <th>Visits</th>
                </tr>
              </thead>
              <tbody>
                {clusterData.map((d) => (
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
            <ResponsiveContainer width="100%" height={Math.max(320, clusterData.length * 22)}>
              <BarChart data={clusterData} layout="vertical" margin={{ top: 4, right: 32, left: 0, bottom: 4 }}>
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
        title="SMT Count by Cluster and Role"
        sub="Cluster on x-axis · Role on y-axis · bubble size and label show count"
        infoKey="smt-role-wise"
        showPdf
        pdfLabel="SMT Role-wise Trend"
        reportPath="msafe_dashboard_report/smt_summary"
        exportData={smtGridExportRows}
        style={{ marginTop: 16 }}
        tag={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: C.sage }}>
            <span style={{ fontWeight: 600, color: C.dark }}>Count scale</span>
            {[
              { label: '1–19', color: C.lav },
              { label: '20–30', color: C.warn },
              { label: '40+', color: C.err },
              { label: '0', color: '#B9B2A0' },
            ].map((s) => (
              <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: s.color,
                    display: 'inline-block',
                  }}
                />
                {s.label}
              </span>
            ))}
          </div>
        }
      >
        {roleWiseLoading || roleIndex.clusters.length === 0 ? (
          <DataState loading={roleWiseLoading} empty={roleIndex.clusters.length === 0} label="role-wise visit data" />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `170px repeat(${roleIndex.clusters.length}, minmax(76px, 1fr))`,
                minWidth: 170 + roleIndex.clusters.length * 76,
              }}
            >
              {/* One row per role, one bubble per cluster */}
              {roleIndex.roles.map((role) => (
                <Fragment key={role.id}>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.dark,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 8px 6px 0',
                      borderTop: `1px solid #F0ECE0`,
                    }}
                  >
                    {role.name}
                  </div>
                  {roleIndex.clusters.map((cluster) => {
                    const total = roleIndex.totalLookup.get(`${cluster.id}||${role.id}`) ?? 0;
                    const monthlyLines = roleIndex.months
                      .map((month) => `${month}: ${roleIndex.lookup.get(`${cluster.id}||${role.id}||${month}`) ?? 0}`)
                      .join('\n');
                    return (
                      <div
                        key={`${role.id}-${cluster.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 0',
                          borderTop: `1px solid #F0ECE0`,
                        }}
                        title={`${cluster.name} · ${role.name}\nTotal: ${total}\n${monthlyLines}`}
                      >
                        <div
                          style={{
                            width: smtBubbleRadius(total, smtGridMax) * 2,
                            height: smtBubbleRadius(total, smtGridMax) * 2,
                            borderRadius: '50%',
                            background: colorForSmtCellCount(total),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 700,
                            color: total > 0 ? '#fff' : '#8A8272',
                          }}
                        >
                          {total > 0 ? total : ''}
                        </div>
                      </div>
                    );
                  })}
                </Fragment>
              ))}

              {/* Cluster names sit below the grid, like a conventional x-axis */}
              <div />
              {roleIndex.clusters.map((cluster) => (
                <div
                  key={cluster.id}
                  style={{
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.dark,
                    padding: '8px 4px 0',
                    borderTop: `1px solid ${C.border}`,
                  }}
                  title={cluster.name}
                >
                  {cluster.name}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: C.dark, marginTop: 10 }}>
              Cluster
            </div>
          </div>
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
            Cluster: s.cluster,
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
                    <th>Cluster</th>
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
                      <td title={s.cluster}>{s.cluster}</td>
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
