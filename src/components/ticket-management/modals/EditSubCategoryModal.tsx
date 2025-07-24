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

interface EditSubCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCategory: SubCategoryType | null;
  onUpdate: (subCategory: SubCategoryType) => void;
}

interface Engineer {
  id: number;
  firstname: string;
  lastname: string;
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
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (subCategory && open) {
      form.reset({
        category: subCategory.helpdesk_category_name,
        customerEnabled: subCategory.customer_enabled || false,
        building: subCategory.location_config?.building_enabled || false,
        wing: subCategory.location_config?.wing_enabled || false,
        floor: subCategory.location_config?.floor_enabled || false,
        zone: subCategory.location_config?.zone_enabled || false,
        room: subCategory.location_config?.room_enabled || false,
      });
      
      // Reset other state
      setTags(['']);
      setSelectedEngineers([]);
      setSelectedBuildings([]);
      setSelectedWings([]);
      setSelectedZones([]);
      setSelectedFloors([]);
      setSelectedRooms([]);
      setIconFile(null);
    }
  }, [subCategory, open, form]);

  const fetchEngineers = async () => {
    try {
      const engineersResponse = await ticketManagementAPI.getEngineers();
      const formattedEngineers = engineersResponse?.fm_users?.map(user => ({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname
      })) || [];
      setEngineers(formattedEngineers);
    } catch (error) {
      console.error('Error fetching engineers:', error);
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

  const handleSubmit = async (data: SubCategoryFormData) => {
    if (!subCategory) return;

    setIsSubmitting(true);
    try {
      const subCategoryData = {
        helpdesk_category_id: parseInt(data.category),
        customer_enabled: data.customerEnabled,
        icon: iconFile,
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

      // Here you would call your API to update the subcategory
      // await ticketManagementAPI.updateSubCategory(subCategory.id, subCategoryData);
      
      const updatedSubCategory: SubCategoryType = {
        ...subCategory,
        customer_enabled: data.customerEnabled,
        location_config: {
          building_enabled: data.building,
          wing_enabled: data.wing,
          floor_enabled: data.floor,
          zone_enabled: data.zone,
          room_enabled: data.room,
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
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
                  {iconFile && (
                    <span className="text-sm text-gray-600">{iconFile.name}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-4">
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
            </div>

            {/* Engineer Assignment */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Engineer Assignment</h3>
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    selectedEngineers.length === 0 
                      ? "Select engineers" 
                      : `${selectedEngineers.length} engineer(s) selected`
                  } />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map((engineer) => (
                    <SelectItem key={engineer.id} value={engineer.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{engineer.firstname} {engineer.lastname}</span>
                        {selectedEngineers.includes(engineer.id) && (
                          <span className="ml-2 text-primary">✓</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Show selected engineers */}
              {selectedEngineers.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedEngineers.map((engineerId) => {
                    const engineer = engineers.find(e => e.id === engineerId);
                    return engineer ? (
                      <div key={engineerId} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                        {engineer.firstname} {engineer.lastname}
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

                <FormField
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
                />
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};