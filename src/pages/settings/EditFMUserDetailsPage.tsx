
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit } from 'lucide-react';

// Mock user data - in real app, this would come from API based on ID
const getUserData = (id: string) => {
  const users = {
    '191075': {
      id: '191075',
      firstName: 'Kunal',
      lastName: 'Javare',
      gender: 'Male',
      mobileNumber: '7020371580',
      email: 'kunal.javare1@lockated.com',
      companyCluster: 'Tata',
      isInternal: true,
      employeeId: '',
      lastWorkingDay: '',
      department: '',
      designation: '',
      role: 'Admin',
      vendorCompanyName: '',
      accessLevel: 'Company',
      access: 'Sankei Enterprise',
      site: 'Lockated Site 1',
      baseUnit: '',
      userType: 'Admin(Web & App)',
      entityName: 'Tata',
      emailPreference: '',
      dailyHelpdeskReport: false
    },
    '139207': {
      id: '139207',
      firstName: 'zs',
      lastName: 'Demo',
      gender: 'Male',
      mobileNumber: '7098674532',
      email: 'zsdemo@gophysital.work',
      companyCluster: '',
      isInternal: false,
      employeeId: 'Demo',
      lastWorkingDay: '',
      department: '',
      designation: '',
      role: 'Admin',
      vendorCompanyName: '',
      accessLevel: 'Site',
      access: '',
      site: '',
      baseUnit: 'TCS B Unit',
      userType: 'Admin',
      entityName: 'N/A',
      emailPreference: '',
      dailyHelpdeskReport: false
    }
  };
  return users[id as keyof typeof users] || users['191075'];
};

export const EditFMUserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = getUserData(id || '191075');
  
  const [formData, setFormData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate('/settings/users');
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    console.log('Saving user data:', formData);
    setIsEditing(false);
    // In real app, this would make an API call to save the data
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" />
          Users
        </button>
        <span>&gt;</span>
        <span>FM Users</span>
        <span>&gt;</span>
        <span>Edit Details</span>
        <Button
          onClick={handleEdit}
          variant="outline"
          size="sm"
          className="ml-auto border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
        >
          <Edit className="w-4 h-4 mr-1" />
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <div className="w-28 h-28 bg-orange-300 rounded-full flex items-center justify-center">
                <span className="text-2xl text-white font-bold">
                  {formData.firstName[0]}{formData.lastName[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            {/* First Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">First Name</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Mobile</Label>
                <Input
                  value={formData.mobileNumber}
                  onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internal"
                    checked={formData.isInternal}
                    onCheckedChange={(checked) => handleInputChange('isInternal', checked as boolean)}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="internal" className="text-sm">Internal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="external"
                    checked={!formData.isInternal}
                    onCheckedChange={(checked) => handleInputChange('isInternal', !(checked as boolean))}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="external" className="text-sm">External</Label>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Employee</Label>
                <Input
                  placeholder="Employee ID"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Department</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange('department', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleInputChange('role', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Access Level</Label>
                <Select 
                  value={formData.accessLevel} 
                  onValueChange={(value) => handleInputChange('accessLevel', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Site">Site</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Country">Country</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Company Cluster</Label>
                <Select 
                  value={formData.companyCluster} 
                  onValueChange={(value) => handleInputChange('companyCluster', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Cluster" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tata">Tata</SelectItem>
                    <SelectItem value="Reliance">Reliance</SelectItem>
                    <SelectItem value="Adani">Adani</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Last Working Day</Label>
                <Input
                  placeholder="Last Working Day"
                  value={formData.lastWorkingDay}
                  onChange={(e) => handleInputChange('lastWorkingDay', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Designation</Label>
                <Input
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Vendor Company Name</Label>
                <Select 
                  value={formData.vendorCompanyName} 
                  onValueChange={(value) => handleInputChange('vendorCompanyName', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Vendor Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Company1">Company 1</SelectItem>
                    <SelectItem value="Company2">Company 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Access</Label>
                <div className="mt-1 p-2 border rounded bg-gray-50">
                  <span className="inline-block bg-[#C72030] text-white px-2 py-1 rounded text-xs">
                    {formData.access}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="helpdesk"
                  checked={formData.dailyHelpdeskReport}
                  onCheckedChange={(checked) => handleInputChange('dailyHelpdeskReport', checked as boolean)}
                  disabled={!isEditing}
                />
                <Label htmlFor="helpdesk" className="text-sm">Daily Helpdesk Report Email</Label>
              </div>
            </div>

            {/* Third Column */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Site</Label>
                <Select 
                  value={formData.site} 
                  onValueChange={(value) => handleInputChange('site', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lockated Site 1">Lockated Site 1</SelectItem>
                    <SelectItem value="Site 2">Site 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Base Unit</Label>
                <Select 
                  value={formData.baseUnit} 
                  onValueChange={(value) => handleInputChange('baseUnit', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Base Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TCS B Unit">TCS B Unit</SelectItem>
                    <SelectItem value="Unit 1">Unit 1</SelectItem>
                    <SelectItem value="Unit 2">Unit 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">User Type</Label>
                <Select 
                  value={formData.userType} 
                  onValueChange={(value) => handleInputChange('userType', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin(Web & App)">Admin(Web & App)</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Entity Name</Label>
                <Select 
                  value={formData.entityName} 
                  onValueChange={(value) => handleInputChange('entityName', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tata">Tata</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Email Preference</Label>
                <Select 
                  value={formData.emailPreference} 
                  onValueChange={(value) => handleInputChange('emailPreference', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Email Preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Emails</SelectItem>
                    <SelectItem value="Important">Important Only</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
