
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ParkingBookingsDashboard = () => {
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');

  const handleSubmit = () => {
    console.log('Parking booking submitted:', { building, floor, parkingSlot });
  };

  return (
    <div className="p-6 space-y-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Parking</div>
        <h1 className="text-2xl font-bold text-gray-900">Parking Create</h1>
      </div>

      {/* Form Section */}
      <Card>
        <CardContent className="p-6">
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
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 border-0"
              >
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingBookingsDashboard;
