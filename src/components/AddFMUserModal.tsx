
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface AddFMUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFMUserModal = ({ isOpen, onClose }: AddFMUserModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    gender: '',
    entity: '',
    supplier: '',
    employeeId: '',
    baseSite: '',
    baseUnit: '',
    department: '',
    emailPreference: '',
    designation: '',
    userType: '',
    role: '',
    accessLevel: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Adding FM User:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold">ADD FM USER</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Supplier</Label>
              <Select value={formData.supplier} onValueChange={(value) => handleInputChange('supplier', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">Supplier 1</SelectItem>
                  <SelectItem value="supplier2">Supplier 2</SelectItem>
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
              <Label className="text-sm font-medium">Base Site</Label>
              <Select value={formData.baseSite} onValueChange={(value) => handleInputChange('baseSite', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Base Site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="site1">Site 1</SelectItem>
                  <SelectItem value="site2">Site 2</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-red-500 text-xs">Select Base Site</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Base Unit</Label>
              <Select value={formData.baseUnit} onValueChange={(value) => handleInputChange('baseUnit', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Base Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit1">Unit 1</SelectItem>
                  <SelectItem value="unit2">Unit 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">IT</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Email Preference</Label>
              <Select value={formData.emailPreference} onValueChange={(value) => handleInputChange('emailPreference', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Email Preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Emails</SelectItem>
                  <SelectItem value="important">Important Only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Designation</Label>
              <Input
                placeholder="Designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                className="border-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select User Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Role <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Access Level <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.accessLevel} onValueChange={(value) => handleInputChange('accessLevel', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Access Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="site">Site</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
