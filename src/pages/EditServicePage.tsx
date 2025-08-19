import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, File, FileSpreadsheet, FileText, Upload, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, CircularProgress, FormHelperText } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchService, updateService, clearError, resetServiceState } from '@/store/slices/serviceSlice';
import { fetchSites, fetchBuildings, fetchWings, fetchAreas, fetchFloors, fetchRooms, fetchGroups, fetchSubGroups } from '@/store/slices/serviceLocationSlice';
import { toast } from 'sonner';

export const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { loading, error, fetchedService, updatedService } = useAppSelector(state => state.serviceEdit);
  const {
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    groups,
    subGroups,
    loading: locationLoading
  } = useAppSelector(state => state.serviceLocation);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    serviceName: false,
    executionType: false,
    siteId: false,
    buildingId: false,
    wingId: false,
    areaId: false,
    floorId: false,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchService(id));
      dispatch(fetchSites());
      dispatch(fetchGroups());
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
        umo: fetchedService.base_uom || '',
        serviceDescription: fetchedService.description || '',
        siteId: fetchedService.site_id || null,
        buildingId: fetchedService.building_id || null,
        wingId: fetchedService.wing_id || null,
        areaId: fetchedService.area_id || null,
        floorId: fetchedService.floor_id || null,
        roomId: fetchedService.room_id || null,
        groupId: fetchedService.group_id || null,
        subGroupId: fetchedService.sub_group_id || null,
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

      // Fetch sub-groups when groupId is available from fetchedService
      if (fetchedService.group_id) {
        dispatch(fetchSubGroups(fetchedService.group_id));
      }

      if (fetchedService.site_id) dispatch(fetchBuildings(fetchedService.site_id));
      if (fetchedService.building_id) dispatch(fetchWings(fetchedService.building_id));
      if (fetchedService.wing_id) dispatch(fetchAreas(fetchedService.wing_id));
      if (fetchedService.area_id) dispatch(fetchFloors(fetchedService.area_id));
      if (fetchedService.floor_id) dispatch(fetchRooms(fetchedService.floor_id));
    }
  }, [fetchedService, dispatch]);
  useEffect(() => {
    if (error) {
      toast("error");
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  useEffect(() => {
    if (updatedService) {
      toast.success('Service updated successfully!');
      navigate('/maintenance/service/details/' + id);
    }
  }, [updatedService, toast, navigate]);

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'serviceName' && value && String(value).trim() !== '') {
      setErrors(prev => ({ ...prev, serviceName: false }));
    }
    if (field === 'executionType' && value !== '') {
      setErrors(prev => ({ ...prev, executionType: false }));
    }
    if (field === 'siteId' && value !== null) {
      setErrors(prev => ({ ...prev, siteId: false }));
      dispatch(fetchBuildings(Number(value)));
      setFormData(prev => ({ ...prev, buildingId: null, wingId: null, areaId: null, floorId: null, roomId: null }));
    }
    if (field === 'buildingId' && value !== null) {
      setErrors(prev => ({ ...prev, buildingId: false }));
      const selectedBuilding = buildings.find(b => b.id === value);
      if (selectedBuilding?.has_wing) {
        dispatch(fetchWings(Number(value)));
      }
      setFormData(prev => ({ ...prev, wingId: null, areaId: null, floorId: null, roomId: null }));
    }
    if (field === 'wingId' && value !== null) {
      setErrors(prev => ({ ...prev, wingId: false }));
      dispatch(fetchAreas(Number(value)));
      setFormData(prev => ({ ...prev, areaId: null, floorId: null, roomId: null }));
    }
    if (field === 'areaId' && value !== null) {
      setErrors(prev => ({ ...prev, areaId: false }));
      dispatch(fetchFloors(Number(value)));
      setFormData(prev => ({ ...prev, floorId: null, roomId: null }));
    }
    if (field === 'floorId' && value !== null) {
      setErrors(prev => ({ ...prev, floorId: false }));
      dispatch(fetchRooms(Number(value)));
      setFormData(prev => ({ ...prev, roomId: null }));
    }
    if (field === 'groupId' && value !== null) {
      dispatch(fetchSubGroups(Number(value)));
      setFormData(prev => ({ ...prev, subGroupId: null, subGroupName: '' }));
    }
  };

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

      toast(`Please fill in the following required fields: ${errorFields.join(', ')}`);

      setIsSubmitting(false);
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
      sendData.append('pms_service[execution_type]', formData.executionType);
      sendData.append('pms_service[base_uom]', formData.umo || '');
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
      sendData.append('subaction', 'save');

      selectedFile.forEach(file => {
        sendData.append('attachments[]', file);
      });

      await dispatch(updateService({ id, serviceData: sendData })).unwrap();
    } catch (error) {
      console.error('Error updating service:', error);
      toast("Failed to update service.");
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

  const selectedBuilding = buildings.find(b => b.id === formData.buildingId);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading service data...</div>
        </div>
      </div>
    );
  }

  const removeSelectedFile = (index: number) => {
    const updatedFiles = [...selectedFile];
    updatedFiles.splice(index, 1);
    setSelectedFile(updatedFiles);
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
              label={
                <>
                  Service Name<span style={{ color: '#C72030' }}>*</span>
                </>
              } value={formData.serviceName}
              onChange={(e) => handleInputChange('serviceName', e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.serviceName}
              helperText={errors.serviceName ? 'Service Name is required' : ''}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              disabled={isSubmitting}
            />
            <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }} error={errors.executionType}>
              <InputLabel shrink>
                Execution Type<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>              <MuiSelect
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
              </MuiSelect>
              {errors.executionType && (
                <FormHelperText>Execution Type is required</FormHelperText>
              )}
            </FormControl>
            <TextField
              label="UMO"
              placeholder="Enter UMO"
              value={formData.umo}
              onChange={(e) => handleInputChange('umo', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormControl fullWidth variant="outlined" error={errors.siteId}>
              <InputLabel id="site-select-label" shrink>
                Site<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>              <MuiSelect
                labelId="site-select-label"
                label="Site"
                value={formData.siteId || ''}
                onChange={(e) => handleInputChange('siteId', Number(e.target.value))}
                sx={fieldStyles}
                disabled={isSubmitting || locationLoading.sites}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Site</em>
                </MenuItem>
                {Array.isArray(sites) && sites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {errors.siteId && <FormHelperText>Site is required</FormHelperText>}
              {locationLoading.sites && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined" error={errors.buildingId}>
              <InputLabel id="building-select-label" shrink>
                Building<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>              <MuiSelect
                labelId="building-select-label"
                label="Building"
                displayEmpty
                value={formData.buildingId || ''}
                onChange={(e) => handleInputChange('buildingId', Number(e.target.value))}
                sx={fieldStyles}
                disabled={!formData.siteId || locationLoading.buildings || isSubmitting}
              >
                <MenuItem value="">
                  <em>Select Building</em>
                </MenuItem>
                {Array.isArray(buildings) && buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {errors.buildingId && <FormHelperText>Building is required</FormHelperText>}
              {locationLoading.buildings && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined" error={errors.wingId}>
              <InputLabel id="wing-select-label" shrink>
                Wing<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>              <MuiSelect
                labelId="wing-select-label"
                label="Wing"
                displayEmpty
                value={formData.wingId || ''}
                onChange={(e) => handleInputChange('wingId', Number(e.target.value))}
                sx={fieldStyles}
                disabled={!formData.buildingId || !selectedBuilding?.has_wing || locationLoading.wings || isSubmitting}
              >
                <MenuItem value="">
                  <em>Select Wing</em>
                </MenuItem>
                {Array.isArray(wings) && wings.map((wing) => (
                  <MenuItem key={wing.id} value={wing.id}>
                    {wing.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {errors.wingId && <FormHelperText>Wing is required</FormHelperText>}
              {locationLoading.wings && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined" error={errors.areaId}>
              <InputLabel id="area-select-label" shrink>
                Area<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>              <MuiSelect
                labelId="area-select-label"
                label="Area"
                displayEmpty
                value={formData.areaId || ''}
                onChange={(e) => handleInputChange('areaId', Number(e.target.value))}
                sx={fieldStyles}
                disabled={!formData.wingId || !selectedBuilding?.has_area || locationLoading.areas || isSubmitting}
              >
                <MenuItem value="">
                  <em>Select Area</em>
                </MenuItem>
                {Array.isArray(areas) && areas.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {errors.areaId && <FormHelperText>Area is required</FormHelperText>}
              {locationLoading.areas && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormControl fullWidth variant="outlined" error={errors.floorId}>
              <InputLabel id="floor-select-label" shrink>
                Floor<span style={{ color: '#C72030' }}>*</span>
              </InputLabel>              <MuiSelect
                labelId="floor-select-label"
                label="Floor"
                displayEmpty
                value={formData.floorId || ''}
                onChange={(e) => handleInputChange('floorId', Number(e.target.value))}
                sx={fieldStyles}
                disabled={!formData.areaId || !selectedBuilding?.has_floor || locationLoading.floors || isSubmitting}
              >
                <MenuItem value="">
                  <em>Select Floor</em>
                </MenuItem>
                {Array.isArray(floors) && floors.map((floor) => (
                  <MenuItem key={floor.id} value={floor.id}>
                    {floor.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {errors.floorId && <FormHelperText>Floor is required</FormHelperText>}
              {locationLoading.floors && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="room-select-label" shrink>Room</InputLabel>
              <MuiSelect
                labelId="room-select-label"
                label="Room"
                displayEmpty
                value={formData.roomId || ''}
                onChange={(e) => handleInputChange('roomId', Number(e.target.value))}
                sx={fieldStyles}
                disabled={!formData.floorId || !selectedBuilding?.has_room || locationLoading.rooms || isSubmitting}
              >
                <MenuItem value="">
                  <em>Select Room</em>
                </MenuItem>
                {Array.isArray(rooms) && rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {locationLoading.rooms && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="group-select-label" shrink>Group</InputLabel>
              <MuiSelect
                labelId="group-select-label"
                label="Group"
                displayEmpty
                value={formData.groupId || ''}
                onChange={(e) => handleInputChange('groupId', Number(e.target.value))}
                sx={fieldStyles}
                disabled={locationLoading.groups || isSubmitting}
              >
                <MenuItem value="">
                  <em>Select Group</em>
                </MenuItem>
                {Array.isArray(groups) && groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {locationLoading.groups && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="subgroup-select-label" shrink>Sub-Group</InputLabel>
              <MuiSelect
                labelId="subgroup-select-label"
                label="Sub-Group"
                displayEmpty
                value={formData.subGroupId || ''}
                onChange={(e) => handleInputChange('subGroupId', Number(e.target.value))}
                sx={fieldStyles}
                disabled={!formData.groupId || locationLoading.subGroups || isSubmitting}
              >
                <MenuItem value="">
                  <em>Select Sub-Group</em>
                </MenuItem>
                {Array.isArray(subGroups) && subGroups.map((subGroup) => (
                  <MenuItem key={subGroup.id} value={subGroup.id}>
                    {subGroup.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {locationLoading.subGroups && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>
          </div>
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
              multiple
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#C72030] font-medium text-sm">
                Choose File
              </span>
              <span className="text-gray-500 text-sm">
                {selectedFile.length > 0 ? `${selectedFile.length} file(s) selected` : 'No file chosen'}
              </span>
            </div>

            <Button
              type="button"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="!bg-[#f6f4ee] !text-[#C72030] !border-none text-sm flex items-center justify-center"
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload Files
            </Button>
          </div>

          {(existingFiles.length > 0 || selectedFile.length > 0) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {/* EXISTING FILES */}
              {existingFiles.map((file) => {
                const fileName = file.document?.split('/').pop() || '';
                const isImage = file.doctype?.startsWith('image');
                const isPdf = fileName.endsWith('.pdf');
                const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
                const isWord = fileName.endsWith('.doc') || fileName.endsWith('.docx');

                const handleDownload = async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const baseUrl = localStorage.getItem('baseUrl');
                    if (!token || !baseUrl) return;

                    const apiUrl = `https://${baseUrl}/attachfiles/${file.id}?show_file=true`;

                    const response = await fetch(apiUrl, {
                      method: 'GET',
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    });

                    if (!response.ok) throw new Error('Download failed');

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Document_${file.id}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    const fallbackLink = document.createElement('a');
                    fallbackLink.href = file.document;
                    fallbackLink.download = fileName;
                    document.body.appendChild(fallbackLink);
                    fallbackLink.click();
                    document.body.removeChild(fallbackLink);
                  }
                };

                return (
                  <div
                    key={file.id}
                    className="relative flex flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm hover:shadow-md transition"
                  >
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 text-gray-600 hover:text-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* File Icon */}
                    {isImage ? (
                      <img
                        src={file.document}
                        alt="Existing"
                        className="w-[40px] h-[40px] object-cover rounded border mb-1"
                      />
                    ) : isPdf ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : isExcel ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                    ) : isWord ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-blue-700 bg-white mb-1">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-500 bg-white mb-1">
                        <File className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-[10px] text-center truncate max-w-[100px] mb-1">
                      {fileName}
                    </span>
                  </div>
                );
              })}

              {/* SELECTED FILES */}
              {selectedFile.map((file, index) => {
                const isImage = file.type.startsWith('image');
                const isPdf = file.type === 'application/pdf';
                const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                const isWord = file.name.endsWith('.doc') || file.name.endsWith('.docx');
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
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : isExcel ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                    ) : isWord ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-blue-700 bg-white mb-1">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-[40px] h-[40px] flex items-center justify-center bg-gray-100 border rounded text-gray-500 mb-1">
                        <File className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-[10px] text-center truncate max-w-[100px] mb-1">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-4 w-4 p-0 text-gray-600"
                      onClick={() => removeSelectedFile(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
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
      </div>
    </div>
  );
};

export default EditServicePage;