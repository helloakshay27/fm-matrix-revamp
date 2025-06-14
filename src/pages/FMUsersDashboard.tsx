
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Eye, Filter, Download, Copy } from 'lucide-react';

const mockFMUsersData = [
  {
    id: '212923',
    userName: 'yyuiyty mujo',
    gender: 'Male',
    mobileNumber: '7897780978',
    email: 'tesruhhh@gmail.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Pending',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '212919',
    userName: 'sameer kumar',
    gender: '',
    mobileNumber: '2134513211',
    email: '2134513211@gmail.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Soft Skill Personnel',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '212384',
    userName: 'ABHIDNYA TAPAL',
    gender: 'Female',
    mobileNumber: '7208523035',
    email: 'abhidnyatapal@gmail.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'Yes'
  },
  {
    id: '195169',
    userName: 'Dhananjay Bhoyar',
    gender: 'Male',
    mobileNumber: '9022281139',
    email: 'dhananjay.bhoyar@lockated.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '193551',
    userName: 'Ravi Sampat',
    gender: '',
    mobileNumber: '9653473232',
    email: 'ravi.sampat@lockated.com',
    unit: 'Function 1',
    department: '',
    employeeId: '',
    accessLevel: 'Company',
    type: 'Admin',
    role: 'Vinayak Test Role',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'Yes'
  }
];

export const FMUsersDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>FM</span>
          <span>&gt;</span>
          <span>FM User List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">FM USER LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
          <Copy className="w-4 h-4 mr-2" />
          Clone/Transfer
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
              <TableHead>Type</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Face Recognition</TableHead>
              <TableHead>App Downloaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFMUsersData.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.accessLevel}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.active}</TableCell>
                <TableCell>
                  <Badge 
                    variant={user.status === 'Approved' ? 'default' : 'secondary'}
                    className={user.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.faceRecognition}</TableCell>
                <TableCell>{user.appDownloaded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
