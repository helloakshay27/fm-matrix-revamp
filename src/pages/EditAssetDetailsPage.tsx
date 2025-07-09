
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ChevronDown, ChevronUp, Plus, X, MapPin, Package, Shield, Activity, TrendingUp, BarChart, Paperclip } from 'lucide-react';

export const EditAssetDetailsPage = () => {
  const { id } = useParams();
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

  const getMeterCategoryOptions = () => [{
    value: 'board',
    label: 'Board'
  }, {
    value: 'dg',
    label: 'DG'
  }, {
    value: 'renewable',
    label: 'Renewable'
  }, {
    value: 'fresh-water',
    label: 'Fresh Water'
  }, {
    value: 'recycled',
    label: 'Recycled'
  }, {
    value: 'iex-gdam',
    label: 'IEX-GDAM'
  }];

  const getSubCategoryOptions = () => {
    switch (meterCategoryType) {
      case 'board':
        return [{
          value: 'ht',
          label: 'HT'
        }, {
          value: 'vcb',
          label: 'VCB'
        }, {
          value: 'transformer',
          label: 'Transformer'
        }, {
          value: 'lt',
          label: 'LT'
        }];
      case 'renewable':
        return [{
          value: 'solar',
          label: 'Solar'
        }, {
          value: 'bio-methanol',
          label: 'Bio Methanol'
        }, {
          value: 'wind',
          label: 'Wind'
        }];
      case 'fresh-water':
        return [{
          value: 'source',
          label: 'Source (Input)'
        }, {
          value: 'destination',
          label: 'Destination (Output)'
        }];
      default:
        return [];
    }
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              Asset List
            </button>
            <span>&gt;</span>
            <span className="text-gray-900 font-medium">Edit Asset</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EDIT ASSET</h1>
        </div>

        <div className="space-y-6">
          {/* Location Details */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div 
              onClick={() => toggleSection('location')} 
              className="cursor-pointer border-l-4 border-l-[#C72030] p-6 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-2 text-[#C72030] text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  <MapPin className="w-4 h-4" />
                </span>
                LOCATION DETAILS
              </div>
              {expandedSections.location ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.location && (
              <div className="p-6 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
                  {['Site', 'Building', 'Wing', 'Area', 'Floor'].map(label => (
                    <div key={label} className="space-y-2">
                      <Label htmlFor={label.toLowerCase()}>{label}</Label>
                      <Select 
                        value={locationData[label.toLowerCase()] || ''} 
                        onValueChange={(value) => handleLocationChange(label.toLowerCase(), value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={`${label.toLowerCase()}1`}>{label} 1</SelectItem>
                          <SelectItem value={`${label.toLowerCase()}2`}>{label} 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Select 
                      value={locationData.room || ''} 
                      onValueChange={(value) => handleLocationChange('room', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room1">Room 1</SelectItem>
                        <SelectItem value="room2">Room 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Asset Details */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div 
              onClick={() => toggleSection('asset')} 
              className="cursor-pointer border-l-4 border-l-[#C72030] p-6 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-2 text-[#C72030] text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  <Package className="w-4 h-4" />
                </span>
                ASSET DETAILS
              </div>
              {expandedSections.asset ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.asset && (
              <div className="p-6 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="assetName">Asset Name *</Label>
                    <Input
                      id="assetName"
                      placeholder="Enter Name"
                      value={formData.assetName}
                      onChange={(e) => handleInputChange('assetName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assetNo">Asset No. *</Label>
                    <Input
                      id="assetNo"
                      placeholder="Enter Number"
                      value={formData.assetNo}
                      onChange={(e) => handleInputChange('assetNo', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equipmentId">Equipment ID *</Label>
                    <Input
                      id="equipmentId"
                      placeholder="Enter Number"
                      value={formData.equipmentId}
                      onChange={(e) => handleInputChange('equipmentId', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="modelNo">Model No.</Label>
                    <Input
                      id="modelNo"
                      placeholder="Enter Number"
                      value={formData.modelNo}
                      onChange={(e) => handleInputChange('modelNo', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNo">Serial No.</Label>
                    <Input
                      id="serialNo"
                      placeholder="Enter Number"
                      value={formData.serialNo}
                      onChange={(e) => handleInputChange('serialNo', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consumerNo">Consumer No.</Label>
                    <Input
                      id="consumerNo"
                      placeholder="Enter Number"
                      value={formData.consumerNo}
                      onChange={(e) => handleInputChange('consumerNo', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseCost">Purchase Cost *</Label>
                    <Input
                      id="purchaseCost"
                      type="number"
                      placeholder="Enter Numeric value"
                      value={formData.purchaseCost}
                      onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      placeholder="Enter Text"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      placeholder="Enter Text"
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="group">Group</Label>
                    <Select 
                      value={formData.group} 
                      onValueChange={(value) => handleInputChange('group', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Mechanical">Mechanical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subgroup">Subgroup</Label>
                    <Select 
                      value={formData.subgroup} 
                      onValueChange={(value) => handleInputChange('subgroup', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subgroup" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electric Meter">Electric Meter</SelectItem>
                        <SelectItem value="Water Meter">Water Meter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchased ON Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      placeholder="Enter Text"
                      value={formData.manufacturer}
                      onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                  {[
                    {
                      label: 'Location Type',
                      name: 'locationType',
                      options: [
                        { value: 'common-area', label: 'Common Area' },
                        { value: 'customer', label: 'Customer' },
                        { value: 'na', label: 'NA' }
                      ]
                    },
                    {
                      label: 'Asset Type',
                      name: 'assetType',
                      options: [
                        { value: 'parent', label: 'Parent' },
                        { value: 'sub', label: 'Sub' }
                      ]
                    },
                    {
                      label: 'Status',
                      name: 'status',
                      options: [
                        { value: 'in-use', label: 'In Use' },
                        { value: 'breakdown', label: 'Breakdown' }
                      ]
                    },
                    {
                      label: 'Critical',
                      name: 'critical',
                      options: [
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' }
                      ]
                    }
                  ].map(field => (
                    <div key={field.name} className="space-y-3">
                      <Label className="text-sm font-medium">{field.label}</Label>
                      <RadioGroup
                        value={formData[field.name]}
                        onValueChange={(value) => handleInputChange(field.name, value)}
                        className="flex flex-wrap gap-6"
                      >
                        {field.options.map(option => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value={option.value} 
                              id={`${field.name}-${option.value}`}
                              className="border-gray-300 text-[#C72030]"
                            />
                            <Label htmlFor={`${field.name}-${option.value}`} className="text-sm cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="meterApplicable"
                    checked={formData.meterApplicable}
                    onCheckedChange={(checked) => handleInputChange('meterApplicable', checked)}
                    className="border-gray-300 text-[#C72030]"
                  />
                  <Label htmlFor="meterApplicable" className="text-sm cursor-pointer">
                    Meter Applicable
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Warranty Details */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div 
              onClick={() => toggleSection('warranty')} 
              className="cursor-pointer border-l-4 border-l-[#C72030] p-6 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-2 text-[#C72030] text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  <Shield className="w-4 h-4" />
                </span>
                WARRANTY DETAILS
              </div>
              {expandedSections.warranty ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.warranty && (
              <div className="p-6 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Under Warranty</Label>
                    <RadioGroup
                      value={formData.underWarranty}
                      onValueChange={(value) => handleInputChange('underWarranty', value)}
                      className="flex gap-6"
                    >
                      {[
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' }
                      ].map(option => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option.value} 
                            id={`warranty-${option.value}`}
                            className="border-gray-300 text-[#C72030]"
                          />
                          <Label htmlFor={`warranty-${option.value}`} className="text-sm cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyStartDate">Warranty Start Date</Label>
                    <Input
                      id="warrantyStartDate"
                      type="date"
                      value={formData.warrantyStartDate}
                      onChange={(e) => handleInputChange('warrantyStartDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiresOn">Warranty expires on</Label>
                    <Input
                      id="warrantyExpiresOn"
                      type="date"
                      value={formData.warrantyExpiresOn}
                      onChange={(e) => handleInputChange('warrantyExpiresOn', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commissioningDate">Commissioning Date</Label>
                    <Input
                      id="commissioningDate"
                      type="date"
                      value={formData.commissioningDate}
                      onChange={(e) => handleInputChange('commissioningDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Meter Category Type */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div 
              onClick={() => toggleSection('meterCategory')} 
              className="cursor-pointer border-l-4 border-l-[#C72030] p-6 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-2 text-[#C72030] text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  <Activity className="w-4 h-4" />
                </span>
                METER CATEGORY TYPE
              </div>
              {expandedSections.meterCategory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.meterCategory && (
              <div className="p-6 border-t">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  {getMeterCategoryOptions().map(option => (
                    <div key={option.value} className="p-4 rounded-lg text-center bg-[#f6f4ee]">
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
                        <label htmlFor={option.value} className="text-sm cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {getSubCategoryOptions().length > 0 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {getSubCategoryOptions().map(option => (
                        <div key={option.value} className="bg-purple-100 p-4 rounded-lg text-center">
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
                            <label htmlFor={`sub-${option.value}`} className="text-sm cursor-pointer">
                              {option.label}
                            </label>
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
              onClick={() => toggleSection('consumption')} 
              className="cursor-pointer border-l-4 border-l-[#C72030] p-6 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-2 text-[#C72030] text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  <TrendingUp className="w-4 h-4" />
                </span>
                CONSUMPTION ASSET MEASURE
              </div>
              {expandedSections.consumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.consumption && (
              <div className="p-6 border-t">
                <div className="space-y-6">
                  {consumptionMeasures.map(measure => (
                    <div key={measure.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-medium text-gray-700 text-base">Consumption Asset Measure</h4>
                        {consumptionMeasures.length > 1 && (
                          <button
                            onClick={() => removeConsumptionMeasure(measure.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${measure.id}`}>Name</Label>
                          <Input
                            id={`name-${measure.id}`}
                            placeholder="Enter Text"
                            value={measure.name}
                            onChange={(e) => updateConsumptionMeasure(measure.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`min-${measure.id}`}>Min</Label>
                          <Input
                            id={`min-${measure.id}`}
                            type="number"
                            placeholder="Enter Number"
                            value={measure.min}
                            onChange={(e) => updateConsumptionMeasure(measure.id, 'min', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`max-${measure.id}`}>Max</Label>
                          <Input
                            id={`max-${measure.id}`}
                            type="number"
                            placeholder="Enter Number"
                            value={measure.max}
                            onChange={(e) => updateConsumptionMeasure(measure.id, 'max', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`alertBelow-${measure.id}`}>Alert Below Val.</Label>
                          <Input
                            id={`alertBelow-${measure.id}`}
                            type="number"
                            placeholder="Enter Value"
                            value={measure.alertBelowVal}
                            onChange={(e) => updateConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`unitType-${measure.id}`}>Unit Type</Label>
                          <Select 
                            value={measure.unitType} 
                            onValueChange={(value) => updateConsumptionMeasure(measure.id, 'unitType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Unit Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kwh">kWh</SelectItem>
                              <SelectItem value="liters">Liters</SelectItem>
                              <SelectItem value="cubic-meters">Cubic Meters</SelectItem>
                              <SelectItem value="units">Units</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor={`alertAbove-${measure.id}`}>Alert Above Val.</Label>
                          <Input
                            id={`alertAbove-${measure.id}`}
                            type="number"
                            placeholder="Enter Value"
                            value={measure.alertAboveVal}
                            onChange={(e) => updateConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`multiplier-${measure.id}`}>Multiplier Factor</Label>
                          <Input
                            id={`multiplier-${measure.id}`}
                            placeholder="Enter Text"
                            value={measure.multiplierFactor}
                            onChange={(e) => updateConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`checkPrevious-${measure.id}`}
                          checked={measure.checkPreviousReading}
                          onCheckedChange={(checked) => updateConsumptionMeasure(measure.id, 'checkPreviousReading', checked)}
                          className="border-gray-300 text-[#C72030]"
                        />
                        <Label htmlFor={`checkPrevious-${measure.id}`} className="text-sm cursor-pointer">
                          Check Previous Reading
                        </Label>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    onClick={addConsumptionMeasure}
                    variant="outline"
                    className="bg-[#f6f4ee] text-red-700 border-red-200 hover:bg-[#f0ebe0]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Measure
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Non Consumption Asset Measure */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div 
              onClick={() => toggleSection('nonConsumption')} 
              className="cursor-pointer border-l-4 border-l-[#C72030] p-6 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-2 text-[#C72030] text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  <BarChart className="w-4 h-4" />
                </span>
                NON CONSUMPTION ASSET MEASURE
              </div>
              {expandedSections.nonConsumption ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.nonConsumption && (
              <div className="p-6 border-t">
                <div className="space-y-6">
                  {nonConsumptionMeasures.map(measure => (
                    <div key={measure.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-medium text-gray-700 text-base">Non Consumption Asset Measure</h4>
                        {nonConsumptionMeasures.length > 1 && (
                          <button
                            onClick={() => removeNonConsumptionMeasure(measure.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor={`nc-name-${measure.id}`}>Name</Label>
                          <Input
                            id={`nc-name-${measure.id}`}
                            placeholder="Name"
                            value={measure.name}
                            onChange={(e) => updateNonConsumptionMeasure(measure.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`nc-min-${measure.id}`}>Min</Label>
                          <Input
                            id={`nc-min-${measure.id}`}
                            type="number"
                            placeholder="Min"
                            value={measure.min}
                            onChange={(e) => updateNonConsumptionMeasure(measure.id, 'min', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`nc-max-${measure.id}`}>Max</Label>
                          <Input
                            id={`nc-max-${measure.id}`}
                            type="number"
                            placeholder="Max"
                            value={measure.max}
                            onChange={(e) => updateNonConsumptionMeasure(measure.id, 'max', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`nc-alertBelow-${measure.id}`}>Alert Below Val.</Label>
                          <Input
                            id={`nc-alertBelow-${measure.id}`}
                            type="number"
                            placeholder="Alert Below Value"
                            value={measure.alertBelowVal}
                            onChange={(e) => updateNonConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`nc-unitType-${measure.id}`}>Unit Type</Label>
                          <Select 
                            value={measure.unitType} 
                            onValueChange={(value) => updateNonConsumptionMeasure(measure.id, 'unitType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Unit Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="temperature">Temperature</SelectItem>
                              <SelectItem value="pressure">Pressure</SelectItem>
                              <SelectItem value="voltage">Voltage</SelectItem>
                              <SelectItem value="current">Current</SelectItem>
                              <SelectItem value="frequency">Frequency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor={`nc-alertAbove-${measure.id}`}>Alert Above Val.</Label>
                          <Input
                            id={`nc-alertAbove-${measure.id}`}
                            type="number"
                            placeholder="Alert Above Value"
                            value={measure.alertAboveVal}
                            onChange={(e) => updateNonConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`nc-multiplier-${measure.id}`}>Multiplier Factor</Label>
                          <Input
                            id={`nc-multiplier-${measure.id}`}
                            placeholder="Multiplier Factor"
                            value={measure.multiplierFactor}
                            onChange={(e) => updateNonConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`nc-checkPrevious-${measure.id}`}
                          checked={measure.checkPreviousReading}
                          onCheckedChange={(checked) => updateNonConsumptionMeasure(measure.id, 'checkPreviousReading', checked)}
                          className="border-gray-300 text-[#C72030]"
                        />
                        <Label htmlFor={`nc-checkPrevious-${measure.id}`} className="text-sm cursor-pointer">
                          Check Previous Reading
                        </Label>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    onClick={addNonConsumptionMeasure}
                    variant="outline"
                    className="bg-[#f6f4ee] text-orange-700 border-orange-200 hover:bg-[#f0ebe0]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Measure
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div 
              onClick={() => toggleSection('attachments')} 
              className="cursor-pointer border-l-4 border-l-[#C72030] p-6 flex justify-between items-center bg-white"
            >
              <div className="flex items-center gap-2 text-[#C72030] text-base font-semibold">
                <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  <Paperclip className="w-4 h-4" />
                </span>
                ATTACHMENTS
              </div>
              {expandedSections.attachments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            {expandedSections.attachments && (
              <div className="p-6 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    {
                      label: 'Manuals Upload',
                      id: 'manuals-upload',
                      category: 'manualsUpload',
                      accept: '.pdf,.doc,.docx,.txt'
                    },
                    {
                      label: 'Insurance Details',
                      id: 'insurance-upload',
                      category: 'insuranceDetails',
                      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                    },
                    {
                      label: 'Purchase Invoice',
                      id: 'invoice-upload',
                      category: 'purchaseInvoice',
                      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                    },
                    {
                      label: 'AMC',
                      id: 'amc-upload',
                      category: 'amc',
                      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                    }
                  ].map(field => (
                    <div key={field.id}>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">{field.label}</Label>
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
                            <span className="text-[#C72030] font-medium text-sm">Choose File</span>
                            <span className="text-gray-500 text-sm">
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
                                <span className="text-sm truncate">{file.name}</span>
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
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="bg-[#f6f4ee] text-[#C72030] border-red-200 hover:bg-[#f0ebe0]"
                              asChild
                            >
                              <span className="flex items-center cursor-pointer">
                                <Plus className="w-4 h-4 mr-2" />
                                Upload Files
                              </span>
                            </Button>
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
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Button
              onClick={handleSaveAndShowDetails}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-8 py-2"
            >
              Save & Show Details
            </Button>
            <Button
              onClick={handleSaveAndCreateNew}
              className="bg-[#f6f4ee] text-red-700 hover:bg-[#f0ebe0] px-8 py-2"
            >
              Save & Create New Asset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
