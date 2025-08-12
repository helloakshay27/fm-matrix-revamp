import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FileText, ListChecks, Paperclip, X, Upload } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, IconButton } from '@mui/material';
const fieldStyles = {
  height: {
    xs: 28,
    sm: 36,
    md: 45
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: {
      xs: '8px',
      sm: '10px',
      md: '12px'
    }
  }
};
export const AddPODashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    materialPR: '',
    supplier: '',
    plantDetail: '',
    poDate: '',
    billingAddress: '',
    deliveryAddress: '',
    relatedTo: '',
    retention: '',
    tds: '',
    qc: '',
    paymentTenure: '',
    advanceAmount: '',
    termsConditions: '',
    attachment: null as File | null
  });
  const [items, setItems] = useState([{
    id: 1,
    itemDetails: 'Carpet Brush',
    sacHsnCode: 'NA',
    quantity: '10.0',
    unit: '',
    expectedDate: '2025-04-23',
    rate: '70.00',
    cgstRate: '9.00',
    cgstAmount: '63.00',
    sgstRate: '9.00',
    sgstAmount: '63.00',
    igstRate: '0.00',
    igstAmount: '0.00',
    tcsRate: '0.00',
    tcsAmount: '0.00',
    taxAmount: '',
    amount: '63.00',
    totalAmount: '826.00'
  }]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.success('Purchase Order created successfully');
    navigate('/finance/po');
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      attachment: file
    });
  };
  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      itemDetails: '',
      sacHsnCode: '',
      quantity: '',
      unit: '',
      expectedDate: '',
      rate: '',
      cgstRate: '',
      cgstAmount: '',
      sgstRate: '',
      sgstAmount: '',
      igstRate: '',
      igstAmount: '',
      tcsRate: '',
      tcsAmount: '',
      taxAmount: '',
      amount: '',
      totalAmount: ''
    };
    setItems([...items, newItem]);
  };

  const updateItem = (itemId: number, field: string, value: string) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (itemId: number) => {
    setItems(items.filter(item => item.id !== itemId));
  };
  return <div className="p-6 mx-auto max-w-7xl">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Finance
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">NEW PURCHASE ORDER</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Supplier Details Section */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
                  <FileText className="text-white w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-[#C72030]">SUPPLIER DETAILS</h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormControl fullWidth variant="outlined" sx={{
                mt: 1
              }}>
                  <InputLabel shrink>Select Material PR*</InputLabel>
                  <MuiSelect label="Select Material PR*" value={formData.materialPR} onChange={e => setFormData({
                  ...formData,
                  materialPR: e.target.value
                })} displayEmpty sx={fieldStyles}>
                    <MenuItem value=""><em>Select...</em></MenuItem>
                    <MenuItem value="pr1">PR-001</MenuItem>
                    <MenuItem value="pr2">PR-002</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{
                mt: 1
              }}>
                  <InputLabel shrink>Supplier*</InputLabel>
                  <MuiSelect label="Supplier*" value={formData.supplier} onChange={e => setFormData({
                  ...formData,
                  supplier: e.target.value
                })} displayEmpty sx={fieldStyles}>
                    <MenuItem value=""><em>Select...</em></MenuItem>
                    <MenuItem value="supplier1">ABC Corp</MenuItem>
                    <MenuItem value="supplier2">XYZ Ltd</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{
                mt: 1
              }}>
                  <InputLabel shrink>Plant Detail*</InputLabel>
                  <MuiSelect label="Plant Detail*" value={formData.plantDetail} onChange={e => setFormData({
                  ...formData,
                  plantDetail: e.target.value
                })} displayEmpty sx={fieldStyles}>
                    <MenuItem value=""><em>Select...</em></MenuItem>
                    <MenuItem value="plant1">Plant 1</MenuItem>
                    <MenuItem value="plant2">Plant 2</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField label="PO Date*" type="date" value={formData.poDate} onChange={e => setFormData({
                ...formData,
                poDate: e.target.value
              })} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} sx={{
                mt: 1
              }} />

                <FormControl fullWidth variant="outlined" sx={{
                mt: 1
              }}>
                  <InputLabel shrink>Billing Address*</InputLabel>
                  <MuiSelect label="Billing Address*" value={formData.billingAddress} onChange={e => setFormData({
                  ...formData,
                  billingAddress: e.target.value
                })} displayEmpty sx={fieldStyles}>
                    <MenuItem value=""><em>Select...</em></MenuItem>
                    <MenuItem value="address1">Address 1</MenuItem>
                    <MenuItem value="address2">Address 2</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined" sx={{
                mt: 1
              }}>
                  <InputLabel shrink>Delivery Address*</InputLabel>
                  <MuiSelect label="Delivery Address*" value={formData.deliveryAddress} onChange={e => setFormData({
                  ...formData,
                  deliveryAddress: e.target.value
                })} displayEmpty sx={fieldStyles}>
                    <MenuItem value=""><em>Select...</em></MenuItem>
                    <MenuItem value="delivery1">Delivery 1</MenuItem>
                    <MenuItem value="delivery2">Delivery 2</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField label="Related To" value={formData.relatedTo} onChange={e => setFormData({
                ...formData,
                relatedTo: e.target.value
              })} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} sx={{
                mt: 1
              }} />

                <TextField label="Retention(%)" value={formData.retention} onChange={e => setFormData({
                ...formData,
                retention: e.target.value
              })} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} sx={{
                mt: 1
              }} />

                <TextField label="TDS(%)" value={formData.tds} onChange={e => setFormData({
                ...formData,
                tds: e.target.value
              })} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} sx={{
                mt: 1
              }} />

                <TextField label="QC(%)" value={formData.qc} onChange={e => setFormData({
                ...formData,
                qc: e.target.value
              })} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} sx={{
                mt: 1
              }} />

                <TextField label="Payment Tenure(In Days)" value={formData.paymentTenure} onChange={e => setFormData({
                ...formData,
                paymentTenure: e.target.value
              })} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} sx={{
                mt: 1
              }} />

                <TextField label="Advance Amount" value={formData.advanceAmount} onChange={e => setFormData({
                ...formData,
                advanceAmount: e.target.value
              })} fullWidth variant="outlined" InputLabelProps={{
                shrink: true
              }} InputProps={{
                sx: fieldStyles
              }} sx={{
                mt: 1
              }} />
              </div>

              <div className="mt-6">
                <TextField label="Terms & Conditions" value={formData.termsConditions} onChange={e => setFormData({
                ...formData,
                termsConditions: e.target.value
              })} fullWidth variant="outlined" multiline minRows={4} placeholder="Enter..." InputLabelProps={{
                shrink: true
              }} sx={{
                mt: 1
              }} />
              </div>
            </div>

            {/* Item Details Section */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
                  <ListChecks className="text-white w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-[#C72030]">ITEM DETAILS</h2>
              </div>

              <Button type="button" onClick={addItem} className="bg-[#C72030] hover:bg-[#A01020] text-white mb-4">
                Add Item
              </Button>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium text-gray-700">Item {index + 1}</h3>
                      {items.length > 1 && (
                        <IconButton
                          onClick={() => removeItem(item.id)}
                          size="small"
                          className="text-red-600 hover:bg-red-100"
                        >
                          <X className="w-4 h-4" />
                        </IconButton>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {/* Row 1 */}
                      <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Item Details</InputLabel>
                        <MuiSelect
                          label="Item Details"
                          value={item.itemDetails}
                          onChange={e => updateItem(item.id, 'itemDetails', e.target.value)}
                          displayEmpty
                          sx={fieldStyles}
                        >
                          <MenuItem value=""><em>Select...</em></MenuItem>
                          <MenuItem value="Carpet Brush">Carpet Brush</MenuItem>
                          <MenuItem value="Floor Cleaner">Floor Cleaner</MenuItem>
                        </MuiSelect>
                      </FormControl>

                      <TextField
                        label="SAC/HSN Code"
                        value={item.sacHsnCode}
                        onChange={e => updateItem(item.id, 'sacHsnCode', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Quantity"
                        value={item.quantity}
                        onChange={e => updateItem(item.id, 'quantity', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      {/* Row 2 */}
                      <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                        <InputLabel shrink>Select Unit</InputLabel>
                        <MuiSelect
                          label="Select Unit"
                          value={item.unit}
                          onChange={e => updateItem(item.id, 'unit', e.target.value)}
                          displayEmpty
                          sx={fieldStyles}
                        >
                          <MenuItem value=""><em>Select...</em></MenuItem>
                          <MenuItem value="Piece">Piece</MenuItem>
                          <MenuItem value="Kg">Kg</MenuItem>
                          <MenuItem value="Liter">Liter</MenuItem>
                        </MuiSelect>
                      </FormControl>

                      <TextField
                        label="Expected Date"
                        type="date"
                        value={item.expectedDate}
                        onChange={e => updateItem(item.id, 'expectedDate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Rate"
                        value={item.rate}
                        onChange={e => updateItem(item.id, 'rate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      {/* Row 3 */}
                      <TextField
                        label="CGST Rate"
                        value={item.cgstRate}
                        onChange={e => updateItem(item.id, 'cgstRate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="CGST Amt"
                        value={item.cgstAmount}
                        onChange={e => updateItem(item.id, 'cgstAmount', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="SGST Rate"
                        value={item.sgstRate}
                        onChange={e => updateItem(item.id, 'sgstRate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      {/* Row 4 */}
                      <TextField
                        label="SGST Amount"
                        value={item.sgstAmount}
                        onChange={e => updateItem(item.id, 'sgstAmount', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="IGST Rate"
                        value={item.igstRate}
                        onChange={e => updateItem(item.id, 'igstRate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="IGST Amount"
                        value={item.igstAmount}
                        onChange={e => updateItem(item.id, 'igstAmount', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      {/* Row 5 */}
                      <TextField
                        label="TCS Rate"
                        value={item.tcsRate}
                        onChange={e => updateItem(item.id, 'tcsRate', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="TCS Amount"
                        value={item.tcsAmount}
                        onChange={e => updateItem(item.id, 'tcsAmount', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Tax Amount"
                        value={item.taxAmount}
                        onChange={e => updateItem(item.id, 'taxAmount', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      {/* Row 6 */}
                      <TextField
                        label="Amount"
                        value={item.amount}
                        onChange={e => updateItem(item.id, 'amount', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />

                      <TextField
                        label="Total Amount"
                        value={item.totalAmount}
                        onChange={e => updateItem(item.id, 'totalAmount', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: fieldStyles }}
                        sx={{ mt: 1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachment Section */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">ATTACHMENTS</h2>
              </div>

              <div 
                className="border-2 border-dashed border-yellow-400 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  Drag & Drop or Click to Upload{' '}
                  <span className="text-gray-500">No images chosen</span>
                </p>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Total Amount */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold text-[#C72030] mb-4">Total Amount</h3>
              <div className="text-3xl font-bold text-[#C72030]">₹2,360.00</div>
            </div>

            {/* Submit Button */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <Button type="submit" className="w-full bg-[#C72030] hover:bg-[#A01020] text-white py-3">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>;
};