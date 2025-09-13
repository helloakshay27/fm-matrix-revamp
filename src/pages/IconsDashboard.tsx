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
import { API_CONFIG } from '@/config/apiConfig';

// API Response Interface
interface ApiIconResponse {
  id: number;
  icon_type: string;
  image_file_name: string;
  image_content_type: string;
  image_file_size: string;
  created_by_id: number;
  image_updated_at: string;
  active: boolean;
  resource_id: number | null;
  resource_type: string | null;
  image_url: string | null;
  created_by: {
    id: number;
    name: string;
  };
}

// UI Interface for table display
interface IconItem {
  id: string;
  sNo: number;
  name: string;
  iconType: string;
  description: string;
  category: string;
  iconPath: string;
  isActive: boolean;
  createdOn: string;
  createdBy: string;
  usageCount: number;
  fileSize: string;
  contentType: string;
}

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
};

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
    iconType: '',
    file: null as File | null,
    isActive: true
  });
  
  const [editFormData, setEditFormData] = useState({
    iconType: '',
    file: null as File | null,
    isActive: true,
    currentImageUrl: null as string | null
  });
  const [visibleColumns, setVisibleColumns] = useState({
    sNo: true,
    actions: true,
    icon: true,
    name: true,
    iconType: true,
    description: false,
    category: true,
    status: true,
    fileSize: false,
    contentType: false,
    usageCount: false,
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

  // Category options - Dynamic based on actual API data
  const categoryOptions = [
    { value: 'support_staff_category', label: 'Support Staff Category' },
    { value: 'delivery_service_provider', label: 'Delivery Service Provider' },
    { value: 'navigation', label: 'Navigation' },
    { value: 'system', label: 'System' },
    { value: 'user_interface', label: 'User Interface' },
    { value: 'action', label: 'Action' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'communication', label: 'Communication' },
    { value: 'status', label: 'Status' },
    { value: 'media', label: 'Media' },
    { value: 'forms', label: 'Forms' },
    { value: 'tools', label: 'Tools' }
  ];

  const [filteredIcons, setFilteredIcons] = useState<IconItem[]>([]);

  // Load icons data from API
  const loadIcons = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Loading icons from API...');
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ICONS}`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData: ApiIconResponse[] = await response.json();
      console.log('API Response:', apiData);

      // Transform API data to UI format
      const transformedIcons: IconItem[] = apiData.map((apiIcon, index) => ({
        id: apiIcon.id.toString(),
        sNo: index + 1,
        name: apiIcon.image_file_name.replace(/\.[^/.]+$/, ""), // Remove file extension for display
        iconType: apiIcon.icon_type,
        description: `${apiIcon.icon_type.replace(/_/g, ' ').toUpperCase()} icon`,
        category: apiIcon.icon_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        iconPath: apiIcon.image_url || `/icons/${apiIcon.image_file_name}`,
        isActive: apiIcon.active,
        createdOn: new Date(apiIcon.image_updated_at).toLocaleDateString('en-IN'),
        createdBy: apiIcon.created_by.name,
        usageCount: Math.floor(Math.random() * 500) + 50, // Mock usage count as API doesn't provide it
        fileSize: apiIcon.image_file_size || '0',
        contentType: apiIcon.image_content_type
      }));
      
      console.log('Transformed data:', transformedIcons);
      setIconsData(transformedIcons);
      setFilteredIcons(transformedIcons);
    } catch (error) {
      console.error('Failed to load icons:', error);
      toast({
        title: "Error",
        description: "Failed to load icons from server",
        variant: "destructive"
      });
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock data...');
      const mockIcons: IconItem[] = [
        {
          id: '1',
          sNo: 1,
          name: 'User Profile',
          iconType: 'user_profile',
          description: 'Default user profile icon',
          category: 'User',
          iconPath: '/icons/user-profile.svg',
          isActive: true,
          createdOn: '15/01/2024',
          createdBy: 'Admin User',
          usageCount: 245,
          fileSize: '5410',
          contentType: 'image/png'
        }
      ];
      setIconsData(mockIcons);
      setFilteredIcons(mockIcons);
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
      icon.iconType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.contentType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, iconsData]);

  const handleAdd = () => {
    setShowAddModal(true);
    setEditMode(false);
    setFormData({
      iconType: '',
      file: null,
      isActive: true
    });
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditMode(false);
    setFormData({
      iconType: '',
      file: null,
      isActive: true
    });
    setEditFormData({
      iconType: '',
      file: null,
      isActive: true,
      currentImageUrl: null
    });
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setFormData({
      iconType: '',
      file: null,
      isActive: true
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const currentFormData = editMode ? editFormData : formData;
    
    if (!currentFormData.iconType.trim()) {
      toast({
        title: "Error",
        description: "Please enter an icon type",
        variant: "destructive"
      });
      return;
    }

    if (!currentFormData.file && !editMode) {
      toast({
        title: "Error",
        description: "Please select an icon file",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare FormData for API
      const apiFormData = new FormData();
      
      // Add form fields according to API specification
      apiFormData.append('icon[icon_type]', currentFormData.iconType);
      
      if (currentFormData.file) {
        apiFormData.append('icon[image_file_name]', currentFormData.file.name);
        apiFormData.append('icon[image_content_type]', currentFormData.file.type);
        apiFormData.append('icon[image]', currentFormData.file);
      }
      
      apiFormData.append('icon[active]', currentFormData.isActive.toString());

      // API URL
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ICONS}`;
      console.log('Creating icon at:', url);
      console.log('FormData contents:', {
        'icon[icon_type]': currentFormData.iconType,
        'icon[image_file_name]': currentFormData.file?.name,
        'icon[image_content_type]': currentFormData.file?.type,
        'icon[active]': 'true'
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: apiFormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Icon created successfully:', result);

      toast({
        title: "Success",
        description: "Icon created successfully",
      });
      
      handleCloseAddModal();
      // Reload the data
      await loadIcons();
    } catch (error) {
      console.error('Failed to create icon:', error);
      toast({
        title: "Error",
        description: `Failed to create icon: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      // Fetch detailed icon data by ID
      fetchIconById(iconId);
      setEditMode(true);
      setShowAddModal(true);
    }
  };

  // Fetch icon data by ID for editing
  const fetchIconById = async (iconId: string) => {
    try {
      const url = `${API_CONFIG.BASE_URL}/pms/icons/${iconId}.json`;
      console.log('Fetching icon by ID from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const iconData: ApiIconResponse = await response.json();
      console.log('Icon data by ID:', iconData);

      // Set form data with fetched icon details
      setEditFormData({
        iconType: iconData.icon_type,
        file: null,
        isActive: iconData.active,
        currentImageUrl: iconData.image_url || null // Store current image URL for preview
      });
    } catch (error) {
      console.error('Failed to fetch icon by ID:', error);
      toast({
        title: "Error",
        description: "Failed to load icon details",
        variant: "destructive"
      });
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingIcon(null);
    setEditFormData({
      iconType: '',
      file: null,
      isActive: true,
      currentImageUrl: null
    });
  };

  const handleEditSubmit = async () => {
    if (!editFormData.iconType.trim()) {
      toast({
        title: "Error",
        description: "Please enter an icon type",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!editingIcon) {
        throw new Error('No icon selected for editing');
      }
      
      // Prepare FormData for API
      const apiFormData = new FormData();
      
      // Add form fields according to API specification
      apiFormData.append('icon[icon_type]', editFormData.iconType);
      
      if (editFormData.file) {
        apiFormData.append('icon[image_file_name]', editFormData.file.name);
        apiFormData.append('icon[image_content_type]', editFormData.file.type);
        apiFormData.append('icon[image]', editFormData.file);
      }
      
      apiFormData.append('icon[active]', editFormData.isActive.toString());

      // API URL for updating - using the specified format
      const url = `${API_CONFIG.BASE_URL}/pms/icons/${editingIcon.id}.json`;
      console.log('Updating icon at:', url);
      console.log('FormData contents:', {
        'icon[icon_type]': editFormData.iconType,
        'icon[image_file_name]': editFormData.file?.name,
        'icon[image_content_type]': editFormData.file?.type,
        'icon[active]': editFormData.isActive.toString()
      });

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: apiFormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Icon updated successfully:', result);
      
      toast({
        title: "Success",
        description: "Icon updated successfully",
      });
      
      handleCloseAddModal();
      // Reload the data
      await loadIcons();
    } catch (error) {
      console.error('Failed to update icon:', error);
      toast({
        title: "Error",
        description: `Failed to update icon: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please select a valid image file (PNG, JPG, or SVG)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "File size must be less than 2MB",
          variant: "destructive"
        });
        return;
      }

      console.log('Selected file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

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
    { key: 'name', label: 'Image Name', visible: visibleColumns.name },
    { key: 'iconType', label: 'Icon Type', visible: visibleColumns.iconType },
    { key: 'description', label: 'Description', visible: visibleColumns.description },
    { key: 'category', label: 'Category', visible: visibleColumns.category },
    { key: 'status', label: 'Status', visible: visibleColumns.status },
    { key: 'fileSize', label: 'File Size', visible: visibleColumns.fileSize },
    { key: 'contentType', label: 'Content Type', visible: visibleColumns.contentType },
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
              {visibleColumns.name && <TableHead className="w-40">Image Name</TableHead>}
              {visibleColumns.iconType && <TableHead className="w-40">Icon Type</TableHead>}
              {visibleColumns.description && <TableHead className="w-60">Description</TableHead>}
              {/* {visibleColumns.category && <TableHead className="w-32">Category</TableHead>} */}
              {visibleColumns.status && <TableHead className="w-24">Status</TableHead>}
              {visibleColumns.fileSize && <TableHead className="w-24">File Size</TableHead>}
              {visibleColumns.contentType && <TableHead className="w-32">Content Type</TableHead>}
              {visibleColumns.usageCount && <TableHead className="w-32">Usage Count</TableHead>}
              {visibleColumns.createdOn && <TableHead className="w-40">Created On</TableHead>}
              {visibleColumns.createdBy && <TableHead className="w-40">Created By</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading icons...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-gray-500">
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
                      <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        {icon.iconPath && icon.iconPath !== '/icons/undefined' && icon.iconPath !== '/icons/null' ? (
                          <img 
                            src={icon.iconPath} 
                            alt={icon.name}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <Image className="w-5 h-5 text-gray-400" style={{display: icon.iconPath && icon.iconPath !== '/icons/undefined' && icon.iconPath !== '/icons/null' ? 'none' : 'flex'}} />
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.name && (
                    <TableCell className="font-medium">
                      {icon.name}
                    </TableCell>
                  )}
                  {visibleColumns.iconType && (
                    <TableCell className="font-medium">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {icon.iconType}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.description && (
                    <TableCell className="text-gray-600">
                      {icon.description}
                    </TableCell>
                  )}
                  {/* {visibleColumns.category && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        icon.category.includes('Support Staff') ? 'bg-blue-100 text-blue-700' : 
                        icon.category.includes('Delivery') ? 'bg-green-100 text-green-700' :
                        icon.category.includes('Provider') ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {icon.category}
                      </span>
                    </TableCell>
                  )} */}
                  {visibleColumns.status && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        icon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {icon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.fileSize && (
                    <TableCell className="text-gray-500">
                      {icon.fileSize ? `${Math.round(parseInt(icon.fileSize) / 1024)} KB` : 'N/A'}
                    </TableCell>
                  )}
                  {visibleColumns.contentType && (
                    <TableCell className="text-gray-500 text-xs">
                      {icon.contentType}
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

      {/* Add Modal */}
      <Dialog open={showAddModal && !editMode} onOpenChange={(open) => !open && handleCloseAddModal()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Create Icon</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseAddModal}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Icon Type Input */}
              <TextField
                label="Icon Type"
                placeholder="Enter Icon Type (e.g., support_staff_category)"
                value={formData.iconType}
                onChange={(e) => setFormData({...formData, iconType: e.target.value})}
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

              {/* Active/Inactive Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active-checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                />
                <label htmlFor="active-checkbox" className="text-sm font-medium text-gray-700">
                  Active
                </label>
                <span className="text-xs text-gray-500">
                  ({formData.isActive ? 'Icon will be active' : 'Icon will be inactive'})
                </span>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Icon File *
              </label>
              
              {/* New File Preview */}
              {formData.file && (
                <div className="mb-4 p-4 border rounded-lg bg-green-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Icon Preview:</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={URL.createObjectURL(formData.file)} 
                      alt="Icon preview"
                      className="w-16 h-16 object-contain border rounded"
                    />
                    <div className="text-sm text-green-600">
                      <p>✓ Selected: {formData.file.name}</p>
                      <p className="text-xs text-gray-600">
                        Size: {(formData.file.size / 1024).toFixed(1)} KB | Type: {formData.file.type}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG, SVG files only. Max size: 2MB
                  </p>
                </label>
              </div>
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
      <Dialog open={showAddModal && editMode} onOpenChange={(open) => !open && handleCloseAddModal()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Edit Icon</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseAddModal}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Icon Type Input */}
              <TextField
                label="Icon Type"
                placeholder="Enter Icon Type (e.g., support_staff_category)"
                value={editFormData.iconType}
                onChange={(e) => setEditFormData({...editFormData, iconType: e.target.value})}
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

              {/* Active/Inactive Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active-checkbox-edit"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}
                  className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                />
                <label htmlFor="active-checkbox-edit" className="text-sm font-medium text-gray-700">
                  Active
                </label>
                <span className="text-xs text-gray-500">
                  ({editFormData.isActive ? 'Icon will be active' : 'Icon will be inactive'})
                </span>
              </div>
            </div>

            {/* Current Icon Preview and File Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Icon File (Optional)
              </label>
              
              {/* Current Icon Preview */}
              {editFormData.currentImageUrl && !editFormData.file && (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Icon:</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={editFormData.currentImageUrl} 
                      alt="Current icon"
                      className="w-16 h-16 object-contain border rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="text-sm text-gray-600">
                      <p>Current icon will be kept if no new file is uploaded</p>
                    </div>
                  </div>
                </div>
              )}

              {/* New File Preview */}
              {editFormData.file && (
                <div className="mb-4 p-4 border rounded-lg bg-green-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">New Icon Preview:</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={URL.createObjectURL(editFormData.file)} 
                      alt="New icon preview"
                      className="w-16 h-16 object-contain border rounded"
                    />
                    <div className="text-sm text-green-600">
                      <p>✓ Selected: {editFormData.file.name}</p>
                      <p className="text-xs text-gray-600">
                        Size: {(editFormData.file.size / 1024).toFixed(1)} KB | Type: {editFormData.file.type}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload-edit"
                />
                <label htmlFor="file-upload-edit" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop new icon
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG, SVG files only. Max size: 2MB
                  </p>
                  {editFormData.currentImageUrl && (
                    <p className="text-xs text-blue-600 mt-1">
                      Leave empty to keep current icon
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={handleCloseAddModal}
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
