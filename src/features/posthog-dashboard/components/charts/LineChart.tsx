import { useMemo, useRef, useState } from 'react';

export interface LineChartProps {
  cur: number[];
  prev?: number[];
  showPrev?: boolean;
  labels?: string[];
  height?: number;
  maxHeight?: number | string;
}

interface TooltipState {
  x: number;
  y: number;
  idx: number;
  curVal: number;
  prevVal?: number;
  label?: string;
}

const SVG_WIDTH = 680;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatAxisValue(value: number): string {
  if (!Number.isFinite(value)) return '0';
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1).replace(/\.0$/, '')}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1).replace(/\.0$/, '')}K`;
  }
  if (Math.abs(value) < 10) {
    return value.toFixed(1).replace(/\.0$/, '');
  }
  return value.toFixed(0);
}

function buildPath(values: number[], xAt: (index: number) => number, yAt: (value: number) => number): string {
  if (values.length === 0) return '';

  return values
    .map((value, index) => `${index === 0 ? 'M' : 'L'}${xAt(index).toFixed(1)} ${yAt(value).toFixed(1)}`)
    .join(' ');
}

function buildAreaPath(values: number[], xAt: (index: number) => number, yAt: (value: number) => number, baseline: number): string {
  if (values.length === 0) return '';

  const head = values.map((value, index) => `${index === 0 ? 'M' : 'L'}${xAt(index).toFixed(1)} ${yAt(value).toFixed(1)}`).join(' ');
  const lastX = xAt(values.length - 1);
  return `${head} L${lastX.toFixed(1)} ${baseline.toFixed(1)} L${xAt(0).toFixed(1)} ${baseline.toFixed(1)} Z`;
}

export function LineChart({
  cur,
  prev,
  showPrev = true,
  labels,
  height = 250,
  maxHeight,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const safeCur = useMemo(() => cur.filter((value) => Number.isFinite(value)), [cur]);
  const safePrev = useMemo(() => (prev ?? []).filter((value) => Number.isFinite(value)), [prev]);

  const hasData = safeCur.length >= 2 || safePrev.length >= 2;
  const usePrev = !!showPrev && safePrev.length >= 2;

  const chartHeight = height;
  const chartWidth = SVG_WIDTH;
  const paddingLeft = 56;
  const paddingRight = 18;
  const paddingTop = 18;
  const paddingBottom = 32;
  const activeChartWidth = chartWidth - paddingLeft - paddingRight;
  const activeChartHeight = chartHeight - paddingTop - paddingBottom;
  const gridBottom = chartHeight - paddingBottom;

  if (!hasData) {
    return (
      <div style={{ width: '100%', minHeight: chartHeight, display: 'grid', placeItems: 'center', color: '#667085', background: 'rgba(148, 163, 184, 0.04)', borderRadius: 12, border: '1px solid rgba(148, 163, 184, 0.15)' }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>No data available for this range</span>
      </div>
    );
  }

  const seriesLength = Math.max(safeCur.length, safePrev.length);
  const allValues = [...safeCur, ...safePrev];
  const minValue = Math.min(0, ...allValues, 0);
  const maxValue = Math.max(...allValues, 0);
  const safeMax = maxValue === minValue ? maxValue + 1 : maxValue;
  const domainMin = minValue <= 0 ? Math.min(0, minValue) : 0;
  const domainMax = safeMax;
  const domainRange = Math.max(domainMax - domainMin, 1);

  const xAt = (index: number) => {
    if (seriesLength <= 1) return paddingLeft + activeChartWidth / 2;
    return paddingLeft + (index / (seriesLength - 1)) * activeChartWidth;
  };

  const yAt = (value: number) => {
    const ratio = (value - domainMin) / domainRange;
    return gridBottom - ratio * activeChartHeight;
  };

  const tickValues = [domainMax, (domainMax + domainMin) / 2, domainMin];
  const xStep = Math.max(1, Math.ceil((seriesLength - 1) / 5));
  const xTicks = Array.from({ length: seriesLength }, (_, index) => index).filter((index) => index % xStep === 0 || index === seriesLength - 1);

  const currentPath = buildPath(safeCur, xAt, yAt);
  const prevPath = usePrev ? buildPath(safePrev, xAt, yAt) : '';
  const areaPath = buildAreaPath(safeCur, xAt, yAt, gridBottom);

  const handleMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const scaleX = chartWidth / rect.width;
    const rawMouseX = (event.clientX - rect.left) * scaleX;

    if (rawMouseX < paddingLeft - 8 || rawMouseX > chartWidth - paddingRight + 8) {
      setTooltip(null);
      return;
    }

    const nearestIndex = clamp(
      Math.round(((rawMouseX - paddingLeft) / activeChartWidth) * (seriesLength - 1)),
      0,
      seriesLength - 1,
    );

    const currentValue = safeCur[nearestIndex] ?? safeCur[safeCur.length - 1] ?? 0;
    const previousValue = usePrev ? safePrev[nearestIndex] ?? safePrev[safePrev.length - 1] : undefined;

    setTooltip({
      x: xAt(nearestIndex),
      y: yAt(currentValue),
      idx: nearestIndex,
      curVal: currentValue,
      prevVal: previousValue,
      label: labels?.[nearestIndex] ?? `Point ${nearestIndex + 1}`,
    });
  };

  const tipWidth = usePrev ? 150 : 130;
  const tipHeight = usePrev ? 78 : 58;
  const tipX = tooltip
    ? clamp(tooltip.x + 12, paddingLeft + 4, chartWidth - paddingRight - tipWidth - 4)
    : 0;
  const tipY = tooltip
    ? clamp(tooltip.y - tipHeight / 2, paddingTop + 6, chartHeight - paddingBottom - tipHeight - 4)
    : 0;

  const axisFont = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      style={{
        display: 'block',
        maxHeight: maxHeight ?? undefined,
        height: typeof height === 'number' ? `${height}px` : height,
        cursor: 'crosshair',
        overflow: 'hidden',
      }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTooltip(null)}
      role="img"
      aria-label="Line chart"
    >
      {xTicks.map((index) => {
        const x = xAt(index);
        return (
          <g key={`grid-${index}`}>
            <line
              x1={x}
              x2={x}
              y1={paddingTop}
              y2={gridBottom}
              stroke="rgba(148, 163, 184, 0.38)"
              strokeDasharray="3 5"
            />
            <text
              x={x}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize={10}
              fill="#667085"
              fontFamily={axisFont}
            >
              {labels?.[index] ?? `P${index + 1}`}
            </text>
          </g>
        );
      })}

      {tickValues.map((tickValue, index) => {
        const y = yAt(tickValue);
        return (
          <text
            key={`tick-${tickValue}-${index}`}
            x={paddingLeft - 10}
            y={y + 4}
            textAnchor="end"
            fontSize={11}
            fill="#64748b"
            fontFamily={axisFont}
          >
            {formatAxisValue(tickValue)}
          </text>
        );
      })}

      <line x1={paddingLeft} x2={chartWidth - paddingRight} y1={gridBottom} y2={gridBottom} stroke="rgba(148, 163, 184, 0.25)" />

      {areaPath && <path d={areaPath} fill="rgba(44, 123, 229, 0.12)" />}

      {usePrev && prevPath && (
        <path
          d={prevPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth={1.8}
          strokeDasharray="5 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {currentPath && (
        <path
          d={currentPath}
          fill="none"
          stroke="#2c7be5"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {safeCur.length > 0 && (
        <circle
          cx={xAt(safeCur.length - 1)}
          cy={yAt(safeCur[safeCur.length - 1])}
          r={4}
          fill="#2c7be5"
          stroke="#ffffff"
          strokeWidth={2}
        />
      )}

      {tooltip && (
        <g style={{ pointerEvents: 'none' }}>
          <line
            x1={tooltip.x}
            x2={tooltip.x}
            y1={paddingTop}
            y2={gridBottom}
            stroke="rgba(15, 23, 42, 0.6)"
            strokeDasharray="4 4"
          />
          <circle cx={tooltip.x} cy={tooltip.y} r={5} fill="#2c7be5" stroke="#ffffff" strokeWidth={2} />
          {usePrev && typeof tooltip.prevVal === 'number' && (
            <circle cx={tooltip.x} cy={yAt(tooltip.prevVal)} r={3.5} fill="#94a3b8" stroke="#ffffff" strokeWidth={1.5} />
          )}

          <rect x={tipX} y={tipY} width={tipWidth} height={tipHeight} rx={8} fill="rgba(15, 23, 42, 0.9)" />
          <text x={tipX + 10} y={tipY + 16} fontSize={10} fill="#dfe7f3" fontFamily={axisFont}>
            {tooltip.label}
          </text>
          <text x={tipX + 10} y={tipY + 34} fontSize={12} fontWeight={600} fill="#ffffff" fontFamily={axisFont}>
            {formatAxisValue(tooltip.curVal)} current
          </text>
          {usePrev && typeof tooltip.prevVal === 'number' && (
            <text x={tipX + 10} y={tipY + 52} fontSize={11} fill="#dfe7f3" fontFamily={axisFont}>
              {formatAxisValue(tooltip.prevVal)} previous
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
