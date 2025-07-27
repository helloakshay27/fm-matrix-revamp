import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Flag, Eye, Star, Hash, Timer, Activity } from 'lucide-react';
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
    let tatDisplay = 'N/A';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use':
        return 'bg-green-100 text-green-700';
      case 'Breakdown':
        return 'bg-red-100 text-red-700';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-[#C4B89D]/25 p-4 h-fit">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-1" style={{ color: 'black' }}>Recent Assets</h3>
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
          <div key={asset.id} className="bg-[#C4B89D]/20 border border-[#C4B89D]/40 rounded-lg p-4">
            {/* Header with Asset No and Star */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" style={{ color: '#C72030' }} />
                <span className="font-medium text-sm">{asset.assetNo}</span>
              </div>
              
            </div>

            {/* Asset Name */}
            <h4 className="font-semibold text-base mb-3 text-gray-800">{asset.name}</h4>

            {/* TAT in quotes */}
            <div className="mb-4">
              <span className="text-blue-600 font-medium">"{asset.tat}"</span>
            </div>

            {/* Asset Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: '#C72030' }} />
                <span className="text-sm font-medium">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(asset.status)}`}>
                  {asset.status}
                </span>
              </div>
              
              
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              
              
              <button
                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                onClick={() => handleViewDetails(asset.id)}
              >
                View Detail&gt;&gt;
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