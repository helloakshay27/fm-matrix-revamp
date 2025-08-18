import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Recycle, Building, Trash2, MapPin } from 'lucide-react';
// Field styles for Material-UI components
const fieldStyles = {
  height: '45px',
  backgroundColor: '#fff',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    height: '45px',
    '& fieldset': {
      borderColor: '#ddd',
    },
    '&:hover fieldset': {
      borderColor: '#C72030',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};
const AddWasteGenerationPage = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleSave = () => {
    if (!formData.building || !formData.vendor || !formData.commodity || !formData.category || !formData.operationalName || !formData.generatedUnit) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    console.log('Saving waste generation data:', formData);
    toast({
      title: "Success",
      description: "Waste generation record saved successfully"
    });
    navigate('/maintenance/audit/waste/generation');
  };
  const handleBack = () => {
    navigate('/maintenance/audit/waste/generation');
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ADD WASTE GENERATION</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {/* Section 1: Location Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <MapPin size={16} color="#C72030" />
              </span>
              Location Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Building</InputLabel>
                <MuiSelect
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  label="Building"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Building</MenuItem>
                  <MenuItem value="building-a">Building A</MenuItem>
                  <MenuItem value="building-b">Building B</MenuItem>
                  <MenuItem value="building-c">Building C</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Wing</InputLabel>
                <MuiSelect
                  value={formData.wing}
                  onChange={(e) => handleInputChange('wing', e.target.value)}
                  label="Wing"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Building First</MenuItem>
                  <MenuItem value="east-wing">East Wing</MenuItem>
                  <MenuItem value="west-wing">West Wing</MenuItem>
                  <MenuItem value="north-wing">North Wing</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Area</InputLabel>
                <MuiSelect
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  label="Area"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Floor First</MenuItem>
                  <MenuItem value="lobby">Lobby</MenuItem>
                  <MenuItem value="office">Office Area</MenuItem>
                  <MenuItem value="cafeteria">Cafeteria</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <TextField
                label="Date*"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Waste Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Recycle size={16} color="#C72030" />
              </span>
              Waste Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Vendor</InputLabel>
                <MuiSelect
                  value={formData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                  label="Vendor"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Vendor</MenuItem>
                  <MenuItem value="ecogreen">EcoGreen Solutions</MenuItem>
                  <MenuItem value="wasteco">WasteCo Ltd</MenuItem>
                  <MenuItem value="greentech">GreenTech Services</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Commodity*</InputLabel>
                <MuiSelect
                  value={formData.commodity}
                  onChange={(e) => handleInputChange('commodity', e.target.value)}
                  label="Commodity*"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Commodity</MenuItem>
                  <MenuItem value="paper">Paper</MenuItem>
                  <MenuItem value="plastic">Plastic</MenuItem>
                  <MenuItem value="metal">Metal</MenuItem>
                  <MenuItem value="organic">Organic</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Category*</InputLabel>
                <MuiSelect
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  label="Category*"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Category</MenuItem>
                  <MenuItem value="recyclable">Recyclable</MenuItem>
                  <MenuItem value="non-recyclable">Non-Recyclable</MenuItem>
                  <MenuItem value="hazardous">Hazardous</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <FormControl
                fullWidth
                variant="outlined"
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>UoM</InputLabel>
                <MuiSelect
                  value={formData.uom}
                  onChange={(e) => handleInputChange('uom', e.target.value)}
                  label="UoM"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select UoM</MenuItem>
                  <MenuItem value="kg">KG</MenuItem>
                  <MenuItem value="tons">Tons</MenuItem>
                  <MenuItem value="liters">Liters</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Section 3: Organization Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Building size={16} color="#C72030" />
              </span>
              Organization Details
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ '& .MuiInputBase-root': fieldStyles }}
              >
                <InputLabel shrink>Operational Name of Landlord/ Tenant*</InputLabel>
                <MuiSelect
                  value={formData.operationalName}
                  onChange={(e) => handleInputChange('operationalName', e.target.value)}
                  label="Operational Name of Landlord/ Tenant*"
                  notched
                  displayEmpty
                >
                  <MenuItem value="">Select Operational Name</MenuItem>
                  <MenuItem value="abc-corp">ABC Corp</MenuItem>
                  <MenuItem value="xyz-inc">XYZ Inc</MenuItem>
                  <MenuItem value="def-ltd">DEF Ltd</MenuItem>
                </MuiSelect>
              </FormControl>
              
              <TextField
                label="Agency Name"
                placeholder="Enter Agency Name"
                value={formData.agencyName}
                onChange={(e) => handleInputChange('agencyName', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
              
              <TextField
                label="Generated Unit*"
                type="number"
                placeholder="Enter Unit"
                value={formData.generatedUnit}
                onChange={(e) => handleInputChange('generatedUnit', e.target.value)}
                fullWidth
                required
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
              
              <TextField
                label="Recycled Unit"
                type="number"
                placeholder="0"
                value={formData.recycledUnit}
                onChange={(e) => handleInputChange('recycledUnit', e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button 
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
          >
            Save
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={handleBack}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
};
export default AddWasteGenerationPage;
