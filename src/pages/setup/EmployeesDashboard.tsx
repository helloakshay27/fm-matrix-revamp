
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Edit } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface EmployeeData {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  userType: string;
}

export const EmployeesDashboard = () => {
  const navigate = useNavigate();
  const [employees] = useState<EmployeeData[]>([
    {
      id: '220274',
      employeeId: '9556',
      firstName: 'Test',
      lastName: 'Bulk',
      email: 'aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
      mobile: '9774545411',
      userType: 'User'
    },
    {
      id: '218970',
      employeeId: '',
      firstName: 'Vinayak',
      lastName: 'test wallet',
      email: 'test200@yopmail.com',
      mobile: '8642589677',
      userType: 'User'
    },
    {
      id: '212919',
      employeeId: '',
      firstName: 'sameer',
      lastName: 'kumar',
      email: '2134513211@gmail.com',
      mobile: '2134513211',
      userType: 'Admin'
    },
    {
      id: '208268',
      employeeId: '62376',
      firstName: 'Demo',
      lastName: 'User',
      email: 'akksjs121@akks.com',
      mobile: '4982738492',
      userType: 'User'
    },
    {
      id: '206726',
      employeeId: '',
      firstName: 'Test',
      lastName: '1000',
      email: 'test5999@yopmail.com',
      mobile: '8811881188',
      userType: 'Admin'
    },
    {
      id: '206725',
      employeeId: '',
      firstName: 'Test',
      lastName: '999.0',
      email: 'test5998@yopmail.com',
      mobile: '4618220262',
      userType: 'User'
    },
    {
      id: '206722',
      employeeId: '',
      firstName: 'Test',
      lastName: '996.',
      email: 'test5995@yopmail.com',
      mobile: '4618220259',
      userType: 'User'
    },
    {
      id: '206720',
      employeeId: '',
      firstName: 'Test',
      lastName: '994.0',
      email: 'test5993@yopmail.com',
      mobile: '4618220257',
      userType: 'Admin'
    }
  ]);

  const handleAddClick = () => {
    navigate('/vas/space-management/setup/employees/add');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Space &gt; Employees</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">EMPLOYEES</h1>
            <Button 
              onClick={handleAddClick}
              className="bg-[#8B4D6B] hover:bg-[#8B4D6B]/90 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Employee ID</TableHead>
                <TableHead className="font-semibold text-gray-700">First Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Last Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Email Address</TableHead>
                <TableHead className="font-semibold text-gray-700">Mobile No.</TableHead>
                <TableHead className="font-semibold text-gray-700">User Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id} className="border-b">
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="p-1">
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1">
                        <Edit className="w-4 h-4 text-green-600" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-blue-600">{employee.id}</TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell className="text-blue-600 max-w-xs truncate">{employee.email}</TableCell>
                  <TableCell>{employee.mobile}</TableCell>
                  <TableCell>{employee.userType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
