import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { AccordionShell, ChartCard } from '../components/ChartCard';
import { ChartSwitch } from '../components/ChartSwitch';
import { ChartTable, DonutChart, SideLegendDonut, SliceBarChart } from '../components/DonutChart';
import { C } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import type { Persona } from '../data/constants';

type TrainSlice = { name: string; value: number; color: string };

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

function formatPct(n: number | null): string | null {
  return n !== null ? `${n}%` : null;
}

/** Reads a `{ count, rate }` sub-object (the current API shape for pass/fail/pending),
 *  falling back to a flat number/string field directly on the record (older shape). */
function getGroupCount(record: Record<string, unknown>, key: string, flatKeys: string[]): number | null {
  const group = record[key];
  if (group && typeof group === 'object' && !Array.isArray(group)) {
    const count = getNumberOrPercent(group as Record<string, unknown>, ['count']);
    if (count !== null) return count;
  }
  return getNumberOrPercent(record, flatKeys);
}

function getGroupRate(record: Record<string, unknown>, key: string): string | null {
  const group = record[key];
  if (group && typeof group === 'object' && !Array.isArray(group)) {
    const rate = getNumberOrPercent(group as Record<string, unknown>, ['rate']);
    if (rate !== null) return `${rate}%`;
  }
  return null;
}

type TrainPFSlice = TrainSlice & { rate: string | null };

function normalizeTrainPassFail(payload: unknown): { slices: TrainPFSlice[]; passRate: string | null } {
  const record = unwrapRecord(payload, ['overall', 'data', 'result']);

  const pass = getGroupCount(record, 'pass', ['passed', 'total_pass', 'pass_count']);
  const fail = getGroupCount(record, 'fail', ['failed', 'total_fail', 'fail_count']);
  const pending = getGroupCount(record, 'pending', ['pending_count', 'total_pending']);

  const slices: TrainPFSlice[] = [];
  if (pass !== null) slices.push({ name: 'Pass', value: pass, color: C.ok, rate: getGroupRate(record, 'pass') });
  if (fail !== null) slices.push({ name: 'Fail', value: fail, color: C.vi, rate: getGroupRate(record, 'fail') });
  if (pending !== null)
    slices.push({ name: 'Pending', value: pending, color: C.warn, rate: getGroupRate(record, 'pending') });

  const flatRate = getNumberOrPercent(record, ['pass_rate', 'pass_percentage', 'passing_percentage']);
  const passRate =
    getGroupRate(record, 'pass') ??
    (flatRate !== null ? `${flatRate}%` : null) ??
    (pass !== null && fail !== null && pass + fail > 0
      ? `${((pass / (pass + fail)) * 100).toFixed(1)}%`
      : null);

  return { slices, passRate };
}

type PassFailGroup = { group: string; rows: { label: string; pct: number; val: string; color: string }[] };

function pickNestedRecord(root: Record<string, unknown>, keys: string[]): Record<string, unknown> | null {
  for (const key of keys) {
    const nested = root[key];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) return nested as Record<string, unknown>;
  }
  return null;
}

function extractPassFailGroup(record: Record<string, unknown>, groupLabel: string): PassFailGroup | null {
  // Groups now carry pass/fail/pending as { count, rate } sub-objects (same shape
  // as the overall training_pass_fail_stats.json response) — fall back to flat
  // number/string fields for the older shape.
  const pass = getGroupCount(record, 'pass', ['passed', 'total_pass', 'pass_count']);
  const fail = getGroupCount(record, 'fail', ['failed', 'total_fail', 'fail_count']);
  const pending = getGroupCount(record, 'pending', ['pending_count', 'total_pending']);
  if (pass === null && fail === null && pending === null) return null;

  const total = getNumberOrPercent(record, ['total', 'total_count', 'total_users']);
  const denom = pass !== null && fail !== null ? pass + fail + (pending ?? 0) : total;

  const rawPassRate = getGroupRate(record, 'pass') ?? formatPct(getNumberOrPercent(record, ['pass_rate', 'pass_percentage', 'passing_percentage']));
  const rawFailRate = getGroupRate(record, 'fail') ?? formatPct(getNumberOrPercent(record, ['fail_rate', 'fail_percentage', 'failing_percentage']));
  const rawPendingRate = getGroupRate(record, 'pending') ?? formatPct(getNumberOrPercent(record, ['pending_rate', 'pending_percentage']));
  const passPct = rawPassRate !== null ? parseFloat(rawPassRate) : denom && pass !== null ? Math.round((pass / denom) * 1000) / 10 : 0;
  const failPct = rawFailRate !== null ? parseFloat(rawFailRate) : denom && fail !== null ? Math.round((fail / denom) * 1000) / 10 : 0;
  const pendingPct = rawPendingRate !== null ? parseFloat(rawPendingRate) : denom && pending !== null ? Math.round((pending / denom) * 1000) / 10 : 0;

  const label = total !== null ? `${groupLabel} (n=${total.toLocaleString('en-IN')})` : groupLabel;

  const rows: { label: string; pct: number; val: string; color: string }[] = [];
  if (pass !== null) rows.push({ label: 'Pass', pct: passPct, val: `${passPct}%`, color: C.ok });
  if (fail !== null) rows.push({ label: 'Fail', pct: failPct, val: `${failPct}%`, color: C.vi });
  if (pending !== null) rows.push({ label: 'Pending', pct: pendingPct, val: `${pendingPct}%`, color: C.warn });

  return { group: label, rows };
}

function normalizeInternalExternalPassFail(payload: unknown): PassFailGroup[] {
  const root = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const internalRecord = pickNestedRecord(root, ['internal', 'internal_fte', 'internal_users']);
  const externalRecord = pickNestedRecord(root, ['external', 'external_non_fte', 'external_users']);

  const groups: PassFailGroup[] = [];
  const internalGroup = internalRecord && extractPassFailGroup(internalRecord, 'INTERNAL FTE');
  if (internalGroup) groups.push(internalGroup);
  const externalGroup = externalRecord && extractPassFailGroup(externalRecord, 'EXTERNAL NON-FTE');
  if (externalGroup) groups.push(externalGroup);

  // The API doesn't always split by internal/external (it can return the same
  // overall { pass, fail, pending } shape regardless of type=internal_external) —
  // show that single overall group rather than rendering nothing.
  if (groups.length === 0) {
    const overallGroup = extractPassFailGroup(root, 'ALL USERS');
    if (overallGroup) groups.push(overallGroup);
  }

  return groups;
}

// Carries the full pass/fail/pending breakdown directly on each chart slice
// (rather than a separate array cross-referenced by category name) so the
// donut/bar tooltip can read it straight off the exact slice being hovered.
type TrainCategorySlice = TrainSlice & {
  pass: number;
  fail: number;
  pending: number;
  passPercentage: number | null;
  failPercentage: number | null;
  pendingPercentage: number | null;
  total: number;
};

function getNum(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    if (typeof raw === 'string' && raw.trim() && Number.isFinite(Number(raw))) return Number(raw);
  }
  return null;
}

// pass/fail/pending are { count, percentage } sub-objects in the current API
// shape — fall back to a flat number field directly on the record for older shapes.
function getGroupCountPct(record: Record<string, unknown>, key: string, flatKeys: string[]): number {
  const group = record[key];
  if (group && typeof group === 'object' && !Array.isArray(group)) {
    const count = getNum(group as Record<string, unknown>, ['count']);
    if (count !== null) return count;
  }
  return getNum(record, flatKeys) ?? 0;
}

function getGroupPct(record: Record<string, unknown>, key: string): number | null {
  const group = record[key];
  if (group && typeof group === 'object' && !Array.isArray(group)) {
    return getNum(group as Record<string, unknown>, ['percentage', 'pct']);
  }
  return null;
}

function unwrapTrainingList(payload: unknown, extraKeys: string[]): unknown[] {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  if (Array.isArray(source)) return source;
  for (const key of ['data', 'result', ...extraKeys]) {
    const candidate = (source as Record<string, unknown>)?.[key];
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

const normalizeTrainingCounts = (payload: unknown): TrainCategorySlice[] => {
  const list = unwrapTrainingList(payload, ['categories', 'training_categories', 'records']);

  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;

      const name = [
        record.training_category,
        record.category_name,
        record.training_name,
        record.name,
        record.label,
        record.title,
      ].find((value): value is string => typeof value === 'string' && value.trim().length > 0);
      if (!name) return null;

      const pass = getGroupCountPct(record, 'pass', ['passed', 'completed']);
      const fail = getGroupCountPct(record, 'fail', ['failed']);
      const pending = getGroupCountPct(record, 'pending', ['pending_assessment']);
      const total = getNum(record, ['total', 'total_count']) ?? pass + fail + pending;

      // Chart value: prefer an explicit flat count/value field (older shape),
      // otherwise fall back to the category's total training volume.
      const value = getNum(record, ['count', 'value']) ?? total;

      return {
        name,
        value,
        color: TRAIN_CHART_PALETTE[index % TRAIN_CHART_PALETTE.length],
        pass,
        fail,
        pending,
        total,
        passPercentage: getGroupPct(record, 'pass'),
        failPercentage: getGroupPct(record, 'fail'),
        pendingPercentage: getGroupPct(record, 'pending'),
      };
    })
    .filter((item): item is TrainCategorySlice => Boolean(item));
};

// function_wise_training_status.json nests separate internal/external breakdowns
// per function — pick the requested scope's sub-object for each row.
function normalizeFunctionTrainingStatus(payload: unknown, scope: 'internal' | 'external'): TrainCategorySlice[] {
  const list = unwrapTrainingList(payload, ['functions', 'records']);

  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = [record.function_name, record.name, record.label].find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0,
      );
      if (!name) return null;

      const scoped = record[scope];
      if (!scoped || typeof scoped !== 'object' || Array.isArray(scoped)) return null;
      const s = scoped as Record<string, unknown>;

      const pass = getGroupCountPct(s, 'pass', []);
      const fail = getGroupCountPct(s, 'fail', []);
      const pending = getGroupCountPct(s, 'pending', []);
      const total = getNum(s, ['total']) ?? pass + fail + pending;

      return {
        name,
        value: total,
        color: TRAIN_CHART_PALETTE[index % TRAIN_CHART_PALETTE.length],
        pass,
        fail,
        pending,
        total,
        passPercentage: getGroupPct(s, 'pass'),
        failPercentage: getGroupPct(s, 'fail'),
        pendingPercentage: getGroupPct(s, 'pending'),
      };
    })
    .filter((item): item is TrainCategorySlice => Boolean(item));
}

// circle_wise_training_status.json is flat (no internal/external split) — one
// row per circle with its own pass/fail/pending breakdown.
function normalizeCircleTrainingStatus(payload: unknown): TrainCategorySlice[] {
  const list = unwrapTrainingList(payload, ['circles', 'records']);

  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = [record.circle_name, record.name, record.label].find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0,
      );
      if (!name) return null;

      const pass = getGroupCountPct(record, 'pass', []);
      const fail = getGroupCountPct(record, 'fail', []);
      const pending = getGroupCountPct(record, 'pending', []);
      const total = getNum(record, ['total']) ?? pass + fail + pending;

      return {
        name,
        value: total,
        color: TRAIN_CHART_PALETTE[index % TRAIN_CHART_PALETTE.length],
        pass,
        fail,
        pending,
        total,
        passPercentage: getGroupPct(record, 'pass'),
        failPercentage: getGroupPct(record, 'fail'),
        pendingPercentage: getGroupPct(record, 'pending'),
      };
    })
    .filter((item): item is TrainCategorySlice => Boolean(item));
}

type ScoreBucket = { bucket: string; n: number; color: string };
type TrainFailure = { user: string; tr: string; type: 'Internal' | 'External'; date: string; score: string };

function colorForScoreBucket(bucket: string): string {
  const nums = bucket.match(/\d+/g)?.map(Number) ?? [];
  const upper = nums.length ? Math.max(...nums) : 0;
  if (upper <= 40) return '#E7848E';
  if (upper <= 60) return '#EDC488';
  if (upper <= 80) return '#9EC8BA';
  return '#108C72';
}

const normalizeScoreDistribution = (payload: unknown): ScoreBucket[] => {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  let list: unknown[] = Array.isArray(source) ? source : [];
  if (!Array.isArray(source)) {
    for (const key of ['training_score_distribution', 'data', 'result', 'buckets', 'distribution', 'scores']) {
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

      const bucket = [record.bucket, record.range, record.score_range, record.label, record.name].find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0,
      );
      if (!bucket) return null;

      let n: number | null = null;
      for (const key of ['count', 'value', 'n', 'total', 'users_count', 'training_count']) {
        const raw = record[key];
        if (typeof raw === 'number' && Number.isFinite(raw)) {
          n = raw;
          break;
        }
        if (typeof raw === 'string' && raw.trim() && Number.isFinite(Number(raw))) {
          n = Number(raw);
          break;
        }
      }
      if (n === null) return null;

      return { bucket, n, color: colorForScoreBucket(bucket) };
    })
    .filter((item): item is ScoreBucket => Boolean(item));
};

function mapEmploymentType(raw: unknown): 'Internal' | 'External' {
  const s = String(raw ?? '').trim().toLowerCase();
  if (/external|contractor|vendor|non[- ]?fte/.test(s)) return 'External';
  return 'Internal';
}

function formatDateDisplay(raw: string): string {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw;
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const normalizeTrainingFailures = (payload: unknown): TrainFailure[] => {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  let list: unknown[] = Array.isArray(source) ? source : [];
  if (!Array.isArray(source)) {
    for (const key of ['data', 'result', 'failures', 'records', 'users']) {
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

      const user = [record.user, record.user_name, record.employee_name, record.name, record.emp_name].find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0,
      );
      if (!user) return null;

      const tr =
        [record.category, record.training_name, record.training, record.tr, record.programme_name].find(
          (value): value is string => typeof value === 'string' && value.trim().length > 0,
        ) ?? '—';

      const rawDate = [record.date, record.failed_date, record.training_date, record.created_at].find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0,
      );
      const date = rawDate ? formatDateDisplay(rawDate) : '—';

      let score: string | null = null;
      for (const key of ['score', 'marks', 'result_score', 'obtained_score']) {
        const raw = record[key];
        if (typeof raw === 'number' && Number.isFinite(raw)) {
          score = String(raw);
          break;
        }
        if (typeof raw === 'string' && raw.trim()) {
          score = raw.trim();
          break;
        }
      }
      if (score === null) return null;

      const type = mapEmploymentType(record.employment_type ?? record.type ?? record.user_type);

      return { user, tr, type, date, score };
    })
    .filter((item): item is TrainFailure => Boolean(item));
};

function DataState({ loading, empty, label }: { loading: boolean; empty: boolean; label: string }) {
  if (!loading && !empty) return null;
  return (
    <div style={{ fontSize: 12, color: C.sage, padding: '24px 0', textAlign: 'center' }}>
      {loading ? 'Loading…' : `No ${label} available`}
    </div>
  );
}

export function TrainingSection() {
  const { openDrill, persona, appliedFilters } = useMsafeDashboard();
  const [pfMode, setPfMode] = useState('donut');
  const [catMode, setCatMode] = useState('donut');
  const [catTab, setCatTab] = useState<'internal' | 'external'>('internal');
  const [pfData, setPfData] = useState<TrainPFSlice[]>([]);
  const [pfRate, setPfRate] = useState<string | null>(null);
  const [pfLoading, setPfLoading] = useState(true);
  const [intExtData, setIntExtData] = useState<PassFailGroup[]>([]);
  const [intExtLoading, setIntExtLoading] = useState(true);
  const [trainByNameData, setTrainByNameData] = useState<TrainSlice[]>([]);
  const [trainCategoryData, setTrainCategoryData] = useState<TrainCategorySlice[]>([]);
  const [funcTrainingMode, setFuncTrainingMode] = useState('donut');
  const [funcTrainingTab, setFuncTrainingTab] = useState<'internal' | 'external'>('internal');
  const [funcTrainingData, setFuncTrainingData] = useState<TrainCategorySlice[]>([]);
  const [funcTrainingLoading, setFuncTrainingLoading] = useState(true);
  const [circleTrainingMode, setCircleTrainingMode] = useState('donut');
  const [circleTrainingData, setCircleTrainingData] = useState<TrainCategorySlice[]>([]);
  const [circleTrainingLoading, setCircleTrainingLoading] = useState(true);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreBucket[]>([]);
  const [trainFailures, setTrainFailures] = useState<TrainFailure[]>([]);
  const [trainCountsLoading, setTrainCountsLoading] = useState(true);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [failuresLoading, setFailuresLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPassFail = async () => {
      setPfLoading(true);

      try {
        const payload = await fetchMsafeTrainingJson('training_pass_fail_stats.json', {
          type: 'pass_vs_fail',
          ...buildFilterParams(persona, appliedFilters),
        });
        const { slices, passRate } = normalizeTrainPassFail(payload);
        if (isMounted) {
          setPfData(slices);
          setPfRate(passRate);
        }
      } catch (error) {
        console.warn('M-Safe training-pass-fail-stats API failed.', error);
      } finally {
        if (isMounted) setPfLoading(false);
      }
    };

    loadPassFail();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona]);

  // "Internal vs External Pass Rate" card hidden per request — API call disabled too.
  // useEffect(() => {
  //   let isMounted = true;
  //
  //   const loadIntExtPassFail = async () => {
  //     setIntExtLoading(true);
  //
  //     try {
  //       const payload = await fetchMsafeTrainingJson('training_pass_fail_stats.json', {
  //         type: 'internal_external',
  //         ...buildFilterParams(persona, appliedFilters),
  //       });
  //       const normalized = normalizeInternalExternalPassFail(payload);
  //       if (isMounted) setIntExtData(normalized);
  //     } catch (error) {
  //       console.warn('M-Safe training-pass-fail-stats (internal_external) API failed.', error);
  //     } finally {
  //       if (isMounted) setIntExtLoading(false);
  //     }
  //   };
  //
  //   loadIntExtPassFail();
  //
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [appliedFilters, persona]);

  useEffect(() => {
    let isMounted = true;

    const loadTrainingCounts = async () => {
      setTrainCountsLoading(true);

      try {
        // "External" is a genuinely separate endpoint, not a query param on the
        // same one — both return the identical { training_category, total, pass:
        // {count,percentage}, fail:{...}, pending:{...} } shape.
        const endpoint =
          catTab === 'external' ? 'external_category_wise_training_count.json' : 'category_wise_training_count.json';
        const payload = await fetchMsafeTrainingJson(endpoint, buildFilterParams(persona, appliedFilters));
        const normalized = normalizeTrainingCounts(payload);
        if (isMounted) {
          setTrainByNameData(normalized);
          setTrainCategoryData(normalized);
        }
      } catch (error) {
        console.warn('M-Safe category-wise-training-count API failed.', error);
      } finally {
        if (isMounted) setTrainCountsLoading(false);
      }
    };

    loadTrainingCounts();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona, catTab]);

  useEffect(() => {
    let isMounted = true;

    const loadFunctionTraining = async () => {
      setFuncTrainingLoading(true);
      try {
        const payload = await fetchMsafeTrainingJson(
          'function_wise_training_status.json',
          buildFilterParams(persona, appliedFilters),
        );
        const normalized = normalizeFunctionTrainingStatus(payload, funcTrainingTab);
        if (isMounted) setFuncTrainingData(normalized);
      } catch (error) {
        console.warn('M-Safe function-wise-training-status API failed.', error);
      } finally {
        if (isMounted) setFuncTrainingLoading(false);
      }
    };

    loadFunctionTraining();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona, funcTrainingTab]);

  useEffect(() => {
    let isMounted = true;

    const loadCircleTraining = async () => {
      setCircleTrainingLoading(true);
      try {
        const payload = await fetchMsafeTrainingJson(
          'circle_wise_training_status.json',
          buildFilterParams(persona, appliedFilters),
        );
        const normalized = normalizeCircleTrainingStatus(payload);
        if (isMounted) setCircleTrainingData(normalized);
      } catch (error) {
        console.warn('M-Safe circle-wise-training-status API failed.', error);
      } finally {
        if (isMounted) setCircleTrainingLoading(false);
      }
    };

    loadCircleTraining();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona]);

  // Score Distribution card is hidden (see JSX below) — API call commented out so it's not fetched.
  // useEffect(() => {
  //   let isMounted = true;
  //
  //   const loadScoreDistribution = async () => {
  //     setScoreLoading(true);
  //
  //     try {
  //       const payload = await fetchMsafeTrainingJson(
  //         'training_score_distribution.json',
  //         buildFilterParams(persona, appliedFilters),
  //       );
  //       const normalized = normalizeScoreDistribution(payload);
  //       if (isMounted) setScoreDistribution(normalized);
  //     } catch (error) {
  //       console.warn('M-Safe training-score-distribution API failed.', error);
  //     } finally {
  //       if (isMounted) setScoreLoading(false);
  //     }
  //   };
  //
  //   loadScoreDistribution();
  //
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [appliedFilters, persona]);

  // Recent Training Failures table is hidden (see JSX below) — API call commented out so it's not fetched.
  // useEffect(() => {
  //   let isMounted = true;
  //
  //   const loadTrainingFailures = async () => {
  //     setFailuresLoading(true);
  //
  //     try {
  //       const payload = await fetchMsafeTrainingJson(
  //         'recent_training_failures.json',
  //         buildFilterParams(persona, appliedFilters),
  //       );
  //       const normalized = normalizeTrainingFailures(payload);
  //       if (isMounted) setTrainFailures(normalized);
  //     } catch (error) {
  //       console.warn('M-Safe recent-training-failures API failed.', error);
  //     } finally {
  //       if (isMounted) setFailuresLoading(false);
  //     }
  //   };
  //
  //   loadTrainingFailures();
  //
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [appliedFilters]);

  // Reads the pass/fail/pending breakdown directly off the hovered slice's own
  // data (attached by normalizeTrainingCounts) instead of cross-referencing a
  // second array by name.
  const renderCategoryTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;
    const slice = payload[0]?.payload as TrainCategorySlice | undefined;
    if (!slice) return null;
    const fmt = (count: number, pct: number | null) =>
      `${count.toLocaleString('en-IN')}${pct !== null ? ` (${pct}%)` : ''}`;
    return (
      <div className="msafe-chart-tip">
        <div className="msafe-chart-tip-title">{slice.name}</div>
        <div className="msafe-chart-tip-row">
          <span className="msafe-chart-tip-sw" style={{ background: C.ok }} />
          <span>Pass : {fmt(slice.pass, slice.passPercentage)}</span>
        </div>
        <div className="msafe-chart-tip-row">
          <span className="msafe-chart-tip-sw" style={{ background: C.vi }} />
          <span>Fail : {fmt(slice.fail, slice.failPercentage)}</span>
        </div>
        <div className="msafe-chart-tip-row">
          <span className="msafe-chart-tip-sw" style={{ background: C.warn }} />
          <span>Pending : {fmt(slice.pending, slice.pendingPercentage)}</span>
        </div>
      </div>
    );
  };

  // Reads each status's own rate (attached by normalizeTrainPassFail) directly
  // off the hovered slice, so "Pass Vs Fail Rate" shows e.g. "Pass: 4,246 (55.39%)".
  const renderPfTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;
    const slice = payload[0]?.payload as TrainPFSlice | undefined;
    if (!slice) return null;
    return (
      <div className="msafe-chart-tip">
        <div className="msafe-chart-tip-title">{slice.name}</div>
        <div className="msafe-chart-tip-row">
          <span className="msafe-chart-tip-sw" style={{ background: slice.color }} />
          <span>
            {slice.value.toLocaleString('en-IN')}
            {slice.rate ? ` (${slice.rate})` : ''}
          </span>
        </div>
      </div>
    );
  };

  return (
    <AccordionShell
      title="Training — Safety Certification"
      sub="Pass rates, categories, and who still needs a re-attempt"
      excelLabel="Training"
    >
      {/* "Internal vs External Pass Rate" and "Training by Name" cards hidden per
          request — both had their API calls disabled too ("Training by Name"'s
          fetch is shared with "Category-wise Trainings" below, so only its own
          assignment is dead, not the fetch itself). Only "Pass vs Fail Rate" is
          left, now full-width instead of half a two-column row. */}
      <ChartCard
        title="Pass vs Fail Rate"
        sub="All training records"
        infoKey="train-pf"
        showPdf
        exportData={pfData.map((d) => ({ Status: d.name, Records: d.value, Rate: d.rate }))}
        chartSwitch={<ChartSwitch modes={['donut', 'bar']} value={pfMode} onChange={setPfMode} />}
      >
        {pfLoading || pfData.length === 0 ? (
          <DataState loading={pfLoading} empty={pfData.length === 0} label="pass/fail data" />
        ) : pfMode === 'donut' ? (
          <SideLegendDonut
            data={pfData}
            centerValue={pfRate ?? '—'}
            centerLabel="Pass Rate"
            bodyLabel="Records"
            tooltipContent={renderPfTooltip}
            onRowClick={(name) => openDrill(name === 'Fail' ? 'train-fail' : 'train-pass', name)}
          />
        ) : (
          <SliceBarChart data={pfData} tooltipContent={renderPfTooltip} />
        )}
      </ChartCard>

      <ChartCard
        title="Category-wise Trainings"
        sub="Training volume rolled up by category — Statutory Compliance, Technical Safety, Behavioral Safety, Emergency Response, Induction"
        infoKey="train-category"
        showPdf
        pdfLabel="Category-wise Trainings"
        exportData={trainCategoryData.map((d) => ({
          Category: d.name,
          Pass: d.pass,
          Fail: d.fail,
          Pending: d.pending,
          Total: d.total,
        }))}
        style={{ marginTop: 16 }}
        tag={<ChartSwitch modes={['internal', 'external']} value={catTab} onChange={(v) => setCatTab(v as 'internal' | 'external')} />}
        chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={catMode} onChange={setCatMode} />}
      >
        {trainCountsLoading || trainCategoryData.length === 0 ? (
          <DataState loading={trainCountsLoading} empty={trainCategoryData.length === 0} label="category data" />
        ) : (
          <>
            {catMode === 'donut' && (
              <DonutChart
                data={trainCategoryData}
                height={Math.max(220, trainCategoryData.length * 26)}
                tooltipContent={renderCategoryTooltip}
              />
            )}
            {catMode === 'bar' && (
              <div className="chart-wrap" style={{ height: 'auto', maxHeight: 420, overflow: 'auto' }}>
                <ResponsiveContainer width="100%" height={Math.max(220, trainCategoryData.length * 30)}>
                  <BarChart
                    data={trainCategoryData}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
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
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="pass" stackId="training" fill={C.ok} name="Pass" />
                    <Bar dataKey="fail" stackId="training" fill={C.vi} name="Fail" />
                    <Bar
                      dataKey="pending"
                      stackId="training"
                      fill={C.warn}
                      name="Pending"
                      radius={[0, 5, 5, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {catMode === 'table' && (
              <div className="chart-as-table">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Pass</th>
                      <th>Fail</th>
                      <th>Pending</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainCategoryData.map((d) => (
                      <tr key={d.name}>
                        <td>{d.name}</td>
                        <td>{d.pass.toLocaleString('en-IN')}</td>
                        <td>{d.fail.toLocaleString('en-IN')}</td>
                        <td>{d.pending.toLocaleString('en-IN')}</td>
                        <td>{d.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </ChartCard>

      <ChartCard
        title="Function-wise Training Status"
        sub="Pass, fail, and pending training records by function"
        infoKey="train-function-status"
        showPdf
        pdfLabel="Function-wise Training Status"
        exportData={funcTrainingData.map((d) => ({
          Function: d.name,
          Pass: d.pass,
          Fail: d.fail,
          Pending: d.pending,
          Total: d.total,
        }))}
        style={{ marginTop: 16 }}
        tag={
          <ChartSwitch
            modes={['internal', 'external']}
            value={funcTrainingTab}
            onChange={(v) => setFuncTrainingTab(v as 'internal' | 'external')}
          />
        }
        chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={funcTrainingMode} onChange={setFuncTrainingMode} />}
      >
        {funcTrainingLoading || funcTrainingData.length === 0 ? (
          <DataState loading={funcTrainingLoading} empty={funcTrainingData.length === 0} label="function training data" />
        ) : (
          <>
            {funcTrainingMode === 'donut' && (
              <DonutChart
                data={funcTrainingData}
                height={Math.max(220, funcTrainingData.length * 26)}
                tooltipContent={renderCategoryTooltip}
              />
            )}
            {funcTrainingMode === 'bar' && (
              <div className="chart-wrap" style={{ height: 'auto', maxHeight: 420, overflow: 'auto' }}>
                <ResponsiveContainer width="100%" height={Math.max(220, funcTrainingData.length * 30)}>
                  <BarChart
                    data={funcTrainingData}
                    layout="vertical"
                    margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
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
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="pass" stackId="func-training" fill={C.ok} name="Pass" />
                    <Bar dataKey="fail" stackId="func-training" fill={C.vi} name="Fail" />
                    <Bar
                      dataKey="pending"
                      stackId="func-training"
                      fill={C.warn}
                      name="Pending"
                      radius={[0, 5, 5, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {funcTrainingMode === 'table' && (
              <div className="chart-as-table">
                <table>
                  <thead>
                    <tr>
                      <th>Function</th>
                      <th>Pass</th>
                      <th>Fail</th>
                      <th>Pending</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funcTrainingData.map((d) => (
                      <tr key={d.name}>
                        <td>{d.name}</td>
                        <td>{d.pass.toLocaleString('en-IN')}</td>
                        <td>{d.fail.toLocaleString('en-IN')}</td>
                        <td>{d.pending.toLocaleString('en-IN')}</td>
                        <td>{d.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </ChartCard>

      <ChartCard
        title="Circle-wise Training Status"
        sub="Pass / Fail / Pending % of training records by circle"
        infoKey="train-circle-status"
        showPdf
        pdfLabel="Circle-wise Training Status"
        exportData={circleTrainingData.map((d) => ({
          Circle: d.name,
          Pass: d.pass,
          'Pass %': d.passPercentage,
          Fail: d.fail,
          'Fail %': d.failPercentage,
          Pending: d.pending,
          'Pending %': d.pendingPercentage,
          Total: d.total,
        }))}
        style={{ marginTop: 16 }}
        chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={circleTrainingMode} onChange={setCircleTrainingMode} />}
      >
        {circleTrainingLoading || circleTrainingData.length === 0 ? (
          <DataState loading={circleTrainingLoading} empty={circleTrainingData.length === 0} label="circle training data" />
        ) : circleTrainingMode === 'donut' ? (
          <DonutChart
            data={circleTrainingData}
            height={Math.min(420, Math.max(220, Math.ceil(circleTrainingData.length / 2) * 26))}
            tooltipContent={renderCategoryTooltip}
          />
        ) : circleTrainingMode === 'bar' ? (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: Math.max(700, circleTrainingData.length * 55) }}>
              <ResponsiveContainer width="100%" height={360}>
                <BarChart data={circleTrainingData} margin={{ top: 4, right: 16, left: 0, bottom: 70 }}>
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
                  <Tooltip content={renderCategoryTooltip} />
                  <Legend wrapperStyle={{ fontSize: 10.5 }} iconType="square" iconSize={10} />
                  <Bar dataKey="passPercentage" stackId="circle-training" fill={C.ok} name="Pass %" />
                  <Bar dataKey="failPercentage" stackId="circle-training" fill={C.vi} name="Fail %" />
                  <Bar
                    dataKey="pendingPercentage"
                    stackId="circle-training"
                    fill={C.warn}
                    radius={[5, 5, 0, 0]}
                    name="Pending %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="chart-as-table">
            <table>
              <thead>
                <tr>
                  <th>Circle</th>
                  <th>Pass</th>
                  <th>Fail</th>
                  <th>Pending</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {circleTrainingData.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.pass.toLocaleString('en-IN')}</td>
                    <td>{d.fail.toLocaleString('en-IN')}</td>
                    <td>{d.pending.toLocaleString('en-IN')}</td>
                    <td>{d.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>

      {/* Both cards in this row (Score Distribution, Recent Training Failures) are hidden below —
          JSX comments can't nest, so this wrapper div is left in place (renders empty) rather
          than being commented out itself. */}
      <div className="g g-2-1" style={{ marginTop: 16, display: 'none' }}>
        {/* Score Distribution hidden — kept for reference, API call above is also commented out.
        <ChartCard title="Score Distribution" sub="Histogram of actual scores where recorded (n=15,842)" infoKey="train-score">
          {scoreLoading || scoreDistribution.length === 0 ? (
            <DataState loading={scoreLoading} empty={scoreDistribution.length === 0} label="score data" />
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 10, fill: C.sage }} />
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Bar dataKey="n" radius={[5, 5, 0, 0]}>
                    {scoreDistribution.map((d) => (
                      <Cell key={d.bucket} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
        */}

        {/* Recent Training Failures table hidden — kept for reference, API call above is also commented out.
        <ChartCard
          title="Recent Training Failures"
          sub="Latest sessions requiring re-attempt"
          infoKey="train-fails"
          tag={
            <span
              className="card-tag"
              style={{
                background: 'var(--vi-red-tint)',
                color: 'var(--vi-red)',
                borderColor: 'rgba(238,39,55,.20)',
              }}
            >
              34 last 7 days
            </span>
          }
        >
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Training</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {failuresLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: C.sage, padding: '16px 0' }}>
                      Loading…
                    </td>
                  </tr>
                ) : trainFailures.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: C.sage, padding: '16px 0' }}>
                      No training failures available
                    </td>
                  </tr>
                ) : (
                  trainFailures.map((t) => (
                    <tr key={t.user + t.tr} onClick={() => openDrill('train-fail', t.user)}>
                      <td className="cell-strong">{t.user}</td>
                      <td>{t.tr}</td>
                      <td>
                        <span className={`badge ${t.type === 'Internal' ? 'b-info' : 'b-neutral'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td>{t.date}</td>
                      <td>
                        <span className="badge b-fail">{t.score}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>
        */}
      </div>
    </AccordionShell>
  );
}
