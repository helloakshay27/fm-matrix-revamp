import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, Plus } from 'lucide-react';
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
    manualsUpload: [],
    insuranceDetails: [],
    purchaseInvoice: [],
    amc: []
  });

  const toggleSection = (section) => {
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

  const getMeterCategoryOptions = () => [
    { value: 'board', label: 'Board' },
    { value: 'dg', label: 'DG' },
    { value: 'renewable', label: 'Renewable' },
    { value: 'fresh-water', label: 'Fresh Water' },
    { value: 'recycled', label: 'Recycled' },
    { value: 'iex-gdam', label: 'IEX-GDAM' }
  ];

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

  const handleMeterCategoryChange = (value) => {
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

  const removeConsumptionMeasure = (id) => {
    if (consumptionMeasures.length > 1) {
      setConsumptionMeasures(consumptionMeasures.filter(m => m.id !== id));
    }
  };

  const updateConsumptionMeasure = (id, field, value) => {
    setConsumptionMeasures(consumptionMeasures.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
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

  const removeNonConsumptionMeasure = (id) => {
    if (nonConsumptionMeasures.length > 1) {
      setNonConsumptionMeasures(nonConsumptionMeasures.filter(m => m.id !== id));
    }
  };

  const updateNonConsumptionMeasure = (id, field, value) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const fieldStyles = {
    height: { xs: '2rem', sm: '2.25rem', md: '2.25rem' },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '0.5rem', sm: '0.625rem', md: '0.625rem' },
      fontSize: { xs: '0.875rem', sm: '1rem' }
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '0.875rem', sm: '1rem' }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <span>Asset List</span>
          <span>></span>
          <span className="text-gray-900 font-medium">Create New Asset</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">NEW ASSET</h1>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Location Details */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center"
            onClick={() => toggleSection('location')}
          >
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">1</span>
              LOCATION DETAILS
            </div>
            {expandedSections.location ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.location && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {['Site', 'Building', 'Wing', 'Area', 'Floor'].map((label) => (
                  <FormControl key={label} fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id={`${label.toLowerCase()}-select-label`} shrink>{label}</InputLabel>
                    <MuiSelect
                      labelId={`${label.toLowerCase()}-select-label`}
                      label={label}
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select {label}</em></MenuItem>
                      <MenuItem value={`${label.toLowerCase()}1`}>{label} 1</MenuItem>
                      <MenuItem value={`${label.toLowerCase()}2`}>{label} 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
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
          )}
        </div>

        {/* Asset Details */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center"
            onClick={() => toggleSection('asset')}
          >
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">2</span>
              ASSET DETAILS
            </div>
            {expandedSections.asset ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.asset && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Asset Name', name: 'assetName', placeholder: 'Enter Name', required: true },
                  { label: 'Asset No.', name: 'assetNo', placeholder: 'Enter Number', required: true },
                  { label: 'Equipment ID', name: 'equipmentId', placeholder: 'Enter Number', required: true }
                ].map(field => (
                  <TextField
                    key={field.name}
                    required={field.required}
                    label={field.label}
                    placeholder={field.placeholder}
                    name={field.name}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Model No.', name: 'modelNo', placeholder: 'Enter Number' },
                  { label: 'Serial No.', name: 'serialNo', placeholder: 'Enter Number' },
                  { label: 'Consumer No.', name: 'consumerNo', placeholder: 'Enter Number' }
                ].map(field => (
                  <TextField
                    key={field.name}
                    label={field.label}
                    placeholder={field.placeholder}
                    name={field.name}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {[
                  { label: 'Purchase Cost', name: 'purchaseCost', placeholder: 'Enter Numeric value', type: 'number', required: true },
                  { label: 'Capacity', name: 'capacity', placeholder: 'Enter Text' },
                  { label: 'Unit', name: 'unit', placeholder: 'Enter Text' }
                ].map(field => (
                  <TextField
                    key={field.name}
                    required={field.required}
                    label={field.label}
                    placeholder={field.placeholder}
                    name={field.name}
                    type={field.type || 'text'}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {['Group', 'Subgroup'].map(label => (
                  <FormControl key={label} fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                    <InputLabel id={`${label.toLowerCase()}-select-label`} shrink>{label}</InputLabel>
                    <MuiSelect
                      labelId={`${label.toLowerCase()}-select-label`}
                      label={label}
                      displayEmpty
                      value=""
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select {label}</em></MenuItem>
                      <MenuItem value={`${label.toLowerCase()}1`}>{label} 1</MenuItem>
                      <MenuItem value={`${label.toLowerCase()}2`}>{label} 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                ))}
                <TextField
                  label="Purchased ON Date"
                  placeholder="Select Date"
                  name="purchaseDate"
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'Expiry date', name: 'expiryDate', type: 'date' },
                  { label: 'Manufacturer', name: 'manufacturer', placeholder: 'Enter Text' }
                ].map(field => (
                  <TextField
                    key={field.name}
                    label={field.label}
                    placeholder={field.placeholder || 'Select Date'}
                    name={field.name}
                    type={field.type || 'text'}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                {[
                  {
                    label: 'Location Type',
                    name: 'locationType',
                    options: [
                      { value: 'common', label: 'Common Area' },
                      { value: 'customer', label: 'Customer' },
                      { value: 'na', label: 'NA' }
                    ],
                    defaultValue: 'common'
                  },
                  {
                    label: 'Asset Type',
                    name: 'assetType',
                    options: [
                      { value: 'parent', label: 'Parent' },
                      { value: 'sub', label: 'Sub' }
                    ],
                    defaultValue: 'parent'
                  },
                  {
                    label: 'Status',
                    name: 'status',
                    options: [
                      { value: 'inuse', label: 'In Use' },
                      { value: 'breakdown', label: 'Breakdown' }
                    ],
                    defaultValue: 'inuse'
                  },
                  {
                    label: 'Critical',
                    name: 'critical',
                    options: [
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ],
                    defaultValue: 'no'
                  }
                ].map(field => (
                  <div key={field.name}>
                    <label className="text-xs sm:text-sm font-medium text-gray-700">{field.label}</label>
                    <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
                      {field.options.map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${field.name}-${option.value}`}
                            name={field.name}
                            value={option.value}
                            defaultChecked={option.value === field.defaultValue}
                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                          />
                          <label htmlFor={`${field.name}-${option.value}`} className="text-xs sm:text-sm">{option.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="meterApplicable"
                  className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                />
                <label htmlFor="meterApplicable" className="text-xs sm:text-sm">Meter Applicable</label>
              </div>
            </div>
          )}
        </div>

        {/* Warranty Details */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center"
            onClick={() => toggleSection('warranty')}
          >
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">3</span>
              WARRANTY DETAILS
            </div>
            {expandedSections.warranty ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.warranty && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Under Warranty</label>
                  <div className="flex gap-4 sm:gap-6 mt-2">
                    {[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' }
                    ].map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`warranty-${option.value}`}
                          name="underWarranty"
                          value={option.value}
                          defaultChecked={option.value === 'no'}
                          className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                        />
                        <label htmlFor={`warranty-${option.value}`} className="text-xs sm:text-sm">{option.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Warranty Start Date', name: 'warrantyStart', type: 'date' },
                  { label: 'Warranty expires on', name: 'warrantyExpires', type: 'date' },
                  { label: 'Commissioning Date', name: 'commissioningDate', type: 'date' }
                ].map(field => (
                  <TextField
                    key={field.name}
                    label={field.label}
                    placeholder="Select Date"
                    name={field.name}
                    type={field.type}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Meter Category Type */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center"
            onClick={() => toggleSection('meterCategory')}
          >
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">4</span>
              METER CATEGORY TYPE
            </div>
            {expandedSections.meterCategory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.meterCategory && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                {getMeterCategoryOptions().map((option) => (
                  <div key={option.value} className="bg-purple-100 p-3 sm:p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <input
                        type="radio"
                        id={option.value}
                        name="meterCategory"
                        value={option.value}
                        checked={meterCategoryType === option.value}
                        onChange={(e) => handleMeterCategoryChange(e.target.value)}
                        className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                      />
                      <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                    </div>
                  </div>
                ))}
              </div>

              {getSubCategoryOptions().length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {getSubCategoryOptions().map((option) => (
                      <div key={option.value} className="bg-purple-100 p-3 sm:p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <input
                            type="radio"
                            id={`sub-${option.value}`}
                            name="subMeterCategory"
                            value={option.value}
                            checked={subCategoryType === option.value}
                            onChange={(e) => setSubCategoryType(e.target.value)}
                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                          />
                          <label htmlFor={`sub-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Consumption Asset Measure */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center"
            onClick={() => toggleSection('consumption')}
          >
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">5</span>
              CONSUMPTION ASSET MEASURE
            </div>
            {expandedSections.consumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.consumption && (
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {consumptionMeasures.map((measure) => (
                  <div key={measure.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700 text-sm sm:text-base">Consumption Asset Measure</h4>
                      {consumptionMeasures.length > 1 && (
                        <button
                          onClick={() => removeConsumptionMeasure(measure.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      {[
                        { label: 'Name', name: `name-${measure.id}`, placeholder: 'Enter Text', value: measure.name, onChange: (e) => updateConsumptionMeasure(measure.id, 'name', e.target.value) },
                        { label: 'Min', name: `min-${measure.id}`, placeholder: 'Enter Number', type: 'number', value: measure.min, onChange: (e) => updateConsumptionMeasure(measure.id, 'min', e.target.value) },
                        { label: 'Max', name: `max-${measure.id}`, placeholder: 'Enter Number', type: 'number', value: measure.max, onChange: (e) => updateConsumptionMeasure(measure.id, 'max', e.target.value) },
                        { label: 'Alert Below Val.', name: `alertBelow-${measure.id}`, placeholder: 'Enter Value', type: 'number', value: measure.alertBelowVal, onChange: (e) => updateConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value) }
                      ].map(field => (
                        <TextField
                          key={field.name}
                          label={field.label}
                          placeholder={field.placeholder}
                          name={field.name}
                          type={field.type || 'text'}
                          value={field.value}
                          onChange={field.onChange}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ sx: fieldStyles }}
                        />
                      ))}
                      <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {[
                        { label: 'Alert Above Val.', name: `alertAbove-${measure.id}`, placeholder: 'Enter Value', type: 'number', value: measure.alertAboveVal, onChange: (e) => updateConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value) },
                        { label: 'Multiplier Factor', name: `multiplier-${measure.id}`, placeholder: 'Enter Text', value: measure.multiplierFactor, onChange: (e) => updateConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value) }
                      ].map(field => (
                        <TextField
                          key={field.name}
                          label={field.label}
                          placeholder={field.placeholder}
                          name={field.name}
                          type={field.type || 'text'}
                          value={field.value}
                          onChange={field.onChange}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ sx: fieldStyles }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`checkPrevious-${measure.id}`}
                        checked={measure.checkPreviousReading}
                        onChange={(e) => updateConsumptionMeasure(measure.id, 'checkPreviousReading', e.target.checked)}
                        className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                      />
                      <label htmlFor={`checkPrevious-${measure.id}`} className="text-xs sm:text-sm">Check Previous Reading</label>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addConsumptionMeasure}
                  className="bg-[#C72030] text-white px-4 py-2 rounded-md hover:bg-[#a61b26] flex items-center text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Measure
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Non Consumption Asset Measure */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center"
            onClick={() => toggleSection('nonConsumption')}
          >
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">6</span>
              NON CONSUMPTION ASSET MEASURE
            </div>
            {expandedSections.nonConsumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.nonConsumption && (
            <div className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {nonConsumptionMeasures.map((measure) => (
                  <div key={measure.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-700 text-sm sm:text-base">Non Consumption Asset Measure</h4>
                      {nonConsumptionMeasures.length > 1 && (
                        <button
                          onClick={() => removeNonConsumptionMeasure(measure.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      {[
                        { label: 'Name', name: `nc-name-${measure.id}`, placeholder: 'Name', value: measure.name, onChange: (e) => updateNonConsumptionMeasure(measure.id, 'name', e.target.value) },
                        { label: 'Min', name: `nc-min-${measure.id}`, placeholder: 'Min', type: 'number', value: measure.min, onChange: (e) => updateNonConsumptionMeasure(measure.id, 'min', e.target.value) },
                        { label: 'Max', name: `nc-max-${measure.id}`, placeholder: 'Max', type: 'number', value: measure.max, onChange: (e) => updateNonConsumptionMeasure(measure.id, 'max', e.target.value) },
                        { label: 'Alert Below Val.', name: `nc-alertBelow-${measure.id}`, placeholder: 'Alert Below Value', type: 'number', value: measure.alertBelowVal, onChange: (e) => updateNonConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value) }
                      ].map(field => (
                        <TextField
                          key={field.name}
                          label={field.label}
                          placeholder={field.placeholder}
                          name={field.name}
                          type={field.type || 'text'}
                          value={field.value}
                          onChange={field.onChange}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ sx: fieldStyles }}
                        />
                      ))}
                      <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {[
                        { label: 'Alert Above Val.', name: `nc-alertAbove-${measure.id}`, placeholder: 'Alert Above Value', type: 'number', value: measure.alertAboveVal, onChange: (e) => updateNonConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value) },
                        { label: 'Multiplier Factor', name: `nc-multiplier-${measure.id}`, placeholder: 'Multiplier Factor', value: measure.multiplierFactor, onChange: (e) => updateNonConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value) }
                      ].map(field => (
                        <TextField
                          key={field.name}
                          label={field.label}
                          placeholder={field.placeholder}
                          name={field.name}
                          type={field.type || 'text'}
                          value={field.value}
                          onChange={field.onChange}
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ sx: fieldStyles }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`nc-checkPrevious-${measure.id}`}
                        checked={measure.checkPreviousReading}
                        onChange={(e) => updateNonConsumptionMeasure(measure.id, 'checkPreviousReading', e.target.checked)}
                        className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                      />
                      <label htmlFor={`nc-checkPrevious-${measure.id}`} className="text-xs sm:text-sm">Check Previous Reading</label>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addNonConsumptionMeasure}
                  className="bg-[#C72030] text-white px-4 py-2 rounded-md hover:bg-[#a61b26] flex items-center text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Measure
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Attachments */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center"
            onClick={() => toggleSection('attachments')}
          >
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">7</span>
              ATTACHMENTS
            </div>
            {expandedSections.attachments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.attachments && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { label: 'Manuals Upload', id: 'manuals-upload', category: 'manualsUpload', accept: '.pdf,.doc,.docx,.txt' },
                  { label: 'Insurance Details', id: 'insurance-upload', category: 'insuranceDetails', accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' },
                  { label: 'Purchaselah Invoice', id: 'invoice-upload', category: 'purchaseInvoice', accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' },
                  { label: 'AMC', id: 'amc-upload', category: 'amc', accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' }
                ].map(field => (
                  <div key={field.id}>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">{field.label}</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        multiple
                        accept={field.accept}
                        onChange={(e) => handleFileUpload(field.category, e.target.files)}
                        className="hidden"
                        id={field.id}
                      />
                      <label htmlFor={field.id} className="cursor-pointer block">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <span className="text-[#C72030] font-medium text-xs sm:text-sm">Choose File</span>
                          <span className="text-gray-500 text-xs sm:text-sm">
                            {attachments[field.category].length > 0 
                              ? `${attachments[field.category].length} file(s) selected` 
                              : 'No file chosen'
                            }
                          </span>
                        </div>
                      </label>
                      {attachments[field.category].length > 0 && (
                        <div className="mt-2 space-y-1">
                          {attachments[field.category].map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded text-left">
                              <span className="text-xs sm:text-sm truncate">{file.name}</span>
                              <button
                                onClick={() => removeFile(field.category, index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-2">
                        <label htmlFor={field.id}>
                          <button
                            className="bg-[#C72030] text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#a61b26] flex items-center mx-auto text-xs sm:text-sm"
                          >
                            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                            Upload Files
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6">
          <button 
            onClick={handleSaveAndShow}
            className="border border-[#C72030] text-[#C72030] px-6 sm:px-8 py-2 rounded-md hover:bg-[#C72030] hover:text-white text-sm sm:text-base"
          >
            Save & Show Details
          </button>
          <button 
            onClick={handleSaveAndCreate}
            className="bg-[#C72030] text-white px-6 sm:px-8 py-2 rounded-md hover:bg-[#a61b26] text-sm sm:text-base"
          >
            Save & Create New Asset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetPage;