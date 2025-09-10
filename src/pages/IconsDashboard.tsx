import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Chip, OutlinedInput } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search, Edit, RefreshCw, Star, Grid3X3, Trash2, X, Image, Upload } from 'lucide-react';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';

interface IconItem {
  id: string;
  sNo: number;
  name: string;
  description: string;
  category: string;
  iconPath: string;
  isActive: boolean;
  createdOn: string;
  createdBy: string;
  usageCount: number;
}

export const IconsDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<IconItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconsData, setIconsData] = useState<IconItem[]>([]);
  
  // Modal states for the new structure
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    file: null as File | null,
    isActive: true
  });
  
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    category: '',
    file: null as File | null,
    isActive: true
  });
  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    actions: true,
    icon: true,
    name: true,
    description: true,
    category: true,
    status: true,
    usageCount: true,
    createdOn: true,
    createdBy: true
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

  // Category options
  const categoryOptions = [
    'User',
    'Navigation',
    'System',
    'Analytics',
    'Communication',
    'Actions',
    'Status',
    'Media',
    'Forms',
    'Tools'
  ];

  const [filteredIcons, setFilteredIcons] = useState<IconItem[]>([]);

  // Load icons data from API (mock for now)
  const loadIcons = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading icons...');
      
      // Mock data for now - replace with actual API call
      const mockIcons: IconItem[] = [
        {
          id: '1',
          sNo: 1,
          name: 'User Profile',
          description: 'Default user profile icon',
          category: 'User',
          iconPath: '/icons/user-profile.svg',
          isActive: true,
          createdOn: '2024-01-15',
          createdBy: 'Admin User',
          usageCount: 245
        },
        {
          id: '2',
          sNo: 2,
          name: 'Dashboard',
          description: 'Dashboard navigation icon',
          category: 'Navigation',
          iconPath: '/icons/dashboard.svg',
          isActive: true,
          createdOn: '2024-01-20',
          createdBy: 'Admin User',
          usageCount: 189
        },
        {
          id: '3',
          sNo: 3,
          name: 'Settings',
          description: 'System settings icon',
          category: 'System',
          iconPath: '/icons/settings.svg',
          isActive: true,
          createdOn: '2024-02-01',
          createdBy: 'System Admin',
          usageCount: 156
        },
        {
          id: '4',
          sNo: 4,
          name: 'Reports',
          description: 'Analytics and reports icon',
          category: 'Analytics',
          iconPath: '/icons/reports.svg',
          isActive: false,
          createdOn: '2024-02-10',
          createdBy: 'Admin User',
          usageCount: 98
        },
        {
          id: '5',
          sNo: 5,
          name: 'Notifications',
          description: 'Notification bell icon',
          category: 'Communication',
          iconPath: '/icons/notifications.svg',
          isActive: true,
          createdOn: '2024-02-15',
          createdBy: 'System Admin',
          usageCount: 312
        }
      ];
      
      console.log('Received data:', mockIcons);
      setIconsData(mockIcons);
      setFilteredIcons(mockIcons);
    } catch (error) {
      console.error('Failed to load icons:', error);
      toast({
        title: "Error",
        description: "Failed to load icons",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Pagination calculations
  const totalRecords = filteredIcons.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = filteredIcons.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    loadIcons();
  }, [loadIcons]);

  useEffect(() => {
    const filtered = iconsData.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, iconsData]);

  const handleAdd = () => {
    setShowAddModal(true);
    setEditMode(false);
    setFormData({
      name: '',
      description: '',
      category: '',
      file: null,
      isActive: true
    });
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditMode(false);
    setFormData({
      name: '',
      description: '',
      category: '',
      file: null,
      isActive: true
    });
    setEditFormData({
      name: '',
      description: '',
      category: '',
      file: null,
      isActive: true
    });
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      description: '',
      category: '',
      file: null,
      isActive: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentFormData = editMode ? editFormData : formData;
    
    if (!currentFormData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an icon name",
        variant: "destructive"
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter an icon description",
        variant: "destructive"
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Mock API call - replace with actual implementation
      console.log('Creating icon:', formData);

      toast({
        title: "Success",
        description: "Icon created successfully",
      });
      
      handleModalClose();
      // Reload the data
      await loadIcons();
    } catch (error) {
      console.error('Failed to create icon:', error);
      toast({
        title: "Error",
        description: "Failed to create icon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (iconId: string) => {
    const icon = iconsData.find(i => i.id === iconId);
    if (icon) {
      setEditingIcon(icon);
      setEditFormData({
        name: icon.name,
        description: icon.description,
        category: icon.category,
        file: null,
        isActive: icon.isActive
      });
      setEditMode(true);
      setShowAddModal(true);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingIcon(null);
    setEditFormData({
      name: '',
      description: '',
      category: '',
      file: null,
      isActive: true
    });
  };

  const handleEditSubmit = async () => {
    if (!editFormData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an icon name",
        variant: "destructive"
      });
      return;
    }

    if (!editFormData.description.trim()) {
      toast({
        title: "Error",
        description: "Please enter an icon description",
        variant: "destructive"
      });
      return;
    }

    if (!editFormData.category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!editingIcon) {
        throw new Error('No icon selected for editing');
      }
      
      // Mock API call - replace with actual implementation
      console.log('Updating icon:', editFormData);
      
      toast({
        title: "Success",
        description: "Icon updated successfully",
      });
      
      handleEditModalClose();
      // Reload the data
      await loadIcons();
    } catch (error) {
      console.error('Failed to update icon:', error);
      toast({
        title: "Error",
        description: "Failed to update icon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (iconId: string) => {
    console.log(`Deleting icon: ${iconId}`);
    toast({
      title: "Delete Icon",
      description: `Icon ID: ${iconId} deletion requested`,
    });
  };

  const handleRefresh = async () => {
    setSearchTerm('');
    setCurrentPage(1);
    await loadIcons();
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (editMode) {
        setEditFormData(prev => ({
          ...prev,
          file: file
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          file: file
        }));
      }
    }
  };

  // Column definitions for visibility control
  const columns = [
    { key: 'sNo', label: 'S.No.', visible: visibleColumns.sNo },
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    { key: 'icon', label: 'Icon', visible: visibleColumns.icon },
    { key: 'name', label: 'Name', visible: visibleColumns.name },
    { key: 'description', label: 'Description', visible: visibleColumns.description },
    { key: 'category', label: 'Category', visible: visibleColumns.category },
    { key: 'status', label: 'Status', visible: visibleColumns.status },
    { key: 'usageCount', label: 'Usage Count', visible: visibleColumns.usageCount },
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
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search icons..."
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
              {visibleColumns.icon && <TableHead className="w-20">Icon</TableHead>}
              {visibleColumns.name && <TableHead className="w-40">Name</TableHead>}
              {visibleColumns.description && <TableHead className="w-60">Description</TableHead>}
              {visibleColumns.category && <TableHead className="w-32">Category</TableHead>}
              {visibleColumns.status && <TableHead className="w-24">Status</TableHead>}
              {visibleColumns.usageCount && <TableHead className="w-32">Usage Count</TableHead>}
              {visibleColumns.createdOn && <TableHead className="w-40">Created On</TableHead>}
              {visibleColumns.createdBy && <TableHead className="w-40">Created By</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading icons...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  {searchTerm ? `No icons found matching "${searchTerm}"` : 'No icons found'}
                  <br />
                  <span className="text-sm">Click "Add" to create your first icon</span>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((icon, index) => (
                <TableRow key={icon.id} className="hover:bg-gray-50">
                  {visibleColumns.sNo && (
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <button
                        onClick={() => handleEdit(icon.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                    </TableCell>
                  )}
                  {visibleColumns.icon && (
                    <TableCell>
                      <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <Star className="w-4 h-4 text-gray-400" />
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.name && (
                    <TableCell className="font-medium">
                      {icon.name}
                    </TableCell>
                  )}
                  {visibleColumns.description && (
                    <TableCell className="text-gray-600">
                      {icon.description}
                    </TableCell>
                  )}
                  {visibleColumns.category && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        icon.category === 'User' ? 'bg-blue-100 text-blue-700' : 
                        icon.category === 'Navigation' ? 'bg-green-100 text-green-700' :
                        icon.category === 'System' ? 'bg-purple-100 text-purple-700' :
                        icon.category === 'Analytics' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {icon.category}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.status && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        icon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {icon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.usageCount && (
                    <TableCell className="text-gray-500">
                      {icon.usageCount}
                    </TableCell>
                  )}
                  {visibleColumns.createdOn && <TableCell>{icon.createdOn}</TableCell>}
                  {visibleColumns.createdBy && <TableCell>{icon.createdBy}</TableCell>}
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

      {/* Add/Edit Modal */}
      <Dialog open={showAddModal} onOpenChange={(open) => !open && handleCloseAddModal()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Icon' : 'Add New Icon'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon Name
              </label>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter icon name"
                value={editMode ? editFormData.name : formData.name}
                onChange={(e) => editMode 
                  ? setEditFormData({...editFormData, name: e.target.value})
                  : setFormData({...formData, name: e.target.value})
                }
                variant="outlined"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter description"
                value={editMode ? editFormData.description : formData.description}
                onChange={(e) => editMode 
                  ? setEditFormData({...editFormData, description: e.target.value})
                  : setFormData({...formData, description: e.target.value})
                }
                variant="outlined"
                multiline
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <FormControl fullWidth size="small">
                <TextField
                  select
                  value={editMode ? editFormData.category : formData.category}
                  onChange={(e) => editMode 
                    ? setEditFormData({...editFormData, category: e.target.value})
                    : setFormData({...formData, category: e.target.value})
                  }
                  SelectProps={{
                    native: true,
                  }}
                  variant="outlined"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="User">User</option>
                  <option value="Navigation">Navigation</option>
                  <option value="System">System</option>
                  <option value="Analytics">Analytics</option>
                  <option value="Action">Action</option>
                </TextField>
              </FormControl>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon File
              </label>
              <input
                type="file"
                accept="image/*,.svg"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#00B4D8] file:text-white hover:file:bg-[#00B4D8]/90"
                required={!editMode}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports PNG, JPG, SVG files. Max size: 2MB
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={editMode ? editFormData.isActive : formData.isActive}
                onChange={(e) => editMode 
                  ? setEditFormData({...editFormData, isActive: e.target.checked})
                  : setFormData({...formData, isActive: e.target.checked})
                }
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active Icon
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseAddModal}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {editMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editMode ? 'Update Icon' : 'Add Icon'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
