
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Grid3X3, Download, Edit } from 'lucide-react';

const invoiceApprovalsData = [
  { id: 198, function: 'Custom Form 11372', createdOn: '08/10/2024', createdBy: 'Vinayak Mane' },
  { id: 173, function: 'Gdn', createdOn: '10/04/2024', createdBy: 'Vinayak Mane' },
  { id: 172, function: 'Work Order', createdOn: '10/04/2024', createdBy: 'Robert Day2' },
  { id: 108, function: 'Grn', createdOn: '01/08/2023', createdBy: 'Robert Day2' },
  { id: 34, function: 'Work Order Invoice', createdOn: '23/11/2022', createdBy: 'Robert Day2' },
  { id: 33, function: 'Purchase Order', createdOn: '15/11/2022', createdBy: 'Robert Day2' }
];

export const AssetSetupApprovalMatrix = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = invoiceApprovalsData.filter(item =>
    item.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <span className="text-sm text-gray-600">Setup &gt; Asset Setup &gt; Approval Matrix</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">INVOICE APPROVALS</h1>
          
          <div className="flex items-center justify-between">
            <Button className="bg-purple-700 hover:bg-purple-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-center font-semibold">Edit</TableHead>
                <TableHead className="text-center font-semibold">Id</TableHead>
                <TableHead className="text-center font-semibold">Function</TableHead>
                <TableHead className="text-center font-semibold">Created On</TableHead>
                <TableHead className="text-center font-semibold">Created by</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">{item.id}</TableCell>
                  <TableCell className="text-center">{item.function}</TableCell>
                  <TableCell className="text-center">{item.createdOn}</TableCell>
                  <TableCell className="text-center">{item.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
