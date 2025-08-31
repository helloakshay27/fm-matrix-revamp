
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 44 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface Question {
  id: string;
  questionText: string;
  inputType: string;
  mandatory: boolean;
  options: string[];
}

interface Section {
  id: string;
  sectionName: string;
  questions: Question[];
}

export const AddSurveyForm = () => {
  const navigate = useNavigate();
  const [createNew, setCreateNew] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  
  const [formData, setFormData] = useState({
    surveyName: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    targetAudience: '',
    template: '',
    ticketLevel: 'Question Level',
    assignedTo: '',
    ticketCategory: ''
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      sectionName: '',
      questions: [
        {
          id: '1',
          questionText: '',
          inputType: '',
          mandatory: false,
          options: []
        }
      ]
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (sectionId: string, field: string, value: any) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, [field]: value }
          : section
      )
    );
  };

  const handleQuestionChange = (sectionId: string, questionId: string, field: string, value: any) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.map(question => 
                question.id === questionId 
                  ? { ...question, [field]: value }
                  : question
              )
            }
          : section
      )
    );
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      sectionName: '',
      questions: [
        {
          id: Date.now().toString(),
          questionText: '',
          inputType: '',
          mandatory: false,
          options: []
        }
      ]
    };
    setSections(prev => [...prev, newSection]);
  };

  const removeSection = (sectionId: string) => {
    if (sections.length > 1) {
      setSections(prev => prev.filter(section => section.id !== sectionId));
    }
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      questionText: '',
      inputType: '',
      mandatory: false,
      options: []
    };
    
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    );
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              questions: section.questions.filter(question => question.id !== questionId)
            }
          : section
      )
    );
  };

  const handleSubmit = () => {
    console.log('Submitting survey form:', { formData, sections });
    alert('Survey form created successfully!');
    navigate('/surveys');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/surveys')}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <div className="text-sm text-gray-600 mb-1">Question</div>
          <h1 className="text-2xl font-bold">Add Question Form</h1>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={createNew} 
            onCheckedChange={setCreateNew}
            id="create-new"
          />
          <Label htmlFor="create-new">Create New</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={createTicket} 
            onCheckedChange={setCreateTicket}
            id="create-ticket"
          />
          <Label htmlFor="create-ticket">Create Ticket</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={weightage} 
            onCheckedChange={setWeightage}
            id="weightage"
          />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      {/* Create New Toggle Section */}
      {createNew && (
        <Card>
          <CardContent className="pt-6">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="template-label" shrink>Select from the existing Template</InputLabel>
                <MuiSelect
                  labelId="template-label"
                  label="Select from the existing Template"
                  displayEmpty
                  value={formData.template}
                  onChange={(e) => handleInputChange('template', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select from the existing Template</em></MenuItem>
                  <MenuItem value="template1">Customer Satisfaction Survey</MenuItem>
                  <MenuItem value="template2">Employee Feedback Survey</MenuItem>
                  <MenuItem value="template3">Product Feedback Survey</MenuItem>
                  <MenuItem value="custom">Custom Template</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Ticket Toggle Section */}
      {createTicket && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="survey-level" 
                    name="ticketLevel" 
                    value="Survey Level"
                    checked={formData.ticketLevel === 'Survey Level'}
                    onChange={(e) => handleInputChange('ticketLevel', e.target.value)}
                  />
                  <Label htmlFor="survey-level">Survey Level</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="question-level" 
                    name="ticketLevel" 
                    value="Question Level"
                    checked={formData.ticketLevel === 'Question Level'}
                    onChange={(e) => handleInputChange('ticketLevel', e.target.value)}
                  />
                  <Label htmlFor="question-level">Question Level</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id="assigned-to-label" shrink>Select Assigned To</InputLabel>
                    <MuiSelect
                      labelId="assigned-to-label"
                      label="Select Assigned To"
                      displayEmpty
                      value={formData.assignedTo}
                      onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Assigned To</em></MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="supervisor">Supervisor</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel id="ticket-category-label" shrink>Select Category</InputLabel>
                    <MuiSelect
                      labelId="ticket-category-label"
                      label="Select Category"
                      displayEmpty
                      value={formData.ticketCategory}
                      onChange={(e) => handleInputChange('ticketCategory', e.target.value)}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Category</em></MenuItem>
                      <MenuItem value="feedback">Feedback</MenuItem>
                      <MenuItem value="complaint">Complaint</MenuItem>
                      <MenuItem value="suggestion">Suggestion</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">1</span>
            Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surveyName">Survey Name*</Label>
              <TextField
                id="surveyName"
                placeholder="Enter Survey Name"
                value={formData.surveyName}
                onChange={(e) => handleInputChange('surveyName', e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 0.5 }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 0.5 }}>
                <InputLabel id="category-label" shrink>Select Category</InputLabel>
                <MuiSelect
                  labelId="category-label"
                  label="Select Category"
                  displayEmpty
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="customer-satisfaction">Customer Satisfaction</MenuItem>
                  <MenuItem value="employee-feedback">Employee Feedback</MenuItem>
                  <MenuItem value="product-feedback">Product Feedback</MenuItem>
                  <MenuItem value="service-quality">Service Quality</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <TextField
              id="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={3}
              InputLabelProps={{ shrink: false }}
              InputProps={{
                sx: {
                  '& textarea': {
                    height: 'auto',
                    overflow: 'hidden',
                    resize: 'none',
                    padding: '8px 14px',
                  },
                },
              }}
              sx={{ mt: 0.5 }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <TextField
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 0.5 }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <TextField
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 0.5 }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <FormControl fullWidth variant="outlined" sx={{ mt: 0.5 }}>
                <InputLabel id="target-audience-label" shrink>Target Audience</InputLabel>
                <MuiSelect
                  labelId="target-audience-label"
                  label="Target Audience"
                  displayEmpty
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Target Audience</em></MenuItem>
                  <MenuItem value="customers">Customers</MenuItem>
                  <MenuItem value="employees">Employees</MenuItem>
                  <MenuItem value="vendors">Vendors</MenuItem>
                  <MenuItem value="general-public">General Public</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      {sections.map((section, sectionIndex) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm">{sectionIndex + 2}</span>
                Section {sectionIndex + 1}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => addQuestion(section.id)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
                {sections.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(section.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`section-${section.id}`}>Section Name</Label>
              <TextField
                id={`section-${section.id}`}
                placeholder="Enter Section Name"
                value={section.sectionName}
                onChange={(e) => handleSectionChange(section.id, 'sectionName', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 0.5 }}
              />
            </div>

            {/* Questions */}
            {section.questions.map((question, questionIndex) => (
              <div key={question.id} className="p-4 border rounded-lg space-y-4 relative">
                {section.questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(section.id, question.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${question.id}`}>Question*</Label>
                    <TextField
                      id={`question-${question.id}`}
                      placeholder="Enter Question"
                      value={question.questionText}
                      onChange={(e) => handleQuestionChange(section.id, question.id, 'questionText', e.target.value)}
                      required
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: false }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 0.5 }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`input-type-${question.id}`}>Input Type</Label>
                    <FormControl fullWidth variant="outlined" sx={{ mt: 0.5 }}>
                      <InputLabel id={`input-type-${question.id}-label`} shrink>Input Type</InputLabel>
                      <MuiSelect
                        labelId={`input-type-${question.id}-label`}
                        label="Input Type"
                        displayEmpty
                        value={question.inputType}
                        onChange={(e) => handleQuestionChange(section.id, question.id, 'inputType', e.target.value)}
                        sx={fieldStyles}
                      >
                        <MenuItem value=""><em>Select Input Type</em></MenuItem>
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="textarea">Text Area</MenuItem>
                        <MenuItem value="radio">Radio Button</MenuItem>
                        <MenuItem value="checkbox">Checkbox</MenuItem>
                        <MenuItem value="dropdown">Dropdown</MenuItem>
                        <MenuItem value="rating">Rating Scale</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`mandatory-${question.id}`}
                    checked={question.mandatory}
                    onCheckedChange={(checked) => handleQuestionChange(section.id, question.id, 'mandatory', checked)}
                  />
                  <Label htmlFor={`mandatory-${question.id}`}>Mandatory</Label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Add Section Button */}
      <div className="flex justify-between">
        <Button
          onClick={addSection}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </Button>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/surveys')}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            style={{ backgroundColor: '#C72030' }}
            className="text-white"
          >
            Create Survey
          </Button>
        </div>
      </div>
    </div>
  );
};
