import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

export interface SiteData {
  id?: number;
  name: string;
  company_id: number;
  headquarter_id: number;
  region_id: number | string;
  latitude?: number | string;
  longitude?: number | string;
  geofence_range?: string | number;
  address?: string;
  state?: string;
  city?: string;
  district?: string;
  zone_id?: string | number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: number | null;
  visitor_image_required?: boolean;
  visitor_identification_required?: boolean;
  attendance_image_required?: boolean;
  complaint_urgency_enabled?: boolean;
  custom_fields?: string;
  branch_code?: string;
  ifsc_code?: string;
  tier?: string;
  classification?: string;
  pmc_vendor_id?: number | null;
  location_url?: string;
  temp_mandatory?: boolean;
  health_questions_enabled?: boolean;
  temp_scan_enabled?: boolean;
  fr_enabled?: boolean;
  arogya_setu_scanner_enabled?: boolean;
  inv_online_payment_allowed?: boolean;
  auto_create_invoice?: boolean;
  auto_create_receipt?: boolean;
  invoice_format?: string;
  receipt_format?: string | null;
  invoice_prefix?: string;
  invoice_next_number?: string;
  receipt_prefix?: string;
  receipt_next_number?: string;
  bills_and_payments_enabled?: boolean;
  ccavenue_sub_account_id?: number | null;
  skip_host_approval?: boolean;
  registration_workflow?: string;
  restaurants_enabled?: boolean;
  facility_bookings_enabled?: boolean;
  no_of_devices?: number | null;
  device_rental_type?: string;
  device_rental_rate?: number | null;
  space_enabled?: boolean;
  max_device_limit?: number | null;
  survey_enabled?: boolean;
  fitout_area_rate?: number | null;
  fitout_enabled?: boolean;
  mailroom_enabled?: boolean;
  create_breakdown_ticket?: boolean;
  parking_enabled?: boolean;
  default_visitor_pass?: boolean;
  ecommerce_service_enabled?: boolean;
  operational_audit_enabled?: boolean;
  steps_enabled?: boolean;
  transportation_enabled?: boolean;
  business_card_enabled?: boolean;
  visitor_enabled?: boolean;
  sites_start_dates?: string | null;
  sap_plant_code?: string;
  total_area_sq_ft?: number | null;
  patrolling_notification_time?: number;
  patrolling_approver_id?: string;
  govt_id_enabled?: boolean | null;
  aqi_value?: number;
  aqi_category?: string;
  visitor_host_mandatory?: boolean | null;
  name_with_zone?: string;
  pms_region?: {
    id: number;
    name: string;
    active: boolean;
    created_at: string;
    updated_at: string;
    company_id: number;
    country_id: string;
    headquarter_id: number;
    organization_id: number | null;
    headquarter: {
      id: number;
      created_at: string;
      updated_at: string;
      company_setup_id: number;
      country_id: number;
      active: boolean;
      organization_id: number | null;
      name: string;
    };
  };
  pms_zone?: {
    name: string;
  };
  is_favourite?: boolean;
  favoured_by?: {
    users: Array<{
      first_name: string | null;
      last_name: string | null;
    }>;
    user_like_count: number;
  };
  site_advantages?: Array<{
    name: string;
    icon: string;
  }>;
  amenities?: Array<{
    id: number;
    name: string;
    description: string;
    icon: string | null;
  }>;
  operational_schedule?: Array<{
    day: string;
    times: Array<{
      start_hour?: string;
      start_min?: string;
      end_hour?: string;
      end_min?: string;
      status?: string;
    }>;
  }>;
  operational_days?: string[];
  operational_hours?: Array<{
    start_hour: string;
    start_min: string;
    end_hour: string;
    end_min: string;
  }>;
  operational_dates?: string;
  image_url?: Array<{
    id: number;
    relation: string;
    relation_id: number;
    active: number;
    url: string;
    doctype: string;
  }>;
  shared_content?: string;
  google_maps_url?: string;
}

export interface SiteFormData {
  name: string;
  company_id: number;
  headquarter_id: number;
  region_id: number;
  latitude?: string;
  longitude?: string;
  geofence_range?: string;
  address?: string;
  state?: string;
  city?: string;
  district?: string;
  zone_id?: string;
}

export interface SiteResponse {
  success: boolean;
  message?: string;
  data?: SiteData;
  error?: string;
}

export interface CompanyOption {
  id: number;
  name: string;
  country_id?: number;
  organization_id?: number;
}

export interface HeadquarterOption {
  id: number;
  company_setup_id: number;
  country_id: number;
  active: boolean;
  organization_id: number | null;
  created_at: string;
  updated_at: string;
  url: string;
  company_name: string;
  country_name: string;
}

export interface RegionOption {
  id: number;
  name: string;
  active: boolean;
  company_id: number;
  country_id: string;
  headquarter_id: number;
  organization_id: number | null;
  created_at: string;
  updated_at: string;
  url: string;
}

class SiteService {
  private getFullUrl(endpoint: string): string {
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    
    if (!baseUrl.startsWith('http')) {
      return `https://${baseUrl}${endpoint}?access_token=${token}`;
    }
    return `${baseUrl}${endpoint}?access_token=${token}`;
  }

  async createSite(siteData: SiteFormData): Promise<SiteResponse> {
    try {
      const token = API_CONFIG.TOKEN;
      if (!token) {
        toast.error('Authentication token missing');
        return { success: false, error: 'Authentication token missing' };
      }

      const url = this.getFullUrl('/pms/sites/site_create.json');

      const payload = {
        pms_site: {
          name: siteData.name,
          company_id: siteData.company_id,
          headquarter_id: siteData.headquarter_id,
          region_id: siteData.region_id,
          latitude: siteData.latitude || "",
          longitude: siteData.longitude || "",
          geofence_range: siteData.geofence_range || "",
          address: siteData.address || "",
          state: siteData.state || "",
          city: siteData.city || "",
          district: siteData.district || "",
          zone_id: siteData.zone_id || ""
        }
      };

      console.log('Creating site with URL:', url);
      console.log('Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Create site response:', result);

      if (response.ok) {
        toast.success('Site created successfully');
        return { 
          success: true, 
          data: result.data || result,
          message: result.message || 'Site created successfully'
        };
      } else {
        const errorMessage = result.message || result.error || 'Failed to create site';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Error creating site:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create site';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async updateSite(siteId: number, siteData: SiteFormData): Promise<SiteResponse> {
    try {
      const token = API_CONFIG.TOKEN;
      if (!token) {
        toast.error('Authentication token missing');
        return { success: false, error: 'Authentication token missing' };
      }

      const url = this.getFullUrl(`/pms/sites/${siteId}/site_update.json`);

      const payload = {
        pms_site: {
          name: siteData.name,
          company_id: siteData.company_id,
          headquarter_id: siteData.headquarter_id,
          region_id: siteData.region_id,
          latitude: siteData.latitude || "",
          longitude: siteData.longitude || "",
          geofence_range: siteData.geofence_range || "",
          address: siteData.address || "",
          state: siteData.state || "",
          city: siteData.city || "",
          district: siteData.district || "",
          zone_id: siteData.zone_id || ""
        }
      };

      console.log('Updating site with URL:', url);
      console.log('Payload:', payload);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Update site response:', result);

      if (response.ok) {
        toast.success('Site updated successfully');
        return { 
          success: true, 
          data: result.data || result,
          message: result.message || 'Site updated successfully'
        };
      } else {
        const errorMessage = result.message || result.error || 'Failed to update site';
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Error updating site:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update site';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  async getSites(): Promise<SiteData[]> {
    try {
      const token = API_CONFIG.TOKEN;
      if (!token) {
        toast.error('Authentication token missing');
        return [];
      }

      const url = this.getFullUrl('/pms/sites.json?all_sites=true');
      console.log('Fetching sites from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      const result = await response.json();
      console.log('Get sites response:', result);

      if (response.ok) {
        // Handle different response formats
        if (Array.isArray(result)) {
          return result;
        } else if (result.sites && Array.isArray(result.sites)) {
          return result.sites;
        } else if (result.data && Array.isArray(result.data)) {
          return result.data;
        } else {
          console.log('Unexpected sites response format:', result);
          return [];
        }
      } else {
        const errorMessage = result.message || result.error || 'Failed to fetch sites';
        toast.error(errorMessage);
        return [];
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sites';
      toast.error(errorMessage);
      return [];
    }
  }

  async getSiteById(siteId: number): Promise<SiteData | null> {
    try {
      const token = API_CONFIG.TOKEN;
      if (!token) {
        toast.error('Authentication token missing');
        return null;
      }

      const url = this.getFullUrl(`/pms/sites/${siteId}.json`);
      console.log('Fetching site by ID from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      const result = await response.json();
      console.log('Get site by ID response:', result);

      if (response.ok) {
        return result.data || result;
      } else {
        const errorMessage = result.message || result.error || 'Failed to fetch site';
        toast.error(errorMessage);
        return null;
      }
    } catch (error) {
      console.error('Error fetching site:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch site';
      toast.error(errorMessage);
      return null;
    }
  }

  async getCompanies(): Promise<CompanyOption[]> {
    try {
      const token = API_CONFIG.TOKEN;
      if (!token) {
        toast.error('Authentication token missing');
        return [];
      }

      const url = this.getFullUrl('/pms/company_setups/company_index.json');
      console.log('Fetching companies from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      const result = await response.json();
      console.log('Get companies response:', result);

      if (response.ok) {
        if (result && result.code === 200 && Array.isArray(result.data)) {
          return result.data;
        } else if (result && Array.isArray(result.companies)) {
          return result.companies;
        } else if (Array.isArray(result)) {
          return result;
        } else {
          return [];
        }
      } else {
        const errorMessage = result.message || result.error || 'Failed to fetch companies';
        toast.error(errorMessage);
        return [];
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch companies';
      toast.error(errorMessage);
      return [];
    }
  }

  async getHeadquarters(): Promise<HeadquarterOption[]> {
    try {
      const token = API_CONFIG.TOKEN;
      if (!token) {
        toast.error('Authentication token missing');
        return [];
      }

      const url = this.getFullUrl('/headquarters.json');
      console.log('Fetching headquarters from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      const result = await response.json();
      console.log('Get headquarters response:', result);

      if (response.ok) {
        if (Array.isArray(result)) {
          return result;
        } else if (result && result.headquarters && Array.isArray(result.headquarters)) {
          return result.headquarters;
        } else if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        } else {
          return [];
        }
      } else {
        const errorMessage = result.message || result.error || 'Failed to fetch headquarters';
        toast.error(errorMessage);
        return [];
      }
    } catch (error) {
      console.error('Error fetching headquarters:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch headquarters';
      toast.error(errorMessage);
      return [];
    }
  }

  async getRegions(): Promise<RegionOption[]> {
    try {
      const token = API_CONFIG.TOKEN;
      if (!token) {
        toast.error('Authentication token missing');
        return [];
      }

      const url = this.getFullUrl('/pms/regions.json');
      console.log('Fetching regions from URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
      });

      const result = await response.json();
      console.log('Get regions response:', result);

      if (response.ok) {
        if (Array.isArray(result)) {
          return result;
        } else if (result && result.regions && Array.isArray(result.regions)) {
          return result.regions;
        } else if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        } else {
          return [];
        }
      } else {
        const errorMessage = result.message || result.error || 'Failed to fetch regions';
        toast.error(errorMessage);
        return [];
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch regions';
      toast.error(errorMessage);
      return [];
    }
  }
}

export const siteService = new SiteService();
