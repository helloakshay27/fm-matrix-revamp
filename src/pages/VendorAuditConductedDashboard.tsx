
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

export const VendorAuditConductedDashboard = () => {
  const [auditData] = useState([
    // Empty data to match the reference image showing an empty table
  ]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <p className="text-[#1a1a1a] opacity-70 mb-2">Audits Conducted &gt; Audits Conducted List</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Vendor Audits</h1>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Report</TableHead>
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Vendor Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Audit Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Date & Time</TableHead>
                <TableHead className="font-semibold text-gray-700">Conducted By</TableHead>
                <TableHead className="font-semibold text-gray-700">Total Score</TableHead>
                <TableHead className="font-semibold text-gray-700">Evaluation Score</TableHead>
                <TableHead className="font-semibold text-gray-700">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No vendor audits conducted yet
                  </TableCell>
                </TableRow>
              ) : (
                auditData.map((audit, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FileText className="w-5 h-5 text-blue-600 cursor-pointer" />
                    </TableCell>
                    <TableCell className="text-blue-600 font-medium">{audit.id}</TableCell>
                    <TableCell>{audit.vendorName}</TableCell>
                    <TableCell>{audit.auditName}</TableCell>
                    <TableCell>{audit.dateTime}</TableCell>
                    <TableCell>{audit.conductedBy}</TableCell>
                    <TableCell>{audit.totalScore}</TableCell>
                    <TableCell>{audit.evaluationScore}</TableCell>
                    <TableCell>{audit.percentage}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
