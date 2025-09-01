import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a1a1a]">MULTIPLE USER DELETION</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Enter one or more Email addresses or Mobile numbers. Click "Add Field" to add more.
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

            {/* Results Section */}
            {(resultMessage || deletedUsers.length || skippedUsers.length || notFoundUsers.length) ? (
                <div className="mt-6 space-y-4 max-w-6xl mx-auto">
                    {/* {resultMessage && (
                        <div className="p-3 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            {resultMessage}
                        </div>
                    )} */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Deleted Users */}
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

                        {/* Skipped Users */}
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

                        {/* Not Found Users */}
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
        </div>
    );
};

export default MultipleUserDeletePage;