import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TextField, MenuItem, FormControl, InputLabel, Select, Chip, Box } from '@mui/material';

export const CRMOccupantUserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  // Sample user data - in real app, this would be fetched based on ID
  const [userData, setUserData] = useState({
    id: id,
    firstName: "Test",
    lastName: "Internal Office",
    mobile: "2824492828",
    email: "test234567@yopmail.com",
    gender: "Female",
    companyCluster: "Select Cluster",
    site: "Lockated, Pune",
    baseUnit: "Lockated HO - 1110",
    userType: "Admin (Web & App)",
    entityName: "Select Entity",
    emailPreference: "Select Email Preference",
    isInternal: true,
    employeeId: "Employee ID",
    lastWorkingDay: "Last Working Day",
    department: "Housekeeping",
    designation: "",
    role: "",
    vendorCompanyName: "xyz",
    accessLevel: "Company",
    access: ["Lockated HO"],
    dailyHelpdeskReport: false,
    profileImage: null
  });

  const availableAccess = ["Lockated HO", "Branch Office", "Remote Location", "Regional Office", "Corporate Office"];

  const handleInputChange = (field: string, value: any) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = () => {
    // Handle update logic here
    console.log('Updated user data:', userData);
    navigate(`/crm/occupant-users/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/crm/occupant-users/${id}`)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Edit User</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="col-span-3 space-y-6">
              {/* Profile Image */}
              <div className="flex justify-center mb-8">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center border-8 border-yellow-300">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                    <User className="w-16 h-16 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Site */}
              <div>
                <TextField
                  label="Site"
                  value={userData.site}
                  onChange={(e) => handleInputChange('site', e.target.value)}
                  select
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Lockated, Pune">Lockated, Pune</MenuItem>
                  <MenuItem value="Mumbai Office">Mumbai Office</MenuItem>
                  <MenuItem value="Delhi Office">Delhi Office</MenuItem>
                </TextField>
              </div>

              {/* Base Unit */}
              <div>
                <TextField
                  label="Base Unit"
                  value={userData.baseUnit}
                  onChange={(e) => handleInputChange('baseUnit', e.target.value)}
                  select
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Lockated HO - 1110">Lockated HO - 1110</MenuItem>
                  <MenuItem value="Branch Office - 2220">Branch Office - 2220</MenuItem>
                  <MenuItem value="Remote Location - 3330">Remote Location - 3330</MenuItem>
                </TextField>
              </div>

              {/* User Type */}
              <div>
                <TextField
                  label="User Type"
                  value={userData.userType}
                  onChange={(e) => handleInputChange('userType', e.target.value)}
                  select
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Admin (Web & App)">Admin (Web & App)</MenuItem>
                  <MenuItem value="User (Web Only)">User (Web Only)</MenuItem>
                  <MenuItem value="User (App Only)">User (App Only)</MenuItem>
                </TextField>
              </div>

              {/* Entity Name */}
              <div>
                <TextField
                  label="Entity Name"
                  value={userData.entityName}
                  onChange={(e) => handleInputChange('entityName', e.target.value)}
                  select
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Select Entity">Select Entity</MenuItem>
                  <MenuItem value="Entity 1">Entity 1</MenuItem>
                  <MenuItem value="Entity 2">Entity 2</MenuItem>
                </TextField>
              </div>

              {/* Email Preference */}
              <div>
                <TextField
                  label="Email Preference"
                  value={userData.emailPreference}
                  onChange={(e) => handleInputChange('emailPreference', e.target.value)}
                  select
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Select Email Preference">Select Email Preference</MenuItem>
                  <MenuItem value="All Notifications">All Notifications</MenuItem>
                  <MenuItem value="Important Only">Important Only</MenuItem>
                  <MenuItem value="None">None</MenuItem>
                </TextField>
              </div>
            </div>

            {/* Right Content */}
            <div className="col-span-9 space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="First Name"
                    value={userData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Last Name"
                    value={userData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Gender"
                    value={userData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </div>
                <div>
                  <TextField
                    label="Company Cluster"
                    value={userData.companyCluster}
                    onChange={(e) => handleInputChange('companyCluster', e.target.value)}
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="Select Cluster">Select Cluster</MenuItem>
                    <MenuItem value="Cluster A">Cluster A</MenuItem>
                    <MenuItem value="Cluster B">Cluster B</MenuItem>
                  </TextField>
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Mobile"
                    value={userData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Email"
                    value={userData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              {/* Internal/External Radio */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={userData.isInternal}
                    onChange={() => handleInputChange('isInternal', true)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm">Internal</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!userData.isInternal}
                    onChange={() => handleInputChange('isInternal', false)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm">External</span>
                </div>
              </div>

              {/* Fourth Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Employee"
                    value={userData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    placeholder="Employee ID"
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Last Working Day"
                    value={userData.lastWorkingDay}
                    onChange={(e) => handleInputChange('lastWorkingDay', e.target.value)}
                    placeholder="Last Working Day"
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              {/* Fifth Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Department"
                    value={userData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="Housekeeping">Housekeeping</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
                    <MenuItem value="Administration">Administration</MenuItem>
                  </TextField>
                </div>
                <div>
                  <TextField
                    label="Designation"
                    value={userData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="Designation"
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              {/* Sixth Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Role"
                    value={userData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    select
                    placeholder="Role"
                    fullWidth
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="">Select Role</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Supervisor">Supervisor</MenuItem>
                    <MenuItem value="Executive">Executive</MenuItem>
                  </TextField>
                </div>
                <div>
                  <TextField
                    label="Vendor Company Name"
                    value={userData.vendorCompanyName}
                    onChange={(e) => handleInputChange('vendorCompanyName', e.target.value)}
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="xyz">xyz</MenuItem>
                    <MenuItem value="ABC Corp">ABC Corp</MenuItem>
                    <MenuItem value="XYZ Ltd">XYZ Ltd</MenuItem>
                  </TextField>
                </div>
              </div>

              {/* Seventh Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Access Level"
                    value={userData.accessLevel}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value)}
                    select
                    fullWidth
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem value="Company">Company</MenuItem>
                    <MenuItem value="Department">Department</MenuItem>
                    <MenuItem value="Team">Team</MenuItem>
                  </TextField>
                </div>
                <div>
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel>Access</InputLabel>
                    <Select
                      multiple
                      value={userData.access}
                      onChange={(e) => handleInputChange('access', e.target.value)}
                      label="Access"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              size="small"
                              sx={{
                                backgroundColor: '#FEE2E2',
                                color: '#DC2626',
                                fontWeight: 'bold'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {availableAccess.map((access) => (
                        <MenuItem key={access} value={access}>
                          {access}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              {/* Daily Helpdesk Report Email */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={userData.dailyHelpdeskReport}
                  onChange={(e) => handleInputChange('dailyHelpdeskReport', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">Daily Helpdesk Report Email</span>
              </div>

              {/* Update Button */}
              <div className="flex justify-center pt-8">
                <Button
                  onClick={handleUpdate}
                  className="bg-[#BF213E] hover:bg-[#BF213E]/90 text-white px-12 py-3 rounded-md text-lg"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};