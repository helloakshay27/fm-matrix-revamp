
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Plus, Download, Upload, Filter, Search } from 'lucide-react';
import { AddOccupantUserModal } from '@/components/AddOccupantUserModal';
import { OccupantUserFiltersModal } from '@/components/OccupantUserFiltersModal';

const occupantUsers = [
  {
    id: 1,
    company: 'Lockated HQ',
    name: 'Test 11 Bulk',
    mobileNumber: '9774545410',
    emailId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    active: true
  },
  {
    id: 2,
    company: 'Lockated HQ',
    name: 'Test 12 Bulk',
    mobileNumber: '9774545411',
    emailId: 'aaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    active: true
  },
  {
    id: 3,
    company: 'Lockated HQ',
    name: 'Test 10 Bulk',
    mobileNumber: '9774545409',
    emailId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    active: true
  },
  {
    id: 4,
    company: 'Lockated HQ',
    name: 'Test 10 Bulk',
    mobileNumber: '9774545405',
    emailId: 'test101@yopmail.com',
    active: true
  },
  {
    id: 5,
    company: 'Lockated HQ',
    name: 'Vinayak test walletguest',
    mobileNumber: '8765445676',
    emailId: 'test203@yopmail.com',
    active: true
  },
  {
    id: 6,
    company: 'Lockated HQ',
    name: 'Vinayak testwallet guest',
    mobileNumber: '8462238292',
    emailId: 'test201@yopmail.com',
    active: true
  },
  {
    id: 7,
    company: 'Lockated HQ',
    name: 'Vinayak test wallet',
    mobileNumber: '8642589877',
    emailId: 'test200@yopmail.com',
    active: true
  },
  {
    id: 8,
    company: 'Lockated HQ',
    name: 'Dummy jksdfjas',
    mobileNumber: '3248283482',
    emailId: 'ssfaksjdf@sasfdasd.com',
    active: true
  },
  {
    id: 9,
    company: 'Lockated HQ',
    name: 'TestUser a',
    mobileNumber: '9231203910',
    emailId: 'test82928@yopmail.com',
    active: true
  }
];

export const OccupantUsersDashboard = () => {
  const [users, setUsers] = useState(occupantUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    { title: 'Total Users', value: '1016', color: 'bg-blue-500', icon: '👥' },
    { title: 'Approved', value: '576', color: 'bg-green-500', icon: '✓' },
    { title: 'Pending', value: '437', color: 'bg-orange-500', icon: '⏳' },
    { title: 'Rejected', value: '3', color: 'bg-red-500', icon: '✗' },
    { title: 'App downloaded', value: '15', color: 'bg-purple-500', icon: '📱' }
  ];

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">OCCUPANT USERS LIST</h1>
            <p className="text-sm text-gray-600 mt-1">Setup &gt; Occupant Users</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color} text-white p-4 rounded-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.title}</div>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            className="bg-purple-700 hover:bg-purple-800 text-white"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            <Download className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
            <Upload className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="border-purple-700 text-purple-700 hover:bg-purple-50"
            onClick={() => setIsFiltersModalOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-50">
              Go!
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Reset
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-20">Sr. No.</TableHead>
                <TableHead className="w-20">View</TableHead>
                <TableHead>Active / In-Active Users</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>Email ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className={`w-8 h-5 rounded-full flex items-center ${user.active ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${user.active ? 'translate-x-3' : 'translate-x-0.5'}`} />
                    </div>
                  </TableCell>
                  <TableCell>{user.company}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.mobileNumber}</TableCell>
                  <TableCell className="max-w-xs truncate">{user.emailId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <AddOccupantUserModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
        
        <OccupantUserFiltersModal 
          isOpen={isFiltersModalOpen} 
          onClose={() => setIsFiltersModalOpen(false)} 
        />
      </div>
    </SetupLayout>
  );
};
