import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { surveyApi, SurveyResponseData } from '@/services/surveyApi';
import { SurveyAnalyticsCard } from '@/components/SurveyAnalyticsCard';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

export const SurveyResponseDetailPage = () => {
  const { surveyId } = useParams(); // This is actually a response ID
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("summary");
  const [surveyData, setSurveyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<SurveyResponseData | null>(null);
  const [surveyDetailsData, setSurveyDetailsData] = useState<any>(null);
  const [currentResponse, setCurrentResponse] = useState<any>(null);

  // API function to fetch survey details
  const fetchSurveyDetails = async (surveyId: string) => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.SURVEY_DETAILS);
      const options = getAuthenticatedFetchOptions();
      
      // Add query parameters
      const urlWithParams = new URL(url);
      urlWithParams.searchParams.append('survey_id', surveyId);
      
      console.log('🚀 Fetching survey details from:', urlWithParams.toString());
      
      const response = await fetch(urlWithParams.toString(), options);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch survey details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Survey details response received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching survey details:', error);
      throw error;
    }
  };

  // API function to fetch specific survey response by response ID
  const fetchSurveyResponseById = async (responseId: string) => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.SURVEY_RESPONSES);
      const options = getAuthenticatedFetchOptions();
      
      console.log('🚀 Fetching survey responses from:', url);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch survey responses: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ All survey responses received:', data);
      
      // Find the specific response by ID
      const specificResponse = data.find((response: any) => 
        response.id && response.id.toString() === responseId.toString()
      );
      
      if (!specificResponse) {
        console.warn(`No response found for response ID ${responseId}. Available response IDs:`, 
          data.map((r: any) => r.id));
        throw new Error(`Response not found for ID: ${responseId}`);
      }
      
      console.log('✅ Found specific response for ID', responseId, ':', specificResponse);
      return specificResponse;
    } catch (error) {
      console.error('❌ Error fetching survey response:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) {
        console.error('No response ID provided');
        navigate('/maintenance/survey/response');
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching survey response data for response ID:', surveyId);
        
        // Fetch the specific survey response by response ID
        const specificResponse = await fetchSurveyResponseById(surveyId);
        
        console.log('Fetched specific survey response:', specificResponse);
        
        // Set the current response and basic data
        setCurrentResponse(specificResponse);
        setApiData(specificResponse);
        
        // Try to fetch survey details using the survey_id from the response
        let detailsData = null;
        if (specificResponse.survey_id) {
          try {
            detailsData = await fetchSurveyDetails(specificResponse.survey_id.toString());
            console.log('Fetched survey details:', detailsData);
            setSurveyDetailsData(detailsData);
          } catch (detailsError) {
            console.warn('Could not fetch survey details, using basic data only:', detailsError);
            toast.warning('Survey details not available, showing basic information');
          }
        }

        // Process the single response to create question data
        const questionMap = new Map();
        
        console.log('🔍 Processing single response for question mapping...');
        console.log('🔍 Processing response:', specificResponse);
        
        if (specificResponse.parsed_response) {
          console.log('🔍 Found parsed_response:', specificResponse.parsed_response);
          
          Object.entries(specificResponse.parsed_response).forEach(([questionKey, answerValue]) => {
            console.log(`🔍 Processing question: ${questionKey} = ${answerValue}`);
            
            questionMap.set(questionKey, {
              id: questionMap.size + 1,
              question: questionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
              responses: [String(answerValue)], // Single response
              responseCount: 1,
              answer: String(answerValue) // Store the specific answer
            });
            console.log(`🔍 Created question entry for: ${questionKey}`);
          });
        } else {
          console.log('🔍 No parsed_response found in this response');
        }

        const questions = Array.from(questionMap.values());
        console.log('🔍 Final questions array:', questions);

        // Get survey title from the response
        const surveyTitle = specificResponse.survey_title || 'Survey Response';

        const processedData = {
          id: surveyId, // This is actually the response ID
          responseId: specificResponse.id,
          surveyId: specificResponse.survey_id,
          surveyTitle: surveyTitle,
          totalResponses: 1, // This is a single response
          type: "Survey",
          tickets: 0,
          expiryDate: new Date(specificResponse.created_at || Date.now()).toLocaleDateString(),
          location: specificResponse.location || 'Unknown Location',
          createdBy: specificResponse.created_by?.full_name || 'Unknown',
          questions: questions
        };

        setSurveyData(processedData);
        console.log('Processed survey response data for response ID', surveyId, ':', processedData);

      } catch (error) {
        console.error('Error fetching survey response data:', error);
        toast.error('Failed to fetch survey response data');
        navigate('/maintenance/survey/response');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId, navigate]);

  const handleCopyQuestion = async (questionId: number) => {
    const question = surveyData?.questions.find((q: any) => q.id === questionId);
    if (question) {
      const textToCopy = `${question.question}\n${question.responses.join('\n')}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        console.log('Question responses copied to clipboard');
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  const handleDownloadQuestion = (questionId: number) => {
    const question = surveyData?.questions.find((q: any) => q.id === questionId);
    if (question) {
      const content = `${question.question}\n${question.responses.join('\n')}`;
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
      const responseDistribution = surveyData.questions.map((question: any, index: number) => ({
        name: `${question.question.substring(0, 30)}${question.question.length > 30 ? '...' : ''}`,
        value: 1, // Each question has one answer in this response
        color: ['#C72030', '#c6b692', '#d8dcdd', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'][index % 8]
      }));
      
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

  // Prepare pie chart data for individual question showing the single answer
  const getQuestionOptionsData = (questionId: number) => {
    console.log('🔍 Getting question options data for question ID:', questionId);
    console.log('🔍 Current response:', currentResponse);
    console.log('🔍 Survey details data:', surveyDetailsData);
    console.log('🔍 Survey data questions:', surveyData?.questions);
    
    // For individual response, we want to show which option was selected
    // First try to get data from survey details API to see all available options
    if (surveyDetailsData?.survey_details?.survey) {
      const surveyDetail = surveyDetailsData.survey_details.survey.find(
        (s: any) => s.survey_id && s.survey_id.toString() === surveyData?.surveyId?.toString()
      );
      
      console.log('🔍 Found survey detail:', surveyDetail);
      
      if (surveyDetail?.questions) {
        const question = surveyDetail.questions[questionId - 1]; // Questions are 1-indexed in UI
        console.log('🔍 Found question from survey details:', question);
        
        if (question?.options) {
          // Find which option was selected in this response
          const selectedQuestion = surveyData?.questions?.find((q: any) => q.id === questionId);
          const selectedAnswer = selectedQuestion?.answer || selectedQuestion?.responses?.[0];
          
          console.log('🔍 Selected answer for this response:', selectedAnswer);
          
          const optionsData = question.options.map((option: any, index: number) => {
            const isSelected = option.option === selectedAnswer || 
                              option.option.toLowerCase() === String(selectedAnswer).toLowerCase();
            
            return {
              name: option.option || `Option ${index + 1}`,
              value: isSelected ? 1 : 0, // 1 if selected, 0 if not
              color: isSelected ? '#C72030' : '#E5E5E5', // Highlight selected option
              isSelected: isSelected
            };
          });
          
          console.log('🔍 Options data from survey details:', optionsData);
          
          // Return all options, highlighting the selected one
          const selectedData = optionsData.filter(item => item.value > 0);
          if (selectedData.length > 0) {
            return selectedData;
          }
          
          // If no exact match found, show all options with the selected answer
          return [{
            name: selectedAnswer || 'Response',
            value: 1,
            color: '#C72030'
          }];
        }
      }
    }
    
    // Fallback: Show the actual response value
    if (surveyData?.questions) {
      const question = surveyData.questions.find((q: any) => q.id === questionId);
      console.log('🔍 Found question from survey data:', question);
      
      if (question?.answer || question?.responses?.[0]) {
        const answer = question.answer || question.responses[0];
        
        return [{
          name: answer.length > 30 ? `${answer.substring(0, 30)}...` : answer,
          value: 1,
          color: '#C72030'
        }];
      }
    }
    
    console.log('🔍 No data found, returning empty array');
    return [];
  };

  // Prepare pie chart data for survey summary statistics
  const getSurveyTypeDistributionData = () => {
    console.log('🔍 Getting survey type distribution data');
    console.log('🔍 Survey data for type distribution:', surveyData);
    
    if (!surveyData) {
      return [{
        name: 'No Data',
        value: 1,
        color: '#C72030'
      }];
    }
    
    // Create summary statistics for this specific survey
    const typeDistribution = [];
    
    // Always add total responses
    if (surveyData.totalResponses > 0) {
      typeDistribution.push({
        name: 'Total Responses',
        value: surveyData.totalResponses,
        color: '#C72030'
      });
    }
    
    // Always add question count
    if (surveyData.questions?.length > 0) {
      typeDistribution.push({
        name: 'Questions Count',
        value: surveyData.questions.length,
        color: '#c6b692'
      });
    }
    
    // Add question-specific data if available from survey details
    if (surveyDetailsData?.survey_details?.survey) {
      const surveyDetail = surveyDetailsData.survey_details.survey.find(
        (s: any) => s.survey_id && s.survey_id.toString() === surveyId?.toString()
      );
      
      if (surveyDetail?.questions) {
        // Add total options count across all questions
        const totalOptions = surveyDetail.questions.reduce(
          (sum: number, q: any) => sum + (q.options?.length || 0), 
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
          (sum: number, q: any) => sum + (q.options?.filter((o: any) => (o.response_count || 0) > 0).length || 0),
          0
        );
        
        if (totalAnsweredOptions > 0) {
          typeDistribution.push({
            name: 'Answered Options',
            value: totalAnsweredOptions,
            color: '#10B981'
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

  if (!surveyData || isLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            {isLoading ? 'Loading survey details...' : 'Survey not found'}
          </h1>
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
                  1
                </div>
                <div>
                  <div className="text-sm text-gray-500">Individual Response</div>
                  <div className="text-xs text-gray-400">Response ID: {surveyData.responseId}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <TabsList className="bg-transparent border-0 p-0 h-auto">
                  <TabsTrigger value="summary" className="bg-transparent border-0 text-gray-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-400 rounded-none pb-1">Summary</TabsTrigger>
                  <TabsTrigger value="tabular" className="bg-transparent border-0 text-gray-600 data-[state=active]:bg-transparent data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-400 rounded-none pb-1 ml-6">Tabular</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-700">
                  Type : <span className="text-[#C72030] font-medium">Survey</span>
                </div>
              </div>
            </div>
          </div>


          <TabsContent value="summary" className="space-y-6">
            {/* Questions and Responses */}
            {surveyData.questions.map((question: any) => (
              <div key={question.id} className="bg-[#F5F3EF] p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1 text-base">{question.question}</h3>
                    <p className="text-sm text-gray-600">{question.responseCount} Responses</p>
                  </div>
                </div>
                
                {/* Question Response Distribution Pie Chart */}
                <div className="mb-4">
                  <SurveyAnalyticsCard
                    title={`Response Distribution: ${question.question.substring(0, 50)}${question.question.length > 50 ? '...' : ''}`}
                    type="statusDistribution"
                    data={getQuestionOptionsData(question.id)}
                    dateRange={{ 
                      startDate: new Date(apiData?.created_at || Date.now()), 
                      endDate: new Date() 
                    }}
                    onDownload={() => {
                      console.log(`Download chart for question ${question.id}`);
                      toast.success(`Chart for question ${question.id} download initiated`);
                    }}
                  />
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {question.responses.map((response: string, index: number) => (
                    <div 
                      key={index} 
                      className="bg-white p-3 rounded border border-gray-200 text-gray-700"
                    >
                      {response}
                    </div>
                  ))}
                  {question.responses.length === 0 && (
                    <div className="bg-white p-3 rounded border border-gray-200 text-gray-500 text-center">
                      No responses yet
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Survey Summary Statistics Pie Chart - Second Last Position */}
            <div className="mt-8">
              <SurveyAnalyticsCard
                title="Survey Summary Statistics"
                type="surveyDistributions"
                data={getSurveyTypeDistributionData()}
                dateRange={{ 
                  startDate: new Date(apiData?.created_at || Date.now()), 
                  endDate: new Date() 
                }}
                onDownload={handleDownloadTypeChart}
              />
            </div>

            {/* Overall Response Distribution Pie Chart - Last Position */}
            <div className="mt-6">
              <SurveyAnalyticsCard
                title="Overall Question Response Distribution"
                type="statusDistribution"
                data={getResponseDistributionData()}
                dateRange={{ 
                  startDate: new Date(apiData?.created_at || Date.now()), 
                  endDate: new Date() 
                }}
                onDownload={handleDownloadResponseChart}
              />
            </div>
          </TabsContent>

          <TabsContent value="tabular" className="mt-6">
            <div className="bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[180px]">Timestamp</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[120px]">Name</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Site</th>
                      {/* <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[120px]">What is your role?</th> */}
                      {/* <th className="p-3 text-left text-sm font-medium text-gray-700 min-w-[100px]">Department</th> */}
                      {/* Dynamic question columns based on parsed_response */}
                      {apiData?.parsed_response && Object.keys(apiData.parsed_response).map((questionKey, index) => (
                        <th key={questionKey} className="p-3 text-left text-sm font-medium text-gray-700 min-w-[120px]">
                          {questionKey.includes('question') ? 
                            `Question ${questionKey.replace('question', '')}` : 
                            questionKey
                          }
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-700">
                        {apiData?.created_at ? 
                          new Date(apiData.created_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZoneName: 'short'
                          }) : 
                          surveyData?.expiryDate
                        }
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {apiData?.created_by?.full_name || surveyData?.createdBy || "N/A"}
                      </td>
                      <td className="p-3 text-sm text-gray-700">
                        {apiData?.location?.split('/')[0]?.trim() || 
                         surveyData?.location?.split('/')[0]?.trim() || 
                         "N/A"}
                      </td>
                      {/* <td className="p-3 text-sm text-gray-700">
                        Supervisor
                      </td> */}
                      {/* <td className="p-3 text-sm text-gray-700">
                        {apiData?.location?.includes('Technical') ? 'Technical' : 
                         surveyData?.location?.split('/')[1]?.trim() || 
                         "Technical"}
                      </td> */}
                      {/* Dynamic question answers from parsed_response */}
                      {apiData?.parsed_response && Object.entries(apiData.parsed_response).map(([questionKey, answer]) => (
                        <td key={questionKey} className="p-3 text-sm text-gray-700">
                          {String(answer) || "N/A"}
                        </td>
                      ))}
                    </tr>
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