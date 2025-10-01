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
import { Edit, Trash2, Upload, Plus, X } from 'lucide-react';
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

  useEffect(() => {
    console.log('SubCategoryTab mounted, fetching data...');
    dispatch(fetchHelpdeskCategories());
    dispatch(fetchBuildings());
    dispatch(fetchWings());
    dispatch(fetchFloors());
    dispatch(fetchZones());
    dispatch(fetchRooms());
    fetchData();
  }, [dispatch]);

  const fetchData = async () => {
    console.log('Starting fetchData...');
    setIsLoading(true);
    try {
      const [
        engineersResponse,
        subCategoriesResponse
      ] = await Promise.all([
        ticketManagementAPI.getEngineers(),
        ticketManagementAPI.getSubCategories()
      ]);

      // Process engineers - extract from users array
      const formattedEngineers = engineersResponse?.users?.map(user => ({
        id: user.id,
        full_name: user.full_name
      })) || [];
      setEngineers(formattedEngineers);

      // Process sub-categories
      setSubCategories(subCategoriesResponse?.sub_categories || []);

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
      fetchData();
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
    // { key: 'icon_url', label: 'Icon', sortable: false },
  ];

  const renderCell = (item: SubCategoryType, columnKey: string) => {
    switch (columnKey) {
      case 'building':
      case 'wing':
      case 'floor':
      case 'zone':
      case 'room': {
        const key = `${columnKey}_enabled` as keyof typeof item.location_config;
        return item.location_config?.[key] ? 'Yes' : 'No';
      }
      case 'icon_url':
        return item.icon_url ? (
          <img src={item.icon_url} alt="Icon" className="w-8 h-8 object-cover rounded" />
        ) : (
          <span className="text-gray-400">No icon</span>
        );
      case 'helpdesk_category_name':
        return item.helpdesk_category_name || '--';
      case 'name':
        return item.name || '--';
      case 'id':
        return item.id || '--';
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
    } catch (error) {
      console.error('Error deleting sub-category:', error);
      toast.error('Failed to delete sub-category');
    }
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
                  <h3 className="text-lg font-semibold">Subcategory Tags <span className="text-red-500">*</span></h3>
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
                  onValueChange={(value) => {
                    const engineerId = parseInt(value);
                    if (selectedEngineers.includes(engineerId)) {
                      setSelectedEngineers(selectedEngineers.filter(id => id !== engineerId));
                    } else {
                      setSelectedEngineers([...selectedEngineers, engineerId]);
                    }
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
                        <div key={engineerId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                          {engineer.full_name}
                          <X
                            className="h-3 w-3 cursor-pointer"
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
                <h3 className="text-lg font-semibold">Location Configuration</h3>
                
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
                    <Select
                      onValueChange={(value) => {
                        const buildingId = parseInt(value);
                        if (selectedBuildings.includes(buildingId)) {
                          setSelectedBuildings(selectedBuildings.filter(id => id !== buildingId));
                        } else {
                          setSelectedBuildings([...selectedBuildings, buildingId]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          selectedBuildings.length === 0 
                            ? "Select buildings" 
                            : `${selectedBuildings.length} building(s) selected`
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBuildings.map((building) => (
                          <SelectItem key={building.id} value={building.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{building.name}</span>
                              {selectedBuildings.includes(building.id) && (
                                <span className="ml-2 text-primary">✓</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Show selected buildings */}
                    {selectedBuildings.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedBuildings.map((buildingId) => {
                          const building = availableBuildings.find(b => b.id === buildingId);
                          return building ? (
                            <div key={buildingId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                              {building.name}
                              <X
                                className="h-3 w-3 cursor-pointer"
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
                    <Select
                      onValueChange={(value) => {
                        const wingId = parseInt(value);
                        if (selectedWings.includes(wingId)) {
                          setSelectedWings(selectedWings.filter(id => id !== wingId));
                        } else {
                          setSelectedWings([...selectedWings, wingId]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          selectedWings.length === 0 
                            ? "Select wings" 
                            : `${selectedWings.length} wing(s) selected`
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWings.map((wing) => (
                          <SelectItem key={wing.id} value={wing.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{wing.name}</span>
                              {selectedWings.includes(wing.id) && (
                                <span className="ml-2 text-primary">✓</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Show selected wings */}
                    {selectedWings.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedWings.map((wingId) => {
                          const wing = availableWings.find(w => w.id === wingId);
                          return wing ? (
                            <div key={wingId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                              {wing.name}
                              <X
                                className="h-3 w-3 cursor-pointer"
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
                    <Select
                      onValueChange={(value) => {
                        const floorId = parseInt(value);
                        if (selectedFloors.includes(floorId)) {
                          setSelectedFloors(selectedFloors.filter(id => id !== floorId));
                        } else {
                          setSelectedFloors([...selectedFloors, floorId]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          selectedFloors.length === 0 
                            ? "Select floors" 
                            : `${selectedFloors.length} floor(s) selected`
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFloors.map((floor) => (
                          <SelectItem key={floor.id} value={floor.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{floor.name}</span>
                              {selectedFloors.includes(floor.id) && (
                                <span className="ml-2 text-primary">✓</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Show selected floors */}
                    {selectedFloors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedFloors.map((floorId) => {
                          const floor = availableFloors.find(f => f.id === floorId);
                          return floor ? (
                            <div key={floorId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                              {floor.name}
                              <X
                                className="h-3 w-3 cursor-pointer"
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
                    <Select
                      onValueChange={(value) => {
                        const zoneId = parseInt(value);
                        if (selectedZones.includes(zoneId)) {
                          setSelectedZones(selectedZones.filter(id => id !== zoneId));
                        } else {
                          setSelectedZones([...selectedZones, zoneId]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          selectedZones.length === 0 
                            ? "Select zones" 
                            : `${selectedZones.length} zone(s) selected`
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableZones.map((zone) => (
                          <SelectItem key={zone.id} value={zone.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{zone.name}</span>
                              {selectedZones.includes(zone.id) && (
                                <span className="ml-2 text-primary">✓</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Show selected zones */}
                    {selectedZones.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedZones.map((zoneId) => {
                          const zone = availableZones.find(z => z.id === zoneId);
                          return zone ? (
                            <div key={zoneId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                              {zone.name}
                              <X
                                className="h-3 w-3 cursor-pointer"
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
                    <Select
                      onValueChange={(value) => {
                        const roomId = parseInt(value);
                        if (selectedRooms.includes(roomId)) {
                          setSelectedRooms(selectedRooms.filter(id => id !== roomId));
                        } else {
                          setSelectedRooms([...selectedRooms, roomId]);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={
                          selectedRooms.length === 0 
                            ? "Select rooms" 
                            : `${selectedRooms.length} room(s) selected`
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id.toString()}>
                            <div className="flex items-center justify-between w-full">
                              <span>{room.name}</span>
                              {selectedRooms.includes(room.id) && (
                                <span className="ml-2 text-primary">✓</span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Show selected rooms */}
                    {selectedRooms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedRooms.map((roomId) => {
                          const room = availableRooms.find(r => r.id === roomId);
                          return room ? (
                            <div key={roomId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                              {room.name}
                              <X
                                className="h-3 w-3 cursor-pointer"
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
            <EnhancedTable
              data={subCategories}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              storageKey="sub-categories-table"
            />
          )}
        </CardContent>
      </Card>

      <EditSubCategoryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        subCategory={editingSubCategory}
        onUpdate={() => fetchData()}
      />
    </div>
  );
};
