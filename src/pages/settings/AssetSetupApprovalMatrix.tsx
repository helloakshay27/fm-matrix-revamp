
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

export const AssetSetupApprovalMatrix = () => {
  const approvals = [
    { id: 198, function: 'Custom Form 11372', createdOn: '08/10/2024', createdBy: 'Vinayak Mane' },
    { id: 173, function: 'Gdn', createdOn: '10/04/2024', createdBy: 'Vinayak Mane' },
    { id: 172, function: 'Work Order', createdOn: '10/04/2024', createdBy: 'Robert Day2' },
    { id: 108, function: 'Grn', createdOn: '01/08/2023', createdBy: 'Robert Day2' },
    { id: 34, function: 'Work Order Invoice', createdOn: '23/11/2022', createdBy: 'Robert Day2' },
    { id: 33, function: 'Purchase Order', createdOn: '15/11/2022', createdBy: 'Robert Day2' }
  ];

  const handleAddClick = () => {
    window.location.href = '/settings/asset-setup/approval-matrix/add';
  };

  const handleEditClick = (id: number) => {
    window.location.href = `/settings/asset-setup/approval-matrix/edit/${id}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Setup</span>
          <span>&gt;</span>
          <span>Invoice Approvals</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">INVOICE APPROVALS</h1>
        
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            onClick={handleAddClick}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 text-sm"
          >
            + Add
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 w-80 bg-white border-gray-300"
              />
            </div>
            <Button variant="outline" size="icon" className="bg-white border-gray-300">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white border-gray-300">
              <FileDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-700 font-medium">Edit</TableHead>
              <TableHead className="text-gray-700 font-medium">Id</TableHead>
              <TableHead className="text-gray-700 font-medium">Function</TableHead>
              <TableHead className="text-gray-700 font-medium">Created On</TableHead>
              <TableHead className="text-gray-700 font-medium">Created by</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((approval, index) => (
              <TableRow key={approval.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-900 p-1"
                    onClick={() => handleEditClick(approval.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-blue-600 font-medium">
                  {approval.id}
                </TableCell>
                <TableCell className="text-gray-900">
                  {approval.function}
                </TableCell>
                <TableCell className="text-gray-900">
                  {approval.createdOn}
                </TableCell>
                <TableCell className="text-gray-900">
                  {approval.createdBy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
