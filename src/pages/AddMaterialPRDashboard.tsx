
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
    <div className="p-6 max-w-7xl mx-auto">
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
              <CardTitle className="text-orange-600 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
                SUPPLIER DETAILS
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Supplier*</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abc">ABC</SelectItem>
                    <SelectItem value="godrej">Godrej</SelectItem>
                    <SelectItem value="lt">L&T</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Plant Detail</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plant Detail" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plant1">Plant 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Billing Address*</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Billing Address" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address1">Address 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delivery Address*</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Delivery Address" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address1">Address 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reference#</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div>
                <Label>TDS%</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div>
                <Label>Payment Terms(In Days)</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div>
                <Label>Advance Amount</Label>
                <Input placeholder="Enter Number" />
              </div>
              <div className="md:col-span-2">
                <Label>Terms & Conditions*</Label>
                <Textarea placeholder="" className="min-h-[100px]" />
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
                  
                  <div>
                    <Label>Item Details*</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Inventory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="item1">Item 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>SAC/HSN Code</Label>
                    <Input placeholder="Enter Code" />
                  </div>
                  
                  <div>
                    <Label>Product Description*</Label>
                    <Input placeholder="Product Description" />
                  </div>
                  
                  <div>
                    <Label>Each</Label>
                    <Input placeholder="Enter Number" />
                  </div>
                  
                  <div>
                    <Label>Quantity*</Label>
                    <Input placeholder="Enter Number" />
                  </div>
                  
                  <div>
                    <Label>Expected Date*</Label>
                    <Input type="date" defaultValue="2025-06-14" />
                  </div>
                  
                  <div>
                    <Label>Amount*</Label>
                    <Input placeholder="Enter Number" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center">
                <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
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
            <h3 className="font-medium mb-2">Total Amount: ₹</h3>
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
