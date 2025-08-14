
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DynamicFormField } from '@/components/DynamicFormField';
import { useDynamicAssetForm } from '@/hooks/useDynamicAssetForm';
import { FormDataPreview } from '@/components/FormDataPreview';

export const AddAssetDashboard = () => {
  const navigate = useNavigate();
  const [locationExpanded, setLocationExpanded] = useState(true);
  const [assetExpanded, setAssetExpanded] = useState(true);
  const [warrantyExpanded, setWarrantyExpanded] = useState(false);
  const [meterCategoryExpanded, setMeterCategoryExpanded] = useState(false);
  const [consumptionExpanded, setConsumptionExpanded] = useState(false);
  const [nonConsumptionExpanded, setNonConsumptionExpanded] = useState(false);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(false);

  // Basic asset form data
  const [assetData, setAssetData] = useState({
    name: '',
    category: '',
    asset_type: 'Fixed',
    asset_no: '',
    model_no: '',
    serial_no: '',
    purchase_cost: '',
    // ... other basic fields
  });

  // Dynamic form hook for category-specific fields
  const {
    selectedCategory,
    extraFieldsData,
    expandedSections,
    handleCategoryChange,
    toggleSection,
    handleFieldChange,
    generateExtraFieldsAttributes,
    getCategoryConfig,
    hasCustomFields
  } = useDynamicAssetForm();

  const handleAssetDataChange = (field: string, value: string) => {
    setAssetData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Handle category change for dynamic fields
    if (field === 'category') {
      handleCategoryChange(value);
    }
  };

  const handleSaveAndShow = () => {
    const payload = {
      asset: {
        ...assetData,
        extra_fields_attributes: generateExtraFieldsAttributes()
      }
    };
    console.log('Save and show details - Payload:', payload);
  };

  const handleSaveAndCreate = () => {
    const payload = {
      asset: {
        ...assetData,
        extra_fields_attributes: generateExtraFieldsAttributes()
      }
    };
    console.log('Save and create new asset - Payload:', payload);
  };

  return (
    <div className="p-6 mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">NEW ASSET</h1>
      </div>

      <div className="space-y-6">
        {/* Location Details */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-orange-500"
            onClick={() => setLocationExpanded(!locationExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-orange-600">
              <span className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                LOCATION DETAILS
              </span>
              {locationExpanded ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {locationExpanded && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            className="cursor-pointer bg-orange-50 border-l-4 border-l-orange-500"
            onClick={() => setAssetExpanded(!assetExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-orange-600">
              <span className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                ASSET DETAILS
              </span>
              {assetExpanded ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {assetExpanded && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="assetName">Asset Name*</Label>
                  <Input 
                    placeholder="Enter Text" 
                    value={assetData.name}
                    onChange={(e) => handleAssetDataChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="assetNo">Asset No.*</Label>
                  <Input 
                    placeholder="Enter Number" 
                    value={assetData.asset_no}
                    onChange={(e) => handleAssetDataChange('asset_no', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="modelNo">Model No.</Label>
                  <Input 
                    placeholder="Enter Number" 
                    value={assetData.model_no}
                    onChange={(e) => handleAssetDataChange('model_no', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="equipmentId">Equipment ID*</Label>
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
                  <Input 
                    placeholder="Enter Numeric value" 
                    value={assetData.purchase_cost}
                    onChange={(e) => handleAssetDataChange('purchase_cost', e.target.value)}
                  />
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
                <div>
                  <Label htmlFor="expiryDate">Expiry date</Label>
                  <Input type="date" placeholder="Select Date" />
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
                  <Label htmlFor="category">Category*</Label>
                  <Select value={assetData.category} onValueChange={(value) => handleAssetDataChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Land">Land</SelectItem>
                      <SelectItem value="Building">Building</SelectItem>
                      <SelectItem value="Leasehold Improvement">Leasehold Improvement</SelectItem>
                      <SelectItem value="Vehicle">Vehicle</SelectItem>
                      <SelectItem value="Machinery">Machinery</SelectItem>
                      <SelectItem value="IT Assets">IT Assets</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input placeholder="Select Date" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
                  <RadioGroup defaultValue="yes" className="flex gap-6 mt-2">
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
            className="cursor-pointer bg-orange-50 border-l-4 border-l-orange-500"
            onClick={() => setWarrantyExpanded(!warrantyExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-orange-600">
              <span className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Warranty Details
              </span>
              {warrantyExpanded ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {warrantyExpanded && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <Label className="text-sm font-medium">Under Warranty</Label>
                  <RadioGroup defaultValue="yes" className="flex gap-6 mt-2">
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
            className="cursor-pointer bg-orange-50 border-l-4 border-l-orange-500"
            onClick={() => setMeterCategoryExpanded(!meterCategoryExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-orange-600">
              <span className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Meter Category Type
              </span>
              {meterCategoryExpanded ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
          {meterCategoryExpanded && (
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="board" id="board" />
                      <Label htmlFor="board" className="text-sm">Board</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dg" id="dg" />
                      <Label htmlFor="dg" className="text-sm">DG</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="renewable" id="renewable" />
                      <Label htmlFor="renewable" className="text-sm">Renewable</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fresh-water" id="fresh-water" />
                      <Label htmlFor="fresh-water" className="text-sm">Fresh Water</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recycled" id="recycled" />
                      <Label htmlFor="recycled" className="text-sm">Recycled</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="iex-gdam" id="iex-gdam" />
                      <Label htmlFor="iex-gdam" className="text-sm">IEX-GDAM</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Consumption Asset Measure */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-orange-500"
            onClick={() => setConsumptionExpanded(!consumptionExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-orange-600">
              <span className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                CONSUMPTION ASSET MEASURE
              </span>
              {consumptionExpanded ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Non Consumption Asset Measure */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-orange-500"
            onClick={() => setNonConsumptionExpanded(!nonConsumptionExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-orange-600">
              <span className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                NON CONSUMPTION ASSET MEASURE
              </span>
              {nonConsumptionExpanded ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Dynamic Category-Specific Fields */}
        {hasCustomFields() && getCategoryConfig().map((section, sectionIndex) => {
          const sectionKey = `${selectedCategory}-${sectionIndex}`;
          return (
            <Card key={sectionKey}>
              <CardHeader 
                className="cursor-pointer bg-blue-50 border-l-4 border-l-blue-500"
                onClick={() => toggleSection(sectionKey)}
              >
                <CardTitle className="flex items-center justify-between text-blue-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {sectionIndex + 8}
                    </span>
                    {section.title.toUpperCase()}
                  </span>
                  {expandedSections[sectionKey] ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
              {expandedSections[sectionKey] && (
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {section.fields.map((field) => (
                      <DynamicFormField
                        key={field.name}
                        field={field}
                        value={extraFieldsData[field.name] || ''}
                        onChange={(value) => handleFieldChange(field.name, value)}
                      />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* Attachments */}
        <Card>
          <CardHeader 
            className="cursor-pointer bg-orange-50 border-l-4 border-l-orange-500"
            onClick={() => setAttachmentsExpanded(!attachmentsExpanded)}
          >
            <CardTitle className="flex items-center justify-between text-orange-600">
              <span className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">7</span>
                ATTACHMENTS
              </span>
              {attachmentsExpanded ? <ChevronUp /> : <ChevronDown />}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Development Preview */}
        <FormDataPreview 
          assetData={assetData}
          extraFieldsAttributes={generateExtraFieldsAttributes()}
        />

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button 
            variant="outline" 
            onClick={handleSaveAndShow}
            className="px-8"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreate}
            className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white px-8"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};
