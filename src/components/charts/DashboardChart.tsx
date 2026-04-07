import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { BarChart3, RefreshCw } from 'lucide-react';

export const T = {
  brown900: '#3D2B1F', brown700: '#7A5C44', brown500: '#A0856C',
  brown400: '#BFA08A', brown200: '#DEC9B8', brown100: '#EDE0D4',
  brown50:  '#F7F3EF', grey700:  '#64748b', grey500:  '#94a3b8',
  grey200:  '#e2e8f0', white:    '#ffffff',
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: T.white, border: `1px solid ${T.brown200}`,
      borderRadius: 12, padding: '14px 16px', minWidth: 220,
      boxShadow: '0 8px 24px rgba(100,70,40,0.10)', fontFamily: 'inherit',
    }}>
      <p style={{
        fontSize: 13, fontWeight: 600, color: T.brown900,
        margin: '0 0 10px', paddingBottom: 10, borderBottom: `1px solid ${T.grey200}`,
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: entry.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: T.brown700, fontWeight: 500 }}>{entry.name}</span>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 700, color: T.brown900,
              background: T.brown50, border: `1px solid ${T.brown100}`,
              padding: '2px 10px', borderRadius: 6,
            }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomLegend = ({ bars = [] }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
    {bars.map(({ color, name }) => (
      <span key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.grey700, fontWeight: 500 }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
        {name}
      </span>
    ))}
  </div>
);

const SortBtn = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    fontSize: 11, padding: '4px 12px', borderRadius: 6, fontFamily: 'inherit',
    border: active ? `1px solid ${T.brown500}` : `1px solid ${T.brown200}`,
    background: active ? T.brown100 : 'transparent',
    color: active ? T.brown700 : T.brown500,
    cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500,
  }}>
    {label}
  </button>
);

const DashboardChart = ({
  data = [],
  labelKey = 'name',
  bars = [], 
  title = 'Project Completion',
  xMax = 300,
  xTicks = [0, 50, 100, 150, 200, 250, 300],
  showSort = true,
  style: styleProp = {},
  className,
  onRefresh,
}: {
  data?: Record<string, unknown>[];
  labelKey?: string;
  bars?: { dataKey: string; name: string; color: string }[];
  title?: string;
  xMax?: number;
  xTicks?: number[];
  showSort?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onRefresh?: () => void;
}) => {
  const sortOptions = bars.map(b => ({ key: b.dataKey, label: b.name }));
  sortOptions.push({ key: '__label__', label: 'Name' });

  const [sortKey, setSortKey] = useState(sortOptions[0]?.key);

  const sorted = [...data].sort((a, b) => {
    if (sortKey === '__label__') return String(a[labelKey]).localeCompare(String(b[labelKey]));
    return (Number(b[sortKey]) || 0) - (Number(a[sortKey]) || 0);
  });

  const itemHeight = Math.max(bars.length * 12, 38);
  const chartHeight = Math.max(sorted.length * itemHeight + 30, 150);
  const MAX_VISIBLE_HEIGHT = 500;
  const needsScroll = chartHeight > MAX_VISIBLE_HEIGHT;

  return (
    <div className={className} style={{
      background: T.white, borderRadius: 16, border: `1px solid ${T.brown100}`,
      padding: '20px 24px', fontFamily: 'system-ui, -apple-system, sans-serif', ...styleProp,
    }}>
      {/* ── Header Section ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.brown100}`,
        flexWrap: 'wrap', gap: 10,
      }}>
        {/* Left Side: Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 7, background: T.brown50, borderRadius: 8, border: `1px solid ${T.brown100}`, display: 'flex' }}>
            <BarChart3 size={15} color={T.brown500} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.brown900 }}>{title}</span>
        </div>

        {/* Right Side: Legend & Refresh Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <CustomLegend bars={bars} />
          
          {onRefresh && (
            <button 
              onClick={onRefresh}
              title="Refresh Data"
              style={{
                background: T.brown50,
                border: `1px solid ${T.brown200}`,
                borderRadius: 6,
                padding: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: T.brown700,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = T.brown100; e.currentTarget.style.color = T.brown900; }}
              onMouseOut={(e) => { e.currentTarget.style.background = T.brown50; e.currentTarget.style.color = T.brown700; }}
            >
              <RefreshCw size={14} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* ── Sort Section ── */}
      {data.length > 0 && showSort && sortOptions.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, color: T.brown400, marginRight: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Sort
          </span>
          {sortOptions.map(s => (
            <SortBtn key={s.key} label={s.label} active={sortKey === s.key} onClick={() => setSortKey(s.key)} />
          ))}
        </div>
      )}

      {/* ── No Data State ── */}
      {data.length === 0 && (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: T.brown500, fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={32} color={T.brown200} />
          <span>No data available for this chart</span>
        </div>
      )}

      {/* ── Chart Section ── */}
      {data.length > 0 && (
        <div style={{
          maxHeight: MAX_VISIBLE_HEIGHT,
          overflowY: needsScroll ? 'auto' : 'hidden',
          overflowX: 'hidden',
          borderRadius: 8,
          border: needsScroll ? `1px solid ${T.brown100}` : 'none',
        }}>
          <div style={{ width: '100%', height: chartHeight }}>
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart layout="vertical" data={sorted} margin={{ top: 0, right: 16, left: 10, bottom: 0 }} barGap={3} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical stroke={T.brown100} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: T.grey500, fontWeight: 400 }} domain={[0, xMax]} ticks={xTicks} />
                <YAxis
                  dataKey={labelKey}
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={200}
                  tick={({ x, y, payload }) => {
                    const label = String(payload.value);
                    const maxLen = 28;
                    const display = label.length > maxLen ? label.slice(0, maxLen) + '…' : label;
                    return (
                      <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fill={T.brown700} fontWeight={500}>
                        <title>{label}</title>
                        {display}
                      </text>
                    );
                  }}
                />
                <Tooltip cursor={{ fill: T.brown500, opacity: 0.04 }} content={<CustomTooltip />} />

                {bars.map((barItem) => (
                  <Bar key={barItem.dataKey} dataKey={barItem.dataKey} name={barItem.name} fill={barItem.color} barSize={8} radius={[0, 4, 4, 0]}>
                    {sorted.map((_, i) => (
                      <Cell key={i} fill={barItem.color} opacity={sortKey === barItem.dataKey ? Math.max(1 - i * 0.055, 0.35) : 1} />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardChart;