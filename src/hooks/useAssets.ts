import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@/config/apiConfig';

export interface ApiAsset {
  id: number;
  name: string;
  asset_number: string;
  serial_number?: string;
  status: 'in_use' | 'in_storage' | 'breakdown' | 'disposed';
  site_name?: string;
  building?: {
    name: string;
  } | null;
  wing?: {
    name: string;
  } | null;
  floor?: {
    name: string;
  } | null;
  area?: {
    name: string;
  } | null;
  pms_room?: {
    name: string;
  } | null;
  asset_group?: string;
  asset_sub_group?: string;
  asset_type?: boolean;
}

export interface MappedAsset {
  id: string;
  serialNumber: string;
  name: string;
  assetId: string;
  assetNo: string;
  assetStatus: string;
  site: string;
  building: string;
  wing: string;
  floor: string;
  area: string;
  room: string;
  group: string;
  subGroup: string;
  assetType: string;
}

export interface AssetResponse {
  assets: ApiAsset[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
  // Summary data for dashboard cards
  breakdown_count?: number;
  dispose_assets?: number;
  in_store?: number;
  in_use_count?: number;
  it_assets?: number;
  non_it_assets?: number;
  total_value?: string;
}

const mapAssetStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'in_use': 'In Use',
    'in_storage': 'In Store', 
    'breakdown': 'Breakdown',
    'disposed': 'Disposed'
  };
  return statusMap[status] || status;
};

const mapApiAssetToAsset = (apiAsset: ApiAsset): MappedAsset => ({
  id: apiAsset.id.toString(),
  serialNumber: apiAsset.serial_number || 'NA',
  name: apiAsset.name,
  assetId: apiAsset.id.toString(),
  assetNo: apiAsset.asset_number,
  assetStatus: mapAssetStatus(apiAsset.status),
  site: apiAsset.site_name || 'NA',
  building: apiAsset.building?.name || 'NA',
  wing: apiAsset.wing?.name || 'NA',
  floor: apiAsset.floor?.name || 'NA',
  area: apiAsset.area?.name || 'NA',
  room: apiAsset.pms_room?.name || 'NA',
  group: apiAsset.asset_group || 'NA',
  subGroup: apiAsset.asset_sub_group || 'NA',
  assetType: apiAsset.asset_type ? 'Comprehensive' : 'Non-Comprehensive'
});

export const useAssets = (page: number = 1, searchTerm: string = '') => {
  const [data, setData] = useState<AssetResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, any> = {
        page,
        per_page: 10
      };

      // Add search parameter if provided
      if (searchTerm) {
        params['q[name_or_asset_number_cont]'] = searchTerm;
      }

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ASSETS}`,
        {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
            'Content-Type': 'application/json'
          },
          params
        }
      );

      setData(response.data);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [page, searchTerm]);

  const mappedAssets = data?.assets ? data.assets.map(mapApiAssetToAsset) : [];

  return {
    assets: mappedAssets,
    pagination: data?.pagination || {
      current_page: 1,
      total_pages: 1,
      total_count: 0,
      per_page: 10
    },
    statsData: {
      breakdown_count: data?.breakdown_count || 0,
      dispose_assets: data?.dispose_assets || 0,
      in_store: data?.in_store || 0,
      in_use_count: data?.in_use_count || 0,
      it_assets: data?.it_assets || 0,
      non_it_assets: data?.non_it_assets || 0,
      total_value: data?.total_value || '0'
    },
    loading,
    error,
    refetch: fetchAssets
  };
};