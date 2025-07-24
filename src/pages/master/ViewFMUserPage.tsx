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
import { Edit2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ViewFMUserPage = () => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { data: fmUsersResponse, loading } = useSelector((state: RootState) => state.fmUsers);
  
  const [isEditMode, setIsEditMode] = useState(false);
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
    user_type: 'pms_admin',
    lock_user_permission_status: '',
    face_added: false,
    app_downloaded: 'No',
    access_level: '',
    daily_helpdesk_report: false
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
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        gender: userData.gender || '',
        mobile: userData.mobile || '',
        email: userData.email || '',
        company_name: userData.company_name || '',
        entity_id: userData.entity_id?.toString() || '',
        unit_id: userData.unit_id?.toString() || '',
        designation: userData.designation || '',
        employee_id: userData.employee_id || '',
        user_type: userData.user_type || 'pms_admin',
        lock_user_permission_status: userData.lock_user_permission_status || '',
        face_added: userData.face_added || false,
        app_downloaded: userData.app_downloaded || 'No',
        access_level: userData.lock_user_permission?.access_level || '',
        daily_helpdesk_report: false
      });
    }
  }, [userData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality with API call
    toast({
      title: "Success",
      description: "User details updated successfully!"
    });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    if (isEditMode) {
      setIsEditMode(false);
      // Reset form data to original
      if (userData) {
        setFormData({
          firstname: userData.firstname || '',
          lastname: userData.lastname || '',
          gender: userData.gender || '',
          mobile: userData.mobile || '',
          email: userData.email || '',
          company_name: userData.company_name || '',
          entity_id: userData.entity_id?.toString() || '',
          unit_id: userData.unit_id?.toString() || '',
          designation: userData.designation || '',
          employee_id: userData.employee_id || '',
          user_type: userData.user_type || 'pms_admin',
          lock_user_permission_status: userData.lock_user_permission_status || '',
          face_added: userData.face_added || false,
          app_downloaded: userData.app_downloaded || 'No',
          access_level: userData.lock_user_permission?.access_level || '',
          daily_helpdesk_report: false
        });
      }
    } else {
      navigate('/master/user/fm-users');
    }
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

  if (!userData) {
    return (
      <div className="w-full p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="text-sm text-gray-500">
            Users &gt; FM Users &gt; {isEditMode ? 'Edit Details' : 'View Details'}
          </div>
        </div>
        <Button
          onClick={() => setIsEditMode(!isEditMode)}
          className="flex items-center gap-2"
          variant={isEditMode ? "outline" : "default"}
        >
          <Edit2 className="w-4 h-4" />
          {isEditMode ? 'Cancel Edit' : 'Edit'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Section */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center">
                  <div className="text-2xl font-semibold text-amber-800">
                    {formData.firstname.charAt(0)}{formData.lastname.charAt(0)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Site</Label>
                  <Select disabled={!isEditMode} defaultValue="lockated">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Lockated" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lockated">Lockated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Base Unit</Label>
                  <Select disabled={!isEditMode} value={formData.unit_id} onValueChange={(value) => handleInputChange('unit_id', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Base Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Unit 1</SelectItem>
                      <SelectItem value="2">Unit 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">User Type</Label>
                  <Select disabled={!isEditMode} value={formData.user_type} onValueChange={(value) => handleInputChange('user_type', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Admin(Web & App)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pms_admin">Admin(Web & App)</SelectItem>
                      <SelectItem value="external">External User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Entity Name</Label>
                  <Select disabled={!isEditMode} value={formData.entity_id} onValueChange={(value) => handleInputChange('entity_id', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Entity 1</SelectItem>
                      <SelectItem value="2">Entity 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Email Preference</Label>
                  <Select disabled={!isEditMode} defaultValue="none">
                    <SelectTrigger className="mt-1">
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

        {/* Form Section */}
        <div className="lg:col-span-9">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">First Name</Label>
                  <Input
                    value={formData.firstname}
                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                    disabled={!isEditMode}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Name</Label>
                  <Input
                    value={formData.lastname}
                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                    disabled={!isEditMode}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Gender</Label>
                  <Select disabled={!isEditMode} value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Company Cluster</Label>
                  <Select disabled={!isEditMode} defaultValue="">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cluster1">Cluster 1</SelectItem>
                      <SelectItem value="cluster2">Cluster 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Mobile</Label>
                  <Input
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    disabled={!isEditMode}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditMode}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* User Type Radio */}
              <div>
                <Label className="text-sm font-medium">User Type</Label>
                <RadioGroup
                  value={formData.user_type === 'pms_admin' ? 'internal' : 'external'}
                  onValueChange={(value) => handleInputChange('user_type', value === 'internal' ? 'pms_admin' : 'external')}
                  className="flex gap-6 mt-2"
                  disabled={!isEditMode}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="internal" id="internal" disabled={!isEditMode} />
                    <Label htmlFor="internal">Internal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="external" id="external" disabled={!isEditMode} />
                    <Label htmlFor="external">External</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Employee</Label>
                  <Input
                    value={formData.employee_id}
                    onChange={(e) => handleInputChange('employee_id', e.target.value)}
                    disabled={!isEditMode}
                    placeholder="Employee ID"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Working Day</Label>
                  <Input
                    disabled={!isEditMode}
                    placeholder="Last Working Day"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Department and Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <Select disabled={!isEditMode} defaultValue="">
                    <SelectTrigger className="mt-1">
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
                  <Label className="text-sm font-medium">Designation</Label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    disabled={!isEditMode}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <Select disabled={!isEditMode} defaultValue="admin">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Admin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Vendor Company Name</Label>
                  <Select disabled={!isEditMode} value={formData.company_name} onValueChange={(value) => handleInputChange('company_name', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Vendor Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company1">Company 1</SelectItem>
                      <SelectItem value="company2">Company 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Access Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Access Level</Label>
                  <Select disabled={!isEditMode} value={formData.access_level} onValueChange={(value) => handleInputChange('access_level', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="floor">Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Access</Label>
                  <div className="mt-1">
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Lockated ×
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="daily-helpdesk"
                  checked={formData.daily_helpdesk_report}
                  onCheckedChange={(checked) => handleInputChange('daily_helpdesk_report', checked)}
                  disabled={!isEditMode}
                />
                <Label htmlFor="daily-helpdesk" className="text-sm">
                  Daily Helpdesk Report Email
                </Label>
              </div>

              {/* Action Buttons */}
              {isEditMode && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="bg-[#C72030] hover:bg-[#a91b29] text-white">
                    Update
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};