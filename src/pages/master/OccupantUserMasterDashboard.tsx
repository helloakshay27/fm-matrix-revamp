import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchOccupantUsers } from '@/store/slices/occupantUsersSlice';
import { fetchOccupantUserCounts } from '@/store/slices/occupantUserCountsSlice';
import { StatsCard } from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Download, Filter, Eye, Search, RotateCcw, X } from 'lucide-react';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';


export const OccupantUserMasterDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    mobile: '',
    status: '',
    entity: ''
  });
  const pageSize = 5;
  
  const { users: occupantUsersData, loading, error } = useSelector((state: RootState) => state.occupantUsers);
  const occupantUserCounts = useSelector((state: RootState) => state.occupantUserCounts);
  const { total: totalUsers = 0, approved: approvedUsers = 0, pending: pendingUsers = 0, rejected: rejectedUsers = 0, appDownloaded = 0 } = occupantUserCounts || {};

  const filteredUsers = occupantUsersData.filter(user =>
    user.name.toLowerCase().includes(activeSearchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  const handleViewUser = (id: number) => {
    navigate(`/master/user/occupant-users/view/${id}`);
  };

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
    toast({
      title: "Search Applied",
      description: `Searching for users with name: "${searchTerm}"`
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setCurrentPage(1);
    toast({
      title: "Search Reset",
      description: "Search has been cleared"
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied",
      description: "Search results have been updated based on your filters."
    });
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      name: '',
      email: '',
      mobile: '',
      status: '',
      entity: ''
    });
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared."
    });
  };

  const handleExport = () => {
    try {
      // Create CSV data
      const headers = ['Sr. No.', 'Company', 'Name', 'Mobile Number', 'Email ID', 'Status'];
      const csvData = [
        headers.join(','),
        ...filteredUsers.map(user => [
          user.srNo,
          `"${user.company}"`,
          `"${user.name}"`,
          user.mobile,
          user.email,
          user.status
        ].join(','))
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `occupant-users-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Occupant users data has been exported to CSV file."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        variant: "destructive"
      });
    }
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

  const { setCurrentSection } = useLayout();
  
  useEffect(() => {
    setCurrentSection('Master');
    dispatch(fetchOccupantUsers());
    dispatch(fetchOccupantUserCounts());
  }, [setCurrentSection, dispatch]);

  return (
      <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="w-full space-y-6">

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
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleExport}
          >
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
                 placeholder="Search by user name..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     handleSearch();
                   }
                 }}
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
                  <TableHead className="font-semibold text-[#1a1a1a]">Company</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Name</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Mobile Number</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Email ID</TableHead>
                  <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{user.srNo}</TableCell>
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
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-white">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold">FILTER</DialogTitle>
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
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Name</Label>
                <Input
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder=""
                  className="w-full"
                />
              </div>

              {/* Email Field */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
                <Input
                  value={filters.email}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                  placeholder=""
                  className="w-full"
                />
              </div>

              {/* Mobile Number Field */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Mobile Number</Label>
                <Input
                  value={filters.mobile}
                  onChange={(e) => handleFilterChange('mobile', e.target.value)}
                  placeholder=""
                  className="w-full"
                />
              </div>

              {/* Status Field */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Entity Field */}
              <div className="md:col-span-1">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Entity</Label>
                <Select value={filters.entity} onValueChange={(value) => handleFilterChange('entity', value)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Entity" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    <SelectItem value="all">All Entities</SelectItem>
                    <SelectItem value="entity1">Entity 1</SelectItem>
                    <SelectItem value="entity2">Entity 2</SelectItem>
                    <SelectItem value="entity3">Entity 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="bg-white text-gray-700 hover:bg-gray-50 border-gray-300 px-6 py-2"
              >
                Reset
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2"
              >
                Apply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};