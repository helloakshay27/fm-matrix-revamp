import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, CircularProgress, FormHelperText } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchService, updateService, clearError, resetServiceState } from '@/store/slices/serviceSlice';
import { fetchSites, fetchBuildings, fetchWings, fetchAreas, fetchFloors, fetchRooms, fetchGroups, fetchSubGroups } from '@/store/slices/serviceLocationSlice';

export const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
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
    groupName: '', // Added to store group_name for display
    subGroupName: '', // Added to store sub_group_name for display
  });

  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<
    { id: number; document: string; doctype: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    serviceName: false,
    executionType: false,
    umo: false,
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
        groupId: fetchedService.pms_asset_group_id || null,
        subGroupId: fetchedService.pms_asset_sub_group_id || null,
        description: fetchedService.description || '',
        serviceCategory: fetchedService.service_category || '',
        serviceGroup: fetchedService.service_group || '',
        serviceCode: fetchedService.service_code || '',
        extCode: fetchedService.ext_code || '',
        rateContractVendorCode: fetchedService.rate_contract_vendor_code || '',
        groupName: fetchedService.group_name || '',
        subGroupName: fetchedService.sub_group_name || '',
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

      if (fetchedService.site_id) {
        dispatch(fetchBuildings(fetchedService.site_id));
      }
      if (fetchedService.building_id) {
        dispatch(fetchWings(fetchedService.building_id));
      }
      if (fetchedService.wing_id) {
        dispatch(fetchAreas(fetchedService.wing_id));
      }
      if (fetchedService.area_id) {
        dispatch(fetchFloors(fetchedService.area_id));
      }
      if (fetchedService.floor_id) {
        dispatch(fetchRooms(fetchedService.floor_id));
      }
      if (fetchedService.pms_asset_group_id) {
        dispatch(fetchSubGroups(fetchedService.pms_asset_group_id));
      }
    }
  }, [fetchedService, dispatch]);

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

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'serviceName' && value && String(value).trim() !== '') {
      setErrors(prev => ({ ...prev, serviceName: false }));
    }
    if (field === 'executionType' && value !== '') {
      setErrors(prev => ({ ...prev, executionType: false }));
    }
    if (field === 'umo' && value && String(value).trim() !== '') {
      setErrors(prev => ({ ...prev, umo: false }));
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
      setErrors(prev => ({ ...prev, groupId: false }));
      dispatch(fetchSubGroups(Number(value)));
      setFormData(prev => ({ ...prev, subGroupId: null, subGroupName: '' }));
    }
    if (field === 'subGroupId' && value !== null) {
      setErrors(prev => ({ ...prev, subGroupId: false }));
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
    const hasUmoError = formData.umo.trim() === '';
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
        umo: hasUmoError,
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
      if (hasUmoError) errorFields.push('UMO');
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
      umo: false,
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
                <FormHelperText>Execution Type is required</FormHelperText>
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <FormControl fullWidth variant="outlined" error={errors.siteId}>
              <InputLabel id="site-select-label" shrink>Site</InputLabel>
              <MuiSelect
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
              <InputLabel id="building-select-label" shrink>Building</InputLabel>
              <MuiSelect
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
              <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
              <MuiSelect
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
              <InputLabel id="area-select-label" shrink>Area</InputLabel>
              <MuiSelect
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
              <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
              <MuiSelect
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

            <FormControl fullWidth variant="outlined" error={errors.groupId}>
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
                {formData.groupName && !groups.find(g => g.id === formData.groupId) && (
                  <MenuItem value={formData.groupId || ''}>
                    {formData.groupName}
                  </MenuItem>
                )}
                {Array.isArray(groups) && groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {errors.groupId && <FormHelperText>Group is required</FormHelperText>}
              {locationLoading.groups && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                  <CircularProgress size={16} />
                </div>
              )}
            </FormControl>

            <FormControl fullWidth variant="outlined" error={errors.subGroupId}>
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
                {formData.subGroupName && !subGroups.find(sg => sg.id === formData.subGroupId) && (
                  <MenuItem value={formData.subGroupId || ''}>
                    {formData.subGroupName}
                  </MenuItem>
                )}
                {Array.isArray(subGroups) && subGroups.map((subGroup) => (
                  <MenuItem key={subGroup.id} value={subGroup.id}>
                    {subGroup.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {errors.subGroupId && <FormHelperText>Sub-Group is required</FormHelperText>}
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