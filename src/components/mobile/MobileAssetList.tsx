import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

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

  const handleBack = () => {
    navigate(-1);
  };

  const handleAssetClick = (assetId: string) => {
    navigate(`/mobile/assets/${assetId}?action=details`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in use':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'breakdown':
      case 'under repair':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in use':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'breakdown':
      case 'under repair':
        return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

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

      {/* Asset List */}
      <div className="p-4 space-y-3">
        {assets.map((asset) => (
          <Card 
            key={asset.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleAssetClick(asset.id)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Asset Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">
                      {asset.name}
                    </h3>
                    <p className="text-xs text-red-600 font-medium mt-1">
                      Asset ID: #{asset.assetNumber || asset.id}
                    </p>
                  </div>
                  <Badge className={`${getStatusColor(asset.status)} flex items-center gap-1 text-xs`}>
                    {getStatusIcon(asset.status)}
                    {asset.status || 'Active'}
                  </Badge>
                </div>

                {/* Asset Details */}
                <div className="space-y-2 text-xs text-gray-600">
                  {asset.assetGroup && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Group/Subgroup:</span>
                      <span className="text-gray-900">
                        {asset.assetGroup}
                        {asset.assetSubGroup && ` / ${asset.assetSubGroup}`}
                      </span>
                    </div>
                  )}
                  
                  {asset.siteName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="text-gray-900">
                        {asset.siteName}
                        {asset.building?.name && `, ${asset.building.name}`}
                        {asset.wing?.name && `, ${asset.wing.name}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {assets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Wrench className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">No assets found</p>
          </div>
        )}
      </div>
    </div>
  );
};