import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddFMUserDashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    gender: '',
    employeeId: '',
    department: '',
    selectEntity: '',
    userType: '',
    accessLevel: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission logic here
    navigate('/setup/fm-users');
  };

  const handleCancel = () => {
    navigate('/setup/fm-users');
  };

  return (
    <SetupLayout>
      <div className="p-6 bg-[#f6f4ee] min-h-screen">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Setup</span>
            <span>&gt;</span>
            <span>FM Users</span>
          </div>
          
          <h1 className="text-2xl font-bold text-orange-500 mb-6">CREATE FM USER</h1>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8 max-w-4xl">
            {/* Profile Picture Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Avatar className="w-24 h-24 bg-yellow-400">
                  <AvatarFallback className="bg-yellow-400">
                    <div className="w-full h-full bg-yellow-400 rounded-full" />
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Name */}
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <Label htmlFor="mobileNumber" className="text-sm font-medium text-gray-700">
                  Mobile Number *
                </Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* E-mail ID */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail ID *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Gender */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select Entity */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Select Entity
                </Label>
                <Select value={formData.selectEntity} onValueChange={(value) => handleInputChange('selectEntity', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entity1">Entity 1</SelectItem>
                    <SelectItem value="entity2">Entity 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Employee ID */}
              <div>
                <Label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Department */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Department
                </Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Type */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  User Type
                </Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Access Level */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Access Level *
                </Label>
                <Select value={formData.accessLevel} onValueChange={(value) => handleInputChange('accessLevel', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Access Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="level1">Level 1</SelectItem>
                    <SelectItem value="level2">Level 2</SelectItem>
                    <SelectItem value="level3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Info Button */}
            <div className="mt-8">
              <Button 
                variant="outline" 
                className="bg-purple-700 text-white hover:bg-purple-800 border-purple-700"
              >
                + Additional Info
              </Button>
            </div>

            {/* Form Actions */}
            <div className="flex justify-center gap-4 mt-8">
              <Button 
                onClick={handleSubmit}
                className="bg-purple-700 hover:bg-purple-800 text-white px-8"
              >
                Submit
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline" 
                className="border-purple-700 text-purple-700 hover:bg-purple-50 px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  );
};