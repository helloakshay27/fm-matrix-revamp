
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox } from '@mui/material';

export const AddSurveyForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    surveyTitle: '',
    surveyType: '',
    description: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    category: '',
    priority: '',
    status: 'draft'
  });

  const [questions, setQuestions] = useState([
    { 
      id: Date.now(), 
      question: '', 
      type: 'text', 
      required: false,
      options: [''] 
    }
  ]);

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '12px', sm: '13px', md: '14px' },
    },
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    setQuestions([...questions, { 
      id: Date.now(), 
      question: '', 
      type: 'text', 
      required: false,
      options: [''] 
    }]);
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const addOption = (questionId: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
      } : q
    ));
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? {
        ...q,
        options: q.options.filter((_, idx) => idx !== optionIndex)
      } : q
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Survey Data:', { ...formData, questions });
    
    toast({
      title: "Success",
      description: "Survey created successfully!",
    });
    
    navigate('/maintenance/survey');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/survey')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Survey List
        </Button>
        <p className="text-[#1a1a1a] opacity-70 mb-2">Survey &gt; Add Survey</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD SURVEY</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
              SURVEY DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Survey Title"
                  placeholder="Enter Survey Title"
                  name="surveyTitle"
                  value={formData.surveyTitle}
                  onChange={(e) => handleInputChange('surveyTitle', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="survey-type-label" shrink>Survey Type</InputLabel>
                  <MuiSelect
                    labelId="survey-type-label"
                    label="Survey Type"
                    displayEmpty
                    value={formData.surveyType}
                    onChange={(e) => handleInputChange('surveyType', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Type</em></MenuItem>
                    <MenuItem value="feedback">Feedback</MenuItem>
                    <MenuItem value="satisfaction">Satisfaction</MenuItem>
                    <MenuItem value="evaluation">Evaluation</MenuItem>
                    <MenuItem value="poll">Poll</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="target-audience-label" shrink>Target Audience</InputLabel>
                  <MuiSelect
                    labelId="target-audience-label"
                    label="Target Audience"
                    displayEmpty
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Audience</em></MenuItem>
                    <MenuItem value="employees">Employees</MenuItem>
                    <MenuItem value="customers">Customers</MenuItem>
                    <MenuItem value="vendors">Vendors</MenuItem>
                    <MenuItem value="all">All Users</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <TextField
                  required
                  label="Start Date"
                  placeholder="Select Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      ...fieldStyles,
                      '& .MuiInputBase-input': {
                        ...fieldStyles['& .MuiInputBase-input, & .MuiSelect-select'],
                        fontSize: { xs: '11px', sm: '12px', md: '13px' },
                      }
                    }
                  }}
                />
              </div>

              <div>
                <TextField
                  label="End Date"
                  placeholder="Select Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    sx: {
                      ...fieldStyles,
                      '& .MuiInputBase-input': {
                        ...fieldStyles['& .MuiInputBase-input, & .MuiSelect-select'],
                        fontSize: { xs: '11px', sm: '12px', md: '13px' },
                      }
                    }
                  }}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="priority-label" shrink>Priority</InputLabel>
                  <MuiSelect
                    labelId="priority-label"
                    label="Priority"
                    displayEmpty
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Priority</em></MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="mb-4">
              <TextField
                label="Description"
                placeholder="Enter survey description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
                SURVEY QUESTIONS
              </div>
              <Button 
                type="button"
                onClick={addQuestion}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Question {index + 1}</h3>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeQuestion(question.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <TextField
                        required
                        label="Question"
                        placeholder="Enter your question"
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                      />
                    </div>
                    
                    <div>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id={`question-type-${question.id}`} shrink>Question Type</InputLabel>
                        <MuiSelect
                          labelId={`question-type-${question.id}`}
                          label="Question Type"
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                          sx={fieldStyles}
                        >
                          <MenuItem value="text">Text</MenuItem>
                          <MenuItem value="textarea">Long Text</MenuItem>
                          <MenuItem value="radio">Single Choice</MenuItem>
                          <MenuItem value="checkbox">Multiple Choice</MenuItem>
                          <MenuItem value="rating">Rating Scale</MenuItem>
                          <MenuItem value="date">Date</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={question.required}
                        onChange={(e) => updateQuestion(question.id, 'required', e.target.checked)}
                      />
                      <span>Required Question</span>
                    </label>
                  </div>

                  {/* Options for radio and checkbox types */}
                  {(question.type === 'radio' || question.type === 'checkbox') && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Options</h4>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addOption(question.id)}
                          className="text-sm"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2 items-center">
                          <TextField
                            label={`Option ${optionIndex + 1}`}
                            placeholder="Enter option"
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            fullWidth
                            variant="outlined"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                          />
                          {question.options.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => removeOption(question.id, optionIndex)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            type="submit"
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Create Survey
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate('/maintenance/survey')}
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
