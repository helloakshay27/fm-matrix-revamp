
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Edit, Plus, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MasterLayout } from '@/components/MasterLayout';

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

export const AddressMasterPage = () => {
  const navigate = useNavigate();
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
    <MasterLayout>
      <div className="w-full min-h-screen bg-[#fafafa] p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">ADDRESS MASTER</h1>

          {/* Address Setup Form */}
          <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">ADDRESS SETUP</CardTitle>
                    <ChevronDown className={`h-5 w-5 transition-transform ${isFormOpen ? 'rotate-180' : ''}`} />
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="addressTitle">Address Title*</Label>
                      <Input
                        id="addressTitle"
                        value={formData.addressTitle}
                        onChange={(e) => setFormData({...formData, addressTitle: e.target.value})}
                        placeholder="Enter address title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="buildingName">Building Name*</Label>
                      <Input
                        id="buildingName"
                        value={formData.buildingName}
                        onChange={(e) => setFormData({...formData, buildingName: e.target.value})}
                        placeholder="Enter building name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State*</Label>
                      <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MAHARASHTRA">MAHARASHTRA</SelectItem>
                          <SelectItem value="GUJARAT">GUJARAT</SelectItem>
                          <SelectItem value="RAJASTHAN">RAJASTHAN</SelectItem>
                          <SelectItem value="KARNATAKA">KARNATAKA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number*</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="faxNumber">Fax Number</Label>
                      <Input
                        id="faxNumber"
                        value={formData.faxNumber}
                        onChange={(e) => setFormData({...formData, faxNumber: e.target.value})}
                        placeholder="Enter fax number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input
                        id="panNumber"
                        value={formData.panNumber}
                        onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                        placeholder="Enter PAN number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number</Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                        placeholder="Enter GST number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Enter complete address"
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Enter additional notes"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleSubmit}
                      className="bg-[#C72030] hover:bg-[#C72030]/90"
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Existing Addresses Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Existing Addresses</CardTitle>
              <Button 
                onClick={handleAddClick}
                className="bg-[#C72030] hover:bg-[#C72030]/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#f6f4ee]">
                      <TableHead>Action</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Building Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Fax</TableHead>
                      <TableHead>GST No.</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Updated On</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {addressData.map((address) => (
                      <TableRow key={address.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditClick(address)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{address.title}</TableCell>
                        <TableCell>{address.buildingName}</TableCell>
                        <TableCell>{address.email}</TableCell>
                        <TableCell>{address.state}</TableCell>
                        <TableCell>{address.phoneNumber}</TableCell>
                        <TableCell>{address.fax}</TableCell>
                        <TableCell>{address.gstNo}</TableCell>
                        <TableCell>{address.createdOn}</TableCell>
                        <TableCell>{address.updatedOn}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MasterLayout>
  );
};
