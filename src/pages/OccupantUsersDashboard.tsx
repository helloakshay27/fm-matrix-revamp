
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Filter } from "lucide-react";

const occupantUsersData = [
  { id: 1, actionId: "220274", userName: "Test 12 Bulk", gender: "", mobile: "9774545411", email: "aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com", unit: "9556", department: "", employeeId: "", accessLevel: "Site", userType: "Member", active: "Yes", status: "Approved", role: "" },
  { id: 2, actionId: "220272", userName: "Test 10 Bulk", gender: "", mobile: "9774545409", email: "aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com", unit: "14523", department: "", employeeId: "", accessLevel: "Site", userType: "Admin", active: "Yes", status: "Pending", role: "" },
  { id: 3, actionId: "220213", userName: "Test 10 Bulk", gender: "", mobile: "9774545405", email: "test101@yopmail.com", unit: "14523", department: "", employeeId: "", accessLevel: "Site", userType: "Admin", active: "Yes", status: "Pending", role: "" },
  { id: 4, actionId: "218970", userName: "Vinayak test wallet", gender: "", mobile: "8642589877", email: "test200@yopmail.com", unit: "", department: "", employeeId: "", accessLevel: "Site", userType: "Member", active: "Yes", status: "Approved", role: "" },
  { id: 5, actionId: "218949", userName: "Dummy jksdfjas", gender: "Male", mobile: "3248283482", email: "ssfaksjdf@asdffasd.com", unit: "", department: "", employeeId: "", accessLevel: "Company", userType: "Member", active: "Yes", status: "Pending", role: "" },
  { id: 6, actionId: "218934", userName: "TestUser a", gender: "Male", mobile: "9231203910", email: "test82928@yopmail.com", unit: "", department: "", employeeId: "", accessLevel: "Site", userType: "Member", active: "Yes", status: "Pending", role: "" },
  { id: 7, actionId: "218671", userName: "asjdf fasjdf", gender: "male", mobile: "2234798274", email: "asdfj@dfjkasjf.com", unit: "", department: "", employeeId: "", accessLevel: "Site", userType: "Member", active: "Yes", status: "Pending", role: "" },
  { id: 8, actionId: "218663", userName: "NewDemo User", gender: "male", mobile: "2347279472", email: "asfkd@asdf.com", unit: "", department: "", employeeId: "", accessLevel: "Site", userType: "Member", active: "Yes", status: "Pending", role: "" },
  { id: 9, actionId: "218657", userName: "AdminDemoUser Fortest", gender: "male", mobile: "3848273847", email: "admindemo@user.com", unit: "", department: "", employeeId: "", accessLevel: "site", userType: "Member", active: "Yes", status: "Pending", role: "" },
  { id: 10, actionId: "218654", userName: "akdemo askldj", gender: "male", mobile: "2346274624", email: "asdfj@asdfj.com", unit: "", department: "", employeeId: "", accessLevel: "site", userType: "Member", active: "Yes", status: "Pending", role: "" },
  { id: 11, actionId: "218648", userName: "Rahul Parihar", gender: "male", mobile: "9929583637", email: "rahul.parihar@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "site", userType: "Member", active: "Yes", status: "Pending", role: "" },
  { id: 12, actionId: "208268", userName: "Demo User", gender: "Male", mobile: "4982738492", email: "akksjsj121@akks.com", unit: "62376", department: "", employeeId: "", accessLevel: "Site", userType: "Member", active: "Yes", status: "Approved", role: "" },
  { id: 13, actionId: "206725", userName: "Test 999.0", gender: "", mobile: "4618220262", email: "test5998@yopmail.com", unit: "Office", department: "DevOps", employeeId: "", accessLevel: "Site", userType: "Member", active: "Yes", status: "Approved", role: "" },
  { id: 14, actionId: "206726", userName: "Test 1000", gender: "", mobile: "8811881188", email: "test5999@yopmail.com", unit: "Office", department: "Backend", employeeId: "", accessLevel: "Site", userType: "Admin", active: "Yes", status: "Approved", role: "" },
  { id: 15, actionId: "206720", userName: "Test 994.0", gender: "", mobile: "4618220257", email: "test5993@yopmail.com", unit: "Office", department: "Sales", employeeId: "", accessLevel: "Site", userType: "Admin", active: "Yes", status: "Approved", role: "" }
];

export const OccupantUsersDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = occupantUsersData.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.actionId.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Occupant</span>
          <span>&gt;</span>
          <span>Occupant User List</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">OCCUPANT USER LIST</h1>
      </div>

      {/* Filter Button */}
      <div className="flex justify-start">
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-16">Action</TableHead>
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>{user.actionId}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell className="max-w-xs truncate">{user.email}</TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.accessLevel}</TableCell>
                <TableCell>{user.userType}</TableCell>
                <TableCell>{user.active}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
