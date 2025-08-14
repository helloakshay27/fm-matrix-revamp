import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AgingMatrixChartProps {
  data: Array<{
    priority: string;
    T1: number;
    T2: number;
    T3: number;
    T4: number;
    T5: number;
  }>;
  title?: string;
  className?: string;
}

export const AgingMatrixChart: React.FC<AgingMatrixChartProps> = ({ 
  data, 
  title = "Ticket Aging Matrix",
  className = "" 
}) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-analytics-text">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="priority" 
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [value, `${name} (Days)`]}
              labelStyle={{ color: '#374151' }}
            />
            <Legend />
            <Bar dataKey="T1" fill="#10B981" name="0-1 Days" />
            <Bar dataKey="T2" fill="#F59E0B" name="1-3 Days" />
            <Bar dataKey="T3" fill="#EF4444" name="3-7 Days" />
            <Bar dataKey="T4" fill="#8B5CF6" name="7-15 Days" />
            <Bar dataKey="T5" fill="#6B7280" name="15+ Days" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
