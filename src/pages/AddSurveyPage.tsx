import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Copy, Trash2, Eye, Plus, MapPin, Minus, AlignLeft, Circle, Square, ChevronDown, Upload, BarChart3, Star, Grid3X3, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { QuestionContent } from '@/components/QuestionContent';

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
    <div className="min-h-screen min-w-full bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 bg-gray-100 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-2xl font-semibold text-black mb-2">
                Survey Title
              </div>
              <div className="text-gray-600">
                Description
              </div>
            </div>
            
            <div className="flex items-center gap-6 ml-6">
              <div className="flex items-center gap-2">
                <span className="text-sm">Create Ticket</span>
                <Switch
                  checked={createTicket}
                  onCheckedChange={setCreateTicket}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Type:</span>
                <span className="text-sm font-medium">Survey</span>
                <Switch
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Feedback</span>
                <Switch
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
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
                <div key={question.id} className="border border-gray-200 rounded-lg mb-4">
                  {/* Question Header */}
                  <div className="border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-between">
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
                        className="border-none p-0 focus-visible:ring-0 bg-transparent font-medium"
                        placeholder="Question"
                      />
                      
                      <div className="flex items-center gap-2">
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
                          <SelectTrigger className="w-48 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Short answer">
                              <div className="flex items-center gap-2">
                                <Minus className="w-4 h-4" />
                                Short answer
                              </div>
                            </SelectItem>
                            <SelectItem value="Paragraph">
                              <div className="flex items-center gap-2">
                                <AlignLeft className="w-4 h-4" />
                                Paragraph
                              </div>
                            </SelectItem>
                            <SelectItem value="Multiple choice">
                              <div className="flex items-center gap-2">
                                <Circle className="w-4 h-4" />
                                Multiple choice
                              </div>
                            </SelectItem>
                            <SelectItem value="Checkboxes">
                              <div className="flex items-center gap-2">
                                <Square className="w-4 h-4" />
                                Checkboxes
                              </div>
                            </SelectItem>
                            <SelectItem value="Dropdown">
                              <div className="flex items-center gap-2">
                                <ChevronDown className="w-4 h-4" />
                                Dropdown
                              </div>
                            </SelectItem>
                            <SelectItem value="File Upload">
                              <div className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                File Upload
                              </div>
                            </SelectItem>
                            <SelectItem value="Linear scale">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Linear scale
                              </div>
                            </SelectItem>
                            <SelectItem value="Rating">
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Rating
                              </div>
                            </SelectItem>
                            <SelectItem value="Multiple choice grid">
                              <div className="flex items-center gap-2">
                                <Grid3X3 className="w-4 h-4" />
                                Multiple choice grid
                              </div>
                            </SelectItem>
                            <SelectItem value="Tick box grid">
                              <div className="flex items-center gap-2">
                                <Grid3X3 className="w-4 h-4" />
                                Tick box grid
                              </div>
                            </SelectItem>
                            <SelectItem value="Date">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                Date
                              </div>
                            </SelectItem>
                            <SelectItem value="Time">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Time
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Question Content - Now Dynamic */}
                  <QuestionContent questionType={question.type} />
                  
                  {/* Question Footer */}
                  <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateQuestion(section.id, question.id)}
                        className="p-2"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteQuestion(section.id, question.id)}
                        className="p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Required</span>
                      <div className="relative">
                        {question.required ? (
                          <div className="w-6 h-3 bg-red-600 rounded-full relative cursor-pointer"
                               onClick={() => setSections(sections.map(s => 
                                 s.id === section.id 
                                   ? {
                                       ...s,
                                       questions: s.questions.map(q => 
                                         q.id === question.id ? { ...q, required: false } : q
                                       )
                                     }
                                   : s
                               ))}>
                            <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                          </div>
                        ) : (
                          <div className="w-6 h-3 bg-gray-300 rounded-full relative cursor-pointer"
                               onClick={() => setSections(sections.map(s => 
                                 s.id === section.id 
                                   ? {
                                       ...s,
                                       questions: s.questions.map(q => 
                                         q.id === question.id ? { ...q, required: true } : q
                                       )
                                     }
                                   : s
                               ))}>
                            <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                          </div>
                        )}
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
