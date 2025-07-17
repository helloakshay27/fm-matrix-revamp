import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Flag, Eye, Star, Hash, Timer, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddCommentModal } from '@/components/AddCommentModal';

interface Asset {
  id: string;
  name: string;
  assetNo: string;
  status: string;
  tat: string;
  tatStatus: 'normal' | 'warning' | 'critical';
}

const recentAssets: Asset[] = [
  {
    id: '1',
    name: 'Dell Laptop Pro',
    assetNo: 'DL-001',
    status: 'In Use',
    tat: '2d 14h',
    tatStatus: 'normal'
  },
  {
    id: '2',
    name: 'HP Printer Scanner',
    assetNo: 'HP-002',
    status: 'Breakdown',
    tat: '5d 8h',
    tatStatus: 'critical'
  },
  {
    id: '3',
    name: 'Air Conditioning Unit',
    assetNo: 'AC-003',
    status: 'Maintenance',
    tat: '3d 12h',
    tatStatus: 'warning'
  },
  {
    id: '4',
    name: 'Security Camera System',
    assetNo: 'SC-004',
    status: 'In Use',
    tat: '1d 6h',
    tatStatus: 'normal'
  },
  {
    id: '5',
    name: 'Conference Room Projector',
    assetNo: 'PR-005',
    status: 'Maintenance',
    tat: '4d 2h',
    tatStatus: 'warning'
  }
];

export const RecentAssetsSidebar = () => {
  const navigate = useNavigate();
  const [flaggedAssets, setFlaggedAssets] = useState<Set<string>>(new Set());
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

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
        <h3 className="text-lg font-bold mb-1" style={{ color: '#C72030' }}>Recent Assets</h3>
        <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto space-y-4">
        {recentAssets.map((asset) => (
          <div key={asset.id} className="bg-[#C4B89D]/20 border border-[#C4B89D]/40 rounded-lg p-4">
            {/* Header with Asset No and Star */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" style={{ color: '#C72030' }} />
                <span className="font-medium text-sm">{asset.assetNo}</span>
              </div>
              <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500 cursor-pointer" />
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
              
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" style={{ color: '#C72030' }} />
                <span className="text-sm font-medium">TAT Status:</span>
                <span className={`text-xs font-medium ${getTatColor(asset.tatStatus)}`}>
                  {asset.tatStatus}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => handleAddComment(asset.id)}
                >
                  Add Comment
                </button>
                <button
                  className={`text-sm font-medium ${
                    flaggedAssets.has(asset.id) 
                      ? 'text-red-600' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => handleFlag(asset.id)}
                >
                  Flag Issue
                </button>
              </div>
              
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