
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Eye, Plus, Download, Filter, MessageSquare } from 'lucide-react';

const mockVendorData = [
  {
    id: '52837',
    companyName: 'xyz',
    companyCode: '',
    gstinNumber: '',
    panNumber: '',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '05/07/2024, 12:00 AM',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '51601',
    companyName: 'vw',
    companyCode: '',
    gstinNumber: '',
    panNumber: '',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '40005',
    companyName: 'Vodafone',
    companyCode: '',
    gstinNumber: '',
    panNumber: '',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '54266',
    companyName: 'Teting123',
    companyCode: '',
    gstinNumber: '',
    panNumber: '',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  }
];

export const VendorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Supplier</span>
          <span>{'>'}}</span>
          <span>Supplier List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">SUPPLIER LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          <Download className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
          <MessageSquare className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Action</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Company Code</TableHead>
              <TableHead>GSTIN Number</TableHead>
              <TableHead>PAN Number</TableHead>
              <TableHead>Supplier Type</TableHead>
              <TableHead>PO Outstandings</TableHead>
              <TableHead>WO Outstandings</TableHead>
              <TableHead>Ratings</TableHead>
              <TableHead>Signed On Contract</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>KYC End In Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVendorData.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.companyName}</TableCell>
                <TableCell>{vendor.companyCode}</TableCell>
                <TableCell>{vendor.gstinNumber}</TableCell>
                <TableCell>{vendor.panNumber}</TableCell>
                <TableCell>{vendor.supplierType}</TableCell>
                <TableCell>{vendor.poOutstandings}</TableCell>
                <TableCell>{vendor.woOutstandings}</TableCell>
                <TableCell>{vendor.ratings}</TableCell>
                <TableCell>{vendor.signedOnContract}</TableCell>
                <TableCell>
                  <Switch checked={vendor.status} />
                </TableCell>
                <TableCell>{vendor.kycEndInDays}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-[#8B4513] text-white">1</Button>
        <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
        <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
        <Button variant="outline" size="sm" className="px-3">Last {'>'}}</Button>
      </div>
    </div>
  );
};
