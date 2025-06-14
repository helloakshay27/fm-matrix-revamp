
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const FitoutChecklistDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fitout &gt; Fitout Checklist</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">FITOUT CHECKLIST</h1>

      {/* Search and Action Buttons */}
      <div className="flex gap-4 mb-6 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search checklists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Checklist
        </Button>
        <Button variant="outline" className="border-gray-300">
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
              <TableHead className="font-semibold">Checklist Name</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold">Items Count</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Created Date</TableHead>
              <TableHead className="font-semibold">Modified Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No checklists found. Click "Add Checklist" to create your first checklist.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
