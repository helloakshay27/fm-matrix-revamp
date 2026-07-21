import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { toast } from 'sonner';
import { fetchBuildings } from '@/store/slices/serviceFilterSlice';
import {
  fetchWings as fetchWingsLoc,
  fetchAreas as fetchAreasLoc,
  fetchFloors as fetchFloorsLoc,
  fetchRooms as fetchRoomsLoc,
} from '@/store/slices/locationSlice';
import type { RootState, AppDispatch } from '@/store/store';

interface ServiceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}


export const ServiceFilterModal = ({ isOpen, onClose, onApply }: ServiceFilterModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const serviceFilterState = useSelector((state: RootState) => state.serviceFilter);
  const locationState = useSelector((state: RootState) => state.location);
  const { buildings = [], loading = { buildings: false, areas: false }, error = { buildings: null, areas: null } } = serviceFilterState || {};
  const wingsData = locationState?.wings?.data || [];
  const wingsLoading = locationState?.wings?.loading || false;
  const areasData = locationState?.areas?.data || [];
  const areasLoading = locationState?.areas?.loading || false;
  const floorsData = locationState?.floors?.data || [];
  const floorsLoading = locationState?.floors?.loading || false;
  const roomsData = locationState?.rooms?.data || [];
  const roomsLoading = locationState?.rooms?.loading || false;

  const [filters, setFilters] = useState({
    serviceName: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: ''
  });

  // All fields are optional; no validation errors tracked

  useEffect(() => {
    if (isOpen && buildings.length === 0) {
      dispatch(fetchBuildings(1)); // Default siteId = 1
    }
  }, [isOpen, dispatch, buildings.length]);

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'building') {
        // reset downstream
        updated.wing = '';
        updated.area = '';
        updated.floor = '';
        updated.room = '';
        if (value) {
          const buildingId = parseInt(value);
          if (!isNaN(buildingId)) {
            dispatch(fetchWingsLoc(buildingId));
          }
        }
      }

      if (field === 'wing') {
        // reset below
        updated.area = '';
        updated.floor = '';
        updated.room = '';
        const buildingId = parseInt(prev.building);
        const wingId = parseInt(value);
        if (!isNaN(buildingId) && !isNaN(wingId)) {
          dispatch(fetchAreasLoc({ buildingId, wingId }));
        }
      }

      if (field === 'area') {
        // reset below
        updated.floor = '';
        updated.room = '';
        const buildingId = parseInt(prev.building);
        const wingId = parseInt(prev.wing);
        const areaId = parseInt(value);
        if (!isNaN(buildingId) && !isNaN(areaId)) {
          dispatch(fetchFloorsLoc({ buildingId, wingId: isNaN(wingId) ? 0 as unknown as number : wingId, areaId }));
        }
      }

      if (field === 'floor') {
        // reset below
        updated.room = '';
        const buildingId = parseInt(prev.building);
        const wingId = parseInt(prev.wing);
        const areaId = parseInt(prev.area);
        const floorId = parseInt(value);
        if (!isNaN(buildingId) && !isNaN(floorId)) {
          dispatch(fetchRoomsLoc({
            buildingId,
            wingId: isNaN(wingId) ? 0 as unknown as number : wingId,
            areaId: isNaN(areaId) ? 0 as unknown as number : areaId,
            floorId,
          }));
        }
      }

      return updated;
    });
  };

  const handleApply = () => {
    // No mandatory validations; apply filters as-is
    onApply(filters);
  toast.success('Filter applied');
    handleClose();
  };

  const handleReset = () => {
    setFilters({
      serviceName: '',
      building: '',
      wing: '',
      area: '',
      floor: '',
      room: ''
    });
    onApply({});
  };

  const handleClose = () => {
    setFilters({
      serviceName: '',
      building: '',
      wing: '',
      area: '',
      floor: '',
      room: ''
    });
    onClose();
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    backgroundColor: 'white',
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
      backgroundColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'white',
    }
  };

  const menuProps = {
    PaperProps: {
      style: {
        maxHeight: 200,
        backgroundColor: 'white',
        zIndex: 9999,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    disablePortal: false,
    disableAutoFocus: true,
    disableEnforceFocus: true,
  };

  // Helpers to safely render list options even if backend keys vary
  const unwrap = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;
    // Only treat as wrapper if the object has exactly one of the known wrapper keys
    const wrapperKeys = ['areas', 'area', 'buildings', 'building', 'wing', 'wings'];
    const keys = Object.keys(obj);
    const soleWrapperKey = wrapperKeys.find((k) => k in obj && keys.length === 1);
    if (soleWrapperKey && typeof obj[soleWrapperKey] === 'object') return obj[soleWrapperKey];
    return obj;
  };

  const getIdStr = (item: any, candidates: string[]): string | null => {
    const src = unwrap(item);
    for (const key of candidates) {
      const v = src?.[key];
      if (v !== undefined && v !== null && v !== '') return String(v);
    }
    return null;
  };

  const getLabel = (item: any, candidates: string[], fallback: string | null): string => {
    const src = unwrap(item);
    for (const key of candidates) {
      const v = src?.[key];
      if (typeof v === 'string' && v.trim()) return v;
    }
    return fallback ?? '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }} modal={false}>
      <DialogContent className="max-w-2xl" aria-describedby="filter-dialog-description">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Details */}
          <div>
            <h3 className="text-[14px] text-[#C72030] font-medium mb-4">Service Details</h3>
            <div className="space-y-4">
              <TextField
                label="Service Name"
                placeholder="Enter Service Name"
                name="serviceName"
                value={filters.serviceName}
                onChange={(e) => {
                  handleInputChange('serviceName', e.target.value);
                }}
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

          {/* Location Details */}
          <div>
            <h3 className="font-medium mb-4 text-[14px] text-[#C72030]">Location Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="building-select-label" shrink sx={{ backgroundColor: 'white', px: 1 }}>Building</InputLabel>
                <MuiSelect
                  labelId="building-select-label"
                  label="Building"
                  displayEmpty
                  value={filters.building}
                  onChange={(e) => {
                    handleInputChange('building', e.target.value as string);
                  }}
                  sx={fieldStyles}
                  MenuProps={menuProps}
                  disabled={loading.buildings}
                >
                  <MenuItem value="" sx={{ backgroundColor: 'white', px: 1 }}><em>Select Building</em></MenuItem>
                  {loading.buildings ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Loading...
                    </MenuItem>
                  ) : (
                    (Array.isArray(buildings) ? buildings : [])
                      .map((building) => {
                        const idStr = getIdStr(building, ['id', 'building_id', 'value']);
                        if (!idStr) return null;
                        const label = getLabel(building, ['name', 'building_name', 'label'], idStr);
                        return (
                          <MenuItem key={idStr} value={idStr}>
                            {label}
                          </MenuItem>
                        );
                      })
                      .filter(Boolean)
                  )}
                </MuiSelect>
              </FormControl>

              {/* Wing */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="wing-select-label" shrink sx={{ backgroundColor: 'white', px: 1 }}>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-select-label"
                  label="Wing"
                  displayEmpty
                  value={filters.wing}
                  onChange={(e) => {
                    handleInputChange('wing', e.target.value as string);
                  }}
                  sx={fieldStyles}
                  MenuProps={menuProps}
                  disabled={!filters.building || wingsLoading}
                >
                  <MenuItem value=""><em>Wing</em></MenuItem>
                  {wingsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Loading...
                    </MenuItem>
                  ) : !filters.building ? (
                    <MenuItem disabled>
                      <em>Select a building first</em>
                    </MenuItem>
                  ) : (
                    (Array.isArray(wingsData) ? wingsData : [])
                      .map((wing) => {
                        const idStr = getIdStr(wing, ['id', 'wing_id', 'value']);
                        if (!idStr) return null;
                        const label = getLabel(wing, ['name', 'wing_name', 'label'], idStr);
                        return (
                          <MenuItem key={idStr} value={idStr}>
                            {label}
                          </MenuItem>
                        );
                      })
                      .filter(Boolean)
                  )}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-select-label" shrink sx={{ backgroundColor: 'white', px: 1 }}>Area</InputLabel>
                <MuiSelect
                  labelId="area-select-label"
                  label="Area"
                  displayEmpty
                  value={filters.area}
                  onChange={(e) => {
                    handleInputChange('area', e.target.value as string);
                  }}
                  sx={fieldStyles}
                  MenuProps={menuProps}
                  disabled={areasLoading || !filters.building || !filters.wing}
                >
                  <MenuItem value=""><em>Area</em></MenuItem>
                  {areasLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Loading...
                    </MenuItem>
                  ) : !filters.building ? (
                    <MenuItem disabled>
                      <em>Select a building first</em>
                    </MenuItem>
                  ) : !filters.wing ? (
                    <MenuItem disabled>
                      <em>Select a wing first</em>
                    </MenuItem>
                  ) : (
                    (Array.isArray(areasData) ? areasData : [])
                      .map((area) => {
                        const idStr = getIdStr(area, ['id', 'area_id', 'value']);
                        if (!idStr) return null;
                        const label = getLabel(area, ['name', 'area_name', 'label'], idStr);
                        return (
                          <MenuItem key={idStr} value={idStr}>
                            {label}
                          </MenuItem>
                        );
                      })
                      .filter(Boolean)
                  )}
                </MuiSelect>
              </FormControl>

              {/* Floor */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="floor-select-label" shrink sx={{ backgroundColor: 'white', px: 1 }}>Floor</InputLabel>
                <MuiSelect
                  labelId="floor-select-label"
                  label="Floor"
                  displayEmpty
                  value={filters.floor}
                  onChange={(e) => {
                    handleInputChange('floor', e.target.value as string);
                  }}
                  sx={fieldStyles}
                  MenuProps={menuProps}
                  disabled={floorsLoading || !filters.area}
                >
                  <MenuItem value=""><em>Floor</em></MenuItem>
                  {floorsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Loading...
                    </MenuItem>
                  ) : !filters.area ? (
                    <MenuItem disabled>
                      <em>Select an area first</em>
                    </MenuItem>
                  ) : (
                    (Array.isArray(floorsData) ? floorsData : [])
                      .map((floor) => {
                        const idStr = getIdStr(floor, ['id', 'floor_id', 'value']);
                        if (!idStr) return null;
                        const label = getLabel(floor, ['name', 'floor_name', 'label'], idStr);
                        return (
                          <MenuItem key={idStr} value={idStr}>
                            {label}
                          </MenuItem>
                        );
                      })
                      .filter(Boolean)
                  )}
                </MuiSelect>
              </FormControl>

              {/* Room */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="room-select-label" shrink sx={{ backgroundColor: 'white', px: 1 }}>Room</InputLabel>
                <MuiSelect
                  labelId="room-select-label"
                  label="Room"
                  displayEmpty
                  value={filters.room}
                  onChange={(e) => {
                    handleInputChange('room', e.target.value as string);
                  }}
                  sx={fieldStyles}
                  MenuProps={menuProps}
                  disabled={roomsLoading || !filters.floor}
                >
                  <MenuItem value=""><em>Room</em></MenuItem>
                  {roomsLoading ? (
                    <MenuItem disabled>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      Loading...
                    </MenuItem>
                  ) : !filters.floor ? (
                    <MenuItem disabled>
                      <em>Select a floor first</em>
                    </MenuItem>
                  ) : (
                    (Array.isArray(roomsData) ? roomsData : [])
                      .map((room) => {
                        const idStr = getIdStr(room, ['id', 'room_id', 'value']);
                        if (!idStr) return null;
                        const label = getLabel(room, ['name', 'room_name', 'unit_name', 'label'], idStr);
                        return (
                          <MenuItem key={idStr} value={idStr}>
                            {label}
                          </MenuItem>
                        );
                      })
                      .filter(Boolean)
                  )}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
