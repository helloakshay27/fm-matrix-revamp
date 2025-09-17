import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Chip, OutlinedInput } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search, RefreshCw, Grid3X3, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';

interface Role {
  id: number;
  name: string;
  created_on: string;
  created_by: string;
}

export const RolesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rolesData, setRolesData] = useState<Role[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    actions: true,
    name: true,
    createdOn: true
  });
  const [formData, setFormData] = useState({
    roleName: ''
  });
  const [editFormData, setEditFormData] = useState({
    roleName: ''
  });

  // Field styles for Material-UI components
  const fieldStyles = {
    height: '45px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      height: '45px',
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#999696ff',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#000000',
      '&.Mui-focused': {
        color: '#C72030',
      },
      '& .MuiInputLabel-asterisk': {
        color: '#ff0000 !important',
      },
    },
    '& .MuiFormLabel-asterisk': {
      color: '#ff0000 !important',
    },
  };

  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);

  // Load roles from API (mock implementation)
  const loadRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading roles...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration - replace with actual API calls
      const mockRolesData: Role[] = [
        {
          id: 1,
          name: 'Administrator',
          created_on: '15/09/2025, 10:30 AM',
          created_by: 'Admin'
        },
        {
          id: 2,
          name: 'Manager',
          created_on: '14/09/2025, 02:15 PM',
          created_by: 'Admin'
        },
        {
          id: 3,
          name: 'Employee',
          created_on: '13/09/2025, 09:45 AM',
          created_by: 'Admin'
        },
        {
          id: 4,
          name: 'Guest',
          created_on: '12/09/2025, 04:20 PM',
          created_by: 'Admin'
        }
      ];
      
      setRolesData(mockRolesData);
      setFilteredRoles(mockRolesData);
    } catch (error) {
      console.error('Failed to load roles:', error);
      toast({
        title: "Error",
        description: "Failed to load roles",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Pagination calculations
  const totalRecords = filteredRoles.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = filteredRoles.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  useEffect(() => {
    const filtered = rolesData.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.created_by.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, rolesData]);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setFormData({
      roleName: ''
    });
  };

  const handleSubmit = async () => {
    if (!formData.roleName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new role to mock data
      const newRole: Role = {
        id: rolesData.length + 1,
        name: formData.roleName.trim(),
        created_on: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        created_by: 'Admin'
      };
      
      setRolesData(prev => [...prev, newRole]);

      toast({
        title: "Success",
        description: "Role created successfully",
      });
      
      handleModalClose();
    } catch (error) {
      console.error('Failed to create role:', error);
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setEditFormData({
      roleName: role.name
    });
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingRole(null);
    setEditFormData({
      roleName: ''
    });
  };

  const handleEditSubmit = async () => {
    if (!editFormData.roleName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role name",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!editingRole) {
        throw new Error('No role selected for editing');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update role in mock data
      setRolesData(prev => prev.map(role => 
        role.id === editingRole.id 
          ? { ...role, name: editFormData.roleName.trim() }
          : role
      ));
      
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
      
      handleEditModalClose();
    } catch (error) {
      console.error('Failed to update role:', error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setSearchTerm('');
    setCurrentPage(1);
    await loadRoles();
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
    { key: 'name', label: 'Roles', visible: visibleColumns.name },
    { key: 'createdOn', label: 'Created On', visible: visibleColumns.createdOn }
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
              {visibleColumns.name && <TableHead className="w-40">Roles</TableHead>}
              {visibleColumns.createdOn && <TableHead className="w-48">Created On</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading roles...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {searchTerm ? `No roles found matching "${searchTerm}"` : 'No roles found'}
                  <br />
                  <span className="text-sm">Click "Add" to create your first role</span>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((role, index) => (
                <TableRow key={role.id} className="hover:bg-gray-50">
                  {visibleColumns.sNo && (
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <button
                        onClick={() => handleEdit(role)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                    </TableCell>
                  )}
                  {visibleColumns.name && (
                    <TableCell className="font-medium">
                      {role.name}
                    </TableCell>
                  )}
                  {visibleColumns.createdOn && <TableCell>{role.created_on}</TableCell>}
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

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">New Role</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleModalClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Role Name Input */}
              <TextField
                label="Role Name" 
                placeholder="Enter Role Name"
                value={formData.roleName}
                onChange={(e) => setFormData({...formData, roleName: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline"
                onClick={handleModalClose}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                {isSubmitting ? 'Creating...' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Edit Role</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditModalClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Role Name Input */}
              <TextField
                label="Role Name"
                placeholder="Enter Role Name"
                value={editFormData.roleName}
                onChange={(e) => setEditFormData({...editFormData, roleName: e.target.value})}
                fullWidth
                variant="outlined"
                required
                sx={fieldStyles}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline"
                onClick={handleEditModalClose}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditSubmit}
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};