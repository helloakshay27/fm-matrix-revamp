import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileIcon, FileSpreadsheet, FileText, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { LocationSelector } from '@/components/service/LocationSelector';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { createService, resetServiceState } from '@/store/slices/serviceSlice';

export const AddServicePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    serviceName: '',
    executionType: '',
    umo: '',
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
  const [resetLocationFields, setResetLocationFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<'show' | 'new' | null>(null);


  const [errors, setErrors] = useState({
    serviceName: false,
    executionType: false,
    siteId: false,
    buildingId: false,
    wingId: false,
    areaId: false,
    floorId: false,
  });

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'serviceName' && value.toString().trim() !== '') {
      setErrors(prev => ({ ...prev, serviceName: false }));
    }
    if (field === 'executionType' && value !== '') {
      setErrors(prev => ({ ...prev, executionType: false }));
    }
    if (field === 'siteId' && value !== null) {
      setErrors(prev => ({ ...prev, siteId: false }));
    }
    if (field === 'buildingId' && value !== null) {
      setErrors(prev => ({ ...prev, buildingId: false }));
    }
    if (field === 'wingId' && value !== null) {
      setErrors(prev => ({ ...prev, wingId: false }));
    }
    if (field === 'areaId' && value !== null) {
      setErrors(prev => ({ ...prev, areaId: false }));
    }
    if (field === 'floorId' && value !== null) {
      setErrors(prev => ({ ...prev, floorId: false }));
    }
  };

  const handleLocationChange = useCallback((location: typeof formData) => {
    setFormData(prev => ({
      ...prev,
      ...location
    }));
    setErrors(prev => ({
      ...prev,
      siteId: location.siteId !== null ? false : prev.siteId,
      buildingId: location.buildingId !== null ? false : prev.buildingId,
      wingId: location.wingId !== null ? false : prev.wingId,
      areaId: location.areaId !== null ? false : prev.areaId,
      floorId: location.floorId !== null ? false : prev.floorId,
    }));
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setSelectedFiles(prevFiles => {
        const existingNames = new Set(prevFiles.map(f => f.name));
        const filteredNewFiles = newFiles.filter(f => !existingNames.has(f.name));
        return [...prevFiles, ...filteredNewFiles];
      });
      event.target.value = '';
    }
  };

  const handleSubmit = async (action: 'show' | 'new') => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmittingAction(action);

    const hasServiceNameError = formData.serviceName.trim() === '';
    const hasExecutionTypeError = formData.executionType === '';
    const hasSiteIdError = formData.siteId === null;
    const hasBuildingIdError = formData.buildingId === null;
    const hasWingIdError = formData.wingId === null;
    const hasAreaIdError = formData.areaId === null;
    const hasFloorIdError = formData.floorId === null;

    if (
      hasServiceNameError ||
      hasExecutionTypeError ||
      hasSiteIdError ||
      hasBuildingIdError ||
      hasWingIdError ||
      hasAreaIdError ||
      hasFloorIdError
    ) {
      setErrors({
        serviceName: hasServiceNameError,
        executionType: hasExecutionTypeError,
        siteId: hasSiteIdError,
        buildingId: hasBuildingIdError,
        wingId: hasWingIdError,
        areaId: hasAreaIdError,
        floorId: hasFloorIdError,
      });

      const errorFields = [];
      if (hasServiceNameError) errorFields.push('Service Name');
      if (hasExecutionTypeError) errorFields.push('Execution Type');
      if (hasSiteIdError) errorFields.push('Site');
      if (hasBuildingIdError) errorFields.push('Building');
      if (hasWingIdError) errorFields.push('Wing');
      if (hasAreaIdError) errorFields.push('Area');
      if (hasFloorIdError) errorFields.push('Floor');

      toast.info(`Please fill in the following required fields: ${errorFields.join(', ')}`, {
        duration: 5000,
      });

      setIsSubmitting(false);
      setSubmittingAction(null);
      return;
    }

    setErrors({
      serviceName: false,
      executionType: false,
      siteId: false,
      buildingId: false,
      wingId: false,
      areaId: false,
      floorId: false,
    });

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
      sendData.append('pms_service[base_uom]', formData.umo || '');
      sendData.append('pms_service[service_category]', '');
      sendData.append('pms_service[service_group]', '');
      sendData.append('pms_service[service_code]', '');
      sendData.append('pms_service[ext_code]', '');
      sendData.append('pms_service[rate_contract_vendor_code]', '');
      sendData.append('subaction', 'save');

      selectedFiles.forEach((file) => {
        sendData.append('attachments[]', file);
      });

      const response = await dispatch(createService(sendData)).unwrap();
      console.log('Service creation response:', response);

      if (action === 'show') {
        toast.success('Service has been created and saved with details.', {
          duration: 3000,
        });

        setTimeout(() => {
          window.location.href = `/maintenance/service/details/${response.id}`;
        }, 1500);
      } else if (action === 'new') {
        toast.success('Service created successfully! Ready to add a new service.', {
          duration: 3000,
        });

        setTimeout(() => {
          setFormData({
            serviceName: '',
            executionType: '',
            umo: '',
            serviceDescription: '',
            siteId: null,
            buildingId: null,
            wingId: null,
            areaId: null,
            floorId: null,
            roomId: null,
            groupId: null,
            subGroupId: null,
          });
          setSelectedFiles([]);
          setResetLocationFields(true);
          dispatch(resetServiceState());
          setTimeout(() => setResetLocationFields(false), 300);
        }, 500);
      }
    } catch (error: any) {
      console.error('Error creating service:', error.message || error);
      toast.error(`Failed to create service: ${error.message || 'Unknown error'}`, {
        duration: 5000,
        style: { background: '#f44336', color: '#fff' },
      });
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const removeSelectedFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className="p-6 relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}
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
        <h1 className="text-2xl font-bold text-[#1a1a1a]">CREATE SERVICE</h1>
      </div>

      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Service Name Field */}
            <TextField
              label={
                <>
                  Service Name<span className="text-red-600">*</span>
                </>
              }
              placeholder="Enter Service Name"
              value={formData.serviceName}
              onChange={(e) => handleInputChange('serviceName', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.serviceName}
              helperText={errors.serviceName ? 'Service Name is required' : ''}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
              disabled={isSubmitting}
            />

            {/* Execution Type Select */}
            <FormControl
              fullWidth
              variant="outlined"
              error={errors.executionType}
              sx={{ '& .MuiInputBase-root': fieldStyles }}
            >
              <InputLabel shrink>
                Execution Type<span className="text-red-600">*</span>
              </InputLabel>
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

            {/* UMO Field (Not required, no red asterisk) */}
            <TextField
              label="UMO"
              placeholder="Enter UMO"
              value={formData.umo}
              onChange={(e) => handleInputChange('umo', e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              InputProps={{
                sx: fieldStyles,
              }}
              disabled={isSubmitting}
            />
          </div>

          <LocationSelector
            fieldStyles={fieldStyles}
            onLocationChange={handleLocationChange}
            resetTrigger={resetLocationFields}
            errors={{
              siteId: errors.siteId,
              buildingId: errors.buildingId,
              wingId: errors.wingId,
              areaId: errors.areaId,
              floorId: errors.floorId,
            }}
            helperTexts={{
              siteId: errors.siteId ? 'Site is required' : '',
              buildingId: errors.buildingId ? 'Building is required' : '',
              wingId: errors.wingId ? 'Wing is required' : '',
              areaId: errors.areaId ? 'Area is required' : '',
              floorId: errors.floorId ? 'Floor is required' : '',
            }}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
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
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className="bg-[#F6F4EE] mb-4">
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
            FILES UPLOAD
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-center gap-2 mb-4">
              <span
                className="text-[#C72030] font-medium"
                style={{ fontSize: '14px' }}
              >
                Choose File
              </span>
              <span className="text-gray-500" style={{ fontSize: '14px' }}>
                {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'No file chosen'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => document.getElementById('file-upload')?.click()}
              className={`bg-[#f6f4ee] text-[#C72030] px-4 py-2 rounded text-sm flex items-center justify-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              <span className="text-lg mr-2">+</span> Upload Files
            </button>

          </div>

          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {selectedFiles.map((file, index) => {
                const isImage = file.type.startsWith('image/');
                const isPdf = file.type === 'application/pdf';
                const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                const fileURL = URL.createObjectURL(file);

                return (
                  <div
                    key={`${file.name}-${file.lastModified}`}
                    className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
                  >
                    {isImage ? (
                      <img
                        src={fileURL}
                        alt={file.name}
                        className="w-[40px] h-[40px] object-cover rounded border mb-1"
                      />
                    ) : isPdf ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                        <FileText className="w-5 h-5" />
                      </div>
                    ) : isExcel ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-600 bg-white mb-1">
                        <FileIcon className="w-5 h-5" />
                      </div>
                    )}

                    <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                    <button
                      type="button"
                      className="absolute top-1 right-1 text-gray-600 hover:text-red-600 p-0"
                      onClick={() => removeSelectedFile(index)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>



      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          onClick={() => handleSubmit('show')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting && submittingAction === 'show' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save & show details'
          )}
        </Button>
        <Button
          onClick={() => handleSubmit('new')}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90 flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting && submittingAction === 'new' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save & Create New Service'
          )}
        </Button>
      </div>
    </div>
  );
};