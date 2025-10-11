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
import { StatsCard } from "./StatsCard";

interface AssetStatsProps {
  stats: {
    total?: number;
    total_count?: number;
    total_value: string | number;
    nonItAssets?: number;
    non_it_assets?: number;
    itAssets?: number;
    it_assets?: number;
    inUse?: number;
    in_use_count?: number;
    breakdown?: number;
    breakdown_count?: number;
    in_store: number;
    dispose?: number;
    dispose_assets?: number;
  };
  onCardClick?: (filterType: string) => void;
  assets?: any[]; // Full assets data for download
}

export const AssetStats: React.FC<AssetStatsProps> = ({ stats, onCardClick, assets = [] }) => {
  
  // Helper function to filter assets by status
  const getAssetsByFilter = (filterType: string) => {
    if (!assets || assets.length === 0) return [];
    
    switch (filterType) {
      case "total":
        return assets.map(a => ({
          'Asset ID': a.asset_id,
          'Asset Name': a.asset_name,
          'Category': a.category,
          'Status': a.status,
          'Location': a.location,
          'Value': a.value
        }));
      case "value":
        return assets.map(a => ({
          'Asset ID': a.asset_id,
          'Asset Name': a.asset_name,
          'Category': a.category,
          'Value': a.value,
          'Status': a.status,
          'Location': a.location
        }));
      case "non_it":
        return assets.filter(a => a.asset_type?.toLowerCase() !== 'it').map(a => ({
          'Asset ID': a.asset_id,
          'Asset Name': a.asset_name,
          'Category': a.category,
          'Type': a.asset_type,
          'Status': a.status
        }));
      case "it":
        return assets.filter(a => a.asset_type?.toLowerCase() === 'it').map(a => ({
          'Asset ID': a.asset_id,
          'Asset Name': a.asset_name,
          'Category': a.category,
          'Status': a.status,
          'Serial Number': a.serial_number
        }));
      case "in_use":
        return assets.filter(a => a.status?.toLowerCase().includes('in use')).map(a => ({
          'Asset ID': a.asset_id,
          'Asset Name': a.asset_name,
          'Assigned To': a.assigned_to,
          'Location': a.location,
          'Department': a.department
        }));
      case "breakdown":
        return assets.filter(a => a.status?.toLowerCase().includes('breakdown') || a.status?.toLowerCase().includes('broken')).map(a => ({
          'Asset ID': a.asset_id,
          'Asset Name': a.asset_name,
          'Status': a.status,
          'Location': a.location,
          'Last Service Date': a.last_service_date
        }));
      case "in_store":
        return assets.filter(a => a.status?.toLowerCase().includes('store')).map(a => ({
          'Asset ID': a.asset_id,
          'Asset Name': a.asset_name,
          'Category': a.category,
          'Storage Location': a.location,
          'Value': a.value
        }));
      case "dispose":
        return assets.filter(a => a.status?.toLowerCase().includes('dispose') || a.status?.toLowerCase().includes('discard')).map(a => ({
          'Asset ID': a.asset_id,
          'Asset Name': a.asset_name,
          'Disposal Reason': a.disposal_reason,
          'Disposal Date': a.disposal_date,
          'Value': a.value
        }));
      default:
        return [];
    }
  };

  const statData = [
    {
      label: "Total Assets",
      value: stats.total_count || stats.total,
      icon: <Package className="w-6 h-6 text-[#C72030]" />,
      filterType: "total",
    },
    {
      label: "Total Value",
      value: typeof stats.total_value === 'number' ? stats.total_value.toLocaleString('en-IN') : stats.total_value,
      icon: <IndianRupee className="w-6 h-6 text-[#C72030]" />,
      filterType: "value",
    },
    {
      label: "Non IT Assets",
      value: stats.non_it_assets || stats.nonItAssets,
      icon: <Settings className="w-6 h-6 text-[#C72030]" />,
      filterType: "non_it",
    },
    {
      label: "IT Assets",
      value: stats.it_assets || stats.itAssets,
      icon: <Monitor className="w-6 h-6 text-[#C72030]" />,
      filterType: "it",
    },
    {
      label: "In Use",
      value: stats.in_use_count || stats.inUse,
      icon: <Settings className="w-6 h-6 text-[#C72030]" />,
      filterType: "in_use",
    },
    {
      label: "Breakdown",
      value: stats.breakdown_count || stats.breakdown,
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
      value: stats.dispose_assets || stats.dispose,
      icon: <Trash2 className="w-6 h-6 text-[#C72030]" />,
      filterType: "dispose",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
      {statData.map((item, i) => (
        <StatsCard
          key={i}
          title={item.label}
          value={item.value}
          icon={item.icon}
          onClick={onCardClick && item.filterType !== "value" ? () => onCardClick(item.filterType) : undefined}
          className={onCardClick && item.filterType !== "value" ? "cursor-pointer" : ""}
          downloadData={getAssetsByFilter(item.filterType)}
        />
      ))}
    </div>
  );
};
