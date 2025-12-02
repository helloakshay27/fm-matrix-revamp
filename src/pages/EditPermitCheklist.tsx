// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Plus, X } from 'lucide-react';
// import { useLayout } from '@/contexts/LayoutContext';
// import { toast } from 'sonner';
// import { useParams, useNavigate } from 'react-router-dom';

// interface AnswerOption {
//     text: string;
//     type: 'P' | 'N';
// }

// interface Question {
//     id: string;
//     serverId?: number; // Server-side ID for existing questions
//     question: string;
//     answerType: 'Multiple Choice' | 'Input Box' | 'Description Box';
//     mandatory: boolean;
//     options: AnswerOption[];
//     isDeleted?: boolean; // Track if question should be deleted
// }

// interface AnswerOptionWithServer extends AnswerOption {
//     serverId?: number; // Server-side ID for existing options
//     isDeleted?: boolean; // Track if option should be deleted
// }

// export const EditPermitChecklist = () => {
//     const { setCurrentSection } = useLayout();
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(true);
//     const [formData, setFormData] = useState({
//         category: '',
//         title: '',
//     });
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [deletedQuestionIds, setDeletedQuestionIds] = useState<number[]>([]); // Track deleted question IDs
//     const [questionCount, setQuestionCount] = useState(0);
//     const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
//     const [isLoadingCategories, setIsLoadingCategories] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [categoryName, setCategoryName] = useState(''); // Store category name from API

//     useEffect(() => {
//         setCurrentSection('Safety');
//         fetchCategories();
//         fetchChecklistData();
//     }, [setCurrentSection]);

//     // Match category when both categories and categoryName are loaded
//     useEffect(() => {
//         if (!isLoadingCategories && categories.length > 0 && categoryName && !formData.category) {
//             const matchedCategory = categories.find(
//                 cat => cat.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
//             );
//             if (matchedCategory) {
//                 setFormData(prev => ({
//                     ...prev,
//                     category: matchedCategory.id.toString()
//                 }));
//             }
//         }
//     }, [isLoadingCategories, categories, categoryName]);

//     // Fetch categories on mount
//     const fetchCategories = async () => {
//         try {
//             setIsLoadingCategories(true);
//             let baseUrl = localStorage.getItem('baseUrl') || '';
//             const token = localStorage.getItem('token') || '';

//             if (!baseUrl || !token) {
//                 toast('Authentication credentials not found');
//                 setIsLoadingCategories(false);
//                 return;
//             }

//             if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
//                 baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
//             }

//             const url = `${baseUrl}/pms/permit_tags.json?q[tag_type_eq]=PermitType`;

//             const response = await fetch(url, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch categories: ${response.status}`);
//             }

//             const data = await response.json();

//             // Map the response to extract id and name
//             const mappedCategories = (Array.isArray(data) ? data : data.data || []).map((item: any) => ({
//                 id: item.id,
//                 name: item.name || item.tag_name || ''
//             }));

//             setCategories(mappedCategories);
//         } catch (error: any) {
//             console.error('Error fetching categories:', error);
//             toast.error('Failed to load categories');
//             setCategories([]);
//         } finally {
//             setIsLoadingCategories(false);
//         }
//     };

//     // ✅ Fetch existing checklist data
//     const fetchChecklistData = async () => {
//         try {
//             setLoading(true);
//             let baseUrl = localStorage.getItem('baseUrl') || '';
//             const token = localStorage.getItem('token') || '';

//             if (!baseUrl || !token) {
//                 throw new Error('Authentication credentials not found. Please login again.');
//             }

//             // Ensure baseUrl has the correct format
//             if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
//                 baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
//             }

//             const url = `${baseUrl}/pms/admin/snag_checklists/${id}/permit_checklist_show.json`;

//             const response = await fetch(url, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`Failed to fetch checklist details: ${response.status}`);
//             }

//             const data = await response.json();
//             const checklistData = data.snag_checklist;

//             // Store category name to match later
//             setCategoryName(checklistData.category || '');

//             setFormData({
//                 category: checklistData.snag_audit_category_id?.toString() || '',
//                 title: checklistData.title || '',
//             });

//             const formattedQuestions: Question[] =
//                 checklistData.questions?.map((q: any, index: number) => ({
//                     id: (index + 1).toString(),
//                     serverId: q.id, // Store server-side ID
//                     question: q.description || '',
//                     answerType:
//                         q.answer_type === 'Multiple Choice'
//                             ? 'Multiple Choice'
//                             : q.answer_type === 'Input Box'
//                                 ? 'Input Box'
//                                 : 'Description Box',
//                     mandatory: q.question_mandatory || false,
//                     options:
//                         q.answers?.map((opt: any, optIndex: number) => ({
//                             text: typeof opt === 'string' ? opt : opt.option_name || opt.text || '',
//                             type: 'P',
//                             serverId: typeof opt === 'object' ? opt.id : undefined, // Store option server ID if available
//                             isDeleted: false
//                         })) || [],
//                     isDeleted: false
//                 })) || [];

//             setQuestions(formattedQuestions);
//             setQuestionCount(formattedQuestions.length);
//         } catch (error) {
//             console.error(error);
//             toast.error('Failed to load checklist data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const addQuestion = () => {
//         const newQuestion: Question = {
//             id: Date.now().toString(),
//             question: '',
//             answerType: 'Multiple Choice',
//             mandatory: false,
//             options: [
//                 { text: '', type: 'P' },
//                 { text: '', type: 'P' }
//             ]
//         };
//         setQuestions([...questions, newQuestion]);
//         setQuestionCount(prev => prev + 1);
//     };

//     const removeQuestion = (questionId: string) => {
//         if (questions.length > 1) {
//             const questionToRemove = questions.find(q => q.id === questionId);

//             // If question has a serverId, mark it for deletion instead of removing from array
//             if (questionToRemove?.serverId) {
//                 setDeletedQuestionIds(prev => [...prev, questionToRemove.serverId!]);
//                 setQuestions(questions.filter(q => q.id !== questionId));
//             } else {
//                 // If it's a new question (no serverId), just remove it from the array
//                 setQuestions(questions.filter(q => q.id !== questionId));
//             }
//             setQuestionCount(prev => prev - 1);
//         }
//     };

//     const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
//         setQuestions((prev) =>
//             prev.map((q) =>
//                 q.id === questionId
//                     ? {
//                         ...q,
//                         [field]: value,
//                         ...(field === 'answerType' && value !== 'Multiple Choice'
//                             ? { options: [] }
//                             : {}),
//                     }
//                     : q
//             )
//         );
//     };

//     const updateOption = (
//         questionId: string,
//         optionIndex: number,
//         field: keyof AnswerOption,
//         value: string
//     ) => {
//         setQuestions((prev) =>
//             prev.map((q) =>
//                 q.id === questionId
//                     ? {
//                         ...q,
//                         options: q.options.map((opt, i) =>
//                             i === optionIndex ? { ...opt, [field]: value } : opt
//                         ),
//                     }
//                     : q
//             )
//         );
//     };

//     const addOption = (questionId: string) => {
//         setQuestions((prev) =>
//             prev.map((q) =>
//                 q.id === questionId
//                     ? { ...q, options: [...q.options, { text: '', type: 'P' }] }
//                     : q
//             )
//         );
//     };

//     const removeOption = (questionId: string, index: number) => {
//         setQuestions((prev) =>
//             prev.map((q) => {
//                 if (q.id === questionId) {
//                     const optionToRemove = q.options[index] as AnswerOptionWithServer;

//                     // If option has a serverId, mark it as deleted instead of removing
//                     if (optionToRemove.serverId) {
//                         return {
//                             ...q,
//                             options: q.options.map((opt, i) =>
//                                 i === index ? { ...opt, isDeleted: true } as AnswerOptionWithServer : opt
//                             )
//                         };
//                     } else {
//                         // If it's a new option (no serverId), just remove it
//                         return {
//                             ...q,
//                             options: q.options.filter((_, i) => i !== index),
//                         };
//                     }
//                 }
//                 return q;
//             })
//         );
//     };

//     const handleSubmit = async () => {
//         // Validate form
//         if (!formData.category || !formData.title) {
//             toast.error('Please fill in all required fields');
//             return;
//         }

//         const hasEmptyQuestions = questions.some((q) => !q.question.trim());
//         if (hasEmptyQuestions) {
//             toast.error('Please provide questions for all tasks');
//             return;
//         }

//         // Validate multiple choice options
//         const hasInvalidOptions = questions.some(q =>
//             q.answerType === 'Multiple Choice' &&
//             (q.options.filter((opt: AnswerOptionWithServer) => !opt.isDeleted).length === 0 ||
//                 q.options.some((opt: AnswerOptionWithServer) => !opt.isDeleted && !opt.text.trim()))
//         );
//         if (hasInvalidOptions) {
//             toast.error('Please provide all answer options for multiple choice questions');
//             return;
//         }

//         try {
//             setIsSubmitting(true);

//             let baseUrl = localStorage.getItem('baseUrl') || '';
//             const token = localStorage.getItem('token') || '';

//             if (!baseUrl || !token) {
//                 toast.error('Authentication required. Please login again.');
//                 return;
//             }

//             // Ensure baseUrl has the correct format
//             if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
//                 baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
//             }

//             // Build the API payload according to the new structure
//             const questionPayload = questions.map(q => {
//                 const questionData: any = {
//                     descr: q.question,
//                     qtype: q.answerType === 'Multiple Choice' ? 'multiple' :
//                         q.answerType === 'Input Box' ? 'input' : 'description',
//                     quest_mandatory: q.mandatory ? 'on' : 'off',
//                     image_mandatory: false,
//                     delete: false
//                 };

//                 // Add server ID if it exists (for updating existing questions)
//                 if (q.serverId) {
//                     questionData.id = q.serverId;
//                 }

//                 // Add options for multiple choice
//                 if (q.answerType === 'Multiple Choice') {
//                     questionData.quest_options = q.options.map((opt: AnswerOptionWithServer) => {
//                         const optionData: any = {
//                             option_name: opt.text,
//                             option_type: opt.type.toLowerCase(),
//                             delete: opt.isDeleted || false
//                         };

//                         // Add server ID if it exists (for updating existing options)
//                         if (opt.serverId) {
//                             optionData.id = opt.serverId;
//                         }

//                         return optionData;
//                     });
//                 }

//                 return questionData;
//             });

//             // Add deleted questions to the payload
//             const deletedQuestionsPayload = deletedQuestionIds.map(id => ({
//                 id: id,
//                 delete: true
//             }));

//             const payload = {
//                 snag_checklist: {
//                     name: formData.title,
//                     snag_audit_category_id: parseInt(formData.category)
//                 },
//                 question: [...questionPayload, ...deletedQuestionsPayload]
//             };

//             const url = `${baseUrl}/pms/admin/snag_checklists/${id}/update_permit_checklist.json`;

//             console.log('Sending PATCH request to:', url);
//             console.log('Payload:', JSON.stringify(payload, null, 2));

//             const response = await fetch(url, {
//                 method: 'PATCH',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(payload)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();
//             console.log('API Response:', result);

//             toast.success('Permit checklist updated successfully!');

//             // Navigate to list page
//             setTimeout(() => {
//                 navigate('/safety/permit/checklist');
//             }, 1000);

//         } catch (error: any) {
//             console.error('Error updating permit checklist:', error);
//             toast.error(error.message || 'Failed to update permit checklist. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64 text-gray-500">
//                 Loading checklist...
//             </div>
//         );
//     }

//     return (
//         <div className="p-6  mx-auto">
//             {/* Main Card */}
//             <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
//                 {/* Header */}
//                 <div className="flex items-center mb-6 border-b pb-3">
//                     <div className="flex items-center bg-[#F6F4EE] !text-[#C72030] px-4 py-2 rounded-md">
//                         <span className="mr-2 text-[28px]">✎</span>
//                         <span className=" font-semibold !text-[#C72030]">Edit Checklist</span>
//                     </div>
//                 </div>

//                 {/* Category & Title */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                     <div className="space-y-2">
//                         <Label className="text-sm font-medium">
//                             Category<span className="text-red-500">*</span>
//                         </Label>
//                         <Select
//                             value={formData.category}
//                             onValueChange={(value) => setFormData({ ...formData, category: value })}
//                             disabled={isLoadingCategories}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder={
//                                     isLoadingCategories
//                                         ? "Loading categories..."
//                                         : categories.length === 0
//                                             ? "No categories available"
//                                             : "Select Category"
//                                 } />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {categories.map((category) => (
//                                     <SelectItem key={category.id} value={category.id.toString()}>
//                                         {category.name}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-2">
//                         <Label className="text-sm font-medium">
//                             Title<span className="text-red-500">*</span>
//                         </Label>
//                         <Input
//                             placeholder="Enter the title"
//                             value={formData.title}
//                             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                         />
//                     </div>
//                 </div>

//                 {/* Question Count */}
//                 <div className="mb-8 border-t pt-4">
//                     <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-base font-medium">Add No. of Questions</h3>
//                         <div className="flex items-center gap-4">
//                             <Select
//                                 value={questionCount.toString().padStart(2, '0')}
//                                 onValueChange={(value) => {
//                                     const newCount = parseInt(value);
//                                     setQuestionCount(newCount);
//                                     if (newCount > questions.length) {
//                                         for (let i = 0; i < newCount - questions.length; i++) {
//                                             addQuestion();
//                                         }
//                                     } else {
//                                         setQuestions(questions.slice(0, newCount));
//                                     }
//                                 }}
//                             >
//                                 <SelectTrigger className="w-20">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {Array.from({ length: 20 }, (_, i) => (
//                                         <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
//                                             {(i + 1).toString().padStart(2, '0')}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>

//                             <Button
//                                 type="button"
//                                 onClick={addQuestion}
//                                 className="bg-[#C72030] hover:bg-[#B8252F] text-white h-8 w-8 rounded-full p-0"
//                             >
//                                 <Plus className="w-4 h-4" />
//                             </Button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Question Blocks */}
//                 <div className="space-y-6">
//                     {questions.map((question, index) => (
//                         <div
//                             key={question.id}
//                             className="bg-[#F9F9F9] border border-gray-200 rounded-lg p-6 relative"
//                         >
//                             {/* Remove Question */}
//                             <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => removeQuestion(question.id)}
//                                 className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1"
//                             >
//                                 <X className="w-4 h-4" />
//                             </Button>

//                             <h4 className="text-base font-medium mb-4">
//                                 Question {index + 1}
//                             </h4>

//                             {/* Question Input */}
//                             <Textarea
//                                 placeholder="Enter your Question"
//                                 value={question.question}
//                                 onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
//                                 className="mb-4 min-h-[70px]"
//                             />

//                             {/* Answer Type + Mandatory */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                 <div className="space-y-2">
//                                     <Label className="text-sm font-medium">Select Answer Type</Label>
//                                     <Select
//                                         value={question.answerType}
//                                         onValueChange={(value: 'Multiple Choice' | 'Input Box' | 'Description Box') =>
//                                             updateQuestion(question.id, 'answerType', value)
//                                         }
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
//                                             <SelectItem value="Input Box">Input Box</SelectItem>
//                                             <SelectItem value="Description Box">Description Box</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 <div className="flex items-center space-x-2 mt-6">
//                                     <Checkbox
//                                         id={`mandatory-${question.id}`}
//                                         checked={question.mandatory}
//                                         onCheckedChange={(checked) =>
//                                             updateQuestion(question.id, 'mandatory', checked)
//                                         }
//                                     />
//                                     <Label htmlFor={`mandatory-${question.id}`}>Mandatory</Label>
//                                 </div>
//                             </div>

//                             {/* Multiple Choice Options */}
//                             {question.answerType === 'Multiple Choice' && (
//                                 <div className="space-y-3">
//                                     {question.options.map((option, i) => {
//                                         const optionWithServer = option as AnswerOptionWithServer;
//                                         // Don't render deleted options
//                                         if (optionWithServer.isDeleted) return null;

//                                         return (
//                                             <div key={i} className="flex items-center gap-2">
//                                                 <Input
//                                                     placeholder="Answer Option"
//                                                     value={option.text}
//                                                     onChange={(e) =>
//                                                         updateOption(question.id, i, 'text', e.target.value)
//                                                     }
//                                                     className="flex-1"
//                                                 />

//                                                 <Select
//                                                     value={option.type}
//                                                     onValueChange={(val: 'P' | 'N') =>
//                                                         updateOption(question.id, i, 'type', val)
//                                                     }
//                                                 >
//                                                     <SelectTrigger className="w-16">
//                                                         <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         <SelectItem value="P">P</SelectItem>
//                                                         <SelectItem value="N">N</SelectItem>
//                                                     </SelectContent>
//                                                 </Select>

//                                                 <Button
//                                                     type="button"
//                                                     variant="ghost"
//                                                     size="sm"
//                                                     onClick={() => removeOption(question.id, i)}
//                                                     className="text-red-500 hover:text-red-700 p-1"
//                                                 >
//                                                     <X className="w-4 h-4" />
//                                                 </Button>
//                                             </div>
//                                         );
//                                     })}

//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         onClick={() => addOption(question.id)}
//                                         className="mt-2 h-9 w-9 p-0 border-2 border-dashed border-gray-300 hover:border-gray-400"
//                                     >
//                                         <Plus className="w-4 h-4" />
//                                     </Button>
//                                 </div>
//                             )}

//                             {/* Input / Description Preview */}
//                             {question.answerType === 'Input Box' && (
//                                 <Input placeholder="Input will appear here" disabled className="mt-2" />
//                             )}
//                             {question.answerType === 'Description Box' && (
//                                 <Textarea
//                                     placeholder="Description box will appear here"
//                                     disabled
//                                     className="mt-2 min-h-[70px]"
//                                 />
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Bottom Buttons */}
//                 <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
//                     <Button
//                         variant="outline"
//                         className="px-8"
//                         disabled={isSubmitting}
//                         onClick={() => navigate('/safety/permit/checklist')}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         onClick={handleSubmit}
//                         className="bg-[#C72030] hover:bg-[#B8252F] text-white px-8"
//                         disabled={isSubmitting || isLoadingCategories}
//                     >
//                         {isSubmitting ? 'Updating...' : 'Update Checklist'}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    FormControlLabel,
    Checkbox as MuiCheckbox,
} from '@mui/material';

interface AnswerOption {
    text: string;
    type: 'P' | 'N' | string; // accept other strings like 'text' too
}

const fieldStyles = {
    '& .MuiInputBase-input': {
        padding: '10px 12px',
    },
    '& .MuiOutlinedInput-root': {
        fontSize: '14px',
    },
};

interface AnswerOptionWithServer extends AnswerOption {
    serverId?: number;
    isDeleted?: boolean;
}

interface Question {
    id: string; // local id
    serverId?: number; // server id when existing
    question: string;
    answerType: 'Multiple Choice' | 'Input Box' | 'Description Box';
    mandatory: boolean;
    options: AnswerOptionWithServer[];
    isDeleted?: boolean;
}

export const EditPermitChecklist: React.FC = () => {
    const { setCurrentSection } = useLayout();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [categoryName, setCategoryName] = useState(''); // category name from API for matching

    const [formData, setFormData] = useState({
        category: '',
        title: '',
    });

    const [questions, setQuestions] = useState<Question[]>([]);
    const [deletedQuestionIds, setDeletedQuestionIds] = useState<number[]>([]);
    const [questionCount, setQuestionCount] = useState(0);

    useEffect(() => {
        setCurrentSection('Safety');
        fetchCategories();
        fetchChecklistData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // match category by name if needed
    useEffect(() => {
        if (!isLoadingCategories && categories.length > 0 && categoryName && !formData.category) {
            const matched = categories.find(
                (c) => c.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
            );
            if (matched) {
                setFormData((prev) => ({ ...prev, category: matched.id.toString() }));
            }
        }
    }, [isLoadingCategories, categories, categoryName, formData.category]);

    // ---------- FETCH CATEGORIES ----------
    const fetchCategories = async () => {
        try {
            setIsLoadingCategories(true);
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (!baseUrl || !token) {
                toast('Authentication credentials not found');
                setIsLoadingCategories(false);
                return;
            }

            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const url = `${baseUrl}/pms/permit_tags.json?q[tag_type_eq]=PermitType`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);

            const data = await res.json();

            // map response with flexibility (data or array)
            const items = Array.isArray(data) ? data : data.data || [];
            const mapped = items.map((it: any) => ({
                id: it.id,
                name: it.name || it.tag_name || '',
            }));

            setCategories(mapped);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load categories');
            setCategories([]);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // ---------- FETCH CHECKLIST DATA ----------
    const fetchChecklistData = async () => {
        try {
            setLoading(true);
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (!baseUrl || !token) {
                throw new Error('Authentication credentials not found. Please login again.');
            }

            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            const url = `${baseUrl}/pms/admin/snag_checklists/${id}/permit_checklist_show.json`;

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`Failed to fetch checklist details: ${res.status}`);

            const data = await res.json();
            const checklist = data.snag_checklist || data;

            // store category name (to match later)
            setCategoryName(checklist.category || checklist.name || '');

            setFormData({
                category: checklist.snag_audit_category_id?.toString() || checklist.snag_audit_category_id?.id?.toString() || '',
                title: checklist.title || checklist.name || '',
            });

            // Build questions array from API response
            const formattedQuestions: Question[] = (checklist.questions || []).map((q: any, idx: number) => {
                // Prefer options array if present, else try answers/options mapping
                const rawOptions = Array.isArray(q.options) && q.options.length > 0
                    ? q.options
                    : Array.isArray(q.answers) && q.answers.length > 0
                        ? q.answers.map((a: any) => ({ id: undefined, qname: a, option_type: 'p' }))
                        : [];

                const options: AnswerOptionWithServer[] = rawOptions.map((opt: any) => {
                    const optionText = opt.qname || opt.option_name || opt.text || opt || '';
                    const optionTypeRaw = opt.option_type || 'p';
                    // Convert to uppercase P or N, default to P
                    const optionType = optionTypeRaw.toString().toUpperCase() === 'P' || optionTypeRaw.toString().toUpperCase() === 'N'
                        ? optionTypeRaw.toString().toUpperCase()
                        : 'P';

                    return {
                        text: typeof optionText === 'string' ? optionText : optionText.toString(),
                        type: optionType,
                        serverId: opt.id,
                        isDeleted: false,
                    };
                });

                // Map answer_type from API to UI format
                let answerTypeLabel: Question['answerType'] = 'Multiple Choice';
                if (q.answer_type === 'Multiple Choice' || q.qtype === 'multiple') {
                    answerTypeLabel = 'Multiple Choice';
                } else if (q.answer_type === 'Input Box' || q.qtype === 'input' || q.qtype === 'text') {
                    answerTypeLabel = 'Input Box';
                } else if (q.answer_type === 'Description Box' || q.qtype === 'description') {
                    answerTypeLabel = 'Description Box';
                }

                return {
                    id: (idx + 1).toString(),
                    serverId: q.id,
                    question: q.description || q.descr || q.question || '',
                    answerType: answerTypeLabel,
                    mandatory: !!q.question_mandatory || (q.quest_mandatory === 'on'),
                    options,
                    isDeleted: false,
                };
            });

            setQuestions(formattedQuestions);
            setQuestionCount(formattedQuestions.length || 0);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load checklist data');
        } finally {
            setLoading(false);
        }
    };

    // ---------- QUESTION/OPTION MANAGEMENT ----------
    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now().toString(),
            question: '',
            answerType: 'Multiple Choice',
            mandatory: false,
            options: [
                { text: '', type: 'P' },
                { text: '', type: 'P' },
            ],
        };
        setQuestions((prev) => [...prev, newQuestion]);
        setQuestionCount((c) => c + 1);
    };

    const removeQuestion = (localId: string) => {
        const found = questions.find((q) => q.id === localId);
        if (!found) return;

        // If there is a serverId, mark for deletion payload; remove from UI list
        if (found.serverId) {
            setDeletedQuestionIds((prev) => [...prev, found.serverId!]);
            setQuestions((prev) => prev.filter((q) => q.id !== localId));
        } else {
            // new question — just remove
            setQuestions((prev) => prev.filter((q) => q.id !== localId));
        }
        setQuestionCount((c) => Math.max(0, c - 1));
    };

    const updateQuestion = (localId: string, field: keyof Question, value: any) => {
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.id !== localId) return q;

                // when switching away from Multiple Choice, clear options
                if (field === 'answerType' && value !== 'Multiple Choice') {
                    return {
                        ...q,
                        answerType: value,
                        options: [],
                    };
                }

                return { ...q, [field]: value };
            })
        );
    };

    const addOption = (localQuestionId: string) => {
        setQuestions((prev) =>
            prev.map((q) =>
                q.id === localQuestionId ? { ...q, options: [...q.options, { text: '', type: 'P' }] } : q
            )
        );
    };

    const updateOption = (
        localQuestionId: string,
        optionIndex: number,
        field: keyof AnswerOption,
        value: any
    ) => {
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.id !== localQuestionId) return q;
                const opts = q.options.map((opt, idx) =>
                    idx === optionIndex ? { ...opt, [field]: value } : opt
                );
                return { ...q, options: opts };
            })
        );
    };

    const removeOption = (localQuestionId: string, optionIndex: number) => {
        setQuestions((prev) =>
            prev.map((q) => {
                if (q.id !== localQuestionId) return q;

                const option = q.options[optionIndex];
                // if existing on server -> mark isDeleted true (keep in array so backend knows)
                if (option?.serverId) {
                    const newOpts = q.options.map((opt, idx) =>
                        idx === optionIndex ? { ...opt, isDeleted: true } : opt
                    );
                    return { ...q, options: newOpts };
                } else {
                    // brand new option -> remove from array
                    const newOpts = q.options.filter((_, idx) => idx !== optionIndex);
                    return { ...q, options: newOpts };
                }
            })
        );
    };

    // ---------- SUBMIT ----------
    const handleSubmit = async () => {
        // Validation
        if (!formData.category || !formData.title) {
            toast.error('Please fill in all required fields');
            return;
        }

        // ensure no empty question text
        const hasEmptyQuestions = questions.some((q) => !q.question.trim());
        if (hasEmptyQuestions) {
            toast.error('Please provide questions for all tasks');
            return;
        }

        // validate MCQ options
        const mcqInvalid = questions.some((q) => {
            if (q.answerType !== 'Multiple Choice') return false;
            const activeOptions = q.options.filter((opt) => !opt.isDeleted);
            if (activeOptions.length === 0) return true;
            return activeOptions.some((opt) => !opt.text.trim());
        });
        if (mcqInvalid) {
            toast.error('Please provide all answer options for multiple choice questions');
            return;
        }

        try {
            setIsSubmitting(true);
            let baseUrl = localStorage.getItem('baseUrl') || '';
            const token = localStorage.getItem('token') || '';

            if (!baseUrl || !token) {
                toast.error('Authentication required. Please login again.');
                setIsSubmitting(false);
                return;
            }

            if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
                baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
            }

            // Build question payload
            const questionPayload = questions.map((q) => {
                // map qtype according to the example payload you provided
                const qtype =
                    q.answerType === 'Multiple Choice' ? 'multiple' :
                        q.answerType === 'Input Box' ? 'text' :
                            'description';

                const questionData: any = {
                    descr: q.question,
                    qtype,
                    quest_mandatory: q.mandatory ? 'on' : 'off',
                    image_mandatory: false,
                    delete: false,
                };

                if (q.serverId) {
                    questionData.id = q.serverId;
                }

                // build quest_options
                if (q.answerType === 'Multiple Choice') {
                    const questOptions: any[] = [];

                    q.options.forEach((opt) => {
                        // normalize option_type: use lowercase; if opt.type is 'P'/'N' convert to 'p'/'n'
                        const normalizedType = (opt.type || 'text').toString().toLowerCase();

                        if (opt.isDeleted && opt.serverId) {
                            // deleted existing option: only id + delete true (matches your example)
                            questOptions.push({
                                id: opt.serverId,
                                delete: true,
                            });
                        } else if (opt.serverId) {
                            // existing and active -> include id, option_name, option_type, delete:false
                            questOptions.push({
                                id: opt.serverId,
                                option_name: opt.text,
                                option_type: normalizedType,
                                delete: false,
                            });
                        } else {
                            // new option -> no id
                            questOptions.push({
                                option_name: opt.text,
                                option_type: normalizedType,
                                delete: false,
                            });
                        }
                    });

                    questionData.quest_options = questOptions;
                } else {
                    questionData.quest_options = [];
                }

                return questionData;
            });

            // deleted questions payload (from those that had server ids and were removed)
            const deletedQuestionsPayload = deletedQuestionIds.map((qid) => ({
                id: qid,
                delete: true,
            }));

            const payload = {
                snag_checklist: {
                    name: formData.title,
                    snag_audit_category_id: parseInt(formData.category, 10),
                },
                question: [...questionPayload, ...deletedQuestionsPayload],
            };

            const url = `${baseUrl}/pms/admin/snag_checklists/${id}/update_permit_checklist.json`;

            console.log('PATCH ->', url);
            console.log('Payload ->', JSON.stringify(payload, null, 2));

            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            console.log('API Response:', result);
            toast.success('Permit checklist updated successfully!');

            // navigate back to list - short delay to show toast
            setTimeout(() => navigate('/safety/permit/checklist'), 800);
        } catch (err: any) {
            console.error('Error updating permit checklist:', err);
            toast.error(err.message || 'Failed to update permit checklist. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                Loading checklist...
            </div>
        );
    }

    // ---------- RENDER ----------
    return (
        <div className="p-6 mx-auto">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-6 border-b pb-3">
                    <div className="flex items-center bg-[#F6F4EE] !text-[#C72030] px-4 py-2 rounded-md">
                        <span className="mr-2 text-[28px]">✎</span>
                        <span className="font-semibold !text-[#C72030]">Edit Checklist</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <FormControl fullWidth variant="outlined">
                        <InputLabel shrink>Category *</InputLabel>
                        <MuiSelect
                            label="Category *"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            disabled={isLoadingCategories}
                            displayEmpty
                            sx={fieldStyles}
                        >
                            <MenuItem value="">
                                <em>
                                    {isLoadingCategories
                                        ? 'Loading categories...'
                                        : categories.length === 0
                                            ? 'No categories available'
                                            : 'Select Category'}
                                </em>
                            </MenuItem>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </MenuItem>
                            ))}
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
                <div className="mb-8 border-t pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-medium">Add No. of Questions</h3>
                        <div className="flex items-center gap-4">
                            <FormControl variant="outlined" sx={{ minWidth: 80 }}>
                                <MuiSelect
                                    value={questionCount.toString().padStart(2, '0')}
                                    onChange={(e) => {
                                        const newCount = parseInt(e.target.value, 10);
                                        setQuestionCount(newCount);
                                        if (newCount > questions.length) {
                                            for (let i = 0; i < newCount - questions.length; i++) addQuestion();
                                        } else {
                                            setQuestions((prev) => prev.slice(0, newCount));
                                        }
                                    }}
                                    sx={{ height: 36 }}
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

                {/* Questions */}
                <div className="space-y-6">
                    {questions.map((question, qIndex) => (
                        <div key={question.id} className="bg-[#F9F9F9] border border-gray-200 rounded-lg p-6 relative">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuestion(question.id)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1"
                            >
                                <X className="w-4 h-4" />
                            </Button>

                            <h4 className="text-base font-medium mb-4">Question {qIndex + 1}</h4>

                            <TextField
                                placeholder="Enter your Question"
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                sx={{ ...fieldStyles, mb: 2 }}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel shrink>Select Answer Type</InputLabel>
                                    <MuiSelect
                                        label="Select Answer Type"
                                        value={question.answerType}
                                        onChange={(e) => updateQuestion(question.id, 'answerType', e.target.value)}
                                        sx={fieldStyles}
                                    >
                                        <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                                        {/* <MenuItem value="Input Box">Input Box</MenuItem>
                                        <MenuItem value="Description Box">Description Box</MenuItem> */}
                                    </MuiSelect>
                                </FormControl>

                                <div className="flex items-center">
                                    <FormControlLabel
                                        control={
                                            <MuiCheckbox
                                                checked={question.mandatory}
                                                onChange={(e) => updateQuestion(question.id, 'mandatory', e.target.checked)}
                                            />
                                        }
                                        label="Mandatory"
                                    />
                                </div>
                            </div>

                            {/* Options for MCQ */}
                            {question.answerType === 'Multiple Choice' && (
                                <div className="space-y-3">
                                    {question.options.map((opt, i) => {
                                        // Skip rendering deleted options (they are kept in state to be sent as delete: true)
                                        if (opt.isDeleted) return null;

                                        return (
                                            <div key={i} className="flex items-center gap-2">
                                                <TextField
                                                    placeholder="Answer Option"
                                                    value={opt.text}
                                                    onChange={(e) => updateOption(question.id, i, 'text', e.target.value)}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    sx={fieldStyles}
                                                />

                                                <FormControl variant="outlined" sx={{ minWidth: 80 }}>
                                                    <MuiSelect
                                                        value={opt.type}
                                                        onChange={(e) => updateOption(question.id, i, 'type', e.target.value)}
                                                        size="small"
                                                    >
                                                        <MenuItem value="P">P</MenuItem>
                                                        <MenuItem value="N">N</MenuItem>
                                                        {/* <MenuItem value="text">text</MenuItem> */}
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
                                        );
                                    })}

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

                            {/* Input / Description Previews */}
                            {question.answerType === 'Input Box' && (
                                <TextField
                                    placeholder="Input will appear here"
                                    disabled
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    sx={{ ...fieldStyles, mt: 2 }}
                                />
                            )}
                            {question.answerType === 'Description Box' && (
                                <TextField
                                    placeholder="Description box will appear here"
                                    disabled
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    sx={{ ...fieldStyles, mt: 2 }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Buttons */}
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
                        {isSubmitting ? 'Updating...' : 'Update Checklist'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditPermitChecklist;
