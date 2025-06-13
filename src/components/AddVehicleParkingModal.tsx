
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddVehicleParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddVehicleParkingModal = ({ isOpen, onClose }: AddVehicleParkingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Add</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Slot Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slot Number</label>
            <Input 
              placeholder="Enter slot number"
              className="border-gray-300"
            />
          </div>

          {/* Vehicle Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle Category</label>
            <Select>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Vehicle Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
            <Select>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sticker Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sticker Number</label>
            <Input 
              placeholder="Enter sticker number"
              className="border-gray-300"
            />
          </div>

          {/* Registration Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Registration Number</label>
            <Input 
              placeholder="Enter registration number"
              className="border-gray-300"
            />
          </div>

          {/* Insurance Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Insurance Number</label>
            <Input 
              placeholder="Enter insurance number"
              className="border-gray-300"
            />
          </div>

          {/* Insurance Valid Till */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Insurance Valid Till</label>
            <Input 
              placeholder="Enter insurance valid till"
              className="border-gray-300"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident">Resident</SelectItem>
                <SelectItem value="visitor">Visitor</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
            <Input 
              placeholder="Enter vehicle number"
              className="border-gray-300"
            />
          </div>

          {/* Unit */}
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-medium text-gray-700">Unit</label>
            <Select>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unit1">Unit 1</SelectItem>
                <SelectItem value="unit2">Unit 2</SelectItem>
                <SelectItem value="unit3">Unit 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
          <Button 
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
