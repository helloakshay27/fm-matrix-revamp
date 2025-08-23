import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

type ReassignResult = {
    message?: string;
    total_reassigned?: number;
    from?: string;
    to?: string;
    reassigned_reportees?: Array<{ id: number; name: string; email: string; mobile: string }>;
};

const ReporteesReassignPage = () => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<ReassignResult[]>([]);

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    } as const;

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const current = currentEmail.trim().toLowerCase();
        const updated = updatedEmail.trim().toLowerCase();

        if (!current || !updated) return;
        if (current === updated) {
            toast.info('Current and updated emails cannot be the same.');
            return;
        }

    setIsSubmitting(true);
        try {
            const url = getFullUrl('/pms/users/vi_reassign_reportees.json');
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader(),
                },
                body: JSON.stringify({
                    current_manager_email: current,
                    new_manager_email: updated,
                }),
            });

            if (!res.ok) {
                let message = 'Failed to reassign reportees';
                try {
                    const data = await res.json();
                    if (typeof data === 'string') message = data;
                    else if (data?.message) message = data.message;
                    else if (Array.isArray(data?.errors)) message = data.errors.join(', ');
                    else if (typeof data?.errors === 'string') message = data.errors;
                } catch {
                    try { message = (await res.text()) || message; } catch {}
                }
                message = message.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                toast.error(message);
                return;
            }

            const data = (await res.json()) as ReassignResult;
            toast.success(data?.message || 'Reportees reassigned successfully');
            setResults(prev => [...prev, data || {}]);
            setCurrentEmail('');
            setUpdatedEmail('');
        } catch (e: any) {
            toast.error(e?.message || 'Failed to reassign reportees');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a1a1a]">REPORTEES REASSIGN</h1>
                <p className="text-sm text-gray-600 mt-1">Enter the current and updated reporting emails, then submit.</p>
            </div>

            <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className='bg-[#F6F4EE] mb-4'>
                    <CardTitle className="text-lg text-black flex items-center">
                        <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
                        DETAILS
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            type="email"
                            label="Current Report To"
                            placeholder="Enter current report-to email"
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            autoComplete="off"
                            slotProps={{ inputLabel: { shrink: true } as any }}
                            InputProps={{ sx: fieldStyles }}
                            inputProps={{
                                autoComplete: 'off',
                                name: 'current-report-to',
                                autoCorrect: 'off',
                                autoCapitalize: 'none',
                                spellCheck: 'false',
                            }}
                            disabled={isSubmitting}
                        />

                        <TextField
                            type="email"
                            label="Updated Report To"
                            placeholder="Enter updated report-to email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                            fullWidth
                            variant="outlined"
                            autoComplete="off"
                            slotProps={{ inputLabel: { shrink: true } as any }}
                            InputProps={{ sx: fieldStyles }}
                            inputProps={{
                                autoComplete: 'off',
                                name: 'updated-report-to',
                                autoCorrect: 'off',
                                autoCapitalize: 'none',
                                spellCheck: 'false',
                            }}
                            disabled={isSubmitting}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4 flex-wrap justify-center">
                <Button
                    onClick={handleSubmit}
                    style={{ backgroundColor: '#C72030' }}
                    className="text-white hover:bg-[#C72030]/90 flex items-center"
                    disabled={isSubmitting || !currentEmail.trim() || !updatedEmail.trim()}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit'
                    )}
                </Button>
            </div>

            {results.length > 0 && (
                <div className="mt-6 space-y-4">
                    {results.map((res, idx) => (
                        <Card key={`${res.from || ''}-${res.to || ''}-${idx}`} className="border-[#E5E7EB]">
                            <CardHeader className="bg-[#F6F4EE]">
                                <CardTitle className="text-base font-semibold text-gray-900">
                                    Reassign Summary {results.length > 1 ? `#${idx + 1}` : ''}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
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

                                <div className="mt-4">
                                    <div className="text-sm font-semibold text-gray-900 mb-2">Reassigned reportees</div>
                                    {Array.isArray(res.reassigned_reportees) && res.reassigned_reportees.length > 0 ? (
                                        <div className="overflow-x-auto rounded-md border border-gray-200">
                                            <table className="min-w-full text-sm">
                                                <thead className="bg-gray-100">
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
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReporteesReassignPage;
