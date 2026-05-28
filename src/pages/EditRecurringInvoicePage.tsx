import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, X, Plus, FileText, File, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Autocomplete,
  InputAdornment,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import axios from 'axios';
import { Calendar, Clock, DollarSign } from 'lucide-react';

interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  tax_percentage?: number;
  tax_amount?: number;
}

interface RecurringInvoiceData {
  id: number;
  invoice_name: string;
  customer_id?: number;
  customer_name: string;
  start_date: string;
  end_date?: string;
  recurrence_type: 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';
  recurrence_day?: number;
  due_days: number;
  status: string;
  total_amount: number;
  tax_amount: number;
  total_with_tax: number;
  notes?: string;
  terms?: string;
  line_items?: LineItem[];
  is_active: boolean;
  attachments?: Array<{ id: number; url: string; name: string }>;
}

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = 
  ({ title, icon, children }) => (
    <section className="bg-card rounded-lg border border-border shadow-sm mb-6">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );

export const EditRecurringInvoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recurringInvoice, setRecurringInvoice] = useState<RecurringInvoiceData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const [formData, setFormData] = useState({
    invoice_name: '',
    customer_id: '',
    customer_name: '',
    start_date: '',
    end_date: '',
    recurrence_type: 'MONTHLY' as const,
    recurrence_day: 1,
    due_days: 30,
    status: 'ACTIVE',
    is_active: true,
    notes: '',
    terms: '',
    line_items: [] as LineItem[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Array<{ id: number; url: string; name: string }>>([]);

  // Fetch recurring invoice details
  useEffect(() => {
    const fetchRecurringInvoice = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/api/recurring-invoices/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data.data || response.data;
        setRecurringInvoice(data);
        setFormData({
          invoice_name: data.invoice_name || '',
          customer_id: data.customer_id?.toString() || '',
          customer_name: data.customer_name || '',
          start_date: data.start_date?.split('T')[0] || '',
          end_date: data.end_date?.split('T')[0] || '',
          recurrence_type: data.recurrence_type || 'MONTHLY',
          recurrence_day: data.recurrence_day || 1,
          due_days: data.due_days || 30,
          status: data.status || 'ACTIVE',
          is_active: data.is_active !== false,
          notes: data.notes || '',
          terms: data.terms || '',
          line_items: data.line_items || []
        });
        setExistingAttachments(data.attachments || []);
      } catch (error) {
        toast.error('Failed to fetch recurring invoice details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecurringInvoice();
  }, [id, baseUrl, token]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        const response = await axios.get(
          `https://${baseUrl}/api/customers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomers(response.data.data || response.data);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setCustomersLoading(false);
      }
    };

    if (baseUrl && token) fetchCustomers();
  }, [baseUrl, token]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.line_items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = (newItems[index].quantity || 0) * (newItems[index].rate || 0);
    }
    
    setFormData(prev => ({ ...prev, line_items: newItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, { description: '', quantity: 0, rate: 0, amount: 0 }]
    }));
  };

  const removeLineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(f => f.size <= 20 * 1024 * 1024);
    if (newFiles.length !== files.length) {
      toast.error('Some files exceed 20MB limit');
    }
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (id: number) => {
    setExistingAttachments(prev => prev.filter(f => f.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.invoice_name.trim()) newErrors.invoice_name = 'Invoice name is required';
    if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (formData.line_items.length === 0) newErrors.line_items = 'At least one line item is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('invoice_name', formData.invoice_name);
      formDataToSend.append('customer_id', formData.customer_id);
      formDataToSend.append('start_date', formData.start_date);
      if (formData.end_date) formDataToSend.append('end_date', formData.end_date);
      formDataToSend.append('recurrence_type', formData.recurrence_type);
      formDataToSend.append('recurrence_day', formData.recurrence_day.toString());
      formDataToSend.append('due_days', formData.due_days.toString());
      formDataToSend.append('status', formData.status);
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      formDataToSend.append('notes', formData.notes);
      formDataToSend.append('terms', formData.terms);
      formDataToSend.append('line_items', JSON.stringify(formData.line_items));

      attachments.forEach((file) => {
        formDataToSend.append('attachments[]', file);
      });

      const response = await axios.put(
        `https://${baseUrl}/api/recurring-invoices/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Recurring invoice updated successfully');
      navigate(`/accounting/recurring-invoices`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update recurring invoice';
      toast.error(message);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const totalAmount = formData.line_items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalTax = formData.line_items.reduce((sum, item) => sum + (item.tax_amount || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Recurring Invoice</h1>
            <p className="text-sm text-gray-600">{formData.invoice_name}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Section title="Basic Information" icon={<FileText className="h-4 w-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Invoice Name"
              value={formData.invoice_name}
              onChange={(e) => handleInputChange('invoice_name', e.target.value)}
              error={!!errors.invoice_name}
              helperText={errors.invoice_name}
              size="small"
            />
            <FormControl fullWidth size="small" error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <MuiSelect
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="PAUSED">Paused</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.is_active}
                onChange={(e) => handleInputChange('is_active', e.target.checked)}
              />
            }
            label="Invoice is Active"
            className="mt-4"
          />
        </Section>

        {/* Customer Information */}
        <Section title="Customer Information" icon={<FileText className="h-4 w-4" />}>
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.name}
            value={customers.find(c => c.id.toString() === formData.customer_id) || null}
            onChange={(_, customer) => {
              handleInputChange('customer_id', customer?.id.toString() || '');
              handleInputChange('customer_name', customer?.name || '');
            }}
            loading={customersLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Customer"
                error={!!errors.customer_id}
                helperText={errors.customer_id}
                size="small"
              />
            )}
            fullWidth
          />
        </Section>

        {/* Schedule Information */}
        <Section title="Schedule Information" icon={<Calendar className="h-4 w-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              error={!!errors.start_date}
              helperText={errors.start_date}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              fullWidth
              label="End Date (Optional)"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Recurrence Type</InputLabel>
              <MuiSelect
                value={formData.recurrence_type}
                onChange={(e) => handleInputChange('recurrence_type', e.target.value)}
                label="Recurrence Type"
              >
                <MenuItem value="MONTHLY">Monthly</MenuItem>
                <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                <MenuItem value="HALF_YEARLY">Half Yearly</MenuItem>
                <MenuItem value="YEARLY">Yearly</MenuItem>
              </MuiSelect>
            </FormControl>
            <TextField
              fullWidth
              label="Day of Month"
              type="number"
              inputProps={{ min: 1, max: 31 }}
              value={formData.recurrence_day}
              onChange={(e) => handleInputChange('recurrence_day', parseInt(e.target.value) || 1)}
              size="small"
            />
            <TextField
              fullWidth
              label="Due Days"
              type="number"
              inputProps={{ min: 0 }}
              value={formData.due_days}
              onChange={(e) => handleInputChange('due_days', parseInt(e.target.value) || 30)}
              size="small"
            />
          </div>
        </Section>

        {/* Line Items */}
        <Section title="Line Items" icon={<Plus className="h-4 w-4" />}>
          <div className="space-y-4">
            {errors.line_items && <p className="text-red-500 text-sm">{errors.line_items}</p>}
            
            {formData.line_items.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <TextField
                    fullWidth
                    label="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Rate"
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleLineItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={item.amount}
                    disabled
                    size="small"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={() => removeLineItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addLineItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Line Item
            </Button>
          </div>
        </Section>

        {/* Summary */}
        <Section title="Summary" icon={<DollarSign className="h-4 w-4" />}>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span className="font-medium">₹{totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>₹{(totalAmount + totalTax).toFixed(2)}</span>
            </div>
          </div>
        </Section>

        {/* Notes & Terms */}
        <Section title="Notes & Terms" icon={<FileText className="h-4 w-4" />}>
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label="Terms & Conditions"
            multiline
            rows={3}
            value={formData.terms}
            onChange={(e) => handleInputChange('terms', e.target.value)}
            size="small"
            className="mt-4"
          />
        </Section>

        {/* Attachments */}
        <Section title="Attachments" icon={<File className="h-4 w-4" />}>
          <div className="space-y-4">
            {/* Existing Attachments */}
            {existingAttachments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Existing Files</h3>
                <div className="space-y-2">
                  {existingAttachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExistingFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Attachments */}
            {attachments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">New Files</h3>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <File className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-500">Max 20MB per file</span>
                </div>
              </label>
            </div>
          </div>
        </Section>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Update Recurring Invoice
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditRecurringInvoicePage;
