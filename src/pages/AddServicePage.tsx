
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { LocationSelector } from '@/components/service/LocationSelector';

export const AddServicePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    serviceName: '',
    siteId: null as number | null,
    buildingId: null as number | null,
    wingId: null as number | null,
    areaId: null as number | null,
    floorId: null as number | null,
    roomId: null as number | null,
    group: '',
    subGroup: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = useCallback((location: {
    siteId: number | null;
    buildingId: number | null;
    wingId: number | null;
    areaId: number | null;
    floorId: number | null;
    roomId: number | null;
  }) => {
    setFormData(prev => ({
      ...prev,
      siteId: location.siteId,
      buildingId: location.buildingId,
      wingId: location.wingId,
      areaId: location.areaId,
      floorId: location.floorId,
      roomId: location.roomId,
    }));
  }, []);

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
          </div>

          {/* Dynamic Location Selector */}
          <LocationSelector 
            fieldStyles={fieldStyles} 
            onLocationChange={handleLocationChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
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
          <div className="border-2 border-dashed border-[#C72030] rounded-lg p-8">
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
