import React, { useState, useEffect } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, Plus, MapPin, Package, Shield, Activity, TrendingUp, BarChart, Paperclip, Zap, Sun, Droplet, Recycle, BarChart3, Plug, Frown, Wind, Percent, Users, Settings, ArrowLeft, Layers, FileText, Building2, Ruler, Construction, Archive, Calendar, DollarSign, CheckCircle, Wrench, Car, Cog, Users2, TrendingUp as Performance, ShieldCheck, Edit3, Check } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Autocomplete, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AddCustomFieldModal } from '@/components/AddCustomFieldModal';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocationData } from '@/hooks/useLocationData';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import apiClient from '@/utils/apiClient';
import { MeterMeasureFields } from '@/components/asset/MeterMeasureFields';
import { FormatShapes } from '@mui/icons-material';
import { toast } from 'sonner';

// Image compression function
const compressImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

// Asset Image Upload Component
const AssetImageUpload = ({ categoryName, categoryKey, onImageUpload, onImageRemove, images = [] }: {
  categoryName: string;
  categoryKey: string;
  onImageUpload: (key: string, files: FileList | null) => void;
  onImageRemove: (key: string, index: number) => void;
  images: File[];
}) => {
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0]; // Only allow one image per asset
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File Type', {
        description: 'Please upload only image files (JPG, PNG, GIF, etc.)',
      });
      return;
    }
    
    // Check file size
    if (file.size > maxFileSize) {
      toast.error('File Too Large', {
        description: 'Image size should be less than 10MB',
      });
      return;
    }
    
    try {
      // Compress image if needed
      const compressedFile = await compressImage(file, 1200, 0.8);
      // Create a FileList-like object with the compressed file
      const fileList = Object.assign([compressedFile], {
        item: (index: number) => index === 0 ? compressedFile : null,
        length: 1
      }) as unknown as FileList;
      onImageUpload(categoryKey, fileList);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Processing Error', {
        description: 'Error processing image. Please try again.',
      });
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="border-l-4 border-l-[#C72030] p-4 bg-white">
        <div className="flex items-center gap-2 text-[#C72030] text-sm font-semibold mb-4">
          <span className="bg-[#C72030] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            <Package className="w-3 h-3" />
          </span>
          {categoryName.toUpperCase()} ASSET IMAGE
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {images.length > 0 ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img 
                  src={URL.createObjectURL(images[0])} 
                  alt="Asset preview" 
                  className="max-w-full h-48 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => onImageRemove(categoryKey, 0)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium">{images[0].name}</p>
                <p className="text-xs text-gray-500">
                  {(images[0].size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id={`${categoryKey}-image-replace`}
                />
                <label
                  htmlFor={`${categoryKey}-image-replace`}
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 cursor-pointer transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Replace Image
                </label>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id={`${categoryKey}-image-upload`}
              />
              <label htmlFor={`${categoryKey}-image-upload`} className="cursor-pointer">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 mb-2">Upload Asset Image</p>
                <p className="text-sm text-gray-500 mb-4">
                  Click to upload an image of your {categoryName.toLowerCase()}
                </p>
                <div className="inline-flex items-center gap-2 bg-[#f6f4ee] text-[#C72030] px-6 py-3 rounded-md hover:bg-[#f0ebe0] transition-colors">
                  <Package className="w-5 h-5" />
                  Choose Image
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Supported formats: JPG, PNG, GIF (Max 10MB)
                </p>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddAssetPage = () => {
  const navigate = useNavigate();

  // Location data hook
  const {
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loading,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms
  } = useLocationData();

  const [expandedSections, setExpandedSections] = useState({
    location: true,
    asset: true,
    warranty: true,
    meterCategory: true,
    consumption: true,
    nonConsumption: true,
    assetAllocation: true,
    assetLoaned: true,
    amcDetails: true,
    attachments: true
  });

  // Location state
  const [selectedLocation, setSelectedLocation] = useState({
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: ''
  });

  // ...existing code...
  const sectionGroupMap = {
    // Land
    basicIdentification: { group_name: "Basic Identification", category_name: "Land" },
    locationOwnership: { group_name: "Location & Ownership", category_name: "Land" },
    landSizeValue: { group_name: "Land Size & Value", category_name: "Land" },
    landUsageDevelopment: { group_name: "Land Usage & Development", category_name: "Land" },
    miscellaneous: { group_name: "Miscellaneous", category_name: "Land" },
    // Leasehold Improvement
    leaseholdBasicId: { group_name: "Basic Identification", category_name: "Leasehold Improvement" },
    leaseholdLocationAssoc: { group_name: "Location & Association", category_name: "Leasehold Improvement" },
    improvementDetails: { group_name: "Improvement Details", category_name: "Leasehold Improvement" },
    leaseholdFinancial: { group_name: "Financial & Depreciation", category_name: "Leasehold Improvement" },
    leaseholdLease: { group_name: "Lease & Maintenance Linkages", category_name: "Leasehold Improvement" },
    leaseholdOversight: { group_name: "Oversight & Documentation", category_name: "Leasehold Improvement" },
    // Vehicle
    vehicleBasicId: { group_name: "Basic Identification", category_name: "Vehicle" },
    vehicleTechnicalSpecs: { group_name: "Technical Specifications", category_name: "Vehicle" },
    vehicleOwnership: { group_name: "Ownership & Usage", category_name: "Vehicle" },
    vehicleFinancial: { group_name: "Financial & Depreciation", category_name: "Vehicle" },
    vehiclePerformance: { group_name: "Performance Tracking", category_name: "Vehicle" },
    vehicleLegal: { group_name: "Legal & Compliance", category_name: "Vehicle" },
    vehicleMiscellaneous: { group_name: "Miscellaneous", category_name: "Vehicle" },
    // Building
    buildingBasicId: { group_name: "Basic Identification", category_name: "Building" },
    buildingLocation: { group_name: "Location & Ownership", category_name: "Building" },
    buildingConstruction: { group_name: "Construction Details", category_name: "Building" },
    buildingAcquisition: { group_name: "Acquisition & Value", category_name: "Building" },
    buildingUsage: { group_name: "Usage & Compliance", category_name: "Building" },
    buildingMaintenance: { group_name: "Maintenance & Linkages", category_name: "Building" },
    buildingMiscellaneous: { group_name: "Miscellaneous", category_name: "Building" },
  };
  // ...existing code...

  // Group and Subgroup state
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [subgroupsLoading, setSubgroupsLoading] = useState(false);
  const [parentMeters, setParentMeters] = useState<{ id: number, name: string }[]>([]);
  const [parentMeterLoading, setParentMeterLoading] = useState(false);
  const [selectedParentMeterId, setSelectedParentMeterId] = useState<string>('');

  // Vendors state
  const [vendors, setVendors] = useState<{ id: number, name: string }[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [selectedAmcVendorId, setSelectedAmcVendorId] = useState<string>('');
  const [selectedLoanedVendorId, setSelectedLoanedVendorId] = useState<string>('');

  // Departments and Users state
  const [departments, setDepartments] = useState<{ id: number, department_name: string }[]>([]);
  const [users, setUsers] = useState<{ id: number, full_name: string }[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  // const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  // const [selectedUserId, setSelectedUserId] = useState<string>('');

  const [itAssetsToggle, setItAssetsToggle] = useState(false);
  const [meterDetailsToggle, setMeterDetailsToggle] = useState(false);
  const [assetLoanedToggle, setAssetLoanedToggle] = useState(false);
  const [depreciationToggle, setDepreciationToggle] = useState(false);
  const [meterCategoryType, setMeterCategoryType] = useState('');
  const [subCategoryType, setSubCategoryType] = useState('');
  const [meterType, setMeterType] = useState('');
  const [criticalStatus, setCriticalStatus] = useState('');
  const [showBoardRatioOptions, setShowBoardRatioOptions] = useState(false);
  const [showRenewableOptions, setShowRenewableOptions] = useState(false);
  const [allocationBasedOn, setAllocationBasedOn] = useState('department');
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [itAssetsCustomFieldModalOpen, setItAssetsCustomFieldModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [underWarranty, setUnderWarranty] = useState('');

  const [hardDiskHeading, setHardDiskHeading] = useState(() => {
    return localStorage.getItem('hardDiskHeading') || 'HARDWARE DETAILS';
  });
  interface ExtraFormField {
    value: string;
    fieldType: string;
    groupType: string;
    fieldDescription: string;
  }
  const [extraFormFields, setExtraFormFields] = useState<Record<string, ExtraFormField>>({});
  const [isEditingHardDiskHeading, setIsEditingHardDiskHeading] = useState(false);
  const [editingHardDiskHeadingText, setEditingHardDiskHeadingText] = useState(() => {
    return localStorage.getItem('hardDiskHeading') || 'HARDWARE DETAILS';
  });
  console.log('Hard Disk Heading:', extraFormFields);
  const [formData, setFormData] = useState({
    name: '',
    asset_number: '',
    model_number: '',
    serial_number: '',
    manufacturer: '',
    status: 'in_use',
    critical: false,
    breakdown: false,
    pms_site_id: '',
    pms_building_id: '',
    pms_wing_id: '',
    pms_area_id: '',
    pms_floor_id: '',
    pms_room_id: '',
    loaned_from_vendor_id: '',
    agreement_from_date: '',
    agreement_to_date: '',
    commisioning_date: '',
    pms_asset_group_id: '',
    pms_asset_sub_group_id: '',
    pms_supplier_id: '',
    salvage_value: '',
    depreciation_rate: '',
    depreciation_method: '',
    it_asset: false,
    it_meter: false,
    meter_tag_type: '',
    parent_meter_id: '',
    is_meter: false,
    asset_loaned: false,
    depreciation_applicable: false,
    useful_life: '',
    purchase_cost: '',
    purchased_on: '',
    warranty: '',
    warranty_period: '',
    warranty_expiry: '',
    depreciation_applicable_for: '',
    indiv_group: '',
    allocation_type: 'department',
    asset_ids: [],
    group_id: '',
    sub_group_id: '',
    consumption_pms_asset_measures_attributes: [],
    non_consumption_pms_asset_measures_attributes: [],
    allocation_ids: [],
    asset_move_to: {
      site_id: '',
      building_id: '',
      wing_id: '',
      area_id: '',
      floor_id: '',
      room_id: ''
    },
    amc_detail: {
      supplier_id: '',
      amc_start_date: '',
      amc_end_date: '',
      amc_first_service: '',
      payment_term: '',
      no_of_visits: '',
      amc_cost: ''
    },
    asset_manuals: [],
    asset_insurances: [],
    asset_purchases: [],
    asset_other_uploads: [],
    extra_fields_attributes: [],
    custom_fields: {
      system_details: {},
      hardware: {}
    }
  });

  const [itAssetDetails, setItAssetDetails] = useState({
    system_details: {
      os: "",
      memory: "",
      processor: "",
    },
    hardware: {
      model: "",
      serial_no: "",
      capacity: "",
    },
  });

  const buildCustomFieldsPayload = () => {
    const result: Record<string, Record<string, string>> = {};
    
    // Start with the default IT asset details (system_details and hardware)
    Object.entries(itAssetDetails).forEach(([section, fields]) => {
      result[section] = { ...fields };
    });
    
    // Add any additional custom fields from itAssetsCustomFields
    Object.entries(itAssetsCustomFields).forEach(([section, fields]) => {
      // Map section names to the correct backend structure
      let sectionKey;
      if (section === 'System Details') {
        sectionKey = 'system_details';
      } else if (section === 'Hardware Details') {
        sectionKey = 'hardware';
      } else {
        // Fallback to snake_case conversion
        sectionKey = section.trim().toLowerCase().replace(/\s+/g, '_');
      }
      
      if (!result[sectionKey]) {
        result[sectionKey] = {};
      }
      fields.forEach(field => {
        // Convert field name to snake_case as well
        const fieldKey = field.name.trim().toLowerCase().replace(/\s+/g, '_');
        result[sectionKey][fieldKey] = field.value;
      });
    });
    
    return result;
  };

  // Initialize IT asset details only once on component mount, not on every formData change
  const [itAssetCustomFields, setItAssetCustomFields] = useState([]); // [{name, value, row}]

  // Meter measure fields state
  interface MeterMeasureField {
    id: string;
    name: string;
    unitType: string;
    min: string;
    max: string;
    alertBelowVal: string;
    alertAboveVal: string;
    multiplierFactor: string;
    checkPreviousReading?: boolean;
  }

//   const [attachments, setAttachments] = useState({
//   landAttachments: [],
//   manualsUpload: [],
//   insuranceDetails: [],
//   purchaseInvoice: [],
//   amc: []
// });

// Helper function to compress images
const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

const handleFileUpload = async (category: string, files: FileList | null) => {
  if (!files) return;
  
  const maxFileSize = 10 * 1024 * 1024; // 10MB per file
  const maxTotalSize = 50 * 1024 * 1024; // 50MB total
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
  
  const fileArray = Array.from(files);
  const processedFiles: File[] = [];
  let totalSize = 0;
  
  // Calculate current total size
  Object.values(attachments).forEach(fileList => {
    if (Array.isArray(fileList)) {
      fileList.forEach(file => {
        totalSize += file.size || 0;
      });
    }
  });
  
  // Validate and compress each file
  for (const file of fileArray) {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      toast.error('Unsupported File Format', {
        description: `File "${file.name}" is not supported. Please upload PDF, DOC, DOCX, JPG, JPEG, or PNG files only.`,
      });
      continue;
    }
    
    // Compress image files
    let processedFile = file;
    if (file.type.startsWith('image/')) {
      try {
        processedFile = await compressImage(file);
        console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
      } catch (error) {
        console.warn(`Failed to compress ${file.name}, using original file:`, error);
        processedFile = file;
      }
    }
    
    // Check individual file size (after compression)
    if (processedFile.size > maxFileSize) {
      toast.error('File Too Large', {
        description: `File "${file.name}" is too large (${(processedFile.size / 1024 / 1024).toFixed(2)}MB). Maximum file size is 10MB.`,
      });
      continue;
    }
    
    // Check total size
    if (totalSize + processedFile.size > maxTotalSize) {
      toast.error('Upload Limit Exceeded', {
        description: `Adding "${file.name}" would exceed the total upload limit of 50MB. Please remove some files first.`,
      });
      continue;
    }
    
    totalSize += processedFile.size;
    processedFiles.push(processedFile);
  }
  
  if (processedFiles.length > 0) {
    setAttachments(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), ...processedFiles]
    }));
    
    // Show success message
    if (processedFiles.length === 1) {
      console.log(`Successfully added "${processedFiles[0].name}"`);
    } else {
      console.log(`Successfully added ${processedFiles.length} files`);
    }
  }
};

const removeFile = (category, index) => {
  setAttachments(prev => ({
    ...prev,
    [category]: prev[category].filter((_, i) => i !== index)
  }));
};

  const [meterUnitTypes, setMeterUnitTypes] = useState<Array<{ id: number; unit_name: string }>>([]);
  const [loadingUnitTypes, setLoadingUnitTypes] = useState(false);
  const [consumptionMeasureFields, setConsumptionMeasureFields] = useState<MeterMeasureField[]>([]);
  const [nonConsumptionMeasureFields, setNonConsumptionMeasureFields] = useState<MeterMeasureField[]>([]);
  const [customFields, setCustomFields] = useState({
    // Land sections
    basicIdentification: [],
    locationOwnership: [],
    landSizeValue: [],
    landUsageDevelopment: [],
    miscellaneous: [],
    // Leasehold Improvement sections
    leaseholdBasicId: [],
    leaseholdLocationAssoc: [],
    improvementDetails: [],
    leaseholdFinancial: [],
    leaseholdLease: [],
    leaseholdOversight: [],
    // Vehicle sections
    vehicleBasicId: [],
    vehicleTechnicalSpecs: [],
    vehicleOwnership: [],
    vehicleFinancial: [],
    vehiclePerformance: [],
    vehicleLegal: [],
    vehicleMiscellaneous: [],
    // Building sections
    buildingBasicId: [],
    buildingLocation: [],
    buildingConstruction: [],
    buildingAcquisition: [],
    buildingUsage: [],
    buildingMaintenance: [],
    buildingMiscellaneous: [],
    // General sections
    locationDetails: [],
    purchaseDetails: [],
    depreciationRule: []
  });


  const [itAssetsCustomFields, setItAssetsCustomFields] = useState({
    'System Details': [],
    'Hardware Details': []
  });
  const [consumptionMeasures, setConsumptionMeasures] = useState([{
    id: 1,
    name: '',
    unitType: '',
    min: '',
    max: '',
    alertBelowVal: '',
    alertAboveVal: '',
    multiplierFactor: '',
    checkPreviousReading: false
  }]);
  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([{
    id: 1,
    name: '',
    unitType: '',
    min: '',
    max: '',
    alertBelowVal: '',
    alertAboveVal: '',
    multiplierFactor: '',
    checkPreviousReading: false
  }]);

  console.log('It Assets Custom Fields:', itAssetsCustomFields);

const [attachments, setAttachments] = useState({
  landAttachments: [],           // Land documents  
  vehicleAttachments: [],        // Vehicle documents (RC, insurance, etc.)
  leaseholdAttachments: [],      // Leasehold improvement documents
  buildingAttachments: [],       // Building documents
  furnitureAttachments: [],      // Furniture & Fixtures documents
  itEquipmentAttachments: [],    // IT Equipment documents
  machineryAttachments: [],      // Machinery & Equipment documents
  toolsAttachments: [],          // Tools & Instruments documents
  meterAttachments: [],          // Meter documents
  manualsUpload: [],             // Asset manuals
  insuranceDetails: [],          // Insurance documents
  purchaseInvoice: [],           // Purchase invoices
  amc: [],                       // AMC documents
  // Add asset images for each category
  landAssetImage: [],
  vehicleAssetImage: [],
  leaseholdAssetImage: [],
  buildingAssetImage: [],
  furnitureAssetImage: [],
  itEquipmentAssetImage: [],
  machineryAssetImage: [],
  toolsAssetImage: [],
  meterAssetImage: []
});
  const [selectedAssetCategory, setSelectedAssetCategory] = useState('');

  const handleGoBack = () => {
    navigate('/maintenance/asset');
  };

  // Location change handlers
  const handleLocationChange = async (field, value) => {
    setSelectedLocation(prev => {
      const newLocation = { ...prev, [field]: value };

      // Reset dependent fields when parent changes
      if (field === 'site') {
        newLocation.building = '';
        newLocation.wing = '';
        newLocation.area = '';
        newLocation.floor = '';
        newLocation.room = '';
        if (value) fetchBuildings(parseInt(value));
      } else if (field === 'building') {
        newLocation.wing = '';
        newLocation.area = '';
        newLocation.floor = '';
        newLocation.room = '';
        if (value) fetchWings(parseInt(value));
      } else if (field === 'wing') {
        newLocation.area = '';
        newLocation.floor = '';
        newLocation.room = '';
        if (value) fetchAreas(parseInt(value));
      } else if (field === 'area') {
        newLocation.floor = '';
        newLocation.room = '';
        if (value) fetchFloors(parseInt(value));
      } else if (field === 'floor') {
        newLocation.room = '';
        if (value) fetchRooms(parseInt(value));
      }

      return newLocation;
    });
  };

  // Meter category options matching the images
  const getMeterCategoryOptions = () => [{
    value: 'board',
    label: 'Board',
    icon: BarChart3
  }, {
    value: 'dg',
    label: 'DG',
    icon: Zap
  }, {
    value: 'renewable',
    label: 'Renewable',
    icon: Sun
  }, {
    value: 'fresh-water',
    label: 'Fresh Water',
    icon: Droplet
  }, {
    value: 'recycled',
    label: 'Recycled',
    icon: Recycle
  }, {
    value: 'iex-gdam',
    label: 'IEX-GDAM',
    icon: BarChart
  }];

  // Board Ratio sub-options (second image)
  const getBoardRatioOptions = () => [{
    value: 'ht-panel',
    label: 'HT Panel',
    icon: Plug
  }, {
    value: 'vcb',
    label: 'VCB',
    icon: Activity
  }, {
    value: 'transformer',
    label: 'Transformer',
    icon: Zap
  }, {
    value: 'lt-panel',
    label: 'LT Panel',
    icon: Frown
  }];

  // Renewable energy sub-options
  const getRenewableOptions = () => [{
    value: 'solar',
    label: 'Solar',
    icon: Sun
  }, {
    value: 'bio-methanol',
    label: 'Bio Methanol',
    icon: Droplet
  }, {
    value: 'wind',
    label: 'Wind',
    icon: Wind
  }];

  // Handle meter category change
  const handleMeterCategoryChange = value => {
    setMeterCategoryType(value);
    setSubCategoryType(''); // Reset sub-category when main category changes

    // Show Board Ratio options if Board is selected
    if (value === 'board') {
      setShowBoardRatioOptions(true);
      setShowRenewableOptions(false);
    } else if (value === 'renewable') {
      setShowRenewableOptions(true);
      setShowBoardRatioOptions(false);
    } else {
      setShowBoardRatioOptions(false);
      setShowRenewableOptions(false);
    }
  };

  interface HandleFieldChangeFn {
    (field: keyof typeof formData, value: any): void;
  }

  const handleFieldChange: HandleFieldChangeFn = (field, value) => {
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      const fieldErrorExists = validationErrors.some(error => 
        error.toLowerCase().includes(field.toLowerCase()) ||
        (field === 'name' && error.includes('Asset Name')) ||
        (field === 'model_number' && error.includes('Model No')) ||
        (field === 'manufacturer' && error.includes('Manufacturer'))
      );
      
      if (fieldErrorExists) {
        setValidationErrors(prev => prev.filter(error => 
          !error.toLowerCase().includes(field.toLowerCase()) &&
          !(field === 'name' && error.includes('Asset Name')) &&
          !(field === 'model_number' && error.includes('Model No')) &&
          !(field === 'manufacturer' && error.includes('Manufacturer'))
        ));
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log(`Field changed: ${field} = ${value}`);
  };
  console.log('Form data updatedyyyyyyyyyy:', formData);

  // --- For nested fields like asset_move_to, amc_detail ---
  const handleNestedFieldChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // --- For array fields like asset_ids, allocation_ids ---
  const handleArrayFieldChange = (field, valueArray) => {
    setFormData(prev => ({
      ...prev,
      [field]: valueArray
    }));
  };

  // --- For IT Asset details (system_details and hardware) ---
  const handleItAssetDetailsChange = (section, field, value) => {
    setItAssetDetails(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  console.log(customFields)
  const buildExtraFieldsAttributes = () => {
    let extraFields = [];
    console.log('Building extra fields attributes...', customFields);
    
    // Custom fields
    Object.keys(customFields).forEach(sectionKey => {
      customFields[sectionKey].forEach(field => {
        extraFields.push({
          field_name: field.name,
          field_value: field.value,
          group_name: sectionKey,
          field_description: field.name,
          _destroy: false
        });
      });
    });

    // IT Assets custom fields
    Object.keys(itAssetsCustomFields).forEach(sectionKey => {
      itAssetsCustomFields[sectionKey].forEach(field => {
        extraFields.push({
          field_name: field.name,
          field_value: field.value,
          group_name: sectionKey,
          field_description: field.name,
          _destroy: false
        });
      });
    });

    // Standard extra fields (dynamic)
    Object.entries(extraFormFields).forEach(([key, fieldObj]) => {
      if (fieldObj?.value !== undefined && fieldObj?.value !== '' && fieldObj?.value !== null) {
        // Convert date objects to ISO string
        let processedValue = fieldObj.value;
        if (fieldObj.value && (fieldObj.value as any) instanceof Date) {
          processedValue = ((fieldObj.value as unknown) as Date).toISOString();
        }
        
        extraFields.push({
          field_name: key,
          field_value: processedValue,
          group_name: fieldObj.groupType,
          field_description: fieldObj.fieldDescription,
          _destroy: false
        });
      }
    });

    return extraFields;
  };


  const handleItAssetsToggleChange = checked => {
    setItAssetsToggle(checked);
    setExpandedSections(prev => ({
      ...prev,
      warranty: checked
    }));
  };
  const handleMeterDetailsToggleChange = checked => {
    setMeterDetailsToggle(checked);
    setExpandedSections(prev => ({
      ...prev,
      meterCategory: checked
    }));
  };
  const handleAssetLoanedToggleChange = checked => {
    setAssetLoanedToggle(checked);
    setExpandedSections(prev => ({
      ...prev,
      assetLoaned: checked
    }));
  };
  const handleDepreciationToggleChange = checked => {
    setDepreciationToggle(checked);
    setExpandedSections(prev => ({
      ...prev,
      nonConsumption: checked
    }));
  };

  // Fetch groups
  const fetchGroups = async () => {
    setGroupsLoading(true);
    try {
      const response = await apiClient.get(
        '/pms/assets/get_asset_group_sub_group.json'
      );
      setGroups(response.data.asset_groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    } finally {
      setGroupsLoading(false);
    }
  };

  // Fetch subgroups based on selected group
  const fetchSubgroups = async (groupId) => {
    if (!groupId) {
      setSubgroups([]);
      return;
    }

    setSubgroupsLoading(true);
    try {
      const response = await apiClient.get(
        `/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`
      );
      setSubgroups(response.data.asset_groups || []);

    } catch (error) {
      console.error('Error fetching subgroups:', error);
      setSubgroups([]);
    } finally {
      setSubgroupsLoading(false);
    }
  };
  const handleExtraFieldChange = (key, value, fieldType, groupType, fieldDescription) => {
    setExtraFormFields(prev => ({
      ...prev,
      [key]: { value, fieldType, groupType, fieldDescription }
    }));
    console.log('Extra field updated:', key, value, fieldType, groupType, fieldDescription);
    console.log("Chnages in the fields ", buildExtraFieldsAttributes())
  };

  // Handle group change
  const handleGroupChange = (groupId) => {
    setFormData(prev => ({
      ...prev,
      pms_asset_group_id: groupId,
      pms_asset_sub_group_id: ''
    }));
    setSelectedGroup(groupId);
    setSelectedSubgroup(''); // Reset subgroup when group changes
    fetchSubgroups(groupId);
  };

  // Fetch groups and other data on component mount
  useEffect(() => {
    fetchGroups();
    fetchVendors();
    fetchDepartments();
    fetchUsers();
    fetchMeterUnitTypes();
  }, []);
  
  // Fetch meter unit types
  const fetchMeterUnitTypes = async () => {
    try {
      setLoadingUnitTypes(true);
      const response = await apiClient.get(`${API_CONFIG.BASE_URL}/pms/meter_types/meter_unit_types.json`, {
        headers: { Authorization: getAuthHeader() }
      });
      setMeterUnitTypes(response.data);
    } catch (error) {
      console.error('Error fetching meter unit types:', error);
    } finally {
      setLoadingUnitTypes(false);
    }
  };

  // Fetch parent meters when Sub Meter is selected
  useEffect(() => {
    if (meterType === 'SubMeter') {
      fetchParentMeters();
    } else {
      setSelectedParentMeterId('');
    }
  }, [meterType]);

  // Fetch parent meters function
  const fetchParentMeters = async () => {
    setParentMeterLoading(true);
    try {
      const response = await apiClient.get('/pms/assets/get_parent_asset.json');

      // Transform the nested array format to object format
      const transformedData = response.data.assets.map((asset: [number, string]) => ({
        id: asset[0],
        name: asset[1]
      }));

      setParentMeters(transformedData);
    } catch (error) {
      console.error('Error fetching parent meters:', error);
      setParentMeters([]);
    } finally {
      setParentMeterLoading(false);
    }
  };

  // Fetch vendors function
  const fetchVendors = async () => {
    setVendorsLoading(true);
    try {
      const response = await apiClient.get('/pms/suppliers/get_suppliers.json');
      setVendors(response.data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  };

  // Fetch departments function
  const fetchDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const response = await apiClient.get('/pms/departments.json');
      setDepartments(response.data?.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  // Fetch users function
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await apiClient.get('/pms/users/get_escalate_to_users.json');
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Custom field functions - Updated to handle sections
  const openCustomFieldModal = (section) => {
    setCurrentSection(section);
    setCustomFieldModalOpen(true);
  };

  const handleAddCustomField = () => {
    if (newFieldName.trim() && currentSection) {
      const newField = {
        id: Date.now(),
        name: newFieldName.trim(),
        value: ''
      };
      setCustomFields(prev => ({
        ...prev,
        [currentSection]: [...prev[currentSection], newField]
      }));
      setNewFieldName('');
      setCustomFieldModalOpen(false);
      setCurrentSection('');
    }
  };
  const handleCustomFieldChange = (section, id, value) => {
    setCustomFields(prev => ({
      ...prev,
      [section]: prev[section].map(field =>
        field.id === id ? { ...field, value } : field
      )
    }));
  };

  // const removeCustomField = (section, id) => {
  //   setCustomFields(prev => ({
  //     ...prev,
  //     [section]: prev[section].filter(field => field.id !== id)
  //   }));
  // };
  const removeCustomField = (section, id) => {
    setCustomFields(prev => ({
      ...prev,
      [section]: prev[section].filter(field => field.id !== id)
    }));

    // Remove from extraFormFields as well
    setExtraFormFields(prev => {
      // Find the field name to remove
      const fieldToRemove = customFields[section].find(field => field.id === id);
      if (!fieldToRemove) return prev;
      const newFields = { ...prev };
      delete newFields[fieldToRemove.name];
      return newFields;
    });
  };

  // Custom field functions for IT Assets
  // const handleAddItAssetsCustomField = (fieldName, section = 'System Details') => {
  //   const newField = {
  //     id: Date.now(),
  //     name: fieldName,
  //     value: ''
  //   };
  //   setItAssetsCustomFields(prev => ({
  //     ...prev,
  //     [section]: [...prev[section], newField]
  //   }));
  // };
  const handleAddItAssetsCustomField = (fieldName, section = 'System Details') => {
    const newField = {
      id: Date.now(),
      name: fieldName,
      value: ''
    };
    setItAssetsCustomFields(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newField]
    }));
  };
  const handleItAssetsCustomFieldChange = (section, id, value) => {
    setItAssetsCustomFields(prev => ({
      ...prev,
      [section]: prev[section].map(field => field.id === id ? {
        ...field,
        value
      } : field)
    }));
  };
  const removeItAssetsCustomField = (section, id) => {
    setItAssetsCustomFields(prev => ({
      ...prev,
      [section]: prev[section].filter(field => field.id !== id)
    }));
  };

  // Meter measure field functions
  const handleMeterMeasureFieldChange = (
    type: 'consumption' | 'nonConsumption',
    id: string,
    field: keyof MeterMeasureField,
    value: string | boolean
  ) => {
    if (type === 'consumption') {
      setConsumptionMeasureFields(prev =>
        prev.map(measure =>
          measure.id === id ? { ...measure, [field]: value } : measure
        )
      );
    } else {
      setNonConsumptionMeasureFields(prev =>
        prev.map(measure =>
          measure.id === id ? { ...measure, [field]: value } : measure
        )
      );
    }
  };
  console.log("NON CONSUMPTION MEASURE FIELDS", nonConsumptionMeasureFields)

  const addMeterMeasureField = (type: 'consumption' | 'nonConsumption') => {
    const newField: MeterMeasureField = {
      id: Date.now().toString(),
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false
    };

    if (type === 'consumption') {
      setConsumptionMeasureFields(prev => [...prev, newField]);
    } else {
      setNonConsumptionMeasureFields(prev => [...prev, newField]);
    }
  };

  const removeMeterMeasureField = (type: 'consumption' | 'nonConsumption', id: string) => {
    if (type === 'consumption') {
      setConsumptionMeasureFields(prev => prev.filter(field => field.id !== id));
    } else {
      setNonConsumptionMeasureFields(prev => prev.filter(field => field.id !== id));
    }
  };
  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  // const handleFileUpload = (category, files) => {
  //   if (files) {
  //     const fileArray = Array.from(files);
  //     setAttachments(prev => ({
  //       ...prev,
  //       [category]: [...prev[category], ...fileArray]
  //     }));
  //   }
  // };
  // const removeFile = (category, index) => {
  //   setAttachments(prev => ({
  //     ...prev,
  //     [category]: prev[category].filter((_, i) => i !== index)
  //   }));
  // };
  // const handleSaveAndShow = () => {
  //   console.log('Save and show details');
  //   navigate('/maintenance/asset');
  // };
  // ...existing code.
  // ..


  // const handleSaveAndShow = () => {
  //   const payload = {
  //     pms_asset: {
  //       ...formData,
  //       custom_fields: buildCustomFieldsPayload(),
  //       extra_fields_attributes: buildExtraFieldsAttributes(),
  //       consumption_pms_asset_measures_attributes: consumptionMeasureFields.map(field => ({
  //         name: field.name,
  //         meter_unit_id: field.unitType,
  //         min_value: field.min,
  //         max_value: field.max,
  //         alert_below: field.alertBelowVal,
  //         alert_above: field.alertAboveVal,
  //         multiplier_factor: field.multiplierFactor,
  //         active: true,
  //         meter_tag: "Consumption",
  //         check_previous_reading: field.checkPreviousReading || false,
  //         _destroy: false
  //       })),
  //       non_consumption_pms_asset_measures_attributes: nonConsumptionMeasureFields.map(field => ({
  //         name: field.name,
  //         meter_unit_id: field.unitType,
  //         min_value: field.min,
  //         max_value: field.max,
  //         alert_below: field.alertBelowVal,
  //         alert_above: field.alertAboveVal,
  //         multiplier_factor: field.multiplierFactor,
  //         active: true,
  //         meter_tag: "Non Consumption",
  //         check_previous_reading: field.checkPreviousReading || false,
  //         _destroy: false
  //       }))
  //     }
  //   };
  //   // Add top-level fields if needed (allocation_ids, asset_move_to, amc_detail, etc.)
  //   if (formData.allocation_ids) payload.pms_asset.allocation_ids = formData.allocation_ids;
  //   if (formData.asset_move_to) payload.pms_asset.asset_move_to = formData.asset_move_to;
  //   if (formData.amc_detail) payload.pms_asset.amc_detail = formData.amc_detail;
  //   if (formData.asset_manuals) payload.pms_asset.asset_manuals = formData.asset_manuals;
  //   if (formData.asset_insurances) payload.pms_asset.asset_insurances = formData.asset_insurances;
  //   if (formData.asset_purchases) payload.pms_asset.asset_purchases = formData.asset_purchases;
  //   if (formData.asset_other_uploads) payload.pms_asset.asset_other_uploads = formData.asset_other_uploads;

  //   apiClient.post('pms/assets.json', payload)
  //     // .then(() => navigate('/maintenance/asset'))
  //     .catch(err => console.error(err));
  // };

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Function to check if a field has validation error
  const hasValidationError = (fieldName: string) => {
    return validationErrors.some(error => error.toLowerCase().includes(fieldName.toLowerCase()));
  };
  const validateMandatoryFields = () => {
    const errors: string[] = [];

    // Basic Asset Details validation
    if (!formData.name) errors.push("Asset Name is required");
    if (!formData.model_number) errors.push("Model No. is required");
    if (!formData.manufacturer) errors.push("Manufacturer is required");
    if (!selectedGroup) errors.push("Group is required");
    if (!formData.pms_asset_sub_group_id) errors.push("Subgroup is required");

    // Purchase Details validation
    if (!formData.purchase_cost) errors.push("Purchase Cost is required");
    if (!formData.purchased_on) errors.push("Purchase Date is required");
    if (!formData.commisioning_date) errors.push("Commissioning Date is required");
    if (!formData.warranty_expiry) errors.push("Warranty Expires On is required");

    // Location validation (for applicable categories)
    if (selectedAssetCategory === 'Furniture & Fixtures' ||
        selectedAssetCategory === 'IT Equipment' ||
        selectedAssetCategory === 'Machinery & Equipment' ||
        selectedAssetCategory === 'Meter' ||
        selectedAssetCategory === 'Tools & Instruments') {
      if (!selectedLocation.site) errors.push("Site is required");
      if (!selectedLocation.building) errors.push("Building is required");
    }

    // Asset Loaned validation (if applicable toggle is on)
    if (assetLoanedToggle) {
      if (!selectedLoanedVendorId) errors.push("Vendor Name is required for Asset Loaned");
      if (!formData.agreement_from_date) errors.push("Agreement Start Date is required for Asset Loaned");
      if (!formData.agreement_to_date) errors.push("Agreement End Date is required for Asset Loaned");
    }

    // AMC Details validation (if fields are filled)
    if (formData.amc_detail.supplier_id || 
        formData.amc_detail.amc_start_date || 
        formData.amc_detail.amc_end_date || 
        formData.amc_detail.amc_cost) {
      if (!formData.amc_detail.supplier_id) errors.push("AMC Vendor is required");
      if (!formData.amc_detail.amc_start_date) errors.push("AMC Start Date is required");
      if (!formData.amc_detail.amc_end_date) errors.push("AMC End Date is required");
      if (!formData.amc_detail.amc_cost) errors.push("AMC Cost is required");
    }

    // Depreciation validation (if applicable toggle is on)
    if (depreciationToggle) {
      if (!formData.useful_life) errors.push("Useful Life is required for Depreciation");
      if (!formData.salvage_value) errors.push("Salvage Value is required for Depreciation");
      if (!formData.depreciation_rate) errors.push("Depreciation Rate is required for Depreciation");
    }

    // IT Assets validation (if applicable toggle is on)
    if (selectedAssetCategory === 'IT Equipment' && itAssetsToggle) {
      // Add specific IT asset validations if needed
    }

    // Meter Details validation (if applicable toggle is on)
    if (meterDetailsToggle && meterType) {
      if (meterType === 'SubMeter' && !selectedParentMeterId) {
        errors.push("Parent Meter is required for Sub Meter");
      }
    }

    return errors;
  };

  const handleSaveAndShow = () => {
    // Validate mandatory fields
    const validationErrors = validateMandatoryFields();
    setValidationErrors(validationErrors);
    
    if (validationErrors.length > 0) {
      // Show validation errors using toast
      toast.error('Please fill in all required fields', {
        description: validationErrors.join(' • '),
        duration: 5000,
      });
      
      // Optional: Scroll to the first error field
      const firstErrorField = document.querySelector('.MuiTextField-root .Mui-error input, .MuiFormControl-root .Mui-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    // Clear validation errors if all fields are valid
    setValidationErrors([]);
  // Build the complete payload
  const payload = {
    pms_asset: {
      // Basic asset fields
      name: formData.name,
      asset_number: formData.asset_number,
      model_number: formData.model_number,
      serial_number: formData.serial_number,
      manufacturer: formData.manufacturer,
      status: formData.status,
      critical: formData.critical,
      breakdown: formData.breakdown,
      
      // Location fields
      pms_site_id: selectedLocation.site,
      pms_building_id: selectedLocation.building,
      pms_wing_id: selectedLocation.wing,
      pms_area_id: selectedLocation.area,
      pms_floor_id: selectedLocation.floor,
      pms_room_id: selectedLocation.room,
      
      // Vendor and supplier fields
      loaned_from_vendor_id: formData.loaned_from_vendor_id,
      pms_supplier_id: formData.pms_supplier_id,
      
      // Dates
      agreement_from_date: formData.agreement_from_date,
      agreement_to_date: formData.agreement_to_date,
      commisioning_date: formData.commisioning_date,
      purchased_on: formData.purchased_on,
      warranty_expiry: formData.warranty_expiry,
      
      // Asset grouping
      pms_asset_group_id: formData.pms_asset_group_id,
      pms_asset_sub_group_id: formData.pms_asset_sub_group_id,
      
      // Financial fields
      salvage_value: formData.salvage_value,
      depreciation_rate: formData.depreciation_rate,
      depreciation_method: formData.depreciation_method,
      useful_life: formData.useful_life,
      purchase_cost: formData.purchase_cost,
      
      // Asset type flags
      it_asset: formData.it_asset,
      it_meter: formData.it_meter,
      is_meter: formData.is_meter,
      asset_loaned: formData.asset_loaned,
      depreciation_applicable: formData.depreciation_applicable,
      
      // Meter fields
      meter_tag_type: formData.meter_tag_type,
      parent_meter_id: formData.parent_meter_id,
      
      // Warranty
      warranty: formData.warranty,
      warranty_period: formData.warranty_period,
      
      // Other fields
      depreciation_applicable_for: formData.depreciation_applicable_for,
      indiv_group: formData.indiv_group,
      allocation_type: formData.allocation_type,
      
      // Array fields
      allocation_ids: formData.allocation_ids,
      asset_ids: formData.asset_ids,
      
      // Nested objects
      asset_move_to: formData.asset_move_to,
      amc_detail: formData.amc_detail,
      
      // IT Asset custom fields (as nested object)
      custom_fields: buildCustomFieldsPayload(),
      
      // Extra fields for other categories (as array)
      extra_fields_attributes: buildExtraFieldsAttributes(),
      
      // Meter measures
      consumption_pms_asset_measures_attributes: consumptionMeasureFields.map(field => ({
        name: field.name,
        meter_unit_id: field.unitType,
        min_value: field.min,
        max_value: field.max,
        alert_below: field.alertBelowVal,
        alert_above: field.alertAboveVal,
        multiplier_factor: field.multiplierFactor,
        active: true,
        meter_tag: "Consumption",
        check_previous_reading: field.checkPreviousReading || false,
        _destroy: false
      })),
      
      non_consumption_pms_asset_measures_attributes: nonConsumptionMeasureFields.map(field => ({
        name: field.name,
        meter_unit_id: field.unitType,
        min_value: field.min,
        max_value: field.max,
        alert_below: field.alertBelowVal,
        alert_above: field.alertAboveVal,
        multiplier_factor: field.multiplierFactor,
        active: true,
        meter_tag: "Non Consumption",
        check_previous_reading: field.checkPreviousReading || false,
        _destroy: false
      })),
      
      // File attachments (if sending as arrays)
      asset_manuals: formData.asset_manuals,
      asset_insurances: formData.asset_insurances,
      asset_purchases: formData.asset_purchases,
      asset_other_uploads: formData.asset_other_uploads,
      land_attachments: attachments.landAttachments
    }
  };

  console.log('Final payload:', payload);
  console.log('Extra fields attributes being sent:', payload.pms_asset.extra_fields_attributes);
  console.log('Using FormData:', hasFiles());

  // If sending files, use FormData
  if (hasFiles()) {
    const formDataObj = new FormData();
    
    // Add all non-file fields
    Object.entries(payload.pms_asset).forEach(([key, value]) => {
      if (!['asset_manuals', 'asset_insurances', 'asset_purchases', 'asset_other_uploads', 'land_attachments', 'extra_fields_attributes', 'consumption_pms_asset_measures_attributes', 'non_consumption_pms_asset_measures_attributes'].includes(key)) {
        if (typeof value === 'object' && value !== null) {
          formDataObj.append(`pms_asset[${key}]`, JSON.stringify(value));
        } else {
          // Ensure value is string or Blob for FormData
          if (
            typeof value === 'string' ||
            value instanceof Blob
          ) {
            formDataObj.append(`pms_asset[${key}]`, value);
          } else if (
            typeof value === 'boolean' ||
            typeof value === 'number'
          ) {
            formDataObj.append(`pms_asset[${key}]`, value.toString());
          } else if (value !== null && value !== undefined) {
            formDataObj.append(`pms_asset[${key}]`, JSON.stringify(value));
          }
        }
      }
    });
    
    // Handle extra_fields_attributes specially for FormData
    if (payload.pms_asset.extra_fields_attributes && Array.isArray(payload.pms_asset.extra_fields_attributes)) {
      payload.pms_asset.extra_fields_attributes.forEach((field, index) => {
        Object.entries(field).forEach(([fieldKey, fieldValue]) => {
          formDataObj.append(`pms_asset[extra_fields_attributes][${index}][${fieldKey}]`, String(fieldValue));
        });
      });
    }
    
    // Handle consumption measures
    if (payload.pms_asset.consumption_pms_asset_measures_attributes && Array.isArray(payload.pms_asset.consumption_pms_asset_measures_attributes)) {
      payload.pms_asset.consumption_pms_asset_measures_attributes.forEach((measure, index) => {
        Object.entries(measure).forEach(([measureKey, measureValue]) => {
          formDataObj.append(`pms_asset[consumption_pms_asset_measures_attributes][${index}][${measureKey}]`, String(measureValue));
        });
      });
    }
    
    // Handle non-consumption measures
    if (payload.pms_asset.non_consumption_pms_asset_measures_attributes && Array.isArray(payload.pms_asset.non_consumption_pms_asset_measures_attributes)) {
      payload.pms_asset.non_consumption_pms_asset_measures_attributes.forEach((measure, index) => {
        Object.entries(measure).forEach(([measureKey, measureValue]) => {
          formDataObj.append(`pms_asset[non_consumption_pms_asset_measures_attributes][${index}][${measureKey}]`, String(measureValue));
        });
      });
    }
    
    // Add files
    attachments.landAttachments.forEach(file => 
      formDataObj.append("land_attachments[]", file)
    );
    attachments.vehicleAttachments.forEach(file => 
      formDataObj.append("vehicle_attachments[]", file)
    );
    attachments.leaseholdAttachments.forEach(file => 
      formDataObj.append("leasehold_attachments[]", file)
    );
    attachments.buildingAttachments.forEach(file => 
      formDataObj.append("building_attachments[]", file)
    );
    attachments.furnitureAttachments.forEach(file => 
      formDataObj.append("furniture_attachments[]", file)
    );
    attachments.itEquipmentAttachments.forEach(file => 
      formDataObj.append("it_equipment_attachments[]", file)
    );
    attachments.machineryAttachments.forEach(file => 
      formDataObj.append("machinery_attachments[]", file)
    );
    attachments.toolsAttachments.forEach(file => 
      formDataObj.append("tools_attachments[]", file)
    );
    attachments.meterAttachments.forEach(file => 
      formDataObj.append("meter_attachments[]", file)
    );
    attachments.manualsUpload.forEach(file => 
      formDataObj.append("asset_manuals[]", file)
    );
    attachments.insuranceDetails.forEach(file => 
      formDataObj.append("asset_insurances[]", file)
    );
    attachments.purchaseInvoice.forEach(file => 
      formDataObj.append("asset_purchases[]", file)
    );
    attachments.amc.forEach(file => 
      formDataObj.append("asset_other_uploads[]", file)
    );

    // Add asset images
    if (attachments.landAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.landAssetImage[0]);
    }
    if (attachments.vehicleAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.vehicleAssetImage[0]);
    }
    if (attachments.leaseholdAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.leaseholdAssetImage[0]);
    }
    if (attachments.buildingAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.buildingAssetImage[0]);
    }
    if (attachments.furnitureAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.furnitureAssetImage[0]);
    }
    if (attachments.itEquipmentAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.itEquipmentAssetImage[0]);
    }
    if (attachments.machineryAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.machineryAssetImage[0]);
    }
    if (attachments.toolsAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.toolsAssetImage[0]);
    }
    if (attachments.meterAssetImage.length > 0) {
      formDataObj.append("pms_asset[asset_image]", attachments.meterAssetImage[0]);
    }

    // Debug: Log FormData contents
    console.log('FormData contents:');
    for (let [key, value] of formDataObj.entries()) {
      console.log(key, value);
    }

    // Submit with FormData
    apiClient.post('pms/assets.json', formDataObj, {
      headers: { 
        "Content-Type": "multipart/form-data"
      },
      timeout: 300000, // 5 minutes timeout for large files
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      }
    })
    .then(response => {
      console.log('Asset created successfully:', response.data);
      toast.success('Asset Created Successfully', {
        description: 'The asset has been created and saved.',
        duration: 3000,
      });
      // Small delay to show the toast before redirect
      setTimeout(() => {
        window.location.href = "/maintenance/asset";
      }, 1000);
    })
    .catch(err => {
      console.error('Error creating asset:', err);
      
      if (err.response?.status === 413) {
        toast.error('Upload Failed', {
          description: 'Request too large. Please reduce the number or size of files and try again.',
          duration: 6000,
        });
      } else if (err.response?.status === 422) {
        toast.error('Validation Error', {
          description: 'Please check your form data and try again.',
          duration: 6000,
        });
      } else if (err.code === 'ECONNABORTED') {
        toast.error('Upload Timeout', {
          description: 'Please try with smaller files or check your internet connection.',
          duration: 6000,
        });
      } else {
        toast.error('Upload Failed', {
          description: err.response?.data?.message || err.message || 'An unknown error occurred',
          duration: 6000,
        });
      }
    });
  } else {
    // Submit as JSON
    apiClient.post('pms/assets.json', payload, {
      headers: { "Content-Type": "application/json" }
    })
    .then(response => {
      console.log('Asset created successfully:', response.data);
      navigate('/maintenance/asset');
    })
    .catch(err => {
      console.error('Error creating asset:', err);
    });
  }
};

// Helper function to check if there are files to upload
const hasFiles = () => {
  return (
    attachments.landAttachments.length > 0 ||
    attachments.vehicleAttachments.length > 0 ||
    attachments.leaseholdAttachments.length > 0 ||
    attachments.buildingAttachments.length > 0 ||
    attachments.furnitureAttachments.length > 0 ||
    attachments.itEquipmentAttachments.length > 0 ||
    attachments.machineryAttachments.length > 0 ||
    attachments.toolsAttachments.length > 0 ||
    attachments.meterAttachments.length > 0 ||
    attachments.manualsUpload.length > 0 ||
    attachments.insuranceDetails.length > 0 ||
    attachments.purchaseInvoice.length > 0 ||
    attachments.amc.length > 0 ||
    // Add asset images to file check
    attachments.landAssetImage.length > 0 ||
    attachments.vehicleAssetImage.length > 0 ||
    attachments.leaseholdAssetImage.length > 0 ||
    attachments.buildingAssetImage.length > 0 ||
    attachments.furnitureAssetImage.length > 0 ||
    attachments.itEquipmentAssetImage.length > 0 ||
    attachments.machineryAssetImage.length > 0 ||
    attachments.toolsAssetImage.length > 0 ||
    attachments.meterAssetImage.length > 0
  );
};
  // ...existing code...
  const handleSaveAndCreate = () => {
    console.log('Save and create new asset');
  };
  const fieldStyles = {
    height: {
      xs: 28,
      sm: 36,
      md: 45
    },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: {
        xs: '8px',
        sm: '10px',
        md: '12px'
      }
    }
  };
  return <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button 
            onClick={handleGoBack}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Asset List</span>
          <span>{'>'}</span>
          <span className="text-gray-900 font-medium">Create New Asset</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW ASSET</h1>
      </div>

    <div className="space-y-4 sm:space-y-6">
      {/* Asset Category Selection */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-l-4 border-l-[#C72030] p-2 sm:p-6 bg-white">
          <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-6">
            <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
              <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
            </span>
            ASSET CATEGORY
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <RadioGroup
              value={selectedAssetCategory}
              onValueChange={(category) => {
                setSelectedAssetCategory(category);
                // handleFieldChange('asset_category', category);
                handleExtraFieldChange(
                  'asset_category',
                  category,
                  'text',
                  'basicIdentification',
                  'Asset Category'
                );
                // Reset form data when category changes
                setFormData(prevData => ({
                  ...prevData,
                  asset_category: category,
                  name: '',
                  asset_number: '',
                }));
              }}
              className="contents"
            >
              {[
                'Land',
                'Building',
                'Leasehold Improvement',
                'Vehicle',
                'Furniture & Fixtures',
                'IT Equipment',
                'Machinery & Equipment',
                'Tools & Instruments',
                'Meter'
              ].map((category) => (
                <div key={category} className="flex flex-col items-center space-y-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-w-[80px]">
                  <RadioGroupItem
                    value={category}
                    id={category}
                    className="mx-auto"
                  />
                  <label
                    htmlFor={category}
                    className="text-xs sm:text-sm font-medium cursor-pointer text-center leading-tight whitespace-pre-line"
                  >
                    {category.split(' & ').join('\n').split(' ').join('\n')}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Land Asset Details - Show when Land is selected */}
      {selectedAssetCategory === 'Land' && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="space-y-6">
            {/* Asset Image Upload */}
           
            {/* Basic Identification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Basic Identification
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('basicIdentification')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Asset Id/Code"
                    placeholder="Enter unique identifier"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e => handleFieldChange('asset_number', e.target.value)}
                  />
                  <TextField
                    label="Asset Name"
                    placeholder="Enter land name"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e => handleFieldChange('name', e.target.value)}
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Land Type</InputLabel>
                    <MuiSelect
                      label="Land Type"
                      defaultValue=""
                      onChange={e =>
                        handleExtraFieldChange(
                          'landType',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'basicIdentification',
                          'Land Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Land Type</MenuItem>
                      <MenuItem value="raw">Raw Land</MenuItem>
                      <MenuItem value="developed">Developed Land</MenuItem>
                      <MenuItem value="leased">Leased</MenuItem>
                      <MenuItem value="agricultural">Agricultural</MenuItem>
                      <MenuItem value="special">Special Use</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  {/* Custom Fields */}
                  {customFields.basicIdentification.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={e => {
                          handleCustomFieldChange('basicIdentification', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('basicIdentification', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location & Ownership */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Ownership
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('locationOwnership')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Location"
                    placeholder="Full address or GPS coordinates"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e =>
                      handleExtraFieldChange(
                        'location',
                        e.target.value,
                        'text',
                        'locationOwnership',
                        'Location'
                      )
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Ownership Type</InputLabel>
                    <MuiSelect
                      label="Ownership Type"
                      defaultValue=""
                      onChange={e =>
                        handleExtraFieldChange(
                          'ownership_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'basicIdentification',
                          'Ownership Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Ownership Type</MenuItem>
                      <MenuItem value="owned">Owned</MenuItem>
                      <MenuItem value="leased">Leased</MenuItem>
                      <MenuItem value="allotted">Allotted</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Legal Document Ref No."
                    placeholder="Title deed, lease ID, etc."
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e =>
                      handleExtraFieldChange(
                        'legal_document_ref_no',
                        e.target.value,
                        'text',
                        'locationOwnership',
                        'Legal Document Ref No'
                      )
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Zoning Classification</InputLabel>
                    <MuiSelect
                      label="Zoning Classification"
                      defaultValue=""
                      onChange={e =>
                        handleExtraFieldChange(
                          'zoning_classification',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'locationOwnership',
                          'Zoning Classification'
                        )
                      }
                    >
                      <MenuItem value="">Select Zoning</MenuItem>
                      <MenuItem value="residential">Residential</MenuItem>
                      <MenuItem value="commercial">Commercial</MenuItem>
                      <MenuItem value="agricultural">Agricultural</MenuItem>
                      <MenuItem value="industrial">Industrial</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Encumbrance Status</InputLabel>
                    <MuiSelect
                      label="Encumbrance Status"
                      defaultValue=""
                      onChange={e =>
                        handleExtraFieldChange(
                          'encumbrance_status',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'locationOwnership',
                          'Encumbrance Status'
                        )
                      }
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="clear">Clear</MenuItem>
                      <MenuItem value="mortgage">Under Mortgage</MenuItem>
                      <MenuItem value="disputed">Disputed</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  {/* Custom Fields */}
                  {customFields.locationOwnership.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={e => {
                          handleCustomFieldChange('locationOwnership', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('locationOwnership', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Land Size & Value */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5" />
                    Land Size & Value
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('landSizeValue')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <TextField
                      label="Area"
                      placeholder="Enter area"
                      variant="outlined"
                      type="number"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={e =>
                        handleExtraFieldChange(
                          'area',
                          (e.target as HTMLInputElement).value,
                          'number',
                          'landSizeValue',
                          'Area'
                        )
                      }
                    />
                    <FormControl
                      sx={{
                        minWidth: 100,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    >
                      <InputLabel>Unit</InputLabel>
                      <MuiSelect
                        label="Unit"
                        defaultValue="sqft"
                        onChange={e =>
                          handleExtraFieldChange(
                            'land_unit',
                            (e.target as HTMLInputElement).value,
                            'select',
                            'landSizeValue',
                            'Land Unit'
                          )
                        }
                      >
                        <MenuItem value="sqft">Sq. Ft.</MenuItem>
                        <MenuItem value="acres">Acres</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <DatePicker
                    label="Date of Acquisition"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={date =>
                      handleExtraFieldChange(
                        'date_of_acquisition',
                        date,
                        'date',
                        'landSizeValue',
                        'Date of Acquisition'
                      )
                    }

                  />
                  <div className="flex gap-2">
                    <FormControl
                      sx={{
                        minWidth: 80,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    >
                      <InputLabel>Currency</InputLabel>
                      <MuiSelect
                        label="Currency"
                        defaultValue="inr"
                        onChange={e =>
                          handleExtraFieldChange(
                            'currency',
                            (e.target as HTMLInputElement).value,
                            'select',
                            'landSizeValue',
                            'Currency'
                          )
                        }
                      >
                        <MenuItem value="inr">INR</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Acquisition Cost"
                      placeholder="Enter cost"
                      variant="outlined"
                      type="number"

                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={e =>
                        handleExtraFieldChange(
                          'acquisition_cost',
                          (e.target as HTMLInputElement).value,
                          'number',
                          'landSizeValue',
                          'Acquisition Cost'
                        )
                      }
                    />
                  </div>
                  <TextField
                    label="Current Market Value (INR)"
                    placeholder="Enter current value"
                    variant="outlined"
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e =>
                      handleExtraFieldChange(
                        'current_market_value',
                        (e.target as HTMLInputElement).value,
                        'number',
                        'landSizeValue',
                        'Current Market Value'
                      )
                    }
                  />
                </div>
                {/* Custom Fields */}
                {customFields.landSizeValue.map((field) => (
                  <div key={field.id} className="relative">
                    <TextField
                      label={field.name}
                      placeholder={`Enter ${field.name}`}
                      variant="outlined"
                      fullWidth
                      value={field.value}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={e => {
                        handleCustomFieldChange('landSizeValue', field.id, e.target.value);
                      }}
                    />
                    <button
                      onClick={() => removeCustomField('landSizeValue', field.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Land Usage & Development */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Construction className="w-5 h-5" />
                    Land Usage & Development
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('landUsageDevelopment')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Purpose / Use</InputLabel>
                    <MuiSelect
                      label="Purpose / Use"
                      defaultValue=""
                      onChange={e =>
                        handleExtraFieldChange(
                          'purpose_use',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'landUsageDevelopment',
                          'Purpose / Use'
                        )
                      }
                    >
                      <MenuItem value="">Select Purpose</MenuItem>
                      <MenuItem value="commercial">Commercial</MenuItem>
                      <MenuItem value="residential">Residential</MenuItem>
                      <MenuItem value="reserved">Reserved</MenuItem>
                      <MenuItem value="institutional">Institutional</MenuItem>
                      <MenuItem value="industrial">Industrial</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Land Improvements</InputLabel>
                    <MuiSelect
                      label="Land Improvements"
                      defaultValue=""
                      onChange={e =>
                        handleExtraFieldChange(
                          'land_improvements',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'landUsageDevelopment',
                          'Land Improvements'
                        )
                      }
                    >
                      <MenuItem value="">Select Improvements</MenuItem>
                      <MenuItem value="fencing">Fencing</MenuItem>
                      <MenuItem value="landscaping">Landscaping</MenuItem>
                      <MenuItem value="roads">Roads</MenuItem>
                      <MenuItem value="electricity">Electricity</MenuItem>
                      <MenuItem value="wateracess">Water Access</MenuItem>
                      <MenuItem value="other">Other </MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Responsible Department"
                    placeholder="Enter department or user"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }
                    }
                    onChange={e =>
                        handleExtraFieldChange(
                          'reaponsible_department',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'landUsageDevelopment',
                          'Responsible Department'
                        )
                      }
                  />

                  {/* Custom Fields */}
                  {customFields.landUsageDevelopment.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        onChange={e => {

                          handleCustomFieldChange('landUsageDevelopment', field.id, e.target.value);
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('landUsageDevelopment', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Miscellaneous */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    Miscellaneous
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('miscellaneous')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextField
                  label="Remarks / Notes"
                  placeholder="Special remarks, legal concerns, or development plans"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      // height: { xs: '36px', md: '45px' }
                    }
                  }}
                  // onChange={e => handleFieldChange('remarks', e.target.value)}
                  onChange={e =>
                    handleExtraFieldChange(
                      'remarks',
                      e.target.value,
                      'text',
                      'miscellaneous',
                      'Remarks / Notes'
                    )
                  }
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="land-attachments"
                    onChange={e => handleFileUpload('landAttachments', e.target.files)}
                  />
                  <label htmlFor="land-attachments" className="cursor-pointer">
                    <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload attachments
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload deed copy, layout, map, lease, etc.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Max 10MB per file, 50MB total. Images will be compressed automatically.
                    </p>
                  </label>
                  {attachments.landAttachments && attachments.landAttachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {attachments.landAttachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                          <div className="flex flex-col truncate">
                            <span className="text-xs sm:text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <button onClick={() => removeFile('landAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-1">
                        Total: {attachments.landAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                          ? `${(attachments.landAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                          : `${(attachments.landAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                        }
                      </div>
                        

                    </div>
                    
                  )}
                </div>


                {/* Custom Fields */}
                {customFields.miscellaneous.map((field) => (
                  <div key={field.id} className="relative">
                    <TextField
                      label={field.name}
                      placeholder={`Enter ${field.name}`}
                      variant="outlined"
                      fullWidth
                      value={field.value}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={e => {
                        handleCustomFieldChange('miscellaneous', field.id, e.target.value);
                      }}
                    />
                    <button
                      onClick={() => removeCustomField('miscellaneous', field.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <AssetImageUpload
                categoryName="Land"
                categoryKey="landAssetImage"
                onImageUpload={handleFileUpload}
                onImageRemove={removeFile}
                images={attachments.landAssetImage}
              />
          </div>
        </LocalizationProvider>
      )}

      {/* Leasehold Improvement Asset Details - Show when Leasehold Improvement is selected */}
      {selectedAssetCategory === 'Leasehold Improvement' && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="space-y-6">
            {/* Asset Image Upload */}
          

            {/* Basic Identification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Basic Identification
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('leaseholdBasicId')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Asset ID / Code"
                    placeholder="Enter alphanumeric code"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e => handleFieldChange('asset_number', e.target.value)}
                  />
                  <TextField
                    label="Improvement Description"
                    placeholder="e.g., Flooring, IT Cabling"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e => handleFieldChange('name', e.target.value)}
                  />

                  {/* Custom Fields */}
                  {customFields.leaseholdBasicId.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('leaseholdBasicId', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange('leaseholdBasicId', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('leaseholdBasicId', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location & Association */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Association
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('leaseholdLocationAssoc')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Location / Site"
                    placeholder="Enter location"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        `leasehold_location`,
                        (e.target as HTMLInputElement).value,
                        'text',
                        'leaseholdLocationAssoc',
                        `Leasehold Location`
                      )
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Leased Property ID</InputLabel>
                    <MuiSelect
                      label="Leased Property ID"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'leased_property_id',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'leaseholdLocationAssoc',
                          'Leased Property ID'
                        )
                      }
                    >
                      <MenuItem value="">Select Property</MenuItem>
                      <MenuItem value="prop001">Property 001</MenuItem>
                      <MenuItem value="prop002">Property 002</MenuItem>
                      <MenuItem value="prop003">Property 003</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  {/* <TextField
                    label="Ownership Type"
                    value="Lessee"
                    variant="outlined"
                    fullWidth
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}

                  /> */}

                  {/* Custom Fields */}
                  {customFields.leaseholdLocationAssoc.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('leaseholdLocationAssoc', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {

                          handleCustomFieldChange('leaseholdLocationAssoc', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('leaseholdLocationAssoc', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improvement Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Construction className="w-5 h-5" />
                    Improvement Details
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('improvementDetails')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Type of Improvement</InputLabel>
                    <MuiSelect
                      label="Type of Improvement"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'improvement_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'improvementDetails',
                          'Type of Improvement'
                        )
                      }
                    >
                      <MenuItem value="">Select Type</MenuItem>
                      <MenuItem value="civil">Civil</MenuItem>
                      <MenuItem value="electrical">Electrical</MenuItem>
                      <MenuItem value="hvac">HVAC</MenuItem>
                      <MenuItem value="plumbing">Plumbing</MenuItem>
                      <MenuItem value="Security">Security</MenuItem>
                      <MenuItem value="it">IT Infrastructure</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Vendor / Contractor Name</InputLabel>
                    <MuiSelect
                      label="Vendor / Contractor Name"
                      value={selectedVendorId}
                      onChange={(e) => setSelectedVendorId(e.target.value)}
                      disabled={vendorsLoading}

                    >
                      <MenuItem value="">
                        {vendorsLoading ? 'Loading vendors...' : 'Select Vendor'}
                      </MenuItem>
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Invoice Number"
                    placeholder="Enter invoice number"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'invoice_number',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'improvementDetails',
                        'Invoice Number'
                      )
                    }
                  />
                  <DatePicker
                    label="Date of Improvement"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'improvement_date',
                        date,
                        'date',
                        'improvementDetails',
                        'Improvement Date'
                      )
                    }
                  />
                  <TextField
                    label="Improvement Cost (INR)"
                    placeholder="Enter cost"
                    variant="outlined"
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'improvement_cost',
                        (e.target as HTMLInputElement).value,
                        'number',
                        'improvementDetails',
                        'Improvement Cost'
                      )
                    }
                  />

                  {/* Custom Fields */}
                  {customFields.improvementDetails.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('improvementDetails', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange('improvementDetails', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('improvementDetails', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial & Depreciation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial & Depreciation
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('leaseholdFinancial')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Depreciation Method</InputLabel>
                    <MuiSelect
                      label="Depreciation Method"
                      defaultValue=""
                      onChange={(e) =>{
                        handleExtraFieldChange(
                          'depreciation_method',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'leaseholdFinancial',
                          'Depreciation Method'
                        );
                        handleFieldChange('depreciation_method', e.target.value);
                      }
                    }
                    >
                      <MenuItem value="">Select Method</MenuItem>
                      <MenuItem value="straight">Straight Line</MenuItem>
                      <MenuItem value="wdv">Written Down Value</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Useful Life (Years)"
                    placeholder="Enter years"
                    variant="outlined"
                    fullWidth
                    type="number"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>{
                      handleExtraFieldChange(
                        'useful_life_years',
                        (e.target as HTMLInputElement).value,
                        'number',
                        'leaseholdFinancial',
                        'Useful Life (Years)'
                      );
                       handleFieldChange('useful_life', e.target.value);

                    }
                  }
                  />
                  <TextField
                    label="Depreciation Rate (%)"
                    placeholder="Enter rate"
                    variant="outlined"
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>{
                      handleExtraFieldChange(
                        'depreciation_rate',
                        (e.target as HTMLInputElement).value,
                        'number',
                        'leaseholdFinancial',
                        'Depreciation Rate'
                      );
                       handleFieldChange('depreciation_rate', e.target.value)
                    }
                    }
                  />
                  <TextField
                    label="Current Book Value (INR)"
                    placeholder="Enter value"
                    variant="outlined"
                    fullWidth
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'current_book_value',
                        (e.target as HTMLInputElement).value,
                        'number',
                        'leaseholdFinancial',
                        'Current Book Value'
                      )
                    }
                  />
                  <DatePicker
                    label="Asset Capitalized On"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'capitalization_date',
                        date,
                        'date',
                        'leaseholdFinancial',
                        'Capitalization Date'
                      )
                    }
                  />

                  {/* Custom Fields */}
                  {customFields.leaseholdFinancial.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('leaseholdFinancial', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {

                          handleCustomFieldChange('leaseholdFinancial', field.id, e.target.value);

                        }
                        }
                      />
                      <button
                        onClick={() => removeCustomField('leaseholdFinancial', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lease & Maintenance Linkages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Lease & Maintenance Linkages
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('leaseholdLease')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="Lease Start Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'lease_start_date',
                        date,
                        'date',
                        'leaseholdLease',
                        'Lease Start Date'
                      )
                    }
                  />
                  <DatePicker
                    label="Lease End Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'lease_end_date',
                        date,
                        'date',
                        'leaseholdLease',
                        'Lease End Date'
                      )
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>AMC / PPM Linked</InputLabel>
                    <MuiSelect
                      label="AMC / PPM Linked"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'amc_ppm_linked',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'leaseholdLease',
                          'AMC / PPM Linked'
                        )
                      }
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  {/* Custom Fields */}
                  {customFields.leaseholdLease.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('leaseholdLease', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {

                          handleCustomFieldChange('leaseholdLease', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('leaseholdLease', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Oversight & Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-5 h-5" />
                    Oversight & Documentation
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('leaseholdOversight')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        
                      }
                    }}
                  >
                    <InputLabel>Responsible Department</InputLabel>
                    <MuiSelect
                      label="Responsible Department"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'responsible_department',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'leaseholdOversight',
                          'Responsible Department'
                        )
                      }
                    >
                      <MenuItem value="">Select Department</MenuItem>
                      <MenuItem value="facilities">Facilities Management</MenuItem>
                      <MenuItem value="admin">Administration</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="it">IT Department</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <div className="md:col-span-2">
                    <TextField
                      label="Remarks / Notes"
                      placeholder="Enter remarks or notes"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          
                        }
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'remarks_notes',
                          (e.target as HTMLInputElement).value,
                          'text',
                          'leaseholdOversight',
                          'Remarks / Notes'
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        id="leasehold-attachments"
                        onChange={e => handleFileUpload('leaseholdAttachments', e.target.files)}
                      />
                      <label htmlFor="leasehold-attachments" className="cursor-pointer">
                        <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload attachments
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Upload invoices, contracts, improvement photos, etc.
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          Max 10MB per file, 50MB total. Images will be compressed automatically.
                        </p>
                      </label>
                      {attachments.leaseholdAttachments && attachments.leaseholdAttachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {attachments.leaseholdAttachments.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                              <div className="flex flex-col truncate">
                                <span className="text-xs sm:text-sm truncate">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                              <button onClick={() => removeFile('leaseholdAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="text-xs text-gray-500 mt-1">
                            Total: {attachments.leaseholdAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                              ? `${(attachments.leaseholdAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                              : `${(attachments.leaseholdAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {customFields.leaseholdOversight.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        onChange={(e) => {
                          handleCustomFieldChange('leaseholdOversight', field.id, e.target.value);
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('leaseholdOversight', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
           <AssetImageUpload
              categoryName="Leasehold Improvement"
              categoryKey="leaseholdAssetImage"
              onImageUpload={handleFileUpload}
              onImageRemove={removeFile}
              images={attachments.leaseholdAssetImage}
            />
          </div>
        </LocalizationProvider>
      )}

      {/* Vehicle Asset Details - Show when Vehicle is selected */}
      {selectedAssetCategory === 'Vehicle' && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="space-y-6">
            {/* Asset Image Upload */}
            

            {/* Basic Identification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Basic Identification
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('vehicleBasicId')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Asset ID / Code"
                    placeholder="System-generated or manually entered"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  onChange={e => handleFieldChange('serial_number', e.target.value)}

                  />
                  <TextField
                    label="Asset Name"
                    placeholder="Name "
                    variant="outlined"

                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e => handleFieldChange('name', e.target.value)}

                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Vehicle Type</InputLabel>
                    <MuiSelect
                      label="Vehicle Type"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'vehicle_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'vehicleBasicId',
                          'Vehicle Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Vehicle Type</MenuItem>
                      <MenuItem value="car">Car</MenuItem>
                      <MenuItem value="truck">Truck</MenuItem>
                      <MenuItem value="van">Van</MenuItem>
                      <MenuItem value="forklift">Forklift</MenuItem>
                      <MenuItem value="electric-cart">Electric Cart</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Make & Model"
                    placeholder="e.g., Tata Ace, Honda Activa"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'make_model',
                        (e.target as HTMLInputElement).value,
                        'select',
                        'vehicleBasicId',
                        'Make & Model'
                      )
                    }
                  />
                  <TextField
                    label="Registration Number"
                    placeholder="e.g., MH01AB1234"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'registration_number',
                        (e.target as HTMLInputElement).value,
                        'select',
                        'vehicleBasicId',
                        'Registration Number'
                      )
                    }
                  />

                  {/* Custom Fields */}
                  {customFields.vehicleBasicId.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('vehicleBasicId', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {

                          handleCustomFieldChange('vehicleBasicId', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('vehicleBasicId', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cog className="w-5 h-5" />
                    Technical Specifications
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('vehicleTechnicalSpecs')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Chassis Number"
                    placeholder="Enter chassis number"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'chassis_number',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'vehicleTechnicalSpecs',
                        'Chassis Number'
                      )
                    }
                  />
                  <TextField
                    label="Engine Number"
                    placeholder="Enter engine number"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'engine_number',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'vehicleTechnicalSpecs',
                        'Engine Number'
                      )
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Fuel Type</InputLabel>
                    <MuiSelect
                      label="Fuel Type"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'fuel_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'vehicleTechnicalSpecs',
                          'Fuel Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Fuel Type</MenuItem>
                      <MenuItem value="petrol">Petrol</MenuItem>
                      <MenuItem value="diesel">Diesel</MenuItem>
                      <MenuItem value="cng">CNG</MenuItem>
                      <MenuItem value="electric">Electric</MenuItem>
                      <MenuItem value="hybrid">Hybrid</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </CardContent>
            </Card>

            {/* Ownership & Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-5 h-5" />
                    Ownership & Usage
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('vehicleOwnership')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Ownership Type</InputLabel>
                    <MuiSelect
                      label="Ownership Type"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'ownership_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'vehicleOwnership',
                          'Ownership Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Ownership Type</MenuItem>
                      <MenuItem value="owned">Owned</MenuItem>
                      <MenuItem value="leased">Leased</MenuItem>
                      <MenuItem value="company-owned">Company-Owned</MenuItem>
                      <MenuItem value="departmental">Departmental</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Assigned To / Department</InputLabel>
                    <MuiSelect
                      label="Assigned To / Department"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'assigned_to_department',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'vehicleOwnership',
                          'Assigned To / Department'
                        )
                      }
                    >
                      <MenuItem value="">Select Department/User</MenuItem>
                      <MenuItem value="admin">Administration</MenuItem>
                      <MenuItem value="hr">Human Resources</MenuItem>
                      <MenuItem value="logistics">Logistics</MenuItem>
                      <MenuItem value="maintenance">Maintenance</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Usage Type</InputLabel>
                    <MuiSelect
                      label="Usage Type"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'usage_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'vehicleOwnership',
                          'Usage Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Usage Type</MenuItem>
                      <MenuItem value="official">Official</MenuItem>
                      <MenuItem value="delivery">Delivery</MenuItem>
                      <MenuItem value="emergency">Emergency</MenuItem>
                      <MenuItem value="transport">Transport</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Permit Type</InputLabel>
                    <MuiSelect
                      label="Permit Type"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'permit_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'vehicleOwnership',
                          'Permit Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Permit Type</MenuItem>
                      <MenuItem value="private">Private</MenuItem>
                      <MenuItem value="commercial">Commercial</MenuItem>
                      <MenuItem value="transport">Transport Permit</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  {/* Custom Fields */}
                  {customFields.vehicleOwnership.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('vehicleOwnership', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {

                          handleCustomFieldChange('vehicleOwnership', field.id, e.target.value);
                        }
                        }
                      />
                      <button
                        onClick={() => removeCustomField('vehicleOwnership', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial & Depreciation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial & Depreciation
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('vehicleFinancial')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                  label="Date of Purchase"
                  slotProps={{
                    textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', md: '45px' }
                      }
                    }
                    }
                  }}
                  onChange={date => {
                    handleExtraFieldChange(
                    'purchase_date',
                    date,
                    'date',
                    'vehicleFinancial',
                    'Date of Purchase'
                    );
                    handleFieldChange('commisioning_date', date);
                  }}
                  />
                  <div className="flex gap-2">
                  <FormControl
                    sx={{
                    minWidth: 80,
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', md: '45px' }
                    }
                    }}
                  >
                    <InputLabel>Currency</InputLabel>
                    <MuiSelect
                    label="Currency"
                    defaultValue="inr"
                    onChange={e => {
                      handleExtraFieldChange(
                      'currency',
                      (e.target as HTMLInputElement).value,
                      'select',
                      'vehicleFinancial',
                      'Currency'
                      );
                    }}
                    >
                    <MenuItem value="inr">INR</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Purchase Cost"
                    placeholder="Enter purchase cost"
                    variant="outlined"
                    type="number"
                    sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', md: '45px' }
                    }
                    }}
                    InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                    onChange={e => handleFieldChange('purchase_cost', e.target.value)}
                  />
                  </div>
                  <TextField
                  label="Depreciation Rate (%)"
                  placeholder="Linked to depreciation module"
                  variant="outlined"
                  fullWidth
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                    height: { xs: '36px', md: '45px' }
                    }
                  }}
                  onChange={e =>
                    handleExtraFieldChange(
                    'depreciation_rate',
                    (e.target as HTMLInputElement).value,
                    'number',
                    'vehicleFinancial',
                    'Depreciation Rate'
                    )
                  }
                  />
                  <TextField
                  label="Current Book Value (INR)"
                  placeholder="Calculated or manually entered"
                  variant="outlined"
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                    height: { xs: '36px', md: '45px' }
                    }
                  }}
                  onChange={e =>
                    handleExtraFieldChange(
                    'current_book_value',
                    (e.target as HTMLInputElement).value,
                    'number',
                    'vehicleFinancial',
                    'Current Book Value'
                    )
                  }
                  />

                  {/* Custom Fields */}
                  {customFields.vehicleFinancial.map(field => (
                  <div key={field.id} className="relative">
                    <TextField
                    label={field.name}
                    placeholder={`Enter ${field.name}`}
                    variant="outlined"
                    fullWidth
                    value={field.value}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e => handleCustomFieldChange('vehicleFinancial', field.id, e.target.value)}
                    />
                    <button
                    onClick={() => removeCustomField('vehicleFinancial', field.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                    >
                    <X className="w-3 h-3" />
                    </button>
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Performance className="w-5 h-5" />
                    Performance Tracking
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('vehiclePerformance')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <TextField
                      label="Odometer Reading"
                      placeholder="Enter reading"
                      variant="outlined"
                      type="number"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">KM</InputAdornment>,
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'odometer_reading',
                          (e.target as HTMLInputElement).value,
                          'number',
                          'vehiclePerformance',
                          'Odometer Reading'
                        )
                      }
                    />
                    <FormControl
                      sx={{
                        minWidth: 80,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    >
                      <InputLabel>Unit</InputLabel>
                      <MuiSelect
                        label="Unit"
                        defaultValue="km"
                        onChange={(e) =>
                          handleExtraFieldChange(
                            'odometer_unit',
                            (e.target as HTMLInputElement).value,
                            'select',
                            'vehiclePerformance',
                            'Odometer Unit'
                          )
                        }
                      >
                        <MenuItem value="km">KM</MenuItem>
                        <MenuItem value="miles">Miles</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <TextField
                    label="Service Schedule (PPM)"
                    placeholder="Linked PPM name (Read-only)"
                    variant="outlined"
                    fullWidth
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'service_schedule_ppm',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'vehiclePerformance',
                        'Service Schedule (PPM)'
                      )
                    }
                  />
                  <DatePicker
                    label="Last Service Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'last_service_date',
                        date,
                        'date',
                        'vehiclePerformance',
                        'Last Service Date'
                      )
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>AMC Linked</InputLabel>
                    <MuiSelect
                      label="AMC Linked"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'amc_linked',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'vehiclePerformance',
                          'AMC Linked'
                        )
                      }
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </CardContent>
            </Card>

            {/* Legal & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    Legal & Compliance
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('vehicleLegal')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Insurance Provider"
                    placeholder="Enter insurance provider name"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'insurance_provider',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'vehicleLegal',
                        'Insurance Provider'
                      )
                    }
                  />
                  <TextField
                    label="Insurance Policy No."
                    placeholder="Enter policy number"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'insurance_policy_no',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'vehicleLegal',
                        'Insurance Policy No.'
                      )
                    }
                  />
                  <DatePicker
                    label="Insurance Expiry Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'insurance_expiry_date',
                        date,
                        'date',
                        'vehicleLegal',
                        'Insurance Expiry Date'
                      )
                    }
                  />
                  <DatePicker
                    label="Fitness Certificate Expiry"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'fitness_certificate_expiry',
                        date,
                        'date',
                        'vehicleLegal',
                        'Fitness Certificate Expiry'
                      )
                    }
                  />
                  <DatePicker
                    label="PUC Expiry Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'puc_expiry_date',
                        date,
                        'date',
                        'vehicleLegal',
                        'PUC Expiry Date'
                      )
                    }
                  />

                  {/* Custom Fields */}
                  {customFields.vehicleLegal.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('vehicleLegal', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {

                          handleCustomFieldChange('vehicleLegal', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('vehicleLegal', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Miscellaneous */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    Miscellaneous
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('vehicleMiscellaneous')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextField
                  label="Remarks / Notes"
                  placeholder="Comments, issues, or notes"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      // height: { xs: '80px', md: '100px' }
                    }
                  }}
                  onChange={(e) =>
                    handleExtraFieldChange(
                      'remarks_notes',
                      (e.target as HTMLInputElement).value,
                      'text',
                      'vehicleMiscellaneous',
                      'Remarks / Notes'
                    )
                  }
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="vehicle-attachments"
                    onChange={(e) => handleFileUpload('vehicleAttachments', e.target.files)}
                  />
                  <label htmlFor="vehicle-attachments" className="cursor-pointer">
                    <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload attachments
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload RC copy, insurance, permit, fitness, PUC, etc.
                    </p>
                  </label>
                </div>

                {/* Display uploaded vehicle attachments */}
                {attachments.vehicleAttachments && attachments.vehicleAttachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Vehicle Documents:</h4>
                    <div className="space-y-2">
                      {attachments.vehicleAttachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <div className="flex items-center space-x-2">
                            <Archive className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile('vehicleAttachments', index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Fields */}
                {customFields.vehicleMiscellaneous.map((field) => (
                  <div key={field.id} className="relative">
                    <TextField
                      label={field.name}
                      placeholder={`Enter ${field.name}`}
                      variant="outlined"
                      fullWidth
                      value={field.value}
                      // onChange={(e) => handleCustomFieldChange('vehicleMiscellaneous', field.id, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={(e) => {

                        handleCustomFieldChange('vehicleMiscellaneous', field.id, e.target.value);
                      }}
                    />
                    <button
                      onClick={() => removeCustomField('vehicleMiscellaneous', field.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          <AssetImageUpload
              categoryName="Vehicle"
              categoryKey="vehicleAssetImage"
              onImageUpload={handleFileUpload}
              onImageRemove={removeFile}
              images={attachments.vehicleAssetImage}
            />
          </div>
        </LocalizationProvider>
      )}

      {/* Building Asset Details - Show when Building is selected */}
      {selectedAssetCategory === 'Building' && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="space-y-6">
            {/* Asset Image Upload */}
            

            {/* Basic Identification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Basic Identification
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('buildingBasicId')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Asset ID / Code"
                    placeholder="Enter unique identifier"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e => handleFieldChange('asset_number', e.target.value)}
                  />
                  <TextField
                    label="Asset Name"
                    placeholder="Enter building name"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={e => handleFieldChange('name', e.target.value)}
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Building Type</InputLabel>
                    <MuiSelect
                      label="Building Type"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'building_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingBasicId',
                          'Building Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Building Type</MenuItem>
                      <MenuItem value="office">Office</MenuItem>
                      <MenuItem value="residential">Residential</MenuItem>
                      <MenuItem value="industrial">Industrial</MenuItem>
                      <MenuItem value="mixed">Mixed Use</MenuItem>
                      <MenuItem value="other">Other (Manual Entry)</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  {/* Custom Fields */}
                  {customFields.buildingBasicId.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('buildingBasicId', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {

                          handleCustomFieldChange('buildingBasicId', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('buildingBasicId', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location & Ownership */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location & Ownership
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('buildingLocation')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Location"
                    placeholder="Full address"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'location',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'buildingLocation',
                        'Location'
                      )
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Ownership Type</InputLabel>
                    <MuiSelect
                      label="Ownership Type"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'ownership_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingLocation',
                          'Ownership Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Ownership Type</MenuItem>
                      <MenuItem value="owned">Owned</MenuItem>
                      <MenuItem value="rented">Rented</MenuItem>
                      <MenuItem value="leased">Leased</MenuItem>
                      <MenuItem value="government">Government Allotted</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Linked Land Asset"
                    placeholder="Enter Asset ID or name of land"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'linked_land_asset',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'buildingLocation',
                        'Linked Land Asset'
                      )
                    }
                  />

                  {/* Custom Fields */}
                  {customFields.buildingLocation.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('buildingLocation', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange('buildingLocation', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('buildingLocation', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Construction Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Construction className="w-5 h-5" />
                    Construction Details
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('buildingConstruction')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Construction Type</InputLabel>
                    <MuiSelect
                      label="Construction Type"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'construction_type',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingConstruction',
                          'Construction Type'
                        )
                      }
                    >
                      <MenuItem value="">Select Construction Type</MenuItem>
                      <MenuItem value="rcc">RCC</MenuItem>
                      <MenuItem value="steel">Steel</MenuItem>
                      <MenuItem value="prefab">Pre-Fab</MenuItem>
                      <MenuItem value="loadbearing">Load Bearing</MenuItem>
                      <MenuItem value="other">Other (Manual Entry)</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Number of Floors"
                    placeholder="e.g., G + 3 = 4"
                    variant="outlined"
                    fullWidth
                    type="number"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'number_of_floors',
                        (e.target as HTMLInputElement).value,
                        'number',
                        'buildingConstruction',
                        'Number of Floors'
                      )
                    }
                  />
                  <div className="flex gap-2">
                    <TextField
                      label="Built-up Area"
                      placeholder="Enter area"
                      variant="outlined"
                      type="number"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'built_up_area',
                          (e.target as HTMLInputElement).value,
                          'number',
                          'buildingConstruction',
                          'Built-up Area'
                        )
                      }
                    />
                    <FormControl
                      sx={{
                        minWidth: 100,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    >
                      <InputLabel>Unit</InputLabel>
                      <MuiSelect
                        label="Unit"
                        defaultValue="sqft"
                        onChange={(e) =>
                          handleExtraFieldChange(
                            'built_up_area_unit',
                            (e.target as HTMLInputElement).value,
                            'select',
                            'buildingConstruction',
                            'Built-up Area Unit'
                          )
                        }
                      >
                        <MenuItem value="sqft">Sq. Ft.</MenuItem>
                        <MenuItem value="sqm">Sq. M.</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <DatePicker
                    label="Date of Construction"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'date_of_construction',
                        date,
                        'date',
                        'buildingConstruction',
                        'Date of Construction'
                      )
                    }
                  />

                  {/* Custom Fields */}
                  {customFields.buildingConstruction.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('buildingConstruction', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange('buildingConstruction', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('buildingConstruction', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Acquisition & Value */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Acquisition & Value
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('buildingAcquisition')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePicker
                    label="Date of Acquisition"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }
                      }
                    }}
                    onChange={(date) =>
                      handleExtraFieldChange(
                        'date_of_acquisition',
                        date,
                        'date',
                        'buildingAcquisition',
                        'Date of Acquisition'
                      )
                    }
                  />
                  <div className="flex gap-2">
                    <FormControl
                      sx={{
                        minWidth: 80,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    >
                      <InputLabel>Currency</InputLabel>
                      <MuiSelect
                        label="Currency"
                        defaultValue="inr"
                        onChange={(e) =>
                          handleExtraFieldChange(
                            'acquisition_currency',
                            (e.target as HTMLInputElement).value,
                            'select',
                            'buildingAcquisition',
                            'Acquisition Currency'
                          )
                        }
                      >
                        <MenuItem value="inr">INR</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Acquisition Cost"
                      placeholder="Enter cost"
                      variant="outlined"
                      type="number"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'acquisition_cost',
                          (e.target as HTMLInputElement).value,
                          'number',
                          'buildingAcquisition',
                          'Acquisition Cost'
                        )
                      }
                    />
                  </div>
                  <TextField
                    label="Depreciation Rate (%)"
                    placeholder="Enter depreciation rate"
                    variant="outlined"
                    fullWidth
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'depreciation_rate',
                        (e.target as HTMLInputElement).value,
                        'number',
                        'buildingAcquisition',
                        'Depreciation Rate'
                      )
                    }
                  />
                  <div className="flex gap-2">
                    <FormControl
                      sx={{
                        minWidth: 80,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    >
                      <InputLabel>Currency</InputLabel>
                      <MuiSelect
                        label="Currency"
                        defaultValue="inr"
                        onChange={(e) =>
                          handleExtraFieldChange(
                            'book_value_currency',
                            (e.target as HTMLInputElement).value,
                            'select',
                            'buildingAcquisition',
                            'Book Value Currency'
                          )
                        }
                      >
                        <MenuItem value="inr">INR</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Current Book Value"
                      placeholder="Enter book value"
                      variant="outlined"
                      type="number"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <FormControl
                      sx={{
                        minWidth: 80,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    >
                      <InputLabel>Currency</InputLabel>
                      <MuiSelect
                        label="Currency"
                        defaultValue="inr"
                        onChange={(e) =>
                          handleExtraFieldChange(
                            'market_value_currency',
                            (e.target as HTMLInputElement).value,
                            'select',
                            'buildingAcquisition',
                            'Market Value Currency'
                          )
                        }
                      >
                        <MenuItem value="inr">INR</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Current Market Value"
                      placeholder="Enter market value"
                      variant="outlined"
                      type="number"
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'market_value',
                          (e.target as HTMLInputElement).value,
                          'number',
                          'buildingAcquisition',
                          'Market Value'
                        )
                      }
                    />
                  </div>

                  {/* Custom Fields */}
                  {customFields.buildingAcquisition.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('buildingAcquisition', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange('buildingAcquisition', field.id, e.target.value);
                        }
                        }
                      />
                      <button
                        onClick={() => removeCustomField('buildingAcquisition', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Usage & Compliance
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('buildingUsage')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Building Use</InputLabel>
                    <MuiSelect
                      label="Building Use"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'building_use',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingUsage',
                          'Building Use'
                        )
                      }
                    >
                      <MenuItem value="">Select Building Use</MenuItem>
                      <MenuItem value="office">Office</MenuItem>
                      <MenuItem value="warehouse">Warehouse</MenuItem>
                      <MenuItem value="school">School</MenuItem>
                      <MenuItem value="other">Other (Manual Entry)</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Fire Safety Certification</InputLabel>
                    <MuiSelect
                      label="Fire Safety Certification"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'fire_safety_certification',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingUsage',
                          'Fire Safety Certification'
                        )
                      }
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField
                    label="Occupancy Certificate No."
                    placeholder="Enter certificate ID"
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                    onChange={(e) =>
                      handleExtraFieldChange(
                        'occupancy_certificate_no',
                        (e.target as HTMLInputElement).value,
                        'text',
                        'buildingUsage',
                        'Occupancy Certificate No.'
                      )
                    }
                  />
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Structural Safety Certificate</InputLabel>
                    <MuiSelect
                      label="Structural Safety Certificate"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'structural_safety_certificate',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingUsage',
                          'Structural Safety Certificate'
                        )
                      }
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                      <MenuItem value="lastUpdated">Last Updated Date Option</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}

                  >
                    <InputLabel>Utility Connections</InputLabel>
                    <MuiSelect
                      label="Utility Connections"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'utility_connections',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingUsage',
                          'Utility Connections'
                        )
                      }
                    >
                      <MenuItem value="">Select Utilities</MenuItem>
                      <MenuItem value="water">Water</MenuItem>
                      <MenuItem value="electricity">Electricity</MenuItem>
                      <MenuItem value="both">Water & Electricity</MenuItem>
                      <MenuItem value="other">Other (Manual Entry)</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  {/* Custom Fields */}
                  {customFields.buildingUsage.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('buildingUsage', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {
                          handleCustomFieldChange('buildingLocation', field.id, e.target.value);
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('buildingUsage', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance & Linkages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Maintenance & Linkages
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('buildingMaintenance')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>Maintenance Responsibility</InputLabel>
                    <MuiSelect
                      label="Maintenance Responsibility"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'maintenance_responsibility',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingMaintenance',
                          'Maintenance Responsibility'
                        )
                      }
                    >
                      <MenuItem value="">Select Department/Team</MenuItem>
                      <MenuItem value="facilities">Facilities Management</MenuItem>
                      <MenuItem value="admin">Administration</MenuItem>
                      <MenuItem value="outsourced">Outsourced</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '36px', md: '45px' }
                      }
                    }}
                  >
                    <InputLabel>AMC / PPM Linked</InputLabel>
                    <MuiSelect
                      label="AMC / PPM Linked"
                      defaultValue=""
                      onChange={(e) =>
                        handleExtraFieldChange(
                          'amc_ppm_linked',
                          (e.target as HTMLInputElement).value,
                          'select',
                          'buildingMaintenance',
                          'AMC / PPM Linked'
                        )
                      }
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  {/* Custom Fields */}
                  {customFields.buildingMaintenance.map((field) => (
                    <div key={field.id} className="relative">
                      <TextField
                        label={field.name}
                        placeholder={`Enter ${field.name}`}
                        variant="outlined"
                        fullWidth
                        value={field.value}
                        // onChange={(e) => handleCustomFieldChange('buildingMaintenance', field.id, e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                        onChange={(e) => {

                          handleCustomFieldChange('buildingMaintenance', field.id, e.target.value);

                        }}
                      />
                      <button
                        onClick={() => removeCustomField('buildingMaintenance', field.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Miscellaneous */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    Miscellaneous
                  </div>
                  <button
                    onClick={() => openCustomFieldModal('buildingMiscellaneous')}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextField
                  label="Remarks / Notes"
                  placeholder="Special remarks like shared floor, rent info, etc."
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      
                    }
                  }}
                  onChange={(e) =>
                    handleExtraFieldChange(
                      'remarks',
                      (e.target as HTMLInputElement).value,
                      'text',
                      'buildingMiscellaneous',
                      'Remarks / Notes'
                    )
                  }
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                    className="hidden"
                    id="building-attachments"
                    onChange={e => handleFileUpload('buildingAttachments', e.target.files)}
                  />
                  <label htmlFor="building-attachments" className="cursor-pointer">
                    <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Click to upload attachments
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload blueprints, tax receipts, occupancy certificate, etc.
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Max 10MB per file, 50MB total. Images will be compressed automatically.
                    </p>
                  </label>
                  {attachments.buildingAttachments && attachments.buildingAttachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {attachments.buildingAttachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                          <div className="flex flex-col truncate">
                            <span className="text-xs sm:text-sm truncate">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          <button onClick={() => removeFile('buildingAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="text-xs text-gray-500 mt-1">
                        Total: {attachments.buildingAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                          ? `${(attachments.buildingAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                          : `${(attachments.buildingAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Fields */}
                {customFields.buildingMiscellaneous.map((field) => (
                  <div key={field.id} className="relative">
                    <TextField
                      label={field.name}
                      placeholder={`Enter ${field.name}`}
                      variant="outlined"
                      fullWidth
                      value={field.value}
                      // onChange={(e) => handleCustomFieldChange('buildingMiscellaneous', field.id, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                      onChange={(e) => {
                        handleCustomFieldChange('buildingMiscellaneous', field.id, e.target.value);
                      }
                      }
                    />
                    <button
                      onClick={() => removeCustomField('buildingMiscellaneous', field.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <AssetImageUpload
              categoryName="Building"
              categoryKey="buildingAssetImage"
              onImageUpload={handleFileUpload}
              onImageRemove={removeFile}
              images={attachments.buildingAssetImage}
            />
          </div>
        </LocalizationProvider>
      )}

      {/* Conditional Sections - Show only for specific asset categories */}
      {(selectedAssetCategory === 'Furniture & Fixtures' ||
        selectedAssetCategory === 'IT Equipment' ||
        selectedAssetCategory === 'Machinery & Equipment' || selectedAssetCategory === 'Meter' ||
        selectedAssetCategory === 'Tools & Instruments') && (
          <>
            

            {/* Location Details */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div onClick={() => toggleSection('location')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                  <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  LOCATION DETAILS
                </div>
                <div className="flex items-center gap-2">
                  {expandedSections.location ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              {expandedSections.location && <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {/* Site Dropdown */}
                  <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id="site-select-label" shrink>Site</InputLabel>
                    <MuiSelect
                      labelId="site-select-label"
                      label="Site"
                      displayEmpty
                      value={selectedLocation.site}
                      onChange={(e) => {
                        handleLocationChange('site', e.target.value);
                        handleFieldChange('pms_site_id', e.target.value);
                      }}
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Site</em></MenuItem>
                      {sites.map((site) => (
                        <MenuItem key={site.id} value={site.id.toString()}>
                          {site.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Building Dropdown */}
                  <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id="building-select-label" shrink>Building</InputLabel>
                    <MuiSelect
                      labelId="building-select-label"
                      label="Building"
                      displayEmpty
                      value={selectedLocation.building}
                      onChange={(e) => {
                        handleLocationChange('building', e.target.value);
                        handleFieldChange('pms_building_id', e.target.value);
                      }
                      }
                      sx={fieldStyles}
                      disabled={!selectedLocation.site || loading.buildings}
                    >
                      <MenuItem value=""><em>Select Building</em></MenuItem>
                      {buildings.map((building) => (
                        <MenuItem key={building.building.id} value={building.building.id.toString()}>
                          {building.building.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Wing Dropdown */}
                  <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
                    <MuiSelect
                      labelId="wing-select-label"
                      label="Wing"
                      displayEmpty
                      value={selectedLocation.wing}
                      onChange={(e) => {
                        handleLocationChange('wing', e.target.value);
                        handleFieldChange('pms_wing_id', e.target.value);
                      }}
                      sx={fieldStyles}
                      disabled={!selectedLocation.building || loading.wings}
                    >
                      <MenuItem value=""><em>Select Wing</em></MenuItem>
                      {wings.map((wing) => (
                        <MenuItem key={wing.wings.id} value={wing.wings.id.toString()}>
                          {wing.wings.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Area Dropdown */}
                  <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id="area-select-label" shrink>Area</InputLabel>
                    <MuiSelect
                      labelId="area-select-label"
                      label="Area"
                      displayEmpty
                      value={selectedLocation.area}
                      onChange={(e) => {
                        handleLocationChange('area', e.target.value);
                        handleFieldChange('pms_area_id', e.target.value);
                      }}
                      sx={fieldStyles}
                      disabled={!selectedLocation.wing || loading.areas}
                    >
                      <MenuItem value=""><em>Select Area</em></MenuItem>
                      {areas.map((area) => (
                        <MenuItem key={area.id} value={area.id.toString()}>
                          {area.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  {/* Floor Dropdown */}
                  <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
                    <MuiSelect
                      labelId="floor-select-label"
                      label="Floor"
                      displayEmpty
                      value={selectedLocation.floor}
                      onChange={(e) => {
                        handleLocationChange('floor', e.target.value);
                        handleFieldChange('pms_floor_id', e.target.value);
                      }}
                      sx={fieldStyles}
                      disabled={!selectedLocation.area || loading.floors}
                    >
                      <MenuItem value=""><em>Select Floor</em></MenuItem>
                      {floors.map((floor) => (
                        <MenuItem key={floor.id} value={floor.id.toString()}>
                          {floor.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  {/* Room Dropdown */}
                  <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id="room-select-label" shrink>Room</InputLabel>
                    <MuiSelect
                      labelId="room-select-label"
                      label="Room"
                      displayEmpty
                      value={selectedLocation.room}
                      onChange={(e) => {
                        handleLocationChange('room', e.target.value);
                        handleFieldChange('pms_room_id', e.target.value);
                      }}
                      sx={fieldStyles}
                      disabled={!selectedLocation.floor || loading.rooms}
                    >
                      <MenuItem value=""><em>Select Room</em></MenuItem>
                      {rooms.map((room) => (
                        <MenuItem key={room.rooms.id} value={room.rooms.id.toString()}>
                          {room.rooms.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>

                {/* Custom Fields */}
                {customFields.locationDetails.map((field) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <TextField
                      label={field.name}
                      value={field.value}
                      onChange={(e) => { handleCustomFieldChange('locationDetails', field.id, e.target.value); }}
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}

                    />
                    <button
                      onClick={() => removeCustomField('locationDetails', field.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>}
            </div>

            {/* Asset Details */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div onClick={() => toggleSection('asset')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                  <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  ASSET DETAILS
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openCustomFieldModal('assetDetails')} className="px-3 py-1 rounded text-sm flex items-center gap-1" style={{
                    backgroundColor: '#F6F4EE',
                    color: '#C72030'
                  }}>
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                  {expandedSections.asset ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              {expandedSections.asset && <div className="p-4 sm:p-6">
                {/* First row: Asset Name, Model No., Manufacturer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <TextField 
                    required 
                    label="Asset Name" 
                    placeholder="Enter Asset Name" 
                    name="assetName" 
                    fullWidth 
                    variant="outlined" 
                    value={formData.name || ''}
                    error={hasValidationError('Asset Name')}
                    helperText={hasValidationError('Asset Name') ? 'Asset Name is required' : ''}
                    InputLabelProps={{
                      shrink: true
                    }} 
                    InputProps={{
                      sx: fieldStyles
                    }}
                    onChange={e => handleFieldChange('name', e.target.value)}
                  />
                  <TextField 
                    required 
                    label="Model No." 
                    placeholder="Enter Model No" 
                    name="modelNo" 
                    fullWidth 
                    variant="outlined" 
                    value={formData.model_number || ''}
                    error={hasValidationError('Model No')}
                    helperText={hasValidationError('Model No') ? 'Model No. is required' : ''}
                    InputLabelProps={{
                      shrink: true
                    }} 
                    InputProps={{
                      sx: fieldStyles
                    }}
                    onChange={e => handleFieldChange('model_number', e.target.value)}
                  />
                  <TextField 
                    required 
                    label="Manufacturer" 
                    placeholder="Enter Manufacturer" 
                    name="manufacturer" 
                    fullWidth 
                    variant="outlined" 
                    value={formData.manufacturer || ''}
                    error={hasValidationError('Manufacturer')}
                    helperText={hasValidationError('Manufacturer') ? 'Manufacturer is required' : ''}
                    InputLabelProps={{
                      shrink: true
                    }} 
                    InputProps={{
                      sx: fieldStyles
                    }}
                    onChange={e => handleFieldChange('manufacturer', e.target.value)}
                  />
                  {/* }}
                    onChange={e => handleFieldChange('manufacturer', e.target.value)}

                  /> */}
                </div>

                {/* Second row: Group, Subgroup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <FormControl fullWidth variant="outlined" sx={{
                    minWidth: 120
                  }}>
                    <InputLabel id="group-select-label" shrink>Group</InputLabel>
                    <MuiSelect
                      labelId="group-select-label"
                      label="Group"
                      displayEmpty
                      value={selectedGroup}
                      onChange={(e) => {
                        handleGroupChange(e.target.value);
                        handleFieldChange('pms_asset_group_id', e.target.value);
                      }}
                      sx={fieldStyles}
                      required
                      disabled={groupsLoading}
                    >
                      <MenuItem value=""><em>{groupsLoading ? 'Loading...' : 'Select Group'}</em></MenuItem>
                      {groups.map((group) => (
                        <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <FormControl fullWidth variant="outlined" sx={{
                    minWidth: 120
                  }}>
                    <InputLabel id="subgroup-select-label" shrink>Subgroup</InputLabel>
                    <MuiSelect
                      labelId="subgroup-select-label"
                      label="Subgroup"
                      displayEmpty
                      value={formData.pms_asset_sub_group_id}
                      // onChange={(e) => setSelectedSubgroup(e.target.value)}
                      onChange={e => handleFieldChange('pms_asset_sub_group_id', e.target.value)}
                      sx={fieldStyles}
                      required
                      disabled={subgroupsLoading || !selectedGroup}
                    >
                      <MenuItem value=""><em>{subgroupsLoading ? 'Loading...' : 'Select Sub-Group'}</em></MenuItem>
                      {subgroups.map((subgroup) => (
                        <MenuItem key={subgroup.id} value={subgroup.id}>{subgroup.name}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>

                {/* Custom Fields are now handled per section */}

                {/* Third row: Status */}
                <div className="mb-4">
                  <div>
                    <label className="text-sm font-medium text-[#C72030] mb-2 block">Status</label>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="status-inuse" name="status" value="false" defaultChecked className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }}
                          onChange={e => handleFieldChange('breakdown', e.target.value)}
                        />
                        <label htmlFor="status-inuse" className="text-sm">In Use</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="status-breakdown" name="status" value="true" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }}
                          onChange={e => handleFieldChange('breakdown', e.target.value)}
                        />
                        <label htmlFor="status-breakdown" className="text-sm">Breakdown</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Critical - Moved from Meter Details */}
                <div className="mb-4">
                  <div>
                    <label className="text-sm font-medium text-[#C72030] mb-2 block">Critical</label>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="critical-yes"
                          name="critical"
                          value="yes"
                          checked={criticalStatus === 'yes'}
                          onChange={e => {
                            setCriticalStatus(e.target.value);
                            handleFieldChange('critical', e.target.value);
                          }}
                          className="w-4 h-4 text-[#C72030] border-gray-300"
                          style={{
                            accentColor: '#C72030'
                          }}
                        />
                        <label htmlFor="critical-yes" className="text-sm">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="critical-no" name="critical" value="no" checked={criticalStatus === 'no'} onChange={e => {
                          setCriticalStatus(e.target.value);
                          handleFieldChange('critical', e.target.value);
                        }} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }} />
                        <label htmlFor="critical-no" className="text-sm">No</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            </div>

            {/* IT Assets Details - Show only for IT Equipment */}
            {selectedAssetCategory === 'IT Equipment' && (
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div onClick={() => toggleSection('warranty')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    IT ASSETS DETAILS
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">If Applicable</span>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" id="it-assets-toggle" checked={itAssetsToggle} onChange={e => handleItAssetsToggleChange(e.target.checked)} />
                        <label htmlFor="it-assets-toggle" className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${itAssetsToggle ? 'bg-green-400' : 'bg-gray-300'}`}>
                          <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${itAssetsToggle ? 'translate-x-6' : 'translate-x-1'}`}></span>
                        </label>
                      </div>
                    </div>
                    <button onClick={() => setItAssetsCustomFieldModalOpen(true)} className="px-3 py-1 rounded text-sm flex items-center gap-1 hover:opacity-80" style={{
                      backgroundColor: '#F6F4EE',
                      color: '#C72030'
                    }}>
                      <Plus className="w-4 h-4" />
                      Custom Field
                    </button>
                    {expandedSections.warranty ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
                {expandedSections.warranty && <div className={`p-4 sm:p-6 ${!itAssetsToggle ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* System Details */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4" style={{
                      color: itAssetsToggle ? '#C72030' : '#9CA3AF'
                    }}>SYSTEM DETAILS</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <TextField 
                        label="OS" 
                        placeholder="Enter OS" 
                        name="os" 
                        fullWidth 
                        variant="outlined" 
                        value={itAssetDetails.system_details.os}
                        onChange={(e) => handleItAssetDetailsChange('system_details', 'os', e.target.value)}
                        disabled={!itAssetsToggle}
                        InputLabelProps={{
                          shrink: true
                        }} 
                        InputProps={{
                          sx: fieldStyles
                        }}
                      />

                      <TextField 
                        label="Total Memory" 
                        placeholder="Enter Total Memory" 
                        name="totalMemory" 
                        fullWidth 
                        variant="outlined" 
                        value={itAssetDetails.system_details.memory}
                        onChange={(e) => handleItAssetDetailsChange('system_details', 'memory', e.target.value)}
                        disabled={!itAssetsToggle}
                        InputLabelProps={{
                          shrink: true
                        }} 
                        InputProps={{
                          sx: fieldStyles
                        }} 
                      />
                      <TextField 
                        label="Processor" 
                        placeholder="Enter Processor" 
                        name="processor" 
                        fullWidth 
                        variant="outlined" 
                        value={itAssetDetails.system_details.processor}
                        onChange={(e) => handleItAssetDetailsChange('system_details', 'processor', e.target.value)}
                        disabled={!itAssetsToggle}
                        InputLabelProps={{
                          shrink: true
                        }} 
                        InputProps={{
                          sx: fieldStyles
                        }} 
                      />

                      {/* Custom Fields for System Details */}
                      {itAssetsCustomFields['System Details'].map(field => <div key={field.id} className="relative">
                        <TextField label={field.name} placeholder={`Enter ${field.name}`} value={field.value} onChange={e => handleItAssetsCustomFieldChange('System Details', field.id, e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                          shrink: true
                        }} InputProps={{
                          sx: fieldStyles
                        }} />
                        <button onClick={() => removeItAssetsCustomField('System Details', field.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>)}
                    </div>
                  </div>

                  {/* Hardware Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      {isEditingHardDiskHeading ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingHardDiskHeadingText}
                            onChange={(e) => setEditingHardDiskHeadingText(e.target.value)}
                            className="font-semibold text-sm bg-transparent border-b focus:outline-none"
                            style={{ color: '#C72030', borderColor: '#C72030' }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setHardDiskHeading(editingHardDiskHeadingText);
                                localStorage.setItem('hardDiskHeading', editingHardDiskHeadingText);
                                setIsEditingHardDiskHeading(false);
                              }
                              if (e.key === 'Escape') {
                                setEditingHardDiskHeadingText(hardDiskHeading);
                                setIsEditingHardDiskHeading(false);
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              setHardDiskHeading(editingHardDiskHeadingText);
                              localStorage.setItem('hardDiskHeading', editingHardDiskHeadingText);
                              setIsEditingHardDiskHeading(false);
                            }}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold" style={{ color: '#C72030' }}>{hardDiskHeading}</h3>
                          <button
                            onClick={() => {
                              setEditingHardDiskHeadingText(hardDiskHeading);
                              setIsEditingHardDiskHeading(true);
                            }}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <TextField 
                        label="Model" 
                        placeholder="Enter Model" 
                        name="hdModel" 
                        fullWidth 
                        variant="outlined" 
                        value={itAssetDetails.hardware.model}
                        onChange={(e) => handleItAssetDetailsChange('hardware', 'model', e.target.value)}
                        disabled={!itAssetsToggle}
                        InputLabelProps={{
                          shrink: true
                        }} 
                        InputProps={{
                          sx: fieldStyles
                        }} 
                      />
                      <TextField 
                        label="Serial No." 
                        placeholder="Enter Serial No." 
                        name="hdSerialNo" 
                        fullWidth 
                        variant="outlined" 
                        value={itAssetDetails.hardware.serial_no}
                        onChange={(e) => handleItAssetDetailsChange('hardware', 'serial_no', e.target.value)}
                        disabled={!itAssetsToggle}
                        InputLabelProps={{
                          shrink: true
                        }} 
                        InputProps={{
                          sx: fieldStyles
                        }} 
                      />
                      <TextField 
                        label="Capacity" 
                        placeholder="Enter Capacity" 
                        name="hdCapacity" 
                        fullWidth 
                        variant="outlined" 
                        value={itAssetDetails.hardware.capacity}
                        onChange={(e) => handleItAssetDetailsChange('hardware', 'capacity', e.target.value)}
                        disabled={!itAssetsToggle}
                        InputLabelProps={{
                          shrink: true
                        }} 
                        InputProps={{
                          sx: fieldStyles
                        }} 
                      />

                      {/* Custom Fields for Hardware Details */}
                      {itAssetsCustomFields['Hardware Details'].map(field => <div key={field.id} className="relative">
                        <TextField label={field.name} placeholder={`Enter ${field.name}`} value={field.value} onChange={e => handleItAssetsCustomFieldChange('Hardware Details', field.id, e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                          shrink: true
                        }} InputProps={{
                          sx: fieldStyles
                        }} />
                        <button onClick={() => removeItAssetsCustomField('Hardware Details', field.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>)}
                    </div>
                  </div>
                </div>}
              </div>
            )}

            {/* Meter Details */}
            {selectedAssetCategory !== 'Tools & Instruments' && selectedAssetCategory !== 'Furniture & Fixtures' && selectedAssetCategory !== 'IT Equipment' && (
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div onClick={() => toggleSection('meterCategory')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                    <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    METER DETAILS
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">If Applicable</span>
                      <div className="relative inline-block w-12 h-6">
                        <input type="checkbox" className="sr-only peer" id="meter-details-toggle" checked={meterDetailsToggle} onChange={e => handleMeterDetailsToggleChange(e.target.checked)} />
                        <label htmlFor="meter-details-toggle" className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${meterDetailsToggle ? 'bg-green-400' : 'bg-gray-300'}`}>
                          <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${meterDetailsToggle ? 'translate-x-6' : 'translate-x-1'}`}></span>
                        </label>
                      </div>
                    </div>
                    {expandedSections.meterCategory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
                {expandedSections.meterCategory && <div className={`p-4 sm:p-6 ${!meterDetailsToggle ? 'opacity-50 pointer-events-none' : ''}`}>
                  {/* Meter Type */}
                  <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[#C72030] font-medium text-sm sm:text-base">Meter Type</span>
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="meter-type-parent" 
                            name="meter_tag_type" 
                            value="ParentMeter" 
                            checked={meterType === 'ParentMeter'} 
                            onChange={e => {
                              setMeterType(e.target.value);
                              handleFieldChange('meter_tag_type', e.target.value);
                            }} 
                            disabled={!meterDetailsToggle}
                            className="w-4 h-4 text-[#C72030] border-gray-300" 
                            style={{
                              accentColor: '#C72030'
                            }} 
                          />
                          <label htmlFor="meter-type-parent" className={`text-sm ${!meterDetailsToggle ? 'text-gray-400' : ''}`}>Parent</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="meter-type-sub" 
                            name="meter_tag_type" 
                            value="SubMeter" 
                            checked={meterType === 'SubMeter'} 
                            onChange={e => { 
                              setMeterType(e.target.value); 
                              handleFieldChange('meter_tag_type', e.target.value); 
                            }} 
                            disabled={!meterDetailsToggle}
                            className="w-4 h-4 text-[#C72030] border-gray-300" 
                            style={{
                              accentColor: '#C72030'
                            }} 
                          />
                          <label htmlFor="meter-type-sub" className={`text-sm ${!meterDetailsToggle ? 'text-gray-400' : ''}`}>Sub</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parent Meter Dropdown - Show only when Sub Meter is selected */}
                  {meterType === 'SubMeter' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Meter <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={selectedParentMeterId}
                        onValueChange={(value) => {
                          setSelectedParentMeterId(value);
                          handleFieldChange('parent_meter_id', value);
                        }}
                        disabled={parentMeterLoading || !meterDetailsToggle}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={parentMeterLoading ? "Loading..." : "Select Parent Meter"} />
                        </SelectTrigger>
                        <SelectContent>
                          {parentMeters.map((meter) => (
                            <SelectItem key={meter.id} value={meter.id.toString()}>
                              {meter.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Meter Category Type */}
                  <div className="mb-6">
                    <div className="rounded-lg p-4 bg-[#f6f4ee]">
                      <h3 className="font-medium mb-4 text-sm sm:text-base text-orange-700">METER DETAILS</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                        {getMeterCategoryOptions().map(option => {
                          const IconComponent = option.icon;
                          return <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                            <div className="flex items-center justify-center space-x-2">
                              <input type="radio" id={option.value} name="meterCategory" value={option.value} checked={meterCategoryType === option.value} onChange={e => handleMeterCategoryChange(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" style={{
                                accentColor: '#C72030'
                              }} />
                              <IconComponent className="w-4 h-4 text-gray-600" />
                              <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                            </div>
                          </div>;
                        })}
                      </div>

                      {/* Board Ratio Options (Second Image) */}
                      {showBoardRatioOptions && <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {getBoardRatioOptions().map(option => {
                          const IconComponent = option.icon;
                          return <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                            <div className="flex items-center justify-center space-x-2">
                              <input type="radio" id={`board-${option.value}`} name="boardRatioCategory" value={option.value} checked={subCategoryType === option.value} onChange={e => setSubCategoryType(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" style={{
                                accentColor: '#C72030'
                              }} />
                              <IconComponent className="w-4 h-4 text-gray-600" />
                              <label htmlFor={`board-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                            </div>
                          </div>;
                        })}
                      </div>}

                      {/* Renewable Options */}
                      {showRenewableOptions && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {getRenewableOptions().map(option => {
                          const IconComponent = option.icon;
                          return <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                            <div className="flex items-center justify-center space-x-2">
                              <input type="radio" id={`renewable-${option.value}`} name="renewableCategory" value={option.value} checked={subCategoryType === option.value} onChange={e => setSubCategoryType(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" style={{
                                accentColor: '#C72030'
                              }} />
                              <IconComponent className="w-4 h-4 text-gray-600" />
                              <label htmlFor={`renewable-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                            </div>
                          </div>;
                        })}
                      </div>}
                    </div>
                  </div>

                  {/* Meter Measure Fields - Show based on meter type selection */}
                  {meterType === 'ParentMeter' && (
                    <>
                      <MeterMeasureFields
                        title="CONSUMPTION METER MEASURE"
                        fields={consumptionMeasureFields}
                        showCheckPreviousReading={true}
                        onFieldChange={(id, field, value) =>
                          handleMeterMeasureFieldChange('consumption', id, field, value)
                        }
                        onAddField={() => addMeterMeasureField('consumption')}
                        onRemoveField={(id) => removeMeterMeasureField('consumption', id)}
                        unitTypes={meterUnitTypes}
                        loadingUnitTypes={loadingUnitTypes}
                      />
                      <MeterMeasureFields
                        title="NON CONSUMPTION METER MEASURE"
                        fields={nonConsumptionMeasureFields}
                        showCheckPreviousReading={false}
                        onFieldChange={(id, field, value) =>
                          handleMeterMeasureFieldChange('nonConsumption', id, field, value)
                        }
                        onAddField={() => addMeterMeasureField('nonConsumption')}
                        onRemoveField={(id) => removeMeterMeasureField('nonConsumption', id)}
                        unitTypes={meterUnitTypes}
                        loadingUnitTypes={loadingUnitTypes}
                      />
                    </>
                  )}

                  {meterType === 'SubMeter' && (
                    <MeterMeasureFields
                      title="NON CONSUMPTION METER MEASURE"
                      fields={nonConsumptionMeasureFields}
                      showCheckPreviousReading={false}
                      onFieldChange={(id, field, value) =>
                        handleMeterMeasureFieldChange('nonConsumption', id, field, value)
                      }
                      onAddField={() => addMeterMeasureField('nonConsumption')}
                      onRemoveField={(id) => removeMeterMeasureField('nonConsumption', id)}
                      unitTypes={meterUnitTypes}
                      loadingUnitTypes={loadingUnitTypes}
                    />
                  )}
                </div>}
              </div>
            )}

            {/* Purchase Details */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div onClick={() => toggleSection('consumption')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                  <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  PURCHASE DETAILS
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCustomFieldModal('purchaseDetails');
                    }}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
                  {expandedSections.consumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              {expandedSections.consumption && <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <TextField required label="Purchase Cost" placeholder="Enter cost" name="purchaseCost" fullWidth variant="outlined" InputLabelProps={{
                    shrink: true
                  }} InputProps={{
                    sx: fieldStyles
                  }}
                    onChange={e => handleFieldChange('purchase_cost', e.target.value)}

                  />
                  <TextField required label="Purchase Date" placeholder="dd/mm/yyyy" name="purchaseDate" type="date" fullWidth variant="outlined" InputLabelProps={{
                    shrink: true
                  }} InputProps={{
                    sx: fieldStyles
                  }}
                    onChange={e => handleFieldChange('purchased_on', e.target.value)}

                  />
                  <TextField required label="Commissioning Date" placeholder="dd/mm/yyyy" name="commisioning_date" type="date" fullWidth variant="outlined" InputLabelProps={{
                    shrink: true
                  }} InputProps={{
                    sx: fieldStyles
                  }}
                    onChange={e => handleFieldChange('commisioning_date', e.target.value)}

                  />
                  <TextField required label="Warranty Expires On" placeholder="dd/mm/yyyy" name="warrantyExpiresOn" type="date" fullWidth variant="outlined" InputLabelProps={{
                    shrink: true
                  }} InputProps={{
                    sx: fieldStyles
                  }}
                    onChange={e => handleFieldChange('warranty_expiry', e.target.value)}

                  />
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Under Warranty</label>
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="warranty-yes" name="underWarranty" value="yes" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }}
                          checked={underWarranty === 'yes'}
                          onChange={e => {
                            setUnderWarranty(e.target.value);
                            handleFieldChange('warranty', 'Yes');
                          }}
                        />
                        <label htmlFor="warranty-yes" className="text-sm">Yes</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="warranty-no" name="underWarranty" value="no" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }}
                          onChange={e => {
                            setUnderWarranty(e.target.value);
                            handleFieldChange('warranty', 'No');
                            handleFieldChange('warranty_period', ''); // Clear period if No
                          }}
                        />
                        <label htmlFor="warranty-no" className="text-sm">No</label>
                      </div>
                    </div>
                  </div>

                  {underWarranty === 'yes' && (
                    <div className="mt-4">
                      <TextField
                        label="Warranty Period"
                        placeholder="e.g. 24 months"
                        fullWidth
                        value={formData.warranty_period}
                        onChange={e => handleFieldChange('warranty_period', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Custom Fields */}
                {customFields.purchaseDetails.map((field) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <TextField
                      label={field.name}
                      value={field.value}
                      onChange={(e) => { handleCustomFieldChange('purchaseDetails', field.id, e.target.value); }}
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    />
                    <button
                      onClick={() => removeCustomField('purchaseDetails', field.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>}
            </div>

            {/* Depreciation Rule */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div onClick={() => toggleSection('nonConsumption')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                  <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                    <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  DEPRECIATION RULE
                </div>
                <div className="flex items-center gap-2">
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCustomFieldModal('depreciationRule');
                    }}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button> */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">If Applicable</span>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" id="depreciation-toggle" checked={depreciationToggle} onChange={e => handleDepreciationToggleChange(e.target.checked)} />
                      <label htmlFor="depreciation-toggle" className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${depreciationToggle ? 'bg-green-400' : 'bg-gray-300'}`}>
                        <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${depreciationToggle ? 'translate-x-6' : 'translate-x-1'}`}></span>
                      </label>
                    </div>
                  </div>
                  {expandedSections.nonConsumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              {expandedSections.nonConsumption && <div className={`p-4 sm:p-6 ${!depreciationToggle ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="space-y-6">
                  {/* Method Section */}
                  <div>
                    <label className={`text-sm font-medium mb-4 block ${!depreciationToggle ? 'text-gray-400' : 'text-gray-700'}`}>Method</label>
                    <div className="flex gap-8">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="straight-line" 
                          name="depreciationMethod" 
                          value="straight_line" 
                          defaultChecked 
                          disabled={!depreciationToggle}
                          className="w-4 h-4 text-[#C72030] border-gray-300" 
                          style={{
                            accentColor: '#C72030'
                          }}
                          onChange={e => handleFieldChange('depreciation_method', e.target.value)}
                        />
                        <label htmlFor="straight-line" className={`text-sm ${!depreciationToggle ? 'text-gray-400' : ''}`}>Straight Line</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="wdv" 
                          name="depreciationMethod" 
                          value="wdv" 
                          disabled={!depreciationToggle}
                          className="w-4 h-4 text-[#C72030] border-gray-300" 
                          style={{
                            accentColor: '#C72030'
                          }}
                          onChange={e => handleFieldChange('depreciation_method', e.target.value)}
                        />
                        <label htmlFor="wdv" className={`text-sm ${!depreciationToggle ? 'text-gray-400' : ''}`}>WDV</label>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <TextField 
                      required 
                      label="Useful Life (in yrs)" 
                      placeholder="YRS" 
                      name="usefulLife" 
                      fullWidth 
                      variant="outlined" 
                      disabled={!depreciationToggle}
                      InputLabelProps={{
                        shrink: true
                      }} 
                      InputProps={{
                        sx: fieldStyles
                      }}
                      onChange={e => handleFieldChange('useful_life', e.target.value)}
                    />
                    <TextField 
                      required 
                      label="Salvage Value" 
                      placeholder="Enter Value" 
                      name="salvageValue" 
                      fullWidth 
                      variant="outlined" 
                      disabled={!depreciationToggle}
                      InputLabelProps={{
                        shrink: true
                      }} 
                      InputProps={{
                        sx: fieldStyles
                      }}
                      onChange={e => handleFieldChange('salvage_value', e.target.value)}
                    />
                    <TextField 
                      required 
                      label="Depreciation Rate" 
                      placeholder="Enter Value" 
                      name="depreciationRate" 
                      fullWidth 
                      variant="outlined" 
                      disabled={!depreciationToggle}
                      InputLabelProps={{
                        shrink: true
                      }} 
                      InputProps={{
                        sx: fieldStyles
                      }}
                      onChange={e => handleFieldChange('depreciation_rate', e.target.value)}
                    />
                  </div>

                  {/* Radio Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="configure-this" name="depreciation_applicable_for" value="only_this" defaultChecked className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }}
                          onChange={e => handleFieldChange('depreciation_applicable_for', e.target.value)}
                        />
                        <label htmlFor="configure-this" className="text-sm">Configure Depreciation Only For This</label>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="similar-product" name="depreciation_applicable_for" value="similar_product" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }}
                          onChange={e => handleFieldChange('depreciation_applicable_for', e.target.value)}
                        />
                        <label htmlFor="similar-product" className="text-sm">For Similar Product</label>
                      </div>
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {customFields.depreciationRule.map((field) => (
                    <div key={field.id} className="flex items-center gap-2 mb-2">
                      <TextField
                        label={field.name}
                        value={field.value}
                        onChange={(e) => { handleCustomFieldChange('depreciationRule', field.id, e.target.value); }}
                        variant="outlined"
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: { xs: '36px', md: '45px' }
                          }
                        }}
                      />
                      <button
                        onClick={() => removeCustomField('depreciationRule', field.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>}
            </div>

            {/* Asset Allocation */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div onClick={() => toggleSection('assetAllocation')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                  <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                    <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  ASSET ALLOCATION
                </div>
                {expandedSections.assetAllocation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              {expandedSections.assetAllocation && <div className="p-4 sm:p-6">
                <div className="space-y-6">
                  {/* Based On Section */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-4 block">Based On</label>
                    <div className="flex gap-8">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="allocation-department" name="allocationBasedOn" value="department" checked={allocationBasedOn === 'department'} onChange={e => setAllocationBasedOn(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }} />
                        <label htmlFor="allocation-department" className="text-sm">Department</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="allocation-users" name="allocationBasedOn" value="users" checked={allocationBasedOn === 'users'} onChange={e => setAllocationBasedOn(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }} />
                        <label htmlFor="allocation-users" className="text-sm">Users</label>
                      </div>
                    </div>
                  </div>

                  {/* Department/Users Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormControl fullWidth variant="outlined" sx={{
                      minWidth: 120
                    }}>
                      <InputLabel id="allocation-select-label" shrink>
                        {allocationBasedOn === 'department' ? 'Department' : 'Users'}*
                      </InputLabel>
                      <MuiSelect
                        labelId="allocation-select-label"
                        label={allocationBasedOn === 'department' ? 'Department' : 'Users'}
                        displayEmpty
                        multiple
                        value={allocationBasedOn === 'department' ? selectedDepartmentIds : selectedUserIds}
                        onChange={e => {
                          const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                          if (allocationBasedOn === 'department') {
                            setSelectedDepartmentIds(value);
                            handleArrayFieldChange('allocation_ids', value);
                            
                          } else {
                            setSelectedUserIds(value);
                            handleArrayFieldChange('allocation_ids', value);
                          }
                        }}
                        sx={fieldStyles}
                        required
                        disabled={allocationBasedOn === 'department' ? departmentsLoading : usersLoading}
                      >
                        <MenuItem value="">
                          <em>
                            {allocationBasedOn === 'department'
                              ? (departmentsLoading ? 'Loading departments...' : 'Select Department')
                              : (usersLoading ? 'Loading users...' : 'Select User')
                            }
                          </em>
                        </MenuItem>
                        {allocationBasedOn === 'department'
                          ? departments.map((department) => (
                            <MenuItem key={department.id} value={department.id}>
                              {department.department_name}
                            </MenuItem>
                          ))
                          : users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                              {user.full_name}
                            </MenuItem>
                          ))
                        }
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              </div>}
            </div>

            {/* Asset Loaned */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div onClick={() => toggleSection('assetLoaned')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                  <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  ASSET LOANED
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">If Applicable</span>
                    <div className="relative inline-block w-12 h-6">
                      <input type="checkbox" className="sr-only peer" id="asset-loaned-toggle" checked={assetLoanedToggle} onChange={e => handleAssetLoanedToggleChange(e.target.checked)} />
                      <label htmlFor="asset-loaned-toggle" className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${assetLoanedToggle ? 'bg-green-400' : 'bg-gray-300'}`}>
                        <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${assetLoanedToggle ? 'translate-x-6' : 'translate-x-1'}`}></span>
                      </label>

                    </div>
                  </div>
                  {expandedSections.assetLoaned ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              {expandedSections.assetLoaned && <div className={`p-4 sm:p-6 ${!assetLoanedToggle ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormControl fullWidth variant="outlined" sx={{
                    minWidth: 120
                  }}>
                    <InputLabel id="vendor-select-label" shrink>Vendor Name*</InputLabel>
                    <MuiSelect
                      labelId="vendor-select-label"
                      label="Vendor Name"
                      displayEmpty
                      value={selectedLoanedVendorId}
                      onChange={(e) => {setSelectedLoanedVendorId(e.target.value);
                         handleArrayFieldChange('loaned_from_vendor_id', e.target.value);}
                            
                      }
                      sx={fieldStyles}
                      required
                      disabled={vendorsLoading || !assetLoanedToggle}
                    >
                      <MenuItem value="">
                        <em>{vendorsLoading ? 'Loading vendors...' : 'Select Vendor'}</em>
                      </MenuItem>
                      {vendors.map((vendor) => (
                        <MenuItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                  <TextField 
                    required 
                    label="Agreement Start Date*" 
                    placeholder="dd/mm/yyyy" 
                    name="agreementStartDate" 
                    type="date" 
                    fullWidth 
                    variant="outlined" 
                    disabled={!assetLoanedToggle}
                    InputLabelProps={{
                      shrink: true
                    }} 
                    InputProps={{
                      sx: fieldStyles
                    }}
                    onChange={(e) => handleArrayFieldChange('agreement_from_date', e.target.value)}
                  />
                  <TextField 
                    required 
                    label="Agreement End Date*" 
                    placeholder="dd/mm/yyyy" 
                    name="agreementEndDate" 
                    type="date" 
                    fullWidth 
                    variant="outlined" 
                    disabled={!assetLoanedToggle}
                    InputLabelProps={{
                      shrink: true
                    }} 
                    InputProps={{
                      sx: fieldStyles
                    }}
                    onChange={(e) => handleArrayFieldChange('agreement_to_date', e.target.value)}
                  
                  />
                </div>
              </div>}
            </div>

            {/* AMC Details */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div onClick={() => toggleSection('amcDetails')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                  <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  AMC DETAILS
                </div>
                {expandedSections.amcDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              {expandedSections.amcDetails && <div className="p-4 sm:p-6">
                <div className="space-y-6">
                  {/* First Row - Vendor, Start Date, End Date, First Service, Payment Terms, No. of Visits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    <FormControl fullWidth variant="outlined" sx={{
                      minWidth: 120
                    }}>
                      <InputLabel id="amc-vendor-select-label" shrink>Vendor</InputLabel>
                      <MuiSelect
                        labelId="amc-vendor-select-label"
                        label="Vendor"
                        displayEmpty
                        value={selectedAmcVendorId}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedAmcVendorId(value);
                          handleNestedFieldChange('amc_detail', 'supplier_id', Number(value));
                        }}
                        sx={fieldStyles}
                        disabled={vendorsLoading}
                      >
                        <MenuItem value="">
                          <em>{vendorsLoading ? 'Loading vendors...' : 'Select Vendor'}</em>
                        </MenuItem>
                        {vendors.map((vendor) => (
                          <MenuItem key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>  

                    <TextField label="Start Date" placeholder="dd/mm/yyyy" name="amcStartDate" type="date" fullWidth variant="outlined" InputLabelProps={{
                      shrink: true
                    }} InputProps={{
                      sx: fieldStyles
                    }}
                      onChange={e => handleNestedFieldChange('amc_detail', 'amc_start_date', e.target.value)}
                    />

                    <TextField label="End Date" placeholder="dd/mm/yyyy" name="amcEndDate" type="date" fullWidth variant="outlined" InputLabelProps={{
                      shrink: true
                    }} InputProps={{
                      sx: fieldStyles
                    }}
                      onChange={e => handleNestedFieldChange('amc_detail', 'amc_end_date', e.target.value)}

                    />

                    <TextField label="First Service" placeholder="dd/mm/yyyy" name="amcFirstService" type="date" fullWidth variant="outlined" InputLabelProps={{
                      shrink: true
                    }} InputProps={{
                      sx: fieldStyles
                    }}
                      onChange={e => handleNestedFieldChange('amc_detail', 'amc_first_service', e.target.value)}

                    />

                    <FormControl fullWidth variant="outlined" sx={{
                      minWidth: 120
                    }}>
                      <InputLabel id="payment-terms-select-label" shrink>Payment Terms</InputLabel>
                      <MuiSelect labelId="payment-terms-select-label" label="Payment Terms" value={formData.amc_detail.payment_term} sx={fieldStyles}
                        onChange={e => handleNestedFieldChange('amc_detail', 'payment_term', e.target.value)}

                      >
                        <MenuItem value=""><em>Select Payment Terms</em></MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="quarterly">Quarterly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                      </MuiSelect>
                    </FormControl>

                    <TextField label="No. of Visits" placeholder="Enter Value" name="amcVisits" fullWidth variant="outlined" InputLabelProps={{
                      shrink: true
                    }} InputProps={{
                      sx: fieldStyles
                    }}

                      onChange={e => handleNestedFieldChange('amc_detail', 'no_of_visits', Number(e.target.value))}

                    />
                  </div>

                  {/* Second Row - AMC Cost */}
                  <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                    <TextField label="AMC Cost" placeholder="Enter AMC Cost" name="amcCost" fullWidth variant="outlined" InputLabelProps={{
                      shrink: true
                    }} InputProps={{
                      sx: fieldStyles
                    }}
                      onChange={e => handleNestedFieldChange('amc_detail', 'amc_cost', Number(e.target.value))}

                    />
                  </div>
                </div>
              </div>}
            </div>
            {/* Asset Image Upload for these categories */}
            {selectedAssetCategory === 'Furniture & Fixtures' && (
              <AssetImageUpload
                categoryName="Furniture & Fixtures"
                categoryKey="furnitureAssetImage"
                onImageUpload={handleFileUpload}
                onImageRemove={removeFile}
                images={attachments.furnitureAssetImage}
              />
            )}
            
            {selectedAssetCategory === 'IT Equipment' && (
              <AssetImageUpload
                categoryName="IT Equipment"
                categoryKey="itEquipmentAssetImage"
                onImageUpload={handleFileUpload}
                onImageRemove={removeFile}
                images={attachments.itEquipmentAssetImage}
              />
            )}
            
            {selectedAssetCategory === 'Machinery & Equipment' && (
              <AssetImageUpload
                categoryName="Machinery & Equipment"
                categoryKey="machineryAssetImage"
                onImageUpload={handleFileUpload}
                onImageRemove={removeFile}
                images={attachments.machineryAssetImage}
              />
            )}
            
            {selectedAssetCategory === 'Tools & Instruments' && (
              <AssetImageUpload
                categoryName="Tools & Instruments"
                categoryKey="toolsAssetImage"
                onImageUpload={handleFileUpload}
                onImageRemove={removeFile}
                images={attachments.toolsAssetImage}
              />
            )}
            
            {selectedAssetCategory === 'Meter' && (
              <AssetImageUpload
                categoryName="Meter"
                categoryKey="meterAssetImage"
                onImageUpload={handleFileUpload}
                onImageRemove={removeFile}
                images={attachments.meterAssetImage}
              />
            )}

            {/* Attachments */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div onClick={() => toggleSection('attachments')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
                <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                  <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  ATTACHMENTS
                </div>
                {expandedSections.attachments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
              {expandedSections.attachments && <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[{
                    label: 'Manuals Upload',
                    id: 'manuals-upload',
                    category: 'manualsUpload',
                    accept: '.pdf,.doc,.docx,.txt'
                  }, {
                    label: 'Insurance Details',
                    id: 'insurance-upload',
                    category: 'insuranceDetails',
                    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                  }, {
                    label: 'Purchase Invoice',
                    id: 'invoice-upload',
                    category: 'purchaseInvoice',
                    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                  }, {
                    label: 'AMC',
                    id: 'amc-upload',
                    category: 'amc',
                    accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                  }].map(field => <div key={field.id}>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">{field.label}</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input type="file" multiple accept={field.accept} onChange={e => handleFileUpload(field.category, e.target.files)} className="hidden" id={field.id} />
                      <label htmlFor={field.id} className="cursor-pointer block">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-[#C72030] font-medium text-xs sm:text-sm">Choose File</span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            {attachments[field.category].length > 0 ? `${attachments[field.category].length} file(s) selected` : 'No file chosen'}
                          </span>
                        </div>
                      </label>
                      {attachments[field.category].length > 0 && <div className="mt-2 space-y-1">
                        {attachments[field.category].map((file, index) => <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                          <span className="text-xs sm:text-sm truncate">{file.name}</span>
                          <button onClick={() => removeFile(field.category, index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>)}
                      </div>}
                      <div className="mt-2">
                        <label htmlFor={field.id}>
                          <button className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto">
                            <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
                            Upload Files
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>)}
                </div>
              </div>}

            </div>
          </>
        )}

      {/* Category-Specific Attachments */}
      {/* {selectedAssetCategory === 'Furniture & Fixtures' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-l-4 border-l-[#C72030] p-4 sm:p-6 bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-4">
              <Archive className="w-5 h-5" />
              FURNITURE & FIXTURES ATTACHMENTS
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="furniture-attachments"
                onChange={e => handleFileUpload('furnitureAttachments', e.target.files)}
              />
              <label htmlFor="furniture-attachments" className="cursor-pointer">
                <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload attachments</p>
                <p className="text-xs text-gray-500 mt-1">Upload invoices, warranties, assembly manuals, etc.</p>
                <p className="text-xs text-yellow-600 mt-1">Max 10MB per file, 50MB total. Images will be compressed automatically.</p>
              </label>
              {attachments.furnitureAttachments && attachments.furnitureAttachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.furnitureAttachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                      <div className="flex flex-col truncate">
                        <span className="text-xs sm:text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button onClick={() => removeFile('furnitureAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {attachments.furnitureAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                      ? `${(attachments.furnitureAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                      : `${(attachments.furnitureAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedAssetCategory === 'IT Equipment' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-l-4 border-l-[#C72030] p-4 sm:p-6 bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-4">
              <Archive className="w-5 h-5" />
              IT EQUIPMENT ATTACHMENTS
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="it-equipment-attachments"
                onChange={e => handleFileUpload('itEquipmentAttachments', e.target.files)}
              />
              <label htmlFor="it-equipment-attachments" className="cursor-pointer">
                <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload attachments</p>
                <p className="text-xs text-gray-500 mt-1">Upload user manuals, drivers, warranties, configuration docs, etc.</p>
                <p className="text-xs text-yellow-600 mt-1">Max 10MB per file, 50MB total. Images will be compressed automatically.</p>
              </label>
              {attachments.itEquipmentAttachments && attachments.itEquipmentAttachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.itEquipmentAttachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                      <div className="flex flex-col truncate">
                        <span className="text-xs sm:text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button onClick={() => removeFile('itEquipmentAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {attachments.itEquipmentAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                      ? `${(attachments.itEquipmentAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                      : `${(attachments.itEquipmentAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}

      {/* {selectedAssetCategory === 'Machinery & Equipment' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-l-4 border-l-[#C72030] p-4 sm:p-6 bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-4">
              <Archive className="w-5 h-5" />
              MACHINERY & EQUIPMENT ATTACHMENTS
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="machinery-attachments"
                onChange={e => handleFileUpload('machineryAttachments', e.target.files)}
              />
              <label htmlFor="machinery-attachments" className="cursor-pointer">
                <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload attachments</p>
                <p className="text-xs text-gray-500 mt-1">Upload operation manuals, safety certificates, maintenance logs, etc.</p>
                <p className="text-xs text-yellow-600 mt-1">Max 10MB per file, 50MB total. Images will be compressed automatically.</p>
              </label>
              {attachments.machineryAttachments && attachments.machineryAttachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.machineryAttachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                      <div className="flex flex-col truncate">
                        <span className="text-xs sm:text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button onClick={() => removeFile('machineryAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {attachments.machineryAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                      ? `${(attachments.machineryAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                      : `${(attachments.machineryAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}

      {/* {selectedAssetCategory === 'Tools & Instruments' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-l-4 border-l-[#C72030] p-4 sm:p-6 bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-4">
              <Archive className="w-5 h-5" />
              TOOLS & INSTRUMENTS ATTACHMENTS
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                id="tools-attachments"
                onChange={e => handleFileUpload('toolsAttachments', e.target.files)}
              />
              <label htmlFor="tools-attachments" className="cursor-pointer">
                <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload attachments</p>
                <p className="text-xs text-gray-500 mt-1">Upload calibration certificates, user guides, specifications, etc.</p>
                <p className="text-xs text-yellow-600 mt-1">Max 10MB per file, 50MB total. Images will be compressed automatically.</p>
              </label>
              {attachments.toolsAttachments && attachments.toolsAttachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {attachments.toolsAttachments.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                      <div className="flex flex-col truncate">
                        <span className="text-xs sm:text-sm truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button onClick={() => removeFile('toolsAttachments', idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500 mt-1">
                    Total: {attachments.toolsAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024 < 1 
                      ? `${(attachments.toolsAttachments.reduce((total, file) => total + file.size, 0) / 1024).toFixed(0)} KB`
                      : `${(attachments.toolsAttachments.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(2)} MB`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6">
        <button onClick={handleSaveAndShow} className="border border-[#C72030] text-[#C72030] px-6 sm:px-8 py-2 rounded-md   text-sm sm:text-base">
          Save & Show Details
        </button>
        <button onClick={handleSaveAndCreate} className="px-6 sm:px-8 py-2 rounded-md text-sm sm:text-base bg-[#f6f4ee] text-red-700">
          Save & Create New Asset
        </button>
      </div>
    </div>

    {/* Custom Field Modal for Asset Details */}
    <Dialog open={customFieldModalOpen} onOpenChange={setCustomFieldModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">Add Custom Field</DialogTitle>
            <button onClick={() => {
              setCustomFieldModalOpen(false);
              setNewFieldName('');
            }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        <div className="py-4">
          <TextField label="New Field Name" placeholder="New Field Name" value={newFieldName} onChange={e => setNewFieldName(e.target.value)} fullWidth variant="outlined" InputLabelProps={{
            shrink: true
          }} InputProps={{
            sx: {
              height: 45,
              '& .MuiInputBase-input': {
                padding: '12px'
              }
            }
          }} />
        </div>
        <DialogFooter className="flex justify-center gap-4">
          <button onClick={() => {
            setCustomFieldModalOpen(false);
            setNewFieldName('');
          }} className="px-6 py-2 border border-[#C72030] rounded-md hover:bg-gray-50 text-sm text-orange-700">
            Cancel
          </button>
          <button onClick={handleAddCustomField} className="px-6 py-2 rounded-md text-sm bg-[#f6f4ee] text-red-700">
            Add Field
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Custom Field Modal for IT Assets */}

    <AddCustomFieldModal
      isOpen={itAssetsCustomFieldModalOpen}
      onClose={() => setItAssetsCustomFieldModalOpen(false)}
      onAddField={(fieldName, sectionName) => handleAddItAssetsCustomField(fieldName, sectionName)}
      isItAsset={true}
    />
    {/* <AddCustomFieldModal isOpen={itAssetsCustomFieldModalOpen} onClose={() => setItAssetsCustomFieldModalOpen(false)} onAddField={handleAddItAssetsCustomField} isItAsset={true} /> */}
  </div>;
};
export default AddAssetPage;
