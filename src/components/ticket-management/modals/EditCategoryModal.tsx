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
import { Upload, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  engineer: z.string().min(1, 'Engineer selection is required'),
  responseTime: z.number().min(1, 'Response time must be positive'),
  customerEnabled: z.boolean(),
  vendorEmail: z.boolean(),
  enableSites: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryType {
  id: string;
  srNo: number;
  categoryType: string;
  assignee: string;
  responseTime: number;
  vendorEmail: boolean;
  icon: string;
  selectedIcon: string;
}

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryType | null;
  onUpdate: (category: CategoryType) => void;
}

const engineers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  open,
  onOpenChange,
  category,
  onUpdate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faqItems, setFaqItems] = useState([{ question: '', answer: '' }]);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: '',
      engineer: '',
      responseTime: 1,
      customerEnabled: false,
      vendorEmail: false,
      enableSites: false,
    },
  });

  useEffect(() => {
    if (category && open) {
      form.reset({
        categoryName: category.categoryType,
        engineer: category.assignee,
        responseTime: category.responseTime,
        customerEnabled: false, // These values aren't in the current interface
        vendorEmail: category.vendorEmail,
        enableSites: false,
      });
    }
  }, [category, open, form]);

  const handleSubmit = async (data: CategoryFormData) => {
    if (!category) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCategory: CategoryType = {
        ...category,
        categoryType: data.categoryName,
        assignee: data.engineer,
        responseTime: data.responseTime,
        vendorEmail: data.vendorEmail,
      };

      onUpdate(updatedCategory);
      toast.success('Category updated successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addFaqItem = () => {
    setFaqItems([...faqItems, { question: '', answer: '' }]);
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = faqItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFaqItems(updated);
  };

  const removeFaqItem = (index: number) => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engineer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select engineer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {engineers.map((engineer) => (
                          <SelectItem key={engineer} value={engineer}>
                            {engineer}
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
                name="responseTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Response Time (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter response time"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Icon
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="enableSites"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Enable Sites</FormLabel>
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

              <FormField
                control={form.control}
                name="vendorEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Vendor Email</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">FAQ</h3>
                <Button type="button" onClick={addFaqItem} variant="outline" size="sm">
                  Add FAQ
                </Button>
              </div>

              {faqItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-1">Question</label>
                    <Input
                      placeholder="Enter question"
                      value={item.question}
                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Answer</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter answer"
                        value={item.answer}
                        onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      />
                      {faqItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFaqItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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