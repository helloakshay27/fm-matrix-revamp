import React, { useState } from 'react';
import { ArrowLeft, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { ResponsiveDatePicker } from '@/components/ui/responsive-date-picker';
import { useNavigate } from 'react-router-dom';

const WorkOrderAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contractor: '',
    plantDetail: '',
    woDate: new Date(),
    billingAddress: '',
    retention: '',
    tds: '',
    qc: '',
    paymentTenure: '',
    advanceAmount: '',
    relatedTo: ''
  });

  const [detailsForms, setDetailsForms] = useState([{
    id: 1,
    service: '',
    productDescription: 'Housekeeping',
    quantityArea: '10.0',
    uom: 'UOM',
    expectedDate: new Date(),
    rate: '100.0',
    cgstRate: '',
    cgstAmt: '0.0',
    sgstRate: '',
    sgstAmt: '0.0',
    igstRate: '',
    igstAmt: '0.0',
    tcsRate: '',
    tcsAmt: '0.0',
    taxAmount: '0.0',
    amount: '1000.0',
    totalAmount: '1000.0'
  }]);

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailsChange = (id: number, field: string, value: string | Date) => {
    setDetailsForms(prev => prev.map(form => 
      form.id === id ? { ...form, [field]: value } : form
    ));
  };

  const addNewDetailsForm = () => {
    const newId = Math.max(...detailsForms.map(form => form.id)) + 1;
    const newForm = {
      id: newId,
      service: '',
      productDescription: 'Housekeeping',
      quantityArea: '10.0',
      uom: 'UOM',
      expectedDate: new Date(),
      rate: '100.0',
      cgstRate: '',
      cgstAmt: '0.0',
      sgstRate: '',
      sgstAmt: '0.0',
      igstRate: '',
      igstAmt: '0.0',
      tcsRate: '',
      tcsAmt: '0.0',
      taxAmount: '0.0',
      amount: '1000.0',
      totalAmount: '1000.0'
    };
    setDetailsForms(prev => [...prev, newForm]);
  };

  const removeDetailsForm = (id: number) => {
    if (detailsForms.length > 1) {
      setDetailsForms(prev => prev.filter(form => form.id !== id));
    }
  };

  const handleSubmit = () => {
    console.log('Work Order Data:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">WORK ORDER DETAILS</h1>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Work Order Details Section Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">WORK ORDER DETAILS</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Row */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Select Contractor*</InputLabel>
                <MuiSelect
                  label="Select Contractor*"
                  value={formData.contractor}
                  onChange={(e) => handleInputChange('contractor', e.target.value)}
                  displayEmpty
                  sx={{
                    height: { xs: 28, sm: 36, md: 45 },
                    '& .MuiInputBase-input, & .MuiSelect-select': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Contractor</em></MenuItem>
                  <MenuItem value="modwin-mumbai">MODWIN NETWORKS PVT.LTD --Mumbai</MenuItem>
                  <MenuItem value="contractor-2">ABC CONTRACTORS --Delhi</MenuItem>
                  <MenuItem value="contractor-3">XYZ SERVICES --Bangalore</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Plant Detail*</InputLabel>
                <MuiSelect
                  label="Plant Detail*"
                  value={formData.plantDetail}
                  onChange={(e) => handleInputChange('plantDetail', e.target.value)}
                  displayEmpty
                  sx={{
                    height: { xs: 28, sm: 36, md: 45 },
                    '& .MuiInputBase-input, & .MuiSelect-select': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Plant Id</em></MenuItem>
                  <MenuItem value="plant-1">Plant A - Mumbai</MenuItem>
                  <MenuItem value="plant-2">Plant B - Delhi</MenuItem>
                  <MenuItem value="plant-3">Plant C - Bangalore</MenuItem>
                </MuiSelect>
              </FormControl>

              <TextField
                label="Select WO Date*"
                value={formData.woDate instanceof Date ? formData.woDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleInputChange('woDate', new Date(e.target.value))}
                fullWidth
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{
                  mt: 1,
                  '& .MuiInputBase-input': {
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                  },
                  height: { xs: 28, sm: 36, md: 45 },
                }}
              />

              {/* Second Row */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Select Billing Address*</InputLabel>
                <MuiSelect
                  label="Select Billing Address*"
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  displayEmpty
                  sx={{
                    height: { xs: 28, sm: 36, md: 45 },
                    '& .MuiInputBase-input, & .MuiSelect-select': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                  }}
                >
                  <MenuItem value=""><em>Select Billing Address</em></MenuItem>
                  <MenuItem value="demo">demo</MenuItem>
                  <MenuItem value="address-1">Main Office - Mumbai</MenuItem>
                  <MenuItem value="address-2">Branch Office - Delhi</MenuItem>
                </MuiSelect>
              </FormControl>

              <TextField
                label="Retention(%)"
                placeholder="Retention"
                value={formData.retention}
                onChange={(e) => handleInputChange('retention', e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 100 }}
                sx={{
                  mt: 1,
                  '& .MuiInputBase-input': {
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                  },
                  height: { xs: 28, sm: 36, md: 45 },
                }}
              />

              <TextField
                label="TDS(%)"
                placeholder="TDS"
                value={formData.tds}
                onChange={(e) => handleInputChange('tds', e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 100 }}
                sx={{
                  mt: 1,
                  '& .MuiInputBase-input': {
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                  },
                  height: { xs: 28, sm: 36, md: 45 },
                }}
              />

              {/* Third Row */}
              <TextField
                label="QC(%)"
                placeholder="QC"
                value={formData.qc}
                onChange={(e) => handleInputChange('qc', e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 100 }}
                sx={{
                  mt: 1,
                  '& .MuiInputBase-input': {
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                  },
                  height: { xs: 28, sm: 36, md: 45 },
                }}
              />

              <TextField
                label="Payment Tenure(In Days)"
                placeholder="Payment Tenure"
                value={formData.paymentTenure}
                onChange={(e) => handleInputChange('paymentTenure', e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0 }}
                sx={{
                  mt: 1,
                  '& .MuiInputBase-input': {
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                  },
                  height: { xs: 28, sm: 36, md: 45 },
                }}
              />

              <TextField
                label="Advance Amount"
                placeholder="Advance Amount"
                value={formData.advanceAmount}
                onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0 }}
                sx={{
                  mt: 1,
                  '& .MuiInputBase-input': {
                    padding: { xs: '8px', sm: '10px', md: '12px' },
                  },
                  height: { xs: 28, sm: 36, md: 45 },
                }}
              />

              {/* Full Width Field */}
              <div className="md:col-span-3">
                <TextField
                  label="Related To*"
                  placeholder="Related To"
                  value={formData.relatedTo}
                  onChange={(e) => handleInputChange('relatedTo', e.target.value)}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Details Section Card */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">DETAILS</h2>
            </div>
          </div>
          
          <div className="p-6">
            {detailsForms.map((detailsData, index) => (
              <div key={detailsData.id} className={`${index > 0 ? 'mt-8 pt-8 border-t border-gray-200' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-md font-medium text-foreground">Item {index + 1}</h3>
                  {detailsForms.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDetailsForm(detailsData.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Row */}
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Select Service*</InputLabel>
                  <MuiSelect
                    label="Select Service*"
                    value={detailsData.service}
                    onChange={(e) => handleDetailsChange(detailsData.id, 'service', e.target.value)}
                    displayEmpty
                    sx={{
                      height: { xs: 28, sm: 36, md: 45 },
                      '& .MuiInputBase-input, & .MuiSelect-select': {
                        padding: { xs: '8px', sm: '10px', md: '12px' },
                      },
                    }}
                  >
                    <MenuItem value=""><em>Select Service</em></MenuItem>
                    <MenuItem value="housekeeping">Housekeeping</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="cleaning">Cleaning</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField
                  label="Product Description*"
                  value={detailsData.productDescription}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'productDescription', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="Quantity/Area*"
                  value={detailsData.quantityArea}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'quantityArea', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                {/* Second Row */}
                <TextField
                  label="UOM"
                  value={detailsData.uom}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'uom', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="Expected Date*"
                  value={detailsData.expectedDate instanceof Date ? detailsData.expectedDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'expectedDate', new Date(e.target.value))}
                  fullWidth
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="Rate*"
                  value={detailsData.rate}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'rate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                {/* Third Row */}
                <TextField
                  label="CGST Rate"
                  value={detailsData.cgstRate}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'cgstRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="CGST Amt"
                  value={detailsData.cgstAmt}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'cgstAmt', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="SGST Rate"
                  value={detailsData.sgstRate}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'sgstRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                {/* Fourth Row */}
                <TextField
                  label="SGST Amt"
                  value={detailsData.sgstAmt}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'sgstAmt', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="IGST Rate"
                  value={detailsData.igstRate}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'igstRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="IGST Amt"
                  value={detailsData.igstAmt}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'igstAmt', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                {/* Fifth Row */}
                <TextField
                  label="TCS Rate"
                  value={detailsData.tcsRate}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'tcsRate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="TCS Amt"
                  value={detailsData.tcsAmt}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'tcsAmt', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="Tax Amount"
                  value={detailsData.taxAmount}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'taxAmount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                {/* Sixth Row */}
                <TextField
                  label="Amount"
                  value={detailsData.amount}
                  onChange={(e) => handleDetailsChange(detailsData.id, 'amount', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />

                <TextField
                  label="Total Amount"
                  value={detailsData.totalAmount}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                      backgroundColor: '#f5f5f5',
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />
                </div>
              </div>
            ))}
            
            {/* Add Items Button inside details card */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2"
                onClick={addNewDetailsForm}
              >
                Add Items
              </Button>
            </div>
          </div>
        </div>

        {/* Total Amount Display - Outside the card */}
        <div className="mt-4 flex justify-end">
          <div className="bg-purple-700 text-white px-6 py-2 rounded">
            Total Amount:- 1000
          </div>
        </div>

        {/* Details Section Card */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">DETAILS</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextField
                  label="Kind Attention"
                  placeholder="Kind Attention"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />
              </div>
              
              <div>
                <TextField
                  label="Subject"
                  placeholder="Subject"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mt: 1,
                    '& .MuiInputBase-input': {
                      padding: { xs: '8px', sm: '10px', md: '12px' },
                    },
                    height: { xs: 28, sm: 36, md: 45 },
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <TextField
                  label="Description"
                  placeholder="Enter description here..."
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={6}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 1 }}
                />
              </div>
              
              <div>
                <TextField
                  label="Terms & Conditions"
                  placeholder="Enter terms and conditions here..."
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={6}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 1 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attachments Section Card */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">ATTACHMENTS</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-orange-50">
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer text-gray-600"
              >
                Drag & Drop or <span className="text-red-500 underline">Choose files</span> No file chosen
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            Save Work Order
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderAddPage;