import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, Plus, MapPin, Package, Shield, Activity, TrendingUp, BarChart, Paperclip, Zap, Sun, Droplet, Recycle, BarChart3, Plug, Frown, Wind, Percent, Users } from 'lucide-react';
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
    assetAllocation: true,
    assetLoaned: true,
    attachments: true
  });
  const [itAssetsToggle, setItAssetsToggle] = useState(false);
  const [meterDetailsToggle, setMeterDetailsToggle] = useState(false);
  const [assetLoanedToggle, setAssetLoanedToggle] = useState(false);
  const [meterCategoryType, setMeterCategoryType] = useState('');
  const [subCategoryType, setSubCategoryType] = useState('');
  const [meterType, setMeterType] = useState('');
  const [criticalStatus, setCriticalStatus] = useState('');
  const [showBoardRatioOptions, setShowBoardRatioOptions] = useState(false);
  const [showRenewableOptions, setShowRenewableOptions] = useState(false);
  const [allocationBasedOn, setAllocationBasedOn] = useState('department');
  
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

  // Meter category options matching the images
  const getMeterCategoryOptions = () => [
    {
      value: 'board',
      label: 'Board',
      icon: BarChart3
    },
    {
      value: 'dg',
      label: 'DG',
      icon: Zap
    },
    {
      value: 'renewable',
      label: 'Renewable',
      icon: Sun
    },
    {
      value: 'fresh-water',
      label: 'Fresh Water',
      icon: Droplet
    },
    {
      value: 'recycled',
      label: 'Recycled',
      icon: Recycle
    },
    {
      value: 'iex-gdam',
      label: 'IEX-GDAM',
      icon: BarChart
    }
  ];

  // Board Ratio sub-options (second image)
  const getBoardRatioOptions = () => [
    {
      value: 'ht-panel',
      label: 'HT Panel',
      icon: Plug
    },
    {
      value: 'vcb',
      label: 'VCB',
      icon: Activity
    },
    {
      value: 'transformer',
      label: 'Transformer',
      icon: Zap
    },
    {
      value: 'lt-panel',
      label: 'LT Panel',
      icon: Frown
    }
  ];

  // Renewable energy sub-options
  const getRenewableOptions = () => [
    {
      value: 'solar',
      label: 'Solar',
      icon: Sun
    },
    {
      value: 'bio-methanol',
      label: 'Bio Methanol',
      icon: Droplet
    },
    {
      value: 'wind',
      label: 'Wind',
      icon: Wind
    }
  ];

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

  // Consumption measure functions
  const updateConsumptionMeasure = (id, field, value) => {
    setConsumptionMeasures(prev => prev.map(measure => measure.id === id ? {
      ...measure,
      [field]: value
    } : measure));
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
  const removeConsumptionMeasure = id => {
    setConsumptionMeasures(prev => prev.filter(measure => measure.id !== id));
  };

  // Non-consumption measure functions
  const updateNonConsumptionMeasure = (id, field, value) => {
    setNonConsumptionMeasures(prev => prev.map(measure => measure.id === id ? {
      ...measure,
      [field]: value
    } : measure));
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
  const removeNonConsumptionMeasure = id => {
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
              <button className="px-3 py-1 rounded text-sm flex items-center gap-1 hover:opacity-80" style={{
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
                <TextField required label="Asset Name" placeholder="Enter Asset Name" name="assetName" fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                <TextField required label="Model No." placeholder="Enter Model No" name="modelNo" fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
                <TextField required label="Manufacturer" placeholder="Enter Manufacturer" name="manufacturer" fullWidth variant="outlined" InputLabelProps={{
              shrink: true
            }} InputProps={{
              sx: fieldStyles
            }} />
              </div>

              {/* Second row: Group, Subgroup */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="group-select-label" shrink>Group</InputLabel>
                  <MuiSelect labelId="group-select-label" label="Group" displayEmpty value="" sx={fieldStyles} required>
                    <MenuItem value=""><em>Select Group</em></MenuItem>
                    <MenuItem value="group1">Group 1</MenuItem>
                    <MenuItem value="group2">Group 2</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{
              minWidth: 120
            }}>
                  <InputLabel id="subgroup-select-label" shrink>Subgroup</InputLabel>
                  <MuiSelect labelId="subgroup-select-label" label="Subgroup" displayEmpty value="" sx={fieldStyles} required>
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
                      <input type="radio" id="status-inuse" name="status" value="inuse" defaultChecked className="w-4 h-4 text-blue-600 border-gray-300" style={{
                    accentColor: '#2563eb'
                  }} />
                      <label htmlFor="status-inuse" className="text-sm">In Use</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="status-breakdown" name="status" value="breakdown" className="w-4 h-4 text-blue-600 border-gray-300" style={{
                    accentColor: '#2563eb'
                  }} />
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
                  <input type="checkbox" className="sr-only peer" id="it-assets-toggle" checked={itAssetsToggle} onChange={e => handleItAssetsToggleChange(e.target.checked)} />
                  <label htmlFor="it-assets-toggle" className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${itAssetsToggle ? 'bg-green-400' : 'bg-gray-300'}`}>
                    <span className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${itAssetsToggle ? 'translate-x-6' : 'translate-x-1'}`}></span>
                  </label>
                </div>
              </div>
              <button className="px-3 py-1 rounded text-sm flex items-center gap-1 hover:opacity-80" style={{
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
                </div>
              </div>

              {/* Hard Disk Details */}
              <div>
                <h3 className="font-semibold mb-4" style={{
              color: '#C72030'
            }}>HARD DISK DETAILS</h3>
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
                </div>
              </div>
            </div>}
        </div>

        {/* Meter Details */}
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
          {expandedSections.meterCategory && (
            <div className="p-4 sm:p-6">
              {/* Meter Type */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#C72030] font-medium text-sm sm:text-base">Meter Type</span>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="meter-type-parent" name="meterType" value="parent" checked={meterType === 'parent'} onChange={e => setMeterType(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" style={{ accentColor: '#2563eb' }} />
                      <label htmlFor="meter-type-parent" className="text-sm">Parent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="meter-type-sub" name="meterType" value="sub" checked={meterType === 'sub'} onChange={e => setMeterType(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" style={{ accentColor: '#2563eb' }} />
                      <label htmlFor="meter-type-sub" className="text-sm">Sub</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#C72030] font-medium text-sm sm:text-base">CRITICAL</span>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="critical-yes" name="critical" value="yes" checked={criticalStatus === 'yes'} onChange={e => setCriticalStatus(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" style={{ accentColor: '#2563eb' }} />
                      <label htmlFor="critical-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="critical-no" name="critical" value="no" checked={criticalStatus === 'no'} onChange={e => setCriticalStatus(e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300" style={{ accentColor: '#2563eb' }} />
                      <label htmlFor="critical-no" className="text-sm">No</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meter Category Type */}
              <div className="mb-6">
                <div className="rounded-lg p-4 bg-[#f6f4ee]">
                  <h3 className="font-medium mb-4 text-sm sm:text-base text-orange-700">METER DETAILS</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4">
                    {getMeterCategoryOptions().map(option => {
                      const IconComponent = option.icon;
                      return (
                        <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                          <div className="flex items-center justify-center space-x-2">
                            <input 
                              type="radio" 
                              id={option.value} 
                              name="meterCategory" 
                              value={option.value} 
                              checked={meterCategoryType === option.value} 
                              onChange={e => handleMeterCategoryChange(e.target.value)} 
                              className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" 
                            />
                            <IconComponent className="w-4 h-4 text-gray-600" />
                            <label htmlFor={option.value} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Board Ratio Options (Second Image) */}
                  {showBoardRatioOptions && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {getBoardRatioOptions().map(option => {
                        const IconComponent = option.icon;
                        return (
                          <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                            <div className="flex items-center justify-center space-x-2">
                              <input 
                                type="radio" 
                                id={`board-${option.value}`} 
                                name="boardRatioCategory" 
                                value={option.value} 
                                checked={subCategoryType === option.value} 
                                onChange={e => setSubCategoryType(e.target.value)} 
                                className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" 
                              />
                              <IconComponent className="w-4 h-4 text-gray-600" />
                              <label htmlFor={`board-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Renewable Options */}
                  {showRenewableOptions && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {getRenewableOptions().map(option => {
                        const IconComponent = option.icon;
                        return (
                          <div key={option.value} className="p-3 sm:p-4 rounded-lg text-center bg-white border">
                            <div className="flex items-center justify-center space-x-2">
                              <input 
                                type="radio" 
                                id={`renewable-${option.value}`} 
                                name="renewableCategory" 
                                value={option.value} 
                                checked={subCategoryType === option.value} 
                                onChange={e => setSubCategoryType(e.target.value)} 
                                className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]" 
                              />
                              <IconComponent className="w-4 h-4 text-gray-600" />
                              <label htmlFor={`renewable-${option.value}`} className="text-xs sm:text-sm cursor-pointer">{option.label}</label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Purchase Details */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('consumption')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              PURCHASE DETAILS
            </div>
            {expandedSections.consumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.consumption && <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <TextField 
                  required
                  label="Purchase Cost" 
                  placeholder="Enter cost" 
                  name="purchaseCost" 
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
                      <input type="radio" id="warranty-yes" name="underWarranty" value="yes" className="w-4 h-4 text-blue-600 border-gray-300" style={{
                        accentColor: '#2563eb'
                      }} />
                      <label htmlFor="warranty-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="warranty-no" name="underWarranty" value="no" className="w-4 h-4 text-blue-600 border-gray-300" style={{
                        accentColor: '#2563eb'
                      }} />
                      <label htmlFor="warranty-no" className="text-sm">No</label>
                    </div>
                  </div>
                </div>
                <TextField 
                  required
                  label="Warranty Expires On" 
                  placeholder="dd/mm/yyyy" 
                  name="warrantyExpiresOn" 
                  type="date"
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
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">If Applicable</span>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" className="sr-only peer" id="depreciation-toggle" />
                  <label htmlFor="depreciation-toggle" className="block w-12 h-6 rounded-full cursor-pointer transition-colors bg-red-400">
                    <span className="block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform translate-x-6"></span>
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
                  <TextField 
                    required
                    label="Useful Life (in yrs)" 
                    placeholder="YRS" 
                    name="usefulLife" 
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
                    label="Salvage Value" 
                    placeholder="Enter Value" 
                    name="salvageValue" 
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
                    label="Depreciation Rate" 
                    placeholder="Enter Value" 
                    name="depreciationRate" 
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

                {/* Radio Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                      <input 
                        type="radio" 
                        id="allocation-department" 
                        name="allocationBasedOn" 
                        value="department" 
                        checked={allocationBasedOn === 'department'} 
                        onChange={e => setAllocationBasedOn(e.target.value)} 
                        className="w-4 h-4 text-[#C72030] border-gray-300" 
                        style={{
                          accentColor: '#C72030'
                        }} 
                      />
                      <label htmlFor="allocation-department" className="text-sm">Department</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="allocation-users" 
                        name="allocationBasedOn" 
                        value="users" 
                        checked={allocationBasedOn === 'users'} 
                        onChange={e => setAllocationBasedOn(e.target.value)} 
                        className="w-4 h-4 text-[#C72030] border-gray-300" 
                        style={{
                          accentColor: '#C72030'
                        }} 
                      />
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
                      value="" 
                      sx={fieldStyles}
                      required
                    >
                      <MenuItem value=""><em>Select...</em></MenuItem>
                      {allocationBasedOn === 'department' ? (
                        <>
                          <MenuItem value="hr">HR Department</MenuItem>
                          <MenuItem value="it">IT Department</MenuItem>
                          <MenuItem value="finance">Finance Department</MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem value="user1">User 1</MenuItem>
                          <MenuItem value="user2">User 2</MenuItem>
                          <MenuItem value="user3">User 3</MenuItem>
                        </>
                      )}
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
                  <label htmlFor="asset-loaned-toggle" className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${assetLoanedToggle ? 'bg-green-400' : 'bg-gray-300'}`}>
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
                  <MuiSelect labelId="vendor-select-label" label="Vendor Name" displayEmpty value="" sx={fieldStyles} required>
                    <MenuItem value=""><em>Select Vendor</em></MenuItem>
                    <MenuItem value="vendor1">Vendor 1</MenuItem>
                    <MenuItem value="vendor2">Vendor 2</MenuItem>
                    <MenuItem value="vendor3">Vendor 3</MenuItem>
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
                  InputLabelProps={{
                    shrink: true
                  }} 
                  InputProps={{
                    sx: fieldStyles
                  }} 
                />
                <TextField 
                  required
                  label="Agreement End Date*" 
                  placeholder="dd/mm/yyyy" 
                  name="agreementEndDate" 
                  type="date"
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
