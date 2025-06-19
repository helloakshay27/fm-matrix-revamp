
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface AddGVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddGVehicleModal = ({ isOpen, onClose }: AddGVehicleModalProps) => {
  const [formData, setFormData] = useState({
    slotNumber: '',
    vehicleCategory: '',
    vehicleType: '',
    stickerNumber: '',
    registrationNumber: '',
    insuranceNumber: '',
    insuranceValidTill: '',
    category: '',
    vehicleNumber: '',
    unit: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving vehicle data:', formData);
    // Handle save logic here
    onClose();
  };

  const handleClose = () => {
    setFormData({
      slotNumber: '',
      vehicleCategory: '',
      vehicleType: '',
      stickerNumber: '',
      registrationNumber: '',
      insuranceNumber: '',
      insuranceValidTill: '',
      category: '',
      vehicleNumber: '',
      unit: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Add</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slot Number */}
            <div className="space-y-2">
              <Label htmlFor="slotNumber" className="text-sm font-medium">
                Slot Number
              </Label>
              <Input
                id="slotNumber"
                value={formData.slotNumber}
                onChange={(e) => handleInputChange('slotNumber', e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Vehicle Category */}
            <div className="space-y-2">
              <Label htmlFor="vehicleCategory" className="text-sm font-medium">
                Vehicle Category
              </Label>
              <Select value={formData.vehicleCategory} onValueChange={(value) => handleInputChange('vehicleCategory', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Vehicle Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 Wheeler">2 Wheeler</SelectItem>
                  <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Type */}
            <div className="space-y-2">
              <Label htmlFor="vehicleType" className="text-sm font-medium">
                Vehicle Type
              </Label>
              <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Scooter">Scooter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sticker Number */}
            <div className="space-y-2">
              <Label htmlFor="stickerNumber" className="text-sm font-medium">
                Sticker Number
              </Label>
              <Input
                id="stickerNumber"
                value={formData.stickerNumber}
                onChange={(e) => handleInputChange('stickerNumber', e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Registration Number */}
            <div className="space-y-2">
              <Label htmlFor="registrationNumber" className="text-sm font-medium">
                Registration Number
              </Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Insurance Number */}
            <div className="space-y-2">
              <Label htmlFor="insuranceNumber" className="text-sm font-medium">
                Insurance Number
              </Label>
              <Input
                id="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Insurance Valid Till */}
            <div className="space-y-2">
              <Label htmlFor="insuranceValidTill" className="text-sm font-medium">
                Insurance Valid Till
              </Label>
              <Input
                id="insuranceValidTill"
                type="date"
                value={formData.insuranceValidTill}
                onChange={(e) => handleInputChange('insuranceValidTill', e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owned">Owned</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Leased">Leased</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Number */}
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber" className="text-sm font-medium">
                Vehicle Number
              </Label>
              <Input
                id="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium">
                Unit
              </Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unit 1">Unit 1</SelectItem>
                  <SelectItem value="Unit 2">Unit 2</SelectItem>
                  <SelectItem value="Unit 3">Unit 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={handleClose}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2"
            >
              Close
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
