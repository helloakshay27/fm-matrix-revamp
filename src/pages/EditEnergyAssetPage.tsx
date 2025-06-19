
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Plus, X } from 'lucide-react';

export const EditEnergyAssetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state based on the images
  const [formData, setFormData] = useState({
    site: 'Located Site 1',
    building: 'Tower 101',
    wing: 'A Wing',
    area: 'Common',
    floor: 'Select Floor',
    room: 'Select Room',
    assetName: 'DIESEL GENERATOR',
    assetNo: '246810',
    equipmentId: '123456',
    modelNo: 'ABC',
    serialNo: 'ACEF12',
    consumerNo: 'A1B2C3',
    purchaseCost: '1000000',
    capacity: '1000',
    unit: '1',
    group: 'Electrical System',
    subgroup: 'DG Set',
    purchasedDate: '2025-02-02',
    expiryDate: '',
    manufacturer: '',
    locationType: 'Common Area',
    assetType: 'Parent',
    status: 'In Use',
    critical: 'No',
    meterApplicable: true,
    underWarranty: 'Yes',
    warrantyStartDate: '',
    warrantyExpiresOn: '',
    commissioningDate: ''
  });

  const [consumptionMeasures, setConsumptionMeasures] = useState([
    { name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPrevious: false }
  ]);

  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([
    { name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPrevious: false }
  ]);

  const handleBack = () => {
    navigate(`/utility/energy/details/${id}`);
  };

  const handleSave = () => {
    console.log('Saving asset:', formData);
    navigate(`/utility/energy/details/${id}`);
  };

  const addConsumptionMeasure = () => {
    setConsumptionMeasures([...consumptionMeasures, { name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPrevious: false }]);
  };

  const removeConsumptionMeasure = (index: number) => {
    setConsumptionMeasures(consumptionMeasures.filter((_, i) => i !== index));
  };

  const addNonConsumptionMeasure = () => {
    setNonConsumptionMeasures([...nonConsumptionMeasures, { name: '', unitType: '', min: '', max: '', alertBelow: '', alertAbove: '', multiplierFactor: '', checkPrevious: false }]);
  };

  const removeNonConsumptionMeasure = (index: number) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.filter((_, i) => i !== index));
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
        
        <h1 className="text-2xl font-bold text-[#1a1a1a]">NEW ASSET</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <Accordion type="multiple" defaultValue={["location", "asset", "warranty", "meter", "consumption", "non-consumption", "attachments"]} className="w-full">
          {/* Location Details */}
          <AccordionItem value="location">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#C72030] hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">9</div>
                LOCATION DETAILS
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label>Site*</Label>
                  <Select value={formData.site} onValueChange={(value) => setFormData({...formData, site: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Located Site 1">Located Site 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Building</Label>
                  <Select value={formData.building} onValueChange={(value) => setFormData({...formData, building: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tower 101">Tower 101</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Wing</Label>
                  <Select value={formData.wing} onValueChange={(value) => setFormData({...formData, wing: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A Wing">A Wing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Area</Label>
                  <Select value={formData.area} onValueChange={(value) => setFormData({...formData, area: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Common">Common</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Select value={formData.floor} onValueChange={(value) => setFormData({...formData, floor: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select Floor">Select Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-4">
                <div className="space-y-2">
                  <Label>Room</Label>
                  <Select value={formData.room} onValueChange={(value) => setFormData({...formData, room: value})}>
                    <SelectTrigger className="w-1/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Select Room">Select Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Asset Details */}
          <AccordionItem value="asset">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#C72030] hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">9</div>
                ASSET DETAILS
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Asset Name*</Label>
                  <Input value={formData.assetName} onChange={(e) => setFormData({...formData, assetName: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                  <Label>Asset No.*</Label>
                  <Input value={formData.assetNo} onChange={(e) => setFormData({...formData, assetNo: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Equipment ID*</Label>
                  <Input value={formData.equipmentId} onChange={(e) => setFormData({...formData, equipmentId: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Model No.</Label>
                  <Input value={formData.modelNo} onChange={(e) => setFormData({...formData, modelNo: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Serial No.</Label>
                  <Input value={formData.serialNo} onChange={(e) => setFormData({...formData, serialNo: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Consumer No.</Label>
                  <Input value={formData.consumerNo} onChange={(e) => setFormData({...formData, consumerNo: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Purchase Cost*</Label>
                  <Input value={formData.purchaseCost} onChange={(e) => setFormData({...formData, purchaseCost: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Group*</Label>
                  <Select value={formData.group} onValueChange={(value) => setFormData({...formData, group: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electrical System">Electrical System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Subgroup*</Label>
                  <Select value={formData.subgroup} onValueChange={(value) => setFormData({...formData, subgroup: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DG Set">DG Set</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Purchased ON Date</Label>
                  <Input type="date" value={formData.purchasedDate} onChange={(e) => setFormData({...formData, purchasedDate: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Expiry date</Label>
                  <Input type="date" placeholder="Select Date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <Label>Manufacturer</Label>
                  <Input placeholder="Select Date" value={formData.manufacturer} onChange={(e) => setFormData({...formData, manufacturer: e.target.value})} />
                </div>
              </div>

              {/* Radio buttons */}
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Location Type</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="locationType" value="Common Area" checked={formData.locationType === 'Common Area'} onChange={(e) => setFormData({...formData, locationType: e.target.value})} />
                      Common Area
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="locationType" value="Customer" checked={formData.locationType === 'Customer'} onChange={(e) => setFormData({...formData, locationType: e.target.value})} />
                      Customer
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="locationType" value="NA" checked={formData.locationType === 'NA'} onChange={(e) => setFormData({...formData, locationType: e.target.value})} />
                      NA
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Asset Type</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="assetType" value="Parent" checked={formData.assetType === 'Parent'} onChange={(e) => setFormData({...formData, assetType: e.target.value})} />
                      Parent
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="assetType" value="Sub" checked={formData.assetType === 'Sub'} onChange={(e) => setFormData({...formData, assetType: e.target.value})} />
                      Sub
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="status" value="In Use" checked={formData.status === 'In Use'} onChange={(e) => setFormData({...formData, status: e.target.value})} />
                      In Use
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="status" value="Breakdown" checked={formData.status === 'Breakdown'} onChange={(e) => setFormData({...formData, status: e.target.value})} />
                      Breakdown
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Critical:</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="critical" value="Yes" checked={formData.critical === 'Yes'} onChange={(e) => setFormData({...formData, critical: e.target.value})} />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="critical" value="No" checked={formData.critical === 'No'} onChange={(e) => setFormData({...formData, critical: e.target.value})} />
                      No
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="meterApplicable" 
                    checked={formData.meterApplicable} 
                    onChange={(e) => setFormData({...formData, meterApplicable: e.target.checked})} 
                  />
                  <Label htmlFor="meterApplicable">Meter Applicable</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Warranty Details */}
          <AccordionItem value="warranty">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#C72030] hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">9</div>
                Warranty Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Under Warranty:</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="underWarranty" value="Yes" checked={formData.underWarranty === 'Yes'} onChange={(e) => setFormData({...formData, underWarranty: e.target.value})} />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="underWarranty" value="No" checked={formData.underWarranty === 'No'} onChange={(e) => setFormData({...formData, underWarranty: e.target.value})} />
                      No
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Warranty Start Date</Label>
                    <Input type="date" placeholder="Select Date" value={formData.warrantyStartDate} onChange={(e) => setFormData({...formData, warrantyStartDate: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Warranty expires on</Label>
                    <Input type="date" placeholder="Select Date" value={formData.warrantyExpiresOn} onChange={(e) => setFormData({...formData, warrantyExpiresOn: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <Label>Commissioning Date</Label>
                    <Input type="date" placeholder="Select Date" value={formData.commissioningDate} onChange={(e) => setFormData({...formData, commissioningDate: e.target.value})} />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Meter Category Type */}
          <AccordionItem value="meter">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#C72030] hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">9</div>
                Meter Category Type
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-6 gap-4">
                <div className="bg-purple-100 p-4 rounded-lg flex items-center gap-2">
                  <input type="radio" name="meterCategory" value="Board" />
                  <span>📋 Board</span>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg flex items-center gap-2">
                  <input type="radio" name="meterCategory" value="DG" defaultChecked />
                  <span>⚡ DG</span>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg flex items-center gap-2">
                  <input type="radio" name="meterCategory" value="Renewable" />
                  <span>🌱 Renewable</span>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg flex items-center gap-2">
                  <input type="radio" name="meterCategory" value="Fresh Water" />
                  <input type="radio" name="meterCategory" value="Recycled" />
                  <span>💧 Fresh Water</span>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg flex items-center gap-2">
                  <input type="radio" name="meterCategory" value="Recycled" />
                  <span>♻️ Recycled</span>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg flex items-center gap-2">
                  <input type="radio" name="meterCategory" value="EX-GDAM" />
                  <span>🔌 EX-GDAM</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Consumption Asset Measure */}
          <AccordionItem value="consumption">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#C72030] hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">9</div>
                CONSUMPTION ASSET MEASURE
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              {consumptionMeasures.map((measure, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg mb-4">
                  <div className="flex justify-end">
                    {index > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => removeConsumptionMeasure(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Enter Text" />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kwh">kWh</SelectItem>
                          <SelectItem value="liters">Liters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Min</Label>
                      <Input placeholder="Enter Number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max</Label>
                      <Input placeholder="Enter Number" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Alert Below Val.</Label>
                      <Input placeholder="Enter Value" />
                    </div>
                    <div className="space-y-2">
                      <Label>Alert Above Val.</Label>
                      <Input placeholder="Enter Value" />
                    </div>
                    <div className="space-y-2">
                      <Label>Multiplier Factor</Label>
                      <Input placeholder="Enter Text" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`checkPrevious${index}`} />
                    <Label htmlFor={`checkPrevious${index}`}>Check Previous Reading</Label>
                  </div>
                </div>
              ))}
              <Button onClick={addConsumptionMeasure} className="bg-[#C72030] hover:bg-[#A61B2A] text-white">
                <Plus className="w-4 h-4 mr-2" />
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Non Consumption Asset Measure */}
          <AccordionItem value="non-consumption">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#C72030] hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">9</div>
                NON CONSUMPTION ASSET MEASURE
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              {nonConsumptionMeasures.map((measure, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg mb-4">
                  <div className="flex justify-end">
                    {index > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => removeNonConsumptionMeasure(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kwh">kWh</SelectItem>
                          <SelectItem value="liters">Liters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Min</Label>
                      <Input placeholder="Min" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max</Label>
                      <Input placeholder="Max" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Alert Below Val.</Label>
                      <Input placeholder="Alert Below Value" />
                    </div>
                    <div className="space-y-2">
                      <Label>Alert Above Val.</Label>
                      <Input placeholder="Multiplier Factor" />
                    </div>
                    <div className="space-y-2">
                      <Label>Multiplier Factor</Label>
                      <Input placeholder="Multiplier Factor" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`checkPreviousNon${index}`} />
                    <Label htmlFor={`checkPreviousNon${index}`}>Check Previous Reading</Label>
                  </div>
                </div>
              ))}
              <Button onClick={addNonConsumptionMeasure} className="bg-[#C72030] hover:bg-[#A61B2A] text-white">
                <Plus className="w-4 h-4 mr-2" />
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Attachments */}
          <AccordionItem value="attachments">
            <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-[#C72030] hover:no-underline">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">📎</div>
                ATTACHMENTS
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Manuals Upload</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center">
                    <span className="text-[#C72030]">Choose File</span>
                    <span className="text-gray-500 ml-2">No file chosen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-gray-400" />
                    <Plus className="w-4 h-4 text-blue-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Insurance Details</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center">
                    <span className="text-[#C72030]">Choose File</span>
                    <span className="text-gray-500 ml-2">No file chosen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-gray-400" />
                    <Plus className="w-4 h-4 text-blue-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Purchase Invoice</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-gray-50">
                    <span className="text-[#C72030]">Choose File</span>
                    <span className="text-gray-500 ml-2">No file chosen</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>AMC</Label>
                  <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-gray-50">
                    <span className="text-[#C72030]">Choose File</span>
                    <span className="text-gray-500 ml-2">No file chosen</span>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Action Buttons */}
        <div className="p-6 border-t flex justify-center gap-4">
          <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white">
            Save & Show Details
          </Button>
          <Button onClick={handleSave} className="bg-[#C72030] hover:bg-[#A61B2A] text-white">
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};
