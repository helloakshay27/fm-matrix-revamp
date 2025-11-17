import React from 'react';

interface Props {
  data: any;
}

export const CommunityEngagementMetricsCard: React.FC<Props> = ({ data }) => {
  const totalActive = data?.data?.summary?.total_active_users ?? data?.data?.total_active_users ?? '-';
  const android = data?.data?.summary?.platform_breakdown?.android ?? data?.data?.android ?? '-';
  const ios = data?.data?.summary?.platform_breakdown?.ios ?? data?.data?.ios ?? '-';
  const newUsers = data?.data?.new_users ?? data?.data?.summary?.new_users ?? '-';

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 h-full flex flex-col">
      <h3 className="font-semibold text-base mb-3">Community Engagement Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
        <div className="bg-[#DAD6C9] rounded p-3 flex flex-col justify-between">
          <div className="flex items-start gap-2 mb-3">
            <p className="text-2xl font-bold text-[#C72030] flex-shrink-0">{totalActive}</p>
            <div className="min-w-0">
              <p className="text-black font-semibold text-xs leading-tight">Total Active Users</p>
              <p className="text-[10px] text-black">(App Downloaded)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded p-2 text-center">
              <p className="text-[10px] text-gray-500">Android</p>
              <p className="text-base font-bold">{android}</p>
            </div>
            <div className="bg-white rounded p-2 text-center">
              <p className="text-[10px] text-gray-500">iOS</p>
              <p className="text-base font-bold">{ios}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#DAD6C9] rounded p-3 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-[#C72030]">{newUsers}</p>
              <span className="text-green-600 text-xl">↑</span>
            </div>
            <p className="text-black font-semibold text-xs mt-1">New Users</p>
          </div>
        </div>
        <div className="bg-[#DAD6C9] rounded p-3 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-[#C72030]">{totalActive}</p>
              <span className="text-green-600 text-xl">↑</span>
            </div>
            <p className="text-black font-semibold text-xs mt-1 leading-tight">Last 30 Days Active Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityEngagementMetricsCard;
