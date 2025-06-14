
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PermitPendingApprovalsDashboard = () => {
  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>View</TableHead>
              <TableHead>Permit Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference No</TableHead>
              <TableHead>Site Name</TableHead>
              <TableHead>Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No pending approvals found
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PermitPendingApprovalsDashboard;
