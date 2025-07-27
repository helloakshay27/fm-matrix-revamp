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
    executionType: '',
    umo: '', // Added UMO field
    serviceDescription: '',
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

  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<
    { id: number; document: string; doctype: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added to prevent multiple submissions

  const [errors, setErrors] = useState({
    serviceName: false,
    executionType: false,
    umo: false, // Added UMO error field
    siteId: false,
    buildingId: false,
    wingId: false,
    areaId: false,
    floorId: false,
    groupId: false,
    subGroupId: false,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchService(id));
    }
    return () => {
      dispatch(resetServiceState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (fetchedService) {
      setFormData({
        serviceName: fetchedService.service_name || '',
        executionType: fetchedService.execution_type || '',
        umo: fetchedService.base_umo || '', // Added UMO initialization
        serviceDescription: fetchedService.description || '',
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

      if (Array.isArray(fetchedService.documents)) {
        setExistingFiles(
          fetchedService.documents.map((doc: any) => ({
            id: doc.id,
            document: doc.document,
            doctype: doc.doctype,
          }))
        );
      }
    }
  }, [fetchedService]);

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

    // Clear errors for the field being updated
    if (field === 'serviceName' && value.trim() !== '') {
      setErrors(prev => ({ ...prev, serviceName: false }));
    }
    if (field === 'executionType' && value !== '') {
      setErrors(prev => ({ ...prev, executionType: false }));
    }
    if (field === 'umo' && value.trim() !== '') { // Added UMO error clearing
      setErrors(prev => ({ ...prev, umo: false }));
    }
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
    // Clear errors for location fields when valid values are provided
    setErrors(prev => ({
      ...prev,
      siteId: location.siteId !== null ? false : prev.siteId,
      buildingId: location.buildingId !== null ? false : prev.buildingId,
      wingId: location.wingId !== null ? false : prev.wingId,
      areaId: location.areaId !== null ? false : prev.areaId,
      floorId: location.floorId !== null ? false : prev.floorId,
      groupId: location.groupId !== null ? false : prev.groupId,
      subGroupId: location.subGroupId !== null ? false : prev.subGroupId,
    }));
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFile(prevFiles => {
        const existingNames = new Set(prevFiles.map(f => f.name));
        const filteredNewFiles = newFiles.filter(f => !existingNames.has(f.name));
        return [...prevFiles, ...filteredNewFiles];
      });
      event.target.value = '';
    }
  };

  const handleSubmit = async (action: string) => {
    if (!id || isSubmitting) return;
    setIsSubmitting(true);

    // Validation
    const hasServiceNameError = formData.serviceName.trim() === '';
    const hasExecutionTypeError = formData.executionType === '';
    const hasUmoError = formData.umo.trim() === ''; // Added UMO validation
    const hasSiteIdError = formData.siteId === null;
    const hasBuildingIdError = formData.buildingId === null;
    const hasWingIdError = formData.wingId === null;
    const hasAreaIdError = formData.areaId === null;
    const hasFloorIdError = formData.floorId === null;
    const hasGroupIdError = formData.groupId === null;
    const hasSubGroupIdError = formData.subGroupId === null;

    if (
      hasServiceNameError ||
      hasExecutionTypeError ||
      hasUmoError ||
      hasSiteIdError ||
      hasBuildingIdError ||
      hasWingIdError ||
      hasAreaIdError ||
      hasFloorIdError ||
      hasGroupIdError ||
      hasSubGroupIdError
    ) {
      setErrors({
        serviceName: hasServiceNameError,
        executionType: hasExecutionTypeError,
        umo: hasUmoError, // Added UMO error setting
        siteId: hasSiteIdError,
        buildingId: hasBuildingIdError,
        wingId: hasWingIdError,
        areaId: hasAreaIdError,
        floorId: hasFloorIdError,
        groupId: hasGroupIdError,
        subGroupId: hasSubGroupIdError,
      });

      const errorFields = [];
      if (hasServiceNameError) errorFields.push('Service Name');
      if (hasExecutionTypeError) errorFields.push('Execution Type');
      if (hasUmoError) errorFields.push('UMO'); // Added UMO error field
      if (hasSiteIdError) errorFields.push('Site');
      if (hasBuildingIdError) errorFields.push('Building');
      if (hasWingIdError) errorFields.push('Wing');
      if (hasAreaIdError) errorFields.push('Area');
      if (hasFloorIdError) errorFields.push('Floor');
      if (hasGroupIdError) errorFields.push('Group');
      if (hasSubGroupIdError) errorFields.push('Sub-Group');

      toast({
        title: "Validation Error",
        description: `Please fill in the following required fields: ${errorFields.join(', ')}`,
        variant: "destructive",
        duration: 5000,
      });

      setIsSubmitting(false);
      return;
    }

    setErrors({
      serviceName: false,
      executionType: false,
      umo: false, // Added UMO error reset
      siteId: false,
      buildingId: false,
      wingId: false,
      areaId: false,
      floorId: false,
      groupId: false,
      subGroupId: false,
    });

    const sendData = new FormData();
    try {
      sendData.append('pms_service[service_name]', formData.serviceName);
      sendData.append('pms_service[execution_type]', formData.executionType);
      sendData.append('pms_service[base_uom]', formData.umo || ''); // Added UMO to FormData
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
      sendData.append('pms_service[service_category]', formData.serviceCategory || '');
      sendData.append('pms_service[service_group]', formData.serviceGroup || '');
      sendData.append('pms_service[service_code]', formData.serviceCode || '');
      sendData.append('pms_service[ext_code]', formData.extCode || '');
      sendData.append('pms_service[rate_contract_vendor_code]', formData.rateContractVendorCode || '');
      sendData.append('subaction', "save");

      selectedFile.forEach(file => {
        sendData.append('attachments[]', file);
      });

      await dispatch(updateService({ id, serviceData: sendData })).unwrap();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/maintenance/service')}
            className="p-1 hover:bg-gray-100 mr-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT SERVICE - ID: {id}</h1>
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
              value={formData.serviceName}
              onChange={(e) => handleInputChange('serviceName', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.serviceName}
              helperText={errors.serviceName ? 'Service Name is required' : ''}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              disabled={isSubmitting}
            />
            <FormControl fullWidth variant="outlined" required sx={{ '& .MuiInputBase-root': fieldStyles }} error={errors.executionType}>
              <InputLabel shrink>Execution Type</InputLabel>
              <MuiSelect
                value={formData.executionType}
                onChange={(e) => handleInputChange('executionType', e.target.value)}
                label="Execution Type"
                notched
                displayEmpty
                disabled={isSubmitting}
              >
                <MenuItem value="">Select Execution Type</MenuItem>
                <MenuItem value="internal">Internal</MenuItem>
                <MenuItem value="external">External</MenuItem>
                <MenuItem value="both">Both</MenuItem>
              </MuiSelect>
              {errors.executionType && (
                <p className="text-red-600 text-xs mt-1">Execution Type is required</p>
              )}
            </FormControl>
            <TextField
              required
              label="UMO"
              placeholder="Enter UMO"
              value={formData.umo}
              onChange={(e) => handleInputChange('umo', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.umo}
              helperText={errors.umo ? 'UMO is required' : ''}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              disabled={isSubmitting}
            />
          </div>
          <LocationSelector
            fieldStyles={fieldStyles}
            onLocationChange={handleLocationChange}
            errors={{
              siteId: errors.siteId,
              buildingId: errors.buildingId,
              wingId: errors.wingId,
              areaId: errors.areaId,
              floorId: errors.floorId,
              groupId: errors.groupId,
              subGroupId: errors.subGroupId,
            }}
            helperTexts={{
              siteId: errors.siteId ? 'Site is required' : '',
              buildingId: errors.buildingId ? 'Building is required' : '',
              wingId: errors.wingId ? 'Wing is required' : '',
              areaId: errors.areaId ? 'Area is required' : '',
              floorId: errors.floorId ? 'Floor is required' : '',
              groupId: errors.groupId ? 'Group is required' : '',
              subGroupId: errors.subGroupId ? 'Sub-Group is required' : '',
            }}
            disabled={isSubmitting}
          />
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
              sx: { '& .MuiInputBase-input': { padding: '12px' } }
            }}
            disabled={isSubmitting}
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
          <div className="border-2 border-dashed border-[#C72030] rounded-lg p-8 text-center">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              multiple
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className={`text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              Choose Files
            </Button>
            <span className="ml-2 text-gray-500">
              {selectedFile.length > 0 ? `${selectedFile.length} file(s) selected` : 'No new file chosen'}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {/* Existing files */}
            {existingFiles.map((file) => (
              <div key={file.id}>
                {file.doctype.startsWith('image') ? (
                  <img
                    src={file.document}
                    alt="Existing"
                    className="h-32 w-full object-cover border rounded"
                  />
                ) : (
                  <a
                    href={file.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-blue-600"
                  >
                    {file.document.split('/').pop()}
                  </a>
                )}
              </div>
            ))}
            {/* Selected files */}
            {selectedFile.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}`}>
                {file.type.startsWith('image') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Selected"
                    className="h-32 w-full object-cover border rounded"
                  />
                ) : (
                  <p className="text-sm truncate">{file.name}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          onClick={() => handleSubmit('updated with details')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
          disabled={isSubmitting}
        >
          Update Save & Show Details
        </Button>
        <Button
          onClick={() => handleSubmit('updated new service')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
          disabled={isSubmitting}
        >
          Update Save & Create New Service
        </Button>
      </div>
    </div>
  );
};

export default EditServicePage;