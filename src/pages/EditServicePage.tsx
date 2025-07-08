
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, TextareaAutosize } from '@mui/material';

export const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    serviceName: 'Cleaning Service',
    serviceCode: 'CS001',
    category: 'Housekeeping',
    description: 'Professional cleaning service',
    priority: 'Medium',
    estimatedTime: '2',
    cost: '150'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving service:', formData);
    navigate('/maintenance/service');
  };

  const handleCancel = () => {
    navigate('/maintenance/service');
  };

  const commonFieldStyles = {
    height: {
      xs: '36px',
      md: '45px'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      height: {
        xs: '36px',
        md: '45px'
      },
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
      fontSize: '16px',
      padding: {
        xs: '8px 14px',
        md: '12px 14px'
      },
      '&::placeholder': {
        color: '#999999',
        opacity: 1,
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-4 p-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Service</span>
          <span>&gt;</span>
          <span>Edit Service</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Service #{id}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TextField
                label="Service Name *"
                placeholder="Enter Name"
                value={formData.serviceName}
                onChange={(e) => handleInputChange('serviceName', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                sx={commonFieldStyles}
              />
            </div>
            <div>
              <TextField
                label="Service Code *"
                placeholder="Enter Code"
                value={formData.serviceCode}
                onChange={(e) => handleInputChange('serviceCode', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                sx={commonFieldStyles}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-select-label" shrink>Category</InputLabel>
                <MuiSelect
                  labelId="category-select-label"
                  label="Category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  sx={commonFieldStyles}
                >
                  <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="IT Support">IT Support</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="priority-select-label" shrink>Priority</InputLabel>
                <MuiSelect
                  labelId="priority-select-label"
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  sx={commonFieldStyles}
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TextField
                label="Estimated Time (hours)"
                placeholder="Enter time"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                type="number"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                sx={commonFieldStyles}
              />
            </div>
            <div>
              <TextField
                label="Cost"
                placeholder="Enter cost"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                type="number"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                sx={commonFieldStyles}
              />
            </div>
          </div>

          <div>
            <TextField
              label="Description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
              sx={{
                ...commonFieldStyles,
                '& .MuiOutlinedInput-root': {
                  ...commonFieldStyles['& .MuiOutlinedInput-root'],
                  height: 'auto',
                  minHeight: {
                    xs: '120px',
                    md: '140px'
                  }
                }
              }}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button 
              onClick={handleSave}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
