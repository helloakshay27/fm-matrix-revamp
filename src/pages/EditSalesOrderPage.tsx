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
  Autocomplete,
  InputAdornment
} from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { ShoppingCart, Package, Calendar, DollarSign } from 'lucide-react';

interface LineItem {
  id?: number;
  item_name: string;
  item_id?: number | null;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  discountType: 'percentage' | 'amount';
  tax: string;
  taxRate: number;
  total_amount: number;
  item_unit?: string;
  tax_type?: string;
  tax_group?: any;
}

interface SalesOrderData {
  id: number;
  sale_order_number: string;
  reference_number: string;
  date: string;
  shipment_date: string;
  delivery_method: string;
  sales_person_name: string;
  customer_name: string;
  customer_id?: number;
  status: string;
  sub_total_amount: number;
  discount_per?: number;
  discount_amount?: number;
  lock_account_tax_amount: number;
  charge_amount?: number;
  charge_name?: string;
  charge_type?: string;
  total_amount: number;
  tax_type?: string;
  customer_notes?: string;
  terms_and_conditions?: string;
  payment_term?: string;
  item_details?: LineItem[];
  attachments?: Array<{ id: number; url: string; name: string }>;
}

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

interface Item {
  id: number;
  name: string;
  rate: number;
  description: string;
}

interface Salesperson {
  id: number;
  name: string;
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

export const EditSalesOrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const lock_account_id = localStorage.getItem('lock_account_id');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [salesOrder, setSalesOrder] = useState<SalesOrderData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [itemOptions, setItemOptions] = useState<Item[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const [formData, setFormData] = useState({
    sale_order_number: '',
    reference_number: '',
    date: '',
    shipment_date: '',
    delivery_method: '',
    sales_person_id: '',
    customer_id: '',
    status: 'DRAFT',
    discount_per: '',
    discount_amount: '',
    charge_amount: '',
    charge_name: '',
    charge_type: 'tax',
    customer_notes: '',
    terms_and_conditions: '',
    payment_term: '',
    line_items: [] as LineItem[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<Array<{ id: number; url: string; name: string }>>([]);

  // Fetch sales order details
  useEffect(() => {
    const fetchSalesOrder = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/sale_orders/${id}.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        setSalesOrder(data);
        setFormData({
          sale_order_number: data.sale_order_number || '',
          reference_number: data.reference_number || '',
          date: data.date?.split('T')[0] || '',
          shipment_date: data.shipment_date?.split('T')[0] || '',
          delivery_method: data.delivery_method || '',
          sales_person_id: data.sales_person_id?.toString() || '',
          customer_id: data.lock_account_customer_id?.toString() || '',
          status: data.status || 'DRAFT',
          discount_per: data.discount_per?.toString() || '',
          discount_amount: data.discount_amount?.toString() || '',
          charge_amount: data.charge_amount?.toString() || '',
          charge_name: data.charge_name || '',
          charge_type: data.charge_type || 'tax',
          customer_notes: data.customer_notes || '',
          terms_and_conditions: data.terms_and_conditions || '',
          payment_term: data.payment_term || '',
          line_items: data.item_details || []
        });
        setExistingAttachments(data.attachments || []);
      } catch (error) {
        toast.error('Failed to fetch sales order details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id && baseUrl && token) fetchSalesOrder();
  }, [id, baseUrl, token]);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        const response = await axios.get(
          `https://${baseUrl}/lock_account_customers.json?lock_account_id=${lock_account_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCustomers(response.data.map((c: any) => ({
          id: c.id,
          name: c.name || c.company_name
        })));
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setCustomersLoading(false);
      }
    };

    if (baseUrl && token) fetchCustomers();
  }, [baseUrl, token, lock_account_id]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/lock_account_items.json?lock_account_id=${lock_account_id}&q[can_be_sold_eq]=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(response.data)) {
          setItemOptions(response.data.map(item => ({
            id: item.id,
            name: item.name,
            rate: item.sale_rate,
            description: item.sale_description
          })));
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    if (baseUrl && token) fetchItems();
  }, [baseUrl, token, lock_account_id]);

  // Fetch salespersons
  useEffect(() => {
    const fetchSalespersons = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/sales_persons.json?lock_account_id=${lock_account_id}&q[active_eq]=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(response.data)) {
          setSalespersons(response.data.map(person => ({
            id: person.id,
            name: person.name
          })));
        }
      } catch (error) {
        console.error('Failed to fetch salespersons:', error);
      }
    };

    if (baseUrl && token) fetchSalespersons();
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
    
    // Calculate total_amount if quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      const qty = parseFloat(newItems[index].quantity?.toString() || '0') || 0;
      const rate = parseFloat(newItems[index].rate?.toString() || '0') || 0;
      let amount = qty * rate;
      
      // Apply discount if it exists
      if (newItems[index].discount) {
        const discount = parseFloat(newItems[index].discount?.toString() || '0') || 0;
        if (newItems[index].discountType === 'percentage') {
          amount = amount - (amount * discount / 100);
        } else {
          amount = amount - discount;
        }
      }
      
      newItems[index].total_amount = amount;
    }
    
    setFormData(prev => ({ ...prev, line_items: newItems }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, {
        item_name: '',
        item_id: null,
        description: '',
        quantity: 0,
        rate: 0,
        discount: 0,
        discountType: 'percentage' as const,
        tax: '',
        taxRate: 0,
        total_amount: 0
      }]
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
    
    if (!formData.sale_order_number.trim()) newErrors.sale_order_number = 'Sale order number is required';
    if (!formData.date) newErrors.date = 'Sale order date is required';
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
      formDataToSend.append('sale_order_number', formData.sale_order_number);
      formDataToSend.append('reference_number', formData.reference_number);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('shipment_date', formData.shipment_date);
      formDataToSend.append('delivery_method', formData.delivery_method);
      if (formData.sales_person_id) formDataToSend.append('sales_person_id', formData.sales_person_id);
      formDataToSend.append('lock_account_customer_id', formData.customer_id);
      formDataToSend.append('status', formData.status);
      if (formData.discount_per) formDataToSend.append('discount_per', formData.discount_per);
      if (formData.charge_amount) formDataToSend.append('charge_amount', formData.charge_amount);
      if (formData.charge_name) formDataToSend.append('charge_name', formData.charge_name);
      if (formData.charge_type) formDataToSend.append('charge_type', formData.charge_type);
      formDataToSend.append('customer_notes', formData.customer_notes);
      formDataToSend.append('terms_and_conditions', formData.terms_and_conditions);
      if (formData.payment_term) formDataToSend.append('payment_term', formData.payment_term);
      formDataToSend.append('item_details', JSON.stringify(formData.line_items));

      attachments.forEach((file) => {
        formDataToSend.append('attachments[]', file);
      });

      const response = await axios.put(
        `https://${baseUrl}/sale_orders/${id}.json`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Sales order updated successfully');
      navigate(`/accounting/sales-order/${id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update sales order';
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

  const subTotal = formData.line_items.reduce((sum, item) => sum + (item.total_amount || 0), 0);
  const taxAmount = (subTotal * (formData.line_items[0]?.taxRate || 0)) / 100;
  const chargeAmount = parseFloat(formData.charge_amount) || 0;
  const totalAmount = subTotal + taxAmount + chargeAmount;

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
            <h1 className="text-2xl font-bold">Edit Sales Order</h1>
            <p className="text-sm text-gray-600">Order #{formData.sale_order_number}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Information */}
        <Section title="Order Information" icon={<ShoppingCart className="h-4 w-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Sale Order Number"
              value={formData.sale_order_number}
              onChange={(e) => handleInputChange('sale_order_number', e.target.value)}
              error={!!errors.sale_order_number}
              helperText={errors.sale_order_number}
              size="small"
            />
            <TextField
              fullWidth
              label="Reference Number"
              value={formData.reference_number}
              onChange={(e) => handleInputChange('reference_number', e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Sale Order Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              fullWidth
              label="Shipment Date"
              type="date"
              value={formData.shipment_date}
              onChange={(e) => handleInputChange('shipment_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <MuiSelect
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                <MenuItem value="PARTIALLY_DELIVERED">Partially Delivered</MenuItem>
                <MenuItem value="DELIVERED">Delivered</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </MuiSelect>
            </FormControl>
            <TextField
              fullWidth
              label="Delivery Method"
              value={formData.delivery_method}
              onChange={(e) => handleInputChange('delivery_method', e.target.value)}
              size="small"
            />
          </div>
        </Section>

        {/* Customer & Salesperson */}
        <Section title="Customer & Salesperson" icon={<Package className="h-4 w-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Autocomplete
              options={customers}
              getOptionLabel={(option) => option.name}
              value={customers.find(c => c.id.toString() === formData.customer_id) || null}
              onChange={(_, customer) => handleInputChange('customer_id', customer?.id.toString() || '')}
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
            <Autocomplete
              options={salespersons}
              getOptionLabel={(option) => option.name}
              value={salespersons.find(s => s.id.toString() === formData.sales_person_id) || null}
              onChange={(_, salesperson) => handleInputChange('sales_person_id', salesperson?.id.toString() || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Salesperson"
                  size="small"
                />
              )}
              fullWidth
            />
          </div>
        </Section>

        {/* Line Items */}
        <Section title="Line Items" icon={<Plus className="h-4 w-4" />}>
          <div className="space-y-4">
            {errors.line_items && <p className="text-red-500 text-sm">{errors.line_items}</p>}
            
            {formData.line_items.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                  <TextField
                    fullWidth
                    label="Item"
                    value={item.item_name}
                    onChange={(e) => handleLineItemChange(index, 'item_name', e.target.value)}
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
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Discount %"
                    type="number"
                    value={item.discount}
                    onChange={(e) => handleLineItemChange(index, 'discount', parseFloat(e.target.value) || 0)}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={item.total_amount}
                    disabled
                    size="small"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>
                    }}
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

        {/* Pricing Information */}
        <Section title="Pricing Information" icon={<DollarSign className="h-4 w-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Discount %"
              type="number"
              value={formData.discount_per}
              onChange={(e) => handleInputChange('discount_per', e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Additional Charge"
              type="number"
              value={formData.charge_amount}
              onChange={(e) => handleInputChange('charge_amount', e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>
              }}
            />
            <TextField
              fullWidth
              label="Charge Name"
              value={formData.charge_name}
              onChange={(e) => handleInputChange('charge_name', e.target.value)}
              size="small"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Charge Type</InputLabel>
              <MuiSelect
                value={formData.charge_type}
                onChange={(e) => handleInputChange('charge_type', e.target.value)}
                label="Charge Type"
              >
                <MenuItem value="tax">Tax</MenuItem>
                <MenuItem value="shipping">Shipping</MenuItem>
                <MenuItem value="handling">Handling</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Summary */}
          <div className="mt-6 space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span className="font-medium">₹{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Additional Charges:</span>
              <span className="font-medium">₹{chargeAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </Section>

        {/* Notes & Terms */}
        <Section title="Notes & Terms" icon={<FileText className="h-4 w-4" />}>
          <TextField
            fullWidth
            label="Customer Notes"
            multiline
            rows={3}
            value={formData.customer_notes}
            onChange={(e) => handleInputChange('customer_notes', e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            label="Terms & Conditions"
            multiline
            rows={3}
            value={formData.terms_and_conditions}
            onChange={(e) => handleInputChange('terms_and_conditions', e.target.value)}
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
                Update Sales Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSalesOrderPage;
