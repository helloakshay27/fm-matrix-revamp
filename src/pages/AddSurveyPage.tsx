
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Copy, Trash2, Eye, Plus, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  type: string;
  required: boolean;
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const AddSurveyPage = () => {
  const navigate = useNavigate();
  const [surveyTitle, setSurveyTitle] = useState('Survey Title');
  const [description, setDescription] = useState('Description');
  const [createTicket, setCreateTicket] = useState(true);
  const [surveyType, setSurveyType] = useState('Survey');
  const [feedback, setFeedback] = useState('Feedback');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Untitled Section',
      description: 'Description',
      questions: [
        { id: '1', text: 'Question', type: 'Short answer', required: true },
        { id: '2', text: 'Question', type: 'Short answer', required: true }
      ]
    }
  ]);

  const addQuestion = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: [...section.questions, {
              id: Date.now().toString(),
              text: 'Question',
              type: 'Short answer',
              required: false
            }]
          }
        : section
    ));
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.filter(q => q.id !== questionId)
          }
        : section
    ));
  };

  const duplicateQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.reduce((acc, q) => {
              acc.push(q);
              if (q.id === questionId) {
                acc.push({
                  ...q,
                  id: Date.now().toString()
                });
              }
              return acc;
            }, [] as Question[])
          }
        : section
    ));
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft...');
    navigate('/maintenance/survey/list');
  };

  const handleSubmit = () => {
    console.log('Submitting survey...');
    navigate('/maintenance/survey/list');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Input
                value={surveyTitle}
                onChange={(e) => setSurveyTitle(e.target.value)}
                className="text-2xl font-semibold border-none p-0 focus-visible:ring-0 bg-transparent"
                placeholder="Survey Title"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 border-none p-0 focus-visible:ring-0 bg-transparent resize-none text-gray-600"
                placeholder="Description"
                rows={1}
              />
            </div>
            
            <div className="flex items-center gap-6 ml-6">
              <div className="flex items-center gap-2">
                <Label htmlFor="create-ticket">Create Ticket</Label>
                <Switch
                  id="create-ticket"
                  checked={createTicket}
                  onCheckedChange={setCreateTicket}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor="survey-type">Type:</Label>
                <Select value={surveyType} onValueChange={setSurveyType}>
                  <SelectTrigger className="w-32 border-none bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Survey">Survey</SelectItem>
                    <SelectItem value="Poll">Poll</SelectItem>
                    <SelectItem value="Quiz">Quiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={feedback} onValueChange={setFeedback}>
                  <SelectTrigger className="w-32 border-none bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Feedback">Feedback</SelectItem>
                    <SelectItem value="Rating">Rating</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="p-6">
          {sections.map((section, sectionIndex) => (
            <div key={section.id} className="mb-8">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">
                  Section {sectionIndex + 1} of {sections.length}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <Input
                  value={section.title}
                  onChange={(e) => setSections(sections.map(s => 
                    s.id === section.id ? { ...s, title: e.target.value } : s
                  ))}
                  className="text-lg font-medium border-none p-0 focus-visible:ring-0 bg-transparent mb-2"
                  placeholder="Section Title"
                />
                <Textarea
                  value={section.description}
                  onChange={(e) => setSections(sections.map(s => 
                    s.id === section.id ? { ...s, description: e.target.value } : s
                  ))}
                  className="border-none p-0 focus-visible:ring-0 bg-transparent resize-none text-gray-600"
                  placeholder="Description"
                  rows={1}
                />
              </div>

              {/* Questions */}
              {section.questions.map((question, questionIndex) => (
                <div key={question.id} className="border-l-4 border-red-600 pl-6 py-4 mb-4 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <Input
                          value={question.text}
                          onChange={(e) => setSections(sections.map(s => 
                            s.id === section.id 
                              ? {
                                  ...s,
                                  questions: s.questions.map(q => 
                                    q.id === question.id ? { ...q, text: e.target.value } : q
                                  )
                                }
                              : s
                          ))}
                          className="flex-1 border-b border-gray-300 border-t-0 border-l-0 border-r-0 rounded-none p-0 focus-visible:ring-0"
                          placeholder="Question"
                        />
                        
                        <Select 
                          value={question.type} 
                          onValueChange={(value) => setSections(sections.map(s => 
                            s.id === section.id 
                              ? {
                                  ...s,
                                  questions: s.questions.map(q => 
                                    q.id === question.id ? { ...q, type: value } : q
                                  )
                                }
                              : s
                          ))}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Short answer">Short answer</SelectItem>
                            <SelectItem value="Long answer">Long answer</SelectItem>
                            <SelectItem value="Multiple choice">Multiple choice</SelectItem>
                            <SelectItem value="Checkboxes">Checkboxes</SelectItem>
                            <SelectItem value="Dropdown">Dropdown</SelectItem>
                            <SelectItem value="Rating">Rating</SelectItem>
                            <SelectItem value="Date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="text-gray-500 text-sm mb-4">
                        {question.type} text
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateQuestion(section.id, question.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(section.id, question.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`required-${question.id}`}>Required</Label>
                        <Switch
                          id={`required-${question.id}`}
                          checked={question.required}
                          onCheckedChange={(checked) => setSections(sections.map(s => 
                            s.id === section.id 
                              ? {
                                  ...s,
                                  questions: s.questions.map(q => 
                                    q.id === question.id ? { ...q, required: checked } : q
                                  )
                                }
                              : s
                          ))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Question Button */}
              <Button
                variant="ghost"
                onClick={() => addQuestion(section.id)}
                className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Association Section */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Association</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Location */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Location</Label>
              <Select>
                <SelectTrigger>
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location1">Location 1</SelectItem>
                  <SelectItem value="location2">Location 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Validity Dates */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Validity</Label>
              <div className="flex items-center gap-2">
                <div>
                  <Label className="text-xs text-gray-500">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yy") : "dd/mm/yy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <span className="text-gray-500 mt-4">To</span>
                
                <div>
                  <Label className="text-xs text-gray-500">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yy") : "dd/mm/yy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleSaveAsDraft}
            className="px-8 py-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            Save As Draft
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
