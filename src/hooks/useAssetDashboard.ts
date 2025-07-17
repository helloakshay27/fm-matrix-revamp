import { useState, useMemo } from 'react';
import { useAssets } from './useAssets';

export const useAssetDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { assets, pagination, loading, error, refetch, changePage } = useAssets(currentPage);

  // Calculate stats from API data
  const stats = useMemo(() => {
    const totalAssets = pagination.total_count || 0;
    const inUseAssets = assets.filter(asset => asset.assetStatus === 'In Use').length;
    const breakdownAssets = assets.filter(asset => asset.assetStatus === 'Breakdown').length;
    const inStoreAssets = assets.filter(asset => asset.assetStatus === 'In Store').length;
    const disposedAssets = assets.filter(asset => asset.assetStatus === 'Disposed').length;
    const itAssets = assets.filter(asset => asset.assetType === 'Comprehensive').length;
    const nonItAssets = assets.filter(asset => asset.assetType === 'Non-Comprehensive').length;
    
    return {
      total: totalAssets,
      inUse: inUseAssets,
      breakdown: breakdownAssets,
      inStore: inStoreAssets,
      dispose: disposedAssets,
      totalValue: 125000, // This would come from API in real implementation
      nonItAssets: nonItAssets,
      itAssets: itAssets,
      critical: breakdownAssets, // Assuming breakdown assets are critical
      maintenance: 0 // Would need to be added to API response
    };
  }, [assets, pagination.total_count]);

  // Filter assets based on search term
  const filteredAssets = useMemo(() => {
    if (!searchTerm) return assets;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return assets.filter(asset =>
      asset.name.toLowerCase().includes(lowerSearchTerm) ||
      asset.assetId.toLowerCase().includes(lowerSearchTerm) ||
      asset.assetNo.toLowerCase().includes(lowerSearchTerm) ||
      asset.serialNumber.toLowerCase().includes(lowerSearchTerm)
    );
  }, [assets, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets(prev => [...prev, assetId]);
    } else {
      setSelectedAssets(prev => prev.filter(id => id !== assetId));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    changePage(page);
  };

  return {
    assets: filteredAssets,
    allAssets: assets,
    selectedAssets,
    searchTerm,
    stats,
    pagination,
    loading,
    error,
    currentPage,
    handleSearch,
    handleSelectAll,
    handleSelectAsset,
    handlePageChange,
    refetch
  };
};