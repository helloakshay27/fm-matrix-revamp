import React from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface AMCVendorPerformanceCardProps {
  data: Array<{
    vendorName: string;
    totalAMCs: number;
    activeAMCs: number;
    completedServices: number;
    pendingServices: number;
    performanceScore: number;
    avgResponseTime: number;
  }> | null;
  className?: string;
  onDownload?: () => Promise<void>;
}

export const AMCVendorPerformanceCard: React.FC<AMCVendorPerformanceCardProps> = ({ data, className, onDownload }) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "AMC vendor performance data downloaded successfully"
        });
      } catch (error) {
        console.error('Error downloading AMC vendor performance data:', error);
        toast({
          title: "Error", 
          description: "Failed to download AMC vendor performance data",
          variant: "destructive"
        });
      }
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-[#C72030]">AMC Vendor Performance</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer text-[#C72030] hover:text-[#A01828]"
            onClick={handleDownload}
          />
        )}
      </div>
      
      {data && data.length > 0 ? (
        <div className="space-y-6">
          {/* Performance Score Chart */}
          <div className="h-80">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Scores</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data.slice(0, 10)} // Show top 10 vendors
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                <XAxis 
                  dataKey="vendorName" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#374151', fontSize: 10 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fill: '#374151', fontSize: 12 }}
                  label={{ value: 'Performance Score (%)', angle: -90, position: 'insideLeft' }}
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
                              <span className="text-blue-600 font-medium">Performance Score:</span>
                              <span className="text-gray-700">{data.performanceScore}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-green-600 font-medium">Total AMCs:</span>
                              <span className="text-gray-700">{data.totalAMCs}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-orange-600 font-medium">Avg Response:</span>
                              <span className="text-gray-700">{data.avgResponseTime}h</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="performanceScore" 
                  fill="#3b82f6" 
                  name="Performance Score" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Vendor Performance Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Vendor Details</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {data.slice(0, 8).map((vendor, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border ${getPerformanceBgColor(vendor.performanceScore)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-semibold text-gray-800 text-sm">{vendor.vendorName}</h5>
                    <span className={`text-lg font-bold ${getPerformanceColor(vendor.performanceScore)}`}>
                      {vendor.performanceScore}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">Total AMCs:</span>
                      <span className="font-semibold ml-1">{vendor.totalAMCs}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Active:</span>
                      <span className="font-semibold ml-1">{vendor.activeAMCs}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold ml-1">{vendor.completedServices}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Response:</span>
                      <span className="font-semibold ml-1">{vendor.avgResponseTime}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No AMC vendor performance data available for the selected date range
        </div>
      )}
    </div>
  );
};
