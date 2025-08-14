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
      console.log('🔍 Starting asset search with term:', searchTerm);
      console.log('📡 API Base URL:', apiClient.defaults.baseURL);
      console.log('🔗 Search endpoint:', ENDPOINTS.ASSETS);
      console.log('🔑 Auth header available:', !!apiClient.defaults.headers.Authorization);
      
      const response = await apiClient.get<SearchResponse>(ENDPOINTS.ASSETS, {
        params: {
          'q[name_or_asset_number_cont]': searchTerm
        }
      });

      console.log(response.data.assets)

      console.log('✅ Search response received:', response.status);
      console.log('📄 Response data structure:', {
        hasData: !!response.data,
        hasDataArray: !!(response.data && Array.isArray(response.data.assets)),
        dataCount: response.data?.assets?.length || 0
      });

      if (response.data && Array.isArray(response.data.assets)) {
        const mappedAssets = response.data.assets.map(mapAssetData);
        console.log('🎯 Mapped assets count:', mappedAssets.length);
        setAssets(mappedAssets);
      } else {
        console.log('⚠️ Invalid response structure - no data array found');
        setAssets([]);
      }
    } catch (err: any) {
      console.error('❌ Asset search error:', err);
      console.error('📝 Error details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data
      });
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