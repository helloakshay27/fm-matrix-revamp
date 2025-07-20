
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
  firstname: string;
  lastname: string;
}

interface LocationOption {
  id: number;
  name: string;
}

export const SubCategoryTab: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [buildings, setBuildings] = useState<LocationOption[]>([]);
  const [wings, setWings] = useState<LocationOption[]>([]);
  const [zones, setZones] = useState<LocationOption[]>([]);
  const [floors, setFloors] = useState<LocationOption[]>([]);
  const [rooms, setRooms] = useState<LocationOption[]>([]);
  
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
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [categoriesData, engineersData, subCategoriesData, buildingsData, wingsData, zonesData, floorsData, roomsData] = await Promise.all([
        ticketManagementAPI.getCategories(),
        ticketManagementAPI.getEngineers(),
        ticketManagementAPI.getSubCategories(),
        ticketManagementAPI.getBuildings(),
        ticketManagementAPI.getWings(),
        ticketManagementAPI.getZones(),
        ticketManagementAPI.getFloors(),
        ticketManagementAPI.getRooms(),
      ]);

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setEngineers(Array.isArray(engineersData) ? engineersData : []);
      setSubCategories(Array.isArray(subCategoriesData) ? subCategoriesData : []);
      setBuildings(Array.isArray(buildingsData) ? buildingsData : []);
      setWings(Array.isArray(wingsData?.wings) ? wingsData.wings : []);
      setZones(Array.isArray(zonesData?.zones) ? zonesData.zones : []);
      setFloors(Array.isArray(floorsData?.floors) ? floorsData.floors : []);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: SubCategoryFormData) => {
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
      case 'room':
        const key = `${columnKey}_enabled` as keyof typeof item.location_config;
        return item.location_config?.[key] ? 'Yes' : 'No';
      case 'icon_url':
        return item.icon_url ? (
          <img src={item.icon_url} alt="Icon" className="w-8 h-8 object-cover rounded" />
        ) : (
          <span className="text-gray-400">No icon</span>
        );
      default:
        return item[columnKey as keyof SubCategoryType] || '--';
    }
  };

  const renderActions = (item: SubCategoryType) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => setEditingSubCategory(item)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const handleDelete = (subCategory: SubCategoryType) => {
    setSubCategories(subCategories.filter(sub => sub.id !== subCategory.id));
    toast.success('Sub-category deleted successfully!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Sub-Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {engineers.map((engineer) => (
                    <div key={engineer.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedEngineers.includes(engineer.id)}
                        onCheckedChange={() => 
                          handleMultiSelect(engineer.id.toString(), selectedEngineers, setSelectedEngineers)
                        }
                      />
                      <label className="text-sm">
                        {engineer.firstname} {engineer.lastname}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location Configuration</h3>
                
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

                {/* Location Multi-selects */}
                {form.watch('building') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Buildings</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                      {buildings.map((building) => (
                        <div key={building.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedBuildings.includes(building.id)}
                            onCheckedChange={() => 
                              handleMultiSelect(building.id.toString(), selectedBuildings, setSelectedBuildings)
                            }
                          />
                          <label className="text-sm">{building.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar sections for wing, zone, floor, room */}
                {form.watch('wing') && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Wings</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                      {wings.map((wing) => (
                        <div key={wing.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedWings.includes(wing.id)}
                            onCheckedChange={() => 
                              handleMultiSelect(wing.id.toString(), selectedWings, setSelectedWings)
                            }
                          />
                          <label className="text-sm">{wing.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </form>
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
