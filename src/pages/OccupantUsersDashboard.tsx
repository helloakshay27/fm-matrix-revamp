
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Eye, Filter } from 'lucide-react';

const mockOccupantUsersData = [
  {
    id: '220274',
    userName: 'Test 12 Bulk',
    gender: '',
    mobileNumber: '9774545411',
    email: 'aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    unit: '9556',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    userType: 'Member',
    active: 'Yes',
    status: 'Approved',
    role: ''
  },
  {
    id: '220272',
    userName: 'Test 10 Bulk',
    gender: '',
    mobileNumber: '9774545409',
    email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    unit: '14523',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    userType: 'Admin',
    active: 'Yes',
    status: 'Pending',
    role: ''
  },
  {
    id: '220213',
    userName: 'Test 10 Bulk',
    gender: '',
    mobileNumber: '9774545405',
    email: 'test101@yopmail.com',
    unit: '14523',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    userType: 'Admin',
    active: 'Yes',
    status: 'Pending',
    role: ''
  },
  {
    id: '218970',
    userName: 'Vinayak test wallet',
    gender: '',
    mobileNumber: '8642589877',
    email: 'test200@yopmail.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    userType: 'Member',
    active: 'Yes',
    status: 'Approved',
    role: ''
  },
  {
    id: '218949',
    userName: 'Dummy jkddfjas',
    gender: 'Male',
    mobileNumber: '3248283482',
    email: 'ssfaksjdf@asdfasd.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Company',
    userType: 'Member',
    active: 'Yes',
    status: 'Pending',
    role: ''
  },
  {
    id: '218934',
    userName: 'TestUser a',
    gender: 'Male',
    mobileNumber: '9231203910',
    email: 'test82928@yopmail.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    userType: 'Member',
    active: 'Yes',
    status: 'Pending',
    role: ''
  }
];

export const OccupantUsersDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Occupant</span>
          <span>&gt;</span>
          <span>Occupant User List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">OCCUPANT USER LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Action</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>User Type</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOccupantUsersData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell className="max-w-48 truncate" title={user.email}>
                  {user.email}
                </TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.accessLevel}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>{user.active}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'Approved' ? 'default' : 'secondary'}
                    className={user.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
