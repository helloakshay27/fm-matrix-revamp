
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface SeatSetupData {
  id: number;
  location: string;
  floor: string;
  seatTypes: {
    [key: string]: {
      total: number;
      reserved: number;
    };
  };
}

export const SeatSetupDashboard = () => {
  const navigate = useNavigate();
  const [seatSetups] = useState<SeatSetupData[]>([
    {
      id: 1,
      location: "BBT A",
      floor: "TA Floor 1",
      seatTypes: {
        "Angular Ws": { total: 0, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 0 },
        "Cabin": { total: 0, reserved: 0 },
        "Fixed Desk": { total: 0, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 0, reserved: 0 },
        "Rectangle": { total: 2, reserved: 0 }
      }
    },
    {
      id: 2,
      location: "test",
      floor: "Ground Floor",
      seatTypes: {
        "Angular Ws": { total: 0, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 0 },
        "Cabin": { total: 0, reserved: 0 },
        "Fixed Desk": { total: 0, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 0, reserved: 0 },
        "Rectangle": { total: 0, reserved: 0 }
      }
    },
    {
      id: 3,
      location: "Jyoti Tower",
      floor: "Ground Floor",
      seatTypes: {
        "Angular Ws": { total: 5, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 0 },
        "Cabin": { total: 0, reserved: 0 },
        "Fixed Desk": { total: 5, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 0, reserved: 0 },
        "Rectangle": { total: 0, reserved: 0 }
      }
    },
    {
      id: 4,
      location: "Gophygital",
      floor: "2",
      seatTypes: {
        "Angular Ws": { total: 0, reserved: 0 },
        "Flexi Desk": { total: 4, reserved: 0 },
        "Cabin": { total: 0, reserved: 0 },
        "Fixed Desk": { total: 0, reserved: 0 },
        "IOS": { total: 0, reserved: 0 },
        "cabin": { total: 0, reserved: 0 },
        "circular": { total: 5, reserved: 0 },
        "Rectangle": { total: 0, reserved: 0 }
      }
    }
  ]);

  const seatTypeHeaders = ["Angular Ws", "Flexi Desk", "Cabin", "Fixed Desk", "IOS", "cabin", "circular", "Rectangle"];

  const handleAddClick = () => {
    navigate('/vas/space-management/setup/seat-setup/add');
  };

  const handleEditClick = (setupId: number) => {
    navigate(`/vas/space-management/setup/seat-setup/edit/${setupId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Seat Setup</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">SEAT SETUP</h1>
            <Button 
              onClick={handleAddClick}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Seat Type Headers */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-4">
          <div className="bg-gray-100 p-4">
            <div className="flex gap-4">
              <div className="w-32">
                <span className="text-sm font-medium text-gray-700">Seat Type</span>
              </div>
              {seatTypeHeaders.map((header) => (
                <div key={header} className="w-20 text-center">
                  <span className="text-sm font-medium text-gray-700">{header}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Location</TableHead>
                <TableHead className="font-semibold text-gray-700">Floor</TableHead>
                {seatTypeHeaders.map((header) => (
                  <TableHead key={header} className="font-semibold text-gray-700 text-center">
                    <div className="space-y-1">
                      <div className="text-xs">Total Seats</div>
                      <div className="text-xs text-red-600">Reserved Seats</div>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seatSetups.map((setup) => (
                <TableRow key={setup.id} className="border-b">
                  <TableCell className="font-medium">{setup.location}</TableCell>
                  <TableCell>{setup.floor}</TableCell>
                  {seatTypeHeaders.map((seatType) => (
                    <TableCell key={seatType} className="text-center">
                      <div className="space-y-1">
                        <div className="text-sm">{setup.seatTypes[seatType]?.total || 0}</div>
                        <div className="text-sm text-red-600">{setup.seatTypes[seatType]?.reserved || 0}</div>
                      </div>
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1"
                      onClick={() => handleEditClick(setup.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
