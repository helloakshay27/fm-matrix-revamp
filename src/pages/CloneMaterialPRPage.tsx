import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MaterialDatePicker } from "@/components/ui/material-date-picker";
import { X } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';

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

export const CloneMaterialPRPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [supplierDetails, setSupplierDetails] = useState({
    supplier: 'ABC',
    plantDetail: '1212323234-Default Sale Org-Plant for Lockated Site 1',
    prDate: '20/06/2025',
    billingAddress: 'Title 3',
    deliveryAddress: 'Title 3',
    transportation: '',
    retention: '',
    tds: '',
    qc: '',
    paymentTenure: '',
    advanceAmount: '',
    relatedTo: 'Test',
    termsConditions: 'Test'
  });

  const [itemDetails, setItemDetails] = useState<ItemDetail[]>([
    {
      id: '1',
      itemDetails: 'A4 Size Papers 3-1223332321',
      quantity: '10.0',
      amount: '1000.0',
      sacHsnCode: '',
      expectedDate: '20/06/2025',
      productDescription: 'Test',
      rate: '100.0'
    },
    {
      id: '2',
      itemDetails: 'Select Inventory',
      quantity: '',
      amount: '',
      sacHsnCode: '',
      expectedDate: '20/06/2025',
      productDescription: 'Product Description',
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
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Material PR &gt; New Material PR
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">NEW MATERIAL PR</h1>
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
          <div>
            <Label className="text-sm font-medium">Supplier*</Label>
            <Select value={supplierDetails.supplier} onValueChange={(value) => updateSupplierDetail('supplier', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABC">ABC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Plant Detail*</Label>
            <Select value={supplierDetails.plantDetail} onValueChange={(value) => updateSupplierDetail('plantDetail', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1212323234-Default Sale Org-Plant for Lockated Site 1">1212323234-Default Sale Org-Plant for Lockated Site 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">PR Date*</Label>
            <MaterialDatePicker
              value={supplierDetails.prDate}
              onChange={(value) => updateSupplierDetail('prDate', value)}
              placeholder="Select PR Date"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Billing Address*</Label>
            <Select value={supplierDetails.billingAddress} onValueChange={(value) => updateSupplierDetail('billingAddress', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Title 3">Title 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Delivery Address*</Label>
            <Select value={supplierDetails.deliveryAddress} onValueChange={(value) => updateSupplierDetail('deliveryAddress', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Title 3">Title 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Transportation</Label>
            <Input
              placeholder="Enter Number"
              value={supplierDetails.transportation}
              onChange={(e) => updateSupplierDetail('transportation', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Retention(%)</Label>
            <Input
              placeholder="Enter Number"
              value={supplierDetails.retention}
              onChange={(e) => updateSupplierDetail('retention', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">TDS(%)</Label>
            <Input
              placeholder="Enter Number"
              value={supplierDetails.tds}
              onChange={(e) => updateSupplierDetail('tds', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">QC(%)</Label>
            <Input
              placeholder="Enter number"
              value={supplierDetails.qc}
              onChange={(e) => updateSupplierDetail('qc', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Payment Tenure(In Days)</Label>
            <Input
              placeholder="Enter Number"
              value={supplierDetails.paymentTenure}
              onChange={(e) => updateSupplierDetail('paymentTenure', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Advance Amount</Label>
            <Input
              placeholder="Enter Number"
              value={supplierDetails.advanceAmount}
              onChange={(e) => updateSupplierDetail('advanceAmount', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Related To*</Label>
            <Textarea
              value={supplierDetails.relatedTo}
              onChange={(e) => updateSupplierDetail('relatedTo', e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="text-sm font-medium">Terms & Conditions*</Label>
            <Textarea
              value={supplierDetails.termsConditions}
              onChange={(e) => updateSupplierDetail('termsConditions', e.target.value)}
              className="mt-1 min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Item Details Section */}
      <div className="bg-white rounded-lg border p-6 mb-8">
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
                <div>
                  <Label className="text-sm font-medium">Item Details*</Label>
                  <Select 
                    value={item.itemDetails} 
                    onValueChange={(value) => updateItemDetail(item.id, 'itemDetails', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4 Size Papers 3-1223332321">A4 Size Papers 3-1223332321</SelectItem>
                      <SelectItem value="Select Inventory">Select Inventory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">SAC/HSN Code</Label>
                  <Input
                    placeholder="Enter Code"
                    value={item.sacHsnCode}
                    onChange={(e) => updateItemDetail(item.id, 'sacHsnCode', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Product Description*</Label>
                  <Input
                    value={item.productDescription}
                    onChange={(e) => updateItemDetail(item.id, 'productDescription', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Quantity*</Label>
                  <Input
                    value={item.quantity}
                    onChange={(e) => updateItemDetail(item.id, 'quantity', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Expected Date*</Label>
                  <MaterialDatePicker
                    value={item.expectedDate}
                    onChange={(value) => updateItemDetail(item.id, 'expectedDate', value)}
                    placeholder="Select Expected Date"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Rate*</Label>
                  <Input
                    value={item.rate}
                    onChange={(e) => updateItemDetail(item.id, 'rate', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-3">
                  <Label className="text-sm font-medium">Amount</Label>
                  <Input
                    value={item.amount}
                    onChange={(e) => updateItemDetail(item.id, 'amount', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Button 
            onClick={addNewItem}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            Add Item
          </Button>
          <div className="bg-[#C72030] text-white px-4 py-2 rounded text-sm">
            Total Amount: - 1000
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center text-white font-bold text-sm">
            9
          </div>
          <h2 className="text-lg font-semibold text-[#C72030]">ATTACHMENTS</h2>
        </div>

        <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
          <p className="text-gray-600">Drag & Drop or <span className="text-orange-500 cursor-pointer">Choose File</span> No file chosen</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button 
          variant="outline"
          onClick={() => navigate('/finance/material-pr')}
        >
          Cancel
        </Button>
        <Button 
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
          onClick={() => {
            console.log('Submitting cloned Material PR...');
            navigate('/finance/material-pr');
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
