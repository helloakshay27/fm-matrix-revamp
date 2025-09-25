import React from 'react';
import { getPeriodLabels } from '@/lib/periodLabel';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

export type VisitorTrendRow = {
  site: string;
  last: number;
  current: number;
};

const VisitorTrendAnalysisCard: React.FC<{ data: any; dateRange?: { startDate: Date; endDate: Date } } > = ({ data, dateRange }) => {
  const rows: VisitorTrendRow[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.rows)
        ? data.rows
        : [];

  const height = Math.max(300, (rows?.length || 0) * 48);
  const { lastLabel, currentLabel, periodUnit } = getPeriodLabels(
    dateRange?.startDate ?? new Date(),
    dateRange?.endDate ?? new Date()
  );

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Visitor Trend Analysis</h3>
      {rows.length === 0 ? (
        <div className="text-sm text-gray-500">No visitor trend data available.</div>
      ) : (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <BarChart
              data={rows}
              layout="vertical"
              barCategoryGap="10%"
              barGap={3}
              margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" label={{ value: 'Counts', position: 'insideBottom', offset: -5 }} />
              <YAxis type="category" dataKey="site" tick={{ fontSize: 12 }} width={200} />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="last" fill="#dad8cf" name={lastLabel} barSize={28}>
                <LabelList dataKey="last" position="right" style={{ fontSize: 10 }} />
              </Bar>
              <Bar dataKey="current" fill="#c5ae94" name={currentLabel} barSize={28}>
                <LabelList dataKey="current" position="right" style={{ fontSize: 10 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="text-sm text-gray-500 mt-4">
        <strong>Note:</strong> This graph shows the total visitor count compared to the previous {periodUnit.toLowerCase()}.
      </p>
    </div>
  );
};

export default VisitorTrendAnalysisCard;
