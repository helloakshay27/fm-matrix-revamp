import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import apiClient from '@/utils/apiClient';

interface Question {
  id?: string;
  descr: string;
  qtype: string;
  quest_mandatory: boolean;
  image_mandatory: boolean;
  quest_options: Array<{
    option_name: string;
    option_type: string;
  }>;
}

interface Category {
  id: number;
  name: string;
}

export const EditSurveyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchSurveyData();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/snag_audit_categories.json');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      });
    }
  };

  const fetchSurveyData = async () => {
    try {
      const response = await apiClient.get(`/pms/admin/snag_checklists/${id}.json`);
      const surveyData = response.data;
      
      // Populate form fields with fetched data
      setTitle(surveyData.name);
      setSelectedCategory(surveyData.snag_audit_category_id.toString());
      
      // Map snag_questions to component questions format
      const mappedQuestions = surveyData.snag_questions.map((q: any) => ({
        id: q.id.toString(),
        descr: q.descr,
        qtype: q.qtype,
        quest_mandatory: q.quest_mandatory,
        image_mandatory: q.img_mandatory,
        quest_options: q.snag_quest_options.map((option: any) => ({
          option_name: option.qname,
          option_type: option.option_type
        }))
      }));
      
      setQuestions(mappedQuestions);
      setInitialLoading(false);
    } catch (error) {
      console.error('Error fetching survey data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch survey data",
        variant: "destructive"
      });
      setInitialLoading(false);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      descr: '',
      qtype: '',
      quest_mandatory: false,
      image_mandatory: false,
      quest_options: []
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    
    // Reset options when answer type changes and add default options for multiple choice
    if (field === 'qtype') {
      if (value === 'multiple' || value === 'single') {
        updatedQuestions[index].quest_options = [
          { option_name: '', option_type: 'p' },
          { option_name: '', option_type: 'p' }
        ];
      } else {
        updatedQuestions[index].quest_options = [];
      }
    }
    
    setQuestions(updatedQuestions);
  };

  const handleAddAnswerOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].quest_options.push({
      option_name: '',
      option_type: 'p'
    });
    setQuestions(updatedQuestions);
  };

  const handleRemoveAnswerOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].quest_options = updatedQuestions[questionIndex].quest_options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const handleAnswerOptionChange = (questionIndex: number, optionIndex: number, field: string, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].quest_options[optionIndex] = {
      ...updatedQuestions[questionIndex].quest_options[optionIndex],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleUpdateSurvey = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a survey title",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        snag_checklist: {
          name: title,
          snag_audit_category_id: parseInt(selectedCategory),
          check_type: "project_snag"
        },
        question: questions.map(question => ({
          descr: question.descr,
          qtype: question.qtype,
          quest_mandatory: question.quest_mandatory,
          image_mandatory: question.image_mandatory,
          quest_options: question.quest_options
        }))
      };

      const response = await apiClient.put(`/pms/admin/snag_checklists/${id}.json`, requestData);
      console.log('Survey updated successfully:', response.data);
      
      toast({
        title: "Success",
        description: "Survey updated successfully"
      });
      
      navigate('/maintenance/survey/list');
    } catch (error) {
      console.error('Error updating survey:', error);
      toast({
        title: "Error",
        description: "Failed to update survey",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async () => {
    await handleUpdateSurvey();
  };

  if (initialLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <div>Loading survey data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/maintenance/survey/list')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Edit Survey</h1>
          </div>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Edit Survey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter the title"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Add No. of Questions</span>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
                  <span className="text-sm">{questions.length.toString().padStart(2, '0')}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleAddQuestion}
                    className="p-1 h-6 w-6"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm">No. of Questions</span>
                <span className="bg-gray-200 px-2 py-1 rounded text-sm">{questions.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {questions.map((question, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-black">New Question</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveQuestion(index)}
                        className="p-1 h-6 w-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={question.descr}
                      onChange={(e) => handleQuestionChange(index, 'descr', e.target.value)}
                      placeholder="Enter your Question"
                      className="min-h-20"
                    />

                    <div className="space-y-2">
                      <Label>Select Answer Type</Label>
                      <Select 
                        value={question.qtype} 
                        onValueChange={(value) => handleQuestionChange(index, 'qtype', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose Answer Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="multiple">Multiple Choice</SelectItem>
                          <SelectItem value="input">Input Box</SelectItem>
                          <SelectItem value="description">Description Box</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>


                    {(question.qtype === 'multiple' || question.qtype === 'single') && (
                      <div className="space-y-3">
                        <Label>Answer Options</Label>
                        {question.quest_options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex gap-2">
                            <Input
                              value={option.option_name}
                              onChange={(e) => handleAnswerOptionChange(index, optionIndex, 'option_name', e.target.value)}
                              placeholder="Enter option"
                              className="flex-1"
                            />
                            <Select
                              value={option.option_type}
                              onValueChange={(value) => handleAnswerOptionChange(index, optionIndex, 'option_type', value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="p">P</SelectItem>
                                <SelectItem value="n">N</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveAnswerOption(index, optionIndex)}
                              className="p-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddAnswerOption(index)}
                          className="p-0 h-auto font-medium"
                          style={{ color: '#C72030' }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                     )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`mandatory-${index}`}
                        checked={question.quest_mandatory}
                        onCheckedChange={(checked) => handleQuestionChange(index, 'quest_mandatory', checked)}
                      />
                      <Label htmlFor={`mandatory-${index}`} className="text-sm text-black">
                        Mandatory
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleAddQuestion}
                variant="outline"
                className="border-dashed border-red-400 text-red-600 hover:bg-red-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More Questions
              </Button>
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <Button
                onClick={handleUpdateSurvey}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-8"
              >
                {loading ? 'Updating...' : 'Update Survey'}
              </Button>
              <Button
                onClick={handleProceed}
                disabled={loading}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 px-8"
              >
                Proceed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};