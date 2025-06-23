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
import { X } from 'lucide-react';

interface WaterFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaterFilterDialog: React.FC<WaterFilterDialogProps> = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    site: '',
    building: '',
    wing: '',
    floor: '',
    area: '',
    room: '',
    assetName: '',
    assetId: '',
    status: '',
    meterType: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      site: '',
      building: '',
      wing: '',
      floor: '',
      area: '',
      room: '',
      assetName: '',
      assetId: '',
      status: '',
      meterType: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[755px] h-[560px] md:w-[530px] md:h-[300px] sm:w-[310px] sm:h-[230px] max-w-none rounded-none shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.06)] border-[#E4E4E4] [&>button]:hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-[#1F2937]">Filter Water Assets</DialogTitle>
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
        
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Site</Label>
              <Select value={filters.site} onValueChange={(value) => handleFilterChange('site', value)}>
                <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#D1D5DB]">
                  <SelectItem value="site1">Site 1</SelectItem>
                  <SelectItem value="site2">Site 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Building</Label>
              <Select value={filters.building} onValueChange={(value) => handleFilterChange('building', value)}>
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
              <Label className="text-sm font-medium text-[#374151]">Wing</Label>
              <Select value={filters.wing} onValueChange={(value) => handleFilterChange('wing', value)}>
                <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                  <SelectValue placeholder="Select Wing" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#D1D5DB]">
                  <SelectItem value="wing1">Wing 1</SelectItem>
                  <SelectItem value="wing2">Wing 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Floor</Label>
              <Select value={filters.floor} onValueChange={(value) => handleFilterChange('floor', value)}>
                <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#D1D5DB]">
                  <SelectItem value="floor1">Floor 1</SelectItem>
                  <SelectItem value="floor2">Floor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Area</Label>
              <Select value={filters.area} onValueChange={(value) => handleFilterChange('area', value)}>
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
              <Label className="text-sm font-medium text-[#374151]">Room</Label>
              <Select value={filters.room} onValueChange={(value) => handleFilterChange('room', value)}>
                <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#D1D5DB]">
                  <SelectItem value="room1">Room 1</SelectItem>
                  <SelectItem value="room2">Room 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Asset Name</Label>
              <Input
                value={filters.assetName}
                onChange={(e) => handleFilterChange('assetName', e.target.value)}
                placeholder="Enter Asset Name"
                className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Asset ID</Label>
              <Input
                value={filters.assetId}
                onChange={(e) => handleFilterChange('assetId', e.target.value)}
                placeholder="Enter Asset ID"
                className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#D1D5DB]">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#374151]">Meter Type</Label>
              <Select value={filters.meterType} onValueChange={(value) => handleFilterChange('meterType', value)}>
                <SelectTrigger className="h-10 px-3 py-2 rounded-none border-[#D1D5DB] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] focus:ring-opacity-20">
                  <SelectValue placeholder="Select Meter Type" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#D1D5DB]">
                  <SelectItem value="water">Water</SelectItem>
                  <SelectItem value="flow">Flow</SelectItem>
                  <SelectItem value="pressure">Pressure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button 
              onClick={handleClearFilters}
              className="bg-[#C72030] hover:bg-[#A01B26] text-white rounded-none h-10 px-4 py-2 font-medium shadow-none border-none"
            >
              Clear All
            </Button>
            <Button 
              onClick={handleApplyFilters}
              className="bg-[#C72030] hover:bg-[#A01B26] text-white rounded-none h-10 px-4 py-2 font-medium shadow-none border-none"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
