import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, Filter, ArrowRightLeft } from 'lucide-react';

// Enhanced FM Users data with additional columns as shown in the image
const fmUsers = [
  {
    id: '212923',
    userName: 'yyujvjy jiujo',
    gender: 'Male',
    mobileNumber: '7897780978',
    email: 'tesruhhh@gmail.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Pending',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '212919',
    userName: 'sameer kumar',
    gender: '',
    mobileNumber: '2134513211',
    email: '2134513211@gmail.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Soft Skill Personnel',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '212384',
    userName: 'ABHIDNYA TAPAL',
    gender: 'Female',
    mobileNumber: '7208523035',
    email: 'abhidnyatapal@gmail.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'Yes'
  },
  {
    id: '195169',
    userName: 'Dhananjay Bhoyar',
    gender: 'Male',
    mobileNumber: '9022281139',
    email: 'dhananjay.bhoyar@lockated.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '193551',
    userName: 'Ravi Sampat',
    gender: '',
    mobileNumber: '9653473232',
    email: 'ravi.sampat@lockated.com',
    unit: 'Function 1',
    department: '',
    employeeId: '',
    accessLevel: 'Company',
    type: 'Admin',
    role: 'Vinayak Test Role',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'Yes'
  },
  {
    id: '193550',
    userName: 'Jyoti Dubey',
    gender: '',
    mobileNumber: '8108245903',
    email: 'jyotidubey.tiwari@lockated.com',
    unit: 'Function 3',
    department: '',
    employeeId: '',
    accessLevel: 'Company',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'Yes'
  },
  {
    id: '192335',
    userName: 'Pratik Bobade',
    gender: 'Male',
    mobileNumber: '8805056392',
    email: 'pratik.bobade@lockated.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'No',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '190844',
    userName: 'Sadanand Gupta',
    gender: 'Male',
    mobileNumber: '9769884879',
    email: 'sadanand.gupta@lockated.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Country',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '182388',
    userName: 'Komal Shinde',
    gender: 'Female',
    mobileNumber: '8669112232',
    email: 'komal.shinde@lockated.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'Yes'
  },
  {
    id: '182347',
    userName: 'Sony Bhosle',
    gender: 'F',
    mobileNumber: '9607574091',
    email: 'sony.bhosle@lockated.com',
    unit: 'Function 3',
    department: '',
    employeeId: '',
    accessLevel: 'Company',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'Yes',
    appDownloaded: 'Yes'
  },
  {
    id: '156462',
    userName: 'Ajay Pihulkar',
    gender: '',
    mobileNumber: '7709672441',
    email: 'ajay.pihulkar@gophysital.work',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '156461',
    userName: 'Priya Mane',
    gender: '',
    mobileNumber: '9921229952',
    email: 'priya@lockated.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  },
  {
    id: '156459',
    userName: 'Omkar Chavan',
    gender: '',
    mobileNumber: '9767112823',
    email: 'omkar.chavan@lockated.com',
    unit: '',
    department: '',
    employeeId: '',
    accessLevel: 'Site',
    type: 'Admin',
    role: 'Admin',
    active: 'Yes',
    status: 'Approved',
    faceRecognition: 'No',
    appDownloaded: 'No'
  }
];

const CRMFMUserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = fmUsers.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobileNumber.includes(searchTerm) ||
    user.id.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        FM &gt; FM User List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900">FM USER LIST</h1>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Clone/Transfer
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-20">Action</TableHead>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead className="w-20">Gender</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-20">Unit</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead className="w-20">Type</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-20">Active</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead>Face Recognition</TableHead>
              <TableHead>App Downloaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.accessLevel}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.active}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.faceRecognition}</TableCell>
                <TableCell>{user.appDownloaded}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CRMFMUserDashboard;
