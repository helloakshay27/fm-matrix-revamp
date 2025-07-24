import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFMUsers, FMUser } from '@/store/slices/fmUserSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ViewFMUserPage = () => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { data: fmUsersResponse, loading } = useSelector((state: RootState) => state.fmUsers);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    mobile: '',
    email: '',
    company_name: '',
    entity_id: '',
    unit_id: '',
    designation: '',
    employee_id: '',
    user_type: 'internal',
    lock_user_permission_status: '',
    face_added: false,
    app_downloaded: 'No',
    access_level: '',
    daily_helpdesk_report: false,
    site: 'lockated',
    base_unit: '',
    system_user_type: 'admin',
    department: '',
    role: 'admin',
    vendor_company: '',
    company_cluster: '',
    last_working_day: '',
    email_preference: ''
  });

  // Find the user data
  const userData = fmUsersResponse?.fm_users?.find(user => user.id.toString() === id);

  useEffect(() => {
    setCurrentSection('Master');
    if (!fmUsersResponse?.fm_users) {
      dispatch(fetchFMUsers());
    }
  }, [setCurrentSection, dispatch, fmUsersResponse]);

  useEffect(() => {
    if (userData) {
      setFormData({
        firstname: userData.firstname || 'yyuiyiy',
        lastname: userData.lastname || 'iiujo',
        gender: userData.gender || 'Male',
        mobile: userData.mobile || '7897780978',
        email: userData.email || 'tesruhhh@gmail.com',
        company_name: userData.company_name || '',
        entity_id: userData.entity_id?.toString() || '',
        unit_id: userData.unit_id?.toString() || '',
        designation: userData.designation || 'Designation',
        employee_id: userData.employee_id || 'Employee ID',
        user_type: userData.user_type === 'pms_admin' ? 'internal' : 'external',
        lock_user_permission_status: userData.lock_user_permission_status || '',
        face_added: userData.face_added || false,
        app_downloaded: userData.app_downloaded || 'No',
        access_level: userData.lock_user_permission?.access_level || 'Site',
        daily_helpdesk_report: false,
        site: 'lockated',
        base_unit: '',
        system_user_type: 'admin',
        department: '',
        role: 'admin',
        vendor_company: '',
        company_cluster: '',
        last_working_day: 'Last Working Day',
        email_preference: ''
      });
    }
  }, [userData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    toast({
      title: "Success",
      description: "User details updated successfully!"
    });
    navigate('/master/user/fm-users');
  };

  if (loading) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading user details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Users</span>
          <span>&gt;</span>
          <span>FM Users</span>
          <span>&gt;</span>
          <span className="font-medium">Edit Details</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-300"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-6">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-4 relative">
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Left Side Form Controls */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Site</Label>
                  <Select value={formData.site} onValueChange={(value) => handleInputChange('site', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lockated">Lockated</SelectItem>
                      <SelectItem value="other">Other Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Base Unit</Label>
                  <Select value={formData.base_unit} onValueChange={(value) => handleInputChange('base_unit', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Base Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit1">Unit 1</SelectItem>
                      <SelectItem value="unit2">Unit 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">User Type</Label>
                  <Select value={formData.system_user_type} onValueChange={(value) => handleInputChange('system_user_type', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin(Web & App)</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Entity Name</Label>
                  <Select value={formData.entity_id} onValueChange={(value) => handleInputChange('entity_id', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Entity 1</SelectItem>
                      <SelectItem value="2">Entity 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Preference</Label>
                  <Select value={formData.email_preference} onValueChange={(value) => handleInputChange('email_preference', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Email Preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form Section */}
        <div className="lg:col-span-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">First Name</Label>
                  <Input
                    value={formData.firstname}
                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Last Name</Label>
                  <Input
                    value={formData.lastname}
                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Gender and Company Cluster */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="w-full">
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
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Company Cluster</Label>
                  <Select value={formData.company_cluster} onValueChange={(value) => handleInputChange('company_cluster', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cluster1">Cluster 1</SelectItem>
                      <SelectItem value="cluster2">Cluster 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Mobile</Label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* User Type Radio Buttons */}
              <div className="space-y-2">
                <RadioGroup
                  value={formData.user_type}
                  onValueChange={(value) => handleInputChange('user_type', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="internal" id="internal" />
                    <Label htmlFor="internal" className="text-sm">Internal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="external" id="external" />
                    <Label htmlFor="external" className="text-sm">External</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Employee and Last Working Day */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Employee</Label>
                  <Input
                    value={formData.employee_id}
                    onChange={(e) => handleInputChange('employee_id', e.target.value)}
                    placeholder="Employee ID"
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Last Working Day</Label>
                  <Input
                    value={formData.last_working_day}
                    onChange={(e) => handleInputChange('last_working_day', e.target.value)}
                    placeholder="Last Working Day"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Department and Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Designation</Label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Role and Vendor Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Vendor Company Name</Label>
                  <Select value={formData.vendor_company} onValueChange={(value) => handleInputChange('vendor_company', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Vendor Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company1">Company 1</SelectItem>
                      <SelectItem value="company2">Company 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Access Level and Access */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Access Level</Label>
                  <Select value={formData.access_level} onValueChange={(value) => handleInputChange('access_level', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="floor">Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Access</Label>
                  <div className="mt-2">
                    <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                      Lockated ×
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Daily Helpdesk Report Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="daily-helpdesk"
                  checked={formData.daily_helpdesk_report}
                  onCheckedChange={(checked) => handleInputChange('daily_helpdesk_report', checked)}
                />
                <Label htmlFor="daily-helpdesk" className="text-sm text-gray-700">
                  Daily Helpdesk Report Email
                </Label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button 
                  onClick={handleSubmit}
                  className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2 rounded-md"
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};