import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Plus, Edit, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLayout } from '../contexts/LayoutContext';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG, getFullUrl, getAuthHeader } from '../config/apiConfig';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

interface ParkingCategoryData {
  id: number;
  sr_no?: number;
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

const CATEGORY_OPTIONS = ['2 Wheeler', '4 Wheeler', 'EV'] as const;

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Name', sortable: true, hideable: true, defaultVisible: true },
  { key: 'active', label: 'Active/Inactive', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdOn', label: 'Created On', sortable: true, hideable: true, defaultVisible: true },
];

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff !important',
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

const dialogPointerGuards = {
  onPointerDownOutside: (e: Event) => {
    if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
      e.preventDefault();
    }
  },
  onInteractOutside: (e: Event) => {
    if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
      e.preventDefault();
    }
  },
};

export const ParkingCategoryPage = () => {
  const { shouldShow } = useDynamicPermissions();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ParkingCategoryData | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<File | null>(null);
  const [editCategoryImage, setEditCategoryImage] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [parkingCategoryData, setParkingCategoryData] = useState<ParkingCategoryData[]>([]);

  useEffect(() => {
    setCurrentSection('Settings');
    fetchParkingCategories();
  }, [setCurrentSection]);

  const fetchParkingCategories = async () => {
    setIsLoading(true);
    try {
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

      const transformedData = data.parking_categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        active: category.active,
        createdOn: new Date(category.created_at).toLocaleDateString('en-GB'),
        resource_id: category.resource_id,
        resource_type: category.resource_type,
        created_at: category.created_at,
        updated_at: category.updated_at,
        parking_image: category.parking_image,
      }));

      setParkingCategoryData(transformedData);
    } catch (error) {
      console.error('Error fetching parking categories:', error);
      toast.error('Failed to load parking categories');
      setParkingCategoryData([
        { id: 1, name: '2 Wheeler', active: true, createdOn: '12/12/2023' },
        { id: 2, name: '4 Wheeler', active: true, createdOn: '12/12/2023' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const tableData = useMemo(
    () =>
      parkingCategoryData.map((item, index) => ({
        ...item,
        sr_no: index + 1,
      })),
    [parkingCategoryData]
  );

  const handleStatusToggle = (id: number) => {
    setParkingCategoryData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );

    const updatedItem = parkingCategoryData.find((item) => item.id === id);
    const newValue = updatedItem ? !updatedItem.active : false;
    toast.success(`Status updated to ${newValue ? 'Active' : 'Inactive'}`);
  };

  const handleEdit = (id: number) => {
    const categoryToEdit = parkingCategoryData.find((item) => item.id === id);
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setEditCategoryName(categoryToEdit.name);
      setEditCategoryImage(null);
      setIsEditModalOpen(true);
    }
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
      const formData = new FormData();
      formData.append('parking_category[name]', categoryName);
      formData.append('parking_category[active]', 'true');
      formData.append('CategoryImage', categoryImage);

      const response = await fetch(getFullUrl(API_CONFIG.ENDPOINTS.PARKING_CATEGORIES), {
        method: 'POST',
        headers: {
          Authorization: getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);

        if (response.status === 422) {
          throw new Error('Name has already been taken');
        }

        throw new Error(`Failed to create parking category: ${response.status} ${response.statusText}`);
      }

      await fetchParkingCategories();
      toast.success('Parking category created successfully');
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating parking category:', error);
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
      const formData = new FormData();
      formData.append('parking_category[name]', editCategoryName);
      formData.append('parking_category[active]', editingCategory.active.toString());

      if (editCategoryImage) {
        formData.append('CategoryImage', editCategoryImage);
      }

      const response = await fetch(
        `${getFullUrl(API_CONFIG.ENDPOINTS.UPDATE_PARKING_CATEGORY)}/${editingCategory.id}.json`,
        {
          method: 'PUT',
          headers: {
            Authorization: getAuthHeader(),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);

        if (response.status === 422) {
          throw new Error('Name has already been taken');
        }

        throw new Error(`Failed to update parking category: ${response.status} ${response.statusText}`);
      }

      await fetchParkingCategories();
      toast.success('Parking category updated successfully');
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating parking category:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update parking category');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setCategoryImage(file);
  };

  const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setEditCategoryImage(file);
  };

  const renderCell = (item: ParkingCategoryData, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return <span className="font-medium">{item.name}</span>;
      case 'active':
        return (
          <Switch
            checked={item.active}
            onCheckedChange={() => handleStatusToggle(item.id)}
            className="data-[state=checked]:bg-brand"
          />
        );
      case 'createdOn':
        return <span className="text-sm text-gray-600">{item.createdOn}</span>;
      default:
        return item[columnKey as keyof ParkingCategoryData] ?? '-';
    }
  };

  const renderActions = (item: ParkingCategoryData) => {
    if (!shouldShow('Parking Category', 'update')) return null;

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleEdit(item.id)}
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
    );
  };

  const leftActions = shouldShow('Parking Category', 'create') ? (
    <Button
      onClick={handleAdd}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  ) : null;

  return (
    <div className="p-6 min-h-screen">
      <EnhancedTable
        data={tableData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        leftActions={leftActions}
        storageKey="parking-category-table"
        emptyMessage={
          searchTerm
            ? 'No parking categories found matching your search'
            : 'No parking categories found'
        }
        loading={isLoading}
        loadingMessage="Loading..."
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        hideTableExport
        pagination
        pageSize={10}
        getItemId={(item) => String(item.id)}
      />

      {/* Create Category Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => !open && handleCloseCreateModal()} modal={false}>
        <DialogContent
          className="w-full sm:max-w-[500px] !bg-white overflow-visible"
          {...dialogPointerGuards}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Create Category</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseCreateModal}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="create-category-name-label">Category Name *</InputLabel>
              <MuiSelect
                labelId="create-category-name-label"
                label="Category Name *"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Category Image *</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-brand text-brand hover:bg-brand-selected"
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

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button
                onClick={handleCreateCategory}
                disabled={isCreating}
                className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
              >
                {isCreating ? 'Creating...' : 'CREATE'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseCreateModal}
                className="border-brand text-brand px-8 w-full sm:w-auto"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && handleCloseEditModal()} modal={false}>
        <DialogContent
          className="w-full sm:max-w-[500px] !bg-white overflow-visible"
          {...dialogPointerGuards}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Edit Category</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseEditModal}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="edit-category-name-label">Category Name *</InputLabel>
              <MuiSelect
                labelId="edit-category-name-label"
                label="Category Name *"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">Category Image</label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-brand text-brand hover:bg-brand-selected"
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

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button
                onClick={handleUpdateCategory}
                disabled={isUpdating}
                className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
              >
                {isUpdating ? 'Updating...' : 'UPDATE'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseEditModal}
                className="border-brand text-brand px-8 w-full sm:w-auto"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
