
import React from 'react';
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

interface UtilityFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UtilityFilterDialog: React.FC<UtilityFilterDialogProps> = ({ isOpen, onClose }) => {
  const handleSubmit = () => {
    // Handle filter submit
    console.log('Filter submitted');
    onClose();
  };

  const handleExport = () => {
    // Handle export
    console.log('Export filtered data');
    onClose();
  };

  const handleReset = () => {
    // Handle reset filters
    console.log('Reset filters');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Asset Details */}
          <div>
            <h3 className="text-sm font-medium text-orange-600 mb-3">Asset Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assetName" className="text-sm">Asset Name</Label>
                <Input 
                  id="assetName"
                  placeholder="Enter Asset Name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dateRange" className="text-sm">Date Range*</Label>
                <Input 
                  id="dateRange"
                  placeholder="Select Date Range"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="group" className="text-sm">Group</Label>
                <Select>
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
                <Label htmlFor="subgroup" className="text-sm">Subgroup</Label>
                <Select>
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
            <h3 className="text-sm font-medium text-orange-600 mb-3">Location Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="building" className="text-sm">Building</Label>
                <Select>
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
                <Label htmlFor="wing" className="text-sm">Wing</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wing1">Wing 1</SelectItem>
                    <SelectItem value="wing2">Wing 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="area" className="text-sm">Area</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="area1">Area 1</SelectItem>
                    <SelectItem value="area2">Area 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="floor" className="text-sm">Floor</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="floor1">Floor 1</SelectItem>
                    <SelectItem value="floor2">Floor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="room" className="text-sm">Room</Label>
              <Select>
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white flex-1"
            >
              Submit
            </Button>
            <Button 
              onClick={handleExport}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white flex-1"
            >
              Export
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
