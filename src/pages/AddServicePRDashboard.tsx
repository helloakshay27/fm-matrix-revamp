
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

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
            <CardTitle className="text-orange-600 flex items-center">
              <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
              WORK ORDER DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Select Contractor*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Contractor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contractor1">Contractor 1</SelectItem>
                      <SelectItem value="contractor2">Contractor 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Select Billing Address*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Billing Address" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="address1">Address 1</SelectItem>
                      <SelectItem value="address2">Address 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">QC(%)</Label>
                  <Input placeholder="QC" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Related To*</Label>
                  <Textarea placeholder="Related To" className="min-h-[80px]" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Plant Detail*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Plant Id" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plant1">Plant 1</SelectItem>
                      <SelectItem value="plant2">Plant 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Retention(%)</Label>
                  <Input placeholder="Retention" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Tenure(In Days)</Label>
                  <Input placeholder="Payment Tenure" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Select LOI Date*</Label>
                  <Input type="date" defaultValue="2025-06-14" />
                </div>
                <div>
                  <Label className="text-sm font-medium">TDS(%)</Label>
                  <Input placeholder="TDS" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Advance Amount</Label>
                  <Input placeholder="Advance Amount" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center">
              <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
              DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Select Service*</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service1">Service 1</SelectItem>
                      <SelectItem value="service2">Service 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">UOM</Label>
                  <Input placeholder="UOM" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <Input placeholder="Amount" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Product Description*</Label>
                  <Textarea placeholder="Product Description" className="min-h-[80px]" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Expected Date*</Label>
                  <Input type="date" placeholder="Expected Date" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Amount</Label>
                  <Input placeholder="Total Amount" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Quantity/Area*</Label>
                  <Input placeholder="Quantity" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Rate*</Label>
                  <Input placeholder="Rate" />
                </div>
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
          <CardTitle className="text-orange-600 flex items-center">
            <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">●</span>
            DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium">Kind Attention</Label>
              <Input placeholder="Kind Attention" />
            </div>
            <div>
              <Label className="text-sm font-medium">Subject</Label>
              <Input placeholder="Subject" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <div className="border rounded-md p-3 min-h-[120px] bg-gray-50">
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">A</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 font-bold">B</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 italic">I</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 underline">U</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">=</Button>
                  <Select>
                    <SelectTrigger className="h-6 w-20">
                      <SelectValue placeholder="system-ui" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-ui">system-ui</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea 
                  placeholder="Enter description here..."
                  className="border-0 bg-transparent resize-none min-h-[80px]"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Terms & Conditions</Label>
              <div className="border rounded-md p-3 min-h-[120px] bg-gray-50">
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">A</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 font-bold">B</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 italic">I</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 underline">U</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">=</Button>
                  <Select>
                    <SelectTrigger className="h-6 w-20">
                      <SelectValue placeholder="system-ui" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-ui">system-ui</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea 
                  placeholder="Enter terms and conditions here..."
                  className="border-0 bg-transparent resize-none min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">●</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
