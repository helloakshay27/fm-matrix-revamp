import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { surveyApi, SurveyResponseData } from '@/services/surveyApi';
import { SurveyAnalyticsCard } from '@/components/SurveyAnalyticsCard';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

// New interfaces for response list API
interface ResponseAnswer {
  answer_id: number;
  quest_map_id: number;
  question_id: number;
  question_name: string;
  answer_type: string;
  created_at: string;
  level_id: number | null;
  comments: string;
  responded_by: string;
  option_id?: number;
  option_name?: string;
  option_type?: string;
  ans_descr?: string;
}

interface ResponseComplaint {
  complaint_id: number;
  ticket_number: string;
  heading: string;
  assigned_to: number;
  category: string;
  assignee: string;
  relation_id: number;
  created_at: string;
}

interface SurveyResponse {
  survey_id: number;
  survey_name: string;
  question_count: number;
  mapping_id: number;
  site_id: number;
  building_id: number;
  wing_id: number;
  floor_id: number;
  area_id: number;
  room_id: number;
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string;
  final_comment: string;
  complaint_count: number;
  complaints: ResponseComplaint[];
  answers: ResponseAnswer[];
}

interface ResponseListData {
  summary: {
    total_surveys: number;
    active_surveys: number;
    inactive_surveys: number;
    total_responses: number;
  };
  responses: SurveyResponse[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

// TypeScript interfaces for the new survey details API response
interface SurveyOption {
  option_id: number;
  option: string;
  response_count: number;
}

interface SurveyQuestion {
  question_id: number;
  question: string;
  options: SurveyOption[];
}

interface SurveyDetail {
  survey_id: number;
  survey_name: string;
  questions: SurveyQuestion[];
}

interface SurveyDetailsResponse {
  survey_details: {
    survey: SurveyDetail[];
  };
}

// Chart data interfaces
interface ChartDataItem {
  name: string;
  value: number;
  color?: string;
}

interface ProcessedQuestion {
  question: string;
  type: string;
  totalResponses: number;
  responseRate: string;
  responses: string[];
}

export const SurveyResponseDetailPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("summary");
  const [surveyData, setSurveyData] = useState<SurveyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyDetailsData, setSurveyDetailsData] = useState<SurveyDetailsResponse | null>(null);
  const [responseListData, setResponseListData] = useState<ResponseListData | null>(null);

  // Fetch response list data from new API
  const fetchResponseListData = useCallback(async () => {
    try {
      const baseUrl = getFullUrl(`/survey_mappings/response_list.json`);
      const url = new URL(baseUrl);
      
      // Add the required query parameter with dynamic survey ID
      if (surveyId) {
        url.searchParams.append('q[id_eq]', surveyId);
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponseListData(data);
    } catch (error) {
      console.error('Error fetching response list data:', error);
      toast.error('Failed to fetch response list data');
    }
  }, [surveyId]);

  // API function to fetch survey details using the new endpoint
  const fetchSurveyDetails = async (surveyId: string) => {
    try {
      // Validate survey ID
      if (!surveyId || surveyId.trim() === '') {
        throw new Error('Invalid survey ID provided');
      }

      // Build the URL with proper parameters
      const baseUrl = getFullUrl('/pms/admin/snag_checklists/survey_details.json');
      const urlWithParams = new URL(baseUrl);
      
      // Add survey_id parameter
      urlWithParams.searchParams.append('survey_id', surveyId.trim());
      
      // Add access_token from API_CONFIG if available
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }
      
      console.log('🚀 Fetching survey details from:', urlWithParams.toString());
      console.log('🔍 Survey ID being requested:', surveyId);
      
      const response = await fetch(urlWithParams.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Survey Details API Error Response:', errorText);
        
        if (response.status === 404) {
          throw new Error(`Survey with ID ${surveyId} not found`);
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to access this survey.');
        } else {
          throw new Error(`Failed to fetch survey details: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('✅ Survey details response received:', data);
      console.log('🔍 Survey array length:', data?.survey_details?.survey?.length || 0);
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching survey details:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) {
        console.error('No survey ID provided');
        navigate('/maintenance/survey/response');
        return;
      }

      setIsLoading(true);
      let surveyDetailsResponse = null;
      
      try {
        console.log('Fetching survey details for survey ID:', surveyId);
        
        // Fetch survey details using the new API endpoint
        surveyDetailsResponse = await fetchSurveyDetails(surveyId);
        console.log('Fetched survey details:', surveyDetailsResponse);
        setSurveyDetailsData(surveyDetailsResponse);
        
        // Extract survey data from the new API response
        if (surveyDetailsResponse?.survey_details?.surveys?.length > 0) {
          const surveyDetail = surveyDetailsResponse.survey_details.surveys[0];

          // Set the survey data directly from the API response
          setSurveyData(surveyDetail);
          console.log('Survey data set:', surveyDetail);
        } else {
          console.error('No survey data found for survey ID:', surveyId);
          console.error('API Response:', surveyDetailsResponse);
          console.error('Available surveys in response:', surveyDetailsResponse?.survey_details?.survey);
          
          // Check if the response structure is valid but empty
          if (surveyDetailsResponse?.survey_details?.survey && Array.isArray(surveyDetailsResponse.survey_details.survey)) {
            const surveyCount = surveyDetailsResponse.survey_details.survey.length;
            toast.error(`No survey found with ID: ${surveyId}. Found ${surveyCount} surveys in response.`);
          } else {
            toast.error('Invalid response format from survey details API');
          }
          
          // Navigate back to the survey response list
          navigate('/maintenance/survey/response');
          return;
        }

      } catch (error) {
        console.error('Error fetching survey data:', error);
        
        // Provide more specific error messages
        if (error instanceof Error) {
          if (error.message.includes('Failed to fetch survey details')) {
            toast.error('Unable to connect to survey service. Please try again later.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.error('An unexpected error occurred while fetching survey details');
        }
        
        // Only navigate away if there's a real error, not just empty data
        if (!surveyDetailsResponse) {
          navigate('/maintenance/survey/response');
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch both survey details and response list data
    const fetchAllData = async () => {
      await Promise.all([
        fetchSurveyData(),
        fetchResponseListData()
      ]);
    };

    fetchAllData();
  }, [surveyId, navigate, fetchResponseListData]);

  const handleCopyQuestion = async (questionId: number) => {
    const question = surveyData?.questions.find((q: SurveyQuestion) => q.question_id === questionId);
    if (question) {
      const responses = question.options?.filter(option => option.response_count > 0)
        .map(option => `${option.option} (${option.response_count} responses)`) || [];
      const textToCopy = `${question.question}\n${responses.join('\n')}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        console.log('Question responses copied to clipboard');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const handleDownloadQuestion = (questionId: number) => {
    const question = surveyData?.questions.find((q: SurveyQuestion) => q.question_id === questionId);
    if (question) {
      const responses = question.options?.filter(option => option.response_count > 0)
        .map(option => `${option.option} (${option.response_count} responses)`) || [];
      const content = `${question.question}\n${responses.join('\n')}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `question_${questionId}_responses.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Prepare pie chart data for response distribution for this single response
  const getResponseDistributionData = () => {
    console.log('🔍 Getting response distribution data for single response');
    console.log('🔍 Survey data:', surveyData);
    
    // For a single response, show the distribution of answers across questions
    if (surveyData?.questions && surveyData.questions.length > 0) {
      const responseDistribution = surveyData.questions.map((question: SurveyQuestion, index: number) => {
        // Only count responses for questions that have options
        const totalResponses = (question.options && question.options.length > 0) 
          ? question.options.reduce((sum, opt) => sum + opt.response_count, 0) 
          : 0;
        
        return {
          name: `${question.question.substring(0, 30)}${question.question.length > 30 ? '...' : ''}`,
          value: totalResponses || 1, // Show at least 1 for visualization
          color: ['#C72030', '#c6b692', '#d8dcdd', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'][index % 8]
        };
      });
      
      console.log('🔍 Response distribution from survey data:', responseDistribution);
      return responseDistribution;
    }
    
    // Ultimate fallback: Show single response
    const fallbackData = [{
      name: 'Single Response',
      value: 1,
      color: '#C72030'
    }];
    
    console.log('🔍 Using fallback response distribution:', fallbackData);
    return fallbackData;
  };

  // Prepare pie chart data for individual question showing option distribution
  const getQuestionOptionsData = (questionId: number) => {
    console.log('🔍 Getting question options data for question ID:', questionId);
    console.log('🔍 Survey details data:', surveyDetailsData);
    console.log('🔍 Survey data questions:', surveyData?.questions);
    
    // Get question from survey details API response
    if (surveyDetailsData?.survey_details?.survey?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.survey[0];
      const question = surveyDetail.questions?.find(q => q.question_id === questionId);
      
      console.log('🔍 Found question from survey details:', question);
      
      // Handle questions with options (could be empty array)
      if (question?.options && Array.isArray(question.options)) {
        // If options array is empty, show "No options configured"
        if (question.options.length === 0) {
          return [{
            name: 'No options configured',
            value: 1,
            color: '#E5E5E5'
          }];
        }
        
        const optionsData = question.options.map((option: SurveyOption, index: number) => ({
          name: option.option || `Option ${index + 1}`,
          value: option.response_count || 0,
          color: option.response_count > 0 ? 
            ['#C72030', '#c6b692', '#d8dcdd', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'][index % 8] : 
            '#E5E5E5'
        }));
        
        console.log('🔍 Options data from survey details:', optionsData);
        
        // Only return options that have responses, or all options if none have responses
        const hasResponses = optionsData.some(item => item.value > 0);
        if (hasResponses) {
          return optionsData.filter(item => item.value > 0);
        } else {
          // Show all options with 0 values if no responses yet
          return optionsData;
        }
      }
    }
    
    // Fallback: Show no data message
    console.log('🔍 No data found, returning empty array');
    return [{
      name: 'No responses yet',
      value: 1,
      color: '#E5E5E5'
    }];
  };

  // Prepare pie chart data for survey summary statistics
  const getSurveyTypeDistributionData = () => {
    console.log('🔍 Getting survey type distribution data');
    console.log('🔍 Survey data for type distribution:', surveyData);
    console.log('🔍 Survey details data:', surveyDetailsData);
    
    if (!surveyData) {
      return [{
        name: 'No Data',
        value: 1,
        color: '#C72030'
      }];
    }
    
    const typeDistribution = [];
    
    // Calculate total responses across all questions (only for questions with options)
    const totalResponses = surveyData.questions?.reduce((sum, question) => {
      if (question.options && question.options.length > 0) {
        return sum + (question.options.reduce((optSum, opt) => optSum + opt.response_count, 0) || 0);
      }
      return sum;
    }, 0) || 0;
    
    // Add total responses across all questions
    if (totalResponses > 0) {
      typeDistribution.push({
        name: 'Total Responses',
        value: totalResponses,
        color: '#C72030'
      });
    }
    
    // Add question count
    if (surveyData.questions?.length > 0) {
      typeDistribution.push({
        name: 'Total Questions',
        value: surveyData.questions.length,
        color: '#c6b692'
      });
    }
    
    // Count questions with options vs questions without options
    const questionsWithOptions = surveyData.questions?.filter(q => q.options && q.options.length > 0).length || 0;
    const questionsWithoutOptions = (surveyData.questions?.length || 0) - questionsWithOptions;
    
    if (questionsWithOptions > 0) {
      typeDistribution.push({
        name: 'Questions with Options',
        value: questionsWithOptions,
        color: '#10B981'
      });
    }
    
    if (questionsWithoutOptions > 0) {
      typeDistribution.push({
        name: 'Questions without Options',
        value: questionsWithoutOptions,
        color: '#F59E0B'
      });
    }
    
    // Add option-specific data from survey details
    if (surveyDetailsData?.survey_details?.survey?.[0]) {
      const surveyDetail = surveyDetailsData.survey_details.survey[0];
      
      if (surveyDetail.questions) {
        // Add total options count across all questions (only for questions that have options)
        const totalOptions = surveyDetail.questions.reduce(
          (sum: number, q: SurveyQuestion) => sum + (q.options?.length || 0), 
          0
        );
        
        if (totalOptions > 0) {
          typeDistribution.push({
            name: 'Total Options',
            value: totalOptions,
            color: '#d8dcdd'
          });
        }
        
        // Add total answered options count
        const totalAnsweredOptions = surveyDetail.questions.reduce(
          (sum: number, q: SurveyQuestion) => sum + (q.options?.filter((o: SurveyOption) => (o.response_count || 0) > 0).length || 0),
          0
        );
        
        if (totalAnsweredOptions > 0) {
          typeDistribution.push({
            name: 'Answered Options',
            value: totalAnsweredOptions,
            color: '#8B5CF6'
          });
        }
      }
    }
    
    // Fallback if no data
    if (typeDistribution.length === 0) {
      typeDistribution.push({
        name: 'Survey Data',
        value: 1,
        color: '#C72030'
      });
    }
    
    console.log('🔍 Generated type distribution:', typeDistribution);
    return typeDistribution;
  };

  const handleDownloadResponseChart = () => {
    console.log('Download response distribution chart');
    toast.success('Chart download initiated');
  };

  const handleDownloadTypeChart = () => {
    console.log('Download survey type distribution chart');
    toast.success('Survey type chart download initiated');
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Loading survey details...</h1>
          <p className="text-gray-600">Please wait while we fetch the survey information.</p>
        </div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center py-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/maintenance/survey/response')}
            className="mb-6 p-0 h-auto text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Response List
          </Button>
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">📋</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-800 mb-2">Survey not found</h1>
            <p className="text-gray-600 mb-4">
              The survey with ID "{surveyId}" could not be found or has no data available.
            </p>
            <Button 
              onClick={() => navigate('/maintenance/survey/response')}
              className="bg-[#C72030] hover:bg-[#A01B2A] text-white"
            >
              Return to Survey List
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Response Detail</h1>
        
        {/* Tabs wrapper encompasses everything that needs tab context */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-[#F5F3EF] p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <div>
                <div className="text-sm text-gray-500">Survey Details</div>
                {/* <div className="text-xs text-gray-400">Survey ID: {surveyData.survey_id}</div> */}
                {/* <div className="text-xs text-gray-400">Survey: {surveyData.survey_name}</div> */}
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <TabsList className="bg-transparent border-0 p-0 h-auto">
                <TabsTrigger value="summary" className="bg-transparent border-0 text-gray-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-400 rounded-none pb-1">Summary</TabsTrigger>
                <TabsTrigger value="tabular" className="bg-transparent border-0 text-gray-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-400 rounded-none pb-1 ml-6">Tabular</TabsTrigger>
                                <TabsTrigger value="tickets" className="bg-transparent border-0 text-gray-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-400 rounded-none pb-1 ml-6">Tickets</TabsTrigger>

              </TabsList>
            </div>
            
            <div className="flex items-center gap-2">
              {/* <div className="text-sm text-gray-700">
                Total Responses: <span className="text-[#C72030] font-medium">
                  {surveyData.questions?.reduce((sum, q) => {
                    if (q.options && q.options.length > 0) {
                      return sum + (q.options.reduce((optSum, opt) => optSum + opt.response_count, 0) || 0);
                    }
                    return sum;
                  }, 0) || 0}
                </span>
              </div> */}
            </div>
          </div>
        </div>
          <TabsContent value="summary" className="space-y-6">
            {/* Summary Statistics from new API */}
            {responseListData?.summary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-700">{responseListData.summary.total_surveys}</div>
                  <div className="text-sm text-blue-600">Total Surveys</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-700">{responseListData.summary.active_surveys}</div>
                  <div className="text-sm text-green-600">Active Surveys</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-700">{responseListData.summary.total_responses}</div>
                  <div className="text-sm text-orange-600">Total Responses</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-700">{responseListData.summary.inactive_surveys}</div>
                  <div className="text-sm text-purple-600">Inactive Surveys</div>
                </div>
              </div>
            )}
            
            {/* Questions and Responses */}
            {surveyData.questions.map((question: SurveyQuestion) => {
              const totalResponses = question.options?.reduce((sum, opt) => sum + opt.response_count, 0) || 0;
              const responseTexts = question.options?.filter(opt => opt.response_count > 0)
                .map(opt => `${opt.option} (${opt.response_count} responses)`) || [];
              
              // Check if question has any options configured
              const hasOptions = question.options && question.options.length > 0;
              
              return (
                <div key={question.question_id} className="bg-[#F5F3EF] p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-1 text-base">{question.question}</h3>
                      <p className="text-sm text-gray-600">
                        {hasOptions ? `${totalResponses} Responses` : 'No options configured'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Question Response Distribution Pie Chart */}
                  <div className="mb-4">
                    <SurveyAnalyticsCard
                      title={`Response Distribution: ${question.question.substring(0, 50)}${question.question.length > 50 ? '...' : ''}`}
                      type="statusDistribution"
                      data={getQuestionOptionsData(question.question_id)}
                      dateRange={{ 
                        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
                        endDate: new Date() 
                      }}
                      onDownload={() => {
                        console.log(`Download chart for question ${question.question_id}`);
                        toast.success(`Chart for question ${question.question_id} download initiated`);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {hasOptions ? (
                      responseTexts.length > 0 ? (
                        responseTexts.map((response: string, index: number) => (
                          <div 
                            key={index} 
                            className="bg-white p-3 rounded border border-gray-200 text-gray-700"
                          >
                            {response}
                          </div>
                        ))
                      ) : (
                        <div className="bg-white p-3 rounded border border-gray-200 text-gray-500 text-center">
                          No responses yet
                        </div>
                      )
                    ) : (
                      <div className="bg-white p-3 rounded border border-gray-200 text-gray-500 text-center">
                        This question has no configured options
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Survey Summary Statistics Pie Chart - Second Last Position */}
            <div className="mt-8">
              {/* <SurveyAnalyticsCard
                title="Survey Summary Statistics"
                type="surveyDistributions"
                data={getSurveyTypeDistributionData()}
                dateRange={{ 
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
                  endDate: new Date() 
                }}
                onDownload={handleDownloadTypeChart}
              /> */}
            </div>

            {/* Overall Response Distribution Pie Chart - Last Position */}
            <div className="mt-6">
              {/* <SurveyAnalyticsCard
                title="Overall Question Response Distribution"
                type="statusDistribution"
                data={getResponseDistributionData()}
                dateRange={{ 
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
                  endDate: new Date() 
                }}
                onDownload={handleDownloadResponseChart}
              /> */}
            </div>
          </TabsContent>

          <TabsContent value="tabular" className="mt-6">
            <div className="bg-white">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Survey Responses</h3>
                <p className="text-sm text-gray-600">Detailed breakdown of all responses and answers</p>
              </div>
              
              <div className="overflow-x-auto">
                {(() => {
                  // Get all unique questions from all responses dynamically
                  const allUniqueQuestions = responseListData?.responses ? 
                    Array.from(
                      new Map(
                        responseListData.responses
                          .flatMap(response => response.answers || [])
                          .map(answer => [answer.question_id, answer.question_name])
                      ).entries()
                    ) : [];

                  return (
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Response Id</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[150px]">Date & Time</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[120px]">Building</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Wing</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[120px]">Area</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Floor</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Room</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Rating</th>
                          {/* Dynamic question headers */}
                          {allUniqueQuestions.map(([questionId, questionName]) => (
                            <th key={questionId} className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[120px]">
                              {questionName}
                            </th>
                          ))}
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[120px]">Category</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[150px]"> Final Comment</th>
                          <th className="border border-gray-300 p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Ticket id</th>
                        </tr>
                      </thead>
                      <tbody>
                        {responseListData?.responses?.map((response: SurveyResponse, responseIndex: number) => {
                          // Get all answers for this response
                          const answers = response.answers || [];
                          
                          // Group answers by question for better display
                          const questionAnswers: { [key: number]: ResponseAnswer[] } = {};
                          answers.forEach(answer => {
                            if (!questionAnswers[answer.question_id]) {
                              questionAnswers[answer.question_id] = [];
                            }
                            questionAnswers[answer.question_id].push(answer);
                          });
                          
                          return (
                            <tr key={response.mapping_id} className="hover:bg-gray-50">
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {response.mapping_id}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {answers.length > 0 ? 
                                  new Date(answers[0].created_at).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                  }) : '-'}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {response.building_name || '-'}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {response.wing_name || '-'}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {response.area_name || '-'}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {response.floor_name || '-'}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {response.room_name || '-'}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {/* Get rating from emoji or rating type answers */}
                                {(() => {
                                  const ratingAnswer = answers.find(a => a.answer_type === 'emoji' || a.answer_type === 'rating');
                                  return ratingAnswer?.ans_descr || ratingAnswer?.level_id || '-';
                                })()}
                              </td>
                              {/* Dynamic question data */}
                              {allUniqueQuestions.map(([questionId]) => {
                                const questionAnswersForId = questionAnswers[questionId] || [];
                                return (
                                  <td key={questionId} className="border border-gray-300 p-3 text-sm text-gray-700">
                                    {questionAnswersForId.length > 0 ? 
                                      (questionAnswersForId[0].option_name || questionAnswersForId[0].ans_descr || '-') : '-'}
                                  </td>
                                );
                              })}
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {answers[0]?.answer_type || '-'}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {response.final_comment || answers.find(a => a.comments)?.comments || '-'}
                              </td>
                              <td className="border border-gray-300 p-3 text-sm text-gray-700">
                                {response.complaints && response.complaints.length > 0 ? response.complaints[0].complaint_id : '-'}
                              </td>
                            </tr>
                          );
                        }) || []}
                      </tbody>
                    </table>
                  );
                })()}
                
                {(!responseListData?.responses || responseListData.responses.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    No response data available
                  </div>
                )}
              </div>
            </div>
          </TabsContent>          <TabsContent value="tickets" className="mt-6">
            <div className="bg-white">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Survey Tickets</h3>
                <p className="text-sm text-gray-600">Complaints and tickets generated from survey responses</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Complaint ID</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[150px]">Ticket Number</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[250px]">Heading</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[120px]">Category</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[150px]">Assignee</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[130px]">Created At</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[150px]">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {responseListData?.responses?.map((response: SurveyResponse) => 
                      response.complaints?.map((complaint: ResponseComplaint) => (
                        <tr key={`${response.mapping_id}-${complaint.complaint_id}`} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-700">
                            {complaint.complaint_id}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {complaint.ticket_number}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {complaint.heading}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {complaint.category}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {complaint.assignee}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {new Date(complaint.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm text-gray-700">
                            {response.site_name && response.building_name ? 
                              `${response.site_name}, ${response.building_name}` : 
                              (response.site_name || '-')
                            }
                          </td>
                        </tr>
                      )) || []
                    ) || []}
                  </tbody>
                </table>
                
                {(!responseListData?.responses || 
                  responseListData.responses.every(r => !r.complaints || r.complaints.length === 0)) && (
                  <div className="text-center py-8 text-gray-500">
                    No tickets available
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};