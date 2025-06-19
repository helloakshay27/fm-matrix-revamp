
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
    selectEntity: '',
    supplier: '',
    employeeId: '',
    baseSite: '',
    selectBaseUnit: '',
    selectDepartment: '',
    selectEmailPreference: '',
    designation: '',
    selectUserType: '',
    selectRole: '',
    selectAccessLevel: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('FM User data:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
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
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Select value={formData.selectEntity} onValueChange={(value) => handleInputChange('selectEntity', value)}>
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
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Base Unit</Label>
              <Select value={formData.selectBaseUnit} onValueChange={(value) => handleInputChange('selectBaseUnit', value)}>
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
              <Select value={formData.selectDepartment} onValueChange={(value) => handleInputChange('selectDepartment', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dept1">Department 1</SelectItem>
                  <SelectItem value="dept2">Department 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Email Preference</Label>
              <Select value={formData.selectEmailPreference} onValueChange={(value) => handleInputChange('selectEmailPreference', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Email Preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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
              <Select value={formData.selectUserType} onValueChange={(value) => handleInputChange('selectUserType', value)}>
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
              <Label className="text-sm font-medium">
                Select Role <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.selectRole} onValueChange={(value) => handleInputChange('selectRole', value)}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Access Level <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.selectAccessLevel} onValueChange={(value) => handleInputChange('selectAccessLevel', value)}>
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

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
