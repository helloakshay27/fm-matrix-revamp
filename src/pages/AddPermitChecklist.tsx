import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';

interface AnswerOption {
    text: string;
    type: 'P' | 'N'; // P for positive, N for negative
}

interface Question {
    id: string;
    question: string;
    answerType: 'Multiple Choice' | 'Input Box' | 'Description Box';
    mandatory: boolean;
    options: AnswerOption[];
}

export const AddPermitChecklist = () => {
    const { setCurrentSection } = useLayout();

    React.useEffect(() => {
        setCurrentSection('Safety');
    }, [setCurrentSection]);

    const [formData, setFormData] = useState({
        category: '',
        title: ''
    });

    const [questions, setQuestions] = useState<Question[]>([
        {
            id: '1',
            question: '',
            answerType: 'Multiple Choice',
            mandatory: false,
            options: [
                { text: '', type: 'P' },
                { text: '', type: 'P' }
            ]
        },
        {
            id: '2',
            question: '',
            answerType: 'Multiple Choice',
            mandatory: false,
            options: [
                { text: '', type: 'P' },
                { text: '', type: 'P' }
            ]
        }
    ]);

    const [questionCount, setQuestionCount] = useState(2);

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            question: '',
            answerType: 'Multiple Choice',
            mandatory: false,
            options: [
                { text: '', type: 'P' },
                { text: '', type: 'P' }
            ]
        };
        setQuestions([...questions, newQuestion]);
        setQuestionCount(prev => prev + 1);
    };

    const removeQuestion = (questionId: string) => {
        if (questions.length > 1) {
            setQuestions(questions.filter(q => q.id !== questionId));
            setQuestionCount(prev => prev - 1);
        }
    };

    const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
        setQuestions(questions.map(q =>
            q.id === questionId
                ? {
                    ...q,
                    [field]: value,
                    // Reset options when answer type changes
                    ...(field === 'answerType' && value !== 'Multiple Choice' ? { options: [] } : {})
                }
                : q
        ));
    };

    const addOption = (questionId: string) => {
        setQuestions(questions.map(q =>
            q.id === questionId
                ? { ...q, options: [...q.options, { text: '', type: 'P' }] }
                : q
        ));
    };

    const removeOption = (questionId: string, optionIndex: number) => {
        setQuestions(questions.map(q =>
            q.id === questionId
                ? { ...q, options: q.options.filter((_, index) => index !== optionIndex) }
                : q
        ));
    };

    const updateOption = (questionId: string, optionIndex: number, field: keyof AnswerOption, value: string) => {
        setQuestions(questions.map(q =>
            q.id === questionId
                ? {
                    ...q,
                    options: q.options.map((option, index) =>
                        index === optionIndex ? { ...option, [field]: value } : option
                    )
                }
                : q
        ));
    };

    const handleSubmit = () => {
        if (!formData.category || !formData.title) {
            toast.error('Please fill in all required fields');
            return;
        }

        const hasEmptyQuestions = questions.some(q => !q.question.trim());
        if (hasEmptyQuestions) {
            toast.error('Please provide questions for all tasks');
            return;
        }

        // Add your submit logic here
        console.log('Form Data:', formData);
        console.log('Questions:', questions);
        toast.success('Permit checklist created successfully!');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="bg-[#F6F4EE] text-[#C72030] px-4 py-2 rounded mb-4 inline-flex items-center">
                    <span className="mr-2 text-lg">✓</span>
                    Add checklist
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Category */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Category<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="safety">Safety</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                            <SelectItem value="environmental">Environmental</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Title<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="Enter the title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
            </div>

            {/* Question Count Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">Add No. of Question</Label>
                        <span className="text-sm text-gray-600">No. of Questions</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <Select value={questionCount.toString().padStart(2, '0')} onValueChange={(value) => {
                        const newCount = parseInt(value);
                        setQuestionCount(newCount);

                        // Adjust questions array based on count
                        if (newCount > questions.length) {
                            // Add new questions
                            const questionsToAdd = newCount - questions.length;
                            for (let i = 0; i < questionsToAdd; i++) {
                                addQuestion();
                            }
                        } else if (newCount < questions.length) {
                            // Remove questions from the end
                            setQuestions(questions.slice(0, newCount));
                        }
                    }}>
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 20 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                    {(i + 1).toString().padStart(2, '0')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        type="button"
                        onClick={addQuestion}
                        className="bg-teal-600 hover:bg-teal-700 text-white h-8 w-8 rounded-full p-0"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>

                    <span className="text-sm text-gray-600">{questions.length}</span>
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
                {questions.map((question, index) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6 relative">
                        {/* Remove Question Button */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1"
                        >
                            <X className="w-4 h-4" />
                        </Button>

                        <div className="mb-4">
                            <h3 className="text-lg font-medium mb-4">New Question</h3>

                            {/* Question Input */}
                            <div className="mb-4">
                                <Textarea
                                    placeholder="Enter your Question"
                                    value={question.question}
                                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                    className="min-h-[80px]"
                                />
                            </div>

                            {/* Answer Type and Mandatory */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Select Answer Type</Label>
                                    <Select
                                        value={question.answerType}
                                        onValueChange={(value: 'Multiple Choice' | 'Input Box' | 'Description Box') =>
                                            updateQuestion(question.id, 'answerType', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose Answer Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                                            <SelectItem value="Input Box">Input Box</SelectItem>
                                            <SelectItem value="Description Box">Description Box</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2 mt-6">
                                    <Checkbox
                                        id={`mandatory-${question.id}`}
                                        checked={question.mandatory}
                                        onCheckedChange={(checked) => updateQuestion(question.id, 'mandatory', checked)}
                                    />
                                    <Label htmlFor={`mandatory-${question.id}`} className="text-sm">
                                        Mandatory
                                    </Label>
                                </div>
                            </div>

                            {/* Multiple Choice Options */}
                            {question.answerType === 'Multiple Choice' && (
                                <div className="space-y-3">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center gap-2">
                                            <Input
                                                placeholder="Answer Option"
                                                value={option.text}
                                                onChange={(e) => updateOption(question.id, optionIndex, 'text', e.target.value)}
                                                className="flex-1"
                                            />

                                            <Select
                                                value={option.type}
                                                onValueChange={(value: 'P' | 'N') => updateOption(question.id, optionIndex, 'type', value)}
                                            >
                                                <SelectTrigger className="w-16 bg-green-500 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="P">P</SelectItem>
                                                    <SelectItem value="N">N</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeOption(question.id, optionIndex)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    {/* Add Option Button - styled like a plus icon in a box */}
                                    <div className="flex justify-start">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addOption(question.id)}
                                            className="h-10 w-10 p-0 border-2 border-dashed border-gray-300 hover:border-gray-400"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Input Box Preview */}
                            {question.answerType === 'Input Box' && (
                                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                                    <Input placeholder="Input will appear here" disabled />
                                </div>
                            )}

                            {/* Description Box Preview */}
                            {question.answerType === 'Description Box' && (
                                <div className="border border-gray-200 rounded p-3 bg-gray-50">
                                    <Textarea placeholder="Description text area will appear here" disabled className="min-h-[80px]" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Question Button */}
            <div className="flex justify-center mt-8">
                <Button
                    type="button"
                    variant="outline"
                    onClick={addQuestion}
                    className="h-12 w-12 p-0 border-2 border-dashed border-gray-400 hover:border-gray-500 rounded"
                >
                    <Plus className="w-6 h-6" />
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                <Button variant="outline" className="px-8">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-[#C72030] hover:bg-[#B8252F] text-white px-8">
                    Save Checklist
                </Button>
            </div>
        </div>
    );
};
