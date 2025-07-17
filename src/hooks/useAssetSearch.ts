import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';
import { Asset } from '@/hooks/useAssets';

interface SearchResponse {
  data: any[];
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

  const searchAssets = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setAssets([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<SearchResponse>(ENDPOINTS.ASSETS, {
        params: {
          'q[name_or_asset_number_cont]': searchTerm
        }
      });

      if (response.data && Array.isArray(response.data.data)) {
        const mappedAssets = response.data.data.map(mapAssetData);
        setAssets(mappedAssets);
      } else {
        setAssets([]);
      }
    } catch (err) {
      console.error('Asset search error:', err);
      setError('Failed to search assets. Please try again.');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assets,
    loading,
    error,
    searchAssets,
  };
};