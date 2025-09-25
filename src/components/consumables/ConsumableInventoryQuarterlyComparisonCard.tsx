import React, { useMemo } from 'react';
import { getPeriodLabels } from '@/lib/periodLabel';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

type Props = {
  data: any;
  dateRange?: { startDate: Date; endDate: Date };
};

const ConsumableInventoryQuarterlyComparisonCard: React.FC<Props> = ({ data, dateRange }) => {
  const rows = useMemo(() => {
    const root = data?.data?.consumable_inventory_comparison
      ?? data?.consumable_inventory_comparison
      ?? data
      ?? [];
    const arr = Array.isArray(root) ? root : [];
    return arr.map((r: any) => ({
      site: r.site_name || r.site || '-',
      lastQuarter: Number(r.last_quarter ?? 0),
      currentQuarter: Number(r.current_quarter ?? 0),
    }));
  }, [data]);

  // Match AllContent scaling and ticks
  const consumableMaxRaw = useMemo(() => {
    if (!Array.isArray(rows) || rows.length === 0) return 0;
    const vals = rows.flatMap(r => [r.lastQuarter, r.currentQuarter]);
    const max = Math.max(0, ...vals);
    const rounded = Math.ceil(max / 100000) * 100000; // round up to nearest 100k
    return Math.max(rounded, max || 0);
  }, [rows]);

  const consumableTicks = useMemo(() => {
    const max = consumableMaxRaw || 0;
    if (max === 0) return [0];
    const steps = 5;
    const step = max / steps;
    return Array.from({ length: steps + 1 }, (_, i) => Math.round(step * i));
  }, [consumableMaxRaw]);

  const formatToK = (n: any) => {
    const val = Number(n || 0);
    const scaled = val / 10000; // follow AllContent's k-scaling
    return `${scaled.toFixed(1)}k`;
  };

  const { periodUnit, lastLabel, currentLabel } = getPeriodLabels(
    dateRange?.startDate ?? new Date(),
    dateRange?.endDate ?? new Date()
  );

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Consumable Inventory Value – {periodUnit}ly Comparison</h3>
      {rows.length === 0 ? (
        <div className="text-sm text-gray-500">No consumable comparison data available.</div>
      ) : (
        <div style={{ width: '100%', height: 420 }}>
          <ResponsiveContainer>
            <BarChart
              data={rows}
              margin={{ top: 24, right: 24, left: 84, bottom: 84 }}
              barCategoryGap={20}
            >
              <CartesianGrid stroke="#ddd" strokeDasharray="3 3" />
              <XAxis
                dataKey="site"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                domain={[0, consumableMaxRaw || 0]}
                ticks={consumableTicks}
                tickFormatter={(v) => formatToK(v)}
                width={84}
                tickMargin={8}
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(val: any) => formatToK(val)} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} verticalAlign="top" align="right" />
              <Bar
                dataKey="lastQuarter"
                fill="#D6BBAF"
                name={lastLabel}
                barSize={40}
                label={{ position: 'top', formatter: (val: any) => formatToK(val), fill: '#444' }}
              />
              <Bar
                dataKey="currentQuarter"
                fill="#D3D6D4"
                name={currentLabel}
                barSize={40}
                label={{ position: 'top', formatter: (val: any) => formatToK(val), fill: '#444' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ConsumableInventoryQuarterlyComparisonCard;
