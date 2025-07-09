import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, Plus, MapPin, Package, Shield, Activity, TrendingUp, BarChart, Paperclip } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const AddAssetPage = () => {
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

  // Meter category options
  const getMeterCategoryOptions = () => [
    { value: 'electrical', label: 'Electrical' },
    { value: 'water', label: 'Water' },
    { value: 'gas', label: 'Gas' },
    { value: 'steam', label: 'Steam' },
    { value: 'thermal', label: 'Thermal' },
    { value: 'flow', label: 'Flow' }
  ];

  // Sub-category options based on selected meter category
  const getSubCategoryOptions = () => {
    const subCategories = {
      electrical: [
        { value: 'kwh', label: 'kWh' },
        { value: 'kvah', label: 'kVAh' },
        { value: 'voltage', label: 'Voltage' },
        { value: 'current', label: 'Current' }
      ],
      water: [
        { value: 'flow-rate', label: 'Flow Rate' },
        { value: 'pressure', label: 'Pressure' },
        { value: 'temperature', label: 'Temperature' }
      ],
      gas: [
        { value: 'volume', label: 'Volume' },
        { value: 'pressure', label: 'Pressure' },
        { value: 'flow-rate', label: 'Flow Rate' }
      ],
      steam: [
        { value: 'pressure', label: 'Pressure' },
        { value: 'temperature', label: 'Temperature' },
        { value: 'flow-rate', label: 'Flow Rate' }
      ],
      thermal: [
        { value: 'temperature', label: 'Temperature' },
        { value: 'btu', label: 'BTU' }
      ],
      flow: [
        { value: 'volume', label: 'Volume' },
        { value: 'mass', label: 'Mass' }
      ]
    };
    
    return subCategories[meterCategoryType] || [];
  };

  // Handle meter category change
  const handleMeterCategoryChange = (value) => {
    setMeterCategoryType(value);
    setSubCategoryType(''); // Reset sub-category when main category changes
  };

  // Consumption measure functions
  const updateConsumptionMeasure = (id, field, value) => {
    setConsumptionMeasures(prev => 
      prev.map(measure => 
        measure.id === id ? { ...measure, [field]: value } : measure
      )
    );
  };

  const addConsumptionMeasure = () => {
    const newId = Math.max(...consumptionMeasures.map(m => m.id)) + 1;
    setConsumptionMeasures(prev => [...prev, {
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

  const removeConsumptionMeasure = (id) => {
    setConsumptionMeasures(prev => prev.filter(measure => measure.id !== id));
  };

  // Non-consumption measure functions
  const updateNonConsumptionMeasure = (id, field, value) => {
    setNonConsumptionMeasures(prev => 
      prev.map(measure => 
        measure.id === id ? { ...measure, [field]: value } : measure
      )
    );
  };

  const addNonConsumptionMeasure = () => {
    const newId = Math.max(...nonConsumptionMeasures.map(m => m.id)) + 1;
    setNonConsumptionMeasures(prev => [...prev, {
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

  const removeNonConsumptionMeasure = (id) => {
    setNonConsumptionMeasures(prev => prev.filter(measure => measure.id !== id));
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

  const handleSaveAndShow = () => {
    console.log('Save and show details');
    navigate('/maintenance/asset');
  };

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

  return <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <span>Asset List</span>
          <span>{'>'}</span>
          <span className="text-gray-900 font-medium">Create New Asset</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW ASSET</h1>
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
                    <MuiSelect labelId={`${label.toLowerCase()}-select-label`} label={label} displayEmpty value="" sx={fieldStyles}>
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
                  <MuiSelect labelId="room-select-label" label="Room" displayEmpty value="" sx={fieldStyles}>
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
              <button className="px-3 py-1 rounded text-sm flex items-center gap-1 hover:opacity-80" style={{ backgroundColor: '#F6F4EE', color: '#C72030' }}>
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
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="group-select-label" shrink>Group</InputLabel>
                  <MuiSelect
                    labelId="group-select-label"
                    label="Group"
                    displayEmpty
                    value=""
                    sx={fieldStyles}
                    required
                  >
                    <MenuItem value=""><em>Select Group</em></MenuItem>
                    <MenuItem value="group1">Group 1</MenuItem>
                    <MenuItem value="group2">Group 2</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="subgroup-select-label" shrink>Subgroup</InputLabel>
                  <MuiSelect
                    labelId="subgroup-select-label"
                    label="Subgroup"
                    displayEmpty
                    value=""
                    sx={fieldStyles}
                    required
                  >
                    <MenuItem value=""><em>Select Sub-Group</em></MenuItem>
                    <MenuItem value="subgroup1">Subgroup 1</MenuItem>
                    <MenuItem value="subgroup2">Subgroup 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              {/* Third row: Status */}
              <div className="mb-4">
                <div>
                  <label className="text-sm font-medium text-[#C72030] mb-2 block">Status</label>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="status-inuse"
                        name="status"
                        value="inuse"
                        defaultChecked
                        className="w-4 h-4 text-blue-600 border-gray-300"
                        style={{ accentColor: '#2563eb' }}
                      />
                      <label htmlFor="status-inuse" className="text-sm">In Use</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="status-breakdown"
                        name="status"
                        value="breakdown"
                        className="w-4 h-4 text-blue-600 border-gray-300"
                        style={{ accentColor: '#2563eb' }}
                      />
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
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              IT ASSETS DETAILS
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">If Applicable</span>
                <div className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    id="it-assets-toggle"
                  />
                  <label
                    htmlFor="it-assets-toggle"
                    className="block w-12 h-6 bg-red-500 rounded-full cursor-pointer peer-checked:bg-red-500"
                  >
                    <span className="block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform translate-x-6 peer-checked:translate-x-1"></span>
                  </label>
                </div>
              </div>
              <button className="px-3 py-1 rounded text-sm flex items-center gap-1 hover:opacity-80" style={{ backgroundColor: '#F6F4EE', color: '#C72030' }}>
                <Plus className="w-4 h-4" />
                Custom Field
              </button>
              {expandedSections.warranty ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
          {expandedSections.warranty && (
            <div className="p-4 sm:p-6">
              {/* System Details */}
              <div className="mb-6">
                <h3 className="text-blue-600 font-semibold mb-4">SYSTEM DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextField
                    label="OS"
                    placeholder="Enter OS"
                    name="os"
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
                    label="Total Memory"
                    placeholder="Enter Total Memory"
                    name="totalMemory"
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
                    label="Processor"
                    placeholder="Enter Processor"
                    name="processor"
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
              </div>

              {/* Hard Disk Details */}
              <div>
                <h3 className="text-blue-600 font-semibold mb-4">HARD DISK DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextField
                    label="Model"
                    placeholder="Enter Model"
                    name="hdModel"
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
                    label="Serial No."
                    placeholder="Enter Serial No."
                    name="hdSerialNo"
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
                    label="Capacity"
                    placeholder="Enter Capacity"
                    name="hdCapacity"
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
              </div>
            </div>
          )}
        </div>

        {/* Meter Category Type */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('meterCategory')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              METER CATEGORY TYPE
            </div>
            {expandedSections.meterCategory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.meterCategory && <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                {getMeterCategoryOptions().map(option => <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-[#f6f4ee]">
                    <div className="flex items-center justify-center space-x-2">
                      <input type="radio" id={option.value} name="meterCategory" value={option.value} checked={meterCategoryType === option.value} onChange={e => handleMeterCategoryChange(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" />
                      <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                    </div>
                  </div>)}
              </div>

              {getSubCategoryOptions().length > 0 && <div className="mt-4 sm:mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {getSubCategoryOptions().map(option => <div key={option.value} className="bg-purple-100 p-3 sm:p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <input type="radio" id={`sub-${option.value}`} name="subMeterCategory" value={option.value} checked={subCategoryType === option.value} onChange={e => setSubCategoryType(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" />
                          <label htmlFor={`sub-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                        </div>
                      </div>)}
                  </div>
                </div>}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6">
          <button onClick={handleSaveAndShow} className="border border-[#C72030] text-[#C72030] px-6 sm:px-8 py-2 rounded-md hover:bg-[#C72030] hover:text-white text-sm sm:text-base">
            Save & Show Details
          </button>
          <button onClick={handleSaveAndCreate} className="px-6 sm:px-8 py-2 rounded-md text-sm sm:text-base bg-[#f6f4ee] text-red-700">
            Save & Create New Asset
          </button>
        </div>
      </div>
    </div>;
};

export default AddAssetPage;
