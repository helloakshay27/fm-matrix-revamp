import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

export const AddVisitorGatePage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  
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
    site: '',
    user: '',
    tower: '',
    gateName: '',
    gateDevice: ''
  });

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.site || !formData.user || !formData.tower || !formData.gateName || !formData.gateDevice) {
      toast.error('Please fill in all fields');
      return;
    }

    // Here you would typically submit to API
    toast.success('Visitor gate added successfully');
    navigate('/security/visitor-management/setup');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/security/visitor-management/setup')}
            className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">ADD VISITOR GATE</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gate Configuration Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-[#F2EEE9] border-b border-gray-200 flex items-center">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </div>
              <h2 className="text-lg font-semibold text-gray-900">GATE CONFIGURATION</h2>
            </div>
            <div className="p-6 space-y-6 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Site</InputLabel>
                  <MuiSelect
                    value={formData.site}
                    onChange={(e) => handleInputChange('site', e.target.value)}
                    label="Site"
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Select Site</MenuItem>
                    <MenuItem value="site1">Site 1</MenuItem>
                    <MenuItem value="site2">Site 2</MenuItem>
                    <MenuItem value="site3">Site 3</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>User</InputLabel>
                  <MuiSelect
                    value={formData.user}
                    onChange={(e) => handleInputChange('user', e.target.value)}
                    label="User"
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Select User</MenuItem>
                    <MenuItem value="user1">User 1</MenuItem>
                    <MenuItem value="user2">User 2</MenuItem>
                    <MenuItem value="user3">User 3</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ '& .MuiInputBase-root': fieldStyles }}
                >
                  <InputLabel shrink>Tower</InputLabel>
                  <MuiSelect
                    value={formData.tower}
                    onChange={(e) => handleInputChange('tower', e.target.value)}
                    label="Tower"
                    notched
                    displayEmpty
                  >
                    <MenuItem value="">Select Tower</MenuItem>
                    <MenuItem value="tower1">Tower 1</MenuItem>
                    <MenuItem value="tower2">Tower 2</MenuItem>
                    <MenuItem value="tower3">Tower 3</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Gate Name"
                  placeholder="Enter gate name"
                  value={formData.gateName}
                  onChange={(e) => handleInputChange('gateName', e.target.value)}
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
                  label="Gate Device"
                  placeholder="Enter gate device"
                  value={formData.gateDevice}
                  onChange={(e) => handleInputChange('gateDevice', e.target.value)}
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