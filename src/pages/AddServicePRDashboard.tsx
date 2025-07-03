
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddServicePRDashboard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleAddItems = () => {
    setCurrentStep(2);
  };

  const handleSubmit = () => {
    console.log('Service PR submitted');
    navigate('/finance/service-pr');
  };

  if (currentStep === 1) {
    return (
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          Service PR &gt; New Service PR
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">NEW SERVICE PR</h1>

        {/* Work Order Details Section */}
        <Card className="mb-6">
          <CardHeader>
           <CardTitle className="text-[#C72030] flex items-center">
  <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
    1
  </h2>
  WORK ORDER DETAILS
</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Select Contractor*</InputLabel>
                  <MuiSelect
                    label="Select Contractor*"
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Contractor</em></MenuItem>
                    <MenuItem value="contractor1">Contractor 1</MenuItem>
                    <MenuItem value="contractor2">Contractor 2</MenuItem>
                  </MuiSelect>
                </FormControl>
                
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Select Billing Address*</InputLabel>
                  <MuiSelect
                    label="Select Billing Address*"
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Billing Address</em></MenuItem>
                    <MenuItem value="address1">Address 1</MenuItem>
                    <MenuItem value="address2">Address 2</MenuItem>
                  </MuiSelect>
                </FormControl>
                
                <TextField
                  label="QC(%)"
                  placeholder="QC"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
                
                <TextField
                  label="Related To*"
                  placeholder="Related To"
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={3}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 1 }}
                />
              </div>

              <div className="space-y-4">
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Plant Detail*</InputLabel>
                  <MuiSelect
                    label="Plant Detail*"
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Plant Id</em></MenuItem>
                    <MenuItem value="plant1">Plant 1</MenuItem>
                    <MenuItem value="plant2">Plant 2</MenuItem>
                  </MuiSelect>
                </FormControl>
                
                <TextField
                  label="Retention(%)"
                  placeholder="Retention"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
                
                <TextField
                  label="Payment Tenure(In Days)"
                  placeholder="Payment Tenure"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
              </div>

              <div className="space-y-4">
                <TextField
                  label="Select LOI Date*"
                  type="date"
                  defaultValue="2025-06-14"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
                
                <TextField
                  label="TDS(%)"
                  placeholder="TDS"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
                
                <TextField
                  label="Advance Amount"
                  placeholder="Advance Amount"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#C72030] flex items-center">
              <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Select Service*</InputLabel>
                  <MuiSelect
                    label="Select Service*"
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select Service</em></MenuItem>
                    <MenuItem value="service1">Service 1</MenuItem>
                    <MenuItem value="service2">Service 2</MenuItem>
                  </MuiSelect>
                </FormControl>
                
                <TextField
                  label="UOM"
                  placeholder="UOM"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
                
                <TextField
                  label="Amount"
                  placeholder="Amount"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
              </div>

              <div className="space-y-4">
                <TextField
                  label="Product Description*"
                  placeholder="Product Description"
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={3}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 1 }}
                />
                
                <TextField
                  label="Expected Date*"
                  type="date"
                  placeholder="Expected Date"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
                
                <TextField
                  label="Total Amount"
                  placeholder="Total Amount"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
              </div>

              <div className="space-y-4">
                <TextField
                  label="Quantity/Area*"
                  placeholder="Quantity"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
                
                <TextField
                  label="Rate*"
                  placeholder="Rate"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
                
                <div className="flex justify-end">
                  <Button variant="ghost" className="text-gray-500">
                    ✕
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Items Button */}
        <div className="mb-6">
          <Button 
            onClick={handleAddItems}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Add Items
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Add Items Button and Total Amount */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setCurrentStep(1)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Add Items
        </Button>
        <div className="bg-purple-600 text-white px-4 py-2 rounded">
          Total Amount: {totalAmount}
        </div>
      </div>

      {/* Details Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#C72030] flex items-center">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">●</span>
            DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField
              label="Kind Attention"
              placeholder="Kind Attention"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
            
            <TextField
              label="Subject"
              placeholder="Subject"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              sx={{ mt: 1 }}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <TextField
                label="Description"
                placeholder="Enter description here..."
                fullWidth
                variant="outlined"
                multiline
                minRows={6}
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
                minRows={6}
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 1 }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-[#C72030] flex items-center">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">●</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 mb-2">Drag & Drop or</p>
            <Button variant="outline" className="text-blue-600">
              Choose Files
            </Button>
            <p className="text-gray-400 text-sm mt-2">No file chosen</p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
