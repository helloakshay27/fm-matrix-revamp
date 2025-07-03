
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const EditServicePRPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    contractor: 'ABC Contractor',
    plantDetail: 'Plant 1',
    billingAddress: 'Address 1',
    loiDate: '2025-06-14',
    retention: '5',
    tds: '2',
    qc: '10',
    paymentTenure: '30',
    advanceAmount: '1000',
    relatedTo: 'Service work for facility maintenance',
    service: 'Cleaning Service',
    productDescription: 'Regular cleaning and maintenance services',
    quantityArea: '500',
    uom: 'Sq Ft',
    expectedDate: '2025-07-15',
    rate: '10',
    amount: '5000',
    totalAmount: '5000',
    kindAttention: 'Facility Manager',
    subject: 'Service Request for Cleaning',
    description: 'Comprehensive cleaning service for the facility',
    termsConditions: 'Service to be completed within specified timeframe'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Updated Service PR:', formData);
    navigate('/finance/service-pr');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Service PR</span>
          <span className="mx-2">{'>'}</span>
          <span>Edit Service PR</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">EDIT SERVICE PR</h1>
      </div>

      {/* Work Order Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#C72030] flex items-center">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            WORK ORDER DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select Contractor*</InputLabel>
              <MuiSelect
                label="Select Contractor*"
                value={formData.contractor}
                onChange={(e) => handleInputChange('contractor', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="ABC Contractor">ABC Contractor</MenuItem>
                <MenuItem value="XYZ Contractor">XYZ Contractor</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Plant Detail*</InputLabel>
              <MuiSelect
                label="Plant Detail*"
                value={formData.plantDetail}
                onChange={(e) => handleInputChange('plantDetail', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="Plant 1">Plant 1</MenuItem>
                <MenuItem value="Plant 2">Plant 2</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Select LOI Date*"
              type="date"
              value={formData.loiDate}
              onChange={(e) => handleInputChange('loiDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select Billing Address*</InputLabel>
              <MuiSelect
                label="Select Billing Address*"
                value={formData.billingAddress}
                onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="Address 1">Address 1</MenuItem>
                <MenuItem value="Address 2">Address 2</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Retention(%)"
              value={formData.retention}
              onChange={(e) => handleInputChange('retention', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="TDS(%)"
              value={formData.tds}
              onChange={(e) => handleInputChange('tds', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="QC(%)"
              value={formData.qc}
              onChange={(e) => handleInputChange('qc', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Payment Tenure(In Days)"
              value={formData.paymentTenure}
              onChange={(e) => handleInputChange('paymentTenure', e.target.value)}
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

            <TextField
              label="Related To*"
              value={formData.relatedTo}
              onChange={(e) => handleInputChange('relatedTo', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1, gridColumn: 'span 3' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#C72030] flex items-center">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
            SERVICE DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Select Service*</InputLabel>
              <MuiSelect
                label="Select Service*"
                value={formData.service}
                onChange={(e) => handleInputChange('service', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="Cleaning Service">Cleaning Service</MenuItem>
                <MenuItem value="Maintenance Service">Maintenance Service</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="UOM"
              value={formData.uom}
              onChange={(e) => handleInputChange('uom', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Quantity/Area*"
              value={formData.quantityArea}
              onChange={(e) => handleInputChange('quantityArea', e.target.value)}
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
              label="Amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
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
              label="Product Description*"
              value={formData.productDescription}
              onChange={(e) => handleInputChange('productDescription', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1, gridColumn: 'span 3' }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button
          variant="outline"
          onClick={() => navigate('/finance/service-pr')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:opacity-90 px-8"
        >
          Update Service PR
        </Button>
      </div>
    </div>
  );
};

export default EditServicePRPage;
