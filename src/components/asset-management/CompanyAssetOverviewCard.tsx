import React from 'react';

interface Props { data: any }

const CompanyAssetOverviewCard: React.FC<Props> = ({ data }) => {
  const root = data?.data ?? data ?? {};
  const overview = root.company_asset_overview ?? root ?? {};
  const total = overview?.total_available_asset ?? overview?.total_assets ?? '-';
  const breakdown = overview?.asset_in_breakdown ?? overview?.assets_in_breakdown ?? '-';
  const avgDowntime = overview?.average_downtime_days !== undefined && overview?.average_downtime_days !== null
    ? `${overview.average_downtime_days} Days`
    : '-';

  const stats = [
    { label: 'Total Available Assets', value: total,      bg: '#EFEFFB',                   num: '#6B5EA8' },
    { label: 'Assets In Breakdown',    value: breakdown,   bg: 'rgba(227,144,144,0.15)',    num: '#D97655' },
    { label: 'Average Downtime',       value: avgDowntime, bg: 'rgba(183,220,212,0.30)',    num: '#2E7D6B' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Company Wise Asset Overview
        </h3>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl px-5 py-7 text-center" style={{ backgroundColor: s.bg }}>
              <div className="text-3xl font-bold mb-1" style={{ color: s.num, fontFamily: 'Work Sans, sans-serif' }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyAssetOverviewCard;
