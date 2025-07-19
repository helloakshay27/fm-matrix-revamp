import { CreateAssetPayload } from '@/services/assetAPI';

interface BasicAssetData {
  name: string;
  category: string;
  asset_type: string;
  asset_no: string;
  model_no: string;
  serial_no: string;
  purchase_cost: string;
  purchased_on?: string;
  manufacturer?: string;
  status?: string;
  critical?: boolean;
  warranty?: string;
  warranty_expiry?: string;
  // Add other basic fields as needed
}

interface LocationData {
  site: string;
  building: string;
  wing: string;
  area: string;
  floor: string;
  room: string;
}

interface ExtraField {
  field_name: string;
  field_value: string;
  group_name: string;
  category_name: string;
  field_type: string;
}

export const mapFormDataToAPIPayload = (
  basicData: BasicAssetData,
  locationData: LocationData,
  extraFields: ExtraField[]
): CreateAssetPayload => {
  
  // Map extra fields to API format
  const extra_fields_attributes = extraFields.map(field => ({
    field_name: field.field_name,
    field_value: field.field_value,
    group_name: field.group_name.toLowerCase().replace(/ /g, '_'),
    field_description: field.group_name,
    _destroy: false
  }));

  const payload: CreateAssetPayload = {
    pms_asset: {
      name: basicData.name,
      pms_site_id: locationData.site,
      pms_building_id: locationData.building,
      pms_wing_id: locationData.wing,
      pms_area_id: locationData.area,
      pms_floor_id: locationData.floor,
      pms_room_id: locationData.room,
      status: basicData.status || 'in_use',
      asset_number: basicData.asset_no,
      model_number: basicData.model_no,
      serial_number: basicData.serial_no,
      manufacturer: basicData.manufacturer || '',
      purchase_cost: basicData.purchase_cost,
      purchased_on: basicData.purchased_on || '',
      warranty: basicData.warranty || 'No',
      warranty_expiry: basicData.warranty_expiry || '',
      critical: basicData.critical || false,
      breakdown: false,
      it_asset: basicData.category === 'IT Assets',
      it_meter: false,
      is_meter: false,
      asset_loaned: false,
      depreciation_applicable: true,
      useful_life: '10 years',
      depreciation_method: 'Straight Line',
      depreciation_rate: '10',
      indiv_group: 'individual',
      allocation_type: 'department',
      // Default values - these can be made configurable
      warranty_period: '12 months',
      salvage_value: '0',
      depreciation_applicable_for: 'Asset',
      meter_tag_type: '',
      asset_ids: [],
      consumption_pms_asset_measures_attributes: [],
      non_consumption_pms_asset_measures_attributes: []
    },
    extra_fields_attributes,
    allocation_ids: [],
    asset_manuals: [],
    asset_insurances: [],
    asset_purchases: [],
    asset_other_uploads: []
  };

  return payload;
};

// Utility function to validate required fields
export const validateAssetData = (basicData: BasicAssetData): string[] => {
  const errors: string[] = [];
  
  if (!basicData.name) errors.push('Asset name is required');
  if (!basicData.asset_no) errors.push('Asset number is required');
  if (!basicData.purchase_cost) errors.push('Purchase cost is required');
  if (!basicData.category) errors.push('Category is required');
  
  return errors;
};

// Utility function to format currency
export const formatCurrency = (value: string): string => {
  const numValue = parseFloat(value);
  return isNaN(numValue) ? '0' : numValue.toString();
};

// Utility function to format date
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
};