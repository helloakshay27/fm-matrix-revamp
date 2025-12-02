import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TextField, Select as MuiSelect, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { Plus, X } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    React.useEffect(() => {
        setCurrentSection('Safety');
    }, [setCurrentSection]);

    const [formData, setFormData] = useState({
        category: '',
        title: ''
    });

    const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true);
                let baseUrl = localStorage.getItem('baseUrl') || '';
                const token = localStorage.getItem('token') || '';

                if (!baseUrl || !token) {
                    toast.warning('Authentication credentials not found');
                    setIsLoadingCategories(false);
                    return;
                }

                // Ensure baseUrl has the correct format
                if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
                }

                const url = `${baseUrl}/pms/permit_tags.json?q[tag_type_eq]=PermitType`;
                console.log('Fetching categories from:', url);

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch categories: ${response.status}`);
                }

                const data = await response.json();
                console.log('Categories API Response:', data);

                // Map the response to extract id and name
                const mappedCategories = (Array.isArray(data) ? data : data.data || []).map((item: any) => ({
                    id: item.id,
                    name: item.name || item.tag_name || ''
                }));

                setCategories(mappedCategories);
                console.log(`Loaded ${mappedCategories.length} categories`);
            } catch (error: any) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
                setCategories([]);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

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
        }
    ]);

    const [questionCount, setQuestionCount] = useState(1);

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

    const handleSubmit = async () => {
        // Validate form
        if (!formData.category || !formData.title) {
            toast.error('Please fill in all required fields');
            return;
        }

        const hasEmptyQuestions = questions.some(q => !q.question.trim());
        if (hasEmptyQuestions) {
            toast.error('Please provide questions for all tasks');
            return;
        }

        // Validate multiple choice options
        const hasInvalidOptions = questions.some(q =>
            q.answerType === 'Multiple Choice' &&
            (q.options.length === 0 || q.options.some(opt => !opt.text.trim()))
        );
        if (hasInvalidOptions) {
            toast.error('Please provide all answer options for multiple choice questions');
            return;
        }

        try {
            setIsSubmitting(true);

            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (!baseUrl || !token) {
                toast.error('Authentication required. Please login again.');
                return;
            }

            // Ensure baseUrl has the correct format
            if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            // Build the API payload
            const payload = {
                snag_checklist: {
                    name: formData.title,
                    snag_audit_category_id: parseInt(formData.category),
                    check_type: 'Permit'
                },
                question: questions.map(q => {
                    const questionData: any = {
                        descr: q.question,
                        qtype: q.answerType === 'Multiple Choice' ? 'multiple' :
                            q.answerType === 'Input Box' ? 'input' : 'description',
                        quest_mandatory: q.mandatory ? 'on' : 'off',
                        image_mandatory: false
                    };

                    // Add options only for multiple choice
                    if (q.answerType === 'Multiple Choice' && q.options.length > 0) {
                        questionData.quest_options = q.options.map(opt => ({
                            option_name: opt.text,
                            option_type: opt.type.toLowerCase()
                        }));
                    }

                    return questionData;
                })
            };

            const url = `${baseUrl}/pms/admin/snag_checklists/create_permit_checklist.json`;
            console.log('Creating permit checklist at:', url);
            console.log('Payload:', payload);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            toast.success('Permit checklist created successfully!');

            // Navigate to list page to show the updated list
            setTimeout(() => {
                navigate('/safety/permit/checklist');
            }, 1000);

        } catch (error: any) {
            console.error('Error creating permit checklist:', error);
            toast.error(error.message || 'Failed to create permit checklist. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6  mx-auto">
            {/* Main Card */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                {/* Header */}
                <div className="flex items-center mb-6 border-b pb-3">
                    <div className="flex items-center bg-[#F6F4EE] !text-[#C72030] px-4 py-2 rounded-md">
                        <span className="mr-2 text-[28px]">✓</span>
                        <span className=" font-semibold !text-[#C72030]">Add checklist</span>
                    </div>
                </div>

                {/* Category & Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormControl fullWidth size="small" disabled={isLoadingCategories}>
                        <InputLabel>Category *</InputLabel>
                        <MuiSelect
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            label="Category *"
                        >
                            {isLoadingCategories ? (
                                <MenuItem value="" disabled>Loading categories...</MenuItem>
                            ) : categories.length === 0 ? (
                                <MenuItem value="" disabled>No categories available</MenuItem>
                            ) : (
                                categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </MenuItem>
                                ))
                            )}
                        </MuiSelect>
                    </FormControl>

                    <TextField
                        label="Title"
                        placeholder="Enter the title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        fullWidth
                        size="small"
                        required
                    />
                </div>

                {/* Question Count */}
                <div className="mb-8 border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium">Add No. of Questions</h3>
                        <div className="flex items-center gap-4">
                            <FormControl size="small" style={{ width: '80px' }}>
                                <MuiSelect
                                    value={questionCount.toString().padStart(2, '0')}
                                    onChange={(e) => {
                                        const newCount = parseInt(e.target.value);
                                        setQuestionCount(newCount);
                                        if (newCount > questions.length) {
                                            for (let i = 0; i < newCount - questions.length; i++) addQuestion();
                                        } else setQuestions(questions.slice(0, newCount));
                                    }}
                                >
                                    {Array.from({ length: 20 }, (_, i) => (
                                        <MenuItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                                            {(i + 1).toString().padStart(2, '0')}
                                        </MenuItem>
                                    ))}
                                </MuiSelect>
                            </FormControl>

                            <Button
                                type="button"
                                onClick={addQuestion}
                                className="bg-[#C72030] hover:bg-[#B8252F] text-white h-8 w-8 rounded-full p-0"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Question Blocks */}
                <div className="space-y-6">
                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="bg-[#F9F9F9] border border-gray-200 rounded-lg p-6 relative"
                        >
                            {/* Remove Question */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(question.id)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1"
                            >
                                <X className="w-4 h-4" />
                            </Button>

                            <h4 className="text-base font-medium mb-4">
                                Question {index + 1}
                            </h4>

                            {/* Question Input */}
                            <TextField
                                placeholder="Enter your Question"
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                className="mb-4"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        height: "auto !important",
                                        padding: "2px !important",
                                        display: "flex",
                                    },
                                    "& .MuiInputBase-input[aria-hidden='true']": {
                                        flex: 0,
                                        width: 0,
                                        height: 0,
                                        padding: "0 !important",
                                        margin: 0,
                                        display: "none",
                                    },
                                    "& .MuiInputBase-input": {
                                        resize: "none !important",
                                    },
                                }}
                            />

                            {/* Answer Type + Mandatory */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormControl fullWidth size="small">
                                    <InputLabel>Select Answer Type</InputLabel>
                                    <MuiSelect
                                        value={question.answerType}
                                        onChange={(e) =>
                                            updateQuestion(question.id, 'answerType', e.target.value as 'Multiple Choice' | 'Input Box' | 'Description Box')
                                        }
                                        label="Select Answer Type"
                                    >
                                        <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                                        {/* <MenuItem value="Input Box">Input Box</MenuItem>
                                        <MenuItem value="Description Box">Description Box</MenuItem> */}
                                    </MuiSelect>
                                </FormControl>

                                <div className="flex items-center mt-2">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={question.mandatory}
                                                onChange={(e) =>
                                                    updateQuestion(question.id, 'mandatory', e.target.checked)
                                                }
                                            />
                                        }
                                        label="Mandatory"
                                    />
                                </div>
                            </div>

                            {/* Multiple Choice Options */}
                            {question.answerType === 'Multiple Choice' && (
                                <div className="space-y-3">
                                    {question.options.map((option, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <TextField
                                                placeholder="Answer Option"
                                                value={option.text}
                                                onChange={(e) =>
                                                    updateOption(question.id, i, 'text', e.target.value)
                                                }
                                                size="small"
                                                fullWidth
                                            />

                                            <FormControl size="small" style={{ width: '70px' }}>
                                                <MuiSelect
                                                    value={option.type}
                                                    onChange={(e) =>
                                                        updateOption(question.id, i, 'type', e.target.value)
                                                    }
                                                >
                                                    <MenuItem value="P">P</MenuItem>
                                                    <MenuItem value="N">N</MenuItem>
                                                </MuiSelect>
                                            </FormControl>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeOption(question.id, i)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => addOption(question.id)}
                                        className="mt-2 h-9 w-9 p-0 border-2 border-dashed border-gray-300 hover:border-gray-400"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Input / Description Preview */}
                            {question.answerType === 'Input Box' && (
                                <TextField
                                    placeholder="Input will appear here"
                                    disabled
                                    fullWidth
                                    size="small"
                                    className="mt-2"
                                />
                            )}
                            {question.answerType === 'Description Box' && (
                                <TextField
                                    placeholder="Description box will appear here"
                                    disabled
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                    className="mt-2"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom Buttons */}
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                    <Button
                        variant="outline"
                        className="px-8"
                        disabled={isSubmitting}
                        onClick={() => navigate('/safety/permit/checklist')}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#C72030] hover:bg-[#B8252F] text-white px-8"
                        disabled={isSubmitting || isLoadingCategories}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Checklist'}
                    </Button>
                </div>
            </div>
        </div>
    );


};
