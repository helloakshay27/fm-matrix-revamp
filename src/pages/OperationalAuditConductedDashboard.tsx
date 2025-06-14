
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

export const OperationalAuditConductedDashboard = () => {
  // Sample data - you can replace with actual data
  const conductedData = [
    { id: "OA001", auditName: "Fire Safety Audit", location: "Building A", conductedDate: "15/01/2025", auditor: "John Doe", result: "Passed", score: "95%" },
    { id: "OA002", auditName: "HVAC Inspection", location: "Building B", conductedDate: "12/01/2025", auditor: "Jane Smith", result: "Failed", score: "65%" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div>
          <p className="text-[#1a1a1a] opacity-70 mb-2">Operational Audit &gt; Conducted</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">CONDUCTED AUDITS</h1>
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
              <TableHead className="font-semibold text-gray-700">Conducted Date</TableHead>
              <TableHead className="font-semibold text-gray-700">Auditor</TableHead>
              <TableHead className="font-semibold text-gray-700">Result</TableHead>
              <TableHead className="font-semibold text-gray-700">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conductedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-blue-600 font-medium">{item.id}</TableCell>
                <TableCell>{item.auditName}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.conductedDate}</TableCell>
                <TableCell>{item.auditor}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.result === 'Passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.result}
                  </span>
                </TableCell>
                <TableCell>{item.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
