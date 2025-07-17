import { useState, useEffect } from 'react';
import { useAssets } from './useAssets';

export interface AssetStats {
  total: number;
  inUse: number;
  inStore: number;
  breakdown: number;
  disposed: number;
}

export const useAssetDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { assets, pagination, loading, error, refetch } = useAssets(currentPage);
  const [stats, setStats] = useState<AssetStats>({
    total: 0,
    inUse: 0,
    inStore: 0,
    breakdown: 0,
    disposed: 0
  });

  // Calculate stats from assets
  useEffect(() => {
    if (assets.length > 0) {
      const newStats = assets.reduce((acc, asset) => {
        acc.total++;
        switch (asset.assetStatus) {
          case 'In Use':
            acc.inUse++;
            break;
          case 'In Store':
            acc.inStore++;
            break;
          case 'Breakdown':
            acc.breakdown++;
            break;
          case 'Disposed':
            acc.disposed++;
            break;
        }
        return acc;
      }, { total: 0, inUse: 0, inStore: 0, breakdown: 0, disposed: 0 });

      // Use pagination total_count for actual total across all pages
      newStats.total = pagination.total_count || assets.length;
      setStats(newStats);
    }
  }, [assets, pagination.total_count]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    assets,
    pagination,
    loading,
    error,
    stats,
    currentPage,
    handlePageChange,
    refetch
  };
};