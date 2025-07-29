import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AMCAnalyticsCardProps {
  title: string;
  data: any;
  type: 'statusOverview' | 'typeDistribution' | 'vendorPerformance' | 'expiryAnalysis' | 'costAnalysis' | 'serviceTracking' | 'complianceReport';
  className?: string;
}

export const AMCAnalyticsCard: React.FC<AMCAnalyticsCardProps> = ({
  title,
  data,
  type,
  className = ''
}) => {
  if (!data) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderContent = () => {
    switch (type) {
      case 'statusOverview':
        const statusData = [
          { name: 'Active', value: data.active_amc || 0, fill: '#10b981' },
          { name: 'Inactive', value: data.inactive_amc || 0, fill: '#ef4444' },
        ];
        
        return (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Active: {data.active_amc || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Inactive: {data.inactive_amc || 0}</span>
              </div>
            </div>
          </div>
        );

      case 'typeDistribution':
        const typeData = [
          { name: 'Service', value: data.service_total || 0, fill: '#3b82f6' },
          { name: 'Assets', value: data.assets_total || 0, fill: '#8b5cf6' },
        ];
        
        return (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-semibold text-blue-600">{data.service_total || 0}</div>
                <div className="text-gray-600">Service AMCs</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="font-semibold text-purple-600">{data.assets_total || 0}</div>
                <div className="text-gray-600">Asset AMCs</div>
              </div>
            </div>
          </div>
        );

      case 'vendorPerformance':
        return (
          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-800">{(data.active_amc || 0) + (data.inactive_amc || 0)}</div>
              <div className="text-gray-600">Total Vendors</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-600">{data.active_amc || 0}</div>
                <div className="text-gray-600">Active Contracts</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-semibold text-red-600">{data.inactive_amc || 0}</div>
                <div className="text-gray-600">Expired Contracts</div>
              </div>
            </div>
          </div>
        );

      case 'expiryAnalysis':
        return (
          <div className="space-y-4">
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-xl font-bold text-orange-600">Analysis</div>
              <div className="text-gray-600">Contract Expiry Tracking</div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Upcoming expirations and renewal schedules will be displayed here.</p>
            </div>
          </div>
        );

      case 'costAnalysis':
        return (
          <div className="space-y-4">
            <div className="text-center p-4 bg-yellow-50 rounded">
              <div className="text-xl font-bold text-yellow-600">Cost Tracking</div>
              <div className="text-gray-600">AMC Cost Analysis</div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Cost breakdown and budget analysis will be shown here.</p>
            </div>
          </div>
        );

      case 'serviceTracking':
        return (
          <div className="space-y-4">
            <div className="text-center p-4 bg-indigo-50 rounded">
              <div className="text-xl font-bold text-indigo-600">Service Logs</div>
              <div className="text-gray-600">Maintenance Tracking</div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Service schedules and completion status will be displayed here.</p>
            </div>
          </div>
        );

      case 'complianceReport':
        return (
          <div className="space-y-4">
            <div className="text-center p-4 bg-teal-50 rounded">
              <div className="text-xl font-bold text-teal-600">Compliance</div>
              <div className="text-gray-600">Regulatory Compliance</div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Compliance status and regulatory requirements tracking.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-muted-foreground">
            Chart type not implemented
          </div>
        );
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg border-gray-200 group ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};