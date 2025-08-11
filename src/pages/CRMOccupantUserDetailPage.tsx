import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  readOnly
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  readOnly
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium text-muted-foreground">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  value={userData.mobile}
                  readOnly
                  className="bg-muted border-border"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  E-mail ID
                </Label>
                <Input
                  id="email"
                  value={userData.email}
                  readOnly
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-muted-foreground">
                  Gender
                </Label>
                <Select disabled>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder={userData.gender} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity" className="text-sm font-medium text-muted-foreground">
                  Select Entity
                </Label>
                <Select disabled>
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder={userData.entity} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vinayak-test">Vinayak Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-sm font-medium text-muted-foreground">
                  User Type
                </Label>
                <Input
                  id="userType"
                  value={userData.userType}
                  readOnly
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-sm font-medium text-muted-foreground">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  value={userData.employeeId}
                  readOnly
                  className="bg-muted border-border"
                  placeholder="Not provided"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accessLevel" className="text-sm font-medium text-muted-foreground">
                  Access Level
                </Label>
                <Input
                  id="accessLevel"
                  value={userData.accessLevel}
                  readOnly
                  className="bg-muted border-border"
                />
              </div>
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-muted-foreground">
                  Company
                </Label>
                <div className="relative">
                  <Input
                    id="company"
                    value={userData.company}
                    readOnly
                    className="bg-muted border-border pr-12"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="bg-[#BF213E] text-white px-2 py-1 rounded text-xs font-medium">
                      {userData.company.split(' ')[1]}
                    </span>
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-sm font-medium text-muted-foreground">
                      Birth Date
                    </Label>
                    <Input
                      id="birthDate"
                      value={userData.birthDate}
                      readOnly
                      className="bg-muted border-border"
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-muted-foreground">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={userData.address}
                      readOnly
                      className="bg-muted border-border"
                      placeholder="Not provided"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternateMobile" className="text-sm font-medium text-muted-foreground">
                      Alternate Mobile Number
                    </Label>
                    <Input
                      id="alternateMobile"
                      value={userData.alternateMobile}
                      readOnly
                      className="bg-muted border-border"
                      placeholder="Not provided"
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