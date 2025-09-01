import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, Edit, Trash2, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { ColumnVisibilityDropdown } from '../components/ColumnVisibilityDropdown';
import { API_CONFIG, getFullUrl, getAuthHeader } from '../config/apiConfig';

interface ParkingCategoryData {
  id: number;
  name: string;
  active: boolean;
  createdOn: string;
  resource_id?: number;
  resource_type?: string;
  created_at?: string;
  updated_at?: string;
  parking_image?: {
    id: number;
    relation: string;
    relation_id: number;
    document: string;
  } | null;
}

export const ParkingCategoryPage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    name: true,
    active: true,
    createdOn: true
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ParkingCategoryData | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [editCategoryImage, setEditCategoryImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setCurrentSection('Settings');
    fetchParkingCategories();
  }, [setCurrentSection]);

  // Fetch parking categories from API
  const fetchParkingCategories = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Fetching parking categories from API...');
      
      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.PARKING_CATEGORIES), {
        method: 'GET',
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch parking categories: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Parking categories fetched successfully:', data);

      // Transform API data to match our interface
      const transformedData = data.parking_categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        active: category.active,
        createdOn: new Date(category.created_at).toLocaleDateString('en-GB'),
        resource_id: category.resource_id,
        resource_type: category.resource_type,
        created_at: category.created_at,
        updated_at: category.updated_at,
        parking_image: category.parking_image
      }));

      setParkingCategoryData(transformedData);
    } catch (error) {
      console.error('❌ Error fetching parking categories:', error);
      toast.error('Failed to load parking categories');
      // Keep sample data as fallback
      setParkingCategoryData([
        {
          id: 1,
          name: '2 Wheeler',
          active: true,
          createdOn: '12/12/2023'
        },
        {
          id: 2,
          name: '4 Wheeler',
          active: true,
          createdOn: '12/12/2023'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize with empty data - will be populated by API call
  const [parkingCategoryData, setParkingCategoryData] = useState<ParkingCategoryData[]>([]);

  const filteredData = parkingCategoryData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  );

  const handleStatusToggle = (id: number) => {
    setParkingCategoryData(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, active: !item.active }
          : item
      )
    );
    
    const updatedItem = parkingCategoryData.find(item => item.id === id);
    const newValue = updatedItem ? !updatedItem.active : false;
    toast.success(`Status updated to ${newValue ? 'Active' : 'Inactive'}`);
  };

  const handleEdit = (id: number) => {
    const categoryToEdit = parkingCategoryData.find(item => item.id === id);
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setEditCategoryName(categoryToEdit.name);
      setEditCategoryImage(null);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    setParkingCategoryData(prevData => prevData.filter(item => item.id !== id));
    toast.success('Parking category deleted successfully');
  };

  const handleAdd = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCategoryName('');
    setCategoryImage(null);
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditingCategory(null);
    setEditCategoryName('');
    setEditCategoryImage(null);
    setIsEditModalOpen(false);
  };

  const handleCreateCategory = async () => {
    if (!categoryName) {
      toast.error('Please select a category name');
      return;
    }
    
    if (!categoryImage) {
      toast.error('Please select a category image');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('parking_category[name]', categoryName);
      formData.append('parking_category[active]', 'true');
      formData.append('CategoryImage', categoryImage);
      
      console.log('Creating parking category with data:', {
        name: categoryName,
        active: true,
        image: categoryImage.name
      });
      
      // Make API call
      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.PARKING_CATEGORIES), {
        method: 'POST',
        headers: {
          Authorization: getAuthHeader(),
          // Note: Don't set Content-Type for FormData - browser sets it automatically with boundary
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        
        // Handle specific 422 error for duplicate name
        if (response.status === 422) {
          throw new Error('Name has already been taken');
        }
        
        throw new Error(`Failed to create parking category: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ Parking category created successfully:', responseData);
      
      // Refresh the data from server instead of updating local state
      await fetchParkingCategories();
      toast.success('Parking category created successfully');
      
      // Reset form and close modal
      handleCloseCreateModal();
      
    } catch (error) {
      console.error('❌ Error creating parking category:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create parking category');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editCategoryName || !editingCategory) {
      toast.error('Please select a category name');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Create FormData for the API request
      const formData = new FormData();
      formData.append('parking_category[name]', editCategoryName);
      formData.append('parking_category[active]', editingCategory.active.toString());
      
      // Only append image if a new one is selected
      if (editCategoryImage) {
        formData.append('CategoryImage', editCategoryImage);
      }
      
      console.log('Updating parking category with data:', {
        id: editingCategory.id,
        name: editCategoryName,
        active: editingCategory.active,
        hasNewImage: !!editCategoryImage
      });
      
      // Make PUT API call to specific category ID
      const response = await fetch(`${getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_PARKING_CATEGORY)}/${editingCategory.id}.json`, {
        method: 'PUT',
        headers: {
          Authorization: getAuthHeader(),
          // Note: Don't set Content-Type for FormData - browser sets it automatically with boundary
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        
        // Handle specific 422 error for duplicate name
        if (response.status === 422) {
          throw new Error('Name has already been taken');
        }
        
        throw new Error(`Failed to update parking category: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ Parking category updated successfully:', responseData);
      
      // Refresh the data from server instead of updating local state
      await fetchParkingCategories();
      toast.success('Parking category updated successfully');
      
      // Reset form and close modal
      handleCloseEditModal();
      
    } catch (error) {
      console.error('❌ Error updating parking category:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update parking category');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCategoryImage(file);
    }
  };

  const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditCategoryImage(file);
    }
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: visible
    }));
  };

  // Column definitions for visibility control
  const columns = [
    { key: 'actions', label: 'Actions', visible: visibleColumns.actions },
    { key: 'name', label: 'Name', visible: visibleColumns.name },
    { key: 'active', label: 'Active/Inactive', visible: visibleColumns.active },
    { key: 'createdOn', label: 'Created On', visible: visibleColumns.createdOn }
  ];

  return (
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
            onClick={fetchParkingCategories}
            disabled={isLoading}
            variant="outline"
            className="px-4 py-2"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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
              {visibleColumns.actions && <TableHead className="text-center">Actions</TableHead>}
              {visibleColumns.name && <TableHead>Name</TableHead>}
              {visibleColumns.active && <TableHead className="text-center">Active/Inactive</TableHead>}
              {visibleColumns.createdOn && <TableHead>Created On</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B4D8]"></div>
                    <span className="ml-2">Loading parking categories...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No parking categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                {visibleColumns.actions && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                    </div>
                  </TableCell>
                )}
                {visibleColumns.name && <TableCell className="font-medium">{item.name}</TableCell>}
                {visibleColumns.active && (
                  <TableCell className="text-center">
                    <Switch
                      checked={item.active}
                      onCheckedChange={() => handleStatusToggle(item.id)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </TableCell>
                )}
                {visibleColumns.createdOn && <TableCell>{item.createdOn}</TableCell>}
              </TableRow>
            ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Category Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCloseCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">Create Category</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseCreateModal}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Category Name</label>
              <Select value={categoryName} onValueChange={setCategoryName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 Wheeler">2 Wheeler</SelectItem>
                  <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Category Image</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-500">
                  {categoryImage ? categoryImage.name : 'No file chosen'}
                </span>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              
              {/* Image Preview */}
              {categoryImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <div className="w-24 h-24 bg-gray-100 rounded border overflow-hidden">
                    <img 
                      src={URL.createObjectURL(categoryImage)} 
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleCreateCategory}
                disabled={isCreating}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">Edit Category</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseEditModal}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Category Name</label>
              <Select value={editCategoryName} onValueChange={setEditCategoryName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2 Wheeler">2 Wheeler</SelectItem>
                  <SelectItem value="4 Wheeler">4 Wheeler</SelectItem>
                  {/* <SelectItem value="Heavy Vehicle">Heavy Vehicle</SelectItem>
                  <SelectItem value="Bicycle">Bicycle</SelectItem>
                  <SelectItem value="Electric Vehicle">Electric Vehicle</SelectItem>
                  <SelectItem value="2-Wheeler">2-Wheeler</SelectItem>
                  <SelectItem value="4-wheeler">4-wheeler</SelectItem>
                  <SelectItem value="2-Wheelers">2-Wheelers</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Category Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Category Image</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={() => document.getElementById('edit-file-input')?.click()}
                >
                  Choose File
                </Button>
                <span className="text-sm text-gray-500">
                  {editCategoryImage ? editCategoryImage.name : 'No file chosen'}
                </span>
                <input
                  id="edit-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="hidden"
                />
              </div>
              
              {/* Show existing image preview */}
              {editingCategory?.parking_image && !editCategoryImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <div className="w-24 h-24 bg-gray-100 rounded border overflow-hidden">
                    <img 
                      src={editingCategory.parking_image.document} 
                      alt={`${editingCategory.name} parking`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
              
              {/* Show new image preview if selected */}
              {editCategoryImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                  <div className="w-24 h-24 bg-gray-100 rounded border overflow-hidden">
                    <img 
                      src={URL.createObjectURL(editCategoryImage)} 
                      alt="New parking category"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdateCategory}
                disabled={isUpdating}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Submit'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};