import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User } from 'lucide-react';

// Sample user data - in a real app, this would come from an API
const getUserById = (id: string) => {
  const users = [
    {
      id: '230825',
      userName: 'Vinayak T test19',
      gender: 'Male',
      mobileNumber: '8898',
      email: 'vinayaktest19@yopmail.com',
      vendorCompanyName: 'N/A',
      entityName: 'N/A',
      unit: '',
      role: 'Admin',
      employeeId: 'Vinayak T test1',
      createdBy: 'Site',
      accessLevel: 'Admin',
      type: 'Admin',
      active: true,
      status: 'Approved',
      faceRecognition: 'No',
      appDownloaded: 'No',
      // Additional fields for detailed view
      profilePicture: null,
      dateOfBirth: '1990-01-15',
      address: '123 Main Street, City, State',
      emergencyContact: '9876543210',
      site: 'Main Office',
      department: 'IT',
      joiningDate: '2023-01-15',
      reportingManager: 'John Doe'
    }
    // Add more sample data as needed
  ];
  
  return users.find(user => user.id === id);
};

export const MSafeUserDetailsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const user = userId ? getUserById(userId) : null;

  if (!user) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">User Not Found</h1>
        </div>
        <p>The requested user could not be found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">User Details - {user.userName}</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="other">Other Information</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.userName}</h3>
                  <p className="text-sm text-gray-600">ID: {user.id}</p>
                </div>
              </div>

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.userName}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.gender}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.mobileNumber}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.dateOfBirth}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.address}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Emergency Contact</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.emergencyContact}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      <span className={`px-2 py-1 rounded text-sm ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Information Tab */}
        <TabsContent value="other">
          <Card>
            <CardHeader>
              <CardTitle>Other Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Site</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.site}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Employee ID</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.employeeId}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.department}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.role}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Access Level</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.accessLevel}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Vendor Company Name</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.vendorCompanyName}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Entity Name</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.entityName}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Unit</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.unit || 'N/A'}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created By</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.createdBy}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Joining Date</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.joiningDate}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reporting Manager</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.reportingManager}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Face Recognition</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.faceRecognition}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">App Downloaded</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                      {user.appDownloaded}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
