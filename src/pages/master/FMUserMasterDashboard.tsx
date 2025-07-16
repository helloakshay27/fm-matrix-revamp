import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MoreVertical, Plus, Upload, Download, Filter, Eye, Search, Users } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Sample FM Users data
const fmUsersData = [
  {
    id: 'FMU001',
    userName: 'John Smith',
    gender: 'Male',
    mobile: '+91 9876543210',
    email: 'john.smith@company.com',
    vendorCompany: 'Tech Solutions Ltd',
    entityName: 'Headquarters',
    unit: 'Unit A-101',
    role: 'Senior Technician',
    employeeId: 'EMP001',
    createdBy: 'Admin User',
    accessLevel: 'Level 2',
    type: 'Internal',
    status: 'Active',
    faceRecognition: true,
    appDownloaded: true,
    active: true
  },
  {
    id: 'FMU002',
    userName: 'Sarah Johnson',
    gender: 'Female',
    mobile: '+91 9876543211',
    email: 'sarah.johnson@vendor.com',
    vendorCompany: 'Maintenance Corp',
    entityName: 'Branch Office',
    unit: 'Unit B-205',
    role: 'Facility Manager',
    employeeId: 'EMP002',
    createdBy: 'HR Admin',
    accessLevel: 'Level 3',
    type: 'External',
    status: 'Active',
    faceRecognition: false,
    appDownloaded: true,
    active: true
  },
  {
    id: 'FMU003',
    userName: 'Mike Davis',
    gender: 'Male',
    mobile: '+91 9876543212',
    email: 'mike.davis@company.com',
    vendorCompany: 'Internal Team',
    entityName: 'Regional Office',
    unit: 'Unit C-301',
    role: 'Maintenance Staff',
    employeeId: 'EMP003',
    createdBy: 'Super Admin',
    accessLevel: 'Level 1',
    type: 'Internal',
    status: 'Inactive',
    faceRecognition: true,
    appDownloaded: false,
    active: false
  }
];

export const FMUserMasterDashboard = () => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);

  const filteredUsers = fmUsersData.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.vendorCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeUsers = fmUsersData.filter(user => user.active).length;
  const inactiveUsers = fmUsersData.filter(user => !user.active).length;
  const appDownloaded = fmUsersData.filter(user => user.appDownloaded).length;

  const handleAddUser = () => {
    navigate('/master/user/fm-users/add');
  };

  const handleEditUser = (id: string) => {
    navigate(`/master/user/fm-users/edit/${id}`);
  };

  const handleViewUser = (id: string) => {
    navigate(`/master/user/fm-users/view/${id}`);
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Master &gt; User Master &gt; FM User
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">FM User Master</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={fmUsersData.length}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Active Users"
          value={activeUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Inactive Users"
          value={inactiveUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="App Downloaded"
          value={appDownloaded}
          icon={<Download className="w-6 h-6" />}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 items-center">
        <Button onClick={handleAddUser} className="bg-[#C72030] hover:bg-[#a91b29] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add FM User
        </Button>
        <Button variant="outline" className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => setFilterDialogOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Clone Role
        </Button>
        
        {/* Search */}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-[#1a1a1a]">Actions</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Active</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">ID</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">User Name</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Gender</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Mobile Number</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Email</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Vendor Company Name</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Entity Name</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Unit</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Role</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Employee ID</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Created By</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Access Level</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Type</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">Face Recognition</TableHead>
                <TableHead className="font-semibold text-[#1a1a1a]">App Downloaded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-white">
                        <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Switch checked={user.active} />
                  </TableCell>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.vendorCompany}</TableCell>
                  <TableCell>{user.entityName}</TableCell>
                  <TableCell>{user.unit}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.employeeId}</TableCell>
                  <TableCell>{user.createdBy}</TableCell>
                  <TableCell>{user.accessLevel}</TableCell>
                  <TableCell>
                    <Badge variant={user.type === 'Internal' ? 'default' : 'secondary'}>
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.faceRecognition ? 'default' : 'secondary'}>
                      {user.faceRecognition ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.appDownloaded ? 'default' : 'secondary'}>
                      {user.appDownloaded ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};