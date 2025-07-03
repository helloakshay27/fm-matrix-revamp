
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddPODashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplier: '',
    plantDetail: '',
    billingAddress: '',
    deliveryAddress: '',
    referenceNumber: '',
    tds: '',
    paymentTerms: '',
    advanceAmount: '',
    termsConditions: '',
    itemDetails: '',
    sacHsnCode: '',
    productDescription: '',
    quantity: '',
    expectedDate: '',
    rate: '',
    amount: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('PO Form submitted:', formData);
    navigate('/finance/purchase-orders');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Purchase Orders</span>
          <span className="mx-2">{'>'}</span>
          <span>New Purchase Order</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">NEW PURCHASE ORDER</h1>
      </div>

      {/* Supplier Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#C72030] flex items-center">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            SUPPLIER DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Supplier*</InputLabel>
              <MuiSelect
                label="Supplier*"
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Supplier</em></MenuItem>
                <MenuItem value="abc">ABC</MenuItem>
                <MenuItem value="godrej">Godrej</MenuItem>
                <MenuItem value="lt">L&T</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Plant Detail</InputLabel>
              <MuiSelect
                label="Plant Detail"
                value={formData.plantDetail}
                onChange={(e) => handleInputChange('plantDetail', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Plant Detail</em></MenuItem>
                <MenuItem value="plant1">Plant 1</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Billing Address*</InputLabel>
              <MuiSelect
                label="Billing Address*"
                value={formData.billingAddress}
                onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Billing Address</em></MenuItem>
                <MenuItem value="address1">Address 1</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Delivery Address*</InputLabel>
              <MuiSelect
                label="Delivery Address*"
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Delivery Address</em></MenuItem>
                <MenuItem value="address1">Address 1</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Reference#"
              value={formData.referenceNumber}
              onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="TDS%"
              value={formData.tds}
              onChange={(e) => handleInputChange('tds', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Payment Terms(In Days)"
              value={formData.paymentTerms}
              onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Advance Amount"
              value={formData.advanceAmount}
              onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>

          <div className="mt-4">
            <TextField
              label="Terms & Conditions*"
              value={formData.termsConditions}
              onChange={(e) => handleInputChange('termsConditions', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={4}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Item Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#C72030] flex items-center">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
            ITEM DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Item Details*</InputLabel>
              <MuiSelect
                label="Item Details*"
                value={formData.itemDetails}
                onChange={(e) => handleInputChange('itemDetails', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Inventory</em></MenuItem>
                <MenuItem value="item1">Item 1</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="SAC/HSN Code"
              value={formData.sacHsnCode}
              onChange={(e) => handleInputChange('sacHsnCode', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Product Description*"
              value={formData.productDescription}
              onChange={(e) => handleInputChange('productDescription', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Quantity*"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Expected Date*"
              type="date"
              value={formData.expectedDate}
              onChange={(e) => handleInputChange('expectedDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Rate*"
              value={formData.rate}
              onChange={(e) => handleInputChange('rate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Amount*"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-8 py-3 text-lg"
        >
          Create Purchase Order
        </Button>
      </div>
    </div>
  );
};

export default AddPODashboard;
