import React, { useMemo, useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Users, Repeat, ClipboardList, ArrowLeft } from 'lucide-react';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { useMSafeEvents } from '@/components/PostHogMSafeEvents';

type ReassignResult = {
    message?: string;
    total_reassigned?: number;
    from?: string;
    to?: string;
    reassigned_reportees?: Array<{ id: number; name: string; email: string; mobile: string }>;
};

type UserOption = {
    id: number | string;
    email: string;
    name?: string;
};

const fieldStyles = {
    height: { xs: 36, sm: 40, md: 45 },
    minHeight: '44px',
    backgroundColor: '#fff',
    '& .MuiInputBase-input, & .MuiSelect-select': {
        padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
        minHeight: '44px',
        boxSizing: 'border-box',
        fontSize: '13.5px',
        fontWeight: 500,
        color: '#2C2C2C',
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#fff',
        borderRadius: '12px',
        minHeight: '44px',
        '& fieldset': { borderColor: '#E5E5E0', borderWidth: '1px' },
        '&:hover fieldset': { borderColor: '#DA7756' },
        '&.Mui-focused fieldset': { borderColor: '#DA7756', borderWidth: '1px' },
    },
    '& .MuiInputLabel-root': {
        color: '#5C5C5C',
        fontSize: '12px',
        fontWeight: 600,
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#DA7756',
    },
} as const;

const useEmailUserSearch = (query: string) => {
    const [options, setOptions] = useState<UserOption[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query.trim();
        if (q.length < 3) {
            setOptions([]);
            setLoading(false);
            return;
        }

        let active = true;
        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                const baseUrl = localStorage.getItem('baseUrl');
                const token = localStorage.getItem('token');
                const companyId = localStorage.getItem('selectedCompanyId');
                if (!baseUrl || !token || !companyId) return;

                const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
                const url = `${cleanBaseUrl}/pms/users/company_wise_users.json?company_id=${companyId}&q[email_cont]=${encodeURIComponent(q)}`;
                const resp = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!resp.ok) return;
                const data = await resp.json();
                if (!active) return;
                const users = (data?.users || []).map((u: any) => ({
                    id: u.id,
                    email: u.email || '',
                    name: u.name || `${u.firstname || ''} ${u.lastname || ''}`.trim(),
                })).filter((u: UserOption) => u.email);
                setOptions(users);
            } catch (e) {
                console.error('User email search error', e);
                if (active) setOptions([]);
            } finally {
                if (active) setLoading(false);
            }
        }, 300);

        return () => {
            active = false;
            clearTimeout(timer);
        };
    }, [query]);

    return { options, loading };
};

const ReporteesReassignPage = () => {
    const msafeEvents = useMSafeEvents();
    const [currentEmail, setCurrentEmail] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [currentInput, setCurrentInput] = useState('');
    const [updatedInput, setUpdatedInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<ReassignResult[]>([]);
    const [reportees, setReportees] = useState<Array<{ id: number; name?: string; email?: string; mobile?: string }>>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [isFetching, setIsFetching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const { options: currentOptions, loading: currentLoading } = useEmailUserSearch(currentInput);
    const { options: updatedOptions, loading: updatedLoading } = useEmailUserSearch(updatedInput);

    // Prefill currentEmail from query param if provided
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const fromQ = (params.get('current_email') || '').trim();
            if (fromQ && !currentEmail) {
                setCurrentEmail(fromQ.toLowerCase());
                setCurrentInput(fromQ.toLowerCase());
            }
        } catch { }
    }, []); // run once

    useEffect(() => {
        msafeEvents.onReporteesReassignOpened();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            // const qs = new URLSearchParams({ line_manager_email: current, company_id: String(companyId) });
            const qs = new URLSearchParams({
                line_manager_email: current,
                company_id: String(companyId),
                page: String(currentPage),   // 👈 important
            });


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
                // setSelectedIds(new Set());
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
                // setSelectedIds(new Set());
                return;
            }
            const listRaw: Array<any>
                = data?.reportees || data?.users || data || [];
            if (!Array.isArray(listRaw)) {
                toast.info('No reportees found');
                setReportees([]);
                // setSelectedIds(new Set());
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
            // setSelectedIds(new Set());
            // toast.success(`Loaded ${list.length} reportee${list.length === 1 ? '' : 's'}`);

            const listRaw2 = data?.reportees || data?.users || data?.data || [];

            setTotalPages(data?.pagination?.total_pages || 1);
            setTotalCount(data?.pagination?.total_count || listRaw2.length);
            msafeEvents.onReporteesFetched(data?.pagination?.total_count || list.length);

        } catch (e: any) {
            toast.error(e?.message || 'Failed to fetch reportees');
        } finally {
            setIsFetching(false);
        }
    };


    React.useEffect(() => {
        if (currentEmail.trim()) {
            handleFetchReportees();
        }
    }, [currentPage]);
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
    console.log("Reassign payload:", {
        //   new_manager_email: updated,
        reportee_ids: Array.from(selectedIds),
    });
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
            msafeEvents.onReporteesReassigned(selectedIds.size, true);
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
            msafeEvents.onReporteesReassigned(resultData?.total_reassigned ?? selectedIds.size, false);
            setResults(prev => [...prev, resultData || {}]);
            setUpdatedEmail('');
            setUpdatedInput('');
            // Refresh the reportees list so the table reflects the latest state
            await handleFetchReportees();
        } catch (e: any) {
            toast.error(e?.message || 'Failed to reassign reportees');
        } finally {
            setIsSubmitting(false);
        }
    };


    const getVisiblePages = (current: number, total: number) => {
        const delta = 1; // how many pages before & after current
        const range: (number | string)[] = [];

        const left = Math.max(2, current - delta);
        const right = Math.min(total - 1, current + delta);

        range.push(1);

        if (left > 2) range.push("...");

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        if (right < total - 1) range.push("...");

        if (total > 1) range.push(total);

        return range;
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Top bar similar to ServiceDetailsPage */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E0] bg-white text-[#2C2C2C] shadow-none transition hover:bg-[#F6F4EE]"
                        aria-label="Go back"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <div className="mb-2">
                            <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">EXTERNAL REPORTEE REASSIGN</h1>
                            <p className="text-sm text-gray-500">Enter the current and updated reporting emails, then submit.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="bg-white rounded-[16px] border border-[#E5E5E0] mb-6 shadow-none">
                <div className="flex items-center p-4 border-b border-[#E5E5E0]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F6F4EE] border border-[#E5E5E0] mr-3">
                        <Repeat className="w-5 h-5 text-[#DA7756]" />
                    </div>
                    <h2 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#DA7756]">Details</h2>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-semibold text-[#5C5C5C]">Current Report To</label>
                        <Autocomplete
                            freeSolo
                            options={currentOptions}
                            loading={currentLoading}
                            disabled={isSubmitting}
                            inputValue={currentInput}
                            onInputChange={(_, value) => {
                                setCurrentInput(value);
                                setCurrentEmail(value);
                            }}
                            value={currentEmail || null}
                            onChange={(_, value) => {
                                const email =
                                    typeof value === 'string'
                                        ? value
                                        : value?.email || '';
                                setCurrentEmail(email);
                                setCurrentInput(email);
                            }}
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : option.email || ''
                            }
                            isOptionEqualToValue={(option, value) => {
                                const optEmail = typeof option === 'string' ? option : option.email;
                                const valEmail = typeof value === 'string' ? value : value?.email;
                                return String(optEmail || '').toLowerCase() === String(valEmail || '').toLowerCase();
                            }}
                            filterOptions={(x) => x}
                            renderOption={(props, option) => (
                                <li {...props} key={String(option.id)}>
                                    <div className="flex flex-col py-0.5">
                                        <span className="text-sm text-gray-900">{option.email}</span>
                                        {option.name ? (
                                            <span className="text-xs text-gray-500">{option.name}</span>
                                        ) : null}
                                    </div>
                                </li>
                            )}
                            slotProps={{
                                paper: {
                                    sx: {
                                        border: '1px solid #E5E5E0',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiAutocomplete-popupIndicator': { color: '#888' },
                                '& .MuiOutlinedInput-root': {
                                    paddingTop: '0 !important',
                                    paddingBottom: '0 !important',
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label=""
                                    placeholder="Search email (min 3 chars)"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                    sx={fieldStyles}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {currentLoading ? (
                                                    <CircularProgress color="inherit" size={16} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[12px] font-semibold text-[#5C5C5C]">Updated Report To</label>
                        <Autocomplete
                            freeSolo
                            options={updatedOptions}
                            loading={updatedLoading}
                            disabled={isSubmitting}
                            inputValue={updatedInput}
                            onInputChange={(_, value) => {
                                setUpdatedInput(value);
                                setUpdatedEmail(value);
                            }}
                            value={updatedEmail || null}
                            onChange={(_, value) => {
                                const email =
                                    typeof value === 'string'
                                        ? value
                                        : value?.email || '';
                                setUpdatedEmail(email);
                                setUpdatedInput(email);
                            }}
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : option.email || ''
                            }
                            isOptionEqualToValue={(option, value) => {
                                const optEmail = typeof option === 'string' ? option : option.email;
                                const valEmail = typeof value === 'string' ? value : value?.email;
                                return String(optEmail || '').toLowerCase() === String(valEmail || '').toLowerCase();
                            }}
                            filterOptions={(x) => x}
                            renderOption={(props, option) => (
                                <li {...props} key={String(option.id)}>
                                    <div className="flex flex-col py-0.5">
                                        <span className="text-sm text-gray-900">{option.email}</span>
                                        {option.name ? (
                                            <span className="text-xs text-gray-500">{option.name}</span>
                                        ) : null}
                                    </div>
                                </li>
                            )}
                            slotProps={{
                                paper: {
                                    sx: {
                                        border: '1px solid #E5E5E0',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
                                    },
                                },
                            }}
                            sx={{
                                '& .MuiAutocomplete-popupIndicator': { color: '#888' },
                                '& .MuiOutlinedInput-root': {
                                    paddingTop: '0 !important',
                                    paddingBottom: '0 !important',
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label=""
                                    placeholder="Search email (min 3 chars)"
                                    variant="outlined"
                                    InputLabelProps={{ shrink: false }}
                                    sx={fieldStyles}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {updatedLoading ? (
                                                    <CircularProgress color="inherit" size={16} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
                {/* <div className="px-4 pb-4 flex gap-3 flex-wrap justify-start">
                    <Button
                        onClick={handleFetchReportees}
                        variant="outline"
                        className="flex items-center rounded-[8px] h-[42px] px-[22px] text-[13px] font-semibold gap-2 border border-[#DA7756] text-[#DA7756] hover:bg-[#F6F4EE]"
                        disabled={isFetching || !currentEmail.trim()}
                    >
                        {isFetching ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Fetching...</>) : 'Fetch Reportees'}
                    </Button>
                    <Button
                        onClick={handleReassign}
                        className="flex items-center rounded-[8px] h-[42px] px-[22px] text-[13px] font-semibold gap-2 bg-[#DA7756] hover:bg-[#c86b4d] text-white"
                        disabled={isSubmitting || selectedIds.size === 0 || !updatedEmail.trim()}
                    >
                        {isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>) : 'Reassign Selected'}
                    </Button>
                </div> */}
                <div className="px-6 pb-6 flex gap-3 flex-wrap justify-end">
                    <Button
                        onClick={handleFetchReportees}
                        variant="outline"
                        disabled={isFetching || !currentEmail.trim()}
                        className="h-[42px] px-[22px] gap-2 rounded-[8px] text-[13px] font-semibold border-[1.5px] border-[#DA7756] text-[#DA7756] bg-white hover:bg-[#F6F4EE] hover:text-[#DA7756]"
                    >
                        {isFetching ? (<><Loader2 className="w-4 h-4 animate-spin" /> Fetching...</>) : 'Fetch Reportees'}
                    </Button>

                    {/* <Button
                        onClick={handleReassign}
                        disabled={isSubmitting || selectedIds.size === 0 || !updatedEmail.trim()}
                        style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
                        className="h-[42px] px-[22px] gap-2 rounded-[8px] text-[13px] font-semibold hover:!bg-[#1F1F1F]"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" style={{ color: '#FFFFFF' }} /> <span style={{ color: '#FFFFFF' }}>Submitting...</span></>
                        ) : (
                            <span style={{ color: '#FFFFFF' }}>Reassign Selected</span>
                        )}
                    </Button> */}
                    <button
                        type="button"
                        onClick={() => {
                            if (isSubmitting) return;
                            if (selectedIds.size === 0) {
                                toast.info('Select at least one reportee.');
                                return;
                            }
                            if (!updatedEmail.trim()) {
                                toast.info('Enter updated report-to email.');
                                return;
                            }
                            handleReassign();
                        }}
                        style={{
                            backgroundColor: '#000000',
                            color: '#FFFFFF',
                            opacity: 1,
                            height: '42px',
                            padding: '0 22px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#FFFFFF' }} />
                                Submitting...
                            </>
                        ) : (
                            'Reassign Selected'
                        )}
                    </button>
                </div>
            </div>

            {reportees.length > 0 && (
                <div className="bg-white rounded-[16px] border border-[#E5E5E0] mt-6 shadow-none">
                    <div className="flex items-center p-4 border-b border-[#E5E5E0]">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F6F4EE] border border-[#E5E5E0] mr-3">
                            <Users className="w-5 h-5 text-[#DA7756]" />
                        </div>
                        <h2 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#DA7756] flex-1">Reportees ({reportees.length})</h2>
                        <label className="text-sm flex items-center gap-2 text-gray-600">
                            <input className="accent-[#DA7756]" type="checkbox" checked={allSelected} onChange={handleToggleAll} />
                            Select All
                        </label>
                    </div>
                    <div className="p-4 pt-2">
                        <div className="overflow-x-auto rounded-[12px] border border-[#E5E5E0]">
                            <table className="min-w-full text-sm">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-3 py-2 border-b border-[#E5E5E0]"></th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-[#E5E5E0]">Name</th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-[#E5E5E0]">Email</th>
                                        <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-[#E5E5E0]">Mobile</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportees.map((u) => (
                                        <tr key={u.id} className="border-t border-[#E5E5E0]">
                                            <td className="px-3 py-2 text-center">
                                                <input className="accent-[#DA7756]" type="checkbox" checked={selectedIds.has(u.id)} onChange={() => handleToggleOne(u.id)} />
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
                        {/* <div className="mt-3 text-xs text-gray-600">Selected: {totalCount}</div> */}
                        {/* Pagination */}

                        <div className="flex flex-col items-center gap-2 mt-6">
                            <div className="flex items-center gap-1">
                                <button
                                    disabled={currentPage === 1 || isFetching}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="px-2 py-1 text-gray-600 disabled:opacity-40"
                                >
                                    {"<"}
                                </button>

                                {getVisiblePages(currentPage, totalPages).map((page, index) =>
                                    page === "..." ? (
                                        <span key={index} className="px-2">...</span>
                                    ) : (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(Number(page))}
                                            className={`px-3 py-1 rounded text-sm ${currentPage === page
                                                ? "bg-[#DA7756] text-white border border-[#DA7756]"
                                                : "border border-[#E5E5E0] hover:bg-[#F6F4EE]"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}

                                <button
                                    disabled={currentPage === totalPages || isFetching}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className="px-2 py-1 text-gray-600 disabled:opacity-40"
                                >
                                    {">"}
                                </button>
                            </div>

                            <div className="text-sm text-gray-500">
                                Showing page {currentPage} of {totalPages}
                            </div>
                        </div>



                    </div>
                </div>
            )}

            {results.length > 0 && (
                <div className="mt-6 space-y-6">
                    {results.map((res, idx) => (
                        <div key={`${res.from || ''}-${res.to || ''}-${idx}`} className="bg-white rounded-[16px] border border-[#E5E5E0] shadow-none">
                            <div className="flex items-center p-4 border-b border-[#E5E5E0]">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F6F4EE] border border-[#E5E5E0] mr-3">
                                    <ClipboardList className="w-5 h-5 text-[#DA7756]" />
                                </div>
                                <h2 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#DA7756] flex-1">Reassign Summary {results.length > 1 ? `#${idx + 1}` : ''}</h2>
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
                                        <div className="overflow-x-auto rounded-[12px] border border-[#E5E5E0]">
                                            <table className="min-w-full text-sm">
                                                <thead className="bg-white">
                                                    <tr>
                                                        <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-[#E5E5E0]">Name</th>
                                                        <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-[#E5E5E0]">Email</th>
                                                        <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-[#E5E5E0]">Mobile</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {res.reassigned_reportees.map((u) => (
                                                        <tr key={u.id} className="border-t border-[#E5E5E0]">
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
