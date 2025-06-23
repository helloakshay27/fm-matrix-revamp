
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
import { X } from 'lucide-react';

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
      <DialogContent className="w-[755px] h-[560px] md:w-[530px] md:h-[300px] sm:w-[310px] sm:h-[230px] max-w-none rounded-none shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)] border-[#E4E4E4] [&>button]:hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[#1F2937]">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-6">
          {/* Asset Details */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-3">Asset Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assetName" className="text-sm text-[#374151]">Asset Name</Label>
                <Input 
                  id="assetName"
                  placeholder="Enter Asset Name"
                  className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateRange" className="text-sm text-[#374151]">Date Range*</Label>
                <Input 
                  id="dateRange"
                  placeholder="Select Date Range"
                  className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="group" className="text-sm text-[#374151]">Group</Label>
                <Select>
                  <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-[#D1D5DB]">
                    <SelectItem value="category1">Category 1</SelectItem>
                    <SelectItem value="category2">Category 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subgroup" className="text-sm text-[#374151]">Subgroup</Label>
                <Select>
                  <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                    <SelectValue placeholder="Select Sub Group" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-[#D1D5DB]">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="building" className="text-sm text-[#374151]">Building</Label>
                <Select>
                  <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-[#D1D5DB]">
                    <SelectItem value="building1">Building 1</SelectItem>
                    <SelectItem value="building2">Building 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wing" className="text-sm text-[#374151]">Wing</Label>
                <Select>
                  <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                    <SelectValue placeholder="Select Wing" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-[#D1D5DB]">
                    <SelectItem value="wing1">Wing 1</SelectItem>
                    <SelectItem value="wing2">Wing 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="area" className="text-sm text-[#374151]">Area</Label>
                <Select>
                  <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-[#D1D5DB]">
                    <SelectItem value="area1">Area 1</SelectItem>
                    <SelectItem value="area2">Area 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor" className="text-sm text-[#374151]">Floor</Label>
                <Select>
                  <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                    <SelectValue placeholder="Select Floor" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-[#D1D5DB]">
                    <SelectItem value="floor1">Floor 1</SelectItem>
                    <SelectItem value="floor2">Floor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <div className="space-y-2">
                <Label htmlFor="room" className="text-sm text-[#374151]">Room</Label>
                <Select>
                  <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-[#D1D5DB]">
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
              className="bg-[#C72030] hover:bg-[#A01B26] text-white flex-1 rounded-none h-10 px-4 py-2 font-medium shadow-none border-none"
            >
              Submit
            </Button>
            <Button 
              onClick={handleExport}
              className="bg-[#C72030] hover:bg-[#A01B26] text-white flex-1 rounded-none h-10 px-4 py-2 font-medium shadow-none border-none"
            >
              Export
            </Button>
            <Button 
              onClick={handleReset}
              className="bg-[#C72030] hover:bg-[#A01B26] text-white flex-1 rounded-none h-10 px-4 py-2 font-medium shadow-none border-none"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
