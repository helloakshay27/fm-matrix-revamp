import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GripVertical } from 'lucide-react';

interface TicketAnalyticsCardProps {
  title: string;
  data: any;
  type: 'tickets_categorywise' | 'ticket_status' | 'ticket_aging_matrix' | 'unit_categorywise' | 'response_tat' | 'resolution_tat';
}

const COLORS = ['#C72030', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

export const TicketAnalyticsCard: React.FC<TicketAnalyticsCardProps> = ({ title, data, type }) => {
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
      case 'tickets_categorywise':
        if (Array.isArray(data)) {
          const chartData = data.map(item => ({
            name: item.category || 'Unknown',
            proactive: item.proactive_count || 0,
            reactive: item.reactive_count || 0,
            total: (item.proactive_count || 0) + (item.reactive_count || 0)
          }));

          return (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="proactive" fill="#10B981" name="Proactive" />
                  <Bar dataKey="reactive" fill="#C72030" name="Reactive" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-analytics-text">
                    {chartData.reduce((sum, item) => sum + item.proactive, 0)}
                  </div>
                  <div className="text-green-600">Proactive</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-analytics-text">
                    {chartData.reduce((sum, item) => sum + item.reactive, 0)}
                  </div>
                  <div className="text-red-600">Reactive</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-analytics-text">
                    {chartData.reduce((sum, item) => sum + item.total, 0)}
                  </div>
                  <div className="text-analytics-muted">Total</div>
                </div>
              </div>
            </div>
          );
        }
        break;

      case 'ticket_status':
        if (typeof data === 'object' && data !== null) {
          // Filter out non-numeric values and 'info' keys
          const statusData = Object.entries(data)
            .filter(([key, value]) => key !== 'info' && typeof value === 'number')
            .map(([key, value]) => ({
              name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              value: value as number
            }));

          if (statusData.length === 0) {
            return <div className="text-center text-analytics-muted py-8">No status data available</div>;
          }

          return (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                {statusData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-analytics-text">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;

      case 'ticket_aging_matrix':
        if (data && typeof data === 'object') {
          const agingData = Object.entries(data).map(([range, count]) => ({
            range: range.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count: count as number
          }));

          return (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agingData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="range" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#C72030" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        }
        break;

      case 'response_tat':
      case 'resolution_tat':
        if (data && typeof data === 'object') {
          // Filter out non-numeric values and extract only valid TAT data
          const tatData = Object.entries(data)
            .filter(([key, value]) => typeof value === 'number')
            .map(([key, value]) => ({
              category: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              time: value as number
            }));

          if (tatData.length === 0) {
            return <div className="text-center text-analytics-muted py-8">No TAT data available</div>;
          }

          return (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={tatData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="time" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
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