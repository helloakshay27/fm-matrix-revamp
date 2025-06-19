
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ChevronDown, ChevronUp, X, Plus } from 'lucide-react';

export const EditWaterAssetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [locationExpanded, setLocationExpanded] = useState(true);
  const [assetDetailsExpanded, setAssetDetailsExpanded] = useState(true);
  const [warrantyExpanded, setWarrantyExpanded] = useState(true);
  const [meterCategoryExpanded, setMeterCategoryExpanded] = useState(true);
  const [consumptionExpanded, setConsumptionExpanded] = useState(true);
  const [nonConsumptionExpanded, setNonConsumptionExpanded] = useState(true);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(true);

  const handleBack = () => {
    navigate(`/utility/water/details/${id}`);
  };

  const handleSave = () => {
    console.log('Save & Show Details clicked');
    navigate(`/utility/water/details/${id}`);
  };

  const handleSaveAndCreate = () => {
    console.log('Save & Create New Asset clicked');
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Asset List
          </button>
          <span>&gt;</span>
          <span>Create New Asset</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">NEW ASSET</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Location Details Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setLocationExpanded(!locationExpanded)}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-t-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">9</div>
                <span className="font-semibold text-orange-600 uppercase">LOCATION DETAILS</span>
              </div>
              {locationExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {locationExpanded && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="site">Site*</Label>
                    <Select defaultValue="located-site-1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="located-site-1">Located Site 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="building">Building</Label>
                    <Select defaultValue="sarova">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarova">Sarova</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="wing">Wing</Label>
                    <Select defaultValue="sw1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sw1">SW1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Select defaultValue="aw1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aw1">AW1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="floor">Floor</Label>
                    <Select defaultValue="fw1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fw1">FW1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="w-48">
                  <Label htmlFor="room">Room</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room1">Room 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Asset Details Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setAssetDetailsExpanded(!assetDetailsExpanded)}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-t-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">⚡</div>
                <span className="font-semibold text-orange-600 uppercase">ASSET DETAILS</span>
              </div>
              {assetDetailsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {assetDetailsExpanded && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="assetName">Asset Name*</Label>
                    <Input id="assetName" defaultValue="Borewell" />
                  </div>
                  
                  <div>
                    <Label htmlFor="assetNo">Asset No.*</Label>
                    <Input id="assetNo" defaultValue="505" />
                  </div>
                  
                  <div>
                    <Label htmlFor="equipmentId">Equipment ID.*</Label>
                    <Input id="equipmentId" placeholder="Enter Number" />
                  </div>
                  
                  <div>
                    <Label htmlFor="modelNo">Model No.</Label>
                    <Input id="modelNo" defaultValue="7805" />
                  </div>
                  
                  <div>
                    <Label htmlFor="serialNo">Serial No.</Label>
                    <Input id="serialNo" defaultValue="540" />
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="consumerNo">Consumer No.</Label>
                    <Input id="consumerNo" defaultValue="32326444" />
                  </div>
                  
                  <div>
                    <Label htmlFor="purchaseCost">Purchase Cost*</Label>
                    <Input id="purchaseCost" defaultValue="8000.0" />
                  </div>
                  
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" placeholder="Enter Text" />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" defaultValue="litre/hr" />
                  </div>
                  
                  <div>
                    <Label htmlFor="group">Group*</Label>
                    <Select defaultValue="electrical">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="subgroup">Subgroup*</Label>
                    <Select defaultValue="back-up-source">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="back-up-source">Back Up Source</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="purchasedDate">Purchased ON Date</Label>
                    <Input id="purchasedDate" defaultValue="2024-08-01" type="date" />
                  </div>
                  
                  <div>
                    <Label htmlFor="expiryDate">Expiry date</Label>
                    <Input id="expiryDate" placeholder="Select Date" type="date" />
                  </div>
                  
                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input id="manufacturer" placeholder="Select Date" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Location Type</Label>
                    <RadioGroup defaultValue="na" className="flex gap-6 mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="common-area" id="common-area" />
                        <Label htmlFor="common-area">Common Area</Label>
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
                    <RadioGroup defaultValue="sub" className="flex gap-6 mt-2">
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
                  
                  <div className="w-48">
                    <Label htmlFor="parentAsset">Parent Asset</Label>
                    <Select defaultValue="machinery">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="machinery">Machinery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <RadioGroup defaultValue="in-use" className="flex gap-6 mt-2">
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
                  
                  <div>
                    <Label className="text-sm font-medium">Critical:</Label>
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
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="meter-applicable" defaultChecked />
                    <Label htmlFor="meter-applicable">Meter Applicable</Label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warranty Details Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setWarrantyExpanded(!warrantyExpanded)}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-t-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">9</div>
                <span className="font-semibold text-orange-600 uppercase">Warranty Details</span>
              </div>
              {warrantyExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {warrantyExpanded && (
              <div className="p-6 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Under Warranty:</Label>
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
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="warrantyStartDate">Warranty Start Date</Label>
                    <Input id="warrantyStartDate" placeholder="Select Date" type="date" />
                  </div>
                  
                  <div>
                    <Label htmlFor="warrantyExpiresOn">Warranty expires on</Label>
                    <Input id="warrantyExpiresOn" placeholder="Select Date" type="date" />
                  </div>
                  
                  <div>
                    <Label htmlFor="commissioningDate">Commissioning Date</Label>
                    <Input id="commissioningDate" placeholder="Select Date" type="date" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Meter Category Type Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setMeterCategoryExpanded(!meterCategoryExpanded)}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-t-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">9</div>
                <span className="font-semibold text-orange-600 uppercase">Meter Category Type</span>
              </div>
              {meterCategoryExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {meterCategoryExpanded && (
              <div className="p-6">
                <div className="grid grid-cols-6 gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg text-center">
                    <RadioGroup defaultValue="">
                      <div className="flex items-center justify-center space-x-2">
                        <RadioGroupItem value="board" id="board" />
                      </div>
                    </RadioGroup>
                    <div className="mt-2 text-sm font-medium">📋 Board</div>
                  </div>
                  
                  <div className="bg-purple-100 p-3 rounded-lg text-center">
                    <RadioGroup defaultValue="">
                      <div className="flex items-center justify-center space-x-2">
                        <RadioGroupItem value="dg" id="dg" />
                      </div>
                    </RadioGroup>
                    <div className="mt-2 text-sm font-medium">🏭 DG</div>
                  </div>
                  
                  <div className="bg-purple-100 p-3 rounded-lg text-center">
                    <RadioGroup defaultValue="">
                      <div className="flex items-center justify-center space-x-2">
                        <RadioGroupItem value="renewable" id="renewable" />
                      </div>
                    </RadioGroup>
                    <div className="mt-2 text-sm font-medium">⚡ Renewable</div>
                  </div>
                  
                  <div className="bg-purple-100 p-3 rounded-lg text-center border-2 border-orange-400">
                    <RadioGroup defaultValue="fresh-water">
                      <div className="flex items-center justify-center space-x-2">
                        <RadioGroupItem value="fresh-water" id="fresh-water" />
                      </div>
                    </RadioGroup>
                    <div className="mt-2 text-sm font-medium">💧 Fresh Water</div>
                  </div>
                  
                  <div className="bg-purple-100 p-3 rounded-lg text-center">
                    <RadioGroup defaultValue="">
                      <div className="flex items-center justify-center space-x-2">
                        <RadioGroupItem value="recycled" id="recycled" />
                      </div>
                    </RadioGroup>
                    <div className="mt-2 text-sm font-medium">♻️ Recycled</div>
                  </div>
                  
                  <div className="bg-purple-100 p-3 rounded-lg text-center">
                    <RadioGroup defaultValue="">
                      <div className="flex items-center justify-center space-x-2">
                        <RadioGroupItem value="ex-gdam" id="ex-gdam" />
                      </div>
                    </RadioGroup>
                    <div className="mt-2 text-sm font-medium">🏢 EX-GDAM</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Consumption Asset Measure Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setConsumptionExpanded(!consumptionExpanded)}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-t-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">⚡</div>
                <span className="font-semibold text-orange-600 uppercase">CONSUMPTION ASSET MEASURE</span>
              </div>
              {consumptionExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {consumptionExpanded && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter Text" />
                  </div>
                  
                  <div>
                    <Label htmlFor="unitType">Unit Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Unit Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="litres">Litres</SelectItem>
                        <SelectItem value="gallons">Gallons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="min">Min</Label>
                    <Input id="min" placeholder="Enter Number" />
                  </div>
                  
                  <div>
                    <Label htmlFor="max">Max</Label>
                    <Input id="max" placeholder="Enter Number" />
                  </div>
                  
                  <div>
                    <Label htmlFor="alertBelowVal">Alert Below Val.</Label>
                    <Input id="alertBelowVal" placeholder="Enter Value" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="alertAboveVal">Alert Above Val.</Label>
                    <Input id="alertAboveVal" placeholder="Enter Value" />
                  </div>
                  
                  <div>
                    <Label htmlFor="multiplierFactor">Multiplier Factor</Label>
                    <Input id="multiplierFactor" placeholder="Enter Text" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="checkPreviousReading" />
                  <Label htmlFor="checkPreviousReading">Check Previous Reading</Label>
                </div>
                
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 text-red-500 border-red-300">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Non Consumption Asset Measure Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setNonConsumptionExpanded(!nonConsumptionExpanded)}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-t-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">⚡</div>
                <span className="font-semibold text-orange-600 uppercase">NON CONSUMPTION ASSET MEASURE</span>
              </div>
              {nonConsumptionExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {nonConsumptionExpanded && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="nonConsumptionName">Name</Label>
                    <Input id="nonConsumptionName" placeholder="Name" />
                  </div>
                  
                  <div>
                    <Label htmlFor="nonConsumptionUnitType">Unit Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Unit Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="litres">Litres</SelectItem>
                        <SelectItem value="gallons">Gallons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="nonConsumptionMin">Min</Label>
                    <Input id="nonConsumptionMin" placeholder="Min" />
                  </div>
                  
                  <div>
                    <Label htmlFor="nonConsumptionMax">Max</Label>
                    <Input id="nonConsumptionMax" placeholder="Max" />
                  </div>
                  
                  <div>
                    <Label htmlFor="nonConsumptionAlertBelowVal">Alert Below Val.</Label>
                    <Input id="nonConsumptionAlertBelowVal" placeholder="Alert Below Value" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nonConsumptionAlertAboveVal">Alert Above Val.</Label>
                    <Input id="nonConsumptionAlertAboveVal" placeholder="Alert Above Value" />
                  </div>
                  
                  <div>
                    <Label htmlFor="nonConsumptionMultiplierFactor">Multiplier Factor</Label>
                    <Input id="nonConsumptionMultiplierFactor" placeholder="Multiplier Factor" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="checkPreviousReadingNonConsumption" />
                  <Label htmlFor="checkPreviousReadingNonConsumption">Check Previous Reading</Label>
                </div>
                
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 text-red-500 border-red-300">
                  <X className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => setAttachmentsExpanded(!attachmentsExpanded)}
              className="w-full flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 rounded-t-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">📎</div>
                <span className="font-semibold text-orange-600 uppercase">ATTACHMENTS</span>
              </div>
              {attachmentsExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            {attachmentsExpanded && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Manuals Upload</Label>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center">
                      <Button variant="link" className="text-orange-500">Choose File</Button>
                      <span className="text-gray-500 ml-2">No file chosen</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-8 h-8 p-0 text-red-500 border-red-300">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="mt-2 ml-2 text-blue-500 border-blue-300">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Insurance Details</Label>
                    <Button variant="outline" size="sm" className="text-blue-500 border-blue-300">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Purchase Invoice</Label>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center">
                      <Button variant="link" className="text-orange-500">Choose File</Button>
                      <span className="text-gray-500 ml-2">No file chosen</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-8 h-8 p-0 text-red-500 border-red-300">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="mt-2 ml-2 text-blue-500 border-blue-300">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">AMC</Label>
                    <Button variant="outline" size="sm" className="text-blue-500 border-blue-300">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="bg-purple-600 text-white hover:bg-purple-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6">
            <Button onClick={handleSave} variant="outline" className="px-8">
              Save & Show Details
            </Button>
            <Button onClick={handleSaveAndCreate} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              Save & Create New Asset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
