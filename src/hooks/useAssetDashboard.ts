import { useState, useMemo } from 'react';
import { useAssets, AssetFilters } from './useAssets';

export const useAssetDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AssetFilters>({});
  
  const { assets, pagination, statsData, loading, error, refetch, changePage } = useAssets(currentPage, 20, filters);

  // Use stats from API data
  const stats = useMemo(() => {
    return {
      total: pagination.total_count || 0,
      inUse: statsData.in_use_count || 0,
      breakdown: statsData.breakdown_count || 0,
      inStore: statsData.in_store || 0,
      dispose: statsData.dispose_assets || 0,
      totalValue: statsData.total_value || 0,
      nonItAssets: statsData.non_it_assets || 0,
      itAssets: statsData.it_assets || 0,
      critical: statsData.breakdown_count || 0,
      maintenance: 0
    };
  }, [statsData, pagination.total_count]);

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
    // Use combined search for API
    const newFilters = { ...filters, assetNameOrNumber: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (newFilters: AssetFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
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
    changePage(page, filters);
  };

  const handleRefetch = () => {
    refetch(filters);
  };

  return {
    assets: filteredAssets,
    allAssets: assets,
    selectedAssets,
    searchTerm,
    filters,
    stats,
    pagination,
    loading,
    error,
    currentPage,
    handleSearch,
    handleFilterChange,
    handleSelectAll,
    handleSelectAsset,
    handlePageChange,
    refetch: handleRefetch
  };
};