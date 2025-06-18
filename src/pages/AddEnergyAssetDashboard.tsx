
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddEnergyAssetDashboard = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    asset: true,
    warranty: true,
    meterCategory: true,
    consumption: false,
    nonConsumption: false,
    attachments: false
  });

  const [consumptionMeasures, setConsumptionMeasures] = useState([
    { name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPreviousReading: false }
  ]);

  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([
    { name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPreviousReading: false }
  ]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const addConsumptionMeasure = () => {
    setConsumptionMeasures([...consumptionMeasures, { 
      name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPreviousReading: false 
    }]);
  };

  const removeConsumptionMeasure = (index: number) => {
    setConsumptionMeasures(consumptionMeasures.filter((_, i) => i !== index));
  };

  const addNonConsumptionMeasure = () => {
    setNonConsumptionMeasures([...nonConsumptionMeasures, { 
      name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPreviousReading: false 
    }]);
  };

  const removeNonConsumptionMeasure = (index: number) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.filter((_, i) => i !== index));
  };

  const handleSaveAndShowDetails = () => {
    console.log('Saving asset and showing details...');
    navigate('/utility/energy');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving asset and creating new...');
    // Reset form or navigate to new form
  };

  const handleFileUpload = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Uploading ${type}:`, file.name);
      // Handle file upload logic here
    }
  };

  return (
    <div className="min-h-screen bg-sidebar">
      {/* Header */}
      <div className="bg-white border-b border-sidebar-border p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sidebar-foreground/70 text-sm mb-1">Asset List &gt; Create New Asset</p>
            <h1 className="text-2xl font-bold text-sidebar-foreground">NEW ASSET</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/utility/energy')}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Location Details Section */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={() => toggleSection('location')}
          >
            <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-sidebar-foreground">LOCATION DETAILS</h3>
            {expandedSections.location ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
          </div>
          
          {expandedSections.location && (
            <div className="bg-white p-6 rounded-lg border border-sidebar-border">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Site*</Label>
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
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Building</Label>
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
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Wing</Label>
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
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Area</Label>
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
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Floor</Label>
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
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Room</Label>
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
            </div>
          )}
        </div>

        {/* Asset Details Section */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={() => toggleSection('asset')}
          >
            <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-sidebar-foreground">ASSET DETAILS</h3>
            {expandedSections.asset ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
          </div>
          
          {expandedSections.asset && (
            <div className="bg-white p-6 rounded-lg border border-sidebar-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Asset Name*</Label>
                  <Input placeholder="Enter Text" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Asset No.*</Label>
                  <Input placeholder="Enter Number" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Equipment ID*</Label>
                  <Input placeholder="Enter Number" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Model No.</Label>
                  <Input placeholder="Enter Number" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Serial No.</Label>
                  <Input placeholder="Enter Number" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Consumer No.</Label>
                  <Input placeholder="Enter Number" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Purchase Cost*</Label>
                  <Input placeholder="Enter Numeric value" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Capacity</Label>
                  <Input placeholder="Enter Text" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Unit</Label>
                  <Input placeholder="Enter Text" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Group*</Label>
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
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Subgroup*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select SubGroup" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subgroup1">Sub Group 1</SelectItem>
                      <SelectItem value="subgroup2">Sub Group 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Purchased ON Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Expiry date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Manufacturer</Label>
                  <Input placeholder="Enter Manufacturer Name" />
                </div>
              </div>

              {/* Radio Button Groups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-3">Location Type</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input type="radio" name="locationType" value="commonArea" className="mr-2" />
                      <span className="text-sidebar-foreground">Common Area</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="locationType" value="customer" className="mr-2" />
                      <span className="text-sidebar-foreground">Customer</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="locationType" value="na" className="mr-2" />
                      <span className="text-sidebar-foreground">NA</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-3">Asset Type</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input type="radio" name="assetType" value="parent" className="mr-2" />
                      <span className="text-sidebar-foreground">Parent</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="assetType" value="sub" className="mr-2" />
                      <span className="text-sidebar-foreground">Sub</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-3">Status</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input type="radio" name="status" value="inUse" className="mr-2" />
                      <span className="text-sidebar-foreground">In Use</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="status" value="breakdown" className="mr-2" />
                      <span className="text-sidebar-foreground">Breakdown</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-3">Critical:</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input type="radio" name="critical" value="yes" className="mr-2" />
                      <span className="text-sidebar-foreground">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="critical" value="no" className="mr-2" />
                      <span className="text-sidebar-foreground">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <Checkbox className="mr-2" />
                  <span className="text-sidebar-foreground">Meter Applicable</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Warranty Details Section */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={() => toggleSection('warranty')}
          >
            <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-sidebar-foreground">Warranty Details</h3>
            {expandedSections.warranty ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
          </div>
          
          {expandedSections.warranty && (
            <div className="bg-white p-6 rounded-lg border border-sidebar-border">
              <div className="mb-6">
                <Label className="text-sm font-medium text-sidebar-foreground mb-3">Under Warranty:</Label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input type="radio" name="underWarranty" value="yes" className="mr-2" />
                    <span className="text-sidebar-foreground">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="underWarranty" value="no" className="mr-2" />
                    <span className="text-sidebar-foreground">No</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Warranty Start Date</Label>
                  <Input type="date" placeholder="Select Date" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Warranty expires on</Label>
                  <Input type="date" placeholder="Select Date" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Commissioning Date</Label>
                  <Input type="date" placeholder="Select Date" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Meter Category Type Section */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={() => toggleSection('meterCategory')}
          >
            <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              4
            </div>
            <h3 className="text-lg font-semibold text-sidebar-foreground">Meter Category Type</h3>
            {expandedSections.meterCategory ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
          </div>
          
          {expandedSections.meterCategory && (
            <div className="bg-white p-6 rounded-lg border border-sidebar-border">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
                  <input type="radio" name="meterCategory" value="board" className="mb-2" />
                  <span className="text-2xl mb-2">📋</span>
                  <span className="text-sm text-sidebar-foreground">Board</span>
                </label>
                <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
                  <input type="radio" name="meterCategory" value="dg" className="mb-2" />
                  <span className="text-2xl mb-2">⚡</span>
                  <span className="text-sm text-sidebar-foreground">DG</span>
                </label>
                <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
                  <input type="radio" name="meter Category" value="renewable" className="mb-2" />
                  <span className="text-2xl mb-2">🔄</span>
                  <span className="text-sm text-sidebar-foreground">Renewable</span>
                </label>
                <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
                  <input type="radio" name="meterCategory" value="freshWater" className="mb-2" />
                  <span className="text-2xl mb-2">💧</span>
                  <span className="text-sm text-sidebar-foreground">Fresh Water</span>
                </label>
                <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
                  <input type="radio" name="meterCategory" value="recycled" className="mb-2" />
                  <span className="text-2xl mb-2">♻️</span>
                  <span className="text-sm text-sidebar-foreground">Recycled</span>
                </label>
                <label className="flex flex-col items-center p-4 border-2 border-sidebar-border rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-sidebar-accent/30">
                  <input type="radio" name="meterCategory" value="iexGdam" className="mb-2" />
                  <span className="text-2xl mb-2">🏭</span>
                  <span className="text-sm text-sidebar-foreground">IEX-GDAM</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Consumption Asset Measure Section */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={() => toggleSection('consumption')}
          >
            <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              5+
            </div>
            <h3 className="text-lg font-semibold text-sidebar-foreground flex-1">CONSUMPTION ASSET MEASURE</h3>
            {expandedSections.consumption ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
          </div>
          
          {expandedSections.consumption && (
            <div className="bg-white p-6 rounded-lg border border-sidebar-border">
              {consumptionMeasures.map((measure, index) => (
                <div key={index} className="mb-6 p-4 border border-sidebar-border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-sidebar-foreground">Measure {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConsumptionMeasure(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Name</Label>
                      <Input placeholder="Enter Text" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Unit Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kwh">kWh</SelectItem>
                          <SelectItem value="units">Units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Min</Label>
                      <Input placeholder="Enter Number" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Max</Label>
                      <Input placeholder="Enter Number" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Alert Below Val.</Label>
                      <Input placeholder="Enter Value" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Alert Above Val.</Label>
                      <Input placeholder="Enter Value" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Multiplier Factor</Label>
                      <Input placeholder="Enter Text" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Checkbox className="mr-2" />
                    <Label className="text-sm text-sidebar-foreground">Check Previous Reading</Label>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addConsumptionMeasure}
                className="w-full border-dashed border-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More
              </Button>
            </div>
          )}
        </div>

        {/* Non Consumption Asset Measure Section */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={() => toggleSection('nonConsumption')}
          >
            <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              6+
            </div>
            <h3 className="text-lg font-semibold text-sidebar-foreground flex-1">NON CONSUMPTION ASSET MEASURE</h3>
            {expandedSections.nonConsumption ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
          </div>
          
          {expandedSections.nonConsumption && (
            <div className="bg-white p-6 rounded-lg border border-sidebar-border">
              {nonConsumptionMeasures.map((measure, index) => (
                <div key={index} className="mb-6 p-4 border border-sidebar-border rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-sidebar-foreground">Measure {index + 1}</h4>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNonConsumptionMeasure(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Name</Label>
                      <Input placeholder="Name" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Unit Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kwh">kWh</SelectItem>
                          <SelectItem value="units">Units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Min</Label>
                      <Input placeholder="Min" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Max</Label>
                      <Input placeholder="Max" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Alert Below Val.</Label>
                      <Input placeholder="Alert Below Value" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Alert Above Val.</Label>
                      <Input placeholder="Alert Above Value" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-sidebar-foreground mb-2">Multiplier Factor</Label>
                      <Input placeholder="Multiplier Factor" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Checkbox className="mr-2" />
                    <Label className="text-sm text-sidebar-foreground">Check Previous Reading</Label>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addNonConsumptionMeasure}
                className="w-full border-dashed border-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More
              </Button>
            </div>
          )}
        </div>

        {/* Attachments Section */}
        <div className="mb-6">
          <div 
            className="flex items-center gap-3 mb-4 cursor-pointer"
            onClick={() => toggleSection('attachments')}
          >
            <div style={{ backgroundColor: '#C72030' }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
              📎
            </div>
            <h3 className="text-lg font-semibold text-sidebar-foreground flex-1">ATTACHMENTS</h3>
            {expandedSections.attachments ? <ChevronUp className="w-5 h-5 text-sidebar-foreground" /> : <ChevronDown className="w-5 h-5 text-sidebar-foreground" />}
          </div>
          
          {expandedSections.attachments && (
            <div className="bg-white p-6 rounded-lg border border-sidebar-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Manual Upload</Label>
                  <div className="border-2 border-dashed border-sidebar-border rounded-lg p-6 text-center">
                    <div className="text-sidebar-foreground/70 mb-2">Choose File</div>
                    <div className="text-sm text-sidebar-foreground/50 mb-2">No file chosen</div>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('manual', e)}
                      className="hidden"
                      id="manual-upload"
                    />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => document.getElementById('manual-upload')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Insurance Details</Label>
                  <div className="border-2 border-dashed border-sidebar-border rounded-lg p-6 text-center">
                    <div className="text-sidebar-foreground/70 mb-2">Choose File</div>
                    <div className="text-sm text-sidebar-foreground/50 mb-2">No file chosen</div>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('insurance', e)}
                      className="hidden"
                      id="insurance-upload"
                    />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => document.getElementById('insurance-upload')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">Purchase Invoice</Label>
                  <div className="border-2 border-dashed border-sidebar-border rounded-lg p-6 text-center">
                    <div className="text-sidebar-foreground/70 mb-2">Choose File</div>
                    <div className="text-sm text-sidebar-foreground/50 mb-2">No file chosen</div>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('invoice', e)}
                      className="hidden"
                      id="invoice-upload"
                    />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => document.getElementById('invoice-upload')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-sidebar-foreground mb-2">AMC</Label>
                  <div className="border-2 border-dashed border-sidebar-border rounded-lg p-6 text-center">
                    <div className="text-sidebar-foreground/70 mb-2">Choose File</div>
                    <div className="text-sm text-sidebar-foreground/50 mb-2">No file chosen</div>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload('amc', e)}
                      className="hidden"
                      id="amc-upload"
                    />
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => document.getElementById('amc-upload')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button 
            variant="outline"
            onClick={handleSaveAndShowDetails}
            className="px-8 py-3 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreateNew}
            style={{ backgroundColor: '#C72030' }}
            className="px-8 py-3 text-white hover:opacity-90"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEnergyAssetDashboard;
