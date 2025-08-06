import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Users, FileText, Plus, Download, Upload, Filter, Copy, Eye, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Sample data for FM Users
const fmUsersData = [
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
    appDownloaded: 'No'
  },
  {
    id: '228520',
    userName: 'Vinayak T test1',
    gender: 'Male',
    mobileNumber: '8898444896',
    email: 'vinayaktest1@yopmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: 'Vinayak Mane',
    createdBy: 'Company',
    accessLevel: 'Admin',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '224346',
    userName: 'Bhakti Test',
    gender: 'Female',
    mobileNumber: '9765588931',
    email: 'bngagare21@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Engineer',
    employeeId: 'Bhakti Gagare',
    createdBy: 'Site',
    accessLevel: 'Admin',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '220680',
    userName: 'Bhakti Gagare',
    gender: 'Male',
    mobileNumber: '7030715846',
    email: 'bhakti.gagre@lockated.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Engineer',
    employeeId: '',
    createdBy: 'Site',
    accessLevel: 'Admin',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '217972',
    userName: 'Test Step1',
    gender: 'Female',
    mobileNumber: '932663309',
    email: 'teststep1@yopmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: 'Sohail Ansari',
    createdBy: 'Company',
    accessLevel: 'Admin',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '214504',
    userName: 'Nancy Dsouza',
    gender: 'Female',
    mobileNumber: '8884558390',
    email: 'nancyssdsouza@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Distributor',
    employeeId: 'Karthik N',
    createdBy: 'Company',
    accessLevel: 'Admin',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '211529',
    userName: 'Swapnilkumar Darji',
    gender: '',
    mobileNumber: '19879004764',
    email: 'swapnilkumar.darji@vodafoneidea.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Specialist - Order to Cash',
    employeeId: '',
    createdBy: 'Site',
    accessLevel: 'Admin',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '180909',
    userName: 'Admin Kolkata',
    gender: '',
    mobileNumber: '7766543209',
    email: 'admin.kwb@vodafoneidea.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: '',
    createdBy: 'Site',
    accessLevel: 'Admin',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  }
];

export const MSafeDashboard = () => {
  const location = useLocation();
  const isSafetyRoute = location.pathname.startsWith('/safety');
  const [users, setUsers] = useState(fmUsersData);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  if (isSafetyRoute) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">M Safe</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/safety/m-safe/non-fte-users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NON FTE USERS</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Manage non-FTE users and their details
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/safety/m-safe/krcc-form-list">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KRCC FORM LIST</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  View and manage KRCC forms
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    );
  }

  // Maintenance M Safe page with FM Users table
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">M Safe - FM Users</h1>
      
      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button className="bg-purple-700 hover:bg-purple-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add FM User
        </Button>
        <Button variant="outline" className="bg-purple-700 hover:bg-purple-800 text-white border-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" className="bg-purple-700 hover:bg-purple-800 text-white border-purple-700">
          <Upload className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline">
          <Copy className="h-4 w-4 mr-2" />
          Clone Role
        </Button>
      </div>

      {/* FM Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Company Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Face Recognition</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App Downloaded</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Eye className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                        <Trash2 className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-700" />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Switch 
                        checked={user.active}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.userName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.gender}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.mobileNumber}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{user.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.vendorCompanyName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.entityName}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.unit}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.employeeId}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.createdBy}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.accessLevel}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.type}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.faceRecognition}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.appDownloaded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <span>Powered by</span>
        <span className="font-semibold text-orange-500">Phygitalwork</span>
      </div>
    </div>
  );
};