// new comment //
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { GripVertical, Calendar, Clock, Users } from 'lucide-react';

interface ScheduleAnalyticsCardProps {
  title: string;
  data: any;
  type: 'schedule_overview' | 'schedule_completion' | 'resource_utilization';
}

const COLORS = ['#10B981', '#F59E0B', '#C72030', '#3B82F6', '#8B5CF6', '#EF4444'];

export const ScheduleAnalyticsCard: React.FC<ScheduleAnalyticsCardProps> = ({ title, data, type }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: title });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContent = () => {
    if (!data) {
      return <div className="text-center text-analytics-muted py-8">No data available</div>;
    }

    switch (type) {
      case 'schedule_overview':
        if (data.total_schedules !== undefined) {
          const overviewData = [
            { name: 'Completed', value: data.completed_schedules || 0, color: '#10B981' },
            { name: 'Pending', value: data.pending_schedules || 0, color: '#F59E0B' },
            { name: 'Overdue', value: data.overdue_schedules || 0, color: '#C72030' }
          ];

          const scheduleBreakdown = data.schedule_breakdown ? [
            { name: 'Daily', value: data.schedule_breakdown.daily || 0 },
            { name: 'Weekly', value: data.schedule_breakdown.weekly || 0 },
            { name: 'Monthly', value: data.schedule_breakdown.monthly || 0 },
            { name: 'Yearly', value: data.schedule_breakdown.yearly || 0 }
          ] : [];

          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={overviewData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {overviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-analytics-text">Schedule Status</span>
                  </div>
                  {overviewData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-analytics-text">{item.name}</span>
                      </div>
                      <span className="font-medium text-analytics-text">{item.value}</span>
                    </div>
                  ))}
                  
                  <div className="pt-2 border-t border-analytics-border">
                    <div className="flex justify-between">
                      <span className="text-sm text-analytics-muted">Completion Rate</span>
                      <span className="font-medium text-green-600">
                        {Math.round(data.completion_rate || 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {scheduleBreakdown.length > 0 && (
                <div>
                  <h4 className="font-medium text-analytics-text mb-2">Schedule Frequency</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={scheduleBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
        }
        break;

      case 'schedule_completion':
        if (data.completion_trend || data.monthly_completion) {
          const trendData = data.completion_trend || [];
          const monthlyData = data.monthly_completion || [];

          return (
            <div className="space-y-4">
              {trendData.length > 0 && (
                <div>
                  <h4 className="font-medium text-analytics-text mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Completion Trend
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
                      <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} name="Pending" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {monthlyData.length > 0 && (
                <div>
                  <h4 className="font-medium text-analytics-text mb-2">Monthly Performance</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="completion_rate" fill="#3B82F6" name="Completion %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
        }
        break;

      case 'resource_utilization':
        if (data.resource_allocation || data.department_wise) {
          const resourceData = data.resource_allocation || [];
          const departmentData = data.department_wise || [];

          return (
            <div className="space-y-4">
              {resourceData.length > 0 && (
                <div>
                  <h4 className="font-medium text-analytics-text mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Resource Allocation
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {resourceData.slice(0, 5).map((resource: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-analytics-background rounded">
                        <div>
                          <div className="font-medium text-analytics-text text-sm">
                            {resource.resource_name || 'Unknown Resource'}
                          </div>
                          <div className="text-xs text-analytics-muted">
                            {resource.allocated_schedules || 0} schedules
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {Math.round(resource.utilization_rate || 0)}%
                          </div>
                          <div className="text-xs text-analytics-muted">
                            {resource.completed_schedules || 0} completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {departmentData.length > 0 && (
                <div>
                  <h4 className="font-medium text-analytics-text mb-2">Department Efficiency</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="efficiency_rate" fill="#8B5CF6" name="Efficiency %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
        }
        break;

      default:
        return <div className="text-center text-analytics-muted py-8">Chart type not supported</div>;
    }

    return <div className="text-center text-analytics-muted py-8">Invalid data format</div>;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="bg-background border-analytics-border hover:shadow-lg transition-shadow h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-analytics-text">{title}</CardTitle>
          <div {...listeners} className="cursor-grab hover:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-analytics-muted" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};