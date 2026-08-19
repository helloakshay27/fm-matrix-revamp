import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { TextField } from '@mui/material';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, RefreshCw, Edit, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { createSupportStaffCategory, fetchSupportStaffCategories, fetchSupportStaffCategoryById, updateSupportStaffCategory, SupportStaffCategory } from '@/services/supportStaffAPI';
import { API_CONFIG } from '@/config/apiConfig';
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";

const columns: ColumnConfig[] = [
  { key: 'sr_no', label: 'S.No.', sortable: true, hideable: true, defaultVisible: true },
  { key: 'name', label: 'Category name', sortable: true, hideable: true, defaultVisible: true },
  { key: 'icons', label: 'Icons', sortable: false, hideable: true, defaultVisible: true },
  { key: 'estimated_time', label: 'Estimated time', sortable: true, hideable: true, defaultVisible: true },
  { key: 'created_on', label: 'Created On', sortable: true, hideable: true, defaultVisible: true },
];

// API Icon Response Interface
interface ApiIconResponse {
  id: number;
  icon_type: string;
  image_file_name: string;
  image_content_type: string;
  image_file_size: string | null;
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

interface SupportStaffData {
  id: number;
  sr_no: number;
  name: string;
  estimated_time: string;
  created_on: string;
  created_by: string;
  active: boolean;
  icon_id?: number;
  icon_image_url?: string;
  icons?: string;
}

export const SupportStaffPage = () => {
  const { shouldShow } = useDynamicPermissions();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<SupportStaffCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportStaffData, setSupportStaffData] = useState<SupportStaffCategory[]>([]);
  const [iconsData, setIconsData] = useState<ApiIconResponse[]>([]);
  const [isLoadingIcons, setIsLoadingIcons] = useState(false);
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
      color: '#000000', // Keep label text black
      '&.Mui-focused': {
        color: '#C72030',
      },
      '& .MuiInputLabel-asterisk': {
        color: '#ff0000 !important', // Only asterisk red
      },
    },
    '& .MuiFormLabel-asterisk': {
      color: '#ff0000 !important', // Only asterisk red
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

  // Load support staff categories from API
  const loadSupportStaffCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchSupportStaffCategories();
      setSupportStaffData(data);
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

  // Load icons from API
  const loadIcons = useCallback(async () => {
    try {
      setIsLoadingIcons(true);
      console.log('🔄 Loading icons from API...');

      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ICONS}`;
      console.log('📡 Fetching icons from:', url);

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
      console.log('📊 Icons API Response:', apiData);
      console.log(`📈 Total icons received: ${apiData.length}`);

      // Log icon types for debugging
      const iconTypes = [...new Set(apiData.map(icon => icon.icon_type))];
      console.log('🏷️ Available icon types:', iconTypes);

      // For debugging, let's be more inclusive and show all active icons
      const activeIcons = apiData.filter(icon => icon.active);
      console.log(`✅ Active icons: ${activeIcons.length} out of ${apiData.length}`);
      console.log('🎯 Active icon types:', [...new Set(activeIcons.map(icon => icon.icon_type))]);

      setIconsData(activeIcons);
      console.log('💾 Icons data set in state:', activeIcons.length);
    } catch (error) {
      console.error('❌ Failed to load icons:', error);
      toast({
        title: "Error",
        description: "Failed to load icons from server",
        variant: "destructive"
      });

      // Keep empty array as fallback
      setIconsData([]);
    } finally {
      setIsLoadingIcons(false);
    }
  }, [toast]);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    loadSupportStaffCategories();
  }, [loadSupportStaffCategories]);

  useEffect(() => {
    loadIcons();
  }, [loadIcons]);

  const tableData: SupportStaffData[] = useMemo(
    () =>
      supportStaffData.map((staff, index) => ({
        ...staff,
        sr_no: index + 1,
        icons: staff.icon_image_url || '',
      })),
    [supportStaffData]
  );

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

    if (!formData.selectedIcon) {
      toast({
        title: "Error",
        description: "Please select an icon",
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
        minutes,
        iconId: parseInt(formData.selectedIcon) // Pass the selected icon ID as iconId
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

  const handleEdit = async (staffId: string) => {
    try {
      console.log(`🎯 Starting edit for staff ID: ${staffId}`);

      // Fetch detailed data from API
      const staffDetails = await fetchSupportStaffCategoryById(parseInt(staffId));
      console.log('📊 Fetched staff details:', staffDetails);

      // Convert to the local SupportStaffCategory format for editing
      const staff: SupportStaffCategory = {
        id: staffDetails.id,
        name: staffDetails.name,
        estimated_time: staffDetails.estimated_time,
        created_on: new Date(staffDetails.created_at).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        created_by: staffDetails.created_by.name || 'Admin',
        active: staffDetails.active === 1,
        icon_id: staffDetails.icon_id
      };

      setEditingStaff(staff);

      // Use the support_staff_estimated_time_hash for accurate parsing
      const timeHash = staffDetails.support_staff_estimated_time_hash;
      const days = timeHash.dd.toString();
      const hours = timeHash.hh.toString();
      const minutes = timeHash.mm.toString();

      console.log('⏰ Parsed time:', { days, hours, minutes });
      console.log('🖼️ Icon ID from API:', staffDetails.icon_id);

      setEditFormData({
        categoryName: staff.name,
        days,
        hours,
        minutes,
        selectedIcon: staffDetails.icon_id ? staffDetails.icon_id.toString() : ''
      });

      // Load icons if not already loaded for the edit modal
      if (iconsData.length === 0) {
        console.log('🔄 Icons not loaded, fetching icons for edit modal...');
        await loadIcons();
      } else {
        console.log(`✅ Icons already loaded (${iconsData.length} icons available)`);
      }

      setIsEditModalOpen(true);
    } catch (error) {
      console.error('❌ Failed to fetch support staff category details:', error);
      toast({
        title: "Error",
        description: "Failed to load category details. Please try again.",
        variant: "destructive"
      });
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

    if (!editFormData.selectedIcon) {
      toast({
        title: "Error",
        description: "Please select an icon",
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
        minutes,
        iconId: parseInt(editFormData.selectedIcon) // Pass the selected icon ID as iconId
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
    await loadSupportStaffCategories();
    toast({
      title: "Refreshed",
      description: "Data has been refreshed successfully",
    });
  };

  // Helper function to format estimated time without trailing commas
  const formatEstimatedTime = (estimatedTime: string): string => {
    if (!estimatedTime || estimatedTime === '--') return '--';

    const timeUnits: string[] = [];
    const matches = estimatedTime.match(/(\d+)\s*(days?|hours?|hrs?|minutes?|mins?)/gi);

    if (matches) {
      matches.forEach(match => {
        const value = parseInt(match.match(/\d+/)?.[0] || '0');
        const unit = match.match(/(days?|hours?|hrs?|minutes?|mins?)/i)?.[0].toLowerCase();

        if (value > 0) {
          if (unit?.includes('day')) {
            timeUnits.push(`${value} ${value === 1 ? 'day' : 'days'}`);
          } else if (unit?.includes('hour') || unit?.includes('hr')) {
            timeUnits.push(`${value} ${value === 1 ? 'hour' : 'hours'}`);
          } else if (unit?.includes('minute') || unit?.includes('min')) {
            timeUnits.push(`${value} ${value === 1 ? 'minute' : 'minutes'}`);
          }
        }
      });
    }

    return timeUnits.length > 0 ? timeUnits.join(', ') : estimatedTime;
  };

  const renderCell = (item: SupportStaffData, columnKey: string) => {
    switch (columnKey) {
      case 'sr_no':
        return <span className="font-medium">{item.sr_no}</span>;
      case 'name':
        return <span className="font-medium">{item.name}</span>;
      case 'icons':
        return item.icon_image_url ? (
          <img
            src={item.icon_image_url}
            alt={item.name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-gray-400 text-xs">No Icon</span>
        );
      case 'estimated_time':
        return (
          <span className="text-gray-600">
            {formatEstimatedTime(item.estimated_time)}
          </span>
        );
      case 'created_on':
        return <span className="text-sm text-gray-600">{item.created_on}</span>;
      default:
        return item[columnKey as keyof SupportStaffData] ?? '-';
    }
  };

  const renderActions = (item: SupportStaffData) => {
    if (!shouldShow('Support Staff', 'update')) return null;

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleEdit(item.id.toString())}
        title="Edit"
      >
        <Edit className="w-4 h-4" />
      </Button>
    );
  };

  const leftActions = shouldShow('Support Staff', 'create') ? (
    <Button
      onClick={handleAdd}
      className="bg-brand text-white hover:bg-brand-hover h-9 px-4 text-sm font-medium"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  ) : null;

  return (
    <>
      <div className="p-6 min-h-screen">
        <EnhancedTable
          data={tableData}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          leftActions={leftActions}
          storageKey="support-staff-table"
          emptyMessage={
            searchTerm
              ? 'No support staff found matching your search'
              : 'No support staff categories found'
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
      </div>

      {/* Add Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Create Support Staff Category</DialogTitle>
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
                onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                fullWidth
                variant="outlined"
                required
                // slotProps={{
                //   inputLabel: {
                //     shrink: true,
                //   },
                // }}
                // InputProps={{
                //   sx: fieldStyles,
                // }}
                sx={fieldStyles}
              />
            </div>

            {/* Days Input */}
            <div>Estimated Time <span className='text-red-500'>*</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <TextField
                  label="Days"
                  placeholder="0"
                  type="number"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
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
            </div>

            {/* Icon Selection Grid */}
            <div className="mt-2">Select icon <span className='text-red-500'>*</span>
              <div className="space-y-3 mt-4">
                {/* <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Select Icon {iconsData.length > 0 && `(${iconsData.length} available)`}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadIcons}
                  disabled={isLoadingIcons}
                  className="px-3 py-1 text-xs"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isLoadingIcons ? 'animate-spin' : ''}`} />
                  Refresh Icons
                </Button>
              </div> */}

                {isLoadingIcons ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading icons...
                  </div>
                ) : iconsData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No icons available</p>
                    <p className="text-sm">Please contact administrator to add icons</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadIcons}
                      className="mt-2"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-6 gap-3 max-h-64 overflow-y-auto">
                    {iconsData.map((iconItem) => (
                      <div
                        key={iconItem.id}
                        className={`flex flex-col items-center gap-2 p-2 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${formData.selectedIcon === iconItem.id.toString()
                          ? 'border-[#C72030] bg-red-50'
                          : 'border-gray-200'
                          }`}
                        onClick={() => {
                          setFormData({ ...formData, selectedIcon: iconItem.id.toString() });
                        }}
                      >
                        <input
                          type="radio"
                          checked={formData.selectedIcon === iconItem.id.toString()}
                          onChange={() => { }}
                          className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                        />
                        {iconItem.image_url ? (
                          <img
                            src={iconItem.image_url}
                            alt={iconItem.icon_type}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'block';
                              }
                            }}
                          />
                        ) : null}
                        <div className="text-xs text-gray-400 hidden">No Image</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                variant="outline"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="fm-button-fix fm-button-brand px-6"
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
                onChange={(e) => setEditFormData({ ...editFormData, categoryName: e.target.value })}
                fullWidth
                variant="outlined"
                required
                // slotProps={{
                //   inputLabel: {
                //     shrink: true,
                //   },
                // }}
                // InputProps={{
                //   sx: fieldStyles,
                // }}
                sx={fieldStyles}
              />
            </div>

            {/* Days Input */}
            <div>Estimated Time <span className='text-red-500'>*</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <TextField
                  label="Days"
                  placeholder="0"
                  type="number"
                  value={editFormData.days}
                  onChange={(e) => setEditFormData({ ...editFormData, days: e.target.value })}
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
                  onChange={(e) => setEditFormData({ ...editFormData, hours: e.target.value })}
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
                  onChange={(e) => setEditFormData({ ...editFormData, minutes: e.target.value })}
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
            </div>

            {/* Icon Selection Grid */}
            <div className="mt-2">Select icon <span className='text-red-500'>*</span>
              <div className="space-y-3 mt-4">
                {/* <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Select Icon {iconsData.length > 0 && `(${iconsData.length} available)`}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={loadIcons}
                  disabled={isLoadingIcons}
                  className="px-3 py-1 text-xs"
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isLoadingIcons ? 'animate-spin' : ''}`} />
                  Refresh Icons
                </Button>
              </div> */}

                {isLoadingIcons ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading icons...
                  </div>
                ) : iconsData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No icons available</p>
                    <p className="text-sm">Please contact administrator to add icons</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadIcons}
                      className="mt-2"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-6 gap-3 max-h-64 overflow-y-auto">
                    {iconsData.map((iconItem) => (
                      <div
                        key={iconItem.id}
                        className={`flex flex-col items-center gap-2 p-2 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${editFormData.selectedIcon === iconItem.id.toString()
                          ? 'border-[#C72030] bg-red-50'
                          : 'border-gray-200'
                          }`}
                        onClick={() => {
                          setEditFormData({ ...editFormData, selectedIcon: iconItem.id.toString() });
                        }}
                      >
                        <input
                          type="radio"
                          checked={editFormData.selectedIcon === iconItem.id.toString()}
                          onChange={() => { }}
                          className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                        />
                        {iconItem.image_url ? (
                          <img
                            src={iconItem.image_url}
                            alt={iconItem.icon_type}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'block';
                              }
                            }}
                          />
                        ) : null}
                        <div className="text-xs text-gray-400 hidden">No Image</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                variant="outline"
                onClick={handleEditSubmit}
                disabled={isSubmitting}
                className="fm-button-fix fm-button-brand px-6"
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