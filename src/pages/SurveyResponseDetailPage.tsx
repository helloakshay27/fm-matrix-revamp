import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SurveyResponseDetailPage = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("summary");
  const [surveyData, setSurveyData] = useState<any>(null);

  useEffect(() => {
    console.log('=== SURVEY DETAIL PAGE DEBUGGING ===');
    console.log('Survey ID from URL:', surveyId);
    console.log('Navigation state:', location.state);
    console.log('Passed survey data:', location.state?.surveyData);
    
    // Get data from navigation state
    const passedData = location.state?.surveyData;
    
    if (passedData) {
      console.log('✅ Using REAL data from table row:', passedData);
      const processedData = {
        id: passedData.id,
        surveyTitle: passedData.surveyTitle,
        totalResponses: passedData.responses || 0,
        type: "Survey",
        tickets: passedData.tickets || 0,
        expiryDate: passedData.expiryDate,
        questions: [
          {
            id: 1,
            question: "Survey ID",
            responseCount: 1,
            responses: [passedData.id.toString()]
          },
          {
            id: 2,
            question: "Survey Title",
            responseCount: 1,
            responses: [passedData.surveyTitle]
          },
          {
            id: 3,
            question: "Number of Responses",
            responseCount: 1,
            responses: [passedData.responses.toString()]
          },
          {
            id: 4,
            question: "Number of Tickets",
            responseCount: 1,
            responses: [passedData.tickets.toString()]
          },
          {
            id: 5,
            question: "Expiry Date",
            responseCount: 1,
            responses: [passedData.expiryDate]
          }
        ]
      };
      setSurveyData(processedData);
      console.log('Processed survey data:', processedData);
    } else {
      console.log('❌ No data passed - user accessed page directly');
      // If no data passed, redirect back to response list
      navigate('/maintenance/survey/response');
    }
  }, [surveyId, location.state, navigate]);

  const handleDownload = () => {
    console.log('Download survey responses');
  };

  const handleCopyQuestion = (questionId: number) => {
    console.log('Copy question responses:', questionId);
  };

  const handleDownloadQuestion = (questionId: number) => {
    console.log('Download question responses:', questionId);
  };

  if (!surveyData) {
    return (
      <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">Loading survey details...</h1>
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
          </TabsContent>

          <TabsContent value="tabular" className="mt-6">
            <div className="bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Sr. No.</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Survey ID</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Survey Title</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">No. Of Responses</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">No. Of Tickets</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Expiry Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-700">1</td>
                      <td className="p-3 text-sm text-gray-700">{surveyData.id}</td>
                      <td className="p-3 text-sm text-gray-700">{surveyData.surveyTitle}</td>
                      <td className="p-3 text-sm text-gray-700 text-center">{surveyData.totalResponses}</td>
                      <td className="p-3 text-sm text-gray-700 text-center">{surveyData.tickets}</td>
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