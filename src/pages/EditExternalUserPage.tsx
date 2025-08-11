import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';

export const EditExternalUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data from location state or fallback to dummy data
  const initialUser = location.state?.user || {
    id: Number(userId),
    firstname: 'External',
    lastname: 'User',
    gender: 'Male',
    mobile: '9999999999',
    email: 'external@example.com',
    company_name: 'External Company',
    designation: 'External Role',
    employee_id: 'EXT999',
    user_type: 'external',
    lock_user_permission_status: 'approved',
    face_added: true,
    app_downloaded: true,
    department: 'External Dept',
    circle: 'External Circle',
    cluster: 'External Cluster',
    line_manager_name: 'External Manager',
    line_manager_mobile: '8888888888'
  };

  const [formData, setFormData] = useState(initialUser);
  const [emailPreference, setEmailPreference] = useState('All Emails');
  const [dailyReport, setDailyReport] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Here you would typically save the data to your backend
    console.log('Saving external user data:', formData);
    toast.success('External user updated successfully!');
    navigate(`/maintenance/m-safe/external/user/${userId}`, { state: { user: formData } });
  };

  const handleCancel = () => {
    navigate(`/maintenance/m-safe/external/user/${userId}`, { state: { user: initialUser } });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit External User
            </h1>
            <p className="text-gray-600">{formData.firstname} {formData.lastname}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handleSubmit}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-6">External User Information</h3>
        
        <div className="flex gap-8 mb-8">
          {/* Profile Picture Section */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-32 h-32 bg-orange-400 rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="flex-1 space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="First Name"
                  value={formData.firstname || ''}
                  onChange={(e) => handleInputChange('firstname', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Last Name"
                  value={formData.lastname || ''}
                  onChange={(e) => handleInputChange('lastname', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender || 'Male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Mobile"
                  value={formData.mobile || ''}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Employee ID"
                  value={formData.employee_id || ''}
                  onChange={(e) => handleInputChange('employee_id', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </div>
            </div>

            {/* User Type Selection */}
            <div>
              <FormControl component="fieldset">
                <label className="text-sm font-medium text-gray-700 mb-2 block">User Type</label>
                <RadioGroup
                  value={formData.user_type || 'external'}
                  onChange={(e) => handleInputChange('user_type', e.target.value)}
                  row
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel value="external" control={<Radio />} label="External" />
                  <FormControlLabel value="contractor" control={<Radio />} label="Contractor" />
                  <FormControlLabel value="vendor" control={<Radio />} label="Vendor" />
                </RadioGroup>
              </FormControl>
            </div>

            {/* Company & Department Information */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Company & Department Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Vendor Company Name"
                  value={formData.company_name || ''}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Department"
                  value={formData.department || ''}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Designation"
                  value={formData.designation || ''}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Circle"
                  value={formData.circle || ''}
                  onChange={(e) => handleInputChange('circle', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Cluster"
                  value={formData.cluster || ''}
                  onChange={(e) => handleInputChange('cluster', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Entity Name</InputLabel>
                  <Select
                    value={formData.entity_id || ''}
                    onChange={(e) => handleInputChange('entity_id', e.target.value)}
                    label="Entity Name"
                  >
                    <MenuItem value={1}>Entity 1</MenuItem>
                    <MenuItem value={2}>Entity 2</MenuItem>
                    <MenuItem value={3}>Entity 3</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Management Information */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Management Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Line Manager Name"
                  value={formData.line_manager_name || ''}
                  onChange={(e) => handleInputChange('line_manager_name', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Line Manager Mobile"
                  value={formData.line_manager_mobile || ''}
                  onChange={(e) => handleInputChange('line_manager_mobile', e.target.value)}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Access Level</InputLabel>
                  <Select
                    value={formData.access_level || 3}
                    onChange={(e) => handleInputChange('access_level', e.target.value)}
                    label="Access Level"
                  >
                    <MenuItem value={1}>Level 1 - Site</MenuItem>
                    <MenuItem value={2}>Level 2 - Building</MenuItem>
                    <MenuItem value={3}>Level 3 - Floor</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.lock_user_permission_status || 'approved'}
                    onChange={(e) => handleInputChange('lock_user_permission_status', e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* App & System Access */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">App & System Access</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormControl fullWidth size="small">
                  <InputLabel>Face Recognition</InputLabel>
                  <Select
                    value={formData.face_added ? 'yes' : 'no'}
                    onChange={(e) => handleInputChange('face_added', e.target.value === 'yes')}
                    label="Face Recognition"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel>App Downloaded</InputLabel>
                  <Select
                    value={formData.app_downloaded ? 'yes' : 'no'}
                    onChange={(e) => handleInputChange('app_downloaded', e.target.value === 'yes')}
                    label="App Downloaded"
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Email Preferences */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Email Preferences</h4>
              <div className="space-y-4">
                <FormControl fullWidth size="small">
                  <InputLabel>Email Preference</InputLabel>
                  <Select
                    value={emailPreference}
                    onChange={(e) => setEmailPreference(e.target.value)}
                    label="Email Preference"
                  >
                    <MenuItem value="All Emails">All Emails</MenuItem>
                    <MenuItem value="Important Only">Important Only</MenuItem>
                    <MenuItem value="None">None</MenuItem>
                  </Select>
                </FormControl>
                
                <FormGroup>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={dailyReport}
                        onChange={(e) => setDailyReport(e.target.checked)}
                      />
                    } 
                    label="Daily Helpdesk Report Email" 
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-center pt-6 border-t">
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={handleCancel}
              className="px-8 py-2"
            >
              Cancel
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2"
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};