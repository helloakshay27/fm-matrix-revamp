import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Flag, Eye, Building2, User, Globe, Clock, Star } from 'lucide-react';
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
    <div className="bg-white border border-[hsl(var(--analytics-border))] h-fit w-[420px]">
      <div className="p-6 border-b border-[hsl(var(--analytics-border))]">
        <h3 className="text-xl font-semibold text-[#C72030] mb-2">Recent Assets</h3>
        <div className="text-sm text-gray-600">14/07/2025</div>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto">
        {recentAssets.map((asset) => (
          <div key={asset.id} className="p-4 bg-[#F5F5F5] m-4 rounded-lg border border-gray-200">
            <div className="space-y-4">
              {/* Header with asset number, star and priority */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-800">{asset.assetNo}</div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="px-2 py-1 bg-[#E91E63] text-white text-xs font-medium rounded">P1</span>
                </div>
              </div>
              
              {/* Asset name and TAT */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium text-gray-800">{asset.name}</div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">TAT : </span>
                  <span className="text-blue-600 font-medium">"{asset.tat}"</span>
                </div>
              </div>
              
              {/* Details section */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-[#C72030] mr-3" />
                  <span className="text-gray-700 font-medium w-32">Category</span>
                  <span className="text-gray-600">:</span>
                  <span className="text-gray-800 ml-2">Equipment</span>
                </div>
                
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-[#C72030] mr-3" />
                  <span className="text-gray-700 font-medium w-32">Sub-Category</span>
                  <span className="text-gray-600">:</span>
                  <span className="text-gray-800 ml-2">IT Equipment</span>
                </div>
                
                <div className="flex items-center">
                  <User className="w-4 h-4 text-[#C72030] mr-3" />
                  <span className="text-gray-700 font-medium w-32">Assignee Name</span>
                  <span className="text-gray-600">:</span>
                  <span className="text-gray-800 ml-2">Admin</span>
                </div>
                
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-[#C72030] mr-3" />
                  <span className="text-gray-700 font-medium w-32">Site</span>
                  <span className="text-gray-600">:</span>
                  <span className="text-gray-800 ml-2">GoPhygital</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-[#C72030] mr-3" />
                  <span className="text-gray-700 font-medium w-32">Update</span>
                  <span className="text-gray-600">:</span>
                  <div className="flex items-center ml-2">
                    <span className="text-gray-600 italic">{asset.status}</span>
                    <span className="mx-2">→</span>
                    <span className="text-gray-800 italic">Active</span>
                  </div>
                </div>
              </div>
              
              {/* Handler info */}
              <div className="text-sm text-gray-600 mt-3">
                (Handled By Admin)
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                <div className="flex items-center gap-4">
                  <button 
                    className="flex items-center text-[#C72030] hover:underline"
                    onClick={() => handleAddComment(asset.id)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Add Comment
                  </button>
                  
                  <button 
                    className={`flex items-center hover:underline ${flaggedAssets.has(asset.id) ? 'text-red-600' : 'text-[#C72030]'}`}
                    onClick={() => handleFlag(asset.id)}
                  >
                    <Flag className="w-4 h-4 mr-1" />
                    Flag Issue
                  </button>
                </div>
                
                <button 
                  className="text-blue-600 hover:underline font-medium"
                  onClick={() => handleViewDetails(asset.id)}
                >
                  View Detail{'>>'}
                </button>
              </div>
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