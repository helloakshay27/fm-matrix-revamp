
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const AddSTPAssetDashboard = () => {
  const navigate = useNavigate();
  const [isConsumptionOpen, setIsConsumptionOpen] = useState(true);
  const [isNonConsumptionOpen, setIsNonConsumptionOpen] = useState(false);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);

  const handleSaveAndShowDetails = () => {
    console.log('Saving STP asset and showing details...');
    // Add logic to save and navigate to details
    navigate('/utility/stp');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving STP asset and creating new one...');
    // Add logic to save and reset form
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
          <nav className="text-sm text-gray-600 mb-1">
            Assets &gt; Asset List &gt; Add Asset
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">ADD STP ASSET</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-6">
        {/* Basic Asset Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="assetName">Asset Name*</Label>
            <Input id="assetName" placeholder="Enter Asset Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assetCode">Asset Code*</Label>
            <Input id="assetCode" placeholder="Enter Asset Code" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assetType">Asset Type*</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stp-primary">STP Primary Treatment</SelectItem>
                <SelectItem value="stp-secondary">STP Secondary Treatment</SelectItem>
                <SelectItem value="stp-tertiary">STP Tertiary Treatment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location*</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building-a">Building A</SelectItem>
                <SelectItem value="building-b">Building B</SelectItem>
                <SelectItem value="treatment-facility">Treatment Facility</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
          <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flowRate">Flow Rate (L/min)</Label>
                <Input id="flowRate" type="number" placeholder="Enter Flow Rate" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Treatment Capacity (L/day)</Label>
                <Input id="capacity" type="number" placeholder="Enter Capacity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="efficiency">Treatment Efficiency (%)</Label>
                <Input id="efficiency" type="number" placeholder="Enter Efficiency" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="powerConsumption">Power Consumption (kWh)</Label>
                <Input id="powerConsumption" type="number" placeholder="Enter Power Consumption" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours/Day</Label>
                <Input id="operatingHours" type="number" placeholder="Enter Operating Hours" />
              </div>
            </div>
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
          <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="installationDate">Installation Date</Label>
                <Input id="installationDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenanceFrequency">Maintenance Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" placeholder="Enter Manufacturer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelNumber">Model Number</Label>
                <Input id="modelNumber" placeholder="Enter Model Number" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specifications">Technical Specifications</Label>
              <Textarea id="specifications" placeholder="Enter technical specifications..." rows={3} />
            </div>
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
          <CollapsibleContent className="space-y-4 mt-4 p-4 border rounded-lg">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documents">Upload Documents</Label>
                <Input id="documents" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.png" />
                <p className="text-sm text-gray-500">Upload manuals, certificates, photos, etc.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="photos">Asset Photos</Label>
                <Input id="photos" type="file" multiple accept="image/*" />
                <p className="text-sm text-gray-500">Upload photos of the asset</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 justify-center">
          <Button 
            onClick={handleSaveAndShowDetails}
            variant="outline"
            className="px-8 py-2"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreateNew}
            className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white px-8 py-2"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddSTPAssetDashboard;
