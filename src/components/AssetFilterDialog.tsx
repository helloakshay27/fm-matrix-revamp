
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';

interface AssetFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  // Prevent focus conflicts with Dialog
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

interface GroupItem {
  id: number;
  name: string;
}

interface SubGroupItem {
  id: number;
  name: string;
  group_id: number;
}

export const AssetFilterDialog: React.FC<AssetFilterDialogProps> = ({ isOpen, onClose }) => {
  const [assetName, setAssetName] = useState('');
  const [assetId, setAssetId] = useState('');
  const [group, setGroup] = useState('');
  const [subgroup, setSubgroup] = useState('');
  const [site, setSite] = useState('');
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');

  // API data states
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [subgroups, setSubgroups] = useState<SubGroupItem[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingSubgroups, setLoadingSubgroups] = useState(false);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      if (!isOpen) return;
      
      console.log('Fetching groups API call started...');
      setLoadingGroups(true);
      try {
        const response = await apiClient.get('/pms/assets/get_asset_group_sub_group.json');
        console.log('Groups API response:', response.data);
        
        // Extract groups from the asset_groups property
        const groupsData = Array.isArray(response.data?.asset_groups) ? response.data.asset_groups : [];
        console.log('Setting groups data:', groupsData);
        console.log('Groups data length:', groupsData.length);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups - full error:', error);
        setGroups([]);
      } finally {
        setLoadingGroups(false);
        console.log('Groups API call completed');
      }
    };

    fetchGroups();
  }, [isOpen]);

  // Fetch subgroups when group changes
  useEffect(() => {
    const fetchSubgroups = async () => {
      if (!group) {
        setSubgroups([]);
        return;
      }

      setLoadingSubgroups(true);
      try {
        const response = await apiClient.get(`/pms/assets/get_asset_group_sub_group.json?group_id=${group}`);
        console.log('Subgroups API response:', response.data);
        
        // Ensure we always set an array
        const subgroupsData = Array.isArray(response.data) ? response.data : [];
        setSubgroups(subgroupsData);
      } catch (error) {
        console.error('Error fetching subgroups:', error);
        setSubgroups([]);
      } finally {
        setLoadingSubgroups(false);
      }
    };

    fetchSubgroups();
  }, [group]);

  // Handle group change and reset subgroup
  const handleGroupChange = (value: string) => {
    setGroup(value);
    setSubgroup(''); // Reset subgroup when group changes
  };

  const handleSubmit = () => {
    const filters = {
      assetName,
      assetId,
      group,
      subgroup,
      site,
      building,
      wing,
      area,
      floor,
      room,
    };
    console.log('Apply filters:', filters);
    onClose();
  };

  const handleExport = () => {
    console.log('Export filtered data');
    onClose();
  };

  const handleReset = () => {
    setAssetName('');
    setAssetId('');
    setGroup('');
    setSubgroup('');
    setSite('');
    setBuilding('');
    setWing('');
    setArea('');
    setFloor('');
    setRoom('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="asset-filter-dialog-description">
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
          <div id="asset-filter-dialog-description" className="sr-only">
            Filter assets by name, ID, group, subgroup, site, building, wing, area, floor, and room
          </div>
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
                  value={group}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingGroups}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  {groups.map((groupItem) => (
                    <MenuItem key={groupItem.id} value={groupItem.id.toString()}>
                      {groupItem.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="subgroup-label" shrink>Subgroup</InputLabel>
                <MuiSelect
                  labelId="subgroup-label"
                  label="Subgroup"
                  value={subgroup}
                  onChange={(e) => setSubgroup(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  disabled={loadingSubgroups || !group}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                  {subgroups.map((subgroupItem) => (
                    <MenuItem key={subgroupItem.id} value={subgroupItem.id.toString()}>
                      {subgroupItem.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="site-label" shrink>Site</InputLabel>
                <MuiSelect
                  labelId="site-label"
                  label="Site"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Site</em></MenuItem>
                  <MenuItem value="site1">Site 1</MenuItem>
                  <MenuItem value="site2">Site 2</MenuItem>
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="building-label" shrink>Building</InputLabel>
                <MuiSelect
                  labelId="building-label"
                  label="Building"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  <MenuItem value="building1">Building 1</MenuItem>
                  <MenuItem value="building2">Building 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="wing-label" shrink>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-label"
                  label="Wing"
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Wing</em></MenuItem>
                  <MenuItem value="wing1">Wing 1</MenuItem>
                  <MenuItem value="wing2">Wing 2</MenuItem>
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="area-label" shrink>Area</InputLabel>
                <MuiSelect
                  labelId="area-label"
                  label="Area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Area</em></MenuItem>
                  <MenuItem value="area1">Area 1</MenuItem>
                  <MenuItem value="area2">Area 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="floor-label" shrink>Floor</InputLabel>
                <MuiSelect
                  labelId="floor-label"
                  label="Floor"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Floor</em></MenuItem>
                  <MenuItem value="floor1">Floor 1</MenuItem>
                  <MenuItem value="floor2">Floor 2</MenuItem>
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="room-label" shrink>Room</InputLabel>
                <MuiSelect
                  labelId="room-label"
                  label="Room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Room</em></MenuItem>
                  <MenuItem value="room1">Room 1</MenuItem>
                  <MenuItem value="room2">Room 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="secondary" onClick={handleSubmit} className="flex-1 h-11">
              Apply
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
