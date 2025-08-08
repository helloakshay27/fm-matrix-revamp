import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { surveyApi, SurveyResponseData } from '@/services/surveyApi';
import { SurveyAnalyticsCard } from '@/components/SurveyAnalyticsCard';
import { toast } from 'sonner';

export const SurveyResponseDetailPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("summary");
  const [surveyData, setSurveyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState<SurveyResponseData | null>(null);

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyId) {
        console.error('No survey ID provided');
        navigate('/maintenance/survey/response');
        return;
      }

      setIsLoading(true);
      try {
        console.log('Fetching survey response for ID:', surveyId);
        const response = await surveyApi.getSurveyResponseById(surveyId);
        
        if (!response) {
          console.error('Survey response not found for ID:', surveyId);
          toast.error('Survey response not found');
          navigate('/maintenance/survey/response');
          return;
        }

        console.log('Fetched survey response data:', response);
        setApiData(response);

        // Process the parsed_response to create questions
        const questions: any[] = [];
        if (response.parsed_response) {
          Object.entries(response.parsed_response).forEach(([key, value], index) => {
            questions.push({
              id: index + 1,
              question: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
              responseCount: 1,
              responses: [String(value)]
            });
          });
        }

        const processedData = {
          id: response.id,
          surveyTitle: response.survey_title,
          totalResponses: response.response_count,
          type: "Survey",
          tickets: 0, // Not available in API response
          expiryDate: new Date(response.created_at).toLocaleDateString(),
          location: response.location,
          createdBy: response.created_by.full_name,
          questions: questions
        };

        setSurveyData(processedData);
        console.log('Processed survey data:', processedData);

      } catch (error) {
        console.error('Error fetching survey data:', error);
        toast.error('Failed to fetch survey data');
        navigate('/maintenance/survey/response');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId, navigate]);

  const handleDownload = () => {
    console.log('Download survey responses');
  };

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

  // Prepare pie chart data for response distribution
  const getResponseDistributionData = () => {
    if (!surveyData || !surveyData.questions) return [];
    
    const responseDistribution = surveyData.questions.map((question: any, index: number) => ({
      name: `Q${question.id}: ${question.question.substring(0, 20)}...`,
      value: question.responses.length || question.responseCount || 0,
      color: ['#C72030', '#c6b692', '#d8dcdd', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'][index % 8]
    }));
    
    return responseDistribution;
  };

  // Prepare pie chart data for survey type distribution
  const getSurveyTypeDistributionData = () => {
    if (!surveyData || !apiData) return [];
    
    // Create type distribution based on survey data
    const typeDistribution = [
      {
        name: 'Survey Responses',
        value: surveyData.totalResponses || 0,
        color: '#C72030'
      },
      {
        name: 'Total Questions',
        value: surveyData.questions.length || 0,
        color: '#c6b692'
      },
      {
        name: 'Active Survey',
        value: 1, // This survey is active
        color: '#d8dcdd'
      },
      {
        name: 'Survey Type',
        value: surveyData.type === 'Survey' ? 1 : 0,
        color: '#8B5CF6'
      }
    ].filter(item => item.value > 0);
    
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
                  {surveyData.totalResponses}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Responses</div>
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDownload}
                  className="text-[#C72030] hover:text-[#C72030] hover:bg-transparent p-1"
                >
                  <Download className="w-4 h-4" />
                </Button>
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
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadQuestion(question.id)}
                      className="text-gray-600 hover:text-[#C72030] p-1"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyQuestion(question.id)}
                      className="text-[#C72030] hover:text-[#C72030] p-1 font-medium"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
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

            {/* Survey Type Distribution Pie Chart - Second Last Position */}
            <div className="mt-8">
              <SurveyAnalyticsCard
                title="Survey Type Distribution"
                type="surveyDistributions"
                data={getSurveyTypeDistributionData()}
                dateRange={{ 
                  startDate: new Date(apiData?.created_at || Date.now()), 
                  endDate: new Date() 
                }}
                onDownload={handleDownloadTypeChart}
              />
            </div>

            {/* Response Distribution Pie Chart - Last Position */}
            <div className="mt-6">
              <SurveyAnalyticsCard
                title="Response Distribution"
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
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Survey ID</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Survey Title</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Total Questions</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Response Count</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Created By</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Location</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Created Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-700">{surveyData.id}</td>
                      <td className="p-3 text-sm text-gray-700">{surveyData.surveyTitle || "N/A"}</td>
                      <td className="p-3 text-sm text-gray-700 text-center">{apiData?.question_count || surveyData.questions.length}</td>
                      <td className="p-3 text-sm text-gray-700 text-center">{surveyData.totalResponses}</td>
                      <td className="p-3 text-sm text-gray-700">{surveyData.createdBy}</td>
                      <td className="p-3 text-sm text-gray-700">{surveyData.location}</td>
                      <td className="p-3 text-sm text-gray-700">{surveyData.expiryDate}</td>
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