import { useState, useEffect } from 'react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

export interface Asset {
  id: string;
  name: string;
  serialNumber: number;
  assetNumber: string;
  status: 'in_use' | 'in_storage' | 'breakdown' | 'disposed';
  siteName: string;
  building: { name: string } | null;
  wing: { name: string } | null;
  floor: { name: string } | null;
  area: { name: string } | null;
  pmsRoom: { name: string } | null;
  assetGroup: string;
  assetSubGroup: string;
  assetType?: boolean;
  category?: string;
  disabled?: boolean;
  // Allow any additional custom fields
  [key: string]: any;
}

export interface AssetResponse {
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
  total_count: number;
  total_value: string;
  in_use_count: number;
  breakdown_count: number;
  it_assets: number;
  non_it_assets: number;
  in_store: number;
  dispose_assets: number;
  assets: Array<{
    id: number;
    name: string;
    serial_number: string | null;
    asset_number: string;
    status: string;
    site_name: string;
    building: { name: string } | null;
    wing: { name: string } | null;
    floor: { name: string } | null;
    area: { name: string } | null;
    pms_room: { name: string } | null;
    asset_group: string;
    asset_sub_group: string;
    asset_type?: boolean;
    category?: string;
  }>;
}

export interface AssetStats {
  total: number;
  totalValue: string;
  nonItAssets: number;
  itAssets: number;
  inUse: number;
  breakdown: number;
  inStore: number;
  dispose: number;
}

export const useAssets = (page: number = 1) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [stats, setStats] = useState<AssetStats>({
    total: 0,
    totalValue: `${localStorage.getItem('currency')}0.00`,
    nonItAssets: 0,
    itAssets: 0,
    inUse: 0,
    breakdown: 0,
    inStore: 0,
    dispose: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapAssetData = (apiAsset: any): Asset => ({
    id: apiAsset.id.toString(),
    name: apiAsset.name,
    serialNumber: apiAsset.serial_number || 'NA',
    assetNumber: apiAsset.asset_number,
    status: apiAsset.status,
    siteName: apiAsset.site_name,
    building: apiAsset.building,
    wing: apiAsset.wing,
    floor: apiAsset.floor,
    area: apiAsset.area,
    pmsRoom: apiAsset.pms_room,
    assetGroup: apiAsset.asset_group,
    assetSubGroup: apiAsset.asset_sub_group,
    assetType: apiAsset.asset_type,
    category: apiAsset.asset_type_category,
    disabled: !!apiAsset.disabled,
  });

  const formatStatusLabel = (status: string): string => {
    switch (status) {
      case 'in_use':
        return 'In Use';
      case 'in_storage':
        return 'In Store';
      case 'breakdown':
        return 'Breakdown';
      case 'disposed':
        return 'Disposed';
      default:
        return status;
    }
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/assets.json?page=${page}`,
        {
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch assets');
      }

      const data: AssetResponse = await response.json();

      // Map assets data
      const mappedAssets = data.assets?.map(mapAssetData) || [];
      setAssets(mappedAssets);

      // Set pagination
      setPagination({
        currentPage: data.pagination?.current_page || 1,
        totalPages: data.pagination?.total_pages || 1,
        totalCount: data.pagination?.total_count || 0,
      });

      // Set stats
      setStats({
        total: data.total_count || 0,
        totalValue: data.total_value || `${localStorage.getItem('currency')}0.00`,
        nonItAssets: data.non_it_assets || 0,
        itAssets: data.it_assets || 0,
        inUse: data.in_use_count || 0,
        breakdown: data.breakdown_count || 0,
        inStore: data.in_store || 0,
        dispose: data.dispose_assets || 0,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [page]);

  return {
    assets,
    stats,
    pagination,
    loading,
    error,
    refetch: fetchAssets,
    formatStatusLabel,
  };
};