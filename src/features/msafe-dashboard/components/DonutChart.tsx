import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
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

type PieLabelProps = {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
  value?: number;
};

/** Value label drawn inside each slice's own ring (no connector line needed,
 *  so it doesn't fight the legend for space). Skipped below ~4% share since
 *  there isn't room to fit the text inside a sliver that thin. */
function renderDonutValueLabel(props: PieLabelProps) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0, value = 0 } = props;
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={9} fontWeight={700} fill="#fff">
      {value.toLocaleString()}
    </text>
  );
}

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

/** Full-width donut matching HTML Chart.js: 65% cutout + legend on the right.
 *  The legend is custom HTML (not recharts' built-in Legend) so it can wrap into a
 *  fixed number of columns and scroll within the card instead of overflowing into
 *  neighboring cards once the slice count gets large (e.g. 60+ departments). */
export function DonutChart({
  data,
  height = 220,
  showLegend = true,
  bodyLabel,
  legendColumns = 2,
  tooltipContent,
}: {
  data: Slice[];
  height?: number;
  showLegend?: boolean;
  bodyLabel?: string;
  legendColumns?: number;
  /** Overrides the default name/value tooltip — e.g. to show a fuller per-slice
   *  breakdown (completed/pending/etc.) instead of just the slice's total. */
  tooltipContent?: (props: TooltipProps<ValueType, NameType>) => ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  // Scales with the card's height instead of a flat 78px, so taller cards (more
  // slices, more legend rows) get a correspondingly bigger donut instead of a
  // small ring floating in a lot of empty vertical space.
  const outer = Math.round(Math.min(140, Math.max(78, height * 0.35)));
  const inner = Math.round(outer * 0.65);
  const legendRows = Math.max(1, Math.ceil(data.length / legendColumns));

  return (
    <div className="chart-wrap chart-wrap--pie" style={{ height, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: showLegend ? '0 0 45%' : '1 1 100%', minWidth: 0, height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={inner}
              outerRadius={outer}
              paddingAngle={0}
              stroke="none"
              isAnimationActive={false}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              label={renderDonutValueLabel}
              labelLine={false}
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
              content={tooltipContent ?? ((props) => <MsafeChartTooltip {...props} bodyLabel={bodyLabel} />)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {showLegend ? (
        <div
          style={{
            flex: '1 1 55%',
            minWidth: 0,
            maxHeight: height - 16,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateRows: `repeat(${legendRows}, auto)`,
            gridAutoFlow: 'column',
            columnGap: 16,
            rowGap: 6,
          }}
        >
          {data.map((d) => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span
                style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 10.5,
                  color: C.dark,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={d.name}
              >
                {d.name}
              </span>
              <span style={{ fontSize: 10.5, color: C.dark, fontWeight: 700, flexShrink: 0 }}>
                {d.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : null}
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
  tooltipContent,
}: {
  data: Slice[];
  centerValue: string;
  centerLabel: string;
  onRowClick?: (name: string) => void;
  bodyLabel?: string;
  /** Overrides the default name/value tooltip — e.g. to show a rate/percentage
   *  alongside the count instead of just the slice's total. */
  tooltipContent?: (props: TooltipProps<ValueType, NameType>) => ReactNode;
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
              content={tooltipContent ?? ((props) => <MsafeChartTooltip {...props} bodyLabel={bodyLabel} />)}
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
  tooltipContent,
}: {
  data: Slice[];
  height?: number;
  horizontal?: boolean;
  /** Overrides the default name/value tooltip — e.g. to show a fuller per-slice
   *  breakdown (approved/pending/etc.) instead of just the slice's total. */
  tooltipContent?: (props: TooltipProps<ValueType, NameType>) => ReactNode;
}) {
  if (horizontal) {
    return (
      <div className="chart-wrap" style={{ height }}>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE7D7" />
            <XAxis type="number" tick={{ fontSize: 10, fill: C.sage }} />
            <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fill: C.sage }} />
            <Tooltip
              cursor={false}
              content={tooltipContent ?? ((props) => <MsafeChartTooltip {...props} />)}
            />
            <Bar dataKey="value" radius={[0, 5, 5, 0]}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                style={{ fontSize: 10, fill: C.dark, fontWeight: 600 }}
                formatter={(v: number) => v.toLocaleString()}
              />
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
            content={tooltipContent ?? ((props) => <MsafeChartTooltip {...props} />)}
          />
          <Bar dataKey="value" radius={[5, 5, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              style={{ fontSize: 10, fill: C.dark, fontWeight: 600 }}
              formatter={(v: number) => v.toLocaleString()}
            />
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
