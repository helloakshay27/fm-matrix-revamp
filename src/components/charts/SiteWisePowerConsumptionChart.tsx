import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Download } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BarConfig {
  dataKey: string;
  name: string;
  fill: string;
  stackId?: string; // default: "a" (stacked); pass unique id to unstack
}

export interface LineConfig {
  dataKey: string;
  name: string;
  stroke: string;
  yAxisId?: 'left' | 'right'; // default: "right"
}

export interface SiteWisePowerChartProps {
  data?: any[];
  title?: string;
  className?: string;
  xAxisKey?: string;          // key used for X axis labels (default: "site")
  bars?: BarConfig[];         // custom bar definitions
  lines?: LineConfig[];       // custom line definitions
  leftYAxisLabel?: string;    // optional label for left Y axis
  rightYAxisLabel?: string;   // optional label for right Y axis
  leftYFormatter?: (v: number) => string;   // formatter for left Y axis ticks
  rightYFormatter?: (v: number) => string;  // formatter for right Y axis ticks
  height?: number;            // chart height in px (default: 300)
  onDownload?: () => void;    // custom download handler; falls back to CSV if not provided
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_BARS: BarConfig[] = [];

const DEFAULT_LINES: LineConfig[] = [];

const DEFAULT_DATA = [
  { site: 'Lockated Site 1', mains: 1287545, dg: 0,      renewable: 0,      consumptionPerSqFt: 2.1, costPerSqFt: 1.8 },
  { site: 'Lockated Site 2', mains: 980000,  dg: 120000, renewable: 45000,  consumptionPerSqFt: 1.8, costPerSqFt: 1.5 },
  { site: 'Lockated Site 3', mains: 650000,  dg: 80000,  renewable: 30000,  consumptionPerSqFt: 1.4, costPerSqFt: 1.2 },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const SiteWisePowerConsumptionChart: React.FC<SiteWisePowerChartProps> = ({
  data,
  title = 'Site Wise Power Consumption',
  className = '',
  xAxisKey = 'site',
  bars,
  lines,
  leftYAxisLabel,
  rightYAxisLabel,
  leftYFormatter  = (v) => v.toLocaleString('en-IN'),
  rightYFormatter = (v) => String(v),
  height = 300,
  onDownload,
}) => {
  const chartData = useMemo(() => {
    if (Array.isArray(data)) return data;
    return DEFAULT_DATA;
  }, [data]);

  const activeBars  = bars  ?? DEFAULT_BARS;
  const activeLines = lines ?? DEFAULT_LINES;

  // Determine if right Y axis is needed
  const hasRightAxis = activeLines.some(l => (l.yAxisId ?? 'right') === 'right');

  // ── Default CSV download ──────────────────────────────────────────────────
  const handleDefaultDownload = () => {
    const barKeys  = activeBars.map(b => b.name);
    const lineKeys = activeLines.map(l => l.name);
    const headers  = [xAxisKey, ...barKeys, ...lineKeys];
    const rows = chartData.map(row => [
      row[xAxisKey] ?? '',
      ...activeBars.map(b => row[b.dataKey] ?? ''),
      ...activeLines.map(l => row[l.dataKey] ?? ''),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadClick = () => {
    if (onDownload) onDownload();
    else handleDefaultDownload();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[160px]">
        <p className="font-semibold text-gray-800 mb-2 border-b border-gray-100 pb-1">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: entry.fill || entry.color }} />
            <span className="text-gray-700 text-sm">{entry.name} : </span>
            <span className="text-gray-900 text-sm font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-analytics-text">{title}</CardTitle>
        <button
          onClick={handleDownloadClick}
          className="p-1.5 rounded-md text-gray-500 hover:text-[#C72030] hover:bg-[#EDEAE3] transition-colors duration-200"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

            <XAxis
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
              dy={10}
            />

            {/* Left Y axis — always shown */}
            <YAxis
              yAxisId="left"
              label={leftYAxisLabel ? { value: leftYAxisLabel, angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#6B7280' } } : undefined}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={leftYFormatter}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
            />

            {/* Right Y axis — only if any line uses it */}
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                label={rightYAxisLabel ? { value: rightYAxisLabel, angle: 90, position: 'insideRight', style: { fontSize: 11, fill: '#6B7280' } } : undefined}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={rightYFormatter}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={false}
              />
            )}

            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />

            {/* Bars */}
            {activeBars.map(bar => (
              <Bar
                key={bar.dataKey}
                yAxisId="left"
                dataKey={bar.dataKey}
                name={bar.name}
                stackId={bar.stackId ?? 'a'}
                fill={bar.fill}
                legendType="square"
              />
            ))}

            {/* Lines */}
            {activeLines.map(line => (
              <Line
                key={line.dataKey}
                yAxisId={line.yAxisId ?? 'right'}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.stroke}
                strokeWidth={2}
                dot={{ r: 4, fill: line.stroke }}
                activeDot={{ r: 6 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};