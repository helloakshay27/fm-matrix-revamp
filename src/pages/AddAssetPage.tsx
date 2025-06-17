
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
                  <Label htmlFor="assetName">Asset Name*</Label>
                  <Input placeholder="Enter Text" />
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="iex-gdam" id="iex-gdam" />
                      <Label htmlFor="iex-gdam" className="text-sm">IEX-GDAM</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ht" id="ht" />
                      <Label htmlFor="ht" className="text-sm">HT</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vcb" id="vcb" />
                      <Label htmlFor="vcb" className="text-sm">VCB</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transformer" id="transformer" />
                      <Label htmlFor="transformer" className="text-sm">Transformer</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg text-center">
                  <RadioGroup>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lt" id="lt" />
                      <Label htmlFor="lt" className="text-sm">LT</Label>
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
              <Button 
                style={{ backgroundColor: '#C72030' }}
                className="text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Measure
              </Button>
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
              <Button 
                style={{ backgroundColor: '#C72030' }}
                className="text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Measure
              </Button>
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
                      onChange={(e) => handleFileUpload('manualsUpload', e.target.files)}
                      className="hidden"
                      id="manuals-upload"
                    />
                    <label htmlFor="manuals-upload" className="cursor-pointer">
                      <span className="text-[#C72030]">Choose File</span>
                      <span className="text-gray-500 ml-2">No file chosen</span>
                    </label>
                    {attachments.manualsUpload.length > 0 && (
                      <div className="mt-2">
                        {attachments.manualsUpload.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mt-1">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile('manualsUpload', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
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
                      onChange={(e) => handleFileUpload('insuranceDetails', e.target.files)}
                      className="hidden"
                      id="insurance-upload"
                    />
                    <label htmlFor="insurance-upload" className="cursor-pointer">
                      <span className="text-[#C72030]">Choose File</span>
                      <span className="text-gray-500 ml-2">No file chosen</span>
                    </label>
                    {attachments.insuranceDetails.length > 0 && (
                      <div className="mt-2">
                        {attachments.insuranceDetails.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mt-1">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile('insuranceDetails', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
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
                      onChange={(e) => handleFileUpload('purchaseInvoice', e.target.files)}
                      className="hidden"
                      id="invoice-upload"
                    />
                    <label htmlFor="invoice-upload" className="cursor-pointer">
                      <span className="text-[#C72030]">Choose File</span>
                      <span className="text-gray-500 ml-2">No file chosen</span>
                    </label>
                    {attachments.purchaseInvoice.length > 0 && (
                      <div className="mt-2">
                        {attachments.purchaseInvoice.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mt-1">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile('purchaseInvoice', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
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
                      onChange={(e) => handleFileUpload('amc', e.target.files)}
                      className="hidden"
                      id="amc-upload"
                    />
                    <label htmlFor="amc-upload" className="cursor-pointer">
                      <span className="text-[#C72030]">Choose File</span>
                      <span className="text-gray-500 ml-2">No file chosen</span>
                    </label>
                    {attachments.amc.length > 0 && (
                      <div className="mt-2">
                        {attachments.amc.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mt-1">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFile('amc', index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2">
                      <Button
                        size="sm"
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
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
