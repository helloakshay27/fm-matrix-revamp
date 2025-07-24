
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface ItemDetail {
  id: string;
  itemDetails: string;
  quantity: string;
  amount: string;
  sacHsnCode: string;
  expectedDate: string;
  productDescription: string;
  rate: string;
}

export const EditMaterialPRDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [supplierDetails, setSupplierDetails] = useState({
    supplier: 'ABC-979GHGH--',
    plantDetail: 'Select Plant Detail',
    prDate: '20/06/2025',
    billingAddress: 'gwer',
    deliveryAddress: 'Haven Infoline LLP',
    transportation: '',
    retention: '',
    tds: '',
    qc: '',
    paymentTenure: '',
    advanceAmount: '',
    relatedTo: 'test',
    termsConditions: 'Product should dispatch on time'
  });

  const [itemDetails, setItemDetails] = useState<ItemDetail[]>([
    {
      id: '1',
      itemDetails: 'test asset abc-1223232321',
      quantity: '10.0',
      amount: '1000.0',
      sacHsnCode: '',
      expectedDate: '20/06/2025',
      productDescription: 'Bricks',
      rate: '100.0'
    },
    {
      id: '2',
      itemDetails: 'AAA-1223232321',
      quantity: '10000.0',
      amount: '1000000000.0',
      sacHsnCode: '',
      expectedDate: '20/06/2025',
      productDescription: 'test',
      rate: '10000.0'
    },
    {
      id: '3',
      itemDetails: 'Select Inventory',
      quantity: '',
      amount: '',
      sacHsnCode: '',
      expectedDate: '20/06/2025',
      productDescription: '',
      rate: ''
    }
  ]);

  const addNewItem = () => {
    const newItem: ItemDetail = {
      id: Date.now().toString(),
      itemDetails: 'Select Inventory',
      quantity: '',
      amount: '',
      sacHsnCode: '',
      expectedDate: '20/06/2025',
      productDescription: '',
      rate: ''
    };
    setItemDetails([...itemDetails, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItemDetails(itemDetails.filter(item => item.id !== itemId));
  };

  const updateItemDetail = (itemId: string, field: keyof ItemDetail, value: string) => {
    setItemDetails(itemDetails.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const updateSupplierDetail = (field: keyof typeof supplierDetails, value: string) => {
    setSupplierDetails({ ...supplierDetails, [field]: value });
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Material PR</h1>
      </div>

      {/* Supplier Details Section */}
      <div className="mb-8 bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold text-sm">
            9
          </div>
          <h2 className="text-lg font-semibold text-[#C72030]">SUPPLIER DETAILS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Supplier*</InputLabel>
            <MuiSelect
              label="Supplier*"
              value={supplierDetails.supplier}
              onChange={(e) => updateSupplierDetail('supplier', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value="ABC-979GHGH--">ABC-979GHGH--</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Plant Detail*</InputLabel>
            <MuiSelect
              label="Plant Detail*"
              value={supplierDetails.plantDetail}
              onChange={(e) => updateSupplierDetail('plantDetail', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value="Select Plant Detail">Select Plant Detail</MenuItem>
            </MuiSelect>
          </FormControl>

          <TextField
            label="PR Date*"
            type="date"
            value={supplierDetails.prDate}
            onChange={(e) => updateSupplierDetail('prDate', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Billing Address*</InputLabel>
            <MuiSelect
              label="Billing Address*"
              value={supplierDetails.billingAddress}
              onChange={(e) => updateSupplierDetail('billingAddress', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value="gwer">gwer</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel shrink>Delivery Address*</InputLabel>
            <MuiSelect
              label="Delivery Address*"
              value={supplierDetails.deliveryAddress}
              onChange={(e) => updateSupplierDetail('deliveryAddress', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value="Haven Infoline LLP">Haven Infoline LLP</MenuItem>
            </MuiSelect>
          </FormControl>

          <TextField
            label="Transportation"
            placeholder="Enter Number"
            value={supplierDetails.transportation}
            onChange={(e) => updateSupplierDetail('transportation', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="Retention(%)"
            placeholder="Enter Number"
            value={supplierDetails.retention}
            onChange={(e) => updateSupplierDetail('retention', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="TDS(%)"
            placeholder="Enter Number"
            value={supplierDetails.tds}
            onChange={(e) => updateSupplierDetail('tds', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="QC(%)"
            placeholder="Enter number"
            value={supplierDetails.qc}
            onChange={(e) => updateSupplierDetail('qc', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="Payment Tenure(In Days)"
            placeholder="Enter Number"
            value={supplierDetails.paymentTenure}
            onChange={(e) => updateSupplierDetail('paymentTenure', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="Advance Amount"
            placeholder="Enter Number"
            value={supplierDetails.advanceAmount}
            onChange={(e) => updateSupplierDetail('advanceAmount', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="Related To*"
            value={supplierDetails.relatedTo}
            onChange={(e) => updateSupplierDetail('relatedTo', e.target.value)}
            fullWidth
            variant="outlined"
            multiline
            minRows={3}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 1 }}
          />

          <div className="md:col-span-2">
            <TextField
              label="Terms & Conditions*"
              value={supplierDetails.termsConditions}
              onChange={(e) => updateSupplierDetail('termsConditions', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Item Details Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold text-sm">
            9
          </div>
          <h2 className="text-lg font-semibold text-[#C72030]">ITEM DETAILS</h2>
        </div>

        <div className="space-y-6">
          {itemDetails.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 relative">
              {itemDetails.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel shrink>Item Details*</InputLabel>
                  <MuiSelect
                    label="Item Details*"
                    value={item.itemDetails}
                    onChange={(e) => updateItemDetail(item.id, 'itemDetails', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="test asset abc-1223232321">test asset abc-1223232321</MenuItem>
                    <MenuItem value="AAA-1223232321">AAA-1223232321</MenuItem>
                    <MenuItem value="Select Inventory">Select Inventory</MenuItem>
                  </MuiSelect>
                </FormControl>

                <TextField
                  label="SAC/HSN Code"
                  placeholder="Enter Code"
                  value={item.sacHsnCode}
                  onChange={(e) => updateItemDetail(item.id, 'sacHsnCode', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Product Description*"
                  value={item.productDescription}
                  onChange={(e) => updateItemDetail(item.id, 'productDescription', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Quantity*"
                  value={item.quantity}
                  onChange={(e) => updateItemDetail(item.id, 'quantity', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Expected Date*"
                  type="date"
                  value={item.expectedDate}
                  onChange={(e) => updateItemDetail(item.id, 'expectedDate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <TextField
                  label="Rate*"
                  value={item.rate}
                  onChange={(e) => updateItemDetail(item.id, 'rate', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />

                <div className="md:col-span-3">
                  <TextField
                    label="Amount"
                    value={item.amount}
                    onChange={(e) => updateItemDetail(item.id, 'amount', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button 
            onClick={addNewItem}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 justify-end">
        <Button 
          variant="outline"
          onClick={() => navigate('/finance/material-pr')}
        >
          Cancel
        </Button>
        <Button 
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
          onClick={() => {
            console.log('Saving Material PR changes...');
            navigate('/finance/material-pr');
          }}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
