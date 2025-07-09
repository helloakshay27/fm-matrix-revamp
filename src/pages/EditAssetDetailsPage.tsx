import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { TextField } from '@mui/material';
import { ArrowLeft, ChevronDown, ChevronUp, Plus, X, MapPin, Package, Shield, Activity, TrendingUp, BarChart, Paperclip, Percent, Zap, Sun, Droplet, Recycle, BarChart3, Grid2X2, Settings } from 'lucide-react';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent, Radio, RadioGroup as MuiRadioGroup, FormControlLabel } from '@mui/material';
import { AddCustomFieldModal } from '@/components/AddCustomFieldModal';

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

export const EditAssetDetailsPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
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
  const [locationData, setLocationData] = useState({
    site: 'Lockated',
    building: 'sebc',
    wing: '',
    area: '',
    floor: '',
    room: ''
  });
  const [formData, setFormData] = useState({
    assetName: 'sdcsdc',
    assetNo: 'sdcsdc',
    equipmentId: '',
    modelNo: 'tested',
    serialNo: 'sdcsdc',
    consumerNo: '',
    purchaseCost: '0.0',
    capacity: '10',
    unit: '10',
    group: 'Electrical',
    subgroup: 'Electric Meter',
    purchaseDate: '2024-05-26',
    expiryDate: '',
    manufacturer: '',
    vendor: '',
    locationType: 'common-area',
    assetType: 'parent',
    status: 'in-use',
    critical: 'yes',
    meterApplicable: true,
    underWarranty: 'yes',
    warrantyStartDate: '',
    warrantyExpiresOn: '',
    commissioningDate: ''
  });
  const [itAssetData, setItAssetData] = useState({
    os: '',
    totalMemory: '',
    processor: '',
    model: '',
    serialNo: '',
    capacity: ''
  });
  const [meterDetailsApplicable, setMeterDetailsApplicable] = useState(true);
  const [meterType, setMeterType] = useState('parent');
  const [critical, setCritical] = useState('yes');
  const [meterCategoryType, setMeterCategoryType] = useState('');
  const [subCategoryType, setSubCategoryType] = useState('');
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
  const [depreciationApplicable, setDepreciationApplicable] = useState(true);
  const [depreciationMethod, setDepreciationMethod] = useState('straight-line');
  const [depreciationData, setDepreciationData] = useState({
    usefulLife: '',
    salvageValue: '',
    depreciationRate: ''
  });
  const [depreciationScope, setDepreciationScope] = useState('this-only');
  const [assetAllocationData, setAssetAllocationData] = useState({
    basedOn: 'department',
    department: ''
  });
  const [assetLoanedApplicable, setAssetLoanedApplicable] = useState(true);
  const [assetLoanedData, setAssetLoanedData] = useState({
    vendorName: '',
    agreementStartDate: '',
    agreementEndDate: ''
  });
  const [amcDetailsData, setAmcDetailsData] = useState({
    vendor: '',
    startDate: '',
    endDate: '',
    firstService: '',
    paymentTerms: '',
    noOfVisits: '',
    amcCost: ''
  });
  const [customFields, setCustomFields] = useState<{
    id: string;
    name: string;
    value: string;
  }[]>([]);
  const [itCustomFields, setItCustomFields] = useState<{
    id: string;
    name: string;
    value: string;
    section: 'System Details' | 'Hard Disk Details';
  }[]>([]);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [activeCustomFieldSection, setActiveCustomFieldSection] = useState<'asset' | 'it'>('asset');

  const getMeterCategoryOptions = () => [{
    value: 'board',
    label: 'Board',
    icon: <BarChart3 className="w-4 h-4" />
  }, {
    value: 'dg',
    label: 'DG',
    icon: <Zap className="w-4 h-4" />
  }, {
    value: 'renewable',
    label: 'Renewable',
    icon: <Sun className="w-4 h-4" />
  }, {
    value: 'fresh-water',
    label: 'Fresh Water',
    icon: <Droplet className="w-4 h-4" />
  }, {
    value: 'recycled',
    label: 'Recycled',
    icon: <Recycle className="w-4 h-4" />
  }, {
    value: 'iex-gdam',
    label: 'IEX-GDAM',
    icon: <BarChart className="w-4 h-4" />
  }];

  const getSubCategoryOptions = () => {
    switch (meterCategoryType) {
      case 'board':
        return [{
          value: 'ht-panel',
          label: 'HT Panel',
          icon: <Zap className="w-6 h-6" />
        }, {
          value: 'vcb',
          label: 'VCB',
          icon: <Package className="w-6 h-6" />
        }, {
          value: 'transformer',
          label: 'Transformer',
          icon: <Shield className="w-6 h-6" />
        }, {
          value: 'lt-panel',
          label: 'LT Panel',
          icon: <Activity className="w-6 h-6" />
        }];
      case 'renewable':
        return [{
          value: 'solar',
          label: 'Solar',
          icon: <Sun className="w-6 h-6" />
        }, {
          value: 'bio-methanol',
          label: 'Bio Methanol',
          icon: <Droplet className="w-6 h-6" />
        }, {
          value: 'wind',
          label: 'Wind',
          icon: <Activity className="w-6 h-6" />
        }];
      case 'fresh-water':
        return [{
          value: 'source',
          label: 'Source (Input)',
          icon: <Droplet className="w-6 h-6" />
        }, {
          value: 'destination',
          label: 'Destination (Output)',
          icon: <Droplet className="w-6 h-6" />
        }];
      default:
        return [];
    }
  };

  const toggleSection = section => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItAssetChange = (field: string, value: string) => {
    setItAssetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMeterCategoryChange = value => {
    setMeterCategoryType(value);
    setSubCategoryType('');
  };

  const addConsumptionMeasure = () => {
    const newId = consumptionMeasures.length > 0 ? Math.max(...consumptionMeasures.map(m => m.id)) + 1 : 1;
    setConsumptionMeasures([...consumptionMeasures, {
      id: newId,
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false
    }]);
  };

  const removeConsumptionMeasure = id => {
    if (consumptionMeasures.length > 1) {
      setConsumptionMeasures(consumptionMeasures.filter(m => m.id !== id));
    }
  };

  const updateConsumptionMeasure = (id, field, value) => {
    setConsumptionMeasures(consumptionMeasures.map(m => m.id === id ? {
      ...m,
      [field]: value
    } : m));
  };

  const addNonConsumptionMeasure = () => {
    const newId = nonConsumptionMeasures.length > 0 ? Math.max(...nonConsumptionMeasures.map(m => m.id)) + 1 : 1;
    setNonConsumptionMeasures([...nonConsumptionMeasures, {
      id: newId,
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false
    }]);
  };

  const removeNonConsumptionMeasure = id => {
    if (nonConsumptionMeasures.length > 1) {
      setNonConsumptionMeasures(nonConsumptionMeasures.filter(m => m.id !== id));
    }
  };

  const updateNonConsumptionMeasure = (id, field, value) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.map(m => m.id === id ? {
      ...m,
      [field]: value
    } : m));
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

  const handleDepreciationDataChange = (field: string, value: string) => {
    setDepreciationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssetAllocationChange = (field: string, value: string) => {
    setAssetAllocationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssetLoanedChange = (field: string, value: string) => {
    setAssetLoanedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmcDetailsChange = (field: string, value: string) => {
    setAmcDetailsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAndShowDetails = () => {
    console.log('Saving and showing details:', {
      locationData,
      formData,
      meterCategoryType,
      consumptionMeasures,
      nonConsumptionMeasures,
      attachments
    });
    navigate(`/maintenance/asset/details/${id}`);
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new:', {
      locationData,
      formData,
      meterCategoryType,
      consumptionMeasures,
      nonConsumptionMeasures,
      attachments
    });
    navigate('/maintenance/asset/add');
  };

  const handleBack = () => {
    navigate(`/maintenance/asset/details/${id}`);
  };

  const handleAddCustomField = (fieldName: string, section?: string) => {
    if (activeCustomFieldSection === 'it' && section) {
      const newField = {
        id: Date.now().toString(),
        name: fieldName,
        value: '',
        section: section as 'System Details' | 'Hard Disk Details'
      };
      setItCustomFields(prev => [...prev, newField]);
    } else {
      const newField = {
        id: Date.now().toString(),
        name: fieldName,
        value: ''
      };
      setCustomFields(prev => [...prev, newField]);
    }
  };

  const handleCustomFieldChange = (id: string, value: string) => {
    setCustomFields(prev => prev.map(field => field.id === id ? {
      ...field,
      value
    } : field));
  };

  const handleItCustomFieldChange = (id: string, value: string) => {
    setItCustomFields(prev => prev.map(field => field.id === id ? {
      ...field,
      value
    } : field));
  };

  const removeCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const removeItCustomField = (id: string) => {
    setItCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const openCustomFieldModal = (section: 'asset' | 'it') => {
    setActiveCustomFieldSection(section);
    setIsCustomFieldModalOpen(true);
  };

  return <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Asset List
          </button>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Edit Asset</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT ASSET</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Location Details */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('location')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              LOCATION DETAILS
            </div>
            {expandedSections.location ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.location && <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {['Site', 'Building', 'Wing', 'Area', 'Floor'].map(label => <FormControl key={label} fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                    <InputLabel id={`${label.toLowerCase()}-select-label`} shrink>{label}</InputLabel>
                    <MuiSelect labelId={`${label.toLowerCase()}-select-label`} label={label} displayEmpty value={locationData[label.toLowerCase()] || ''} onChange={(e: SelectChangeEvent) => handleLocationChange(label.toLowerCase(), e.target.value)} sx={fieldStyles}>
                      <MenuItem value=""><em>Select {label}</em></MenuItem>
                      <MenuItem value={`${label.toLowerCase()}1`}>{label} 1</MenuItem>
                      <MenuItem value={`${label.toLowerCase()}2`}>{label} 2</MenuItem>
                    </MuiSelect>
                  </FormControl>)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="room-select-label" shrink>Room</InputLabel>
                  <MuiSelect labelId="room-select-label" label="Room" displayEmpty value={locationData.room || ''} onChange={(e: SelectChangeEvent) => handleLocationChange('room', e.target.value)} sx={fieldStyles}>
                    <MenuItem value=""><em>Select Room</em></MenuItem>
                    <MenuItem value="room1">Room 1</MenuItem>
                    <MenuItem value="room2">Room 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
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
              <button onClick={e => {
              e.stopPropagation();
              openCustomFieldModal('asset');
            }} className="px-3 py-1 rounded-md text-sm flex items-center gap-1 bg-[#f6f4ee] text-red-700">
                <Plus className="w-4 h-4" />
                Custom Field
              </button>
              {expandedSections.asset ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
          {expandedSections.asset && <div className="p-4 sm:p-6">
              {/* First Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                <TextField required label="Asset Name" placeholder="Enter Asset Name" name="assetName" value={formData.assetName} onChange={e => handleInputChange('assetName', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                <TextField required label="Asset No" placeholder="Enter Asset No" name="assetNo" value={formData.assetNo} onChange={e => handleInputChange('assetNo', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                <TextField required label="Model No" placeholder="Enter Model No" name="modelNo" value={formData.modelNo} onChange={e => handleInputChange('modelNo', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                <TextField label="Serial No" placeholder="Enter Serial No" name="serialNo" value={formData.serialNo} onChange={e => handleInputChange('serialNo', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                <TextField required label="Manufacturer" placeholder="Enter Manufacturer" name="manufacturer" value={formData.manufacturer} onChange={e => handleInputChange('manufacturer', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="vendor-select-label" shrink>Vendor</InputLabel>
                  <MuiSelect labelId="vendor-select-label" label="Vendor" displayEmpty value={formData.vendor} onChange={(e: SelectChangeEvent) => handleInputChange('vendor', e.target.value)} sx={fieldStyles}>
                    <MenuItem value=""><em>Select Vendor</em></MenuItem>
                    <MenuItem value="vendor1">Vendor 1</MenuItem>
                    <MenuItem value="vendor2">Vendor 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="group-select-label" shrink>Group</InputLabel>
                  <MuiSelect labelId="group-select-label" label="Group" displayEmpty value={formData.group} onChange={(e: SelectChangeEvent) => handleInputChange('group', e.target.value)} sx={fieldStyles}>
                    <MenuItem value=""><em>Select Group</em></MenuItem>
                    <MenuItem value="Electrical">Electrical</MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="subgroup-select-label" shrink>Subgroup</InputLabel>
                  <MuiSelect labelId="subgroup-select-label" label="Subgroup" displayEmpty value={formData.subgroup} onChange={(e: SelectChangeEvent) => handleInputChange('subgroup', e.target.value)} sx={fieldStyles}>
                    <MenuItem value=""><em>Select Sub-Group</em></MenuItem>
                    <MenuItem value="Electric Meter">Electric Meter</MenuItem>
                    <MenuItem value="Water Meter">Water Meter</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Commissioning Date" placeholder="dd/mm/yyyy" name="commissioningDate" type="date" value={formData.commissioningDate} onChange={e => handleInputChange('commissioningDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
              </div>

              {/* Custom Fields */}
              {customFields.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                  {customFields.map(field => <div key={field.id} className="relative">
                      <TextField label={field.name} placeholder={`Enter ${field.name}`} value={field.value} onChange={e => handleCustomFieldChange(field.id, e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                      <button onClick={() => removeCustomField(field.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>)}
                </div>}

              {/* Status Section */}
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-red-700 font-normal">Status</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="status-inuse" name="status" value="in-use" checked={formData.status === 'in-use'} onChange={e => handleInputChange('status', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="status-inuse" className="text-sm">In Use</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="status-breakdown" name="status" value="breakdown" checked={formData.status === 'breakdown'} onChange={e => handleInputChange('status', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="status-breakdown" className="text-sm">Breakdown</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>

        {/* IT Assets Details */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('warranty')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              IT Asset Details
              <div className="flex items-center gap-2 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-green-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span className="text-sm text-gray-600">If Applicable</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={e => {
              e.stopPropagation();
              openCustomFieldModal('it');
            }} className="px-3 py-1 rounded-md text-sm flex items-center gap-1 bg-[#f6f4ee] text-red-700">
                <Plus className="w-4 h-4" />
                Custom Field
              </button>
              {expandedSections.warranty ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
          {expandedSections.warranty && <div className="p-4 sm:p-6">
              {/* System Details Section */}
              <div className="mb-6">
                <h3 className="text-[#C72030] font-semibold text-sm mb-4">SYSTEM DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextField label="OS" placeholder="Enter OS" name="os" value={itAssetData.os} onChange={e => handleItAssetChange('os', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField label="Total Memory" placeholder="Enter Total Memory" name="totalMemory" value={itAssetData.totalMemory} onChange={e => handleItAssetChange('totalMemory', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField label="Processor" placeholder="Enter Processor" name="processor" value={itAssetData.processor} onChange={e => handleItAssetChange('processor', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  
                  {/* Custom Fields for System Details */}
                  {itCustomFields.filter(field => field.section === 'System Details').map(field => <div key={field.id} className="relative">
                      <TextField label={field.name} placeholder={`Enter ${field.name}`} value={field.value} onChange={e => handleItCustomFieldChange(field.id, e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                  shrink: true
                }} InputProps={{
                  sx: fieldStyles
                }} />
                      <button onClick={() => removeItCustomField(field.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>)}
                </div>
              </div>

              {/* Hard Disk Details Section */}
              <div>
                <h3 className="text-[#C72030] font-semibold text-sm mb-4">HARD DISK DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextField label="Model" placeholder="Enter Model" name="model" value={itAssetData.model} onChange={e => handleItAssetChange('model', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField label="Serial No." placeholder="Enter Serial No." name="serialNo" value={itAssetData.serialNo} onChange={e => handleItAssetChange('serialNo', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  <TextField label="Capacity" placeholder="Enter Capacity" name="capacity" value={itAssetData.capacity} onChange={e => handleItAssetChange('capacity', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} />
                  
                  {/* Custom Fields for Hard Disk Details */}
                  {itCustomFields.filter(field => field.section === 'Hard Disk Details').map(field => <div key={field.id} className="relative">
                      <TextField label={field.name} placeholder={`Enter ${field.name}`} value={field.value} onChange={e => handleItCustomFieldChange(field.id, e.target.value)} fullWidth variant="outlined" InputLabelProps={{
                  shrink: true
                }} InputProps={{
                  sx: fieldStyles
                }} />
                      <button onClick={() => removeItCustomField(field.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                    </div>)}
                </div>
              </div>
            </div>}
        </div>

        {/* Meter Details */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('meterCategory')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              METER DETAILS
              <div className="flex items-center gap-2 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={meterDetailsApplicable} onChange={e => setMeterDetailsApplicable(e.target.checked)} />
                  <div className="w-11 h-6 bg-green-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span className="text-sm text-gray-600">If Applicable</span>
              </div>
            </div>
            {expandedSections.meterCategory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.meterCategory && <div className="p-4 sm:p-6">
              {/* Meter Type Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium text-red-700">Meter Type</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="meter-parent" name="meterType" value="parent" checked={meterType === 'parent'} onChange={e => setMeterType(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="meter-parent" className="text-sm">Parent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="meter-sub" name="meterType" value="sub" checked={meterType === 'sub'} onChange={e => setMeterType(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="meter-sub" className="text-sm">Sub</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-red-700">CRITICAL</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="critical-yes" name="critical" value="yes" checked={critical === 'yes'} onChange={e => setCritical(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="critical-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="critical-no" name="critical" value="no" checked={critical === 'no'} onChange={e => setCritical(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="critical-no" className="text-sm">No</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meter Details Section */}
              <div className="p-4 rounded-lg bg-[#f6f4ee]">
                <h3 className="font-semibold text-sm mb-4 text-red-700">METER DETAILS</h3>
                
                {/* Responsive grid for meter category options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                  {getMeterCategoryOptions().map(option => <div key={option.value} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-center space-x-2 px-3 py-3">
                        <div className="text-gray-600">
                          {option.icon}
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id={option.value} name="meterCategory" value={option.value} checked={meterCategoryType === option.value} onChange={e => handleMeterCategoryChange(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" />
                          <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer font-medium text-center">
                            {option.label}
                          </label>
                        </div>
                      </div>
                    </div>)}
                </div>

                {/* Subcategory options for Board and Renewable */}
                {(meterCategoryType === 'board' || meterCategoryType === 'renewable') && getSubCategoryOptions().length > 0 && <div className="mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {getSubCategoryOptions().map(option => <div key={option.value} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="text-gray-600">
                              {option.icon}
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id={`sub-${option.value}`} name="subMeterCategory" value={option.value} checked={subCategoryType === option.value} onChange={e => setSubCategoryType(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" />
                              <label htmlFor={`sub-${option.value}`} className="text-xs sm:text-sm cursor-pointer font-medium text-center">
                                {option.label}
                              </label>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>}
              </div>
            </div>}
        </div>

        {/* Purchase Details */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('consumption')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                ₹
              </span>
              PURCHASE DETAILS
            </div>
            {expandedSections.consumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.consumption && <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <TextField required label="Purchase Cost" placeholder="Enter Purchase Cost" name="purchaseCost" value={formData.purchaseCost} onChange={e => handleInputChange('purchaseCost', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                
                <TextField required label="Purchase Date" placeholder="dd/mm/yyyy" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={e => handleInputChange('purchaseDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />

                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Under Warranty</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="warranty-yes" name="underWarranty" value="yes" checked={formData.underWarranty === 'yes'} onChange={e => handleInputChange('underWarranty', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="warranty-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="warranty-no" name="underWarranty" value="no" checked={formData.underWarranty === 'no'} onChange={e => handleInputChange('underWarranty', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="warranty-no" className="text-sm">No</label>
                    </div>
                  </div>
                </div>

                <TextField required label="Warranty Expires On" placeholder="dd/mm/yyyy" name="warrantyExpiresOn" type="date" value={formData.warrantyExpiresOn} onChange={e => handleInputChange('warrantyExpiresOn', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
              </div>
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
              <div className="flex items-center gap-2 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={depreciationApplicable} onChange={e => setDepreciationApplicable(e.target.checked)} />
                  <div className="w-11 h-6 bg-green-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span className="text-sm text-gray-600">If Applicable</span>
              </div>
            </div>
            {expandedSections.nonConsumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.nonConsumption && <div className="p-4 sm:p-6">
              {/* Method Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium text-gray-700">Method</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="method-straight-line" name="depreciationMethod" value="straight-line" checked={depreciationMethod === 'straight-line'} onChange={e => setDepreciationMethod(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="method-straight-line" className="text-sm">Straight Line</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="method-wdv" name="depreciationMethod" value="wdv" checked={depreciationMethod === 'wdv'} onChange={e => setDepreciationMethod(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="method-wdv" className="text-sm">WDV</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <TextField required label="Useful Life (in yrs)" placeholder="yrs" name="usefulLife" value={depreciationData.usefulLife} onChange={e => handleDepreciationDataChange('usefulLife', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                
                <TextField required label="Salvage Value" placeholder="Enter Value" name="salvageValue" value={depreciationData.salvageValue} onChange={e => handleDepreciationDataChange('salvageValue', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />

                <TextField required label="Depreciation Rate" placeholder="Enter Value" name="depreciationRate" value={depreciationData.depreciationRate} onChange={e => handleDepreciationDataChange('depreciationRate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
              </div>

              {/* Configuration Scope */}
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="scope-this-only" name="depreciationScope" value="this-only" checked={depreciationScope === 'this-only'} onChange={e => setDepreciationScope(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                  <label htmlFor="scope-this-only" className="text-sm">Configure Depreciation Only For This</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="scope-similar" name="depreciationScope" value="similar" checked={depreciationScope === 'similar'} onChange={e => setDepreciationScope(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                  <label htmlFor="scope-similar" className="text-sm">For Similar Product</label>
                </div>
              </div>
            </div>}
        </div>

        {/* Asset Allocation */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('assetAllocation')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Grid2X2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              ASSET ALLOCATION
            </div>
            {expandedSections.assetAllocation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.assetAllocation && <div className="p-4 sm:p-6">
              {/* Based On Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium text-gray-700">Based On</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="allocation-department" name="basedOn" value="department" checked={assetAllocationData.basedOn === 'department'} onChange={e => handleAssetAllocationChange('basedOn', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="allocation-department" className="text-sm">Department</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="allocation-users" name="basedOn" value="users" checked={assetAllocationData.basedOn === 'users'} onChange={e => handleAssetAllocationChange('basedOn', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" />
                      <label htmlFor="allocation-users" className="text-sm">Users</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="department-select-label" shrink>Department*</InputLabel>
                  <MuiSelect labelId="department-select-label" label="Department*" displayEmpty value={assetAllocationData.department} onChange={(e: SelectChangeEvent) => handleAssetAllocationChange('department', e.target.value)} sx={fieldStyles}>
                    <MenuItem value="">
                      <em>Select...</em>
                    </MenuItem>
                    <MenuItem value="hr">HR Department</MenuItem>
                    <MenuItem value="it">IT Department</MenuItem>
                    <MenuItem value="finance">Finance Department</MenuItem>
                    <MenuItem value="operations">Operations Department</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>}
        </div>

        {/* Asset Loaned */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('assetLoaned')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              ASSET LOANED
              <div className="flex items-center gap-2 ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={assetLoanedApplicable} onChange={e => setAssetLoanedApplicable(e.target.checked)} />
                  <div className="w-11 h-6 bg-green-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span className="text-sm text-gray-600">If Applicable</span>
              </div>
            </div>
            {expandedSections.assetLoaned ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.assetLoaned && <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="vendor-name-select-label" shrink>Vendor Name*</InputLabel>
                  <MuiSelect labelId="vendor-name-select-label" label="Vendor Name*" displayEmpty value={assetLoanedData.vendorName} onChange={(e: SelectChangeEvent) => handleAssetLoanedChange('vendorName', e.target.value)} sx={fieldStyles}>
                    <MenuItem value="">
                      <em>Select Vendor</em>
                    </MenuItem>
                    <MenuItem value="vendor1">Vendor 1</MenuItem>
                    <MenuItem value="vendor2">Vendor 2</MenuItem>
                    <MenuItem value="vendor3">Vendor 3</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField required label="Agreement Start Date" placeholder="dd/mm/yyyy" name="agreementStartDate" type="date" value={assetLoanedData.agreementStartDate} onChange={e => handleAssetLoanedChange('agreementStartDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />

                <TextField required label="Agreement End Date" placeholder="dd/mm/yyyy" name="agreementEndDate" type="date" value={assetLoanedData.agreementEndDate} onChange={e => handleAssetLoanedChange('agreementEndDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
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
              {/* First Row - Vendor, Start Date, End Date, First Service, Payment Terms, No. of Visits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="amc-vendor-select-label" shrink>Vendor</InputLabel>
                  <MuiSelect labelId="amc-vendor-select-label" label="Vendor" displayEmpty value={amcDetailsData.vendor} onChange={(e: SelectChangeEvent) => handleAmcDetailsChange('vendor', e.target.value)} sx={fieldStyles}>
                    <MenuItem value="">
                      <em>Select Vendor</em>
                    </MenuItem>
                    <MenuItem value="vendor1">Vendor 1</MenuItem>
                    <MenuItem value="vendor2">Vendor 2</MenuItem>
                    <MenuItem value="vendor3">Vendor 3</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField required label="Start Date" placeholder="dd/mm/yyyy" name="startDate" type="date" value={amcDetailsData.startDate} onChange={e => handleAmcDetailsChange('startDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />

                <TextField required label="End Date" placeholder="dd/mm/yyyy" name="endDate" type="date" value={amcDetailsData.endDate} onChange={e => handleAmcDetailsChange('endDate', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />

                <TextField required label="First Service" placeholder="dd/mm/yyyy" name="firstService" type="date" value={amcDetailsData.firstService} onChange={e => handleAmcDetailsChange('firstService', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />

                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="payment-terms-select-label" shrink>Payment Terms</InputLabel>
                  <MuiSelect labelId="payment-terms-select-label" label="Payment Terms" displayEmpty value={amcDetailsData.paymentTerms} onChange={(e: SelectChangeEvent) => handleAmcDetailsChange('paymentTerms', e.target.value)} sx={fieldStyles}>
                    <MenuItem value="">
                      <em>Select Payment Terms</em>
                    </MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="half-yearly">Half Yearly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField required label="No. of Visits" placeholder="Enter Value" name="noOfVisits" value={amcDetailsData.noOfVisits} onChange={e => handleAmcDetailsChange('noOfVisits', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
              </div>

              {/* Second Row - AMC Cost */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <TextField required label="AMC Cost" placeholder="Enter AMC Cost" name="amcCost" value={amcDetailsData.amcCost} onChange={e => handleAmcDetailsChange('amcCost', e.target.value)} fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
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
              label: 'Purchaselah Invoice',
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6">
          <button onClick={handleSaveAndShowDetails} className="border border-[#C72030] text-[#C72030] px-6 sm:px-8 py-2 rounded-md hover:bg-[#C72030] hover:text-white text-sm sm:text-base">
            Save & Show Details
          </button>
          <button onClick={handleSaveAndCreateNew} className="px-6 sm:px-8 py-2 rounded-md text-sm sm:text-base bg-[#f6f4ee] text-red-700">
            Save & Create New Asset
          </button>
        </div>
      </div>

      {/* Add Custom Field Modal */}
      <AddCustomFieldModal 
        isOpen={isCustomFieldModalOpen} 
        onClose={() => setIsCustomFieldModalOpen(false)} 
        onAddField={handleAddCustomField}
        isItAsset={activeCustomFieldSection === 'it'}
      />
    </div>;
};
