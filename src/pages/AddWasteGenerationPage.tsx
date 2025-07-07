
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

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
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 mb-2 text-sm">Waste Generation &gt; NEW Waste Generation</p>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">NEW WASTE GENERATION</h1>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#C72030]">
            <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            WASTE GENERATION DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="building-label" shrink>Select Building</InputLabel>
                <MuiSelect
                  labelId="building-label"
                  label="Select Building"
                  displayEmpty
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  <MenuItem value="building-a">Building A</MenuItem>
                  <MenuItem value="building-b">Building B</MenuItem>
                  <MenuItem value="building-c">Building C</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="wing-label" shrink>Select Building First</InputLabel>
                <MuiSelect
                  labelId="wing-label"
                  label="Select Building First"
                  displayEmpty
                  value={formData.wing}
                  onChange={(e) => handleInputChange('wing', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Building First</em></MenuItem>
                  <MenuItem value="east-wing">East Wing</MenuItem>
                  <MenuItem value="west-wing">West Wing</MenuItem>
                  <MenuItem value="north-wing">North Wing</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="area-label" shrink>Select Floor First</InputLabel>
                <MuiSelect
                  labelId="area-label"
                  label="Select Floor First"
                  displayEmpty
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Floor First</em></MenuItem>
                  <MenuItem value="floor-1">Floor 1</MenuItem>
                  <MenuItem value="floor-2">Floor 2</MenuItem>
                  <MenuItem value="floor-3">Floor 3</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-2">
              <TextField
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                placeholder="Enter Date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="vendor-label" shrink>Select Vendor</InputLabel>
                <MuiSelect
                  labelId="vendor-label"
                  label="Select Vendor"
                  displayEmpty
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Vendor</em></MenuItem>
                  <MenuItem value="ecogreen">EcoGreen Solutions</MenuItem>
                  <MenuItem value="wasteco">WasteCo Ltd</MenuItem>
                  <MenuItem value="greentech">GreenTech Services</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="commodity-label" shrink>Select Commodity</InputLabel>
                <MuiSelect
                  labelId="commodity-label"
                  label="Select Commodity"
                  displayEmpty
                  value={formData.commodity}
                  onChange={(e) => handleInputChange('commodity', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Commodity</em></MenuItem>
                  <MenuItem value="paper">Paper</MenuItem>
                  <MenuItem value="plastic">Plastic</MenuItem>
                  <MenuItem value="metal">Metal</MenuItem>
                  <MenuItem value="organic">Organic</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="category-label" shrink>Select Category</InputLabel>
                <MuiSelect
                  labelId="category-label"
                  label="Select Category"
                  displayEmpty
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="recyclable">Recyclable</MenuItem>
                  <MenuItem value="non-recyclable">Non-Recyclable</MenuItem>
                  <MenuItem value="hazardous">Hazardous</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="uom-label" shrink>Select UoM</InputLabel>
                <MuiSelect
                  labelId="uom-label"
                  label="Select UoM"
                  displayEmpty
                  value={formData.uom}
                  onChange={(e) => handleInputChange('uom', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select UoM</em></MenuItem>
                  <MenuItem value="kg">KG</MenuItem>
                  <MenuItem value="tons">Tons</MenuItem>
                  <MenuItem value="liters">Liters</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="operational-name-label" shrink>Select Operational Name</InputLabel>
                <MuiSelect
                  labelId="operational-name-label"
                  label="Select Operational Name"
                  displayEmpty
                  value={formData.operationalName}
                  onChange={(e) => handleInputChange('operationalName', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Operational Name</em></MenuItem>
                  <MenuItem value="abc-corp">ABC Corp</MenuItem>
                  <MenuItem value="xyz-inc">XYZ Inc</MenuItem>
                  <MenuItem value="def-ltd">DEF Ltd</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="space-y-1">
              <TextField
                id="agencyName"
                name="agencyName"
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                placeholder="Enter Agency Name"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 0.5 }}
              />
            </div>

            <div className="space-y-1">
              <TextField
                id="generatedUnit"
                name="generatedUnit"
                type="number"
                value={formData.generatedUnit}
                onChange={(e) => handleInputChange('generatedUnit', e.target.value)}
                placeholder="Enter Unit"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 0.5 }}
              />
            </div>

            <div className="space-y-1">
              <TextField
                id="recycledUnit"
                name="recycledUnit"
                type="number"
                value={formData.recycledUnit}
                onChange={(e) => handleInputChange('recycledUnit', e.target.value)}
                placeholder="0"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: false }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 0.5 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={handleSave}
          className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8"
        >
          Save
        </Button>
        <Button
          onClick={handleBack}
          variant="outline"
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-8"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default AddWasteGenerationPage;
