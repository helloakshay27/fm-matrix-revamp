import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Upload, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchHelpdeskCategories } from '@/store/slices/helpdeskCategoriesSlice';
import { fetchBuildings } from '@/store/slices/buildingsSlice';
import { fetchWings } from '@/store/slices/wingsSlice';
import { fetchFloors } from '@/store/slices/floorsSlice';
import { fetchZones } from '@/store/slices/zonesSlice';
import { fetchRooms } from '@/store/slices/roomsSlice';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';

const subCategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required'),
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
  id: string | number;
  name: string;
  active?: number | null;
  customer_enabled?: boolean | null;
  helpdesk_category_id: number;
  helpdesk_category_name: string;
  icon_url: string;
  created_at?: string;
  updated_at?: string;
  location_config: {
    building_enabled: boolean;
    wing_enabled: boolean;
    zone_enabled: boolean;
    area_enabled?: boolean;
    floor_enabled: boolean;
    room_enabled: boolean;
    building_ids?: string[];
    wing_ids?: string[];
    zone_ids?: string[] | null;
    area_ids?: string[] | null;
    floor_ids?: string[];
    room_ids?: string[];
  };
  applicable_locations?: {
    buildings: Array<{ id: number; name: string }>;
    wings: Array<{ id: number; name: string }>;
    zones: Array<{ id: number; name: string }>;
    areas: Array<{ id: number; name: string }>;
    floors: Array<{ id: number; name: string }>;
    rooms: Array<{ id: number; name: string }>;
  };
  complaint_worker?: {
    id: number;
    assign_to: string[];
  };
}

interface EditSubCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCategory: SubCategoryType | null;
  onUpdate: (subCategory: SubCategoryType) => void;
}

interface Engineer {
  id: number;
  full_name: string;
}

export const EditSubCategoryModal: React.FC<EditSubCategoryModalProps> = ({
  open,
  onOpenChange,
  subCategory,
  onUpdate,
}) => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedSubCategory, setLoadedSubCategory] = useState<SubCategoryType | null>(null);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
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

  const form = useForm<SubCategoryFormData>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      name: '',
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
    if (open) {
      dispatch(fetchHelpdeskCategories());
      dispatch(fetchBuildings());
      dispatch(fetchWings());
      dispatch(fetchFloors());
      dispatch(fetchZones());
      dispatch(fetchRooms());
      fetchEngineers();
      fetchSubCategoryDetails();
    }
  }, [open, dispatch, subCategory?.id]);

  useEffect(() => {
    if (subCategory && open && !loadedSubCategory) {
      // Reset state when opening modal with new subcategory
      setTags(['']);
      setSelectedEngineers([]);
      setSelectedBuildings([]);
      setSelectedWings([]);
      setSelectedZones([]);
      setSelectedFloors([]);
      setSelectedRooms([]);
      setIconFile(null);
    }
  }, [subCategory, open, loadedSubCategory]);

  const fetchEngineers = async () => {
    try {
      const engineersResponse = await ticketManagementAPI.getEngineers();
      const formattedEngineers = engineersResponse?.users?.map(user => ({
        id: user.id,
        full_name: user.full_name
      })) || [];
      setEngineers(formattedEngineers);
    } catch (error) {
      console.error('Error fetching engineers:', error);
      toast.error('Failed to fetch engineers');
    }
  };

  const fetchSubCategoryDetails = async () => {
    if (!subCategory?.id) return;
    
    try {
      setIsLoading(true);
      const response = await ticketManagementAPI.getSubCategories();
      const subCategories = response?.sub_categories || [];
      const foundSubCategory = subCategories.find((sub: SubCategoryType) => 
        sub.id.toString() === subCategory.id.toString()
      );
      
      if (foundSubCategory) {
        setLoadedSubCategory(foundSubCategory);
        
        // Update form with actual data
        form.reset({
          name: foundSubCategory.name,
          category: foundSubCategory.helpdesk_category_id.toString(),
          customerEnabled: foundSubCategory.customer_enabled || false,
          building: foundSubCategory.location_config?.building_enabled || false,
          wing: foundSubCategory.location_config?.wing_enabled || false,
          floor: foundSubCategory.location_config?.floor_enabled || false,
          zone: foundSubCategory.location_config?.zone_enabled || false,
          room: foundSubCategory.location_config?.room_enabled || false,
        });

        // Set selected engineers
        if (foundSubCategory.complaint_worker?.assign_to) {
          const engineerIds = foundSubCategory.complaint_worker.assign_to.map(id => parseInt(id));
          setSelectedEngineers(engineerIds);
        }

        // Set selected locations
        if (foundSubCategory.location_config?.building_ids) {
          setSelectedBuildings(foundSubCategory.location_config.building_ids.map(id => parseInt(id)));
        }
        if (foundSubCategory.location_config?.wing_ids) {
          setSelectedWings(foundSubCategory.location_config.wing_ids.map(id => parseInt(id)));
        }
        if (foundSubCategory.location_config?.floor_ids) {
          setSelectedFloors(foundSubCategory.location_config.floor_ids.map(id => parseInt(id)));
        }
        if (foundSubCategory.location_config?.zone_ids) {
          setSelectedZones(foundSubCategory.location_config.zone_ids.map(id => parseInt(id)));
        }
        if (foundSubCategory.location_config?.room_ids) {
          setSelectedRooms(foundSubCategory.location_config.room_ids.map(id => parseInt(id)));
        }
      }
    } catch (error) {
      console.error('Error fetching sub-category details:', error);
      toast.error('Failed to load sub-category details');
    } finally {
      setIsLoading(false);
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

  const handleUpdateSubmit = async () => {
    // Check for required fields with specific messages like SubCategoryTab
    if (!form.getValues('category')) {
      toast.error('Please select a category');
      return;
    }
    
    if (!form.getValues('name')?.trim()) {
      toast.error('Please enter subcategory name');
      return;
    }
    
    if (selectedEngineers.length === 0) {
      toast.error('Please assign at least one engineer');
      return;
    }

    // Get the form data
    const data: SubCategoryFormData = {
      category: form.getValues('category'),
      name: form.getValues('name'),
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
    const currentSubCategory = loadedSubCategory || subCategory;
    if (!currentSubCategory) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Required fields according to API specification
      formData.append('helpdesk_category_id', data.category);
      formData.append('name', data.name);
      formData.append('helpdesk_sub_category[customer_enabled]', data.customerEnabled ? '1' : '0');
      
      // Location enabled flags
      formData.append('location_enabled[building]', data.building.toString());
      formData.append('location_enabled[wing]', data.wing.toString());
      formData.append('location_enabled[floor]', data.floor.toString());
      formData.append('location_enabled[zone]', data.zone.toString());
      formData.append('location_enabled[room]', data.room.toString());
      
      // Location data arrays
      if (data.building && selectedBuildings.length > 0) {
        selectedBuildings.forEach(id => {
          formData.append('location_data[building_ids][]', id.toString());
        });
      }
      
      if (data.wing && selectedWings.length > 0) {
        selectedWings.forEach(id => {
          formData.append('location_data[wing_ids][]', id.toString());
        });
      }
      
      if (data.floor && selectedFloors.length > 0) {
        selectedFloors.forEach(id => {
          formData.append('location_data[floor_ids][]', id.toString());
        });
      }
      
      if (data.zone && selectedZones.length > 0) {
        selectedZones.forEach(id => {
          formData.append('location_data[zone_ids][]', id.toString());
        });
      }
      
      if (data.room && selectedRooms.length > 0) {
        selectedRooms.forEach(id => {
          formData.append('location_data[room_ids][]', id.toString());
        });
      }
      
      // Icon file if provided
      if (iconFile) {
        formData.append('helpdesk_sub_category[icon]', iconFile);
      }
      
      // Engineer assignments
      if (selectedEngineers.length > 0) {
        selectedEngineers.forEach(id => {
          formData.append('complaint_worker[assign_to][]', id.toString());
        });
      }

      console.log('Submitting sub-category update:', {
        id: currentSubCategory.id,
        formData: Object.fromEntries(formData.entries())
      });

      // Call the API to update the subcategory
      await ticketManagementAPI.updateSubCategory(currentSubCategory.id, formData);
      
      const updatedSubCategory: SubCategoryType = {
        ...currentSubCategory,
        name: data.name,
        customer_enabled: data.customerEnabled,
        location_config: {
          ...currentSubCategory.location_config,
          building_enabled: data.building,
          wing_enabled: data.wing,
          floor_enabled: data.floor,
          zone_enabled: data.zone,
          room_enabled: data.room,
          building_ids: data.building ? selectedBuildings.map(id => id.toString()) : [],
          wing_ids: data.wing ? selectedWings.map(id => id.toString()) : [],
          zone_ids: data.zone ? selectedZones.map(id => id.toString()) : [],
          floor_ids: data.floor ? selectedFloors.map(id => id.toString()) : [],
          room_ids: data.room ? selectedRooms.map(id => id.toString()) : [],
        },
      };

      onUpdate(updatedSubCategory);
      toast.success('Sub-category updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update sub-category');
      console.error('Error updating sub-category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sub-Category</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading sub-category details...</div>
          </div>
        ) : (
          <Form {...form}>
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCategories.length === 0 ? (
                          <SelectItem value="no-categories" disabled>
                            {categoriesLoading ? "Loading categories..." : "No categories available"}
                          </SelectItem>
                        ) : (
                          availableCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
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
                  <label htmlFor="edit-subcategory-icon-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Icon
                      </span>
                    </Button>
                  </label>
                  <input
                    id="edit-subcategory-icon-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleIconChange}
                  />
                  {iconFile ? (
                    <span className="text-sm text-gray-600">{iconFile.name}</span>
                  ) : loadedSubCategory?.icon_url ? (
                    <span className="text-sm text-gray-600">Current icon uploaded</span>
                  ) : (
                    <span className="text-sm text-gray-400">No icon</span>
                  )}
                </div>
                
                {loadedSubCategory?.icon_url && !iconFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Current Icon:</p>
                    <img 
                      src={loadedSubCategory.icon_url} 
                      alt="Current Icon" 
                      className="w-12 h-12 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
               
                {iconFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">New Icon Preview:</p>
                    <img 
                      src={URL.createObjectURL(iconFile)} 
                      alt="New Icon Preview" 
                      className="w-12 h-12 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Subcategory Tags</h3>
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
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
            </div> */}

            {/* Subcategory Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory Name <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subcategory name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateSubmit}
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};