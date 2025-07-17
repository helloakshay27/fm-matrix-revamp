
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, CircularProgress } from '@mui/material';
import { X } from 'lucide-react';
import { useFilterData } from '@/hooks/useFilterData';

interface AssetFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Record<string, string>) => void;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AssetFilterDialog: React.FC<AssetFilterDialogProps> = ({ isOpen, onClose, onApplyFilters }) => {
  // Asset Details filters
  const [assetName, setAssetName] = useState('');
  const [assetId, setAssetId] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedSubgroup, setSelectedSubgroup] = useState('');
  
  // Location Details filters
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  // Get filter data and loading states
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
    clearDependentData,
  } = useFilterData();

  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedSubgroup('');
    clearDependentData('group');
    if (value) {
      fetchSubgroups(parseInt(value));
    }
  };

  const handleSiteChange = (value: string) => {
    setSelectedSite(value);
    setSelectedBuilding('');
    setSelectedWing('');
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    clearDependentData('site');
    if (value) {
      fetchBuildings(parseInt(value));
    }
  };

  const handleBuildingChange = (value: string) => {
    setSelectedBuilding(value);
    setSelectedWing('');
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    clearDependentData('building');
    if (value) {
      fetchWings(parseInt(value));
    }
  };

  const handleWingChange = (value: string) => {
    setSelectedWing(value);
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    clearDependentData('wing');
    if (value) {
      fetchAreas(parseInt(value));
    }
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setSelectedFloor('');
    setSelectedRoom('');
    clearDependentData('area');
    if (value) {
      fetchFloors(parseInt(value));
    }
  };

  const handleFloorChange = (value: string) => {
    setSelectedFloor(value);
    setSelectedRoom('');
    clearDependentData('floor');
    if (value) {
      fetchRooms(parseInt(value));
    }
  };

  const handleApply = () => {
    const filters: Record<string, string> = {};
    
    // Asset Details filters
    if (assetName) filters['q[name_cont]'] = assetName;
    if (assetId) filters['q[id_eq]'] = assetId;
    if (selectedGroup) filters['q[pms_asset_group_id_eq]'] = selectedGroup;
    if (selectedSubgroup) filters['q[pms_sub_group_id_eq]'] = selectedSubgroup;
    
    // Location Details filters
    if (selectedSite) filters['q[pms_site_id_eq]'] = selectedSite;
    if (selectedBuilding) filters['q[pms_building_id_eq]'] = selectedBuilding;
    if (selectedWing) filters['q[pms_wing_id_eq]'] = selectedWing;
    if (selectedArea) filters['q[pms_area_id_eq]'] = selectedArea;
    if (selectedFloor) filters['q[pms_floor_id_eq]'] = selectedFloor;
    if (selectedRoom) filters['q[pms_room_id_eq]'] = selectedRoom;
    
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    // Reset Asset Details
    setAssetName('');
    setAssetId('');
    setSelectedGroup('');
    setSelectedSubgroup('');
    
    // Reset Location Details
    setSelectedSite('');
    setSelectedBuilding('');
    setSelectedWing('');
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    
    // Clear dependent data
    clearDependentData('group');
    clearDependentData('site');
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
                  value={selectedGroup}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingGroups}
                >
                  <MenuItem value=""><em>Select Group</em></MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id.toString()}>
                      {group.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingGroups && (
                  <CircularProgress size={20} style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="subgroup-label" shrink>Subgroup</InputLabel>
                <MuiSelect
                  labelId="subgroup-label"
                  label="Subgroup"
                  value={selectedSubgroup}
                  onChange={(e) => setSelectedSubgroup(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={!selectedGroup || loadingSubgroups}
                >
                  <MenuItem value=""><em>Select Subgroup</em></MenuItem>
                  {subgroups.map((subgroup) => (
                    <MenuItem key={subgroup.id} value={subgroup.id.toString()}>
                      {subgroup.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingSubgroups && (
                  <CircularProgress size={20} style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }} />
                )}
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
                  value={selectedSite}
                  onChange={(e) => handleSiteChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Site</em></MenuItem>
                  {sites.map((site) => (
                    <MenuItem key={site.id} value={site.id.toString()}>
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
                  value={selectedBuilding}
                  onChange={(e) => handleBuildingChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={!selectedSite || loadingBuildings}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingBuildings && (
                  <CircularProgress size={20} style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="wing-label" shrink>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-label"
                  label="Wing"
                  value={selectedWing}
                  onChange={(e) => handleWingChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={!selectedBuilding || loadingWings}
                >
                  <MenuItem value=""><em>Select Wing</em></MenuItem>
                  {wings.map((wing) => (
                    <MenuItem key={wing.id} value={wing.id.toString()}>
                      {wing.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingWings && (
                  <CircularProgress size={20} style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </FormControl>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-label" shrink>Area</InputLabel>
                <MuiSelect
                  labelId="area-label"
                  label="Area"
                  value={selectedArea}
                  onChange={(e) => handleAreaChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={!selectedWing || loadingAreas}
                >
                  <MenuItem value=""><em>Select Area</em></MenuItem>
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id.toString()}>
                      {area.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingAreas && (
                  <CircularProgress size={20} style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="floor-label" shrink>Floor</InputLabel>
                <MuiSelect
                  labelId="floor-label"
                  label="Floor"
                  value={selectedFloor}
                  onChange={(e) => handleFloorChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={!selectedArea || loadingFloors}
                >
                  <MenuItem value=""><em>Select Floor</em></MenuItem>
                  {floors.map((floor) => (
                    <MenuItem key={floor.id} value={floor.id.toString()}>
                      {floor.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingFloors && (
                  <CircularProgress size={20} style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="room-label" shrink>Room</InputLabel>
                <MuiSelect
                  labelId="room-label"
                  label="Room"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={!selectedFloor || loadingRooms}
                >
                  <MenuItem value=""><em>Select Room</em></MenuItem>
                  {rooms.map((room) => (
                    <MenuItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {loadingRooms && (
                  <CircularProgress size={20} style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }} />
                )}
              </FormControl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="secondary" onClick={handleApply} className="flex-1 h-11">
              Apply Filters
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
