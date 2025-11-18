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
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <h3   className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3"
        style={{
          fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}>
          Asset Overview
        </h3>
      <div className="p-4 space-y-4">
        <div className="bg-[#DAD6C9] rounded-md text-center">
          <div className="text-black text-sm font-medium mb-2">Total Available Asset</div>
          <div className="bg-[#F6F4EE] rounded-md py-6">
            <div className="text-4xl font-bold text-black">{total}</div>
          </div>
        </div>
        <div className="bg-[#DAD6C9] rounded-md text-center">
          <div className="text-black text-sm font-medium mb-2">Asset In Breakdown</div>
          <div className="bg-[#F6F4EE] rounded-md py-6">
            <div className="text-4xl font-bold text-black">{breakdown}</div>
          </div>
        </div>
        <div className="bg-[#DAD6C9] rounded-md text-center">
          <div className="text-black text-sm font-medium mb-2">Average Downtime</div>
          <div className="bg-[#F6F4EE] rounded-md py-6">
            <div className="text-4xl font-bold text-black">{avgDowntime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAssetOverviewCard;
