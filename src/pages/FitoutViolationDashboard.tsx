
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-600">Total Violations</h3>
          <p className="text-2xl font-bold text-red-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-600">Resolved</h3>
          <p className="text-2xl font-bold text-green-600">0</p>
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
