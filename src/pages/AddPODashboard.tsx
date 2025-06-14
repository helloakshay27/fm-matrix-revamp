
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from 'react-router-dom';

export const AddPODashboard = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    materialPR: '',
    supplier: '',
    plantDetail: '',
    poDate: '',
    billingAddress: '',
    deliveryAddress: '',
    relatedTo: '',
    retention: '',
    tds: '',
    qc: '',
    paymentTenure: '',
    advanceAmount: '',
    termsConditions: '',
    attachment: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, attachment: file });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        PO
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">NEW PURCHASE ORDER</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Supplier Details Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📋</span>
            </div>
            <h2 className="text-lg font-semibold text-blue-600">SUPPLIER DETAILS</h2>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Material PR: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.materialPR}
                onValueChange={(value) => setFormData({ ...formData, materialPR: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pr1">PR-001</SelectItem>
                  <SelectItem value="pr2">PR-002</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Supplier: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.supplier}
                onValueChange={(value) => setFormData({ ...formData, supplier: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">ABC Corp</SelectItem>
                  <SelectItem value="supplier2">XYZ Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Plant Detail: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.plantDetail}
                onValueChange={(value) => setFormData({ ...formData, plantDetail: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plant1">Plant 1</SelectItem>
                  <SelectItem value="plant2">Plant 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                PO Date: <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formData.poDate}
                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                placeholder="mm/dd/yyyy"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Billing Address: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.billingAddress}
                onValueChange={(value) => setFormData({ ...formData, billingAddress: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="address1">Address 1</SelectItem>
                  <SelectItem value="address2">Address 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Delivery Address: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.deliveryAddress}
                onValueChange={(value) => setFormData({ ...formData, deliveryAddress: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery1">Delivery 1</SelectItem>
                  <SelectItem value="delivery2">Delivery 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Related To
              </Label>
              <Input
                value={formData.relatedTo}
                onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Retention(%)
              </Label>
              <Input
                value={formData.retention}
                onChange={(e) => setFormData({ ...formData, retention: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                TDS(%)
              </Label>
              <Input
                value={formData.tds}
                onChange={(e) => setFormData({ ...formData, tds: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                QC(%)
              </Label>
              <Input
                value={formData.qc}
                onChange={(e) => setFormData({ ...formData, qc: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Payment Tenure(in Days)
              </Label>
              <Input
                value={formData.paymentTenure}
                onChange={(e) => setFormData({ ...formData, paymentTenure: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Advance Amount
              </Label>
              <Input
                value={formData.advanceAmount}
                onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Terms & Conditions
            </Label>
            <Textarea
              value={formData.termsConditions}
              onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
              placeholder="Enter..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Item Details Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📝</span>
            </div>
            <h2 className="text-lg font-semibold text-blue-600">ITEM DETAILS</h2>
          </div>

          <Button 
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white mb-4"
          >
            Add Item
          </Button>

          {/* Items table would go here - simplified for now */}
          <div className="border rounded-lg p-4 text-center text-gray-500">
            Items will be displayed here after adding
          </div>
        </div>

        {/* Attachment Section */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">📎</span>
            </div>
            <h2 className="text-lg font-semibold text-blue-600">Attachment</h2>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Attachment:
            </Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <span className="text-sm text-gray-500">
                {formData.attachment ? formData.attachment.name : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
