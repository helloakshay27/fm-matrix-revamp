import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft } from 'lucide-react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Button as MuiButton,
  Box
} from '@mui/material';

export const AddFMUserPage = () => {
  const { setCurrentSection } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentSection('Master');
  }, [setCurrentSection]);
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
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

      {/* Rest of the content stays the same */}
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
              {/* MUI Form Fields in 3-column grid */}
              <Box component="form" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Row 1 */}
                  <div>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      variant="outlined"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>

                  {/* Row 2 */}
                  <div>
                    <TextField
                      fullWidth
                      label="Email Address"
                      variant="outlined"
                      type="email"
                      value={formData.emailAddress}
                      onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        label="Gender"
                        displayEmpty
                      >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Entity</InputLabel>
                      <Select
                        value={formData.selectEntity}
                        onChange={(e) => handleInputChange('selectEntity', e.target.value)}
                        label="Select Entity"
                        displayEmpty
                      >
                        <MenuItem value="">Select Entity</MenuItem>
                        <MenuItem value="entity1">Entity 1</MenuItem>
                        <MenuItem value="entity2">Entity 2</MenuItem>
                        <MenuItem value="entity3">Entity 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* Row 3 */}
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Supplier</InputLabel>
                      <Select
                        value={formData.supplier}
                        onChange={(e) => handleInputChange('supplier', e.target.value)}
                        label="Supplier"
                        displayEmpty
                      >
                        <MenuItem value="">Select Supplier</MenuItem>
                        <MenuItem value="supplier1">Supplier 1</MenuItem>
                        <MenuItem value="supplier2">Supplier 2</MenuItem>
                        <MenuItem value="supplier3">Supplier 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      variant="outlined"
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange('employeeId', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink sx={{ color: '#f44336' }}>Base Site</InputLabel>
                      <Select
                        value={formData.baseSite}
                        onChange={(e) => handleInputChange('baseSite', e.target.value)}
                        label="Base Site"
                        displayEmpty
                        sx={{ 
                          '& .MuiSelect-select': { 
                            color: formData.baseSite ? 'inherit' : '#f44336' 
                          } 
                        }}
                      >
                        <MenuItem value="" sx={{ color: '#f44336' }}>Select Base Site</MenuItem>
                        <MenuItem value="site1">Site 1</MenuItem>
                        <MenuItem value="site2">Site 2</MenuItem>
                        <MenuItem value="site3">Site 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* Row 4 */}
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Base Unit</InputLabel>
                      <Select
                        value={formData.selectBaseUnit}
                        onChange={(e) => handleInputChange('selectBaseUnit', e.target.value)}
                        label="Select Base Unit"
                        displayEmpty
                      >
                        <MenuItem value="">Select Base Unit</MenuItem>
                        <MenuItem value="unit1">Unit 1</MenuItem>
                        <MenuItem value="unit2">Unit 2</MenuItem>
                        <MenuItem value="unit3">Unit 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Department</InputLabel>
                      <Select
                        value={formData.selectDepartment}
                        onChange={(e) => handleInputChange('selectDepartment', e.target.value)}
                        label="Select Department"
                        displayEmpty
                      >
                        <MenuItem value="">Select Department</MenuItem>
                        <MenuItem value="dept1">Department 1</MenuItem>
                        <MenuItem value="dept2">Department 2</MenuItem>
                        <MenuItem value="dept3">Department 3</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Email Preference</InputLabel>
                      <Select
                        value={formData.selectEmailPreference}
                        onChange={(e) => handleInputChange('selectEmailPreference', e.target.value)}
                        label="Select Email Preference"
                        displayEmpty
                      >
                        <MenuItem value="">Select Email Preference</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* Row 5 */}
                  <div>
                    <TextField
                      fullWidth
                      label="Designation"
                      variant="outlined"
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select User Type</InputLabel>
                      <Select
                        value={formData.selectUserType}
                        onChange={(e) => handleInputChange('selectUserType', e.target.value)}
                        label="Select User Type"
                        displayEmpty
                        required
                      >
                        <MenuItem value="">Select User Type</MenuItem>
                        <MenuItem value="internal">Internal</MenuItem>
                        <MenuItem value="external">External</MenuItem>
                        <MenuItem value="vendor">Vendor</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Role</InputLabel>
                      <Select
                        value={formData.selectRole}
                        onChange={(e) => handleInputChange('selectRole', e.target.value)}
                        label="Select Role"
                        displayEmpty
                        required
                      >
                        <MenuItem value="">Select Role</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* Row 6 */}
                  <div>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Select Access Level</InputLabel>
                      <Select
                        value={formData.selectAccessLevel}
                        onChange={(e) => handleInputChange('selectAccessLevel', e.target.value)}
                        label="Select Access Level"
                        displayEmpty
                        required
                      >
                        <MenuItem value="">Select Access Level</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </Box>
              {/* Action Buttons */}
              <div className="flex justify-end pt-6">
                <MuiButton 
                  onClick={handleSubmit}
                  variant="contained"
                  sx={{
                    backgroundColor: '#7B2D8E',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '12px 40px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#5A1E6B'
                    }
                  }}
                >
                  Submit
                </MuiButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};