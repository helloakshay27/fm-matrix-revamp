
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus } from "lucide-react";
import { AddCategoryModal } from "@/components/AddCategoryModal";

interface ParkingCategory {
  id: number;
  name: string;
  active: boolean;
  createdOn: string;
}

const ParkingCategoriesDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories] = useState<ParkingCategory[]>([
    {
      id: 1,
      name: '2 Wheeler',
      active: true,
      createdOn: '18/04/2023'
    },
    {
      id: 2,
      name: '4 Wheeler',
      active: true,
      createdOn: '18/04/2023'
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span>Parking</span>
        <span>&gt;</span>
        <span>Category</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">PARKING CATEGORIES</h1>
        
        <div className="flex justify-start mb-4">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Actions</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Active/Inactive</TableHead>
                <TableHead>Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Switch checked={category.active} />
                  </TableCell>
                  <TableCell>{category.createdOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        Powered by <span className="font-semibold">goPhygital.work</span>
      </div>

      <AddCategoryModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default ParkingCategoriesDashboard;
