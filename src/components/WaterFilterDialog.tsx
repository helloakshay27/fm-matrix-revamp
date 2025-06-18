
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Filter Water Assets</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <div>
            <Label className="text-sm font-medium mb-2">Site</Label>
            <Select value={filters.site} onValueChange={(value) => handleFilterChange('site', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="site1">Site 1</SelectItem>
                <SelectItem value="site2">Site 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Building</Label>
            <Select value={filters.building} onValueChange={(value) => handleFilterChange('building', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building1">Building 1</SelectItem>
                <SelectItem value="building2">Building 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Wing</Label>
            <Select value={filters.wing} onValueChange={(value) => handleFilterChange('wing', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Wing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wing1">Wing 1</SelectItem>
                <SelectItem value="wing2">Wing 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Floor</Label>
            <Select value={filters.floor} onValueChange={(value) => handleFilterChange('floor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="floor1">Floor 1</SelectItem>
                <SelectItem value="floor2">Floor 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Area</Label>
            <Select value={filters.area} onValueChange={(value) => handleFilterChange('area', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area1">Area 1</SelectItem>
                <SelectItem value="area2">Area 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Room</Label>
            <Select value={filters.room} onValueChange={(value) => handleFilterChange('room', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="room1">Room 1</SelectItem>
                <SelectItem value="room2">Room 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Asset Name</Label>
            <Input
              value={filters.assetName}
              onChange={(e) => handleFilterChange('assetName', e.target.value)}
              placeholder="Enter Asset Name"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Asset ID</Label>
            <Input
              value={filters.assetId}
              onChange={(e) => handleFilterChange('assetId', e.target.value)}
              placeholder="Enter Asset ID"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2">Meter Type</Label>
            <Select value={filters.meterType} onValueChange={(value) => handleFilterChange('meterType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Meter Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="flow">Flow</SelectItem>
                <SelectItem value="pressure">Pressure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            onClick={handleClearFilters}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Clear All
          </Button>
          <Button 
            onClick={handleApplyFilters}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
