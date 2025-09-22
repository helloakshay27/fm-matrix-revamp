import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface CircleOption { id: string; name: string; }
interface UserOption { id: string; name: string; circle_id?: string | number | null; email?: string | null; }

// Helper: fetch JSON using ONLY the token from URL (no localStorage fallback)
async function authedGet(url: string, token: string) {
    if (!token) throw new Error('Missing token');
    const res = await fetch(url, { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
}

// Helper: POST JSON using ONLY the token from URL (no localStorage fallback)
async function authedPost(url: string, body: any, token: string) {
    if (!token) throw new Error('Missing token');
    const res = await fetch(url, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json();
}

const MobileLMCPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [restrictByCircle, setRestrictByCircle] = useState<boolean>(true);
    const [circles, setCircles] = useState<CircleOption[]>([]);
    const [circlesLoading, setCirclesLoading] = useState(false);
    const [users, setUsers] = useState<UserOption[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersAppendLoading, setUsersAppendLoading] = useState(false);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [userSearch, setUserSearch] = useState('');
    const [selectedCircle, setSelectedCircle] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [refreshing, setRefreshing] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    // Keep best-known selected user option to avoid losing the name on list refreshes
    const selectedUserOptionRef = useRef<UserOption | null>(null);
    // Keep mapped circle id so we can restore it when toggling restriction back on
    const mappedCircleIdRef = useRef<string | null>(null);
    const [urlUserId, setUrlUserId] = useState<string>('');
    const [hasExistingMapping, setHasExistingMapping] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [resultMessage, setResultMessage] = useState<string>('');
    const [resultAction, setResultAction] = useState<'Created' | 'Updated'>('Updated');
    const [mappingLoading, setMappingLoading] = useState<boolean>(false);
    const [resolvingUserLoading, setResolvingUserLoading] = useState<boolean>(false);
    const [resolvingCircleLoading, setResolvingCircleLoading] = useState<boolean>(false);
    const [userSelectOpen, setUserSelectOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [userMobileDialogOpen, setUserMobileDialogOpen] = useState<boolean>(false);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);
    // Token must come from URL only (supports both ?token=... and ?access_token=...)
    const authToken = searchParams.get('token') || searchParams.get('access_token') || '';

    // Derive baseUrl
    const rawBase = localStorage.getItem('baseUrl') || '';
    const baseUrl = rawBase && !/^https?:\/\//i.test(rawBase) ? `https://${rawBase}` : rawBase;

    // Static company id for circles API
    const STATIC_COMPANY_ID = '145';

    // Load circles using static company id
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

    // Load existing LMC manager mapping for the user from URL (if any)
    const loadExistingMapping = async (userId: string) => {
        try {
            setMappingLoading(true);
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const url = `https://${host}/pms/users/get_lmc_manager.json?user_id=${encodeURIComponent(userId)}`;
            const resp = await authedGet(url, authToken);
            const data = resp?.data;
            if (resp?.success && data && (data.lmc_manager_id !== undefined && data.lmc_manager_id !== null)) {
                const lmId = String(data.lmc_manager_id);
                setSelectedUser(lmId);
                setHasExistingMapping(true);
                // Ensure selected appears in options even if not yet loaded
                setUsers(prev => (prev.some(u => u.id === lmId) ? prev : [{ id: lmId, name: `User #${lmId}` }, ...prev]));
                // Try to resolve the full name from company_wise_users by ID
                resolveUserNameById(lmId).catch(() => { });
                // Also resolve and select circle by id directly from mapping, if present
                if (data.circle_id !== undefined && data.circle_id !== null) {
                    mappedCircleIdRef.current = String(data.circle_id);
                    resolveCircleNameById(String(data.circle_id)).catch(() => { });
                }
            } else {
                setHasExistingMapping(false);
            }
        } catch (e) {
            // If GET fails, treat as no existing mapping
            setHasExistingMapping(false);
        } finally { setMappingLoading(false); }
    };

    // Resolve a user's display name by ID via company_wise_users, if available
    const resolveUserNameById = async (id: string) => {
        setResolvingUserLoading(true);
        const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
        const base = `https://${host}/pms/users/company_wise_users.json`;
        const companyId = localStorage.getItem('selectedCompanyId') || searchParams.get('company_id') || '';
        const circleFilter = restrictByCircle && selectedCircle ? `q[lock_user_permissions_circle_id_eq]=${encodeURIComponent(selectedCircle)}` : '';
        const companyParam = companyId ? `company_id=${encodeURIComponent(companyId)}` : '';
        const glue = (...parts: string[]) => parts.filter(Boolean).join('&');
        const candidates = [
            `${base}?${glue(`ids[]=${encodeURIComponent(id)}`, circleFilter, companyParam)}`,
            `${base}?${glue(`id=${encodeURIComponent(id)}`, circleFilter, companyParam)}`,
            `${base}?${glue(`q[id_eq]=${encodeURIComponent(id)}`, circleFilter, companyParam)}`,
            `${base}?${glue(`q[id_in][]=${encodeURIComponent(id)}`, circleFilter, companyParam)}`,
        ];
        let match: any = null;
        for (const url of candidates) {
            try {
                const data = await authedGet(url, authToken);
                const raw = Array.isArray(data?.users) ? data.users : (Array.isArray(data) ? data : []);
                match = raw.find((u: any) => String(u.id) === String(id));
                if (match) break;
            } catch {
                // try next variant
            }
        }
        if (!match) { setResolvingUserLoading(false); return; }
        const first = match.first_name || match.firstname || match.firstName || '';
        const last = match.last_name || match.lastname || match.lastName || '';
        const fullFromParts = `${String(first).trim()} ${String(last).trim()}`.trim();
        const fallbackFull = match.full_name || match.fullName || match.name || `User ${match.id}`;
        const display = fullFromParts || fallbackFull;
        const circleId = match.circle_id || match.circle || match.circleId;
        const resolved = { id: String(match.id), name: String(display), circle_id: circleId, email: match.email || null } as UserOption;
        setUsers(prev => {
            const idx = prev.findIndex(u => u.id === resolved.id);
            if (idx === -1) return [resolved, ...prev];
            const copy = prev.slice();
            copy[idx] = resolved;
            return copy;
        });
        // Update cached selected user option if relevant
        if (String(id) === String(selectedUser)) {
            selectedUserOptionRef.current = resolved;
        }
        if (circleId) {
            await resolveCircleNameById(String(circleId));
        }
        setResolvingUserLoading(false);
    };

    // Resolve circle name by id via get_circles and select it in the dropdown (uses static company id)
    const resolveCircleNameById = async (id: string) => {
        try {
            setResolvingCircleLoading(true);
            mappedCircleIdRef.current = String(id);
            const companyId = STATIC_COMPANY_ID;
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const url = `https://${host}/pms/users/get_circles.json?company_id=${encodeURIComponent(companyId)}`;
            const data = await authedGet(url, authToken);
            const list = Array.isArray(data?.circles) ? data.circles : (Array.isArray(data) ? data : []);
            const found = list.find((c: any) => String(c.id || c.circle_id || c.name) === String(id));
            if (found) {
                const opt = { id: String(found.id || found.circle_id || found.name), name: found.circle_name || found.name || found.circle || `Circle ${found.id}` } as CircleOption;
                setCircles(prev => (prev.some(c => c.id === opt.id) ? prev : [opt, ...prev]));
            } else {
                // Add placeholder if not found, to show name
                setCircles(prev => (prev.some(c => c.id === String(id)) ? prev : [{ id: String(id), name: `Circle ${id}` }, ...prev]));
            }
            setSelectedCircle(String(id));
        } catch {
            setSelectedCircle(String(id));
            setCircles(prev => (prev.some(c => c.id === String(id)) ? prev : [{ id: String(id), name: `Circle ${id}` }, ...prev]));
        } finally { setResolvingCircleLoading(false); }
    };

    // Load users (optionally filtered by circle)
    const loadUsers = async (circleId?: string, page: number = 1, append: boolean = false, search?: string) => {
        try {
            if (append) setUsersAppendLoading(true);
            else setUsersLoading(true);
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const base = `https://${host}/pms/users/company_wise_users.json`;
            const params: string[] = [];
            if (restrictByCircle && circleId) params.push(`q[lock_user_permissions_circle_id_eq]=${encodeURIComponent(circleId)}`);
            if (page && page > 1) params.push(`page=${page}`);
            if (search && search.trim()) params.push(`q[email_cont]=${encodeURIComponent(search.trim())}`);
            const url = params.length ? `${base}?${params.join('&')}` : base;
            const data = await authedGet(url, authToken);
            const rawUsers = Array.isArray(data?.users) ? data.users : (Array.isArray(data) ? data : []);
            let mapped: UserOption[] = rawUsers.map((u: any) => {
                const first = u.first_name || u.firstname || u.firstName || '';
                const last = u.last_name || u.lastname || u.lastName || '';
                const fullFromParts = `${String(first).trim()} ${String(last).trim()}`.trim();
                const fallbackFull = u.full_name || u.fullName || u.name || `User ${u.id}`;
                const display = fullFromParts || fallbackFull;
                return { id: String(u.id), name: String(display), circle_id: u.circle_id || u.circle || u.circleId, email: u.email || null };
            });
            // Fallback client-side filter if server didn’t apply
            if (restrictByCircle && circleId) {
                mapped = mapped.filter(u => !u.circle_id || String(u.circle_id) === String(circleId));
            }
            setUsers(prev => {
                if (!append) {
                    // Ensure currently selected user remains visible if not in freshly loaded page
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
        } finally {
            if (append) setUsersAppendLoading(false);
            else setUsersLoading(false);
        }
    };

    // Keep a cached copy of the selected user's best-known option
    useEffect(() => {
        if (!selectedUser) return;
        const opt = users.find(u => u.id === selectedUser);
        if (opt) selectedUserOptionRef.current = opt;
    }, [selectedUser, users]);

    // If the selected user's label is still a placeholder (e.g., "User #123"), try resolving it by ID
    useEffect(() => {
        if (!selectedUser) return;
        const current = selectedUserOptionRef.current || users.find(u => u.id === selectedUser);
        const name = current?.name || '';
        const isPlaceholder = !name || /^user\s*#?\s*\d+$/i.test(name) || name === `User #${selectedUser}`;
        if (isPlaceholder) {
            resolveUserNameById(selectedUser).catch(() => { /* noop */ });
        }
    }, [selectedUser]);

    // Derive the best label to show for the selected user (avoid showing raw ID placeholders on mobile)
    const selectedUserBestLabel = useMemo(() => {
        if (!selectedUser) return '';
        const opt = selectedUserOptionRef.current || users.find(u => u.id === selectedUser);
        if (!opt) return `User #${selectedUser}`;
        const isPlaceholder = /^user\s*#?\s*\d+$/i.test(opt.name) || opt.name === `User #${selectedUser}`;
        const primary = isPlaceholder ? (opt.email || `User #${selectedUser}`) : opt.name;
        const suffix = opt.email && !isPlaceholder ? ` (${opt.email})` : (isPlaceholder && opt.email ? '' : '');
        return `${primary}${suffix}`;
    }, [selectedUser, users]);

    // Initial loads
    useEffect(() => { loadCircles(); }, []);
    // Keep restriction as-is; static company id ensures circles API works
    useEffect(() => {
        const companyId = STATIC_COMPANY_ID;
        if (!companyId) setRestrictByCircle(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Read user_id from URL and load existing mapping once
    useEffect(() => {
        const u = searchParams.get('user_id') || '';
        setUrlUserId(u);
        if (u) loadExistingMapping(u);
    }, [searchParams]);
    useEffect(() => {
        // When restriction toggles off, fetch all users ignoring circle.
        if (!restrictByCircle) {
            setSelectedCircle('');
            setUsers([]); setUsersPage(1); setUsersTotalPages(1);
            loadUsers(undefined, 1, false);
            // If there is a selected user, try resolving its name without circle restriction
            if (selectedUser) {
                // Temporarily bypass circle filter by calling resolver after state update
                resolveUserNameById(selectedUser).catch(() => { });
            }
        } else if (restrictByCircle && selectedCircle) {
            setUsers([]); setUsersPage(1); setUsersTotalPages(1);
            loadUsers(selectedCircle, 1, false);
        } else {
            // If restriction on but no circle chosen yet, try restoring mapped circle id
            const mapped = mappedCircleIdRef.current;
            if (mapped) {
                setSelectedCircle(mapped);
                setUsers([]); setUsersPage(1); setUsersTotalPages(1);
                loadUsers(mapped, 1, false);
                // Ensure selected user's name remains correct
                if (selectedUser) resolveUserNameById(selectedUser).catch(() => { });
            } else {
                // No mapped circle known -> empty user list until user selects circle
                setUsers([]);
                setUsersPage(1); setUsersTotalPages(1);
            }
        }
    }, [restrictByCircle, selectedCircle]);

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await Promise.all([
                loadCircles(),
                restrictByCircle ? (selectedCircle ? loadUsers(selectedCircle) : Promise.resolve()) : loadUsers()
            ]);
            toast.success('Data refreshed');
        } finally { setRefreshing(false); }
    };

    // Ensure the search input gains/keeps focus when the select opens (mobile-friendly)
    useEffect(() => {
        if (userSelectOpen) {
            const t = setTimeout(() => {
                try { searchInputRef.current?.focus({ preventScroll: true } as any); } catch { /* noop */ }
            }, 0);
            return () => clearTimeout(t);
        }
    }, [userSelectOpen]);

    // Detect mobile viewport and focus input when mobile dialog opens
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (userMobileDialogOpen) {
            const t = setTimeout(() => {
                try { mobileSearchInputRef.current?.focus({ preventScroll: true } as any); } catch { /* noop */ }
            }, 50);
            return () => clearTimeout(t);
        }
    }, [userMobileDialogOpen]);

    const allLoading = circlesLoading || usersLoading || mappingLoading || resolvingUserLoading || resolvingCircleLoading;
    const circleDisabled = !restrictByCircle;
    const userDisabled = restrictByCircle && !selectedCircle;

    const userPlaceholder = restrictByCircle ? (userDisabled ? 'Select circle first' : 'Select LMC Manager User') : 'Select LMC Manager User';
    const filteredUsers = useMemo(() => {
        const q = userSearch.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u =>
            u.name.toLowerCase().includes(q) || (u.email ? String(u.email).toLowerCase().includes(q) : false)
        );
    }, [userSearch, users]);

    const handleUserScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
        const el = e.currentTarget;
        if (usersLoading || usersAppendLoading) return;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
        if (nearBottom && usersPage < usersTotalPages) {
            const nextPage = usersPage + 1;
            const circleId = restrictByCircle ? selectedCircle || undefined : undefined;
            const q = userSearch.trim();
            loadUsers(circleId, nextPage, true, q.length >= 3 ? q : undefined);
        }
    };

    // Debounced server-side search by email_cont
    useEffect(() => {
        if (userDisabled) return;
        const circleId = restrictByCircle ? selectedCircle || undefined : undefined;
        const q = userSearch.trim();
        const qlen = q.length;
        const handler = setTimeout(() => {
            // Only call server when query has 3+ characters
            if (qlen >= 3) {
                setUsers([]); setUsersPage(1); setUsersTotalPages(1);
                loadUsers(circleId, 1, false, q);
            } else if (qlen === 0) {
                // When cleared, reload default list (no search)
                setUsers([]); setUsersPage(1); setUsersTotalPages(1);
                loadUsers(circleId, 1, false);
            } else {
                // For 1-2 characters, do not trigger server-side search; keep current list
            }
        }, 350);
        return () => clearTimeout(handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userSearch]);

    // Submit create/update mapping
    const handleSubmit = async () => {
        try {
            if (!selectedUser) return;
            if (!urlUserId) { toast.error('Missing user_id in URL'); return; }
            setSubmitLoading(true);
            const host = baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'live-api.gophygital.work';
            const url = `https://${host}/pms/users/create_lmc_manager.json`;
            const payload = { user_id: Number(urlUserId), lmc_manager_id: Number(selectedUser) };
            const resp = await authedPost(url, payload, authToken);
            // Determine if this was an update or create based on previous state
            const wasUpdate = hasExistingMapping;
            if (resp?.success) {
                setHasExistingMapping(true);
                setResultAction(wasUpdate ? 'Updated' : 'Created');
                setResultMessage(resp?.message || (wasUpdate ? 'LMC Manager mapping successfully updated' : 'LMC Manager mapping successfully created'));
                setResultModalOpen(true);
            } else {
                toast.error(resp?.message || 'Failed to save');
            }
        } catch (e: any) {
            toast.error(e?.message || 'Failed to save');
        } finally { setSubmitLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto">
                <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur">
                    <CardHeader className="text-center pb-4">
                        {/* <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            LMC
            </CardTitle> */}
                        <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{hasExistingMapping ? 'Update LMC Manager' : 'Select LMC Manager'}</p>
                    </CardHeader>

                    <CardContent className="space-y-6 px-4 sm:px-6">
                        {/* Toggle Section */}
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <Switch
                                    id="restrict-circle"
                                    checked={restrictByCircle}
                                    onCheckedChange={setRestrictByCircle}
                                    className="data-[state=checked]:bg-[#C72030]"
                                />
                                <Label htmlFor="restrict-circle" className="cursor-pointer text-sm sm:text-base font-medium">
                                    Restrict by Circle
                                </Label>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {restrictByCircle
                                    ? "Select circle first, then choose user"
                                    : "Choose any user directly"
                                }
                            </p>
                        </div>

                        {/* Circle Dropdown */}
                        <div className="space-y-2">
                            <Label className={`block text-sm sm:text-base font-medium text-center ${circleDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                                Circle
                            </Label>
                            <Select
                                value={selectedCircle}
                                onValueChange={v => setSelectedCircle(v)}
                                disabled={circleDisabled || circlesLoading || allLoading}
                            >
                                <SelectTrigger className={`w-full h-12 sm:h-14 text-base rounded-xl border-2 transition-all ${circleDisabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300 hover:border-[#C72030] focus:border-[#C72030]'
                                    }`}>
                                    <SelectValue placeholder={circlesLoading ? 'Loading circles...' : 'Select circle'} />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {circles.map(c => (
                                        <SelectItem key={c.id} value={c.id} className="text-base py-3">{c.name}</SelectItem>
                                    ))}
                                    {!circlesLoading && circles.length === 0 && (
                                        <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                            No circles available
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* User Dropdown with search + infinite scroll */}
                        <div className="space-y-2">
                            <Label className={`block text-sm sm:text-base font-medium text-center ${userDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                                LMC Manager User
                            </Label>
                            {isMobile ? (
                                <>
                                    <Button
                                        type="button"
                                        disabled={userDisabled || allLoading}
                                        onClick={() => setUserMobileDialogOpen(true)}
                                        variant="outline"
                                        className={`w-full h-12 sm:h-14 text-base rounded-xl border-2 ${userDisabled ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-gray-300 hover:border-[#C72030]'} justify-between`}
                                    >
                                        <span className="truncate text-left">
                                            {selectedUser ? (selectedUserBestLabel || 'Selected user') : (usersLoading ? 'Loading LMC Manager users...' : userPlaceholder)}
                                        </span>
                                        <span className="ml-2 text-gray-400">▼</span>
                                    </Button>
                                </>
                            ) : (
                                <Select
                                    value={selectedUser}
                                    onValueChange={v => setSelectedUser(v)}
                                    disabled={userDisabled || usersLoading || allLoading}
                                    open={userSelectOpen}
                                    onOpenChange={setUserSelectOpen}
                                >
                                    <SelectTrigger className={`w-full h-12 sm:h-14 text-base rounded-xl border-2 transition-all ${userDisabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300 hover:border-[#C72030] focus:border-[#C72030]'}`}>
                                        <SelectValue placeholder={usersLoading ? 'Loading LMC Manager users...' : userPlaceholder} />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="w-[var(--radix-select-trigger-width)]"
                                        onCloseAutoFocus={(e: any) => { e.preventDefault(); }}
                                        onPointerDownOutside={(e: any) => {
                                            const target = e.target as HTMLElement | null;
                                            if (target && target.closest('input')) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <div className="p-2 sticky top-0 bg-white border-b">
                                            <input
                                                ref={searchInputRef}
                                                value={userSearch}
                                                onChange={(e) => setUserSearch(e.target.value)}
                                                onKeyDown={(e) => {
                                                    e.stopPropagation();
                                                    if (e.key === 'Enter') e.preventDefault();
                                                }}
                                                onKeyDownCapture={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                onFocus={() => setUserSelectOpen(true)}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onPointerDown={(e) => e.stopPropagation()}
                                                onClick={(e) => e.stopPropagation()}
                                                placeholder="Search LMC Manager user (type 3+ chars)"
                                                className="w-full h-9 px-3 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                            />
                                        </div>
                                        <div className="max-h-60 overflow-auto" onScroll={handleUserScroll}>
                                            {filteredUsers.map(u => (
                                                <SelectItem key={u.id} value={u.id} className="text-base py-3">{`${u.name}${u.email ? ` (${u.email})` : ''}`}</SelectItem>
                                            ))}
                                            {(usersLoading || usersAppendLoading) && (
                                                <div className="px-4 py-3 text-center text-gray-500 text-sm">Loading...</div>
                                            )}
                                            {!usersLoading && filteredUsers.length === 0 && (
                                                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                                    {restrictByCircle && !selectedCircle ? 'Please select a circle first' : 'No users found'}
                                                </div>
                                            )}
                                        </div>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                            {hasExistingMapping && (
                                <div className="text-xs text-center text-amber-600 -mt-1">Existing mapping found – you can update it.</div>
                            )}
                            <Button
                                disabled={!selectedUser || submitLoading}
                                onClick={handleSubmit}
                                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-[#C72030] hover:bg-[#a31726] disabled:bg-gray-300 disabled:text-gray-500 rounded-xl transition-all duration-200 transform active:scale-95"
                            >
                                {submitLoading ? 'Saving...' : (hasExistingMapping ? 'Update' : 'Create')}
                            </Button>

                            {/* <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    disabled={refreshing || circlesLoading || usersLoading}
                                    className="flex-1 h-10 sm:h-12 text-sm sm:text-base rounded-xl border-2 border-gray-300 hover:border-[#C72030] transition-all"
                                >
                                    {refreshing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Refreshing...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh
                                        </>
                                    )}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedUser(''); setSelectedCircle(''); }}
                                    disabled={!selectedUser && !selectedCircle}
                                    className="flex-1 h-10 sm:h-12 text-sm sm:text-base rounded-xl border-2 border-gray-300 hover:border-red-400 hover:text-red-600 transition-all"
                                >
                                    Clear All
                                </Button>
                            </div> */}
                        </div>

                        {/* Status Indicator */}
                        {(circlesLoading || usersLoading) && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-[#C72030] mr-2" />
                                <span className="text-sm font-semibold text-[#C72030]">
                                    Loading {circlesLoading ? 'circles' : 'users'}...
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Global Loading Overlay */}
                {allLoading && (
                    <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <div
                            className="rounded-xl bg-white shadow-lg border border-[#C72030]/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3"
                            role="status"
                            aria-live="polite"
                        >
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#C72030]" />
                            <span className="text-[#C72030] text-sm sm:text-base font-semibold">Loading...</span>
                        </div>
                    </div>
                )}

                {/* Mobile User Picker Dialog */}
                <Dialog open={userMobileDialogOpen} onOpenChange={setUserMobileDialogOpen}>
                    <DialogContent className="w-[92vw] max-w-md p-4 rounded-xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg">Select LMC Manager</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            <input
                                ref={mobileSearchInputRef}
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                placeholder="Search LMC Manager user (type 3+ chars)"
                                className="w-full h-10 px-3 text-base border rounded-md focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                                inputMode="search"
                            />
                            <div className="max-h-80 overflow-auto rounded-md border" onScroll={handleUserScroll}>
                                {filteredUsers.map(u => (
                                    <button
                                        key={u.id}
                                        type="button"
                                        className="w-full text-left px-3 py-3 border-b last:border-b-0 hover:bg-gray-50"
                                        onClick={() => {
                                            setSelectedUser(u.id);
                                            // Cache immediately so the mobile label shows correctly even if the list gets reset
                                            selectedUserOptionRef.current = u;
                                            setUserMobileDialogOpen(false);
                                        }}
                                    >
                                        <div className="text-sm font-medium">{u.name}</div>
                                        {u.email && <div className="text-xs text-gray-500">{u.email}</div>}
                                    </button>
                                ))}
                                {(usersLoading || usersAppendLoading) && (
                                    <div className="px-4 py-3 text-center text-gray-500 text-sm">Loading...</div>
                                )}
                                {!usersLoading && filteredUsers.length === 0 && (
                                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                        {restrictByCircle && !selectedCircle ? 'Please select a circle first' : 'No users found'}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2 pt-1">
                                <Button variant="outline" onClick={() => setUserMobileDialogOpen(false)}>Close</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Result Modal */}
                <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
                    <DialogContent className="w-[92vw] max-w-md sm:max-w-lg p-5 sm:p-6 rounded-xl text-center">
                        <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl">
                                {`Success — ${resultAction}`}
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-base text-gray-600">
                                {resultMessage}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogClose
                            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </DialogClose>
                        {/* <DialogFooter className="mt-6 flex w-full justify-center sm:justify-center">
                            <DialogClose asChild>
                                <Button type="button" className="min-w-24 bg-[#C72030] justify-center hover:bg-[#a31726]">
                                    OK
                                </Button>
                            </DialogClose>
                        </DialogFooter> */}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default MobileLMCPage