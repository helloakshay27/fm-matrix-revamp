import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
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
    const [userSearch, setUserSearch] = useState('');
    const [selectedCircle, setSelectedCircle] = useState('');
    const [circleSelectOpen, setCircleSelectOpen] = useState(false);
    const [circleSearch, setCircleSearch] = useState('');
    const circleSearchInputRef = useRef<HTMLInputElement>(null);
    const circleContentRef = useRef<HTMLDivElement>(null);
    const [selectedUser, setSelectedUser] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const selectedUserOptionRef = useRef<UserOption | null>(null);
    const mappedCircleIdRef = useRef<string | null>(null);
    const [urlUserId, setUrlUserId] = useState('');
    const [hasExistingMapping, setHasExistingMapping] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [mappingLoading, setMappingLoading] = useState(false);
    const [resolvingUserLoading, setResolvingUserLoading] = useState(false);
    const [resolvingCircleLoading, setResolvingCircleLoading] = useState(false);
    const [userSelectOpen, setUserSelectOpen] = useState(false);
    const userSelectContentRef = useRef<HTMLDivElement>(null);

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
    useEffect(() => {
        if (!restrictByCircle) { setSelectedCircle(''); setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(undefined, 1, false); if (selectedUser) resolveUserNameById(selectedUser).catch(() => { }); }
        else if (restrictByCircle && selectedCircle) { setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(selectedCircle, 1, false); }
        else { const mapped = mappedCircleIdRef.current; if (mapped) { setSelectedCircle(mapped); setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(mapped, 1, false); if (selectedUser) resolveUserNameById(selectedUser).catch(() => { }); } else { setUsers([]); setUsersPage(1); setUsersTotalPages(1); } }
    }, [restrictByCircle, selectedCircle]);

    useEffect(() => { if (userSelectOpen) { const t = setTimeout(() => { try { searchInputRef.current?.focus({ preventScroll: true } as any); } catch { } }, 0); return () => clearTimeout(t); } }, [userSelectOpen]);
    useEffect(() => { if (circleSelectOpen) { const t = setTimeout(() => { try { circleSearchInputRef.current?.focus({ preventScroll: true } as any); } catch { } }, 0); return () => clearTimeout(t); } }, [circleSelectOpen]);
    useEffect(() => { if (!circleSelectOpen) return; const t = setTimeout(() => { try { circleSearchInputRef.current?.focus({ preventScroll: true } as any); } catch { } }, 0); return () => clearTimeout(t); }, [circleSearch, circleSelectOpen]);

    const userDisabled = restrictByCircle && !selectedCircle;
    const userPlaceholder = restrictByCircle ? (userDisabled ? 'Select circle first' : 'Select LMC Manager User') : 'Select LMC Manager User';
    const filteredCircles = useMemo(() => { const q = circleSearch.trim().toLowerCase(); if (!q) return circles; return circles.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)); }, [circleSearch, circles]);
    const filteredUsers = useMemo(() => { const q = userSearch.trim().toLowerCase(); if (!q) return users; return users.filter(u => { const nameMatch = u.name.toLowerCase().includes(q); const emailMatch = u.email ? u.email.toLowerCase().includes(q) : false; const mobileMatch = u.mobile ? u.mobile.toLowerCase().includes(q) : false; const idMatch = u.id.includes(q); return nameMatch || emailMatch || mobileMatch || idMatch; }); }, [userSearch, users]);

    const handleUserScroll: React.UIEventHandler<HTMLDivElement> = e => { const el = e.currentTarget; if (usersLoading || usersAppendLoading) return; const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24; if (nearBottom && usersPage < usersTotalPages) { const next = usersPage + 1; const circleId = restrictByCircle ? (selectedCircle || undefined) : undefined; const q = userSearch.trim(); loadUsers(circleId, next, true, q.length >= 3 ? q : undefined); } };

    useEffect(() => { if (userDisabled) return; const circleId = restrictByCircle ? (selectedCircle || undefined) : undefined; const q = userSearch.trim(); const qlen = q.length; const h = setTimeout(() => { if (qlen >= 3) { setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(circleId, 1, false, q); } else if (qlen === 0) { setUsers([]); setUsersPage(1); setUsersTotalPages(1); loadUsers(circleId, 1, false); } }, 350); return () => clearTimeout(h); }, [userSearch]);

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

            <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-4">
                    <CardTitle className="text-lg text-black flex items-center">
                        <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
                        DETAILS
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Restrict Toggle */}
                    <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded-md px-4 py-2 mb-5 shadow-sm">
                        <Switch id="restrict-circle" checked={restrictByCircle} onCheckedChange={setRestrictByCircle} className="data-[state=checked]:bg-[#C72030]" />
                        <Label htmlFor="restrict-circle" className="text-sm font-medium cursor-pointer">Restrict by Circle</Label>
                        <span className="text-[11px] text-gray-500">{restrictByCircle ? 'Select circle first' : 'All circles allowed'}</span>
                    </div>
                    {/* Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Circle */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold tracking-wide text-gray-600">CIRCLE</Label>
                            <Select value={selectedCircle} onValueChange={v => { setSelectedCircle(v); setCircleSelectOpen(false); }} disabled={!restrictByCircle || circlesLoading || resolvingCircleLoading || mappingLoading} open={circleSelectOpen} onOpenChange={o => { setCircleSelectOpen(o); if (!o) setCircleSearch(''); }}>
                                <SelectTrigger className={`h-11 rounded-md text-sm border ${!restrictByCircle ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030]/30'}`}>
                                    <SelectValue placeholder={circlesLoading ? 'Loading circles...' : 'Select circle'} />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-md border border-gray-200 shadow-md w-[var(--radix-select-trigger-width)]" ref={circleContentRef} onCloseAutoFocus={(e: any) => e.preventDefault()} onPointerDownOutside={(e: any) => { const t = e.target as HTMLElement | null; if (t && t.closest('input')) { e.preventDefault(); setTimeout(() => circleSearchInputRef.current?.focus(), 0); } }}>
                                    <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                                        <input ref={circleSearchInputRef} value={circleSearch} onChange={e => setCircleSearch(e.target.value)} placeholder="Search circle" className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]" autoFocus />
                                    </div>
                                    {filteredCircles.map(c => <SelectItem key={c.id} value={c.id} className="py-2.5 text-sm hover:bg-gray-50 cursor-pointer">{c.name}</SelectItem>)}
                                    {!circlesLoading && filteredCircles.length === 0 && <div className="px-4 py-6 text-center text-gray-500 text-xs">No circles found</div>}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* User */}
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-semibold tracking-wide text-gray-600">LMC MANAGER USER</Label>
                            <Select value={selectedUser} onValueChange={v => setSelectedUser(v)} disabled={userDisabled || usersLoading || mappingLoading} open={userSelectOpen} onOpenChange={setUserSelectOpen}>
                                <SelectTrigger className={`h-11 rounded-md text-sm border ${userDisabled ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-2 focus:ring-[#C72030]/30'}`}>
                                    <SelectValue placeholder={usersLoading ? 'Loading users...' : userPlaceholder} />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-md border border-gray-200 shadow-md w-[var(--radix-select-trigger-width)]" ref={userSelectContentRef} onCloseAutoFocus={(e: any) => e.preventDefault()} onPointerDownOutside={(e: any) => { const t = e.target as HTMLElement | null; if (t && t.closest('input')) e.preventDefault(); }}>
                                    <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
                                        <input ref={searchInputRef} value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search user (type 3+ chars)" className="w-full h-9 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]" />
                                    </div>
                                    <div className="max-h-60 overflow-auto" onScroll={handleUserScroll}>
                                        {filteredUsers.map(u => <SelectItem key={u.id} value={u.id} className="py-2.5 text-sm hover:bg-gray-50 cursor-pointer">{`${u.name}${u.email ? ` (${u.email})` : ''}`}</SelectItem>)}
                                        {(usersLoading || usersAppendLoading) && <div className="px-4 py-3 text-center text-gray-500 text-xs">Loading...</div>}
                                        {!usersLoading && filteredUsers.length === 0 && <div className="px-4 py-6 text-center text-gray-500 text-xs">{restrictByCircle && !selectedCircle ? 'Select a circle first' : 'No users found'}</div>}
                                    </div>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {hasExistingMapping && <div className="mt-4 text-[11px] font-medium text-amber-600">Existing mapping found – you can update it.</div>}
                </CardContent>
            </Card>

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