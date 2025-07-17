import { useState, useEffect } from 'react';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

export interface ApiAsset {
  id: number;
  name: string;
  asset_number: string;
  serial_number: string | null;
  status: 'in_use' | 'in_storage' | 'breakdown' | 'disposed';
  site_name: string;
  asset_group: string;
  asset_sub_group: string;
  asset_type: boolean;
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

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface AssetResponse {
  pms_assets: ApiAsset[];
  pagination: PaginationInfo;
}

// Status mapping function
const mapStatus = (status: string): string => {
  const statusMap = {
    'in_use': 'In Use',
    'in_storage': 'In Store',
    'breakdown': 'Breakdown',
    'disposed': 'Disposed'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// Asset mapping function
const mapAsset = (asset: ApiAsset): MappedAsset => ({
  id: asset.id.toString(),
  serialNumber: asset.serial_number || 'NA',
  name: asset.name,
  assetId: asset.id.toString(),
  assetNo: asset.asset_number,
  assetStatus: mapStatus(asset.status),
  site: asset.site_name,
  building: asset.building?.name || 'NA',
  wing: asset.wing?.name || 'NA',
  floor: asset.floor?.name || 'NA',
  area: asset.area?.name || 'NA',
  room: asset.pms_room?.name || 'NA',
  group: asset.asset_group,
  subGroup: asset.asset_sub_group,
  assetType: asset.asset_type ? 'Comprehensive' : 'Non-Comprehensive'
});

export const useAssets = (page = 1) => {
  const [assets, setAssets] = useState<MappedAsset[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async (currentPage = 1) => {
    try {
      setLoading(true);
      setError(null);

      const url = getFullUrl(`/pms/assets.json?page=${currentPage}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AssetResponse = await response.json();
      
      // Handle case where pms_assets might be undefined
      if (data.pms_assets && Array.isArray(data.pms_assets)) {
        const mappedAssets = data.pms_assets.map(mapAsset);
        setAssets(mappedAssets);
        setPagination(data.pagination || { current_page: 1, total_pages: 1, total_count: 0 });
      } else {
        console.error('Invalid API response structure:', data);
        setAssets([]);
        setPagination({ current_page: 1, total_pages: 1, total_count: 0 });
        setError('Invalid API response structure');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(page);
  }, [page]);

  const refetch = () => {
    fetchAssets(pagination.current_page);
  };

  return {
    assets,
    pagination,
    loading,
    error,
    refetch,
    fetchAssets
  };
};