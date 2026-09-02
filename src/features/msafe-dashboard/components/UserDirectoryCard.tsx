import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Search, Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ChartCard } from './ChartCard';
import { StatusDot } from './StatusDot';
import { overallStatus, type DirectoryUser } from '../data/mockData';
import type { StatusCode, Persona } from '../data/constants';
import { useMsafeDashboard, type AppliedFilters } from '../context/MsafeDashboardContext';
import { getAuthHeader } from '@/config/apiConfig';
import { useDebounce } from '@/hooks/useDebounce';
import { useMSafeEvents } from '@/components/PostHogMSafeEvents';

type Filter = 'all' | 'internal' | 'external' | 'pending' | 'cleared';

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
      const email = getFirstString(record, ['email', 'email_id']) ?? undefined;
      const mobile = getFirstString(record, ['mobile', 'mobile_number', 'phone', 'phone_number']) ?? undefined;

      return { name, emp, type, circle, role, tr, kr, lm, overallLabel, email, mobile };
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

const STATUS_LABEL: Record<StatusCode, string> = {
  ok: 'Completed',
  pending: 'Pending',
  fail: 'Failed',
  na: 'N/A',
};

/** Walks every server page (honoring the active search/filters) and returns the full
 *  result set — used for the "download all" export, since the table itself only ever
 *  holds one page (~20 rows) at a time. */
async function fetchAllDirectoryRows(
  persona: Persona,
  appliedFilters: AppliedFilters,
  search: string,
): Promise<DirectoryUser[]> {
  const commonParams = {
    ...(search ? { search } : {}),
    ...buildFilterParams(persona, appliedFilters),
  };

  const firstPayload = await fetchMsafeUserDashboardJson('employee_compliance_status.json', {
    page: '1',
    current_page: '1',
    per_page: '1000',
    ...commonParams,
  });
  let rows = normalizeDirectory(firstPayload);
  const pageInfo = extractPagination(firstPayload);

  if (pageInfo && pageInfo.perPage > 0 && pageInfo.totalEntries > rows.length) {
    const totalPages = Math.ceil(pageInfo.totalEntries / pageInfo.perPage);
    for (let p = 2; p <= totalPages; p++) {
      const payload = await fetchMsafeUserDashboardJson('employee_compliance_status.json', {
        page: String(p),
        current_page: String(p),
        per_page: String(pageInfo.perPage),
        ...commonParams,
      });
      rows = rows.concat(normalizeDirectory(payload));
    }
  }

  return rows;
}

function downloadDirectoryExcel(rows: DirectoryUser[]) {
  const sheetRows = rows.map((u) => ({
    Name: u.name,
    'Emp ID': u.emp,
    Email: u.email ?? '—',
    'Mobile No.': u.mobile ?? '—',
    Type: u.type,
    Circle: u.circle,
    Role: u.role,
    KRCC: STATUS_LABEL[u.kr],
    LMC: STATUS_LABEL[u.lm],
    Status: u.overallLabel ?? overallStatus(u).t,
  }));
  const worksheet = XLSX.utils.json_to_sheet(sheetRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'All Users');
  XLSX.writeFile(workbook, 'All_Users_KRCC_LMC_Status.xlsx');
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
  const { openDrill, persona, appliedFilters, showToast } = useMsafeDashboard();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim(), 400);
  const [filter, setFilter] = useState<Filter>('all');
  const [directory, setDirectory] = useState<DirectoryUser[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const msafeEvents = useMSafeEvents();

  const handleDownloadAll = async () => {
    if (exportingAll) return;
    setExportingAll(true);
    const downloadEvent = {
      screen: 'msafe_dashboard' as const,
      source: 'user_directory' as const,
      label: 'All Users KRCC/LMC Status',
      file_format: 'xlsx' as const,
      export_mode: 'client_sheet' as const,
      persona,
      filters: appliedFilters,
    };
    try {
      const rows = await fetchAllDirectoryRows(persona, appliedFilters, debouncedSearch);
      if (rows.length === 0) {
        showToast('No data to export');
        msafeEvents.onMsafeDownloaded({
          ...downloadEvent,
          row_count: 0,
          succeeded: false,
          failure_reason: 'no_data',
        });
        return;
      }
      downloadDirectoryExcel(rows);
      showToast(`Excel downloaded · ${rows.length.toLocaleString()} users`);
      msafeEvents.onMsafeDownloaded({ ...downloadEvent, row_count: rows.length, succeeded: true });
    } catch (error) {
      console.warn('Failed to export full user directory to Excel.', error);
      showToast('Export failed — please try again');
      msafeEvents.onMsafeDownloaded({
        ...downloadEvent,
        succeeded: false,
        failure_reason: (error as Error)?.message ?? 'request_failed',
      });
    } finally {
      setExportingAll(false);
    }
  };

  // The API paginates server-side (per_page ~20, total_entries in the hundred-thousands),
  // so each page change re-fetches rather than slicing a locally-held full dataset. Search
  // is server-side too (?search=<name>) — debounced so it doesn't fire on every keystroke.
  useEffect(() => {
    let isMounted = true;
    setDirectoryLoading(true);

    const loadDirectory = async () => {
      try {
        const payload = await fetchMsafeUserDashboardJson('employee_compliance_status.json', {
          page: String(page),
          current_page: String(page),
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
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
  }, [page, appliedFilters, persona, debouncedSearch]);

  // Jump back to page 1 whenever the applied filters or search term change — the old page
  // number may no longer exist against the newly filtered result set.
  useEffect(() => {
    setPage(1);
  }, [appliedFilters, persona, debouncedSearch]);

  // The chip filters (Internal/External/Pending/Cleared) only narrow the currently-loaded
  // page — search itself is now server-side (see fetch above), so it isn't re-applied here.
  const data = useMemo(() => {
    let rows = directory;
    if (filter === 'internal') rows = rows.filter((u) => u.type === 'Internal');
    if (filter === 'external') rows = rows.filter((u) => u.type === 'External');
    if (filter === 'pending') rows = rows.filter((u) => u.tr !== 'ok' || u.kr !== 'ok' || u.lm !== 'ok');
    if (filter === 'cleared') rows = rows.filter((u) => u.tr === 'ok' && u.kr === 'ok' && u.lm === 'ok');
    return rows;
  }, [directory, filter]);

  const totalPages = pagination?.totalPages ?? 1;
  const totalEntries = pagination?.totalEntries ?? directory.length;
  const currentPage = Math.min(page, totalPages);

  return (
    <ChartCard
      title="All Users — with KRCC, LMC status at a glance"
      sub="Search by name, emp ID, mobile no., or email · click any user for full drill-down"
      infoKey="directory"
      style={style}
      tag={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="usr-search">
            <Search size={14} />
            <input
              placeholder="Search by name, emp ID, mobile, or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="chart-pdf-btn"
            title="Download all users as Excel"
            disabled={exportingAll}
            onClick={handleDownloadAll}
          >
            {exportingAll ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          </button>
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
            {c.label}
          </button>
        ))}
      </div>

      <div className="tbl-scroll" style={{ maxHeight: 420 }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Emp ID</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Type</th>
              <th>Circle</th>
              <th>Role</th>
              <th style={{ textAlign: 'center' }}>KRCC</th>
              <th style={{ textAlign: 'center' }}>LMC</th>
              {hideStatusColumn ? null : <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {directoryLoading ? (
              <tr>
                <td colSpan={hideStatusColumn ? 9 : 10} style={{ textAlign: 'center', color: 'var(--sage)', padding: '16px 0' }}>
                  Loading…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={hideStatusColumn ? 9 : 10} style={{ textAlign: 'center', color: 'var(--sage)', padding: '16px 0' }}>
                  No users available
                </td>
              </tr>
            ) : (
              data.map((u) => {
                const st = overallStatus(u);
                return (
                  <tr
                    key={u.emp + u.name}
                  // onClick={() => openDrill('user-detail', u.name)}
                  >
                    <td className="cell-strong">{u.name}</td>
                    <td className="cell-mono">{u.emp}</td>
                    <td>{u.email ?? '—'}</td>
                    <td className="cell-mono">{u.mobile ?? '—'}</td>
                    <td>
                      <span className={`badge ${u.type === 'Internal' ? 'b-info' : 'b-neutral'}`}>
                        {u.type}
                      </span>
                    </td>
                    <td>{u.circle}</td>
                    <td>{u.role}</td>
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
