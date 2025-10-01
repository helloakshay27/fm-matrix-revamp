import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Flag, Eye, Star, Hash, Timer, Activity, EyeIcon, Building2, Building2Icon, User2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCommentModal } from '@/components/AddCommentModal';
import { recentAssetsService, RecentAsset } from '@/services/recentAssetsAPI';
import { useQuery } from '@tanstack/react-query';

interface Asset {
  id: string;
  name: string;
  assetNo: string;
  status: string;
  tat: string;
  tatStatus: 'normal' | 'warning' | 'critical';
}

export const RecentAssetsSidebar = () => {
  const navigate = useNavigate();
  const [flaggedAssets, setFlaggedAssets] = useState<Set<string>>(new Set());
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  // Fetch recent assets from API
  const {
    data: recentAssetsData,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['recent-assets'],
    queryFn: recentAssetsService.getRecentAssets,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Log API data for debugging
  useEffect(() => {
    if (recentAssetsData) {
      console.log('Recent assets API data:', recentAssetsData);
    }
    if (error) {
      console.error('Recent assets API error:', error);
    }
  }, [recentAssetsData, error]);

  // Transform API data to match local interface
  const transformAsset = (apiAsset: RecentAsset): Asset => {
    // Calculate TAT display string
    let tatDisplay = '0 hrs / Fully Operational'; // Default TAT display
    let tatStatus: 'normal' | 'warning' | 'critical' = 'normal';

    if (apiAsset.tat) {
      const { tat_status, average_tat_days, current_breakdown_tat_days, last_breakdown_tat_days } = apiAsset.tat;

      // Use appropriate TAT value - prioritize current breakdown, then last breakdown, then average
      const tatDays = current_breakdown_tat_days !== null ? current_breakdown_tat_days :
        last_breakdown_tat_days !== null ? last_breakdown_tat_days :
          average_tat_days;

      if (tatDays !== null && tatDays > 0) {
        // Convert days to days and hours format
        const days = Math.floor(tatDays);
        const hours = Math.floor((tatDays - days) * 24);
        tatDisplay = `${days}d ${hours}h`;
      }

      // Map TAT status from API to component status
      if (tat_status === 'critical') {
        tatStatus = 'critical';
      } else if (tat_status === 'warning') {
        tatStatus = 'warning';
      } else {
        tatStatus = 'normal';
      }
    }

    return {
      id: apiAsset.id.toString(),
      name: apiAsset.name,
      assetNo: apiAsset.id.toString(), // Show asset ID instead of asset_code
      status: apiAsset.status,
      tat: tatDisplay,
      tatStatus
    };
  };

  // Get recent assets, fallback to empty array if loading or error
  const recentAssets = recentAssetsData?.recent_assets?.map(transformAsset) || [];

  const handleAddComment = (assetId: string) => {
    setSelectedAssetId(assetId);
    setCommentModalOpen(true);
  };

  const handleFlag = (assetId: string) => {
    const newFlagged = new Set(flaggedAssets);
    if (newFlagged.has(assetId)) {
      newFlagged.delete(assetId);
    } else {
      newFlagged.add(assetId);
    }
    setFlaggedAssets(newFlagged);
  };

  const handleViewDetails = (assetId: string) => {
    navigate(`/maintenance/asset/details/${assetId}`);
  };

  const getTatColor = (tatStatus: string) => {
    switch (tatStatus) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'In Use':
  //       return "bg-[#DBC2A9] text-[#1A1A1A]";
  //     case 'Breakdown':  
  //       return "bg-[#E4626F] text-[#1A1A1A]"; 
  //     case 'Maintenance':
  //       return 'bg-yellow-100 text-yellow-700';
  //     default:
  //       return 'bg-gray-100 text-gray-700';
  //   }
  // };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_use":
      case "in use":
        return "bg-[#DBC2A9] text-[#1A1A1A]";
      case "breakdown":
        return "bg-[#E4626F] text-[#1A1A1A]";
      case "in_storage":
      case "in store":
        return "bg-[#C4B89D] text-[#1A1A1A]";
      case "disposed":
        return "bg-[#D5DbDB] text-[#1A1A1A]";
      default:
        return "bg-[#AAB9C5] text-[#1A1A1A]";
    }
  };


  return (
    <div className="bg-white p-4 h-fit">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: '#C72030' }}>Recent Assets</h3>
        <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
      </div>

      <div className="max-h-[600px] overflow-y-auto space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">Loading recent assets...</div>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-red-600">Failed to load recent assets</div>
          </div>
        )}

        {!isLoading && !isError && recentAssets.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-600">No recent assets found</div>
          </div>
        )}

        {!isLoading && !isError && recentAssets.map((asset) => (
          <div key={asset.id} className="bg-white border border-[#C4B89D]/40 rounded-lg p-4">
            {/* Header with Asset No */}
            <div className="flex items-center gap-3 mb-3">
              <Hash className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700 min-w-[100px]">Asset No :</span>
              <span className="text-sm text-gray-700">:</span>
              <span className="text-sm text-gray-900">{asset.assetNo}</span>
            </div>

            {/* Asset Name row with icon and spacing */}
            <div className="flex items-center gap-3 mb-3">
              <User2Icon className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700 min-w-[100px]">Asset Name :</span>
              <span className="text-sm text-gray-700">:</span>
              <span className="text-sm text-gray-900">{asset.name}</span>
            </div>

            {/* TAT row with icon and spacing */}
            <div className="flex items-center gap-3 mb-3">
              <Building2Icon className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700 min-w-[100px]">TAT :</span>
              <span className="text-sm text-gray-700">:</span>
              <span className="text-sm text-gray-900">{asset.tat}</span>
            </div>

            {/* Asset Status row with icon and spacing */}
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700 min-w-[100px]">Status :</span>
              <span className="text-sm text-gray-700">:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(asset.status)}`}>{asset.status}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                className="flex items-center gap-1 text-sm font-medium underline text-[#C72030] hover:opacity-80"
                onClick={() => handleViewDetails(asset.id)}
              >
                {/* <EyeIcon size={25} color="#C72030" /> */}
                <EyeIcon className="h-5 w-5" color="#C72030" />

              </button>
            </div>
          </div>
        ))}
      </div>

      <AddCommentModal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        itemId={selectedAssetId}
        itemType="asset"
      />
    </div>
  );
};