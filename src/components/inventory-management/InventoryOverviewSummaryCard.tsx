import React, { useMemo } from 'react';

type Props = {
  data: any;
};

const InventoryOverviewSummaryCard: React.FC<Props> = ({ data }) => {
  const summary = useMemo(() => {
    const src = data?.data?.overview_summary ?? data?.overview_summary ?? data?.summary ?? null;
    return src && typeof src === 'object' ? src : null;
  }, [data]);

  const formatINR = (n: any) => {
    if (n === null || n === undefined) return '₹ 0';
    if (typeof n === 'string') {
      const s = n.trim();
      if (s.startsWith('₹')) return `₹ ${s.replace(/^₹\s*/, '').trim()}`;
      const parsed = parseFloat(s.replace(/[^0-9.\-]/g, ''));
      if (!Number.isNaN(parsed)) return `₹ ${parsed.toLocaleString('en-IN')}`;
      return '₹ 0';
    }
    const num = Number(n);
    return Number.isNaN(num) ? '₹ 0' : `₹ ${num.toLocaleString('en-IN')}`;
  };

  const cards = useMemo(() => {
    const s: any = summary ?? {};
    return [
      { label: 'Over Stock Items', value: String(s.over_stock_items ?? 0) },
      { label: 'Under Stock Items', value: String(s.under_stock_items ?? 0) },
      { label: 'Total Value Of Inventory', value: formatINR(s.total_value_of_inventory) },
      { label: 'Capital Blocked In Overstocking', value: formatINR(s.capital_blocked_in_overstock) },
      { label: 'Total Value Of Spares', value: formatINR(s.total_value_of_spares) },
      { label: 'Total Value Of Consumables', value: formatINR(s.total_value_of_consumables) },
    ];
  }, [summary]);

  return (
    <div className="bg-white border rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Inventory Management – Overview Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="border rounded p-3 bg-[#f7f4ed]">
            <div className="text-sm text-gray-600">{card.label}</div>
            <div className="text-xl font-bold text-[#b62527]">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryOverviewSummaryCard;
