import { useState, useEffect } from 'react';
import { useAssets } from './useAssets';

export const useAssetDashboard = (searchTerm: string, currentPage: number) => {
  const { assets, pagination, statsData, loading, error, refetch } = useAssets(currentPage, searchTerm);

  // Calculate dashboard statistics from API data
  const dashboardStats = {
    totalAssets: statsData.in_use_count + statsData.in_store + statsData.breakdown_count + statsData.dispose_assets,
    inUse: statsData.in_use_count,
    breakdown: statsData.breakdown_count,
    inStore: statsData.in_store,
    disposed: statsData.dispose_assets,
    itAssets: statsData.it_assets,
    nonItAssets: statsData.non_it_assets,
    totalValue: statsData.total_value
  };

  return {
    assets,
    pagination,
    dashboardStats,
    loading,
    error,
    refetch
  };
};