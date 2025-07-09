
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const EditAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    asset: true,
    itAssets: true,
    meter: true,
    purchase: true,
    depreciation: true,
    allocation: true,
    loaned: true,
    amc: true,
    attachments: true
  });

  const [formData, setFormData] = useState({
    // Location Details
    site: 'Lockated',
    building: 'sebc',
    wing: '',
    area: '',
    floor: '',
    room: '',
    
    // Asset Details
    assetName: 'sdcsdc',
    modelNo: 'tested',
    manufacturer: '',
    group: 'Electrical',
    subgroup: 'Electric Meter',
    status: 'in-use',
    
    // IT Assets Details
    os: '',
    totalMemory: '',
    processor: '',
    model: '',
    serialNo: 'sdcsdc',
    capacity: '10',
    
    // Meter Details
    meterType: 'parent',
    critical: 'yes',
    meterCategory: '',
    
    // Purchase Details
    purchaseCost: '0.0',
    purchaseDate: '2024-05-26',
    warrantyExpires: '',
    underWarranty: 'yes',
    
    // Depreciation Rule
    method: 'straight-line',
    usefulLife: '',
    salvageValue: '',
    depreciationRate: '',
    
    // Asset Allocation
    basedOn: 'department',
    department: '',
    
    // Asset Loaned
    vendorName: '',
    agreementStartDate: '',
    agreementEndDate: '',
    
    // AMC Details
    vendor: '',
    startDate: '',
    endDate: '',
    paymentTerms: '',
    amcCost: '',
    
    // Attachments
    manualsUpload: [],
    insuranceDetails: [],
    purchaseInvoice: [],
    amc: []
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigate(`/maintenance/asset/details/${id}`);
  };

  const handleSaveAndShowDetails = () => {
    console.log('Saving and showing details:', formData);
    navigate(`/maintenance/asset/details/${id}`);
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new:', formData);
    navigate('/maintenance/asset/add');
  };

  const SectionHeader = ({ 
    title, 
    sectionKey, 
    number, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    number: number;
    children?: React.ReactNode;
  }) => (
    <CardHeader 
      className="cursor-pointer border-l-4 border-l-red-600 bg-white p-4 flex flex-row items-center justify-between"
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex items-center gap-3">
        <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
          {number}
        </div>
        <h3 className="text-red-600 font-semibold text-sm uppercase tracking-wide">
          {title}
        </h3>
        {children}
      </div>
      {expandedSections[sectionKey] ? 
        <ChevronUp className="w-5 h-5 text-gray-400" /> : 
        <ChevronDown className="w-5 h-5 text-gray-400" />
      }
    </CardHeader>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
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

      <div className="space-y-4">
        {/* Location Details */}
        <Card className="shadow-sm">
          <SectionHeader title="Location Details" sectionKey="location" number={1} />
          {expandedSections.location && (
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <Label htmlFor="site">Site</Label>
                  <Select value={formData.site} onValueChange={(value) => handleInputChange('site', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lockated">Lockated</SelectItem>
                      <SelectItem value="site2">Site 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="building">Building</Label>
                  <Select value={formData.building} onValueChange={(value) => handleInputChange('building', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Building" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sebc">SEBC</SelectItem>
                      <SelectItem value="building2">Building 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="wing">Wing</Label>
                  <Select value={formData.wing} onValueChange={(value) => handleInputChange('wing', value)}>
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
                  <Select value={formData.area} onValueChange={(value) => handleInputChange('area', value)}>
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
                  <Select value={formData.floor} onValueChange={(value) => handleInputChange('floor', value)}>
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="room">Room</Label>
                  <Select value={formData.room} onValueChange={(value) => handleInputChange('room', value)}>
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
        <Card className="shadow-sm">
          <SectionHeader title="Asset Details" sectionKey="asset" number={2}>
            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
              + Custom Field
            </Button>
          </SectionHeader>
          {expandedSections.asset && (
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="assetName">Asset Name *</Label>
                  <Input
                    id="assetName"
                    placeholder="Enter Asset Name"
                    value={formData.assetName}
                    onChange={(e) => handleInputChange('assetName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="modelNo">Model No. *</Label>
                  <Input
                    id="modelNo"
                    placeholder="Enter Model No"
                    value={formData.modelNo}
                    onChange={(e) => handleInputChange('modelNo', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    placeholder="Enter Manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="group">Group</Label>
                  <Select value={formData.group} onValueChange={(value) => handleInputChange('group', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electrical">Electrical</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subgroup">Sub-Group</Label>
                  <Select value={formData.subgroup} onValueChange={(value) => handleInputChange('subgroup', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sub-Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electric Meter">Electric Meter</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mb-4">
                <Label className="text-sm font-medium">Status</Label>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-use" id="in-use" />
                    <Label htmlFor="in-use">In Use</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="breakdown" id="breakdown" />
                    <Label htmlFor="breakdown">Breakdown</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          )}
        </Card>

        {/* IT Assets Details */}
        <Card className="shadow-sm">
          <SectionHeader title="IT Assets Details" sectionKey="itAssets" number={3}>
            <div className="flex items-center gap-2">
              <span className="text-sm">If Applicable</span>
              <Checkbox 
                checked={true}
                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                + Custom Field
              </Button>
            </div>
          </SectionHeader>
          {expandedSections.itAssets && (
            <CardContent className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-4">SYSTEM DETAILS</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="os">OS</Label>
                    <Input
                      id="os"
                      placeholder="Enter OS"
                      value={formData.os}
                      onChange={(e) => handleInputChange('os', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalMemory">Total Memory</Label>
                    <Input
                      id="totalMemory"
                      placeholder="Enter Total Memory"
                      value={formData.totalMemory}
                      onChange={(e) => handleInputChange('totalMemory', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="processor">Processor</Label>
                    <Input
                      id="processor"
                      placeholder="Enter Processor"
                      value={formData.processor}
                      onChange={(e) => handleInputChange('processor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-4">HARD DISK DETAILS</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="Enter Model"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="serialNo">Serial No.</Label>
                    <Input
                      id="serialNo"
                      placeholder="Enter Serial No"
                      value={formData.serialNo}
                      onChange={(e) => handleInputChange('serialNo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      placeholder="Enter Capacity"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Meter Details */}
        <Card className="shadow-sm">
          <SectionHeader title="Meter Details" sectionKey="meter" number={4}>
            <div className="flex items-center gap-2">
              <span className="text-sm">If Applicable</span>
              <Checkbox 
                checked={true}
                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
            </div>
          </SectionHeader>
          {expandedSections.meter && (
            <CardContent className="p-6">
              <div className="mb-6">
                <Label className="text-sm font-medium">Meter Type</Label>
                <RadioGroup
                  value={formData.meterType}
                  onValueChange={(value) => handleInputChange('meterType', value)}
                  className="flex gap-6 mt-2"
                >
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

              <div className="mb-6">
                <Label className="text-sm font-medium">CRITICAL</Label>
                <RadioGroup
                  value={formData.critical}
                  onValueChange={(value) => handleInputChange('critical', value)}
                  className="flex gap-6 mt-2"
                >
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

              <div>
                <h4 className="font-medium text-gray-700 mb-4">METER DETAILS</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { value: 'board', label: 'Board' },
                    { value: 'dg', label: 'DG' },
                    { value: 'renewable', label: 'Renewable' },
                    { value: 'fresh-water', label: 'Fresh Water' },
                    { value: 'recycled', label: 'Recycled' },
                    { value: 'iex-gdam', label: 'IEX-GDAM' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.value} 
                        id={option.value}
                        name="meterCategory"
                      />
                      <Label htmlFor={option.value} className="text-sm">{option.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Purchase Details */}
        <Card className="shadow-sm">
          <SectionHeader title="Purchase Details" sectionKey="purchase" number={5} />
          {expandedSections.purchase && (
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="purchaseCost">Purchase Cost *</Label>
                  <Input
                    id="purchaseCost"
                    placeholder="Enter Cost"
                    value={formData.purchaseCost}
                    onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="warrantyExpires">Warranty Expires On *</Label>
                  <Input
                    id="warrantyExpires"
                    type="date"
                    value={formData.warrantyExpires}
                    onChange={(e) => handleInputChange('warrantyExpires', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Under Warranty</Label>
                <RadioGroup
                  value={formData.underWarranty}
                  onValueChange={(value) => handleInputChange('underWarranty', value)}
                  className="flex gap-6 mt-2"
                >
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
            </CardContent>
          )}
        </Card>

        {/* Depreciation Rule */}
        <Card className="shadow-sm">
          <SectionHeader title="Depreciation Rule" sectionKey="depreciation" number={6}>
            <div className="flex items-center gap-2">
              <span className="text-sm">If Applicable</span>
              <Checkbox 
                checked={true}
                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
            </div>
          </SectionHeader>
          {expandedSections.depreciation && (
            <CardContent className="p-6">
              <div className="mb-6">
                <Label className="text-sm font-medium">Method</Label>
                <RadioGroup
                  value={formData.method}
                  onValueChange={(value) => handleInputChange('method', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="straight-line" id="straight-line" />
                    <Label htmlFor="straight-line">Straight Line</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wdv" id="wdv" />
                    <Label htmlFor="wdv">WDV</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="usefulLife">Useful Life *in years*</Label>
                  <Input
                    id="usefulLife"
                    placeholder="Enter Value"
                    value={formData.usefulLife}
                    onChange={(e) => handleInputChange('usefulLife', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="salvageValue">Salvage Value*</Label>
                  <Input
                    id="salvageValue"
                    placeholder="Enter Value"
                    value={formData.salvageValue}
                    onChange={(e) => handleInputChange('salvageValue', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="depreciationRate">Depreciation Rate*</Label>
                  <Input
                    id="depreciationRate"
                    placeholder="Enter Value"
                    value={formData.depreciationRate}
                    onChange={(e) => handleInputChange('depreciationRate', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="configure-depreciation" />
                <Label htmlFor="configure-depreciation" className="text-sm">
                  Configure Depreciation Only For This
                </Label>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Asset Allocation */}
        <Card className="shadow-sm">
          <SectionHeader title="Asset Allocation" sectionKey="allocation" number={7} />
          {expandedSections.allocation && (
            <CardContent className="p-6">
              <div className="mb-4">
                <Label className="text-sm font-medium">Based On</Label>
                <RadioGroup
                  value={formData.basedOn}
                  onValueChange={(value) => handleInputChange('basedOn', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="department" id="department" />
                    <Label htmlFor="department">Department</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="users" id="users" />
                    <Label htmlFor="users">Users</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="dept-select">Department</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT Department</SelectItem>
                    <SelectItem value="hr">HR Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Asset Loaned */}
        <Card className="shadow-sm">
          <SectionHeader title="Asset Loaned" sectionKey="loaned" number={8}>
            <div className="flex items-center gap-2">
              <span className="text-sm">If Applicable</span>
              <Checkbox 
                checked={true}
                className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
              />
            </div>
          </SectionHeader>
          {expandedSections.loaned && (
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vendorName">Vendor Name*</Label>
                  <Select value={formData.vendorName} onValueChange={(value) => handleInputChange('vendorName', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor1">Vendor 1</SelectItem>
                      <SelectItem value="vendor2">Vendor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="agreementStartDate">Agreement Start Date *</Label>
                  <Input
                    id="agreementStartDate"
                    type="date"
                    value={formData.agreementStartDate}
                    onChange={(e) => handleInputChange('agreementStartDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="agreementEndDate">Agreement End Date *</Label>
                  <Input
                    id="agreementEndDate"
                    type="date"
                    value={formData.agreementEndDate}
                    onChange={(e) => handleInputChange('agreementEndDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* AMC Details */}
        <Card className="shadow-sm">
          <SectionHeader title="AMC Details" sectionKey="amc" number={9} />
          {expandedSections.amc && (
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <Select value={formData.vendor} onValueChange={(value) => handleInputChange('vendor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor1">Vendor 1</SelectItem>
                      <SelectItem value="vendor2">Vendor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Payment..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amcCost">No. of Visits</Label>
                  <Input
                    id="amcCost"
                    placeholder="Enter Value"
                    value={formData.amcCost}
                    onChange={(e) => handleInputChange('amcCost', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="amc-cost">AMC Cost</Label>
                <Input
                  id="amc-cost"
                  placeholder="Enter AMC Cost"
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Attachments */}
        <Card className="shadow-sm">
          <SectionHeader title="Attachments" sectionKey="attachments" number={10} />
          {expandedSections.attachments && (
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Manuals Upload', key: 'manualsUpload' },
                  { title: 'Insurance Details', key: 'insuranceDetails' },
                  { title: 'Purchase Invoice', key: 'purchaseInvoice' },
                  { title: 'AMC', key: 'amc' }
                ].map((attachment) => (
                  <div key={attachment.key} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mb-2">
                      <strong className="text-red-600">Choose File</strong>
                      <span className="text-gray-500 ml-2">No file chosen</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button 
            variant="outline" 
            onClick={handleSaveAndShowDetails}
            className="px-8 py-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreateNew}
            className="px-8 py-2 bg-red-600 text-white hover:bg-red-700"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};
