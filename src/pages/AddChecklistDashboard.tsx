import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface Question {
  id: number;
  text: string;
  answerType: string;
  mandatory: boolean;
}

export const AddChecklistDashboard = () => {
  const navigate = useNavigate();
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
    toast.success('Checklist created successfully!');
    navigate('/transitioning/fitout/checklist');
  };

  const handleProceed = () => {
    console.log('Proceeding with checklist creation...');
    toast.success('Proceeding to next step...');
  };

  return (
    <div className="p-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          Fitout &gt; Fitout checklist &gt; add checklist
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-[#C72030]">Add checklist</h1>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="renovation">Renovation</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subCategory" className="text-sm font-medium">
              Sub Category <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.subCategory} onValueChange={(value) => setFormData(prev => ({...prev, subCategory: value}))}>
              <SelectTrigger>
                <SelectValue placeholder="Select Sub-Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wiring">Wiring</SelectItem>
                <SelectItem value="fixtures">Fixtures</SelectItem>
                <SelectItem value="pipes">Pipes</SelectItem>
                <SelectItem value="fittings">Fittings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter the title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            />
          </div>
        </div>

        {/* Number of Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Add No. of Questions</h3>
            <span className="text-lg font-semibold">No. of Questions</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={numberOfQuestions.toString()} onValueChange={handleNumberOfQuestionsChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={handleAddQuestion}
              className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 text-white p-0"
            >
              <Plus className="w-4 h-4 text-white stroke-white" />
            </Button>
            <span className="text-lg">{questions.length}</span>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">New Question</h4>
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

              <div className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Enter your Question"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Plus className="w-6 h-6 text-gray-400 border rounded-full border-gray-300 p-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Select Answer Type</Label>
                    <Select 
                      value={question.answerType} 
                      onValueChange={(value) => handleQuestionChange(question.id, 'answerType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Answer Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="yes-no">Yes/No</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`mandatory-${question.id}`}
                      checked={question.mandatory}
                      onCheckedChange={(checked) => handleQuestionChange(question.id, 'mandatory', checked as boolean)}
                    />
                    <Label htmlFor={`mandatory-${question.id}`} className="text-sm font-medium">
                      Mandatory
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleCreateChecklist}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
        >
          Create Checklist
        </Button>
        <Button
          onClick={handleProceed}
          variant="outline"
          className="border-gray-300 px-8"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};
