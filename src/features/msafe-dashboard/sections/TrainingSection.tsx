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

function getNum(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
    if (typeof raw === 'string' && raw.trim() && Number.isFinite(Number(raw))) return Number(raw);
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

// category_wise_training_count.json only reports a completed count and a
// completion percentage per category — no fail/pending breakdown — so this
// carries just those two, rather than forcing them into the fuller pass/fail/
// pending shape used by Function-wise/Circle-wise Training Status.
type CategoryTrainingSlice = TrainSlice & { completed: number; completionPercentage: number | null };

const normalizeTrainingCounts = (payload: unknown): CategoryTrainingSlice[] => {
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

      const completed = getNum(record, ['completed_training_count', 'completed', 'passed', 'count', 'value']);
      if (completed === null) return null;
      const completionPercentage = getNum(record, ['completion_percentage', 'percentage', 'pct']);

      return {
        name,
        value: completed,
        color: TRAIN_CHART_PALETTE[index % TRAIN_CHART_PALETTE.length],
        completed,
        completionPercentage,
      };
    })
    .filter((item): item is CategoryTrainingSlice => Boolean(item));
};

// Shared shape behind both function_wise_training_status.json and
// circle_wise_training_status.json: a list of groups (functions or circles),
// each carrying a `records` array of per-training-category rows (completed
// count + completion % only — no pass/fail/pending). The chart shows one
// slice per group (total completed across its categories, with an overall
// completion % derived from summed counts); the per-category breakdown is
// kept on the slice for the tooltip.
type TrainingCategoryBreakdown = { name: string; completed: number; completionPercentage: number | null };
type GroupTrainingSlice = Slice & {
  completed: number;
  completionPercentage: number | null;
  categories: TrainingCategoryBreakdown[];
};

function normalizeGroupedTrainingStatus(
  payload: unknown,
  unwrapKeys: string[],
  nameOf: (record: Record<string, unknown>) => string | null,
): GroupTrainingSlice[] {
  const list = unwrapTrainingList(payload, unwrapKeys);

  return list
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;

      const name = nameOf(record);
      if (!name) return null;

      const categoryRecords = Array.isArray(record.records) ? record.records : [];
      const categories: TrainingCategoryBreakdown[] = [];
      let totalCompleted = 0;
      let totalUsers = 0;

      for (const cat of categoryRecords) {
        if (!cat || typeof cat !== 'object') continue;
        const catRecord = cat as Record<string, unknown>;
        const catName = typeof catRecord.training_category === 'string' ? catRecord.training_category : null;
        const completed = getNum(catRecord, ['completed_training_count', 'completed']);
        if (!catName || completed === null) continue;
        const percentage = getNum(catRecord, ['completion_percentage', 'percentage']);
        totalUsers += getNum(catRecord, ['krcc_user_count', 'total']) ?? 0;
        totalCompleted += completed;
        categories.push({ name: catName, completed, completionPercentage: percentage });
      }

      const completionPercentage =
        totalUsers > 0 ? Math.round((totalCompleted / totalUsers) * 10000) / 100 : null;

      return {
        name,
        value: totalCompleted,
        color: TRAIN_CHART_PALETTE[index % TRAIN_CHART_PALETTE.length],
        completed: totalCompleted,
        completionPercentage,
        categories,
      };
    })
    .filter((item): item is GroupTrainingSlice => Boolean(item));
}

function normalizeFunctionTrainingStatus(payload: unknown): GroupTrainingSlice[] {
  return normalizeGroupedTrainingStatus(payload, ['functions', 'records'], (record) => {
    const rawName = typeof record.function_name === 'string' ? record.function_name.trim() : '';
    return rawName || (typeof record.function_id === 'number' ? `Function ${record.function_id}` : null);
  });
}

// circle_wise_training_status.json now returns the same per-category
// records shape as function_wise_training_status.json (see
// normalizeGroupedTrainingStatus above) — one group per circle instead of
// per function.
function normalizeCircleTrainingStatus(payload: unknown): GroupTrainingSlice[] {
  return normalizeGroupedTrainingStatus(payload, ['circles', 'records'], (record) => {
    const rawName = typeof record.circle_name === 'string' ? record.circle_name.trim() : '';
    return rawName || (typeof record.circle_id === 'number' ? `Circle ${record.circle_id}` : null);
  });
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
  const [pfData, setPfData] = useState<TrainPFSlice[]>([]);
  const [pfRate, setPfRate] = useState<string | null>(null);
  const [pfLoading, setPfLoading] = useState(true);
  const [intExtData, setIntExtData] = useState<PassFailGroup[]>([]);
  const [intExtLoading, setIntExtLoading] = useState(true);
  const [trainByNameData, setTrainByNameData] = useState<TrainSlice[]>([]);
  const [trainCategoryData, setTrainCategoryData] = useState<CategoryTrainingSlice[]>([]);
  const [funcTrainingMode, setFuncTrainingMode] = useState('donut');
  const [funcTrainingData, setFuncTrainingData] = useState<GroupTrainingSlice[]>([]);
  const [funcTrainingLoading, setFuncTrainingLoading] = useState(true);
  const [circleTrainingMode, setCircleTrainingMode] = useState('donut');
  const [circleTrainingData, setCircleTrainingData] = useState<GroupTrainingSlice[]>([]);
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
        const payload = await fetchMsafeTrainingJson(
          'category_wise_training_count.json',
          buildFilterParams(persona, appliedFilters),
        );
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
  }, [appliedFilters, persona]);

  useEffect(() => {
    let isMounted = true;

    const loadFunctionTraining = async () => {
      setFuncTrainingLoading(true);
      try {
        const payload = await fetchMsafeTrainingJson(
          'function_wise_training_status.json',
          buildFilterParams(persona, appliedFilters),
        );
        const normalized = normalizeFunctionTrainingStatus(payload);
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
  }, [appliedFilters, persona]);

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

  // "Category-wise Trainings" only has a completed count + completion % per
  // category (no fail/pending data) — a dedicated, simpler tooltip instead of
  // reusing renderCategoryTooltip's pass/fail/pending rows.
  const renderCompletionTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;
    const slice = payload[0]?.payload as CategoryTrainingSlice | undefined;
    if (!slice) return null;
    return (
      <div className="msafe-chart-tip">
        <div className="msafe-chart-tip-title">{slice.name}</div>
        <div className="msafe-chart-tip-row">
          <span className="msafe-chart-tip-sw" style={{ background: C.ok }} />
          <span>
            Completed : {slice.completed.toLocaleString('en-IN')}
            {slice.completionPercentage !== null ? ` (${slice.completionPercentage}%)` : ''}
          </span>
        </div>
      </div>
    );
  };

  // Shared by "Function-wise Training Status" and "Circle-wise Training
  // Status" — the hovered group's overall Completed/% (summed across its
  // training categories), followed by the per-category breakdown attached to
  // the slice by normalizeGroupedTrainingStatus.
  const renderGroupTrainingTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (!active || !payload?.length) return null;
    const slice = payload[0]?.payload as GroupTrainingSlice | undefined;
    if (!slice) return null;
    return (
      <div className="msafe-chart-tip">
        <div className="msafe-chart-tip-title">{slice.name}</div>
        <div className="msafe-chart-tip-row" style={{ fontWeight: 600 }}>
          <span>
            Completed : {slice.completed.toLocaleString('en-IN')}
            {slice.completionPercentage !== null ? ` (${slice.completionPercentage}%)` : ''}
          </span>
        </div>
        {slice.categories.map((cat) => (
          <div key={cat.name} className="msafe-chart-tip-row">
            <span className="msafe-chart-tip-sw" style={{ background: C.ok }} />
            <span>
              {cat.name}: {cat.completed.toLocaleString('en-IN')}
              {cat.completionPercentage !== null ? ` (${cat.completionPercentage}%)` : ''}
            </span>
          </div>
        ))}
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
      
        infoKey="train-pf"
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
        pdfLabel="Category-wise Trainings"
        exportData={trainCategoryData.map((d) => ({
          Category: d.name,
          Completed: d.completed,
          'Completion %': d.completionPercentage,
        }))}
        style={{ marginTop: 16 }}
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
                tooltipContent={renderCompletionTooltip}
              />
            )}
            {catMode === 'bar' && (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: Math.max(700, trainCategoryData.length * 90) }}>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={trainCategoryData} margin={{ top: 4, right: 16, left: 0, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <YAxis
                      type="number"
                      tick={{ fontSize: 10, fill: C.sage }}
                    />
                    <XAxis
                      type="category"
                      dataKey="name"
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={90}
                      tick={{ fontSize: 10, fill: C.sage }}
                    />
                    <Tooltip content={renderCompletionTooltip} />
                    <Bar dataKey="completed" name="Completed" radius={[5, 5, 0, 0]}>
                      {trainCategoryData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {catMode === 'table' && (
              <div className="chart-as-table">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Completed</th>
                      <th>Completion %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainCategoryData.map((d) => (
                      <tr key={d.name}>
                        <td>{d.name}</td>
                        <td>{d.completed.toLocaleString('en-IN')}</td>
                        <td>{d.completionPercentage !== null ? `${d.completionPercentage}%` : '-'}</td>
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
        sub="Completed training count and completion % by function"
        infoKey="train-function-status"
        pdfLabel="Function-wise Training Status"
        exportData={funcTrainingData.map((d) => ({
          Function: d.name,
          Completed: d.completed,
          'Completion %': d.completionPercentage !== null ? `${d.completionPercentage}%` : '-',
        }))}
        style={{ marginTop: 16 }}

        chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={funcTrainingMode} onChange={setFuncTrainingMode} />}
      >
        {funcTrainingLoading || funcTrainingData.length === 0 ? (
          <DataState loading={funcTrainingLoading} empty={funcTrainingData.length === 0} label="function training data" />
        ) : (
          <>
            {funcTrainingMode === 'donut' && (
              <div style={{ overflowX: 'auto' }}>
                <DonutChart
                  data={funcTrainingData}
                  height={Math.min(420, Math.max(220, Math.ceil(funcTrainingData.length / 2) * 26))}
                  tooltipContent={renderGroupTrainingTooltip}
                />
              </div>
            )}
            {funcTrainingMode === 'bar' && (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ minWidth: Math.max(700, funcTrainingData.length * 90) }}>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart data={funcTrainingData} margin={{ top: 4, right: 16, left: 0, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                    <YAxis
                      type="number"
                      tick={{ fontSize: 10, fill: C.sage }}
                    />
                    <XAxis
                      type="category"
                      dataKey="name"
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={90}
                      tick={{ fontSize: 10, fill: C.sage }}
                    />
                    <Tooltip content={renderGroupTrainingTooltip} />
                    <Bar dataKey="completed" fill={C.ok} name="Completed" radius={[5, 5, 0, 0]}>
                      {funcTrainingData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            {funcTrainingMode === 'table' && (
              <div className="chart-as-table">
                <table>
                  <thead>
                    <tr>
                      <th>Function</th>
                      <th>Completed</th>
                      <th>Completion %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funcTrainingData.map((d) => (
                      <tr key={d.name}>
                        <td>{d.name}</td>
                        <td>{d.completed.toLocaleString('en-IN')}</td>
                        <td>{d.completionPercentage !== null ? `${d.completionPercentage}%` : '-'}</td>
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
        sub="Completed training count and completion % by circle"
        infoKey="train-circle-status"
        pdfLabel="Circle-wise Training Status"
        exportData={circleTrainingData.map((d) => ({
          Circle: d.name,
          Completed: d.completed,
          'Completion %': d.completionPercentage !== null ? `${d.completionPercentage}%` : '-',
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
            tooltipContent={renderGroupTrainingTooltip}
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
                  <YAxis tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip content={renderGroupTrainingTooltip} />
                  <Bar dataKey="completed" fill={C.ok} name="Completed" radius={[5, 5, 0, 0]}>
                    {circleTrainingData.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Bar>
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
                  <th>Completed</th>
                  <th>Completion %</th>
                </tr>
              </thead>
              <tbody>
                {circleTrainingData.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.completed.toLocaleString('en-IN')}</td>
                    <td>{d.completionPercentage !== null ? `${d.completionPercentage}%` : '-'}</td>
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
