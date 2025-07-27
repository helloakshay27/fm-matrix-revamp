import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, SlidersHorizontal } from 'lucide-react';

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
      case 'breakdown':
      case 'under repair':
        return 'bg-gray-800 text-white';
      case 'in use':
      case 'active':
        return 'bg-green-600 text-white';
      case 'maintenance':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '24 Jul 2025';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Assets</h1>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>
        </div>
      </div>

      {/* Assets List */}
      <div className="p-4 space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-[#E8E2D3] rounded-lg p-4">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700">
                {asset.assetGroup || 'Technical'}
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeColor(asset.status)}`}>
                {asset.status || 'Breakdown'}
              </div>
            </div>

            {/* Created Date */}
            <div className="text-xs text-gray-500 mb-3 text-right">
              Created On: {formatDate(asset.createdAt) || '24 May 2025'}
            </div>

            {/* Asset Info */}
            <div className="space-y-1 mb-3">
              <h3 className="font-semibold text-gray-900">
                {asset.name || 'Asset Name'}
              </h3>
              <p className="text-sm text-gray-600">
                {asset.assetGroup && asset.assetSubGroup 
                  ? `${asset.assetGroup}/${asset.assetSubGroup}`
                  : 'Group/Subgroup'
                }
              </p>
            </div>

            {/* Dotted Line */}
            <div className="border-t border-dotted border-gray-400 my-3"></div>

            {/* Location */}
            <div className="flex items-center gap-1 mb-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {asset.siteName || asset.building?.name || 'Location'}
              </span>
            </div>

            {/* Footer Row */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Updated at: {formatDate(asset.updatedAt) || '24 Jul 2025'}
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