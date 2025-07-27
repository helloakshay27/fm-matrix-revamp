import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAssets } from '@/hooks/useAssets';
import { MobileAssetList } from '@/components/mobile/MobileAssetList';
import { MobileAssetDetails } from '@/components/mobile/MobileAssetDetails';
import { MobileAssetBreakdown } from '@/components/mobile/MobileAssetBreakdown';

export const MobileAssetPage = () => {
  const { assetId } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const { assets, loading, error } = useAssets(1);
  
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  useEffect(() => {
    if (assetId && assets.length > 0) {
      const asset = assets.find(a => a.id.toString() === assetId);
      setSelectedAsset(asset);
    }
  }, [assetId, assets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading assets:', error);
  }

  // Route based on action parameter
  switch (action) {
    case 'details':
      return selectedAsset ? (
        <MobileAssetDetails asset={selectedAsset} />
      ) : (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Asset not found</p>
        </div>
      );
      
    case 'breakdown':
      return selectedAsset ? (
        <MobileAssetBreakdown asset={selectedAsset} />
      ) : (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Asset not found</p>
        </div>
      );

    default:
      return <MobileAssetList assets={assets || []} />;
  }
};