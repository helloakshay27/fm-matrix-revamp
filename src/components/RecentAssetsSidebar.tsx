import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Flag, Eye } from 'lucide-react';
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
    <div className="bg-white border border-[hsl(var(--analytics-border))] h-fit">
      <div className="p-4 border-b border-[hsl(var(--analytics-border))]">
        <h3 className="text-lg font-semibold text-[hsl(var(--analytics-text))]">Recent Assets</h3>
      </div>
      
      <div className="max-h-[600px] overflow-y-auto">
        {recentAssets.map((asset) => (
          <div key={asset.id} className="p-4 border-b border-[hsl(var(--analytics-border))] last:border-b-0">
            <div className="space-y-3">
              <div>
                <div className="font-medium text-[hsl(var(--analytics-text))] text-sm">{asset.name}</div>
                <div className="text-xs text-[hsl(var(--analytics-muted))]">{asset.assetNo}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(asset.status)}`}>
                  {asset.status}
                </span>
                <div className="text-right">
                  <div className="text-xs text-[hsl(var(--analytics-muted))]">TAT</div>
                  <div className={`text-xs font-medium ${getTatColor(asset.tatStatus)}`}>
                    {asset.tat}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleAddComment(asset.id)}
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Comment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-7 px-2 ${flaggedAssets.has(asset.id) ? 'bg-red-50 border-red-200' : ''}`}
                  onClick={() => handleFlag(asset.id)}
                >
                  <Flag className={`w-3 h-3 ${flaggedAssets.has(asset.id) ? 'text-red-600' : ''}`} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2"
                  onClick={() => handleViewDetails(asset.id)}
                >
                  <Eye className="w-3 h-3" />
                </Button>
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