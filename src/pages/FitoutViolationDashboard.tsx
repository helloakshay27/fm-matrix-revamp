
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const FitoutViolationDashboard = () => {
  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fitout &gt; Fitout Violation</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">FITOUT VIOLATION</h1>

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
              <TableHead className="font-semibold">Violation ID</TableHead>
              <TableHead className="font-semibold">Unit</TableHead>
              <TableHead className="font-semibold">Violation Type</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Reported Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No violations found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
