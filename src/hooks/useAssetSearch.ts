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
      siteName: apiAsset.site?.name || apiAsset.site_name || '',
      building: apiAsset.building ? { name: apiAsset.building.name } : null,
      wing: apiAsset.wing ? { name: apiAsset.wing.name } : null,
      floor: apiAsset.floor
        ? { name: apiAsset.floor.name }
        : apiAsset.pms_floor
          ? { name: apiAsset.pms_floor.name }
          : null,
      area: apiAsset.area
        ? { name: apiAsset.area.name }
        : apiAsset.pms_area
          ? { name: apiAsset.pms_area.name }
          : null,
      pmsRoom: apiAsset.room
        ? { name: apiAsset.room.name }
        : apiAsset.pms_room
          ? { name: apiAsset.pms_room.name }
          : null,
      assetGroup: apiAsset.group?.name || (typeof apiAsset.pms_asset_group === 'object' ? apiAsset.pms_asset_group?.name : apiAsset.pms_asset_group) || (typeof apiAsset.asset_group === 'object' ? apiAsset.asset_group?.name : apiAsset.asset_group) || '',
      assetSubGroup: apiAsset.sub_group?.name || (typeof apiAsset.asset_sub_group === 'object' ? apiAsset.asset_sub_group?.name : apiAsset.asset_sub_group) || (typeof apiAsset.sub_group === 'object' ? apiAsset.sub_group?.name : apiAsset.sub_group) || '',
      assetType: apiAsset.asset_type !== undefined && apiAsset.asset_type !== null
        ? Boolean(apiAsset.asset_type)
        : undefined,
      category: apiAsset.asset_type_category || apiAsset.category || apiAsset.asset_category || '',
      purchased_on: apiAsset.purchased_on || '',
      supplier_name: apiAsset.supplier_name || '',
      purchase_cost: apiAsset.purchase_cost || 0,
      allocation_type: apiAsset.allocation_type || '',
      useful_life: apiAsset.useful_life || 0,
      depreciation_method: apiAsset.depreciation_method || '',
      accumulated_depreciation: apiAsset.accumulated_depreciation || 0,
      current_book_value: apiAsset.current_book_value || 0,
      disposal_date: apiAsset.disposal_date || '',
      model_number: apiAsset.model_number || '',
      manufacturer: apiAsset.manufacturer || '',
      critical: apiAsset.critical || false,
      commisioning_date: apiAsset.commisioning_date || '',
      warranty: apiAsset.warranty || '',
      amc: apiAsset.amc || '',
      disabled: !!apiAsset.disabled,
      pms_area: apiAsset.pms_area || apiAsset.area,
      pms_floor: apiAsset.pms_floor || apiAsset.floor,
      custom_fields: apiAsset.custom_fields || {},
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