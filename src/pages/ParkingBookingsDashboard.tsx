
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Eye } from 'lucide-react';
import { AddParkingModal } from '@/components/AddParkingModal';

const ParkingBookingsDashboard = () => {
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSubmit = () => {
    console.log('Parking booking submitted:', { building, floor, parkingSlot });
  };

  const handleImport = () => {
    console.log('Import clicked');
    // Add import functionality here
  };

  const handleViewBookings = () => {
    console.log('View Bookings clicked');
    // Add view bookings functionality here
  };

  // Mock data for the table
  const parkingData = [
    { clientName: 'HSBC', no2Wheeler: 0, no4Wheeler: 0, freeParking: 10, paidParking: 20, availableSlots: 30 },
    { clientName: 'localized', no2Wheeler: 0, no4Wheeler: 0, freeParking: 20, paidParking: 40, availableSlots: 40 },
    { clientName: 'demo', no2Wheeler: 0, no4Wheeler: 0, freeParking: 2, paidParking: 5, availableSlots: 7 },
    { clientName: 'Sohail Ansari', no2Wheeler: 0, no4Wheeler: 0, freeParking: 5, paidParking: 5, availableSlots: 10 },
    { clientName: 'Deepak Jain', no2Wheeler: 0, no4Wheeler: 0, freeParking: 5, paidParking: 2, availableSlots: 7 },
    { clientName: 'Mahendra Lungare', no2Wheeler: 0, no4Wheeler: 0, freeParking: 2, paidParking: 1, availableSlots: 3 },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Parking</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">PARKING BOOKING LIST</h1>
        
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: '#C72030', color: 'white' }}
            className="hover:opacity-90 px-4 py-2 rounded flex items-center gap-2 border-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          <Button 
            onClick={handleImport}
            style={{ backgroundColor: '#C72030', color: 'white' }}
            className="hover:opacity-90 px-4 py-2 rounded flex items-center gap-2 border-0"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button 
            onClick={handleViewBookings}
            style={{ backgroundColor: '#C72030', color: 'white' }}
            className="hover:opacity-90 px-4 py-2 rounded flex items-center gap-2 border-0"
          >
            View Bookings
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card className="bg-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">4</div>
              <div className="text-sm text-green-600">Vacant Two Wheeler Slots</div>
            </CardContent>
          </Card>
          <Card className="bg-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">7</div>
              <div className="text-sm text-green-600">Vacant Four Wheeler Slots</div>
            </CardContent>
          </Card>
          <Card className="bg-red-100 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700">0</div>
              <div className="text-sm text-red-600">Total Two Wheeler Allotted Slots</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-700">0</div>
              <div className="text-sm text-orange-600">Total Four Wheeler Allotted Slots</div>
            </CardContent>
          </Card>
          <Card className="bg-red-100 border-red-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-700">0</div>
              <div className="text-sm text-red-600">Total Allotted Slots</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">11</div>
              <div className="text-sm text-purple-600">Total Vacant Slots</div>
            </CardContent>
          </Card>
        </div>
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
                style={{ backgroundColor: '#C72030', color: 'white' }}
                className="hover:opacity-90 px-8 border-0"
              >
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Eye className="w-4 h-4" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. of 2 Wheeler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No. of 4 Wheeler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Free Parking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid Parking
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Parking Slots
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parkingData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {row.no2Wheeler}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {row.no4Wheeler}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.freeParking}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.paidParking}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.availableSlots}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Parking Modal */}
      <AddParkingModal 
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
    </div>
  );
};

export default ParkingBookingsDashboard;
