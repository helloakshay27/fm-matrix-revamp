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
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { ChartTable, DonutChart, SideLegendDonut, SliceBarChart } from '../components/DonutChart';
import { ProgressRows } from '../components/ProgressRows';
import { C } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import type { Persona } from '../data/constants';

type Slice = { name: string; value: number; color: string };
type CircleBar = { name: string; pct: number; color: string };
type CircleDays = { name: string; days: number; color: string };
type AgingRow = { label: string; pct: number; val: string; color: string };

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

const STATUS_FLAT_FIELDS: [string, string][] = [
  ['cleared', 'Cleared'],
  ['pending', 'Pending'],
  ['not_started', 'Not Started'],
];

function normalizeStatus(payload: unknown): Slice[] {
  const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};

  const flatSlices = STATUS_FLAT_FIELDS.map(([key, label]) => {
    const value = getNumber(record, [key]);
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
  const value = getNumber(record, ['clearance_percentage', 'cleared_percentage']);
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
  ['days_15_plus', '15+ days · High Priority'],
];

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

  const rows =
    flatRows.length > 0
      ? flatRows
      : unwrapList(payload, ['data', 'result', 'buckets', 'aging', 'ranges'])
          .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const record = item as Record<string, unknown>;
            const label = getString(record, ['bucket', 'range', 'age_range', 'label', 'name']);
            if (!label) return null;
            const count = getNumber(record, ['count', 'value', 'total', 'users_count']);
            if (count === null) return null;
            const explicitPct = getNumber(record, ['pct', 'percentage', 'percent']);
            return { label, count, explicitPct, color: colorForAgingLabel(label) };
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

function normalizeCategory(payload: unknown): Slice[] {
  const list = unwrapList(payload, ['data', 'result', 'categories']);
  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['category_name', 'category', 'name', 'label', 'title']);
      if (!name) return null;
      const value = getNumber(record, ['count', 'value', 'total', 'cleared_count']);
      if (value === null) return null;
      return { name, value, color: SLICE_PALETTE[index % SLICE_PALETTE.length] };
    })
    .filter((item): item is Slice => Boolean(item));
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

function colorForClearancePct(pct: number): string {
  if (pct >= 90) return C.ok;
  if (pct >= 75) return C.warn;
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
      const pct = getNumber(record, ['cleared_percentage', 'percentage', 'pct', 'cleared_pct']);
      if (pct === null) return null;
      return { name, pct, color: colorForClearancePct(pct) };
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
  const [categoryData, setCategoryData] = useState<Slice[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [turnaroundData, setTurnaroundData] = useState<CircleDays[]>([]);
  const [turnaroundLoading, setTurnaroundLoading] = useState(true);
  const [circlePctData, setCirclePctData] = useState<CircleBar[]>([]);
  const [circlePctLoading, setCirclePctLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setStatusLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeKrccJson(
          'krcc_clearance_status.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        const normalized = normalizeStatus(payload);
        warnIfEmpty('krcc_clearance_status.json', normalized, payload);
        if (!controller.signal.aborted) {
          setStatusData(normalized);
          setApiClearedPct(extractClearancePercentage(payload));
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe krcc-clearance-status API failed.', err);
      } finally {
        if (!controller.signal.aborted) setStatusLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

  useEffect(() => {
    const controller = new AbortController();
    setAgingLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeKrccJson(
          'krcc_pending_aging.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
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

  useEffect(() => {
    const controller = new AbortController();
    setTurnaroundLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeKrccJson(
          'krcc_turnaround_time_by_circle.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        const normalized = normalizeTurnaround(payload);
        warnIfEmpty('krcc_turnaround_time_by_circle.json', normalized, payload);
        if (!controller.signal.aborted) setTurnaroundData(normalized);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('M-Safe krcc-turnaround-time API failed.', err);
      } finally {
        if (!controller.signal.aborted) setTurnaroundLoading(false);
      }
    })();
    return () => controller.abort();
  }, [appliedFilters, persona]);

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
  const clearedStatus = statusData.find((s) => /clear/i.test(s.name))?.value ?? 0;
  const clearedPct =
    apiClearedPct ?? (totalStatus > 0 ? `${((clearedStatus / totalStatus) * 100).toFixed(1)}%` : '—');

  return (
    <AccordionShell
      title="KRCC — Key Risk Compliance Check"
      sub="Status, aging, and where clearance is falling behind"
      excelLabel="KRCC"
    >
      <div className="g g2">
        <ChartCard
          title="KRCC Clearance Status"
          sub="Cleared vs Pending vs Not Started"
          infoKey="krcc-status"
          showPdf
          pdfLabel="KRCC Clearance Status"
          exportData={statusData.map((s) => ({ Status: s.name, Users: s.value }))}
          chartSwitch={<ChartSwitch modes={['donut', 'bar']} value={statusMode} onChange={setStatusMode} />}
        >
          {statusLoading || statusData.length === 0 ? (
            <DataState loading={statusLoading} empty={statusData.length === 0} label="status data" />
          ) : statusMode === 'donut' ? (
            <SideLegendDonut
              data={statusData}
              centerValue={clearedPct}
              centerLabel="Cleared"
              bodyLabel="Users"
              onRowClick={(name) => openDrill(`krcc-${name.toLowerCase().replace(/\s/g, '')}`, name)}
            />
          ) : (
            <SliceBarChart data={statusData} />
          )}
        </ChartCard>

        <ChartCard
          title="KRCC Aging — Pending Requests"
          sub="How long pending KRCCs have been waiting"
          infoKey="krcc-aging"
        >
          {agingLoading || agingData.length === 0 ? (
            <DataState loading={agingLoading} empty={agingData.length === 0} label="aging data" />
          ) : (
            <ProgressRows
              rows={agingData.map((r) => ({
                ...r,
                onClick: () => openDrill('krcc-stale', r.label),
              }))}
            />
          )}
        </ChartCard>
      </div>

      <ChartCard
        title="KRCC Clearance % by Circle"
        sub="Green = ≥90% · Amber = 75–90% · Red = <75%"
        infoKey="krcc-circle"
        showPdf
        pdfLabel="KRCC by Circle"
        exportData={circlePctData.map((d) => ({ Circle: d.name, 'Cleared %': d.pct }))}
        style={{ marginTop: 16 }}
      >
        {circlePctLoading || circlePctData.length === 0 ? (
          <DataState loading={circlePctLoading} empty={circlePctData.length === 0} label="circle data" />
        ) : (
          <div style={{ maxHeight: 560, overflowY: 'auto' }}>
            <ResponsiveContainer width="100%" height={Math.max(320, circlePctData.length * 24)}>
              <BarChart
                data={circlePctData}
                layout="vertical"
                margin={{ top: 4, right: 32, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: C.sage }} />
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
                  formatter={(value) => [`${value}%`, 'Cleared %']}
                />
                <Bar dataKey="pct" radius={[0, 5, 5, 0]} name="Cleared %">
                  {circlePctData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>

      <ChartCard
        title="KRCC Cleared by Category"
        sub="Which check category makes up cleared KRCCs"
        infoKey="krcc-category"
        showPdf
        pdfLabel="KRCC by Category"
        exportData={categoryData.map((d) => ({ Category: d.name, 'KRCCs Cleared': d.value }))}
        style={{ marginTop: 16 }}
        chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={catMode} onChange={setCatMode} />}
      >
        {categoryLoading || categoryData.length === 0 ? (
          <DataState loading={categoryLoading} empty={categoryData.length === 0} label="category data" />
        ) : (
          <>
            {catMode === 'donut' && <DonutChart data={categoryData} />}
            {catMode === 'bar' && <SliceBarChart data={categoryData} />}
            {catMode === 'table' && <ChartTable data={categoryData} valueLabel="KRCCs Cleared" />}
          </>
        )}
      </ChartCard>

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
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </AccordionShell>
  );
}
