
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface AddOccupantUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddOccupantUserModal = ({ isOpen, onClose }: AddOccupantUserModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailId: '',
    gender: '',
    userType: '',
    employeeId: '',
    entity: '',
    accessLevel: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Occupant User data:', formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      firstName: '',
      lastName: '',
      mobileNumber: '',
      emailId: '',
      gender: '',
      userType: '',
      employeeId: '',
      entity: '',
      accessLevel: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-orange-600">CREATE OCCUPANT USER</DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {/* Profile Image Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-yellow-300 rounded-full"></div>
              </div>
              <Button 
                size="sm" 
                className="absolute bottom-0 right-0 bg-purple-700 hover:bg-purple-800 text-white rounded-full w-8 h-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Mobile Number <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                E-mail ID <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="E-mail ID"
                value={formData.emailId}
                onChange={(e) => handleInputChange('emailId', e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Entity</Label>
              <Select value={formData.entity} onValueChange={(value) => handleInputChange('entity', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entity1">Entity 1</SelectItem>
                  <SelectItem value="entity2">Entity 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                User Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Employee ID</Label>
              <Input
                placeholder="Employee ID"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Access Level <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.accessLevel} onValueChange={(value) => handleInputChange('accessLevel', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Access Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Access</SelectItem>
                  <SelectItem value="limited">Limited Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Info Button */}
          <div className="mt-6">
            <Button
              variant="outline"
              className="bg-purple-700 text-white hover:bg-purple-800 border-purple-700"
            >
              + Additional Info
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={handleSubmit}
              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2"
            >
              Submit
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-purple-700 text-purple-700 hover:bg-purple-50 px-8 py-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
