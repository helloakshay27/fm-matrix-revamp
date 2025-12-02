import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Download } from 'lucide-react';

type Props = {
  data: any;
  onDownload?: () => void;
};

const normalizeSiteKey = (name: string) => {
  if (!name) return '';
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
};

const parseCapitalBook = (val: any): number => {
  if (val === null || val === undefined) return 0;
  const s = String(val).trim().toLowerCase();
  const num = parseFloat(s.replace(/[^0-9.\-]/g, ''));
  if (Number.isNaN(num)) return 0;
  if (s.includes('l')) return num * 100000; // Lakh
  if (s.includes('k')) return num * 1000;   // Thousand
  return num;
};

const parsePercentSimple = (val: any): number => {
  if (val === null || val === undefined) return 0;
  const n = parseFloat(String(val).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const Block = ({ capitalText, stock }: { capitalText: string; stock: number | string }) => (
  <div className="relative w-full h-full bg-white">
    <svg className="absolute top-0 left-0 w-full h-full" viewBox="0,0 100,100" preserveAspectRatio="none" style={{ pointerEvents: 'none' }}>
      <polygon points="0,0 100,0 100,100" style={{ fill: '#C4B89D' }} />
    </svg>
    <div className="absolute top-[2px] right-[4px] text-white font-semibold text-xs">{capitalText}</div>
    <div className="absolute bottom-[2px] left-[4px] text-black text-xs">{stock}%</div>
  </div>
);

const OverstockTop10ItemsCard: React.FC<Props> = ({ data, onDownload }) => {
  const inv = useMemo(() => data?.data?.inventory_overstock_report ?? data?.inventory_overstock_report ?? null, [data]);
  const legacy = useMemo(() => data?.data?.overstock_top_items_by_site ?? data?.overstock_top_items_by_site ?? null, [data]);

  // refs and state to measure positions for axis alignment
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const siteLabelsRef = useRef<HTMLDivElement | null>(null);
  const [axisTop, setAxisTop] = useState<number | null>(null);
  const [gridTop, setGridTop] = useState<number | null>(null);

  const grid = useMemo(() => {
    if (inv) {
      const matrix: any[] = Array.isArray(inv.matrix_data) ? inv.matrix_data : [];
      let sites: string[] = Array.isArray(inv.sites) ? inv.sites.slice() : [];
      let siteKeys: string[] = [];

      if (sites.length > 0) {
        siteKeys = sites.map(normalizeSiteKey);
      } else if (matrix.length > 0) {
        const first: any = matrix[0] || {};
        siteKeys = Object.keys(first).filter((k) => {
          if (k === 'item_name') return false;
          const v = first[k];
          return v && typeof v === 'object' && ('capital_book' in v || 'current_stock' in v);
        });
        sites = siteKeys.map((k) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
      }

      if (sites.length > 0 && matrix.length > 0) {
        const items = matrix.slice(0, 10).map((row: any) => {
          const capitalText = siteKeys.map((k) => {
            const raw = row?.[k]?.capital_book ?? '';
            if (typeof raw === 'string' && /[lk]/i.test(raw)) {
              return String(raw).trim().replace(/l/g, 'L');
            }
            const n = parseCapitalBook(raw);
            if (!n) return '0';
            const kVal = Math.round(n / 1000);
            return `${kVal}k`;
          });
          const stock = siteKeys.map((k) => Math.round(parsePercentSimple(row?.[k]?.current_stock ?? 0)));
          return { name: row?.item_name ?? '-', capitalText, stock };
        });
        return { sites, items };
      }
    }

    const sites: string[] = Array.isArray(legacy) ? legacy.map((s: any) => s?.site_name).filter(Boolean) : [];
    if (!sites.length) return { sites: [] as string[], items: [] as any[] };
    const totals = new Map<string, number>();
    (legacy as any[]).forEach((site: any) => {
      const items = Array.isArray(site?.items) ? site.items : [];
      items.forEach((it: any) => {
        const name = it?.item_name || '';
        if (!name) return;
        const bv = Number(it?.blocked_value ?? it?.capital_book ?? 0);
        totals.set(name, (totals.get(name) ?? 0) + bv);
      });
    });
    const itemNames = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name]) => name);
    const items = itemNames.map((name) => {
      const capitalText = sites.map((siteName) => {
        const site = (legacy as any[]).find((s: any) => s?.site_name === siteName);
        const it = (site?.items || []).find((x: any) => x?.item_name === name);
        const val = Number(it?.capital_book ?? 0);
        return `${Math.round(val / 1000)}k`;
      });
      const stock = sites.map((siteName) => {
        const site = (legacy as any[]).find((s: any) => s?.site_name === siteName);
        const it = (site?.items || []).find((x: any) => x?.item_name === name);
        const n = Number(it?.current_stock ?? 0);
        if (n > 0 && n <= 1) return Math.round(n * 100);
        return Math.round(n);
      });
      return { name, capitalText, stock };
    });
    return { sites, items };
  }, [inv, legacy]);

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
  }, [grid.sites.length, grid.items.length]);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3">
        <h3
          className="flex-1"
          style={{
            fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
        >
          Overstock Analysis: Top 10 Items
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-5 h-5 flex-shrink-0 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors z-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDownload();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>

      {grid.sites.length === 0 ? (
        <div className="text-sm text-gray-500 mt-4">No data</div>
      ) : (
        <>
          <div className="flex items-center justify-end gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#C4B89D' }}></span>
              <span>Capital Book</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: '#E8E8E8' }}></span>
              <span>Current Stock</span>
            </div>
          </div>
          <div className="flex">
          {/* Left Items */}
          <div className="flex flex-col justify-around gap-[2px]">
            {grid.items.map((item, idx) => (
              <div key={idx} className="h-14 flex items-center justify-end pr-2 text-xs font-medium">{item.name}</div>
            ))}
          </div>

          {/* Wrapper containing grid + site labels + absolute axes */}
          <div ref={wrapperRef} className="relative flex-1">
            {/* Grid */}
            <div ref={gridRef} className="grid min-w-0 ml-3 mr-3" style={{gridTemplateColumns:`repeat(${grid.sites.length},minmax(80px,1fr))`, gap: '8px'}}>
              {grid.items.map((item, itemIdx) =>
                item.capitalText.map((cap: string, siteIdx: number) => (
                  <div key={`${itemIdx}-${siteIdx}`} className="relative h-14 border border-[#C4AE9D] bg-white min-w-0 overflow-hidden">
                    <Block capitalText={cap} stock={item.stock[siteIdx] ?? 0} />
                  </div>
                ))
              )}
            </div>

            {/* Site labels (site names row) */}
            <div ref={siteLabelsRef} className="grid mt-3" style={{gridTemplateColumns:`repeat(${grid.sites.length},minmax(80px,1fr))`, gap: '4px'}}>
              {grid.sites.map((site, index) => (
                <div key={index} className="text-center text-xs font-medium mt-2">{site}</div>
              ))}
            </div>

            {/* Axes: render only when measurements are available */}
            {axisTop !== null && gridTop !== null && (
              <>
                {/* vertical Y-axis */}
                <div className="absolute bg-gray-700 mr-2" style={{left: 0, top: gridTop, width: 1, height: Math.max(0, axisTop - gridTop), zIndex: 40}} />
                {/* horizontal X-axis */}
                <div className="absolute bg-gray-700" style={{left: 0, top: axisTop - 1, right: 0, height: 1, zIndex: 40}} />
              </>
            )}
          </div>
        </div>
        
        {/* Note section */}
        <div className="mt-4 p-3 rounded-md">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Note:</span> This table shows the top 10 overstock items with their capital block (Upper section) and current stock (Lower section), highlighting excess inventory tied up in high-value items.
          </p>
        </div>
        </>
      )}
    </div>
  );
};

export default OverstockTop10ItemsCard;
