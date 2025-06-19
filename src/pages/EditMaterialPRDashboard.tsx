
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';

export const EditMaterialPRDashboard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [items, setItems] = useState([
    { 
      id: 1, 
      details: 'test asset abc-1223232321',
      sacHsnCode: '',
      productDescription: 'Bricks',
      quantity: '10.0',
      expectedDate: '2025-06-20',
      rate: '100.0',
      amount: '1000.0'
    },
    { 
      id: 2, 
      details: 'AAA-1223232321',
      sacHsnCode: '',
      productDescription: 'test',
      quantity: '10000.0',
      expectedDate: '2025-06-20',
      rate: '10000.0',
      amount: '100000000.0'
    },
    { 
      id: 3, 
      details: 'Select Inventory',
      sacHsnCode: '',
      productDescription: 'Product Description',
      quantity: '',
      expectedDate: '2025-06-20',
      rate: '',
      amount: ''
    }
  ]);

  const addItem = () => {
    setItems([...items, { 
      id: items.length + 1,
      details: 'Select Inventory',
      sacHsnCode: '',
      productDescription: 'Product Description',
      quantity: '',
      expectedDate: '2025-06-20',
      rate: '',
      amount: ''
    }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Material PR &gt; Edit Material PR
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Edit Material PR</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Supplier Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Supplier Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                SUPPLIER DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Supplier*</Label>
                <Select defaultValue="abc-979ghgh">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abc-979ghgh">ABC-979GHGH--</SelectItem>
                    <SelectItem value="godrej">Godrej</SelectItem>
                    <SelectItem value="lt">L&T</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Plant Detail</Label>
                <Select defaultValue="plant1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plant Detail" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plant1">Select Plant Detail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>PR Date*</Label>
                <Input type="date" defaultValue="2025-06-20" />
              </div>
              <div>
                <Label>Billing Address*</Label>
                <Select defaultValue="ower">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ower">ower</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delivery Address*</Label>
                <Select defaultValue="haven">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haven">Haven Infoline LLP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transportation</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div>
                <Label>Retention(%)</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div>
                <Label>TDS(%)</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div>
                <Label>QC(%)</Label>
                <Input placeholder="Enter number" />
              </div>
              <div>
                <Label>Payment Tenure(In Days)</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div>
                <Label>Advance Amount</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div>
                <Label>Related To*</Label>
                <Textarea placeholder="test" className="min-h-[60px]" defaultValue="test" />
              </div>
              <div className="md:col-span-2">
                <Label>Terms & Conditions*</Label>
                <Textarea placeholder="Product should dispatch on time" className="min-h-[100px]" defaultValue="Product should dispatch on time" />
              </div>
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
                  ITEM DETAILS
                </div>
                <Button 
                  onClick={addItem} 
                  size="sm" 
                  className="text-white"
                  style={{ backgroundColor: '#C72030' }}
                >
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
                  
                  <div>
                    <Label>Item Details*</Label>
                    <Select value={item.details} onValueChange={(value) => updateItem(item.id, 'details', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="test asset abc-1223232321">test asset abc-1223232321</SelectItem>
                        <SelectItem value="AAA-1223232321">AAA-1223232321</SelectItem>
                        <SelectItem value="Select Inventory">Select Inventory</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>SAC/HSN Code</Label>
                    <Input 
                      placeholder="Enter Code" 
                      value={item.sacHsnCode}
                      onChange={(e) => updateItem(item.id, 'sacHsnCode', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Product Description*</Label>
                    <Input 
                      placeholder="Product Description" 
                      value={item.productDescription}
                      onChange={(e) => updateItem(item.id, 'productDescription', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Quantity*</Label>
                    <Input 
                      placeholder="Enter Number" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Expected Date*</Label>
                    <Input 
                      type="date" 
                      value={item.expectedDate}
                      onChange={(e) => updateItem(item.id, 'expectedDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Rate*</Label>
                    <Input 
                      placeholder="Enter Number" 
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label>Amount</Label>
                    <Input 
                      placeholder="Enter Number" 
                      value={item.amount}
                      onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">1000</span>
              </div>
            </div>
          </div>

          <Button 
            className="w-full text-white"
            style={{ backgroundColor: '#C72030' }}
            onClick={() => navigate('/finance/material-pr')}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
