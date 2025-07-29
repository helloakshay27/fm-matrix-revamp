import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
export const SurveyDetailsPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would be fetched based on the id
  const surveyData = {
    id: id,
    title: "Customer Satisfaction Survey",
    category: "Feedback",
    questions: [{
      id: "1",
      text: "How satisfied are you with our service?",
      type: "Multiple Choice",
      mandatory: true,
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
    }, {
      id: "2",
      text: "What improvements would you suggest?",
      type: "Text Area",
      mandatory: false,
      options: []
    }]
  };
  const handleBack = () => {
    navigate('/maintenance/survey/list');
  };
  return <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" />
          Back to Survey List
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Survey Details</h1>
      </div>

      {/* Top Section - Category and Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category*
          </label>
          <Select defaultValue="feedback" disabled>
            <SelectTrigger className="w-full bg-gray-50">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feedback">Feedback</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="satisfaction">Satisfaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title*
          </label>
          <input 
            type="text" 
            placeholder="Enter the title"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            defaultValue={surveyData.title}
            disabled
          />
        </div>
      </div>

      {/* Questions Counter Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">No. of Questions</span>
          <span className="text-sm font-medium">2</span>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Question 1 */}
        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-medium">
              New Question
            </CardTitle>
            <X className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 min-h-[80px] resize-none" 
                placeholder="Enter your Question"
                defaultValue={surveyData.questions[0]?.text}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Answer Type
              </label>
              <Select defaultValue="Multiple Choice" disabled>
                <SelectTrigger className="w-full bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                  <SelectItem value="Text Area">Text Area</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Answer Options
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Select defaultValue="P" disabled>
                    <SelectTrigger className="w-16 h-10 bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P">P</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                    </SelectContent>
                  </Select>
                  <input 
                    type="text" 
                    placeholder="Answer Option"
                    className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    defaultValue="Very Satisfied"
                    disabled
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Select defaultValue="P" disabled>
                    <SelectTrigger className="w-16 h-10 bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P">P</SelectItem>
                      <SelectItem value="N">N</SelectItem>
                    </SelectContent>
                  </Select>
                  <input 
                    type="text" 
                    placeholder="Answer Option"
                    className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                    defaultValue="Satisfied"
                    disabled
                  />
                </div>
                <Button variant="outline" className="w-full border-dashed border-gray-300 text-gray-400" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Answer Option
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="mandatory-1" defaultChecked disabled className="data-[state=checked]:bg-gray-400" />
              <label htmlFor="mandatory-1" className="text-sm text-gray-700">
                Mandatory
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Question 2 */}
        <Card className="border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-medium">
              New Question
            </CardTitle>
            <X className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 min-h-[80px] resize-none" 
                placeholder="Enter your Question"
                defaultValue={surveyData.questions[1]?.text}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Answer Type
              </label>
              <Select defaultValue="Text Area" disabled>
                <SelectTrigger className="w-full bg-gray-50">
                  <SelectValue placeholder="Choose Answer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                  <SelectItem value="Text Area">Text Area</SelectItem>
                  <SelectItem value="Short Answer">Short Answer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="mandatory-2" disabled />
              <label htmlFor="mandatory-2" className="text-sm text-gray-700">
                Mandatory
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add More Questions Button */}
      <div className="flex justify-center">
        <Button variant="outline" className="border-2 border-dashed border-gray-300 text-gray-400 px-6 py-3" disabled>
          <Plus className="w-4 h-4 mr-2" />
          Add More Questions
        </Button>
      </div>
    </div>;
};