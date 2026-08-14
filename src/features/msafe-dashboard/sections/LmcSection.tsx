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
 *  Only sent for the 'circle' persona — the admin (pan-India) view stays unfiltered. */
function buildFilterParams(persona: Persona, f: AppliedFilters): Record<string, string> {
  if (persona !== 'circle') return {};
  const params: Record<string, string> = {};
  if (f.circleId) params.circle_id = f.circleId;
  if (f.functionIds.length > 0) params.function_id = f.functionIds.join(',');
  if (f.zoneId) params.zone_id = f.zoneId;
  if (f.empTypeId) params.employee_type_id = f.empTypeId;
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

function normalizeDailyVolume(payload: unknown): DailyRow[] {
  const list = unwrapList(payload, ['data', 'result', 'daily', 'days', 'records']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const d = getString(record, ['day', 'date', 'day_label', 'd', 'label', 'name']);
      if (!d) return null;
      const n = getNumber(record, ['volume', 'count', 'value', 'n', 'total', 'lmc_count', 'sign_offs']);
      if (n === null) return null;
      return { d, n };
    })
    .filter((item): item is DailyRow => Boolean(item));
}

function colorForWeekPct(pct: number): string {
  if (pct >= 90) return C.ok;
  if (pct >= 70) return C.teal;
  return C.warn;
}

function normalizeWeeklyCompletion(payload: unknown): WeekRow[] {
  const list = unwrapList(payload, ['data', 'result', 'week', 'days']);
  const rows = list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const label = getString(record, ['day_name', 'day', 'label', 'date']);
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
    .filter((item): item is { label: string; actual: number; target: number | null; explicitPct: number | null } =>
      Boolean(item),
    );

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
      const department = getString(record, ['department', 'function', 'func']) ?? '—';
      const circle = getString(record, ['circle', 'circle_name']) ?? '—';
      const count = getNumber(record, ['total_lmc_signed', 'count', 'value', 'sign_offs', 'lmc_count', 'total']);
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

function normalizeLmcStatus(payload: unknown): WeekRow[] {
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

function normalizeMonthlyTrend(payload: unknown): TrendRow[] {
  const list = unwrapList(payload, ['data', 'result', 'months', 'trend']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const m = getString(record, ['month', 'month_name', 'm', 'label', 'name']);
      if (!m) return null;
      const n = getNumber(record, ['total_lmc_signoff_volume', 'count', 'value', 'n', 'total', 'sign_offs']);
      if (n === null) return null;
      return { m, n };
    })
    .filter((item): item is TrendRow => Boolean(item));
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
  const [trendMode, setTrendMode] = useState('line');
  const [dailyData, setDailyData] = useState<DailyRow[]>([]);
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
        if (!controller.signal.aborted) setDailyData(normalizeDailyVolume(payload));
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
          buildFilterParams(persona, appliedFilters),
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
  }, [appliedFilters, persona]);

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
        const payload = await fetchMsafeLmcJson(
          'monthly_lmc_signoff_volume.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setTrendData(normalizeMonthlyTrend(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe monthly-lmc-signoff-volume API failed.', err);
      } finally {
        if (!controller.signal.aborted) setTrendLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  return (
    <AccordionShell
      title="LMC — Line Manager Check Activity"
      sub="Daily sign-off volume and manager engagement"
      excelLabel="LMC"
    >
      <div className="g g-2-1">
        <ChartCard
          title="Daily LMC Volume — Last 30 Days"
          sub="Number of LMC sign-offs recorded per day"
          infoKey="lmc-daily"
          showPdf
          pdfLabel="Daily LMC Volume"
          exportData={dailyData.map((d) => ({ Date: d.d, 'LMC Sign-offs': d.n }))}
          chartSwitch={<ChartSwitch modes={['line', 'bar']} value={dailyMode} onChange={setDailyMode} />}
        >
          {dailyLoading || dailyData.length === 0 ? (
            <DataState loading={dailyLoading} empty={dailyData.length === 0} label="daily volume data" />
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                {dailyMode === 'line' ? (
                  <AreaChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <XAxis dataKey="d" tick={{ fontSize: 8, fill: C.sage }} interval={4} />
                    <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                    <Tooltip />
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
                    <Tooltip />
                    <Bar dataKey="n" fill={C.vi} radius={[5, 5, 0, 0]} name="LMC Sign-offs" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard title="LMC Completion — This Week" sub="Daily target vs actual" infoKey="lmc-week">
          {weekLoading || weekData.length === 0 ? (
            <DataState loading={weekLoading} empty={weekData.length === 0} label="weekly completion data" />
          ) : (
            <ProgressRows
              rows={weekData.map((r) => ({
                ...r,
                onClick: () => openDrill(`lmc-${r.label.toLowerCase()}`, `LMC · ${r.label}`),
              }))}
            />
          )}
        </ChartCard>
      </div>

      <div className="g g3" style={{ marginTop: 16 }}>
        <ChartCard title="Top LMC Managers — Last 30 Days" sub="Most active line managers" infoKey="lmc-managers">
          {managerLoading || managerData.length === 0 ? (
            <DataState loading={managerLoading} empty={managerData.length === 0} label="manager data" />
          ) : (
            <Leaderboard
              items={managerData.map((m) => ({
                name: m.name,
                meta: `${m.department} · ${m.circle}`,
                value: m.count,
                onClick: () => openDrill('user-detail', m.name),
              }))}
            />
          )}
        </ChartCard>

        <ChartCard
          title="LMC by Function"
          sub="Which function's managers are most active"
          infoKey="lmc-func"
          chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={funcMode} onChange={setFuncMode} />}
        >
          {funcLoading || funcData.length === 0 ? (
            <DataState loading={funcLoading} empty={funcData.length === 0} label="function data" />
          ) : (
            <>
              {funcMode === 'donut' && <DonutChart data={funcData} />}
              {funcMode === 'bar' && <SliceBarChart data={funcData} />}
              {funcMode === 'table' && <ChartTable data={funcData} valueLabel="LMC %" />}
            </>
          )}
        </ChartCard>

        <ChartCard title="LMC Status Breakdown" sub="All LMCs · this month" infoKey="lmc-status">
          {statusLoading || statusData.length === 0 ? (
            <DataState loading={statusLoading} empty={statusData.length === 0} label="status data" />
          ) : (
            <ProgressRows
              rows={statusData.map((r) => ({
                ...r,
                onClick: () =>
                  openDrill(`lmc-${r.label.toLowerCase().replace(/\s/g, '')}`, r.label),
              }))}
            />
          )}
        </ChartCard>
      </div>

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
                  <Tooltip />
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
                  <Tooltip />
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
