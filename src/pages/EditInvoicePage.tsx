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
  InputAdornment
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

interface LineItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  tax_percentage?: number;
  tax_amount?: number;
}

interface InvoiceData {
  id: number;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  customer_name: string;
  customer_id?: number;
  status: string;
  total_amount: number;
  tax_amount: number;
  total_with_tax: number;
  notes?: string;
  terms?: string;
  line_items?: LineItem[];
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

export const EditInvoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const lock_account_id = localStorage.getItem('lock_account_id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const [formData, setFormData] = useState({
    invoice_number: '',
    invoice_date: '',
    due_date: '',
    customer_id: '',
    customer_name: '',
    status: 'DRAFT',
    notes: '',
    terms: '',
    line_items: [] as LineItem[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Array<{ id: number; url: string; name: string }>>([]);

  // Fetch invoice details
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/lock_account_invoices/${id}.json?lock_account_id=${lock_account_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data?.data || response.data;
        setInvoice(data);
        setFormData({
          invoice_number: data.invoice_number || '',
          invoice_date: data.invoice_date?.split('T')[0] || data.date?.split('T')[0] || '',
          due_date: data.due_date?.split('T')[0] || '',
          customer_id: data.lock_account_customer_id?.toString() || data.customer_id?.toString() || '',
          customer_name: data.customer_name || '',
          status: data.status || 'DRAFT',
          notes: data.notes || '',
          terms: data.terms || data.terms_and_conditions || '',
          line_items: data.sale_order_items || data.item_details || data.line_items || []
        });
        setExistingAttachments(data.attachments || []);
      } catch (error) {
        toast.error('Failed to fetch invoice details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id && baseUrl && token && lock_account_id) fetchInvoice();
  }, [id, baseUrl, token, lock_account_id]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        const response = await axios.get(
          `https://${baseUrl}/lock_account_customers.json?lock_account_id=${lock_account_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomers((response.data?.data || response.data || []).map((c: any) => ({
          id: c.id,
          name: c.name || c.company_name || `${c.first_name || ''} ${c.last_name || ''}`.trim(),
          email: c.email,
          phone: c.mobile || c.phone,
        })));
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setCustomersLoading(false);
      }
    };

    if (baseUrl && token && lock_account_id) fetchCustomers();
  }, [baseUrl, token, lock_account_id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.line_items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate amount if quantity or rate changes
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
    
    if (!formData.invoice_number.trim()) newErrors.invoice_number = 'Invoice number is required';
    if (!formData.invoice_date) newErrors.invoice_date = 'Invoice date is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
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
      formDataToSend.append('invoice_number', formData.invoice_number);
      formDataToSend.append('invoice_date', formData.invoice_date);
      formDataToSend.append('due_date', formData.due_date);
      formDataToSend.append('customer_id', formData.customer_id);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('notes', formData.notes);
      formDataToSend.append('terms', formData.terms);
      formDataToSend.append('line_items', JSON.stringify(formData.line_items));

      attachments.forEach((file) => {
        formDataToSend.append('attachments[]', file);
      });

      const response = await axios.put(
        `https://${baseUrl}/api/invoices/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Invoice updated successfully');
      navigate(`/finance/invoices/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update invoice';
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
            <h1 className="text-2xl font-bold">Edit Invoice</h1>
            <p className="text-sm text-gray-600">Invoice #{formData.invoice_number}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Section title="Basic Information" icon={<FileText className="h-4 w-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Invoice Number"
              value={formData.invoice_number}
              onChange={(e) => handleInputChange('invoice_number', e.target.value)}
              error={!!errors.invoice_number}
              helperText={errors.invoice_number}
              size="small"
            />
            <TextField
              fullWidth
              label="Invoice Date"
              type="date"
              value={formData.invoice_date}
              onChange={(e) => handleInputChange('invoice_date', e.target.value)}
              error={!!errors.invoice_date}
              helperText={errors.invoice_date}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleInputChange('due_date', e.target.value)}
              error={!!errors.due_date}
              helperText={errors.due_date}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <FormControl fullWidth size="small" error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <MuiSelect
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="SENT">Sent</MenuItem>
                <MenuItem value="VIEWED">Viewed</MenuItem>
                <MenuItem value="PARTIALLY_PAID">Partially Paid</MenuItem>
                <MenuItem value="PAID">Paid</MenuItem>
                <MenuItem value="OVERDUE">Overdue</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
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
        <Section title="Summary" icon={<FileText className="h-4 w-4" />}>
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
                Update Invoice
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditInvoicePage;
