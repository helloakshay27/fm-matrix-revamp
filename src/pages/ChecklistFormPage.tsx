import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  answerType: string;
  mandatory: boolean;
}

export const ChecklistFormPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    checklistName: '',
    type: '',
    assetType: '',
    description: '',
    status: 'Active'
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: '',
      answerType: 'text',
      mandatory: false
    }
  ]);

  const handleGoBack = () => {
    navigate('/master/checklist');
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      answerType: 'text',
      mandatory: false
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleQuestionChange = (id: number, field: keyof Question, value: string | boolean) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleSubmit = () => {
    const checklistData = {
      ...formData,
      questions: questions
    };
    console.log('Checklist data:', checklistData);
    // Here you would save the data
    navigate('/master/checklist');
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Breadcrumb and Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to List
          </Button>
          <div className="text-sm text-muted-foreground">
            Master / Checklist Management / Create New
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Create New Checklist</h1>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checklistName">Checklist Name *</Label>
                <Input
                  id="checklistName"
                  value={formData.checklistName}
                  onChange={(e) => setFormData({ ...formData, checklistName: e.target.value })}
                  placeholder="Enter checklist name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PPM">PPM (Preventive Maintenance)</SelectItem>
                    <SelectItem value="Breakdown">Breakdown</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type *</Label>
                <Select value={formData.assetType} onValueChange={(value) => setFormData({ ...formData, assetType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HVAC Equipment">HVAC Equipment</SelectItem>
                    <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                    <SelectItem value="Generator">Generator</SelectItem>
                    <SelectItem value="Elevator">Elevator</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter checklist description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questions ({questions.length})</CardTitle>
            <Button onClick={handleAddQuestion} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Question {index + 1}</Badge>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Question Text *</Label>
                  <Textarea
                    value={question.text}
                    onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                    placeholder="Enter question text"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Answer Type</Label>
                    <Select
                      value={question.answerType}
                      onValueChange={(value) => handleQuestionChange(question.id, 'answerType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="yes_no">Yes/No</SelectItem>
                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                        <SelectItem value="rating">Rating (1-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id={`mandatory-${question.id}`}
                      checked={question.mandatory}
                      onChange={(e) => handleQuestionChange(question.id, 'mandatory', e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={`mandatory-${question.id}`}>Mandatory</Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={handleGoBack}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            Create Checklist
          </Button>
        </div>
      </div>
    </Layout>
  );
};