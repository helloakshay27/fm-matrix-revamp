import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ReporteesReassignPage = () => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fieldStyles = {
        height: { xs: 28, sm: 36, md: 45 },
        '& .MuiInputBase-input, & .MuiSelect-select': {
            padding: { xs: '8px', sm: '10px', md: '12px' },
        },
    } as const;

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            // TODO: integrate API call for reassigning reportees
            console.log('Reassign reportees from', currentEmail, 'to', updatedEmail);
        toast.success('Reportees reassignment submitted');
            // Reset fields after successful submit
            setCurrentEmail('');
            setUpdatedEmail('');
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
                            slotProps={{ inputLabel: { shrink: true } as any }}
                            InputProps={{ sx: fieldStyles }}
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
                            slotProps={{ inputLabel: { shrink: true } as any }}
                            InputProps={{ sx: fieldStyles }}
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
        </div>
    );
};

export default ReporteesReassignPage;
