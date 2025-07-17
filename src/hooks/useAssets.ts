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

export const useAssets = (page: number = 1, perPage: number = 20) => {
  const [assets, setAssets] = useState<MappedAsset[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 20
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async (currentPage: number = page) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<ApiResponse>(`${ENDPOINTS.ASSETS || '/pms/assets.json'}`, {
        params: {
          page: currentPage,
          per_page: perPage
        }
      });

      const mappedAssets = response.data.assets.map(mapAssetData);
      setAssets(mappedAssets);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to fetch assets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(page);
  }, [page, perPage]);

  const refetch = () => {
    fetchAssets(pagination.current_page);
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchAssets(newPage);
    }
  };

  return {
    assets,
    pagination,
    loading,
    error,
    refetch,
    changePage
  };
};