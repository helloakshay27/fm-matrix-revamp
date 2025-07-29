import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export const SurveyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would be fetched based on the id
  const surveyData = {
    id: id,
    title: "Customer Satisfaction Survey",
    category: "Feedback",
    questions: [
      {
        id: "1",
        text: "How satisfied are you with our service?",
        type: "Multiple Choice",
        mandatory: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
      },
      {
        id: "2", 
        text: "What improvements would you suggest?",
        type: "Text Area",
        mandatory: false,
        options: []
      }
    ]
  };

  const handleBack = () => {
    navigate('/maintenance/survey/list');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Survey List
        </Button>
      </div>

      <div>
        <p className="text-muted-foreground text-sm mb-2">
          Survey &gt; Survey List &gt; Survey Details
        </p>
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
                Category*
              </label>
              <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                {surveyData.category}
              </div>
            </div>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                No. of Questions: {surveyData.questions.length}
              </h3>
            </div>

            {/* Questions Display */}
            <div className="space-y-4">
              {surveyData.questions.map((question, index) => (
                <Card key={question.id} className="border border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                      Question {index + 1}
                    </CardTitle>
                    <X className="w-4 h-4 text-gray-400" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your Question
                      </label>
                      <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700 min-h-[80px]">
                        {question.text}
                      </div>
                    </div>

                    {/* Answer Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Answer Type
                      </label>
                      <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
                        {question.type}
                      </div>
                    </div>

                    {/* Options for Multiple Choice */}
                    {question.options.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Answer Options
                        </label>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="p-2 border border-gray-200 rounded bg-gray-50 text-gray-700">
                              {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mandatory Checkbox */}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mandatory-${question.id}`}
                        checked={question.mandatory}
                        disabled
                        className="data-[state=checked]:bg-gray-400"
                      />
                      <label htmlFor={`mandatory-${question.id}`} className="text-sm text-gray-700">
                        Mandatory
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};