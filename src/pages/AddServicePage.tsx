import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { LocationSelector } from '@/components/service/LocationSelector';
import axios from 'axios';
import { TOKEN } from '@/config/apiConfig';

export const AddServicePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    serviceName: '',
    executionType: '',
    serviceDescription: '',
    siteId: null as number | null,
    buildingId: null as number | null,
    wingId: null as number | null,
    areaId: null as number | null,
    floorId: null as number | null,
    roomId: null as number | null,
    groupId: null as number | null,
    subGroupId: null as number | null,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = useCallback((location: typeof formData) => {
    setFormData(prev => ({
      ...prev,
      ...location
    }));
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleSubmit = async (action: string) => {
    const sendData = new FormData();

    try {
      sendData.append('pms_service[service_name]', formData.serviceName);
      sendData.append('pms_service[site_id]', formData.siteId?.toString() || '');
      sendData.append('pms_service[building_id]', formData.buildingId?.toString() || '');
      sendData.append('pms_service[wing_id]', formData.wingId?.toString() || '');
      sendData.append('pms_service[area_id]', formData.areaId?.toString() || '');
      sendData.append('pms_service[floor_id]', formData.floorId?.toString() || '');
      sendData.append('pms_service[room_id]', formData.roomId?.toString() || '');
      sendData.append('pms_service[pms_asset_group_id]', formData.groupId?.toString() || '');
      sendData.append('pms_service[pms_asset_sub_group_id]', formData.subGroupId?.toString() || '');
      sendData.append('pms_service[active]', 'true');
      sendData.append('pms_service[description]', formData.serviceDescription || '');
      sendData.append('pms_service[execution_type]', formData.executionType || '');
      sendData.append('pms_service[service_category]', '');
      sendData.append('pms_service[service_group]', '');
      sendData.append('pms_service[service_code]', '');
      sendData.append('pms_service[ext_code]', '');
      sendData.append('pms_service[rate_contract_vendor_code]', '');
      sendData.append('subaction', 'save');

      selectedFiles.forEach(file => {
        sendData.append('attachments[]', file);
      });

      const response = await axios.post(
        'https://fm-uat-api.lockated.com/pms/services.json',
        sendData,
        {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
          },
        }
      );

      toast({
        title: "Service Created",
        description: `Service has been ${action} successfully.`,
      });

      navigate('/maintenance/service');
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive"
      });
    }
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/maintenance/service')}
            className="p-1 hover:bg-gray-100 mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">CREATE SERVICE</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <TextField
              required
              label="Service Name"
              placeholder="Enter Service Name"
              value={formData.serviceName}
              onChange={(e) => handleInputChange('serviceName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              required
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            >
              <InputLabel shrink>Execution Type</InputLabel>
              <MuiSelect
                value={formData.executionType}
                onChange={(e) => handleInputChange('executionType', e.target.value)}
                label="Execution Type"
                notched
                displayEmpty
              >
                <MenuItem value="">Select Execution Type</MenuItem>
                <MenuItem value="internal">Internal</MenuItem>
                <MenuItem value="external">External</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
          <LocationSelector fieldStyles={fieldStyles} onLocationChange={handleLocationChange} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
            SERVICE DESCRIPTION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TextField
            label="Service Description"
            value={formData.serviceDescription}
            onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              sx: {
                '& .MuiInputBase-input': {
                  padding: '12px',
                },
              }
            }}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
            FILES UPLOAD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-[#C72030] rounded-lg p-8">
            <div className="text-center">
              <input
                type="file"
                multiple
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
                Choose Files
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                {selectedFiles.length > 0
                  ? selectedFiles.map(file => file.name).join(', ')
                  : 'No files chosen'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          onClick={() => handleSubmit('saved with details')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & show details
        </Button>
        <Button
          onClick={() => handleSubmit('created new service')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Save & Create New Service
        </Button>
      </div>
    </div>
  );
};
