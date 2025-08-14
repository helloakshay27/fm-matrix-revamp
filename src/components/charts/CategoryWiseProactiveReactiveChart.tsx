import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CategoryWiseProactiveReactiveChartProps {
  data: Array<{
    category: string;
    proactive: { Open: number; Closed: number };
    reactive: { Open: number; Closed: number };
  }>;
  title?: string;
  className?: string;
}

export const CategoryWiseProactiveReactiveChart: React.FC<CategoryWiseProactiveReactiveChartProps> = ({ 
  data, 
  title = "Category-wise Proactive vs Reactive",
  className = "" 
}) => {
  // Transform data for chart display
  const transformedData = React.useMemo(() => {
    return data.map(item => ({
      category: item.category,
      proactiveOpen: item.proactive.Open,
      proactiveClosed: item.proactive.Closed,
      reactiveOpen: item.reactive.Open,
      reactiveClosed: item.reactive.Closed,
      totalProactive: item.proactive.Open + item.proactive.Closed,
      totalReactive: item.reactive.Open + item.reactive.Closed
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
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  proactiveOpen: 'Proactive Open',
                  proactiveClosed: 'Proactive Closed',
                  reactiveOpen: 'Reactive Open',
                  reactiveClosed: 'Reactive Closed'
                };
                return [value, labels[name as string] || name];
              }}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            <Bar dataKey="proactiveOpen" fill="#C6B692" name="Proactive Open" />
            <Bar dataKey="proactiveClosed" fill="#D8DCDD" name="Proactive Closed" />
            <Bar dataKey="reactiveOpen" fill="#F59E0B" name="Reactive Open" />
            <Bar dataKey="reactiveClosed" fill="#10B981" name="Reactive Closed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
