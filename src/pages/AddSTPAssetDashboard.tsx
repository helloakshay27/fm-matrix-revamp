
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

const AddSTPAssetDashboard = () => {
  const navigate = useNavigate();
  const [isLocationOpen, setIsLocationOpen] = useState(true);
  const [isAssetDetailsOpen, setIsAssetDetailsOpen] = useState(true);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isMeterCategoryOpen, setIsMeterCategoryOpen] = useState(false);
  const [isConsumptionOpen, setIsConsumptionOpen] = useState(false);
  const [isNonConsumptionOpen, setIsNonConsumptionOpen] = useState(false);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);

  const handleSaveAndShowDetails = () => {
    console.log('Saving STP asset and showing details...');
    navigate('/utility/stp');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving STP asset and creating new one...');
    window.location.reload();
  };

  const handleBack = () => {
    navigate('/utility/stp');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBack}
          className="hover:bg-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NEW ASSET</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg space-y-4">
        {/* Location Details */}
        <Collapsible open={isLocationOpen} onOpenChange={setIsLocationOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-between w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                <span className="text-orange-600 font-semibold">LOCATION DETAILS</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-orange-600 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site">Site*</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-site">Main Site</SelectItem>
                    <SelectItem value="branch-site">Branch Site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="building">Building</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building-a">Building A</SelectItem>
                    <SelectItem value="building-b">Building B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wing">Wing</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="east">East Wing</SelectItem>
                    <SelectItem value="west">West Wing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="treatment">Treatment Area</SelectItem>
                    <SelectItem value="storage">Storage Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ground">Ground Floor</SelectItem>
                    <SelectItem value="first">First Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room-101">Room 101</SelectItem>
                    <SelectItem value="room-102">Room 102</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Asset Details */}
        <Collapsible open={isAssetDetailsOpen} onOpenChange={setIsAssetDetailsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-between w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                <span className="text-orange-600 font-semibold">ASSET DETAILS</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-orange-600 transition-transform ${isAssetDetailsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name*</Label>
                <Input id="assetName" placeholder="Enter Text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assetNo">Asset No.*</Label>
                <Input id="assetNo" placeholder="Enter Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipmentId">Equipment ID.*</Label>
                <Input id="equipmentId" placeholder="Enter Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelNo">Model No.</Label>
                <Input id="modelNo" placeholder="Enter Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNo">Serial No.</Label>
                <Input id="serialNo" placeholder="Enter Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="group">Group*</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stp">STP Equipment</SelectItem>
                    <SelectItem value="water">Water Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="consumerNo">Consumer No.</Label>
                <Input id="consumerNo" placeholder="Enter Number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseCost">Purchase Cost*</Label>
                <Input id="purchaseCost" placeholder="Enter Numeric value" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" placeholder="Enter Text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" placeholder="Enter Text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subgroup">Subgroup*</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SubGroup" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary Treatment</SelectItem>
                    <SelectItem value="secondary">Secondary Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchased ON Date</Label>
                <Input id="purchaseDate" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry date</Label>
                <Input id="expiryDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" type="date" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Location Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="locationType" value="common" />
                    <span>Common Area</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="locationType" value="customer" />
                    <span>Customer</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="locationType" value="na" defaultChecked />
                    <span>NA</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Asset Type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="assetType" value="parent" />
                    <span>Parent</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="assetType" value="sub" />
                    <span>Sub</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" value="inuse" />
                    <span>In Use</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" value="breakdown" />
                    <span>Breakdown</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Critical:</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="critical" value="yes" />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="critical" value="no" defaultChecked />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="meterApplicable" />
                <Label htmlFor="meterApplicable">Meter Applicable</Label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Warranty Details */}
        <Collapsible open={isWarrantyOpen} onOpenChange={setIsWarrantyOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-between w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                <span className="text-orange-600 font-semibold">Warranty Details</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-orange-600 transition-transform ${isWarrantyOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Under Warranty:</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="warranty" value="yes" />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="warranty" value="no" defaultChecked />
                    <span>No</span>
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="warrantyStart">Warranty Start Date</Label>
                  <Input id="warrantyStart" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyExpiry">Warranty expires on</Label>
                  <Input id="warrantyExpiry" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissioningDate">Commissioning Date</Label>
                  <Input id="commissioningDate" type="date" />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Meter Category Type */}
        <Collapsible open={isMeterCategoryOpen} onOpenChange={setIsMeterCategoryOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-between w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                <span className="text-orange-600 font-semibold">Meter Category Type</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-orange-600 transition-transform ${isMeterCategoryOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <input type="radio" name="meterType" value="board" id="board" className="mb-2" />
                <label htmlFor="board" className="flex flex-col items-center cursor-pointer">
                  <span className="text-2xl mb-2">📋</span>
                  <span className="text-sm font-medium">Board</span>
                </label>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <input type="radio" name="meterType" value="dg" id="dg" className="mb-2" />
                <label htmlFor="dg" className="flex flex-col items-center cursor-pointer">
                  <span className="text-2xl mb-2">⚡</span>
                  <span className="text-sm font-medium">DG</span>
                </label>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <input type="radio" name="meterType" value="renewable" id="renewable" className="mb-2" />
                <label htmlFor="renewable" className="flex flex-col items-center cursor-pointer">
                  <span className="text-2xl mb-2">🔋</span>
                  <span className="text-sm font-medium">Renewable</span>
                </label>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <input type="radio" name="meterType" value="freshwater" id="freshwater" className="mb-2" />
                <label htmlFor="freshwater" className="flex flex-col items-center cursor-pointer">
                  <span className="text-2xl mb-2">💧</span>
                  <span className="text-sm font-medium">Fresh Water</span>
                </label>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <input type="radio" name="meterType" value="recycled" id="recycled" className="mb-2" />
                <label htmlFor="recycled" className="flex flex-col items-center cursor-pointer">
                  <span className="text-2xl mb-2">♻️</span>
                  <span className="text-sm font-medium">Recycled</span>
                </label>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <input type="radio" name="meterType" value="iex" id="iex" className="mb-2" />
                <label htmlFor="iex" className="flex flex-col items-center cursor-pointer">
                  <span className="text-2xl mb-2">⚡</span>
                  <span className="text-sm font-medium">IEX-GDAM</span>
                </label>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Consumption Asset Measure */}
        <Collapsible open={isConsumptionOpen} onOpenChange={setIsConsumptionOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-between w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                <span className="text-orange-600 font-semibold">CONSUMPTION ASSET MEASURE</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-orange-600 transition-transform ${isConsumptionOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-6">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter Text" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unitType">Unit Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="gallons">Gallons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min">Min</Label>
                  <Input id="min" placeholder="Enter Number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max">Max</Label>
                  <Input id="max" placeholder="Enter Number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alertBelow">Alert Below Val.</Label>
                  <Input id="alertBelow" placeholder="Enter Value" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alertAbove">Alert Above Val.</Label>
                  <Input id="alertAbove" placeholder="Enter Value" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="multiplier">Multiplier Factor</Label>
                  <Input id="multiplier" placeholder="Enter Text" />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox id="checkPrevious" />
                  <Label htmlFor="checkPrevious">Check Previous Reading</Label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" className="text-red-500 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Non Consumption Asset Measure */}
        <Collapsible open={isNonConsumptionOpen} onOpenChange={setIsNonConsumptionOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-between w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">6</span>
                <span className="text-orange-600 font-semibold">NON CONSUMPTION ASSET MEASURE</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-orange-600 transition-transform ${isNonConsumptionOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-6">
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nonConsumptionName">Name</Label>
                  <Input id="nonConsumptionName" placeholder="Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonConsumptionUnitType">Unit Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="cycles">Cycles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonConsumptionMin">Min</Label>
                  <Input id="nonConsumptionMin" placeholder="Min" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonConsumptionMax">Max</Label>
                  <Input id="nonConsumptionMax" placeholder="Max" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonConsumptionAlertBelow">Alert Below Val.</Label>
                  <Input id="nonConsumptionAlertBelow" placeholder="Alert Below Value" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nonConsumptionAlertAbove">Alert Above Val.</Label>
                  <Input id="nonConsumptionAlertAbove" placeholder="Alert Above Value" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonConsumptionMultiplier">Multiplier Factor</Label>
                  <Input id="nonConsumptionMultiplier" placeholder="Multiplier Factor" />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox id="nonConsumptionCheckPrevious" />
                  <Label htmlFor="nonConsumptionCheckPrevious">Check Previous Reading</Label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" className="text-red-500 hover:bg-red-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Attachments */}
        <Collapsible open={isAttachmentsOpen} onOpenChange={setIsAttachmentsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center justify-between w-full p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border-l-4 border-orange-500"
            >
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">7</span>
                <span className="text-orange-600 font-semibold">ATTACHMENTS</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-orange-600 transition-transform ${isAttachmentsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Manuals Upload</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                    <Button variant="ghost" className="text-orange-500">
                      Choose File
                    </Button>
                    <span className="ml-2 text-gray-500">No file chosen</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="text-red-500 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Purchase Invoice</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                    <Button variant="ghost" className="text-orange-500">
                      Choose File
                    </Button>
                    <span className="ml-2 text-gray-500">No file chosen</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="text-red-500 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Insurance Details</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                    <Button variant="ghost" className="text-orange-500">
                      Choose File
                    </Button>
                    <span className="ml-2 text-gray-500">No file chosen</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="text-red-500 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>AMC</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                    <Button variant="ghost" className="text-orange-500">
                      Choose File
                    </Button>
                    <span className="ml-2 text-gray-500">No file chosen</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="text-red-500 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-4 p-6 justify-center">
          <Button 
            onClick={handleSaveAndShowDetails}
            variant="outline"
            className="px-8 py-2 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreateNew}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSTPAssetDashboard;
