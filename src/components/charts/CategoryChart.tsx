import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryChartProps {
  data: Array<{
    name: string;
    proactive: number;
    reactive: number;
    value: number;
  }>;
  title?: string;
  className?: string;
}

const COLORS = ['#C72030', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

export const CategoryChart: React.FC<CategoryChartProps> = ({ 
  data, 
  title = "Category Distribution",
  className = "" 
}) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-analytics-text">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [value, 'Total Tickets']}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
