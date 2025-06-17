
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Asset Details */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-3">Asset Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetName" className="text-sm">Asset Name</Label>
                <Input 
                  id="assetName"
                  placeholder="Enter Asset Name"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dateRange" className="text-sm">Date Range*</Label>
                <Input 
                  id="dateRange"
                  placeholder="Select Date Range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-sm">Group</Label>
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category1">Category 1</SelectItem>
                    <SelectItem value="category2">Category 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Subgroup</Label>
                <Select value={subgroup} onValueChange={setSubgroup}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Sub Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subgroup1">Sub Group 1</SelectItem>
                    <SelectItem value="subgroup2">Sub Group 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-3">Location Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">Building</Label>
                <Select value={building} onValueChange={setBuilding}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building1">Building 1</SelectItem>
                    <SelectItem value="building2">Building 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Wing</Label>
                <Select value={wing} onValueChange={setWing}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wing1">Wing 1</SelectItem>
                    <SelectItem value="wing2">Wing 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Area</Label>
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area1">Area 1</SelectItem>
                    <SelectItem value="area2">Area 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-sm">Floor</Label>
                <Select value={floor} onValueChange={setFloor}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="floor1">Floor 1</SelectItem>
                    <SelectItem value="floor2">Floor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Room</Label>
                <Select value={room} onValueChange={setRoom}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room1">Room 1</SelectItem>
                    <SelectItem value="room2">Room 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="text-white flex-1 hover:bg-[#C72030]/90"
            >
              Submit
            </Button>
            <Button 
              onClick={handleExport}
              style={{ backgroundColor: '#C72030' }}
              className="text-white flex-1 hover:bg-[#C72030]/90"
            >
              Export
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
