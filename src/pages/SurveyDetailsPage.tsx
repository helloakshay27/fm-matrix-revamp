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

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Survey Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Survey Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                {surveyData.title}
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div>
            {/* Add Questions Header */}
            <div className="text-gray-600 mb-6">
              No. of Questions <span className="font-medium">2</span>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {surveyData.questions.map((question, index) => <Card key={question.id} className="border border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-base font-medium">
                      New Question
                    </CardTitle>
                    <X className="w-4 h-4 text-gray-400" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Question Text */}
                    <div>
                      <textarea className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500 min-h-[80px] resize-none" placeholder="Enter your Question" value={question.text} disabled />
                    </div>

                    {/* Answer Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Answer Type
                      </label>
                      <Select disabled defaultValue={question.type}>
                        <SelectTrigger className="w-full bg-gray-50">
                          <SelectValue placeholder="Choose Answer Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                          <SelectItem value="Text Area">Text Area</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Mandatory Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`mandatory-${question.id}`} checked={question.mandatory} disabled className="data-[state=checked]:bg-gray-400" />
                      <label htmlFor={`mandatory-${question.id}`} className="text-sm text-gray-700">
                        Mandatory
                      </label>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

          </div>

          {/* Asset Mapping List Table */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                6
              </div>
              <h3 className="text-lg font-medium text-red-600">Asset Mapping List</h3>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-2 bg-gray-100">
                <div className="p-4 font-medium text-gray-700 border-r border-gray-200">
                  Service Name
                </div>
                <div className="p-4 font-medium text-gray-700">
                  Tasks
                </div>
              </div>
              
              {/* Table Body - Empty State */}
              <div className="p-8 text-center text-gray-500">
                No service mappings found
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};