import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { DonutChart } from '../components/DonutChart';
import { MsafeChartTooltip } from '../components/MsafeChartTooltip';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import type { Persona } from '../data/constants';
import { useMsafeDashboard, DEFAULT_FILTERS, type AppliedFilters } from '../context/MsafeDashboardContext';

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
 *  Only sent for the 'circle' persona — the admin (pan-India) view stays unfiltered. */
function buildFilterParams(persona: Persona, f: AppliedFilters): Record<string, string> {
  if (persona !== 'circle') return {};
  const params: Record<string, string> = {};
  if (f.circleId) params.circle_id = f.circleId;
  if (f.functionIds.length > 0) params.function_id = f.functionIds.join(',');
  if (f.zoneId) params.zone_id = f.zoneId;
  if (f.empTypeId) params.employee_type_id = f.empTypeId;
  if (f.startDate && f.startDate !== DEFAULT_FILTERS.startDate) params.from_date = f.startDate;
  if (f.endDate && f.endDate !== DEFAULT_FILTERS.endDate) params.to_date = f.endDate;
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

function normalizeRecentVisits(payload: unknown): RecentVisit[] {
  const list = unwrapList(payload, ['data', 'result', 'visits', 'records']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['done_by', 'user_name', 'employee_name', 'name']);
      if (!name) return null;
      const func = getString(record, ['function', 'func', 'department']) ?? '—';
      const circle = getString(record, ['circle_name', 'circle']) ?? '—';
      const area = getString(record, ['area_visited', 'area', 'location', 'site']) ?? '—';
      const date = getString(record, ['visit_date', 'date', 'created_at']) ?? '—';
      return { name, func, circle, area, date };
    })
    .filter((item): item is RecentVisit => Boolean(item));
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
        return { label, pct, val: `${visits}/${target}`, color: pct < 60 ? C.vi : C.warn };
      }

      const visits = getNumber(record, ['visits', 'count', 'value', 'completed']);
      if (visits === null) return null;
      const target = getNumber(record, ['target', 'target_visits', 'goal']) ?? 20;
      const explicitPct = getNumber(record, ['pct', 'percentage', 'percent']);
      const pct = explicitPct ?? Math.round((visits / target) * 100);
      return { label, pct, val: `${visits}/${target}`, color: pct < 60 ? C.vi : C.warn };
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
  }, [appliedFilters]);

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
  }, [appliedFilters]);

  useEffect(() => {
    const controller = new AbortController();
    setRecentLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson(
          'recent_smt_visits.json',
          buildFilterParams(persona, appliedFilters),
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
  }, [appliedFilters]);

  useEffect(() => {
    const controller = new AbortController();
    setProgressLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson(
          'smt_visit_progress_by_circle.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setProgressData(normalizeVisitProgress(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe smt-visit-progress-by-circle API failed.', err);
      } finally {
        if (!controller.signal.aborted) setProgressLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters]);

  useEffect(() => {
    const controller = new AbortController();
    setFreqLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson(
          'visit_frequency.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setFreqData(normalizeVisitFrequency(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe visit-frequency API failed.', err);
      } finally {
        if (!controller.signal.aborted) setFreqLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters]);

  return (
    <AccordionShell
      title="SMT — Senior Management Tour Field Visits"
      sub="Field visit coverage across circles and functions"
      excelLabel="SMT Visits"
    >
      <ChartCard
        title="Visits per Circle · This Month"
        sub="Ranked by SMT field visit count"
        infoKey="smt-circle"
        showPdf
        pdfLabel="Visits per Circle"
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
                <Bar dataKey="n" fill={C.lav} radius={[0, 5, 5, 0]} name="Visits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <div className="g g2" style={{ marginTop: 16 }}>
        <ChartCard title="SMT by Function" sub="Which functions are doing the visits" infoKey="smt-func">
          {funcLoading || funcData.length === 0 ? (
            <DataState loading={funcLoading} empty={funcData.length === 0} label="function visit data" />
          ) : (
            <DonutChart data={funcData} bodyLabel="Visits" height={Math.max(220, funcData.length * 26)} />
          )}
        </ChartCard>

        <ChartCard title="Visit Frequency" sub="Sites visited over last quarter" infoKey="smt-freq">
          {freqLoading || freqData.length === 0 ? (
            <DataState loading={freqLoading} empty={freqData.length === 0} label="visit frequency data" />
          ) : (
            <ProgressRows rows={freqData} />
          )}
        </ChartCard>
      </div>

      <div className="g g-2-1" style={{ marginTop: 16 }}>
        <ChartCard
          title="Recent SMT Visits"
          sub="Latest field verifications logged"
          infoKey="smt-recent"
          tag={<span className="card-tag">Last 20</span>}
        >
          {recentLoading || recentVisits.length === 0 ? (
            <DataState loading={recentLoading} empty={recentVisits.length === 0} label="recent visits" />
          ) : (
            <div className="tbl-scroll">
              <table className="tbl">
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
                    <tr key={s.name + s.date} onClick={() => openDrill('smt-visit', s.name)}>
                      <td className="cell-strong">{s.name}</td>
                      <td>{s.func}</td>
                      <td>{s.circle}</td>
                      <td>{s.area}</td>
                      <td>{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="SMT Visit Progress by Circle"
          sub="Circles currently working toward the 20 visits/month target"
          infoKey="smt-progress"
        >
          {progressLoading || progressData.length === 0 ? (
            <DataState loading={progressLoading} empty={progressData.length === 0} label="progress data" />
          ) : (
            <ProgressRows
              rows={progressData.map((r) => ({
                ...r,
                onClick: () => openDrill('smt-below', r.label),
              }))}
            />
          )}
        </ChartCard>
      </div>
    </AccordionShell>
  );
}
