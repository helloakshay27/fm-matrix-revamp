
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus } from "lucide-react";
import { AddCategoryModal } from "@/components/AddCategoryModal";

interface SeatType {
  id: number;
  name: string;
  active: boolean;
  createdOn: string;
}

export const SeatTypeDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([
    { id: 1, name: "Hostcast", active: true, createdOn: "19/03/2024" },
    { id: 2, name: "Cafe", active: true, createdOn: "05/05/2023" },
    { id: 3, name: "Cubical", active: true, createdOn: "13/03/2023" },
    { id: 4, name: "Fixed Angular Chair", active: true, createdOn: "24/01/2023" },
    { id: 5, name: "Hot Desk", active: true, createdOn: "30/11/2022" },
    { id: 6, name: "structchair", active: true, createdOn: "29/11/2022" },
    { id: 7, name: "Rectangle", active: true, createdOn: "28/11/2022" },
    { id: 8, name: "circular", active: true, createdOn: "28/11/2022" },
    { id: 9, name: "cabin", active: true, createdOn: "10/11/2022" },
    { id: 10, name: "iOS", active: true, createdOn: "09/11/2022" },
    { id: 11, name: "Fixed Desk", active: true, createdOn: "31/07/2021" },
    { id: 12, name: "Cabin", active: true, createdOn: "31/07/2021" },
    { id: 13, name: "Flexi Desk", active: true, createdOn: "31/07/2021" },
    { id: 14, name: "Angular Wa", active: true, createdOn: "31/07/2021" }
  ]);

  const handleAddSeatType = (newSeatType: { category: string; amount: string }) => {
    const seatType: SeatType = {
      id: seatTypes.length + 1,
      name: newSeatType.category,
      active: true,
      createdOn: new Date().toLocaleDateString('en-GB')
    };
    setSeatTypes([...seatTypes, seatType]);
  };

  const handleToggleActive = (id: number) => {
    setSeatTypes(seatTypes.map(seat =>
      seat.id === id ? { ...seat, active: !seat.active } : seat
    ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Space &gt; Seat Type</div>
            <h1 className="text-2xl font-bold text-gray-800">SEAT TYPE</h1>
          </div>
          
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Active/Inactive</TableHead>
                <TableHead className="font-semibold text-gray-700">Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seatTypes.map((seat) => (
                <TableRow key={seat.id}>
                  <TableCell>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{seat.name}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={seat.active} 
                      onCheckedChange={() => handleToggleActive(seat.id)}
                    />
                  </TableCell>
                  <TableCell>{seat.createdOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add Category Modal */}
        <AddCategoryModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSeatType}
        />
      </div>
    </div>
  );
};
