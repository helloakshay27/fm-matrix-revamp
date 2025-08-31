import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Edit, ArrowLeft } from 'lucide-react';

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

    const [checklistDetails, setChecklistDetails] = useState<ChecklistDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock data for now - replace with actual API call
    useEffect(() => {
        const fetchChecklistDetails = async () => {
            try {
                setLoading(true);

                // TODO: Replace with actual API call
                // const response = await fetch(`/api/permit-checklist/${id}`, {
                //   method: 'GET',
                //   headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
                //     'Content-Type': 'application/json'
                //   }
                // });
                // const data = await response.json();

                // Mock data for UI demonstration
                const mockData: ChecklistDetails = {
                    id: id || '1',
                    category: 'Height Work',
                    title: 'sasd',
                    totalQuestions: 1,
                    status: true,
                    questions: [
                        {
                            id: 1,
                            question: 'new question',
                            answerType: 'Multiple Choice',
                            answers: ['yes', 'now'],
                            isQuestionMandatory: true,
                            isImageMandatory: false
                        }
                    ]
                };

                // Simulate API delay
                setTimeout(() => {
                    setChecklistDetails(mockData);
                    setLoading(false);
                }, 1000);

            } catch (err) {
                setError('Failed to fetch checklist details');
                setLoading(false);
            }
        };

        if (id) {
            fetchChecklistDetails();
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
                <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">Loading checklist details...</div>
                </div>
            </div>
        );
    }

    if (error || !checklistDetails) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-center items-center py-8">
                    <div className="text-red-500">{error || 'Checklist not found'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
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
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 rounded-sm px-3 py-2 h-8 text-sm flex items-center gap-2"
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </div>

            {/* Checklist Detail Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-orange-500 font-medium">Checklist Detail</span>
                </div>

                {/* Basic Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border border-gray-200">
                        <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">Category</div>
                            <div className="text-gray-900 font-medium">{checklistDetails.category}</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">Title of the Checklist</div>
                            <div className="text-gray-900 font-medium">{checklistDetails.title}</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">No. of Questions</div>
                            <div className="text-gray-900 font-medium">{checklistDetails.totalQuestions}</div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                        <CardContent className="p-4">
                            <div className="text-sm text-gray-500 mb-1">Status</div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={checklistDetails.status}
                                    className="data-[state=checked]:bg-orange-500"
                                    disabled
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
                {checklistDetails.questions.map((question, index) => (
                    <Card key={question.id} className="border border-gray-200">
                        <CardContent className="p-6">
                            {/* Question Number */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="text-gray-700 font-medium min-w-[20px]">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <Textarea
                                        value={question.question}
                                        className="w-full border border-gray-200 rounded-md p-3 text-gray-900 resize-none"
                                        rows={3}
                                        readOnly
                                    />
                                </div>
                            </div>

                            {/* Answer Type and Controls */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">Answer Type :</label>
                                        <Input
                                            value={question.answerType}
                                            className="w-full border border-gray-200 rounded-md p-3 bg-gray-50"
                                            readOnly
                                        />
                                    </div>

                                    <div className="flex items-center gap-6">
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

                                {/* Right Column - Answers */}
                                <div>
                                    <label className="text-sm text-gray-600 mb-2 block">Answers:</label>
                                    {question.answerType === 'Multiple Choice' && question.answers ? (
                                        <div className="flex gap-2">
                                            {question.answers.map((answer, answerIndex) => (
                                                <div
                                                    key={answerIndex}
                                                    className="px-3 py-1 bg-gray-100 border border-gray-200 rounded text-sm text-gray-700"
                                                >
                                                    {answer}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 italic">
                                            {question.answerType === 'Input Box' ? 'Text input field' : 'Description text area'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PermitChecklistDetails;
