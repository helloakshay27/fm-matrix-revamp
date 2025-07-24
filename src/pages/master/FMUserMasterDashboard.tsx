import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFMUsers, FMUser } from '@/store/slices/fmUserSlice';
import { fetchUserCounts } from '@/store/slices/userCountsSlice';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { MoreVertical, Plus, Upload, Download, Filter, Eye, Search, Users, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const { data: userCounts, loading: countsLoading } = useSelector((state: RootState) => state.userCounts);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [filters, setFilters] = useState({
    name: '',
    email: ''
  });

  // Transform API data to table format
  const [fmUsersData, setFmUsersData] = useState<any[]>([]);

  useEffect(() => {
    if (fmUsersResponse?.fm_users) {
      setFmUsersData(fmUsersResponse.fm_users.map(transformFMUserData));
    }
  }, [fmUsersResponse]);

  useEffect(() => {
    setCurrentSection('Master');
    dispatch(fetchFMUsers());
    dispatch(fetchUserCounts());
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

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  // Use API data for stats if available, otherwise fallback to calculated values
  const totalUsers = userCounts?.total_users ?? fmUsersData.length;
  const approvedUsers = userCounts?.approved ?? fmUsersData.filter(user => user.active).length;
  const pendingUsers = userCounts?.pending ?? 0;
  const rejectedUsers = userCounts?.rejected ?? fmUsersData.filter(user => !user.active).length;
  const appDownloaded = userCounts?.app_downloaded_count ?? fmUsersData.filter(user => user.appDownloaded).length;

  const handleAddUser = () => {
    navigate('/master/user/fm-users/add');
  };

  const handleEditUser = (id: string) => {
    navigate(`/master/user/fm-users/edit/${id}`);
  };

  const handleViewUser = (id: string) => {
    navigate(`/master/user/fm-users/view/${id}`);
  };

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      // Update local state immediately for responsive UI
      setFmUsersData(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, active: isActive, status: isActive ? 'Active' : 'Inactive' }
            : user
        )
      );

      // Show toast message
      toast({
        title: "Status Updated",
        description: `User ${isActive ? 'activated' : 'deactivated'} successfully!`,
      });
      
      // TODO: Replace with actual API call to update user status
      // await apiClient.put(`/users/${userId}/status`, { active: isActive });
      
    } catch (error) {
      // Revert local state on error
      setFmUsersData(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, active: !isActive, status: !isActive ? 'Active' : 'Inactive' }
            : user
        )
      );
      
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusClick = (user: any) => {
    setSelectedUser(user);
    setSelectedStatus(user.status);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      // TODO: Replace with actual API call to update user status
      toast({
        title: "Status Updated",
        description: `User status updated to ${selectedStatus} successfully!`,
      });
      
      setStatusDialogOpen(false);
      setSelectedUser(null);
      setSelectedStatus('');
      
      // Refresh the data to reflect changes
      dispatch(fetchFMUsers());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeProps = (status: string) => {
    if (status === 'Active' || status === 'Approved') {
      return {
        className: 'bg-green-600 text-white hover:bg-green-700 cursor-pointer',
        children: 'Approved'
      };
    } else if (status === 'Pending') {
      return {
        className: 'bg-yellow-500 text-white hover:bg-yellow-600 cursor-pointer',
        children: 'Pending'
      };
    } else {
      return {
        className: 'bg-red-600 text-white hover:bg-red-700 cursor-pointer',
        children: 'Rejected'
      };
    }
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis or pages 2-3
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show current page area
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink 
                onClick={() => setCurrentPage(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis or pages before last
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              onClick={() => setCurrentPage(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => setCurrentPage(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]">FM User Master</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Approved Users"
          value={approvedUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Pending Users"
          value={pendingUsers}
          icon={<Users className="w-6 h-6" />}
        />
        <StatsCard
          title="Rejected Users"
          value={rejectedUsers}
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
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewUser(user.id)}
                      className="hover:bg-gray-100"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={user.active} 
                      onCheckedChange={(checked) => handleToggleUserStatus(user.id, checked)}
                    />
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
                     <Badge 
                       {...getStatusBadgeProps(user.status)}
                       onClick={() => handleStatusClick(user)}
                     />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 bg-white">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">Update</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <Select 
              value={selectedStatus} 
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
                <SelectItem value="Select Status" disabled className="text-gray-400">
                  Select Status
                </SelectItem>
                <SelectItem value="Approved" className="hover:bg-blue-50">
                  Approved
                </SelectItem>
                <SelectItem value="Rejected" className="hover:bg-blue-50">
                  Rejected
                </SelectItem>
                <SelectItem value="Pending" className="hover:bg-blue-50">
                  Pending
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleStatusUpdate}
                className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2 rounded-md"
                disabled={!selectedStatus || selectedStatus === 'Select Status'}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};