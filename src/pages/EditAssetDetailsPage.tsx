import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Percent, Grid2X2, Package, Settings, Paperclip, Plus, X } from 'lucide-react';
import { TextField, FormControl, InputLabel, MenuItem, Select as MuiSelect, SelectChangeEvent } from '@mui/material';
import { AddCustomFieldModal } from '@/components/AddCustomFieldModal';
import { LocationDetailsSection } from '@/components/asset/LocationDetailsSection';
import { AssetDetailsSection } from '@/components/asset/AssetDetailsSection';
import { ItAssetDetailsSection } from '@/components/asset/ItAssetDetailsSection';
import { MeterDetailsSection } from '@/components/asset/MeterDetailsSection';
import { useAssetForm } from '@/hooks/useAssetForm';

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

const radioButtonStyles = "w-4 h-4 text-[#C72030] bg-white border-2 border-gray-300 focus:ring-4 focus:ring-[#C72030]/20 focus:ring-opacity-20 checked:bg-[#C72030] checked:border-[#C72030] hover:border-[#C72030] transition-colors";

export const EditAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    expandedSections,
    toggleStates,
    locationData,
    formData,
    itAssetData,
    toggleSection,
    handleToggleChange,
    handleLocationChange,
    handleInputChange,
    handleItAssetChange
  } = useAssetForm();

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

  const handleMeterCategoryChange = (value: string) => {
    setMeterCategoryType(value);
    setSubCategoryType(''); // Reset subcategory when category changes
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

  const removeConsumptionMeasure = (id: number) => {
    if (consumptionMeasures.length > 1) {
      setConsumptionMeasures(consumptionMeasures.filter(m => m.id !== id));
    }
  };

  const updateConsumptionMeasure = (id: number, field: string, value: string | boolean) => {
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

  const removeNonConsumptionMeasure = (id: number) => {
    if (nonConsumptionMeasures.length > 1) {
      setNonConsumptionMeasures(nonConsumptionMeasures.filter(m => m.id !== id));
    }
  };

  const updateNonConsumptionMeasure = (id: number, field: string, value: string | boolean) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.map(m => m.id === id ? {
      ...m,
      [field]: value
    } : m));
  };

  const handleFileUpload = (category: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(prev => ({
        ...prev,
        [category]: [...prev[category], ...fileArray]
      }));
    }
  };

  const removeFile = (category: string, index: number) => {
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
      meterCategoryType
    });
    navigate(`/maintenance/asset/details/${id}`);
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new:', {
      locationData,
      formData,
      meterCategoryType
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
    setCustomFields(prev => prev.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const handleItCustomFieldChange = (id: string, value: string) => {
    setItCustomFields(prev => prev.map(field => 
      field.id === id ? { ...field, value } : field
    ));
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

  return (
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50">
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
        <LocationDetailsSection
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
          locationData={locationData}
          onLocationChange={handleLocationChange}
        />

        {/* Asset Details */}
        <AssetDetailsSection
          isExpanded={expandedSections.asset}
          onToggle={() => toggleSection('asset')}
          formData={formData}
          onInputChange={handleInputChange}
          customFields={customFields}
          onCustomFieldChange={handleCustomFieldChange}
          onRemoveCustomField={removeCustomField}
          onOpenCustomFieldModal={() => openCustomFieldModal('asset')}
        />

        {/* IT Assets Details */}
        <ItAssetDetailsSection
          isExpanded={expandedSections.warranty}
          onToggle={() => toggleSection('warranty')}
          isToggleOn={toggleStates.itAssetApplicable}
          onToggleChange={(value) => handleToggleChange('itAssetApplicable', value)}
          itAssetData={itAssetData}
          onItAssetChange={handleItAssetChange}
          itCustomFields={itCustomFields}
          onItCustomFieldChange={handleItCustomFieldChange}
          onRemoveItCustomField={removeItCustomField}
          onOpenCustomFieldModal={() => openCustomFieldModal('it')}
        />

        {/* Meter Details */}
        <MeterDetailsSection
          isExpanded={expandedSections.meterCategory}
          onToggle={() => toggleSection('meterCategory')}
          meterDetailsApplicable={toggleStates.meterDetailsApplicable}
          onMeterDetailsToggle={(value) => handleToggleChange('meterDetailsApplicable', value)}
          meterType={meterType}
          setMeterType={setMeterType}
          critical={critical}
          setCritical={setCritical}
          meterCategoryType={meterCategoryType}
          handleMeterCategoryChange={handleMeterCategoryChange}
          subCategoryType={subCategoryType}
          setSubCategoryType={setSubCategoryType}
        />

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
          {expandedSections.consumption && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <TextField
                  required
                  label="Purchase Cost"
                  placeholder="Enter Purchase Cost"
                  name="purchaseCost"
                  value={formData.purchaseCost}
                  onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
                
                <TextField
                  required
                  label="Purchase Date"
                  placeholder="dd/mm/yyyy"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-700">Under Warranty</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="warranty-yes"
                        name="underWarranty"
                        value="yes"
                        checked={formData.underWarranty === 'yes'}
                        onChange={(e) => handleInputChange('underWarranty', e.target.value)}
                        className={radioButtonStyles}
                      />
                      <label htmlFor="warranty-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="warranty-no"
                        name="underWarranty"
                        value="no"
                        checked={formData.underWarranty === 'no'}
                        onChange={(e) => handleInputChange('underWarranty', e.target.value)}
                        className={radioButtonStyles}
                      />
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
                  value={formData.warrantyExpiresOn}
                  onChange={(e) => handleInputChange('warrantyExpiresOn', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </div>
          )}
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
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={toggleStates.depreciationApplicable}
                    onChange={(e) => handleToggleChange('depreciationApplicable', e.target.checked)}
                  />
                  <div className={`w-11 h-6 ${toggleStates.depreciationApplicable ? 'bg-green-400' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
                <span className="text-sm text-gray-600">If Applicable</span>
              </div>
            </div>
            {expandedSections.nonConsumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.nonConsumption && toggleStates.depreciationApplicable && (
            <div className="p-4 sm:p-6">
              {/* Method Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium text-gray-700">Method</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="method-straight-line"
                        name="depreciationMethod"
                        value="straight-line"
                        checked={depreciationMethod === 'straight-line'}
                        onChange={(e) => setDepreciationMethod(e.target.value)}
                        className={radioButtonStyles}
                      />
                      <label htmlFor="method-straight-line" className="text-sm">Straight Line</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="method-wdv"
                        name="depreciationMethod"
                        value="wdv"
                        checked={depreciationMethod === 'wdv'}
                        onChange={(e) => setDepreciationMethod(e.target.value)}
                        className={radioButtonStyles}
                      />
                      <label htmlFor="method-wdv" className="text-sm">WDV</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <TextField
                  required
                  label="Useful Life (in yrs)"
                  placeholder="yrs"
                  name="usefulLife"
                  value={depreciationData.usefulLife}
                  onChange={(e) => handleDepreciationDataChange('usefulLife', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
                
                <TextField
                  required
                  label="Salvage Value"
                  placeholder="Enter Value"
                  name="salvageValue"
                  value={depreciationData.salvageValue}
                  onChange={(e) => handleDepreciationDataChange('salvageValue', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <TextField
                  required
                  label="Depreciation Rate"
                  placeholder="Enter Value"
                  name="depreciationRate"
                  value={depreciationData.depreciationRate}
                  onChange={(e) => handleDepreciationDataChange('depreciationRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              {/* Configuration Scope */}
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="scope-this-only"
                    name="depreciationScope"
                    value="this-only"
                    checked={depreciationScope === 'this-only'}
                    onChange={(e) => setDepreciationScope(e.target.value)}
                    className={radioButtonStyles}
                  />
                  <label htmlFor="scope-this-only" className="text-sm">Configure Depreciation Only For This</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="scope-similar"
                    name="depreciationScope"
                    value="similar"
                    checked={depreciationScope === 'similar'}
                    onChange={(e) => setDepreciationScope(e.target.value)}
                    className={radioButtonStyles}
                  />
                  <label htmlFor="scope-similar" className="text-sm">For Similar Product</label>
                </div>
              </div>
            </div>
          )}
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
          {expandedSections.assetAllocation && (
            <div className="p-4 sm:p-6">
              {/* Based On Section */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-medium text-gray-700">Based On</span>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="allocation-department"
                        name="basedOn"
                        value="department"
                        checked={assetAllocationData.basedOn === 'department'}
                        onChange={(e) => handleAssetAllocationChange('basedOn', e.target.value)}
                        className={radioButtonStyles}
                      />
                      <label htmlFor="allocation-department" className="text-sm">Department</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="allocation-users"
                        name="basedOn"
                        value="users"
                        checked={assetAllocationData.basedOn === 'users'}
                        onChange={(e) => handleAssetAllocationChange('basedOn', e.target.value)}
                        className={radioButtonStyles}
                      />
                      <label htmlFor="allocation-users" className="text-sm">Users</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="department-select-label" shrink>Department*</InputLabel>
                  <MuiSelect
                    labelId="department-select-label"
                    label="Department*"
                    displayEmpty
                    value={assetAllocationData.department}
                    onChange={(e: SelectChangeEvent) => handleAssetAllocationChange('department', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select...</em></MenuItem>
                    <MenuItem value="hr">HR Department</MenuItem>
                    <MenuItem value="it">IT Department</MenuItem>
                    <MenuItem value="finance">Finance Department</MenuItem>
                    <MenuItem value="operations">Operations Department</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          )}
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
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={toggleStates.assetLoanedApplicable}
                    onChange={(e) => handleToggleChange('assetLoanedApplicable', e.target.checked)}
                  />
                  <div className={`w-11 h-6 ${toggleStates.assetLoanedApplicable ? 'bg-green-400' : 'bg-gray-300'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
                <span className="text-sm text-gray-600">If Applicable</span>
              </div>
            </div>
            {expandedSections.assetLoaned ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
          {expandedSections.assetLoaned && toggleStates.assetLoanedApplicable && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="vendor-name-select-label" shrink>Vendor Name*</InputLabel>
                  <MuiSelect
                    labelId="vendor-name-select-label"
                    label="Vendor Name*"
                    displayEmpty
                    value={assetLoanedData.vendorName}
                    onChange={(e: SelectChangeEvent) => handleAssetLoanedChange('vendorName', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Vendor</em></MenuItem>
                    <MenuItem value="vendor1">Vendor 1</MenuItem>
                    <MenuItem value="vendor2">Vendor 2</MenuItem>
                    <MenuItem value="vendor3">Vendor 3</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField
                  required
                  label="Agreement Start Date"
                  placeholder="dd/mm/yyyy"
                  name="agreementStartDate"
                  type="date"
                  value={assetLoanedData.agreementStartDate}
                  onChange={(e) => handleAssetLoanedChange('agreementStartDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <TextField
                  required
                  label="Agreement End Date"
                  placeholder="dd/mm/yyyy"
                  name="agreementEndDate"
                  type="date"
                  value={assetLoanedData.agreementEndDate}
                  onChange={(e) => handleAssetLoanedChange('agreementEndDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </div>
          )}
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
          {expandedSections.amcDetails && (
            <div className="p-4 sm:p-6">
              {/* First Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="amc-vendor-select-label" shrink>Vendor</InputLabel>
                  <MuiSelect
                    labelId="amc-vendor-select-label"
                    label="Vendor"
                    displayEmpty
                    value={amcDetailsData.vendor}
                    onChange={(e: SelectChangeEvent) => handleAmcDetailsChange('vendor', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Vendor</em></MenuItem>
                    <MenuItem value="vendor1">Vendor 1</MenuItem>
                    <MenuItem value="vendor2">Vendor 2</MenuItem>
                    <MenuItem value="vendor3">Vendor 3</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField
                  required
                  label="Start Date"
                  placeholder="dd/mm/yyyy"
                  name="startDate"
                  type="date"
                  value={amcDetailsData.startDate}
                  onChange={(e) => handleAmcDetailsChange('startDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <TextField
                  required
                  label="End Date"
                  placeholder="dd/mm/yyyy"
                  name="endDate"
                  type="date"
                  value={amcDetailsData.endDate}
                  onChange={(e) => handleAmcDetailsChange('endDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <TextField
                  required
                  label="First Service"
                  placeholder="dd/mm/yyyy"
                  name="firstService"
                  type="date"
                  value={amcDetailsData.firstService}
                  onChange={(e) => handleAmcDetailsChange('firstService', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />

                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="payment-terms-select-label" shrink>Payment Terms</InputLabel>
                  <MuiSelect
                    labelId="payment-terms-select-label"
                    label="Payment Terms"
                    displayEmpty
                    value={amcDetailsData.paymentTerms}
                    onChange={(e: SelectChangeEvent) => handleAmcDetailsChange('paymentTerms', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Payment Terms</em></MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                    <MenuItem value="half-yearly">Half Yearly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField
                  required
                  label="No. of Visits"
                  placeholder="Enter Value"
                  name="noOfVisits"
                  value={amcDetailsData.noOfVisits}
                  onChange={(e) => handleAmcDetailsChange('noOfVisits', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <TextField
                  required
                  label="AMC Cost"
                  placeholder="Enter AMC Cost"
                  name="amcCost"
                  value={amcDetailsData.amcCost}
                  onChange={(e) => handleAmcDetailsChange('amcCost', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
              </div>
            </div>
          )}
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
          {expandedSections.attachments && (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { label: 'Manuals Upload', id: 'manuals-upload', category: 'manualsUpload', accept: '.pdf,.doc,.docx,.txt' },
                  { label: 'Insurance Details', id: 'insurance-upload', category: 'insuranceDetails', accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' },
                  { label: 'Purchase Invoice', id: 'invoice-upload', category: 'purchaseInvoice', accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' },
                  { label: 'AMC', id: 'amc-upload', category: 'amc', accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' }
                ].map((field) => (
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
                            {attachments[field.category].length > 0 ? `${attachments[field.category].length} file(s) selected` : 'No file chosen'}
                          </span>
                        </div>
                      </label>
                      {attachments[field.category].length > 0 && (
                        <div className="mt-2 space-y-1">
                          {attachments[field.category].map((file: any, index: number) => (
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
                          <button className="text-xs sm:text-sm bg-[#f6f4ee] text-[#C72030] px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-[#f0ebe0] flex items-center mx-auto">
                            <Plus className="w-4 h-4 mr-1 sm:mr-2 text-[#C72030]" />
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
            onClick={handleSaveAndShowDetails}
            className="border border-[#C72030] text-[#C72030] px-6 sm:px-8 py-2 rounded-md hover:bg-[#C72030] hover:text-white text-sm sm:text-base"
          >
            Save & Show Details
          </button>
          <button
            onClick={handleSaveAndCreateNew}
            className="px-6 sm:px-8 py-2 rounded-md text-sm sm:text-base bg-[#f6f4ee] text-red-700"
          >
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
    </div>
  );
};
