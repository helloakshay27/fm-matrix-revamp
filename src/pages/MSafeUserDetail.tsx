import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, UserCircle, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/hooks/useAppDispatch';
export const MSafeUserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const { data: fmUsersData } = useAppSelector(state => state.fmUsers);
  const fm_users = fmUsersData?.fm_users || [];
  const user = fm_users.find(u => u.id === Number(userId));
  if (!user) {
    return <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">User not found</p>
        </div>
      </div>;
  }
  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };
  const getTypeBadge = (type: string) => {
    if (!type) {
      return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Unknown</Badge>;
    }
    switch (type.toLowerCase()) {
      case 'admin':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Admin</Badge>;
      case 'site':
        return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Site</Badge>;
      case 'company':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Company</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{type}</Badge>;
    }
  };
  const getYesNoBadge = (value: boolean | string) => {
    const isYes = value === true || value === 'yes' || value === 'Yes';
    return <Badge className={isYes ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"}>
      {isYes ? 'Yes' : 'No'}
    </Badge>;
  };
  return <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstname} {user.lastname}
            </h1>
            <p className="text-gray-600">User Details</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditMode ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      {/* Status Overview */}
      

      {/* Edit Form or View Mode */}
      {isEditMode ? (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-6">Edit User Information</h3>
          <div className="flex gap-8 mb-8">
            {/* Profile Picture Section */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center">
                  <User className="h-16 w-16 text-yellow-600" />
                </div>
              </div>
            </div>
            
            {/* Form Fields */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user.firstname || ''} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user.lastname || ''} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select defaultValue={user.gender || 'Male'}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="companyCluster">Company Cluster</Label>
                  <Select defaultValue="GUI">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select company cluster" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GUI">GUI</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input id="mobile" defaultValue={user.mobile || ''} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email || ''} className="mt-1" />
                </div>
              </div>
              
              <div>
                <Label>Internal/External</Label>
                <RadioGroup defaultValue="internal" className="flex gap-6 mt-2">
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="site">Site</Label>
                  <Input id="site" defaultValue={user.company_name || 'Corporate, Birla Centurion'} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Input id="employee" defaultValue={user.employee_id || ''} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastWorkingDay">Last Working Day</Label>
                  <Input id="lastWorkingDay" defaultValue="" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="baseUnit">Base Unit</Label>
                  <Select defaultValue="">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Base Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit1">Unit 1</SelectItem>
                      <SelectItem value="unit2">Unit 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="Admin">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" defaultValue={user.designation || 'Tester'} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="userType">User Type</Label>
                  <Select defaultValue={user.user_type || 'admin'}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin(Web & App)</SelectItem>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="Admin">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="vendorCompany">Vendor Company Name</Label>
                  <Select defaultValue="">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Vendor Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company1">Company 1</SelectItem>
                      <SelectItem value="company2">Company 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="entityName">Entity Name</Label>
                  <Select defaultValue="">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Entity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entity1">Entity 1</SelectItem>
                      <SelectItem value="entity2">Entity 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select defaultValue="Site">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="Building">Building</SelectItem>
                      <SelectItem value="Floor">Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="access">Access</Label>
                  <Input id="access" defaultValue="Corporate, Birla Centurion" className="mt-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="emailPreference">Email Preference</Label>
                <Select defaultValue="All Emails">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select email preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Emails">All Emails</SelectItem>
                    <SelectItem value="Important Only">Important Only</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="dailyReport" />
                <Label htmlFor="dailyReport">Daily Helpdesk Report Email</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2">
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="flex justify-start bg-gray-50 rounded-t-lg h-auto p-0 w-full">
            <TabsTrigger 
              value="personal" 
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-8 py-3 data-[state=active]:text-[#C72030] text-gray-600 hover:text-gray-800 flex items-center gap-2 font-medium border-0 rounded-none first:rounded-tl-lg flex-1"
            >
              <UserCircle className="h-5 w-5" />
              Personal Information
            </TabsTrigger>
            <TabsTrigger 
              value="other" 
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-8 py-3 data-[state=active]:text-[#C72030] text-gray-600 hover:text-gray-800 flex items-center gap-2 font-medium border-0 rounded-none flex-1"
            >
              <Settings className="h-5 w-5" />
              Other Information
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-0">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
              <div className="flex gap-8">
                {/* Profile Picture Section */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-yellow-600" />
                    </div>
                  </div>
                </div>
                
                {/* Information Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">First Name</label>
                    <p className="text-gray-900 mt-1">{user.firstname || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Name</label>
                    <p className="text-gray-900 mt-1">{user.lastname || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="text-gray-900 mt-1">{user.gender || 'Male'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company Cluster</label>
                    <p className="text-gray-900 mt-1">GUI</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mobile</label>
                    <p className="text-gray-900 mt-1">{user.mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 mt-1">{user.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Employee ID</label>
                    <p className="text-gray-900 mt-1">{user.employee_id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Designation</label>
                    <p className="text-gray-900 mt-1">{user.designation || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Face Recognition</label>
                    <div className="mt-1">{getYesNoBadge(user.face_added)}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="other" className="mt-0">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Other Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Site</label>
                  <p className="text-gray-900 mt-1">{user.company_name || 'Corporate, Birla Centurion'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Employee</label>
                  <p className="text-gray-900 mt-1">{user.employee_id || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Working Day</label>
                  <p className="text-gray-900 mt-1">Last Working Day</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Base Unit</label>
                  <p className="text-gray-900 mt-1">{user.unit_id || 'Select Base Unit'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-gray-900 mt-1">Admin</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Designation</label>
                  <p className="text-gray-900 mt-1">{user.designation || 'Tester'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">User Type</label>
                  <div className="mt-1">{getTypeBadge(user.user_type)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Role</label>
                  <p className="text-gray-900 mt-1">Admin</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendor Company Name</label>
                  <p className="text-gray-900 mt-1">Select Vendor Company</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Entity Name</label>
                  <p className="text-gray-900 mt-1">{user.entity_id || 'Select Entity'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Access Level</label>
                  <p className="text-gray-900 mt-1">{user.lock_user_permission?.access_level?.toString() || 'Site'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Access</label>
                  <p className="text-gray-900 mt-1">Corporate, Birla Centurion</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Preference</label>
                  <p className="text-gray-900 mt-1">All Emails</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(user.lock_user_permission_status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Daily Helpdesk Report Email</label>
                  <div className="mt-1">{getYesNoBadge(false)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created By</label>
                  <p className="text-gray-900 mt-1">{user.created_by_id || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">App Downloaded</label>
                  <div className="mt-1">{getYesNoBadge(user.app_downloaded)}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>;
};