import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, Plus, MapPin, Package, Shield, Activity, TrendingUp, BarChart, Paperclip, Zap, Sun, Droplet, Recycle, BarChart3, Plug, Frown, Wind, Percent, Users, Settings, ArrowLeft, Layers, FileText, Building2, Ruler, Construction, Archive, Calendar, DollarSign, CheckCircle, Wrench, Car, Cog, Users2, TrendingUp as Performance, ShieldCheck } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Autocomplete, InputAdornment } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AddCustomFieldModal } from '@/components/AddCustomFieldModal';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [itAssetsToggle, setItAssetsToggle] = useState(false);
  const [meterDetailsToggle, setMeterDetailsToggle] = useState(false);
  const [assetLoanedToggle, setAssetLoanedToggle] = useState(false);
  const [depreciationToggle, setDepreciationToggle] = useState(false);
  const [meterCategoryType, setMeterCategoryType] = useState('');
  const [subCategoryType, setSubCategoryType] = useState('');
  const [meterType, setMeterType] = useState('');
  const [criticalStatus, setCriticalStatus] = useState('');
  const [depreciationMethod, setDepreciationMethod] = useState('straight-line');
  const [depreciationConfig, setDepreciationConfig] = useState('this-only');
  const [showBoardRatioOptions, setShowBoardRatioOptions] = useState(false);
  const [showRenewableOptions, setShowRenewableOptions] = useState(false);
  const [allocationBasedOn, setAllocationBasedOn] = useState('department');
  const [customFieldModalOpen, setCustomFieldModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [itAssetsCustomFieldModalOpen, setItAssetsCustomFieldModalOpen] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
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
  const handleGoBack = () => {
    navigate(-1);
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

  // Custom field functions - Updated to handle sections
  const openCustomFieldModal = section => {
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
      [section]: prev[section].map(field => field.id === id ? {
        ...field,
        value
      } : field)
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
    navigate(`/maintenance/asset/details/${id}`);
  };
  const handleSaveAndCreate = () => {
    console.log('Save and create new asset');
    navigate('/maintenance/asset/add');
  };
  return <div className="p-4 sm:p-6 max-w-full mx-auto min-h-screen bg-gray-50">
    {/* Header */}
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
        <button onClick={handleGoBack} className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2" aria-label="Go back">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span>Asset List</span>
        <span>{'>'}</span>
        <span className="text-gray-900 font-medium">Edit Asset</span>
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">EDIT ASSET</h1>
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
            <RadioGroup value={selectedAssetCategory} onValueChange={setSelectedAssetCategory} className="contents">
              {['Land', 'Building', 'Leasehold Improvement', 'Vehicle', 'Furniture & Fixtures', 'IT Equipment', 'Machinery & Equipment', 'Tools & Instruments'].map(category => <div key={category} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={category} id={category} />
                <label htmlFor={category} className="text-sm font-medium cursor-pointer flex-1">
                  {category}
                </label>
              </div>)}
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Land Asset Details - Show when Land is selected */}
      {selectedAssetCategory === 'Land' && <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="space-y-6">
          {/* Basic Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Identification
                </div>
                <button onClick={() => openCustomFieldModal('basicIdentification')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Asset ID / Code" placeholder="Enter unique identifier" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Asset Name" placeholder="Enter land name" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Land Type</InputLabel>
                  <MuiSelect label="Land Type" defaultValue="">
                    <MenuItem value="">Select Land Type</MenuItem>
                    <MenuItem value="raw">Raw Land</MenuItem>
                    <MenuItem value="developed">Developed Land</MenuItem>
                    <MenuItem value="leased">Leased</MenuItem>
                    <MenuItem value="agricultural">Agricultural</MenuItem>
                    <MenuItem value="special">Special Use</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.basicIdentification.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('basicIdentification', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('basicIdentification', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('locationOwnership')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Location" placeholder="Full address or GPS coordinates" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Ownership Type</InputLabel>
                  <MuiSelect label="Ownership Type" defaultValue="">
                    <MenuItem value="">Select Ownership Type</MenuItem>
                    <MenuItem value="owned">Owned</MenuItem>
                    <MenuItem value="leased">Leased</MenuItem>
                    <MenuItem value="allotted">Allotted</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Legal Document Ref No." placeholder="Title deed, lease ID, etc." variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Zoning Classification</InputLabel>
                  <MuiSelect label="Zoning Classification" defaultValue="">
                    <MenuItem value="">Select Zoning</MenuItem>
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="agricultural">Agricultural</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Encumbrance Status</InputLabel>
                  <MuiSelect label="Encumbrance Status" defaultValue="">
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="clear">Clear</MenuItem>
                    <MenuItem value="mortgage">Under Mortgage</MenuItem>
                    <MenuItem value="disputed">Disputed</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.locationOwnership.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('locationOwnership', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('locationOwnership', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('landSizeValue')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <TextField label="Area" placeholder="Enter area" variant="outlined" type="number" sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <FormControl sx={{
                    minWidth: 100,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <InputLabel>Unit</InputLabel>
                    <MuiSelect label="Unit" defaultValue="sqft">
                      <MenuItem value="sqft">Sq. Ft.</MenuItem>
                      <MenuItem value="acres">Acres</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <DatePicker label="Date of Acquisition" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <div className="flex gap-2">
                  <FormControl sx={{
                    minWidth: 80,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <InputLabel>Currency</InputLabel>
                    <MuiSelect label="Currency" defaultValue="inr">
                      <MenuItem value="inr">INR</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField label="Acquisition Cost" placeholder="Enter cost" variant="outlined" type="number" sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                </div>
                <TextField label="Current Market Value (INR)" placeholder="Enter current value" variant="outlined" type="number" InputProps={{
                  startAdornment: <InputAdornment position="start">{localStorage.getItem('currency')}</InputAdornment>
                }} fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.landSizeValue.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('landSizeValue', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('landSizeValue', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('landUsageDevelopment')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Purpose / Use</InputLabel>
                  <MuiSelect label="Purpose / Use" defaultValue="">
                    <MenuItem value="">Select Purpose</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="reserved">Reserved</MenuItem>
                    <MenuItem value="institutional">Institutional</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Land Improvements</InputLabel>
                  <MuiSelect label="Land Improvements" defaultValue="">
                    <MenuItem value="">Select Improvements</MenuItem>
                    <MenuItem value="fencing">Fencing</MenuItem>
                    <MenuItem value="landscaping">Landscaping</MenuItem>
                    <MenuItem value="roads">Roads</MenuItem>
                    <MenuItem value="other">Other (Manual Input)</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Responsible Department" placeholder="Enter department or user" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.landUsageDevelopment.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('landUsageDevelopment', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('landUsageDevelopment', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('miscellaneous')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Additional Notes" placeholder="Enter any additional information" variant="outlined" fullWidth multiline rows={3} sx={{
                  gridColumn: 'span 2'
                }} />

                {/* Custom Fields */}
                {customFields.miscellaneous.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('miscellaneous', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('miscellaneous', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </LocalizationProvider>}

      {/* Building Asset Details - Show when Building is selected */}
      {selectedAssetCategory === 'Building' && <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="space-y-6">
          {/* Basic Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Identification
                </div>
                <button onClick={() => openCustomFieldModal('buildingBasicId')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Asset ID / Code" placeholder="Enter unique identifier" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Asset Name" placeholder="Enter building name" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Building Type</InputLabel>
                  <MuiSelect label="Building Type" defaultValue="">
                    <MenuItem value="">Select Building Type</MenuItem>
                    <MenuItem value="office">Office</MenuItem>
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="industrial">Industrial</MenuItem>
                    <MenuItem value="mixed">Mixed Use</MenuItem>
                    <MenuItem value="other">Other (Manual Entry)</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.buildingBasicId.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('buildingBasicId', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('buildingBasicId', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('buildingLocation')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Location" placeholder="Full address" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Ownership Type</InputLabel>
                  <MuiSelect label="Ownership Type" defaultValue="">
                    <MenuItem value="">Select Ownership Type</MenuItem>
                    <MenuItem value="owned">Owned</MenuItem>
                    <MenuItem value="rented">Rented</MenuItem>
                    <MenuItem value="leased">Leased</MenuItem>
                    <MenuItem value="government">Government Allotted</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Linked Land Asset" placeholder="Enter Asset ID or name of land" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.buildingLocation.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('buildingLocation', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('buildingLocation', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('buildingConstruction')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Construction Type</InputLabel>
                  <MuiSelect label="Construction Type" defaultValue="">
                    <MenuItem value="">Select Construction Type</MenuItem>
                    <MenuItem value="rcc">RCC</MenuItem>
                    <MenuItem value="steel">Steel</MenuItem>
                    <MenuItem value="prefab">Pre-Fab</MenuItem>
                    <MenuItem value="loadbearing">Load Bearing</MenuItem>
                    <MenuItem value="other">Other (Manual Entry)</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Number of Floors" placeholder="e.g., G + 3 = 4" variant="outlined" fullWidth type="number" sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <div className="flex gap-2">
                  <TextField label="Built-up Area" placeholder="Enter area" variant="outlined" type="number" sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <FormControl sx={{
                    minWidth: 100,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <InputLabel>Unit</InputLabel>
                    <MuiSelect label="Unit" defaultValue="sqft">
                      <MenuItem value="sqft">Sq. Ft.</MenuItem>
                      <MenuItem value="sqm">Sq. M.</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <DatePicker label="Date of Construction" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.buildingConstruction.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('buildingConstruction', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('buildingConstruction', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('buildingAcquisition')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker label="Date of Acquisition" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <div className="flex gap-2">
                  <FormControl sx={{
                    minWidth: 80,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <InputLabel>Currency</InputLabel>
                    <MuiSelect label="Currency" defaultValue="inr">
                      <MenuItem value="inr">INR</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField label="Acquisition Cost" placeholder="Enter cost" variant="outlined" type="number" sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                </div>
                <TextField label="Depreciation Rate (%)" placeholder="Enter depreciation rate" variant="outlined" fullWidth type="number" InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }} sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <div className="flex gap-2">
                  <FormControl sx={{
                    minWidth: 80,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <InputLabel>Currency</InputLabel>
                    <MuiSelect label="Currency" defaultValue="inr">
                      <MenuItem value="inr">INR</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField label="Current Book Value" placeholder="Enter book value" variant="outlined" type="number" sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                </div>
                <div className="flex gap-2">
                  <FormControl sx={{
                    minWidth: 80,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <InputLabel>Currency</InputLabel>
                    <MuiSelect label="Currency" defaultValue="inr">
                      <MenuItem value="inr">INR</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField label="Current Market Value" placeholder="Enter market value" variant="outlined" type="number" sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                </div>

                {/* Custom Fields */}
                {customFields.buildingAcquisition.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('buildingAcquisition', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('buildingAcquisition', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('buildingUsage')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Building Use</InputLabel>
                  <MuiSelect label="Building Use" defaultValue="">
                    <MenuItem value="">Select Building Use</MenuItem>
                    <MenuItem value="office">Office</MenuItem>
                    <MenuItem value="warehouse">Warehouse</MenuItem>
                    <MenuItem value="school">School</MenuItem>
                    <MenuItem value="other">Other (Manual Entry)</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Fire Safety Certification</InputLabel>
                  <MuiSelect label="Fire Safety Certification" defaultValue="">
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Occupancy Certificate No." placeholder="Enter certificate ID" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Structural Safety Certificate</InputLabel>
                  <MuiSelect label="Structural Safety Certificate" defaultValue="">
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                    <MenuItem value="lastUpdated">Last Updated Date Option</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Utility Connections</InputLabel>
                  <MuiSelect label="Utility Connections" defaultValue="">
                    <MenuItem value="">Select Utilities</MenuItem>
                    <MenuItem value="water">Water</MenuItem>
                    <MenuItem value="electricity">Electricity</MenuItem>
                    <MenuItem value="both">Water & Electricity</MenuItem>
                    <MenuItem value="other">Other (Manual Entry)</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.buildingUsage.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('buildingUsage', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('buildingUsage', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('buildingMaintenance')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Maintenance Responsibility</InputLabel>
                  <MuiSelect label="Maintenance Responsibility" defaultValue="">
                    <MenuItem value="">Select Department/Team</MenuItem>
                    <MenuItem value="facilities">Facilities Management</MenuItem>
                    <MenuItem value="admin">Administration</MenuItem>
                    <MenuItem value="outsourced">Outsourced</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>AMC / PPM Linked</InputLabel>
                  <MuiSelect label="AMC / PPM Linked" defaultValue="">
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.buildingMaintenance.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('buildingMaintenance', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('buildingMaintenance', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('buildingMiscellaneous')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextField label="Remarks / Notes" placeholder="Special remarks like shared floor, rent info, etc." variant="outlined" fullWidth multiline rows={4} />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dwg" className="hidden" id="building-attachments" />
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
              {customFields.buildingMiscellaneous.map(field => <div key={field.id} className="relative">
                <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('buildingMiscellaneous', field.id, e.target.value)} sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <button onClick={() => removeCustomField('buildingMiscellaneous', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>)}
            </CardContent>
          </Card>
        </div>
      </LocalizationProvider>}

      {/* Leasehold Improvement Asset Details - Show when Leasehold Improvement is selected */}
      {selectedAssetCategory === 'Leasehold Improvement' && <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="space-y-6">
          {/* Basic Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Identification
                </div>
                <button onClick={() => openCustomFieldModal('leaseholdBasicId')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Asset ID / Code" placeholder="Enter alphanumeric code" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Improvement Description" placeholder="e.g., Flooring, IT Cabling" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.leaseholdBasicId.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('leaseholdBasicId', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('leaseholdBasicId', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('leaseholdLocationAssoc')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Location / Site" placeholder="Enter location" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Leased Property ID</InputLabel>
                  <MuiSelect label="Leased Property ID" defaultValue="">
                    <MenuItem value="">Select Property</MenuItem>
                    <MenuItem value="prop001">Property 001</MenuItem>
                    <MenuItem value="prop002">Property 002</MenuItem>
                    <MenuItem value="prop003">Property 003</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Ownership Type" value="Lessee" variant="outlined" fullWidth disabled sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.leaseholdLocationAssoc.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('leaseholdLocationAssoc', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('leaseholdLocationAssoc', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('improvementDetails')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Type of Improvement</InputLabel>
                  <MuiSelect label="Type of Improvement" defaultValue="">
                    <MenuItem value="">Select Type</MenuItem>
                    <MenuItem value="civil">Civil</MenuItem>
                    <MenuItem value="electrical">Electrical</MenuItem>
                    <MenuItem value="hvac">HVAC</MenuItem>
                    <MenuItem value="plumbing">Plumbing</MenuItem>
                    <MenuItem value="it">IT Infrastructure</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Vendor / Contractor Name</InputLabel>
                  <MuiSelect label="Vendor / Contractor Name" defaultValue="">
                    <MenuItem value="">Select Vendor</MenuItem>
                    <MenuItem value="vendor1">ABC Construction</MenuItem>
                    <MenuItem value="vendor2">XYZ Contractors</MenuItem>
                    <MenuItem value="vendor3">PQR Services</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Invoice Number" placeholder="Enter invoice number" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <DatePicker label="Date of Improvement" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <TextField label="Improvement Cost (INR)" placeholder="Enter cost" variant="outlined" fullWidth type="number" InputProps={{
                  startAdornment: <InputAdornment position="start">{localStorage.getItem('currency')}</InputAdornment>
                }} sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.improvementDetails.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('improvementDetails', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('improvementDetails', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('leaseholdFinancial')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Depreciation Method</InputLabel>
                  <MuiSelect label="Depreciation Method" defaultValue="">
                    <MenuItem value="">Select Method</MenuItem>
                    <MenuItem value="straight">Straight Line</MenuItem>
                    <MenuItem value="wdv">Written Down Value</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Useful Life (Years)" placeholder="Enter years" variant="outlined" fullWidth type="number" sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Depreciation Rate (%)" placeholder="Enter rate" variant="outlined" fullWidth type="number" InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }} sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Current Book Value (INR)" placeholder="Enter value" variant="outlined" fullWidth type="number" InputProps={{
                  startAdornment: <InputAdornment position="start">{localStorage.getItem('currency')}</InputAdornment>
                }} sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <DatePicker label="Asset Capitalized On" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.leaseholdFinancial.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('leaseholdFinancial', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('leaseholdFinancial', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('leaseholdLease')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker label="Lease Start Date" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <DatePicker label="Lease End Date" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>AMC / PPM Linked</InputLabel>
                  <MuiSelect label="AMC / PPM Linked" defaultValue="">
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.leaseholdLease.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('leaseholdLease', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('leaseholdLease', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('leaseholdOversight')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Responsible Department</InputLabel>
                  <MuiSelect label="Responsible Department" defaultValue="">
                    <MenuItem value="">Select Department</MenuItem>
                    <MenuItem value="facilities">Facilities Management</MenuItem>
                    <MenuItem value="admin">Administration</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="it">IT Department</MenuItem>
                  </MuiSelect>
                </FormControl>
                <div className="md:col-span-2">
                  <TextField label="Remarks / Notes" placeholder="Enter remarks or notes" variant="outlined" fullWidth multiline rows={4} />
                </div>
                <div className="md:col-span-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" id="leasehold-attachments" />
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
                {customFields.leaseholdOversight.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('leaseholdOversight', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('leaseholdOversight', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
              </div>
            </CardContent>
          </Card>
        </div>
      </LocalizationProvider>}

      {/* Vehicle Asset Details - Show when Vehicle is selected */}
      {selectedAssetCategory === 'Vehicle' && <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="space-y-6">
          {/* Basic Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Identification
                </div>
                <button onClick={() => openCustomFieldModal('vehicleBasicId')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Asset ID / Code" placeholder="System-generated or manually entered" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Vehicle Type</InputLabel>
                  <MuiSelect label="Vehicle Type" defaultValue="">
                    <MenuItem value="">Select Vehicle Type</MenuItem>
                    <MenuItem value="car">Car</MenuItem>
                    <MenuItem value="truck">Truck</MenuItem>
                    <MenuItem value="van">Van</MenuItem>
                    <MenuItem value="forklift">Forklift</MenuItem>
                    <MenuItem value="electric-cart">Electric Cart</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </MuiSelect>
                </FormControl>
                <TextField label="Make & Model" placeholder="e.g., Tata Ace, Honda Activa" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Registration Number" placeholder="e.g., MH01AB1234" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.vehicleBasicId.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('vehicleBasicId', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('vehicleBasicId', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('vehicleTechnicalSpecs')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Chassis Number" placeholder="Enter chassis number" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Engine Number" placeholder="Enter engine number" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Fuel Type</InputLabel>
                  <MuiSelect label="Fuel Type" defaultValue="">
                    <MenuItem value="">Select Fuel Type</MenuItem>
                    <MenuItem value="petrol">Petrol</MenuItem>
                    <MenuItem value="diesel">Diesel</MenuItem>
                    <MenuItem value="cng">CNG</MenuItem>
                    <MenuItem value="electric">Electric</MenuItem>
                    <MenuItem value="hybrid">Hybrid</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.vehicleTechnicalSpecs.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('vehicleTechnicalSpecs', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('vehicleTechnicalSpecs', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('vehicleOwnership')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Ownership Type</InputLabel>
                  <MuiSelect label="Ownership Type" defaultValue="">
                    <MenuItem value="">Select Ownership Type</MenuItem>
                    <MenuItem value="owned">Owned</MenuItem>
                    <MenuItem value="leased">Leased</MenuItem>
                    <MenuItem value="company-owned">Company-Owned</MenuItem>
                    <MenuItem value="departmental">Departmental</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Assigned To / Department</InputLabel>
                  <MuiSelect label="Assigned To / Department" defaultValue="">
                    <MenuItem value="">Select Department/User</MenuItem>
                    <MenuItem value="admin">Administration</MenuItem>
                    <MenuItem value="hr">Human Resources</MenuItem>
                    <MenuItem value="logistics">Logistics</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Usage Type</InputLabel>
                  <MuiSelect label="Usage Type" defaultValue="">
                    <MenuItem value="">Select Usage Type</MenuItem>
                    <MenuItem value="official">Official</MenuItem>
                    <MenuItem value="delivery">Delivery</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                    <MenuItem value="transport">Transport</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>Permit Type</InputLabel>
                  <MuiSelect label="Permit Type" defaultValue="">
                    <MenuItem value="">Select Permit Type</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="transport">Transport Permit</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.vehicleOwnership.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('vehicleOwnership', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('vehicleOwnership', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('vehicleFinancial')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker label="Date of Purchase" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <div className="flex gap-2">
                  <FormControl sx={{
                    minWidth: 80,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <InputLabel>Currency</InputLabel>
                    <MuiSelect label="Currency" defaultValue="inr">
                      <MenuItem value="inr">INR</MenuItem>
                    </MuiSelect>
                  </FormControl>
                  <TextField label="Purchase Cost" placeholder="Enter purchase cost" variant="outlined" type="number" sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                </div>
                <TextField label="Depreciation Rate (%)" placeholder="Linked to depreciation module" variant="outlined" fullWidth type="number" InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>
                }} sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Current Book Value (INR)" placeholder="Calculated or manually entered" variant="outlined" fullWidth type="number" InputProps={{
                  startAdornment: <InputAdornment position="start">{localStorage.getItem('currency')}</InputAdornment>
                }} sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.vehicleFinancial.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('vehicleFinancial', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('vehicleFinancial', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
              </div>
            </CardContent>
          </Card>

          {/* Performance Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] text-lg font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Tracking
                </div>
                <button onClick={() => openCustomFieldModal('vehiclePerformance')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <TextField label="Odometer Reading" placeholder="Enter reading" variant="outlined" type="number" sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <FormControl sx={{
                    minWidth: 80,
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <InputLabel>Unit</InputLabel>
                    <MuiSelect label="Unit" defaultValue="km">
                      <MenuItem value="km">KM</MenuItem>
                      <MenuItem value="miles">Miles</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
                <TextField label="Service Schedule (PPM)" placeholder="Linked PPM name (Read-only)" variant="outlined" fullWidth disabled sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <DatePicker label="Last Service Date" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <FormControl fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <InputLabel>AMC Linked</InputLabel>
                  <MuiSelect label="AMC Linked" defaultValue="">
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Custom Fields */}
                {customFields.vehiclePerformance.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('vehiclePerformance', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('vehiclePerformance', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('vehicleLegal')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField label="Insurance Provider" placeholder="Enter insurance provider name" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Insurance Policy No." placeholder="Enter policy number" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <DatePicker label="Insurance Expiry Date" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <DatePicker label="Fitness Certificate Expiry" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <DatePicker label="PUC Expiry Date" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />

                {/* Custom Fields */}
                {customFields.vehicleLegal.map(field => <div key={field.id} className="relative">
                  <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('vehicleLegal', field.id, e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }} />
                  <button onClick={() => removeCustomField('vehicleLegal', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>)}
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
                <button onClick={() => openCustomFieldModal('vehicleMiscellaneous')} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextField label="Remarks / Notes" placeholder="Comments, issues, or notes" variant="outlined" fullWidth multiline rows={4} />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="hidden" id="vehicle-attachments" />
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
              {customFields.vehicleMiscellaneous.map(field => <div key={field.id} className="relative">
                <TextField label={field.name} placeholder={`Enter ${field.name}`} variant="outlined" fullWidth value={field.value} onChange={e => handleCustomFieldChange('vehicleMiscellaneous', field.id, e.target.value)} sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <button onClick={() => removeCustomField('vehicleMiscellaneous', field.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>)}
            </CardContent>
          </Card>
        </div>
      </LocalizationProvider>}

      {/* Conditional Sections - Show only for specific asset categories */}
      {(selectedAssetCategory === 'Furniture & Fixtures' || selectedAssetCategory === 'IT Equipment' || selectedAssetCategory === 'Machinery & Equipment' || selectedAssetCategory === 'Tools & Instruments') && <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <button onClick={e => {
                  e.stopPropagation();
                  openCustomFieldModal('locationDetails');
                }} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
                {expandedSections.location ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
            {expandedSections.location && <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                {['Site', 'Building', 'Wing', 'Area', 'Floor'].map(label => <FormControl key={label} fullWidth variant="outlined">
                  <InputLabel shrink>{label}</InputLabel>
                  <MuiSelect label={label} displayEmpty value="" sx={fieldStyles}>
                    <MenuItem value=""><em>Select {label}</em></MenuItem>
                    <MenuItem value={`${label.toLowerCase()}1`}>{label} 1</MenuItem>
                    <MenuItem value={`${label.toLowerCase()}2`}>{label} 2</MenuItem>
                  </MuiSelect>
                </FormControl>)}
              </div>

              {/* Custom Fields */}
              {customFields.locationDetails.map(field => <div key={field.id} className="flex items-center gap-2 mb-2">
                <TextField label={field.name} value={field.value} onChange={e => handleCustomFieldChange('locationDetails', field.id, e.target.value)} variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <button onClick={() => removeCustomField('locationDetails', field.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>)}
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
                  openCustomFieldModal('assetDetails');
                }} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
                {expandedSections.asset ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
            {expandedSections.asset && <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <TextField required label="Asset Name" placeholder="Enter Asset Name" fullWidth variant="outlined" sx={fieldStyles} />
                <TextField required label="Model No." placeholder="Enter Model No" fullWidth variant="outlined" sx={fieldStyles} />
                <TextField required label="Manufacturer" placeholder="Enter Manufacturer" fullWidth variant="outlined" sx={fieldStyles} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Group</InputLabel>
                  <MuiSelect label="Group" displayEmpty value="" sx={fieldStyles} required>
                    <MenuItem value=""><em>Select Group</em></MenuItem>
                    <MenuItem value="group1">Group 1</MenuItem>
                    <MenuItem value="group2">Group 2</MenuItem>
                  </MuiSelect>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Subgroup</InputLabel>
                  <MuiSelect label="Subgroup" displayEmpty value="" sx={fieldStyles} required>
                    <MenuItem value=""><em>Select Sub-Group</em></MenuItem>
                    <MenuItem value="subgroup1">Subgroup 1</MenuItem>
                    <MenuItem value="subgroup2">Subgroup 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-[#C72030] mb-2 block">Status</label>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="status-inuse" name="status" value="inuse" defaultChecked className="w-4 h-4 text-[#C72030] border-gray-300" />
                    <label htmlFor="status-inuse" className="text-sm">In Use</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="status-breakdown" name="status" value="breakdown" className="w-4 h-4 text-[#C72030] border-gray-300" />
                    <label htmlFor="status-breakdown" className="text-sm">Breakdown</label>
                  </div>
                </div>
              </div>
            </div>}
          </div>

          {/* IT Assets Details - Show only for IT Equipment */}
          {selectedAssetCategory === 'IT Equipment' && <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                <button onClick={() => setItAssetsCustomFieldModalOpen(true)} className="px-3 py-1 rounded text-sm flex items-center gap-1 hover:opacity-80 bg-[#F6F4EE] text-[#C72030]">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
                {expandedSections.warranty ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
            {expandedSections.warranty && <div className="p-4 sm:p-6">
              <div className="mb-6">
                <h3 className="font-semibold mb-4 text-[#C72030]">SYSTEM DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextField label="OS" placeholder="Enter OS" fullWidth variant="outlined" sx={fieldStyles} />
                  <TextField label="Total Memory" placeholder="Enter Total Memory" fullWidth variant="outlined" sx={fieldStyles} />
                  <TextField label="Processor" placeholder="Enter Processor" fullWidth variant="outlined" sx={fieldStyles} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-[#C72030]">HARD DISK DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <TextField label="Model" placeholder="Enter Model" fullWidth variant="outlined" sx={fieldStyles} />
                  <TextField label="Serial No." placeholder="Enter Serial No." fullWidth variant="outlined" sx={fieldStyles} />
                  <TextField label="Capacity" placeholder="Enter Capacity" fullWidth variant="outlined" sx={fieldStyles} />
                </div>
              </div>
            </div>}
          </div>}

          {/* Meter Details */}
          {selectedAssetCategory !== 'Tools & Instruments' && <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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

              {/* Critical Status */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#C72030] font-medium text-sm sm:text-base">CRITICAL</span>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="critical-yes" name="criticalStatus" value="yes" checked={criticalStatus === 'yes'} onChange={e => setCriticalStatus(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                        accentColor: '#C72030'
                      }} />
                      <label htmlFor="critical-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="critical-no" name="criticalStatus" value="no" checked={criticalStatus === 'no'} onChange={e => setCriticalStatus(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                        accentColor: '#C72030'
                      }} />
                      <label htmlFor="critical-no" className="text-sm">No</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meter Details Categories */}
              <div className="mb-6" style={{ backgroundColor: '#f6f4ee' }}>
                <h3 className="text-[#C72030] font-semibold mb-4  p-3 rounded text-sm">METER DETAILS</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {getMeterCategoryOptions().map(option => {
                    const IconComponent = option.icon;
                    return <div key={option.value} className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${meterCategoryType === option.value ? 'border-[#C72030] bg-red-50' : 'border-gray-200'}`} onClick={() => handleMeterCategoryChange(option.value)}>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id={`meter-${option.value}`} name="meterCategory" value={option.value} checked={meterCategoryType === option.value} onChange={() => handleMeterCategoryChange(option.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                          accentColor: '#C72030'
                        }} />
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <label htmlFor={`meter-${option.value}`} className="text-sm font-medium cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    </div>;
                  })}
                </div>
              </div>

              {/* Board Ratio Options - Show when Board is selected */}
              {showBoardRatioOptions && <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Board Sub-options</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getBoardRatioOptions().map(option => {
                    const IconComponent = option.icon;
                    return <div key={option.value} className={`border rounded-md p-3 cursor-pointer transition-colors hover:bg-gray-50 ${subCategoryType === option.value ? 'border-[#C72030] bg-red-50' : 'border-gray-200'}`} onClick={() => setSubCategoryType(option.value)}>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id={`board-${option.value}`} name="boardSubCategory" value={option.value} checked={subCategoryType === option.value} onChange={() => setSubCategoryType(option.value)} className="w-3 h-3 text-[#C72030]" style={{
                          accentColor: '#C72030'
                        }} />
                        <IconComponent className="w-4 h-4 text-gray-600" />
                        <label htmlFor={`board-${option.value}`} className="text-xs font-medium cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    </div>;
                  })}
                </div>
              </div>}

              {/* Renewable Options - Show when Renewable is selected */}
              {showRenewableOptions && <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Renewable Sub-options</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getRenewableOptions().map(option => {
                    const IconComponent = option.icon;
                    return <div key={option.value} className={`border rounded-md p-3 cursor-pointer transition-colors hover:bg-gray-50 ${subCategoryType === option.value ? 'border-[#C72030] bg-red-50' : 'border-gray-200'}`} onClick={() => setSubCategoryType(option.value)}>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id={`renewable-${option.value}`} name="renewableSubCategory" value={option.value} checked={subCategoryType === option.value} onChange={() => setSubCategoryType(option.value)} className="w-3 h-3 text-[#C72030]" style={{
                          accentColor: '#C72030'
                        }} />
                        <IconComponent className="w-4 h-4 text-gray-600" />
                        <label htmlFor={`renewable-${option.value}`} className="text-xs font-medium cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    </div>;
                  })}
                </div>
              </div>}
            </div>}
          </div>}

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
                <button onClick={e => {
                  e.stopPropagation();
                  openCustomFieldModal('purchaseDetails');
                }} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
                  <Plus className="w-4 h-4" />
                  Custom Field
                </button>
                {expandedSections.consumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
            {expandedSections.consumption && <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <TextField label="Purchase Cost *" placeholder="Enter cost" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <DatePicker label="Purchase Date *" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    placeholder: 'dd/mm/yyyy',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <DatePicker label="Warranty Expires On *" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    placeholder: 'dd/mm/yyyy',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">Under Warranty</label>
                  <div className="flex gap-6 mt-2">
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
              {customFields.purchaseDetails.map(field => <div key={field.id} className="flex items-center gap-2 mb-2">
                <TextField label={field.name} value={field.value} onChange={e => handleCustomFieldChange('purchaseDetails', field.id, e.target.value)} variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <button onClick={() => removeCustomField('purchaseDetails', field.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>)}
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
                <button onClick={e => {
                  e.stopPropagation();
                  openCustomFieldModal('depreciationRule');
                }} className="flex items-center gap-1 text-[#C72030] text-sm font-medium bg-[#f6f4ee] px-2 py-1 rounded">
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
              {/* Method */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">Method</label>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="method-straight-line" name="depreciationMethod" value="straight-line" checked={depreciationMethod === 'straight-line'} onChange={e => setDepreciationMethod(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                      accentColor: '#C72030'
                    }} />
                    <label htmlFor="method-straight-line" className="text-sm">Straight Line</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="method-wdv" name="depreciationMethod" value="wdv" checked={depreciationMethod === 'wdv'} onChange={e => setDepreciationMethod(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                      accentColor: '#C72030'
                    }} />
                    <label htmlFor="method-wdv" className="text-sm">WDV</label>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <TextField label="Useful Life (in yrs) *" placeholder="YRS" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Salvage Value *" placeholder="Enter Value" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <TextField label="Depreciation Rate *" placeholder="Enter Value" variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
              </div>

              {/* Configuration Options */}
              <div className="mb-6">
                <div className="flex gap-8">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="config-this-only" name="depreciationConfig" value="this-only" checked={depreciationConfig === 'this-only'} onChange={e => setDepreciationConfig(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                      accentColor: '#C72030'
                    }} />
                    <label htmlFor="config-this-only" className="text-sm">Configure Depreciation Only For This</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="config-similar-product" name="depreciationConfig" value="similar-product" checked={depreciationConfig === 'similar-product'} onChange={e => setDepreciationConfig(e.target.value)} className="w-4 h-4 text-[#C72030] border-gray-300" style={{
                      accentColor: '#C72030'
                    }} />
                    <label htmlFor="config-similar-product" className="text-sm">For Similar Product</label>
                  </div>
                </div>
              </div>

              {/* Custom Fields */}
              {customFields.depreciationRule.map(field => <div key={field.id} className="flex items-center gap-2 mb-2">
                <TextField label={field.name} value={field.value} onChange={e => handleCustomFieldChange('depreciationRule', field.id, e.target.value)} variant="outlined" fullWidth sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }} />
                <button onClick={() => removeCustomField('depreciationRule', field.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>)}
            </div>}
          </div>
        </>
      </LocalizationProvider>}

      {/* Show these sections only for Furniture & Fixtures */}
      {selectedAssetCategory === 'Furniture & Fixtures' && <>
        {/* Asset Allocation */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('assetAllocation')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <BarChart className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              ASSET ALLOCATION
            </div>
            <div className="flex items-center gap-2">
              {expandedSections.assetAllocation ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
          {expandedSections.assetAllocation && <div className="p-4 sm:p-6">
            {/* Based On */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Based On</label>
              <div className="flex gap-6">
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

            {/* Department Dropdown */}
            {allocationBasedOn === 'department' && <div className="mb-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Department*</InputLabel>
                <MuiSelect label="Department*" displayEmpty defaultValue="" sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <MenuItem value=""><em>Select...</em></MenuItem>
                  <MenuItem value="admin">Administration</MenuItem>
                  <MenuItem value="hr">Human Resources</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                  <MenuItem value="it">IT Department</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>}

            {/* Users Dropdown */}
            {allocationBasedOn === 'users' && <div className="mb-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Users*</InputLabel>
                <MuiSelect label="Users*" displayEmpty defaultValue="" sx={{
                  '& .MuiOutlinedInput-root': {
                    height: {
                      xs: '36px',
                      md: '45px'
                    }
                  }
                }}>
                  <MenuItem value=""><em>Select...</em></MenuItem>
                  <MenuItem value="user1">John Doe</MenuItem>
                  <MenuItem value="user2">Jane Smith</MenuItem>
                  <MenuItem value="user3">Mike Johnson</MenuItem>
                  <MenuItem value="user4">Sarah Williams</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>}
          </div>}
        </div>

        {/* Asset Loaned */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {/* Vendor Name */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Vendor Name*</InputLabel>
                  <MuiSelect label="Vendor Name*" displayEmpty defaultValue="" sx={{
                    '& .MuiOutlinedInput-root': {
                      height: {
                        xs: '36px',
                        md: '45px'
                      }
                    }
                  }}>
                    <MenuItem value=""><em>Select Vendor</em></MenuItem>
                    <MenuItem value="vendor1">ABC Corporation</MenuItem>
                    <MenuItem value="vendor2">XYZ Technologies</MenuItem>
                    <MenuItem value="vendor3">Tech Solutions Inc</MenuItem>
                    <MenuItem value="vendor4">Global Services Ltd</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Agreement Start Date */}
                <DatePicker label="Agreement Start Date *" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    placeholder: 'dd/mm/yyyy',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />

                {/* Agreement End Date */}
                <DatePicker label="Agreement End Date *" slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    placeholder: 'dd/mm/yyyy',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        height: {
                          xs: '36px',
                          md: '45px'
                        }
                      }
                    }
                  }
                }} />
              </div>
            </div>}
          </div>
        </LocalizationProvider>

        {/* AMC Details */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div onClick={() => toggleSection('amcDetails')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
              <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
                AMC DETAILS
              </div>
              {expandedSections.amcDetails ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030]" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030]" />}
            </div>

            {expandedSections.amcDetails && <div className="p-4 sm:p-6 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Vendor */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Vendor
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-sm">
                    <option value="">Select Vendor</option>
                    <option value="vendor1">Vendor 1</option>
                    <option value="vendor2">Vendor 2</option>
                    <option value="vendor3">Vendor 3</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <DatePicker className="w-full" format="dd/MM/yyyy" slotProps={{
                    textField: {
                      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-sm",
                      placeholder: "dd/mm/yyyy"
                    }
                  }} />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <DatePicker className="w-full" format="dd/MM/yyyy" slotProps={{
                    textField: {
                      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-sm",
                      placeholder: "dd/mm/yyyy"
                    }
                  }} />
                </div>

                {/* First Service */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    First Service
                  </label>
                  <DatePicker className="w-full" format="dd/MM/yyyy" slotProps={{
                    textField: {
                      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-sm",
                      placeholder: "dd/mm/yyyy"
                    }
                  }} />
                </div>

                {/* Payment Terms */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Payment Terms
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-sm">
                    <option value="">Select Payment Terms</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="half-yearly">Half Yearly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* No. of Visits */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    No. of Visits
                  </label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-sm" placeholder="Enter Value" />
                </div>

                {/* AMC Cost */}
                <div className="space-y-2 lg:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    AMC Cost
                  </label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-sm" placeholder="Enter AMC Cost" />
                </div>
              </div>
            </div>}
          </div>
        </LocalizationProvider>

        {/* Attachments */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div onClick={() => toggleSection('attachments')} className="cursor-pointer border-l-4 border-l-[#C72030] p-4 sm:p-6 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2 text-[#C72030] text-sm sm:text-base font-semibold">
              <span className="bg-[#C72030] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
                <Paperclip className="w-3 h-3 sm:w-4 sm:h-4" />
              </span>
              ATTACHMENTS
            </div>
            {expandedSections.attachments ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030]" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030]" />}
          </div>

          {expandedSections.attachments && <div className="p-4 sm:p-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Manuals Upload */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Manuals Upload</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <label className="cursor-pointer">
                      <input type="file" multiple className="hidden" onChange={e => handleFileUpload('manualsUpload', e.target.files)} />
                      <span className="text-[#C72030] text-sm font-medium">
                        Choose File{' '}
                        <span className="text-gray-500 font-normal">No file chosen</span>
                      </span>
                    </label>
                    <button onClick={() => {
                      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                      input?.click();
                    }} className="flex items-center gap-2 bg-[#f6f4ee] text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e8e5d9] transition-colors">
                      <Plus className="w-4 h-4" />
                      Upload Files
                    </button>
                  </div>
                </div>
                {/* File list */}
                {attachments.manualsUpload.length > 0 && <div className="space-y-2">
                  {attachments.manualsUpload.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button onClick={() => removeFile('manualsUpload', index)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>)}
                </div>}
              </div>

              {/* Insurance Details */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Insurance Details</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <label className="cursor-pointer">
                      <input type="file" multiple className="hidden" onChange={e => handleFileUpload('insuranceDetails', e.target.files)} />
                      <span className="text-[#C72030] text-sm font-medium">
                        Choose File{' '}
                        <span className="text-gray-500 font-normal">No file chosen</span>
                      </span>
                    </label>
                    <button className="flex items-center gap-2 bg-[#f6f4ee] text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e8e5d9] transition-colors">
                      <Plus className="w-4 h-4" />
                      Upload Files
                    </button>
                  </div>
                </div>
                {/* File list */}
                {attachments.insuranceDetails.length > 0 && <div className="space-y-2">
                  {attachments.insuranceDetails.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button onClick={() => removeFile('insuranceDetails', index)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>)}
                </div>}
              </div>

              {/* Purchase Invoice */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Purchase Invoice</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <label className="cursor-pointer">
                      <input type="file" multiple className="hidden" onChange={e => handleFileUpload('purchaseInvoice', e.target.files)} />
                      <span className="text-[#C72030] text-sm font-medium">
                        Choose File{' '}
                        <span className="text-gray-500 font-normal">No file chosen</span>
                      </span>
                    </label>
                    <button className="flex items-center gap-2 bg-[#f6f4ee] text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e8e5d9] transition-colors">
                      <Plus className="w-4 h-4" />
                      Upload Files
                    </button>
                  </div>
                </div>
                {/* File list */}
                {attachments.purchaseInvoice.length > 0 && <div className="space-y-2">
                  {attachments.purchaseInvoice.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button onClick={() => removeFile('purchaseInvoice', index)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>)}
                </div>}
              </div>

              {/* AMC */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900">AMC</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <label className="cursor-pointer">
                      <input type="file" multiple className="hidden" onChange={e => handleFileUpload('amc', e.target.files)} />
                      <span className="text-[#C72030] text-sm font-medium">
                        Choose File{' '}
                        <span className="text-gray-500 font-normal">No file chosen</span>
                      </span>
                    </label>
                    <button className="flex items-center gap-2 bg-[#f6f4ee] text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-[#e8e5d9] transition-colors">
                      <Plus className="w-4 h-4" />
                      Upload Files
                    </button>
                  </div>
                </div>
                {/* File list */}
                {attachments.amc.length > 0 && <div className="space-y-2">
                  {attachments.amc.map((file, index) => <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button onClick={() => removeFile('amc', index)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>)}
                </div>}
              </div>
            </div>
          </div>}
        </div>
      </>}

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

    {/* Add Custom Field Modal */}
    <AddCustomFieldModal isOpen={customFieldModalOpen} onClose={() => setCustomFieldModalOpen(false)} onAddField={handleAddCustomField} />
  </div>;
};