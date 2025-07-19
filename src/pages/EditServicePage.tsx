import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { LocationSelector } from '@/components/service/LocationSelector';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchService, updateService, clearError, resetServiceState } from '@/store/slices/serviceSlice';

export const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { loading, error, fetchedService, updatedService } = useAppSelector(state => state.serviceEdit);
  
  const [formData, setFormData] = useState({
    serviceName: '',
    siteId: null as number | null,
    buildingId: null as number | null,
    wingId: null as number | null,
    areaId: null as number | null,
    floorId: null as number | null,
    roomId: null as number | null,
    groupId: null as number | null,
    subGroupId: null as number | null,
    description: '',
    serviceCategory: '',
    serviceGroup: '',
    serviceCode: '',
    extCode: '',
    rateContractVendorCode: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch existing service data
  useEffect(() => {
    if (id) {
      dispatch(fetchService(id));
    }
    
    return () => {
      dispatch(resetServiceState());
    };
  }, [id, dispatch]);

  // Handle fetched service data
  useEffect(() => {
    if (fetchedService) {
      setFormData({
        serviceName: fetchedService.service_name || '',
        siteId: fetchedService.site_id || null,
        buildingId: fetchedService.building_id || null,
        wingId: fetchedService.wing_id || null,
        areaId: fetchedService.area_id || null,
        floorId: fetchedService.floor_id || null,
        roomId: fetchedService.room_id || null,
        groupId: fetchedService.pms_asset_group_id || null,
        subGroupId: fetchedService.pms_asset_sub_group_id || null,
        description: fetchedService.description || '',
        serviceCategory: fetchedService.service_category || '',
        serviceGroup: fetchedService.service_group || '',
        serviceCode: fetchedService.service_code || '',
        extCode: fetchedService.ext_code || '',
        rateContractVendorCode: fetchedService.rate_contract_vendor_code || '',
      });
    }
  }, [fetchedService]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  // Handle successful update
  useEffect(() => {
    if (updatedService) {
      toast({
        title: "Service Updated",
        description: "Service has been updated successfully.",
      });
      navigate('/maintenance/service');
    }
  }, [updatedService, toast, navigate]);

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
    groupId: number | null;
    subGroupId: number | null;
  }) => {
    setFormData(prev => ({
      ...prev,
      siteId: location.siteId,
      buildingId: location.buildingId,
      wingId: location.wingId,
      areaId: location.areaId,
      floorId: location.floorId,
      roomId: location.roomId,
      groupId: location.groupId,
      subGroupId: location.subGroupId,
    }));
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', file.name);
    }
  };

  const handleSubmit = async (action: string) => {
    if (!id) return;

    const serviceData = {
      service_name: formData.serviceName || "",
      site_id: formData.siteId,
      building_id: formData.buildingId,
      wing_id: formData.wingId,
      area_id: formData.areaId,
      floor_id: formData.floorId,
      room_id: formData.roomId,
      pms_asset_group_id: formData.groupId,
      pms_asset_sub_group_id: formData.subGroupId,
      active: true,
      description: formData.description || "",
      service_category: formData.serviceCategory || "",
      service_group: formData.serviceGroup || "",
      service_code: formData.serviceCode || "",
      ext_code: formData.extCode || "",
      rate_contract_vendor_code: formData.rateContractVendorCode || ""
    };

    dispatch(updateService({ id, serviceData }));
  };

  // Responsive styles for TextField and Select
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading service data...</div>
        </div>
      </div>
    );
  }

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
        <p className="text-[#1a1a1a] opacity-70 mb-2">Service List &gt; Edit Service</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT SERVICE - ID: {id}</h1>
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
          onClick={() => handleSubmit('updated with details')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Update & show details
        </Button>
        <Button 
          onClick={() => handleSubmit('updated with AMC')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Update & Add AMC
        </Button>
        <Button 
          onClick={() => handleSubmit('updated with PPM')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Update & Add PPM
        </Button>
        <Button 
          onClick={() => handleSubmit('updated service')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          Update Service
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

export default EditServicePage;