
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { CreateShiftDialog } from "@/components/CreateShiftDialog";
import { EditShiftDialog } from "@/components/EditShiftDialog";

interface ShiftData {
  id: number;
  timings: string;
  totalHours: number;
  checkInMargin: string;
  createdOn: string;
  createdBy: string;
}

export const ShiftDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftData | null>(null);
  
  const [shifts] = useState<ShiftData[]>([
    {
      id: 1,
      timings: "08:00 AM to 05:00 PM",
      totalHours: 9,
      checkInMargin: "0h0m",
      createdOn: "19/03/2024",
      createdBy: ""
    },
    {
      id: 2,
      timings: "02:00 AM to 06:00 AM",
      totalHours: 4,
      checkInMargin: "1h0m",
      createdOn: "05/05/2023",
      createdBy: "Robert Day2"
    },
    {
      id: 3,
      timings: "10:15 AM to 07:30 PM",
      totalHours: 9,
      checkInMargin: "0h0m",
      createdOn: "05/05/2023",
      createdBy: "Robert Day2"
    },
    {
      id: 4,
      timings: "10:00 AM to 07:00 PM",
      totalHours: 9,
      checkInMargin: "0h0m",
      createdOn: "29/11/2022",
      createdBy: ""
    },
    {
      id: 5,
      timings: "09:00 AM to 06:00 PM",
      totalHours: 9,
      checkInMargin: "0h0m",
      createdOn: "28/11/2022",
      createdBy: ""
    },
    {
      id: 6,
      timings: "10:30 AM to 06:30 PM",
      totalHours: 8,
      checkInMargin: "0h0m",
      createdOn: "28/11/2022",
      createdBy: "Robert Day2"
    },
    {
      id: 7,
      timings: "10:00 AM to 11:00 AM",
      totalHours: 1,
      checkInMargin: "0h0m",
      createdOn: "21/11/2022",
      createdBy: "Robert Day2"
    },
    {
      id: 8,
      timings: "01:00 AM to 11:00 PM",
      totalHours: 22,
      checkInMargin: "0h0m",
      createdOn: "21/11/2022",
      createdBy: "Robert Day2"
    },
    {
      id: 9,
      timings: "03:15 AM to 11:15 PM",
      totalHours: 20,
      checkInMargin: "0h0m",
      createdOn: "22/06/2022",
      createdBy: "Robert Day2"
    },
    {
      id: 10,
      timings: "10:00 AM to 08:00 PM",
      totalHours: 10,
      checkInMargin: "3h0m",
      createdOn: "09/08/2021",
      createdBy: "Robert Day2"
    }
  ]);

  const handleAddClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditClick = (shift: ShiftData) => {
    setSelectedShift(shift);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Shifts</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">USER SHIFTS</h1>
            <Button 
              onClick={handleAddClick}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adds
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                <TableHead className="font-semibold text-gray-700">Timings</TableHead>
                <TableHead className="font-semibold text-gray-700">Total Hour</TableHead>
                <TableHead className="font-semibold text-gray-700">Check In Margin</TableHead>
                <TableHead className="font-semibold text-gray-700">Created On</TableHead>
                <TableHead className="font-semibold text-gray-700">Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shifts.map((shift) => (
                <TableRow key={shift.id} className="border-b">
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1"
                      onClick={() => handleEditClick(shift)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{shift.timings}</TableCell>
                  <TableCell>{shift.totalHours}</TableCell>
                  <TableCell>{shift.checkInMargin}</TableCell>
                  <TableCell>{shift.createdOn}</TableCell>
                  <TableCell>{shift.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <CreateShiftDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen} 
        />
        
        <EditShiftDialog 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen} 
          shift={selectedShift}
          onShiftUpdated={() => {
            // You can add logic here to refresh the shifts data
            // For now, we'll just close the dialog
            console.log('Shift updated successfully');
          }}
        />
      </div>
    </div>
  );
};
