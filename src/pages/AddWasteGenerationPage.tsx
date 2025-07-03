
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const AddWasteGenerationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    building: '',
    wing: '',
    area: '',
    date: '',
    vendor: '',
    commodity: '',
    category: '',
    uom: '',
    operationalName: '',
    agencyName: '',
    generatedUnit: '',
    recycledUnit: '0'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.building || !formData.vendor || !formData.commodity || !formData.category || !formData.operationalName || !formData.generatedUnit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    console.log('Saving waste generation data:', formData);
    toast({
      title: "Success",
      description: "Waste generation record saved successfully",
    });
    navigate('/maintenance/audit/waste/generation');
  };

  const handleBack = () => {
    navigate('/maintenance/audit/waste/generation');
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <nav className="text-sm text-gray-600 mb-2">
            Waste Generation &gt; NEW Waste Generation
          </nav>
          <h2 className="text-3xl font-bold tracking-tight">NEW WASTE GENERATION</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            WASTE GENERATION DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="building">Building</Label>
              <Select value={formData.building} onValueChange={(value) => handleInputChange('building', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="building-a">Building A</SelectItem>
                  <SelectItem value="building-b">Building B</SelectItem>
                  <SelectItem value="building-c">Building C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wing">Wing</Label>
              <Select value={formData.wing} onValueChange={(value) => handleInputChange('wing', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Building First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="east-wing">East Wing</SelectItem>
                  <SelectItem value="west-wing">West Wing</SelectItem>
                  <SelectItem value="north-wing">North Wing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Select value={formData.area} onValueChange={(value) => handleInputChange('area', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Floor First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="floor-1">Floor 1</SelectItem>
                  <SelectItem value="floor-2">Floor 2</SelectItem>
                  <SelectItem value="floor-3">Floor 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date*</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                placeholder="Enter Date"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select value={formData.vendor} onValueChange={(value) => handleInputChange('vendor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecogreen">EcoGreen Solutions</SelectItem>
                  <SelectItem value="wasteco">WasteCo Ltd</SelectItem>
                  <SelectItem value="greentech">GreenTech Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commodity">Commodity*</Label>
              <Select value={formData.commodity} onValueChange={(value) => handleInputChange('commodity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Commodity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paper">Paper</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recyclable">Recyclable</SelectItem>
                  <SelectItem value="non-recyclable">Non-Recyclable</SelectItem>
                  <SelectItem value="hazardous">Hazardous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="uom">UoM</Label>
              <Select value={formData.uom} onValueChange={(value) => handleInputChange('uom', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select UoM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">KG</SelectItem>
                  <SelectItem value="tons">Tons</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="operationalName">Operational Name of Landlord/ Tenant*</Label>
              <Select value={formData.operationalName} onValueChange={(value) => handleInputChange('operationalName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Operational Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abc-corp">ABC Corp</SelectItem>
                  <SelectItem value="xyz-inc">XYZ Inc</SelectItem>
                  <SelectItem value="def-ltd">DEF Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                placeholder="Enter Agency Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="generatedUnit">Generated Unit*</Label>
              <Input
                type="number"
                value={formData.generatedUnit}
                onChange={(e) => handleInputChange('generatedUnit', e.target.value)}
                placeholder="Enter Unit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recycledUnit">Recycled Unit</Label>
              <Input
                type="number"
                value={formData.recycledUnit}
                onChange={(e) => handleInputChange('recycledUnit', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={handleSave}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#A01B26] px-8"
            >
              Save
            </Button>
            <Button
              onClick={handleBack}
              variant="outline"
              className="px-8"
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddWasteGenerationPage;
