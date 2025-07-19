import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { assetAPI, CreateAssetPayload } from '@/services/assetAPI';
import { mapFormDataToAPIPayload, validateAssetData } from '@/utils/assetDataMapper';
import { toast } from 'sonner';

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

  // Group and Subgroup state
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [subgroupsLoading, setSubgroupsLoading] = useState(false);
  const [parentMeters, setParentMeters] = useState<{id: number, name: string}[]>([]);
  const [parentMeterLoading, setParentMeterLoading] = useState(false);
  const [selectedParentMeterId, setSelectedParentMeterId] = useState<string>('');

  // Vendors state
  const [vendors, setVendors] = useState<{id: number, name: string}[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [selectedAmcVendorId, setSelectedAmcVendorId] = useState<string>('');
  const [selectedLoanedVendorId, setSelectedLoanedVendorId] = useState<string>('');

  // Departments and Users state
  const [departments, setDepartments] = useState<{id: number, department_name: string}[]>([]);
  const [users, setUsers] = useState<{id: number, full_name: string}[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

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
  const [hardDiskHeading, setHardDiskHeading] = useState(() => {
    return localStorage.getItem('hardDiskHeading') || 'HARD DISK DETAILS';
  });
  const [isEditingHardDiskHeading, setIsEditingHardDiskHeading] = useState(false);
  const [editingHardDiskHeadingText, setEditingHardDiskHeadingText] = useState(() => {
    return localStorage.getItem('hardDiskHeading') || 'HARD DISK DETAILS';
  });

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
    'Hard Disk Details': []
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
  const [attachments, setAttachments] = useState({
    manualsUpload: [],
    insuranceDetails: [],
    purchaseInvoice: [],
    amc: []
  });
  const [selectedAssetCategory, setSelectedAssetCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Asset form data state to capture all form fields
  const [assetFormData, setAssetFormData] = useState({
    name: '',
    asset_number: '',
    model_number: '',
    serial_number: '',
    manufacturer: '',
    purchase_cost: '',
    purchased_on: '',
    warranty: 'No',
    warranty_expiry: '',
    commissioning_date: '',
    status: 'in_use',
    useful_life: '',
    salvage_value: '',
    depreciation_rate: '',
    depreciation_method: 'Straight Line',
    // Add other fields as needed
  });

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

  // Handle group change
  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    setSelectedSubgroup(''); // Reset subgroup when group changes
    fetchSubgroups(groupId);
  };

  // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
    fetchVendors();
    fetchDepartments();
    fetchUsers();
  }, []);

  // Fetch parent meters when Sub Meter is selected
  useEffect(() => {
    if (meterType === 'sub') {
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
  
  const removeCustomField = (section, id) => {
    setCustomFields(prev => ({
      ...prev,
      [section]: prev[section].filter(field => field.id !== id)
    }));
  };

  // Custom field functions for IT Assets
  const handleAddItAssetsCustomField = (fieldName, section = 'System Details') => {
    const newField = {
      id: Date.now(),
      name: fieldName,
      value: ''
    };
    setItAssetsCustomFields(prev => ({
      ...prev,
      [section]: [...prev[section], newField]
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
  const handleFileUpload = (category, files) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(prev => ({
        ...prev,
        [category]: [...prev[category], ...fileArray]
      }));
    }
  };
  const removeFile = (category, index) => {
    setAttachments(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };
  // Handle asset form data changes
  const handleAssetFormChange = (field: string, value: string | boolean) => {
    setAssetFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Build extra fields attributes from custom fields
  const buildExtraFieldsAttributes = () => {
    const extraFields: any[] = [];
    
    Object.entries(customFields).forEach(([sectionKey, fields]) => {
      fields.forEach((field: any) => {
        if (field.value && field.value.trim() !== '') {
          extraFields.push({
            field_name: field.name.toLowerCase().replace(/\s+/g, '_'),
            field_value: field.value,
            group_name: sectionKey.toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase(),
            field_description: field.name,
            _destroy: false
          });
        }
      });
    });

    return extraFields;
  };

  // Build consumption measures attributes
  const buildConsumptionMeasuresAttributes = () => {
    return consumptionMeasures
      .filter(measure => measure.name && measure.name.trim() !== '')
      .map(measure => ({
        name: measure.name,
        meter_unit_id: parseInt(measure.unitType) || 1,
        min_value: parseFloat(measure.min) || 0,
        max_value: parseFloat(measure.max) || 0,
        alert_below: parseFloat(measure.alertBelowVal) || 0,
        alert_above: parseFloat(measure.alertAboveVal) || 0,
        multiplier_factor: parseFloat(measure.multiplierFactor) || 1,
        active: true,
        meter_tag: `CM-${Date.now()}`,
        check_previous_reading: measure.checkPreviousReading || false,
        _destroy: false
      }));
  };

  // Build non-consumption measures attributes
  const buildNonConsumptionMeasuresAttributes = () => {
    return nonConsumptionMeasures
      .filter(measure => measure.name && measure.name.trim() !== '')
      .map(measure => ({
        name: measure.name,
        meter_unit_id: parseInt(measure.unitType) || 1,
        min_value: parseFloat(measure.min) || 0,
        max_value: parseFloat(measure.max) || 0,
        alert_below: parseFloat(measure.alertBelowVal) || 0,
        alert_above: parseFloat(measure.alertAboveVal) || 0,
        active: true,
        meter_tag: `NCM-${Date.now()}`,
        check_previous_reading: measure.checkPreviousReading || false,
        _destroy: false
      }));
  };

  // Submit asset function
  const submitAsset = async (showDetails = false) => {
    setIsSubmitting(true);
    
    try {
      // Build the complete payload
      const payload: CreateAssetPayload = {
        pms_asset: {
          name: assetFormData.name,
          pms_site_id: selectedLocation.site,
          pms_building_id: selectedLocation.building,
          pms_wing_id: selectedLocation.wing,
          pms_area_id: selectedLocation.area,
          pms_floor_id: selectedLocation.floor,
          pms_room_id: selectedLocation.room,
          loaned_from_vendor_id: selectedLoanedVendorId,
          status: assetFormData.status,
          warranty_period: "12 months", // Default or from form
          asset_number: assetFormData.asset_number,
          model_number: assetFormData.model_number,
          serial_number: assetFormData.serial_number,
          manufacturer: assetFormData.manufacturer,
          commisioning_date: assetFormData.commissioning_date,
          pms_asset_sub_group_id: selectedSubgroup,
          pms_asset_group_id: selectedGroup,
          pms_supplier_id: selectedVendorId,
          salvage_value: assetFormData.salvage_value,
          depreciation_rate: assetFormData.depreciation_rate,
          depreciation_method: assetFormData.depreciation_method,
          it_asset: itAssetsToggle,
          it_meter: false,
          meter_tag_type: meterCategoryType,
          parent_meter_id: selectedParentMeterId,
          breakdown: false,
          critical: criticalStatus === 'yes',
          is_meter: meterDetailsToggle,
          asset_loaned: assetLoanedToggle,
          depreciation_applicable: depreciationToggle,
          useful_life: assetFormData.useful_life,
          purchase_cost: assetFormData.purchase_cost,
          purchased_on: assetFormData.purchased_on,
          warranty: assetFormData.warranty,
          depreciation_applicable_for: selectedAssetCategory,
          indiv_group: "individual",
          warranty_expiry: assetFormData.warranty_expiry,
          allocation_type: allocationBasedOn,
          asset_ids: [],
          group_id: selectedGroup,
          sub_group_id: selectedSubgroup,
          consumption_pms_asset_measures_attributes: buildConsumptionMeasuresAttributes(),
          non_consumption_pms_asset_measures_attributes: buildNonConsumptionMeasuresAttributes()
        },
        allocation_ids: allocationBasedOn === 'department' ? [selectedDepartmentId] : [selectedUserId],
        amc_detail: selectedAmcVendorId ? {
          supplier_id: selectedAmcVendorId,
          amc_start_date: "",
          amc_end_date: "",
          amc_first_service: "",
          payment_term: "",
          no_of_visits: ""
        } : undefined,
        asset_manuals: attachments.manualsUpload?.map(file => ({
          file_name: file.name,
          url: file.url || ""
        })) || [],
        asset_insurances: attachments.insuranceDetails?.map(insurance => ({
          insurance_provider: insurance.provider || "",
          policy_number: insurance.policyNumber || "",
          valid_till: insurance.validTill || ""
        })) || [],
        asset_purchases: attachments.purchaseInvoice?.map(purchase => ({
          invoice_number: purchase.invoiceNumber || "",
          purchase_date: purchase.date || "",
          amount: purchase.amount || ""
        })) || [],
        asset_other_uploads: attachments.amc?.map(file => ({
          file_name: file.name,
          url: file.url || ""
        })) || [],
        extra_fields_attributes: buildExtraFieldsAttributes()
      };

      console.log('Submitting asset payload:', payload);

      // Submit to API
      const response = await assetAPI.createAsset(payload);
      
      toast.success('Asset created successfully!');
      console.log('Asset created:', response);

      if (showDetails) {
        // Navigate to asset details or show success message
        navigate('/maintenance/asset');
      } else {
        // Reset form for new asset
        setAssetFormData({
          name: '',
          asset_number: '',
          model_number: '',
          serial_number: '',
          manufacturer: '',
          purchase_cost: '',
          purchased_on: '',
          warranty: 'No',
          warranty_expiry: '',
          commissioning_date: '',
          status: 'in_use',
          useful_life: '',
          salvage_value: '',
          depreciation_rate: '',
          depreciation_method: 'Straight Line',
        });
        
        // Reset other form states
        setSelectedLocation({
          site: '',
          building: '',
          wing: '',
          area: '',
          floor: '',
          room: ''
        });
        setSelectedAssetCategory('');
        setSelectedGroup('');
        setSelectedSubgroup('');
        setCustomFields({
          basicIdentification: [],
          locationOwnership: [],
          landSizeValue: [],
          landUsageDevelopment: [],
          miscellaneous: [],
          leaseholdBasicId: [],
          leaseholdLocationAssoc: [],
          improvementDetails: [],
          leaseholdFinancial: [],
          leaseholdLease: [],
          leaseholdOversight: [],
          vehicleBasicId: [],
          vehicleTechnicalSpecs: [],
          vehicleOwnership: [],
          vehicleFinancial: [],
          vehiclePerformance: [],
          vehicleLegal: [],
          vehicleMiscellaneous: [],
          buildingBasicId: [],
          buildingLocation: [],
          buildingConstruction: [],
          buildingAcquisition: [],
          buildingUsage: [],
          buildingMaintenance: [],
          buildingMiscellaneous: [],
          locationDetails: [],
          purchaseDetails: [],
          depreciationRule: []
        });
        
        toast.success('Form reset for new asset');
      }

    } catch (error: any) {
      console.error('Error creating asset:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create asset';
      toast.error(`Failed to create asset: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndShow = () => {
    submitAsset(true);
  };

  const handleSaveAndCreate = () => {
    submitAsset(false);
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
  return <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50">
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
          <div className="border-l-4 border-l-[#C72030] p-4 sm:p-6 bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold mb-6">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              ASSET CATEGORY
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <RadioGroup 
                value={selectedAssetCategory} 
                onValueChange={setSelectedAssetCategory}
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
                  'Tools & Instruments'
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem 
                      value={category} 
                      id={category}
                    />
                    <label 
                      htmlFor={category} 
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      {category}
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
                      label="Asset ID / Code"
                      placeholder="Enter unique identifier"
                      variant="outlined"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
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
                          onChange={(e) => handleCustomFieldChange('basicIdentification', field.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: { xs: '36px', md: '45px' }
                            }
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
                           onChange={(e) => handleCustomFieldChange('locationOwnership', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
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
                    />
                  </div>
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
                      >
                        <MenuItem value="">Select Improvements</MenuItem>
                        <MenuItem value="fencing">Fencing</MenuItem>
                        <MenuItem value="landscaping">Landscaping</MenuItem>
                        <MenuItem value="roads">Roads</MenuItem>
                        <MenuItem value="other">Other (Manual Input)</MenuItem>
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
                       }}
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
                           onChange={(e) => handleCustomFieldChange('landUsageDevelopment', field.id, e.target.value)}
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
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="land-attachments"
                    />
                    <label htmlFor="land-attachments" className="cursor-pointer">
                      <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload attachments
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload deed copy, layout, map, lease, etc.
                      </p>
                    </label>
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
                         onChange={(e) => handleCustomFieldChange('miscellaneous', field.id, e.target.value)}
                         sx={{
                           '& .MuiOutlinedInput-root': {
                             height: { xs: '36px', md: '45px' }
                           }
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
            </div>
          </LocalizationProvider>
        )}

        {/* Leasehold Improvement Asset Details - Show when Leasehold Improvement is selected */}
        {selectedAssetCategory === 'Leasehold Improvement' && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="space-y-6">
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
                          onChange={(e) => handleCustomFieldChange('leaseholdBasicId', field.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: { xs: '36px', md: '45px' }
                            }
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
                      >
                        <MenuItem value="">Select Property</MenuItem>
                        <MenuItem value="prop001">Property 001</MenuItem>
                        <MenuItem value="prop002">Property 002</MenuItem>
                        <MenuItem value="prop003">Property 003</MenuItem>
                      </MuiSelect>
                    </FormControl>
                    <TextField
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
                     />
                     
                     {/* Custom Fields */}
                     {customFields.leaseholdLocationAssoc.map((field) => (
                       <div key={field.id} className="relative">
                         <TextField
                           label={field.name}
                           placeholder={`Enter ${field.name}`}
                           variant="outlined"
                           fullWidth
                           value={field.value}
                           onChange={(e) => handleCustomFieldChange('leaseholdLocationAssoc', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
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
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="civil">Civil</MenuItem>
                        <MenuItem value="electrical">Electrical</MenuItem>
                        <MenuItem value="hvac">HVAC</MenuItem>
                        <MenuItem value="plumbing">Plumbing</MenuItem>
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
                           onChange={(e) => handleCustomFieldChange('improvementDetails', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
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
                           onChange={(e) => handleCustomFieldChange('leaseholdFinancial', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
                           }}
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
                           onChange={(e) => handleCustomFieldChange('leaseholdLease', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
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
                          height: { xs: '36px', md: '45px' }
                        }
                      }}
                    >
                      <InputLabel>Responsible Department</InputLabel>
                      <MuiSelect
                        label="Responsible Department"
                        defaultValue=""
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
                        />
                        <label htmlFor="leasehold-attachments" className="cursor-pointer">
                          <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Click to upload attachments
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                             Upload invoices, contracts, improvement photos, etc.
                           </p>
                         </label>
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
                           onChange={(e) => handleCustomFieldChange('leaseholdOversight', field.id, e.target.value)}
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
            </div>
          </LocalizationProvider>
        )}

        {/* Vehicle Asset Details - Show when Vehicle is selected */}
        {selectedAssetCategory === 'Vehicle' && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="space-y-6">
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
                          onChange={(e) => handleCustomFieldChange('vehicleBasicId', field.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: { xs: '36px', md: '45px' }
                            }
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
                           onChange={(e) => handleCustomFieldChange('vehicleOwnership', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
                           }}
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
                    />
                    
                    {/* Custom Fields */}
                    {customFields.vehicleTechnicalSpecs.map((field) => (
                      <div key={field.id} className="relative">
                        <TextField
                          label={field.name}
                          placeholder={`Enter ${field.name}`}
                          variant="outlined"
                          fullWidth
                          value={field.value}
                          onChange={(e) => handleCustomFieldChange('vehicleTechnicalSpecs', field.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: { xs: '36px', md: '45px' }
                            }
                          }}
                        />
                        <button
                          onClick={() => removeCustomField('vehicleTechnicalSpecs', field.id)}
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
                          onChange={(e) => handleCustomFieldChange('vehicleLegal', field.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: { xs: '36px', md: '45px' }
                            }
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
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      id="vehicle-attachments"
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
                   
                   {/* Custom Fields */}
                   {customFields.vehicleMiscellaneous.map((field) => (
                     <div key={field.id} className="relative">
                       <TextField
                         label={field.name}
                         placeholder={`Enter ${field.name}`}
                         variant="outlined"
                         fullWidth
                         value={field.value}
                         onChange={(e) => handleCustomFieldChange('vehicleMiscellaneous', field.id, e.target.value)}
                         sx={{
                           '& .MuiOutlinedInput-root': {
                             height: { xs: '36px', md: '45px' }
                           }
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
            </div>
          </LocalizationProvider>
        )}

        {/* Building Asset Details - Show when Building is selected */}
        {selectedAssetCategory === 'Building' && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="space-y-6">
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
                           onChange={(e) => handleCustomFieldChange('buildingBasicId', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
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
                           onChange={(e) => handleCustomFieldChange('buildingLocation', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
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
                          onChange={(e) => handleCustomFieldChange('buildingConstruction', field.id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              height: { xs: '36px', md: '45px' }
                            }
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
                           onChange={(e) => handleCustomFieldChange('buildingAcquisition', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
                           }}
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
                           onChange={(e) => handleCustomFieldChange('buildingUsage', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
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
                           onChange={(e) => handleCustomFieldChange('buildingMaintenance', field.id, e.target.value)}
                           sx={{
                             '& .MuiOutlinedInput-root': {
                               height: { xs: '36px', md: '45px' }
                             }
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
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg"
                      className="hidden"
                      id="building-attachments"
                    />
                    <label htmlFor="building-attachments" className="cursor-pointer">
                      <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload attachments
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Upload blueprints, tax receipts, occupancy certificate, etc.
                      </p>
                    </label>
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
                         onChange={(e) => handleCustomFieldChange('buildingMiscellaneous', field.id, e.target.value)}
                         sx={{
                           '& .MuiOutlinedInput-root': {
                             height: { xs: '36px', md: '45px' }
                           }
                         }}
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
            </div>
          </LocalizationProvider>
        )}

        {/* Conditional Sections - Show only for specific asset categories */}
        {(selectedAssetCategory === 'Furniture & Fixtures' || 
          selectedAssetCategory === 'IT Equipment' || 
          selectedAssetCategory === 'Machinery & Equipment' || 
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openCustomFieldModal('locationDetails');
                    }}
                    className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    Custom Field
                  </button>
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
                    onChange={(e) => handleLocationChange('site', e.target.value)}
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
                    onChange={(e) => handleLocationChange('building', e.target.value)}
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
                    onChange={(e) => handleLocationChange('wing', e.target.value)}
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
                    onChange={(e) => handleLocationChange('area', e.target.value)}
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
                    onChange={(e) => handleLocationChange('floor', e.target.value)}
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
                    onChange={(e) => handleLocationChange('room', e.target.value)}
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
                    onChange={(e) => handleCustomFieldChange('locationDetails', field.id, e.target.value)}
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
                  value={assetFormData.name}
                  onChange={(e) => handleAssetFormChange('name', e.target.value)}
                  fullWidth 
                  variant="outlined" 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
                <TextField 
                  required 
                  label="Model No." 
                  placeholder="Enter Model No" 
                  name="modelNo" 
                  value={assetFormData.model_number}
                  onChange={(e) => handleAssetFormChange('model_number', e.target.value)}
                  fullWidth 
                  variant="outlined" 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
                <TextField 
                  required 
                  label="Manufacturer" 
                  placeholder="Enter Manufacturer" 
                  name="manufacturer" 
                  value={assetFormData.manufacturer}
                  onChange={(e) => handleAssetFormChange('manufacturer', e.target.value)}
                  fullWidth 
                  variant="outlined" 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
              </div>

              {/* Additional row: Asset Number, Serial Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <TextField 
                  required 
                  label="Asset Number" 
                  placeholder="Enter Asset Number" 
                  name="assetNumber" 
                  value={assetFormData.asset_number}
                  onChange={(e) => handleAssetFormChange('asset_number', e.target.value)}
                  fullWidth 
                  variant="outlined" 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
                <TextField 
                  label="Serial Number" 
                  placeholder="Enter Serial Number" 
                  name="serialNumber" 
                  value={assetFormData.serial_number}
                  onChange={(e) => handleAssetFormChange('serial_number', e.target.value)}
                  fullWidth 
                  variant="outlined" 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
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
                    onChange={(e) => handleGroupChange(e.target.value)}
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
                    value={selectedSubgroup} 
                    onChange={(e) => setSelectedSubgroup(e.target.value)}
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
                      <input type="radio" id="status-inuse" name="status" value="inuse" defaultChecked className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="status-inuse" className="text-sm">In Use</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="status-breakdown" name="status" value="breakdown" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
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
                      <input type="radio" id="critical-yes" name="critical" value="yes" checked={criticalStatus === 'yes'} onChange={e => setCriticalStatus(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="critical-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="critical-no" name="critical" value="no" checked={criticalStatus === 'no'} onChange={e => setCriticalStatus(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
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
          {expandedSections.warranty && <div className="p-4 sm:p-6">
              {/* System Details */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4" style={{
              color: '#C72030'
            }}>SYSTEM DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextField label="OS" placeholder="Enter OS" name="os" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField label="Total Memory" placeholder="Enter Total Memory" name="totalMemory" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField label="Processor" placeholder="Enter Processor" name="processor" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  
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

              {/* Hard Disk Details */}
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
                  <TextField label="Model" placeholder="Enter Model" name="hdModel" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField label="Serial No." placeholder="Enter Serial No." name="hdSerialNo" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField label="Capacity" placeholder="Enter Capacity" name="hdCapacity" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  
                  {/* Custom Fields for Hard Disk Details */}
                  {itAssetsCustomFields['Hard Disk Details'].map(field => <div key={field.id} className="relative">
                      <TextField label={field.name} placeholder={`Enter ${field.name}`} value={field.value} onChange={e => handleItAssetsCustomFieldChange('Hard Disk Details', field.id, e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                  shrink: true
                }} InputProps={{
                  sx: fieldStyles
                }} />
                      <button onClick={() => removeItAssetsCustomField('Hard Disk Details', field.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>)}
                </div>
              </div>
            </div>}
          </div>
        )}

        {/* Meter Details */}
        {selectedAssetCategory !== 'Tools & Instruments' && selectedAssetCategory !== 'IT Equipment' && (
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
          {expandedSections.meterCategory && <div className="p-4 sm:p-6">
              {/* Meter Type */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#C72030] font-medium text-sm sm:text-base">Meter Type</span>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="meter-type-parent" name="meterType" value="parent" checked={meterType === 'parent'} onChange={e => setMeterType(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="meter-type-parent" className="text-sm">Parent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="meter-type-sub" name="meterType" value="sub" checked={meterType === 'sub'} onChange={e => setMeterType(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="meter-type-sub" className="text-sm">Sub</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Meter Dropdown - Show only when Sub Meter is selected */}
              {meterType === 'sub' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Meter <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedParentMeterId}
                    onValueChange={setSelectedParentMeterId}
                    disabled={parentMeterLoading}
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
              {meterType === 'parent' && (
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
                  />
                </>
              )}

              {meterType === 'sub' && (
                <MeterMeasureFields
                  title="NON CONSUMPTION METER MEASURE"
                  fields={nonConsumptionMeasureFields}
                  showCheckPreviousReading={false}
                  onFieldChange={(id, field, value) => 
                    handleMeterMeasureFieldChange('nonConsumption', id, field, value)
                  }
                  onAddField={() => addMeterMeasureField('nonConsumption')}
                  onRemoveField={(id) => removeMeterMeasureField('nonConsumption', id)}
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
                <TextField 
                  required 
                  label="Purchase Cost" 
                  placeholder="Enter cost" 
                  name="purchaseCost" 
                  value={assetFormData.purchase_cost}
                  onChange={(e) => handleAssetFormChange('purchase_cost', e.target.value)}
                  fullWidth 
                  variant="outlined" 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
                <TextField 
                  required 
                  label="Purchase Date" 
                  placeholder="dd/mm/yyyy" 
                  name="purchaseDate" 
                  type="date" 
                  value={assetFormData.purchased_on}
                  onChange={(e) => handleAssetFormChange('purchased_on', e.target.value)}
                  fullWidth 
                  variant="outlined" 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
                <TextField 
                  required 
                  label="Warranty Expires On" 
                  placeholder="dd/mm/yyyy" 
                  name="warrantyExpiresOn" 
                  type="date" 
                  value={assetFormData.warranty_expiry}
                  onChange={(e) => handleAssetFormChange('warranty_expiry', e.target.value)}
                  fullWidth 
                  variant="outlined" 
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Under Warranty</label>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="warranty-yes" name="underWarranty" value="yes" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="warranty-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="warranty-no" name="underWarranty" value="no" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="warranty-no" className="text-sm">No</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              {customFields.purchaseDetails.map((field) => (
                <div key={field.id} className="flex items-center gap-2 mb-2">
                  <TextField
                    label={field.name}
                    value={field.value}
                    onChange={(e) => handleCustomFieldChange('purchaseDetails', field.id, e.target.value)}
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCustomFieldModal('depreciationRule');
                }}
                className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded"
              >
                <Plus className="w-4 h-4" />
                Custom Field
              </button>
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
          {expandedSections.nonConsumption && <div className="p-4 sm:p-6">
              <div className="space-y-6">
                {/* Method Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-4 block">Method</label>
                  <div className="flex gap-8">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="straight-line" name="depreciationMethod" value="straight-line" defaultChecked className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="straight-line" className="text-sm">Straight Line</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="wdv" name="depreciationMethod" value="wdv" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="wdv" className="text-sm">WDV</label>
                    </div>
                  </div>
                </div>

                {/* Input Fields Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextField required label="Useful Life (in yrs)" placeholder="YRS" name="usefulLife" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField required label="Salvage Value" placeholder="Enter Value" name="salvageValue" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField required label="Depreciation Rate" placeholder="Enter Value" name="depreciationRate" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                </div>

                {/* Radio Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="configure-this" name="depreciationConfig" value="configure-this" defaultChecked className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
                      <label htmlFor="configure-this" className="text-sm">Configure Depreciation Only For This</label>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="similar-product" name="depreciationConfig" value="similar-product" className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                    accentColor: '#C72030'
                  }} />
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
                      onChange={(e) => handleCustomFieldChange('depreciationRule', field.id, e.target.value)}
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
                      value={allocationBasedOn === 'department' ? selectedDepartmentId : selectedUserId}
                      onChange={(e) => allocationBasedOn === 'department' ? setSelectedDepartmentId(e.target.value) : setSelectedUserId(e.target.value)}
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
          {expandedSections.assetLoaned && <div className="p-4 sm:p-6">
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
                      onChange={(e) => setSelectedLoanedVendorId(e.target.value)}
                      sx={fieldStyles} 
                      required
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
                <TextField required label="Agreement Start Date*" placeholder="dd/mm/yyyy" name="agreementStartDate" type="date" fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                <TextField required label="Agreement End Date*" placeholder="dd/mm/yyyy" name="agreementEndDate" type="date" fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
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
                      onChange={(e) => setSelectedAmcVendorId(e.target.value)}
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
              }} />
                  
                  <TextField label="End Date" placeholder="dd/mm/yyyy" name="amcEndDate" type="date" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  
                  <TextField label="First Service" placeholder="dd/mm/yyyy" name="amcFirstService" type="date" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  
                  <FormControl fullWidth variant="outlined" sx={{
                minWidth: 120
              }}>
                    <InputLabel id="payment-terms-select-label" shrink>Payment Terms</InputLabel>
                    <MuiSelect labelId="payment-terms-select-label" label="Payment Terms" displayEmpty value="" sx={fieldStyles}>
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
              }} />
                </div>

                {/* Second Row - AMC Cost */}
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <TextField label="AMC Cost" placeholder="Enter AMC Cost" name="amcCost" fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                </div>
              </div>
            </div>}
        </div>

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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6">
          <button 
            onClick={handleSaveAndShow} 
            disabled={isSubmitting}
            className="border border-[#C72030] text-[#C72030] px-6 sm:px-8 py-2 rounded-md hover:bg-[#C72030] hover:text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save & Show Details'}
          </button>
          <button 
            onClick={handleSaveAndCreate} 
            disabled={isSubmitting}
            className="px-6 sm:px-8 py-2 rounded-md text-sm sm:text-base bg-[#f6f4ee] text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save & Create New Asset'}
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
      <AddCustomFieldModal isOpen={itAssetsCustomFieldModalOpen} onClose={() => setItAssetsCustomFieldModalOpen(false)} onAddField={handleAddItAssetsCustomField} isItAsset={true} />
    </div>;
};
export default AddAssetPage;
