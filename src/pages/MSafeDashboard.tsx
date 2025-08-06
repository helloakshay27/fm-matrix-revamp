
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, FileText, Download, Upload, Filter, Copy, Eye, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { TicketPagination } from '@/components/TicketPagination';

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
  },
  // Add more sample data to demonstrate pagination
  {
    id: '180908',
    userName: 'Test User 1',
    gender: 'Male',
    mobileNumber: '9876543210',
    email: 'test1@example.com',
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
  },
  {
    id: '180907',
    userName: 'Test User 2',
    gender: 'Female',
    mobileNumber: '9876543211',
    email: 'test2@example.com',
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
  },
  {
    id: '180906',
    userName: 'Test User 3',
    gender: 'Male',
    mobileNumber: '9876543212',
    email: 'test3@example.com',
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate pagination
  const totalRecords = users.length;
  const totalPages = Math.ceil(totalRecords / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
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
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Actions</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vendor Company Name</TableHead>
              <TableHead>Entity Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Face Recognition</TableHead>
              <TableHead>App Downloaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-1 h-8 w-8 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4 text-gray-600 hover:text-[#C72030]" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 h-8 w-8 hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600 hover:text-red-600" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={user.active}
                    onCheckedChange={() => toggleUserStatus(user.id)}
                    className="data-[state=checked]:bg-green-500"
                  />
                </TableCell>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell className="text-blue-600">{user.email}</TableCell>
                <TableCell>{user.vendorCompanyName}</TableCell>
                <TableCell>{user.entityName}</TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.createdBy}</TableCell>
                <TableCell>{user.accessLevel}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.faceRecognition}</TableCell>
                <TableCell>{user.appDownloaded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <TicketPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        perPage={perPage}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <span>Powered by</span>
        <span className="font-semibold text-orange-500">Phygitalwork</span>
      </div>
    </div>
  );
};
