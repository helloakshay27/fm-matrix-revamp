
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';

// Mock data for addresses
const addressData = [
  {
    id: 1,
    title: 'demo',
    buildingName: 'Jyoti',
    email: 'slyfesamanergy146@gmail.com',
    state: 'MAHARASHTRA',
    phoneNumber: '7359013258',
    fax: '+91789.894545.565',
    gstNo: 'TGtyJ9676857',
    createdOn: '23/11/2022',
    updatedOn: '23/11/2022'
  }
];

interface NewMeterTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewMeterTypeModal = ({ isOpen, onClose }: NewMeterTypeModalProps) => {
  const [formData, setFormData] = useState({
    meterType: '',
    meterCategory: '',
    unitName: ''
  });

  const handleSubmit = () => {
    console.log('Submitting new meter type:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">New Meter Type</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm">Meter Type</Label>
            <Select value={formData.meterType} onValueChange={(value) => setFormData({...formData, meterType: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="Digital">Digital</SelectItem>
                <SelectItem value="Analog">Analog</SelectItem>
                <SelectItem value="Smart">Smart</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              Meter Category <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.meterCategory}
              onChange={(e) => setFormData({...formData, meterCategory: e.target.value})}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">
              Unit Name <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.unitName}
              onChange={(e) => setFormData({...formData, unitName: e.target.value})}
              placeholder="Enter Unit Name"
              className="bg-white"
            />
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              className="bg-[#8B5A99] hover:bg-[#8B5A99]/90 text-white px-8"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AddressMasterPage = () => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();
  const [newMeterModalOpen, setNewMeterModalOpen] = useState(false);

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [formData, setFormData] = useState({
    addressTitle: '',
    buildingName: '',
    email: '',
    state: '',
    phoneNumber: '',
    faxNumber: '',
    panNumber: '',
    gstNumber: '',
    website: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    pincode: '',
    country: '',
    address: '',
    notes: ''
  });

  const handleAddClick = () => {
    navigate('/settings/masters/address/add');
  };

  const handleEditClick = (address) => {
    console.log('Edit address:', address);
    navigate('/settings/masters/address/edit', { 
      state: { addressData: address } 
    });
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] p-6">
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADDRESS MASTER</h1>

        {/* Address Setup Form */}
        <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between text-left font-semibold p-4 h-auto"
            >
              <span>Address Setup</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isFormOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 mt-4">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="addressTitle">Address Title*</Label>
                  <Input
                    id="addressTitle"
                    placeholder="Enter title"
                    value={formData.addressTitle}
                    onChange={(e) => setFormData({...formData, addressTitle: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buildingName">Building Name*</Label>
                  <Input
                    id="buildingName"
                    placeholder="Enter building name"
                    value={formData.buildingName}
                    onChange={(e) => setFormData({...formData, buildingName: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAHARASHTRA">MAHARASHTRA</SelectItem>
                      <SelectItem value="KARNATAKA">KARNATAKA</SelectItem>
                      <SelectItem value="GUJARAT">GUJARAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number*</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faxNumber">Fax Number</Label>
                  <Input
                    id="faxNumber"
                    placeholder="Enter fax number"
                    value={formData.faxNumber}
                    onChange={(e) => setFormData({...formData, faxNumber: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    placeholder="Enter GST number"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="Enter website URL"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1*</Label>
                  <Input
                    id="addressLine1"
                    placeholder="Enter address line 1"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Enter address line 2"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="Enter landmark"
                    value={formData.landmark}
                    onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pin Code*</Label>
                  <Input
                    id="pincode"
                    placeholder="Enter pin code"
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country*</Label>
                  <Input
                    id="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSubmit} className="bg-[#C72030] hover:bg-[#C72030]/90">
                  Save
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Existing Addresses Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Existing Addresses</h2>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f4ee]">
                <TableHead className="font-medium">Title</TableHead>
                <TableHead className="font-medium">Building Name</TableHead>
                <TableHead className="font-medium">Email</TableHead>
                <TableHead className="font-medium">State</TableHead>
                <TableHead className="font-medium">Phone Number</TableHead>
                <TableHead className="font-medium">Fax</TableHead>
                <TableHead className="font-medium">GST No.</TableHead>
                <TableHead className="font-medium">Created On</TableHead>
                <TableHead className="font-medium">Updated On</TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addressData.map((address) => (
                <TableRow key={address.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{address.title}</TableCell>
                  <TableCell>{address.buildingName}</TableCell>
                  <TableCell>{address.email}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.phoneNumber}</TableCell>
                  <TableCell>{address.fax}</TableCell>
                  <TableCell>{address.gstNo}</TableCell>
                  <TableCell>{address.createdOn}</TableCell>
                  <TableCell>{address.updatedOn}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setNewMeterModalOpen(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <NewMeterTypeModal
          isOpen={newMeterModalOpen}
          onClose={() => setNewMeterModalOpen(false)}
        />
      </div>
    </div>
  );
};
