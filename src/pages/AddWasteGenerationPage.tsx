
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Recycle } from 'lucide-react';

const fieldStyles = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    height: { xs: '36px', md: '45px' },
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E0E0E0',
    },
    '&:hover fieldset': {
      borderColor: '#1A1A1A',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#C72030',
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: '#FFFFFF',
      padding: '0 4px',
    },
  },
  '& .MuiOutlinedInput-input, & .MuiSelect-select': {
    color: '#1A1A1A',
    fontSize: '14px',
    padding: { xs: '8px 14px', md: '12px 14px' },
    height: 'auto',
    '&::placeholder': {
      color: '#999999',
      opacity: 1,
    },
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
        <nav className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
          <span>Maintenance</span>
          <span className="mx-2">{'>'}</span>
          <span>Audit</span>
          <span className="mx-2">{'>'}</span>
          <span>Waste</span>
          <span className="mx-2">{'>'}</span>
          <span>Generation</span>
          <span className="mx-2">{'>'}</span>
          <span>Add</span>
        </nav>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 uppercase">
          ADD WASTE GENERATION
        </h1>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#FF6B35]">
            <Recycle className="w-6 h-6" />
            WASTE GENERATION DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Building</InputLabel>
                <MuiSelect
                  label="Building"
                  displayEmpty
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                >
                  <MenuItem value="">Select Building</MenuItem>
                  <MenuItem value="building-a">Building A</MenuItem>
                  <MenuItem value="building-b">Building B</MenuItem>
                  <MenuItem value="building-c">Building C</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  label="Wing"
                  displayEmpty
                  value={formData.wing}
                  onChange={(e) => handleInputChange('wing', e.target.value)}
                >
                  <MenuItem value="">Select Building First</MenuItem>
                  <MenuItem value="east-wing">East Wing</MenuItem>
                  <MenuItem value="west-wing">West Wing</MenuItem>
                  <MenuItem value="north-wing">North Wing</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Area</InputLabel>
                <MuiSelect
                  label="Area"
                  displayEmpty
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                >
                  <MenuItem value="">Select Floor First</MenuItem>
                  <MenuItem value="lobby">Lobby</MenuItem>
                  <MenuItem value="office">Office Area</MenuItem>
                  <MenuItem value="cafeteria">Cafeteria</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <TextField
                label="Date*"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
                placeholder="Enter Date"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Vendor</InputLabel>
                <MuiSelect
                  label="Vendor"
                  displayEmpty
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                >
                  <MenuItem value="">Select Vendor</MenuItem>
                  <MenuItem value="ecogreen">EcoGreen Solutions</MenuItem>
                  <MenuItem value="wasteco">WasteCo Ltd</MenuItem>
                  <MenuItem value="greentech">GreenTech Services</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Commodity*</InputLabel>
                <MuiSelect
                  label="Commodity*"
                  displayEmpty
                  value={formData.commodity}
                  onChange={(e) => handleInputChange('commodity', e.target.value)}
                >
                  <MenuItem value="">Select Commodity</MenuItem>
                  <MenuItem value="paper">Paper</MenuItem>
                  <MenuItem value="plastic">Plastic</MenuItem>
                  <MenuItem value="metal">Metal</MenuItem>
                  <MenuItem value="organic">Organic</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Category*</InputLabel>
                <MuiSelect
                  label="Category*"
                  displayEmpty
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  <MenuItem value="recyclable">Recyclable</MenuItem>
                  <MenuItem value="non-recyclable">Non-Recyclable</MenuItem>
                  <MenuItem value="hazardous">Hazardous</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>UoM</InputLabel>
                <MuiSelect
                  label="UoM"
                  displayEmpty
                  value={formData.uom}
                  onChange={(e) => handleInputChange('uom', e.target.value)}
                >
                  <MenuItem value="">Select UoM</MenuItem>
                  <MenuItem value="kg">KG</MenuItem>
                  <MenuItem value="tons">Tons</MenuItem>
                  <MenuItem value="liters">Liters</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel shrink>Operational Name of Landlord/ Tenant*</InputLabel>
                <MuiSelect
                  label="Operational Name of Landlord/ Tenant*"
                  displayEmpty
                  value={formData.operationalName}
                  onChange={(e) => handleInputChange('operationalName', e.target.value)}
                >
                  <MenuItem value="">Select Operational Name</MenuItem>
                  <MenuItem value="abc-corp">ABC Corp</MenuItem>
                  <MenuItem value="xyz-inc">XYZ Inc</MenuItem>
                  <MenuItem value="def-ltd">DEF Ltd</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <TextField
                label="Agency Name"
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                placeholder="Enter Agency Name"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
            </div>

            <div>
              <TextField
                label="Generated Unit*"
                type="number"
                value={formData.generatedUnit}
                onChange={(e) => handleInputChange('generatedUnit', e.target.value)}
                placeholder="Enter Unit"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
            </div>

            <div>
              <TextField
                label="Recycled Unit"
                type="number"
                value={formData.recycledUnit}
                onChange={(e) => handleInputChange('recycledUnit', e.target.value)}
                placeholder="0"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          onClick={handleSave}
          className="bg-[#8B5A3C] hover:bg-[#7A4F35] text-white px-8 py-2"
        >
          Save
        </Button>
        <Button
          onClick={handleBack}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default AddWasteGenerationPage;
