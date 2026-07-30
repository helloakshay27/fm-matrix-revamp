
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { TextField, FormControl, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  text: string;
  answerType: string;
  mandatory: boolean;
}

// Label with a trailing rule, sitting above a field - matches the reference UI.
const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => (
  <div className="flex items-center gap-2 mb-1.5">
    <span className="text-sm text-gray-500 whitespace-nowrap">
      {label}
      {required && <span className="text-[#C72030] ml-0.5">*</span>}
    </span>
    <div className="flex-1 h-px" />
  </div>
);

const selectFieldSx = {
  borderRadius: '8px',
  height: '44px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9ca3af' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#C72030' },
};

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': { borderColor: '#d1d5db' },
    '&:hover fieldset': { borderColor: '#9ca3af' },
    '&.Mui-focused fieldset': { borderColor: '#C72030' },
  },
};

// Section header bar - numbered badge + title, optional action button on the right.
const SectionHeader = ({
  step,
  title,
  action,
}: {
  step: number;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] font-semibold text-sm">
        {step}
      </span>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {action}
  </div>
);

export const AddChecklistDashboard = () => {
  const navigate = useNavigate();
  const { toast: showToast } = useToast();
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    title: ''
  });
  const [numberOfQuestions, setNumberOfQuestions] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, text: '', answerType: '', mandatory: false }
  ]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      answerType: '',
      mandatory: false
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleRemoveQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleQuestionChange = (id: number, field: keyof Question, value: string | boolean) => {
    setQuestions(prev => prev.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleNumberOfQuestionsChange = (value: string) => {
    const num = parseInt(value);
    setNumberOfQuestions(num);

    if (num > questions.length) {
      const newQuestions = Array.from({ length: num - questions.length }, (_, i) => ({
        id: Date.now() + i,
        text: '',
        answerType: '',
        mandatory: false
      }));
      setQuestions(prev => [...prev, ...newQuestions]);
    } else if (num < questions.length) {
      setQuestions(prev => prev.slice(0, num));
    }
  };

  const handleCreateChecklist = () => {
    console.log('Creating checklist:', { formData, questions });
    showToast({
      title: "Success",
      description: "Checklist created successfully!",
    });
    navigate('/transitioning/fitout/checklist');
  };

  const handleProceed = () => {
    console.log('Proceeding with checklist creation...');
    showToast({
      title: "Success",
      description: "Proceeding to next step...",
    });
  };

  return (
    <div className="p-6 bg-[#F6F4EE] min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          Fitout &gt; Fitout checklist &gt; add checklist
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-[#C72030]">Add checklist</h1>
      </div>

      <div className="space-y-6 max-w-6xl">
        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader step={1} title="Basic Information" />
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <FieldLabel label="Category" required />
                <FormControl fullWidth variant="outlined">
                  <MuiSelect
                    displayEmpty
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    sx={selectFieldSx}
                  >
                    <MenuItem value=""><em>Select Category</em></MenuItem>
                    <MenuItem value="electrical">Electrical</MenuItem>
                    <MenuItem value="plumbing">Plumbing</MenuItem>
                    <MenuItem value="renovation">Renovation</MenuItem>
                    <MenuItem value="safety">Safety</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <FieldLabel label="Sub Category" required />
                <FormControl fullWidth variant="outlined">
                  <MuiSelect
                    displayEmpty
                    value={formData.subCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                    sx={selectFieldSx}
                  >
                    <MenuItem value=""><em>Select Sub-Category</em></MenuItem>
                    <MenuItem value="wiring">Wiring</MenuItem>
                    <MenuItem value="fixtures">Fixtures</MenuItem>
                    <MenuItem value="pipes">Pipes</MenuItem>
                    <MenuItem value="fittings">Fittings</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <FieldLabel label="Checklist Title" required />
                <TextField
                  placeholder="Enter the title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  InputProps={{ sx: { height: '44px' } }}
                  sx={textFieldSx}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Questions */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <SectionHeader
            step={2}
            title="Questions"
            action={
              <Button
                type="button"
                onClick={handleAddQuestion}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            }
          />

          <div className="p-6 space-y-6">
            {/* Bulk-set number of questions */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">No. of Questions</span>
              <FormControl variant="outlined" sx={{ width: 80 }}>
                <MuiSelect
                  displayEmpty
                  value={numberOfQuestions.toString()}
                  onChange={(e) => handleNumberOfQuestionsChange(e.target.value)}
                  sx={{ ...selectFieldSx, height: '36px' }}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <MenuItem key={num} value={num.toString()}>
                      {num.toString().padStart(2, '0')}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <span className="text-sm text-gray-500">{questions.length} question(s)</span>
            </div>

            {/* Question Cards */}
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Question {index + 1}</h4>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <FieldLabel label="Question Text" required />
                    <TextField
                      placeholder="Enter your Question"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputProps={{ sx: { height: '44px' } }}
                      sx={textFieldSx}
                    />
                  </div>

                  <div>
                    <FieldLabel label="Answer Type" required />
                    <FormControl fullWidth variant="outlined">
                      <MuiSelect
                        displayEmpty
                        value={question.answerType}
                        onChange={(e) => handleQuestionChange(question.id, 'answerType', e.target.value)}
                        sx={selectFieldSx}
                      >
                        <MenuItem value=""><em>Choose Answer Type</em></MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                        <MenuItem value="yes-no">Yes/No</MenuItem>
                        <MenuItem value="rating">Rating</MenuItem>
                        <MenuItem value="number">Number</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`mandatory-${question.id}`}
                    checked={question.mandatory}
                    onCheckedChange={(checked) => handleQuestionChange(question.id, 'mandatory', checked as boolean)}
                    className="border-[#C72030] data-[state=checked]:bg-white data-[state=checked]:text-[#C72030] data-[state=checked]:border-[#C72030]"
                  />
                  <label htmlFor={`mandatory-${question.id}`} className="text-sm font-medium text-gray-900">
                    Mandatory
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={handleCreateChecklist}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
        >
          Create Checklist
        </Button>
        <Button
          onClick={handleProceed}
          variant="outline"
          className="border-brand text-brand hover:bg-brand-selected px-8"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};
