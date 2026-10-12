import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TextField, Select as MuiSelect, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from '@mui/material';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { usePermitEvents } from "@/components/PostHogPermitEvents";

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

const fieldStyles = {
    height: { xs: 36, sm: 40, md: 45 },
    backgroundColor: '#fff',
    '& .MuiInputBase-input, & .MuiSelect-select': {
        padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#fff',
        '& fieldset': { borderColor: '#E5E5E0', borderWidth: '1px' },
        '&:hover fieldset': { borderColor: '#C9C9C2' },
        '&.Mui-focused fieldset': { borderColor: '#DA7756', borderWidth: '1px' },
    },
    '& .MuiInputLabel-root': {
        color: '#5C5C5C',
        fontSize: '12px',
        fontWeight: 600,
        '&.Mui-focused': {
            color: '#DA7756',
        },
    },
};

const compactFieldStyles = {
    ...fieldStyles,
    height: 40,
    '& .MuiOutlinedInput-root': {
        ...fieldStyles['& .MuiOutlinedInput-root'],
        height: 40,
    },
};

const selectMenuProps = {
    PaperProps: {
        style: {
            maxHeight: 224,
            backgroundColor: 'white',
            border: '1px solid #E5E5E0',
            borderRadius: '12px',
            boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            zIndex: 9999,
        },
    },
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
};

export const AddPermitChecklist = () => {
    const { setCurrentSection } = useLayout();
    const navigate = useNavigate();

    React.useEffect(() => {
        setCurrentSection('Safety');
    }, [setCurrentSection]);

    const { onChecklistCreateOpened, onChecklistSaved } = usePermitEvents();

    React.useEffect(() => {
        onChecklistCreateOpened();
    }, []);

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
            onChecklistSaved({
                question_count: questions.length,
                category: formData.category
            });

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
        <div className="min-h-screen w-full bg-[#F6F4EE]">
            <div className="mb-6 px-4 pt-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 hover:text-gray-800"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Checklist
                </button>
            </div>

            <div className="w-full border-y border-[#E5E5E0] bg-white p-6 shadow-sm">
                <div className="mb-8 flex items-center gap-3 border-b border-[#E5E5E0] pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F4EE] text-[#DA7756]">
                        <span className="text-[20px]">✓</span>
                    </div>
                    <h1 className="text-[20px] font-semibold uppercase tracking-wide text-[#DA7756]">
                        Add Checklist
                    </h1>
                </div>

                {/* Category & Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormControl fullWidth variant="outlined" disabled={isLoadingCategories}>
                        <InputLabel shrink>Category *</InputLabel>
                        <MuiSelect
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            label="Category *"
                            notched
                            displayEmpty
                            sx={fieldStyles}
                            MenuProps={selectMenuProps}
                            renderValue={(selected) =>
                                selected
                                    ? categories.find((c) => c.id.toString() === String(selected))?.name || String(selected)
                                    : <span style={{ color: '#999' }}>{isLoadingCategories ? 'Loading...' : 'Select Category'}</span>
                            }
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
                        label="Title *"
                        placeholder="Enter the title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={fieldStyles}

                    />
                </div>

                {/* Question Count */}
                <div className="mb-8 rounded-[12px] border border-[#E5E5E0] bg-[#F9F7F3] p-4">
                    <div className="flex items-center justify-between gap-4 mb-2">
                        <h3 className="text-[14px] font-semibold text-[#2C2C2C]">Add No. of Questions</h3>
                        <div className="flex items-center gap-4">
                            <FormControl variant="outlined" sx={{ width: 80 }}>
                                <MuiSelect
                                    value={questionCount.toString().padStart(2, '0')}
                                    onChange={(e) => {
                                        const newCount = parseInt(e.target.value);
                                        setQuestionCount(newCount);
                                        if (newCount > questions.length) {
                                            for (let i = 0; i < newCount - questions.length; i++) addQuestion();
                                        } else setQuestions(questions.slice(0, newCount));
                                    }}
                                    sx={compactFieldStyles}
                                    MenuProps={selectMenuProps}
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
                                className="h-8 w-8 rounded-full bg-[#1F1F1F] p-0 text-white hover:bg-[#000000] [&_svg]:text-white"
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
                            className="relative rounded-[16px] border border-[#E5E5E0] bg-white p-6 shadow-sm"
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

                            <h4 className="mb-4 text-[14px] font-semibold text-[#2C2C2C]">
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
                                variant="outlined"
                                className="mb-4"
                                sx={{
                                    backgroundColor: '#fff',
                                    '& .MuiOutlinedInput-root': {
                                        height: 'auto !important',
                                        padding: '2px !important',
                                        display: 'flex',
                                        backgroundColor: '#fff',
                                        '& fieldset': { borderColor: '#e5e7eb' },
                                        '&:hover fieldset': { borderColor: '#C72030' },
                                        '&.Mui-focused fieldset': { borderColor: '#C72030' },
                                    },
                                    "& .MuiInputBase-input[aria-hidden='true']": {
                                        flex: 0,
                                        width: 0,
                                        height: 0,
                                        padding: '0 !important',
                                        margin: 0,
                                        display: 'none',
                                    },
                                    '& .MuiInputBase-input': {
                                        resize: 'none !important',
                                    },
                                }}
                            />

                            {/* Answer Type + Mandatory */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel shrink>Select Answer Type</InputLabel>
                                    <MuiSelect
                                        value={question.answerType}
                                        onChange={(e) =>
                                            updateQuestion(question.id, 'answerType', e.target.value as 'Multiple Choice' | 'Input Box' | 'Description Box')
                                        }
                                        label="Select Answer Type"
                                        notched
                                        sx={fieldStyles}
                                        MenuProps={selectMenuProps}
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
                                                sx={{
                                                    color: '#DA7756',
                                                    '&.Mui-checked': { color: '#DA7756' },
                                                }}
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
                                                fullWidth
                                                variant="outlined"
                                                InputLabelProps={{ shrink: true }}
                                                sx={compactFieldStyles}
                                            />

                                            <FormControl variant="outlined" sx={{ width: 70 }}>
                                                <MuiSelect
                                                    value={option.type}
                                                    onChange={(e) =>
                                                        updateOption(question.id, i, 'type', e.target.value)
                                                    }
                                                    sx={compactFieldStyles}
                                                    MenuProps={selectMenuProps}
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

                                    {/* <Button
                                        type="button"
                                        onClick={() => addOption(question.id)}
                                        className="mt-2 flex items-center gap-2 bg-[#1F1F1F] text-white hover:bg-[#000000] [&_svg]:!text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Option
                                    </Button> */}
                                    <Button
                                        type="button"
                                        onClick={() => addOption(question.id)}
                                        style={{ backgroundColor: '#1F1F1F', color: '#FFFFFF' }}
                                        className="mt-2 flex items-center gap-2 !text-white hover:!bg-black"
                                    >
                                        <Plus className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                                        <span style={{ color: '#FFFFFF' }}>Add Option</span>
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
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        className="px-8 border-[#E5E5E0] bg-white text-[#2C2C2C] hover:bg-[#F6F4EE]"
                        disabled={isSubmitting}
                        onClick={() => navigate('/safety/permit/checklist')}
                    >
                        Cancel
                    </Button>
                    {/* <Button
                        type="button"
                        onClick={handleSubmit}
                        className="px-8 !bg-[#DA7756] hover:!bg-[#C86D4D] !text-white disabled:!opacity-100 disabled:!bg-[#DA7756]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Checklist'}
                    </Button> */}
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{ backgroundColor: '#1F1F1F', color: '#FFFFFF', opacity: 1 }}
                        className="px-8 !text-white hover:!bg-black"
                    >
                        <span style={{ color: '#FFFFFF' }}>{isSubmitting ? 'Saving...' : 'Save Checklist'}</span>
                    </Button>
                </div>
            </div>
        </div>
    );


};
