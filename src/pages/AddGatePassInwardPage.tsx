import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Fixed: Converted all Input components to MUI TextField components

export const AddGatePassInwardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const [formData, setFormData] = useState({
    // Goods Detail
    itemType: '',
    itemCategory: '',
    itemName: '',
    itemQuantity: '',
    unit: '',
    description: '',
    // Visitor Detail
    visitorName: '',
    mobileNo: '',
    companyName: '',
    vehicleNo: '',
    reportingTime: '',
    modeOfTransport: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.visitorName || !formData.mobileNo) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would typically call your API
      console.log('Form Data:', formData);
      
      toast({
        title: "Success",
        description: "Gate pass inward entry created successfully!"
      });
      
      navigate('/security/gate-pass/inwards');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to create entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/security/gate-pass/inwards')}
            className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inwards List
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">ADD GATE PASS INWARD</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goods Detail Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#F2EEE9] border-b border-gray-200 flex items-center">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </div>
              <h2 className="text-lg font-semibold text-gray-900">GOODS DETAIL</h2>
            </div>
            <div className="p-6 space-y-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Item Type</InputLabel>
                  <MuiSelect
                    value={formData.itemType}
                    onChange={(e) => handleInputChange('itemType', e.target.value)}
                    label="Item Type"
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Select Item Type</MenuItem>
                    <MenuItem value="equipment">Equipment</MenuItem>
                    <MenuItem value="material">Material</MenuItem>
                    <MenuItem value="document">Document</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Item Category</InputLabel>
                  <MuiSelect
                    value={formData.itemCategory}
                    onChange={(e) => handleInputChange('itemCategory', e.target.value)}
                    label="Item Category"
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="tools">Tools</MenuItem>
                    <MenuItem value="supplies">Supplies</MenuItem>
                    <MenuItem value="personal">Personal</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField
                  label="Item Name"
                  placeholder="Fill Item Name"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
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
                  label="Item Quantity"
                  placeholder="01"
                  value={formData.itemQuantity}
                  onChange={(e) => handleInputChange('itemQuantity', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <TextField
                  label="Unit"
                  placeholder="01"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
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
                  label="Description"
                  placeholder="Type here"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  InputProps={{
                    sx: fieldStyles,
                  }}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments*
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center bg-white h-[45px] flex items-center justify-center">
                    <span className="text-sm text-gray-400">Upload files</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    &nbsp;
                  </label>
                  <Button 
                    type="button"
                    variant="outline"
                    className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white h-[45px] w-full"
                  >
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Detail Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#F2EEE9] border-b border-gray-200 flex items-center">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </div>
              <h2 className="text-lg font-semibold text-gray-900">VISITOR DETAIL</h2>
            </div>
            <div className="p-6 space-y-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  label="Visitor Name"
                  placeholder="Enter Name"
                  value={formData.visitorName}
                  onChange={(e) => handleInputChange('visitorName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
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
                  label="Mobile No."
                  placeholder="+91"
                  value={formData.mobileNo}
                  onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
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
                  label="Company Name"
                  placeholder="Lockated"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  label="Vehicle No."
                  placeholder="MH04BA-1009"
                  value={formData.vehicleNo}
                  onChange={(e) => handleInputChange('vehicleNo', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
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
                  label="Reporting Time"
                  placeholder="22:24 hrs"
                  value={formData.reportingTime}
                  onChange={(e) => handleInputChange('reportingTime', e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  InputProps={{
                    sx: fieldStyles,
                  }}
                />

                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Select Mode Of Transport</InputLabel>
                  <MuiSelect
                    value={formData.modeOfTransport}
                    onChange={(e) => handleInputChange('modeOfTransport', e.target.value)}
                    label="Select Mode Of Transport"
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Type Here</MenuItem>
                    <MenuItem value="car">Car</MenuItem>
                    <MenuItem value="bike">Bike</MenuItem>
                    <MenuItem value="truck">Truck</MenuItem>
                    <MenuItem value="walk">Walking</MenuItem>
                    <MenuItem value="bicycle">Bicycle</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="px-12 py-3 bg-[#C72030] hover:bg-[#A01928] text-white font-medium"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};