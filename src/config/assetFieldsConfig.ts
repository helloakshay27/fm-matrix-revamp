export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface SectionConfig {
  title: string;
  fields: FieldConfig[];
}

export interface CategoryConfig {
  [category: string]: SectionConfig[];
}

export const assetFieldsConfig: CategoryConfig = {
  Land: [
    {
      title: "Basic Identification",
      fields: [
        {
          name: "land_type",
          label: "Land Type",
          type: "select",
          required: true,
          options: [
            { value: "agricultural", label: "Agricultural" },
            { value: "commercial", label: "Commercial" },
            { value: "residential", label: "Residential" },
            { value: "industrial", label: "Industrial" }
          ]
        }
      ]
    },
    {
      title: "Location & Ownership",
      fields: [
        {
          name: "location",
          label: "Location",
          type: "text",
          required: true
        },
        {
          name: "ownership_type",
          label: "Ownership Type",
          type: "select",
          options: [
            { value: "owned", label: "Owned" },
            { value: "leased", label: "Leased" },
            { value: "rented", label: "Rented" }
          ]
        },
        {
          name: "legal_document_reference_number",
          label: "Legal Document Reference Number",
          type: "text"
        },
        {
          name: "zoning_classification",
          label: "Zoning Classification",
          type: "text"
        },
        {
          name: "encumbrance_status",
          label: "Encumbrance Status",
          type: "select",
          options: [
            { value: "clear", label: "Clear" },
            { value: "encumbered", label: "Encumbered" }
          ]
        }
      ]
    },
    {
      title: "Land Size and Value",
      fields: [
        {
          name: "area",
          label: "Area (sq ft)",
          type: "number",
          required: true
        },
        {
          name: "date_of_acquisition",
          label: "Date of Acquisition",
          type: "date"
        },
        {
          name: "acquisition_cost",
          label: "Acquisition Cost",
          type: "number"
        },
        {
          name: "current_market_value",
          label: "Current Market Value",
          type: "number"
        }
      ]
    },
    {
      title: "Land Usage and Development",
      fields: [
        {
          name: "purpose",
          label: "Purpose",
          type: "textarea"
        },
        {
          name: "land_improvements",
          label: "Land Improvements",
          type: "textarea"
        },
        {
          name: "responsible_department",
          label: "Responsible Department",
          type: "text"
        }
      ]
    }
  ],
  Building: [
    {
      title: "Basic Identification",
      fields: [
        {
          name: "building_type",
          label: "Building Type",
          type: "select",
          required: true,
          options: [
            { value: "office", label: "Office" },
            { value: "warehouse", label: "Warehouse" },
            { value: "residential", label: "Residential" },
            { value: "commercial", label: "Commercial" },
            { value: "industrial", label: "Industrial" }
          ]
        }
      ]
    },
    {
      title: "Location & Ownership",
      fields: [
        {
          name: "location",
          label: "Location",
          type: "text",
          required: true
        },
        {
          name: "ownership_type",
          label: "Ownership Type",
          type: "select",
          options: [
            { value: "owned", label: "Owned" },
            { value: "leased", label: "Leased" },
            { value: "rented", label: "Rented" }
          ]
        },
        {
          name: "linked_land_asset",
          label: "Linked Land Asset",
          type: "text"
        }
      ]
    },
    {
      title: "Construction Details",
      fields: [
        {
          name: "construction_type",
          label: "Construction Type",
          type: "select",
          options: [
            { value: "rcc", label: "RCC" },
            { value: "steel", label: "Steel" },
            { value: "brick", label: "Brick" },
            { value: "prefab", label: "Prefab" }
          ]
        },
        {
          name: "no_of_floors",
          label: "Number of Floors",
          type: "number"
        },
        {
          name: "built_up_area",
          label: "Built-up Area (sq ft)",
          type: "number",
          required: true
        },
        {
          name: "date_of_construction",
          label: "Date of Construction",
          type: "date"
        }
      ]
    },
    {
      title: "Acquisition and Value",
      fields: [
        {
          name: "acquisition_date",
          label: "Acquisition Date",
          type: "date"
        },
        {
          name: "acquisition_cost",
          label: "Acquisition Cost",
          type: "number"
        },
        {
          name: "current_book_value",
          label: "Current Book Value",
          type: "number"
        },
        {
          name: "current_market_value",
          label: "Current Market Value",
          type: "number"
        }
      ]
    },
    {
      title: "Usage & Compliance",
      fields: [
        {
          name: "building_use",
          label: "Building Use",
          type: "text"
        },
        {
          name: "fire_safety_certification",
          label: "Fire Safety Certification",
          type: "text"
        },
        {
          name: "occupancy_certificate_no",
          label: "Occupancy Certificate No.",
          type: "text"
        },
        {
          name: "structural_safety_certificate",
          label: "Structural Safety Certificate",
          type: "text"
        },
        {
          name: "utility_connections",
          label: "Utility Connections",
          type: "textarea"
        }
      ]
    },
    {
      title: "Maintenance & Linkages",
      fields: [
        {
          name: "maintenance_responsibility",
          label: "Maintenance Responsibility",
          type: "text"
        },
        {
          name: "amc_ppm_linked",
          label: "AMC/PPM Linked",
          type: "select",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        }
      ]
    }
  ],
  "Leasehold Improvement": [
    {
      title: "Basic Identification",
      fields: [
        {
          name: "improvement_description",
          label: "Improvement Description",
          type: "textarea",
          required: true
        }
      ]
    },
    {
      title: "Location & Association",
      fields: [
        {
          name: "location_site",
          label: "Location Site",
          type: "text",
          required: true
        },
        {
          name: "leased_property_id",
          label: "Leased Property ID",
          type: "text"
        },
        {
          name: "ownership_type",
          label: "Ownership Type",
          type: "select",
          options: [
            { value: "leased", label: "Leased" },
            { value: "rented", label: "Rented" }
          ]
        }
      ]
    },
    {
      title: "Improvement Details",
      fields: [
        {
          name: "type_of_improvement",
          label: "Type of Improvement",
          type: "select",
          options: [
            { value: "interior", label: "Interior" },
            { value: "exterior", label: "Exterior" },
            { value: "structural", label: "Structural" },
            { value: "electrical", label: "Electrical" },
            { value: "plumbing", label: "Plumbing" }
          ]
        },
        {
          name: "vendor_name",
          label: "Vendor Name",
          type: "text"
        },
        {
          name: "invoice_number",
          label: "Invoice Number",
          type: "text"
        },
        {
          name: "date_of_improvement",
          label: "Date of Improvement",
          type: "date"
        }
      ]
    },
    {
      title: "Lease & Maintenance Linkages",
      fields: [
        {
          name: "lease_start_date",
          label: "Lease Start Date",
          type: "date"
        },
        {
          name: "lease_end_date",
          label: "Lease End Date",
          type: "date"
        },
        {
          name: "amc_ppm_linked",
          label: "AMC/PPM Linked",
          type: "select",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        }
      ]
    }
  ],
  Vehicle: [
    {
      title: "Basic Identification",
      fields: [
        {
          name: "vehicle_type",
          label: "Vehicle Type",
          type: "select",
          required: true,
          options: [
            { value: "car", label: "Car" },
            { value: "truck", label: "Truck" },
            { value: "van", label: "Van" },
            { value: "motorcycle", label: "Motorcycle" },
            { value: "bus", label: "Bus" }
          ]
        },
        {
          name: "make_model",
          label: "Make & Model",
          type: "text",
          required: true
        },
        {
          name: "registration_number",
          label: "Registration Number",
          type: "text",
          required: true
        }
      ]
    },
    {
      title: "Technical Specifications",
      fields: [
        {
          name: "chassis_number",
          label: "Chassis Number",
          type: "text"
        },
        {
          name: "engine_number",
          label: "Engine Number",
          type: "text"
        },
        {
          name: "fuel_type",
          label: "Fuel Type",
          type: "select",
          options: [
            { value: "petrol", label: "Petrol" },
            { value: "diesel", label: "Diesel" },
            { value: "electric", label: "Electric" },
            { value: "hybrid", label: "Hybrid" },
            { value: "cng", label: "CNG" }
          ]
        }
      ]
    },
    {
      title: "Ownership & Usage",
      fields: [
        {
          name: "ownership_type",
          label: "Ownership Type",
          type: "select",
          options: [
            { value: "owned", label: "Owned" },
            { value: "leased", label: "Leased" },
            { value: "rented", label: "Rented" }
          ]
        },
        {
          name: "assigned_to",
          label: "Assigned To",
          type: "text"
        },
        {
          name: "usage_type",
          label: "Usage Type",
          type: "select",
          options: [
            { value: "official", label: "Official" },
            { value: "personal", label: "Personal" },
            { value: "commercial", label: "Commercial" }
          ]
        },
        {
          name: "permit_type",
          label: "Permit Type",
          type: "text"
        }
      ]
    },
    {
      title: "Performance Tracking",
      fields: [
        {
          name: "odometer_reading",
          label: "Odometer Reading",
          type: "number"
        },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          options: [
            { value: "km", label: "KM" },
            { value: "miles", label: "Miles" }
          ]
        },
        {
          name: "service_schedule_ppm",
          label: "Service Schedule (PPM)",
          type: "text"
        },
        {
          name: "last_service_date",
          label: "Last Service Date",
          type: "date"
        },
        {
          name: "amc_linked",
          label: "AMC Linked",
          type: "select",
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        }
      ]
    },
    {
      title: "Legal & Compliance",
      fields: [
        {
          name: "insurance_provider",
          label: "Insurance Provider",
          type: "text"
        },
        {
          name: "insurance_policy_no",
          label: "Insurance Policy No.",
          type: "text"
        },
        {
          name: "insurance_expiry_date",
          label: "Insurance Expiry Date",
          type: "date"
        },
        {
          name: "fitness_certificate_expiry",
          label: "Fitness Certificate Expiry",
          type: "date"
        },
        {
          name: "puc_expiry_date",
          label: "PUC Expiry Date",
          type: "date"
        }
      ]
    }
  ]
};