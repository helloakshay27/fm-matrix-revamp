
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

export const AddGRNDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    grnNumber: '',
    poNumber: '',
    supplierName: '',
    grnDate: '',
    deliveryDate: '',
    vehicleNumber: '',
    driverName: '',
    remarks: '',
    itemName: '',
    quantity: '',
    receivedQuantity: '',
    rate: '',
    amount: '',
    status: 'pending'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('GRN Form submitted:', formData);
    navigate('/finance/grn');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>GRN</span>
          <span className="mx-2">{'>'}</span>
          <span>New GRN</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">NEW GRN</h1>
      </div>

      {/* GRN Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#C72030] flex items-center">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            GRN DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextField
              label="GRN Number*"
              value={formData.grnNumber}
              onChange={(e) => handleInputChange('grnNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>PO Number*</InputLabel>
              <MuiSelect
                label="PO Number*"
                value={formData.poNumber}
                onChange={(e) => handleInputChange('poNumber', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select PO Number</em></MenuItem>
                <MenuItem value="PO-12345">PO-12345</MenuItem>
                <MenuItem value="PO-12346">PO-12346</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Supplier Name*</InputLabel>
              <MuiSelect
                label="Supplier Name*"
                value={formData.supplierName}
                onChange={(e) => handleInputChange('supplierName', e.target.value)}
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Supplier</em></MenuItem>
                <MenuItem value="ABC Supplier">ABC Supplier</MenuItem>
                <MenuItem value="XYZ Supplier">XYZ Supplier</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="GRN Date*"
              type="date"
              value={formData.grnDate}
              onChange={(e) => handleInputChange('grnDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Delivery Date*"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Vehicle Number"
              value={formData.vehicleNumber}
              onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Driver Name"
              value={formData.driverName}
              onChange={(e) => handleInputChange('driverName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Status</InputLabel>
              <MuiSelect
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="received">Received</MenuItem>
                <MenuItem value="partial">Partial</MenuItem>
              </MuiSelect>
            </FormControl>

            <TextField
              label="Remarks"
              value={formData.remarks}
              onChange={(e) => handleInputChange('remarks', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={2}
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
            <TextField
              label="Item Name*"
              value={formData.itemName}
              onChange={(e) => handleInputChange('itemName', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Ordered Quantity*"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />

            <TextField
              label="Received Quantity*"
              value={formData.receivedQuantity}
              onChange={(e) => handleInputChange('receivedQuantity', e.target.value)}
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
          Create GRN
        </Button>
      </div>
    </div>
  );
};

export default AddGRNDashboard;
