import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { EditSubCategoryModal } from './modals/EditSubCategoryModal';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import { Edit, Trash2, Upload, Plus, X, Search } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice';
import { fetchBuildings } from '@/store/slices/buildingsSlice';
import { fetchWings } from '@/store/slices/wingsSlice';
import { fetchFloors } from '@/store/slices/floorsSlice';
import { fetchZones } from '@/store/slices/zonesSlice';
import { fetchRooms } from '@/store/slices/roomsSlice';
import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';

const subCategorySchema = z.object({
  category: z.string().min(1, 'Category selection is required'),
  customerEnabled: z.boolean(),
  building: z.boolean(),
  wing: z.boolean(),
  floor: z.boolean(),
  zone: z.boolean(),
  room: z.boolean(),
});

type SubCategoryFormData = z.infer<typeof subCategorySchema>;

interface SubCategoryType {
  id: string;
  helpdesk_category_name: string;
  name: string;
  icon_url: string;
  customer_enabled?: boolean;
  location_config: {
    building_enabled: boolean;
    wing_enabled: boolean;
    zone_enabled: boolean;
    floor_enabled: boolean;
    room_enabled: boolean;
  };
}

interface CategoryOption {
  id: number;
  name: string;
}

interface Engineer {
  id: number;
  full_name: string;
}

interface LocationOption {
  id: number;
  name: string;
}

interface EngineerResponse {
  users: Array<{
    id: number;
    full_name: string;
  }>;
}

interface SubCategoriesResponse {
  sub_categories: SubCategoryType[];
  total_count: number;
  page: number;
  per_page: number;
  filters: {
    site_id: number | null;
    category_id: number | null;
    search: string | null;
  };
}

interface BuildingsResponse {
  id: number;
  name: string;
  site_id: string;
  // ... other fields as needed
}

interface WingsResponse {
  wings: Array<{
    id: number;
    name: string;
    // ... other fields
  }>;
}

interface FloorsResponse {
  floors: Array<{
    id: number;
    name: string;
    // ... other fields
  }>;
}

export const SubCategoryTab: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const { data: helpdeskCategoriesData, loading: categoriesLoading } = useAppSelector(
    (state) => state.helpdeskCategories
  );
  const { data: buildingsData, loading: buildingsLoading } = useAppSelector(
    (state) => state.buildings
  );
  const { data: wingsData, loading: wingsLoading } = useAppSelector(
    (state) => state.wings
  );
  const { data: floorsData, loading: floorsLoading } = useAppSelector(
    (state) => state.floors
  );
  const { data: zonesData, loading: zonesLoading } = useAppSelector(
    (state) => state.zones
  );
  const { data: roomsData, loading: roomsLoading } = useAppSelector(
    (state) => state.rooms
  );

  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    total_count: 0,
    per_page: 20,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategoryType | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(['']);
  const [selectedEngineers, setSelectedEngineers] = useState<number[]>([]);
  const [selectedBuildings, setSelectedBuildings] = useState<number[]>([]);
  const [selectedWings, setSelectedWings] = useState<number[]>([]);
  const [selectedZones, setSelectedZones] = useState<number[]>([]);
  const [selectedFloors, setSelectedFloors] = useState<number[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  
  // Dropdown open/close states
  const [engineersDropdownOpen, setEngineersDropdownOpen] = useState(false);
  const [buildingsDropdownOpen, setBuildingsDropdownOpen] = useState(false);
  const [wingsDropdownOpen, setWingsDropdownOpen] = useState(false);
  const [floorsDropdownOpen, setFloorsDropdownOpen] = useState(false);
  const [zonesDropdownOpen, setZonesDropdownOpen] = useState(false);
  const [roomsDropdownOpen, setRoomsDropdownOpen] = useState(false);

  // Get data from Redux state
  const availableCategories = helpdeskCategoriesData?.helpdesk_categories || [];
  const availableBuildings = buildingsData?.buildings || [];
  const availableWings = wingsData?.wings || [];
  const availableFloors = floorsData?.floors || [];
  const availableZones = zonesData?.zones || [];
  const availableRooms = roomsData?.rooms || [];

  const getCategoryName = (categoryId: number) => {
    const category = availableCategories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const form = useForm<SubCategoryFormData>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      category: '',
      customerEnabled: false,
      building: false,
      wing: false,
      floor: false,
      zone: false,
      room: false,
    },
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    console.log('SubCategoryTab mounted, fetching data...');
    dispatch(fetchHelpdeskCategories());
    dispatch(fetchBuildings());
    dispatch(fetchWings());
    dispatch(fetchFloors());
    dispatch(fetchZones());
    dispatch(fetchRooms());
    fetchData(1, debouncedSearchTerm);
  }, [dispatch, debouncedSearchTerm]);

  const fetchData = async (page: number = 1, search: string = '') => {
    console.log('Starting fetchData...', { page, search });
    setIsLoading(true);
    try {
      const [
        engineersResponse,
        subCategoriesResponse
      ] = await Promise.all([
        ticketManagementAPI.getEngineers(),
        ticketManagementAPI.getSubCategories(page, 20, search)
      ]);

      // Process engineers - extract from users array
      const formattedEngineers = engineersResponse?.users?.map(user => ({
        id: user.id,
        full_name: user.full_name
      })) || [];
      setEngineers(formattedEngineers);

      // Process sub-categories
      if (subCategoriesResponse) {
        console.log('SubCategories API Response:', subCategoriesResponse);
        setSubCategories(subCategoriesResponse.sub_categories || []);
        const paginationData = {
          page: subCategoriesResponse.page || 1,
          total_count: subCategoriesResponse.total_count || 0,
          per_page: subCategoriesResponse.per_page || 20,
        };
        console.log('Setting pagination data:', paginationData);
        setPagination(paginationData);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubmit = async () => {
    // Get form values directly from the form inputs
    const categorySelect = document.querySelector('select[name="category"]') as HTMLSelectElement;
    const tagsInput = document.querySelector('input[placeholder="Enter tag"]') as HTMLInputElement;
    
    // Check for required fields with specific messages like CategoryTypeTab
    if (!form.getValues('category')) {
      toast.error('Please select a category');
      return;
    }
    
    if (!tagsInput?.value?.trim()) {
      toast.error('Please enter at least one tag');
      return;
    }
    
    if (selectedEngineers.length === 0) {
      toast.error('Please assign at least one engineer');
      return;
    }

    // Get the form data
    const data: SubCategoryFormData = {
      category: form.getValues('category'),
      customerEnabled: form.getValues('customerEnabled'),
      building: form.getValues('building'),
      wing: form.getValues('wing'),
      floor: form.getValues('floor'),
      zone: form.getValues('zone'),
      room: form.getValues('room'),
    };

    // Continue with the rest of the validation and submission logic
    await handleSubmit(data);
  };

  const handleSubmit = async (data: SubCategoryFormData) => {
    setIsSubmitting(true);
    try {
      const subCategoryData = {
        helpdesk_category_id: parseInt(data.category),
        customer_enabled: data.customerEnabled,
        icon: iconFile, // This will be properly handled by the API service as helpdesk_sub_category[icon]
        sub_category_tags: tags.filter(tag => tag.trim()),
        location_enabled: {
          building: data.building,
          wing: data.wing,
          zone: data.zone,
          floor: data.floor,
          room: data.room,
        },
        location_data: {
          building_ids: data.building ? selectedBuildings : [],
          wing_ids: data.wing ? selectedWings : [],
          zone_ids: data.zone ? selectedZones : [],
          floor_ids: data.floor ? selectedFloors : [],
          room_ids: data.room ? selectedRooms : [],
        },
        complaint_worker: {
          assign_to: selectedEngineers,
        },
      };

      await ticketManagementAPI.createSubCategory(subCategoryData);
      toast.success('Sub-category created successfully!');
      form.reset();
      setTags(['']);
      setSelectedEngineers([]);
      setSelectedBuildings([]);
      setSelectedWings([]);
      setSelectedZones([]);
      setSelectedFloors([]);
      setSelectedRooms([]);
      setIconFile(null);
      fetchData(currentPage, searchTerm);
    } catch (error) {
      toast.error('Failed to create sub-category');
      console.error('Error creating sub-category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    setTags([...tags, '']);
  };

  const updateTag = (index: number, value: string) => {
    const updated = tags.map((tag, i) => i === index ? value : tag);
    setTags(updated);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Icon file selected:', file.name, file.type, file.size);
      setIconFile(file);
    }
  };

  const handleMultiSelect = (value: string, currentValues: number[], setter: (values: number[]) => void) => {
    const numValue = parseInt(value);
    if (currentValues.includes(numValue)) {
      setter(currentValues.filter(v => v !== numValue));
    } else {
      setter([...currentValues, numValue]);
    }
  };

  const columns = [
    { key: 'id', label: 'S.No', sortable: true },
    { key: 'helpdesk_category_name', label: 'Category Type', sortable: true },
    { key: 'name', label: 'Sub Category', sortable: true },
    { key: 'building', label: 'Building', sortable: true },
    { key: 'wing', label: 'Wing', sortable: true },
    { key: 'floor', label: 'Floor', sortable: true },
    { key: 'zone', label: 'Zone', sortable: true },
    { key: 'room', label: 'Room', sortable: true },
    { key: 'icon_url', label: 'Icon', sortable: false },
  ];

  const renderCell = (item: SubCategoryType, columnKey: string) => {
    switch (columnKey) {
      case 'building':
      case 'wing':
      case 'floor':
      case 'zone':
      case 'room': {
        const key = `${columnKey}_enabled` as keyof typeof item.location_config;
        return (
          <div className="flex justify-center">
            <Checkbox
              checked={item.location_config?.[key] || false}
              disabled
            />
          </div>
        );
      }
      case 'helpdesk_category_name':
        return item.helpdesk_category_name || '--';
      case 'name':
        return item.name || '--';
      case 'id':
        return item.id || '--';
      case 'icon_url':
        if (!item.icon_url) return <span className="text-gray-400">No icon</span>;
        return (
          <div className="flex justify-center">
            <img 
              src={item.icon_url} 
              alt="Icon" 
              className="w-8 h-8 object-cover rounded" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        );
      default:
        return '--';
    }
  };

  const renderActions = (item: SubCategoryType) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => {
        setEditingSubCategory(item);
        setEditModalOpen(true);
      }}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const handleDelete = async (subCategory: SubCategoryType) => {
    if (!confirm('Are you sure you want to delete this sub-category?')) {
      return;
    }
    
    try {
      await ticketManagementAPI.deleteSubCategory(subCategory.id);
      setSubCategories(subCategories.filter(sub => sub.id !== subCategory.id));
      toast.success('Sub-category deleted successfully!');
      fetchData(currentPage, searchTerm);
    } catch (error) {
      console.error('Error deleting sub-category:', error);
      toast.error('Failed to delete sub-category');
    }
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(pagination.total_count / pagination.per_page);
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchData(page, debouncedSearchTerm);
  };

  // Smart pagination rendering function (similar to ScheduledTaskDashboard)
  const renderPaginationItems = () => {
    const items = [];
    const totalPages = Math.ceil(pagination.total_count / pagination.per_page);
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            className="cursor-pointer"
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show pages 2, 3, 4 if currentPage is 1, 2, or 3
      if (currentPage <= 3) {
        for (let i = 2; i <= 4 && i < totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        if (totalPages > 5) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      } else if (currentPage >= totalPages - 2) {
        // Show ellipsis before last 4 pages
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = totalPages - 3; i < totalPages; i++) {
          if (i > 1) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      } else {
        // Show ellipsis, currentPage-1, currentPage, currentPage+1, ellipsis
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if less than or equal to 7
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(i)}
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Sub-Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="relative">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent 
                          position="popper" 
                          side="bottom" 
                          align="start" 
                          sideOffset={8}
                          avoidCollisions={false}
                          className="z-[9999] min-w-[var(--radix-select-trigger-width)] max-h-[200px] overflow-y-auto"
                        >
                          {(() => {
                            console.log('Rendering categories in dropdown:', availableCategories);
                            return availableCategories.length === 0 ? (
                              <SelectItem value="no-categories" disabled>
                                {categoriesLoading ? "Loading categories..." : "No categories available"}
                              </SelectItem>
                            ) : (
                              availableCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))
                            );
                          })()}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Icon
                  </label>
                  <div className="flex items-center gap-2">
                    <label htmlFor="subcategory-icon-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Icon
                        </span>
                      </Button>
                    </label>
                    <input
                      id="subcategory-icon-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleIconChange}
                    />
                    {iconFile && (
                      <span className="text-sm text-gray-600">{iconFile.name}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Subcategory <span className="text-red-500">*</span></h3>
                  {/* <Button type="button" onClick={addTag} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button> */}
                </div>

                {tags.map((tag, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter tag"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                    />
                    {tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTag(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Engineer Assignment */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Engineer Assignment <span className="text-red-500">*</span></h3>
                <Select
                  open={engineersDropdownOpen}
                  onOpenChange={setEngineersDropdownOpen}
                  onValueChange={(value) => {
                    const engineerId = parseInt(value);
                    if (selectedEngineers.includes(engineerId)) {
                      setSelectedEngineers(selectedEngineers.filter(id => id !== engineerId));
                    } else {
                      setSelectedEngineers([...selectedEngineers, engineerId]);
                    }
                    // Close dropdown after selection
                    setTimeout(() => setEngineersDropdownOpen(false), 200);
                  }}
                >
                  <SelectTrigger className="w-full relative">
                    <SelectValue placeholder={
                      selectedEngineers.length === 0 
                        ? "Select engineers" 
                        : `${selectedEngineers.length} engineer(s) selected`
                    } />
                  </SelectTrigger>
                  <SelectContent 
                    position="popper" 
                    side="bottom" 
                    align="start" 
                    sideOffset={8}
                    avoidCollisions={false}
                    className="z-[9999] min-w-[var(--radix-select-trigger-width)] max-h-[200px] overflow-y-auto"
                  >
                    {engineers.length === 0 ? (
                      <SelectItem value="no-engineers" disabled>
                        Loading engineers...
                      </SelectItem>
                    ) : (
                      engineers.map((engineer) => (
                        <SelectItem key={engineer.id} value={engineer.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>{engineer.full_name}</span>
                            {selectedEngineers.includes(engineer.id) && (
                              <span className="ml-2 text-primary">✓</span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {/* Show selected engineers */}
                {selectedEngineers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedEngineers.map((engineerId) => {
                      const engineer = engineers.find(e => e.id === engineerId);
                      return engineer ? (
                        <div key={engineerId} className="flex items-center gap-1 bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-sm font-medium">
                          {engineer.full_name}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-indigo-600"
                            onClick={() => setSelectedEngineers(selectedEngineers.filter(id => id !== engineerId))}
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Location Configuration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Location Configuration</h3>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        form.setValue('building', true);
                        form.setValue('wing', true);
                        form.setValue('floor', true);
                        form.setValue('zone', true);
                        form.setValue('room', true);
                      }}
                    >
                      Select All
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        form.setValue('building', false);
                        form.setValue('wing', false);
                        form.setValue('floor', false);
                        form.setValue('zone', false);
                        form.setValue('room', false);
                        setSelectedBuildings([]);
                        setSelectedWings([]);
                        setSelectedFloors([]);
                        setSelectedZones([]);
                        setSelectedRooms([]);
                      }}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                
                {/* Location Enable/Disable Checkboxes */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="building"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Building</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Wing</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Floor</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zone"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Zone</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Room</FormLabel>
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="customerEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Customer Enabled</FormLabel>
                      </FormItem>
                    )}
                  /> */}
                </div>
                
                {/* Buildings Dropdown - Only show when building checkbox is checked */}
                {form.watch('building') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Buildings</label>
                    <div className="border rounded-md bg-white">
                      <div className="p-2 border-b space-y-1">
                        <button
                          type="button"
                          onClick={() => setSelectedBuildings(availableBuildings.map(b => b.id))}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded text-sm font-medium text-blue-600"
                        >
                          <Checkbox checked={selectedBuildings.length === availableBuildings.length} />
                          <span>Select All</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBuildings([])}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-red-50 rounded text-sm font-medium text-red-600"
                        >
                          <Checkbox checked={false} />
                          <span>Clear All</span>
                        </button>
                      </div>
                      <div className="max-h-[250px] overflow-y-auto p-1">
                        {availableBuildings.length === 0 ? (
                          <div className="px-2 py-2 text-sm text-gray-500">No buildings available</div>
                        ) : (
                          availableBuildings.map((building) => (
                            <button
                              key={building.id}
                              type="button"
                              onClick={() => {
                                if (selectedBuildings.includes(building.id)) {
                                  setSelectedBuildings(selectedBuildings.filter(id => id !== building.id));
                                } else {
                                  setSelectedBuildings([...selectedBuildings, building.id]);
                                }
                              }}
                              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm"
                            >
                              <Checkbox checked={selectedBuildings.includes(building.id)} />
                              <span>{building.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Show selected buildings */}
                    {selectedBuildings.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedBuildings.map((buildingId) => {
                          const building = availableBuildings.find(b => b.id === buildingId);
                          return building ? (
                            <div key={buildingId} className="flex items-center gap-1 bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-medium">
                              {building.name}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-blue-600"
                                onClick={() => setSelectedBuildings(selectedBuildings.filter(id => id !== buildingId))}
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Wings Dropdown - Only show when wing checkbox is checked */}
                {form.watch('wing') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Wings</label>
                    <div className="border rounded-md bg-white">
                      <div className="p-2 border-b space-y-1">
                        <button
                          type="button"
                          onClick={() => setSelectedWings(availableWings.map(w => w.id))}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded text-sm font-medium text-blue-600"
                        >
                          <Checkbox checked={selectedWings.length === availableWings.length} />
                          <span>Select All</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedWings([])}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-red-50 rounded text-sm font-medium text-red-600"
                        >
                          <Checkbox checked={false} />
                          <span>Clear All</span>
                        </button>
                      </div>
                      <div className="max-h-[250px] overflow-y-auto p-1">
                        {availableWings.length === 0 ? (
                          <div className="px-2 py-2 text-sm text-gray-500">No wings available</div>
                        ) : (
                          availableWings.map((wing) => (
                            <button
                              key={wing.id}
                              type="button"
                              onClick={() => {
                                if (selectedWings.includes(wing.id)) {
                                  setSelectedWings(selectedWings.filter(id => id !== wing.id));
                                } else {
                                  setSelectedWings([...selectedWings, wing.id]);
                                }
                              }}
                              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm"
                            >
                              <Checkbox checked={selectedWings.includes(wing.id)} />
                              <span>{wing.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Show selected wings */}
                    {selectedWings.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedWings.map((wingId) => {
                          const wing = availableWings.find(w => w.id === wingId);
                          return wing ? (
                            <div key={wingId} className="flex items-center gap-1 bg-green-100 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                              {wing.name}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-green-600"
                                onClick={() => setSelectedWings(selectedWings.filter(id => id !== wingId))}
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Floors Dropdown - Only show when floor checkbox is checked */}
                {form.watch('floor') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Floors</label>
                    <div className="border rounded-md bg-white">
                      <div className="p-2 border-b space-y-1">
                        <button
                          type="button"
                          onClick={() => setSelectedFloors(availableFloors.map(f => f.id))}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded text-sm font-medium text-blue-600"
                        >
                          <Checkbox checked={selectedFloors.length === availableFloors.length} />
                          <span>Select All</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedFloors([])}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-red-50 rounded text-sm font-medium text-red-600"
                        >
                          <Checkbox checked={false} />
                          <span>Clear All</span>
                        </button>
                      </div>
                      <div className="max-h-[250px] overflow-y-auto p-1">
                        {availableFloors.length === 0 ? (
                          <div className="px-2 py-2 text-sm text-gray-500">No floors available</div>
                        ) : (
                          availableFloors.map((floor) => (
                            <button
                              key={floor.id}
                              type="button"
                              onClick={() => {
                                if (selectedFloors.includes(floor.id)) {
                                  setSelectedFloors(selectedFloors.filter(id => id !== floor.id));
                                } else {
                                  setSelectedFloors([...selectedFloors, floor.id]);
                                }
                              }}
                              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm"
                            >
                              <Checkbox checked={selectedFloors.includes(floor.id)} />
                              <span>{floor.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Show selected floors */}
                    {selectedFloors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedFloors.map((floorId) => {
                          const floor = availableFloors.find(f => f.id === floorId);
                          return floor ? (
                            <div key={floorId} className="flex items-center gap-1 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-medium">
                              {floor.name}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-amber-600"
                                onClick={() => setSelectedFloors(selectedFloors.filter(id => id !== floorId))}
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Zones Dropdown - Only show when zone checkbox is checked */}
                {form.watch('zone') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Zones</label>
                    <div className="border rounded-md bg-white">
                      <div className="p-2 border-b space-y-1">
                        <button
                          type="button"
                          onClick={() => setSelectedZones(availableZones.map(z => z.id))}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded text-sm font-medium text-blue-600"
                        >
                          <Checkbox checked={selectedZones.length === availableZones.length} />
                          <span>Select All</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedZones([])}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-red-50 rounded text-sm font-medium text-red-600"
                        >
                          <Checkbox checked={false} />
                          <span>Clear All</span>
                        </button>
                      </div>
                      <div className="max-h-[250px] overflow-y-auto p-1">
                        {availableZones.length === 0 ? (
                          <div className="px-2 py-2 text-sm text-gray-500">No zones available</div>
                        ) : (
                          availableZones.map((zone) => (
                            <button
                              key={zone.id}
                              type="button"
                              onClick={() => {
                                if (selectedZones.includes(zone.id)) {
                                  setSelectedZones(selectedZones.filter(id => id !== zone.id));
                                } else {
                                  setSelectedZones([...selectedZones, zone.id]);
                                }
                              }}
                              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm"
                            >
                              <Checkbox checked={selectedZones.includes(zone.id)} />
                              <span>{zone.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Show selected zones */}
                    {selectedZones.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedZones.map((zoneId) => {
                          const zone = availableZones.find(z => z.id === zoneId);
                          return zone ? (
                            <div key={zoneId} className="flex items-center gap-1 bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-sm font-medium">
                              {zone.name}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-purple-600"
                                onClick={() => setSelectedZones(selectedZones.filter(id => id !== zoneId))}
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Rooms Dropdown - Only show when room checkbox is checked */}
                {form.watch('room') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Rooms</label>
                    <div className="border rounded-md bg-white">
                      <div className="p-2 border-b space-y-1">
                        <button
                          type="button"
                          onClick={() => setSelectedRooms(availableRooms.map(r => r.id))}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-blue-50 rounded text-sm font-medium text-blue-600"
                        >
                          <Checkbox checked={selectedRooms.length === availableRooms.length} />
                          <span>Select All</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedRooms([])}
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-red-50 rounded text-sm font-medium text-red-600"
                        >
                          <Checkbox checked={false} />
                          <span>Clear All</span>
                        </button>
                      </div>
                      <div className="max-h-[250px] overflow-y-auto p-1">
                        {availableRooms.length === 0 ? (
                          <div className="px-2 py-2 text-sm text-gray-500">No rooms available</div>
                        ) : (
                          availableRooms.map((room) => (
                            <button
                              key={room.id}
                              type="button"
                              onClick={() => {
                                if (selectedRooms.includes(room.id)) {
                                  setSelectedRooms(selectedRooms.filter(id => id !== room.id));
                                } else {
                                  setSelectedRooms([...selectedRooms, room.id]);
                                }
                              }}
                              className="w-full flex items-center gap-2 px-2 py-2 hover:bg-gray-100 rounded text-sm"
                            >
                              <Checkbox checked={selectedRooms.includes(room.id)} />
                              <span>{room.name}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                    
                    {/* Show selected rooms */}
                    {selectedRooms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedRooms.map((roomId) => {
                          const room = availableRooms.find(r => r.id === roomId);
                          return room ? (
                            <div key={roomId} className="flex items-center gap-1 bg-pink-100 text-pink-900 px-3 py-1 rounded-full text-sm font-medium">
                              {room.name}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-pink-600"
                                onClick={() => setSelectedRooms(selectedRooms.filter(id => id !== roomId))}
                              />
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleCreateSubmit}
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sub Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading sub-categories...</div>
            </div>
          ) : (
            <>
              <EnhancedTable
                data={subCategories}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                storageKey="sub-categories-table"
                pagination={false}
                enableSearch={true}
                onSearchChange={handleSearch}
                searchValue={searchTerm}
              />

              {/* Pagination - Same pattern as ScheduledTaskDashboard */}
              {(() => {
                const totalPages = Math.ceil(pagination.total_count / pagination.per_page);
                return totalPages > 1 ? (
                  <div className="flex justify-center mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                ) : null;
              })()}

              {/* Pagination Info */}
              {(() => {
                const totalPages = Math.ceil(pagination.total_count / pagination.per_page);
                return totalPages > 1 ? (
                  <div className="text-center mt-2 text-sm text-gray-600">
                    Showing page {currentPage} of {totalPages} ({pagination.total_count} total records)
                  </div>
                ) : null;
              })()}
            </>
          )}
        </CardContent>
      </Card>

      <EditSubCategoryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        subCategory={editingSubCategory}
        onUpdate={() => fetchData(currentPage, searchTerm)}
      />
    </div>
  );
};
