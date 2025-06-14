
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const FitoutRequestDashboard = () => {
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
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline" className="border-gray-300">
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
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                No fitout requests found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
