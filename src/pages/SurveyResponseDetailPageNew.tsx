import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

// TypeScript interfaces for the survey details API response
interface SurveyOption {
  id: number;
  option: string;
  response_count: number;
}

interface SurveyQuestion {
  id: number;
  question: string;
  question_type: string;
  mandatory: number;
  order_no: number;
  options: SurveyOption[];
}

interface SurveyDetail {
  id: number;
  title: string;
  description: string;
  published_by: string;
  module_id: number;
  created_at: string;
  questions: SurveyQuestion[];
}

interface SurveyDetailsResponse {
  survey_details: {
    survey: SurveyDetail[];
  };
}

export const SurveyResponseDetailPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [surveyData, setSurveyData] = useState<SurveyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to calculate total responses
  const getTotalResponses = (survey: SurveyDetail): number => {
    return survey.questions.reduce((max, question) => {
      const questionTotal = question.options.reduce((sum, option) => sum + option.response_count, 0);
      return Math.max(max, questionTotal);
    }, 0);
  };

  // API function to fetch survey details
  const fetchSurveyDetails = async (surveyId: string) => {
    try {
      const url = getFullUrl('/pms/admin/snag_checklists/survey_details.json');
      const options = getAuthenticatedFetchOptions();
      
      const urlWithParams = new URL(url);
      urlWithParams.searchParams.append('survey_id', surveyId);
      
      console.log('🚀 Fetching survey details from:', urlWithParams.toString());
      
      const response = await fetch(urlWithParams.toString(), options);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Survey Details API Error Response:', errorText);
        throw new Error(`Failed to fetch survey details: ${response.status} ${response.statusText}`);
      }
      
      const data: SurveyDetailsResponse = await response.json();
      console.log('✅ Survey details response received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching survey details:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) {
        console.error('❌ No survey ID provided');
        navigate('/maintenance/survey/response');
        return;
      }

      try {
        setIsLoading(true);
        console.log(`🚀 Fetching survey data for ID: ${surveyId}`);
        
        const surveyDetailsResponse = await fetchSurveyDetails(surveyId);
        console.log('Fetched survey details:', surveyDetailsResponse);
        
        if (surveyDetailsResponse?.survey_details?.survey?.[0]) {
          const surveyDetail = surveyDetailsResponse.survey_details.survey[0];
          setSurveyData(surveyDetail);
          console.log('Survey data set:', surveyDetail);
        } else {
          throw new Error('Invalid survey details response structure');
        }

      } catch (error) {
        console.error('Error fetching survey data:', error);
        toast.error('Failed to fetch survey details');
        navigate('/maintenance/survey/response');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId, navigate]);

  const handleCopyQuestion = async (questionId: number) => {
    const question = surveyData?.questions.find(q => q.id === questionId);
    if (question) {
      const responses = question.options?.filter(option => option.response_count > 0)
        .map(option => `${option.option} (${option.response_count} responses)`) || [];
      const textToCopy = `${question.question}\n${responses.join('\n')}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast.success('Question responses copied to clipboard');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C72030]"></div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Survey not found</h2>
          <p className="text-gray-600 mb-4">The requested survey could not be found.</p>
          <Button onClick={() => navigate('/maintenance/survey/response')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Survey List
          </Button>
        </div>
      </div>
    );
  }

  const totalResponses = getTotalResponses(surveyData);

  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/maintenance/survey/response')}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{surveyData.title}</h1>
                <div className="text-xs text-gray-400">Survey ID: {surveyData.id}</div>
                <div className="text-xs text-gray-400">Description: {surveyData.description}</div>
              </div>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-700">Questions</div>
              <div className="text-2xl font-bold text-blue-900">{surveyData.questions.length}</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="text-sm font-medium text-green-700">
                Total Responses: <span className="text-[#C72030] font-medium">{totalResponses}</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-700">Published By</div>
              <div className="text-lg font-semibold text-purple-900">{surveyData.published_by}</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
              <div className="text-sm font-medium text-yellow-700">Created</div>
              <div className="text-lg font-semibold text-yellow-900">
                {new Date(surveyData.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="details">Question Details</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Survey Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Questions Overview</h4>
                    {surveyData.questions.map((question) => {
                      const questionResponses = question.options.reduce((sum, option) => sum + option.response_count, 0);
                      return (
                        <div key={question.id} className="mb-3 p-3 bg-gray-50 rounded">
                          <div className="font-medium text-sm">{question.question}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Type: {question.question_type} | Responses: {questionResponses}
                            {question.mandatory === 1 && <span className="text-red-500 ml-2">*Required</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Questions:</span>
                        <span className="font-medium">{surveyData.questions.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Options:</span>
                        <span className="font-medium">
                          {surveyData.questions.reduce((sum, q) => sum + (q.options?.length || 0), 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Answered Options:</span>
                        <span className="font-medium">
                          {surveyData.questions.reduce((sum, q) => 
                            sum + (q.options?.filter(o => o.response_count > 0).length || 0), 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Rate:</span>
                        <span className="font-medium">
                          {totalResponses > 0 ? '100%' : '0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-6">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Question & Response Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Question
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Option
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Responses
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {surveyData.questions.map((question) => {
                          const totalQuestionResponses = question.options?.reduce((sum, opt) => sum + (opt.response_count || 0), 0) || 0;
                          
                          return question.options?.map((option, optionIndex) => (
                            <tr key={`${question.id}-${option.id}`} className="hover:bg-gray-50">
                              {optionIndex === 0 && (
                                <>
                                  <td rowSpan={question.options.length} className="px-6 py-4 text-sm text-gray-900 border-r">
                                    <div className="font-medium">{question.question}</div>
                                    {question.mandatory === 1 && (
                                      <div className="text-xs text-red-500 mt-1">*Required</div>
                                    )}
                                  </td>
                                  <td rowSpan={question.options.length} className="px-6 py-4 text-sm text-gray-500 border-r">
                                    {question.question_type}
                                  </td>
                                </>
                              )}
                              <td className="px-6 py-4 text-sm text-gray-900">{option.option}</td>
                              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                {option.response_count}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {totalQuestionResponses > 0 
                                  ? `${((option.response_count / totalQuestionResponses) * 100).toFixed(1)}%`
                                  : '0%'
                                }
                              </td>
                              {optionIndex === 0 && (
                                <td rowSpan={question.options.length} className="px-6 py-4 text-sm text-gray-500">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopyQuestion(question.id)}
                                    className="flex items-center"
                                  >
                                    <Copy className="h-4 w-4 mr-1" />
                                    Copy
                                  </Button>
                                </td>
                              )}
                            </tr>
                          )) || [];
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
