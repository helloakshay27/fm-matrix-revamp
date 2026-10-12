import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { FormControl, Select as MuiSelect, MenuItem } from '@mui/material';
import { Edit, ArrowLeft, ClipboardCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

const fieldStyles = {
    height: 45,
    minHeight: '44px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    '& .MuiInputBase-input, & .MuiSelect-select': {
        padding: '12px 14px',
        minHeight: '44px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#fff',
        borderRadius: '12px',
        minHeight: '44px',
        '& fieldset': { borderColor: '#E5E5E0', borderWidth: '1px' },
        '&:hover fieldset': { borderColor: '#DA7756' },
        '&.Mui-focused fieldset': { borderColor: '#DA7756', borderWidth: '1px' },
        '&.Mui-disabled': {
            backgroundColor: '#fff',
            '& fieldset': { borderColor: '#E5E5E0' },
        },
    },
    '& .MuiSelect-select.Mui-disabled': {
        color: '#1a1a1a',
        WebkitTextFillColor: '#1a1a1a',
        opacity: 1,
    },
    '& .MuiSelect-icon.Mui-disabled': {
        color: 'rgba(0, 0, 0, 0.54)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#DA7756',
    },
    '& .MuiInputLabel-root.Mui-disabled': {
        color: 'rgba(0, 0, 0, 0.6)',
    },
};

interface ChecklistQuestion {
    id: number;
    question: string;
    answerType: 'Multiple Choice' | 'Input Box' | 'Description Box';
    answers?: string[];
    isQuestionMandatory: boolean;
    isImageMandatory: boolean;
}

interface ChecklistDetails {
    id: string;
    category: string;
    title: string;
    totalQuestions: number;
    status: boolean;
    questions: ChecklistQuestion[];
}

export const PermitChecklistDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { shouldShow } = useDynamicPermissions();

    const [checklistDetails, setChecklistDetails] = useState<ChecklistDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Mock data for now - replace with actual API call
    useEffect(() => {
        const fetchChecklistDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                let baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';

                if (!baseUrl || !token) {
                    throw new Error('Authentication credentials not found. Please login again.');
                }

                // Ensure baseUrl has the correct format
                if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                }

                const url = `${baseUrl}/pms/admin/snag_checklists/${id}/permit_checklist_show.json`;
                console.log('Fetching checklist details from:', url);
                console.log('Checklist ID:', id);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch checklist details: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log('API Response:', data);

                // Transform API response to match our interface
                const transformedData: ChecklistDetails = {
                    id: data.snag_checklist.id?.toString() || '',
                    category: data.snag_checklist.category || '',
                    title: data.snag_checklist.title || '',
                    totalQuestions: data.snag_checklist.number_of_questions || 0,
                    status: data.snag_checklist.active === 1,
                    questions: data.snag_checklist.questions?.map((q: any, index: number) => ({
                        id: index + 1, // Using index as id since API doesn't provide question id
                        question: q.description || '',
                        answerType: q.answer_type || 'Input Box',
                        answers: q.answers || [],
                        isQuestionMandatory: q.question_mandatory || false,
                        isImageMandatory: q.image_mandatory || false
                    })) || []
                };

                setChecklistDetails(transformedData);
                setLoading(false);

            } catch (err: any) {
                const errorMsg = err.message || 'Failed to fetch checklist details';
                console.error('Error fetching checklist details:', err);
                setError(errorMsg);
                sonnerToast.error(errorMsg);
                setLoading(false);
            }
        };

        if (id) {
            console.log('Component mounted with ID:', id);
            fetchChecklistDetails();
        } else {
            console.error('No ID provided in URL params');
            const errorMsg = 'No checklist ID provided';
            setError(errorMsg);
            sonnerToast.error(errorMsg);
            setLoading(false);
        }
    }, [id]);

    const handleBack = () => {
        navigate('/safety/permit/checklist');
    };

    const handleEdit = () => {
        navigate(`/safety/permit/checklist/edit/${id}`);
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#DA7756] mb-4"></div>
                    <p className="text-gray-600">Loading checklist details...</p>
                    <p className="text-sm text-gray-500 mt-2">ID: {id}</p>
                </div>
            </div>
        );
    }

    if (error || !checklistDetails) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">{error || 'Checklist not found'}</p>
                    <p className="text-sm text-gray-500 mb-4">Checklist ID: {id}</p>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => navigate('/safety/permit/checklist')}
                            variant="outline"
                        >
                            Back to List
                        </Button>
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-[#DA7756] hover:bg-[#c86b4d]"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#F6F4EE] min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleBack}
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-[#F6F4EE]"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#2C2C2C]" />
                    </Button>
                    <h1 className="text-xl font-semibold text-[#2C2C2C]">DETAILS</h1>
                </div>
                {shouldShow("Permit Checklist", "update") && (
                    <Button
                        onClick={handleEdit}
                        className="!bg-white border border-[#DA7756] text-[#DA7756] px-3 py-2 h-8 text-sm flex items-center gap-2 rounded-md !shadow-none hover:!bg-white [&_svg]:!text-[#DA7756]"
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <Card className="rounded-[16px] border border-[#E5E5E0] bg-white shadow-none">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#F6F4EE] border border-[#E5E5E0] flex items-center justify-center">
                            <ClipboardCheck className="h-5 w-5 text-[#DA7756]" />
                        </div>
                        <h2 className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#DA7756]">Checklist Detail</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Category</div>
                            <div className="min-h-[44px] bg-white border border-[#E5E5E0] rounded-[12px] px-3 py-2.5 font-medium text-gray-900 flex items-center">
                                {checklistDetails.category}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Title of the Checklist</div>
                            <div className="min-h-[44px] bg-white border border-[#E5E5E0] rounded-[12px] px-3 py-2.5 font-medium text-gray-900 flex items-center">
                                {checklistDetails.title}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">No. of Questions</div>
                            <div className="min-h-[44px] bg-white border border-[#E5E5E0] rounded-[12px] px-3 py-2.5 font-medium text-gray-900 flex items-center">
                                {checklistDetails.totalQuestions}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Status</div>
                            <div className="flex items-center min-h-[44px] bg-white border border-[#E5E5E0] rounded-[12px] px-3">
                                <Switch
                                    checked={checklistDetails.status}
                                    className="data-[state=checked]:bg-[#DA7756]"
                                    disabled={isUpdating}
                                    onCheckedChange={async (checked) => {
                                        try {
                                            setIsUpdating(true);
                                            let baseUrl = localStorage.getItem('baseUrl') || '';
                                            const token = localStorage.getItem('token') || '';

                                            if (!baseUrl || !token) {
                                                throw new Error('Authentication credentials not found');
                                            }

                                            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                                                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                                            }

                                            const response = await fetch(`${baseUrl}/pms/admin/snag_checklists/${id}.json`, {
                                                method: 'PUT',
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({
                                                    snag_checklist: {
                                                        active: checked
                                                    }
                                                })
                                            });

                                            if (!response.ok) {
                                                throw new Error(`Failed to update status: ${response.status}`);
                                            }

                                            setChecklistDetails(prev =>
                                                prev ? { ...prev, status: checked } : null
                                            );

                                            toast({
                                                title: "Success",
                                                description: "Status updated successfully",
                                                variant: "default",
                                            });
                                            sonnerToast.success('Status updated successfully');
                                        } catch (err: any) {
                                            console.error('Error updating status:', err);
                                            const errorMsg = err.message || 'Failed to update status';
                                            toast({
                                                title: "Error",
                                                description: errorMsg,
                                                variant: "destructive",
                                            });
                                            sonnerToast.error(errorMsg);
                                            setChecklistDetails(prev =>
                                                prev ? { ...prev, status: !checked } : null
                                            );
                                        } finally {
                                            setIsUpdating(false);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-[#E5E5E0] mb-6" />

                    {checklistDetails.questions.map((question, index) => (
                        <div key={question.id} className="border border-[#E5E5E0] rounded-[12px] p-5 mb-6 bg-white">
                            <div className="mb-4">
                                <div className="font-medium text-gray-800 mb-2">{index + 1}</div>
                                <Textarea
                                    value={question.question}
                                    readOnly
                                    rows={2}
                                    className="w-full border border-[#E5E5E0] rounded-[12px] min-h-[44px] bg-white text-gray-800 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-[12px] font-medium text-[#5C5C5C] mb-2 uppercase tracking-[0.06em]">Answer Type</div>
                                        <FormControl fullWidth variant="outlined">
                                            <MuiSelect
                                                value={question.answerType}
                                                disabled
                                                sx={fieldStyles}
                                            >
                                                <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                                                <MenuItem value="Input Box">Input Box</MenuItem>
                                                <MenuItem value="Description Box">Description Box</MenuItem>
                                            </MuiSelect>
                                        </FormControl>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Question Mandatory</span>
                                            <Switch
                                                checked={question.isQuestionMandatory}
                                                className="data-[state=checked]:bg-[#DA7756]"
                                                disabled
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Image Mandatory</span>
                                            <Switch
                                                checked={question.isImageMandatory}
                                                className="data-[state=checked]:bg-[#DA7756]"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-gray-500 mb-2">Answers</div>
                                    {question.answerType === 'Multiple Choice' && question.answers ? (
                                        <div className="flex flex-wrap gap-2">
                                            {question.answers.map((ans, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 bg-white border border-[#E5E5E0] rounded-[12px] text-sm font-medium text-gray-800 min-h-[44px] flex items-center"
                                                >
                                                    {ans}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic bg-white border border-[#E5E5E0] rounded-[12px] p-2 min-h-[44px] flex items-center">
                                            {question.answerType === 'Input Box'
                                                ? 'Text input field'
                                                : 'Description text area'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );

};

export default PermitChecklistDetails;
