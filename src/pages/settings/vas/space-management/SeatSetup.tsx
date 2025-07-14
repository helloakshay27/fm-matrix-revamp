
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Download, Upload } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface SeatData {
  id: number;
  location: string;
  floor: string;
  seatTypes: {
    [key: string]: {
      totalSeats: number;
      reservedSeats: number;
    };
  };
}

const seatTypeColumns = [
  'Angular Ws', 'Flexi Desk', 'Cabin', 'Fixed Desk', 'IOS', 'cabin', 
  'circular', 'Rectangle', 'circularchair', 'Hot Desk', 'Fixed Angular Chair', 
  'Cubical', 'Cafe', 'Hotseat'
];

export const SeatSetup = () => {
  const navigate = useNavigate();
  const [seatData] = useState<SeatData[]>([
    {
      id: 1,
      location: "BBT A",
      floor: "TA Floor 1",
      seatTypes: {
        "Angular Ws": { totalSeats: 0, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 4, reservedSeats: 0 },
        "Cabin": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 0, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 0, reservedSeats: 0 },
        "Rectangle": { totalSeats: 2, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    },
    {
      id: 2,
      location: "test",
      floor: "Ground Floor",
      seatTypes: {
        "Angular Ws": { totalSeats: 0, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 4, reservedSeats: 0 },
        "Cabin": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 0, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 0, reservedSeats: 0 },
        "Rectangle": { totalSeats: 0, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    },
    {
      id: 3,
      location: "Jyoti Tower",
      floor: "Ground Floor",
      seatTypes: {
        "Angular Ws": { totalSeats: 5, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 4, reservedSeats: 0 },
        "Cabin": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 5, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 0, reservedSeats: 0 },
        "Rectangle": { totalSeats: 0, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    },
    {
      id: 4,
      location: "Gophygital",
      floor: "2",
      seatTypes: {
        "Angular Ws": { totalSeats: 0, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 4, reservedSeats: 0 },
        "Cabin": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 0, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 5, reservedSeats: 0 },
        "Rectangle": { totalSeats: 0, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    },
    {
      id: 5,
      location: "Gophygital",
      floor: "First Floor",
      seatTypes: {
        "Angular Ws": { totalSeats: 0, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 0, reservedSeats: 0 },
        "Cabin": { totalSeats: 4, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 0, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 0, reservedSeats: 0 },
        "Rectangle": { totalSeats: 0, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    },
    {
      id: 6,
      location: "Gophygital",
      floor: "Third Floor",
      seatTypes: {
        "Angular Ws": { totalSeats: 0, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 0, reservedSeats: 0 },
        "Cabin": { totalSeats: 4, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 0, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 0, reservedSeats: 0 },
        "Rectangle": { totalSeats: 0, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    },
    {
      id: 7,
      location: "Jyoti Tower",
      floor: "First Floor",
      seatTypes: {
        "Angular Ws": { totalSeats: 10, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 10, reservedSeats: 0 },
        "Cabin": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 0, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 0, reservedSeats: 0 },
        "Rectangle": { totalSeats: 0, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    },
    {
      id: 8,
      location: "Jyoti Tower",
      floor: "Second Floor",
      seatTypes: {
        "Angular Ws": { totalSeats: 15, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 0, reservedSeats: 0 },
        "Cabin": { totalSeats: 25, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 0, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 0, reservedSeats: 0 },
        "Rectangle": { totalSeats: 0, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    },
    {
      id: 9,
      location: "Jyoti Tower",
      floor: "Third Floor",
      seatTypes: {
        "Angular Ws": { totalSeats: 10, reservedSeats: 0 },
        "Flexi Desk": { totalSeats: 0, reservedSeats: 0 },
        "Cabin": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Desk": { totalSeats: 4, reservedSeats: 0 },
        "IOS": { totalSeats: 0, reservedSeats: 0 },
        "cabin": { totalSeats: 0, reservedSeats: 0 },
        "circular": { totalSeats: 0, reservedSeats: 0 },
        "Rectangle": { totalSeats: 0, reservedSeats: 0 },
        "circularchair": { totalSeats: 0, reservedSeats: 0 },
        "Hot Desk": { totalSeats: 0, reservedSeats: 0 },
        "Fixed Angular Chair": { totalSeats: 0, reservedSeats: 0 },
        "Cubical": { totalSeats: 0, reservedSeats: 0 },
        "Cafe": { totalSeats: 0, reservedSeats: 0 },
        "Hotseat": { totalSeats: 0, reservedSeats: 0 }
      }
    }
  ]);

  const handleAddClick = () => {
    navigate('/settings/vas/space-management/seat-setup/add');
  };

  const handleEditClick = (setupId: number) => {
    navigate(`/settings/vas/space-management/seat-setup/edit/${setupId}`);
  };

  const calculateTotals = () => {
    const totals: { [key: string]: { totalSeats: number; reservedSeats: number } } = {};
    
    seatTypeColumns.forEach(seatType => {
      totals[seatType] = { totalSeats: 0, reservedSeats: 0 };
    });

    seatData.forEach(location => {
      seatTypeColumns.forEach(seatType => {
        const seatInfo = location.seatTypes[seatType] || { totalSeats: 0, reservedSeats: 0 };
        totals[seatType].totalSeats += seatInfo.totalSeats;
        totals[seatType].reservedSeats += seatInfo.reservedSeats;
      });
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Home &gt; Settings &gt; Value Added Services &gt; Space Management &gt; Seat Setup
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">SEAT SETUP</h1>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
              <Button 
                onClick={handleAddClick}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search locations..."
            className="max-w-md"
          />
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10 min-w-[120px]">
                    Location
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 sticky left-[120px] bg-gray-50 z-10 min-w-[100px]">
                    Floor
                  </TableHead>
                  {seatTypeColumns.map((seatType) => (
                    <TableHead key={seatType} className="font-semibold text-gray-700 text-center min-w-[80px]">
                      <div className="space-y-1">
                        <div className="text-xs">{seatType}</div>
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-600">Total Seats</span>
                          <span className="text-red-600">Reserved Seats</span>
                        </div>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold text-gray-700 text-center sticky right-0 bg-gray-50 z-10">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seatData.map((location) => (
                  <TableRow key={location.id} className="border-b hover:bg-gray-50">
                    <TableCell className="font-medium sticky left-0 bg-white z-10">
                      {location.location}
                    </TableCell>
                    <TableCell className="sticky left-[120px] bg-white z-10">
                      {location.floor}
                    </TableCell>
                    {seatTypeColumns.map((seatType) => {
                      const seatInfo = location.seatTypes[seatType] || { totalSeats: 0, reservedSeats: 0 };
                      return (
                        <TableCell key={seatType} className="text-center">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-600">{seatInfo.totalSeats}</span>
                            <span className="text-red-600">{seatInfo.reservedSeats}</span>
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center sticky right-0 bg-white z-10">
                      <div className="flex gap-2 justify-center">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-1 hover:bg-gray-100"
                          onClick={() => handleEditClick(location.id)}
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-1 hover:bg-gray-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Total Row */}
                <TableRow className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                  <TableCell className="sticky left-0 bg-gray-100 z-10">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell className="sticky left-[120px] bg-gray-100 z-10">
                    -
                  </TableCell>
                  {seatTypeColumns.map((seatType) => (
                    <TableCell key={seatType} className="text-center">
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="text-blue-600">{totals[seatType].totalSeats}</span>
                        <span className="text-red-600">{totals[seatType].reservedSeats}</span>
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="sticky right-0 bg-gray-100 z-10">
                    -
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
