
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface AddInboundFormProps {
  onClose: () => void;
}

export const AddInboundForm: React.FC<AddInboundFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    vendor: '',
    dateOfReceiving: '',
    recipient: '',
    sender: '',
    mobile: '',
    awbNumber: '',
    company: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    pincode: '',
    type: '',
    attachments: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating inbound entry:', formData);
    // Add logic to create inbound entry
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, attachments: file }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Details Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
          <h3 className="text-lg font-semibold text-orange-500">BASIC DETAILS</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vendor">Vendor *</Label>
            <div className="flex gap-2">
              <Input
                id="vendor"
                placeholder="Select Vendor"
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                className="flex-1"
              />
              <Button type="button" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                + Add Vendor
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="dateOfReceiving">Date of Receiving</Label>
            <Input
              id="dateOfReceiving"
              type="date"
              placeholder="Select Date"
              value={formData.dateOfReceiving}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfReceiving: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Package Details Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
          <h3 className="text-lg font-semibold text-orange-500">PACKAGE DETAILS</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipient">Recipient *</Label>
            <Input
              id="recipient"
              placeholder="Select Recipient"
              value={formData.recipient}
              onChange={(e) => setFormData(prev => ({ ...prev, recipient: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="sender">Sender *</Label>
            <Input
              id="sender"
              placeholder="Enter Sender's Name"
              value={formData.sender}
              onChange={(e) => setFormData(prev => ({ ...prev, sender: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              placeholder="Enter Sender's Mobile"
              value={formData.mobile}
              onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="awbNumber">AWB Number</Label>
            <Input
              id="awbNumber"
              placeholder="Enter AWB Number"
              value={formData.awbNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, awbNumber: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              placeholder="Enter Company's Name"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="addressLine1">Company's Address Line 1 *</Label>
            <Input
              id="addressLine1"
              placeholder="Enter Company's Address Line 1"
              value={formData.addressLine1}
              onChange={(e) => setFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="addressLine2">Company's Address Line 2</Label>
            <Input
              id="addressLine2"
              placeholder="Enter Company's Address Line 2"
              value={formData.addressLine2}
              onChange={(e) => setFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              placeholder="Select State"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter City"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="type">Type *</Label>
            <Input
              id="type"
              placeholder="Select Type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="attachments">Attachments</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <input
              type="file"
              id="attachments"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="attachments" className="cursor-pointer">
              <div className="text-gray-500">Choose File No file chosen</div>
            </label>
          </div>
        </div>
      </div>

      {/* Package Button */}
      <div className="flex justify-start">
        <Button type="button" className="bg-purple-600 hover:bg-purple-700 text-white">
          + Package
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button
          type="button"
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          Create Package
        </Button>
        <Button
          type="button"
          variant="outline"
          className="px-8"
        >
          Save And Create New Package
        </Button>
      </div>
    </form>
  );
};
