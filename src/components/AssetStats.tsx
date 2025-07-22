
import React from 'react';
import { Package, DollarSign, Settings, Monitor, AlertTriangle, Trash2 } from 'lucide-react';

export const AssetStats = ({ stats }) => {

  console.log("Asset Stats:", stats);
  const statData = [
    { label: "Total Assets", value: stats.total_count, icon: <Package className="w-6 h-6 text-[#C72030]" /> },
    { label: "Total Value", value: stats.total_value, icon: <DollarSign className="w-6 h-6 text-[#C72030]" /> },
    { label: "Non IT Assets", value: stats.non_it_assets, icon: <Settings className="w-6 h-6 text-[#C72030]" /> },
    { label: "IT Assets", value: stats.it_assets, icon: <Monitor className="w-6 h-6 text-[#C72030]" /> },
    { label: "In Use", value: stats.in_use_count, icon: <Settings className="w-6 h-6 text-[#C72030]" /> },
    { label: "Breakdown", value: stats.breakdown_count, icon: <AlertTriangle className="w-6 h-6 text-[#C72030]" /> },
    { label: "In Store", value: stats.in_store, icon: <Package className="w-6 h-6 text-[#C72030]" /> },
    { label: "Dispose Assets", value: stats.dispose_assets, icon: <Trash2 className="w-6 h-6 text-[#C72030]" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
      {statData.map((item, i) => (
        <div
          key={i}
          className="bg-[#f6f4ee] p-6 rounded-lg shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-[#FBEDEC] rounded-full flex items-center justify-center">
            {item.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-[#C72030]">{item.value}</div>
            <div className="text-sm font-medium text-gray-600">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
