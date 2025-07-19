// Asset form schema configuration
export interface FormField {
  group_name: string;
  field_name: string;
  field_label: string;
  input_type: 'text' | 'number' | 'dropdown' | 'date' | 'textarea' | 'checkbox';
  options?: string[];
  required?: boolean;
}

export interface FormGroup {
  group_name: string;
  group_label: string;
  fields: FormField[];
}

// Master list of pms_asset fields (fields that go directly into pms_asset object)
export const PMS_ASSET_FIELDS = [
  'name', 'pms_site_id', 'pms_building_id', 'pms_wing_id', 'pms_area_id', 'pms_floor_id', 'pms_room_id',
  'loaned_from_vendor_id', 'status', 'warranty_period', 'agreement_from_date', 'agreement_to_date',
  'asset_number', 'model_number', 'serial_number', 'manufacturer', 'commisioning_date',
  'pms_asset_sub_group_id', 'pms_asset_group_id', 'pms_supplier_id', 'salvage_value',
  'depreciation_rate', 'depreciation_method', 'it_asset', 'it_meter', 'meter_tag_type',
  'parent_meter_id', 'breakdown', 'critical', 'is_meter', 'asset_loaned', 'depreciation_applicable',
  'useful_life', 'purchase_cost', 'purchased_on', 'warranty', 'depreciation_applicable_for',
  'indiv_group', 'warranty_expiry', 'allocation_type', 'asset_ids', 'group_id', 'sub_group_id'
];

// Default asset form schema
export const DEFAULT_ASSET_SCHEMA: FormGroup[] = [
  {
    group_name: 'basic_identification',
    group_label: 'Basic Identification',
    fields: [
      {
        group_name: 'basic_identification',
        field_name: 'asset_number',
        field_label: 'Asset Number',
        input_type: 'text',
        required: true
      },
      {
        group_name: 'basic_identification',
        field_name: 'name',
        field_label: 'Asset Name',
        input_type: 'text',
        required: true
      },
      {
        group_name: 'basic_identification',
        field_name: 'model_number',
        field_label: 'Model Number',
        input_type: 'text'
      },
      {
        group_name: 'basic_identification',
        field_name: 'serial_number',
        field_label: 'Serial Number',
        input_type: 'text'
      },
      {
        group_name: 'basic_identification',
        field_name: 'manufacturer',
        field_label: 'Manufacturer',
        input_type: 'text'
      }
    ]
  },
  {
    group_name: 'location_and_ownership',
    group_label: 'Location and Ownership',
    fields: [
      {
        group_name: 'location_and_ownership',
        field_name: 'pms_site_id',
        field_label: 'Site',
        input_type: 'dropdown',
        required: true
      },
      {
        group_name: 'location_and_ownership',
        field_name: 'pms_building_id',
        field_label: 'Building',
        input_type: 'dropdown'
      },
      {
        group_name: 'location_and_ownership',
        field_name: 'pms_wing_id',
        field_label: 'Wing',
        input_type: 'dropdown'
      },
      {
        group_name: 'location_and_ownership',
        field_name: 'pms_area_id',
        field_label: 'Area',
        input_type: 'dropdown'
      },
      {
        group_name: 'location_and_ownership',
        field_name: 'pms_floor_id',
        field_label: 'Floor',
        input_type: 'dropdown'
      },
      {
        group_name: 'location_and_ownership',
        field_name: 'pms_room_id',
        field_label: 'Room',
        input_type: 'dropdown'
      }
    ]
  },
  {
    group_name: 'financial_details',
    group_label: 'Financial Details',
    fields: [
      {
        group_name: 'financial_details',
        field_name: 'purchase_cost',
        field_label: 'Purchase Cost',
        input_type: 'number'
      },
      {
        group_name: 'financial_details',
        field_name: 'purchased_on',
        field_label: 'Purchase Date',
        input_type: 'date'
      },
      {
        group_name: 'financial_details',
        field_name: 'salvage_value',
        field_label: 'Salvage Value',
        input_type: 'number'
      },
      {
        group_name: 'financial_details',
        field_name: 'depreciation_rate',
        field_label: 'Depreciation Rate',
        input_type: 'number'
      },
      {
        group_name: 'financial_details',
        field_name: 'depreciation_method',
        field_label: 'Depreciation Method',
        input_type: 'dropdown',
        options: ['Straight Line', 'Declining Balance', 'Units of Production']
      }
    ]
  },
  {
    group_name: 'operational_details',
    group_label: 'Operational Details',
    fields: [
      {
        group_name: 'operational_details',
        field_name: 'status',
        field_label: 'Status',
        input_type: 'dropdown',
        options: ['in_use', 'maintenance', 'retired', 'disposed'],
        required: true
      },
      {
        group_name: 'operational_details',
        field_name: 'commisioning_date',
        field_label: 'Commissioning Date',
        input_type: 'date'
      },
      {
        group_name: 'operational_details',
        field_name: 'useful_life',
        field_label: 'Useful Life',
        input_type: 'text'
      },
      {
        group_name: 'operational_details',
        field_name: 'critical',
        field_label: 'Critical Asset',
        input_type: 'checkbox'
      },
      {
        group_name: 'operational_details',
        field_name: 'breakdown',
        field_label: 'Breakdown Maintenance',
        input_type: 'checkbox'
      }
    ]
  }
];

// Land asset specific schema
export const LAND_ASSET_SCHEMA: FormGroup[] = [
  {
    group_name: 'basic_identification',
    group_label: 'Basic Identification',
    fields: [
      {
        group_name: 'basic_identification',
        field_name: 'asset_number',
        field_label: 'Asset Number',
        input_type: 'text',
        required: true
      },
      {
        group_name: 'basic_identification',
        field_name: 'name',
        field_label: 'Land Name',
        input_type: 'text',
        required: true
      },
      {
        group_name: 'basic_identification',
        field_name: 'land_type',
        field_label: 'Land Type',
        input_type: 'dropdown',
        options: ['Raw land', 'Improved land']
      }
    ]
  },
  {
    group_name: 'location_and_ownership',
    group_label: 'Location and Ownership',
    fields: [
      {
        group_name: 'location_and_ownership',
        field_name: 'location',
        field_label: 'Location',
        input_type: 'text'
      },
      {
        group_name: 'location_and_ownership',
        field_name: 'ownership_type',
        field_label: 'Ownership Type',
        input_type: 'dropdown',
        options: ['Owned', 'Leased', 'Rented']
      }
    ]
  },
  {
    group_name: 'land_size_and_value',
    group_label: 'Land Size and Value',
    fields: [
      {
        group_name: 'land_size_and_value',
        field_name: 'area',
        field_label: 'Area',
        input_type: 'text'
      },
      {
        group_name: 'land_size_and_value',
        field_name: 'current_market_value',
        field_label: 'Current Market Value',
        input_type: 'number'
      }
    ]
  }
];

// Function to get schema based on asset type
export const getAssetFormSchema = (assetType: string): FormGroup[] => {
  switch (assetType.toLowerCase()) {
    case 'land':
      return LAND_ASSET_SCHEMA;
    default:
      return DEFAULT_ASSET_SCHEMA;
  }
};