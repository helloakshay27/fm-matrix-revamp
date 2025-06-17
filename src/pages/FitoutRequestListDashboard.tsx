
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { FitoutRequestFilterDialog } from '@/components/FitoutRequestFilterDialog';

interface FitoutProject {
  id: number;
  user: string;
  category: string;
  description: string;
  tower: string;
  unit: string;
  supplier: string;
  masterStatus: string;
  createdOn: string;
}

export const FitoutRequestListDashboard = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState<FitoutProject[]>([]);

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('fitoutProjects') || '[]');
    setProjects(savedProjects);
  }, []);

  const handleAddClick = () => {
    navigate('/transitioning/fitout/add-project');
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
          onClick={handleAddClick}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(true)}
          className="border-gray-300"
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
            {projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-[#C72030]">
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.user}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.tower}</TableCell>
                  <TableCell>{project.unit}</TableCell>
                  <TableCell>{project.supplier}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {project.masterStatus}
                    </span>
                  </TableCell>
                  <TableCell>{project.createdOn}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No fitout requests found. Click "Add" to create your first project.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Filter Dialog */}
      <FitoutRequestFilterDialog 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
};
