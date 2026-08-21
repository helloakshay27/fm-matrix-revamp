import { useEffect, useState } from 'react';
import { LayoutDashboard, Plus, X } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { C } from '../data/constants';
import type { Persona } from '../data/constants';
import { ANALYTICS_CATALOG } from '../data/mockData';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import { DonutChart, type Slice } from '../components/DonutChart';
import { getAuthHeader } from '@/config/apiConfig';

// ---------------------------------------------------------------------------
// Shared fetch/normalize helpers, duplicated (not imported) from the live
// section files — this mirrors the existing convention in this codebase where
// each section file keeps its own small fetch/normalize helpers rather than
// sharing a common module. See KpiOverview.tsx, UsersSection.tsx,
// KrccSection.tsx, LmcSection.tsx, TrainingSection.tsx, SmtSection.tsx.
// ---------------------------------------------------------------------------

function getMsafeBaseUrl(): string {
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
}

/** Circle Manager filter bar values, applied as query params once the user clicks Apply.
 *  Pan India now uses the exact same filter bar as Circle Manager, so every field applies
 *  the same way regardless of persona. Matches UsersSection/KrccSection/LmcSection/
 *  TrainingSection/SmtSection's buildFilterParams (employee_type, not employee_type_id). */
function buildFilterParams(_persona: Persona, f: AppliedFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (f.circleIds.length > 0) params.circle_id = f.circleIds.join(',');
  if (f.functionIds.length > 0) params.function_id = f.functionIds.join(',');
  if (f.zoneId) params.zone_id = f.zoneId;
  if (f.empTypeId) params.employee_type = f.empTypeId;
  if (f.startDate) params.from_date = f.startDate;
  if (f.endDate) params.to_date = f.endDate;
  return params;
}

/** kpi.json specifically expects `employee_type_id`, not `employee_type` — matches
 *  KpiOverview.tsx's buildFilterParams exactly (a deliberate difference from the
 *  other msafe_tranning_dashboard endpoints on the same base URL). */
function buildKpiFilterParams(_persona: Persona, f: AppliedFilters): Record<string, string> {
  const params: Record<string, string> = {};
  if (f.circleIds.length > 0) params.circle_id = f.circleIds.join(',');
  if (f.functionIds.length > 0) params.function_id = f.functionIds.join(',');
  if (f.zoneId) params.zone_id = f.zoneId;
  if (f.empTypeId) params.employee_type = f.empTypeId;
  if (f.startDate) params.from_date = f.startDate;
  if (f.endDate) params.to_date = f.endDate;
  return params;
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

// --- KPI overview (msafe_tranning_dashboard/kpi.json) — mirrors KpiOverview.tsx ---

type KpiApiValue = { value: string; sub?: string };
type KpiValueType = 'count' | 'percent';

async function fetchMsafeTrainingJson(
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
  const url = `${getMsafeBaseUrl()}/msafe_tranning_dashboard/${endpoint}?${params.toString()}`;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { signal, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const KPI_FIELD_MAP: Record<string, { valueKeys: string[]; valueType: KpiValueType; subKeys?: string[] }> = {
  users: { valueKeys: ['total_users', 'users', 'user_count'], valueType: 'count' },
  'krcc-approved': {
    valueKeys: ['krcc_approved', 'krcc_approved_count'],
    valueType: 'count',
    subKeys: ['krcc_approved_percentage', 'krcc_approved_percent'],
  },
  'train-int': {
    valueKeys: ['internal_training_pass_rate', 'train_pass_rate_internal', 'internal_pass_rate'],
    valueType: 'percent',
  },
  lmc: { valueKeys: ['lmc_today', 'lmc'], valueType: 'count' },
  smt: { valueKeys: ['smt_visit_this_month', 'smt'], valueType: 'count' },
};

/** Maps a catalog KPI id to the KPI_FIELD_MAP key used by the shared kpi.json payload. */
const KPI_ID_TO_FIELD: Record<string, string> = {
  'kpi-users': 'users',
  'kpi-krcc': 'krcc-approved',
  'kpi-lmc': 'lmc',
  'kpi-training': 'train-int',
  'kpi-smt': 'smt',
};

function unwrapKpiRecord(data: unknown): Record<string, unknown> {
  const record = data as Record<string, unknown>;
  if (record && typeof record === 'object' && !Array.isArray(record)) {
    for (const key of ['kpi', 'kpis', 'data', 'overview']) {
      const nested = record[key];
      if (nested && typeof nested === 'object' && !Array.isArray(nested)) return nested as Record<string, unknown>;
    }
    return record;
  }
  return {};
}

function pickValue(record: Record<string, unknown>, keys: string[], valueType: KpiValueType): string | null {
  for (const key of keys) {
    const v = record[key];
    if (v === null || v === undefined) continue;
    if (typeof v === 'number') {
      return valueType === 'percent' ? `${v}%` : v.toLocaleString('en-IN');
    }
    if (typeof v === 'string' && v.trim()) {
      const s = v.trim();
      return valueType === 'percent' && !s.includes('%') ? `${s}%` : s;
    }
  }
  return null;
}

function pickPercentageSub(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = record[key];
    if (v === null || v === undefined) continue;
    if (typeof v === 'number') return `(${v}%)`;
    if (typeof v === 'string' && v.trim()) {
      const s = v.trim();
      return `(${s.includes('%') ? s : `${s}%`})`;
    }
  }
  return undefined;
}

// --- Users (msafe_user_dashboard) — mirrors UsersSection.tsx ---

type CircleChartRow = { name: string; Internal: number; External: number };
type FuncChartRow = Slice;
type RegChartRow = { m: string; n: number; internal: number; external: number };

const USER_FUNC_PALETTE = [C.terra, C.sage, C.blue, C.teal, C.lav, C.warn, C.err, C.ok, '#B4A38A'];

const getNumericValue = (record: Record<string, unknown>, keys: string[]): number | null => getNumber(record, keys);

const normalizeCircleChartData = (payload: unknown): CircleChartRow[] => {
  const list = unwrapList(payload, ['data', 'result', 'users']);

  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const record = item as Record<string, unknown>;
      const name = getString(record, [
        'circle_name',
        'circleName',
        'circle',
        'name',
        'circle_name_display',
        'label',
        'title',
      ]);
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

      if (normalizedInternal === null && normalizedExternal === null) return null;

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
  const list = unwrapList(payload, arrayKeys);

  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, nameKeys);
      if (!name) return null;
      const value = getNumericValue(record, valueKeys);
      if (value === null) return null;
      return { name, value, color: USER_FUNC_PALETTE[index % USER_FUNC_PALETTE.length] };
    })
    .filter((item): item is FuncChartRow => Boolean(item));
};

const normalizeRegChartData = (payload: unknown): RegChartRow[] => {
  const list = unwrapList(payload, ['data', 'result', 'registrations', 'months', 'users']);

  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const month = getString(record, ['month', 'month_name', 'm', 'label', 'name', 'date']);
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
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
}

async function fetchUserStatistics(type: string, extraParams?: Record<string, string>): Promise<unknown> {
  return fetchMsafeUserDashboardJson('user_statistics.json', { type, ...extraParams });
}

// --- KRCC (msafe_krcc_dashboard) — mirrors KrccSection.tsx ---

type CircleBar = { name: string; pct: number; color: string };

const KRCC_SLICE_PALETTE = [C.terra, C.ok, C.vi, C.warn, C.sage, C.blue, C.teal, C.lav, '#B4A38A'];

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
      return { name, value, color: KRCC_SLICE_PALETTE[index % KRCC_SLICE_PALETTE.length] };
    })
    .filter((item): item is Slice => Boolean(item));
}

// --- LMC (msafe_lmc_dashboard) — mirrors LmcSection.tsx ---

type DailyRow = { d: string; n: number };
type DailyCircleRow = { date: string; circle: string; volume: number };
type TrendRow = { m: string; n: number };

const LMC_SLICE_PALETTE = [C.terra, C.sage, C.blue, C.teal, C.warn, C.err, C.lav, C.ok, '#B4A38A'];

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

function normalizeDailyVolume(rows: DailyCircleRow[]): DailyRow[] {
  const totals = new Map<string, number>();
  const order: string[] = [];
  for (const row of rows) {
    if (!totals.has(row.date)) order.push(row.date);
    totals.set(row.date, (totals.get(row.date) ?? 0) + row.volume);
  }
  return order.map((d) => ({ d, n: totals.get(d) ?? 0 }));
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
      return { name, value, color: LMC_SLICE_PALETTE[index % LMC_SLICE_PALETTE.length] };
    })
    .filter((item): item is Slice => Boolean(item));
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

// --- Training (msafe_tranning_dashboard) — mirrors TrainingSection.tsx ---

type TrainSlice = Slice;

const TRAIN_CHART_PALETTE = [C.terra, C.blue, C.vi, C.sage, C.lav, C.warn, C.err, C.ok, '#B4A38A'];

function unwrapRecord(payload: unknown, keys: string[]): Record<string, unknown> {
  const root = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  for (const key of keys) {
    const nested = root[key];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) return nested as Record<string, unknown>;
  }
  return root;
}

function getNumberOrPercent(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    if (typeof raw === 'string' && raw.trim()) {
      const parsed = Number(raw.replace('%', '').trim());
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function normalizeTrainPassFail(payload: unknown): { slices: TrainSlice[]; passRate: string | null } {
  const record = unwrapRecord(payload, ['overall', 'data', 'result']);

  const pass = getNumberOrPercent(record, ['pass', 'passed', 'total_pass', 'pass_count']);
  const fail = getNumberOrPercent(record, ['fail', 'failed', 'total_fail', 'fail_count']);
  const pending = getNumberOrPercent(record, ['pending', 'pending_count', 'total_pending']);

  const slices: TrainSlice[] = [];
  if (pass !== null) slices.push({ name: 'Pass', value: pass, color: C.ok });
  if (fail !== null) slices.push({ name: 'Fail', value: fail, color: C.vi });
  if (pending !== null) slices.push({ name: 'Pending', value: pending, color: C.warn });

  const rawRate = getNumberOrPercent(record, ['pass_rate', 'pass_percentage', 'passing_percentage']);
  const passRate =
    rawRate !== null
      ? `${rawRate}%`
      : pass !== null && fail !== null && pass + fail > 0
        ? `${((pass / (pass + fail)) * 100).toFixed(1)}%`
        : null;

  return { slices, passRate };
}

const normalizeTrainingCounts = (payload: unknown): TrainSlice[] => {
  const list = unwrapList(payload, ['data', 'result', 'categories', 'training_categories', 'records']);

  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;

      const name = getString(record, [
        'training_category',
        'category_name',
        'training_name',
        'name',
        'label',
        'title',
      ]);
      if (!name) return null;

      const value = getNumber(record, ['count', 'value', 'total', 'total_count', 'completed', 'training_count']);
      if (value === null) return null;

      return { name, value, color: TRAIN_CHART_PALETTE[index % TRAIN_CHART_PALETTE.length] };
    })
    .filter((item): item is TrainSlice => Boolean(item));
};

// --- SMT (msafe_smt_visit_dashboard) — mirrors SmtSection.tsx ---

type CircleRow = { name: string; n: number };

const SMT_SLICE_PALETTE = [C.sage, C.terra, C.blue, C.teal, C.warn, C.lav, C.err, C.ok, '#B4A38A'];

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
      return { name, value, color: SMT_SLICE_PALETTE[index % SMT_SLICE_PALETTE.length] };
    })
    .filter((item): item is Slice => Boolean(item));
}

// ---------------------------------------------------------------------------
// DataState — same loading/empty placeholder pattern used by every section
// file (KrccSection.tsx, LmcSection.tsx, TrainingSection.tsx, SmtSection.tsx,
// UsersSection.tsx all define this identically).
// ---------------------------------------------------------------------------

function DataState({ loading, empty, label }: { loading: boolean; empty: boolean; label: string }) {
  if (!loading && !empty) return null;
  return (
    <div style={{ fontSize: 12, color: C.sage, padding: '24px 0', textAlign: 'center' }}>
      {loading ? 'Loading…' : `No ${label} available`}
    </div>
  );
}

type ChartData = {
  userComp: Slice[];
  userCompLoading: boolean;
  userReg: RegChartRow[];
  userRegLoading: boolean;
  circleUsers: CircleChartRow[];
  circleUsersLoading: boolean;
  userFunc: FuncChartRow[];
  userFuncLoading: boolean;
  krccCircle: CircleBar[];
  krccCircleLoading: boolean;
  krccCategory: Slice[];
  krccCategoryLoading: boolean;
  lmcDaily: DailyRow[];
  lmcDailyLoading: boolean;
  lmcFunc: Slice[];
  lmcFuncLoading: boolean;
  lmcTrend12mo: TrendRow[];
  lmcTrend12moLoading: boolean;
  trainPF: TrainSlice[];
  trainPFLoading: boolean;
  trainCategory: TrainSlice[];
  trainCategoryLoading: boolean;
  smtCircle: CircleRow[];
  smtCircleLoading: boolean;
  smtFunc: Slice[];
  smtFuncLoading: boolean;
};

function ChartById({ id, data }: { id: string; data: ChartData }) {
  if (id === 'userComp') {
    return data.userCompLoading || data.userComp.length === 0 ? (
      <DataState loading={data.userCompLoading} empty={data.userComp.length === 0} label="composition data" />
    ) : (
      <DonutChart data={data.userComp} height={Math.max(180, data.userComp.length * 22)} />
    );
  }
  if (id === 'userFunc') {
    return data.userFuncLoading || data.userFunc.length === 0 ? (
      <DataState loading={data.userFuncLoading} empty={data.userFunc.length === 0} label="department data" />
    ) : (
      <DonutChart data={data.userFunc} height={Math.max(180, data.userFunc.length * 22)} />
    );
  }
  if (id === 'krccCategory') {
    return data.krccCategoryLoading || data.krccCategory.length === 0 ? (
      <DataState loading={data.krccCategoryLoading} empty={data.krccCategory.length === 0} label="category data" />
    ) : (
      <DonutChart data={data.krccCategory} height={Math.max(180, data.krccCategory.length * 22)} />
    );
  }
  if (id === 'lmcFunc') {
    return data.lmcFuncLoading || data.lmcFunc.length === 0 ? (
      <DataState loading={data.lmcFuncLoading} empty={data.lmcFunc.length === 0} label="function data" />
    ) : (
      <DonutChart data={data.lmcFunc} height={Math.max(180, data.lmcFunc.length * 22)} />
    );
  }
  if (id === 'trainPF') {
    return data.trainPFLoading || data.trainPF.length === 0 ? (
      <DataState loading={data.trainPFLoading} empty={data.trainPF.length === 0} label="pass/fail data" />
    ) : (
      <DonutChart data={data.trainPF} height={Math.max(180, data.trainPF.length * 22)} />
    );
  }
  if (id === 'trainCategory') {
    return data.trainCategoryLoading || data.trainCategory.length === 0 ? (
      <DataState loading={data.trainCategoryLoading} empty={data.trainCategory.length === 0} label="category data" />
    ) : (
      <DonutChart data={data.trainCategory} height={Math.max(180, data.trainCategory.length * 22)} />
    );
  }
  if (id === 'smtFunc') {
    return data.smtFuncLoading || data.smtFunc.length === 0 ? (
      <DataState loading={data.smtFuncLoading} empty={data.smtFunc.length === 0} label="function visit data" />
    ) : (
      <DonutChart data={data.smtFunc} height={Math.max(180, data.smtFunc.length * 22)} />
    );
  }

  if (id === 'userReg') {
    return data.userRegLoading || data.userReg.length === 0 ? (
      <DataState loading={data.userRegLoading} empty={data.userReg.length === 0} label="registration data" />
    ) : (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data.userReg}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="m" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Line type="monotone" dataKey="n" stroke={C.terra} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'lmcDaily') {
    return data.lmcDailyLoading || data.lmcDaily.length === 0 ? (
      <DataState loading={data.lmcDailyLoading} empty={data.lmcDaily.length === 0} label="daily volume data" />
    ) : (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data.lmcDaily}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="d" tick={{ fontSize: 8 }} interval={5} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Line type="monotone" dataKey="n" stroke={C.vi} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'lmcTrend12mo') {
    return data.lmcTrend12moLoading || data.lmcTrend12mo.length === 0 ? (
      <DataState loading={data.lmcTrend12moLoading} empty={data.lmcTrend12mo.length === 0} label="trend data" />
    ) : (
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data.lmcTrend12mo}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="m" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Line type="monotone" dataKey="n" stroke={C.sage} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'circleUsers') {
    return data.circleUsersLoading || data.circleUsers.length === 0 ? (
      <DataState loading={data.circleUsersLoading} empty={data.circleUsers.length === 0} label="circle data" />
    ) : (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data.circleUsers} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="name" tick={{ fontSize: 8 }} interval={0} angle={-35} textAnchor="end" height={56} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="Internal" stackId="a" fill={C.blue} />
          <Bar dataKey="External" stackId="a" fill={C.terra} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'krccCircle') {
    return data.krccCircleLoading || data.krccCircle.length === 0 ? (
      <DataState loading={data.krccCircleLoading} empty={data.krccCircle.length === 0} label="circle data" />
    ) : (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data.krccCircle}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="name" tick={{ fontSize: 9 }} />
          <YAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
            {data.krccCircle.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (id === 'smtCircle') {
    return data.smtCircleLoading || data.smtCircle.length === 0 ? (
      <DataState loading={data.smtCircleLoading} empty={data.smtCircle.length === 0} label="circle visit data" />
    ) : (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data.smtCircle}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
          <XAxis dataKey="name" tick={{ fontSize: 8 }} interval={0} angle={-25} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 9 }} />
          <Tooltip />
          <Bar dataKey="n" fill={C.lav} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return <div style={{ padding: 24, color: 'var(--sage)' }}>Chart preview</div>;
}

export function MyDashboardSection() {
  const { selectedAnalytics, setSelectedAnalytics, setAnalyticsOpen, persona, appliedFilters } = useMsafeDashboard();

  const items = ANALYTICS_CATALOG.items.filter((i) => selectedAnalytics.includes(i.id));

  // --- KPI values (shared kpi.json call feeds all 5 KPI cards) ---
  const [kpiApiData, setKpiApiData] = useState<Record<string, KpiApiValue>>({});
  const [kpiLoading, setKpiLoading] = useState(false);

  useEffect(() => {
    const needed = Object.keys(KPI_ID_TO_FIELD).some((id) => selectedAnalytics.includes(id));
    if (!needed) return;
    const controller = new AbortController();
    setKpiLoading(true);
    (async () => {
      try {
        const data = await fetchMsafeTrainingJson('kpi.json', buildKpiFilterParams(persona, appliedFilters), controller.signal);
        const record = unwrapKpiRecord(data);
        const next: Record<string, KpiApiValue> = {};
        for (const [id, map] of Object.entries(KPI_FIELD_MAP)) {
          const value = pickValue(record, map.valueKeys, map.valueType);
          if (!value) continue;
          const sub = map.subKeys ? pickPercentageSub(record, map.subKeys) : undefined;
          next[id] = { value, sub };
        }
        if (!controller.signal.aborted) setKpiApiData(next);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('My Dashboard kpi.json fetch failed.', err);
      } finally {
        if (!controller.signal.aborted) setKpiLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- User Composition (Internal vs External) ---
  const [userComp, setUserComp] = useState<Slice[]>([]);
  const [userCompLoading, setUserCompLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('userComp')) return;
    let isMounted = true;
    setUserCompLoading(true);
    (async () => {
      try {
        const payload = await fetchUserStatistics('composition', buildFilterParams(persona, appliedFilters));
        const normalized = normalizeStatSlices(
          payload,
          ['user_composition', 'data', 'result', 'composition', 'employment_types', 'types', 'users_by_department', 'departments', 'users'],
          ['employee_type', 'employment_type', 'type_name', 'category', 'department', 'department_name', 'name', 'label', 'title'],
          ['user_count', 'count', 'value', 'total', 'total_users', 'users', 'users_count', 'department_count'],
        );
        if (isMounted) setUserComp(normalized);
      } catch (error) {
        console.warn('My Dashboard user-composition fetch failed.', error);
      } finally {
        if (isMounted) setUserCompLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- New Registrations — Last 12 Months ---
  const [userReg, setUserReg] = useState<RegChartRow[]>([]);
  const [userRegLoading, setUserRegLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('userReg')) return;
    let isMounted = true;
    setUserRegLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeUserDashboardJson('new_registrations.json', buildFilterParams(persona, appliedFilters));
        if (isMounted) setUserReg(normalizeRegChartData(payload));
      } catch (error) {
        console.warn('My Dashboard new-registrations fetch failed.', error);
      } finally {
        if (isMounted) setUserRegLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- Users per Circle ---
  const [circleUsers, setCircleUsers] = useState<CircleChartRow[]>([]);
  const [circleUsersLoading, setCircleUsersLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('circleUsers')) return;
    let isMounted = true;
    setCircleUsersLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeUserDashboardJson('users_by_circle.json', buildFilterParams(persona, appliedFilters));
        if (isMounted) setCircleUsers(normalizeCircleChartData(payload));
      } catch (error) {
        console.warn('My Dashboard users-by-circle fetch failed.', error);
      } finally {
        if (isMounted) setCircleUsersLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- Users by Department / Function ---
  const [userFunc, setUserFunc] = useState<FuncChartRow[]>([]);
  const [userFuncLoading, setUserFuncLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('userFunc')) return;
    let isMounted = true;
    setUserFuncLoading(true);
    (async () => {
      try {
        const payload = await fetchUserStatistics('department', buildFilterParams(persona, appliedFilters));
        const normalized = normalizeStatSlices(
          payload,
          ['users_by_department', 'data', 'result', 'departments', 'users'],
          ['department', 'department_name', 'function_name', 'name', 'label', 'title'],
          ['user_count', 'count', 'value', 'total', 'total_users', 'users', 'users_count', 'department_count'],
        );
        if (isMounted) setUserFunc(normalized);
      } catch (error) {
        console.warn('My Dashboard user statistics (department) fetch failed.', error);
      } finally {
        if (isMounted) setUserFuncLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- KRCC Clearance % by Circle ---
  const [krccCircle, setKrccCircle] = useState<CircleBar[]>([]);
  const [krccCircleLoading, setKrccCircleLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('krccCircle')) return;
    const controller = new AbortController();
    setKrccCircleLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeKrccJson(
          'krcc_cleared_user_percentage_by_circle.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setKrccCircle(normalizeClearanceByCircle(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('My Dashboard krcc-cleared-user-percentage fetch failed.', err);
      } finally {
        if (!controller.signal.aborted) setKrccCircleLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- KRCC Cleared by Category ---
  const [krccCategory, setKrccCategory] = useState<Slice[]>([]);
  const [krccCategoryLoading, setKrccCategoryLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('krccCategory')) return;
    const controller = new AbortController();
    setKrccCategoryLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeKrccJson(
          'krcc_cleared_by_category.json',
          buildFilterParams(persona, appliedFilters),
          controller.signal,
        );
        if (!controller.signal.aborted) setKrccCategory(normalizeCategory(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('My Dashboard krcc-cleared-by-category fetch failed.', err);
      } finally {
        if (!controller.signal.aborted) setKrccCategoryLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- Daily LMC Volume — Last 30 Days ---
  const [lmcDaily, setLmcDaily] = useState<DailyRow[]>([]);
  const [lmcDailyLoading, setLmcDailyLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('lmcDaily')) return;
    const controller = new AbortController();
    setLmcDailyLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeLmcJson('daily_lmc_volume.json', buildFilterParams(persona, appliedFilters), controller.signal);
        if (!controller.signal.aborted) setLmcDaily(normalizeDailyVolume(normalizeDailyVolumeByCircle(payload)));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('My Dashboard daily-lmc-volume fetch failed.', err);
      } finally {
        if (!controller.signal.aborted) setLmcDailyLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- LMC by Function ---
  const [lmcFunc, setLmcFunc] = useState<Slice[]>([]);
  const [lmcFuncLoading, setLmcFuncLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('lmcFunc')) return;
    const controller = new AbortController();
    setLmcFuncLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeLmcJson('lmc_signoffs_by_function.json', buildFilterParams(persona, appliedFilters), controller.signal);
        if (!controller.signal.aborted) setLmcFunc(normalizeByFunction(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('My Dashboard lmc-signoffs-by-function fetch failed.', err);
      } finally {
        if (!controller.signal.aborted) setLmcFuncLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- LMC Completion Trend — 12 Months ---
  const [lmcTrend12mo, setLmcTrend12mo] = useState<TrendRow[]>([]);
  const [lmcTrend12moLoading, setLmcTrend12moLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('lmcTrend12mo')) return;
    const controller = new AbortController();
    setLmcTrend12moLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeLmcJson('monthly_lmc_signoff_volume.json', buildFilterParams(persona, appliedFilters), controller.signal);
        if (!controller.signal.aborted) setLmcTrend12mo(normalizeMonthlyTrend(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('My Dashboard monthly-lmc-signoff-volume fetch failed.', err);
      } finally {
        if (!controller.signal.aborted) setLmcTrend12moLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- Training Pass vs Fail Rate ---
  const [trainPF, setTrainPF] = useState<TrainSlice[]>([]);
  const [trainPFLoading, setTrainPFLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('trainPF')) return;
    let isMounted = true;
    setTrainPFLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeTrainingJson('training_pass_fail_stats.json', {
          type: 'pass_vs_fail',
          ...buildFilterParams(persona, appliedFilters),
        });
        const { slices } = normalizeTrainPassFail(payload);
        if (isMounted) setTrainPF(slices);
      } catch (error) {
        console.warn('My Dashboard training-pass-fail-stats fetch failed.', error);
      } finally {
        if (isMounted) setTrainPFLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- Category-wise Trainings ---
  const [trainCategory, setTrainCategory] = useState<TrainSlice[]>([]);
  const [trainCategoryLoading, setTrainCategoryLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('trainCategory')) return;
    let isMounted = true;
    setTrainCategoryLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeTrainingJson('category_wise_training_count.json', buildFilterParams(persona, appliedFilters));
        if (isMounted) setTrainCategory(normalizeTrainingCounts(payload));
      } catch (error) {
        console.warn('My Dashboard category-wise-training-count fetch failed.', error);
      } finally {
        if (isMounted) setTrainCategoryLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- SMT Visits by Circle ---
  const [smtCircle, setSmtCircle] = useState<CircleRow[]>([]);
  const [smtCircleLoading, setSmtCircleLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('smtCircle')) return;
    const controller = new AbortController();
    setSmtCircleLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson('visits_per_circle.json', buildFilterParams(persona, appliedFilters), controller.signal);
        if (!controller.signal.aborted) setSmtCircle(normalizeVisitsPerCircle(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('My Dashboard visits-per-circle fetch failed.', err);
      } finally {
        if (!controller.signal.aborted) setSmtCircleLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedAnalytics, persona, appliedFilters]);

  // --- SMT Visits by Function ---
  const [smtFunc, setSmtFunc] = useState<Slice[]>([]);
  const [smtFuncLoading, setSmtFuncLoading] = useState(false);
  useEffect(() => {
    if (!selectedAnalytics.includes('smtFunc')) return;
    const controller = new AbortController();
    setSmtFuncLoading(true);
    (async () => {
      try {
        const payload = await fetchMsafeSmtJson('visits_per_department.json', buildFilterParams(persona, appliedFilters), controller.signal);
        if (!controller.signal.aborted) setSmtFunc(normalizeVisitsPerDepartment(payload));
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.warn('My Dashboard visits-per-department fetch failed.', err);
      } finally {
        if (!controller.signal.aborted) setSmtFuncLoading(false);
      }
    })();
    return () => controller.abort();
  }, [selectedAnalytics, persona, appliedFilters]);

  const chartData: ChartData = {
    userComp,
    userCompLoading,
    userReg,
    userRegLoading,
    circleUsers,
    circleUsersLoading,
    userFunc,
    userFuncLoading,
    krccCircle,
    krccCircleLoading,
    krccCategory,
    krccCategoryLoading,
    lmcDaily,
    lmcDailyLoading,
    lmcFunc,
    lmcFuncLoading,
    lmcTrend12mo,
    lmcTrend12moLoading,
    trainPF,
    trainPFLoading,
    trainCategory,
    trainCategoryLoading,
    smtCircle,
    smtCircleLoading,
    smtFunc,
    smtFuncLoading,
  };

  const kpiValueFor = (id: string) => {
    const field = KPI_ID_TO_FIELD[id];
    const api = field ? kpiApiData[field] : undefined;
    if (kpiLoading && !api) return '…';
    if (!api) return '—';
    return api.sub ? `${api.value} ${api.sub}` : api.value;
  };

  return (
    <>
      <div className="page-hd mydash-hd">
        <div>
          <h2>My Dashboard</h2>
          <div className="sub">Your personalized view · pick any metric or chart from M-Safe</div>
        </div>
        <button type="button" className="select-analytics-btn" onClick={() => setAnalyticsOpen(true)}>
          <Plus size={15} />
          Select Analytics
        </button>
      </div>

      {!items.length ? (
        <div className="mydash-empty">
          <LayoutDashboard size={48} />
          <div className="t">No analytics selected yet</div>
          <div className="s">
            Build your own view by picking any KPI or chart from M-Safe. They&apos;ll show up here, live.
          </div>
          <button type="button" className="select-analytics-btn" onClick={() => setAnalyticsOpen(true)}>
            <Plus size={15} />
            Select Analytics
          </button>
        </div>
      ) : (
        <div className="mydash-grid">
          {items.map((it) =>
            it.type === 'kpi' ? (
              <div key={it.id} className="kpi">
                <button
                  type="button"
                  className="mydash-card-remove"
                  onClick={() => setSelectedAnalytics(selectedAnalytics.filter((x) => x !== it.id))}
                  aria-label="Remove"
                >
                  <X size={12} />
                </button>
                <div className="kpi-top">
                  <div className="kpi-lbl">{it.label}</div>
                </div>
                <div className="kpi-val">{kpiValueFor(it.id)}</div>
                <span className="mydash-module-tag">M-Safe</span>
              </div>
            ) : (
              <div key={it.id} className="card mydash-chart-card">
                <button
                  type="button"
                  className="mydash-card-remove"
                  onClick={() => setSelectedAnalytics(selectedAnalytics.filter((x) => x !== it.id))}
                  aria-label="Remove"
                >
                  <X size={12} />
                </button>
                <div className="card-hd">
                  <div>
                    <div className="card-title">{it.label}</div>
                    <span className="mydash-module-tag">M-Safe</span>
                  </div>
                </div>
                <div className="chart-wrap" style={{ maxHeight: 320, overflowY: 'auto' }}>
                  <ChartById id={it.id} data={chartData} />
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <div className="footer">
        My Dashboard · GoPhygital / Lockated for Vodafone Idea · July 2026
      </div>
    </>
  );
}
