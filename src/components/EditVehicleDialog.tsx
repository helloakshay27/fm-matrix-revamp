
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Vehicle {
  id: number;
  vehicleNumber: string;
  parkingSlot: string;
  vehicleCategory: string;
  vehicleType: string;
  stickerNumber: string;
  category: string;
  registrationNumber: string;
  activeInactive: boolean;
  insuranceNumber: string;
  insuranceValidTill: string;
  staffName: string;
  statusCode: string;
  qrCode: string;
}

interface EditVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
}

export const EditVehicleDialog = ({ isOpen, onClose, vehicle, onSave }: EditVehicleDialogProps) => {
  const [formData, setFormData] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (vehicle) {
      setFormData({ ...vehicle });
    }
  }, [vehicle]);

  const handleInputChange = (field: keyof Vehicle, value: string | boolean) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Slot Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Slot Number</label>
            <Input 
              value={formData.parkingSlot}
              onChange={(e) => handleInputChange('parkingSlot', e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Vehicle Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle Category</label>
            <Select value={formData.vehicleCategory} onValueChange={(value) => handleInputChange('vehicleCategory', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
                <SelectItem value="2 Wheeler">2 Wheeler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
            <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Scooter">Scooter</SelectItem>
                <SelectItem value="Truck">Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sticker Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Sticker Number</label>
            <Input 
              value={formData.stickerNumber}
              onChange={(e) => handleInputChange('stickerNumber', e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Registration Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Registration Number</label>
            <Input 
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Insurance Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Insurance Number</label>
            <Input 
              value={formData.insuranceNumber}
              onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Insurance Valid Till */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Insurance Valid Till</label>
            <Input 
              value={formData.insuranceValidTill}
              onChange={(e) => handleInputChange('insuranceValidTill', e.target.value)}
              className="border-gray-300"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className="border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owned">Owned</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
            <Input 
              value={formData.vehicleNumber}
              onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
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
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
