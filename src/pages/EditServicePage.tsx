import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

export const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  // Pre-populate with existing service data
  const [formData, setFormData] = useState({
    serviceName: 'test',
    site: 'Lockated',
    building: 'Tower 4',
    wing: 'Wing2',
    area: 'South',
    floor: '',
    room: '',
    group: 'Electrical',
    subGroup: 'AC, AV, Electrical'
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleSaveAndShowDetails = () => {
    console.log('Saving service and showing details:', formData);
    toast({
      title: "Success",
      description: "Service updated successfully!",
    });
    navigate(`/maintenance/service/details/${id}`);
  };

  const handleSaveAndAddAMC = () => {
    console.log('Saving service and adding AMC:', formData);
    toast({
      title: "Success",
      description: "Service updated and redirecting to AMC setup!",
    });
  };

  const handleSaveAndAddPPM = () => {
    console.log('Saving service and adding PPM:', formData);
    toast({
      title: "Success",
      description: "Service updated and redirecting to PPM setup!",
    });
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving service and creating new:', formData);
    toast({
      title: "Success",
      description: "Service updated! Creating new service...",
    });
    navigate('/maintenance/service/add');
  };

  // Responsive styles for TextField and Select
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/service')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service List
        </Button>
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Service List > Edit Service</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT SERVICE</h1>
        </div>
      </div>

      {/* Basic Details */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
              👤
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">BASIC DETAILS</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <TextField
                  required
                  label="Service Name"
                  placeholder="Enter service name"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={(e) => handleInputChange('serviceName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    sx: fieldStyles
                  }}
                />
              </div>
              
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
                  <MuiSelect
                    labelId="floor-select-label"
                    label="Floor"
                    displayEmpty
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Floor</em></MenuItem>
                    <MenuItem value="ground">Ground Floor</MenuItem>
                    <MenuItem value="first">First Floor</MenuItem>
                    <MenuItem value="second">Second Floor</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="site-select-label" shrink>Site</InputLabel>
                  <MuiSelect
                    labelId="site-select-label"
                    label="Site"
                    value={formData.site}
                    onChange={(e) => handleInputChange('site', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="lockated">Lockated</MenuItem>
                    <MenuItem value="tower4">Tower 4</MenuItem>
                    <MenuItem value="sebc">SEBC</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="room-select-label" shrink>Room</InputLabel>
                  <MuiSelect
                    labelId="room-select-label"
                    label="Room"
                    displayEmpty
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Room</em></MenuItem>
                    <MenuItem value="room101">Room 101</MenuItem>
                    <MenuItem value="room102">Room 102</MenuItem>
                    <MenuItem value="room201">Room 201</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="building-select-label" shrink>Building</InputLabel>
                  <MuiSelect
                    labelId="building-select-label"
                    label="Building"
                    value={formData.building}
                    onChange={(e) => handleInputChange('building', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="tower4">Tower 4</MenuItem>
                    <MenuItem value="wing2">Wing2</MenuItem>
                    <MenuItem value="main">Main Building</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="group-select-label" shrink>Group</InputLabel>
                  <MuiSelect
                    labelId="group-select-label"
                    label="Group"
                    value={formData.group}
                    onChange={(e) => handleInputChange('group', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="electrical">Electrical</MenuItem>
                    <MenuItem value="mechanical">Mechanical</MenuItem>
                    <MenuItem value="plumbing">Plumbing</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
                  <MuiSelect
                    labelId="wing-select-label"
                    label="Wing"
                    value={formData.wing}
                    onChange={(e) => handleInputChange('wing', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="wing2">Wing2</MenuItem>
                    <MenuItem value="south">South</MenuItem>
                    <MenuItem value="north">North</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="subgroup-select-label" shrink>Sub-Group</InputLabel>
                  <MuiSelect
                    labelId="subgroup-select-label"
                    label="Sub-Group"
                    value={formData.subGroup}
                    onChange={(e) => handleInputChange('subGroup', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="ac-av-electrical">AC, AV, Electrical</MenuItem>
                    <MenuItem value="hvac">HVAC</MenuItem>
                    <MenuItem value="fire-safety">Fire Safety</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ maxWidth: '50%' }}>
                <InputLabel id="area-select-label" shrink>Area</InputLabel>
                <MuiSelect
                  labelId="area-select-label"
                  label="Area"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value="south">South</MenuItem>
                  <MenuItem value="north">North</MenuItem>
                  <MenuItem value="east">East</MenuItem>
                  <MenuItem value="west">West</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>
      </div>

      {/* Files Upload */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
              📁
            </div>
            <h2 className="text-lg font-semibold text-[#C72030]">FILES UPLOAD</h2>
          </div>
          
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="service-file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label 
              htmlFor="service-file-upload" 
              className="text-orange-500 hover:text-orange-600 cursor-pointer"
            >
              Choose File
            </label>
            <div className="text-sm text-gray-500 mt-2">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button 
          onClick={handleSaveAndShowDetails}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & show details
        </Button>
        <Button 
          onClick={handleSaveAndAddAMC}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Add AMC
        </Button>
        <Button 
          onClick={handleSaveAndAddPPM}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Add PPM
        </Button>
        <Button 
          onClick={handleSaveAndCreateNew}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Create New Service
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};