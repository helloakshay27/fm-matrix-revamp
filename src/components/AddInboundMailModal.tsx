
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AddInboundMailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddInboundMailModal = ({ isOpen, onClose }: AddInboundMailModalProps) => {
  const [formData, setFormData] = useState({
    vendor: '',
    dateOfReceiving: '',
    recipient: '',
    sender: '',
    mobile: '',
    awbNumber: '',
    company: '',
    companyAddressLine1: '',
    companyAddressLine2: '',
    state: '',
    city: '',
    pincode: '',
    type: '',
    attachments: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, attachments: file }));
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">NEW INBOUND</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">A</div>
              <h3 className="text-lg font-semibold text-orange-500">BASIC DETAILS</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor">Vendor *</Label>
                <div className="flex gap-2">
                  <Select value={formData.vendor} onValueChange={(value) => handleInputChange('vendor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bluedart">Bluedart</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                    Add Vendor
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="dateOfReceiving">Date of Receiving *</Label>
                <Input
                  id="dateOfReceiving"
                  type="date"
                  value={formData.dateOfReceiving}
                  onChange={(e) => handleInputChange('dateOfReceiving', e.target.value)}
                  placeholder="Select Date"
                />
              </div>
            </div>
          </div>

          {/* Package Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">B</div>
              <h3 className="text-lg font-semibold text-orange-500">PACKAGE DETAILS</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="recipient">Recipient *</Label>
                <Select value={formData.recipient} onValueChange={(value) => handleInputChange('recipient', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sony-bhoite">Sony Bhoite</SelectItem>
                    <SelectItem value="adhip-shetty">Adhip Shetty</SelectItem>
                    <SelectItem value="vinayak-mane">Vinayak Mane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sender">Sender *</Label>
                <Input
                  id="sender"
                  value={formData.sender}
                  onChange={(e) => handleInputChange('sender', e.target.value)}
                  placeholder="Enter Sender's Name"
                />
              </div>
              
              <div>
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="Enter Sender's Mobile"
                />
              </div>
              
              <div>
                <Label htmlFor="awbNumber">AWB Number</Label>
                <Input
                  id="awbNumber"
                  value={formData.awbNumber}
                  onChange={(e) => handleInputChange('awbNumber', e.target.value)}
                  placeholder="Enter AWB Number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter Company's Name"
                />
              </div>
              
              <div>
                <Label htmlFor="companyAddressLine1">Company's Address Line 1 *</Label>
                <Input
                  id="companyAddressLine1"
                  value={formData.companyAddressLine1}
                  onChange={(e) => handleInputChange('companyAddressLine1', e.target.value)}
                  placeholder="Enter Company's Address Line 1"
                />
              </div>
              
              <div>
                <Label htmlFor="companyAddressLine2">Company's Address Line 2</Label>
                <Input
                  id="companyAddressLine2"
                  value={formData.companyAddressLine2}
                  onChange={(e) => handleInputChange('companyAddressLine2', e.target.value)}
                  placeholder="Enter Company's Address Line 2"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter City"
                />
              </div>
              
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="Enter Pincode"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mail">Mail</SelectItem>
                    <SelectItem value="package">Package</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="attachments">Attachments</Label>
              <div className="mt-2">
                <input
                  type="file"
                  id="attachments"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('attachments')?.click()}
                  className="text-red-500 border-red-500 hover:bg-red-50"
                >
                  Choose File
                </Button>
                <span className="ml-2 text-sm text-gray-500">
                  {formData.attachments ? formData.attachments.name : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          {/* Package Button */}
          <div className="flex justify-start">
            <Button variant="outline" className="bg-purple-600 text-white hover:bg-purple-700">
              + Package
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button 
              onClick={handleSubmit}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Create Package
            </Button>
            <Button 
              variant="outline"
              onClick={handleSubmit}
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Save And Create New Package
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInboundMailModal;
