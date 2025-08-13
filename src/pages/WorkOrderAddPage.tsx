import React, { useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
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

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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