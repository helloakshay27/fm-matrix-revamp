import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, X, Plus } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

export const AddAssetPage = () => {
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

  const [meterCategoryType, setMeterCategoryType] = useState('');
  const [subCategoryType, setSubCategoryType] = useState('');

  // State for consumption asset measures
  const [consumptionMeasures, setConsumptionMeasures] = useState([
    {
      id: 1,
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false
    }
  ]);

  // State for non-consumption asset measures
  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([
    {
      id: 1,
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false
    }
  ]);

  const [attachments, setAttachments] = useState({
    manualsUpload: [] as File[],
    insuranceDetails: [] as File[],
    purchaseInvoice: [] as File[],
    amc: [] as File[]
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFileUpload = (category: keyof typeof attachments, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(prev => ({
        ...prev,
        [category]: [...prev[category], ...fileArray]
      }));
    }
  };

  const removeFile = (category: keyof typeof attachments, index: number) => {
    setAttachments(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleSaveAndShow = () => {
    console.log('Save and show details');
    navigate('/maintenance/asset');
  };

  const handleSaveAndCreate = () => {
    console.log('Save and create new asset');
    // Reset form or navigate as needed
  };

  const getMeterCategoryOptions = () => {
    return [
      { value: 'board', label: 'Board' },
      { value: 'dg', label: 'DG' },
      { value: 'renewable', label: 'Renewable' },
      { value: 'fresh-water', label: 'Fresh Water' },
      { value: 'recycled', label: 'Recycled' },
      { value: 'iex-gdam', label: 'IEX-GDAM' }
    ];
  };

  const getSubCategoryOptions = () => {
    switch (meterCategoryType) {
      case 'board':
        return [
          { value: 'ht', label: 'HT' },
          { value: 'vcb', label: 'VCB' },
          { value: 'transformer', label: 'Transformer' },
          { value: 'lt', label: 'LT' }
        ];
      case 'renewable':
        return [
          { value: 'solar', label: 'Solar' },
          { value: 'bio-methanol', label: 'Bio Methanol' },
          { value: 'wind', label: 'Wind' }
        ];
      case 'fresh-water':
        return [
          { value: 'source', label: 'Source (Input)' },
          { value: 'destination', label: 'Destination (Output)' }
        ];
      default:
        return [];
    }
  };

  const handleMeterCategoryChange = (value: string) => {
    setMeterCategoryType(value);
    setSubCategoryType(''); // Reset sub-category when main category changes
  };

  // Functions for consumption measures
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

  const removeConsumptionMeasure = (id: number) => {
    if (consumptionMeasures.length > 1) {
      setConsumptionMeasures(consumptionMeasures.filter(m => m.id !== id));
    }
  };

  const updateConsumptionMeasure = (id: number, field: string, value: any) => {
    setConsumptionMeasures(consumptionMeasures.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  // Functions for non-consumption measures
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

  const removeNonConsumptionMeasure = (id: number) => {
    if (nonConsumptionMeasures.length > 1) {
      setNonConsumptionMeasures(nonConsumptionMeasures.filter(m => m.id !== id));
    }
  };

  const updateNonConsumptionMeasure = (id: number, field: string, value: any) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  // Responsive styles for TextField and Select
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      '&::placeholder': {
        fontSize: { xs: '12px', sm: '13px', md: '14px' }, // Default for text fields
        opacity: 1,
      },
      '&[type="date"]::placeholder': {
        fontSize: { xs: '11px', sm: '12px', md: '13px' }, // Smaller for date fields
        opacity: 1,
      },
    },
    '& .MuiInputBase-root': {
      '& .MuiSelect-select': {
        fontSize: { xs: '11px', sm: '12px', md: '13px' }, // Smaller for dropdowns
      },
      '& .MuiMenuItem-root': {
        fontSize: { xs: '11px', sm: '12px', md: '13px' }, // Smaller for dropdown menu items
      },
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Asset List</span>
          <span>></span>
          <span className="text-gray-900 font-medium">Create New Asset</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">NEW ASSET</h1>
      </div>

      <div className="space-y-6">
        {/* Location Details */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030]"
            onClick={() => toggleSection('location')}
          >
            <CardTitle className="flex items-center justify-between text-[#C72030]">
              <span className="flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                LOCATION DETAILS
              </span>
              {expandedSections.location ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.location && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="site-select-label" shrink>Site</InputLabel>
                    <MuiSelect
                      labelId="site-select-label"
                      label="Site"
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Site</em></MenuItem>
                      <MenuItem value="site1">Site 1</MenuItem>
                      <MenuItem value="site2">Site 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="building-select-label" shrink>Building</InputLabel>
                    <MuiSelect
                      labelId="building-select-label"
                      label="Building"
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Building</em></MenuItem>
                      <MenuItem value="building1">Building 1</MenuItem>
                      <MenuItem value="building2">Building 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
                    <MuiSelect
                      labelId="wing-select-label"
                      label="Wing"
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Wing</em></MenuItem>
                      <MenuItem value="wing1">Wing 1</MenuItem>
                      <MenuItem value="wing2">Wing 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="area-select-label" shrink>Area</InputLabel>
                    <MuiSelect
                      labelId="area-select-label"
                      label="Area"
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Area</em></MenuItem>
                      <MenuItem value="area1">Area 1</MenuItem>
                      <MenuItem value="area2">Area 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
                    <MuiSelect
                      labelId="floor-select-label"
                      label="Floor"
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Floor</em></MenuItem>
                      <MenuItem value="floor1">Floor 1</MenuItem>
                      <MenuItem value="floor2">Floor 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="room-select-label" shrink>Room</InputLabel>
                    <MuiSelect
                      labelId="room-select-label"
                      label="Room"
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Room</em></MenuItem>
                      <MenuItem value="room1">Room 1</MenuItem>
                      <MenuItem value="room2">Room 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Asset Details */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030]"
            onClick={() => toggleSection('asset')}
          >
            <CardTitle className="flex items-center justify-between text-[#C72030]">
              <span className="flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                ASSET DETAILS
              </span>
              {expandedSections.asset ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.asset && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <TextField
                    required
                    label="Asset Name"
                    placeholder="Enter Name"
                    name="assetName"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    required
                    label="Asset No."
                    placeholder="Enter Number"
                    name="assetNo"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    required
                    label="Equipment ID"
                    placeholder="Enter Number"
                    name="equipmentId"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <TextField
                    label="Model No."
                    placeholder="Enter Number"
                    name="modelNo"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    label="Serial No."
                    placeholder="Enter Number"
                    name="serialNo"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    label="Consumer No."
                    placeholder="Enter Number"
                    name="consumerNo"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <TextField
                    required
                    label="Purchase Cost"
                    placeholder="Enter Numeric value"
                    name="purchaseCost"
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    label="Capacity"
                    placeholder="Enter Text"
                    name="capacity"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    label="Unit"
                    placeholder="Enter Text"
                    name="unit"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="group-select-label" shrink>Group</InputLabel>
                    <MuiSelect
                      labelId="group-select-label"
                      label="Group"
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Group</em></MenuItem>
                      <MenuItem value="group1">Group 1</MenuItem>
                      <MenuItem value="group2">Group 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="subgroup-select-label" shrink>Subgroup</InputLabel>
                    <MuiSelect
                      labelId="subgroup-select-label"
                      label="Subgroup"
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Subgroup</em></MenuItem>
                      <MenuItem value="subgroup1">Subgroup 1</MenuItem>
                      <MenuItem value="subgroup2">Subgroup 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <TextField
                    label="Purchased ON Date"
                    placeholder="Select Date"
                    name="purchaseDate"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <TextField
                    label="Expiry date"
                    placeholder="Select Date"
                    name="expiryDate"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    label="Manufacturer"
                    placeholder="Enter Text"
                    name="manufacturer"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium">Location Type</label>
                  <RadioGroup defaultValue="common" className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="common" id="common" />
                      <label htmlFor="common">Common Area</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="customer" id="customer" />
                      <label htmlFor="customer">Customer</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="na" id="na" />
                      <label htmlFor="na">NA</label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <label className="text-sm font-medium">Asset Type</label>
                  <RadioGroup defaultValue="parent" className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="parent" />
                      <label htmlFor="parent">Parent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sub" id="sub" />
                      <label htmlFor="sub">Sub</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <RadioGroup defaultValue="inuse" className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inuse" id="inuse" />
                      <label htmlFor="inuse">In Use</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="breakdown" id="breakdown" />
                      <label htmlFor="breakdown">Breakdown</label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <label className="text-sm font-medium">Critical</label>
                  <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <label htmlFor="yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <label htmlFor="no">No</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="meterApplicable" />
                <label htmlFor="meterApplicable">Meter Applicable</label>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Warranty Details */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030]"
            onClick={() => toggleSection('warranty')}
          >
            <CardTitle className="flex items-center justify-between text-[#C72030]">
              <span className="flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Warranty Details
              </span>
              {expandedSections.warranty ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.warranty && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="text-sm font-medium">Under Warranty</label>
                  <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="warranty-yes" />
                      <label htmlFor="warranty-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="warranty-no" />
                      <label htmlFor="warranty-no">No</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <TextField
                    label="Warranty Start Date"
                    placeholder="Select Date"
                    name="warrantyStart"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    label="Warranty expires on"
                    placeholder="Select Date"
                    name="warrantyExpires"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
                <div>
                  <TextField
                    label="Commissioning Date"
                    placeholder="Select Date"
                    name="commissioningDate"
                    type="date"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: fieldStyles
                    }}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Meter Category Type */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030]"
            onClick={() => toggleSection('meterCategory')}
          >
            <CardTitle className="flex items-center justify-between text-[#C72030]">
              <span className="flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Meter Category Type
              </span>
              {expandedSections.meterCategory ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.meterCategory && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                {getMeterCategoryOptions().map((option) => (
                  <div key={option.value} className="bg-purple-100 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <input
                        type="radio"
                        id={option.value}
                        name="meterCategory"
                        value={option.value}
                        checked={meterCategoryType === option.value}
                        onChange={(e) => handleMeterCategoryChange(e.target.value)}
                        className="w-4 h-4 text-[#C72030] bg-gray-100 border-gray-300 focus:ring-[#C72030] focus:ring-2"
                      />
                      <label htmlFor={option.value} className="text-sm cursor-pointer">
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {getSubCategoryOptions().length > 0 && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getSubCategoryOptions().map((option) => (
                      <div key={option.value} className="bg-purple-100 p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <input
                            type="radio"
                            id={`sub-${option.value}`}
                            name="subMeterCategory"
                            value={option.value}
                            checked={subCategoryType === option.value}
                            onChange={(e) => setSubCategoryType(e.target.value)}
                            className="w-4 h-4 text-[#C72030] bg-gray-100 border-gray-300 focus:ring-[#C72030] focus:ring-2"
                          />
                          <label htmlFor={`sub-${option.value}`} className="text-sm cursor-pointer">
                            {option.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Consumption Asset Measure */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030]"
            onClick={() => toggleSection('consumption')}
          >
            <CardTitle className="flex items-center justify-between text-[#C72030]">
              <span className="flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                CONSUMPTION ASSET MEASURE
              </span>
              {expandedSections.consumption ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.consumption && (
            <CardContent className="pt-6">
              <div className="space-y-6">
                {consumptionMeasures.map((measure) => (
                  <div key={measure.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">Consumption Asset Measure</h4>
                      {consumptionMeasures.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeConsumptionMeasure(measure.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <TextField
                          label="Name"
                          placeholder="Enter Text"
                          name={`name-${measure.id}`}
                          value={measure.name}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'name', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                      <div>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id={`unitType-select-label-${measure.id}`} shrink>Unit Type</InputLabel>
                          <MuiSelect
                            labelId={`unitType-select-label-${measure.id}`}
                            label="Unit Type"
                            displayEmpty
                            value={measure.unitType}
                            onChange={(e) => updateConsumptionMeasure(measure.id, 'unitType', e.target.value)}
                            sx={fieldStyles}
                          >
                            <MenuItem value=""><em>Select Unit Type</em></MenuItem>
                            <MenuItem value="kwh">kWh</MenuItem>
                            <MenuItem value="liters">Liters</MenuItem>
                            <MenuItem value="cubic-meters">Cubic Meters</MenuItem>
                            <MenuItem value="units">Units</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          label="Min"
                          placeholder="Enter Number"
                          name={`min-${measure.id}`}
                          type="number"
                          value={measure.min}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'min', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Max"
                          placeholder="Enter Number"
                          name={`max-${measure.id}`}
                          type="number"
                          value={measure.max}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'max', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Alert Below Val."
                          placeholder="Enter Value"
                          name={`alertBelow-${measure.id}`}
                          type="number"
                          value={measure.alertBelowVal}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <TextField
                          label="Alert Above Val."
                          placeholder="Enter Value"
                          name={`alertAbove-${measure.id}`}
                          type="number"
                          value={measure.alertAboveVal}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Multiplier Factor"
                          placeholder="Enter Text"
                          name={`multiplier-${measure.id}`}
                          value={measure.multiplierFactor}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`checkPrevious-${measure.id}`}
                        checked={measure.checkPreviousReading}
                        onCheckedChange={(checked) => updateConsumptionMeasure(measure.id, 'checkPreviousReading', checked)}
                      />
                      <label htmlFor={`checkPrevious-${measure.id}`}>Check Previous Reading</label>
                    </div>
                  </div>
                ))}
                
                <Button 
                  onClick={addConsumptionMeasure}
                  style={{ backgroundColor: '#C72030' }}
                  className="text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Measure
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Non Consumption Asset Measure */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030]"
            onClick={() => toggleSection('nonConsumption')}
          >
            <CardTitle className="flex items-center justify-between text-[#C72030]">
              <span className="flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                NON CONSUMPTION ASSET MEASURE
              </span>
              {expandedSections.nonConsumption ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.nonConsumption && (
            <CardContent className="pt-6">
              <div className="space-y-6">
                {nonConsumptionMeasures.map((measure) => (
                  <div key={measure.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700">Non Consumption Asset Measure</h4>
                      {nonConsumptionMeasures.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeNonConsumptionMeasure(measure.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <TextField
                          label="Name"
                          placeholder="Name"
                          name={`nc-name-${measure.id}`}
                          value={measure.name}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'name', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                      <div>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id={`nc-unitType-select-label-${measure.id}`} shrink>Unit Type</InputLabel>
                          <MuiSelect
                            labelId={`nc-unitType-select-label-${measure.id}`}
                            label="Unit Type"
                            displayEmpty
                            value={measure.unitType}
                            onChange={(e) => updateNonConsumptionMeasure(measure.id, 'unitType', e.target.value)}
                            sx={fieldStyles}
                          >
                            <MenuItem value=""><em>Select Unit Type</em></MenuItem>
                            <MenuItem value="temperature">Temperature</MenuItem>
                            <MenuItem value="pressure">Pressure</MenuItem>
                            <MenuItem value="voltage">Voltage</MenuItem>
                            <MenuItem value="current">Current</MenuItem>
                            <MenuItem value="frequency">Frequency</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          label="Min"
                          placeholder="Min"
                          name={`nc-min-${measure.id}`}
                          type="number"
                          value={measure.min}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'min', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Max"
                          placeholder="Max"
                          name={`nc-max-${measure.id}`}
                          type="number"
                          value={measure.max}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'max', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Alert Below Val."
                          placeholder="Alert Below Value"
                          name={`nc-alertBelow-${measure.id}`}
                          type="number"
                          value={measure.alertBelowVal}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <TextField
                          label="Alert Above Val."
                          placeholder="Alert Above Value"
                          name={`nc-alertAbove-${measure.id}`}
                          type="number"
                          value={measure.alertAboveVal}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Multiplier Factor"
                          placeholder="Multiplier Factor"
                          name={`nc-multiplier-${measure.id}`}
                          value={measure.multiplierFactor}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            sx: fieldStyles
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`nc-checkPrevious-${measure.id}`}
                        checked={measure.checkPreviousReading}
                        onCheckedChange={(checked) => updateNonConsumptionMeasure(measure.id, 'checkPreviousReading', checked)}
                      />
                      <label htmlFor={`nc-checkPrevious-${measure.id}`}>Check Previous Reading</label>
                    </div>
                  </div>
                ))}
                
                <Button 
                  onClick={addNonConsumptionMeasure}
                  style={{ backgroundColor: '#C72030' }}
                  className="text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Measure
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030]"
            onClick={() => toggleSection('attachments')}
          >
            <CardTitle className="flex items-center justify-between text-[#C72030]">
              <span className="flex items-center gap-2">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
                ATTACHMENTS
              </span>
              {expandedSections.attachments ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {expandedSections.attachments && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manuals Upload */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Manuals Upload</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileUpload('manualsUpload', e.target.files)}
                      className="hidden"
                      id="manuals-upload"
                    />
                    <label htmlFor="manuals-upload" className="cursor-pointer block">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-[#C72030] font-medium">Choose File</span>
                        <span className="text-gray-500">
                          {attachments.manualsUpload.length > 0 
                            ? `${attachments.manualsUpload.length} file(s) selected` 
                            : 'No file chosen'
                          }
                        </span>
                      </div>
                    </label>
                    {attachments.manualsUpload.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {attachments.manualsUpload.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile('manualsUpload', index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <label htmlFor="manuals-upload">
                        <Button
                          size="sm"
                          type="button"
                          style={{ backgroundColor: '#C72030' }}
                          className="text-white hover:opacity-90"
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Plus className="w-4 h-4 mr-1" />
                            Upload Files
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Insurance Details */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Insurance Details</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('insuranceDetails', e.target.files)}
                      className="hidden"
                      id="insurance-upload"
                    />
                    <label htmlFor="insurance-upload" className="cursor-pointer block">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-[#C72030] font-medium">Choose File</span>
                        <span className="text-gray-500">
                          {attachments.insuranceDetails.length > 0 
                            ? `${attachments.insuranceDetails.length} file(s) selected` 
                            : 'No file chosen'
                          }
                        </span>
                      </div>
                    </label>
                    {attachments.insuranceDetails.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {attachments.insuranceDetails.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile('insuranceDetails', index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <label htmlFor="insurance-upload">
                        <Button
                          size="sm"
                          type="button"
                          style={{ backgroundColor: '#C72030' }}
                          className="text-white hover:opacity-90"
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Plus className="w-4 h-4 mr-1" />
                            Upload Files
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Purchase Invoice */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Purchase Invoice</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('purchaseInvoice', e.target.files)}
                      className="hidden"
                      id="invoice-upload"
                    />
                    <label htmlFor="invoice-upload" className="cursor-pointer block">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-[#C72030] font-medium">Choose File</span>
                        <span className="text-gray-500">
                          {attachments.purchaseInvoice.length > 0 
                            ? `${attachments.purchaseInvoice.length} file(s) selected` 
                            : 'No file chosen'
                          }
                        </span>
                      </div>
                    </label>
                    {attachments.purchaseInvoice.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {attachments.purchaseInvoice.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile('purchaseInvoice', index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <label htmlFor="invoice-upload">
                        <Button
                          size="sm"
                          type="button"
                          style={{ backgroundColor: '#C72030' }}
                          className="text-white hover:opacity-90"
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Plus className="w-4 h-4 mr-1" />
                            Upload Files
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* AMC */}
                <div>
                  <label className="text-sm font-medium mb-2 block">AMC</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('amc', e.target.files)}
                      className="hidden"
                      id="amc-upload"
                    />
                    <label htmlFor="amc-upload" className="cursor-pointer block">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-[#C72030] font-medium">Choose File</span>
                        <span className="text-gray-500">
                          {attachments.amc.length > 0 
                            ? `${attachments.amc.length} file(s) selected` 
                            : 'No file chosen'
                          }
                        </span>
                      </div>
                    </label>
                    {attachments.amc.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {attachments.amc.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile('amc', index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <label htmlFor="amc-upload">
                        <Button
                          size="sm"
                          type="button"
                          style={{ backgroundColor: '#C72030' }}
                          className="text-white hover:opacity-90"
                          asChild
                        >
                          <span className="cursor-pointer">
                            <Plus className="w-4 h-4 mr-1" />
                            Upload Files
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button 
            variant="outline" 
            onClick={handleSaveAndShow}
            className="px-8 border-[#C72030] text-[#C72030]"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreate}
            style={{ backgroundColor: '#C72030' }}
            className="text-white px-8"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};