
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

  const handleFitoutSetup = () => {
    navigate('/projects/fitout-setup');
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Projects &gt; Project Dashboard</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">PROJECTS DASHBOARD</h1>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Fitout Setup</h3>
              <p className="text-gray-600 text-sm mt-1">Manage categories, status, and deviation settings</p>
            </div>
            <Button 
              onClick={handleFitoutSetup}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Open
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Fitout Requests</h3>
              <p className="text-gray-600 text-sm mt-1">View and manage fitout requests</p>
            </div>
            <Button 
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              View List
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Add New Project</h3>
              <p className="text-gray-600 text-sm mt-1">Create a new fitout project</p>
            </div>
            <Button 
              onClick={handleAddProject}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button 
          onClick={handleAddProject}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
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

      {/* Recent Projects Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Fitout Requests</h2>
        </div>
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
                No fitout requests found. Click "Add Project" to create your first project.
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
