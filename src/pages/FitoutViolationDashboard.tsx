
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter, AlertTriangle, Settings } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
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
        <Button className="fm-button-fix fm-button-brand px-4 py-2">
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
        <StatsCard
          title="Total Violations"
          value={0}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
        <StatsCard
          title="Pending"
          value={0}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
        <StatsCard
          title="In Progress"
          value={0}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
        <StatsCard
          title="Resolved"
          value={0}
          icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "#C72030" }} />}
        />
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
