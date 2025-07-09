import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { TextField } from '@mui/material';
import { ArrowLeft, ChevronDown, ChevronUp, Plus, X, MapPin, Package, Shield, Activity, TrendingUp, BarChart, Paperclip, Percent, Zap, Sun, Droplet, Recycle, BarChart3 } from 'lucide-react';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent, Radio, RadioGroup as MuiRadioGroup, FormControlLabel } from '@mui/material';
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
  const getMeterCategoryOptions = () => [{
    value: 'board',
    label: 'Board',
    icon: <BarChart3 className="w-6 h-6" />
  }, {
    value: 'dg',
    label: 'DG',
    icon: <Zap className="w-6 h-6" />
  }, {
    value: 'renewable',
    label: 'Renewable',
    icon: <Sun className="w-6 h-6" />
  }, {
    value: 'fresh-water',
    label: 'Fresh Water',
    icon: <Droplet className="w-6 h-6" />
  }, {
    value: 'recycled',
    label: 'Recycled',
    icon: <Recycle className="w-6 h-6" />
  }, {
    value: 'iex-gdam',
    label: 'IEX-GDAM',
    icon: <BarChart className="w-6 h-6" />
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
              <button className="px-3 py-1 rounded-md text-sm flex items-center gap-1 bg-[#f6f4ee] text-red-700">
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
                  <div className="w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
                <span className="text-sm text-gray-600">If Applicable</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded-md text-sm flex items-center gap-1 bg-[#f6f4ee] text-red-700">
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
                  <div className="w-11 h-6 bg-red-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
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
                
                {/* First row with 5 boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4">
                  {getMeterCategoryOptions().slice(0, 5).map(option => <div key={option.value} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-gray-600">
                          {option.icon}
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id={option.value} name="meterCategory" value={option.value} checked={meterCategoryType === option.value} onChange={e => handleMeterCategoryChange(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" />
                          <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer font-medium">
                            {option.label}
                          </label>
                        </div>
                      </div>
                    </div>)}
                </div>

                {/* Second row with remaining box centered */}
                <div className="flex justify-center">
                  {getMeterCategoryOptions().slice(5).map(option => <div key={option.value} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm w-48">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-gray-600">
                          {option.icon}
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id={option.value} name="meterCategory" value={option.value} checked={meterCategoryType === option.value} onChange={e => handleMeterCategoryChange(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" />
                          <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer font-medium">
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
                          <div className="flex flex-col items-center space-y-2">
                            <div className="text-gray-600">
                              {option.icon}
                            </div>
                            <div className="flex items-center space-x-2">
                              <input type="radio" id={`sub-${option.value}`} name="subMeterCategory" value={option.value} checked={subCategoryType === option.value} onChange={e => setSubCategoryType(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" />
                              <label htmlFor={`sub-${option.value}`} className="text-xs sm:text-sm cursor-pointer font-medium">
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

        {/* Consumption Asset Measure */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('consumption')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              CONSUMPTION ASSET MEASURE
            </div>
            {expandedSections.consumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.consumption && <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {consumptionMeasures.map(measure => <div key={measure.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700 text-sm sm:text-base">Consumption Asset Measure</h4>
                      {consumptionMeasures.length > 1 && <button onClick={() => removeConsumptionMeasure(measure.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                          <X className="w-4 h-4" />
                        </button>}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      {[{
                  label: 'Name',
                  name: `name-${measure.id}`,
                  placeholder: 'Enter Text',
                  value: measure.name,
                  onChange: e => updateConsumptionMeasure(measure.id, 'name', e.target.value)
                }, {
                  label: 'Min',
                  name: `min-${measure.id}`,
                  placeholder: 'Enter Number',
                  type: 'number',
                  value: measure.min,
                  onChange: e => updateConsumptionMeasure(measure.id, 'min', e.target.value)
                }, {
                  label: 'Max',
                  name: `max-${measure.id}`,
                  placeholder: 'Enter Number',
                  type: 'number',
                  value: measure.max,
                  onChange: e => updateConsumptionMeasure(measure.id, 'max', e.target.value)
                }, {
                  label: 'Alert Below Val.',
                  name: `alertBelow-${measure.id}`,
                  placeholder: 'Enter Value',
                  type: 'number',
                  value: measure.alertBelowVal,
                  onChange: e => updateConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)
                }].map(field => <TextField key={field.name} label={field.label} placeholder={field.placeholder} name={field.name} type={field.type || 'text'} value={field.value} onChange={field.onChange} fullWidth variant="outlined" InputLabelProps={{
                  shrink: true
                }} InputProps={{
                  sx: fieldStyles
                }} />)}
                      <FormControl fullWidth variant="outlined" sx={{
                  minWidth: 120
                }}>
                        <InputLabel id={`unitType-select-label-${measure.id}`} shrink>Unit Type</InputLabel>
                        <MuiSelect labelId={`unitType-select-label-${measure.id}`} label="Unit Type" displayEmpty value={measure.unitType} onChange={e => updateConsumptionMeasure(measure.id, 'unitType', e.target.value)} sx={fieldStyles}>
                          <MenuItem value=""><em>Select Unit Type</em></MenuItem>
                          <MenuItem value="kwh">kWh</MenuItem>
                          <MenuItem value="liters">Liters</MenuItem>
                          <MenuItem value="cubic-meters">Cubic Meters</MenuItem>
                          <MenuItem value="units">Units</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {[{
                  label: 'Alert Above Val.',
                  name: `alertAbove-${measure.id}`,
                  placeholder: 'Enter Value',
                  type: 'number',
                  value: measure.alertAboveVal,
                  onChange: e => updateConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)
                }, {
                  label: 'Multiplier Factor',
                  name: `multiplier-${measure.id}`,
                  placeholder: 'Enter Text',
                  value: measure.multiplierFactor,
                  onChange: e => updateConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)
                }].map(field => <TextField key={field.name} label={field.label} placeholder={field.placeholder} name={field.name} type={field.type || 'text'} value={field.value} onChange={field.onChange} fullWidth variant="outlined" InputLabelProps={{
                  shrink: true
                }} InputProps={{
                  sx: fieldStyles
                }} />)}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id={`checkPrevious-${measure.id}`} checked={measure.checkPreviousReading} onChange={e => updateConsumptionMeasure(measure.id, 'checkPreviousReading', e.target.checked)} className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]" style={{
                  accentColor: '#C72030'
                }} />
                      <label htmlFor={`checkPrevious-${measure.id}`} className="text-xs sm:text-sm">Check Previous Reading</label>
                    </div>
                  </div>)}
                
                <button onClick={addConsumptionMeasure} className="px-4 py-2 rounded-md flex items-center text-sm sm:text-base bg-[#f6f4ee] text-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Measure
                </button>
              </div>
            </div>}
        </div>

        {/* Non Consumption Asset Measure */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('nonConsumption')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <BarChart className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              NON CONSUMPTION ASSET MEASURE
            </div>
            {expandedSections.nonConsumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.nonConsumption && <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {nonConsumptionMeasures.map(measure => <div key={measure.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700 text-sm sm:text-base">Non Consumption Asset Measure</h4>
                      {nonConsumptionMeasures.length > 1 && <button onClick={() => removeNonConsumptionMeasure(measure.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded">
                          <X className="w-4 h-4" />
                        </button>}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      {[{
                  label: 'Name',
                  name: `nc-name-${measure.id}`,
                  placeholder: 'Name',
                  value: measure.name,
                  onChange: e => updateNonConsumptionMeasure(measure.id, 'name', e.target.value)
                }, {
                  label: 'Min',
                  name: `nc-min-${measure.id}`,
                  placeholder: 'Min',
                  type: 'number',
                  value: measure.min,
                  onChange: e => updateNonConsumptionMeasure(measure.id, 'min', e.target.value)
                }, {
                  label: 'Max',
                  name: `nc-max-${measure.id}`,
                  placeholder: 'Max',
                  type: 'number',
                  value: measure.max,
                  onChange: e => updateNonConsumptionMeasure(measure.id, 'max', e.target.value)
                }, {
                  label: 'Alert Below Val.',
                  name: `nc-alertBelow-${measure.id}`,
                  placeholder: 'Alert Below Value',
                  type: 'number',
                  value: measure.alertBelowVal,
                  onChange: e => updateNonConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)
                }].map(field => <TextField key={field.name} label={field.label} placeholder={field.placeholder} name={field.name} type={field.type || 'text'} value={field.value} onChange={field.onChange} fullWidth variant="outlined" InputLabelProps={{
                  shrink: true
                }} InputProps={{
                  sx: fieldStyles
                }} />)}
                      <FormControl fullWidth variant="outlined" sx={{
                  minWidth: 120
                }}>
                        <InputLabel id={`nc-unitType-select-label-${measure.id}`} shrink>Unit Type</InputLabel>
                        <MuiSelect labelId={`nc-unitType-select-label-${measure.id}`} label="Unit Type" displayEmpty value={measure.unitType} onChange={e => updateNonConsumptionMeasure(measure.id, 'unitType', e.target.value)} sx={fieldStyles}>
                          <MenuItem value=""><em>Select Unit Type</em></MenuItem>
                          <MenuItem value="temperature">Temperature</MenuItem>
                          <MenuItem value="pressure">Pressure</MenuItem>
                          <MenuItem value="voltage">Voltage</MenuItem>
                          <MenuItem value="current">Current</MenuItem>
                          <MenuItem value="frequency">Frequency</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {[{
                  label: 'Alert Above Val.',
                  name: `nc-alertAbove-${measure.id}`,
                  placeholder: 'Alert Above Value',
                  type: 'number',
                  value: measure.alertAboveVal,
                  onChange: e => updateNonConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)
                }, {
                  label: 'Multiplier Factor',
                  name: `nc-multiplier-${measure.id}`,
                  placeholder: 'Multiplier Factor',
                  value: measure.multiplierFactor,
                  onChange: e => updateNonConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)
                }].map(field => <TextField key={field.name} label={field.label} placeholder={field.placeholder} name={field.name} type={field.type || 'text'} value={field.value} onChange={field.onChange} fullWidth variant="outlined" InputLabelProps={{
                  shrink: true
                }} InputProps={{
                  sx: fieldStyles
                }} />)}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id={`nc-checkPrevious-${measure.id}`} checked={measure.checkPreviousReading} onChange={e => updateNonConsumptionMeasure(measure.id, 'checkPreviousReading', e.target.checked)} className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]" style={{
                  accentColor: '#C72030'
                }} />
                      <label htmlFor={`nc-checkPrevious-${measure.id}`} className="text-xs sm:text-sm">Check Previous Reading</label>
                    </div>
                  </div>)}
                
                <button onClick={addNonConsumptionMeasure} className="px-4 py-2 rounded-md flex items-center text-sm sm:text-base bg-[#f6f4ee] text-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Measure
                </button>
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
    </div>;
};
