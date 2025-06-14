
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ParkingCreateDashboard = () => {
  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Parking</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Parking Create</h1>
        
        {/* First Row - Building, Floor, Parking Slot */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Building</label>
            <Select>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Building" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="building1">Building 1</SelectItem>
                <SelectItem value="building2">Building 2</SelectItem>
                <SelectItem value="building3">Building 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Floor</label>
            <Select>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="floor1">Floor 1</SelectItem>
                <SelectItem value="floor2">Floor 2</SelectItem>
                <SelectItem value="floor3">Floor 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Parking Slot</label>
            <Select>
              <SelectTrigger className="border-gray-300">
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

        {/* Submit Button */}
        <div className="flex justify-end mb-6">
          <Button className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-8 py-2">
            Submit
          </Button>
        </div>

        {/* Second Row - Client Name and Leaser */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Client Name*</label>
            <Select>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Client Name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client1">Client 1</SelectItem>
                <SelectItem value="client2">Client 2</SelectItem>
                <SelectItem value="client3">Client 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Leaser*</label>
            <Select>
              <SelectTrigger className="border-gray-300">
                <SelectValue placeholder="Select Customer Lease" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lease1">Lease 1</SelectItem>
                <SelectItem value="lease2">Lease 2</SelectItem>
                <SelectItem value="lease3">Lease 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Parking Information */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Free Parking: N/A</label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Paid Parking: N/A</label>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Available Slots: N/A</label>
          </div>
        </div>

        {/* Final Submit Button */}
        <div className="flex justify-center">
          <Button className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-8 py-2">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
