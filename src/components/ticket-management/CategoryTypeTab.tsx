
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
import { EditCategoryModal } from './modals/EditCategoryModal';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import { Edit, Trash2, Upload, Plus, X } from 'lucide-react';

const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  responseTime: z.string().min(1, 'Response time is required'),
  customerEnabled: z.boolean(),
  enableSites: z.boolean(),
  vendorEmailEnabled: z.boolean(),
  siteId: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryType {
  id: number;
  society_id: number;
  name: string;
  position: number | null;
  created_at: string;
  updated_at: string;
  icon_url: string;
  doc_type: string | null;
  selected_icon_url: string;
}

interface Site {
  id: number;
  name: string;
}

export const CategoryTypeTab: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [faqItems, setFaqItems] = useState([{ question: '', answer: '' }]);
  const [vendorEmails, setVendorEmails] = useState(['']);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: '',
      responseTime: '',
      customerEnabled: false,
      enableSites: false,
      vendorEmailEnabled: false,
      siteId: '',
    },
  });

  const vendorEmailEnabled = form.watch('vendorEmailEnabled');

  useEffect(() => {
    fetchCategories();
    fetchSites();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await ticketManagementAPI.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      // Using a default user ID - this should be dynamic based on current user
      const data = await ticketManagementAPI.getSites('12437');
      setSites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const categoryData = {
        name: data.categoryName,
        tat: data.responseTime,
        customer_enabled: data.customerEnabled,
        society_id: data.siteId || '15', // Default society ID
        icon: iconFile,
        complaint_faqs_attributes: faqItems
          .filter(item => item.question.trim() && item.answer.trim())
          .map(item => ({
            question: item.question,
            answer: item.answer,
            _destroy: false,
          })),
      };

      const emailData = {
        email: vendorEmailEnabled ? vendorEmails.filter(email => email.trim()) : [],
      };

      await ticketManagementAPI.createCategory(categoryData, emailData);
      toast.success('Category created successfully!');
      form.reset();
      setFaqItems([{ question: '', answer: '' }]);
      setVendorEmails(['']);
      setIconFile(null);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to create category');
      console.error('Error creating category:', error);
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
    if (faqItems.length > 1) {
      setFaqItems(faqItems.filter((_, i) => i !== index));
    }
  };

  const addVendorEmail = () => {
    setVendorEmails([...vendorEmails, '']);
  };

  const updateVendorEmail = (index: number, value: string) => {
    const updated = vendorEmails.map((email, i) => 
      i === index ? value : email
    );
    setVendorEmails(updated);
  };

  const removeVendorEmail = (index: number) => {
    if (vendorEmails.length > 1) {
      setVendorEmails(vendorEmails.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (category: CategoryType) => {
    setEditingCategory(category);
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedCategory: CategoryType) => {
    setCategories(categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
  };

  const handleDelete = (category: CategoryType) => {
    setCategories(categories.filter(cat => cat.id !== category.id));
    toast.success('Category deleted successfully!');
  };

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIconFile(file);
    }
  };

  const columns = [
    { key: 'id', label: 'S.No', sortable: true },
    { key: 'name', label: 'Category Type', sortable: true },
    { key: 'position', label: 'Response Time (hrs)', sortable: true },
    { key: 'vendorEmail', label: 'Vendor Email', sortable: false },
    { key: 'icon_url', label: 'Icon', sortable: false },
    { key: 'selected_icon_url', label: 'Selected Icon', sortable: false },
  ];

  const renderCell = (item: CategoryType, columnKey: string) => {
    switch (columnKey) {
      case 'vendorEmail':
        return '--'; // Not available in API response
      case 'icon_url':
        return item.icon_url ? (
          <img src={item.icon_url} alt="Icon" className="w-8 h-8 object-cover rounded" />
        ) : (
          <span className="text-gray-400">No icon</span>
        );
      case 'selected_icon_url':
        return item.selected_icon_url ? (
          <img src={item.selected_icon_url} alt="Selected Icon" className="w-8 h-8 object-cover rounded" />
        ) : (
          <span className="text-gray-400">No icon</span>
        );
      case 'position':
        return item.position || '--';
      default:
        return item[columnKey as keyof CategoryType];
    }
  };

  const renderActions = (item: CategoryType) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
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
                  name="responseTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Time (hours)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter response time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {form.watch('enableSites') && (
                  <FormField
                    control={form.control}
                    name="siteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Site</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select site" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sites.map((site) => (
                              <SelectItem key={site.id} value={site.id.toString()}>
                                {site.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex items-center gap-2">
                  <label htmlFor="icon-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Icon
                      </span>
                    </Button>
                  </label>
                  <input
                    id="icon-upload"
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

              <div className="flex flex-wrap gap-4">
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
                  name="vendorEmailEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Enable Vendor Email</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {vendorEmailEnabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Vendor Emails</h3>
                    <Button type="button" onClick={addVendorEmail} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Email
                    </Button>
                  </div>

                  {vendorEmails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter vendor email"
                        value={email}
                        onChange={(e) => updateVendorEmail(index, e.target.value)}
                      />
                      {vendorEmails.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVendorEmail(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">FAQ</h3>
                  <Button type="button" onClick={addFaqItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
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
                            <X className="h-4 w-4" />
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading categories...</div>
            </div>
          ) : (
            <EnhancedTable
              data={categories}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              storageKey="category-types-table"
            />
          )}
        </CardContent>
      </Card>

      <EditCategoryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        category={editingCategory}
        onUpdate={handleUpdate}
      />
    </div>
  );
};
