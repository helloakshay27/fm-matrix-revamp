import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, FileDown, Copy, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserMasterPage = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>("fm-user");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // FM Users sample data
  const fmUsers = [
    {
      id: "1",
      userName: "john.doe",
      gender: "Male",
      mobileNumber: "+1-234-567-8901",
      email: "john.doe@example.com",
      active: true,
      status: "Active"
    },
    {
      id: "2", 
      userName: "jane.smith",
      gender: "Female",
      mobileNumber: "+1-234-567-8902",
      email: "jane.smith@example.com",
      active: true,
      status: "Active"
    }
  ];

  // Occupant Users sample data
  const occupantUsers = [
    {
      id: "1",
      userName: "alice.johnson",
      company: "Tech Corp",
      mobileNumber: "+1-234-567-8903",
      email: "alice.johnson@techcorp.com",
      active: true
    },
    {
      id: "2",
      userName: "bob.wilson", 
      company: "Design Studio",
      mobileNumber: "+1-234-567-8904",
      email: "bob.wilson@designstudio.com",
      active: true
    }
  ];

  const filteredFMUsers = fmUsers.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOccupantUsers = occupantUsers.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (selectedUserType === "fm-user") {
      navigate("/setup/fm-users");
    } else {
      navigate("/setup/occupant-users");
    }
  };

  const renderFMUserContent = () => (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total FM Users</h3>
          <p className="text-2xl font-bold">{fmUsers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
          <p className="text-2xl font-bold">{fmUsers.filter(u => u.active).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Inactive Users</h3>
          <p className="text-2xl font-bold">{fmUsers.filter(u => !u.active).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">New This Month</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add FM User
          </Button>
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Clone Role
          </Button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search FM users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* FM Users Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>View</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFMUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Button variant="ghost" size="sm">👁️</Button>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{user.userName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderOccupantUserContent = () => (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Occupant Users</h3>
          <p className="text-2xl font-bold">{occupantUsers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
          <p className="text-2xl font-bold">{occupantUsers.filter(u => u.active).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Companies</h3>
          <p className="text-2xl font-bold">{new Set(occupantUsers.map(u => u.company)).size}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">New This Month</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
        <div className="flex gap-2">
          <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Occupant User
          </Button>
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search occupant users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Occupant Users Table */}
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>View</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOccupantUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Button variant="ghost" size="sm">👁️</Button>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{user.company}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-[#D5DbDB] p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-2">User Master</h1>
              <p className="text-[#1a1a1a] opacity-70">Manage users and user permissions.</p>
            </div>
            
            {/* User Type Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#1a1a1a]">User Type:</label>
              <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fm-user">FM User</SelectItem>
                  <SelectItem value="occupant-user">OCCUPANT USERS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {selectedUserType === "fm-user" ? renderFMUserContent() : renderOccupantUserContent()}
      </div>
    </div>
  );
};