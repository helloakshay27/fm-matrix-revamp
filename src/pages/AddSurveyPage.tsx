import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Star, ClipboardList, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from '@/utils/apiClient';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

// --- Interface Definitions ---
interface AnswerOption {
  text: string;
  type: 'P' | 'N';
}

interface Question {
  id: string;
  text: string;
  answerType: string;
  mandatory: boolean;
  answerOptions?: AnswerOption[];
  rating?: number;
  selectedEmoji?: string;
}

interface Category {
  id: number;
  name: string;
}

// --- Field Styles for Material-UI Components ---
const fieldStyles = {
  height: '48px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  '& .MuiOutlinedInput-root': {
    height: '48px',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const textareaStyles = {
  ...fieldStyles,
  height: 'auto',
  '& .MuiOutlinedInput-root': {
    height: 'auto',
    minHeight: '80px',
    padding: '16.5px 14px',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  }
};


export const AddSurveyPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', answerType: '', mandatory: false },
    { id: '2', text: '', answerType: '', mandatory: false }
  ]);
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/snag_audit_categories.json');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      answerType: '',
      mandatory: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleQuestionChange = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const updatedQuestion = { ...q, [field]: value };
        if (field === 'answerType' && value === 'multiple-choice' && !updatedQuestion.answerOptions) {
          updatedQuestion.answerOptions = [{ text: '', type: 'P' }, { text: '', type: 'P' }];
        }
        return updatedQuestion;
      }
      return q;
    }));
  };

  const handleAddAnswerOption = (questionId: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, answerOptions: [...(q.answerOptions || []), { text: '', type: 'P' }] }
        : q
    ));
  };

  const handleRemoveAnswerOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { ...q, answerOptions: q.answerOptions?.filter((_, index) => index !== optionIndex) }
        : q
    ));
  };

  const handleAnswerOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? {
            ...q,
            answerOptions: q.answerOptions?.map((option, index) =>
              index === optionIndex ? { ...option, text: value } : option
            )
          }
        : q
    ));
  };

  const handleAnswerOptionTypeChange = (questionId: string, optionIndex: number, value: 'P' | 'N') => {
      setQuestions(questions.map(q =>
          q.id === questionId
              ? {
                  ...q,
                  answerOptions: q.answerOptions?.map((option, index) =>
                      index === optionIndex ? { ...option, type: value } : option
                  )
              }
              : q
      ));
  };


  const handleCreateSurvey = async () => {
    // Validation
    if (!category) {
      alert('Please select a category');
      return;
    }
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    // if (questions.some(q => !q.text.trim())) {
    //   alert('Please fill in all question texts');
    //   return;
    // }
    // if (questions.some(q => !q.answerType)) {
    //   alert('Please select answer type for all questions');
    //   return;
    // }

    try {
      setLoading(true);
      
      const requestData = {
        snag_checklist: {
          name: title,
          snag_audit_category_id: parseInt(category),
          check_type: "survey"
        },
        question: questions.map(question => ({
          descr: question.text,
          qtype: question.answerType === 'multiple-choice' ? 'multiple' : 
                 question.answerType === 'input-box' ? 'input' : 
                 question.answerType === 'rating' ? 'rating' :
                 question.answerType === 'emojis' ? 'emoji' : 'description',
          quest_mandatory: question.mandatory,
          image_mandatory: false,
          ...(question.answerType === 'multiple-choice' && question.answerOptions ? {
            quest_options: question.answerOptions.map(option => ({
              option_name: option.text,
              option_type: option.type.toLowerCase()
            }))
          } : {}),
          ...(question.answerType === 'rating' ? { rating: question.rating } : {}),
          ...(question.answerType === 'emojis' ? { emoji: question.selectedEmoji } : {})
        }))
      };

      console.log('Survey request data:', JSON.stringify(requestData, null, 2));
      
      const response = await apiClient.post('/pms/admin/snag_checklists.json', requestData);
      console.log('Survey created successfully:', response.data);
      
      // Show success message
      alert('Survey created successfully!');
      navigate('/maintenance/survey/list');
    } catch (error) {
      console.error('Error creating survey:', error);
      
      // Show detailed error message
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        alert(`Failed to create survey: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        alert('Network error: Unable to connect to server');
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const EMOJIS = ['😞', '😟', '😐', '😊', '😁'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Survey</h1>
      </div>

  <div className="space-y-6">
        {/* Section: Files Upload */}
        
        {/* Section 1: Survey Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <ClipboardList size={16} color="#C72030" />
              </span>
              Survey Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined" required sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Category</InputLabel>
                <MuiSelect
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category*"
                  notched
                  displayEmpty
                  disabled={loading}
                >
                  <MenuItem value="">{loading ? "Loading..." : "Select Category"}</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id.toString()}>{cat.name}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <TextField
                label="Title *"
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Questions */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
             <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <HelpCircle size={16} color="#C72030" />
              </span>
              Questions
            </h2>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">No. of Questions:</span>
                <span className="font-medium text-gray-900">{questions.length.toString().padStart(2, '0')}</span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">New Question</h3>
                    {questions.length > 1 && (
                      <Button onClick={() => handleRemoveQuestion(question.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <TextField
                    label="Question Text"
                    placeholder="Enter your Question"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                    fullWidth
                    variant="outlined"
                    multiline
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: textareaStyles }}
                  />

                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Answer Type</InputLabel>
                    <MuiSelect
                      value={question.answerType}
                      onChange={(e) => handleQuestionChange(question.id, 'answerType', e.target.value)}
                      label="Answer Type"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Choose Answer Type</MenuItem>
                      <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                      <MenuItem value="input-box">Input Box</MenuItem>
                      <MenuItem value="description-box">Description Box</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="emojis">Emojis</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  
                  {question.answerType === 'multiple-choice' && (
                    <div className="space-y-3 pt-2">
                      <label className="text-sm font-medium text-gray-700">Answer Options</label>
                       {(question.answerOptions || []).map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <TextField
                              placeholder={`Option ${index + 1}`}
                              value={option.text}
                              onChange={(e) => handleAnswerOptionChange(question.id, index, e.target.value)}
                              fullWidth
                              variant="outlined"
                              InputProps={{ sx: {...fieldStyles, height: '40px'} }}
                            />
                            <Select
                              value={option.type}
                              onValueChange={(value) => handleAnswerOptionTypeChange(question.id, index, value as 'P' | 'N')}
                            >
                              <SelectTrigger className="w-28 h-10 border-gray-300 rounded-md">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="P">P</SelectItem>
                                <SelectItem value="N">N</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button onClick={() => handleRemoveAnswerOption(question.id, index)} variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1 h-10 w-10">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button onClick={() => handleAddAnswerOption(question.id)} variant="ghost" size="sm" className="text-red-600 hover:text-red-700 p-0 h-auto font-medium flex items-center">
                          <Plus className="w-4 h-4 mr-1" /> Add Option
                        </Button>
                    </div>
                  )}

                  {question.answerType === 'rating' && (
                     <FormControl fullWidth>
                        {/* <InputLabel shrink sx={{position: 'relative', top: '-8px', background: '#F9FAFB', paddingX: '4px'}}>Rating</InputLabel> */}
                        <div className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg bg-white">
                           {/* The div below is intentionally empty as per the previous request */}
                           <div className="flex w-full justify-between px-2 text-xs text-gray-500">
                           </div>
                           <div className="flex items-center gap-9"> {/* <-- This is the updated line */}
                            {[...Array(5)].map((_, index) => {
                              const ratingValue = index + 1;
                              return (
                                <Star
                                  key={ratingValue}
                                  className={`w-8 h-8 cursor-pointer transition-colors ${ratingValue <= (question.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                                  onClick={() => handleQuestionChange(question.id, 'rating', ratingValue)}
                                />
                              );
                            })}
                          </div>
                        </div>
                     </FormControl>
                  )}

                  {question.answerType === 'emojis' && (
                      <FormControl fullWidth>
                          {/* <InputLabel shrink sx={{position: 'relative', top: '-8px', background: '#F9FAFB', paddingX: '4px'}}>Select Reaction</InputLabel> */}
                           <div className="flex items-center justify-around p-3 border border-gray-200 rounded-lg bg-white">
                              {EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleQuestionChange(question.id, 'selectedEmoji', emoji)}
                                  className={`text-3xl p-2 rounded-full transition-transform transform hover:scale-125 ${question.selectedEmoji === emoji ? 'bg-red-100 scale-110' : ''}`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                      </FormControl>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={`mandatory-${question.id}`}
                      checked={question.mandatory}
                      onCheckedChange={(checked) => handleQuestionChange(question.id, 'mandatory', checked as boolean)}
                    />
                    <label htmlFor={`mandatory-${question.id}`} className="text-sm font-medium text-gray-700">
                      Mandatory
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button onClick={handleAddQuestion} variant="outline" className="border-dashed border-gray-300 hover:border-red-400 hover:text-red-600">
                <Plus className="w-4 h-4 mr-2" /> Add More Questions
              </Button>
            </div>
          </div>
        </div>

         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-white mb-4 rounded-t-lg px-6 py-3 px-6 py-4 border-b border-gray-200">
            <div className="text-lg text-black flex items-center">
              {/* This span has been updated to show a file icon */}
              <span className="w-8 h-8 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                {/* You can use an appropriate file icon from a library like react-icons or an SVG */}
                <ClipboardList size={16} color="#C72030" />
              </span>
              UPLOAD ICON
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-[#C72030] font-medium text-[14px]">Choose File</span>
                <span className="text-gray-500 text-[14px]">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'No file chosen'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById('file-upload')?.click()}
                className={`bg-[#f6f4ee] text-[#C72030] px-4 py-2 rounded text-sm flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                <span className="text-lg mr-2">+</span> Upload Files
              </button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {selectedFiles.map((file, index) => {
                  const isImage = file.type.startsWith('image/');
                  const isPdf = file.type === 'application/pdf';
                  const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                  const fileURL = URL.createObjectURL(file);
                  return (
                    <div
                      key={`${file.name}-${file.lastModified}`}
                      className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
                    >
                      {isImage ? (
                        <img
                          src={fileURL}
                          alt={file.name}
                          className="w-[40px] h-[40px] object-cover rounded border mb-1"
                        />
                      ) : isPdf ? (
                        <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6c-1.1 0-2 .9-2 2z"/><path d="M14 2v6h6"/></svg>
                        </div>
                      ) : isExcel ? (
                        <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="2"/><path d="M8 11h8M8 15h8"/></svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-600 bg-white mb-1">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="2"/></svg>
                        </div>
                      )}
                      <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                      <button
                        type="button"
                        className="absolute top-1 right-1 text-gray-600 hover:text-red-600 p-0"
                        onClick={() => removeSelectedFile(index)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button onClick={handleCreateSurvey} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 h-auto">
            {loading ? 'Creating...' : 'Create Survey'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2 h-auto">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};