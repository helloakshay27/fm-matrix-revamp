import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, CircularProgress } from '@mui/material';
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
} from '@/store/slices/serviceLocationSlice';

interface LocationSelectorProps {
  fieldStyles: any;
  onLocationChange?: (location: {
    siteId: number | null;
    buildingId: number | null;
    wingId: number | null;
    areaId: number | null;
    floorId: number | null;
    roomId: number | null;
    groupId: number | null;
    subGroupId: number | null;
  }) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ fieldStyles, onLocationChange }) => {
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

  // Load sites and groups on component mount
  useEffect(() => {
    dispatch(fetchSites());
    dispatch(fetchGroups());
  }, [dispatch]);

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
  }, [selectedSiteId, selectedBuildingId, selectedWingId, selectedAreaId, selectedFloorId, selectedRoomId, selectedGroupId, selectedSubGroupId, onLocationChange]);

  const handleSiteChange = (siteId: number) => {
    dispatch(setSelectedSite(siteId));
    if (siteId) {
      dispatch(fetchBuildings(siteId));
    }
  };

  const handleBuildingChange = (buildingId: number) => {
    dispatch(setSelectedBuilding(buildingId));
    if (buildingId) {
      const selectedBuilding = buildings.find(b => b.id === buildingId);
      if (selectedBuilding?.has_wing) {
        dispatch(fetchWings(buildingId));
      }
    }
  };

  const handleWingChange = (wingId: number) => {
    dispatch(setSelectedWing(wingId));
    if (wingId) {
      dispatch(fetchAreas(wingId));
    }
  };

  const handleAreaChange = (areaId: number) => {
    dispatch(setSelectedArea(areaId));
    if (areaId) {
      dispatch(fetchFloors(areaId));
    }
  };

  const handleFloorChange = (floorId: number) => {
    dispatch(setSelectedFloor(floorId));
    if (floorId) {
      dispatch(fetchRooms(floorId));
    }
  };

  const handleRoomChange = (roomId: number) => {
    dispatch(setSelectedRoom(roomId));
  };

  const handleGroupChange = (groupId: number) => {
    dispatch(setSelectedGroup(groupId));
    if (groupId) {
      dispatch(fetchSubGroups(groupId));
    }
  };

  const handleSubGroupChange = (subGroupId: number) => {
    dispatch(setSelectedSubGroup(subGroupId));
  };

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);

  return (
    <>
      {/* First Row: Site, Building, Wing, Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Site */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="site-select-label" shrink>Site</InputLabel>
            <MuiSelect
              labelId="site-select-label"
              label="Site"
              displayEmpty
              value={selectedSiteId || ''}
              onChange={(e) => handleSiteChange(Number(e.target.value))}
              sx={fieldStyles}
              disabled={loading.sites}
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
            {loading.sites && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <CircularProgress size={16} />
              </div>
            )}
          </FormControl>
        </div>

        {/* Building */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="building-select-label" shrink>Building</InputLabel>
            <MuiSelect
              labelId="building-select-label"
              label="Building"
              displayEmpty
              value={selectedBuildingId || ''}
              onChange={(e) => handleBuildingChange(Number(e.target.value))}
              sx={fieldStyles}
              disabled={!selectedSiteId || loading.buildings}
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
            {loading.buildings && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <CircularProgress size={16} />
              </div>
            )}
          </FormControl>
        </div>

        {/* Wing */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
            <MuiSelect
              labelId="wing-select-label"
              label="Wing"
              displayEmpty
              value={selectedWingId || ''}
              onChange={(e) => handleWingChange(Number(e.target.value))}
              sx={fieldStyles}
              disabled={!selectedBuildingId || !selectedBuilding?.has_wing || loading.wings}
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
            {loading.wings && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <CircularProgress size={16} />
              </div>
            )}
          </FormControl>
        </div>

        {/* Area */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="area-select-label" shrink>Area</InputLabel>
            <MuiSelect
              labelId="area-select-label"
              label="Area"
              displayEmpty
              value={selectedAreaId || ''}
              onChange={(e) => handleAreaChange(Number(e.target.value))}
              sx={fieldStyles}
              disabled={!selectedWingId || !selectedBuilding?.has_area || loading.areas}
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
            {loading.areas && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <CircularProgress size={16} />
              </div>
            )}
          </FormControl>
        </div>
      </div>

      {/* Second Row: Floor, Room */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Floor */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
            <MuiSelect
              labelId="floor-select-label"
              label="Floor"
              displayEmpty
              value={selectedFloorId || ''}
              onChange={(e) => handleFloorChange(Number(e.target.value))}
              sx={fieldStyles}
              disabled={!selectedAreaId || !selectedBuilding?.has_floor || loading.floors}
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
            {loading.floors && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <CircularProgress size={16} />
              </div>
            )}
          </FormControl>
        </div>

        {/* Room */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="room-select-label" shrink>Room</InputLabel>
            <MuiSelect
              labelId="room-select-label"
              label="Room"
              displayEmpty
              value={selectedRoomId || ''}
              onChange={(e) => handleRoomChange(Number(e.target.value))}
              sx={fieldStyles}
              disabled={!selectedFloorId || !selectedBuilding?.has_room || loading.rooms}
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
        </div>

        {/* Group */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="group-select-label" shrink>Group</InputLabel>
            <MuiSelect
              labelId="group-select-label"
              label="Group"
              displayEmpty
              value={selectedGroupId || ''}
              onChange={(e) => handleGroupChange(Number(e.target.value))}
              sx={fieldStyles}
              disabled={loading.groups}
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
        </div>

        {/* SubGroup */}
        <div>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="subgroup-select-label" shrink>Sub-Group</InputLabel>
            <MuiSelect
              labelId="subgroup-select-label"
              label="Sub-Group"
              displayEmpty
              value={selectedSubGroupId || ''}
              onChange={(e) => handleSubGroupChange(Number(e.target.value))}
              sx={fieldStyles}
              disabled={!selectedGroupId || loading.subGroups}
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
        </div>
      </div>
    </>
  );
};