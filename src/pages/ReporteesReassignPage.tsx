import React, { useMemo, useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Users, Repeat, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

type ReassignResult = {
    message?: string;
    total_reassigned?: number;
    from?: string;
    to?: string;
    reassigned_reportees?: Array<{ id: number; name: string; email: string; mobile: string }>;
};

const ReporteesReassignPage = () => {
    const navigate = useNavigate();
    const [currentEmail, setCurrentEmail] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<ReassignResult[]>([]);
    const [reportees, setReportees] = useState<Array<{ id: number; name?: string; email?: string; mobile?: string }>>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [isFetching, setIsFetching] = useState(false);

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    } as const;

    // Prefill currentEmail from query param if provided
    React.useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const fromQ = (params.get('current_email') || '').trim();
            if (fromQ && !currentEmail) setCurrentEmail(fromQ.toLowerCase());
        } catch { }
    }, []); // run once

    const handleFetchReportees = async () => {
        if (isFetching) return;
        const current = currentEmail.trim().toLowerCase();
        if (!current) {
            toast.info('Enter current manager email to fetch reportees.');
            return;
        }
        const companyId = localStorage.getItem('selectedCompanyId');
        if (!companyId) {
            toast.error('Missing selected company');
            return;
        }
        setIsFetching(true);
        try {

            const basePath = '/pms/users/get_reportees_of_line_magager';
            const qs = new URLSearchParams({ line_manager_email: current, company_id: String(companyId) });

            const url = getFullUrl(`${basePath}?${qs.toString()}`);
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader(),
                },
            });
            if (!res.ok) {
                let msg = 'Failed to fetch reportees';
                try {
                    const data = await res.json();
                    if (typeof data === 'string') msg = data;
                    else if (data?.error) {
                        msg = data.error;
                        if (Array.isArray(data?.details) && data.details.length) {
                            msg += `: ${data.details.join(', ')}`;
                        }
                    } else if (data?.message) msg = data.message;
                    else if (Array.isArray(data?.errors)) msg = data.errors.join(', ');
                    else if (typeof data?.errors === 'string') msg = data.errors;
                } catch {
                    try { msg = (await res.text()) || msg; } catch { }
                }
                msg = msg.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                toast.error(msg);
                // Ensure table is cleared on error
                setReportees([]);
                setSelectedIds(new Set());
                return;
            }
            const data = await res.json();
            // If API returns 200 but includes an error payload, handle it gracefully
            if (data && (data.error || data.errors || data.details)) {
                let msg = data.error || data.message || 'Failed to fetch reportees';
                if (!data.error && Array.isArray(data.errors)) msg = data.errors.join(', ');
                if (Array.isArray(data.details) && data.details.length) {
                    msg += `: ${data.details.join(', ')}`;
                }
                msg = String(msg).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                toast.error(msg);
                setReportees([]);
                setSelectedIds(new Set());
                return;
            }
            const listRaw: Array<any>
                = data?.reportees || data?.users || data || [];
            if (!Array.isArray(listRaw)) {
                toast.info('No reportees found');
                setReportees([]);
                setSelectedIds(new Set());
                return;
            }
            const list = listRaw.map((u: any) => {
                const fname = (u.firstname ?? '').toString();
                const lname = (u.lastname ?? '').toString();
                const combined = `${fname} ${lname}`.trim();
                return {
                    id: Number(u.id),
                    name: u.name || combined || u.email || `#${u.id}`,
                    email: u.email ?? '',
                    mobile: u.mobile ?? '',
                } as { id: number; name?: string; email?: string; mobile?: string };
            });
            setReportees(list);
            setSelectedIds(new Set());
            toast.success(`Loaded ${list.length} reportee${list.length === 1 ? '' : 's'}`);
        } catch (e: any) {
            toast.error(e?.message || 'Failed to fetch reportees');
        } finally {
            setIsFetching(false);
        }
    };

    const handleToggleOne = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const allSelected = useMemo(() => reportees.length > 0 && selectedIds.size === reportees.length, [reportees, selectedIds]);
    const handleToggleAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(reportees.map(r => r.id)));
        }
    };

    const handleReassign = async () => {
        if (isSubmitting) return;
        const current = currentEmail.trim().toLowerCase();
        const updated = updatedEmail.trim().toLowerCase();
        if (!current) {
            toast.info('Enter current manager email first.');
            return;
        }
        if (selectedIds.size === 0) {
            toast.info('Select at least one reportee.');
            return;
        }
        if (!updated) {
            toast.info('Enter updated report-to email.');
            return;
        }
        if (current === updated) {
            toast.info('Current and updated emails cannot be the same.');
            return;
        }
        setIsSubmitting(true);
        try {
            // Using new endpoint without /pms and without .json as per latest requirement
            const url = getFullUrl('/pms/users/vi_reassign_reportees');
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader(),
                },
                body: JSON.stringify({
                    // Only send new_manager_email and reportee_ids (numeric) per new API contract
                    new_manager_email: updated,
                    reportee_ids: Array.from(selectedIds),
                }),
            });

            if (!res.ok) {
                let message = 'Failed to reassign reportees';
                try {
                    const data = await res.json();
                    if (typeof data === 'string') message = data;
                    else if (data?.error) {
                        message = data.error;
                        if (Array.isArray(data?.details) && data.details.length) {
                            message += `: ${data.details.join(', ')}`;
                        }
                    } else if (data?.message) message = data.message;
                    else if (Array.isArray(data?.errors)) message = data.errors.join(', ');
                    else if (typeof data?.errors === 'string') message = data.errors;
                } catch {
                    try { message = (await res.text()) || message; } catch { }
                }
                message = message.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                toast.error(message);
                return;
            }

            const data = (await res.json()) as ReassignResult | any;
            // If API returns 200 but includes an error payload (e.g., invalid new_manager email), show it and keep table
            if (data && (data.error || data.errors || data.details)) {
                let message = data.error || data.message || 'Failed to reassign reportees';
                if (!data.error && Array.isArray(data.errors)) message = data.errors.join(', ');
                if (Array.isArray(data.details) && data.details.length) {
                    message += `: ${data.details.join(', ')}`;
                }
                message = String(message).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                toast.error(message);
                return;
            }

            const resultData = data as ReassignResult;
            toast.success(resultData?.message || 'Reportees reassigned successfully');
            setResults(prev => [...prev, resultData || {}]);
            setUpdatedEmail('');
            // Refresh the reportees list so the table reflects the latest state
            await handleFetchReportees();
        } catch (e: any) {
            toast.error(e?.message || 'Failed to reassign reportees');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Top bar similar to ServiceDetailsPage */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                    <div className="mb-2">
                        <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">EXTERNAL REPORTEE REASSIGN</h1>
                        <p className="text-sm text-gray-500">Enter the current and updated reporting emails, then submit.</p>
                    </div>
                </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                <div className="flex items-center p-4 border-b border-gray-200">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                        <Repeat className="w-6 h-6 text-[#C72030]" />
                    </div>
                    <h2 className="text-lg font-bold tracking-wide">DETAILS</h2>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <span className="text-gray-500 text-sm">Current Report To</span>
                        <TextField
                            type="email"
                            placeholder="Enter current report-to email"
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            autoComplete="off"
                            slotProps={{ inputLabel: { shrink: true } as any }}
                            InputProps={{ sx: fieldStyles }}
                            inputProps={{ autoComplete: 'off', autoCorrect: 'off', autoCapitalize: 'none', spellCheck: 'false' }}
                            disabled={isSubmitting}
                        />
                    </div>
                    <div className="space-y-2">
                        <span className="text-gray-500 text-sm">Updated Report To</span>
                        <TextField
                            type="email"
                            placeholder="Enter updated report-to email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            autoComplete="off"
                            slotProps={{ inputLabel: { shrink: true } as any }}
                            InputProps={{ sx: fieldStyles }}
                            inputProps={{ autoComplete: 'off', autoCorrect: 'off', autoCapitalize: 'none', spellCheck: 'false' }}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
                <div className="px-4 pb-4 flex gap-3 flex-wrap justify-start">
                    <Button
                        onClick={handleFetchReportees}
                        variant="outline"
                        className="flex items-center"
                        disabled={isFetching || !currentEmail.trim()}
                    >
                        {isFetching ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching...</>) : 'Fetch Reportees'}
                    </Button>
                    <Button
                        onClick={handleReassign}
                        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 flex items-center"
                        disabled={isSubmitting || selectedIds.size === 0 || !updatedEmail.trim()}
                    >
                        {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>) : 'Reassign Selected'}
                    </Button>
                </div>
            </div>

            {reportees.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
                    <div className="flex items-center p-4 border-b border-gray-200">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                            <Users className="w-6 h-6 text-[#C72030]" />
                        </div>
                        <h2 className="text-lg font-bold tracking-wide flex-1">REPORTEES ({reportees.length})</h2>
                        <label className="text-sm flex items-center gap-2 text-gray-600">
                            <input type="checkbox" checked={allSelected} onChange={handleToggleAll} />
                            Select All
                        </label>
                    </div>
                    <div className="p-4 pt-2">
                        <div className="overflow-x-auto rounded-md border border-gray-200">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2"></th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-700">Name</th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-700">Email</th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-700">Mobile</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportees.map((u) => (
                                        <tr key={u.id} className="border-t border-gray-100">
                                            <td className="px-3 py-2 text-center">
                                                <input type="checkbox" checked={selectedIds.has(u.id)} onChange={() => handleToggleOne(u.id)} />
                                            </td>
                                            <td className="px-3 py-2 text-gray-900">{u.name || '—'}</td>
                                            <td className="px-3 py-2 text-gray-700">{u.email || '—'}</td>
                                            <td className="px-3 py-2 text-gray-700">{u.mobile || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 text-xs text-gray-600">Selected: {selectedIds.size}</div>
                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="mt-6 space-y-6">
                    {results.map((res, idx) => (
                        <div key={`${res.from || ''}-${res.to || ''}-${idx}`} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center p-4 border-b border-gray-200">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                                    <ClipboardList className="w-6 h-6 text-[#C72030]" />
                                </div>
                                <h2 className="text-lg font-bold tracking-wide flex-1">REASSIGN SUMMARY {results.length > 1 ? `#${idx + 1}` : ''}</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex flex-col gap-2">
                                    {res.message && (
                                        <div className="text-sm font-medium text-green-700">{res.message}</div>
                                    )}
                                    <div className="text-sm text-gray-700">
                                        Total reassigned: <span className="font-semibold">{res.total_reassigned ?? res.reassigned_reportees?.length ?? 0}</span>
                                    </div>
                                    {(res.from || res.to) && (
                                        <div className="text-xs text-gray-500">
                                            {res.from && (<span>From <span className="font-medium text-gray-700">{res.from}</span></span>)}
                                            {res.from && res.to && <span className="mx-2">→</span>}
                                            {res.to && (<span>To <span className="font-medium text-gray-700">{res.to}</span></span>)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900 mb-2">Reassigned reportees</div>
                                    {Array.isArray(res.reassigned_reportees) && res.reassigned_reportees.length > 0 ? (
                                        <div className="overflow-x-auto rounded-md border border-gray-200">
                                            <table className="min-w-full text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="text-left px-3 py-2 font-medium text-gray-700">Name</th>
                                                        <th className="text-left px-3 py-2 font-medium text-gray-700">Email</th>
                                                        <th className="text-left px-3 py-2 font-medium text-gray-700">Mobile</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {res.reassigned_reportees.map((u) => (
                                                        <tr key={u.id} className="border-t border-gray-100">
                                                            <td className="px-3 py-2 text-gray-900">{u.name || '—'}</td>
                                                            <td className="px-3 py-2 text-gray-700">{u.email || '—'}</td>
                                                            <td className="px-3 py-2 text-gray-700">{u.mobile || '—'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">No reportees were reassigned.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReporteesReassignPage;
