import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Eye, Plus, Users, CheckCircle2, Clock, ListChecks } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';

const columns = [
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'done_by_name', label: 'Done by Name', sortable: true },
    { key: 'done_by_email', label: 'Done by Email Id', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lmc_done_on', label: 'LMC done on Date', sortable: true },
];

// Types for API
interface LMCUserRef { id: number; name: string; email: string; mobile?: string | null; employee_type?: string | null; }
interface LMCRecord {
    id: number;
    user_id: number;
    company_id?: number;
    created_by_id?: number;
    validity_date?: string | null;
    form_details?: any;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    url?: string | null;
    lmc_user?: LMCUserRef | null;
    created_by?: LMCUserRef | null;
}
interface LMCApiResponse { lmcs?: LMCRecord[]; pagination?: { current_page: number; total_count: number; total_pages: number }; }

interface LMCTableRow {
    id: number;
    name: string;
    email: string;
    done_by_name: string;
    done_by_email: string;
    status: string;
    lmc_done_on: string; // formatted date
    raw_date?: string | null;
}

const PAGE_SIZE = 20; // rely on API default page size (adjust if backend supports per_page param)


const LMCDashboard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState<LMCTableRow[]>([]);
    const [filteredData, setFilteredData] = useState<LMCTableRow[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    // Draft values inside modal
    const [filterUserEmail, setFilterUserEmail] = useState('');
    const [filterCreatedByEmail, setFilterCreatedByEmail] = useState('');
    // Applied values used for server query
    const [appliedUserEmail, setAppliedUserEmail] = useState('');
    const [appliedCreatedByEmail, setAppliedCreatedByEmail] = useState('');

    // Format date to DD/MM/YYYY HH:MM
    const formatDateTime = (iso?: string | null) => {
        if (!iso) return '—';
        try {
            const d = new Date(iso);
            return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch { return '—'; }
    };

    // Fetch LMC list
    const fetchLMCs = useCallback(async (page: number) => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
            setError('Missing base URL or token');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Build query params
            const params: string[] = [`page=${page}`];
            // If a modal-applied user email filter exists, it overrides the search bar for that param
            if (appliedUserEmail) params.push(`q[user_email_cont]=${appliedUserEmail.trim()}`);
            else if (searchTerm) params.push(`q[user_email_cont]=${searchTerm.trim()}`);
            if (appliedCreatedByEmail) params.push(`q[created_by_email_cont]=${appliedCreatedByEmail.trim()}`);
            const url = `https://${baseUrl}/lmcs.json?${params.join('&')}`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error(`Failed (${res.status})`);
            const json: LMCApiResponse = await res.json();
            const apiRows = (json.lmcs || []).map(l => ({
                id: l.id,
                name: l.lmc_user?.name || '—',
                email: l.lmc_user?.email || '—',
                done_by_name: l.created_by?.name || '—',
                done_by_email: l.created_by?.email || '—',
                status: l.status || '—',
                lmc_done_on: formatDateTime(l.created_at),
                raw_date: l.created_at
            })) as LMCTableRow[];
            setRows(apiRows);
            setFilteredData(apiRows); // server already filtered
            if (json.pagination) {
                setCurrentPage(json.pagination.current_page);
                setTotalPages(json.pagination.total_pages);
                setTotalCount(json.pagination.total_count);
            } else {
                setTotalPages(1); setTotalCount(apiRows.length); setCurrentPage(1);
            }
        } catch (e: any) {
            setError(e.message || 'Failed to load LMCs');
        } finally { setLoading(false); }
    }, [appliedUserEmail, appliedCreatedByEmail, searchTerm]);

    useEffect(() => { fetchLMCs(currentPage); }, [fetchLMCs, currentPage]);

    // Apply search term (client side) whenever it changes
    useEffect(() => { setFilteredData(rows); }, [rows]);

    // Client-side filtering no longer needed since server applies filters; kept for future extension if required.
    const applyAllFilters = () => { };

    // Analytics counts (use filtered or total?) Using total count from pagination & status breakdown from current page
    const cardData = [
        { title: 'Total LMCs', count: totalCount || rows.length, icon: Users },
        { title: 'Completed', count: rows.filter(r => r.status === 'Completed').length, icon: CheckCircle2 },
        { title: 'Pending', count: rows.filter(r => r.status === 'Pending').length, icon: Clock },
        { title: 'In Progress', count: rows.filter(r => r.status?.toLowerCase().includes('progress')).length, icon: ListChecks }
    ];

    const navigate = useNavigate();
    const renderCell = (row, columnKey) => {
        if (columnKey === 'actions') {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => navigate(`/maintenance/m-safe/lmc/${row.id}`, { state: { row } })}
                >
                    <Eye className="h-4 w-4" />
                </Button>
            );
        }
        // Defensive: fallback to empty string if value is undefined/null
        return (row && row[columnKey] !== undefined && row[columnKey] !== null) ? row[columnKey] : '';
    };

    // Dummy export handler
    const handleExport = () => {
        const headers = columns.map(col => col.label).join(',');
        const csvContent = [
            headers,
            ...filteredData.map(row => columns.map(col => {
                const value: any = (row as any)[col.key];
                const stringValue = String(value ?? '').replace(/"/g, '""');
                return (/,|"|\n/.test(stringValue)) ? `"${stringValue}"` : stringValue;
            }).join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'lmc-export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleFilterClick = () => {
        setIsFilterModalOpen(true);
    };

    const handleApplyFilters = () => {
        setAppliedUserEmail(filterUserEmail.trim());
        setAppliedCreatedByEmail(filterCreatedByEmail.trim());
        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    const handleResetFilters = () => {
        setFilterUserEmail('');
        setFilterCreatedByEmail('');
        setAppliedUserEmail('');
        setAppliedCreatedByEmail('');
        setCurrentPage(1);
    };

    return (
        <div className="p-6">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cardData.map((card, idx) => (
                    <div
                        key={idx}
                        className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]"
                    >
                        <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54] rounded-full">
                            <card.icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                                {card.count}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                                {card.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div> */}
            <div className="rounded-lg">
                <EnhancedTable
                    data={filteredData}
                    columns={columns}
                    renderCell={renderCell}
                    pagination={false}
                    loading={loading}
                    enableSearch={true}
                    searchTerm={searchTerm}
                    onSearchChange={(val: string) => { setCurrentPage(1); setSearchTerm(val); }}
                    searchPlaceholder="Search by User Email..."
                    // leftActions={<Button className="text-white bg-[#C72030] hover:bg-[#C72030]/90"><Plus className="w-4 h-4" />Action</Button>}
                    getItemId={(row: LMCTableRow) => row.id.toString()}
                    onFilterClick={handleFilterClick}
                    handleExport={handleExport}
                    exportFileName="lmc-export"
                    emptyMessage={loading ? 'Loading LMCs...' : 'No LMC records found'}
                />
                {/* External Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                                </PaginationItem>
                                {(() => {
                                    if (totalPages <= 7) {
                                        return Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <PaginationItem key={p}>
                                                <PaginationLink onClick={() => setCurrentPage(p)} isActive={currentPage === p} className="cursor-pointer">{p}</PaginationLink>
                                            </PaginationItem>
                                        ));
                                    }
                                    const items: (number | 'ellipsis')[] = [];
                                    items.push(1);
                                    let start = Math.max(2, currentPage - 2);
                                    let end = Math.min(totalPages - 1, currentPage + 2);
                                    // ensure window size ~5 between first & last
                                    const windowSize = end - start + 1;
                                    if (windowSize < 5) {
                                        const deficit = 5 - windowSize;
                                        if (start === 2) {
                                            end = Math.min(totalPages - 1, end + deficit);
                                        } else if (end === totalPages - 1) {
                                            start = Math.max(2, start - deficit);
                                        }
                                    }
                                    if (start > 2) items.push('ellipsis');
                                    for (let p = start; p <= end; p++) items.push(p);
                                    if (end < totalPages - 1) items.push('ellipsis');
                                    items.push(totalPages);
                                    return items.map((it, idx) => it === 'ellipsis'
                                        ? (<PaginationItem key={`e-${idx}`}><span className="px-2 select-none">...</span></PaginationItem>)
                                        : (<PaginationItem key={it}><PaginationLink onClick={() => setCurrentPage(it)} isActive={currentPage === it} className="cursor-pointer">{it}</PaginationLink></PaginationItem>)
                                    );
                                })()}
                                <PaginationItem>
                                    <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
            {/* Filter modal using MUI fields and Button */}
            <Dialog open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, borderBottom: '1px solid #eee', pb: 1.5 }}>
                    Filter
                    <IconButton onClick={() => setIsFilterModalOpen(false)} size="small">
                        <X className="w-4 h-4" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 3, pb: 2 }}>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField
                            label="User Email"
                            variant="outlined"
                            size="small"
                            value={filterUserEmail}
                            onChange={e => setFilterUserEmail(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: Boolean(filterUserEmail) || undefined }}
                        />
                        <TextField
                            label="Created By Email"
                            variant="outlined"
                            size="small"
                            value={filterCreatedByEmail}
                            onChange={e => setFilterCreatedByEmail(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: Boolean(filterCreatedByEmail) || undefined }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
                    <Button
                        variant="outline"
                        onClick={handleResetFilters}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={handleApplyFilters}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LMCDashboard;
