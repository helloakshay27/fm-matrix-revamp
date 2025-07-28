
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface Question {
  id: string;
  text: string;
  answerType: string;
  mandatory: boolean;
  answerOptions?: string[];
}

export const AddSurveyPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(2);
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', answerType: '', mandatory: false },
    { id: '2', text: '', answerType: '', mandatory: false }
  ]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      answerType: '',
      mandatory: false
    };
    setQuestions([...questions, newQuestion]);
    setNumberOfQuestions(questions.length + 1);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
      setNumberOfQuestions(questions.length - 1);
    }
  };

  const handleQuestionChange = (id: string, field: keyof Question, value: string | boolean | string[]) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleAddAnswerOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, answerOptions: [...(q.answerOptions || []), ''] }
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
              index === optionIndex ? value : option
            )
          }
        : q
    ));
  };

  const handleCreateSurvey = () => {
    console.log('Creating survey...', { category, title, questions });
    navigate('/maintenance/survey/list');
  };

  const handleProceed = () => {
    console.log('Proceeding...', { category, title, questions });
    navigate('/maintenance/survey/list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">ADD SURVEY</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category*
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title*
              </label>
              <Input
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Add Questions Section */}
          <div className="mb-8">
            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-red-600 uppercase tracking-wide">ADD NO. OF QUESTIONS</h2>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Select 
                    value={numberOfQuestions.toString().padStart(2, '0')} 
                    onValueChange={(value) => setNumberOfQuestions(parseInt(value))}
                  >
                    <SelectTrigger className="w-20 border-red-200 focus:border-red-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString().padStart(2, '0')}>
                          {num.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAddQuestion}
                    size="sm"
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-gray-600 font-medium">No. of Questions</span>
                <span className="font-bold text-red-600">{numberOfQuestions}</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questions.map((question) => (
                <div key={question.id} className="border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 uppercase tracking-wide">NEW QUESTION</h3>
                    {questions.length > 1 && (
                      <Button
                        onClick={() => handleRemoveQuestion(question.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Textarea
                      placeholder="Enter your Question"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                      className="min-h-[80px] resize-none"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Answer Type
                      </label>
                      <Select 
                        value={question.answerType} 
                        onValueChange={(value) => handleQuestionChange(question.id, 'answerType', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose Answer Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="dropdown">Dropdown</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Multiple Choice Answer Options */}
                    {question.answerType === 'multiple-choice' && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Answer Options</span>
                        </div>
                        
                        {(question.answerOptions || ['', '']).map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Select defaultValue="P">
                              <SelectTrigger className="w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="P">P</SelectItem>
                                <SelectItem value="N">N</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Answer Option"
                              value={option}
                              onChange={(e) => handleAnswerOptionChange(question.id, index, e.target.value)}
                              className="flex-1"
                            />
                            {(question.answerOptions?.length || 0) > 2 && (
                              <Button
                                onClick={() => handleRemoveAnswerOption(question.id, index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        
                        <Button
                          onClick={() => handleAddAnswerOption(question.id)}
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 p-0 h-auto font-medium"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Answer Option
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`mandatory-${question.id}`}
                        checked={question.mandatory}
                        onCheckedChange={(checked) => 
                          handleQuestionChange(question.id, 'mandatory', checked as boolean)
                        }
                      />
                      <label 
                        htmlFor={`mandatory-${question.id}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Mandatory
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Questions Button */}
            <div className="flex justify-center mt-6">
              <Button
                onClick={handleAddQuestion}
                variant="outline"
                className="border-dashed border-red-300 hover:border-red-500 hover:text-red-600 hover:bg-red-50 font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More Questions
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
            <Button
              onClick={handleCreateSurvey}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wide"
            >
              Create Survey
            </Button>
            <Button
              onClick={handleProceed}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 px-8 py-3 rounded-lg font-bold uppercase tracking-wide"
            >
              Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
