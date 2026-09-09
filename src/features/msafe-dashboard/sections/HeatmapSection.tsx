import { useEffect, useState } from 'react';
import { ChartCard } from '../components/ChartCard';
import { Leaderboard } from '../components/Leaderboard';
import { heatmapClass } from '../data/mockData';
import type { Persona } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import { getAuthHeader } from '@/config/apiConfig';

type HeatmapRow = { circle: string; values: number[] };

// "SMT Visits" and "External Approved" columns are hidden from the Compliance by
// Circle × Module table — kept out of both labels and field candidates so the
// per-row `values` array lines up with the header without extra slicing.
const MODULE_LABELS = ['Training', 'KRCC', 'LMC'];
const MODULE_FIELD_CANDIDATES: string[][] = [
  ['training', 'training_percentage', 'training_compliance', 'training_pct'],
  ['krcc', 'krcc_percentage', 'krcc_compliance', 'krcc_pct'],
  ['lmc', 'lmc_percentage', 'lmc_compliance', 'lmc_pct'],
];

function getMsafeBaseUrl(): string {
  const fromLS = localStorage.getItem('baseUrl') || '';
  const host = fromLS.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return host ? `https://${host}` : 'https://live-api.gophygital.work';
}

/** Circle Manager filter bar values, applied as query params once the user clicks Apply.
 *  Only sent for the 'circle' persona — the admin (pan-India) view stays unfiltered.
 *  IDs default to '' until the user explicitly picks an option from that dropdown, so
 *  checking truthiness already means "only send when the user actually selected it". */
function buildFilterParams(persona: Persona, f: AppliedFilters): Record<string, string> {
  if (persona !== 'circle') return {};
  const params: Record<string, string> = {};
  if (f.circleIds.length > 0) params.circle_id = f.circleIds.join(',');
  if (f.functionIds.length > 0) params.function_id = f.functionIds.join(',');
  if (f.zoneId) params.zone_id = f.zoneId;
  if (f.empTypeId) params.employee_type = f.empTypeId;
  if (f.startDate) params.from_date = f.startDate;
  if (f.endDate) params.to_date = f.endDate;
  return params;
}

async function fetchMsafeUserDashboardJson(
  endpoint: string,
  extraParams?: Record<string, string>,
  signal?: AbortSignal,
): Promise<unknown> {
  const companyId = Number(
    localStorage.getItem('selectedCompanyId') || localStorage.getItem('company_id') || '145',
  );
  const token = localStorage.getItem('token') || '';
  const params = new URLSearchParams({ company_id: String(companyId), type: 'compliance', ...extraParams });
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

  const response = await fetch(url, { signal, headers });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
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

function normalizeComplianceByCircle(payload: unknown): HeatmapRow[] {
  const list = unwrapList(payload, ['compliance', 'compliance_by_circle', 'data', 'result', 'circles']);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const circle = getString(record, ['circle_name', 'circle', 'name', 'label']);
      if (!circle) return null;
      const values = MODULE_FIELD_CANDIDATES.map((keys) => getNumber(record, keys) ?? 0);
      return { circle, values };
    })
    .filter((item): item is HeatmapRow => Boolean(item));
}

type Pagination = { currentPage: number; perPage: number; totalEntries: number; totalPages: number };

function extractPagination(payload: unknown): Pagination | null {
  const root = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const p = root.pagination && typeof root.pagination === 'object' ? (root.pagination as Record<string, unknown>) : null;
  if (!p) return null;
  const currentPage = p.current_page;
  const perPage = p.per_page;
  const totalEntries = p.total_entries;
  const totalPages = p.total_pages;
  if (
    typeof currentPage !== 'number' ||
    typeof perPage !== 'number' ||
    typeof totalEntries !== 'number' ||
    typeof totalPages !== 'number'
  ) {
    return null;
  }
  return { currentPage, perPage, totalEntries, totalPages };
}

type GrowthRow = { name: string; note: string; score: number };

function normalizeGrowthCircles(payload: unknown): GrowthRow[] {
  const list = unwrapList(payload, [
    'circles_need_growth',
    'growth',
    'compliance',
    'compliance_by_circle',
    'data',
    'result',
    'circles',
  ]);
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const name = getString(record, ['circle_name', 'circle', 'name', 'label']);
      if (!name) return null;

      const explicitScore = getNumber(record, [
        'score',
        'compliance_score',
        'weighted_score',
        'overall_percentage',
        'overall_score',
        'percentage',
      ]);

      const moduleValues = MODULE_FIELD_CANDIDATES.map((keys) => getNumber(record, keys)).filter(
        (v): v is number => v !== null,
      );

      const score =
        explicitScore ??
        (moduleValues.length > 0
          ? Math.round((moduleValues.reduce((sum, v) => sum + v, 0) / moduleValues.length) * 100) / 100
          : null);
      if (score === null) return null;

      let note =
        getString(record, ['note', 'reason', 'remark', 'weakest_module', 'lagging_module']) ?? '';
      if (!note && moduleValues.length > 0) {
        let weakestIndex = 0;
        let weakestValue = Infinity;
        MODULE_FIELD_CANDIDATES.forEach((keys, idx) => {
          const v = getNumber(record, keys);
          if (v !== null && v < weakestValue) {
            weakestValue = v;
            weakestIndex = idx;
          }
        });
        note = `${MODULE_LABELS[weakestIndex]}: ${weakestValue}%`;
      }
      if (!note) note = 'Needs performance improvement';

      return { name, note, score };
    })
    .filter((item): item is GrowthRow => Boolean(item));
}

function DataState({ loading, empty, label }: { loading: boolean; empty: boolean; label: string }) {
  if (!loading && !empty) return null;
  return (
    <div style={{ fontSize: 12, color: 'var(--sage)', padding: '24px 0', textAlign: 'center' }}>
      {loading ? 'Loading…' : `No ${label} available`}
    </div>
  );
}

export function HeatmapSection() {
  const { openDrill, persona, appliedFilters } = useMsafeDashboard();
  const [heatmapData, setHeatmapData] = useState<HeatmapRow[]>([]);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [heatmapPage, setHeatmapPage] = useState(1);
  const [heatmapPagination, setHeatmapPagination] = useState<Pagination | null>(null);
  const [growthData, setGrowthData] = useState<GrowthRow[]>([]);
  const [growthLoading, setGrowthLoading] = useState(true);

  // "Compliance by Circle × Module" table is hidden (see JSX below) — API call
  // commented out so it's not fetched.
  // useEffect(() => {
  //   const controller = new AbortController();
  //   setHeatmapLoading(true);
  //   (async () => {
  //     try {
  //       const payload = await fetchMsafeUserDashboardJson(
  //         'compliance_by_circle.json',
  //         {
  //           page: String(heatmapPage),
  //           current_page: String(heatmapPage),
  //           ...buildFilterParams(persona, appliedFilters),
  //         },
  //         controller.signal,
  //       );
  //       if (!controller.signal.aborted) {
  //         setHeatmapData(normalizeComplianceByCircle(payload));
  //         setHeatmapPagination(extractPagination(payload));
  //       }
  //     } catch (err) {
  //       if ((err as Error).name !== 'AbortError') console.warn('M-Safe compliance-by-circle API failed.', err);
  //     } finally {
  //       if (!controller.signal.aborted) setHeatmapLoading(false);
  //     }
  //   })();
  //   return () => controller.abort();
  // }, [appliedFilters, persona, heatmapPage]);

  // useEffect(() => {
  //   setHeatmapPage(1);
  // }, [appliedFilters, persona]);

  // "Circles That Need Growth in Performance" table is hidden (see JSX below) — API call
  // (type=growth) commented out so it's not fetched.
  // useEffect(() => {
  //   const controller = new AbortController();
  //   setGrowthLoading(true);
  //   (async () => {
  //     try {
  //       const payload = await fetchMsafeUserDashboardJson(
  //         'compliance_by_circle.json',
  //         { type: 'growth', ...buildFilterParams(persona, appliedFilters) },
  //         controller.signal,
  //       );
  //       if (!controller.signal.aborted) setGrowthData(normalizeGrowthCircles(payload));
  //     } catch (err) {
  //       if ((err as Error).name !== 'AbortError') console.warn('M-Safe compliance-by-circle (growth) API failed.', err);
  //     } finally {
  //       if (!controller.signal.aborted) setGrowthLoading(false);
  //     }
  //   })();
  //   return () => controller.abort();
  // }, [appliedFilters]);

  // Whole section hidden — both "Compliance by Circle × Module" and "Circles
  // That Need Growth in Performance" (the two cards previously here) are
  // hidden with their API calls commented out above, so nothing renders.
  return null;
}
