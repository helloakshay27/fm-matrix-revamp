
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
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

export const ApprovalMatrixPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const approvals = [
    { id: 171, function: 'Gdn', createdOn: '29/03/2024', createdBy: 'demo demo' },
    { id: 162, function: 'Supplier', createdOn: '14/12/2023', createdBy: 'demo demo' },
    { id: 161, function: 'Permit Closure', createdOn: '12/12/2023', createdBy: 'demo demo' },
    { id: 115, function: 'Permit Extend', createdOn: '25/09/2023', createdBy: 'demo demo' },
    { id: 113, function: 'Vendor Audit', createdOn: '15/09/2023', createdBy: 'Navin Lead Admin' },
    { id: 109, function: 'Permit', createdOn: '11/09/2023', createdBy: 'Navin Lead Admin' },
    { id: 5, function: 'Work Order Invoice', createdOn: '31/12/2021', createdBy: 'Navin Lead Admin' },
    { id: 4, function: 'Work Order', createdOn: '30/12/2021', createdBy: 'Navin Lead Admin' },
    { id: 3, function: 'Grn', createdOn: '30/12/2021', createdBy: 'Navin Lead Admin' },
    { id: 2, function: 'Bill', createdOn: '24/12/2021', createdBy: 'Navin Lead Admin' },
    { id: 1, function: 'Purchase Order', createdOn: '24/12/2021', createdBy: 'Navin Lead Admin' }
  ];

  const filteredApprovals = approvals.filter(approval =>
    approval.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
    approval.id.toString().includes(searchTerm) ||
    approval.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = () => {
    console.log('Add new approval matrix');
    // Navigate to add approval matrix page
  };

  const handleEditClick = (id: number) => {
    console.log('Edit approval matrix:', id);
    // Navigate to edit approval matrix page
  };

  const handleSearch = () => {
    console.log('Search triggered:', searchTerm);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">INVOICE APPROVALS</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="outline" size="icon">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <FileDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-start">
          <Button 
            onClick={handleAddClick}
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
          >
            + Add
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edit
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Id
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Function
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created On
                </TableHead>
                <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created by
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApprovals.map((approval) => (
                <TableRow key={approval.id} className="hover:bg-gray-50">
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
                  <TableCell className="text-sm text-blue-600 font-medium">
                    {approval.id}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {approval.function}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {approval.createdOn}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {approval.createdBy}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center mt-8 text-sm text-gray-500">
          <span>Powered by</span>
          <span className="ml-2 font-semibold text-gray-700">Phygitalwork</span>
        </div>
      </div>
    </Layout>
  );
};
