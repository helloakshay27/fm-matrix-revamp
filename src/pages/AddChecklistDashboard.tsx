
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowLeft, Cog, ListChecks } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem,
  Checkbox as MuiCheckbox, FormControlLabel,
} from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { FormSection, FormActionBar, assetFieldStyles } from '@/components/common/FormSection';

interface Question {
  id: number;
  text: string;
  answerType: string;
  mandatory: boolean;
}

const checkboxSx = { color: 'var(--color-primary)', '&.Mui-checked': { color: 'var(--color-primary)' } };

const requiredLabel = (text: string, show = true) => (
  <span>
    {text}
    {show && <span className="fm-required-mark">*</span>}
  </span>
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
    <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            type="button"
            onClick={() => navigate('/transitioning/fitout/checklist')}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Fitout Checklist</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Add Checklist</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ADD CHECKLIST</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Basic Information */}
        <FormSection title="BASIC INFORMATION" icon={Cog}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>{requiredLabel('Category')}</InputLabel>
              <MuiSelect
                label="Category*"
                notched
                displayEmpty
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
                <MenuItem value="plumbing">Plumbing</MenuItem>
                <MenuItem value="renovation">Renovation</MenuItem>
                <MenuItem value="safety">Safety</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>{requiredLabel('Sub Category')}</InputLabel>
              <MuiSelect
                label="Sub Category*"
                notched
                displayEmpty
                value={formData.subCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                sx={assetFieldStyles}
              >
                <MenuItem value="">Select Sub-Category</MenuItem>
                <MenuItem value="wiring">Wiring</MenuItem>
                <MenuItem value="fixtures">Fixtures</MenuItem>
                <MenuItem value="pipes">Pipes</MenuItem>
                <MenuItem value="fittings">Fittings</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label={requiredLabel('Checklist Title')}
              placeholder="Enter the title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: assetFieldStyles }}
            />
          </div>
        </FormSection>

        {/* Questions */}
        <FormSection
          title="QUESTIONS"
          icon={ListChecks}
          headerActions={
            <FormControl variant="outlined" size="small" sx={{ minWidth: 130 }}>
              <InputLabel shrink>No. of Questions</InputLabel>
              <MuiSelect
                label="No. of Questions"
                notched
                value={numberOfQuestions.toString()}
                onChange={(e) => handleNumberOfQuestionsChange(e.target.value)}
                sx={{ ...assetFieldStyles, backgroundColor: 'white' }}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                  <MenuItem key={num} value={num.toString()}>
                    {num.toString().padStart(2, '0')}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          }
        >
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm sm:text-base font-semibold text-gray-800">
                    Question {index + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="flex items-center justify-center w-8 h-8 rounded-md text-brand hover:bg-brand-light transition-colors"
                      aria-label="Remove question"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-1 lg:col-span-2">
                    <TextField
                      label={requiredLabel('Question Text')}
                      placeholder="Enter your Question"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: assetFieldStyles }}
                    />
                  </div>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>{requiredLabel('Answer Type')}</InputLabel>
                    <MuiSelect
                      label="Answer Type*"
                      notched
                      displayEmpty
                      value={question.answerType}
                      onChange={(e) => handleQuestionChange(question.id, 'answerType', e.target.value)}
                      sx={assetFieldStyles}
                    >
                      <MenuItem value="">Choose Answer Type</MenuItem>
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                      <MenuItem value="yes-no">Yes/No</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

                <div className="mt-2">
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        checked={question.mandatory}
                        onChange={(e) => handleQuestionChange(question.id, 'mandatory', e.target.checked)}
                        sx={checkboxSx}
                      />
                    }
                    label="Mandatory"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
                className="text-brand border-brand hover:bg-brand-light"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </Button>
            </div>
          </div>
        </FormSection>

        {/* Footer: original page had "Create Checklist" + "Proceed" (no Cancel).
            Proceed sits in the secondary slot so both handlers are preserved. */}
        <FormActionBar
          onCancel={handleProceed}
          cancelLabel="Proceed"
          onSubmit={handleCreateChecklist}
          submitLabel="Create Checklist"
        />
      </div>
    </div>
  );
};
