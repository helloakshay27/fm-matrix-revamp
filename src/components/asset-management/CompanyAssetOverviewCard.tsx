import React from 'react';

interface Props { data: any }

// Company Wise Asset Overview
const CompanyAssetOverviewCard: React.FC<Props> = ({ data }) => {
  const root = data?.data ?? data ?? {};
  const overview = root.company_asset_overview ?? {};
  const total = overview?.total_available_asset ?? '-';
  const breakdown = overview?.asset_in_breakdown ?? '-';
  const avgDowntime = overview?.average_downtime_days !== undefined && overview?.average_downtime_days !== null
    ? `${overview.average_downtime_days} Days`
    : '-';

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="bg-[#DAD6C9] text-[#C72030] px-4 py-3 font-semibold">Company Wise Asset Overview</div>
      <div className="grid grid-cols-3 text-center">
        <div className="py-3 border-r">
          <div className="text-xs text-gray-600">Total Available Asset</div>
          <div className="text-2xl font-bold">{total}</div>
        </div>
        <div className="py-3 border-r">
          <div className="text-xs text-gray-600">Asset in Breakdown</div>
          <div className="text-2xl font-bold">{breakdown}</div>
        </div>
        <div className="py-3">
          <div className="text-xs text-gray-600">Average Downtime</div>
          <div className="text-2xl font-bold">{avgDowntime}</div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAssetOverviewCard;