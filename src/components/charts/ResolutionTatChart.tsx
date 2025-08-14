import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResolutionTatChartProps {
  data: any;
  title?: string;
  className?: string;
}

export const ResolutionTatChart: React.FC<ResolutionTatChartProps> = ({ 
  data, 
  title = "Resolution TAT Analysis",
  className = "" 
}) => {
  // Transform the resolution TAT data for chart display
  const transformedData = React.useMemo(() => {
    if (!data?.response) return [];
    
    const response = data.response;
    return Object.entries(response).map(([category, values]: [string, any]) => ({
      category,
      withinTAT: values.within_tat || 0,
      beyondTAT: values.beyond_tat || 0,
      total: (values.within_tat || 0) + (values.beyond_tat || 0)
    }));
  }, [data]);

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-analytics-text">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [value, name === 'withinTAT' ? 'Within TAT' : 'Beyond TAT']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="withinTAT" fill="#10B981" name="Within TAT" />
            <Bar dataKey="beyondTAT" fill="#EF4444" name="Beyond TAT" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
