
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const OccupantUsersDashboard = () => {
  const occupantUsers = [
    { id: 220274, userName: "Test 12 Bulk", gender: "", mobile: "9774545411", email: "aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com", unit: "9556", department: "Site", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Approved", remarks: "" },
    { id: 220272, userName: "Test 10 Bulk", gender: "", mobile: "9774545409", email: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com", unit: "14523", department: "Site", employeeId: "", accessLevel: "", userType: "Admin", active: "Yes", status: "Pending", remarks: "" },
    { id: 220213, userName: "Test 10 Bulk", gender: "", mobile: "9774545405", email: "test101@yopmail.com", unit: "14523", department: "Site", employeeId: "", accessLevel: "", userType: "Admin", active: "Yes", status: "Pending", remarks: "" },
    { id: 218970, userName: "Vinayak test wallet", gender: "", mobile: "8642589877", email: "test200@yopmail.com", unit: "", department: "Site", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Approved", remarks: "" },
    { id: 218949, userName: "Dummy jksdfjas", gender: "Male", mobile: "3248283482", email: "ssfaksjdf@aasdfasd.com", unit: "", department: "Company", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Pending", remarks: "" },
    { id: 218934, userName: "TestUser a", gender: "Male", mobile: "9231203910", email: "test92928@yopmail.com", unit: "", department: "Site", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Pending", remarks: "" },
    { id: 218671, userName: "asjdf fasjdf", gender: "male", mobile: "2234798274", email: "asdj@dfjkasf.com", unit: "", department: "Site", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Pending", remarks: "" },
    { id: 218663, userName: "NewDemo User", gender: "male", mobile: "2347279472", email: "asfkd@asdf.com", unit: "", department: "Site", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Pending", remarks: "" },
    { id: 218657, userName: "AdminDemoUser Fortest", gender: "male", mobile: "3848273847", email: "admindemo@user.com", unit: "site", department: "", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Pending", remarks: "" },
    { id: 218654, userName: "akdemo askldj", gender: "male", mobile: "2346274624", email: "asfdj@asdfj.com", unit: "site", department: "", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Pending", remarks: "" },
    { id: 218648, userName: "Rahul Parihar", gender: "male", mobile: "9929583637", email: "rahul.parihar@lockated.com", unit: "site", department: "", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Pending", remarks: "" },
    { id: 208268, userName: "Demo User", gender: "Male", mobile: "4982738492", email: "akksjs121@akks.com", unit: "62376", department: "Site", employeeId: "", accessLevel: "", userType: "Member", active: "Yes", status: "Approved", remarks: "" },
    { id: 206725, userName: "Test 999.0", gender: "", mobile: "4618220262", email: "test5998@yopmail.com", unit: "Office", department: "DevOps", employeeId: "", accessLevel: "", userType: "Site", active: "Member", status: "Yes", remarks: "Approved" },
    { id: 206726, userName: "Test 1000", gender: "", mobile: "8811881188", email: "test5999@yopmail.com", unit: "Office", department: "Backend", employeeId: "", accessLevel: "", userType: "Site", active: "Admin", status: "Yes", remarks: "Approved" },
    { id: 206720, userName: "Test 994.0", gender: "", mobile: "4618220257", email: "test5993@yopmail.com", unit: "Office", department: "Sales", employeeId: "", accessLevel: "", userType: "Site", active: "Admin", status: "Yes", remarks: "Approved" },
    { id: 206719, userName: "Test 993.0", gender: "", mobile: "4618220256", email: "test5992@yopmail.com", unit: "A", department: "Support", employeeId: "", accessLevel: "", userType: "Site", active: "Member", status: "Yes", remarks: "Approved" },
    { id: 206723, userName: "Test 997.0", gender: "", mobile: "4618220260", email: "test5996@yopmail.com", unit: "C", department: "Marketing", employeeId: "", accessLevel: "", userType: "Site", active: "Member", status: "Yes", remarks: "Approved" },
    { id: 206722, userName: "Test 996.", gender: "", mobile: "4618220259", email: "test5995@yopmail.com", unit: "C", department: "Frontend", employeeId: "", accessLevel: "", userType: "Site", active: "Member", status: "Yes", remarks: "Approved" },
  ];

  const getStatusBadge = (status: string) => {
    const variant = status === "Approved" ? "default" : "secondary";
    const color = status === "Approved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    return (
      <Badge variant={variant} className={color}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-2">
        Occupant &gt; Occupant User List
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">OCCUPANT USER LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-center font-medium">Action</TableHead>
              <TableHead className="text-center font-medium">ID</TableHead>
              <TableHead className="text-center font-medium">User Name</TableHead>
              <TableHead className="text-center font-medium">Gender</TableHead>
              <TableHead className="text-center font-medium">Mobile Number</TableHead>
              <TableHead className="text-center font-medium">Email</TableHead>
              <TableHead className="text-center font-medium">Unit</TableHead>
              <TableHead className="text-center font-medium">Department</TableHead>
              <TableHead className="text-center font-medium">Employee ID</TableHead>
              <TableHead className="text-center font-medium">Access Level</TableHead>
              <TableHead className="text-center font-medium">User Type</TableHead>
              <TableHead className="text-center font-medium">Active</TableHead>
              <TableHead className="text-center font-medium">Status</TableHead>
              <TableHead className="text-center font-medium">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occupantUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="text-center">
                  <Eye className="w-4 h-4 text-gray-600 mx-auto cursor-pointer hover:text-gray-800" />
                </TableCell>
                <TableCell className="text-center">{user.id}</TableCell>
                <TableCell className="text-center">{user.userName}</TableCell>
                <TableCell className="text-center">{user.gender}</TableCell>
                <TableCell className="text-center">{user.mobile}</TableCell>
                <TableCell className="text-center max-w-xs truncate">{user.email}</TableCell>
                <TableCell className="text-center">{user.unit}</TableCell>
                <TableCell className="text-center">{user.department}</TableCell>
                <TableCell className="text-center">{user.employeeId}</TableCell>
                <TableCell className="text-center">{user.accessLevel}</TableCell>
                <TableCell className="text-center">{user.userType}</TableCell>
                <TableCell className="text-center">{user.active}</TableCell>
                <TableCell className="text-center">{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-center">{user.remarks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OccupantUsersDashboard;
