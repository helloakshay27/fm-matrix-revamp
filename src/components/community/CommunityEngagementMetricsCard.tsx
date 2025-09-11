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
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h3 className="font-semibold text-base mb-4">Community Engagement Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#DAD6C9] rounded p-4">
          <div className="flex items-center justify-center gap-3">
            <p className="text-3xl font-bold text-[#C72030]">{totalActive}</p>
            <div>
              <p className="text-black font-semibold">Total Active Users</p>
              <p className="text-xs text-black">(App Downloaded)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white rounded p-3 text-center">
              <p className="text-xs text-gray-500">Android</p>
              <p className="text-xl font-bold">{android}</p>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <p className="text-xs text-gray-500">iOS</p>
              <p className="text-xl font-bold">{ios}</p>
            </div>
          </div>
        </div>
        <div className="bg-[#DAD6C9] rounded p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-bold text-[#C72030]">{newUsers}</p>
              <span className="text-green-600 text-2xl">↑</span>
            </div>
            <p className="text-black font-semibold mt-1">New Users</p>
          </div>
        </div>
        <div className="bg-[#DAD6C9] rounded p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-bold text-[#C72030]">{totalActive}</p>
              <span className="text-green-600 text-2xl">↑</span>
            </div>
            <p className="text-black font-semibold mt-1">Last 30 Days Active Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityEngagementMetricsCard;
