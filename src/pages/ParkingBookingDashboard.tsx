
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ParkingBookingDashboard = () => {
  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Parking</span>
        </div>
        
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Parking Create</h1>
        
        {/* Building, Floor, Parking Slot Row */}
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
        <div className="flex justify-end">
          <Button className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-8 py-2">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
