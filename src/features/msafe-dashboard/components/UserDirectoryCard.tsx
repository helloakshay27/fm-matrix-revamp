import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Search } from 'lucide-react';
import { ChartCard } from './ChartCard';
import { StatusDot } from './StatusDot';
import { overallStatus, type DirectoryUser } from '../data/mockData';
import type { StatusCode } from '../data/constants';
import { useMsafeDashboard } from '../context/MsafeDashboardContext';
import { getAuthHeader } from '@/config/apiConfig';

type Filter = 'all' | 'internal' | 'external' | 'pending' | 'cleared';

const PAGE_SIZE = 10;

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
  if (/pass|complete|cleared|approved|^ok$|done|active/.test(s)) return 'ok';
  if (/pending|progress|initiated|open|wait/.test(s)) return 'pending';
  if (/fail|reject|declined|^no$|overdue/.test(s)) return 'fail';
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
    for (const key of ['data', 'result', 'employees', 'users', 'records']) {
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

      return { name, emp, type, circle, role, tr, kr, lm };
    })
    .filter((item): item is DirectoryUser => Boolean(item));
};

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
export function UserDirectoryCard({ style }: { style?: CSSProperties }) {
  const { openDrill } = useMsafeDashboard();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [directory, setDirectory] = useState<DirectoryUser[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const loadDirectory = async () => {
      try {
        const payload = await fetchMsafeUserDashboardJson('employee_compliance_status.json');
        const normalized = normalizeDirectory(payload);
        if (isMounted) setDirectory(normalized);
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
  }, []);

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

  useEffect(() => {
    setPage(1);
  }, [directory, filter, search]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedData = useMemo(
    () => data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [data, currentPage],
  );

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
        {CHIP_DEFS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`mini-chip ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(c.id)}
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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {directoryLoading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--sage)', padding: '16px 0' }}>
                  Loading…
                </td>
              </tr>
            ) : pagedData.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--sage)', padding: '16px 0' }}>
                  No users available
                </td>
              </tr>
            ) : (
              pagedData.map((u) => {
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
                    <td>
                      <span className={`badge ${st.c}`}>{st.t}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 ? (
        <div className="tbl-pagination">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, data.length)} of{' '}
            {data.length} users
          </span>
          <div className="pg-controls">
            <button
              type="button"
              className="pg-btn"
              disabled={currentPage === 1}
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
              disabled={currentPage === totalPages}
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
