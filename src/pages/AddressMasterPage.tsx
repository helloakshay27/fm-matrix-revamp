
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Plus } from 'lucide-react';

// Mock data for addresses
const addressData = [
  {
    id: 1,
    title: 'demo',
    buildingName: 'Jyoti',
    email: 'slyfesamanergy146@gmail.com',
    state: 'MAHARASHTRA',
    phoneNumber: '7359013258',
    fax: '+91789.894545.565',
    gstNo: 'TGtyJ9676857',
    createdOn: '23/11/2022',
    updatedOn: '23/11/2022'
  }
];

export const AddressMasterPage = () => {
  const [showForm, setShowForm] = useState(false);

  const handleAddClick = () => {
    setShowForm(!showForm);
  };

  const handleEditClick = (address) => {
    console.log('Edit address:', address);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-[#1a1a1a]">ADDRESSES</h1>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Button 
          onClick={handleAddClick}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Action</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Building Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Fax</TableHead>
              <TableHead>GST No.</TableHead>
              <TableHead>Created On</TableHead>
              <TableHead>Updated On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addressData.map((address) => (
              <TableRow key={address.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditClick(address)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{address.title}</TableCell>
                <TableCell>{address.buildingName}</TableCell>
                <TableCell>{address.email}</TableCell>
                <TableCell>{address.state}</TableCell>
                <TableCell>{address.phoneNumber}</TableCell>
                <TableCell>{address.fax}</TableCell>
                <TableCell>{address.gstNo}</TableCell>
                <TableCell>{address.createdOn}</TableCell>
                <TableCell>{address.updatedOn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
