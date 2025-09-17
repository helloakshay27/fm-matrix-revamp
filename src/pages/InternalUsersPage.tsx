import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';

interface InternalUser {
  id: number;
  userName: string;
  mobileNo: string;
  emailId: string;
  company: string;
  role: string;
  reportsTo: string;
  associatedProjects: string;
  created_on: string;
  created_by: string;
}

export const InternalUsersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [internalUsersData, setInternalUsersData] = useState<InternalUser[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    actions: true,
    userName: true,
    mobileNo: true,
    emailId: true,
    company: true,
    role: true,
    reportsTo: true,
    associatedProjects: true
  });

  const [filteredUsers, setFilteredUsers] = useState<InternalUser[]>([]);

  // Load internal users from API (mock implementation)
  const loadInternalUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading internal users...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration - replace with actual API calls
      const mockUsersData: InternalUser[] = [
        {
          id: 1,
          userName: 'John Doe',
          mobileNo: '+91 9876543210',
          emailId: 'john.doe@company.com',
          company: 'ABC Corp',
          role: 'Project Manager',
          reportsTo: 'Jane Smith',
          associatedProjects: 'Project Alpha, Project Beta',
          created_on: '15/09/2025, 10:30 AM',
          created_by: 'Admin'
        },
        {
          id: 2,
          userName: 'Sarah Wilson',
          mobileNo: '+91 9876543211',
          emailId: 'sarah.wilson@company.com',
          company: 'XYZ Ltd',
          role: 'Team Lead',
          reportsTo: 'John Doe',
          associatedProjects: 'Project Gamma',
          created_on: '14/09/2025, 02:15 PM',
          created_by: 'Admin'
        },
        {
          id: 3,
          userName: 'Mike Johnson',
          mobileNo: '+91 9876543212',
          emailId: 'mike.johnson@company.com',
          company: 'ABC Corp',
          role: 'Developer',
          reportsTo: 'Sarah Wilson',
          associatedProjects: 'Project Delta, Project Echo',
          created_on: '13/09/2025, 09:45 AM',
          created_by: 'Admin'
        }
      ];
      
      setInternalUsersData(mockUsersData);
      setFilteredUsers(mockUsersData);
    } catch (error) {
      console.error('Failed to load internal users:', error);
      toast({
        title: "Error",
        description: "Failed to load internal users",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Pagination calculations
  const totalRecords = filteredUsers.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    loadInternalUsers();
  }, [loadInternalUsers]);

  useEffect(() => {
    const filtered = internalUsersData.filter(user =>
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobileNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.reportsTo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, internalUsersData]);

  const handleAdd = () => {
    navigate('/settings/manage-users/internal-users/add');
  };

  const handleEdit = (user: InternalUser) => {
    navigate(`/settings/manage-users/internal-users/edit/${user.id}`);
  };

  const handleRefresh = async () => {
    setSearchTerm('');
    setCurrentPage(1);
    await loadInternalUsers();
    toast({
      title: "Refreshed",
      description: "Data has been refreshed successfully",
    });
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  // Column definitions for visibility control
  const columns = [
    { key: 'sNo', label: 'S.No.', visible: visibleColumns.sNo },
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    { key: 'userName', label: 'User Name', visible: visibleColumns.userName },
    { key: 'mobileNo', label: 'Mobile No.', visible: visibleColumns.mobileNo },
    { key: 'emailId', label: 'Email Id', visible: visibleColumns.emailId },
    { key: 'company', label: 'Company', visible: visibleColumns.company },
    { key: 'role', label: 'Role', visible: visibleColumns.role },
    { key: 'reportsTo', label: 'Reports to', visible: visibleColumns.reportsTo },
    { key: 'associatedProjects', label: 'Associated Projects', visible: visibleColumns.associatedProjects }
  ];

  return (
    <>
      <div className="p-6 min-h-screen">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleAdd}
            className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <ColumnVisibilityDropdown
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
              {visibleColumns.sNo && <TableHead className="w-20">S.No.</TableHead>}
              {visibleColumns.actions && <TableHead className="w-20">Actions</TableHead>}
              {visibleColumns.userName && <TableHead className="w-48">User Name</TableHead>}
              {visibleColumns.mobileNo && <TableHead className="w-40">Mobile No.</TableHead>}
              {visibleColumns.emailId && <TableHead className="w-64">Email Id</TableHead>}
              {visibleColumns.company && <TableHead className="w-40">Company</TableHead>}
              {visibleColumns.role && <TableHead className="w-40">Role</TableHead>}
              {visibleColumns.reportsTo && <TableHead className="w-40">Reports to</TableHead>}
              {visibleColumns.associatedProjects && <TableHead className="w-64">Associated Projects</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading internal users...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  {searchTerm ? `No internal users found matching "${searchTerm}"` : 'No internal users found'}
                  <br />
                  <span className="text-sm">Click "Add" to create your first internal user</span>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((user, index) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  {visibleColumns.sNo && (
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.userName && (
                    <TableCell className="font-medium">
                      {user.userName}
                    </TableCell>
                  )}
                  {visibleColumns.mobileNo && <TableCell>{user.mobileNo}</TableCell>}
                  {visibleColumns.emailId && <TableCell>{user.emailId}</TableCell>}
                  {visibleColumns.company && <TableCell>{user.company}</TableCell>}
                  {visibleColumns.role && <TableCell>{user.role}</TableCell>}
                  {visibleColumns.reportsTo && <TableCell>{user.reportsTo}</TableCell>}
                  {visibleColumns.associatedProjects && (
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {user.associatedProjects}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(totalPages, 10) },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 10 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      </div>
    </>
  );
};