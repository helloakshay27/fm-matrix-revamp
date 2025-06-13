
import React from 'react';
import { Eye, Plus, Download, Filter, Mail, ArrowUpDown, Search, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface SupplierTableProps {
  onAddSupplier: () => void;
}

const supplierData = [
  {
    id: '51024',
    companyName: 'Zoho Technologies Pvt Ltd',
    companyCode: '',
    gstinNumber: '33AAACZ5230C1ZU',
    panNumber: 'AAACZ5230C',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '51023',
    companyName: 'Zoho Corporation Pvt Ltd',
    companyCode: '',
    gstinNumber: '33AAACZ4322M2Z9',
    panNumber: 'AAACZ4322M',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '51022',
    companyName: 'ZK Realtors',
    companyCode: '',
    gstinNumber: '27AADPZ7065M1ZV',
    panNumber: 'AADPZ7065M',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '52206',
    companyName: 'YUG FACILITIES LLP',
    companyCode: '',
    gstinNumber: '27AABFY7556Q1Z7',
    panNumber: 'AABFY7556Q',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  },
  {
    id: '51021',
    companyName: 'Yerrow Fashion Retailers LLP',
    companyCode: '',
    gstinNumber: '19AABFY3051G1Z7',
    panNumber: 'AABFY3051G',
    supplierType: '',
    poOutstandings: 0,
    woOutstandings: 0,
    ratings: '',
    signedOnContract: '',
    status: true,
    kycEndInDays: ''
  }
];

export const SupplierTable = ({ onAddSupplier }: SupplierTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-[#D5DbDB]">
      {/* Table Header Actions */}
      <div className="p-4 border-b border-[#D5DbDB] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onAddSupplier}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Download className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <Mail className="w-4 h-4" />
            Invite
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#8B5CF6]/90 transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            Sync Vendors
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              className="pl-10 pr-4 py-2 border border-[#D5DbDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#D5DbDB] text-[#1a1a1a] rounded-lg hover:bg-[#f6f4ee] transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
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
          {supplierData.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </TableCell>
              <TableCell className="font-medium">{supplier.id}</TableCell>
              <TableCell>{supplier.companyName}</TableCell>
              <TableCell>{supplier.companyCode}</TableCell>
              <TableCell>{supplier.gstinNumber}</TableCell>
              <TableCell>{supplier.panNumber}</TableCell>
              <TableCell>{supplier.supplierType}</TableCell>
              <TableCell>{supplier.poOutstandings}</TableCell>
              <TableCell>{supplier.woOutstandings}</TableCell>
              <TableCell>{supplier.ratings}</TableCell>
              <TableCell>{supplier.signedOnContract}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className={`w-12 h-6 rounded-full ${supplier.status ? 'bg-orange-500' : 'bg-gray-300'} relative cursor-pointer transition-colors`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${supplier.status ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{supplier.kycEndInDays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
