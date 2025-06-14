
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ParkingBookingsDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Parking Create</h1>
      </div>

      {/* Form Section */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="building" className="text-sm font-medium">Building</Label>
                <Select>
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
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="floor" className="text-sm font-medium">Floor</Label>
                <Select>
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
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="parkingSlot" className="text-sm font-medium">Parking Slot</Label>
                <Select>
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

              <div className="flex justify-end">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                  Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label htmlFor="clientName" className="text-sm font-medium">
                Client Name<span className="text-red-500">*</span>
              </Label>
              <Select>
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
                Leaser<span className="text-red-500">*</span>
              </Label>
              <Select>
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

          <div className="flex justify-center mt-6">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8">
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingBookingsDashboard;
