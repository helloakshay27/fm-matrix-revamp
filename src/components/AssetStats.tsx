// import React from "react";
// import {
//   Package,
//   DollarSign,
//   Settings,
//   Monitor,
//   AlertTriangle,
//   Trash2,
//   IndianRupee,
// } from "lucide-react";

// interface AssetStatsProps {
//   stats: {
//     non_it_assets: any;
//     allocated_count: any;
//     breakdown_count: any;
//     in_use_count: any;
//     it_assets: any;
//     total_count: any;
//     total: number;
//     total_value: number | string;
//     nonItAssets: number;
//     itAssets: number;
//     inUse: number;
//     breakdown: number;
//     in_store: number;
//     dispose: number;
//   };
//   onCardClick?: (filterType: string) => void;

// }

// export const AssetStats: React.FC<AssetStatsProps> = ({
//   stats,
//   onCardClick,
// }) => {
//   const statData = [
//     {
//       label: "Total Assets",
//       value: stats.total_count,
//       icon: <Package className="w-6 h-6 text-[#C72030]" />,
//       filterType: "total",
//     },
//     {
//       label: "Total Value",
//       value:
//         typeof stats.total_value === "number"
//           ? stats.total_value.toLocaleString("en-IN")
//           : stats.total_value,
//       icon: (
//         <span className="font-bold text-[18px] !text-[#C72030]">
//           {localStorage.getItem("currency")}
//         </span>
//       ),
//       filterType: "value",
//     },
//     {
//       label: "Non IT Assets",
//       value: stats.non_it_assets,
//       icon: <Settings className="w-6 h-6 text-[#C72030]" />,
//       filterType: "non_it",
//     },
//     {
//       label: "IT Assets",
//       value: stats.it_assets,
//       icon: <Monitor className="w-6 h-6 text-[#C72030]" />,
//       filterType: "it",
//     },
//     {
//       label: "In Use",
//       value: stats.in_use_count,
//       icon: <Settings className="w-6 h-6 text-[#C72030]" />,
//       filterType: "in_use",
//     },
//     {
//       label: "Breakdown",
//       value: stats.breakdown_count,
//       icon: <AlertTriangle className="w-6 h-6 text-[#C72030]" />,
//       filterType: "breakdown",
//     },
//     {
//       label: "In Store",
//       value: stats.in_store,
//       icon: <Package className="w-6 h-6 text-[#C72030]" />,
//       filterType: "in_store",
//     },
//     {
//       label: "Allocated Assets",
//       value: stats.allocated_count,
//       icon: <Trash2 className="w-6 h-6 text-[#C72030]" />,
//       filterType: "allocated",
//     },
//   ];

//   const handleCardClick = (filterType: string) => {
//     onCardClick?.(filterType);
//   };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
//       {statData.map((item, i) => (
//         <div
//           key={i}
//           className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)]
//           flex items-center gap-4
// cursor-pointer hover:shadow-lg transition-shadow`}
//           onClick={() =>
//             item.filterType !== "value" && handleCardClick(item.filterType)
//           }
//         >
//           <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
//             {item.icon}
//           </div>
//           <div>
//             <div className="text-2xl font-semibold text-[#1A1A1A]">
//               {item.value}
//             </div>
//             <div className="text-sm font-medium text-[#1A1A1A]">
//               {item.label}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

import React from "react";
import {
  Package,
  Settings,
  Monitor,
  AlertTriangle,
  Trash2,
  RefreshCcw,
} from "lucide-react";

interface AssetStatsProps {
  stats: {
    non_it_assets: number;
    allocated_count: number;
    breakdown_count: number;
    in_use_count: number;
    it_assets: number;
    total_count: number;
    total_value: number | string;
    in_store: number;
    dispose_assets: number; // disposed assets from API
  };
  onCardClick?: (filterType: string) => void;
}

export const AssetStats: React.FC<AssetStatsProps> = ({
  stats,
  onCardClick,
}) => {
  const [showDisposed, setShowDisposed] = React.useState(false);

  const statData = [
    {
      label: "Total Assets",
      value: stats.total_count,
      icon: <Package className="w-6 h-6 text-[#C72030]" />,
      filterType: "total",
    },
    {
      label: "Total Value",
      value:
        typeof stats.total_value === "number"
          ? stats.total_value.toLocaleString("en-IN")
          : stats.total_value,
      icon: (
        <span className="font-bold text-[18px] text-[#C72030]">
          {localStorage.getItem("currency")}
        </span>
      ),
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
      // 🔁 Swappable card
      label: showDisposed ? "Disposed Assets" : "Allocated Assets",
      value: showDisposed ? stats.dispose_assets : stats.allocated_count,
      icon: <Trash2 className="w-6 h-6 text-[#C72030]" />,
      filterType: showDisposed ? "disposed" : "allocated",
      isSwappable: true,
    },
  ];

  const handleCardClick = (filterType: string) => {
    onCardClick?.(filterType);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
      {statData.map((item, i) => (
        <div
          key={i}
          className="relative bg-[#F6F4EE] p-6 rounded-lg
          shadow-[0px_1px_8px_rgba(45,45,45,0.05)]
          flex items-center gap-4 cursor-pointer
          hover:shadow-lg transition-all duration-300"
          onClick={() =>
            item.filterType !== "value" &&
            handleCardClick(item.filterType)
          }
        >
          {/* 🔄 Swap Icon */}
          {item.isSwappable && (
            <button
              className="absolute top-2 right-2 p-1 rounded
              hover:bg-gray-200 transition"
              onClick={(e) => {
                e.stopPropagation(); // prevent filter click
                setShowDisposed((prev) => !prev);
              }}
            >
              <RefreshCcw className="w-4 h-4 text-gray-600" />
            </button>
          )}

          <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
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
