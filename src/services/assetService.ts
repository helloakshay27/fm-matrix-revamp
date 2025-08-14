import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

export interface Asset {
  id: number;
  name: string;
}

export interface AssetSubGroup {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    group_id: string;
    status: string;
    useful_life: string | null;
  }

export interface AssetGroup {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  site_id: number | null;
  user_id: number | null;
  company_id: number;
  status: string;
  group_type: string;
}

export interface Supplier {
  id: number;
  name: string;
}

export interface User {
  id: number;
  full_name: string;
}

export interface EmailRule {
  id: number;
  company_id: number;
  created_by: number;
  trigger_to: string;
  period_type: string;
  period_value: string;
  active: number;
  created_at: string;
  updated_at: string;
  rule_name: string;
  trigger_type: string;
  site_id: number;
  role_ids: string[];
  role_names: string;
  created_by_name: string;
}

// Get base URL from environment or use a default
const getBaseUrl = () => {
  // Replace this with your actual base URL
  return process.env.REACT_APP_BASE_URL || 'https://your-api-domain.com';
};

export const assetService = {
  async getAssets(): Promise<Asset[]> {
    try {
      console.log('Fetching assets from API...');
      const url = `${API_CONFIG.BASE_URL}/pms/assets/get_assets.json`;
      console.log('API URL:', url);
      
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
      
      const data = await response.json();
      console.log('Assets API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      
      // Return mock data for development/testing
      const mockAssets: Asset[] = [
        { id: 28851, name: "Adani Electric Meter" },
        { id: 28852, name: "Laptop Dell Vostro" },
        { id: 28853, name: "Testing Asset 1" },
        { id: 28854, name: "Testing Asset 2" },
      ];
      console.log('Using mock assets data:', mockAssets);
      return mockAssets;
    }
  },

  async getAssetGroups(): Promise<{ asset_groups: AssetGroup[] }> {
    try {
      console.log('Fetching asset groups from API...');
      const url = `${API_CONFIG.BASE_URL}/pms/assets/get_asset_group_sub_group.json`;
      console.log('API URL:', url);
      
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
      
      const data = await response.json();
      console.log('Asset groups API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching asset groups:', error);
      
      // Return mock data for development/testing
      const mockAssetGroups = {
        asset_groups: [
          {
            id: 221,
            name: "Electronic Devices",
            created_at: "2020-09-28T12:40:20.000+05:30",
            updated_at: "2023-11-20T23:09:27.000+05:30",
            site_id: null,
            user_id: null,
            company_id: 111,
            status: "active",
            group_type: "asset"
          },
          {
            id: 289,
            name: "Electrical",
            created_at: "2021-07-17T18:36:06.000+05:30",
            updated_at: "2021-07-17T18:36:06.000+05:30",
            site_id: null,
            user_id: null,
            company_id: 111,
            status: "active",
            group_type: "asset"
          }
        ]
      };
      console.log('Using mock asset groups data:', mockAssetGroups);
      return mockAssetGroups;
    }
  },
  
    async getAssetSubGroups(groupId: number): Promise<{ asset_groups: AssetSubGroup[] }> {
    try {
      console.log('Fetching asset sub-groups for group ID:', groupId);
      const url = `${API_CONFIG.BASE_URL}/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`;
      console.log('API URL:', url);
      
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
      
      const data = await response.json();
      console.log('Asset sub-groups API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching asset sub-groups:', error);
      
      // Return mock data for development/testing
      const mockSubGroups = {
        asset_groups: [
          {
            id: 1232,
            name: "Laptops",
            created_at: "2020-09-28T12:40:36.000+05:30",
            updated_at: "2020-09-28T12:40:36.000+05:30",
            group_id: groupId.toString(),
            status: "active",
            useful_life: null
          },
          {
            id: 1233,
            name: "Tabs",
            created_at: "2020-09-28T12:40:57.000+05:30",
            updated_at: "2020-09-28T12:40:57.000+05:30",
            group_id: groupId.toString(),
            status: "active",
            useful_life: null
          }
        ]
      };
      console.log('Using mock sub-groups data:', mockSubGroups);
      return mockSubGroups;
    }
  },

  async getEmailRules(): Promise<EmailRule[]> {
    try {
      console.log('Fetching email rules from API...');
      const url = `${API_CONFIG.BASE_URL}/pms/email_rule_setups.json`;
      console.log('API URL:', url);
      
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
      
      const data = await response.json();
      console.log('Email rules API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching email rules:', error);
      
      // Return mock data for development/testing
      const mockEmailRules: EmailRule[] = [
        {
          id: 117,
          company_id: 111,
          created_by: 87989,
          trigger_to: "Site Admin",
          period_type: "days",
          period_value: "1",
          active: 1,
          created_at: "2025-07-17T06:56:14.000+05:30",
          updated_at: "2025-07-17T06:59:26.000+05:30",
          rule_name: "test200",
          trigger_type: "AMC",
          site_id: 2189,
          role_ids: ["6"],
          role_names: "Manager Notification",
          created_by_name: "Abhishek Sharma"
        },
        {
          id: 116,
          company_id: 111,
          created_by: 87989,
          trigger_to: "Occupant Admin",
          period_type: "days",
          period_value: "1",
          active: 1,
          created_at: "2025-07-17T06:49:39.000+05:30",
          updated_at: "2025-07-17T06:49:39.000+05:30",
          rule_name: "test100",
          trigger_type: "PPM",
          site_id: 2189,
          role_ids: ["1", "5"],
          role_names: "Account Manager, Site Admin",
          created_by_name: "Abhishek Sharma"
        }
      ];
      console.log('Using mock email rules data:', mockEmailRules);
      return mockEmailRules;
    }
  },

  async getUsers(): Promise<{ users: User[] }> {
    try {
      console.log('Fetching users from API...');
      const url = `${API_CONFIG.BASE_URL}/pms/users/get_escalate_to_users.json`;
      console.log('API URL:', url);
      
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
      
      const data = await response.json();
      console.log('Users API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Return mock data for development/testing
      const mockUsers = {
        users: [
          { id: 2, full_name: "Mahendra Lungare" },
          { id: 35413, full_name: "Sumitra Patil" }
        ]
      };
      console.log('Using mock users data:', mockUsers);
      return mockUsers;
    }
  },

  async getSuppliers(): Promise<Supplier[]> {
    try {
      console.log('Fetching suppliers from API...');
      const url = `${API_CONFIG.BASE_URL}/pms/suppliers/get_suppliers.json`;
      console.log('API URL:', url);
      
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
      
      const data = await response.json();
      console.log('Suppliers API response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      
      // Return mock data for development/testing
      const mockSuppliers: Supplier[] = [
        { id: 36582, name: "Oizom Instruments Pvt. Ltd." },
        { id: 36583, name: "Reliance Digital" }
      ];
      console.log('Using mock suppliers data:', mockSuppliers);
      return mockSuppliers;
    }
  },
};
