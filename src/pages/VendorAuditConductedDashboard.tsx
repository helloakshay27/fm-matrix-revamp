
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';

export const VendorAuditConductedDashboard = () => {
  // Empty data for now as shown in the image
  const conductedData: any[] = [];

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Audits Conducted</span>
          <span className="mx-2">{'>'}</span>
          <span>Audits Conducted List</span>
        </nav>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">Vendor Audits</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Report</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Audit Name</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Conducted By</TableHead>
              <TableHead>Total Score</TableHead>
              <TableHead>Evaluation Score</TableHead>
              <TableHead>%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conductedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No vendor audits conducted yet
                </TableCell>
              </TableRow>
            ) : (
              conductedData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-blue-600 font-medium">
                    {item.id}
                  </TableCell>
                  <TableCell>{item.vendorName}</TableCell>
                  <TableCell>{item.auditName}</TableCell>
                  <TableCell>{item.dateTime}</TableCell>
                  <TableCell>{item.conductedBy}</TableCell>
                  <TableCell>{item.totalScore}</TableCell>
                  <TableCell>{item.evaluationScore}</TableCell>
                  <TableCell>{item.percentage}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VendorAuditConductedDashboard;
