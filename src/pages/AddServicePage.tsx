
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

export const AddServicePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    serviceName: '',
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    group: '',
    subGroup: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleSubmit = (action: string) => {
    console.log('Service Data:', formData);
    console.log('Selected File:', selectedFile);
    console.log('Action:', action);
    
    toast({
      title: "Service Created",
      description: `Service has been ${action} successfully.`,
    });
    
    navigate('/maintenance/service');
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
        <p className="text-[#1a1a1a] opacity-70 mb-2">Service List &gt; Create Service</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">CREATE SERVICE</h1>
      </div>

      {/* Basic Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <TextField
                required
                label="Service Name"
                placeholder="Enter Service Name"
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
                <InputLabel id="site-select-label" shrink>Site</InputLabel>
                <MuiSelect
                  labelId="site-select-label"
                  label="Site"
                  displayEmpty
                  value={formData.site}
                  onChange={(e) => handleInputChange('site', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="tower-4">Tower 4</MenuItem>
                  <MenuItem value="sebc">SEBC</MenuItem>
                  <MenuItem value="hay">Hay</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="building-select-label" shrink>Building</InputLabel>
                <MuiSelect
                  labelId="building-select-label"
                  label="Building"
                  displayEmpty
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  <MenuItem value="wing2">Wing2</MenuItem>
                  <MenuItem value="main-building">Main Building</MenuItem>
                  <MenuItem value="annexe">Annexe</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-select-label"
                  label="Wing"
                  displayEmpty
                  value={formData.wing}
                  onChange={(e) => handleInputChange('wing', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Wing</em></MenuItem>
                  <MenuItem value="south">South</MenuItem>
                  <MenuItem value="north">North</MenuItem>
                  <MenuItem value="east">East</MenuItem>
                  <MenuItem value="west">West</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-select-label" shrink>Area</InputLabel>
                <MuiSelect
                  labelId="area-select-label"
                  label="Area"
                  displayEmpty
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Area</em></MenuItem>
                  <MenuItem value="lobby">Lobby</MenuItem>
                  <MenuItem value="office">Office</MenuItem>
                  <MenuItem value="cafeteria">Cafeteria</MenuItem>
                </MuiSelect>
              </FormControl>
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
                  <MenuItem value="101">Room 101</MenuItem>
                  <MenuItem value="102">Room 102</MenuItem>
                  <MenuItem value="conference">Conference Room</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="group-select-label" shrink>Group</InputLabel>
                <MuiSelect
                  labelId="group-select-label"
                  label="Group"
                  displayEmpty
                  value={formData.group}
                  onChange={(e) => handleInputChange('group', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Group</em></MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="subgroup-select-label" shrink>Sub-Group</InputLabel>
                <MuiSelect
                  labelId="subgroup-select-label"
                  label="Sub-Group"
                  displayEmpty
                  value={formData.subGroup}
                  onChange={(e) => handleInputChange('subGroup', e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub-Group</em></MenuItem>
                  <MenuItem value="electrical">Electrical</MenuItem>
                  <MenuItem value="plumbing">Plumbing</MenuItem>
                  <MenuItem value="hvac">HVAC</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Upload */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
            FILES UPLOAD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8">
            <div className="text-center">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10"
              >
                Choose File
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <Button 
          onClick={() => handleSubmit('saved with details')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & show details
        </Button>
        <Button 
          onClick={() => handleSubmit('saved with AMC')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Add AMC
        </Button>
        <Button 
          onClick={() => handleSubmit('saved with PPM')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Add PPM
        </Button>
        <Button 
          onClick={() => handleSubmit('created new service')}
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
