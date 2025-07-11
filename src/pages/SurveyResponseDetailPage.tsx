
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const mockSurveyData = {
  totalResponses: 20,
  questions: [
    {
      id: 1,
      question: "What is your name?",
      type: "text",
      responses: 20,
      answers: [
        "Abhidnya Vijay Tapal",
        "Abhidnya Vijay Tapal",
        "Abhidnya Vijay Tapal",
        "Abhidnya Vijay Tapal",
        "Abhidnya Vijay Tapal"
      ]
    },
    {
      id: 2,
      question: "What is your age group?",
      type: "pie",
      responses: 15,
      data: [
        { name: "under 18", value: 3, percentage: 20, color: "#C72030" },
        { name: "18-24", value: 6, percentage: 40, color: "#E53E3E" },
        { name: "24-35", value: 6, percentage: 40, color: "#B91C1C" }
      ]
    },
    {
      id: 3,
      question: "What would be your preferred payment method for online purchases?",
      type: "bar",
      responses: 20,
      data: [
        { name: "Credit/Debit Card", value: 4, percentage: 36.64 },
        { name: "UPI", value: 9, percentage: 81.8 },
        { name: "COD", value: 6, percentage: 54.5 },
        { name: "EMI", value: 1, percentage: 9.1 }
      ]
    }
  ]
};

export const SurveyResponseDetailPage = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleCopy = () => {
    console.log('Copy clicked');
  };

  const handleDownload = () => {
    console.log('Download clicked');
  };

  const renderPieChart = (data: any[]) => (
    <div className="flex items-center justify-between">
      <div className="w-80 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={160}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center -mt-40">
          <span className="text-4xl font-bold text-gray-700">
            {data.reduce((sum, item) => sum + item.value, 0)}
          </span>
        </div>
      </div>

      <div className="flex-1 ml-12">
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-700">{item.name}</span>
              </div>
              <div className="text-gray-600">
                ({item.percentage}%) <span className="font-semibold text-[#C72030]">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBarChart = (data: any[]) => (
    <div className="w-full">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="horizontal" margin={{ left: 120, right: 80 }}>
            <XAxis type="number" domain={[0, 10]} />
            <YAxis type="category" dataKey="name" width={100} />
            <Bar dataKey="value" fill="#C72030" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-700">{item.name}</span>
            <span className="text-gray-600">
              <span className="font-semibold text-[#C72030]">{item.value}</span> ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center hover:text-[#C72030]">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Survey</span>
          </button>
          <span className="mx-2">{'>'}</span>
          <span>Response</span>
        </nav>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Response Detail</h1>
      </div>

      {/* Summary Section */}
      <div className="bg-[#F6F4EE] p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-[#C72030] rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">📊</span>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C72030]">{mockSurveyData.totalResponses}</div>
              <div className="text-gray-600">Total Responses</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white">
                <TabsTrigger 
                  value="summary" 
                  className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white border-b-2 border-transparent data-[state=active]:border-[#C72030]"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger 
                  value="tabular"
                  className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
                >
                  Tabular
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center text-sm text-gray-600">
              <span>Type : </span>
              <span className="text-[#C72030] font-medium ml-1">Survey</span>
              <Button variant="ghost" size="sm" className="ml-2">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="summary" className="space-y-6">
          {mockSurveyData.questions.map((question, index) => (
            <div key={question.id} className="bg-[#F6F4EE] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{question.question}</h3>
                  <p className="text-gray-600">{question.responses} Responses</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopy}
                  className="text-[#C72030] hover:bg-[#C72030] hover:text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>

              {question.type === "text" && (
                <div className="bg-white rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div className="space-y-2">
                    {question.answers?.map((answer, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded text-gray-700">
                        {answer}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {question.type === "pie" && (
                <div className="bg-white rounded-lg p-6">
                  {renderPieChart(question.data)}
                </div>
              )}

              {question.type === "bar" && (
                <div className="bg-white rounded-lg p-6">
                  {renderBarChart(question.data)}
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="tabular">
          <div className="bg-[#F6F4EE] p-6 rounded-lg">
            <p className="text-gray-600">Tabular view content will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
