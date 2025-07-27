import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, SlidersHorizontal } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  status: string;
  assetGroup?: string;
  assetSubGroup?: string;
  siteName?: string;
  building?: { name: string } | null;
  wing?: { name: string } | null;
  area?: { name: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

interface MobileAssetListProps {
  assets: Asset[];
}

export const MobileAssetList: React.FC<MobileAssetListProps> = ({ assets }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleAssetClick = (assetId: string) => {
    navigate(`/mobile/assets/${assetId}?action=details`);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "breakdown":
      case "under repair":
        return "bg-black text-white";
      case "in use":
        return "bg-[#2E7D32] text-white"; // Dark green
      case "in store":
        return "bg-gray-700 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "24 Jul 2025";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-black" />
            </button>
            <h1 className="text-lg font-semibold text-[#4B003F]">Assets</h1>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="h-4 w-4 text-black" />
            <span className="text-sm text-black">Filters</span>
          </button>
        </div>
      </div>

      {/* Asset Cards */}
      <div className="p-4 space-y-4">
        {assets.map((asset) => (
          <div key={asset.id}  onClick={() => handleAssetClick(asset.id)} className="bg-[#F2EBE3] rounded-lg p-4 shadow-sm">
            {/* Group + Status */}
            <div className="flex items-start justify-between mb-2">
              <div className="text-xs text-gray-600">
                {asset.assetGroup || "Technical"}
              </div>
              <div
                className={`text-xs px-2 py-1 rounded font-medium ${getStatusBadgeColor(
                  asset.status
                )}`}
              >
                {capitalizeWords(asset.status || "Breakdown")}
              </div>
            </div>

            {/* Created Date */}
            <div className="text-xs text-gray-500 mb-2 text-right">
              Created On: {formatDate(asset.createdAt) || "24 May 2025"}
            </div>

            {/* Name + Group */}
            <div className="text-gray-900 font-semibold text-base">
              {asset.name || "Asset Name"}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {asset.assetGroup && asset.assetSubGroup
                ? `${asset.assetGroup}/${asset.assetSubGroup}`
                : "Group/Subgroup"}
            </div>

            {/* Dotted line */}
            <div className="border-t border-dashed border-gray-400 my-3" />

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>
                {asset.siteName ||
                  asset.building?.name ||
                  asset.wing?.name ||
                  asset.area?.name ||
                  "Location"}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-sm bg-gray-200 px-3 py-1 rounded text-gray-800">
                Updated at: {formatDate(asset.updatedAt)}
              </span>
              <button
                onClick={() => handleAssetClick(asset.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* No Assets Fallback */}
        {assets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">No assets found</p>
          </div>
        )}
      </div>
    </div>
  );
};
