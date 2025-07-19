import axios from 'axios';

// Configure the base URL for your API
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://your-api-domain.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Add any common headers here
  },
});

// Add request interceptor for authentication if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface CreateAssetPayload {
  pms_asset: {
    name: string;
    pms_site_id?: string;
    pms_building_id?: string;
    pms_wing_id?: string;
    pms_area_id?: string;
    pms_floor_id?: string;
    pms_room_id?: string;
    loaned_from_vendor_id?: string;
    status: string;
    warranty_period?: string;
    agreement_from_date?: string;
    agreement_to_date?: string;
    asset_number: string;
    model_number?: string;
    serial_number?: string;
    manufacturer?: string;
    commisioning_date?: string;
    pms_asset_sub_group_id?: string;
    pms_asset_group_id?: string;
    pms_supplier_id?: string;
    salvage_value?: string;
    depreciation_rate?: string;
    depreciation_method?: string;
    it_asset: boolean;
    it_meter: boolean;
    meter_tag_type?: string;
    parent_meter_id?: string;
    breakdown: boolean;
    critical: boolean;
    is_meter: boolean;
    asset_loaned: boolean;
    depreciation_applicable: boolean;
    useful_life?: string;
    purchase_cost: string;
    purchased_on?: string;
    warranty?: string;
    depreciation_applicable_for?: string;
    indiv_group?: string;
    warranty_expiry?: string;
    allocation_type?: string;
    asset_ids?: string[];
    group_id?: string;
    sub_group_id?: string;
    consumption_pms_asset_measures_attributes?: Array<{
      name: string;
      meter_unit_id: number;
      min_value: number;
      max_value: number;
      alert_below: number;
      alert_above: number;
      multiplier_factor: number;
      active: boolean;
      meter_tag: string;
      check_previous_reading: boolean;
      _destroy: boolean;
    }>;
    non_consumption_pms_asset_measures_attributes?: Array<{
      name: string;
      meter_unit_id: number;
      min_value: number;
      max_value: number;
      alert_below: number;
      alert_above: number;
      active: boolean;
      meter_tag: string;
      check_previous_reading: boolean;
      _destroy: boolean;
    }>;
  };
  allocation_ids?: string[];
  asset_move_to?: {
    site_id: string;
    building_id: string;
    wing_id: string;
    area_id: string;
    floor_id: string;
    room_id: string;
  };
  amc_detail?: {
    supplier_id: string;
    amc_start_date: string;
    amc_end_date: string;
    amc_first_service: string;
    payment_term: string;
    no_of_visits: string;
  };
  asset_manuals?: Array<{
    file_name: string;
    url: string;
  }>;
  asset_insurances?: Array<{
    insurance_provider: string;
    policy_number: string;
    valid_till: string;
  }>;
  asset_purchases?: Array<{
    invoice_number: string;
    purchase_date: string;
    amount: string;
  }>;
  asset_other_uploads?: Array<{
    file_name: string;
    url: string;
  }>;
  extra_fields_attributes?: Array<{
    field_name: string;
    field_value: string;
    group_name: string;
    field_description?: string;
    _destroy: boolean;
  }>;
}

export const assetAPI = {
  createAsset: async (payload: CreateAssetPayload) => {
    try {
      const response = await apiClient.post('/pms/assets.json', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add other asset-related API methods here
  getAssets: async (params?: any) => {
    try {
      const response = await apiClient.get('/pms/assets.json', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAssetById: async (id: string) => {
    try {
      const response = await apiClient.get(`/pms/assets/${id}.json`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAsset: async (id: string, payload: Partial<CreateAssetPayload>) => {
    try {
      const response = await apiClient.put(`/pms/assets/${id}.json`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteAsset: async (id: string) => {
    try {
      const response = await apiClient.delete(`/pms/assets/${id}.json`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiClient;