
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const pieChartData = [
  { name: 'under 18', value: 3, percentage: 20, color: '#C72030' },
  { name: '18-24', value: 6, percentage: 40, color: '#E85A6B' },
  { name: '24-35', value: 6, percentage: 40, color: '#8B1C2A' },
];

const barChartData = [
  { name: 'Credit/Debit Card', value: 4, percentage: 36.64 },
  { name: 'UPI', value: 9, percentage: 81.8 },
  { name: 'COD', value: 6, percentage: 54.5 },
  { name: 'EMI', value: 1, percentage: 9.1 },
];

const chartConfig = {
  responses: {
    label: "Responses",
  },
};

export const SurveyResponseDetailPage = () => {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Survey</span>
          <span className="mx-2">{'>'}</span>
          <span>Response</span>
        </nav>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Response Detail</h1>
      </div>

      {/* Response Statistics Header */}
      <div className="bg-[#F6F4EE] p-6 rounded-lg mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 bg-[#C72030] opacity-10 rounded-full"></div>
            <div className="relative w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">20</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">20</div>
            <div className="text-sm text-gray-600">Total Responses</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-6 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'summary'
                  ? 'border-[#C72030] text-[#C72030]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('tabular')}
              className={`px-6 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'tabular'
                  ? 'border-[#C72030] text-[#C72030]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tabular
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Type : <span className="text-[#C72030] font-medium">Survey</span></span>
            <Button variant="ghost" size="sm" className="text-[#C72030] p-1">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Question 1: What is your name? */}
          <div className="bg-[#F6F4EE] p-6 rounded-lg">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-1">What is your name?</h3>
              <p className="text-sm text-gray-600">20 Responses</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 max-h-80 overflow-y-auto">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="py-3 px-4 border-b border-gray-100 last:border-b-0">
                  <span className="text-gray-700">Abhidnya Vijay Tapal</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question 2: What is your age group? */}
          <div className="bg-[#F6F4EE] p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">What is your age group?</h3>
                <p className="text-sm text-gray-600">15 Responses</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[#C72030] flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                {/* Pie Chart */}
                <div className="flex-1">
                  <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-700 text-2xl font-bold">
                        15
                      </text>
                    </PieChart>
                  </ChartContainer>
                </div>
                
                {/* Legend */}
                <div className="ml-8 space-y-4">
                  {pieChartData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">({item.percentage}%)</div>
                        <div className="text-sm font-medium text-gray-800">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Question 3: Payment Method */}
          <div className="bg-[#F6F4EE] p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">What would be your preferred payment method for online purchases?</h3>
                <p className="text-sm text-gray-600">20 Responses</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[#C72030] flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
            
            <div className="bg-white rounded-lg p-6">
              <ChartContainer config={chartConfig} className="w-full h-[300px]">
                <BarChart data={barChartData} layout="horizontal" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 9]} tickCount={5} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#C72030" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
              
              {/* Value labels on bars */}
              <div className="mt-4 space-y-2">
                {barChartData.map((item, index) => (
                  <div key={index} className="flex justify-end text-xs text-gray-600">
                    <span>{item.value} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tabular' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center text-gray-500 py-8">
            Tabular view will be implemented here
          </div>
        </div>
      )}
    </div>
  );
};
