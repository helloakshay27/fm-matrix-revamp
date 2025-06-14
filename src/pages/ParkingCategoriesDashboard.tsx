
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit } from "lucide-react";
import { AddCategoryModal } from "@/components/AddCategoryModal";

const ParkingCategoriesDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [categories, setCategories] = useState([
    { id: 1, name: "2 Wheeler", active: true, createdOn: "18/04/2023" },
    { id: 2, name: "4 Wheeler", active: true, createdOn: "18/04/2023" },
  ]);

  const toggleActive = (id: number) => {
    setCategories(categories.map(category => 
      category.id === id ? { ...category, active: !category.active } : category
    ));
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span>Parking</span>
        <span>›</span>
        <span>Category</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">PARKING CATEGORIES</h1>
        
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
        >
          + Add
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Actions</TableHead>
              <TableHead className="font-semibold text-gray-900">Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Active/Inactive</TableHead>
              <TableHead className="font-semibold text-gray-900">Created On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <div
                    className={`w-8 h-4 rounded-full cursor-pointer ${
                      category.active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    onClick={() => toggleActive(category.id)}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        category.active ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </TableCell>
                <TableCell>{category.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddCategoryModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default ParkingCategoriesDashboard;
