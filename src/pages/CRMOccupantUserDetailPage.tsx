import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TextField, MenuItem } from '@mui/material';

export const CRMOccupantUserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  // Sample user data - in real app, this would be fetched based on ID
  const userData = {
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
    company: "Lockated HO",
    birthDate: "dd/mm/yyyy",
    address: "",
    alternateMobile: "",
    profileImage: null
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-[#BF213E] tracking-wide">
              OCCUPANT USER DETAILS
            </h1>
          </div>
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
                  InputProps={{
                    readOnly: true,
                  }}
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
                  InputProps={{
                    readOnly: true,
                  }}
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
                  InputProps={{
                    readOnly: true,
                  }}
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
                  InputProps={{
                    readOnly: true,
                  }}
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
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>
              <div>
                <TextField
                  id="entity"
                  label="Select Entity"
                  value={userData.entity}
                  InputProps={{
                    readOnly: true,
                  }}
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
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>
              <div>
                <TextField
                  id="employeeId"
                  label="Employee ID"
                  value={userData.employeeId}
                  placeholder="Not provided"
                  InputProps={{
                    readOnly: true,
                  }}
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
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </div>
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <TextField
                  id="company"
                  label="Company"
                  value={userData.company}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="bg-[#BF213E] text-white px-2 py-1 rounded text-xs font-medium">
                    {userData.company.split(' ')[1]}
                  </span>
                </div>
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
                      placeholder="dd/mm/yyyy"
                      InputProps={{
                        readOnly: true,
                      }}
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
                      placeholder="Not provided"
                      InputProps={{
                        readOnly: true,
                      }}
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
                      placeholder="Not provided"
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};