
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

interface InActiveAssetsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InActiveAssetsFilterDialog: React.FC<InActiveAssetsFilterDialogProps> = ({ isOpen, onClose }) => {
  const [assetName, setAssetName] = useState('');
  const [dateRange, setDateRange] = useState('');
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
      dateRange,
      group,
      subgroup,
      building,
      wing,
      area,
      floor,
      room
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
    setDateRange('');
    setGroup('');
    setSubgroup('');
    setBuilding('');
    setWing('');
    setArea('');
    setFloor('');
    setRoom('');
  };

  const commonFieldStyles = {
    height: {
      xs: '36px',
      md: '45px'
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      height: {
        xs: '36px',
        md: '45px'
      },
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#1A1A1A',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666666',
      fontSize: '16px',
      '&.Mui-focused': {
        color: '#C72030',
      },
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
        backgroundColor: '#FFFFFF',
        padding: '0 4px',
      },
    },
    '& .MuiOutlinedInput-input, & .MuiSelect-select': {
      color: '#1A1A1A',
      fontSize: '16px',
      padding: {
        xs: '8px 14px',
        md: '12px 14px'
      },
      '&::placeholder': {
        color: '#999999',
        opacity: 1,
      },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
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
              <div>
                <TextField
                  label="Asset Name *"
                  placeholder="Enter Name"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  sx={commonFieldStyles}
                />
              </div>
              <div>
                <TextField
                  label="Date Range*"
                  placeholder="dd/mm/yyyy"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  type="date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  sx={commonFieldStyles}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="group-select-label" shrink>Group</InputLabel>
                  <MuiSelect
                    labelId="group-select-label"
                    label="Group"
                    displayEmpty
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    sx={commonFieldStyles}
                  >
                    <MenuItem value=""><em>Select Category</em></MenuItem>
                    <MenuItem value="category1">Category 1</MenuItem>
                    <MenuItem value="category2">Category 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="subgroup-select-label" shrink>Subgroup</InputLabel>
                  <MuiSelect
                    labelId="subgroup-select-label"
                    label="Subgroup"
                    displayEmpty
                    value={subgroup}
                    onChange={(e) => setSubgroup(e.target.value)}
                    sx={commonFieldStyles}
                  >
                    <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                    <MenuItem value="subgroup1">Sub Group 1</MenuItem>
                    <MenuItem value="subgroup2">Sub Group 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Location Details Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Location Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="building-select-label" shrink>Building</InputLabel>
                  <MuiSelect
                    labelId="building-select-label"
                    label="Building"
                    displayEmpty
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    sx={commonFieldStyles}
                  >
                    <MenuItem value=""><em>Select Building</em></MenuItem>
                    <MenuItem value="building1">Building 1</MenuItem>
                    <MenuItem value="building2">Building 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
                  <MuiSelect
                    labelId="wing-select-label"
                    label="Wing"
                    displayEmpty
                    value={wing}
                    onChange={(e) => setWing(e.target.value)}
                    sx={commonFieldStyles}
                  >
                    <MenuItem value=""><em>Select Wing</em></MenuItem>
                    <MenuItem value="wing1">Wing 1</MenuItem>
                    <MenuItem value="wing2">Wing 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="area-select-label" shrink>Area</InputLabel>
                  <MuiSelect
                    labelId="area-select-label"
                    label="Area"
                    displayEmpty
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    sx={commonFieldStyles}
                  >
                    <MenuItem value=""><em>Select Area</em></MenuItem>
                    <MenuItem value="area1">Area 1</MenuItem>
                    <MenuItem value="area2">Area 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
                  <MuiSelect
                    labelId="floor-select-label"
                    label="Floor"
                    displayEmpty
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    sx={commonFieldStyles}
                  >
                    <MenuItem value=""><em>Select Floor</em></MenuItem>
                    <MenuItem value="floor1">Floor 1</MenuItem>
                    <MenuItem value="floor2">Floor 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="room-select-label" shrink>Room</InputLabel>
                  <MuiSelect
                    labelId="room-select-label"
                    label="Room"
                    displayEmpty
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    sx={commonFieldStyles}
                  >
                    <MenuItem value=""><em>Select Room</em></MenuItem>
                    <MenuItem value="room1">Room 1</MenuItem>
                    <MenuItem value="room2">Room 2</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button 
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex-1 h-11"
            >
              Submit
            </Button>
            <Button 
              onClick={handleExport}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex-1 h-11"
            >
              Export
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1 h-11"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
