import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TextField, MenuItem, FormControl, InputLabel, Select, Chip, Box } from '@mui/material';
export const CRMOccupantUserDetailPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  // Sample user data - in real app, this would be fetched based on ID
  const userData = {
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
  };
  const availableAccess = ["Lockated HO", "Branch Office", "Remote Location", "Regional Office", "Corporate Office"];
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">User Details</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/crm/occupant-users/${id}/edit`)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Edit className="h-5 w-5" />
        </Button>
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
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>

              {/* Base Unit */}
              <div>
                <TextField
                  label="Base Unit"
                  value={userData.baseUnit}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>

              {/* User Type */}
              <div>
                <TextField
                  label="User Type"
                  value={userData.userType}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>

              {/* Entity Name */}
              <div>
                <TextField
                  label="Entity Name"
                  value={userData.entityName}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>

              {/* Email Preference */}
              <div>
                <TextField
                  label="Email Preference"
                  value={userData.emailPreference}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
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
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Last Name"
                    value={userData.lastName}
                    InputProps={{ readOnly: true }}
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
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Company Cluster"
                    value={userData.companyCluster}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Mobile"
                    value={userData.mobile}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Email"
                    value={userData.email}
                    InputProps={{ readOnly: true }}
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
                    readOnly
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm">Internal</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!userData.isInternal}
                    readOnly
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
                    placeholder="Employee ID"
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Last Working Day"
                    value={userData.lastWorkingDay}
                    placeholder="Last Working Day"
                    InputProps={{ readOnly: true }}
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
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Designation"
                    value={userData.designation}
                    placeholder="Designation"
                    InputProps={{ readOnly: true }}
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
                    placeholder="Role"
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <TextField
                    label="Vendor Company Name"
                    value={userData.vendorCompanyName}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
              </div>

              {/* Seventh Row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <TextField
                    label="Access Level"
                    value={userData.accessLevel}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </div>
                <div>
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel>Access</InputLabel>
                    <Select
                      multiple
                      value={userData.access}
                      label="Access"
                      readOnly
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
                  readOnly
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">Daily Helpdesk Report Email</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};