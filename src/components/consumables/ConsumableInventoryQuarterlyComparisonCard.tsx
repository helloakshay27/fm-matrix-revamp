import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import { getPeriodLabels } from '@/lib/periodLabel';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

type Props = {
  data: any;
  dateRange?: { startDate: Date; endDate: Date };
  onDownload?: () => void;
};

const ConsumableInventoryQuarterlyComparisonCard: React.FC<Props> = ({ data, dateRange, onDownload }) => {
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
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Consumable Inventory Value – {periodUnit}ly Comparison
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-50"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload(); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onMouseDown={(e) => { e.stopPropagation(); }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>

      <div className="flex-1 p-5 overflow-auto">
        {rows.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No data available
          </div>
        ) : (
          <>
            {/* Legend */}
            <div className="flex items-center justify-end gap-4 mb-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DA7756' }} />
                <span className="text-xs">{lastLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9EC8BA' }} />
                <span className="text-xs">{currentLabel}</span>
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={rows}
                margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
                barSize={28}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="site"
                  angle={-45}
                  textAnchor="end"
                  height={65}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  domain={[0, consumableMaxRaw || 0]}
                  ticks={consumableTicks}
                  tickFormatter={(v) => formatToK(v)}
                  tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  formatter={(val: any) => [formatToK(val), '']}
                />
                <Bar dataKey="lastQuarter" fill="#DA7756" name={lastLabel} radius={[4, 4, 0, 0]} />
                <Bar dataKey="currentQuarter" fill="#9EC8BA" name={currentLabel} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Note section */}
            <div className="p-3 rounded-md">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Note:</span> This graph illustrates total consumable inventory usage with a comparison to the previous quarter, highlighting trends in consumption.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsumableInventoryQuarterlyComparisonCard;
