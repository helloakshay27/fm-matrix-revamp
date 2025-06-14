
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Eye, Download } from 'lucide-react';

const mockCustomerData = [
  {
    id: '1796',
    name: 'HSBC',
    customerCode: '',
    customerType: '',
    email: 'hsbc@gmail.com',
    mobile: '1234561231',
    plantCode: '',
    companyCode: '',
    leaseStartDate: '',
    leaseEndDate: '',
    freeParkingSpaces: '',
    paidParkingSpaces: '',
    createdAt: '',
    updatedAt: '',
    colorCode: '#FFD700'
  },
  {
    id: '1846',
    name: 'lockated',
    customerCode: '',
    customerType: '',
    email: 'lockated@gmail.com',
    mobile: '1111111111',
    plantCode: '',
    companyCode: '',
    leaseStartDate: '',
    leaseEndDate: '',
    freeParkingSpaces: '',
    paidParkingSpaces: '',
    createdAt: '',
    updatedAt: '2025-05-12 17:42:08 +0530',
    colorCode: '#FF0000'
  },
  {
    id: '1848',
    name: 'demo',
    customerCode: '',
    customerType: '',
    email: 'shreya@12.com',
    mobile: '',
    plantCode: '',
    companyCode: '',
    leaseStartDate: '',
    leaseEndDate: '',
    freeParkingSpaces: '',
    paidParkingSpaces: '',
    createdAt: '',
    updatedAt: '',
    colorCode: '#00FF00'
  },
  {
    id: '1858',
    name: 'Sohail Ansari',
    customerCode: '',
    customerType: '',
    email: 'demo2@gmail.com',
    mobile: '1111111111',
    plantCode: '',
    companyCode: '',
    leaseStartDate: '',
    leaseEndDate: '',
    freeParkingSpaces: '',
    paidParkingSpaces: '',
    createdAt: '',
    updatedAt: '',
    colorCode: '#FF00FF'
  },
  {
    id: '1873',
    name: 'Devesh Jain',
    customerCode: '',
    customerType: '',
    email: 'test1@gmail.com',
    mobile: '3333333333',
    plantCode: '',
    companyCode: '',
    leaseStartDate: '',
    leaseEndDate: '',
    freeParkingSpaces: '',
    paidParkingSpaces: '',
    createdAt: '',
    updatedAt: '',
    colorCode: '#0000FF'
  },
  {
    id: '1880',
    name: 'Mahendra Lungare',
    customerCode: '',
    customerType: '',
    email: 'test1@gmail.com',
    mobile: '2222222222',
    plantCode: '',
    companyCode: '',
    leaseStartDate: '',
    leaseEndDate: '',
    freeParkingSpaces: '',
    paidParkingSpaces: '',
    createdAt: '',
    updatedAt: '',
    colorCode: '#800080'
  }
];

export const CustomerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Customer</span>
          <span>&gt;</span>
          <span>Customer List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Customer List</h1>
      </div>

      {/* Export Button */}
      <div className="flex gap-3 mb-6">
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 max-w-md">
          <Input 
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          Go!
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Sr. No.</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Customer Code</TableHead>
              <TableHead>Customer Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Plant Code</TableHead>
              <TableHead>Company Code</TableHead>
              <TableHead>Lease Start Date</TableHead>
              <TableHead>Lease End Date</TableHead>
              <TableHead>Free Parking</TableHead>
              <TableHead>Paid Parking</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Color Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomerData.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.customerCode}</TableCell>
                <TableCell>{customer.customerType}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.mobile}</TableCell>
                <TableCell>{customer.plantCode}</TableCell>
                <TableCell>{customer.companyCode}</TableCell>
                <TableCell>{customer.leaseStartDate}</TableCell>
                <TableCell>{customer.leaseEndDate}</TableCell>
                <TableCell>{customer.freeParkingSpaces}</TableCell>
                <TableCell>{customer.paidParkingSpaces}</TableCell>
                <TableCell>{customer.createdAt}</TableCell>
                <TableCell>{customer.updatedAt}</TableCell>
                <TableCell>
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: customer.colorCode }}
                  ></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
