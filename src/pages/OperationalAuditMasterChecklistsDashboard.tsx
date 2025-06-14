
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export const OperationalAuditMasterChecklistsDashboard = () => {
  // Sample data - you can replace with actual data
  const masterChecklistData = [
    { id: "MC001", checklistName: "Fire Safety Checklist", category: "Safety", status: "Active", createdOn: "15/01/2025, 10:30 AM" },
    { id: "MC002", checklistName: "HVAC Maintenance", category: "Maintenance", status: "Active", createdOn: "12/01/2025, 02:15 PM" },
    { id: "MC003", checklistName: "Security Audit", category: "Security", status: "Inactive", createdOn: "08/01/2025, 09:45 AM" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Operational Audit &gt; Master Checklists</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">MASTER CHECKLISTS</h1>
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
              <TableHead className="font-semibold text-gray-700">Checklist Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Category</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Created on</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {masterChecklistData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                <TableCell>{item.checklistName}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.createdOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
