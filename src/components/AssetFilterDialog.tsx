
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';

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

export const AssetFilterDialog: React.FC<AssetFilterDialogProps> = ({ isOpen, onClose }) => {
  const [assetName, setAssetName] = useState('');
  const [assetId, setAssetId] = useState('');
  const [group, setGroup] = useState('');
  const [subgroup, setSubgroup] = useState('');
  const [building, setBuilding] = useState('');
  const [wing, setWing] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');

  const handleSubmit = () => {
    const filters = {
      assetName,
      assetId,
      group,
      subgroup,
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
    setBuilding('');
    setWing('');
    setArea('');
    setFloor('');
    setRoom('');
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
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="category1">Category 1</MenuItem>
                  <MenuItem value="category2">Category 2</MenuItem>
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
                >
                  <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                  <MenuItem value="subgroup1">Sub Group 1</MenuItem>
                  <MenuItem value="subgroup2">Sub Group 2</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="building-label" shrink>Building</InputLabel>
                <MuiSelect
                  labelId="building-label"
                  label="Building"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  <MenuItem value="building1">Building 1</MenuItem>
                  <MenuItem value="building2">Building 2</MenuItem>
                </MuiSelect>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="wing-label" shrink>Wing</InputLabel>
                <MuiSelect
                  labelId="wing-label"
                  label="Wing"
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
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
              Submit
            </Button>
            <Button variant="outline" onClick={handleExport} className="flex-1 h-11">
              Export
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
