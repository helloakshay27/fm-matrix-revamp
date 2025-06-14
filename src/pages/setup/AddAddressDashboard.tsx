
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

export const AddAddressDashboard = () => {
  const [formData, setFormData] = useState({
    addressTitle: '',
    buildingName: '',
    email: '',
    state: '',
    phoneNumber: '',
    faxNumber: '',
    panNumber: '',
    gstNumber: '',
    address: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Submitting address:', formData);
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Addresses</span>
          <span>&gt;</span>
          <span>New Address</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADDRESSES</h1>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-orange-600 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm">
                  2
                </span>
                ADDRESS SETUP
              </CardTitle>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="addressTitle" className="text-sm font-medium text-gray-700">
                  Address Title*
                </Label>
                <Input
                  id="addressTitle"
                  placeholder="Enter Address Title"
                  value={formData.addressTitle}
                  onChange={(e) => handleInputChange('addressTitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buildingName" className="text-sm font-medium text-gray-700">
                  Building Name*
                </Label>
                <Input
                  id="buildingName"
                  placeholder="Enter Building Name"
                  value={formData.buildingName}
                  onChange={(e) => handleInputChange('buildingName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="faxNumber" className="text-sm font-medium text-gray-700">
                  Fax Number
                </Label>
                <Input
                  id="faxNumber"
                  placeholder="Enter Fax Number"
                  value={formData.faxNumber}
                  onChange={(e) => handleInputChange('faxNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="panNumber" className="text-sm font-medium text-gray-700">
                  Pan Number
                </Label>
                <Input
                  id="panNumber"
                  placeholder="Enter PAN Number"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstNumber" className="text-sm font-medium text-gray-700">
                  GST Number
                </Label>
                <Input
                  id="gstNumber"
                  placeholder="Enter GST Number"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  State*
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Input
                  id="address"
                  placeholder="Enter Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmit}
                className="bg-purple-700 hover:bg-purple-800 text-white px-8"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SetupLayout>
  );
};
