import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock detailed response data - in real app this would come from API
const mockDetailedResponseData: Record<string, any> = {
  "12345": {
    id: 12345,
    surveyTitle: "Survey Title 123",
    totalResponses: 20,
    type: "Survey",
    questions: [
      {
        id: 1,
        question: "What is your name?",
        responseCount: 20,
        responses: [
          "Abhidhya Vijay Tapal",
          "Rajesh Kumar", 
          "Priya Sharma",
          "Amit Singh",
          "Neha Patel"
        ]
      },
      {
        id: 2,
        question: "What is your age group?",
        responseCount: 16,
        responses: [
          "25-30",
          "18-25",
          "30-35",
          "25-30",
          "18-25"
        ]
      }
    ]
  },
  "12346": {
    id: 12346,
    surveyTitle: "Customer Satisfaction Survey",
    totalResponses: 12,
    type: "Survey",
    questions: [
      {
        id: 1,
        question: "How satisfied are you with our service?",
        responseCount: 12,
        responses: [
          "Very Satisfied",
          "Satisfied",
          "Very Satisfied",
          "Neutral",
          "Satisfied"
        ]
      },
      {
        id: 2,
        question: "Rate our customer support",
        responseCount: 12,
        responses: [
          "Excellent",
          "Good",
          "Average",
          "Good",
          "Excellent"
        ]
      }
    ]
  },
  "12347": {
    id: 12347,
    surveyTitle: "Employee Feedback Survey",
    totalResponses: 25,
    type: "Survey",
    questions: [
      {
        id: 1,
        question: "How would you rate your work environment?",
        responseCount: 25,
        responses: [
          "Excellent",
          "Good",
          "Average",
          "Good",
          "Excellent"
        ]
      }
    ]
  }
};

export const SurveyResponseDetailPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");

  // Get survey data - in real app this would be fetched from API
  const surveyData = surveyId ? mockDetailedResponseData[surveyId as any] : null;

  if (!surveyData) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">Survey not found</h1>
          <Button onClick={() => navigate('/maintenance/survey/response')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Response List
          </Button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    console.log('Download survey responses');
  };

  const handleCopyQuestion = (questionId: number) => {
    console.log('Copy question responses:', questionId);
  };

  const handleDownloadQuestion = (questionId: number) => {
    console.log('Download question responses:', questionId);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/survey/response')}
          className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Response List
        </Button>
        
        <div className="border-l-4 border-[#C72030] bg-blue-50 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {surveyData.totalResponses}
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Responses</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                1529 x 75
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Response Detail</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-48 grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="tabular">Tabular</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 px-3 py-1 rounded text-sm">
                Type: <span className="text-[#C72030] font-medium">{surveyData.type}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
                className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="summary" className="space-y-6">
            {surveyData.questions.map((question) => (
              <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">{question.question}</h3>
                    <p className="text-sm text-gray-600">{question.responseCount} Responses</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadQuestion(question.id)}
                      className="text-gray-600 hover:text-[#C72030]"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyQuestion(question.id)}
                      className="text-gray-600 hover:text-[#C72030]"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {question.responses.map((response, index) => (
                    <div 
                      key={index} 
                      className="bg-white p-3 rounded border text-gray-700"
                    >
                      {response}
                    </div>
                  ))}
                  {question.responses.length < question.responseCount && (
                    <div className="text-center py-2">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        Show {question.responseCount - question.responses.length} more responses...
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="tabular" className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">Tabular View</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Response #</th>
                      {surveyData.questions.map((question) => (
                        <th key={question.id} className="border border-gray-300 p-2 text-left">
                          {question.question}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: Math.min(5, surveyData.totalResponses) }).map((_, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2">{index + 1}</td>
                        {surveyData.questions.map((question) => (
                          <td key={question.id} className="border border-gray-300 p-2">
                            {question.responses[index] || 'No response'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};