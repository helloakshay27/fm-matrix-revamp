import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box as BoxIcon, RefreshCcw, Eye, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
    current_page: number; // 1-based
    per_page: number;
    total_pages: number;
    records: DeletionRecord[];
};

const EmployeeDeletionHistory: React.FC = () => {
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
        console.log(baseUrl, token, companyID);
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ company_id: String(companyID), page: String(p), per_page: String(pp) });
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
        } catch (e: any) {
            console.error('Employee deletion history fetch error', e);
            setError(e?.message || 'Failed to load employee deletion history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page, perPage, search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, perPage]);

    // Debounce search input; reset to page 1 when term changes
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
            return `${d}/${m}/${y} ${hh}:${mm}`; // DD/MM/YYYY HH:mm (24-hour)
        } catch { return '—'; }
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

    return (
        <div className="bg-white rounded-lg border mt-6 ml-4 mr-4">
            <div className="flex p-4 items-center bg-[#F6F4EE] justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                        <BoxIcon className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-[700]">EMPLOYEE DELETION HISTORY</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search by email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 bg-white"
                    />
                    <Button variant="outline" size="sm" onClick={() => fetchData()} disabled={loading}>
                        <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="p-4">
                {loading && (
                    <div className="text-gray-600 text-sm">Loading...</div>
                )}
                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}
                {!loading && !error && rows.length === 0 && (
                    <div className="text-gray-600 text-sm">No records available.</div>
                )}

                {!loading && !error && rows.length > 0 && (
                    <div className="rounded-md border border-gray-200 shadow-sm">
                        <div className="max-h-[520px] overflow-y-auto relative">
                            <table className="min-w-full text-sm">
                                <thead className="sticky top-0 z-10 bg-gray-100/95 backdrop-blur-sm">
                                    <tr>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">Serial Number</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">Employee Name</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">Deleted User Email</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">Deleted Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">Deleted By</th>

                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 border-b border-gray-200 whitespace-nowrap">Employee Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {rows.map((r, idx) => (
                                        <tr key={r.id} className="hover:bg-gray-50">
                                            <td className="p-4 align-middle whitespace-nowrap">{serialBase + idx + 1}</td>
                                            <td className="p-4 align-middle whitespace-nowrap font-medium">{renderName(r)}</td>
                                            <td className="p-4 align-middle whitespace-nowrap">{r.detail?.email || r.user_email || '—'}</td>
                                            <td className="p-4 align-middle whitespace-nowrap">{formatDateTime(r.created_at)}</td>

                                            <td className="p-4 align-middle whitespace-nowrap">{r.deleted_by_email || '—'}</td>

                                            <td className="p-4 align-middle">
                                                <button
                                                    type="button"
                                                    aria-label="View employee detail"
                                                    className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                                                    onMouseEnter={() => handleHoverStart(r)}
                                                    onMouseLeave={handleHoverEnd}
                                                    onClick={() => openDetails(r)}
                                                >
                                                    <Eye className="w-4 h-4 text-gray-700" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Footer with simple pager (optional) */}
                {!loading && !error && rows.length > 0 && (
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                        <div>
                            Page {page} of {totalPages} • Total {totalCount}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
                            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
                        </div>
                    </div>
                )}
            </div>
            {/* Detail Dialog */}
            <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-3xl" onMouseLeave={() => setDetailOpen(false)}>
                    {/* Close (X) button */}
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
                        <DialogTitle className='text-[#c72030]'>Employee Details</DialogTitle>
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
                                <div className="text-xs text-gray-500">Deleted By: {selected.deleted_by_email || '—'} • Deleted At: {formatDateTime(selected.created_at)}</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <div className="flex justify-between gap-3"><span className="text-gray-500">First Name</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.firstname || '—'}>{selected.detail?.firstname || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Last Name</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.lastname || '—'}>{selected.detail?.lastname || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Email</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.email || selected.user_email || '—'}>{selected.detail?.email || selected.user_email || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Mobile</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.mobile || '—'}>{selected.detail?.mobile || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Role</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.role_name || '—'}>{selected.detail?.role_name || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Department</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.department_name || '—'}>{selected.detail?.department_name || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Circle</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.circle_name || '—'}>{selected.detail?.circle_name || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Cluster</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.cluster_name || '—'}>{selected.detail?.cluster_name || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Report To Name</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.report_to_name || '—'}>{selected.detail?.report_to_name || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Report To Email</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.report_to_email || '—'}>{selected.detail?.report_to_email || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Created By Name</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.created_by_name || '—'}>{selected.detail?.created_by_name || '—'}</span></div>
                                <div className="flex justify-between gap-3"><span className="text-gray-500">Created By Email</span><span className="font-medium truncate max-w-[60%]" title={selected.detail?.created_by_email || '—'}>{selected.detail?.created_by_email || '—'}</span></div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeeDeletionHistory;