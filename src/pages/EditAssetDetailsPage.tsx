import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { TextField } from '@mui/material';
import { ArrowLeft, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent
} from '@mui/material';


const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
  '& .MuiInputBase-input': {
    padding: '14px 16px',
    fontSize: '14px',
  },
};

export const EditAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [locationDetailsExpanded, setLocationDetailsExpanded] = useState(true);
  const [assetDetailsExpanded, setAssetDetailsExpanded] = useState(true);
  const [warrantyDetailsExpanded, setWarrantyDetailsExpanded] = useState(true);
  const [meterCategoryExpanded, setMeterCategoryExpanded] = useState(true);
  const [consumptionExpanded, setConsumptionExpanded] = useState(true);
  const [nonConsumptionExpanded, setNonConsumptionExpanded] = useState(true);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(true);
  
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

  const [selectedMeterTypes, setSelectedMeterTypes] = useState<string[]>([]);
  const [consumptionMeasures, setConsumptionMeasures] = useState<any[]>([]);
  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState<any[]>([]);
  const [attachments, setAttachments] = useState({
    manuals: [],
    insurance: [],
    invoice: [],
    amc: []
  });

  const meterTypes = [
    { id: 'board', label: 'Board' },
    { id: 'eg-dg', label: 'EG DG' },
    { id: 'renewable', label: 'Renewable' },
    { id: 'fresh-water', label: 'Fresh Water' },
    { id: 'recycled', label: 'Recycled' },
    { id: 'iex-gdam', label: 'IEX-GDAM' }
  ];

  const unitTypes = [
    'kWh', 'kW', 'Liters', 'Cubic Meters', 'Units', 'Percentage', 'Temperature', 'Pressure'
  ];

  const handleLocationChange = (field: string, value: string) => {
    setLocationData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMeterTypeToggle = (typeId: string) => {
    setSelectedMeterTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleAddConsumptionMeasure = () => {
    const newMeasure = {
      id: Date.now(),
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false
    };
    setConsumptionMeasures(prev => [...prev, newMeasure]);
  };

  const handleAddNonConsumptionMeasure = () => {
    const newMeasure = {
      id: Date.now(),
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false
    };
    setNonConsumptionMeasures(prev => [...prev, newMeasure]);
  };

  const handleRemoveConsumptionMeasure = (id: number) => {
    setConsumptionMeasures(prev => prev.filter(measure => measure.id !== id));
  };

  const handleRemoveNonConsumptionMeasure = (id: number) => {
    setNonConsumptionMeasures(prev => prev.filter(measure => measure.id !== id));
  };

  const handleUpdateConsumptionMeasure = (id: number, field: string, value: string | boolean) => {
    setConsumptionMeasures(prev => prev.map(measure => 
      measure.id === id ? { ...measure, [field]: value } : measure
    ));
  };

  const handleUpdateNonConsumptionMeasure = (id: number, field: string, value: string | boolean) => {
    setNonConsumptionMeasures(prev => prev.map(measure => 
      measure.id === id ? { ...measure, [field]: value } : measure
    ));
  };

  const handleFileUpload = (category: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      console.log(`Uploading files for ${category}:`, Array.from(files));
      // In a real app, you would handle the file upload here
    }
  };

  const handleSaveAndShowDetails = () => {
    console.log('Saving and showing details:', {
      locationData,
      formData,
      selectedMeterTypes,
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
      selectedMeterTypes,
      consumptionMeasures,
      nonConsumptionMeasures,
      attachments
    });
    navigate('/maintenance/asset/add');
  };

  const handleBack = () => {
    navigate(`/maintenance/asset/details/${id}`);
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Asset List
          </button>
          <span>&gt;</span>
          <span>Create New Asset</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">NEW ASSET</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Location Details Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setLocationDetailsExpanded(!locationDetailsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h2 className="text-lg font-semibold text-[#C72030] uppercase">LOCATION DETAILS</h2>
            </div>
            {locationDetailsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {locationDetailsExpanded && (
  <div className="p-6 pt-0 space-y-6">
    {/* First Row */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      {[
        {
          label: 'Site*',
          key: 'site',
          options: ['Lockated', 'Other Site']
        },
        {
          label: 'Building',
          key: 'building',
          options: ['sebc', 'Building A', 'Building B']
        },
        {
          label: 'Wing',
          key: 'wing',
          options: ['North Wing', 'South Wing', 'East Wing', 'West Wing']
        },
        {
          label: 'Area',
          key: 'area',
          options: ['Area 1', 'Area 2', 'Area 3']
        },
        {
          label: 'Floor',
          key: 'floor',
          options: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor']
        }
      ].map(({ label, key, options }) => (
        <FormControl fullWidth key={key} sx={{ ...fieldStyles }}>
          <InputLabel>{label}</InputLabel>
          <MuiSelect
            value={locationData[key as keyof typeof locationData] || ''}
            onChange={(e: SelectChangeEvent) =>
              handleLocationChange(key, e.target.value)
            }
            label={label}
            MenuProps={{
              disablePortal: true,
              PaperProps: { sx: { mt: 0.5, zIndex: 9999, boxShadow: 3 } }
            }}
          >
            <MenuItem value="">
              <em>Select {label}</em>
            </MenuItem>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>
      ))}
    </div>

    {/* Second Row */}
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <FormControl fullWidth sx={{ ...fieldStyles }}>
        <InputLabel>Room</InputLabel>
        <MuiSelect
          value={locationData.room || ''}
          onChange={(e: SelectChangeEvent) =>
            handleLocationChange('room', e.target.value)
          }
          label="Room"
          MenuProps={{
            disablePortal: true,
            PaperProps: { sx: { mt: 0.5, zIndex: 9999, boxShadow: 3 } }
          }}
        >
          <MenuItem value="">
            <em>Select Room</em>
          </MenuItem>
          <MenuItem value="Room 101">Room 101</MenuItem>
          <MenuItem value="Room 102">Room 102</MenuItem>
          <MenuItem value="Room 103">Room 103</MenuItem>
        </MuiSelect>
      </FormControl>
    </div>
  </div>
)}

        </div>

        {/* Asset Details Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setAssetDetailsExpanded(!assetDetailsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h2 className="text-lg font-semibold text-[#C72030] uppercase">ASSET DETAILS</h2>
            </div>
            {assetDetailsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {assetDetailsExpanded && (
            <div className="p-6 pt-0 space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <TextField
                  label="Asset Name*"
                  value={formData.assetName}
                  onChange={(e) => handleInputChange('assetName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
                <TextField
                  label="Asset No.*"
                  value={formData.assetNo}
                  onChange={(e) => handleInputChange('assetNo', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
                <TextField
                  label="Equipment ID*"
                  placeholder="Enter Number"
                  value={formData.equipmentId}
                  onChange={(e) => handleInputChange('equipmentId', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
                <TextField
                  label="Model No."
                  value={formData.modelNo}
                  onChange={(e) => handleInputChange('modelNo', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
                <TextField
                  label="Serial No."
                  value={formData.serialNo}
                  onChange={(e) => handleInputChange('serialNo', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <TextField
                  label="Consumer No."
                  placeholder="Enter Number"
                  value={formData.consumerNo}
                  onChange={(e) => handleInputChange('consumerNo', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
                <TextField
                  label="Purchase Cost*"
                  value={formData.purchaseCost}
                  onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
                <TextField
                  label="Capacity"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
                <TextField
                  label="Unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                />
                <FormControl fullWidth sx={{ ...fieldStyles }}>
                  <InputLabel>Group*</InputLabel>
                  <MuiSelect
                    value={formData.group}
                    onChange={(e: SelectChangeEvent) => handleInputChange('group', e.target.value)}
                    label="Group*"
                    MenuProps={{
                      disablePortal: true,
                      PaperProps: { sx: { mt: 0.5, zIndex: 9999, boxShadow: 3 } }
                    }}
                  >
                    <MenuItem value="Electrical">Electrical</MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormControl fullWidth sx={{ ...fieldStyles }}>
                  <InputLabel>Subgroup*</InputLabel>
                  <MuiSelect
                    value={formData.subgroup}
                    onChange={(e: SelectChangeEvent) => handleInputChange('subgroup', e.target.value)}
                    label="Subgroup*"
                    MenuProps={{
                      disablePortal: true,
                      PaperProps: { sx: { mt: 0.5, zIndex: 9999, boxShadow: 3 } }
                    }}
                  >
                    <MenuItem value="Electric Meter">Electric Meter</MenuItem>
                    <MenuItem value="Water Meter">Water Meter</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField
                  label="Purchased ON Date"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
                <TextField
                  label="Expiry date"
                  type="date"
                  placeholder="Select Date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
                <FormControl fullWidth sx={{ ...fieldStyles }}>
                  <InputLabel>Manufacturer</InputLabel>
                  <MuiSelect
                    value={formData.manufacturer}
                    onChange={(e: SelectChangeEvent) => handleInputChange('manufacturer', e.target.value)}
                    label="Manufacturer"
                    displayEmpty
                    MenuProps={{
                      disablePortal: true,
                      PaperProps: { sx: { mt: 0.5, zIndex: 9999, boxShadow: 3 } }
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Date</em>
                    </MenuItem>
                    <MenuItem value="manufacturer1">Manufacturer 1</MenuItem>
                    <MenuItem value="manufacturer2">Manufacturer 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Radio Groups */}
              <div className="space-y-6">
                {/* Location Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Location Type</Label>
                  <RadioGroup value={formData.locationType} onValueChange={(value) => handleInputChange('locationType', value)} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="common-area" id="common-area" />
                      <Label htmlFor="common-area">Common Area</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="customer" />
                      <Label htmlFor="customer">Customer</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="na" id="na" />
                      <Label htmlFor="na">NA</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Asset Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Asset Type</Label>
                  <RadioGroup value={formData.assetType} onValueChange={(value) => handleInputChange('assetType', value)} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="parent" />
                      <Label htmlFor="parent">Parent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sub" id="sub" />
                      <Label htmlFor="sub">Sub</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Status */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Status</Label>
                  <RadioGroup value={formData.status} onValueChange={(value) => handleInputChange('status', value)} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-use" id="in-use" />
                      <Label htmlFor="in-use">In Use</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="breakdown" id="breakdown" />
                      <Label htmlFor="breakdown">Breakdown</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Critical */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Critical</Label>
                  <RadioGroup value={formData.critical} onValueChange={(value) => handleInputChange('critical', value)} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Meter Applicable */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="meter-applicable" 
                    checked={formData.meterApplicable}
                    onCheckedChange={(checked) => handleInputChange('meterApplicable', checked === true)}
                  />
                  <Label htmlFor="meter-applicable">Meter Applicable</Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Warranty Details Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setWarrantyDetailsExpanded(!warrantyDetailsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h2 className="text-lg font-semibold text-[#C72030] uppercase">WARRANTY DETAILS</h2>
            </div>
            {warrantyDetailsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {warrantyDetailsExpanded && (
            <div className="p-6 pt-0 space-y-6">
              {/* Under Warranty */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Under Warranty</Label>
                <RadioGroup value={formData.underWarranty} onValueChange={(value) => handleInputChange('underWarranty', value)} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="warranty-yes" />
                    <Label htmlFor="warranty-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="warranty-no" />
                    <Label htmlFor="warranty-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Warranty Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextField
                  label="Warranty Start Date"
                  type="date"
                  placeholder="Select Date"
                  value={formData.warrantyStartDate}
                  onChange={(e) => handleInputChange('warrantyStartDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
                <TextField
                  label="Warranty expires on"
                  type="date"
                  placeholder="Select Date"
                  value={formData.warrantyExpiresOn}
                  onChange={(e) => handleInputChange('warrantyExpiresOn', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
                <TextField
                  label="Commissioning Date"
                  type="date"
                  placeholder="Select Date"
                  value={formData.commissioningDate}
                  onChange={(e) => handleInputChange('commissioningDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
              </div>
            </div>
          )}
        </div>

        {/* Meter Category Type Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setMeterCategoryExpanded(!meterCategoryExpanded)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <h2 className="text-lg font-semibold text-[#C72030] uppercase">METER CATEGORY TYPE</h2>
            </div>
            {meterCategoryExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {meterCategoryExpanded && (
            <div className="p-6 pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {meterTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedMeterTypes.includes(type.id)
                        ? 'border-[#C72030] bg-[#C72030]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleMeterTypeToggle(type.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMeterTypes.includes(type.id)
                          ? 'border-[#C72030] bg-[#C72030]'
                          : 'border-gray-300'
                      }`} />
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Consumption Asset Measure Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setConsumptionExpanded(!consumptionExpanded)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                5
              </div>
              <h2 className="text-lg font-semibold text-[#C72030] uppercase">CONSUMPTION ASSET MEASURE</h2>
            </div>
            {consumptionExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {consumptionExpanded && (
            <div className="p-6 pt-0 space-y-4">
              <Button 
                onClick={handleAddConsumptionMeasure}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Consumption Measure
              </Button>
              
              {consumptionMeasures.map((measure, index) => (
                <div key={measure.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveConsumptionMeasure(measure.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <TextField
                      label="Name"
                      placeholder="Enter Text"
                      value={measure.name}
                      onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'name', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <FormControl fullWidth sx={{ ...fieldStyles }}>
                      <InputLabel>Unit Type</InputLabel>
                      <MuiSelect
                        value={measure.unitType}
                        onChange={(e: SelectChangeEvent) => handleUpdateConsumptionMeasure(measure.id, 'unitType', e.target.value)}
                        label="Unit Type"
                        displayEmpty
                        MenuProps={{
                          disablePortal: true,
                          PaperProps: { sx: { mt: 0.5, zIndex: 9999, boxShadow: 3 } }
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Unit Type</em>
                        </MenuItem>
                        {unitTypes.map((unit) => (
                          <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Min"
                      placeholder="Enter Number"
                      value={measure.min}
                      onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'min', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Max"
                      placeholder="Enter Number"
                      value={measure.max}
                      onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'max', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Alert Below Val."
                      placeholder="Enter Value"
                      value={measure.alertBelowVal}
                      onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                      label="Alert Above Val."
                      placeholder="Enter Value"
                      value={measure.alertAboveVal}
                      onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Multiplier Factor"
                      placeholder="Enter Text"
                      value={measure.multiplierFactor}
                      onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox 
                        id={`check-previous-reading-${measure.id}`}
                        checked={measure.checkPreviousReading}
                        onCheckedChange={(checked) => handleUpdateConsumptionMeasure(measure.id, 'checkPreviousReading', checked === true)}
                      />
                      <Label htmlFor={`check-previous-reading-${measure.id}`} className="text-sm font-medium">Check Previous Reading</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Non Consumption Asset Measure Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setNonConsumptionExpanded(!nonConsumptionExpanded)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                6
              </div>
              <h2 className="text-lg font-semibold text-[#C72030] uppercase">NON CONSUMPTION ASSET MEASURE</h2>
            </div>
            {nonConsumptionExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {nonConsumptionExpanded && (
            <div className="p-6 pt-0 space-y-4">
              <Button 
                onClick={handleAddNonConsumptionMeasure}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Non-Consumption Measure
              </Button>
              
              {nonConsumptionMeasures.map((measure, index) => (
                <div key={measure.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                  <div className="flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveNonConsumptionMeasure(measure.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <TextField
                      label="Name"
                      placeholder="Name"
                      value={measure.name}
                      onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'name', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <FormControl fullWidth sx={{ ...fieldStyles }}>
                      <InputLabel>Unit Type</InputLabel>
                      <MuiSelect
                        value={measure.unitType}
                        onChange={(e: SelectChangeEvent) => handleUpdateNonConsumptionMeasure(measure.id, 'unitType', e.target.value)}
                        label="Unit Type"
                        displayEmpty
                        MenuProps={{
                          disablePortal: true,
                          PaperProps: { sx: { mt: 0.5, zIndex: 9999, boxShadow: 3 } }
                        }}
                      >
                        <MenuItem value="">
                          <em>Select Unit Type</em>
                        </MenuItem>
                        {unitTypes.map((unit) => (
                          <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <TextField
                      label="Min"
                      placeholder="Min"
                      value={measure.min}
                      onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'min', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Max"
                      placeholder="Max"
                      value={measure.max}
                      onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'max', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Alert Below Val."
                      placeholder="Alert Below Value"
                      value={measure.alertBelowVal}
                      onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextField
                      label="Alert Above Val."
                      placeholder="Alert Above Value"
                      value={measure.alertAboveVal}
                      onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <TextField
                      label="Multiplier Factor"
                      placeholder="Multiplier Factor"
                      value={measure.multiplierFactor}
                      onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)}
                      fullWidth
                      variant="outlined"
                      sx={fieldStyles}
                    />
                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox 
                        id={`check-previous-reading-nc-${measure.id}`}
                        checked={measure.checkPreviousReading}
                        onCheckedChange={(checked) => handleUpdateNonConsumptionMeasure(measure.id, 'checkPreviousReading', checked === true)}
                      />
                      <Label htmlFor={`check-previous-reading-nc-${measure.id}`} className="text-sm font-medium">Check Previous Reading</Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attachments Section */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => setAttachmentsExpanded(!attachmentsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
                7
              </div>
              <h2 className="text-lg font-semibold text-[#C72030] uppercase">ATTACHMENTS</h2>
            </div>
            {attachmentsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {attachmentsExpanded && (
            <div className="p-6 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Manuals Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload('manuals', e)}
                      className="hidden"
                      id="manuals-upload"
                    />
                    <label htmlFor="manuals-upload" className="cursor-pointer">
                      <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload files</p>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Insurance Details</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload('insurance', e)}
                      className="hidden"
                      id="insurance-upload"
                    />
                    <label htmlFor="insurance-upload" className="cursor-pointer">
                      <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload files</p>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Purchase Invoice</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload('invoice', e)}
                      className="hidden"
                      id="invoice-upload"
                    />
                    <label htmlFor="invoice-upload" className="cursor-pointer">
                      <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload files</p>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">AMC</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileUpload('amc', e)}
                      className="hidden"
                      id="amc-upload"
                    />
                    <label htmlFor="amc-upload" className="cursor-pointer">
                      <Plus className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload files</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6">
          <div className="flex gap-4">
            <Button 
              onClick={handleSaveAndShowDetails}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
            >
              Save & Show Details
            </Button>
            <Button 
              onClick={handleSaveAndCreateNew}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 px-8"
            >
              Save & Create New Asset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
