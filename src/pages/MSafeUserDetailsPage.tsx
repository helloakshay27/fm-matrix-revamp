import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Upload } from 'lucide-react';

// Sample data - in real app, this would be fetched based on the user ID
const sampleUserData = {
  id: '230825',
  firstName: 'Vinayak T',
  lastName: 'test19',
  gender: 'Male',
  companyCluster: 'GUI',
  mobile: '8898',
  email: 'vinayaktest19@yopmail.com',
  userType: 'internal',
  site: 'Corporate, Birla Centurion',
  employee: 'Employee ID',
  lastWorkingDay: '',
  baseUnit: 'Select Base Unit',
  department: 'Admin',
  designation: 'Tester',
  role: 'Admin',
  vendorCompanyName: 'Select Vendor Company',
  entityName: 'Select Entity',
  accessLevel: 'Site',
  access: 'Corporate, Birla Centurion',
  emailPreference: 'All Emails',
  dailyHelpdeskReport: false
};

export const MSafeUserDetailsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleGoBack = () => {
    navigate('/maintenance/m-safe');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleGoBack}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">
          User Details - {sampleUserData.firstName} {sampleUserData.lastName}
        </h1>
      </div>

      {/* Tabs Container */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="personal" 
                className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
              >
                Personal Information
              </TabsTrigger>
              <TabsTrigger 
                value="other"
                className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white"
              >
                Other Information
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Profile Picture Section */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                          <img 
                            src="/lovable-uploads/6f41ec06-1b93-4d96-90b4-1764be5310ce.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Picture
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Form Fields */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input value={sampleUserData.firstName} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input value={sampleUserData.lastName} readOnly className="bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={sampleUserData.gender.toLowerCase()} disabled>
                        <SelectTrigger className="bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Company Cluster</Label>
                      <Select value={sampleUserData.companyCluster.toLowerCase()} disabled>
                        <SelectTrigger className="bg-gray-50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gui">GUI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Mobile</Label>
                      <Input value={sampleUserData.mobile} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={sampleUserData.email} readOnly className="bg-gray-50" />
                    </div>
                  </div>

                  {/* User Type Radio Buttons */}
                  <div className="space-y-3">
                    <Label>User Type</Label>
                    <RadioGroup value={sampleUserData.userType} disabled className="flex flex-row gap-6">
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
                </div>
              </div>
            </TabsContent>

            {/* Other Information Tab */}
            <TabsContent value="other" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Site</Label>
                  <Input value={sampleUserData.site} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <Input value={sampleUserData.employee} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Last Working Day</Label>
                  <Input value={sampleUserData.lastWorkingDay || 'Last Working Day'} readOnly className="bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Base Unit</Label>
                  <Select value="" disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder={sampleUserData.baseUnit} />
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={sampleUserData.department.toLowerCase()} disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Designation</Label>
                  <Input value={sampleUserData.designation} readOnly className="bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>User Type</Label>
                  <Select value="" disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Admin(Web & App)" />
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={sampleUserData.role.toLowerCase()} disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vendor Company Name</Label>
                  <Select value="" disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder={sampleUserData.vendorCompanyName} />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Entity Name</Label>
                  <Select value="" disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder={sampleUserData.entityName} />
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select value={sampleUserData.accessLevel.toLowerCase()} disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site">Site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Access</Label>
                  <Input value={sampleUserData.access} readOnly className="bg-gray-50 text-[#C72030]" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Preference</Label>
                  <Select value="" disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder={sampleUserData.emailPreference} />
                    </SelectTrigger>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox 
                    id="dailyHelpdeskReport"
                    checked={sampleUserData.dailyHelpdeskReport}
                    disabled
                  />
                  <Label htmlFor="dailyHelpdeskReport">Daily Helpdesk Report Email</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
