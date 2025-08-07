import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, UserCircle, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Checkbox, 
  FormGroup 
} from '@mui/material';
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
          <Button variant="ghost" onClick={() => {
            console.log('Back button clicked');
            try {
              navigate(-1);
            } catch (error) {
              console.error('Navigation error:', error);
              // Fallback navigation
              navigate('/maintenance/m-safe');
            }
          }}>
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
                <TextField
                  label="First Name"
                  defaultValue={user.firstname || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Last Name"
                  defaultValue={user.lastname || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    defaultValue={user.gender || 'Male'}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Company Cluster</InputLabel>
                  <Select
                    defaultValue="GUI"
                    label="Company Cluster"
                  >
                    <MenuItem value="GUI">GUI</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Mobile"
                  defaultValue={user.mobile || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Email"
                  type="email"
                  defaultValue={user.email || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </div>
              
              <div>
                <FormControl component="fieldset">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Internal/External</label>
                  <RadioGroup
                    defaultValue="internal"
                    row
                    sx={{ gap: 3 }}
                  >
                    <FormControlLabel value="internal" control={<Radio />} label="Internal" />
                    <FormControlLabel value="external" control={<Radio />} label="External" />
                  </RadioGroup>
                </FormControl>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextField
                  label="Site"
                  defaultValue={user.company_name || 'Corporate, Birla Centurion'}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Employee"
                  defaultValue={user.employee_id || ''}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Last Working Day"
                  defaultValue=""
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Base Unit</InputLabel>
                  <Select
                    defaultValue=""
                    label="Base Unit"
                  >
                    <MenuItem value="unit1">Unit 1</MenuItem>
                    <MenuItem value="unit2">Unit 2</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Department</InputLabel>
                  <Select
                    defaultValue="Admin"
                    label="Department"
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="IT">IT</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Designation"
                  defaultValue={user.designation || 'Tester'}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>User Type</InputLabel>
                  <Select
                    defaultValue={user.user_type || 'admin'}
                    label="User Type"
                  >
                    <MenuItem value="admin">Admin(Web & App)</MenuItem>
                    <MenuItem value="site">Site</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    defaultValue="Admin"
                    label="Role"
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Vendor Company Name</InputLabel>
                  <Select
                    defaultValue=""
                    label="Vendor Company Name"
                  >
                    <MenuItem value="company1">Company 1</MenuItem>
                    <MenuItem value="company2">Company 2</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Entity Name</InputLabel>
                  <Select
                    defaultValue=""
                    label="Entity Name"
                  >
                    <MenuItem value="entity1">Entity 1</MenuItem>
                    <MenuItem value="entity2">Entity 2</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Access Level</InputLabel>
                  <Select
                    defaultValue="Site"
                    label="Access Level"
                  >
                    <MenuItem value="Site">Site</MenuItem>
                    <MenuItem value="Building">Building</MenuItem>
                    <MenuItem value="Floor">Floor</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Access"
                  defaultValue="Corporate, Birla Centurion"
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </div>
              
              <FormControl fullWidth size="small">
                <InputLabel>Email Preference</InputLabel>
                <Select
                  defaultValue="All Emails"
                  label="Email Preference"
                >
                  <MenuItem value="All Emails">All Emails</MenuItem>
                  <MenuItem value="Important Only">Important Only</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                </Select>
              </FormControl>
              
              <FormGroup>
                <FormControlLabel 
                  control={<Checkbox />} 
                  label="Daily Helpdesk Report Email" 
                />
              </FormGroup>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
              onClick={() => setIsEditMode(false)}
            >
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