
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export const OperationalAuditScheduledDashboard = () => {
  // Sample data - you can replace with actual data
  const scheduledData = [
    { id: "OA001", auditName: "Fire Safety Audit", location: "Building A", scheduledDate: "20/01/2025", auditor: "John Doe", status: "Scheduled" },
    { id: "OA002", auditName: "HVAC Inspection", location: "Building B", scheduledDate: "22/01/2025", auditor: "Jane Smith", status: "Scheduled" },
    { id: "OA003", auditName: "Security Check", location: "Main Gate", scheduledDate: "25/01/2025", auditor: "Mike Johnson", status: "Pending" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Operational Audit &gt; Scheduled</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">SCHEDULED AUDITS</h1>
        </div>
      </div>
      
      <div className="mb-4">
        <Button className="bg-[#C72030] hover:bg-[#a91b28] text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Audit Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Location</TableHead>
              <TableHead className="font-semibold text-gray-700">Scheduled Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Auditor</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                <TableCell>{item.auditName}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.scheduledDate}</TableCell>
                <TableCell>{item.auditor}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
