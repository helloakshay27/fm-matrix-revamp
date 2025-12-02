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
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <h3 className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3"
        style={{
          fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}>
        Inventory Management – Overview Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div 
            key={card.label} 
            className="bg-[#f2eee9] p-6 text-center shadow-sm rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-2xl font-extrabold mb-2 text-gray-900">
              {card.value}
            </div>
            <div className="text-gray-700 text-sm">
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryOverviewSummaryCard;

