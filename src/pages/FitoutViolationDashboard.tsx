
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const FitoutViolationDashboard = () => {
  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Fitout &gt; Fitout Violation</span>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
        FITOUT VIOLATIONS
      </h1>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Report Violation
        </Button>
        <Button variant="outline" className="border-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  <div className="bg-[#F2F0EB] p-4  shadow-[0px_2px_18px_rgba(45,45,45,0.1)]  md:h-[132px] flex items-center justify-between">
    <p className="text-2xl font-bold text-[#D92818]">0</p>
    <h3 className="text-sm font-medium text-gray-600 text-right">Total Violations</h3>
  </div>
  <div className="bg-[#F2F0EB] p-4  shadow-[0px_2px_18px_rgba(45,45,45,0.1)] border-l-4  md:h-[132px] flex items-center justify-between">
    <p className="text-2xl font-bold text-[#D92818]">0</p>
    <h3 className="text-sm font-medium text-gray-600 text-right">Pending</h3>
  </div>
  <div className="bg-[#F2F0EB] p-4  shadow-[0px_2px_18px_rgba(45,45,45,0.1)] border-l-4  md:h-[132px] flex items-center justify-between">
    <p className="text-2xl font-bold text-[#D92818]">0</p>
    <h3 className="text-sm font-medium text-gray-600 text-right">In Progress</h3>
  </div>
  <div className="bg-[#F2F0EB] p-4  shadow-[0px_2px_18px_rgba(45,45,45,0.1)] border-l-4  md:h-[132px] flex items-center justify-between">
    <p className="text-2xl font-bold text-[#D92818]">0</p>
    <h3 className="text-sm font-medium text-gray-600 text-right">Resolved</h3>
  </div>
</div>


      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">Violation ID</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Unit</TableHead>
              <TableHead className="font-semibold">Severity</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Reported Date</TableHead>
              <TableHead className="font-semibold">Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No violations reported. This is good news!
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
