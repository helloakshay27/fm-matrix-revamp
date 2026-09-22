import React, { useEffect, useRef } from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, CircularProgress, FormHelperText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchSites,
  fetchBuildings,
  fetchWings,
  fetchAreas,
  fetchFloors,
  fetchRooms,
  fetchGroups,
  fetchSubGroups,
  setSelectedSite,
  setSelectedBuilding,
  setSelectedWing,
  setSelectedArea,
  setSelectedFloor,
  setSelectedRoom,
  setSelectedGroup,
  setSelectedSubGroup,
  clearAllSelections,
} from '@/store/slices/serviceLocationSlice';

interface LocationSelectorProps {
  fieldStyles: any;
  onLocationChange?: (location: {
    siteId: number | null;
    buildingId: number | null;
    wingId: number | null;
    areaId: null | number;
    floorId: null | number;
    roomId: null | number;
    groupId: null | number;
    subGroupId: null | number;
  }) => void;
  resetTrigger?: boolean;
  disabled?: boolean;
  errors?: {
    siteId?: boolean;
    buildingId?: boolean;
    wingId?: boolean;
    areaId?: boolean;
    floorId?: boolean;
    groupId?: boolean;
    subGroupId?: boolean;
  };
  helperTexts?: {
    siteId?: string;
    buildingId?: string;
    wingId?: string;
    areaId?: string;
    floorId?: string;
    groupId?: string;
    subGroupId?: string;
  };
  initialValues?: {
    siteId?: number | null;
    buildingId?: number | null;
    wingId?: number | null;
    areaId?: number | null;
    floorId?: number | null;
    roomId?: number | null;
    groupId?: number | null;
    subGroupId?: number | null;
  };
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  fieldStyles,
  onLocationChange,
  resetTrigger,
  disabled = false,
  errors = {
    siteId: false,
    buildingId: false,
    wingId: false,
    areaId: false,
    floorId: false,
    groupId: false,
    subGroupId: false,
  },
  helperTexts = {
    siteId: '',
    buildingId: '',
    wingId: '',
    areaId: '',
    floorId: '',
    groupId: '',
    subGroupId: '',
  },
  initialValues,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    groups,
    subGroups,
    selectedSiteId,
    selectedBuildingId,
    selectedWingId,
    selectedAreaId,
    selectedFloorId,
    selectedRoomId,
    selectedGroupId,
    selectedSubGroupId,
    loading,
  } = useSelector((state: RootState) => state.serviceLocation);

  const lastAppliedValues = useRef<string>('');

  // Apply initialValues to Redux store (for edit mode pre-population)
  useEffect(() => {
    if (!initialValues) return;
    const valuesKey = JSON.stringify(initialValues);
    if (valuesKey === lastAppliedValues.current) return;
    lastAppliedValues.current = valuesKey;

    if (initialValues.siteId) {
      dispatch(setSelectedSite(initialValues.siteId));
      dispatch(fetchBuildings(initialValues.siteId));
    }
    if (initialValues.buildingId) {
      dispatch(setSelectedBuilding(initialValues.buildingId));
      dispatch(fetchWings(initialValues.buildingId));
      dispatch(fetchAreas({ buildingId: initialValues.buildingId, wingId: initialValues.wingId || undefined }));
      dispatch(fetchFloors(initialValues.buildingId));
      dispatch(fetchRooms(initialValues.buildingId));
    } else {
      dispatch(fetchWings());
      dispatch(fetchAreas());
      dispatch(fetchFloors());
      dispatch(fetchRooms());
    }

    if (initialValues.wingId !== undefined) dispatch(setSelectedWing(initialValues.wingId));
    if (initialValues.areaId !== undefined) dispatch(setSelectedArea(initialValues.areaId));
    if (initialValues.floorId !== undefined) dispatch(setSelectedFloor(initialValues.floorId));
    if (initialValues.roomId !== undefined) dispatch(setSelectedRoom(initialValues.roomId));
    if (initialValues.groupId) {
      dispatch(setSelectedGroup(initialValues.groupId));
      dispatch(fetchSubGroups(initialValues.groupId));
    } else {
      dispatch(fetchSubGroups());
    }
    if (initialValues.subGroupId !== undefined) dispatch(setSelectedSubGroup(initialValues.subGroupId));
  }, [initialValues, dispatch]);

  // Load sites, groups, wings, areas, floors, rooms on component mount, and auto-select user's site
  useEffect(() => {
    dispatch(fetchSites());
    dispatch(fetchGroups());
    dispatch(fetchSubGroups());
    dispatch(fetchWings());
    dispatch(fetchAreas());
    dispatch(fetchFloors());
    dispatch(fetchRooms());

    const userSiteId = localStorage.getItem('selectedSiteId') || localStorage.getItem('siteId');
    if (userSiteId && !selectedSiteId && !initialValues?.siteId) {
      const siteId = Number(userSiteId);
      dispatch(setSelectedSite(siteId));
      dispatch(fetchBuildings(siteId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (resetTrigger) {
      dispatch(clearAllSelections());
      dispatch(fetchSites());
      dispatch(fetchGroups());
      dispatch(fetchSubGroups());
      dispatch(fetchWings());
      dispatch(fetchAreas());
      dispatch(fetchFloors());
      dispatch(fetchRooms());
    }
  }, [resetTrigger, dispatch]);

  // Trigger location change callback when selections change
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        siteId: selectedSiteId,
        buildingId: selectedBuildingId,
        wingId: selectedWingId,
        areaId: selectedAreaId,
        floorId: selectedFloorId,
        roomId: selectedRoomId,
        groupId: selectedGroupId,
        subGroupId: selectedSubGroupId,
      });
    }
  }, [
    selectedSiteId,
    selectedBuildingId,
    selectedWingId,
    selectedAreaId,
    selectedFloorId,
    selectedRoomId,
    selectedGroupId,
    selectedSubGroupId,
    onLocationChange,
  ]);

  const handleSiteChange = (siteId: number) => {
    dispatch(setSelectedSite(siteId));
    if (siteId) {
      dispatch(fetchBuildings(siteId));
    }
  };

  const handleBuildingChange = (buildingId: number) => {
    dispatch(setSelectedBuilding(buildingId || null));
    if (buildingId) {
      dispatch(fetchWings(buildingId));
      dispatch(fetchAreas({ buildingId }));
      dispatch(fetchFloors(buildingId));
      dispatch(fetchRooms(buildingId));
    }
  };

  const handleWingChange = (wingId: number) => {
    dispatch(setSelectedWing(wingId || null));
  };

  const handleAreaChange = (areaId: number) => {
    dispatch(setSelectedArea(areaId || null));
  };

  const handleFloorChange = (floorId: number) => {
    dispatch(setSelectedFloor(floorId || null));
  };

  const handleRoomChange = (roomId: number) => {
    dispatch(setSelectedRoom(roomId || null));
  };

  const handleGroupChange = (groupId: number) => {
    dispatch(setSelectedGroup(groupId || null));
    if (groupId) {
      dispatch(fetchSubGroups(groupId));
    }
  };

  const handleSubGroupChange = (subGroupId: number) => {
    dispatch(setSelectedSubGroup(subGroupId || null));
  };

  return (
    <div className="space-y-4">
      {/* First Row: Building, Wing, Area, Floor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Building */}
        <FormControl fullWidth variant="outlined" error={errors.buildingId}>
          <InputLabel id="building-select-label" shrink>
            Building<span className="text-red-500" style={{ color: '#C72030' }}>*</span>
          </InputLabel>
          <MuiSelect
            labelId="building-select-label"
            label="Building"
            displayEmpty
            value={selectedBuildingId || ''}
            onChange={(e) => handleBuildingChange(Number(e.target.value))}
            onOpen={() => {
              if (!buildings.length && selectedSiteId) dispatch(fetchBuildings(selectedSiteId));
            }}
            sx={fieldStyles}
            disabled={disabled || loading.buildings}
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
          {errors.buildingId && <FormHelperText>{helperTexts.buildingId}</FormHelperText>}
          {loading.buildings && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </FormControl>

        {/* Wing */}
        <FormControl fullWidth variant="outlined" error={errors.wingId}>
          <InputLabel id="wing-select-label" shrink>
            Wing
          </InputLabel>
          <MuiSelect
            labelId="wing-select-label"
            label="Wing"
            displayEmpty
            value={selectedWingId || ''}
            onChange={(e) => handleWingChange(Number(e.target.value))}
            onOpen={() => {
              if (!wings.length) {
                dispatch(selectedBuildingId ? fetchWings(selectedBuildingId) : fetchWings());
              }
            }}
            sx={fieldStyles}
            disabled={disabled || loading.wings}
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
          {errors.wingId && <FormHelperText>{helperTexts.wingId}</FormHelperText>}
          {loading.wings && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </FormControl>

        {/* Area */}
        <FormControl fullWidth variant="outlined" error={errors.areaId}>
          <InputLabel id="area-select-label" shrink>
            Area
          </InputLabel>
          <MuiSelect
            labelId="area-select-label"
            label="Area"
            displayEmpty
            value={selectedAreaId || ''}
            onChange={(e) => handleAreaChange(Number(e.target.value))}
            onOpen={() => {
              if (!areas.length) {
                dispatch(selectedBuildingId ? fetchAreas({ buildingId: selectedBuildingId }) : fetchAreas());
              }
            }}
            sx={fieldStyles}
            disabled={disabled || loading.areas}
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
          {errors.areaId && <FormHelperText>{helperTexts.areaId}</FormHelperText>}
          {loading.areas && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </FormControl>

        {/* Floor */}
        <FormControl fullWidth variant="outlined" error={errors.floorId}>
          <InputLabel id="floor-select-label" shrink>
            Floor
          </InputLabel>
          <MuiSelect
            labelId="floor-select-label"
            label="Floor"
            displayEmpty
            value={selectedFloorId || ''}
            onChange={(e) => handleFloorChange(Number(e.target.value))}
            onOpen={() => {
              if (!floors.length) {
                dispatch(selectedBuildingId ? fetchFloors(selectedBuildingId) : fetchFloors());
              }
            }}
            sx={fieldStyles}
            disabled={disabled || loading.floors}
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
          {errors.floorId && <FormHelperText>{helperTexts.floorId}</FormHelperText>}
          {loading.floors && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </FormControl>
      </div>

      {/* Second Row: Room, Group, Sub-Group, (Empty slot) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Room */}
        <FormControl fullWidth variant="outlined">
          <InputLabel id="room-select-label" shrink>Room</InputLabel>
          <MuiSelect
            labelId="room-select-label"
            label="Room"
            displayEmpty
            value={selectedRoomId || ''}
            onChange={(e) => handleRoomChange(Number(e.target.value))}
            onOpen={() => {
              if (!rooms.length) {
                dispatch(selectedBuildingId ? fetchRooms(selectedBuildingId) : fetchRooms());
              }
            }}
            sx={fieldStyles}
            disabled={disabled || loading.rooms}
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
          {loading.rooms && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </FormControl>

        {/* Group */}
        <FormControl fullWidth variant="outlined">
          <InputLabel id="group-select-label" shrink>Group</InputLabel>
          <MuiSelect
            labelId="group-select-label"
            label="Group"
            displayEmpty
            value={selectedGroupId || ''}
            onChange={(e) => handleGroupChange(Number(e.target.value))}
            onOpen={() => {
              if (!groups.length) dispatch(fetchGroups());
            }}
            sx={fieldStyles}
            disabled={disabled || loading.groups}
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
          {loading.groups && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </FormControl>

        {/* Sub-Group */}
        <FormControl fullWidth variant="outlined">
          <InputLabel id="subgroup-select-label" shrink>Sub-Group</InputLabel>
          <MuiSelect
            labelId="subgroup-select-label"
            label="Sub-Group"
            displayEmpty
            value={selectedSubGroupId || ''}
            onChange={(e) => handleSubGroupChange(Number(e.target.value))}
            onOpen={() => {
              if (!subGroups.length) {
                dispatch(selectedGroupId ? fetchSubGroups(selectedGroupId) : fetchSubGroups());
              }
            }}
            sx={fieldStyles}
            disabled={disabled || loading.subGroups}
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
          {loading.subGroups && (
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <CircularProgress size={16} />
            </div>
          )}
        </FormControl>

        {/* Empty slot for future expansion */}
        <div></div>
      </div>
    </div>
  );
};