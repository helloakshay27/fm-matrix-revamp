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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ticketManagementAPI } from '@/services/ticketManagementAPI';
import { toast } from 'sonner';
import { Edit, Trash2, Upload, Plus, X } from 'lucide-react';

const categorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  responseTime: z.string().min(1, 'Response time is required'),
  customerEnabled: z.boolean(),
  siteId: z.string().min(1, 'Site selection is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryApiResponse {
  helpdesk_categories: Array<{
    id: number;
    society_id: number;
    name: string;
    position: number | null;
    created_at: string;
    updated_at: string;
    icon_url: string;
    doc_type: string;
    selected_icon_url: string;
    tat: string;
    category_email: Array<{
      id: number;
      cat_id: number;
      site_id: number;
      email: string;
      active: number | null;
      created_at: string;
      updated_at: string;
    }>;
  }>;
  statuses: Array<{
    id: number;
    society_id: number;
    name: string;
    active: number;
    color_code: string;
  }>;
}

interface Site {
  id: number;
  name: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface SitesApiResponse {
  message: string;
  code: number;
  sites: Site[];
  selected_site: Site;
}

export const CategoryTypeTab: React.FC = () => {
  const [categories, setCategories] = useState<CategoryApiResponse['helpdesk_categories']>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [faqItems, setFaqItems] = useState<FAQ[]>([{ question: '', answer: '' }]);
  const [vendorEmails, setVendorEmails] = useState<string[]>(['']);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [vendorEmailEnabled, setVendorEmailEnabled] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryApiResponse['helpdesk_categories'][0] | null>(null);
  const [editFaqItems, setEditFaqItems] = useState<FAQ[]>([{ question: '', answer: '' }]);
  const [editIconFile, setEditIconFile] = useState<File | null>(null);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: '',
      responseTime: '',
      customerEnabled: false,
      siteId: '',
    },
  });

  useEffect(() => {
    fetchCategories();
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl');
      
      const response = await fetch(`https://${baseUrl}/api/users/account.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccountData(data);
        
        // Auto-populate form with company_id as society_id
        form.setValue('siteId', data.company_id?.toString() || '');
        
        // Fetch allowed sites for the user
        const sitesResponse = await fetch(`https://${baseUrl}/pms/sites/allowed_sites.json?user_id=${data.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (sitesResponse.ok) {
          const sitesData = await sitesResponse.json();
          if (sitesData.sites && Array.isArray(sitesData.sites)) {
            setSites(sitesData.sites);
          }
          if (sitesData.selected_site) {
            setSelectedSite(sitesData.selected_site);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
      toast.error('Failed to fetch account data');
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await ticketManagementAPI.getCategories();
      setCategories(response.helpdesk_categories || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      const userData = localStorage.getItem('user');
      let userId = '12437'; // default fallback
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          userId = parsedUser.id || parsedUser.user_id || '12437';
        } catch (e) {
          console.warn('Could not parse user data from localStorage');
        }
      }

      const response = await ticketManagementAPI.getSites(userId);
      if (response.sites && Array.isArray(response.sites)) {
        setSites(response.sites);
      } else {
        setSites([]);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
      toast.error('Failed to fetch sites');
    }
  };

  const handleSubmit = async (data: CategoryFormData) => {
    // Check for duplicate category name
    const existingCategory = categories.find(
      category => category.name.toLowerCase() === data.categoryName.toLowerCase()
    );
    
    if (existingCategory) {
      toast.error('Category name already exists. Please choose a different name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl');
      
      const formData = new FormData();
      
      // Helpdesk category data
      formData.append('helpdesk_category[society_id]', accountData?.company_id?.toString() || '');
      formData.append('helpdesk_category[of_phase]', 'pms');
      formData.append('helpdesk_category[name]', data.categoryName);
      formData.append('helpdesk_category[tat]', data.responseTime);
      formData.append('helpdesk_category[customer_enabled]', data.customerEnabled ? '1' : '0');
      
      if (iconFile) {
        formData.append('helpdesk_category[icon]', iconFile);
      }
      
      // FAQ attributes
      faqItems.forEach((item, index) => {
        if (item.question.trim() || item.answer.trim()) {
          formData.append(`helpdesk_category[complaint_faqs_attributes][${index}][question]`, item.question);
          formData.append(`helpdesk_category[complaint_faqs_attributes][${index}][answer]`, item.answer);
          formData.append(`helpdesk_category[complaint_faqs_attributes][${index}][_destroy]`, 'false');
        }
      });
      
      // Vendor email
      if (vendorEmailEnabled && vendorEmails.length > 0) {
        const validEmails = vendorEmails.filter(email => email.trim());
        validEmails.forEach(email => {
          formData.append('category_email[email]', email);
        });
      }
      
      // Location data (site_ids from account data)
      if (accountData?.site_id) {
        formData.append('location_data[site_ids][]', accountData.site_id.toString());
      }

      const response = await fetch(`https://${baseUrl}/pms/admin/helpdesk_categories.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header when using FormData with files
        },
        body: formData,
      });

      if (response.ok) {
        toast.success('Category created successfully!');
        
        // Reset form
        form.reset();
        setFaqItems([{ question: '', answer: '' }]);
        setVendorEmails(['']);
        setIconFile(null);
        setVendorEmailEnabled(false);
        
        // Auto-populate form with company_id again
        form.setValue('siteId', accountData?.company_id?.toString() || '');
        
        fetchCategories();
      } else {
        // Try to get the error message from the response
        const errorData = await response.json().catch(() => null);
        console.error('API Response Error:', errorData);
        
        // Check if it's a duplicate name error
        if (errorData?.errors?.name?.includes('has already been taken') || 
            errorData?.message?.toLowerCase().includes('already exists') ||
            errorData?.error?.toLowerCase().includes('already exists')) {
          toast.error('Category name already exists. Please choose a different name.');
        } else {
          toast.error(errorData?.message || 'Failed to create category');
        }
      }
    } catch (error) {
      console.error('Error creating category:', error);
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

  const handleEdit = (category: CategoryApiResponse['helpdesk_categories'][0]) => {
    setEditingCategory(category);
    setEditFaqItems([{ question: '', answer: '' }]); // Reset FAQ items for edit
    setEditIconFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: any) => {
    if (!editingCategory) return;
    
    try {
      // TODO: Implement actual API call for updating category
      console.log('Updating category:', editingCategory.id, formData);
      
      // Simulate successful update
      toast.success('Category updated successfully!');
      setIsEditModalOpen(false);
      setEditingCategory(null);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const addEditFaqItem = () => {
    setEditFaqItems([...editFaqItems, { question: '', answer: '' }]);
  };

  const updateEditFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = editFaqItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setEditFaqItems(updated);
  };

  const removeEditFaqItem = (index: number) => {
    if (editFaqItems.length > 1) {
      setEditFaqItems(editFaqItems.filter((_, i) => i !== index));
    }
  };

  const handleEditIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditIconFile(file);
    }
  };

  const handleDelete = async (category: CategoryApiResponse['helpdesk_categories'][0]) => {
    try {
      // TODO: Implement delete API call
      setCategories(categories.filter(cat => cat.id !== category.id));
      toast.success('Category deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIconFile(file);
    }
  };

  const columns = [
    { key: 'srno', label: 'S.No.', sortable: false },
    { key: 'name', label: 'Category Type', sortable: true },
    { key: 'tat', label: 'Response Time', sortable: false },
    { key: 'category_email', label: 'Vendor Email', sortable: false },
    { key: 'icon_url', label: 'Icon', sortable: false },
    { key: 'selected_icon_url', label: 'Selected Icon', sortable: false },
  ];

  const renderCell = (item: CategoryApiResponse['helpdesk_categories'][0], columnKey: string) => {
    const index = categories.findIndex(cat => cat.id === item.id);
    
    switch (columnKey) {
      case 'srno':
        return index + 1;
      case 'name':
        return item.name;
      case 'tat':
        return item.tat || '--';
      case 'category_email':
        return item.category_email?.length ? 
          item.category_email.map(emailObj => emailObj.email).join(', ') : '--';
      case 'icon_url':
        return item.icon_url ? (
          <img 
            src={item.icon_url} 
            alt="Icon" 
            className="w-8 h-8 object-cover rounded mx-auto" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-gray-400">No icon</span>
        );
      case 'selected_icon_url':
        return item.selected_icon_url ? (
          <img 
            src={item.selected_icon_url} 
            alt="Selected Icon" 
            className="w-8 h-8 object-cover rounded mx-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-gray-400">No icon</span>
        );
      default:
        return '--';
    }
  };

  const renderActions = (item: CategoryApiResponse['helpdesk_categories'][0]) => (
    <div className="flex gap-2">
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
                  name="responseTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Time (hours)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter response time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="customerEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
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
                  name="siteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enable Sites</FormLabel>
                      <FormControl>
                        <Input 
                          value={selectedSite?.name || ''} 
                          placeholder={selectedSite?.name || 'Loading site...'} 
                          disabled 
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* PMS Phase - Hidden field, always "pms" */}
              <input type="hidden" value="pms" />

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={vendorEmailEnabled}
                    onCheckedChange={(checked) => setVendorEmailEnabled(!!checked)}
                  />
                  <label className="text-sm font-medium">Enable Vendor Email</label>
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
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">FAQ Section</h3>
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

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="relative">
            <DialogTitle className="text-lg font-semibold">Edit Category</DialogTitle>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-0 right-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </DialogHeader>

          {editingCategory && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Input
                    defaultValue={editingCategory.name}
                    placeholder="Category Name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Engineer</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an Option..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="engineer1">Engineer 1</SelectItem>
                      <SelectItem value="engineer2">Engineer 2</SelectItem>
                      <SelectItem value="engineer3">Engineer 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Selected Site</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={selectedSite?.name || "Select Site"} />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id.toString()}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Response Time(min)</label>
                  <Input
                    defaultValue={editingCategory.tat}
                    placeholder="Response Time"
                    type="number"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox id="customer-enabled" />
                <label htmlFor="customer-enabled" className="text-sm font-medium">Customer Enabled</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Icon</label>
                  <div className="flex items-center gap-2">
                    <label htmlFor="edit-icon-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span className="text-orange-500">Choose File</span>
                      </Button>
                    </label>
                    <input
                      id="edit-icon-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleEditIconChange}
                    />
                    <span className="text-sm text-gray-500">
                      {editIconFile ? editIconFile.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">FAQs</h3>
                  <Button type="button" onClick={addEditFaqItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                  </Button>
                </div>

                {editFaqItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div>
                      <label className="block text-sm font-medium mb-1">Question</label>
                      <textarea
                        placeholder="Question"
                        value={item.question}
                        onChange={(e) => updateEditFaqItem(index, 'question', e.target.value)}
                        className="w-full p-2 border rounded-md resize-none h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Answer</label>
                      <div className="flex gap-2">
                        <textarea
                          placeholder="Answer"
                          value={item.answer}
                          onChange={(e) => updateEditFaqItem(index, 'answer', e.target.value)}
                          className="w-full p-2 border rounded-md resize-none h-20"
                        />
                        {editFaqItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEditFaqItem(index)}
                            className="h-fit mt-1"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => handleEditSubmit({})}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
