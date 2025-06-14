
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const GDNPendingApprovalsDashboard = () => {
  // Sample data - empty as shown in the image
  const pendingApprovalsData: any[] = [];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        GDN &gt; Pending Approvals
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Pending Approvals</h1>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">View</TableHead>
              <TableHead className="font-semibold">GDN ID</TableHead>
              <TableHead className="font-semibold">Site Name</TableHead>
              <TableHead className="font-semibold">Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingApprovalsData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No pending approvals found
                </TableCell>
              </TableRow>
            ) : (
              pendingApprovalsData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>
                    <Button size="sm" variant="ghost" className="p-1">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{item.gdnId}</TableCell>
                  <TableCell>{item.siteName}</TableCell>
                  <TableCell>{item.level}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
