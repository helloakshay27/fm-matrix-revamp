import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, X, Plus } from 'lucide-react';
import { TextField } from '@mui/material';

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Asset List</span>
          <span>&gt;</span>
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
                  <Label htmlFor="site">Site*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site1">Site 1</SelectItem>
                      <SelectItem value="site2">Site 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="building">Building</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Building" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building1">Building 1</SelectItem>
                      <SelectItem value="building2">Building 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="wing">Wing</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Wing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wing1">Wing 1</SelectItem>
                      <SelectItem value="wing2">Wing 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="area1">Area 1</SelectItem>
                      <SelectItem value="area2">Area 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="floor1">Floor 1</SelectItem>
                      <SelectItem value="floor2">Floor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="room">Room</Label>
                  <Select>
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
    placeholder="Hello World"
    name="assetName"
    fullWidth
    variant="outlined"
    InputLabelProps={{
      shrink: true, // Prevent label from floating
    }}
    InputProps={{
      sx: {
        height: 56, // default height when shrink is true
        '& input': {
          padding: '14px', // vertical alignment
        },
      },
    }}
  />
</div>
                <div>
                  <Label htmlFor="assetNo">Asset No.*</Label>
                  <Input placeholder="Enter Number" />
                </div>
                <div>
                  <Label htmlFor="equipmentId">Equipment ID*</Label>
                  <Input placeholder="Enter Number" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="modelNo">Model No.</Label>
                  <Input placeholder="Enter Number" />
                </div>
                <div>
                  <Label htmlFor="serialNo">Serial No.</Label>
                  <Input placeholder="Enter Number" />
                </div>
                <div>
                  <Label htmlFor="consumerNo">Consumer No.</Label>
                  <Input placeholder="Enter Number" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="purchaseCost">Purchase Cost*</Label>
                  <Input placeholder="Enter Numeric value" />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input placeholder="Enter Text" />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Input placeholder="Enter Text" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="group">Group*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group1">Group 1</SelectItem>
                      <SelectItem value="group2">Group 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subgroup">Subgroup*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SubGroup" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subgroup1">SubGroup 1</SelectItem>
                      <SelectItem value="subgroup2">SubGroup 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="purchaseDate">Purchased ON Date</Label>
                  <Input type="date" placeholder="Select Date" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="expiryDate">Expiry date</Label>
                  <Input type="date" placeholder="Select Date" />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input placeholder="Enter Text" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-sm font-medium">Location Type</Label>
                  <RadioGroup defaultValue="common" className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="common" id="common" />
                      <Label htmlFor="common">Common Area</Label>
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
                <div>
                  <Label className="text-sm font-medium">Asset Type</Label>
                  <RadioGroup defaultValue="parent" className="flex gap-6 mt-2">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <RadioGroup defaultValue="inuse" className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inuse" id="inuse" />
                      <Label htmlFor="inuse">In Use</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="breakdown" id="breakdown" />
                      <Label htmlFor="breakdown">Breakdown</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-sm font-medium">Critical</Label>
                  <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
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
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="meterApplicable" />
                <Label htmlFor="meterApplicable">Meter Applicable</Label>
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
                  <Label className="text-sm font-medium">Under Warranty</Label>
                  <RadioGroup defaultValue="no" className="flex gap-6 mt-2">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="warrantyStart">Warranty Start Date</Label>
                  <Input type="date" placeholder="Select Date" />
                </div>
                <div>
                  <Label htmlFor="warrantyExpires">Warranty expires on</Label>
                  <Input type="date" placeholder="Select Date" />
                </div>
                <div>
                  <Label htmlFor="commissioningDate">Commissioning Date</Label>
                  <Input type="date" placeholder="Select Date" />
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
                      <Label htmlFor={option.value} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sub-category options based on selected main category */}
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
                          <Label htmlFor={`sub-${option.value}`} className="text-sm cursor-pointer">
                            {option.label}
                          </Label>
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
                        <Label htmlFor={`name-${measure.id}`}>Name</Label>
                        <Input
                          id={`name-${measure.id}`}
                          placeholder="Enter Text"
                          value={measure.name}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
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
                      <div>
                        <Label htmlFor={`min-${measure.id}`}>Min</Label>
                        <Input
                          id={`min-${measure.id}`}
                          placeholder="Enter Number"
                          type="number"
                          value={measure.min}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'min', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`max-${measure.id}`}>Max</Label>
                        <Input
                          id={`max-${measure.id}`}
                          placeholder="Enter Number"
                          type="number"
                          value={measure.max}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'max', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`alertBelow-${measure.id}`}>Alert Below Val.</Label>
                        <Input
                          id={`alertBelow-${measure.id}`}
                          placeholder="Enter Value"
                          type="number"
                          value={measure.alertBelowVal}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`alertAbove-${measure.id}`}>Alert Above Val.</Label>
                        <Input
                          id={`alertAbove-${measure.id}`}
                          placeholder="Enter Value"
                          type="number"
                          value={measure.alertAboveVal}
                          onChange={(e) => updateConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                        />
                      </div>
                      <div>
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
                      />
                      <Label htmlFor={`checkPrevious-${measure.id}`}>Check Previous Reading</Label>
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
                        <Label htmlFor={`nc-name-${measure.id}`}>Name</Label>
                        <Input
                          id={`nc-name-${measure.id}`}
                          placeholder="Name"
                          value={measure.name}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'name', e.target.value)}
                        />
                      </div>
                      <div>
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
                      <div>
                        <Label htmlFor={`nc-min-${measure.id}`}>Min</Label>
                        <Input
                          id={`nc-min-${measure.id}`}
                          placeholder="Min"
                          type="number"
                          value={measure.min}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'min', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`nc-max-${measure.id}`}>Max</Label>
                        <Input
                          id={`nc-max-${measure.id}`}
                          placeholder="Max"
                          type="number"
                          value={measure.max}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'max', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`nc-alertBelow-${measure.id}`}>Alert Below Val.</Label>
                        <Input
                          id={`nc-alertBelow-${measure.id}`}
                          placeholder="Alert Below Value"
                          type="number"
                          value={measure.alertBelowVal}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label htmlFor={`nc-alertAbove-${measure.id}`}>Alert Above Val.</Label>
                        <Input
                          id={`nc-alertAbove-${measure.id}`}
                          placeholder="Alert Above Value"
                          type="number"
                          value={measure.alertAboveVal}
                          onChange={(e) => updateNonConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                        />
                      </div>
                      <div>
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
                      />
                      <Label htmlFor={`nc-checkPrevious-${measure.id}`}>Check Previous Reading</Label>
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
                  <Label className="text-sm font-medium mb-2 block">Manuals Upload</Label>
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
                  <Label className="text-sm font-medium mb-2 block">Insurance Details</Label>
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
                  <Label className="text-sm font-medium mb-2 block">Purchase Invoice</Label>
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
                  <Label className="text-sm font-medium mb-2 block">AMC</Label>
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
