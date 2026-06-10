import React, { useMemo } from 'react';

type Props = {
  data: any;
};

const CARD_STYLES = [
  { bg: '#EFEFFB', numColor: '#6B5EA8' },
  { bg: '#B7DCD44D', numColor: '#2E7D6B' },
  { bg: '#E3909026', numColor: '#D97655' },
  { bg: '#85BDF633', numColor: '#85BDF6' },
  { bg: '#EFEFFB', numColor: '#6B5EA8' },
  { bg: '#B7DCD44D', numColor: '#2E7D6B' },
];

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
      if (Number.isFinite(parsed)) return `₹ ${parsed.toLocaleString('en-IN')}`;
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
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h3
        className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3"
        style={{
          fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '100%',
          letterSpacing: '0%',
        }}
      >
        Inventory Management – Overview Summary
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, index) => {
          const cardStyle = CARD_STYLES[index % CARD_STYLES.length];
          return (
            <div
              key={card.label}
              className="rounded-2xl p-4 text-center"
              style={{ backgroundColor: cardStyle.bg }}
            >
              <div className="text-sm text-gray-600 font-medium mb-3 leading-tight">
                {card.label}
              </div>
              <div
                className="text-2xl font-extrabold break-all leading-snug"
                style={{ color: cardStyle.numColor }}
              >
                {card.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryOverviewSummaryCard;
