import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddWaterAssetDashboard = () => {
  const navigate = useNavigate();
  const [locationOpen, setLocationOpen] = useState(true);
  const [assetOpen, setAssetOpen] = useState(true);
  const [warrantyOpen, setWarrantyOpen] = useState(false);
  const [meterCategoryOpen, setMeterCategoryOpen] = useState(false);
  const [consumptionOpen, setConsumptionOpen] = useState(false);
  const [nonConsumptionOpen, setNonConsumptionOpen] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  const [formData, setFormData] = useState({
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    assetName: '',
    assetNo: '',
    equipmentId: '',
    modelNo: '',
    serialNo: '',
    consumerNo: '',
    purchaseCost: '',
    capacity: '',
    unit: '',
    group: '',
    subgroup: '',
    purchasedOnDate: '',
    expiryDate: '',
    manufacturer: '',
    locationType: 'common',
    assetType: 'parent',
    status: 'inUse',
    critical: 'no',
    meterApplicable: false,
    underWarranty: 'no',
    warrantyStartDate: '',
    warrantyExpiresOn: '',
    commissioningDate: '',
    selectedMeterCategories: []
  });

  const handleSave = () => {
    console.log('Saving asset:', formData);
    navigate('/utility/water');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new asset:', formData);
    // Reset form or keep some data as needed
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <nav className="text-sm text-gray-600 mb-2">
          Asset List &gt; Create New Asset
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">NEW ASSET</h1>
      </div>

      <div className="space-y-4">
        {/* Location Details */}
        <Card>
          <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    LOCATION DETAILS
                  </span>
                  {locationOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Label>Site*</Label>
                    <Select value={formData.site} onValueChange={(value) => setFormData({...formData, site: value})}>
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
                    <Label>Building</Label>
                    <Select value={formData.building} onValueChange={(value) => setFormData({...formData, building: value})}>
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
                    <Label>Wing</Label>
                    <Select value={formData.wing} onValueChange={(value) => setFormData({...formData, wing: value})}>
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
                    <Label>Area</Label>
                    <Select value={formData.area} onValueChange={(value) => setFormData({...formData, area: value})}>
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
                    <Label>Floor</Label>
                    <Select value={formData.floor} onValueChange={(value) => setFormData({...formData, floor: value})}>
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
                <div className="mt-4">
                  <Label>Room</Label>
                  <Select value={formData.room} onValueChange={(value) => setFormData({...formData, room: value})}>
                    <SelectTrigger className="w-full md:w-1/5">
                      <SelectValue placeholder="Select Room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room1">Room 1</SelectItem>
                      <SelectItem value="room2">Room 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Asset Details */}
        <Card>
          <Collapsible open={assetOpen} onOpenChange={setAssetOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    ASSET DETAILS
                  </span>
                  {assetOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Asset Name*</Label>
                    <Input 
                      placeholder="Enter Text"
                      value={formData.assetName}
                      onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Asset No.*</Label>
                    <Input 
                      placeholder="Enter Number"
                      value={formData.assetNo}
                      onChange={(e) => setFormData({...formData, assetNo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Equipment ID*</Label>
                    <Input 
                      placeholder="Enter Number"
                      value={formData.equipmentId}
                      onChange={(e) => setFormData({...formData, equipmentId: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Model No.</Label>
                    <Input 
                      placeholder="Enter Number"
                      value={formData.modelNo}
                      onChange={(e) => setFormData({...formData, modelNo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Serial No.</Label>
                    <Input 
                      placeholder="Enter Number"
                      value={formData.serialNo}
                      onChange={(e) => setFormData({...formData, serialNo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Consumer No.</Label>
                    <Input 
                      placeholder="Enter Number"
                      value={formData.consumerNo}
                      onChange={(e) => setFormData({...formData, consumerNo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Purchase Cost*</Label>
                    <Input 
                      placeholder="Enter Numeric value"
                      value={formData.purchaseCost}
                      onChange={(e) => setFormData({...formData, purchaseCost: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input 
                      placeholder="Enter Text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input 
                      placeholder="Enter Text"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label>Subgroup*</Label>
                    <Select value={formData.subgroup} onValueChange={(value) => setFormData({...formData, subgroup: value})}>
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
                    <Label>Purchased ON Date</Label>
                    <Input 
                      type="date"
                      value={formData.purchasedOnDate}
                      onChange={(e) => setFormData({...formData, purchasedOnDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Expiry date</Label>
                    <Input 
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Group*</Label>
                    <Select value={formData.group} onValueChange={(value) => setFormData({...formData, group: value})}>
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
                    <Label>Manufacturer</Label>
                    <Input 
                      type="date"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <Label>Location Type</Label>
                    <RadioGroup 
                      value={formData.locationType} 
                      onValueChange={(value) => setFormData({...formData, locationType: value})}
                      className="flex gap-6 mt-2"
                    >
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
                    <Label>Asset Type</Label>
                    <RadioGroup 
                      value={formData.assetType} 
                      onValueChange={(value) => setFormData({...formData, assetType: value})}
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

                  <div>
                    <Label>Status</Label>
                    <RadioGroup 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({...formData, status: value})}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inUse" id="inUse" />
                        <Label htmlFor="inUse">In Use</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="breakdown" id="breakdown" />
                        <Label htmlFor="breakdown">Breakdown</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Critical</Label>
                    <RadioGroup 
                      value={formData.critical} 
                      onValueChange={(value) => setFormData({...formData, critical: value})}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="criticalYes" />
                        <Label htmlFor="criticalYes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="criticalNo" />
                        <Label htmlFor="criticalNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="meterApplicable"
                      checked={formData.meterApplicable}
                      onCheckedChange={(checked) => setFormData({...formData, meterApplicable: checked as boolean})}
                    />
                    <Label htmlFor="meterApplicable">Meter Applicable</Label>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={handleSave}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreateNew}
            className="bg-purple-700 text-white hover:bg-purple-800"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};
