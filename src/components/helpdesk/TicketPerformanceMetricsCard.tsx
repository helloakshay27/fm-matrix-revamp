import React, { useMemo, useRef, useEffect, useState } from 'react';

interface Props { data: any }

// Helpers copied from PDF mapping, simplified
const normalizeAgingBucket = (key: string): string => {
  if (!key) return '';
  let s = String(key).toLowerCase();
  s = s.replace(/days?/g, '').replace(/\s+/g, '').replace(/_/g, '-').replace(/to/g, '-');
  if (s.includes('40') && (s.includes('+') || s.includes('plus') || s.includes('above') || s.includes('more'))) return '40+';
  if (/^0-?10$/.test(s)) return '0-10';
  if (/^11-?20$/.test(s)) return '11-20';
  if (/^21-?30$/.test(s)) return '21-30';
  if (/^31-?40$/.test(s)) return '31-40';
  const m = s.match(/(\d+)-(\d+)/); if (m) { const a = +m[1], b = +m[2];
    if (a===0&&b===10) return '0-10'; if (a===11&&b===20) return '11-20'; if (a===21&&b===30) return '21-30'; if (a===31&&b===40) return '31-40'; }
  return s;
};

const parsePercentValue = (p: any): number => {
  if (p === null || p === undefined) return NaN;
  if (typeof p === 'number') return p;
  const n = parseFloat(String(p).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

const percentToAgeBand = (p: number | string | null | undefined): string => {
  const n = typeof p === 'number' ? p : parsePercentValue(p);
  if (!Number.isFinite(n)) return '';
  if (n <= 10) return '0-10';
  if (n <= 20) return '11-20';
  if (n <= 30) return '21-30';
  if (n <= 40) return '31-40';
  return '40+';
};

const agingColors: Record<string,string> = {
  // Updated to the colors provided by the user
  '0-10': 'bg-[#C4B89D]',
  '11-20': 'bg-[#D5DBDB]',
  '21-30': 'bg-[#DAD6C9]',
  '31-40': 'bg-[#C4B89D]',
  '40+': 'bg-[#F6F4EE]',
};

const displayPercent = (p: any): string => {
  if (p === null || p === undefined || p === '') return '';
  const s = String(p).trim();
  return s.endsWith('%') ? s : `${s}%`;
};

const getTextColor = () => 'text-black';

export const TicketPerformanceMetricsCard: React.FC<Props> = ({ data }) => {
  const apiMetrics = data?.data?.metrics ?? data?.metrics ?? [];

  // refs and state to measure positions so axes can be drawn to meet exactly at origin
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const siteLabelsRef = useRef<HTMLDivElement | null>(null);
  const [axisTop, setAxisTop] = useState<number | null>(null);
  const [gridTop, setGridTop] = useState<number | null>(null);

  const categories = useMemo(() => Array.isArray(apiMetrics) ? apiMetrics.map((m:any)=> m.category_name ?? m.category ?? 'Unknown') : [], [apiMetrics]);
  const sites = useMemo(() => {
    if (!Array.isArray(apiMetrics)) return [] as string[];
    const set = new Set<string>();
    apiMetrics.forEach((m:any) => Array.isArray(m.sites) && m.sites.forEach((s:any) => set.add(s.site_name ?? s.site)));
    return Array.from(set);
  }, [apiMetrics]);

  const grid = useMemo(() => {
    if (!Array.isArray(apiMetrics)) return [] as any[];
    const rows: any[] = [];
    categories.forEach((cat) => {
      const metric = apiMetrics.find((m:any) => (m.category_name ?? m.category) === cat) || {};
      sites.forEach((site) => {
        const siteObj = Array.isArray(metric.sites) ? metric.sites.find((s:any) => (s.site_name ?? s.site) === site) : undefined;
        let aging = '';
        const agingObj = siteObj?.aging_distribution ?? metric?.aging_distribution ?? null;
        if (agingObj && typeof agingObj === 'object') {
          let maxKey = '', maxVal = -Infinity;
          Object.entries(agingObj).forEach(([k,v]) => { const num = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.\-]/g,'')) || 0; if (num>maxVal){maxVal=num; maxKey=k as string;}});
          aging = normalizeAgingBucket(maxKey);
        }
        const volumeRaw = siteObj?.volume_percentage ?? metric?.volume_percentage;
        const closureRaw = siteObj?.closure_rate_percentage ?? metric?.closure_rate_percentage;
        const ageingRaw = siteObj?.ageing_percentage ?? siteObj?.aging_percentage ?? metric?.ageing_percentage ?? metric?.aging_percentage;
        const volumeNum = parsePercentValue(volumeRaw);
        const closureNum = parsePercentValue(closureRaw);
        const ageingNum = parsePercentValue(ageingRaw);
        const chosen = Number.isFinite(volumeNum) ? volumeNum : (Number.isFinite(closureNum) ? closureNum : (Number.isFinite(ageingNum) ? ageingNum : undefined));
        const band = chosen !== undefined ? percentToAgeBand(chosen) : '';
        rows.push({ category: cat, site, volume: volumeRaw ?? '', closure: closureRaw ?? '', agingBand: band || aging });
      });
    });
    return rows;
  }, [apiMetrics, categories, sites]);

  // measure positions after render so axes can be positioned precisely
  useEffect(() => {
    const w = wrapperRef.current;
    const g = gridRef.current;
    const s = siteLabelsRef.current;
    if (!w || !g || !s) {
      setAxisTop(null);
      setGridTop(null);
      return;
    }
    const wRect = w.getBoundingClientRect();
    const gRect = g.getBoundingClientRect();
    const sRect = s.getBoundingClientRect();
    // compute coordinates relative to wrapper
    setGridTop(Math.round(gRect.top - wRect.top));
    setAxisTop(Math.round(sRect.top - wRect.top));
  }, [sites.length, categories.length, grid.length]);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <h3   className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3"
        style={{
          fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}>Ticket Performance Metrics by Category – Volume, Closure Rate & Ageing</h3>
      <div className="flex items-center justify-between gap-4 flex-wrap text-sm mb-3">
        <div className="flex items-center gap-1">
          <span>% of tickets raised by category</span>
          <span>↔</span>
          <span>% of tickets closure by category</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Ageing:</span>
          {/* show legend in reverse order: 40+ first, then down to 0-10 */}
          {Object.entries(agingColors).slice().reverse().map(([range, color]) => (
            <span key={range} className="flex items-center gap-1"><span className={`w-3 h-3 rounded-full ${color}`} />{range}</span>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Left Categories */}
        <div className="flex flex-col justify-around gap-[2px]">
          {categories.map((cat, idx) => (
            <div key={idx} className="h-14 flex items-center justify-end pr-2 text-xs font-medium">{cat}</div>
          ))}
        </div>

  {/* Wrapper containing grid + site labels + absolute axes */}
  <div ref={wrapperRef} className="relative flex-1 ">
          {/* Grid */}
          <div ref={gridRef} className="grid min-w-0 ml-3 mr-3" style={{gridTemplateColumns:`repeat(${sites.length},minmax(80px,1fr))`, gap: '8px'}}>
            {grid.map((item, index) => (
              <div key={index} className="relative h-14 border border-[#C4AE9D] bg-white min-w-0 overflow-hidden px-3">
                <div className={`absolute inset-0 [clip-path:polygon(0_0,100%_0,100%_100%)] ${agingColors[item.agingBand] || 'bg-white'}`}></div>
                <div className="absolute inset-0 [clip-path:polygon(0_100%,0_0,100%_100%)] bg-white"></div>
                <div className={`absolute top-1 right-1 text-[11px] ${getTextColor()}`}><span className="font-bold">{displayPercent(item.volume)}</span></div>
                <div className={`absolute bottom-1 left-2 text-[11px] ${getTextColor()}`}>{displayPercent(item.closure)}</div>
              </div>
            ))}
          </div>

          {/* Site labels (site names row) */}
          <div ref={siteLabelsRef} className="grid mt-3" style={{gridTemplateColumns:`repeat(${sites.length},minmax(80px,1fr))`, gap: '4px'}}>
            {sites.map((site, index) => (
              <div key={index} className="text-center text-xs font-medium mt-2">{site}</div>
            ))}
          </div>

          {/* Axes: render only when measurements are available */}
          {axisTop !== null && gridTop !== null && (
            <>
              {/* vertical Y-axis: start at top of grid and end at X-axis (axisTop) - thicker */}
              <div className="absolute bg-gray-700 mr-2" style={{left: 0, top: gridTop, width: 1, height: Math.max(0, axisTop - gridTop), zIndex: 40}} />
              {/* horizontal X-axis: draw across columns, positioned at axisTop - thicker */}
              <div className="absolute bg-gray-700" style={{left: 0, top: axisTop - 1, right: 0, height: 1, zIndex: 40}} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPerformanceMetricsCard;