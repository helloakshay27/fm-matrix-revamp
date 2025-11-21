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
import { Eye, Download, Users, CheckCircle2, Clock, ListChecks } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import formSchema from './lmc_form.json';

const columns = [
    { key: 'actions', label: 'Actions', sortable: false },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'done_by_name', label: 'Done by Name', sortable: true },
    { key: 'done_by_email', label: 'Done by Email Id', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lmc_done_on', label: 'LMC done on Date', sortable: true },
    { key: 'lmc_done_by_number', label: 'LMC done by Number', sortable: true },
    { key: 'lmc_done_on_number', label: 'LMC done on Number', sortable: true },


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
    lmc_done_by_number: string;
    lmc_done_on_number: string;
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
    // Track which row is currently generating a PDF (disable its button)
    const [generatingId, setGeneratingId] = useState<number | null>(null);

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
        const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
            const url = `${cleanBaseUrl}/lmcs.json?${params.join('&')}`;
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
                raw_date: l.created_at,
                lmc_done_by_number: l.created_by?.mobile || '—',
                lmc_done_on_number: l.lmc_user?.mobile || '—'
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

    const downloadPdf = async (row: LMCTableRow) => {
        const baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
            setError('Missing base URL or token');
            console.error('[LMC][PDF] Missing baseUrl or token in localStorage');
            setGeneratingId(null);
            return;
        }
        setGeneratingId(row.id);
        try {
            console.log('[LMC][PDF] Start generation for id', row.id);
            // Fetch full detail for this LMC (similar to detail page)
            const res = await fetch(`https://${baseUrl}/lmcs/${row.id}.json`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) throw new Error('Failed to fetch detail');
            const detail: any = await res.json();
            console.log('[LMC][PDF] Detail fetched keys:', Object.keys(detail));

            // Normalize weird key if present
            if (detail && detail['selected_krcc_categories='] && !detail.selected_krcc_categories) {
                detail.selected_krcc_categories = detail['selected_krcc_categories='];
            }

            // Section title mapping (subset identical to detail page)
            const SECTION_TITLE_MAP: Record<string, string> = {
                'KrccRequirementComingFrom.car': 'Drive a 4 Wheeler',
                'KrccRequirementComingFrom.bike': 'Ride a 2 Wheeler',
                'KrccRequirementComingFrom.electrical': 'Work on Electrical System',
                'KrccRequirementComingFrom.height': 'Work at Height',
                'KrccRequirementComingFrom.workUnderground': 'Work underground',
                'KrccRequirementComingFrom.rideBicycle': 'Ride a Bicycle',
                'KrccRequirementComingFrom.operateMHE': 'Operate MHE',
                'KrccRequirementComingFrom.liftMaterialManually': 'Lift Material Manually',
                'KrccRequirementComingFrom.noneOfTheAbove': 'None of the above',
                'form': 'LMC Form',
                'final_page_form': 'Common LMC Form'
            };

            const alwaysInclude = ['form', 'final_page_form'];
            const selectedRaw: any[] = Array.isArray(detail?.selected_krcc_categories) ? detail.selected_krcc_categories : [];
            const normalizedSelected = selectedRaw
                .map(c => (typeof c === 'string' ? c.trim() : c))
                .filter(Boolean) as string[];
            const orderedKeys: string[] = [];
            const seen = new Set<string>();
            alwaysInclude.forEach(k => { if (!seen.has(k)) { seen.add(k); orderedKeys.push(k); } });
            normalizedSelected.forEach(k => { if (!seen.has(k)) { seen.add(k); orderedKeys.push(k); } });

            const formDetails = detail?.form_details || {};
            const groups = orderedKeys.map(sectionKey => {
                const section = formSchema[sectionKey];
                if (!section) return { key: sectionKey, items: [] as { q: string; a: string }[] };
                const items = Object.entries(section).map(([fieldKey, meta]: any) => {
                    const rawAns = formDetails[fieldKey];
                    const answer = (rawAns === undefined || rawAns === null || rawAns === '') ? '—' : String(rawAns);
                    return { q: meta.question, a: answer };
                });
                return { key: sectionKey, items };
            });

            const formatDate = (iso?: string) => {
                if (!iso) return '—';
                try { return new Date(iso).toLocaleDateString('en-GB'); } catch { return '—'; }
            };
            const lmcDate = formatDate(detail?.created_at);

            // Build HTML snapshot replicating LMCUserDetail UI (cards, headers, layout)
            const container = document.createElement('div');
            container.style.padding = '24px';
            container.style.fontFamily = 'Arial, sans-serif';
            container.style.width = '1000px';
            container.style.background = '#f3f4f6';
            container.style.position = 'absolute';
            container.style.left = '-10000px'; // keep offscreen to avoid layout shift

            const firstName = (detail?.lmc_user?.name || '').split(' ')[0] || '—';
            const lastName = (detail?.lmc_user?.name || '').split(' ').slice(1).join(' ') || '—';

            const sectionCard = (title: string, bodyHtml: string, withDate = false) => `
                            <div style='background:#fff;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:24px;'>
                                <div style='display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #e5e7eb;background:#f6f4ee;'>
                                    <div style='width:32px;height:32px;flex:0 0 auto;display:inline-block;'>
                                        <svg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' aria-hidden='true' focusable='false' style='display:block'>
                                            <circle cx='16' cy='16' r='16' fill='#C72030' />
                                            <text x='16' y='16' dy='.35em' fill='#ffffff' font-family='Arial, sans-serif' font-size='16' font-weight='700' text-anchor='middle'>${title.charAt(0).toUpperCase()}</text>
                                        </svg>
                                    </div>
                                    <h2 style='margin:0;font-size:16px;font-weight:700;color:#111;'>${withDate ? title + ': ' + lmcDate : title}</h2>
                                </div>
                                <div style='padding:24px;'>${bodyHtml}</div>
                            </div>`;

            const labelVal = (label: string, value: string) => `
                            <div style='display:flex;flex-direction:column;gap:4px;'>
                                <span style='color:#6b7280;font-size:12px;'>${label}</span>
                                <span style='color:#111;font-size:13px;font-weight:600;'>${value || '—'}</span>
                            </div>`;

            const grid2 = (items: string[]) => `
                            <div style='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 48px;'>${items.join('')}</div>`;

            // PERSONAL DETAILS card
            const personalHtml = grid2([
                labelVal('First Name', firstName),
                labelVal('Last Name', lastName),
                labelVal('Email ID', detail?.lmc_user?.email || '—'),
            ]);

            // LMC DETAILS card (Done By)
            const lmcDetailsHtml = grid2([
                labelVal('LMC Done By (Unique ID)', String(detail?.created_by?.id || '—')),
                labelVal('Name', detail?.created_by?.name || '—'),
                labelVal('Email', detail?.created_by?.email || '—'),
                labelVal('Mobile Number', detail?.created_by?.mobile || '—'),
                labelVal('Circle', '—'),
                labelVal('Function', '—'),
                labelVal('Role', '—'),
            ]);

            // LMC DONE ON card
            const lmcDoneOnHtml = grid2([
                labelVal('Name', detail?.lmc_user?.name || '—'),
                labelVal('Vendor Name', '—'),
                labelVal('Email', detail?.lmc_user?.email || '—'),
                labelVal('Mobile Number', detail?.lmc_user?.mobile || '—'),
                labelVal('Unique Number', String(detail?.id || '—')),
            ]);

            // CHECKPOINTS card
            const checkpointsGroupsHtml = groups.map(g => {
                const title = SECTION_TITLE_MAP[g.key] || g.key.replace(/KrccRequirementComingFrom\./, '').replace(/_/g, ' ').toUpperCase();
                const items = g.items.length > 0 ? g.items.map(it => `
                                <li style='margin-bottom:12px;'>
                                    <div style='font-weight:600;font-size:13px;'>- ${it.q}</div>
                                    <div style='color:#374151;font-size:12px;'>Ans: ${it.a}</div>
                                </li>`).join('') : `<div style='color:#6b7280;font-size:12px;'>No questions defined.</div>`;
                return `
                                <div style='border:1px solid #e5e7eb;border-radius:8px;margin-bottom:20px;'>
                                    <div style='padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f3f4f6;font-size:12px;font-weight:600;color:#C72030;'>${title}</div>
                                    <div style='padding:12px;'>${g.items.length ? `<ul style='list-style:none;padding:0;margin:0;'>${items}</ul>` : items}</div>
                                </div>`;
            }).join('');

            const checkpointsHtml = `
                            <div style='font-weight:600;margin:0 0 16px;font-size:14px;'>Checkpoints:</div>
                            ${checkpointsGroupsHtml || `<div style='color:#6b7280;font-size:12px;'>No checkpoints available.</div>`}
                        `;

            container.innerHTML = `
                            ${sectionCard('PERSONAL DETAILS', personalHtml)}
                            ${sectionCard('LMC DETAILS', lmcDetailsHtml)}
                            ${sectionCard('LMC DONE ON', lmcDoneOnHtml)}
                            ${sectionCard('LMC DATE', checkpointsHtml, true)}
                            <div style='text-align:right;font-size:10px;color:#666;margin-top:8px;'>Generated: ${new Date().toLocaleString()}</div>
                        `;
            document.body.appendChild(container);
            console.log('[LMC][PDF] Offscreen container appended, starting html2canvas');
            const canvas = await html2canvas(container, { scale: 2 });
            console.log('[LMC][PDF] Canvas rendered', canvas.width, canvas.height);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const marginX = 20;
            const marginY = 20;
            const usableWidth = pageWidth - marginX * 2;
            const ratio = usableWidth / canvas.width;
            const fullHeightPt = canvas.height * ratio; // total height if single page

            const saveWithFallback = (pdfInst: any, filename: string) => {
                try {
                    pdfInst.save(filename);
                } catch (err) {
                    console.warn('[LMC][PDF] pdf.save failed, using blob fallback', err);
                    try {
                        const blob = pdfInst.output('blob');
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = filename; document.body.appendChild(a); a.click();
                        setTimeout(() => { URL.revokeObjectURL(url); document.body.removeChild(a); }, 1500);
                    } catch (inner) {
                        console.error('[LMC][PDF] Blob fallback failed', inner);
                        setError('PDF download blocked by browser');
                    }
                }
            };

            if (fullHeightPt <= pageHeight - marginY * 2) {
                pdf.addImage(imgData, 'PNG', marginX, marginY, usableWidth, fullHeightPt, undefined, 'FAST');
            } else {
                // Multi-page: slice canvas vertically per page
                const pageUsableHeightPt = pageHeight - marginY * 2;
                const sliceHeightPx = Math.floor(pageUsableHeightPt / ratio); // height in original canvas pixels per page
                let renderedPx = 0;
                let pageIndex = 0;
                while (renderedPx < canvas.height) {
                    const sliceCanvas = document.createElement('canvas');
                    sliceCanvas.width = canvas.width;
                    sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - renderedPx);
                    const ctx = sliceCanvas.getContext('2d');
                    ctx?.drawImage(
                        canvas,
                        0,
                        renderedPx,
                        canvas.width,
                        sliceCanvas.height,
                        0,
                        0,
                        canvas.width,
                        sliceCanvas.height
                    );
                    const sliceData = sliceCanvas.toDataURL('image/png');
                    if (pageIndex > 0) pdf.addPage();
                    const sliceHeightPt = sliceCanvas.height * ratio;
                    pdf.addImage(sliceData, 'PNG', marginX, marginY, usableWidth, sliceHeightPt, undefined, 'FAST');
                    renderedPx += sliceCanvas.height;
                    pageIndex++;
                }
            }
            saveWithFallback(pdf, `lmc_${row.id}.pdf`);
            document.body.removeChild(container);
            console.log('[LMC][PDF] PDF saved for id', row.id);
        } catch (e: any) {
            setError(e.message || 'Failed to generate PDF');
            console.error('[LMC][PDF] Generation error', e);
        } finally {
            setGeneratingId(null);
        }
    };

    const renderCell = (row, columnKey) => {
        if (columnKey === 'actions') {
            return (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="View"
                        onClick={() => navigate(`/safety/m-safe/lmc/${row.id}`, { state: { row } })}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {/* <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 disabled:opacity-50"
                        title={generatingId === row.id ? 'Generating PDF...' : 'Download PDF'}
                        disabled={generatingId === row.id}
                        onClick={() => downloadPdf(row)}
                    >
                        {generatingId === row.id ? (
                            <span className="animate-pulse text-xs">...</span>
                        ) : (
                            <Download className="h-4 w-4" />
                        )}
                    </Button> */}
                </div>
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
