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
import { createSupportStaffCategory, fetchSupportStaffCategories, updateSupportStaffCategory, SupportStaffCategory } from '@/services/supportStaffAPI';

interface SupportStaffData {
  id: string;
  sNo: number;
  name: string;
  estimatedTime: string;
  createdOn: string;
  createdBy: string;
}

export const SupportStaffPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<SupportStaffCategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportStaffData, setSupportStaffData] = useState<SupportStaffCategory[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    actions: true,
    name: true,
    estimatedTime: true,
    createdOn: true,
    createdBy: true
  });
  const [formData, setFormData] = useState({
    categoryName: '',
    days: '0',
    hours: '0',
    minutes: '0',
    selectedIcon: '' as string
  });
  const [editFormData, setEditFormData] = useState({
    categoryName: '',
    days: '0',
    hours: '0',
    minutes: '0',
    selectedIcon: '' as string
  });

  // Field styles for Material-UI components
  const fieldStyles = {
    backgroundColor: '#fff',
    borderRadius: '4px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ddd',
      },
      '&:hover fieldset': {
        borderColor: '#C72030',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
      },
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  // Service type options
  const serviceTypeOptions = [
    'Delivery',
    'Chef',
    'Cleaning',
    'Maintenance',
    'Security',
    'Catering',
    'Housekeeping',
    'Plumbing',
    'Electrical',
    'Gardening'
  ];

  const [filteredStaff, setFilteredStaff] = useState<SupportStaffCategory[]>([]);

  // Load support staff categories from API
  const loadSupportStaffCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading support staff categories...');
      const data = await fetchSupportStaffCategories();
      console.log('Received data:', data);
      setSupportStaffData(data);
      setFilteredStaff(data);
    } catch (error) {
      console.error('Failed to load support staff categories:', error);
      toast({
        title: "Error",
        description: "Failed to load support staff categories",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Pagination calculations
  const totalRecords = filteredStaff.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = filteredStaff.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    loadSupportStaffCategories();
  }, [loadSupportStaffCategories]);

  useEffect(() => {
    const filtered = supportStaffData.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.created_by.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, supportStaffData]);

  const iconOptions = [
    { id: '1', icon: '📦', name: 'Delivery' },
    { id: '2', icon: '🚛', name: 'Logistics' },
    { id: '3', icon: '🏥', name: 'Medical' },
    { id: '4', icon: '🏪', name: 'Shop' },
    { id: '5', icon: '👨‍⚕️', name: 'Doctor' },
    { id: '6', icon: '🧑‍🔧', name: 'Technician' },
    { id: '7', icon: '🧳', name: 'Travel' },
    { id: '8', icon: '💺', name: 'Haircut' },
    { id: '9', icon: '🧊', name: 'Appliance' },
    { id: '10', icon: '🏦', name: 'Banking' },
    { id: '11', icon: '🔧', name: 'Maintenance' },
    { id: '12', icon: '👨‍💼', name: 'Business' },
    { id: '13', icon: '👩‍⚕️', name: 'Nurse' },
    { id: '14', icon: '📋', name: 'Admin' },
    { id: '15', icon: '🛠️', name: 'Tools' },
    { id: '16', icon: '👨‍🍳', name: 'Chef' },
    { id: '17', icon: '👩‍💻', name: 'IT Support' },
    { id: '18', icon: '📦', name: 'Package' },
    { id: '19', icon: '👮‍♂️', name: 'Security' },
    { id: '20', icon: '🧹', name: 'Cleaning' }
  ];

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setFormData({
      categoryName: '',
      days: '0',
      hours: '0',
      minutes: '0',
      selectedIcon: ''
    });
  };

  const handleSubmit = async () => {
    if (!formData.categoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    const days = parseInt(formData.days) || 0;
    const hours = parseInt(formData.hours) || 0;
    const minutes = parseInt(formData.minutes) || 0;

    if (days === 0 && hours === 0 && minutes === 0) {
      toast({
        title: "Error",
        description: "Please specify at least some estimated time",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await createSupportStaffCategory({
        name: formData.categoryName.trim(),
        days,
        hours,
        minutes
      });

      toast({
        title: "Success",
        description: "Support staff category created successfully",
      });
      
      handleModalClose();
      // Reload the data
      await loadSupportStaffCategories();
    } catch (error) {
      console.error('Failed to create support staff category:', error);
      toast({
        title: "Error",
        description: "Failed to create support staff category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (staffId: string) => {
    const staff = supportStaffData.find(s => s.id.toString() === staffId);
    if (staff) {
      setEditingStaff(staff);
      // Parse the estimated time to extract days, hours, minutes
      const timeString = staff.estimated_time;
      let days = '0', hours = '0', minutes = '0';
      
      // Parse patterns like "1 hours, ", "2 hours, 55 minutes ", etc.
      const hourMatch = timeString.match(/(\d+)\s*hours?/);
      const minuteMatch = timeString.match(/(\d+)\s*minutes?/);
      const dayMatch = timeString.match(/(\d+)\s*days?/);
      
      if (dayMatch) days = dayMatch[1];
      if (hourMatch) hours = hourMatch[1];
      if (minuteMatch) minutes = minuteMatch[1];
      
      setEditFormData({
        categoryName: staff.name,
        days,
        hours,
        minutes,
        selectedIcon: '1' // Default icon, you might want to store this in the API
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingStaff(null);
    setEditFormData({
      categoryName: '',
      days: '0',
      hours: '0',
      minutes: '0',
      selectedIcon: ''
    });
  };

  const handleEditSubmit = async () => {
    if (!editFormData.categoryName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive"
      });
      return;
    }

    const days = parseInt(editFormData.days) || 0;
    const hours = parseInt(editFormData.hours) || 0;
    const minutes = parseInt(editFormData.minutes) || 0;

    if (days === 0 && hours === 0 && minutes === 0) {
      toast({
        title: "Error",
        description: "Please specify at least some estimated time",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!editingStaff) {
        throw new Error('No staff selected for editing');
      }
      
      await updateSupportStaffCategory(editingStaff.id, {
        name: editFormData.categoryName.trim(),
        days,
        hours,
        minutes
      });
      
      toast({
        title: "Success",
        description: "Support staff category updated successfully",
      });
      
      handleEditModalClose();
      // Reload the data
      await loadSupportStaffCategories();
    } catch (error) {
      console.error('Failed to update support staff category:', error);
      toast({
        title: "Error",
        description: "Failed to update support staff category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (staffId: string) => {
    console.log(`Deleting support staff: ${staffId}`);
    toast({
      title: "Delete Support Staff",
      description: `Staff ID: ${staffId} deletion requested`,
    });
  };

  const handleRefresh = async () => {
    setSearchTerm('');
    setCurrentPage(1);
    await loadSupportStaffCategories();
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
    { key: 'name', label: 'Name', visible: visibleColumns.name },
    { key: 'estimatedTime', label: 'Estimated Time', visible: visibleColumns.estimatedTime },
    { key: 'createdOn', label: 'Created On', visible: visibleColumns.createdOn },
    { key: 'createdBy', label: 'Created By', visible: visibleColumns.createdBy }
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
          {/* <Button
            onClick={handleRefresh}
            variant="outline"
            className="px-4 py-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button> */}
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
              {visibleColumns.name && <TableHead className="w-40">Name</TableHead>}
              {visibleColumns.estimatedTime && <TableHead className="w-40">Estimated time</TableHead>}
              {visibleColumns.createdOn && <TableHead className="w-48">Created On</TableHead>}
              {/* {visibleColumns.createdBy && <TableHead className="w-40">Created By</TableHead>} */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading support staff categories...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {searchTerm ? `No support staff categories found matching "${searchTerm}"` : 'No support staff categories found'}
                  <br />
                  <span className="text-sm">Click "Add" to create your first category</span>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((staff, index) => (
                <TableRow key={staff.id} className="hover:bg-gray-50">
                  {visibleColumns.sNo && (
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <button
                        onClick={() => handleEdit(staff.id.toString())}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                    </TableCell>
                  )}
                  {visibleColumns.name && (
                    <TableCell className="font-medium">
                      {staff.name}
                    </TableCell>
                  )}
                  {visibleColumns.estimatedTime && (
                    <TableCell className="text-gray-500">
                      {staff.estimated_time || '--'}
                    </TableCell>
                  )}
                  {visibleColumns.createdOn && <TableCell>{staff.created_on}</TableCell>}
                  {/* {visibleColumns.createdBy && <TableCell>{staff.created_by}</TableCell>} */}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Create</DialogTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Category Name Input */}
              <TextField
                label="Category Name"
                placeholder="Enter Category Name"
                value={formData.categoryName}
                onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
              </div>

              {/* Days Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Days"
                placeholder="0"
                type="number"
                value={formData.days}
                onChange={(e) => setFormData({...formData, days: e.target.value})}
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, max: 365 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              {/* Hours Input */}
              <TextField
                label="Hours"
                placeholder="0"
                type="number"
                value={formData.hours}
                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, max: 23 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              {/* Minutes Input */}
              <TextField
                label="Minutes"
                placeholder="0"
                type="number"
                value={formData.minutes}
                onChange={(e) => setFormData({...formData, minutes: e.target.value})}
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, max: 59 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            {/* Icon Selection Grid */}
            <div className="grid grid-cols-6 gap-3">
              {iconOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setFormData({...formData, selectedIcon: option.id});
                  }}
                >
                  <input
                    type="radio"
                    checked={formData.selectedIcon === option.id}
                    onChange={() => {}}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    style={{
                      accentColor: '#dc2626'
                    }}
                  />
                  <div className="text-lg">{option.icon}</div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Edit Support Staff Category</DialogTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {/* Category Name Input */}
              <TextField
                label="Category Name"
                placeholder="Enter Category Name"
                value={editFormData.categoryName}
                onChange={(e) => setEditFormData({...editFormData, categoryName: e.target.value})}
                fullWidth
                variant="outlined"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            {/* Days Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                label="Days"
                placeholder="0"
                type="number"
                value={editFormData.days}
                onChange={(e) => setEditFormData({...editFormData, days: e.target.value})}
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, max: 365 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              {/* Hours Input */}
              <TextField
                label="Hours"
                placeholder="0"
                type="number"
                value={editFormData.hours}
                onChange={(e) => setEditFormData({...editFormData, hours: e.target.value})}
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, max: 23 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />

              {/* Minutes Input */}
              <TextField
                label="Minutes"
                placeholder="0"
                type="number"
                value={editFormData.minutes}
                onChange={(e) => setEditFormData({...editFormData, minutes: e.target.value})}
                fullWidth
                variant="outlined"
                inputProps={{ min: 0, max: 59 }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            {/* Icon Selection Grid */}
            <div className="grid grid-cols-6 gap-3">
              {iconOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setEditFormData({...editFormData, selectedIcon: option.id});
                  }}
                >
                  <input
                    type="radio"
                    checked={editFormData.selectedIcon === option.id}
                    onChange={() => {}}
                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    style={{
                      accentColor: '#dc2626'
                    }}
                  />
                  <div className="text-lg">{option.icon}</div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
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