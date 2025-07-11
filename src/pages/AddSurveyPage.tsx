
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Copy, Trash2, MoreVertical, Eye } from "lucide-react";
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
  required: boolean;
}

interface Section {
  id: string;
  sectionName: string;
  description: string;
  questions: Question[];
}

export const AddSurveyPage = () => {
  const navigate = useNavigate();
  const [createTicket, setCreateTicket] = useState(true);
  const [surveyType, setSurveyType] = useState('Survey');
  const [feedback, setFeedback] = useState('Feedback');
  
  const [formData, setFormData] = useState({
    surveyTitle: 'Survey Title',
    description: 'Description'
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      sectionName: 'Untitled Section',
      description: 'Description',
      questions: [
        {
          id: '1',
          questionText: 'Question',
          inputType: 'Short answer',
          required: true
        },
        {
          id: '2',
          questionText: 'Question',
          inputType: 'Short answer',
          required: true
        }
      ]
    }
  ]);

  const [association, setAssociation] = useState({
    location: '',
    startDate: '',
    endDate: ''
  });

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      questionText: 'Question',
      inputType: 'Short answer',
      required: false
    };
    
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    );
  };

  const handleSubmit = () => {
    console.log('Submitting survey:', { formData, sections, association });
    alert('Survey saved successfully!');
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', { formData, sections, association });
    alert('Survey saved as draft!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/surveys')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Main Survey Card */}
        <Card className="w-full">
          <CardContent className="p-8">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex-1">
                <TextField
                  value={formData.surveyTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, surveyTitle: e.target.value }))}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: '2rem', fontWeight: 'bold' }
                  }}
                  fullWidth
                />
                <TextField
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: '1rem', color: '#666', marginTop: '8px' }
                  }}
                  fullWidth
                />
              </div>
              
              <div className="flex items-center gap-4 ml-8">
                <div className="flex items-center gap-2">
                  <Label>Create Ticket</Label>
                  <Switch 
                    checked={createTicket} 
                    onCheckedChange={setCreateTicket}
                    className="data-[state=checked]:bg-[#C72030]"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label>Type:</Label>
                  <Button 
                    variant="outline" 
                    className="bg-[#C72030] text-white border-[#C72030] hover:bg-[#A01B28]"
                  >
                    {surveyType}
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  className="bg-[#C72030] text-white border-[#C72030] hover:bg-[#A01B28]"
                >
                  {feedback}
                </Button>
              </div>
            </div>

            {/* Section */}
            {sections.map((section, sectionIndex) => (
              <div key={section.id} className="mb-8">
                <div className="bg-[#C72030] text-white px-4 py-2 rounded-t-lg">
                  <span className="font-medium">Section {sectionIndex + 1} of {sections.length}</span>
                </div>
                
                <div className="border border-t-0 rounded-b-lg p-6">
                  <TextField
                    value={section.sectionName}
                    onChange={(e) => setSections(prev => 
                      prev.map(s => s.id === section.id ? { ...s, sectionName: e.target.value } : s)
                    )}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }
                    }}
                    fullWidth
                  />
                  
                  <TextField
                    value={section.description}
                    onChange={(e) => setSections(prev => 
                      prev.map(s => s.id === section.id ? { ...s, description: e.target.value } : s)
                    )}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                      style: { fontSize: '0.875rem', color: '#666' }
                    }}
                    fullWidth
                  />

                  {/* Questions */}
                  <div className="mt-6 space-y-4">
                    {section.questions.map((question, questionIndex) => (
                      <div key={question.id} className="border-l-4 border-[#C72030] pl-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <TextField
                              value={question.questionText}
                              onChange={(e) => setSections(prev => 
                                prev.map(s => s.id === section.id ? {
                                  ...s,
                                  questions: s.questions.map(q => 
                                    q.id === question.id ? { ...q, questionText: e.target.value } : q
                                  )
                                } : s)
                              )}
                              variant="standard"
                              InputProps={{
                                disableUnderline: true,
                                style: { fontSize: '1rem', fontWeight: '500' }
                              }}
                              fullWidth
                            />
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-4">
                                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                                  <MuiSelect
                                    value={question.inputType}
                                    onChange={(e) => setSections(prev => 
                                      prev.map(s => s.id === section.id ? {
                                        ...s,
                                        questions: s.questions.map(q => 
                                          q.id === question.id ? { ...q, inputType: e.target.value } : q
                                        )
                                      } : s)
                                    )}
                                    disableUnderline
                                  >
                                    <MenuItem value="Short answer">Short answer</MenuItem>
                                    <MenuItem value="Long answer">Long answer</MenuItem>
                                    <MenuItem value="Multiple choice">Multiple choice</MenuItem>
                                    <MenuItem value="Checkboxes">Checkboxes</MenuItem>
                                    <MenuItem value="Dropdown">Dropdown</MenuItem>
                                  </MuiSelect>
                                </FormControl>
                                
                                <span className="text-sm text-gray-500">Short- answer text</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                                <div className="flex items-center gap-2 ml-4">
                                  <Label className="text-sm">Required</Label>
                                  <Switch 
                                    checked={question.required}
                                    onCheckedChange={(checked) => setSections(prev => 
                                      prev.map(s => s.id === section.id ? {
                                        ...s,
                                        questions: s.questions.map(q => 
                                          q.id === question.id ? { ...q, required: checked } : q
                                        )
                                      } : s)
                                    )}
                                    className="data-[state=checked]:bg-[#C72030]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => addQuestion(section.id)}
                    variant="ghost" 
                    className="mt-4 text-[#C72030] hover:text-[#A01B28]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </div>
            ))}

            {/* Association Section */}
            <div className="mt-8 border-t pt-8">
              <h3 className="text-xl font-semibold mb-6">Association</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Location</Label>
                  <FormControl fullWidth variant="outlined">
                    <MuiSelect
                      displayEmpty
                      value={association.location}
                      onChange={(e) => setAssociation(prev => ({ ...prev, location: e.target.value }))}
                      sx={fieldStyles}
                      startAdornment={<span className="mr-2">📍</span>}
                    >
                      <MenuItem value=""><em>Select Location</em></MenuItem>
                      <MenuItem value="location1">Location 1</MenuItem>
                      <MenuItem value="location2">Location 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Validity</Label>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Start Date</Label>
                    <TextField
                      type="date"
                      value={association.startDate}
                      onChange={(e) => setAssociation(prev => ({ ...prev, startDate: e.target.value }))}
                      placeholder="dd/mm/yy"
                      fullWidth
                      variant="outlined"
                      InputProps={{ sx: fieldStyles }}
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  <div className="w-full">
                    <Label className="text-xs text-gray-500 mb-2 block">End Date</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">To</span>
                      <TextField
                        type="date"
                        value={association.endDate}
                        onChange={(e) => setAssociation(prev => ({ ...prev, endDate: e.target.value }))}
                        placeholder="dd/mm/yy"
                        fullWidth
                        variant="outlined"
                        InputProps={{ sx: fieldStyles }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
                className="px-8 py-2 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
              >
                Save As Draft
              </Button>
              <Button 
                onClick={handleSubmit}
                className="px-8 py-2 bg-[#C72030] text-white hover:bg-[#A01B28]"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
