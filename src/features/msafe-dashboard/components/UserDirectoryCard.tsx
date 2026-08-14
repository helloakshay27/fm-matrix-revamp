import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Search } from 'lucide-react';
import { ChartCard } from './ChartCard';
import { StatusDot } from './StatusDot';
import { overallStatus, type DirectoryUser } from '../data/mockData';
import type { StatusCode, Persona } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import { getAuthHeader } from '@/config/apiConfig';

type Filter = 'all' | 'internal' | 'external' | 'pending' | 'cleared';

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

const getFirstString = (record: Record<string, unknown>, keys: string[]): string | null => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
};

function mapEmployeeType(raw: unknown): 'Internal' | 'External' {
  const s = String(raw ?? '').trim().toLowerCase();
  if (/external|contractor|vendor|non[- ]?fte/.test(s)) return 'External';
  return 'Internal';
}

function mapStatus(raw: unknown): StatusCode {
  if (raw === null || raw === undefined) return 'na';
  const s = String(raw).trim().toLowerCase();
  if (!s) return 'na';
  // Order matters: "not completed" contains "completed", so negated forms must be checked first.
  if (/not\s*applicable|^n\/?a$/.test(s)) return 'na';
  if (/not\s*(completed|started|cleared|done|applicable)/.test(s)) return 'pending';
  if (/fail|reject|declined|^no$|overdue/.test(s)) return 'fail';
  if (/pending|progress|initiated|open|wait/.test(s)) return 'pending';
  if (/pass|complete|cleared|approved|^ok$|done|active/.test(s)) return 'ok';
  return 'na';
}

const normalizeDirectory = (payload: unknown): DirectoryUser[] => {
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? (payload as Record<string, unknown>)
      : null;

  let list: unknown[] = Array.isArray(source) ? source : [];
  if (!Array.isArray(source)) {
    for (const key of ['employee_compliance_status', 'data', 'result', 'employees', 'users', 'records']) {
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

      const name = getFirstString(record, ['employee_name', 'name', 'emp_name', 'full_name', 'label', 'title']);
      if (!name) return null;

      const emp =
        getFirstString(record, ['employee_id', 'emp_id', 'emp_code', 'employee_code', 'emp']) ?? '—';
      const type = mapEmployeeType(
        record.employment_type ?? record.type ?? record.user_type ?? record.category,
      );
      const circle = getFirstString(record, ['circle_name', 'circle']) ?? '—';
      const role = getFirstString(record, ['role', 'designation', 'role_name', 'department', 'function']) ?? '—';

      const tr = mapStatus(record.training_status ?? record.tr_status ?? record.training ?? record.tr);
      const kr = mapStatus(record.krcc_status ?? record.kr_status ?? record.krcc ?? record.kr);
      const lm = mapStatus(record.lmc_status ?? record.lm_status ?? record.lmc ?? record.lm);
      const overallLabel = getFirstString(record, ['overall_status']) ?? undefined;

      return { name, emp, type, circle, role, tr, kr, lm, overallLabel };
    })
    .filter((item): item is DirectoryUser => Boolean(item));
};

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

const CHIP_DEFS: { id: Filter; label: string; match: (u: DirectoryUser) => boolean }[] = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'internal', label: 'Internal FTE', match: (u) => u.type === 'Internal' },
  { id: 'external', label: 'External NON-FTE', match: (u) => u.type === 'External' },
  {
    id: 'pending',
    label: 'Pending Any Step',
    match: (u) => u.tr !== 'ok' || u.kr !== 'ok' || u.lm !== 'ok',
  },
  { id: 'cleared', label: 'Fully Cleared', match: (u) => u.tr === 'ok' && u.kr === 'ok' && u.lm === 'ok' },
];

/** Full searchable/filterable user directory — matches vi_msafe_v6.html */
export function UserDirectoryCard({
  style,
  hideStatusColumn,
}: {
  style?: CSSProperties;
  hideStatusColumn?: boolean;
}) {
  const { openDrill, persona, appliedFilters } = useMsafeDashboard();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [directory, setDirectory] = useState<DirectoryUser[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // The API paginates server-side (per_page ~20, total_entries in the hundred-thousands),
  // so each page change re-fetches rather than slicing a locally-held full dataset.
  useEffect(() => {
    let isMounted = true;
    setDirectoryLoading(true);

    const loadDirectory = async () => {
      try {
        const payload = await fetchMsafeUserDashboardJson('employee_compliance_status.json', {
          page: String(page),
          current_page: String(page),
          ...buildFilterParams(persona, appliedFilters),
        });
        const normalized = normalizeDirectory(payload);
        if (isMounted) {
          setDirectory(normalized);
          setPagination(extractPagination(payload));
        }
        if (normalized.length === 0) {
          console.warn(
            'M-Safe employee-compliance-status API returned no usable rows — check the raw response shape below and update normalizeDirectory field candidates if needed.',
            payload,
          );
        }
      } catch (error) {
        console.warn('M-Safe employee-compliance-status API failed.', error);
      } finally {
        if (isMounted) setDirectoryLoading(false);
      }
    };

    loadDirectory();

    return () => {
      isMounted = false;
    };
  }, [page, appliedFilters, persona]);

  // Jump back to page 1 whenever the applied filters change — the old page number
  // may no longer exist against the newly filtered result set.
  useEffect(() => {
    setPage(1);
  }, [appliedFilters, persona]);

  // Search/filter narrow the currently-loaded page only — there's no confirmed
  // server-side search/filter param, so they can't reach across all ~112k records.
  const data = useMemo(() => {
    let rows = directory;
    if (filter === 'internal') rows = rows.filter((u) => u.type === 'Internal');
    if (filter === 'external') rows = rows.filter((u) => u.type === 'External');
    if (filter === 'pending') rows = rows.filter((u) => u.tr !== 'ok' || u.kr !== 'ok' || u.lm !== 'ok');
    if (filter === 'cleared') rows = rows.filter((u) => u.tr === 'ok' && u.kr === 'ok' && u.lm === 'ok');
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((u) => (u.name + u.emp + u.role).toLowerCase().includes(q));
    }
    return rows;
  }, [directory, filter, search]);

  const totalPages = pagination?.totalPages ?? 1;
  const totalEntries = pagination?.totalEntries ?? directory.length;
  const currentPage = Math.min(page, totalPages);

  return (
    <ChartCard
      title="All Users — with KRCC, LMC, Training status at a glance"
      sub="Search by name, email, or emp ID · click any user for full drill-down"
      infoKey="directory"
      style={style}
      tag={
        <div className="usr-search">
          <Search size={14} />
          <input
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      }
    >
      <div className="mini-filter">
        {CHIP_DEFS.filter((c) => !hideStatusColumn || (c.id !== 'pending' && c.id !== 'cleared')).map((c) => (
          <button
            key={c.id}
            type="button"
            className={`mini-chip ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(c.id)}
            title="Count reflects the current page only"
          >
            {c.label} ({directory.filter(c.match).length.toLocaleString()})
          </button>
        ))}
      </div>

      <div className="tbl-scroll" style={{ maxHeight: 420 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Emp ID</th>
              <th>Type</th>
              <th>Circle</th>
              <th>Role</th>
              <th style={{ textAlign: 'center' }}>Training</th>
              <th style={{ textAlign: 'center' }}>KRCC</th>
              <th style={{ textAlign: 'center' }}>LMC</th>
              {hideStatusColumn ? null : <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {directoryLoading ? (
              <tr>
                <td colSpan={hideStatusColumn ? 8 : 9} style={{ textAlign: 'center', color: 'var(--sage)', padding: '16px 0' }}>
                  Loading…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={hideStatusColumn ? 8 : 9} style={{ textAlign: 'center', color: 'var(--sage)', padding: '16px 0' }}>
                  No users available
                </td>
              </tr>
            ) : (
              data.map((u) => {
                const st = overallStatus(u);
                return (
                  <tr key={u.emp + u.name} onClick={() => openDrill('user-detail', u.name)}>
                    <td className="cell-strong">{u.name}</td>
                    <td className="cell-mono">{u.emp}</td>
                    <td>
                      <span className={`badge ${u.type === 'Internal' ? 'b-info' : 'b-neutral'}`}>
                        {u.type}
                      </span>
                    </td>
                    <td>{u.circle}</td>
                    <td>{u.role}</td>
                    <td style={{ textAlign: 'center' }}>
                      <StatusDot value={u.tr} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <StatusDot value={u.kr} />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <StatusDot value={u.lm} />
                    </td>
                    {hideStatusColumn ? null : (
                      <td>
                        <span className={`badge ${st.c}`}>{st.t}</span>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!directoryLoading && directory.length > 0 ? (
        <div className="tbl-pagination">
          <span>
            {data.length.toLocaleString()} on this page · {totalEntries.toLocaleString()} users total
          </span>
          <div className="pg-controls">
            <button
              type="button"
              className="pg-btn"
              disabled={currentPage === 1 || directoryLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="pg-page">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              className="pg-btn"
              disabled={currentPage === totalPages || directoryLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </ChartCard>
  );
}
