import React from 'react';
import { Download, TrendingUp, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface TrendingSurveyCardProps {
  trendingSurvey?: {
    id: number;
    name: string;
    response_count: number;
    option_selection_count: number;
  };
  onDownload?: () => void;
  className?: string;
}

export const TrendingSurveyAnalysisCard: React.FC<TrendingSurveyCardProps> = ({
  trendingSurvey,
  onDownload,
  className = '',
}) => {
  const handleDownload = () => {
    if (onDownload) onDownload();
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-6 pb-0">
        <h3 className="text-base sm:text-lg font-bold text-[#2563eb]">Trending Survey Analysis</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-blue-700 hover:text-blue-900"
            onClick={handleDownload}
          />
        )}
      </div>
      <div className="flex-1 overflow-auto p-3 sm:p-6 pt-0">
        {trendingSurvey ? (
          <div className="space-y-6">
            {/* Survey Title */}
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-700">Top Trending Survey</span>
              </div>
              <div className="text-lg font-bold text-blue-600 truncate">{trendingSurvey.name}</div>
            </div>
            
            {/* Bar Chart for Trending Survey */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Survey Analytics</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Trending Data</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: 'Responses',
                        value: trendingSurvey.response_count,
                        color: '#22c55e'
                      },
                      // {
                      //   name: 'Options Selected',
                      //   value: trendingSurvey.option_selection_count,
                      //   color: '#f59e42'
                      // }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#6b7280', fontSize: 14 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#d1d5db' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      labelStyle={{ color: '#374151', fontWeight: 'semibold' }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={80}
                    >
                      {[
                        {
                          name: 'Responses',
                          value: trendingSurvey.response_count,
                          color: '#22c55e'
                        },
                        // {
                        //   name: 'Options Selected',
                        //   value: trendingSurvey.option_selection_count,
                        //   color: '#f59e42'
                        // }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Summary Stats Below Chart */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {/* <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Survey ID</div>
                  <div className="text-lg font-bold text-gray-800">{trendingSurvey.id}</div>
                </div> */}
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Total Responses</div>
                  <div className="text-lg font-bold text-green-600">{trendingSurvey.response_count}</div>
                </div>
                {/* <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Options Selected</div>
                  <div className="text-lg font-bold text-orange-600">{trendingSurvey.option_selection_count}</div>
                </div> */}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No trending survey data available
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingSurveyAnalysisCard;
