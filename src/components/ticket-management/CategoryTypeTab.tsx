
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

const mockCategories: CategoryType[] = [
  {
    id: '1',
    srNo: 1,
    categoryType: 'Electrical',
    assignee: 'John Doe',
    responseTime: 24,
    vendorEmail: true,
    icon: 'electrical.png',
    selectedIcon: 'electrical-selected.png',
  },
  {
    id: '2',
    srNo: 2,
    categoryType: 'Plumbing',
    assignee: 'Jane Smith',
    responseTime: 12,
    vendorEmail: false,
    icon: 'plumbing.png',
    selectedIcon: 'plumbing-selected.png',
  },
];

const engineers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];

export const CategoryTypeTab: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>(mockCategories);
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

  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Category Data:', data);
      console.log('FAQ Items:', faqItems);
      toast.success('Category created successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to create category');
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

  const columns = [
    { key: 'srNo', label: 'S.No', sortable: true },
    { key: 'categoryType', label: 'Category Type', sortable: true },
    { key: 'assignee', label: 'Assignee', sortable: true },
    { key: 'responseTime', label: 'Response Time (hrs)', sortable: true },
    { key: 'vendorEmail', label: 'Vendor Email', sortable: true },
    { key: 'icon', label: 'Icon', sortable: false },
    { key: 'selectedIcon', label: 'Selected Icon', sortable: false },
  ];

  const renderCell = (item: CategoryType, columnKey: string) => {
    switch (columnKey) {
      case 'vendorEmail':
        return item.vendorEmail ? 'Yes' : 'No';
      case 'icon':
      case 'selectedIcon':
        return <span className="text-blue-600">{item[columnKey as keyof CategoryType]}</span>;
      default:
        return item[columnKey as keyof CategoryType];
    }
  };

  const renderActions = (item: CategoryType) => (
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
          <CardTitle>Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          <CardTitle>Category Types</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedTable
            data={categories}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="category-types-table"
          />
        </CardContent>
      </Card>
    </div>
  );
};
