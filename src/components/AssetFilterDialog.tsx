
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { X } from 'lucide-react';
import { useFilterData } from '@/hooks/useFilterData';

interface AssetFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: any) => void;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AssetFilterDialog: React.FC<AssetFilterDialogProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const {
    groups,
    subgroups,
    loadingGroups,
    loadingSubgroups,
    fetchSubgroups,
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loadingSites,
    loadingBuildings,
    loadingWings,
    loadingAreas,
    loadingFloors,
    loadingRooms,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms,
    resetLocationFromBuilding,
    resetLocationFromWing,
    resetLocationFromArea,
    resetLocationFromFloor,
    departments,
    users,
    loadingDepartments,
    loadingUsers,
  } = useFilterData();

  // Asset Details
  const [assetName, setAssetName] = useState('');
  const [assetId, setAssetId] = useState('');
  const [groupId, setGroupId] = useState<number | ''>('');
  const [subgroupId, setSubgroupId] = useState<number | ''>('');

  // Location Details
  const [siteId, setSiteId] = useState<number | ''>('');
  const [buildingId, setBuildingId] = useState<number | ''>('');
  const [wingId, setWingId] = useState<number | ''>('');
  const [areaId, setAreaId] = useState<number | ''>('');
  const [floorId, setFloorId] = useState<number | ''>('');
  const [roomId, setRoomId] = useState<number | ''>('');

  // Allocated To
  const [allocateTo, setAllocateTo] = useState<'department' | 'user'>('department');
  const [allocatedToId, setAllocatedToId] = useState<number | ''>('');

  // Handle group change and fetch subgroups
  const handleGroupChange = (value: number | '') => {
    setGroupId(value);
    setSubgroupId(''); // Reset subgroup
    if (value) {
      fetchSubgroups(value as number);
    }
  };

  // Handle site change and fetch buildings
  const handleSiteChange = (value: number | '') => {
    setSiteId(value);
    setBuildingId('');
    setWingId('');
    setAreaId('');
    setFloorId('');
    setRoomId('');
    resetLocationFromBuilding();
    if (value) {
      fetchBuildings(value as number);
    }
  };

  // Handle building change and fetch wings
  const handleBuildingChange = (value: number | '') => {
    setBuildingId(value);
    setWingId('');
    setAreaId('');
    setFloorId('');
    setRoomId('');
    resetLocationFromBuilding();
    if (value) {
      fetchWings(value as number);
    }
  };

  // Handle wing change and fetch areas
  const handleWingChange = (value: number | '') => {
    setWingId(value);
    setAreaId('');
    setFloorId('');
    setRoomId('');
    resetLocationFromWing();
    if (value) {
      fetchAreas(value as number);
    }
  };

  // Handle area change and fetch floors
  const handleAreaChange = (value: number | '') => {
    setAreaId(value);
    setFloorId('');
    setRoomId('');
    resetLocationFromArea();
    if (value) {
      fetchFloors(value as number);
    }
  };

  // Handle floor change and fetch rooms
  const handleFloorChange = (value: number | '') => {
    setFloorId(value);
    setRoomId('');
    resetLocationFromFloor();
    if (value) {
      fetchRooms(value as number);
    }
  };

  const handleSubmit = () => {
    const filters: any = {};
    
    // Asset Details
    if (assetName) filters['q[name_cont]'] = assetName;
    if (assetId) filters['q[id_eq]'] = assetId;
    if (groupId) filters['q[pms_asset_group_id_eq]'] = groupId;
    if (subgroupId) filters['q[pms_sub_group_id_eq]'] = subgroupId;
    
    // Location Details
    if (siteId) filters['q[pms_site_id_eq]'] = siteId;
    if (buildingId) filters['q[pms_building_id_eq]'] = buildingId;
    if (wingId) filters['q[pms_wing_id_eq]'] = wingId;
    if (areaId) filters['q[pms_area_id_eq]'] = areaId;
    if (floorId) filters['q[pms_floor_id_eq]'] = floorId;
    if (roomId) filters['q[pms_room_id_eq]'] = roomId;
    
    // Allocated To
    if (allocatedToId) {
      if (allocateTo === 'department') {
        filters['q[pms_department_id_eq]'] = allocatedToId;
      } else {
        filters['q[pms_user_id_eq]'] = allocatedToId;
      }
    }

    console.log('Apply filters:', filters);
    onApplyFilters?.(filters);
    onClose();
  };

  const handleReset = () => {
    setAssetName('');
    setAssetId('');
    setGroupId('');
    setSubgroupId('');
    setSiteId('');
    setBuildingId('');
    setWingId('');
    setAreaId('');
    setFloorId('');
    setRoomId('');
    setAllocateTo('department');
    setAllocatedToId('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Asset Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Asset Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Asset Name"
                placeholder="Enter Asset Name"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Asset ID"
                placeholder="Enter Asset ID"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="group-label" shrink>Group</InputLabel>
                <MuiSelect
                  labelId="group-label"
                  label="Group"
                  value={groupId}
                  onChange={(e) => handleGroupChange(e.target.value as number | '')}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingGroups}
                >
                  <MenuItem value=""><em>Select Group</em></MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="subgroup-label" shrink>Subgroup</InputLabel>
                <MuiSelect
                  labelId="subgroup-label"
                  label="Subgroup"
                  value={subgroupId}
                  onChange={(e) => setSubgroupId(e.target.value as number | '')}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingSubgroups || !groupId}
                >
                  <MenuItem value=""><em>Select Subgroup</em></MenuItem>
                  {subgroups.map((subgroup) => (
                    <MenuItem key={subgroup.id} value={subgroup.id}>
                      {subgroup.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="site-label" shrink>Site</InputLabel>
                <MuiSelect
                  labelId="site-label"
                  label="Site"
                  value={siteId}
                  onChange={(e) => handleSiteChange(e.target.value as number | '')}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingSites}
                >
                  <MenuItem value=""><em>Select Site</em></MenuItem>
                  {sites.map((site) => (
                    <MenuItem key={site.id} value={site.id}>
                      {site.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="building-label" shrink>Building</InputLabel>
                <MuiSelect
                  labelId="building-label"
                  label="Building"
                  value={buildingId}
                  onChange={(e) => handleBuildingChange(e.target.value as number | '')}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingBuildings || !siteId}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.building.id} value={building.building.id}>
                      {building.building.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="wing-label" shrink>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-label"
                  label="Wing"
                  value={wingId}
                  onChange={(e) => handleWingChange(e.target.value as number | '')}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingWings || !buildingId}
                >
                  <MenuItem value=""><em>Select Wing</em></MenuItem>
                  {wings.map((wing) => (
                    <MenuItem key={wing.wings.id} value={wing.wings.id}>
                      {wing.wings.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-label" shrink>Area</InputLabel>
                <MuiSelect
                  labelId="area-label"
                  label="Area"
                  value={areaId}
                  onChange={(e) => handleAreaChange(e.target.value as number | '')}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingAreas || !wingId}
                >
                  <MenuItem value=""><em>Select Area</em></MenuItem>
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="floor-label" shrink>Floor</InputLabel>
                <MuiSelect
                  labelId="floor-label"
                  label="Floor"
                  value={floorId}
                  onChange={(e) => handleFloorChange(e.target.value as number | '')}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingFloors || !areaId}
                >
                  <MenuItem value=""><em>Select Floor</em></MenuItem>
                  {floors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id}>
                      {floor.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="room-label" shrink>Room</InputLabel>
                <MuiSelect
                  labelId="room-label"
                  label="Room"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value as number | '')}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingRooms || !floorId}
                >
                  <MenuItem value=""><em>Select Room</em></MenuItem>
                  {rooms.map((room) => (
                    <MenuItem key={room.rooms.id} value={room.rooms.id}>
                      {room.rooms.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Allocated To Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Allocated To</h3>
            <div className="space-y-4">
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={allocateTo}
                  onChange={(e) => {
                    setAllocateTo(e.target.value as 'department' | 'user');
                    setAllocatedToId('');
                  }}
                >
                  <FormControlLabel value="department" control={<Radio />} label="Department" />
                  <FormControlLabel value="user" control={<Radio />} label="User" />
                </RadioGroup>
              </FormControl>
              
              <div className="grid grid-cols-1 gap-6">
                {allocateTo === 'department' ? (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="department-label" shrink>Department</InputLabel>
                    <MuiSelect
                      labelId="department-label"
                      label="Department"
                      value={allocatedToId}
                      onChange={(e) => setAllocatedToId(e.target.value as number | '')}
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingDepartments}
                    >
                      <MenuItem value=""><em>Select Department</em></MenuItem>
                      {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                ) : (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="user-label" shrink>User</InputLabel>
                    <MuiSelect
                      labelId="user-label"
                      label="User"
                      value={allocatedToId}
                      onChange={(e) => setAllocatedToId(e.target.value as number | '')}
                      displayEmpty
                      sx={fieldStyles}
                      disabled={loadingUsers}
                    >
                      <MenuItem value=""><em>Select User</em></MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.full_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="secondary" onClick={handleSubmit} className="flex-1 h-11">
              Submit
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1 h-11">
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
