import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

export interface AssetType {
  id: number;
  name: string;
}

export const fetchAssetTypes = async (): Promise<AssetType[]> => {
  const response = await apiClient.get(ENDPOINTS.ASSET_TYPES);
  
  // Transform the API response format [[name, id], [name, id], ...] to {id, name}[]
  if (response.data && response.data.asset_meter_types && Array.isArray(response.data.asset_meter_types)) {
    return response.data.asset_meter_types.map(([name, id]: [string, number]) => ({
      id,
      name
    }));
  }
  
  return [];
};
