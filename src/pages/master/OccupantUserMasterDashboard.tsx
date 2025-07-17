import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOccupantUsers } from '@/store/slices/occupantUsersSlice';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Download, Filter, Eye, Search, RotateCcw } from 'lucide-react';


export const OccupantUserMasterDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  
  const { users: occupantUsersData, loading, error } = useSelector((state: RootState) => state.occupantUsers);

  const filteredUsers = occupantUsersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = occupantUsersData.length;
  const approvedUsers = occupantUsersData.filter(user => user.status === 'approved').length;
  const pendingUsers = occupantUsersData.filter(user => user.status === 'pending').length;
  const rejectedUsers = occupantUsersData.filter(user => user.status === 'rejected').length;
  const appDownloaded = 15; // Static value as shown in the image

  const handleViewUser = (id: number) => {
    navigate(`/master/user/occupant-users/view/${id}`);
  };

  const handleSearch = () => {
    // Search functionality is already handled by the filter
    console.log('Search triggered for:', searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
  };

  const { setCurrentSection } = useLayout();
  
  useEffect(() => {
    setCurrentSection('Master');
    dispatch(fetchOccupantUsers());
  }, [setCurrentSection, dispatch]);

  return (
      <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="w-full space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          Master &gt; User Master &gt; Occupant Users
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Occupant User Master</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StatsCard
            title="Total Users"
            value={totalUsers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Approved"
            value={approvedUsers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Pending"
            value={pendingUsers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="Rejected"
            value={rejectedUsers}
            icon={<Users className="w-6 h-6" />}
          />
          <StatsCard
            title="App Downloaded"
            value={appDownloaded}
            icon={<Download className="w-6 h-6" />}
          />
        </div>

        {/* Action Buttons and Search */}
        <div className="flex flex-wrap gap-3 items-center">
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
          
          {/* Search Section */}
          <div className="flex gap-2 items-center ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-[#C72030] hover:bg-[#a91b29] text-white"
            >
              Go!
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-[#1a1a1a]">Sr. No.</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">View</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Company</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Name</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Mobile Number</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Email ID</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{user.srNo}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{user.company}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          user.status === 'approved' ? 'default' : 
                          user.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                        className={
                          user.status === 'approved' ? 'bg-green-100 text-green-800' :
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing 1 to {filteredUsers.length} of {totalUsers} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-[#C72030] text-white border-[#C72030]">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};