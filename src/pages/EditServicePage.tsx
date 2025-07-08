
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Folder } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const EditServicePage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceCode: '',
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('Selected files:', files);
    // handle file logic
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    // Submit to backend
  };

  // Common styles for MUI fields with responsive heights
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
      fontSize: '14px',
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

  return (
    <div className="p-4 sm:p-6 md:p-8 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#1a1a1a]">
        Edit Service - ID: {id}
      </h1>

      {/* Basic Details Section */}
      <div className="bg-white rounded-lg border mb-8 p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-semibold text-[#C72030]">BASIC DETAILS</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <TextField
              label="Service Name"
              placeholder="Enter service name"
              value={formData.serviceName}
              onChange={(e) => handleInputChange('serviceName', e.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyles}
            />
          </div>

          <div className="flex flex-col">
            <TextField
              label="Service Code"
              placeholder="Enter service code"
              value={formData.serviceCode}
              onChange={(e) => handleInputChange('serviceCode', e.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyles}
            />
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="site-select-label" shrink>Site</InputLabel>
              <MuiSelect
                labelId="site-select-label"
                label="Site"
                displayEmpty
                value={formData.site}
                onChange={(e) => handleInputChange('site', e.target.value)}
              >
                <MenuItem value=""><em>Select Site</em></MenuItem>
                <MenuItem value="site1">Site 1</MenuItem>
                <MenuItem value="site2">Site 2</MenuItem>
                <MenuItem value="site3">Site 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="building-select-label" shrink>Building</InputLabel>
              <MuiSelect
                labelId="building-select-label"
                label="Building"
                displayEmpty
                value={formData.building}
                onChange={(e) => handleInputChange('building', e.target.value)}
              >
                <MenuItem value=""><em>Select Building</em></MenuItem>
                <MenuItem value="building1">Building 1</MenuItem>
                <MenuItem value="building2">Building 2</MenuItem>
                <MenuItem value="building3">Building 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
              <MuiSelect
                labelId="wing-select-label"
                label="Wing"
                displayEmpty
                value={formData.wing}
                onChange={(e) => handleInputChange('wing', e.target.value)}
              >
                <MenuItem value=""><em>Select Wing</em></MenuItem>
                <MenuItem value="wing1">Wing 1</MenuItem>
                <MenuItem value="wing2">Wing 2</MenuItem>
                <MenuItem value="wing3">Wing 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="area-select-label" shrink>Area</InputLabel>
              <MuiSelect
                labelId="area-select-label"
                label="Area"
                displayEmpty
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
              >
                <MenuItem value=""><em>Select Area</em></MenuItem>
                <MenuItem value="area1">Area 1</MenuItem>
                <MenuItem value="area2">Area 2</MenuItem>
                <MenuItem value="area3">Area 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
              <MuiSelect
                labelId="floor-select-label"
                label="Floor"
                displayEmpty
                value={formData.floor}
                onChange={(e) => handleInputChange('floor', e.target.value)}
              >
                <MenuItem value=""><em>Select Floor</em></MenuItem>
                <MenuItem value="floor1">Floor 1</MenuItem>
                <MenuItem value="floor2">Floor 2</MenuItem>
                <MenuItem value="floor3">Floor 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="flex flex-col">
            <FormControl variant="outlined" sx={fieldStyles}>
              <InputLabel id="room-select-label" shrink>Room</InputLabel>
              <MuiSelect
                labelId="room-select-label"
                label="Room"
                displayEmpty
                value={formData.room}
                onChange={(e) => handleInputChange('room', e.target.value)}
              >
                <MenuItem value=""><em>Select Room</em></MenuItem>
                <MenuItem value="room1">Room 1</MenuItem>
                <MenuItem value="room2">Room 2</MenuItem>
                <MenuItem value="room3">Room 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="sm:col-span-2 flex justify-end mt-4">
            <Button type="submit" className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* File Upload Section */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
            <Folder className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-semibold text-[#C72030]">FILES UPLOAD</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <TextField
              label="Upload Service File"
              type="file"
              variant="outlined"
              inputProps={{ multiple: true }}
              onChange={handleFileUpload}
              InputLabelProps={{
                shrink: true,
              }}
              sx={fieldStyles}
            />
          </div>
          <div className="flex justify-end">
            <Button className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditServicePage;
