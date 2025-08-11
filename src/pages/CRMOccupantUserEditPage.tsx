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
    firstName: "Test Pending",
    lastName: "Getting App access",
    mobile: "8881418814",
    email: "shahabmirza3099@gmail.com",
    gender: "Male",
    entity: "Vinayak Test",
    userType: "Member",
    employeeId: "",
    accessLevel: "Company",
    companies: ["Lockated HO", "Branch Office", "Remote Location"],
    birthDate: "dd/mm/yyyy",
    address: "",
    alternateMobile: "",
    profileImage: null
  });

  const availableCompanies = ["Lockated HO", "Branch Office", "Remote Location", "Regional Office", "Corporate Office"];

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
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Edit User</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Section */}
          <div className="flex justify-center mb-8">
            <Avatar className="w-32 h-32 border-4 border-border">
              <AvatarImage src={userData.profileImage} alt="Profile" />
              <AvatarFallback className="bg-muted text-4xl">
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Details Form */}
          <div className="space-y-8">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <TextField
                  id="firstName"
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
                  id="lastName"
                  label="Last Name"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>
              <div>
                <TextField
                  id="mobile"
                  label="Mobile Number"
                  value={userData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <TextField
                  id="email"
                  label="E-mail ID"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>
              <div>
                <TextField
                  id="gender"
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
                  id="entity"
                  label="Select Entity"
                  value={userData.entity}
                  onChange={(e) => handleInputChange('entity', e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <TextField
                  id="userType"
                  label="User Type"
                  value={userData.userType}
                  onChange={(e) => handleInputChange('userType', e.target.value)}
                  select
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Guest">Guest</MenuItem>
                </TextField>
              </div>
              <div>
                <TextField
                  id="employeeId"
                  label="Employee ID"
                  value={userData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  placeholder="Not provided"
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>
              <div>
                <TextField
                  id="accessLevel"
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
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel id="companies-label">Companies</InputLabel>
                  <Select
                    labelId="companies-label"
                    id="companies"
                    multiple
                    value={userData.companies}
                    onChange={(e) => handleInputChange('companies', e.target.value)}
                    label="Companies"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {availableCompanies.map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Additional Info Button */}
            <div className="flex justify-start">
              <Button
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="bg-[#4A1525] hover:bg-[#4A1525]/90 text-white px-6 py-2 rounded-md"
              >
                {showAdditionalInfo ? '- Hide Additional Info' : '+ Additional Info'}
              </Button>
            </div>

            {/* Additional Information Section */}
            {showAdditionalInfo && (
              <div className="space-y-6 border-t pt-8">
                <h2 className="text-xl font-bold text-[#BF213E] tracking-wide">
                  ADDITIONAL INFO
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <TextField
                      id="birthDate"
                      label="Birth Date"
                      value={userData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      placeholder="dd/mm/yyyy"
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <div>
                    <TextField
                      id="address"
                      label="Address"
                      value={userData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Not provided"
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </div>
                  <div>
                    <TextField
                      id="alternateMobile"
                      label="Alternate Mobile Number"
                      value={userData.alternateMobile}
                      onChange={(e) => handleInputChange('alternateMobile', e.target.value)}
                      placeholder="Not provided"
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            )}

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
  );
};