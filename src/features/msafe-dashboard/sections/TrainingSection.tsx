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
 *  Only sent for the 'circle' persona — the admin (pan-India) view stays unfiltered. */
function buildFilterParams(persona: Persona, f: AppliedFilters): Record<string, string> {
  if (persona !== 'circle') return {};
  const params: Record<string, string> = {};
  if (f.circleId) params.circle_id = f.circleId;
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

type PassFailGroup = { group: string; rows: { label: string; pct: number; val: string; color: string }[] };

function pickNestedRecord(root: Record<string, unknown>, keys: string[]): Record<string, unknown> | null {
  for (const key of keys) {
    const nested = root[key];
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) return nested as Record<string, unknown>;
  }
  return null;
}

function extractPassFailGroup(record: Record<string, unknown>, groupLabel: string): PassFailGroup | null {
  const pass = getNumberOrPercent(record, ['pass', 'passed', 'total_pass', 'pass_count']);
  const fail = getNumberOrPercent(record, ['fail', 'failed', 'total_fail', 'fail_count']);
  const pending = getNumberOrPercent(record, ['pending', 'pending_count', 'total_pending']);
  if (pass === null && fail === null && pending === null) return null;

  const total = getNumberOrPercent(record, ['total', 'total_count', 'total_users']);
  const denom = pass !== null && fail !== null ? pass + fail + (pending ?? 0) : total;

  const rawPassRate = getNumberOrPercent(record, ['pass_rate', 'pass_percentage', 'passing_percentage']);
  const rawFailRate = getNumberOrPercent(record, ['fail_rate', 'fail_percentage', 'failing_percentage']);
  const rawPendingRate = getNumberOrPercent(record, ['pending_rate', 'pending_percentage']);
  const passPct = rawPassRate ?? (denom && pass !== null ? Math.round((pass / denom) * 1000) / 10 : 0);
  const failPct = rawFailRate ?? (denom && fail !== null ? Math.round((fail / denom) * 1000) / 10 : 0);
  const pendingPct = rawPendingRate ?? (denom && pending !== null ? Math.round((pending / denom) * 1000) / 10 : 0);

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
  return groups;
}

const normalizeTrainingCounts = (payload: unknown): TrainSlice[] => {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  let list: unknown[] = Array.isArray(source) ? source : [];
  if (!Array.isArray(source)) {
    for (const key of ['data', 'result', 'categories', 'training_categories', 'records']) {
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

      const name = [
        record.training_category,
        record.category_name,
        record.training_name,
        record.name,
        record.label,
        record.title,
      ].find((value): value is string => typeof value === 'string' && value.trim().length > 0);
      if (!name) return null;

      let value: number | null = null;
      for (const key of ['count', 'value', 'total', 'training_count']) {
        const raw = record[key];
        if (typeof raw === 'number' && Number.isFinite(raw)) {
          value = raw;
          break;
        }
        if (typeof raw === 'string' && raw.trim() && Number.isFinite(Number(raw))) {
          value = Number(raw);
          break;
        }
      }
      if (value === null) return null;

      return { name, value, color: TRAIN_CHART_PALETTE[index % TRAIN_CHART_PALETTE.length] };
    })
    .filter((item): item is TrainSlice => Boolean(item));
};

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
  const [pfData, setPfData] = useState<TrainSlice[]>([]);
  const [pfRate, setPfRate] = useState<string | null>(null);
  const [pfLoading, setPfLoading] = useState(true);
  const [intExtData, setIntExtData] = useState<PassFailGroup[]>([]);
  const [intExtLoading, setIntExtLoading] = useState(true);
  const [trainByNameData, setTrainByNameData] = useState<TrainSlice[]>([]);
  const [trainCategoryData, setTrainCategoryData] = useState<TrainSlice[]>([]);
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

  useEffect(() => {
    let isMounted = true;

    const loadIntExtPassFail = async () => {
      setIntExtLoading(true);

      try {
        const payload = await fetchMsafeTrainingJson('training_pass_fail_stats.json', {
          type: 'internal_external',
          ...buildFilterParams(persona, appliedFilters),
        });
        const normalized = normalizeInternalExternalPassFail(payload);
        if (isMounted) setIntExtData(normalized);
      } catch (error) {
        console.warn('M-Safe training-pass-fail-stats (internal_external) API failed.', error);
      } finally {
        if (isMounted) setIntExtLoading(false);
      }
    };

    loadIntExtPassFail();

    return () => {
      isMounted = false;
    };
  }, [appliedFilters, persona]);

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

  return (
    <AccordionShell
      title="Training — Safety Certification"
      sub="Pass rates, categories, and who still needs a re-attempt"
      excelLabel="Training"
    >
      <div className="g g3">
        <ChartCard
          title="Pass vs Fail Rate"
          sub="All training records"
          infoKey="train-pf"
          showPdf
          exportData={pfData.map((d) => ({ Status: d.name, Records: d.value }))}
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
              onRowClick={(name) => openDrill(name === 'Fail' ? 'train-fail' : 'train-pass', name)}
            />
          ) : (
            <SliceBarChart data={pfData} />
          )}
        </ChartCard>

        <ChartCard title="Internal vs External Pass Rate" sub="Compared side-by-side" infoKey="train-int-ext">
          {intExtLoading || intExtData.length === 0 ? (
            <DataState loading={intExtLoading} empty={intExtData.length === 0} label="internal/external pass rate data" />
          ) : (
            <div style={{ padding: '4px 0' }}>
              {intExtData.map((g) => (
                <div key={g.group}>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: 'var(--sage)',
                      fontWeight: 600,
                      marginTop: 6,
                      marginBottom: 2,
                    }}
                  >
                    {g.group}
                  </div>
                  {g.rows.map((r) => (
                    <div key={r.label} className="pb-row">
                      <span className="pb-label">{r.label}</span>
                      <div className="pb-wrap">
                        <div className="pb-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                      </div>
                      <span className="pb-val">{r.val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <ChartCard title="Training by Name" sub="Volume by training programme" infoKey="train-name">
          {trainCountsLoading || trainByNameData.length === 0 ? (
            <DataState loading={trainCountsLoading} empty={trainByNameData.length === 0} label="training data" />
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trainByNameData} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: C.sage }} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: C.sage }} />
                  <Tooltip />
                  <Bar dataKey="value" fill={C.sage} radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      <ChartCard
        title="Category-wise Trainings"
        sub="Training volume rolled up by category — Statutory Compliance, Technical Safety, Behavioral Safety, Emergency Response, Induction"
        infoKey="train-category"
        showPdf
        pdfLabel="Category-wise Trainings"
        exportData={trainCategoryData.map((d) => ({ Category: d.name, Records: d.value }))}
        style={{ marginTop: 16 }}
        chartSwitch={<ChartSwitch modes={['donut', 'bar', 'table']} value={catMode} onChange={setCatMode} />}
      >
        {trainCountsLoading || trainCategoryData.length === 0 ? (
          <DataState loading={trainCountsLoading} empty={trainCategoryData.length === 0} label="category data" />
        ) : (
          <>
            {catMode === 'donut' && (
              <DonutChart data={trainCategoryData} height={Math.max(220, trainCategoryData.length * 26)} />
            )}
            {catMode === 'bar' && <SliceBarChart data={trainCategoryData} />}
            {catMode === 'table' && <ChartTable data={trainCategoryData} valueLabel="Records" />}
          </>
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
