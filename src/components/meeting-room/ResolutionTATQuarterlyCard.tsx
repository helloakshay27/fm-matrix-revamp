import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPeriodLabels } from '@/lib/periodLabel';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter } from 'recharts';

interface ResolutionTATQuarterlyCardProps {
  data: Array<{ site: string; resolutionLast: number; resolutionCurrent: number }> | null;
  className?: string;
  dateRange?: { startDate: Date; endDate: Date };
}

export const ResolutionTATQuarterlyCard: React.FC<ResolutionTATQuarterlyCardProps> = ({ data, className, dateRange }) => {
  const chartData = Array.isArray(data) ? data : [];
  const { lastLabel, currentLabel } = getPeriodLabels(
    dateRange?.startDate ?? new Date(),
    dateRange?.endDate ?? new Date()
  );

  const chartMax = useMemo(() => {
    const values = chartData.flatMap(d => [Number(d.resolutionLast) || 0, Number(d.resolutionCurrent) || 0]);
    const max = values.length ? Math.max(...values) : 100;
    return Math.ceil(Math.max(max, 100) / 10) * 10;
  }, [chartData]);

  const scatterDataLast = chartData.map(item => ({ site: item.site, value: item.resolutionLast }));
  const scatterDataCurrent = chartData.map(item => ({ site: item.site, value: item.resolutionCurrent }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Resolution Achieved (TAT in Percentage)</CardTitle>
    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-[#8B6D4F] bg-[repeating-linear-gradient(-45deg,#fff,#fff_2px,#8B6D4F_2px,#8B6D4F_4px)]" />
      <span>{lastLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#C4AD98]" />
      <span>{currentLabel}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[540px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 16, left: 16, bottom: 5 }}>
            <defs>
              <pattern id="stripedPattern" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <line x1="0" y="0" x2="0" y2="6" stroke="#C4B89D" strokeWidth="2" />
              </pattern>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, chartMax]} tickFormatter={(t) => `${t}%`} orientation="top" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="site" tick={{ fontSize: 12 }} width={120} />
            <Tooltip formatter={(value: any) => [`${value}%`, '']} />
            <Legend verticalAlign="top" align="right" />
            <Bar dataKey="resolutionLast" fill="url(#stripedPattern)" name={lastLabel} />
            <Bar dataKey="resolutionCurrent" fill="#C4AE9D" name={currentLabel} />
            <Scatter data={scatterDataLast} fill="#000000" name={`${lastLabel} (Dots)`} shape="circle" />
            <Scatter data={scatterDataCurrent} fill="#FF0000" name={`${currentLabel} (Dots)`} shape="circle" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ResolutionTATQuarterlyCard;
