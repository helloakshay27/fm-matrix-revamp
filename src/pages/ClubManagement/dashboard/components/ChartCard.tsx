import React, { useEffect, useRef, useState } from 'react';
import { Chart, type ChartConfiguration, type ChartType } from 'chart.js/auto';
import { AiInsightBlock, type AiInsightSource } from './AiInsightBlock';
import { InfoTooltip } from './InfoTooltip';
import type { InfoEntry } from '../clubDashboardData';

// Matches the wireframe's `Chart.defaults.responsive = true; Chart.defaults.maintainAspectRatio = false;`.
// Without this, Chart.js falls back to its own default aspect ratio and, after first paint,
// recomputes a canvas width to match it against our fixed chart-box height - producing a
// much smaller drawing buffer that our CSS then stretches back up, which reads as blurry text/lines.
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

export interface ChartTypeOption {
  type: ChartType;
  label: string;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  info?: InfoEntry;
  types: ChartTypeOption[];
  buildConfig: (type: ChartType) => ChartConfiguration;
  table?: { headers: (string | number)[]; rows: (string | number)[][] };
  // Live mode (preferred): re-requests this chart's own data endpoint with ai_insights=true.
  insightSource?: AiInsightSource;
  // Legacy mode: charts with no backing API yet fall back to calling Anthropic directly.
  ctxText?: string;
  height?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, info, types, buildConfig, table, insightSource, ctxText, height = 190 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [activeType, setActiveType] = useState<ChartType>(types[0].type);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, buildConfig(activeType));

    // Defensive: keep the canvas's drawing buffer matched to its box across any later
    // layout change (window resize, table/chart toggle, sidebar collapse, etc).
    let resizeObserver: ResizeObserver | undefined;
    if (boxRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => chartRef.current?.resize());
      resizeObserver.observe(boxRef.current);
    }

    return () => {
      resizeObserver?.disconnect();
      chartRef.current?.destroy();
      chartRef.current = null;
    };
    // `buildConfig` is intentionally in the deps: each chart component wraps it in its own
    // useCallback keyed on its live data props, so its identity changes exactly when a
    // React Query result arrives after first paint. Without this, the chart was only ever
    // built once from whatever `buildConfig` closed over at mount (usually empty/loading
    // data), and never rebuilt when the real data showed up - it would sit blank until the
    // user clicked a Bar/Donut/Table switch button, which changes `activeType` and forces
    // this effect to re-run anyway.
  }, [activeType, buildConfig]);

  return (
    <div className="card">
      <div className="card-title">
        <span>
          {title}
          {info && <InfoTooltip info={info} />}
        </span>
        <div className="chart-switch">
          {types.map((t) => (
            <button
              key={t.type}
              className={viewMode === 'chart' && activeType === t.type ? 'active' : ''}
              onClick={() => {
                setViewMode('chart');
                setActiveType(t.type);
              }}
            >
              {t.label}
            </button>
          ))}
          {table && (
            <button className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')}>
              Table
            </button>
          )}
        </div>
      </div>
      {subtitle && <div className="chart-sub">{subtitle}</div>}
      <div className="chart-box" ref={boxRef} style={{ height, display: viewMode === 'chart' ? 'block' : 'none' }}>
        <canvas ref={canvasRef} />
      </div>
      {table && viewMode === 'table' && (
        <table>
          <tbody>
            <tr>
              {table.headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((c, ci) => (
                  <td key={ci}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {(insightSource || ctxText) && <AiInsightBlock source={insightSource} ctxText={ctxText} />}
    </div>
  );
};
