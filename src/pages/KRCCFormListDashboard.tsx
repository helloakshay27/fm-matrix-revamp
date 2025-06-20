
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Filter, Download } from 'lucide-react';

export const KRCCFormListDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span>Krcc Forms</span>
        <span className="mx-2">></span>
        <span>KRCC FORM List</span>
      </div>
      
      <h1 className="text-2xl font-semibold text-gray-900">KRCC FORM LIST</h1>
      
      <div className="flex gap-4 mb-6">
        <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">User Email</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
