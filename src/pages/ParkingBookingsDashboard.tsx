
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ParkingBookingsDashboard = () => {
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log('Parking booking submitted:', { building, floor, parkingSlot });
  };

  return (
    <div className="p-6 space-y-6 bg-[#f6f4ee] min-h-screen">
      <div className="flex items-center mb-6">
        <Button 
          onClick={() => navigate('/vas/parking')} 
          variant="ghost" 
          className="mr-4 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Parking</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Parking Create</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <Label htmlFor="building" className="text-sm font-medium text-gray-700 mb-2 block">Building</Label>
              <Select value={building} onValueChange={setBuilding}>
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
              <Label htmlFor="floor" className="text-sm font-medium text-gray-700 mb-2 block">Floor</Label>
              <Select value={floor} onValueChange={setFloor}>
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
              <Label htmlFor="parkingSlot" className="text-sm font-medium text-gray-700 mb-2 block">Parking Slot</Label>
              <Select value={parkingSlot} onValueChange={setParkingSlot}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Parking Slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slot1">A-001</SelectItem>
                  <SelectItem value="slot2">A-002</SelectItem>
                  <SelectItem value="slot3">B-001</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-start">
              <Button 
                onClick={handleSubmit}
                className="bg-[#8B4A9C] hover:bg-[#7A4089] text-white px-8 py-2"
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
