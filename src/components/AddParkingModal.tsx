
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AddParkingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddParkingModal: React.FC<AddParkingModalProps> = ({ open, onOpenChange }) => {
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [clientName, setClientName] = useState('');
  const [leaser, setLeaser] = useState('');

  const handleSubmit = () => {
    console.log('Parking created:', { building, floor, parkingSlot, clientName, leaser });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <div className="text-sm text-gray-600 mb-2">Parking</div>
          <DialogTitle className="text-xl font-semibold">Parking Create</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <Label htmlFor="building" className="text-sm font-medium">Building</Label>
              <Select value={building} onValueChange={setBuilding}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="building1">Building 1</SelectItem>
                  <SelectItem value="building2">Building 2</SelectItem>
                  <SelectItem value="building3">Building 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="floor" className="text-sm font-medium">Floor</Label>
              <Select value={floor} onValueChange={setFloor}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ground">Ground Floor</SelectItem>
                  <SelectItem value="first">First Floor</SelectItem>
                  <SelectItem value="second">Second Floor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="parkingSlot" className="text-sm font-medium">Parking Slot</Label>
              <Select value={parkingSlot} onValueChange={setParkingSlot}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Parking Slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slot1">A-001</SelectItem>
                  <SelectItem value="slot2">A-002</SelectItem>
                  <SelectItem value="slot3">B-001</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="clientName" className="text-sm font-medium">
                Client Name<span className="text-red-500">*</span>
              </Label>
              <Select value={clientName} onValueChange={setClientName}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Client Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">HSBC</SelectItem>
                  <SelectItem value="client2">Localized</SelectItem>
                  <SelectItem value="client3">Demo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="leaser" className="text-sm font-medium">
                Leases<span className="text-red-500">*</span>
              </Label>
              <Select value={leaser} onValueChange={setLeaser}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Customer Lease" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lease1">Lease Agreement 1</SelectItem>
                  <SelectItem value="lease2">Lease Agreement 2</SelectItem>
                  <SelectItem value="lease3">Lease Agreement 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Free Parking:</span> N/A
              </div>
              <div>
                <span className="font-medium">Paid Parking:</span> N/A
              </div>
              <div>
                <span className="font-medium">Available Slots:</span> N/A
              </div>
            </div>
          </div>

          {/* Bottom Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
