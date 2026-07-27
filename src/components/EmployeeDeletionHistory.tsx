import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box as BoxIcon, RefreshCcw, Eye, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { useMSafeEvents } from '@/components/PostHogMSafeEvents';

type DeletionDetail = {
  email?: string;
  mobile?: string;
  lastname?: string;
  firstname?: string;
  role_name?: string;
  circle_name?: string;
  cluster_name?: string;
  report_to_name?: string;
  created_by_name?: string;
  department_name?: string;
  report_to_email?: string;
  created_by_email?: string;
};

type DeletionRecord = {
  id: number;
  user_email?: string;
  company_id?: number;
  deleted_by_email?: string;
  detail?: DeletionDetail;
  created_at?: string;
};

type ApiResponse = {
  total_count: number;
  current_page: number;
  per_page: number;
  total_pages: number;
  records: DeletionRecord[];
};

type TableRow = DeletionRecord & { serial_number: number };

const columns: ColumnConfig[] = [
  { key: 'serial_number', label: 'Serial Number', sortable: true, hideable: true, defaultVisible: true },
  { key: 'employee_name', label: 'Employee Name', sortable: true, hideable: true, defaultVisible: true },
  { key: 'user_email', label: 'Deleted User Email', sortable: true, hideable: true, defaultVisible: true },
  { key: 'created_at', label: 'Deleted Date', sortable: true, hideable: true, defaultVisible: true },
  { key: 'deleted_by_email', label: 'Deleted By', sortable: true, hideable: true, defaultVisible: true },
];

const EmployeeDeletionHistory: React.FC = () => {
  const { shouldShow } = useDynamicPermissions();
  const msafeEvents = useMSafeEvents();
  const viewedFiredRef = React.useRef(false);
  const [rows, setRows] = useState<DeletionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<DeletionRecord | null>(null);
  const hoverTimerRef = React.useRef<number | null>(null);

  const baseUrl = localStorage.getItem('baseUrl') || '';
  const token = localStorage.getItem('token') || '';
  const companyID = localStorage.getItem('selectedCompanyId') || '';

  const fetchData = async (p = page, pp = perPage, s = search) => {
    if (!baseUrl || !token || !companyID) {
      setError('Missing baseUrl/token/company');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        company_id: String(companyID),
        page: String(p),
        per_page: String(pp),
      });
      const term = (s || '').trim();
      if (term.length > 0) {
        params.append('q[user_email_cont]', term);
      }
      const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      const url = `${cleanBaseUrl}/pms/users/get_employee_deletion_history.json?${params.toString()}`;
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!resp.ok) throw new Error('Failed to load');
      const data: ApiResponse = await resp.json();
      setRows(Array.isArray(data.records) ? data.records : []);
      setTotalPages(Number(data.total_pages || 1));
      setTotalCount(Number(data.total_count || 0));
      if (data.per_page) setPerPage(Number(data.per_page));
      if (!viewedFiredRef.current) {
        viewedFiredRef.current = true;
        msafeEvents.onDeletionHistoryViewed(Number(data.total_count || 0));
      }
    } catch (e: unknown) {
      console.error('Employee deletion history fetch error', e);
      const message = e instanceof Error ? e.message : 'Failed to load employee deletion history';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page, perPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage]);

  useEffect(() => {
    const h = setTimeout(() => {
      setPage(1);
      fetchData(1, perPage, search);
    }, 400);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const serialBase = (page - 1) * perPage;

  const renderName = (r: DeletionRecord) => {
    const fn = (r.detail?.firstname || '').trim();
    const ln = (r.detail?.lastname || '').trim();
    const full = `${fn} ${ln}`.trim();
    return full || r.user_email || '-';
  };

  const formatDateTime = (iso?: string) => {
    if (!iso) return '—';
    try {
      const dt = new Date(iso);
      if (Number.isNaN(dt.getTime())) return '—';
      const pad = (n: number) => String(n).padStart(2, '0');
      const d = pad(dt.getDate());
      const m = pad(dt.getMonth() + 1);
      const y = dt.getFullYear();
      const hh = pad(dt.getHours());
      const mm = pad(dt.getMinutes());
      return `${d}/${m}/${y} ${hh}:${mm}`;
    } catch {
      return '—';
    }
  };

  const openDetails = (rec: DeletionRecord) => {
    setSelected(rec);
    setDetailOpen(true);
  };

  const handleHoverStart = (rec: DeletionRecord) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      openDetails(rec);
      hoverTimerRef.current = null;
    }, 1000);
  };

  const handleHoverEnd = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const tableData: TableRow[] = rows.map((r, idx) => ({
    ...r,
    serial_number: serialBase + idx + 1,
  }));

  const renderCell = (item: TableRow, columnKey: string) => {
    switch (columnKey) {
      case 'serial_number':
        return item.serial_number;
      case 'employee_name':
        return <span className="font-medium text-gray-900">{renderName(item)}</span>;
      case 'user_email':
        return <span className="text-gray-900">{item.detail?.email || item.user_email || '—'}</span>;
      case 'created_at':
        return formatDateTime(item.created_at);
      case 'deleted_by_email':
        return item.deleted_by_email || '—';
      default:
        return '—';
    }
  };

  const renderActions = (item: TableRow) =>
    shouldShow('M Safe', 'show') ? (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label="View employee detail"
        title="View"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onMouseEnter={() => handleHoverStart(item)}
        onMouseLeave={handleHoverEnd}
        onClick={() => openDetails(item)}
      >
        <Eye className="w-4 h-4" />
      </Button>
    ) : null;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EMPLOYEE DELETION HISTORY</h1>
        <p className="text-sm text-gray-600 mt-1">
          Audit log of removed employees with related profile details.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center p-4 pb-2">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <BoxIcon className="w-6 h-6 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">DELETION LOG</h2>
        </div>

        <div className="px-4 pb-4 pt-0">
          {error && <div className="text-red-600 text-sm py-6">{error}</div>}

          {!error && (
            <div className="w-full min-w-0 max-w-full">
              <EnhancedTable
                data={tableData}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                storageKey="employee-deletion-history-table"
                enableSearch
                searchTerm={search}
                onSearchChange={setSearch}
                disableClientSearch
                searchPlaceholder="Search by email..."
                hideTableExport
                loading={loading}
                emptyMessage="No records available."
                getItemId={(item) => String(item.id)}
                leftActions={
                  <Button
                    onClick={() => fetchData()}
                    variant="outline"
                    className="h-9 px-4 text-sm font-medium whitespace-nowrap rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 [&_svg]:text-black"
                    disabled={loading}
                  >
                    <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                }
              />
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-xs text-gray-600">
              <div>
                Page {page} of {totalPages} • Total {totalCount}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-gray-300 bg-white hover:bg-gray-50"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-gray-300 bg-white hover:bg-gray-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-3xl" onMouseLeave={() => setDetailOpen(false)}>
          <button
            type="button"
            aria-label="Close"
            title="Close"
            onClick={() => setDetailOpen(false)}
            className="absolute top-3 right-3 inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
          <DialogHeader>
            <DialogTitle className="text-[#C72030]">Employee Details</DialogTitle>
            <DialogDescription>Deletion log and profile information</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="mt-2">
              <div className="mb-4">
                <div className="text-base font-semibold">
                  {(() => {
                    const fn = (selected.detail?.firstname || '').trim();
                    const ln = (selected.detail?.lastname || '').trim();
                    const full = `${fn} ${ln}`.trim();
                    return full || selected.user_email || '—';
                  })()}
                </div>
                <div className="text-xs text-gray-500">
                  Deleted By: {selected.deleted_by_email || '—'} • Deleted At:{' '}
                  {formatDateTime(selected.created_at)}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">First Name</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.firstname || '—'}>
                    {selected.detail?.firstname || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Last Name</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.lastname || '—'}>
                    {selected.detail?.lastname || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Email</span>
                  <span
                    className="font-medium truncate max-w-[60%] text-gray-900"
                    title={selected.detail?.email || selected.user_email || '—'}
                  >
                    {selected.detail?.email || selected.user_email || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Mobile</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.mobile || '—'}>
                    {selected.detail?.mobile || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.role_name || '—'}>
                    {selected.detail?.role_name || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Department</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.department_name || '—'}>
                    {selected.detail?.department_name || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Circle</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.circle_name || '—'}>
                    {selected.detail?.circle_name || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Cluster</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.cluster_name || '—'}>
                    {selected.detail?.cluster_name || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Report To Name</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.report_to_name || '—'}>
                    {selected.detail?.report_to_name || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Report To Email</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.report_to_email || '—'}>
                    {selected.detail?.report_to_email || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Created By Name</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.created_by_name || '—'}>
                    {selected.detail?.created_by_name || '—'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Created By Email</span>
                  <span className="font-medium truncate max-w-[60%]" title={selected.detail?.created_by_email || '—'}>
                    {selected.detail?.created_by_email || '—'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeDeletionHistory;
