import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User as UserIcon, ChevronRight, ChevronDown, Trash2, ArrowLeftRight, ShieldAlert, ArrowLeft, Users, UserMinus, AlertCircle } from 'lucide-react';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

type Entry = {
    id: number;
    value: string;
};

export const MultipleUserDeletePage = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<Entry[]>([{ id: 1, value: '' }]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingIds, setPendingIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    type UserRow = { name?: string; email?: string; mobile_number?: string };
    const [deletedUsers, setDeletedUsers] = useState<UserRow[]>([]);
    const [skippedUsers, setSkippedUsers] = useState<UserRow[]>([]);
    const [notFoundUsers, setNotFoundUsers] = useState<string[]>([]);
    type Reportee = { name?: string; email?: string; mobile_number?: string };
    type NotDeletedManager = { name?: string; email?: string; mobile_number?: string; reportees?: Reportee[] };
    const [notDeletedDueToReportee, setNotDeletedDueToReportee] = useState<NotDeletedManager[]>([]);

    // Tabs and hierarchy (tree) state
    const [activeTab, setActiveTab] = useState<'single' | 'tree'>('single');
    type TreeNode = { id: number; name: string; email: string; children: TreeNode[] };
    const [treeIdentifier, setTreeIdentifier] = useState<string>('');
    const [treeLoading, setTreeLoading] = useState(false);
    const [treeData, setTreeData] = useState<TreeNode | null>(null);
    const [treeDeleteLoading, setTreeDeleteLoading] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
    // Modals for hierarchy delete flow
    const [showDeleteChoice, setShowDeleteChoice] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Determine if the fetched hierarchy has any meaningful content
    const isTreeEmpty = (n: any): boolean => {
        if (!n || typeof n !== 'object') return true;
        const hasChildren = Array.isArray(n.children) && n.children.length > 0;
        const hasNameOrEmail = Boolean(n.name) || Boolean(n.email);
        // Treat as empty unless it has at least a label or any children
        return !(hasChildren || hasNameOrEmail);
    };

    const collectAllIds = (node: TreeNode | null): number[] => {
        if (!node) return [];
        const ids: number[] = [node.id];
        for (const child of node.children || []) ids.push(...collectAllIds(child));
        return ids;
    };

    const countDescendants = (node: TreeNode | null): number => {
        if (!node) return 0;
        let count = 0;
        for (const child of node.children || []) {
            count += 1 + countDescendants(child);
        }
        return count;
    };

    // Validation helpers
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const isValidEmail = (v: string): boolean => emailRegex.test(v.trim());
    const isValidMobile = (v: string): boolean => {
        const digitsOnly = v.replace(/\D/g, '');
        // Accept 10-15 digits (min 10 as requested)
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    };
    const isValidIdentifier = (v: string): boolean => {
        const t = (v || '').trim();
        if (!t) return false;
        return t.includes('@') ? isValidEmail(t) : isValidMobile(t);
    };
    const getIdentifierError = (v: string): string | null => {
        const t = (v || '').trim();
        if (!t) return null;
        if (t.includes('@')) return isValidEmail(t) ? null : 'Enter a valid email address';
        return isValidMobile(t) ? null : 'Enter a valid mobile number (min 10 digits)';
    };

    // Sanitize input to allow only valid characters for email/phone
    const sanitizeIdentifierInput = (val: string): string => {
        if (!val) return '';
        let t = val.replace(/\s+/g, '');
        const hasLettersOrAt = /[a-zA-Z@]/.test(t);
        if (hasLettersOrAt) {
            // Email-like: keep as-is (sans spaces) and lowercase
            return t.toLowerCase();
        }
        // phone-like: only allow + at start and digits thereafter
        const hasPlus = t.startsWith('+');
        let digits = t.replace(/\D/g, '');
        if (digits.length > 15) digits = digits.slice(0, 15);
        return hasPlus ? `+${digits}` : digits;
    };

    const normalizeIdentifier = (val: string): string => {
        const v = val.trim();
        if (v.includes('@')) return v.toLowerCase();
        // phone-like: keep + and digits
        const hasPlus = v.startsWith('+');
        const digits = v.replace(/[^0-9]/g, '');
        return hasPlus ? `+${digits}` : digits;
    };

    // Normalize backend/validation error text to preferred UX copy
    const normalizeErrorMessage = (msg: string): string => {
        if (!msg) return msg;
        return /not\s*-?\s*found/i.test(msg) ? 'User Not Exist' : msg;
    };

    // Helpers to merge results without duplicates
    const mergeUniqueUsers = (prev: UserRow[], next: UserRow[]): UserRow[] => {
        const map = new Map<string, UserRow>();
        const put = (u?: UserRow) => {
            if (!u) return;
            const key = `${(u.email || '').toLowerCase()}|${u.mobile_number || ''}`;
            if (!map.has(key)) map.set(key, u);
        };
        prev.forEach(put);
        next.forEach(put);
        return Array.from(map.values());
    };

    const mergeUniqueStrings = (prev: string[], next: string[]): string[] => {
        const set = new Set<string>(prev.map(s => s.toLowerCase()));
        next.forEach(s => {
            const v = (s || '').toLowerCase();
            if (v && !set.has(v)) set.add(v);
        });
        // Preserve original casing from previous when possible; fall back to next items
        const source = [...prev, ...next];
        const out: string[] = [];
        const added = new Set<string>();
        for (const s of source) {
            const v = (s || '').toLowerCase();
            if (v && !added.has(v)) { out.push(s); added.add(v); }
        }
        return out;
    };

    // Merge managers (not deleted due to reportee) uniquely by email|mobile, and merge their reportees uniquely as well
    const mergeUniqueManagers = (prev: NotDeletedManager[], next: NotDeletedManager[]): NotDeletedManager[] => {
        const keyOf = (u?: { email?: string; mobile_number?: string }) => `${(u?.email || '').toLowerCase()}|${u?.mobile_number || ''}`;
        const mergeReportees = (a: Reportee[] = [], b: Reportee[] = []): Reportee[] => {
            const map = new Map<string, Reportee>();
            const put = (r?: Reportee) => {
                if (!r) return;
                const k = keyOf(r);
                if (!map.has(k)) map.set(k, r);
            };
            a.forEach(put); b.forEach(put);
            return Array.from(map.values());
        };
        const map = new Map<string, NotDeletedManager>();
        const putMgr = (m?: NotDeletedManager) => {
            if (!m) return;
            const k = keyOf(m);
            if (map.has(k)) {
                const existing = map.get(k)!;
                existing.reportees = mergeReportees(existing.reportees, m.reportees);
            } else {
                map.set(k, { ...m, reportees: mergeReportees([], m.reportees) });
            }
        };
        prev.forEach(putMgr); next.forEach(putMgr);
        return Array.from(map.values());
    };

    const handleChange = (id: number, value: string) => {
        const sanitized = sanitizeIdentifierInput(value);
        setEntries(prev => prev.map(e => (e.id === id ? { ...e, value: sanitized } : e)));
    };

    const handleAddField = () => {
        setEntries(prev => [
            ...prev,
            { id: prev.length ? prev[prev.length - 1].id + 1 : 1, value: '' },
        ]);
    };

    const handleRemoveField = (id: number) => {
        setEntries(prev => {
            if (prev.length === 1) {
                return [{ ...prev[0], value: '' }];
            }
            return prev.filter(e => e.id !== id);
        });
    };

    const handleSubmit = () => {
        const values = Array.from(
            new Set(
                entries
                    .map(e => e.value)
                    .map(v => v.trim())
                    .filter(Boolean)
                    .filter(isValidIdentifier)
                    .map(normalizeIdentifier)
            )
        );
        if (values.length === 0) {
            toast.error('Enter at least one valid email or mobile number');
            return;
        }
        setPendingIds(values);
        setConfirmOpen(true);
    };

    // Fetch hierarchy for tree tab
    const fetchHierarchy = async () => {
        const raw = (treeIdentifier || '').trim();
        if (!raw) return;
        if (!isValidIdentifier(raw)) {
            toast.error('Enter a valid email or mobile number');
            return;
        }
        try {
            setTreeLoading(true);
            setTreeData(null);
            const tokenHeader = getAuthHeader();
            const isEmail = raw.includes('@');
            const baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
            const paramKey = 'email'; // API expects 'email' for both email and mobile inputs
            const url = `https://${baseUrl}/pms/users/vi_user_hierarchy.json?${paramKey}=${encodeURIComponent(raw)}&employee_type=external`;
            const resp = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenHeader,
                },
            });
            if (!resp.ok) {
                const t = await resp.text();
                let message = 'Failed to fetch hierarchy';
                if (t) {
                    try {
                        const parsed = JSON.parse(t);
                        if (typeof parsed === 'string') message = parsed;
                        else if (parsed?.message) message = parsed.message;
                        else if (parsed?.error) message = parsed.error;
                        else if (Array.isArray(parsed?.errors)) message = parsed.errors.join(', ');
                        else if (parsed?.errors && typeof parsed.errors === 'string') message = parsed.errors;
                        else message = t;
                    } catch {
                        // Not JSON; use raw but strip braces if it's a simple {"error":"..."} pattern
                        message = t;
                    }
                    // Final cleanup: remove surrounding braces/quotes for simple single-field JSON string leftovers
                    message = message.toString().replace(/^\{"[a-zA-Z_]+":\s*"(.+)"\}$/,'$1').trim();
                }
                throw new Error(message);
            }
            const data = await resp.json();
            setTreeData(data as TreeNode);
            // Expand all by default for better overview
            try {
                const all = collectAllIds(data as TreeNode);
                setExpandedNodes(new Set(all));
            } catch { }
            toast.success('Hierarchy fetched');
        } catch (e: any) {
            console.error('Hierarchy fetch error', e);
            toast.error(normalizeErrorMessage(e.message || 'Failed to fetch hierarchy'));
        } finally {
            setTreeLoading(false);
        }
    };

    const handleTreeDelete = async () => {
        const raw = (treeIdentifier || '').trim();
        if (!raw) {
            toast.error('Enter a valid email or mobile number');
            return;
        }
        let emailToDelete = '';
        if (raw.includes('@')) {
            if (!isValidEmail(raw)) {
                toast.error('Enter a valid email or mobile number');
                return;
            }
            emailToDelete = raw.toLowerCase();
        } else {
            const rootEmail = (treeData as any)?.email || '';
            if (!rootEmail || !isValidEmail(rootEmail)) {
                toast.error('Email not found for this user. Please fetch by email or ensure hierarchy contains an email.');
                return;
            }
            emailToDelete = rootEmail.toLowerCase();
        }
        try {
            setTreeDeleteLoading(true);
            const url = getFullUrl('/pms/users/delete_user_with_reportees.json');
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader(),
                },
                body: JSON.stringify({ email: emailToDelete }),
            });
            if (!resp.ok) {
                let message = 'Failed to delete hierarchy';
                try {
                    const data = await resp.json();
                    if (typeof data === 'string') message = data;
                    else if (data?.message) message = data.message;
                } catch {
                    try { message = (await resp.text()) || message; } catch { }
                }
                throw new Error(message);
            }
            const result = await resp.json();
            const deleted = Array.isArray(result?.deleted_users) ? result.deleted_users : [];
            const skipped = Array.isArray(result?.skipped_users) ? result.skipped_users : [];
            const notFound = Array.isArray(result?.not_found_users) ? result.not_found_users : [];
            const notDeletedManagers = Array.isArray(result?.not_deleted_due_to_reportee) ? result.not_deleted_due_to_reportee : [];

            // merge into the summary boxes below for consistency
            setDeletedUsers(prev => mergeUniqueUsers(prev, deleted));
            setSkippedUsers(prev => mergeUniqueUsers(prev, skipped));
            const nf: string[] = (notFound as any[]).map((n) => typeof n === 'string' ? n : (n?.email || ''))
                .filter(Boolean);
            setNotFoundUsers(prev => mergeUniqueStrings(prev, nf));
            setNotDeletedDueToReportee(prev => mergeUniqueManagers(prev, (notDeletedManagers as NotDeletedManager[])));

            const parts: string[] = [];
            if (deleted.length) parts.push(`Deleted: ${deleted.length}`);
            if (skipped.length) parts.push(`Skipped: ${skipped.length}`);
            if (nf.length) parts.push(`User Not Exist: ${nf.length}`);
            const summary = parts.length ? parts.join(' | ') : (result?.message || 'Processed');
            toast.success(summary);

            // Clear tree view after delete
            setTreeData(null);
            setTreeIdentifier('');
            setExpandedNodes(new Set());
        } catch (e: any) {
            console.error('Tree delete error', e);
            toast.error(normalizeErrorMessage(e.message || 'Failed to delete'));
        } finally {
            setTreeDeleteLoading(false);
        }
    };

    // Recursive Tree components
    const TreeNodeItem: React.FC<{ node: TreeNode; depth?: number; expanded: Set<number>; onToggle: (id: number) => void }> = ({ node, depth = 0, expanded, onToggle }) => {
        const hasChildren = Array.isArray(node.children) && node.children.length > 0;
        const isExpanded = expanded.has(node.id);
        return (
            <div className="relative">
                <div className="flex items-start gap-2 py-2" style={{ paddingLeft: depth * 16 }}>
                    <button
                        type="button"
                        onClick={() => hasChildren && onToggle(node.id)}
                        disabled={!hasChildren}
                        className={`mt-1 w-6 h-6 flex items-center justify-center rounded-md border ${hasChildren ? 'bg-white hover:bg-gray-50' : 'bg-gray-100 cursor-default'} text-xs`}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        title={hasChildren ? (isExpanded ? 'Collapse' : 'Expand') : ''}
                    >
                        {hasChildren ? (isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />) : null}
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-white shadow-sm hover:shadow transition">
                            <div className="w-8 h-8 rounded-full bg-[#F6F4EE] flex items-center justify-center text-gray-700 text-sm font-semibold">
                                <UserIcon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <div className={`${hasChildren ? 'font-bold' : 'font-medium'} text-sm text-gray-900 truncate`}>{node.name || '-'}</div>
                                <a href={`mailto:${node.email || ''}`} className="text-xs text-black hover:underline break-all">{node.email || '-'}</a>
                            </div>
                            {hasChildren && (
                                <span className="ml-auto text-[10px] text-gray-700 px-2 py-0.5 rounded-full bg-[#F6F7F7] border" title="Direct reports">
                                    {node.children.length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {hasChildren && isExpanded && (
                    <div className="ml-8 border-l pl-4">
                        {node.children.map((child) => (
                            <TreeNodeItem key={child.id} node={child} depth={depth + 1} expanded={expanded} onToggle={onToggle} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const TreeView: React.FC<{ node: TreeNode; expanded: Set<number>; onToggle: (id: number) => void }> = ({ node, expanded, onToggle }) => {
        const totalDesc = countDescendants(node);
        const handleExpandAll = () => setExpandedNodes(new Set(collectAllIds(node)));
        const handleCollapseAll = () => setExpandedNodes(new Set([node.id]));
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-gray-600">Total nodes: {1 + totalDesc} • Descendants: {totalDesc}</div>
                    <div className="flex gap-2 mt-5">
                        <Button variant="outline" className="h-7 px-2 text-xs" onClick={handleExpandAll}>Expand All</Button>
                        <Button variant="outline" className="h-7 px-2 text-xs" onClick={handleCollapseAll}>Collapse All</Button>
                    </div>
                </div>
                <div className="max-h-[60vh] overflow-auto pr-2">
                    <TreeNodeItem node={node} depth={0} expanded={expanded} onToggle={onToggle} />
                </div>
            </div>
        );
    };

    const handleConfirmDelete = async () => {
        try {
            setSubmitting(true);
            const url = getFullUrl('/pms/users/delete_multiple_vi_external_users.json');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader(),
                },
                body: JSON.stringify({ users_email_mobile: pendingIds }),
            });

            if (!response.ok) {
                let message = 'Failed to delete users';
                try {
                    const data = await response.json();
                    if (typeof data === 'string') message = data;
                    else if (data?.message) message = data.message;
                    else if (Array.isArray(data?.errors)) message = data.errors.join(', ');
                    else if (typeof data?.errors === 'string') message = data.errors;
                } catch {
                    try { message = (await response.text()) || message; } catch { }
                }
                message = message.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                toast.error(normalizeErrorMessage(message));
                return;
            }

            const result = await response.json();
            // Build a concise summary like the service page toasts
            const deleted = Array.isArray(result?.deleted_users) ? result.deleted_users : [];
            const skipped = Array.isArray(result?.skipped_users) ? result.skipped_users : [];
            const notFound = Array.isArray(result?.not_found_users) ? result.not_found_users : [];
            const notDeletedManagers = Array.isArray(result?.not_deleted_due_to_reportee) ? result.not_deleted_due_to_reportee : [];

            const parts: string[] = [];
            if (deleted.length) parts.push(`Deleted: ${deleted.length}`);
            if (skipped.length) parts.push(`Skipped: ${skipped.length}`);
            if (notFound.length) parts.push(`User Not Exist: ${notFound.length}`);
            const summary = parts.length ? parts.join(' | ') : (result?.message || 'Processed');
            toast.success(summary);
            setResultMessage(result?.message || summary);
            setDeletedUsers(prev => mergeUniqueUsers(prev, (deleted as UserRow[])));
            setSkippedUsers(prev => mergeUniqueUsers(prev, (skipped as UserRow[])));
            // not_found may come as strings or objects with email; normalize to strings
            const nf: string[] = (notFound as any[]).map((n) => typeof n === 'string' ? n : (n?.email || ''))
                .filter(Boolean);
            setNotFoundUsers(prev => mergeUniqueStrings(prev, nf));
            setNotDeletedDueToReportee(prev => mergeUniqueManagers(prev, (notDeletedManagers as NotDeletedManager[])));
            // append not deleted due to reportees
            setNotDeletedDueToReportee(prev => mergeUniqueManagers(prev, (notDeletedManagers as NotDeletedManager[])));
            setEntries([{ id: 1, value: '' }]);
            setPendingIds([]);
            setConfirmOpen(false);
        } catch (err: any) {
            toast.error(normalizeErrorMessage(err.message || 'An error occurred while deleting users'));
            // Keep previous results on error
        } finally {
            setSubmitting(false);
        }
    };

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    } as const;

    return (
        <div className="p-4 sm:p-6">
            {/* Top Header (consistent with ServiceDetailsPage) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 hover:text-gray-800 mb-3 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-[#1a1a1a]">MULTIPLE USER DELETION</h1>
                    <p className="text-sm text-gray-600 mt-1">Delete one or many users safely, optionally handling hierarchy.</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full mb-4">
                <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-lg h-auto p-0 text-sm border border-gray-200 shadow-sm">
                    <TabsTrigger value="single" className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] px-3 py-2 border-r border-gray-200 last:border-r-0 text-sm">User Deletion</TabsTrigger>
                    <TabsTrigger value="tree" className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] px-3 py-2 border-r border-gray-200 last:border-r-0 text-sm">Multiple User Deletion</TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="pt-6">
                    {/* IDENTIFIERS Section */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                        <div className="flex items-center p-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                                <Users className="w-6 h-6 text-[#C72030]" />
                            </div>
                            <h2 className="text-lg font-bold">IDENTIFIERS</h2>
                        </div>
                        <div className="p-4 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {entries.map((entry, idx) => {
                                        const errorMsg = getIdentifierError(entry.value);
                                        const isEmailType = (entry.value || '').includes('@');
                                        return (
                                        <TextField
                                            key={entry.id}
                                            label={
                                                <>
                                                    Email or Mobile Number {entries.length > 1 ? `#${idx + 1}` : ''}
                                                </>
                                            }
                                            placeholder="Enter Email or Mobile Number"
                                            value={entry.value}
                                            onChange={(e) => handleChange(entry.id, e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            autoComplete="off"
                                            error={Boolean(errorMsg)}
                                            helperText={errorMsg || ' '}
                                            slotProps={{ inputLabel: { shrink: true } as any }}
                                            InputProps={{
                                                sx: fieldStyles,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleRemoveField(entry.id)}
                                                            aria-label="remove field"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            inputProps={{
                                                autoComplete: 'off',
                                                name: `identifier-${entry.id}`,
                                                autoCorrect: 'off',
                                                autoCapitalize: 'none',
                                                spellCheck: 'false',
                                                inputMode: isEmailType ? 'email' : 'tel',
                                            }}
                                        />
                                    );})}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleAddField}
                                        className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                    >Add User</Button>
                                </div>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-wrap justify-center">
                            {(() => {
                                const hasAny = entries.some(e => e.value.trim() !== '');
                                const hasInvalid = entries.some(e => e.value.trim() !== '' && !isValidIdentifier(e.value));
                                return (
                            <Button
                                onClick={handleSubmit}
                                style={{ backgroundColor: '#C72030' }}
                                className="text-white hover:bg-[#C72030]/90 flex items-center"
                                disabled={!hasAny || hasInvalid || submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </Button>
                                );
                            })()}
                        </div>

                    {confirmOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                                    <div className="p-4 border-b">
                                        <h3 className="text-lg font-semibold">Confirm Deletion</h3>
                                    </div>
                                    <div className="p-4 space-y-3 text-sm max-h-[60vh] overflow-auto">
                                        <p>You are about to delete the following identifiers:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            {pendingIds.map((idVal, i) => (
                                                <li key={`${idVal}-${i}`} className="break-all">{idVal}</li>
                                            ))}
                                        </ul>
                                        <p className="text-red-600">This action cannot be undone.</p>
                                    </div>
                                    <div className="p-4 flex justify-end gap-2 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={() => setConfirmOpen(false)}
                                            disabled={submitting}
                                        >
                                            No
                                        </Button>
                                        <Button
                                            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                                            onClick={handleConfirmDelete}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Deleting...' : 'Yes, Delete'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                    {(resultMessage || deletedUsers.length || skippedUsers.length || notFoundUsers.length || notDeletedDueToReportee.length) ? (
                        <div className="mt-8 space-y-8 max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center p-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                                            <UserMinus className="w-6 h-6 text-[#C72030]" />
                                        </div>
                                        <h3 className="text-base font-bold flex-1">DELETED USERS</h3>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{deletedUsers.length}</span>
                                    </div>
                                    <div className="p-4 pt-0">
                                            {deletedUsers.length ? (
                                                <div className="overflow-x-auto mt-2">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-[#F6F7F7] text-gray-700">
                                                                <th className="text-left p-2 border-b">Name</th>
                                                                <th className="text-left p-2 border-b">Email</th>
                                                                <th className="text-left p-2 border-b">Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {deletedUsers.map((u, i) => (
                                                                <tr key={`del-${u.email || i}`} className="hover:bg-gray-50">
                                                                    <td className="p-2 border-b">{u.name || '-'}</td>
                                                                    <td className="p-2 border-b break-all">{u.email || '-'}</td>
                                                                    <td className="p-2 border-b">{u.mobile_number || '-'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No users deleted.</p>
                                            )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center p-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                                            <AlertCircle className="w-6 h-6 text-[#C72030]" />
                                        </div>
                                        <h3 className="text-base font-bold flex-1">NOT DELETED (INTERNAL)</h3>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{skippedUsers.length}</span>
                                    </div>
                                    <div className="p-4 pt-0">
                                            {skippedUsers.length ? (
                                                <div className="overflow-x-auto mt-2">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-[#F6F7F7] text-gray-700">
                                                                <th className="text-left p-2 border-b">Name</th>
                                                                <th className="text-left p-2 border-b">Email</th>
                                                                <th className="text-left p-2 border-b">Mobile</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {skippedUsers.map((u, i) => (
                                                                <tr key={`skip-${u.email || i}`} className="hover:bg-gray-50">
                                                                    <td className="p-2 border-b">{u.name || '-'}</td>
                                                                    <td className="p-2 border-b break-all">{u.email || '-'}</td>
                                                                    <td className="p-2 border-b">{u.mobile_number || '-'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No users skipped.</p>
                                            )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center p-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                                            <AlertCircle className="w-6 h-6 text-[#C72030]" />
                                        </div>
                                        <h3 className="text-base font-bold flex-1">USER NOT EXIST</h3>
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{notFoundUsers.length}</span>
                                    </div>
                                    <div className="p-4 pt-0">
                                            {notFoundUsers.length ? (
                                                <div className="overflow-x-auto mt-2">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-[#F6F7F7] text-gray-700">
                                                                <th className="text-left p-2 border-b">Email</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {notFoundUsers.map((email, i) => (
                                                                <tr key={`nf-${email || i}`} className="hover:bg-gray-50">
                                                                    <td className="p-2 border-b break-all">{email}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">All users matched.</p>
                                            )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div className="flex items-center p-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                                            <Users className="w-6 h-6 text-[#C72030]" />
                                        </div>
                                        <h3 className="text-base font-bold flex-1">NOT DELETED (REPORTEE)</h3>
                                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{notDeletedDueToReportee.length}</span>
                                    </div>
                                    <div className="p-4 pt-0">
                                            {notDeletedDueToReportee.length ? (
                                                <div className="overflow-x-auto mt-2">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="bg-[#F6F7F7] text-gray-700">
                                                                <th className="text-left p-2 border-b">Name</th>
                                                                <th className="text-left p-2 border-b">Email</th>
                                                                <th className="text-left p-2 border-b">Mobile</th>
                                                                <th className="text-left p-2 border-b">Reportees</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {notDeletedDueToReportee.map((m, i) => (
                                                                <tr key={`ndr-${m.email || i}`} className="align-top hover:bg-gray-50">
                                                                    <td className="p-2 border-b">{m.name || '-'}</td>
                                                                    <td className="p-2 border-b break-all">{m.email || '-'}</td>
                                                                    <td className="p-2 border-b">{m.mobile_number || '-'}</td>
                                                                    <td className="p-2 border-b">
                                                                        {m.reportees && m.reportees.length ? (
                                                                            <ul className="list-disc pl-4 space-y-1">
                                                                                {m.reportees.map((r, ri) => (
                                                                                    <li key={`ndr-r-${(r.email || ri)}`} className="break-all">
                                                                                        <span className="font-medium">{r.name || '-'}</span>
                                                                                        {` `}
                                                                                        <span className="text-gray-600">({r.email || '-'}{r.mobile_number ? `, ${r.mobile_number}` : ''})</span>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        ) : (
                                                                            <span className="text-gray-500">-</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No entries.</p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </TabsContent>

                <TabsContent value="tree" className="pt-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                        <div className="flex items-center p-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                                <Users className="w-6 h-6 text-[#C72030]" />
                            </div>
                            <h2 className="text-lg font-bold">IDENTIFIER</h2>
                        </div>
                        <div className="p-4 pt-0">
                                <div className="grid grid-cols-1 gap-4">
                                    {(() => {
                                        const err = getIdentifierError(treeIdentifier);
                                        const isEmailType = (treeIdentifier || '').includes('@');
                                        return (
                                    <TextField
                                        label="Email or Mobile Number"
                                        placeholder="Enter Email or Mobile Number"
                                        value={treeIdentifier}
                                        onChange={(e) => {
                                            const sanitized = sanitizeIdentifierInput(e.target.value);
                                            setTreeIdentifier(sanitized);
                                            if (!sanitized?.trim()) setTreeData(null);
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        autoComplete="off"
                                        error={Boolean(err)}
                                        helperText={err || ' '}
                                        slotProps={{ inputLabel: { shrink: true } as any }}
                                        InputProps={{ sx: fieldStyles }}
                                        inputProps={{
                                            autoComplete: 'off',
                                            name: 'tree-identifier',
                                            autoCorrect: 'off',
                                            autoCapitalize: 'none',
                                            spellCheck: 'false',
                                            inputMode: isEmailType ? 'email' : 'tel',
                                        }}
                                    />
                                        );
                                    })()}
                                    <div className="flex gap-3 items-start">
                                        <Button
                                            onClick={fetchHierarchy}
                                            disabled={!treeIdentifier.trim() || !!getIdentifierError(treeIdentifier) || treeLoading}
                                            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                                        >
                                            {treeLoading ? 'Fetching...' : 'Submit'}
                                        </Button>
                                        {treeData && !isTreeEmpty(treeData) &&  (
                                            <Button
                                                onClick={() => setShowDeleteChoice(true)}
                                                disabled={treeDeleteLoading}
                                                className="bg-red-600 text-white hover:bg-red-600/90"
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                        </div>
                    </div>

                    {treeData ? (
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center p-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                                    <UserIcon className="w-6 h-6 text-[#C72030]" />
                                </div>
                                <h2 className="text-lg font-bold">HIERARCHY</h2>
                            </div>
                            <div className="p-4 pt-0 text-sm">
                                {isTreeEmpty(treeData) ? (
                                    <div className="text-gray-500 py-6">No data</div>
                                ) : (
                                    <TreeView
                                        node={treeData}
                                        expanded={expandedNodes}
                                        onToggle={(id) => {
                                            setExpandedNodes((prev) => {
                                                const next = new Set(prev);
                                                if (next.has(id)) next.delete(id); else next.add(id);
                                                return next;
                                            });
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">{treeLoading ? 'Loading...' : 'No data yet. Enter an identifier and click Submit.'}</div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Modal 1: Choose reassign or delete hierarchy */}
            {showDeleteChoice && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-options-title"
                    onKeyDown={(e) => { if (e.key === 'Escape') setShowDeleteChoice(false); }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in duration-150">
                        {/* Header */}
                        <div className="p-6 border-b flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 id="delete-options-title" className="text-lg font-semibold text-gray-900 tracking-tight">Delete Options</h3>
                                <p className="text-xs text-gray-500">Choose how you want to proceed with this line manager and their reportees.</p>
                            </div>
                            <button
                                aria-label="Close"
                                className="text-gray-400 hover:text-gray-600 transition"
                                onClick={() => setShowDeleteChoice(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-6">
                            <div className="mb-5 text-sm text-gray-700">
                                Target user: <span className="font-semibold break-all text-gray-900">{treeIdentifier.trim()}</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5">
                                {/* Reassign Option */}
                                <button
                                    onClick={() => {
                                        const email = treeIdentifier.trim().toLowerCase();
                                        setShowDeleteChoice(false);
                                        navigate(`/safety/m-safe/reportees-reassign?current_email=${encodeURIComponent(email)}`);
                                    }}
                                    className="group relative flex flex-col items-start w-full h-full text-left rounded-xl border border-gray-200 hover:border-[#C72030] hover:shadow-md bg-white p-5 transition focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                                >
                                    <div className="flex items-center justify-between w-full mb-3">
                                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#F6F4EE] text-[#C72030] group-hover:scale-105 transition">
                                            <ArrowLeftRight className="w-5 h-5" />
                                        </span>
                                        <span className="text-[11px] uppercase tracking-wide font-medium text-[#C72030]">Preferred</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Reportees Reassign</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed pr-2">Move the existing reportees to another Line Manager first to preserve ownership before removing this user.</p>
                                    <span className="mt-3 inline-flex items-center text-[11px] font-medium text-[#C72030] group-hover:underline">Continue &rarr;</span>
                                </button>

                                {/* Delete Hierarchy Option */}
                                <button
                                    onClick={() => { setShowDeleteChoice(false); setShowDeleteConfirm(true); }}
                                    className="group relative flex flex-col items-start w-full h-full text-left rounded-xl border border-gray-200 hover:border-red-600 hover:shadow-md bg-white p-5 transition focus:outline-none focus:ring-2 focus:ring-red-600"
                                >
                                    <div className="flex items-center justify-between w-full mb-3">
                                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-red-50 text-red-600 group-hover:scale-105 transition">
                                            <Trash2 className="w-5 h-5" />
                                        </span>
                                        <span className="text-[11px] uppercase tracking-wide font-medium text-red-600">Destructive</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Delete Entire Hierarchy</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed pr-2">Remove this user and all associated reportees permanently. This cannot be undone and may affect reporting structure.</p>
                                    <span className="mt-3 inline-flex items-center text-[11px] font-medium text-red-600 group-hover:underline">Proceed to Delete &rarr;</span>
                                </button>
                            </div>
                            <div className="mt-6 rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-3 text-[11px] text-amber-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 mt-0.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>Reassign first to avoid orphaned users and preserve data continuity.</p>
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setShowDeleteChoice(false)} className="text-sm">Close</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal 2: Confirm final delete */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-delete-title"
                    onKeyDown={(e) => { if (e.key === 'Escape' && !treeDeleteLoading) { setShowDeleteConfirm(false); setShowDeleteChoice(true); } }}
                >
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in duration-150">
                        {/* Header */}
                        <div className="p-6 border-b flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 id="confirm-delete-title" className="text-lg font-semibold text-gray-900 tracking-tight">Confirm Hierarchy Deletion</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">This will permanently remove the selected line manager and (optionally) all their reportees from the system.</p>
                            </div>
                            <button
                                aria-label="Close dialog"
                                disabled={treeDeleteLoading}
                                className="text-gray-400 hover:text-gray-600 disabled:opacity-40 transition"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 text-sm">
                            <div className="text-gray-700">
                                You are about to delete hierarchy for:
                                <span className="block mt-1 font-semibold break-all text-gray-900">{treeIdentifier.trim()}</span>
                            </div>
                            {treeData && !isTreeEmpty(treeData) && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                        <div className="text-xs text-gray-500 tracking-wide uppercase">Manager</div>
                                        <div className="text-base font-semibold text-gray-900 mt-0.5">1</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                        <div className="text-xs text-gray-500 tracking-wide uppercase">Reportees</div>
                                        <div className="text-base font-semibold text-gray-900 mt-0.5">{countDescendants(treeData)}</div>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                        <div className="text-xs text-gray-500 tracking-wide uppercase">Total Nodes</div>
                                        <div className="text-base font-semibold text-gray-900 mt-0.5">{1 + countDescendants(treeData)}</div>
                                    </div>
                                </div>
                            )}
                            <div className="rounded-md border border-red-200 bg-red-50 p-4 flex gap-3 text-red-700 text-xs leading-relaxed">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5">
                                    <path d="M12 9v4" />
                                    <path d="M12 17h.01" />
                                    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p>
                                    This action is irreversible. Data and associations for these users may be lost. If you have not reassigned reportees, consider cancelling and using the <span className="font-medium">Reportees Reassign</span> option first.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => { setShowDeleteConfirm(false); setShowDeleteChoice(true); }}
                                disabled={treeDeleteLoading}
                                className="sm:min-w-[110px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={treeDeleteLoading}
                                onClick={async () => {
                                    await handleTreeDelete();
                                    setShowDeleteConfirm(false);
                                }}
                                className="relative bg-red-600 hover:bg-red-600/90 text-white sm:min-w-[170px] font-medium"
                            >
                                {treeDeleteLoading && (
                                    <span className="absolute left-3 inline-flex">
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                    </span>
                                )}
                                <span className={treeDeleteLoading ? 'pl-5' : ''}>{treeDeleteLoading ? 'Deleting…' : 'Yes, Delete Entire Hierarchy'}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultipleUserDeletePage;