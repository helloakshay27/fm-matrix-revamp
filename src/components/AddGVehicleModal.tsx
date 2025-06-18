
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
  const [type, setType] = useState('Occupants');
  const [occupantUser, setOccupantUser] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [entryGate, setEntryGate] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', {
      type,
      occupantUser,
      vehicleNumber,
      parkingSlot,
      entryGate
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">Add Vehicle</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="Occupants"
                  checked={type === 'Occupants'}
                  onChange={(e) => setType(e.target.value)}
                  className="w-4 h-4 text-[#C72030]"
                />
                <span className="text-sm">Occupants</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="Guest"
                  checked={type === 'Guest'}
                  onChange={(e) => setType(e.target.value)}
                  className="w-4 h-4 text-[#C72030]"
                />
                <span className="text-sm">Guest</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Occupant User */}
            <div className="space-y-2">
              <Label htmlFor="occupantUser" className="text-sm font-medium">
                Occupant User
              </Label>
              <Select value={occupantUser} onValueChange={setOccupantUser}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Name" className="text-red-500" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">User 1</SelectItem>
                  <SelectItem value="user2">User 2</SelectItem>
                  <SelectItem value="user3">User 3</SelectItem>
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
                placeholder="Vehicle Number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="border-gray-300"
              />
            </div>

            {/* Parking Slot */}
            <div className="space-y-2">
              <Label htmlFor="parkingSlot" className="text-sm font-medium">
                Parking Slot
              </Label>
              <Select value={parkingSlot} onValueChange={setParkingSlot}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Parking Slot" className="text-red-500" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slot1">Slot 1</SelectItem>
                  <SelectItem value="slot2">Slot 2</SelectItem>
                  <SelectItem value="slot3">Slot 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Entry Gate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="entryGate" className="text-sm font-medium">
                Entry Gate
              </Label>
              <Select value={entryGate} onValueChange={setEntryGate}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Entry Gate" className="text-red-500" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gate1">Gate 1</SelectItem>
                  <SelectItem value="gate2">Gate 2</SelectItem>
                  <SelectItem value="gate3">Gate 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#C72030' }}
              className="hover:bg-[#C72030]/90 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
