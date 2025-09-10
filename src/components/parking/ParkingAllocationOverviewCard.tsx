import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts';

export type ParkingAllocationRow = {
  site: string;
  Free: number;
  Paid: number;
  Vacant: number;
};

const ParkingAllocationOverviewCard: React.FC<{ data: any }> = ({ data }) => {
  const rows: ParkingAllocationRow[] = useMemo(() => {
    if (Array.isArray(data)) return data as ParkingAllocationRow[];
    const root = data?.data ?? data ?? [];
    return Array.isArray(root) ? (root as ParkingAllocationRow[]) : [];
  }, [data]);

  const height = Math.max(300, (rows?.length || 0) * 50);

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Parking Allocation Overview – Paid, Free & Vacant</h3>
      {rows.length === 0 ? (
        <div className="text-sm text-gray-500">No parking data available.</div>
      ) : (
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer>
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              barCategoryGap="10%"
              barGap={3}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                label={{ value: 'Count of Parking Slots', position: 'insideBottom', offset: -5 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis type="category" dataKey="site" tick={{ fontSize: 12 }} width={200} />
              <Tooltip />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="Free" fill="#a0b5c1" name="Free" barSize={28}>
                <LabelList dataKey="Free" position="right" style={{ fontSize: 10 }} />
              </Bar>
              <Bar dataKey="Paid" fill="#c5ae94" name="Paid" barSize={28}>
                <LabelList dataKey="Paid" position="right" style={{ fontSize: 10 }} />
              </Bar>
              <Bar dataKey="Vacant" fill="#dad8cf" name="Vacant" barSize={28}>
                <LabelList dataKey="Vacant" position="right" style={{ fontSize: 10 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="text-sm text-gray-500 mt-4">
        <strong>Note:</strong> This graph presents the current status of parking allocation, showing the distribution between paid, free, and vacant slots.
      </p>
    </div>
  );
};

export default ParkingAllocationOverviewCard;
