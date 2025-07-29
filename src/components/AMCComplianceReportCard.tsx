import React from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface AMCComplianceReportCardProps {
  data: {
    overallCompliance: number;
    categoryCompliance: Array<{
      category: string;
      complianceScore: number;
      totalRequirements: number;
      metRequirements: number;
    }>;
    riskAreas: Array<{
      area: string;
      riskLevel: 'High' | 'Medium' | 'Low';
      count: number;
    }>;
  } | null;
  className?: string;
  onDownload?: () => Promise<void>;
}

const RISK_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b', 
  Low: '#10b981'
};

export const AMCComplianceReportCard: React.FC<AMCComplianceReportCardProps> = ({ data, className, onDownload }) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC compliance report data downloaded successfully"
        });
      } catch (error) {
        console.error('Error downloading AMC compliance report data:', error);
        toast({
          title: "Error", 
          description: "Failed to download AMC compliance report data",
          variant: "destructive"
        });
      }
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const riskChartData = data?.riskAreas?.map(item => ({
    name: item.area,
    value: item.count,
    riskLevel: item.riskLevel,
    color: RISK_COLORS[item.riskLevel]
  }));

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-[#C72030]">AMC Compliance Report</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-[#C72030] hover:text-[#A01828]"
            onClick={handleDownload}
          />
        )}
      </div>
      
      {data ? (
        <div className="space-y-6">
          {/* Overall Compliance Score */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getComplianceBgColor(data.overallCompliance)}`}>
              <span className={`text-2xl font-bold ${getComplianceColor(data.overallCompliance)}`}>
                {data.overallCompliance}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">Overall Compliance Score</p>
          </div>

          {/* Category Compliance */}
          {data.categoryCompliance && data.categoryCompliance.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Category Compliance</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={data.categoryCompliance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                    <XAxis 
                      dataKey="category" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: '#374151', fontSize: 10 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fill: '#374151', fontSize: 12 }}
                      label={{ value: 'Compliance Score (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-800 mb-2">{label}</p>
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-blue-600 font-medium">Compliance:</span>
                                  <span className="text-gray-700">{data.complianceScore}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-green-600 font-medium">Met:</span>
                                  <span className="text-gray-700">{data.metRequirements}/{data.totalRequirements}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="complianceScore" 
                      fill="#3b82f6" 
                      name="Compliance Score" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Risk Areas */}
          {data.riskAreas && data.riskAreas.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Distribution Pie Chart */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Risk Distribution</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {riskChartData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Areas List */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">Risk Areas</h4>
                <div className="space-y-2">
                  {data.riskAreas.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: RISK_COLORS[risk.riskLevel] }}
                        />
                        <span className="text-sm font-medium text-gray-700">{risk.area}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{risk.count}</div>
                        <div className="text-xs text-gray-500">{risk.riskLevel} Risk</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No AMC compliance report data available for the selected date range
        </div>
      )}
    </div>
  );
};
