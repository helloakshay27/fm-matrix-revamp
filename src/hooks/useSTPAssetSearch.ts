import { useState, useCallback } from 'react';
import { apiClient } from '@/utils/apiClient';

// STP Asset interface
export interface STPAsset {
  id: number;
  name: string;
  asset_number: string;
  asset_code: string;
  status: 'in_use' | 'in_storage' | 'breakdown' | 'disposed';
  equipment_id?: string;
  site_name: string;
  building?: { name: string } | string;
  wing?: { name: string } | string;
  floor?: { name: string } | string;
  area?: { name: string } | string;
  room?: { name: string } | string;
  meter_type: string;
  asset_type: string;
  serial_number?: string;
  model_number?: string;
  manufacturer?: string;
  purchase_cost?: number;
  current_book_value?: number;
  critical?: boolean;
  pms_site_id?: number;
  pms_building_id?: number;
  pms_wing_id?: number;
  pms_area_id?: number;
  pms_floor_id?: number;
  pms_room_id?: number;
  pms_asset_group_id?: number;
  pms_asset_sub_group_id?: number;
  commisioning_date?: string;
  purchased_on?: string;
  warranty_expiry?: string;
}

interface SearchResponse {
  assets: STPAsset[];
  total_count: number;
  pagination: {
    current_page: number;
    total_pages: number;
  };
}

export const useSTPAssetSearch = () => {
  const [assets, setAssets] = useState<STPAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapSTPAssetData = (apiAsset: any): STPAsset => {
    return {
      id: apiAsset.id || 0,
      name: apiAsset.name || '',
      asset_number: apiAsset.asset_number || '',
      asset_code: apiAsset.asset_code || '',
      status: apiAsset.status || 'in_storage',
      equipment_id: apiAsset.equipment_id,
      site_name: apiAsset.site?.name || apiAsset.site_name || '',
      building: apiAsset.building?.name || apiAsset.building || '',
      wing: apiAsset.wing?.name || apiAsset.wing || '',
      floor: apiAsset.floor?.name || apiAsset.floor || '',
      area: apiAsset.area?.name || apiAsset.area || '',
      room: apiAsset.room?.name || apiAsset.room || '',
      meter_type: apiAsset.meter_type || '',
      asset_type: apiAsset.asset_type || '',
      serial_number: apiAsset.serial_number || '',
      model_number: apiAsset.model_number || '',
      manufacturer: apiAsset.manufacturer || '',
      purchase_cost: apiAsset.purchase_cost,
      current_book_value: apiAsset.current_book_value,
      critical: apiAsset.critical || false,
      pms_site_id: apiAsset.pms_site_id,
      pms_building_id: apiAsset.pms_building_id,
      pms_wing_id: apiAsset.pms_wing_id,
      pms_area_id: apiAsset.pms_area_id,
      pms_floor_id: apiAsset.pms_floor_id,
      pms_room_id: apiAsset.pms_room_id,
      pms_asset_group_id: apiAsset.pms_asset_group_id,
      pms_asset_sub_group_id: apiAsset.pms_asset_sub_group_id,
      commisioning_date: apiAsset.commisioning_date,
      purchased_on: apiAsset.purchased_on,
      warranty_expiry: apiAsset.warranty_expiry,
    };
  };

  const searchSTPAssets = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setAssets([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build search query for STP assets
      const queryParams = new URLSearchParams();
      queryParams.append('q[name_or_asset_number_or_asset_code_cont]', searchTerm);
      // Filter for STP-related assets using proper type parameter
      queryParams.append('type', 'STP');
      queryParams.append('page', '1');
      queryParams.append('per_page', '50'); // Limit search results

      const response = await apiClient.get(`/pms/assets.json?${queryParams}`);
      
      if (response.data && response.data.assets) {
        const transformedAssets = response.data.assets.map(mapSTPAssetData);
        setAssets(transformedAssets);
      } else {
        setAssets([]);
      }
    } catch (err: any) {
      console.error('Error searching STP assets:', err);
      setError(err.response?.data?.message || err.message || 'Failed to search STP assets');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assets,
    loading,
    error,
    searchSTPAssets,
  };
};
