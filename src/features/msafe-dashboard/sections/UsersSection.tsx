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
import { getAuthHeader } from '@/config/apiConfig';

type CircleChartRow = { name: string; Internal: number; External: number };
type FuncChartRow = { name: string; value: number; color: string };
type RegChartRow = { m: string; n: number };

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

      const count = getNumericValue(record, [
        'count',
        'value',
        'n',
        'total',
        'users',
        'users_count',
        'new_users',
        'registrations',
      ]);
      if (count === null) return null;

      return { m: month, n: count };
    })
    .filter((item): item is RegChartRow => Boolean(item));
};

function getMsafeBaseUrl(): string {
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
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

async function fetchUserStatistics(type: string): Promise<unknown> {
  return fetchMsafeUserDashboardJson('user_statistics.json', { type });
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
        const payload = await fetchMsafeUserDashboardJson('users_by_circle.json');
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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadRegData = async () => {
      try {
        const payload = await fetchMsafeUserDashboardJson('new_registrations.json');
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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadFuncData = async () => {
      try {
        const payload = await fetchUserStatistics('department');
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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCompData = async () => {
      try {
        const payload = await fetchUserStatistics('department');
        const normalized = normalizeStatSlices(
          payload,
          ['users_by_department', 'data', 'result', 'departments', 'composition', 'employment_types', 'types', 'users'],
          ['department', 'department_name', 'employment_type', 'type_name', 'category', 'name', 'label', 'title'],
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
  }, []);

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
          exportData={regChartData.map((d) => ({ Month: d.m, 'New Joiners': d.n }))}
          chartSwitch={<ChartSwitch modes={['line', 'bar']} value={regMode} onChange={setRegMode} />}
        >
          {regLoading || regChartData.length === 0 ? (
            <DataState loading={regLoading} empty={regChartData.length === 0} label="registration data" />
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                {regMode === 'line' ? (
                  <AreaChart data={regChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                    <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="n"
                      stroke={C.terra}
                      fill="rgba(218,119,86,.14)"
                      strokeWidth={2.5}
                      name="New Joiners"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={regChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.sage }} />
                    <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                    <Tooltip />
                    <Bar dataKey="n" fill={C.terra} radius={[5, 5, 0, 0]} name="New Joiners" />
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

      <UserDirectoryCard style={{ marginTop: 16 }} />
    </AccordionShell>
  );
}
