
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Filter, Download, Copy } from "lucide-react";

const fmUsersData = [
  { id: 1, actionId: "212923", userName: "yvuiyiv ilujo", gender: "Male", mobile: "7897780978", email: "testuhhi@gmail.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Pending", faceRecognition: "No", appDownloaded: "No" },
  { id: 2, actionId: "212919", userName: "sameer kumar", gender: "", mobile: "2134513211", email: "2134513211@gmail.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Soft Skill Personel", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
  { id: 3, actionId: "212384", userName: "ABHIDNYA TAPAL", gender: "Female", mobile: "7208523035", email: "abhidnyatapal@gmail.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
  { id: 4, actionId: "195169", userName: "Dhananjay Bhoyar", gender: "Male", mobile: "9022281139", email: "dhananjay.bhoyar@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
  { id: 5, actionId: "193551", userName: "Ravi Sampat", gender: "", mobile: "9653473232", email: "ravi.sampat@lockated.com", unit: "Function 1", department: "", employeeId: "", accessLevel: "Company", type: "Admin", role: "Vinayak Test Role", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
  { id: 6, actionId: "193550", userName: "Jyoti Dubey", gender: "", mobile: "8108245903", email: "jyotidubey.tiwari@lockated.com", unit: "Function 3", department: "", employeeId: "", accessLevel: "Company", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
  { id: 7, actionId: "192335", userName: "Pratik Bobade", gender: "Male", mobile: "8805056392", email: "pratik.bobade@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "No", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
  { id: 8, actionId: "190844", userName: "Sadanand Gupta", gender: "Male", mobile: "9769884879", email: "sadanand.gupta@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Country", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "No" },
  { id: 9, actionId: "182388", userName: "Komal Shinde", gender: "Female", mobile: "8669112232", email: "komal.shinde@lockated.com", unit: "", department: "", employeeId: "", accessLevel: "Site", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "No", appDownloaded: "Yes" },
  { id: 10, actionId: "182347", userName: "Sony Bhosle", gender: "F", mobile: "9607574091", email: "sony.bhosle@lockated.com", unit: "Function 3", department: "", employeeId: "", accessLevel: "Company", type: "Admin", role: "Admin", active: "Yes", status: "Approved", faceRecognition: "Yes", appDownloaded: "Yes" }
];

export const FMUsersDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = fmUsersData.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.actionId.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>FM</span>
          <span>&gt;</span>
          <span>FM User List</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">FM USER LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-start space-x-3">
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white flex items-center space-x-2">
          <Copy className="w-4 h-4" />
          <span>Clone/Transfer</span>
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
              <TableHead>Type</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Face Recognition</TableHead>
              <TableHead>App Downloaded</TableHead>
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
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.accessLevel}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.active}</TableCell>
                <TableCell>{user.status}</TableCell>
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
