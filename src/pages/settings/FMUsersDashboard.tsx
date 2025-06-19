
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Plus, Filter } from 'lucide-react';
import { AddFMUserModal } from '@/components/AddFMUserModal';
import { FMUserFiltersModal } from '@/components/FMUserFiltersModal';
import { ImportDataModal } from '@/components/ImportDataModal';
import { useNavigate } from 'react-router-dom';

const fmUsers = [
  {
    id: '191075',
    userName: 'Kunal Javare',
    gender: 'Male',
    mobileNumber: '7020371580',
    email: 'kunal.javare1@lockated.com',
    vendorCompanyName: 'N/A',
    entityName: 'Tata',
    unit: '',
    role: 'Admin',
    employeeId: '',
    createdBy: '',
    accessLevel: 'Company',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No'
  },
  {
    id: '139207',
    userName: 'zs Demo',
    gender: 'Male',
    mobileNumber: '7098674532',
    email: 'zsdemo@gophysital.work',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: 'TCS B Unit',
    role: 'Admin',
    employeeId: 'Demo',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: false,
    status: 'Rejected',
    faceRecognition: 'No'
  },
  {
    id: '138956',
    userName: 'Rabi Narayan',
    gender: '',
    mobileNumber: '3065229918',
    email: 'accountssw@intactautomation.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Admin',
    employeeId: '',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No'
  },
  {
    id: '137594',
    userName: 'PSIPL 1',
    gender: 'Male',
    mobileNumber: '6897000000',
    email: 'psipl@gophysital.work',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'QA',
    employeeId: '',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No'
  },
  {
    id: '131592',
    userName: 'admin admin',
    gender: 'Male',
    mobileNumber: '9000033321',
    email: 'admin@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: 'cloneunit',
    role: 'Admin',
    employeeId: '',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: false,
    status: 'Rejected',
    faceRecognition: 'No'
  },
  {
    id: '128114',
    userName: 'tejas chaudhari',
    gender: 'Male',
    mobileNumber: '1121212121',
    email: 'lock2@lockated.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'Account Manager',
    employeeId: '',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Pending',
    faceRecognition: 'No'
  },
  {
    id: '122658',
    userName: 'vendor demo 5',
    gender: '',
    mobileNumber: '987456123',
    email: 'vendorportal5@gmail.com',
    vendorCompanyName: 'ABCD',
    entityName: 'N/A',
    unit: 'C',
    role: 'Admin work',
    employeeId: '',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Approved',
    faceRecognition: 'No'
  },
  {
    id: '119997',
    userName: 'Quikgate Demo',
    gender: 'Male',
    mobileNumber: '9988009988',
    email: 'quikgatedemo1@lockated.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: '',
    role: 'N Security',
    employeeId: '',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Security',
    active: true,
    status: 'Approved',
    faceRecognition: 'No'
  },
  {
    id: '112751',
    userName: 'Demofirst Demolast',
    gender: 'Male',
    mobileNumber: '6300000014',
    email: 'demolit@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: 'Haven Havana',
    role: 'admin',
    employeeId: '101',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Pending',
    faceRecognition: 'No'
  },
  {
    id: '105767',
    userName: 'satish kumar',
    gender: 'Male',
    mobileNumber: '8909356566',
    email: 'ktafdsfd@gmail.com',
    vendorCompanyName: 'N/A',
    entityName: 'N/A',
    unit: 'TCS B Unit',
    role: 'Admin',
    employeeId: '12422',
    createdBy: '',
    accessLevel: 'Site',
    type: 'Admin',
    active: true,
    status: 'Pending',
    faceRecognition: 'No'
  }
];

export const FMUsersDashboard = () => {
  const [users, setUsers] = useState(fmUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleCloneRole = () => {
    navigate('/settings/users/clone-role');
  };

  const handleViewDetails = (userId: string) => {
    navigate(`/settings/users/edit-details/${userId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Setup &gt; FM Users</p>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">FM USERS</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Button 
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FM User
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => setIsImportModalOpen(true)}
        >
          Import
        </Button>
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          Export
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => setIsFiltersModalOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={handleCloneRole}
        >
          Clone Role
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(user.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className={`w-8 h-5 rounded-full flex items-center ${user.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${user.active ? 'translate-x-3' : 'translate-x-0.5'}`} />
                  </div>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddFMUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      <FMUserFiltersModal 
        isOpen={isFiltersModalOpen} 
        onClose={() => setIsFiltersModalOpen(false)} 
      />

      <ImportDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};
