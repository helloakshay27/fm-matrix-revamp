import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MasterLayout } from '@/components/MasterLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft } from 'lucide-react';

export const AddFMUserPage = () => {
  const navigate = useNavigate();
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
    designation: '',
    selectUserType: '',
    selectRole: '',
    selectAccessLevel: '',
    selectEmailPreference: '',
    userType: 'internal',
    dailyHelpdeskReport: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Add API call here
    navigate('/master/user/fm-users');
  };

  const handleCancel = () => {
    navigate('/master/user/fm-users');
  };

  return (
    <MasterLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          Master &gt; User Master &gt; FM User &gt; Add FM User
        </div>

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/master/user/fm-users')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Add FM User</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <Button variant="outline" className="w-full">
                    Upload Picture
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Upload a profile picture (JPG, PNG up to 2MB)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address *</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Organization Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Organization Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Entity *</Label>
                      <Select onValueChange={(value) => handleInputChange('selectEntity', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select entity" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="headquarters">Headquarters</SelectItem>
                          <SelectItem value="branch">Branch Office</SelectItem>
                          <SelectItem value="regional">Regional Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Supplier</Label>
                      <Select onValueChange={(value) => handleInputChange('supplier', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="supplier1">Tech Solutions Ltd</SelectItem>
                          <SelectItem value="supplier2">Maintenance Corp</SelectItem>
                          <SelectItem value="supplier3">Internal Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Employee ID</Label>
                      <Input
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange('employeeId', e.target.value)}
                        placeholder="Enter employee ID"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Base Site</Label>
                      <Select onValueChange={(value) => handleInputChange('baseSite', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select base site" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="site1">Site 1</SelectItem>
                          <SelectItem value="site2">Site 2</SelectItem>
                          <SelectItem value="site3">Site 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Select Base Unit</Label>
                      <Select onValueChange={(value) => handleInputChange('selectBaseUnit', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select base unit" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="unit-a101">Unit A-101</SelectItem>
                          <SelectItem value="unit-b205">Unit B-205</SelectItem>
                          <SelectItem value="unit-c301">Unit C-301</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Department</Label>
                      <Select onValueChange={(value) => handleInputChange('selectDepartment', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="admin">Administration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Role and Access Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Role & Access Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Designation</Label>
                      <Input
                        value={formData.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        placeholder="Enter designation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Select User Type</Label>
                      <Select onValueChange={(value) => handleInputChange('selectUserType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Select Role *</Label>
                      <Select onValueChange={(value) => handleInputChange('selectRole', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="senior-technician">Senior Technician</SelectItem>
                          <SelectItem value="facility-manager">Facility Manager</SelectItem>
                          <SelectItem value="maintenance-staff">Maintenance Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Access Level</Label>
                      <Select onValueChange={(value) => handleInputChange('selectAccessLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select access level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="level1">Level 1</SelectItem>
                          <SelectItem value="level2">Level 2</SelectItem>
                          <SelectItem value="level3">Level 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label>Select Email Preference</Label>
                    <Select onValueChange={(value) => handleInputChange('selectEmailPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email preference" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">All Notifications</SelectItem>
                        <SelectItem value="important">Important Only</SelectItem>
                        <SelectItem value="none">No Notifications</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* User Type Selection */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">User Type</h3>
                  <RadioGroup 
                    value={formData.userType} 
                    onValueChange={(value) => handleInputChange('userType', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="internal" id="internal" />
                      <Label htmlFor="internal">Internal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="external" id="external" />
                      <Label htmlFor="external">External</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Options */}
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="dailyHelpdeskReport"
                      checked={formData.dailyHelpdeskReport}
                      onCheckedChange={(checked) => handleInputChange('dailyHelpdeskReport', checked)}
                    />
                    <Label htmlFor="dailyHelpdeskReport">Daily Helpdesk Report Email</Label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button 
                    onClick={handleSubmit}
                    className="bg-[#C72030] hover:bg-[#a91b29] text-white"
                  >
                    Submit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};