import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
  Legend,
} from 'recharts';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { ChartTable, DonutChart, SliceBarChart } from '../components/DonutChart';
import { UserDirectoryCard } from '../components/UserDirectoryCard';
import { C } from '../data/constants';
import type { Persona } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import { getAuthHeader } from '@/config/apiConfig';

type CircleChartRow = { name: string; Internal: number; External: number };
type FuncChartRow = { name: string; value: number; color: string };
type RegChartRow = { m: string; n: number; internal: number; external: number };

const FUNC_CHART_PALETTE = [C.terra, C.sage, C.blue, C.teal, C.lav, C.warn, C.err, C.ok, '#B4A38A'];

const getNumericValue = (record: Record<string, unknown>, keys: string[]): number | null => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return null;
};

const normalizeCircleChartData = (payload: unknown): CircleChartRow[] => {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  const list = Array.isArray(source)
    ? source
    : Array.isArray((source as Record<string, unknown>)?.data)
      ? ((source as Record<string, unknown>).data as unknown[])
      : Array.isArray((source as Record<string, unknown>)?.result)
        ? ((source as Record<string, unknown>).result as unknown[])
        : Array.isArray((source as Record<string, unknown>)?.users)
          ? ((source as Record<string, unknown>).users as unknown[])
          : [];

  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const record = item as Record<string, unknown>;
      const name = [
        record.circle_name,
        record.circleName,
        record.circle,
        record.name,
        record.circle_name_display,
        record.label,
        record.title,
      ].find((value): value is string => typeof value === 'string' && value.trim().length > 0);

      if (!name) return null;

      const internal = getNumericValue(record, [
        'internal',
        'internal_users',
        'internal_count',
        'internal_fte',
        'internal_user_count',
        'internals',
      ]);
      const external = getNumericValue(record, [
        'external',
        'external_users',
        'external_count',
        'external_non_fte',
        'external_user_count',
        'externals',
      ]);
      const total = getNumericValue(record, ['total', 'total_users', 'users_count', 'count']);

      const normalizedInternal = internal ?? (total !== null && external !== null ? Math.max(total - external, 0) : null);
      const normalizedExternal = external ?? (total !== null && internal !== null ? Math.max(total - internal, 0) : null);

      if (normalizedInternal === null && normalizedExternal === null) {
        return null;
      }

      return {
        name,
        Internal: normalizedInternal ?? 0,
        External: normalizedExternal ?? 0,
      };
    })
    .filter((item): item is CircleChartRow => Boolean(item));
};

const normalizeStatSlices = (
  payload: unknown,
  arrayKeys: string[],
  nameKeys: string[],
  valueKeys: string[],
): FuncChartRow[] => {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  let list: unknown[] = Array.isArray(source) ? source : [];
  if (!Array.isArray(source)) {
    for (const key of arrayKeys) {
      const candidate = (source as Record<string, unknown>)?.[key];
      if (Array.isArray(candidate)) {
        list = candidate;
        break;
      }
    }
  }

  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;

      const record = item as Record<string, unknown>;
      const name = nameKeys
        .map((key) => record[key])
        .find((value): value is string => typeof value === 'string' && value.trim().length > 0);

      if (!name) return null;

      const value = getNumericValue(record, valueKeys);
      if (value === null) return null;

      return { name, value, color: FUNC_CHART_PALETTE[index % FUNC_CHART_PALETTE.length] };
    })
    .filter((item): item is FuncChartRow => Boolean(item));
};

const normalizeRegChartData = (payload: unknown): RegChartRow[] => {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  let list: unknown[] = Array.isArray(source) ? source : [];
  if (!Array.isArray(source)) {
    for (const key of ['data', 'result', 'registrations', 'months', 'users']) {
      const candidate = (source as Record<string, unknown>)?.[key];
      if (Array.isArray(candidate)) {
        list = candidate;
        break;
      }
    }
  }

  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const record = item as Record<string, unknown>;
      const month = [record.month, record.month_name, record.m, record.label, record.name, record.date].find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0,
      );

      if (!month) return null;

      const internal = getNumericValue(record, ['internal_users', 'internal', 'internal_count']) ?? 0;
      const external = getNumericValue(record, ['external_users', 'external', 'external_count']) ?? 0;

      const count =
        getNumericValue(record, ['count', 'value', 'n', 'total', 'users', 'users_count', 'new_users', 'registrations']) ??
        (internal || external ? internal + external : null);
      if (count === null) return null;

      return { m: month, n: count, internal, external };
    })
    .filter((item): item is RegChartRow => Boolean(item));
};

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
  if (f.empTypeId) params.employee_type= f.empTypeId;
  if (f.startDate) params.from_date = f.startDate;
  if (f.endDate) params.to_date = f.endDate;
  return params;
}

async function fetchMsafeUserDashboardJson(
  endpoint: string,
  extraParams?: Record<string, string>,
): Promise<unknown> {
  const companyId = Number(
    localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '145',
  );
  const token = localStorage.getItem('token') || '';
  const params = new URLSearchParams({ company_id: String(companyId), ...extraParams });
  if (token) {
    params.set('token', token);
    params.set('access_token', token);
  }
  const url = `${getMsafeBaseUrl()}/msafe_user_dashboard/${endpoint}?${params.toString()}`;
  const headers: Record<string, string> = {};

  try {
    headers.Authorization = getAuthHeader();
  } catch {
    // Fall back to unauthenticated request if no token is available.
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

async function fetchUserStatistics(type: string, extraParams?: Record<string, string>): Promise<unknown> {
  return fetchMsafeUserDashboardJson('user_statistics.json', { type, ...extraParams });
}

function DataState({ loading, empty, label }: { loading: boolean; empty: boolean; label: string }) {
  if (!loading && !empty) return null;
  return (
    <div style={{ fontSize: 12, color: C.sage, padding: '24px 0', textAlign: 'center' }}>
      {loading ? 'Loading…' : `No ${label} available`}
    </div>
  );
}

export function UsersSection() {
  const { persona, appliedFilters } = useMsafeDashboard();
  const [compMode, setCompMode] = useState('donut');
  const [regMode, setRegMode] = useState('line');
  const [circleMode, setCircleMode] = useState('bar');
  const [funcMode, setFuncMode] = useState('donut');
  const [circleChartData, setCircleChartData] = useState<CircleChartRow[]>([]);
  const [circleLoading, setCircleLoading] = useState(true);
  const [funcChartData, setFuncChartData] = useState<FuncChartRow[]>([]);
  const [funcLoading, setFuncLoading] = useState(true);
  const [compChartData, setCompChartData] = useState<FuncChartRow[]>([]);
  const [compLoading, setCompLoading] = useState(true);
  const [regChartData, setRegChartData] = useState<RegChartRow[]>([]);
  const [regLoading, setRegLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCircleData = async () => {
      setCircleLoading(true);

      try {
        const payload = await fetchMsafeUserDashboardJson(
          'users_by_circle.json',
          buildFilterParams(persona, appliedFilters),
        );
        const normalized = normalizeCircleChartData(payload);
        if (isMounted) setCircleChartData(normalized);
      } catch (error) {
        console.warn('M-Safe users-by-circle API failed.', error);
      } finally {
        if (isMounted) {
          setCircleLoading(false);
        }
      }
    };

    loadCircleData();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona]);

  useEffect(() => {
    let isMounted = true;

    const loadRegData = async () => {
      setRegLoading(true);

      try {
        const payload = await fetchMsafeUserDashboardJson(
          'new_registrations.json',
          buildFilterParams(persona, appliedFilters),
        );
        const normalized = normalizeRegChartData(payload);
        if (isMounted) setRegChartData(normalized);
      } catch (error) {
        console.warn('M-Safe new-registrations API failed.', error);
      } finally {
        if (isMounted) setRegLoading(false);
      }
    };

    loadRegData();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona]);

  useEffect(() => {
    let isMounted = true;

    const loadFuncData = async () => {
      setFuncLoading(true);

      try {
        const payload = await fetchUserStatistics('department', buildFilterParams(persona, appliedFilters));
        const normalized = normalizeStatSlices(
          payload,
          ['users_by_department', 'data', 'result', 'departments', 'users'],
          ['department', 'department_name', 'function_name', 'name', 'label', 'title'],
          ['user_count', 'count', 'value', 'total', 'total_users', 'users', 'users_count', 'department_count'],
        );
        if (isMounted) setFuncChartData(normalized);
      } catch (error) {
        console.warn('M-Safe user statistics (department) API failed.', error);
      } finally {
        if (isMounted) setFuncLoading(false);
      }
    };

    loadFuncData();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona]);

  useEffect(() => {
    let isMounted = true;

    const loadCompData = async () => {
      setCompLoading(true);

      try {
        const payload = await fetchUserStatistics('composition', buildFilterParams(persona, appliedFilters));
        const normalized = normalizeStatSlices(
          payload,
          ['user_composition', 'data', 'result', 'composition', 'employment_types', 'types', 'users_by_department', 'departments', 'users'],
          ['employee_type', 'employment_type', 'type_name', 'category', 'department', 'department_name', 'name', 'label', 'title'],
          ['user_count', 'count', 'value', 'total', 'total_users', 'users', 'users_count', 'department_count'],
        );
        if (isMounted) setCompChartData(normalized);
      } catch (error) {
        console.warn('M-Safe user statistics (composition) API failed.', error);
      } finally {
        if (isMounted) setCompLoading(false);
      }
    };

    loadCompData();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona]);

  return (
    <AccordionShell
      title="Users — Internal & External"
      sub="Who's actually in the system, and how the base is growing"
      excelLabel="Users"
    >
      <div className="g g2">
        <ChartCard
          title="User Composition"
          sub="Internal FTE vs External contractors"
          infoKey="user-comp"
          showPdf
          pdfLabel="User Composition"
          exportData={compChartData.map((d) => ({ Department: d.name, Users: d.value }))}
          chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={compMode} onChange={setCompMode} />}
        >
          {compLoading || compChartData.length === 0 ? (
            <DataState loading={compLoading} empty={compChartData.length === 0} label="composition data" />
          ) : (
            <>
              {compMode === 'donut' && <DonutChart data={compChartData} />}
              {compMode === 'bar' && <SliceBarChart data={compChartData} />}
              {compMode === 'table' && <ChartTable data={compChartData} valueLabel="Users" />}
            </>
          )}
        </ChartCard>

        <ChartCard
          title="New Registrations · Last 12 Months"
          sub="Monthly onboarding trend"
          infoKey="user-reg"
          showPdf
          pdfLabel="New Registrations"
          exportData={regChartData.map((d) => ({
            Month: d.m,
            'Internal Users': d.internal,
            'External Users': d.external,
            Total: d.n,
          }))}
          chartSwitch={<ChartSwitch modes={['line', 'bar', 'table']} value={regMode} onChange={setRegMode} />}
        >
          {regLoading || regChartData.length === 0 ? (
            <DataState loading={regLoading} empty={regChartData.length === 0} label="registration data" />
          ) : regMode === 'table' ? (
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Internal Users</th>
                    <th>External Users</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {regChartData.map((d) => (
                    <tr key={d.m}>
                      <td className="cell-strong">{d.m}</td>
                      <td>{d.internal.toLocaleString('en-IN')}</td>
                      <td>{d.external.toLocaleString('en-IN')}</td>
                      <td>{d.n.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                {regMode === 'line' ? (
                  <AreaChart data={regChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                    <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area
                      type="monotone"
                      dataKey="internal"
                      stroke={C.terra}
                      fill="rgba(218,119,86,.14)"
                      strokeWidth={2.5}
                      name="Internal Users"
                    />
                    <Area
                      type="monotone"
                      dataKey="external"
                      stroke={C.blue}
                      fill="rgba(107,155,204,.14)"
                      strokeWidth={2.5}
                      name="External Users"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={regChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                    <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="internal" fill={C.terra} radius={[5, 5, 0, 0]} name="Internal Users" />
                    <Bar dataKey="external" fill={C.blue} radius={[5, 5, 0, 0]} name="External Users" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="g g-2-1" style={{ marginTop: 16 }}>
        <ChartCard
          title="Users per Circle"
          sub="Distribution across 22 VIL circles"
          infoKey="user-circle"
          showPdf
          pdfLabel="Users per Circle"
          exportData={circleChartData.map((d) => ({
            Circle: d.name,
            Internal: d.Internal,
            External: d.External,
            Total: d.Internal + d.External,
          }))}
          chartSwitch={<ChartSwitch modes={['bar', 'table']} value={circleMode} onChange={setCircleMode} />}
        >
          {circleLoading || circleChartData.length === 0 ? (
            <DataState loading={circleLoading} empty={circleChartData.length === 0} label="circle data" />
          ) : circleMode === 'bar' ? (
            <div className="chart-wrap tall">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={circleChartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: C.sage }}
                    interval={0}
                    angle={-35}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10.5 }} iconType="square" iconSize={10} />
                  <Bar dataKey="Internal" stackId="a" fill={C.blue} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="External" stackId="a" fill={C.terra} radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-as-table" style={{ maxHeight: 280 }}>
              <table>
                <thead>
                  <tr>
                    <th>Circle</th>
                    <th>Internal</th>
                    <th>External</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {circleChartData.map((r) => (
                    <tr key={r.name}>
                      <td>{r.name}</td>
                      <td className="num">{r.Internal.toLocaleString()}</td>
                      <td className="num">{r.External.toLocaleString()}</td>
                      <td className="num">{(r.Internal + r.External).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Users by Department / Function"
          sub="Sales, S&D, Technology, HR, Marketing, Ops, etc."
          infoKey="user-func"
          showPdf
          pdfLabel="Users by Department"
          exportData={funcChartData.map((d) => ({ Department: d.name, Users: d.value }))}
          chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={funcMode} onChange={setFuncMode} />}
        >
          {funcLoading || funcChartData.length === 0 ? (
            <DataState loading={funcLoading} empty={funcChartData.length === 0} label="department data" />
          ) : (
            <>
              {funcMode === 'donut' && <DonutChart data={funcChartData} height={280} />}
              {funcMode === 'bar' && <SliceBarChart data={funcChartData} height={280} horizontal />}
              {funcMode === 'table' && <ChartTable data={funcChartData} valueLabel="Users" />}
            </>
          )}
        </ChartCard>
      </div>

      <UserDirectoryCard style={{ marginTop: 16 }} hideStatusColumn />
    </AccordionShell>
  );
}
