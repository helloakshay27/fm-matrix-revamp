
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, FileDown, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const InvoiceApprovalsPage = () => {
  const approvals = [
    { id: 198, function: 'Custom Form 11372', createdOn: '08/10/2024', createdBy: 'Vinayak Mane' },
    { id: 173, function: 'Gdn', createdOn: '10/04/2024', createdBy: 'Vinayak Mane' },
    { id: 172, function: 'Work Order', createdOn: '10/04/2024', createdBy: 'Robert Day2' },
    { id: 108, function: 'Grn', createdOn: '01/08/2023', createdBy: 'Robert Day2' },
    { id: 34, function: 'Work Order Invoice', createdOn: '23/11/2022', createdBy: 'Robert Day2' },
    { id: 33, function: 'Purchase Order', createdOn: '15/11/2022', createdBy: 'Robert Day2' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">
          Setup &gt; Invoice Approvals
        </div>
        <h1 className="text-2xl font-bold text-gray-900">INVOICE APPROVALS</h1>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          + Add
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              className="pl-10 w-80 bg-white"
            />
          </div>
          <Button variant="outline" size="icon" className="bg-white">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-white">
            <FileDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Edit</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Function</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Created by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {approval.id}
                </TableCell>
                <TableCell>{approval.function}</TableCell>
                <TableCell>{approval.createdOn}</TableCell>
                <TableCell>{approval.createdBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
