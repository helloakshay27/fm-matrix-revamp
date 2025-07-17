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
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

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

interface EditSubCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCategory: SubCategoryType | null;
  onUpdate: (subCategory: SubCategoryType) => void;
}

const categories = ['Electrical', 'Plumbing', 'HVAC', 'Security', 'Cleaning'];

export const EditSubCategoryModal: React.FC<EditSubCategoryModalProps> = ({
  open,
  onOpenChange,
  subCategory,
  onUpdate,
}) => {
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

  useEffect(() => {
    if (subCategory && open) {
      form.reset({
        category: subCategory.category,
        subCategory: subCategory.subCategory,
        building: subCategory.building,
        wing: subCategory.wing,
        floor: subCategory.floor,
        zone: subCategory.zone,
        room: subCategory.room,
        customerEnabled: subCategory.customerEnabled,
      });
    }
  }, [subCategory, open, form]);

  const handleSubmit = async (data: SubCategoryFormData) => {
    if (!subCategory) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSubCategory: SubCategoryType = {
        ...subCategory,
        category: data.category,
        subCategory: data.subCategory,
        building: data.building,
        wing: data.wing,
        floor: data.floor,
        zone: data.zone,
        room: data.room,
        customerEnabled: data.customerEnabled,
      };

      onUpdate(updatedSubCategory);
      toast.success('Sub-category updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update sub-category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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