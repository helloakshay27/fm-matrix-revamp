import React from 'react';
import { Download, AlertTriangle, MessageCircle, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CriticalQuestion {
  question_id?: number;
  question?: string;
  question_text?: string;
  survey_id?: number;
  survey_name?: string;
  critical_score?: number;
  response_count?: number;
  [key: string]: any; // Allow additional properties from API
}

interface CriticalSurveyCardProps {
  criticalQuestions?: CriticalQuestion[];
  loading?: boolean;
  error?: string | null;
  onDownload?: () => void;
  className?: string;
}

export const CriticalSurveyAnalysisCard: React.FC<CriticalSurveyCardProps> = ({
  criticalQuestions = [],
  loading = false,
  error = null,
  onDownload,
  className = '',
}) => {
  const handleDownload = () => {
    if (onDownload) onDownload();
  };

  // Prepare chart data
  const chartData = criticalQuestions.map((question, index) => ({
    name: question.survey_name || `Survey ${question.survey_id || index + 1}`,
    responses: question.response_count || 0,
    options: question.option_selection_count || 0,
    critical_score: question.critical_score || 0,
    color: `hsl(${(index * 45) % 360}, 70%, 50%)` // Generate different colors
  }));

  const COLORS = [
    '#dc2626', // red-600
    '#ea580c', // orange-600
    '#d97706', // amber-600
    '#ca8a04', // yellow-600
    '#65a30d', // lime-600
    '#16a34a', // green-600
    '#059669', // emerald-600
    '#0d9488', // teal-600
  ];

  const pieChartData = chartData.map((item, index) => ({
    name: item.name,
    value: item.responses,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-6 pb-0">
        <h3 className="text-base sm:text-lg font-bold text-[#dc2626]">Critical Survey Analysis</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-red-700 hover:text-red-900"
            onClick={handleDownload}
          />
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-3 sm:p-6 pt-0">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="flex items-center justify-center mb-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            </div>
            Loading critical questions...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : criticalQuestions && criticalQuestions.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-red-700">Total Critical Surveys</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{criticalQuestions.length}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-orange-700">Total Responses</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {criticalQuestions.reduce((sum, q) => sum + (q.response_count || 0), 0)}
                </div>
              </div>
              {/* <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-700">Option Selections</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {criticalQuestions.reduce((sum, q) => sum + (q.option_selection_count || 0), 0)}
                </div>
              </div> */}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Response Distribution</h4>
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="55%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Critical Survey Metrics</h4>
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#d1d5db' }}
                        angle={-15}
                        textAnchor="end"
                        interval={0}
                        height={60}
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
                      <Bar dataKey="responses" fill="#dc2626" name="Responses" radius={[4, 4, 0, 0]} />
                      {/* <Bar dataKey="options" fill="#ea580c" name="Option Selections" radius={[4, 4, 0, 0]} /> */}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Survey Details Table */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Critical Survey Details</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {/* <th className="text-left py-2 px-4 font-semibold text-gray-700">Survey ID</th> */}
                      <th className="text-left py-2 px-4 font-semibold text-gray-700">Survey Name</th>
                      <th className="text-center py-2 px-4 font-semibold text-gray-700">Responses</th>
                      {/* <th className="text-center py-2 px-4 font-semibold text-gray-700">Options</th> */}
                      <th className="text-center py-2 px-4 font-semibold text-gray-700">Critical Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criticalQuestions.map((question, index) => (
                      <tr key={question.survey_id || index} className="border-b border-gray-100 hover:bg-white/50">
                        {/* <td className="py-2 px-4 text-sm text-gray-600">{question.survey_id}</td> */}
                        <td className="py-2 px-4 text-sm font-medium text-gray-800">{question.survey_name}</td>
                        <td className="py-2 px-4 text-sm text-center">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            {question.response_count || 0}
                          </span>
                        </td>
                        {/* <td className="py-2 px-4 text-sm text-center">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                            {question.option_selection_count || 0}
                          </span>
                        </td> */}
                        <td className="py-2 px-4 text-sm text-center">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            {question.critical_score || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="mb-2">No critical surveys found requiring attention</p>
            <div className="text-xs text-gray-400">
              <p>This could mean:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>No surveys have responses that require attention</li>
                <li>All surveys are performing normally</li>
                <li>The API returned empty results</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriticalSurveyAnalysisCard;
