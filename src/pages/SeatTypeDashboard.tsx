
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus } from "lucide-react";
import { AddSeatTypeDialog } from "@/components/AddSeatTypeDialog";
import { EditSeatTypeDialog } from "@/components/EditSeatTypeDialog";

interface SeatType {
  id: number;
  name: string;
  active: boolean;
  createdOn: string;
}

export const SeatTypeDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSeatType, setEditingSeatType] = useState<SeatType | null>(null);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([
    { id: 1, name: "Hotseat", active: true, createdOn: "19/03/2024" },
    { id: 2, name: "Cafe", active: true, createdOn: "05/05/2023" },
    { id: 3, name: "Cubical", active: true, createdOn: "13/03/2023" },
    { id: 4, name: "Fixed Angular Chair", active: true, createdOn: "24/01/2023" },
    { id: 5, name: "Hot Desk", active: true, createdOn: "30/11/2022" },
    { id: 6, name: "circularchair", active: true, createdOn: "29/11/2022" },
    { id: 7, name: "Rectangle", active: true, createdOn: "28/11/2022" },
    { id: 8, name: "circular", active: true, createdOn: "28/11/2022" },
    { id: 9, name: "cabin", active: true, createdOn: "10/11/2022" },
    { id: 10, name: "iOS", active: true, createdOn: "09/11/2022" }
  ]);

  const handleAddSeatType = (data: { categoryName: string; file?: File }) => {
    const seatType: SeatType = {
      id: seatTypes.length + 1,
      name: data.categoryName,
      active: true,
      createdOn: new Date().toLocaleDateString('en-GB')
    };
    setSeatTypes([...seatTypes, seatType]);
    console.log('Added seat type:', data);
  };

  const handleEditSeatType = (seatType: SeatType) => {
    setEditingSeatType(seatType);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSeatType = (data: { categoryName: string; file?: File }) => {
    if (editingSeatType) {
      setSeatTypes(seatTypes.map(seat =>
        seat.id === editingSeatType.id 
          ? { ...seat, name: data.categoryName }
          : seat
      ));
      console.log('Updated seat type:', data);
    }
  };

  const handleToggleActive = (id: number) => {
    setSeatTypes(seatTypes.map(seat =>
      seat.id === id ? { ...seat, active: !seat.active } : seat
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Seat Type</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">SEAT TYPE</h1>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700 w-20">Actions</TableHead>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Active/ Inactive</TableHead>
                <TableHead className="font-semibold text-gray-700">Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seatTypes.map((seat) => (
                <TableRow key={seat.id} className="border-b">
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="p-1"
                      onClick={() => handleEditSeatType(seat)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{seat.name}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={seat.active} 
                      onCheckedChange={() => handleToggleActive(seat.id)}
                    />
                  </TableCell>
                  <TableCell className="text-gray-600">{seat.createdOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add Seat Type Dialog */}
        <AddSeatTypeDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddSeatType}
        />

        {/* Edit Seat Type Dialog */}
        <EditSeatTypeDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          seatType={editingSeatType}
          onSubmit={handleUpdateSeatType}
        />
      </div>
    </div>
  );
};
