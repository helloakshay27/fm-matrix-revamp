
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from 'lucide-react';

export const AutoSavedPRDashboard = () => {
  // Sample data - empty as shown in the first image
  const tempRequestsData = [
    {
      type: "Material PR",
      lastUpdated: "14/06/2025 12:14 pm"
    },
    {
      type: "Service PR", 
      lastUpdated: "14/06/2025 12:17 pm"
    },
    {
      type: "GRN",
      lastUpdated: "14/06/2025 12:30 pm"
    }
  ];

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Temp Requests</h1>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">View</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tempRequestsData.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell>
                  <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                     <Eye className="w-4 h-4" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
