
import React, { useState } from 'react';
import { Eye, Trash2, Search, Filter, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';

interface MSafeUser {
  id: string;
  active: boolean;
  userName: string;
  gender: string;
  mobileNumber: string;
  email: string;
  vendorCompanyName: string;
  entityName: string;
  unit: string;
  role: string;
  employeeId: string;
  createdBy: string;
  accessLevel: string;
  type: string;
  status: 'Approved' | 'Rejected';
  faceRecognition: 'No' | 'Yes';
  appDownload: 'No' | 'Yes';
}

// Mock data matching the structure from the image
const mockMSafeUsers: MSafeUser[] = [
  {
    id: '230825',
    active: true,
    userName: 'Vinayak T test19',
    gender: 'Male',
    mobileNumber: '8898',
    email: 'vinayaktest19@yopmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: 'Vinayak Mane',
    createdBy: 'Site',
    accessLevel: 'Admin',
    type: 'Admin',
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
  },
  {
    id: '228520',
    active: true,
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
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
  },
  {
    id: '224346',
    active: true,
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
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
  },
  {
    id: '220680',
    active: true,
    userName: 'Bhakti Gagare',
    gender: 'Male',
    mobileNumber: '7030715846',
    email: 'bhakti.gagre@lockatad.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Engineer',
    employeeId: '',
    createdBy: 'Site',
    accessLevel: 'Admin',
    type: 'Admin',
    status: 'Approved',
    faceRecognition: 'No',
    appDownload: 'No'
  },
  {
    id: '168459',
    active: false,
    userName: 'VEEKSHA',
    gender: 'FEMALE',
    mobileNumber: '9664395644',
    email: 'veeksha.agrawal@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Associate',
    employeeId: 'Rakesh Purohit',
    createdBy: 'Company',
    accessLevel: 'Admin',
    type: 'Admin',
    status: 'Rejected',
    faceRecognition: 'No',
    appDownload: 'No'
  }
];

export const MSafePage = () => {
  const { isSidebarCollapsed } = useLayout();
  const [users, setUsers] = useState<MSafeUser[]>(mockMSafeUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handleToggleActive = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
    toast.success('User status updated');
  };

  const handleView = (userId: string) => {
    toast.info(`Viewing details for user ID: ${userId}`);
    console.log('View user:', userId);
  };

  const handleDelete = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast.success('User deleted successfully');
    console.log('Delete user:', userId);
  };

  const handleImport = () => {
    toast.info('Import functionality');
    console.log('Import clicked');
  };

  const handleExport = () => {
    toast.info('Export functionality');
    console.log('Export clicked');
  };

  const handleFilters = () => {
    toast.info('Filters functionality');
    console.log('Filters clicked');
  };

  return (
    <div 
      className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      } p-6 bg-gray-50 min-h-screen`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>Setup</span>
          <span className="mx-2">›</span>
          <span>FM Users</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">FM USERS</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button 
          onClick={handleImport}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button 
          onClick={handleExport}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button 
          onClick={handleFilters}
          variant="outline" 
          className="border-gray-300"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
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
              <TableHead>App Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(user.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.active}
                    onCheckedChange={() => handleToggleActive(user.id)}
                    className="data-[state=checked]:bg-green-600"
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
                  <StatusBadge 
                    variant={user.status === 'Approved' ? 'accepted' : 'rejected'}
                  >
                    {user.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>{user.faceRecognition}</TableCell>
                <TableCell>{user.appDownload}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-blue-600 text-white" : ""}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
