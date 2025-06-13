
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProjectFilterModal } from "@/components/ProjectFilterModal";
import { useNavigate } from 'react-router-dom';

export const ProjectsDashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddProject = () => {
    navigate('/projects/add');
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fitout Requests &gt; Fitout Request List</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">FITOUT REQUEST LIST</h1>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button 
          onClick={handleAddProject}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button 
          variant="outline"
          onClick={() => setIsFilterOpen(true)}
          className="border-purple-700 text-purple-700 hover:bg-purple-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Tower</TableHead>
              <TableHead className="font-semibold">Unit</TableHead>
              <TableHead className="font-semibold">Supplier</TableHead>
              <TableHead className="font-semibold">Master Status</TableHead>
              <TableHead className="font-semibold">Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Empty state - no data to display */}
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                No fitout requests found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Filter Modal */}
      <ProjectFilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};
