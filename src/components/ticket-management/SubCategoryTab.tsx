
import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { Edit, Trash2, Upload } from 'lucide-react';

const subCategorySchema = z.object({
  category: z.string().min(1, 'Category selection is required'),
  subCategory: z.string().min(1, 'Sub-category name is required'),
  building: z.boolean(),
  wing: z.boolean(),
  floor: z.boolean(),
  zone: z.boolean(),
  room: z.boolean(),
  customerEnabled: z.boolean(),
});

type SubCategoryFormData = z.infer<typeof subCategorySchema>;

interface SubCategoryType {
  id: string;
  srNo: number;
  category: string;
  subCategory: string;
  building: boolean;
  wing: boolean;
  floor: boolean;
  zone: boolean;
  room: boolean;
  customerEnabled: boolean;
}

const mockSubCategories: SubCategoryType[] = [
  {
    id: '1',
    srNo: 1,
    category: 'Electrical',
    subCategory: 'Light Repair',
    building: true,
    wing: true,
    floor: true,
    zone: false,
    room: true,
    customerEnabled: true,
  },
  {
    id: '2',
    srNo: 2,
    category: 'Plumbing',
    subCategory: 'Pipe Leak',
    building: true,
    wing: false,
    floor: true,
    zone: true,
    room: true,
    customerEnabled: false,
  },
];

const categories = ['Electrical', 'Plumbing', 'HVAC', 'Security', 'Cleaning'];

export const SubCategoryTab: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategoryType[]>(mockSubCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubCategoryFormData>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      category: '',
      subCategory: '',
      building: false,
      wing: false,
      floor: false,
      zone: false,
      room: false,
      customerEnabled: false,
    },
  });

  const handleSubmit = async (data: SubCategoryFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sub-Category Data:', data);
      toast.success('Sub-category created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to create sub-category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: 'srNo', label: 'S.No', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'subCategory', label: 'Sub Category', sortable: true },
    { key: 'building', label: 'Building', sortable: true },
    { key: 'wing', label: 'Wing', sortable: true },
    { key: 'floor', label: 'Floor', sortable: true },
    { key: 'zone', label: 'Zone', sortable: true },
    { key: 'room', label: 'Room', sortable: true },
    { key: 'customerEnabled', label: 'Customer Enabled', sortable: true },
  ];

  const renderCell = (item: SubCategoryType, columnKey: string) => {
    if (['building', 'wing', 'floor', 'zone', 'room', 'customerEnabled'].includes(columnKey)) {
      return item[columnKey as keyof SubCategoryType] ? 'Yes' : 'No';
    }
    return item[columnKey as keyof SubCategoryType];
  };

  const renderActions = (item: SubCategoryType) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

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
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Category</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter sub-category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>

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
          <EnhancedTable
            data={subCategories}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="sub-categories-table"
          />
        </CardContent>
      </Card>
    </div>
  );
};
