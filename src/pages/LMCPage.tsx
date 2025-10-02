import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
    Switch as MuiSwitch,
    FormControlLabel,
    TextField,
    CircularProgress,
    Box,
    Typography,
    Card as MUICard,
    CardContent as MUICardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { toast } from 'sonner';

interface CircleOption { id: string; name: string; }
interface UserOption { id: string; name: string; circle_id?: string | number | null; email?: string | null; mobile?: string | null; }

async function authedGet(url: string, token: string) {
    if (!token) throw new Error('Missing token');
    const res = await fetch(url, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
}

async function authedPost(url: string, body: any, token: string) {
    if (!token) throw new Error('Missing token');
    const res = await fetch(url, { method: 'POST', cache: 'no-store', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
}

const LMCPage: React.FC = () => {
    // Minimum characters before server search triggers
    const SEARCH_THRESHOLD = 3;
    const { userId } = useParams();
    const navigate = useNavigate();
    const [restrictByCircle, setRestrictByCircle] = useState(true);
    const [circles, setCircles] = useState<CircleOption[]>([]);
    const [circlesLoading, setCirclesLoading] = useState(false);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersAppendLoading, setUsersAppendLoading] = useState(false);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    // User search restored for server-side querying
    const [selectedCircle, setSelectedCircle] = useState('');
    const [userSearch, setUserSearch] = useState(''); // updated via global enhancer event
    const [selectedUser, setSelectedUser] = useState('');
    // Removed Autocomplete open states after switching to Select/TextField
    // searchInputRef removed
    const selectedUserOptionRef = useRef<UserOption | null>(null);
    const mappedCircleIdRef = useRef<string | null>(null);
    const [urlUserId, setUrlUserId] = useState('');
    const [hasExistingMapping, setHasExistingMapping] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [mappingLoading, setMappingLoading] = useState(false);
    const [resolvingUserLoading, setResolvingUserLoading] = useState(false);
    const [resolvingCircleLoading, setResolvingCircleLoading] = useState(false);
    // Removed radix select open state variables after MUI migration

    const authToken = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    const rawBase = typeof window !== 'undefined' ? localStorage.getItem('baseUrl') || '' : '';
    const baseUrl = rawBase && !/^https?:\/\//i.test(rawBase) ? `https://${rawBase}` : rawBase;
    const STATIC_COMPANY_ID = '145';

    const loadCircles = async () => {
        const companyId = STATIC_COMPANY_ID;
        try {
            setCirclesLoading(true);
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const data = await authedGet(`https://${host}/pms/users/get_circles.json?company_id=${encodeURIComponent(companyId)}`, authToken);
            let list: CircleOption[] = [];
            if (Array.isArray(data)) list = data.map((c: any) => ({ id: String(c.id || c.circle_id || c.name), name: c.circle_name || c.name || c.circle || `Circle ${c.id}` }));
            else if (Array.isArray(data?.circles)) list = data.circles.map((c: any) => ({ id: String(c.id || c.circle_id || c.name), name: c.circle_name || c.name || c.circle || `Circle ${c.id}` }));
            setCircles(list);
        } catch (e: any) {
            console.error('Failed to load circles', e);
            toast.error(e.message || 'Failed to load circles');
            setCircles([]);
        } finally { setCirclesLoading(false); }
    };

    const loadExistingMapping = async (userIdParam: string) => {
        try {
            setMappingLoading(true);
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const url = `https://${host}/pms/users/get_lmc_manager.json?user_id=${encodeURIComponent(userIdParam)}`;
            const resp = await authedGet(url, authToken);
            const data = resp?.data;
            if (resp?.success && data && (data.lmc_manager_id !== undefined && data.lmc_manager_id !== null)) {
                const lmId = String(data.lmc_manager_id);
                setSelectedUser(lmId);
                setHasExistingMapping(true);
                setUsers(prev => (prev.some(u => u.id === lmId) ? prev : [{ id: lmId, name: `User #${lmId}` }, ...prev]));
                resolveUserNameById(lmId).catch(() => { });
                if (data.circle_id !== undefined && data.circle_id !== null) {
                    mappedCircleIdRef.current = String(data.circle_id);
                    resolveCircleNameById(String(data.circle_id)).catch(() => { });
                }
            } else {
                setHasExistingMapping(false);
            }
        } catch { setHasExistingMapping(false); } finally { setMappingLoading(false); }
    };

    const resolveUserNameById = async (id: string) => {
        setResolvingUserLoading(true);
        const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
        const baseUsers = `https://${host}/pms/users/company_wise_users.json`;
        const companyId = localStorage.getItem('selectedCompanyId') || '';
        const circleFilter = restrictByCircle && selectedCircle ? `q[lock_user_permissions_circle_id_eq]=${encodeURIComponent(selectedCircle)}` : '';
        const companyParam = companyId ? `company_id=${encodeURIComponent(companyId)}` : '';
        const glue = (...parts: string[]) => parts.filter(Boolean).join('&');
        const candidates = [
            `${baseUsers}?${glue(`ids[]=${encodeURIComponent(id)}`, circleFilter, companyParam)}`,
            `${baseUsers}?${glue(`id=${encodeURIComponent(id)}`, circleFilter, companyParam)}`,
            `${baseUsers}?${glue(`q[id_eq]=${encodeURIComponent(id)}`, circleFilter, companyParam)}`,
            `${baseUsers}?${glue(`q[id_in][]=${encodeURIComponent(id)}`, circleFilter, companyParam)}`,
        ];
        let match: any = null;
        for (const url of candidates) {
            try {
                const data = await authedGet(url, authToken);
                const raw = Array.isArray(data?.users) ? data.users : (Array.isArray(data) ? data : []);
                match = raw.find((u: any) => String(u.id) === String(id));
                if (match) break;
            } catch { }
        }
        if (!match) { setResolvingUserLoading(false); return; }
        const first = match.first_name || match.firstname || match.firstName || '';
        const last = match.last_name || match.lastname || match.lastName || '';
        const fullFromParts = `${String(first).trim()} ${String(last).trim()}`.trim();
        const fallbackFull = match.full_name || match.fullName || match.name || `User ${match.id}`;
        const display = fullFromParts || fallbackFull;
        const circleId = match.circle_id || match.circle || match.circleId;
        const resolved = { id: String(match.id), name: String(display), circle_id: circleId, email: match.email || null, mobile: match.mobile || null } as UserOption;
        setUsers(prev => {
            const idx = prev.findIndex(u => u.id === resolved.id);
            if (idx === -1) return [resolved, ...prev];
            const copy = prev.slice(); copy[idx] = resolved; return copy;
        });
        if (String(id) === String(selectedUser)) selectedUserOptionRef.current = resolved;
        if (circleId) await resolveCircleNameById(String(circleId));
        setResolvingUserLoading(false);
    };

    const resolveCircleNameById = async (circleId: string) => {
        try {
            setResolvingCircleLoading(true);
            mappedCircleIdRef.current = String(circleId);
            const companyId = STATIC_COMPANY_ID;
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const url = `https://${host}/pms/users/get_circles.json?company_id=${encodeURIComponent(companyId)}`;
            const data = await authedGet(url, authToken);
            const list = Array.isArray(data?.circles) ? data.circles : (Array.isArray(data) ? data : []);
            const found = list.find((c: any) => String(c.id || c.circle_id || c.name) === String(circleId));
            if (found) {
                const opt = { id: String(found.id || found.circle_id || found.name), name: found.circle_name || found.name || found.circle || `Circle ${found.id}` } as CircleOption;
                setCircles(prev => (prev.some(c => c.id === opt.id) ? prev : [opt, ...prev]));
            } else {
                setCircles(prev => (prev.some(c => c.id === String(circleId)) ? prev : [{ id: String(circleId), name: `Circle ${circleId}` }, ...prev]));
            }
            setSelectedCircle(String(circleId));
        } catch {
            setSelectedCircle(String(circleId));
            setCircles(prev => (prev.some(c => c.id === String(circleId)) ? prev : [{ id: String(circleId), name: `Circle ${circleId}` }, ...prev]));
        } finally { setResolvingCircleLoading(false); }
    };

    const loadUsers = async (circleId?: string, page: number = 1, append = false, search?: string) => {
        try {
            if (append) setUsersAppendLoading(true); else setUsersLoading(true);
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const baseUsers = `https://${host}/pms/users/company_wise_users.json?q[employee_type_cont]=internal`;
            const params: string[] = [];
            if (restrictByCircle && circleId) params.push(`q[lock_user_permissions_circle_id_eq]=${encodeURIComponent(circleId)}`);
            if (page > 1) params.push(`page=${page}`);
            if (search && search.trim()) params.push(`q[email_or_mobile_cont]=${encodeURIComponent(search.trim())}`);
            const url = params.length ? `${baseUsers}&${params.join('&')}` : baseUsers;
            const data = await authedGet(url, authToken);
            const raw = Array.isArray(data?.users) ? data.users : (Array.isArray(data) ? data : []);
            let mapped: UserOption[] = raw.map((u: any) => {
                const first = u.first_name || u.firstname || u.firstName || '';
                const last = u.last_name || u.lastname || u.lastName || '';
                const fullFromParts = `${String(first).trim()} ${String(last).trim()}`.trim();
                const fallbackFull = u.full_name || u.fullName || u.name || `User ${u.id}`;
                const display = fullFromParts || fallbackFull;
                return { id: String(u.id), name: String(display), circle_id: u.circle_id || u.circle || u.circleId, email: u.email || null, mobile: u.mobile || null };
            });
            if (restrictByCircle && circleId) mapped = mapped.filter(u => !u.circle_id || String(u.circle_id) === String(circleId));
            setUsers(prev => {
                if (!append) {
                    const includeSelected = !!selectedUser && !mapped.some(u => u.id === selectedUser);
                    const selectedOpt = includeSelected
                        ? (selectedUserOptionRef.current && selectedUserOptionRef.current.id === selectedUser
                            ? selectedUserOptionRef.current
                            : (prev.find(u => u.id === selectedUser) || { id: selectedUser, name: `User #${selectedUser}` }))
                        : null;
                    return includeSelected && selectedOpt ? [selectedOpt as UserOption, ...mapped] : mapped;
                }
                const existing = new Map(prev.map(u => [u.id, u] as const));
                for (const u of mapped) existing.set(u.id, u);
                return Array.from(existing.values());
            });
            const p = (data && data.pagination) ? data.pagination : undefined;
            setUsersPage(p?.current_page || page || 1);
            setUsersTotalPages(p?.total_pages || 1);
        } catch (e: any) {
            console.error('Failed to load users', e);
            toast.error(e.message || 'Failed to load users');
            setUsers([]);
        } finally { if (append) setUsersAppendLoading(false); else setUsersLoading(false); }
    };

    useEffect(() => { if (!selectedUser) return; const opt = users.find(u => u.id === selectedUser); if (opt) selectedUserOptionRef.current = opt; }, [selectedUser, users]);
    useEffect(() => { if (!selectedUser) return; const cur = selectedUserOptionRef.current || users.find(u => u.id === selectedUser); const name = cur?.name || ''; const isPlaceholder = !name || /^user\s*#?\s*\d+$/i.test(name) || name === `User #${selectedUser}`; if (isPlaceholder) resolveUserNameById(selectedUser).catch(() => { }); }, [selectedUser]);

    useEffect(() => { loadCircles(); }, []);
    useEffect(() => { const companyId = STATIC_COMPANY_ID; if (!companyId) setRestrictByCircle(false); }, []);
    useEffect(() => { if (userId) { setUrlUserId(userId); loadExistingMapping(userId); } }, [userId]);
    // Handle circle restriction / circle selection changes (not on every keystroke search)
    useEffect(() => {
        if (!restrictByCircle) {
            const q = userSearch.trim();
            setSelectedCircle('');
            setUsers([]); setUsersPage(1); setUsersTotalPages(1);
            loadUsers(undefined, 1, false, q.length >= SEARCH_THRESHOLD ? q : undefined);
            if (selectedUser) resolveUserNameById(selectedUser).catch(() => { });
            return;
        }
        if (restrictByCircle && selectedCircle) {
            setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(selectedCircle, 1, false);
            return;
        }
        const mapped = mappedCircleIdRef.current;
        if (mapped) {
            setSelectedCircle(mapped);
            setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(mapped, 1, false);
            if (selectedUser) resolveUserNameById(selectedUser).catch(() => { });
        } else {
            setUsers([]); setUsersPage(1); setUsersTotalPages(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restrictByCircle, selectedCircle]);

    // Focus effects no longer needed with MUI Autocomplete popper

    const userDisabled = restrictByCircle && !selectedCircle;
    const userPlaceholder = restrictByCircle ? (userDisabled ? 'Select circle first' : 'Select LMC Manager User') : 'Select LMC Manager User';
    const filteredCircles = circles; // no external filter
    const filteredUsers = users; // server returns already filtered when searching

    const handleUserScroll: React.UIEventHandler<HTMLUListElement> = e => { const el = e.currentTarget; if (usersLoading || usersAppendLoading) return; const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24; if (nearBottom && usersPage < usersTotalPages) { const next = usersPage + 1; const circleId = restrictByCircle ? (selectedCircle || undefined) : undefined; const q = userSearch.trim(); loadUsers(circleId, next, true, q.length >= SEARCH_THRESHOLD ? q : undefined); } };

    // Debounced server-side search (>= SEARCH_THRESHOLD chars). Clears results when empty.
    useEffect(() => {
        if (userDisabled) return; // block while disabled
        const circleId = restrictByCircle ? (selectedCircle || undefined) : undefined;
        const q = userSearch.trim();
        const handle = setTimeout(() => {
        if (q.length >= SEARCH_THRESHOLD) {
                setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(circleId, 1, false, q);
            } else if (q.length === 0) {
                setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(circleId, 1, false);
            }
        }, 300);
        return () => clearTimeout(handle);
    }, [userSearch, userDisabled, restrictByCircle, selectedCircle]);

    // Listen for global MUI select search events; robustly detect user select menu (accept inner elements as dropdown)
    useEffect(() => {
        const handler = (e: any) => {
            const term = (e.detail?.searchTerm || '').toString();
            const dropdown: HTMLElement | undefined = e.detail?.dropdown;
            if (!dropdown) return;
            const isUserMenu = dropdown.hasAttribute('data-user-select-menu')
                || !!dropdown.getAttribute('data-user-select-menu')
                || !!dropdown.closest?.('[data-user-select-menu]')
                || !!dropdown.querySelector?.('[data-user-select-menu]');
            if (isUserMenu) {
                setUserSearch(prev => prev === term ? prev : term);
            }
        };
        document.addEventListener('muiSelectSearch', handler as any);
        return () => document.removeEventListener('muiSelectSearch', handler as any);
    }, []);

    const handleSubmit = async () => {
        try {
            if (!selectedUser) return;
            if (!urlUserId) { toast.error('Missing user_id in URL'); return; }
            setSubmitLoading(true);
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const url = `https://${host}/pms/users/create_lmc_manager.json`;
            const payload = { user_id: Number(urlUserId), lmc_manager_id: Number(selectedUser) };
            const resp = await authedPost(url, payload, authToken);
            const wasUpdate = hasExistingMapping;
            if (resp?.success) { setHasExistingMapping(true); toast.success(resp?.message || (wasUpdate ? 'LMC Manager mapping updated' : 'LMC Manager mapping created')); }
            else toast.error(resp?.message || 'Failed to save');
        } catch (e: any) { toast.error(e?.message || 'Failed to save'); } finally { setSubmitLoading(false); }
    };

    return (
        <div className="p-6">
            {/* Page Header */}
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back
            </Button>

            <div className="mb-6 flex flex-wrap items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1a1a1a]">LMC MANAGER ASSIGNMENT</h1>
                    <p className="text-sm text-gray-600 mt-1">Select (optional) circle and assign or update the LMC Manager.</p>
                </div>
            </div>

            <MUICard className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]" elevation={0} sx={{ borderRadius: '8px', border: '1px solid #D9D9D9', backgroundColor: '#F6F7F7' }}>
                <Box sx={{ background: '#F6F4EE', mb: 2, px: 2, py: 1.5, borderBottom: '1px solid #E4E2DB' }}>
                    <Typography variant="subtitle1" className="text-black flex items-center" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        <Box component="span" className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">
                            1
                        </Box>
                        DETAILS
                    </Typography>
                </Box>
                <MUICardContent sx={{ pt: 0 }}>
                    {/* Restrict Toggle */}
                    <div className="flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-md px-4 py-3 mb-5 shadow-sm">
                        <FormControlLabel
                            control={<MuiSwitch
                                checked={restrictByCircle}
                                onChange={(e) => setRestrictByCircle(e.target.checked)}
                                sx={{
                                    '& .MuiSwitch-switchBase': { color: '#9CA3AF' }, // thumb (unchecked)
                                    '& .MuiSwitch-track': { backgroundColor: '#E5E7EB' }, // track (unchecked)
                                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#C72030' }, // thumb (checked)
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C72030' }, // track (checked)
                                    '& .MuiSwitch-switchBase.Mui-checked:hover': { backgroundColor: 'rgba(199,32,48,0.08)' },
                                    '& .MuiSwitch-switchBase:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                                    '& .MuiSwitch-switchBase.Mui-focusVisible.Mui-checked': { color: '#C72030' },
                                    '& .MuiSwitch-switchBase.Mui-focusVisible.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C72030' }
                                }}
                            />}
                            label={<span className="text-sm font-medium">Restrict by Circle</span>}
                        />
                        <span className="text-sm text-gray-500">{restrictByCircle ? 'Select circle first' : 'All circles allowed'}</span>
                    </div>
                    {/* Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Circle (Select only) */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold tracking-wide text-gray-600">CIRCLE</span>
                            <div className="flex flex-col gap-2">
                                <FormControl size="small" disabled={!restrictByCircle || circlesLoading || resolvingCircleLoading || mappingLoading}>
                                    <Select
                                        displayEmpty
                                        value={selectedCircle || ''}
                                        onChange={(e) => setSelectedCircle(e.target.value as string)}
                                        sx={{
                                            '& .MuiSelect-select': { fontSize: '0.85rem', paddingY: '6px' },
                                            backgroundColor: !restrictByCircle ? '#f3f4f6' : 'white',
                                            borderRadius: '6px'
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                sx: { maxHeight: 300 },
                                            }
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em style={{ fontSize: '0.9rem' }}>{restrictByCircle ? 'Select circle' : 'Circle disabled'}</em>
                                        </MenuItem>
                                        {filteredCircles.length === 0 && restrictByCircle && !circlesLoading && !resolvingCircleLoading && (
                                            <MenuItem disabled><em style={{ fontSize: '0.75rem' }}>No circles</em></MenuItem>
                                        )}
                                        {filteredCircles.map(c => (
                                            <MenuItem key={c.id} value={c.id} style={{ fontSize: '0.8rem' }}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                        {/* User (Select with in-menu search + infinite scroll) */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold tracking-wide text-gray-600">LMC MANAGER USER</span>
                            <FormControl size="small" disabled={userDisabled || mappingLoading}>
                                <Select
                                    data-select-user="true"
                                    displayEmpty
                                    value={selectedUser || ''}
                                    onChange={(e) => setSelectedUser(e.target.value as string)}
                                    sx={{
                                        '& .MuiSelect-select': { fontSize: '0.85rem', paddingY: '6px' },
                                        backgroundColor: userDisabled ? '#f3f4f6' : 'white',
                                        borderRadius: '6px'
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: { maxHeight: 320 },
                                            'data-user-select-menu': true,
                                            onScroll: (e: any) => {
                                                const el = e.currentTarget as HTMLElement;
                                                if (usersLoading || usersAppendLoading) return;
                                                const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
                                                if (nearBottom && usersPage < usersTotalPages) {
                                                    const next = usersPage + 1;
                                                    const circleId = restrictByCircle ? (selectedCircle || undefined) : undefined;
                                                    const q = userSearch.trim();
                                                        loadUsers(circleId, next, true, q.length >= SEARCH_THRESHOLD ? q : undefined);
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="">
                                        <em style={{ fontSize: '0.9rem' }}>{userDisabled ? 'Select circle first' : (userPlaceholder)}</em>
                                    </MenuItem>
                                    {/* Hint before threshold reached */}
                                    {!userDisabled && userSearch.trim().length === 0 && (
                                        <MenuItem disabled style={{ fontSize: '0.7rem', opacity: 0.8 }}>Type {SEARCH_THRESHOLD}+ characters to search</MenuItem>
                                    )}
                                    {!userDisabled && userSearch.trim().length > 0 && userSearch.trim().length < SEARCH_THRESHOLD && (
                                        <MenuItem disabled style={{ fontSize: '0.7rem', opacity: 0.8 }}>Type {SEARCH_THRESHOLD - userSearch.trim().length} more character{SEARCH_THRESHOLD - userSearch.trim().length === 1 ? '' : 's'} to search</MenuItem>
                                    )}
                                    {/* Search input removed; global enhancer injects it */}
                                    {filteredUsers.length === 0 && !usersLoading && (
                                        <MenuItem disabled><em style={{ fontSize: '0.75rem' }}>No users</em></MenuItem>
                                    )}
                                    {usersLoading && (
                                        <MenuItem disabled style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <CircularProgress size={14} sx={{ mr: 1 }} /> Loading...
                                        </MenuItem>
                                    )}
                                    {filteredUsers.map(u => (
                                        <MenuItem key={u.id} value={u.id} style={{ fontSize: '0.8rem', whiteSpace: 'normal', lineHeight: 1.2 }}>
                                            {u.name}{u.email ? ` (${u.email})` : ''}
                                        </MenuItem>
                                    ))}
                                    {usersAppendLoading && <MenuItem disabled style={{ fontSize: '0.7rem' }}>Loading more...</MenuItem>}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    {hasExistingMapping && <div className="mt-4 text-[11px] font-medium text-amber-600">Existing mapping found – you can update it.</div>}
                </MUICardContent>
            </MUICard>

            <div className="flex gap-4 flex-wrap justify-center">
                <Button disabled={!selectedUser || submitLoading} onClick={handleSubmit} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90 flex items-center px-8 h-11 text-sm font-semibold rounded-md disabled:bg-gray-300 disabled:text-gray-600">
                    {submitLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (hasExistingMapping ? 'Update Mapping' : 'Create Mapping')}
                </Button>
                {(circlesLoading || usersLoading) && <div className="flex items-center text-[#C72030] text-xs font-medium"><Loader2 className="w-4 h-4 animate-spin mr-2" />Loading {circlesLoading ? 'circles' : 'users'}...</div>}
            </div>
        </div>
    );
};

export default LMCPage;