import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Edit, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';

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
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030] mb-4"></div>
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
                            className="bg-[#C72030] hover:bg-[#B8252F]"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // return (
    //     <div className="p-6 bg-gray-50 min-h-screen">
    //         {/* Header */}
    //         <div className="flex items-center justify-between mb-6">
    //             <div className="flex items-center gap-4">
    //                 <Button
    //                     onClick={handleBack}
    //                     variant="ghost"
    //                     size="sm"
    //                     className="p-2 hover:bg-gray-100"
    //                 >
    //                     <ArrowLeft className="w-4 h-4" />
    //                 </Button>
    //                 <h1 className="text-xl font-semibold text-gray-900">DETAILS</h1>
    //             </div>
    //             <Button
    //                 onClick={handleEdit}
    //                 className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-sm px-3 py-2 h-8 text-sm flex items-center gap-2"
    //             >
    //                 <Edit className="w-4 h-4" />
    //             </Button>
    //         </div>

    //         {/* Checklist Detail Header */}
    //         <div className="mb-6">
    //             <div className="flex items-center gap-2 mb-4">
    //                 <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
    //                     <span className="text-white text-sm">✓</span>
    //                 </div>
    //                 <span className="text-orange-500 font-medium">Checklist Detail</span>
    //             </div>

    //             {/* Basic Information Cards */}
    //             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    //                 <Card className="border border-gray-200">
    //                     <CardContent className="p-4">
    //                         <div className="text-sm text-gray-500 mb-1">Category</div>
    //                         <div className="text-gray-900 font-medium">{checklistDetails.category}</div>
    //                     </CardContent>
    //                 </Card>

    //                 <Card className="border border-gray-200">
    //                     <CardContent className="p-4">
    //                         <div className="text-sm text-gray-500 mb-1">Title of the Checklist</div>
    //                         <div className="text-gray-900 font-medium">{checklistDetails.title}</div>
    //                     </CardContent>
    //                 </Card>

    //                 <Card className="border border-gray-200">
    //                     <CardContent className="p-4">
    //                         <div className="text-sm text-gray-500 mb-1">No. of Questions</div>
    //                         <div className="text-gray-900 font-medium">{checklistDetails.totalQuestions}</div>
    //                     </CardContent>
    //                 </Card>

    //                 <Card className="border border-gray-200">
    //                     <CardContent className="p-4">
    //                         <div className="text-sm text-gray-500 mb-1">Status</div>
    //                         <div className="flex items-center gap-2">
    //                             <Switch
    //                                 checked={checklistDetails.status}
    //                                 className="data-[state=checked]:bg-orange-500"
    //                                 disabled
    //                             />
    //                         </div>
    //                     </CardContent>
    //                 </Card>
    //             </div>
    //         </div>

    //         {/* Questions Section */}
    //         <div className="space-y-4">
    //             {checklistDetails.questions.map((question, index) => (
    //                 <Card key={question.id} className="border border-gray-200">
    //                     <CardContent className="p-6">
    //                         {/* Question Number */}
    //                         <div className="flex items-start gap-4 mb-4">
    //                             <div className="text-gray-700 font-medium min-w-[20px]">
    //                                 {index + 1}
    //                             </div>
    //                             <div className="flex-1">
    //                                 <Textarea
    //                                     value={question.question}
    //                                     className="w-full border border-gray-200 rounded-md p-3 text-gray-900 resize-none"
    //                                     rows={3}
    //                                     readOnly
    //                                 />
    //                             </div>
    //                         </div>

    //                         {/* Answer Type and Controls */}
    //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //                             {/* Left Column */}
    //                             <div className="space-y-4">
    //                                 <div>
    //                                     <label className="text-sm text-gray-600 mb-2 block">Answer Type :</label>
    //                                     <Input
    //                                         value={question.answerType}
    //                                         className="w-full border border-gray-200 rounded-md p-3 bg-gray-50"
    //                                         readOnly
    //                                     />
    //                                 </div>

    //                                 <div className="flex items-center gap-6">
    //                                     <div className="flex items-center gap-2">
    //                                         <span className="text-sm text-gray-600">Question Mandatory</span>
    //                                         <Switch
    //                                             checked={question.isQuestionMandatory}
    //                                             className="data-[state=checked]:bg-green-500"
    //                                             disabled
    //                                         />
    //                                     </div>

    //                                     <div className="flex items-center gap-2">
    //                                         <span className="text-sm text-gray-600">Image Mandatory</span>
    //                                         <Switch
    //                                             checked={question.isImageMandatory}
    //                                             className="data-[state=checked]:bg-green-500"
    //                                             disabled
    //                                         />
    //                                     </div>
    //                                 </div>
    //                             </div>

    //                             {/* Right Column - Answers */}
    //                             <div>
    //                                 <label className="text-sm text-gray-600 mb-2 block">Answers:</label>
    //                                 {question.answerType === 'Multiple Choice' && question.answers ? (
    //                                     <div className="flex gap-2">
    //                                         {question.answers.map((answer, answerIndex) => (
    //                                             <div
    //                                                 key={answerIndex}
    //                                                 className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700"
    //                                             >
    //                                                 {answer}
    //                                             </div>
    //                                         ))}
    //                                     </div>
    //                                 ) : (
    //                                     <div className="text-sm text-gray-500 italic">
    //                                         {question.answerType === 'Input Box' ? 'Text input field' : 'Description text area'}
    //                                     </div>
    //                                 )}
    //                             </div>
    //                         </div>
    //                     </CardContent>
    //                 </Card>
    //             ))}
    //         </div>
    //     </div>
    // );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleBack}
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-900">DETAILS</h1>
                </div>
                <Button
                    onClick={handleEdit}
                    className="border border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-3 py-2 h-8 text-sm flex items-center gap-2 rounded-md transition-all"
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </div>

            {/* Main Card */}
            <Card className="shadow-sm border border-gray-200 rounded-md bg-white">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 rounded-full bg-[#C72030] flex items-center justify-center text-white">
                            ✓
                        </div>
                        <h2 className="text-lg font-semibold text-[#C72030]">Checklist Detail</h2>
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Category</div>
                            <div className="font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-md p-2">
                                {checklistDetails.category}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Title of the Checklist</div>
                            <div className="font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-md p-2">
                                {checklistDetails.title}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">No. of Questions</div>
                            <div className="font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-md p-2">
                                {checklistDetails.totalQuestions}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Status</div>
                            <div className="flex items-center h-[38px]">
                                <Switch
                                    checked={checklistDetails.status}
                                    className="data-[state=checked]:bg-[#C72030]"
                                    disabled={isUpdating}
                                    onCheckedChange={async (checked) => {
                                        try {
                                            setIsUpdating(true);
                                            let baseUrl = localStorage.getItem('baseUrl') || '';
                                            const token = localStorage.getItem('token') || '';

                                            if (!baseUrl || !token) {
                                                throw new Error('Authentication credentials not found');
                                            }

                                            // Ensure baseUrl has the correct format
                                            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                                                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                                            }

                                            const url = `${baseUrl}/pms/admin/snag_checklists/${id}.json`;
                                            console.log('Updating checklist status:', url);

                                            const response = await fetch(url, {
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

                    <hr className="border-gray-200 mb-6" />

                    {/* Questions Section */}
                    {checklistDetails.questions.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-md p-5 mb-6 bg-[#FAFAFA]">
                            {/* Question Number */}
                            <div className="mb-4">
                                <div className="font-medium text-gray-800 mb-2">{index + 1}</div>
                                <Textarea
                                    value={question.question}
                                    readOnly
                                    rows={2}
                                    className="w-full border border-gray-200 rounded-md p-3 text-gray-800 bg-white resize-none"
                                />
                            </div>

                            {/* Answer Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Section */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 block mb-1">Answer Type :</label>
                                        <Input
                                            value={question.answerType}
                                            readOnly
                                            className="w-full border border-gray-200 bg-white text-gray-800"
                                        />
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Question Mandatory</span>
                                            <Switch
                                                checked={question.isQuestionMandatory}
                                                className="data-[state=checked]:bg-green-500"
                                                disabled
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600">Image Mandatory</span>
                                            <Switch
                                                checked={question.isImageMandatory}
                                                className="data-[state=checked]:bg-green-500"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div>
                                    <label className="text-sm text-gray-600 block mb-2">Answers:</label>
                                    {question.answerType === 'Multiple Choice' && question.answers ? (
                                        <div className="flex flex-wrap gap-2">
                                            {question.answers.map((ans, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700"
                                                >
                                                    {ans}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">
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
