import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FileText, ListChecks, Paperclip } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
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
    description: 'Carpet Brush',
    sacHsnCode: 'NA',
    expectedDate: '23/04/25',
    quantity: '10.0',
    unit: '',
    rate: '70.00',
    wbsCode: '',
    gstRate: '9.00',
    amount: '63.00',
    sgstRate: '9.00',
    sgstAmount: '63.00',
    igstRate: '0.00',
    igstAmount: '0.00',
    ugstRate: '0.00',
    ugstAmount: '0.00',
    tdsRate: '0.00',
    tdsAmount: '0.00',
    taxAmount: '',
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
      description: '',
      sacHsnCode: '',
      expectedDate: '',
      quantity: '',
      unit: '',
      rate: '',
      wbsCode: '',
      gstRate: '',
      amount: '',
      sgstRate: '',
      sgstAmount: '',
      igstRate: '',
      igstAmount: '',
      ugstRate: '',
      ugstAmount: '',
      tdsRate: '',
      tdsAmount: '',
      taxAmount: '',
      totalAmount: ''
    };
    setItems([...items, newItem]);
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

              <div className="overflow-x-auto">
                
              </div>

              <div className="mt-4 grid grid-cols-4 gap-4 text-right">
                <div></div>
                <div></div>
                <div className="text-sm font-medium">
                  <div>Net Amount(INR):</div>
                  <div>Gross Amount:</div>
                  <div>Taxes:</div>
                  <div>Net Invoice Amount:</div>
                  <div className="mt-2">Amount In Words: Two Thousand, Three Hundred, Sixty Rupees Only</div>
                </div>
                <div className="text-sm">
                  <div>2360.00</div>
                  <div>2360.00</div>
                  <div>0.00</div>
                  <div className="font-medium">2360.00</div>
                </div>
              </div>
            </div>

            {/* Attachment Section */}
            <div className="bg-white p-6 rounded-lg shadow border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center">
                  <Paperclip className="text-white w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-[#C72030]">ATTACHMENT</h2>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Attachment:
                </label>
                <div className="flex items-center gap-4">
                  <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  <span className="text-sm text-gray-500">
                    {formData.attachment ? formData.attachment.name : "No file chosen"}
                  </span>
                </div>
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