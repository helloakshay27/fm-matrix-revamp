import React, { useState, useEffect, useMemo } from 'react';
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
import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';
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
    complaint_faqs?: Array<{
      id: number;
      helpdesk_category_id: number;
      question: string;
      answer: string;
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
  id?: number;
  helpdesk_category_id?: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
  _destroy?: boolean;
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
  const [editVendorEmailEnabled, setEditVendorEmailEnabled] = useState(false);
  const [editVendorEmails, setEditVendorEmails] = useState<string[]>(['']);
  const [editSelectedSiteId, setEditSelectedSiteId] = useState<string>('');

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
      const response = await fetch(getFullUrl('/api/users/account.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccountData(data);
        
        // Auto-populate form with company_id as society_id
        form.setValue('siteId', data.company_id?.toString() || '');
        
        // Fetch allowed sites for the user
        const sitesResponse = await fetch(getFullUrl(`/pms/sites/allowed_sites.json?user_id=${data.id}`), {
          headers: {
            'Authorization': getAuthHeader(),
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

    // Validate vendor emails if enabled
    if (vendorEmailEnabled) {
      const invalidEmails = vendorEmails.filter(email => email.trim() && !isValidEmail(email));
      if (invalidEmails.length > 0) {
        toast.error('Please enter valid email addresses for all vendor emails.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
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

      const response = await fetch(getFullUrl('/pms/admin/helpdesk_categories.json'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
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

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleVendorEmailChange = (index: number, value: string) => {
    // Allow typing but show validation state
    updateVendorEmail(index, value);
  };

  const removeVendorEmail = (index: number) => {
    if (vendorEmails.length > 1) {
      setVendorEmails(vendorEmails.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (category: CategoryApiResponse['helpdesk_categories'][0]) => {
    setEditingCategory(category);
    
    // Populate FAQ items if available, otherwise default empty FAQ
    if (category.complaint_faqs && category.complaint_faqs.length > 0) {
      setEditFaqItems(category.complaint_faqs.map(faq => ({
        id: faq.id,
        question: faq.question || '',
        answer: faq.answer || ''
      })));
    } else {
      setEditFaqItems([{ question: '', answer: '' }]);
    }
    
    setEditIconFile(null);
    setEditVendorEmailEnabled(category.category_email?.length > 0);
    setEditVendorEmails(category.category_email?.length > 0 ? category.category_email.map(e => e.email) : ['']);
    
    // Set the selected site ID (default to the current selected site or first available site)
    setEditSelectedSiteId(selectedSite?.id.toString() || sites[0]?.id.toString() || '');
    
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: any) => {
    if (!editingCategory) return;
    
    // Validate vendor emails if enabled
    if (editVendorEmailEnabled) {
      const invalidEmails = editVendorEmails.filter(email => email.trim() && !isValidEmail(email));
      if (invalidEmails.length > 0) {
        toast.error('Please enter valid email addresses for all vendor emails.');
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      const submitFormData = new FormData();
      
      // Get form values from the edit modal inputs
      const categoryNameInput = document.querySelector('#edit-category-name') as HTMLInputElement;
      const responseTimeInput = document.querySelector('#edit-response-time') as HTMLInputElement;
      const customerEnabledInput = document.querySelector('#edit-customer-enabled') as HTMLInputElement;
      
      // Helpdesk category data
      submitFormData.append('helpdesk_category[name]', categoryNameInput?.value || editingCategory.name);
      submitFormData.append('helpdesk_category[customer_enabled]', customerEnabledInput?.checked ? '1' : '0');
      submitFormData.append('helpdesk_category[tat]', responseTimeInput?.value || editingCategory.tat);
      
      // Add icon if a new one is selected
      if (editIconFile) {
        submitFormData.append('helpdesk_category[icon]', editIconFile);
      }
      
      // FAQ attributes
      editFaqItems.forEach((item, index) => {
        // Include all FAQs (both existing and new) in the submission
        submitFormData.append(`helpdesk_category[complaint_faqs_attributes][${index}][question]`, item.question);
        submitFormData.append(`helpdesk_category[complaint_faqs_attributes][${index}][answer]`, item.answer);
        submitFormData.append(`helpdesk_category[complaint_faqs_attributes][${index}][_destroy]`, item._destroy ? 'true' : 'false');
        
        // Add existing FAQ id if available
        if (item.id) {
          submitFormData.append(`helpdesk_category[complaint_faqs_attributes][${index}][id]`, item.id.toString());
        }
      });
      
      // Vendor email
      if (editVendorEmailEnabled && editVendorEmails.length > 0) {
        const validEmails = editVendorEmails.filter(email => email.trim());
        validEmails.forEach(email => {
          submitFormData.append('category_email[email]', email);
        });
      }
      
      // Location data (only the selected site)
      if (editSelectedSiteId) {
        submitFormData.append('location_data[site_ids][]', editSelectedSiteId);
      }
      
      // Add category ID
      submitFormData.append('id', editingCategory.id.toString());

      const response = await fetch(getFullUrl(`/pms/admin/modify_helpdesk_category/${editingCategory.id}.json`), {
        method: 'PATCH',
        headers: {
          'Authorization': getAuthHeader(),
          // Don't set Content-Type header when using FormData
        },
        body: submitFormData,
      });

      if (response.ok) {
        toast.success('Category updated successfully!');
        setIsEditModalOpen(false);
        setEditingCategory(null);
        fetchCategories(); // Refresh the list
      } else {
        const errorData = await response.json().catch(() => null);
        console.error('API Response Error:', errorData);
        toast.error(errorData?.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setIsSubmitting(false);
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
    const faqToRemove = editFaqItems[index];
    
    // If the FAQ has an ID (existing FAQ), mark it for destruction
    if (faqToRemove.id) {
      const updated = editFaqItems.map((item, i) => 
        i === index ? { ...item, _destroy: true } : item
      );
      setEditFaqItems(updated);
    } else {
      // If it's a new FAQ (no ID), just remove it from the array
      if (editFaqItems.length > 1) {
        setEditFaqItems(editFaqItems.filter((_, i) => i !== index));
      }
    }
  };

  const handleEditIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditIconFile(file);
    }
  };

  const addEditVendorEmail = () => {
    setEditVendorEmails([...editVendorEmails, '']);
  };

  const updateEditVendorEmail = (index: number, value: string) => {
    const updated = editVendorEmails.map((email, i) => 
      i === index ? value : email
    );
    setEditVendorEmails(updated);
  };

  const handleEditVendorEmailChange = (index: number, value: string) => {
    // Allow typing but show validation state
    updateEditVendorEmail(index, value);
  };

  const removeEditVendorEmail = (index: number) => {
    if (editVendorEmails.length > 1) {
      setEditVendorEmails(editVendorEmails.filter((_, i) => i !== index));
    }
  };

  const handleDelete = async (category: CategoryApiResponse['helpdesk_categories'][0]) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      const response = await fetch(getFullUrl(`/pms/admin/helpdesk_categories/${category.id}.json`), {
        method: 'PATCH',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          helpdesk_category: {
            active: "0"
          },
          id: category.id.toString()
        }),
      });

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== category.id));
        toast.success('Category deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(errorData?.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Transform categories data to include searchable email string
  const transformedCategories = useMemo(() => {
    return categories.map(category => ({
      ...category,
      searchable_emails: category.category_email?.length 
        ? category.category_email.map(emailObj => emailObj.email).join(', ')
        : ''
    }));
  }, [categories]);

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
    // { key: 'selected_icon_url', label: 'Selected Icon', sortable: false },
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

                {/* <FormField
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
                /> */}

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
                        <div className="flex-1">
                          <Input
                            type="email"
                            placeholder="Enter vendor email"
                            value={email}
                            onChange={(e) => handleVendorEmailChange(index, e.target.value)}
                            className={`${
                              email && !isValidEmail(email) 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                : ''
                            }`}
                          />
                          {email && !isValidEmail(email) && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                          )}
                        </div>
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
              data={transformedCategories}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              storageKey="category-types-table"
              enableSearch={true}
              searchPlaceholder="Search categories..."
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
                    id="edit-category-name"
                    defaultValue={editingCategory.name}
                    placeholder="Category Name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Selected Site</label>
                  <Select value={editSelectedSiteId} onValueChange={setEditSelectedSiteId}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Site" />
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
                    id="edit-response-time"
                    defaultValue={editingCategory.tat}
                    placeholder="Response Time"
                    type="number"
                    className="w-full"
                  />
                </div>
              </div>

              {/* <div className="flex items-center space-x-3">
                <Checkbox id="edit-customer-enabled" />
                <label htmlFor="edit-customer-enabled" className="text-sm font-medium">Customer Enabled</label>
              </div> */}

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="vendor-email-enabled"
                    checked={editVendorEmailEnabled}
                    onCheckedChange={(checked) => setEditVendorEmailEnabled(!!checked)}
                  />
                  <label htmlFor="vendor-email-enabled" className="text-sm font-medium">Enable Vendor Email</label>
                </div>

                {editVendorEmailEnabled && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Vendor Emails</h3>
                      <Button type="button" onClick={addEditVendorEmail} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Email
                      </Button>
                    </div>

                    {editVendorEmails.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="email"
                            placeholder="Enter vendor email"
                            value={email}
                            onChange={(e) => handleEditVendorEmailChange(index, e.target.value)}
                            className={`${
                              email && !isValidEmail(email) 
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                : ''
                            }`}
                          />
                          {email && !isValidEmail(email) && (
                            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                          )}
                        </div>
                        {editVendorEmails.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeEditVendorEmail(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
                  {/* Display current icon if available */}
                  {editingCategory.icon_url && !editIconFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Current Icon:</p>
                      <img 
                        src={editingCategory.icon_url} 
                        alt="Current Icon" 
                        className="w-12 h-12 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {/* Preview new icon if selected */}
                  {editIconFile && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">New Icon Preview:</p>
                      <img 
                        src={URL.createObjectURL(editIconFile)} 
                        alt="New Icon Preview" 
                        className="w-12 h-12 object-cover rounded border"
                      />
                    </div>
                  )}
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
                  !item._destroy && (
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
                          {(editFaqItems.filter(faq => !faq._destroy).length > 1 || !item.id) && (
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
                  )
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => handleEditSubmit({})}
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  {isSubmitting ? 'Updating...' : 'Submit'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
