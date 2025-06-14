
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Plus } from 'lucide-react';

const fmUsers = [
  {
    id: '212923',
    userName: 'yyujvjy jiujo',
    gender: 'Male',
    mobileNumber: '7897780978',
    email: 'tesruhhh@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: '',
    createdBy: 'Ankit Gupta',
    active: true
  },
  {
    id: '212919',
    userName: 'sameer kumar',
    gender: '',
    mobileNumber: '2134513211',
    email: '2134513211@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Soft Skill Personnel',
    employeeId: '',
    createdBy: '',
    active: true
  },
  {
    id: '212384',
    userName: 'ABHIDNYA TAPAL',
    gender: 'Female',
    mobileNumber: '7208523035',
    email: 'abhidnyatapal@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: '',
    createdBy: '',
    active: true
  },
  {
    id: '195169',
    userName: 'Dhananjay Bhoyar',
    gender: 'Male',
    mobileNumber: '9022281139',
    email: 'dhananjay.bhoyar@lockated.com',
    vendorCompanyName: 'N/A',
    entityName: 'lockated',
    unit: '',
    role: 'Admin',
    employeeId: '',
    createdBy: '',
    active: true
  },
  {
    id: '193551',
    userName: 'Ravi Sampat',
    gender: '',
    mobileNumber: '9653473232',
    email: 'ravi.sampat@lockated.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Vinayak Test Role',
    employeeId: '',
    createdBy: '',
    active: true
  }
];

export const FMUserDashboard = () => {
  const [users, setUsers] = useState(fmUsers);

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">FM USERS</h1>
            <p className="text-sm text-gray-600 mt-1">Setup &gt; FM Users</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add FM User
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            Import
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            Export
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            Filters
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            Clone Role
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-20">Actions</TableHead>
                <TableHead className="w-20">Active</TableHead>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead className="w-20">Gender</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vendor Company Name</TableHead>
                <TableHead>Entity Name</TableHead>
                <TableHead className="w-20">Unit</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Created By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className={`w-8 h-5 rounded-full flex items-center ${user.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${user.active ? 'translate-x-3' : 'translate-x-0.5'}`} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.vendorCompanyName}</TableCell>
                  <TableCell>{user.entityName}</TableCell>
                  <TableCell>{user.unit}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.employeeId}</TableCell>
                  <TableCell>{user.createdBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SetupLayout>
  );
};
