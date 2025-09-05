import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, User as UserIcon, ChevronRight, ChevronDown } from 'lucide-react';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

type Entry = {
    id: number;
    value: string;
};

export const MultipleUserDeletePage = () => {
    const [entries, setEntries] = useState<Entry[]>([{ id: 1, value: '' }]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingIds, setPendingIds] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    type UserRow = { name?: string; email?: string; mobile_number?: string };
    const [deletedUsers, setDeletedUsers] = useState<UserRow[]>([]);
    const [skippedUsers, setSkippedUsers] = useState<UserRow[]>([]);
    const [notFoundUsers, setNotFoundUsers] = useState<string[]>([]);

    // Tabs and hierarchy (tree) state
    const [activeTab, setActiveTab] = useState<'single' | 'tree'>('single');
    type TreeNode = { id: number; name: string; email: string; children: TreeNode[] };
    const [treeIdentifier, setTreeIdentifier] = useState<string>('');
    const [treeLoading, setTreeLoading] = useState(false);
    const [treeData, setTreeData] = useState<TreeNode | null>(null);
    const [treeDeleteLoading, setTreeDeleteLoading] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

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

    const normalizeIdentifier = (val: string): string => {
        const v = val.trim();
        if (v.includes('@')) return v.toLowerCase();
        // phone-like: keep + and digits
        const hasPlus = v.startsWith('+');
        const digits = v.replace(/[^0-9]/g, '');
        return hasPlus ? `+${digits}` : digits;
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

    const handleChange = (id: number, value: string) => {
        setEntries(prev => prev.map(e => (e.id === id ? { ...e, value } : e)));
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
                    .map(normalizeIdentifier)
            )
        );
        if (values.length === 0) return;
        setPendingIds(values);
        setConfirmOpen(true);
    };

    // Fetch hierarchy for tree tab
    const fetchHierarchy = async () => {
        const raw = (treeIdentifier || '').trim();
        if (!raw) return;
        try {
            setTreeLoading(true);
            setTreeData(null);
            const tokenHeader = getAuthHeader();
            const isEmail = raw.includes('@');
            const baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
            const paramKey = isEmail ? 'email' : 'mobile_number';
            const url = `https://${baseUrl}/pms/users/external_user_hierarchy.json?${paramKey}=${encodeURIComponent(raw)}`;
            const resp = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenHeader,
                },
            });
            if (!resp.ok) {
                const t = await resp.text();
                throw new Error(t || 'Failed to fetch hierarchy');
            }
            const data = await resp.json();
            setTreeData(data as TreeNode);
            // Expand all by default for better overview
            try {
                const all = collectAllIds(data as TreeNode);
                setExpandedNodes(new Set(all));
            } catch {}
            toast.success('Hierarchy fetched');
        } catch (e: any) {
            console.error('Hierarchy fetch error', e);
            toast.error(e.message || 'Failed to fetch hierarchy');
        } finally {
            setTreeLoading(false);
        }
    };

    const handleTreeDelete = async () => {
        const raw = (treeIdentifier || '').trim();
        if (!raw || !raw.includes('@')) {
            toast.error('Enter a valid email to delete with reportees');
            return;
        }
        try {
            setTreeDeleteLoading(true);
            const url = getFullUrl('/pms/users/delete_with_reportees');
            const resp = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader(),
                },
                body: JSON.stringify({ email: raw.toLowerCase() }),
            });
            if (!resp.ok) {
                let message = 'Failed to delete hierarchy';
                try {
                    const data = await resp.json();
                    if (typeof data === 'string') message = data;
                    else if (data?.message) message = data.message;
                } catch {
                    try { message = (await resp.text()) || message; } catch {}
                }
                throw new Error(message);
            }
            const result = await resp.json();
            const deleted = Array.isArray(result?.deleted_users) ? result.deleted_users : [];
            const skipped = Array.isArray(result?.skipped_users) ? result.skipped_users : [];
            const notFound = Array.isArray(result?.not_found_users) ? result.not_found_users : [];

            // merge into the summary boxes below for consistency
            setDeletedUsers(prev => mergeUniqueUsers(prev, deleted));
            setSkippedUsers(prev => mergeUniqueUsers(prev, skipped));
            const nf: string[] = (notFound as any[]).map((n) => typeof n === 'string' ? n : (n?.email || ''))
                .filter(Boolean);
            setNotFoundUsers(prev => mergeUniqueStrings(prev, nf));

            const parts: string[] = [];
            if (deleted.length) parts.push(`Deleted: ${deleted.length}`);
            if (skipped.length) parts.push(`Skipped: ${skipped.length}`);
            if (nf.length) parts.push(`Not found: ${nf.length}`);
            const summary = parts.length ? parts.join(' | ') : (result?.message || 'Processed');
            toast.success(summary);

            // Clear tree view after delete
            setTreeData(null);
            setTreeIdentifier('');
            setExpandedNodes(new Set());
        } catch (e: any) {
            console.error('Tree delete error', e);
            toast.error(e.message || 'Failed to delete');
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
                toast.error(message);
                return;
            }

            const result = await response.json();
            // Build a concise summary like the service page toasts
            const deleted = Array.isArray(result?.deleted_users) ? result.deleted_users : [];
            const skipped = Array.isArray(result?.skipped_users) ? result.skipped_users : [];
            const notFound = Array.isArray(result?.not_found_users) ? result.not_found_users : [];

            const parts: string[] = [];
            if (deleted.length) parts.push(`Deleted: ${deleted.length}`);
            if (skipped.length) parts.push(`Skipped: ${skipped.length}`);
            if (notFound.length) parts.push(`Not found: ${notFound.length}`);
            const summary = parts.length ? parts.join(' | ') : (result?.message || 'Processed');
            toast.success(summary);
            setResultMessage(result?.message || summary);
            setDeletedUsers(prev => mergeUniqueUsers(prev, (deleted as UserRow[])));
            setSkippedUsers(prev => mergeUniqueUsers(prev, (skipped as UserRow[])));
            // not_found may come as strings or objects with email; normalize to strings
            const nf: string[] = (notFound as any[]).map((n) => typeof n === 'string' ? n : (n?.email || ''))
                .filter(Boolean);
            setNotFoundUsers(prev => mergeUniqueStrings(prev, nf));
            setEntries([{ id: 1, value: '' }]);
            setPendingIds([]);
            setConfirmOpen(false);
        } catch (err: any) {
            toast.error(err.message || 'An error occurred while deleting users');
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
        <div className="p-6">
            <div className="mb-4">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                    <TabsList className="grid grid-cols-2 bg-white border border-gray-200">
                        <TabsTrigger value="single" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] border-none font-semibold">Single User</TabsTrigger>
                        <TabsTrigger value="tree" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] border-none font-semibold">Hierarchy</TabsTrigger>
                    </TabsList>

                    <TabsContent value="single">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[#1a1a1a]">MULTIPLE USER DELETION</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Enter one or more Email addresses or Mobile numbers. Click "Add User" to add more.
                            </p>
                        </div>
                        <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                            <CardHeader className='bg-[#F6F4EE] mb-4'>
                                <CardTitle className="text-lg text-black flex items-center">
                                    <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
                                    IDENTIFIERS
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {entries.map((entry, idx) => (
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
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleAddField}
                                        className="text-[#C72030] border-[#C72030] bg-[#f6f4ee] hover:bg-[#f6f4ee]/80"
                                    >
                                        Add User
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4 flex-wrap justify-center">
                            <Button
                                onClick={handleSubmit}
                                style={{ backgroundColor: '#C72030' }}
                                className="text-white hover:bg-[#C72030]/90 flex items-center"
                                disabled={!entries.some(e => e.value.trim() !== '') || submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </Button>
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

                        {(resultMessage || deletedUsers.length || skippedUsers.length || notFoundUsers.length) ? (
                            <div className="mt-6 space-y-4 max-w-6xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="border-[#D9D9D9] bg-white">
                                        <CardHeader className="bg-[#F6F4EE]">
                                            <CardTitle className="text-base flex items-center justify-between">
                                                <span>Deleted Users</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{deletedUsers.length}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
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
                                        </CardContent>
                                    </Card>

                                    <Card className="border-[#D9D9D9] bg-white">
                                        <CardHeader className="bg-[#F6F4EE]">
                                            <CardTitle className="text-base flex items-center justify-between">
                                                <span>Not deleted user (Due to Internal)</span>
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{skippedUsers.length}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
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
                                        </CardContent>
                                    </Card>

                                    <Card className="border-[#D9D9D9] bg-white">
                                        <CardHeader className="bg-[#F6F4EE]">
                                            <CardTitle className="text-base flex items-center justify-between">
                                                <span>Not Found</span>
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{notFoundUsers.length}</span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
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
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : null}
                    </TabsContent>

                    <TabsContent value="tree">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[#1a1a1a]">USER HIERARCHY</h1>
                            <p className="text-sm text-gray-600 mt-1">Fetch and display external user hierarchy by Email or Mobile.</p>
                        </div>
                        <Card className="mb-4 border-[#D9D9D9] bg-[#F6F7F7]">
                            <CardHeader className='bg-[#F6F4EE] mb-5'>
                                <CardTitle className="text-lg text-black flex items-center">
                                    <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
                                    Identifier
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    <TextField
                                        label="Email or Mobile Number"
                                        placeholder="Enter Email or Mobile Number"
                                        value={treeIdentifier}
                                        onChange={(e) => {
                                            setTreeIdentifier(e.target.value);
                                            if (!e.target.value?.trim()) setTreeData(null);
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        autoComplete="off"
                                        slotProps={{ inputLabel: { shrink: true } as any }}
                                        InputProps={{ sx: fieldStyles }}
                                        inputProps={{
                                            autoComplete: 'off',
                                            name: 'tree-identifier',
                                            autoCorrect: 'off',
                                            autoCapitalize: 'none',
                                            spellCheck: 'false',
                                        }}
                                    />
                                    <div className="flex gap-3 items-center">
                                        <Button
                                            onClick={fetchHierarchy}
                                            disabled={!treeIdentifier.trim() || treeLoading}
                                            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                                        >
                                            {treeLoading ? 'Fetching...' : 'Submit'}
                                        </Button>
                                        {treeIdentifier.trim().includes('@') && treeData && !isTreeEmpty(treeData) && (
                                            <Button
                                                onClick={handleTreeDelete}
                                                disabled={treeDeleteLoading}
                                                className="bg-red-600 text-white hover:bg-red-600/90"
                                            >
                                                {treeDeleteLoading ? 'Deleting...' : 'Delete'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {treeData ? (
                            <Card className="border-[#D9D9D9] bg-white">
                                <CardHeader className="bg-[#F6F4EE]">
                                    <CardTitle className="text-base">Hierarchy</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isTreeEmpty(treeData) ? (
                                        <div className="text-sm text-gray-500 mt-5">No data</div>
                                    ) : (
                                        <div className="text-sm">
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
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="text-sm text-gray-500">{treeLoading ? 'Loading...' : 'No data yet. Enter either an email or mobile number and click Submit.'}</div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default MultipleUserDeletePage;