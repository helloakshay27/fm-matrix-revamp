import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, Clock, CheckCircle, AlertTriangle, User, Wrench } from 'lucide-react';
import { AMCServiceTrackingLog } from '@/services/amcAnalyticsAPI';

interface AMCServiceTrackingCardProps {
  data: AMCServiceTrackingLog[] | null;
  onDownload: () => Promise<void>;
}

export function AMCServiceTrackingCard({ data, onDownload }: AMCServiceTrackingCardProps) {
  const getStatusColor = (active: boolean, visitDate: string) => {
    const now = new Date();
    const visit = new Date(visitDate);
    const isOverdue = visit < now && active;
    
    if (!active) {
      return 'text-green-600 bg-green-50'; // Completed
    } else if (isOverdue) {
      return 'text-red-600 bg-red-50'; // Overdue
    } else {
      return 'text-blue-600 bg-blue-50'; // Scheduled
    }
  };

  const getStatusIcon = (active: boolean, visitDate: string) => {
    const now = new Date();
    const visit = new Date(visitDate);
    const isOverdue = visit < now && active;
    
    if (!active) {
      return <CheckCircle className="w-4 h-4" />;
    } else if (isOverdue) {
      return <AlertTriangle className="w-4 h-4" />;
    } else {
      return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (active: boolean, visitDate: string) => {
    const now = new Date();
    const visit = new Date(visitDate);
    const isOverdue = visit < now && active;
    
    if (!active) {
      return 'COMPLETED';
    } else if (isOverdue) {
      return 'OVERDUE';
    } else {
      return 'SCHEDULED';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate summary statistics
  const completedServices = data?.filter(item => !item.active).length || 0;
  const totalServices = data?.length || 0;
  const activeServices = data?.filter(item => item.active) || [];
  const scheduledServices = activeServices.filter(item => new Date(item.visit_date) >= new Date()).length;
  const overdueServices = activeServices.filter(item => new Date(item.visit_date) < new Date()).length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Service Tracking
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            data-download-button
          >
            <Download className="w-4 h-4" />
            
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-900">{completedServices}</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Scheduled</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">{scheduledServices}</div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-900">{overdueServices}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Total</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalServices}</div>
          </div>
        </div>

        {/* Service Tracking Table */}
        <div className="flex-1 overflow-hidden">
          {!data || data.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Wrench className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No service tracking data available</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium text-gray-700">AMC Name</th>
                    <th className="text-left p-3 font-medium text-gray-700">Type</th>
                    <th className="text-left p-3 font-medium text-gray-700">Technician</th>
                    <th className="text-left p-3 font-medium text-gray-700">Visit #</th>
                    <th className="text-left p-3 font-medium text-gray-700">Visit Date</th>
                    <th className="text-left p-3 font-medium text-gray-700">AMC Period</th>
                    <th className="text-left p-3 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((service, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{service.asset_amc_name}</div>
                        <div className="text-xs text-gray-500">ID: {service.asset_amc_id}</div>
                      </td>
                      <td className="p-3 text-gray-700">{service.type}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{service.technician_name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          #{service.visit_number}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{formatDate(service.visit_date)}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">
                        <div className="text-xs">
                          <div>{formatDate(service.amc_start_date)}</div>
                          <div className="text-gray-500">to {formatDate(service.amc_end_date)}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.active, service.visit_date)}`}>
                          {getStatusIcon(service.active, service.visit_date)}
                          {getStatusText(service.active, service.visit_date)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
