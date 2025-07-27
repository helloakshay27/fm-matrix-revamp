import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, History, SlidersHorizontal, MapPin } from 'lucide-react';

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
}

interface MobileAssetListProps {
  assets: Asset[];
}

export const MobileAssetList: React.FC<MobileAssetListProps> = ({ assets }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('breakdown');

  const handleBack = () => {
    navigate(-1);
  };

  const handleAssetClick = (assetId: string) => {
    navigate(`/mobile/assets/${assetId}?action=details`);
  };

  const handleViewDetails = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/mobile/assets/${assetId}?action=details`);
  };

  // Filter assets based on active tab
  const filteredAssets = assets.filter(asset => {
    if (activeTab === 'breakdown') {
      return asset.status?.toLowerCase().includes('breakdown') || 
             asset.status?.toLowerCase().includes('repair');
    } else {
      return asset.status?.toLowerCase() === 'in use' || 
             asset.status?.toLowerCase() === 'active';
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Assets</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'breakdown'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Breakdown
          </button>
          <button
            onClick={() => setActiveTab('inuse')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'inuse'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            In Use
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 text-sm text-gray-600">
            <History className="h-4 w-4" />
            History
          </button>
          <button className="flex items-center gap-2 text-sm text-gray-600">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Asset List */}
      <div className="p-4 space-y-3">
        {filteredAssets.map((asset) => (
          <Card 
            key={asset.id} 
            className="cursor-pointer hover:shadow-md transition-shadow border-0"
            onClick={() => handleAssetClick(asset.id)}
            style={{ backgroundColor: '#F6F4EE' }}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header with category and date */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">
                    {asset.assetGroup || 'Technical'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Created On: 24 May 2025
                  </span>
                </div>

                {/* Asset Name */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {asset.assetGroup && asset.assetSubGroup 
                      ? `${asset.assetGroup}/${asset.assetSubGroup}`
                      : asset.assetGroup || 'Group/Subgroup'
                    }
                  </p>
                </div>

                {/* Dotted line separator */}
                <div className="border-b border-dotted border-gray-300"></div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {asset.siteName || 'Location'}
                    {asset.building?.name && `, ${asset.building.name}`}
                    {asset.wing?.name && `, ${asset.wing.name}`}
                  </span>
                </div>

                {/* Updated at section */}
                <div className="flex items-center justify-between bg-gray-200 -mx-4 -mb-4 px-4 py-3 rounded-b-lg">
                  <span className="text-sm text-gray-700">
                    Updated at: 24 Jul 2025
                  </span>
                  <button
                    onClick={(e) => handleViewDetails(asset.id, e)}
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">
              No {activeTab === 'breakdown' ? 'breakdown' : 'in use'} assets found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};