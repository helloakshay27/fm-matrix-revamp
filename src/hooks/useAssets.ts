import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

export interface Asset {
  id: string;
  serial_number: string | null;
  name: string;
  asset_number: string;
  status: string;
  site_name: string;
  building: {
    name: string;
  } | null;
  wing: {
    name: string;
  } | null;
  floor: {
    name: string;
  } | null;
  area: {
    name: string;
  } | null;
  pms_room: {
    name: string;
  } | null;
  asset_group: string;
  asset_sub_group: string;
  asset_type: boolean;
}

export interface ApiResponse {
  assets: Asset[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
  breakdown_count: number;
  dispose_assets: number;
  in_store: number;
  in_use_count: number;
  it_assets: number;
  non_it_assets: number;
  total_value: number | string;
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

const mapStatusToDisplay = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'in_use': 'In Use',
    'in_storage': 'In Store',
    'breakdown': 'Breakdown',
    'disposed': 'Disposed'
  };
  return statusMap[status] || status;
};

const mapAssetTypeToDisplay = (assetType: boolean): string => {
  return assetType ? 'Comprehensive' : 'Non-Comprehensive';
};

const mapAssetData = (asset: Asset): MappedAsset => ({
  id: asset.id,
  serialNumber: asset.serial_number || 'NA',
  name: asset.name,
  assetId: asset.id,
  assetNo: asset.asset_number,
  assetStatus: mapStatusToDisplay(asset.status),
  site: asset.site_name,
  building: asset.building?.name || 'NA',
  wing: asset.wing?.name || 'NA',
  floor: asset.floor?.name || 'NA',
  area: asset.area?.name || 'NA',
  room: asset.pms_room?.name || 'NA',
  group: asset.asset_group,
  subGroup: asset.asset_sub_group,
  assetType: mapAssetTypeToDisplay(asset.asset_type)
});

export interface AssetFilters {
  assetNameOrNumber?: string;
  assetName?: string;
  assetId?: string;
  pmsAssetGroupId?: string;
  pmsSubGroupId?: string;
  pmsSiteId?: string;
  pmsBuildingId?: string;
  pmsWingId?: string;
  pmsAreaId?: string;
  pmsFloorId?: string;
  pmsRoomId?: string;
}

export const useAssets = (page: number = 1, perPage: number = 20, filters: AssetFilters = {}) => {
  const [assets, setAssets] = useState<MappedAsset[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 20
  });
  const [statsData, setStatsData] = useState({
    breakdown_count: 0,
    dispose_assets: 0,
    in_store: 0,
    in_use_count: 0,
    it_assets: 0,
    non_it_assets: 0,
    total_value: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async (currentPage: number = page, currentFilters: AssetFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params: any = {
        page: currentPage,
        per_page: perPage
      };

      // Add filter parameters
      if (currentFilters.assetNameOrNumber) {
        params["q[name_or_asset_number_cont]"] = currentFilters.assetNameOrNumber;
      }
      if (currentFilters.assetName) {
        params["q[name_cont]"] = currentFilters.assetName;
      }
      if (currentFilters.assetId) {
        params["q[id_eq]"] = currentFilters.assetId;
      }
      if (currentFilters.pmsAssetGroupId) {
        params["q[pms_asset_group_id_eq]"] = currentFilters.pmsAssetGroupId;
      }
      if (currentFilters.pmsSubGroupId) {
        params["q[pms_sub_group_id_eq]"] = currentFilters.pmsSubGroupId;
      }
      if (currentFilters.pmsSiteId) {
        params["q[pms_site_id_eq]"] = currentFilters.pmsSiteId;
      }
      if (currentFilters.pmsBuildingId) {
        params["q[pms_building_id_eq]"] = currentFilters.pmsBuildingId;
      }
      if (currentFilters.pmsWingId) {
        params["q[pms_wing_id_eq]"] = currentFilters.pmsWingId;
      }
      if (currentFilters.pmsAreaId) {
        params["q[pms_area_id_eq]"] = currentFilters.pmsAreaId;
      }
      if (currentFilters.pmsFloorId) {
        params["q[pms_floor_id_eq]"] = currentFilters.pmsFloorId;
      }
      if (currentFilters.pmsRoomId) {
        params["q[pms_room_id_eq]"] = currentFilters.pmsRoomId;
      }
      
      const response = await apiClient.get<ApiResponse>(`${ENDPOINTS.ASSETS || '/pms/assets.json'}`, {
        params
      });

      const mappedAssets = response.data.assets.map(mapAssetData);
      setAssets(mappedAssets);
      setPagination(response.data.pagination);
      setStatsData({
        breakdown_count: response.data.breakdown_count || 0,
        dispose_assets: response.data.dispose_assets || 0,
        in_store: response.data.in_store || 0,
        in_use_count: response.data.in_use_count || 0,
        it_assets: response.data.it_assets || 0,
        non_it_assets: response.data.non_it_assets || 0,
        total_value: typeof response.data.total_value === 'string' ? 0 : (response.data.total_value || 0)
      });
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to fetch assets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(page, filters);
  }, [page, perPage, filters]);

  const refetch = (currentFilters: AssetFilters = filters) => {
    fetchAssets(pagination.current_page, currentFilters);
  };

  const changePage = (newPage: number, currentFilters: AssetFilters = filters) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchAssets(newPage, currentFilters);
    }
  };

  return {
    assets,
    pagination,
    statsData,
    loading,
    error,
    refetch,
    changePage
  };
};