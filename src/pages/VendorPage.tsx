import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

const vendors = [
  {
    id: 'V001',
    name: 'Reliable Parts Ltd.',
    category: 'Mechanical',
    email: 'contact@reliableparts.com',
    phone: '+1-202-555-0182',
    status: 'Active',
  },
  {
    id: 'V002',
    name: 'Electro Supplies Inc.',
    category: 'Electrical',
    email: 'sales@electrosupplies.com',
    phone: '+1-202-555-0191',
    status: 'Active',
  },
  {
    id: 'V003',
    name: 'Clean Sweep Co.',
    category: 'Housekeeping',
    email: 'info@cleansweep.com',
    phone: '+1-202-555-0143',
    status: 'Inactive',
  },
];

export const VendorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
        <Button onClick={() => navigate('/maintenance/vendor/add')} className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Vendor ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {vendor.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
