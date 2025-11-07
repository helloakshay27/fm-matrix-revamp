import React from "react";
import {
  Package,
  DollarSign,
  Settings,
  Monitor,
  AlertTriangle,
  Trash2,
  IndianRupee,
} from "lucide-react";

interface AssetStatsProps {
  stats: {
    total: number;
    total_value: string;
    nonItAssets: number;
    itAssets: number;
    inUse: number;
    breakdown: number;
    in_store: number;
    dispose: number;
  };
  onCardClick?: (filterType: string) => void;
}

export const AssetStats: React.FC<AssetStatsProps> = ({ stats, onCardClick }) => {
  const statData = [
    {
      label: "Total Assets",
      value: stats.total_count,
      icon: <Package className="w-6 h-6 text-[#C72030]" />,
      filterType: "total",
    },
    {
      label: "Total Value",
      value: typeof stats.total_value === 'number' ? stats.total_value.toLocaleString('en-IN') : stats.total_value,
      // icon: <DollarSign className="w-6 h-6 text-[#C72030]" />,
      // icon: <IndianRupee className="w-6 h-6 text-[#C72030]" />,
      icon: <span className="font-bold text-[18px] !text-[#C72030]">{localStorage.getItem("currency")}</span>,
      filterType: "value",
    },
    {
      label: "Non IT Assets",
      value: stats.non_it_assets,
      icon: <Settings className="w-6 h-6 text-[#C72030]" />,
      filterType: "non_it",
    },
    {
      label: "IT Assets",
      value: stats.it_assets,
      icon: <Monitor className="w-6 h-6 text-[#C72030]" />,
      filterType: "it",
    },
    {
      label: "In Use",
      value: stats.in_use_count,
      icon: <Settings className="w-6 h-6 text-[#C72030]" />,
      filterType: "in_use",
    },
    {
      label: "Breakdown",
      value: stats.breakdown_count,
      icon: <AlertTriangle className="w-6 h-6 text-[#C72030]" />,
      filterType: "breakdown",
    },
    {
      label: "In Store",
      value: stats.in_store,
      icon: <Package className="w-6 h-6 text-[#C72030]" />,
      filterType: "in_store",
    },
    {
      label: "Dispose Assets",
      value: stats.dispose_assets,
      icon: <Trash2 className="w-6 h-6 text-[#C72030]" />,
      filterType: "dispose",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
      {statData.map((item, i) => (
        <div
          key={i}
          className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 ${onCardClick && item.filterType !== "value" ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
            }`}
          onClick={() => {
            if (onCardClick && item.filterType !== "value") {
              onCardClick(item.filterType);
            }
          }}
        >
          <div className="w-14 h-14 bg-[#C4B89D54]  flex items-center justify-center">
            {item.icon}
          </div>
          <div>
            <div className="text-2xl font-semibold text-[#1A1A1A]">
              {item.value}
            </div>
            <div className="text-sm font-medium text-[#1A1A1A]">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
