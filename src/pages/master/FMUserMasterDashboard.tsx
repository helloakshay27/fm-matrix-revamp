import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFMUsers, FMUser } from '@/store/slices/fmUserSlice';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MoreVertical, Plus, Upload, Download, Filter, Eye, Search, Users, X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  TextField,
  Button as MuiButton,
  Box
} from '@mui/material';

// Transform API data to table format
const transformFMUserData = (apiUser: FMUser) => ({
  id: apiUser.id.toString(),
  userName: `${apiUser.firstname} ${apiUser.lastname}`,
  gender: apiUser.gender,
  mobile: apiUser.mobile,
  email: apiUser.email,
  vendorCompany: apiUser.company_name || 'N/A',
  entityName: `Entity ${apiUser.entity_id}`,
  unit: `Unit ${apiUser.unit_id}`,
  role: apiUser.designation || 'N/A',
  employeeId: apiUser.employee_id || 'N/A',
  createdBy: `User ${apiUser.created_by_id}`,
  accessLevel: apiUser.lock_user_permission?.access_level || 'N/A',
  type: apiUser.user_type === 'pms_admin' ? 'Internal' : 'External',
  status: apiUser.lock_user_permission_status === 'approved' ? 'Active' : 'Inactive',
  faceRecognition: apiUser.face_added,
  appDownloaded: apiUser.app_downloaded === 'Yes',
  active: apiUser.lock_user_permission_status === 'approved'
});

export const FMUserMasterDashboard = () => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data: fmUsersResponse, loading, error } = useSelector((state: RootState) => state.fmUsers);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    email: ''
  });

  // Transform API data to table format
  const fmUsersData = fmUsersResponse?.fm_users ? fmUsersResponse.fm_users.map(transformFMUserData) : [];

  useEffect(() => {
    setCurrentSection('Master');
    dispatch(fetchFMUsers());
  }, [setCurrentSection, dispatch]);

  // Apply filters to users
  const filteredUsers = fmUsersData.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm) ||
      user.vendorCompany.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesNameFilter = !filters.name || user.userName.toLowerCase().includes(filters.name.toLowerCase());
    const matchesEmailFilter = !filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase());
    
    return matchesSearch && matchesNameFilter && matchesEmailFilter;
  });

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

  const handleApplyFilters = () => {
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      email: ''
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading FM Users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

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

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Filter</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-6">
            <Box className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  placeholder="Enter Name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  placeholder="Enter Email"
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            </Box>
          </div>

          <div className="flex justify-end gap-3 p-6 pt-0 border-t mt-4">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="bg-[#f6f4ee] text-[#C72030] hover:bg-[#ede9e0] border-[#C72030] px-6 py-2 text-sm font-medium rounded-lg mt-4"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-[#f6f4ee] text-[#C72030] hover:bg-[#ede9e0] border-none px-6 py-2 text-sm font-medium rounded-lg mt-4"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};