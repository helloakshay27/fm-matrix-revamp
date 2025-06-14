
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

export const ParkingCreateDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    building: '',
    floor: '',
    parkingSlot: '',
    clientName: '',
    lease: ''
  });

  const [parkingInfo, setParkingInfo] = useState({
    freeParking: 'N/A',
    paidParking: 'N/A',
    availableSlots: 'N/A'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    navigate('/property/parking');
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Parking</span>
          <span>{'>'}	</span>
          <span>Parking Create</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">Parking Create</h1>
        
        <div className="bg-white rounded-lg border border-[#D5DbDB] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label htmlFor="building" className="text-sm font-medium text-gray-700 mb-2 block">
                  Building
                </Label>
                <Select onValueChange={(value) => setFormData({...formData, building: value})}>
                  <SelectTrigger className="w-full">
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
                <Label htmlFor="floor" className="text-sm font-medium text-gray-700 mb-2 block">
                  Floor
                </Label>
                <Select onValueChange={(value) => setFormData({...formData, floor: value})}>
                  <SelectTrigger className="w-full">
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
                <Label htmlFor="parkingSlot" className="text-sm font-medium text-gray-700 mb-2 block">
                  Parking Slot
                </Label>
                <Select onValueChange={(value) => setFormData({...formData, parkingSlot: value})}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Parking Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slot1">Slot 1</SelectItem>
                    <SelectItem value="slot2">Slot 2</SelectItem>
                    <SelectItem value="slot3">Slot 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button for first row */}
            <div className="flex justify-end">
              <Button 
                type="button"
                className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-6 py-2 rounded"
              >
                Submit
              </Button>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Client Name*
                </Label>
                <Input
                  id="clientName"
                  placeholder="Select Client Name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="lease" className="text-sm font-medium text-gray-700 mb-2 block">
                  Lease*
                </Label>
                <Input
                  id="lease"
                  placeholder="Select Customer Lease"
                  value={formData.lease}
                  onChange={(e) => setFormData({...formData, lease: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>

            {/* Parking Information */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Free Parking: {parkingInfo.freeParking}
                </Label>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Paid Parking: {parkingInfo.paidParking}
                </Label>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Available Slots: {parkingInfo.availableSlots}
                </Label>
              </div>
            </div>

            {/* Final Submit Button */}
            <div className="flex justify-center">
              <Button 
                type="submit"
                className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-8 py-2 rounded"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
