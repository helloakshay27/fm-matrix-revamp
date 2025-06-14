
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Filter } from 'lucide-react';
import { CRMOccupantUsersFilterDialog } from '@/components/CRMOccupantUsersFilterDialog';

// Sample occupant users data based on the image
const occupantUsers = [
  {
    id: '220274',
    userName: 'Test 12 Bulk',
    gender: '',
    mobileNumber: '9774545411',
    email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    unit: '9556',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Me'
  },
  {
    id: '220272',
    userName: 'Test 10 Bulk',
    gender: '',
    mobileNumber: '9774545409',
    email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    unit: '14523',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Ap'
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
    type: 'Ap'
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
    type: 'Me'
  },
  {
    id: '218949',
    userName: 'Dummy jksdfjas',
    gender: 'Male',
    mobileNumber: '3248283482',
    email: 'safaksjdf@asdfasd.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Company',
    type: 'Me'
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
    type: 'Me'
  },
  {
    id: '218671',
    userName: 'asjdf fasjdf',
    gender: 'male',
    mobileNumber: '2234798274',
    email: 'asdfj@dfjikasif.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Me'
  },
  {
    id: '218663',
    userName: 'NewDemo User',
    gender: 'male',
    mobileNumber: '2347279472',
    email: 'asfkd@asdf.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Me'
  },
  {
    id: '218657',
    userName: 'AdminDemoUser Fortest',
    gender: 'male',
    mobileNumber: '3848273847',
    email: 'admindemo@user.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'site',
    type: 'Me'
  },
  {
    id: '218654',
    userName: 'akdemo askldj',
    gender: 'male',
    mobileNumber: '2346274624',
    email: 'asfdj@asdfj.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'site',
    type: 'Me'
  },
  {
    id: '218648',
    userName: 'Rahul Parihar',
    gender: 'male',
    mobileNumber: '9929583637',
    email: 'rahul.parihar@lockated.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'site',
    type: 'Me'
  },
  {
    id: '208268',
    userName: 'Demo User',
    gender: 'Male',
    mobileNumber: '4982738492',
    email: 'akkjs121@akks.com',
    unit: '62376',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Me'
  },
  {
    id: '206725',
    userName: 'Test 999.0',
    gender: '',
    mobileNumber: '4618220262',
    email: 'test5998@yopmail.com',
    unit: 'Office',
    department: 'DevOps',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Me'
  },
  {
    id: '206726',
    userName: 'Test 1000',
    gender: '',
    mobileNumber: '8811881188',
    email: 'test5999@yopmail.com',
    unit: 'Office',
    department: 'Backend',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Ap'
  },
  {
    id: '206720',
    userName: 'Test 994.0',
    gender: '',
    mobileNumber: '4618220257',
    email: 'test5993@yopmail.com',
    unit: 'Office',
    department: 'Sales',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Ap'
  }
];

const CRMOccupantUsersDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const filteredUsers = occupantUsers.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobileNumber.includes(searchTerm) ||
    user.id.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Occupant &gt; Occupant User List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900">OCCUPANT USER LIST</h1>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white"
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-20">Action</TableHead>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead className="w-20">Gender</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-20">Unit</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead className="w-20">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell className="max-w-xs truncate" title={user.email}>
                  {user.email}
                </TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.accessLevel}</TableCell>
                <TableCell>{user.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CRMOccupantUsersFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
      />
    </div>
  );
};

export default CRMOccupantUsersDashboard;
