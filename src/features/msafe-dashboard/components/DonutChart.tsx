import { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { C } from '../data/constants';
import { MsafeChartTooltip } from './MsafeChartTooltip';

export type Slice = { name: string; value: number; color: string };

type ActiveShapeProps = {
  cx?: number;
  cy?: number;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  fill?: string;
};

/** Subtle expand on hover — mirrors Chart.js doughnut hoverOffset: 4 */
function renderActiveShape(props: ActiveShapeProps) {
  const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0, startAngle = 0, endAngle = 0, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={Number(outerRadius) + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="none"
    />
  );
}

/** Full-width donut matching HTML Chart.js: 65% cutout + legend on the right */
export function DonutChart({
  data,
  height = 220,
  showLegend = true,
  bodyLabel,
}: {
  data: Slice[];
  height?: number;
  showLegend?: boolean;
  bodyLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const outer = 78;
  const inner = Math.round(outer * 0.65);

  return (
    <div className="chart-wrap chart-wrap--pie" style={{ height }}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart margin={{ top: 8, right: showLegend ? 8 : 8, bottom: 8, left: 8 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx={showLegend ? '38%' : '50%'}
            cy="50%"
            innerRadius={inner}
            outerRadius={outer}
            paddingAngle={0}
            stroke="none"
            isAnimationActive={false}
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} style={{ cursor: 'pointer' }} />
            ))}
          </Pie>
          {/* Tooltip MUST be a direct child of PieChart — Recharts findChildByType */}
          <Tooltip
            cursor={false}
            allowEscapeViewBox={{ x: true, y: true }}
            wrapperStyle={{ outline: 'none', zIndex: 40, pointerEvents: 'none' }}
            content={(props) => <MsafeChartTooltip {...props} bodyLabel={bodyLabel} />}
          />
          {showLegend ? (
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="square"
              iconSize={10}
              wrapperStyle={{ fontSize: 10.5, color: C.sage, paddingLeft: 8 }}
              formatter={(value) => <span style={{ color: C.dark, fontWeight: 500 }}>{value}</span>}
            />
          ) : null}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** HTML `.donut-block` — small donut + external side legend (KRCC / Training PF) */
export function SideLegendDonut({
  data,
  centerValue,
  centerLabel,
  onRowClick,
  bodyLabel,
}: {
  data: Slice[];
  centerValue: string;
  centerLabel: string;
  onRowClick?: (name: string) => void;
  bodyLabel?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const outer = 68;
  const inner = Math.round(outer * 0.65);

  return (
    <div className="donut-block">
      <div className="donut-c">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={inner}
              outerRadius={outer}
              paddingAngle={0}
              stroke="#fff"
              strokeWidth={2}
              isAnimationActive={false}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} style={{ cursor: 'pointer' }} />
              ))}
            </Pie>
            <Tooltip
              cursor={false}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ outline: 'none', zIndex: 40, pointerEvents: 'none' }}
              content={(props) => <MsafeChartTooltip {...props} bodyLabel={bodyLabel} />}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <div className="dh-val">{centerValue}</div>
          <div className="dh-lbl">{centerLabel}</div>
        </div>
      </div>
      <div className="donut-legend">
        {data.map((d) => (
          <div
            key={d.name}
            className="dl-row"
            onClick={() => onRowClick?.(d.name)}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onRowClick && (e.key === 'Enter' || e.key === ' ')) onRowClick(d.name);
            }}
          >
            <span className="dl-sw" style={{ background: d.color }} />
            <span className="dl-lbl">{d.name}</span>
            <span className="dl-val">{d.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SliceBarChart({
  data,
  height = 220,
  horizontal = false,
}: {
  data: Slice[];
  height?: number;
  horizontal?: boolean;
}) {
  if (horizontal) {
    return (
      <div className="chart-wrap" style={{ height }}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
            <XAxis type="number" tick={{ fontSize: 10, fill: C.sage }} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fill: C.sage }} />
            <Tooltip cursor={false} content={(props) => <MsafeChartTooltip {...props} />} />
            <Bar dataKey="value" radius={[0, 5, 5, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="chart-wrap" style={{ height }}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ left: 0, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: C.sage }} />
          <YAxis tick={{ fontSize: 10, fill: C.sage }} />
          <Tooltip
            cursor={{ fill: 'rgba(44,44,44,.04)' }}
            content={(props) => <MsafeChartTooltip {...props} />}
          />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartTable({
  data,
  valueLabel = 'Value',
}: {
  data: Slice[];
  /** Matches HTML Chart.js table header (dataset label) */
  valueLabel?: string;
}) {
  return (
    <div className="chart-as-table">
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.name}>
              <td>{d.name}</td>
              <td>{typeof d.value === 'number' ? d.value.toLocaleString() : d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
