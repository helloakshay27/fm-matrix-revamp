import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';
import { Asset } from '@/hooks/useAssets';

interface SearchResponse {
  assets: Asset[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export const useAssetSearch = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  }>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 15, // Assuming 15 items per page, adjust as needed
  });

  const mapAssetData = (apiAsset: any): Asset => {
    return {
      id: apiAsset.id?.toString() || '',
      name: apiAsset.name || '',
      assetNumber: apiAsset.asset_number || '',
      serialNumber: apiAsset.serial_number || '',
      status: apiAsset.status as Asset['status'] || 'in_storage',
      siteName: apiAsset.site?.name || '',
      building: apiAsset.building ? { name: apiAsset.building.name } : null,
      wing: apiAsset.wing ? { name: apiAsset.wing.name } : null,
      area: apiAsset.area ? { name: apiAsset.area.name } : null,
      pmsRoom: apiAsset.room ? { name: apiAsset.room.name } : null,
      assetGroup: apiAsset.group?.name || '',
      assetSubGroup: apiAsset.sub_group?.name || '',
      assetType: Boolean(apiAsset.asset_type),
    };
  };

  const searchAssets = useCallback(async (searchTerm: string, page: number = 1) => {
    if (!searchTerm.trim()) {
      setAssets([]);
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        per_page: 15,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<SearchResponse>(ENDPOINTS.ASSETS, {
        params: {
          'q[name_or_asset_number_cont]': searchTerm,
          page: page,
          per_page: 15,
        }
      });

      if (response.data && Array.isArray(response.data.assets)) {
        const mappedAssets = response.data.assets.map(mapAssetData);
        setAssets(mappedAssets);
        setPagination(response.data.pagination);
      } else {
        console.log('⚠️ Invalid response structure - no data array found');
        setAssets([]);
        setPagination({
          current_page: 1,
          total_pages: 1,
          total_count: 0,
          per_page: 15,
        });
      }
    } catch (err: any) {
      setError('Failed to search assets. Please try again.');
      setAssets([]);
      setPagination({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
        per_page: 15,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assets,
    loading,
    error,
    pagination,
    searchAssets,
  };
};