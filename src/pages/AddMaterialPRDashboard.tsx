
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

export const AddMaterialPRDashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ id: 1 }]);

  const addItem = () => {
    setItems([...items, { id: items.length + 1 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Material PR &gt; New Material PR
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">NEW MATERIAL PR</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Supplier Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Supplier Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] flex items-center">
                <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                  1
                </h2>
                SUPPLIER DETAILS
              </CardTitle>

            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Supplier*</InputLabel>
                <MuiSelect
                  label="Supplier*"
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
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Delivery Address</em></MenuItem>
                  <MenuItem value="address1">Address 1</MenuItem>
                </MuiSelect>
              </FormControl>

              <TextField
                label="Reference#"
                placeholder="Enter Number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="TDS%"
                placeholder="Enter Number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Payment Terms(In Days)"
                placeholder="Enter Number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <TextField
                label="Advance Amount"
                placeholder="Enter Number"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />

              <div className="md:col-span-2">
                <TextField
                  label="Terms & Conditions*"
                  placeholder=""
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
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center justify-between">
                <div className="flex items-center text-[#C72030]">
                  <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                    2
                  </h2>
                  ITEM DETAILS
                </div>

                <Button onClick={addItem} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg relative">
                  {items.length > 1 && (
                    <Button
                      onClick={() => removeItem(item.id)}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 p-1 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}

                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink>Item Details*</InputLabel>
                    <MuiSelect
                      label="Item Details*"
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value=""><em>Select Inventory</em></MenuItem>
                      <MenuItem value="item1">Item 1</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <TextField
                    label="SAC/HSN Code"
                    placeholder="Enter Code"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Product Description*"
                    placeholder="Product Description"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Each"
                    placeholder="Enter Number"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Quantity*"
                    placeholder="Enter Number"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Expected Date*"
                    type="date"
                    defaultValue="2025-06-14"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />

                  <TextField
                    label="Amount*"
                    placeholder="Enter Number"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#C72030] flex items-center">
                <h2 className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-semibold mr-2">
                  3
                </h2>
                ATTACHMENTS
              </CardTitle>

            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-yellow-400 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Drag & Drop or</span>
                  <button className="text-blue-600 hover:underline ml-1">Choose Files</button>
                  <span className="ml-1">No file chosen</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>PR Date:</span>
                <span className="font-medium">14/06/2025</span>
              </div>
              <div className="flex justify-between">
                <span>Transportation:</span>
                <span className="text-blue-600">Enter Number</span>
              </div>
              <div className="flex justify-between">
                <span>OC(%):</span>
                <span className="text-blue-600">Enter Number</span>
              </div>
              <div className="flex justify-between">
                <span>Related To:</span>
                <span className="text-blue-600">Related To</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Total Amount: {localStorage.getItem('currency')}</h3>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            onClick={() => navigate('/finance/material-pr')}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
