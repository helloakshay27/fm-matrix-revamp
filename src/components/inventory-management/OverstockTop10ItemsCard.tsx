import React, { useMemo } from 'react';

type Props = {
  data: any;
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

const OverstockTop10ItemsCard: React.FC<Props> = ({ data }) => {
  const inv = useMemo(() => data?.data?.inventory_overstock_report ?? data?.inventory_overstock_report ?? null, [data]);
  const legacy = useMemo(() => data?.data?.overstock_top_items_by_site ?? data?.overstock_top_items_by_site ?? null, [data]);

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

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Inventory Management – Overstock Analysis: Top 10 Items</h3>
      {grid.sites.length === 0 ? (
        <div className="text-sm text-gray-500">No data</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs text-center">
            <thead>
              <tr className="bg-[#ded9cd] text-[#b62527]">
                <th className="border p-2 text-left">Items</th>
                {grid.sites.map((s) => (
                  <th key={s} className="border p-2">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.items.map((row) => (
                <tr key={row.name}>
                  <td className="border p-2 text-left font-medium">{row.name}</td>
                  {row.capitalText.map((cap: string, idx: number) => (
                    <td key={`${row.name}-${idx}`} className="border w-24 h-14 p-1 align-middle">
                      <Block capitalText={cap} stock={row.stock[idx] ?? 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OverstockTop10ItemsCard;
