
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Trash2, Filter } from 'lucide-react';
import { TicketPagination } from '@/components/TicketPagination';

const msafeUsers = [
  {
    id: '230825',
    userName: 'Vinayak Test19',
    gender: 'Male',
    mobileNumber: '8898',
    email: 'vinayaktest19@yopmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: '',
    createdBy: 'Vinayak Mane',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
  },
  {
    id: '228520',
    userName: 'Vinayak Test1',
    gender: 'Male',
    mobileNumber: '8898444896',
    email: 'vinayaktest1@yopmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: '',
    createdBy: 'Vinayak Mane',
    accessLevel: 'Company',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
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
    employeeId: '',
    createdBy: 'Bhakti Gagare',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
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
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
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
    employeeId: '',
    createdBy: 'Sohail Ansari',
    accessLevel: 'Company',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
  },
  {
    id: '214504',
    userName: 'Nancy Dsouza',
    gender: 'Female',
    mobileNumber: '8884558390',
    email: 'nancysdsouza@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Distributor',
    employeeId: '',
    createdBy: 'Karthik N',
    accessLevel: 'Company',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
  },
  {
    id: '168459',
    userName: 'VEEKSHA',
    gender: 'FEMALE',
    mobileNumber: '9664395644',
    email: 'veeksha.agrawal@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Associate',
    employeeId: '',
    createdBy: 'Rakesh Purohit',
    accessLevel: 'Company',
    type: 'Admin',
    active: false,
    status: 'Rejected',
    faceRecognition: 'No',
    appDownload: 'No'
  },
  {
    id: '156706',
    userName: 'Test VIL',
    gender: '',
    mobileNumber: '1122112215',
    email: 'testvil@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Housekeeping',
    employeeId: '',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'Yes'
  }
];

export const MSafePage = () => {
  const [users, setUsers] = useState(msafeUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500';
      case 'Rejected':
        return 'bg-red-500';
      case 'Pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleViewDetails = (userId: string) => {
    console.log('View details for user:', userId);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };

  const toggleUserActive = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, active: !user.active }
          : user
      )
    );
  };

  const totalPages = Math.ceil(users.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedUsers = users.slice(startIndex, startIndex + perPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Setup &gt; FM Users</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">FM USERS</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Import
        </Button>
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Export
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-20">Actions</TableHead>
              <TableHead className="w-20">Active</TableHead>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead className="w-20">Gender</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vendor Company Name</TableHead>
              <TableHead>Entity Name</TableHead>
              <TableHead className="w-20">Unit</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead className="w-20">Type</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead>Face Recognition</TableHead>
              <TableHead>App Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(user.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleUserActive(user.id)}
                    className={`w-8 h-5 rounded-full flex items-center transition-colors ${user.active ? 'bg-green-500' : 'bg-gray-300'} cursor-pointer`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${user.active ? 'translate-x-3' : 'translate-x-0.5'}`} />
                  </button>
                </TableCell>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.vendorCompanyName}</TableCell>
                <TableCell>{user.entityName}</TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.createdBy}</TableCell>
                <TableCell>{user.accessLevel}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.faceRecognition}</TableCell>
                <TableCell>{user.appDownload}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TicketPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={users.length}
        perPage={perPage}
        isLoading={false}
        onPageChange={setCurrentPage}
        onPerPageChange={setPerPage}
      />
    </div>
  );
};
