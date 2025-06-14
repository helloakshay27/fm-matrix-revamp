import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Upload, Download, Filter, Eye } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { SetupLayout } from '@/components/SetupLayout';
import { useNavigate } from 'react-router-dom';

// Sample data for the occupant users table
const occupantUsersData = [
  {
    id: 1,
    name: 'Test 11 Bulk',
    company: 'Lookated HO',
    mobile: '9774545410',
    email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    isActive: true
  },
  {
    id: 2,
    name: 'Test 12 Bulk',
    company: 'Lookated HO',
    mobile: '9774545411',
    email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    isActive: true
  },
  {
    id: 3,
    name: 'Test 10 Bulk',
    company: 'Lookated HO',
    mobile: '9774545409',
    email: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
    isActive: true
  },
  {
    id: 4,
    name: 'Test 10 Bulk',
    company: 'Lookated HO',
    mobile: '9774545405',
    email: 'test101@yomail.com',
    isActive: true
  },
  {
    id: 5,
    name: 'Vinayak test wallguest',
    company: 'Lookated HO',
    mobile: '8765445076',
    email: 'test203@yomail.com',
    isActive: true
  },
  {
    id: 6,
    name: 'Vinayak testwalletguest',
    company: 'Lookated HO',
    mobile: '8402238202',
    email: 'test201@yomail.com',
    isActive: true
  },
  {
    id: 7,
    name: 'Vinayak test wallet',
    company: 'Lookated HO',
    mobile: '8645568677',
    email: 'test200@yomail.com',
    isActive: true
  },
  {
    id: 8,
    name: 'Dummy jksdfjas',
    company: 'Lookated HO',
    mobile: '3248283482',
    email: 'safaksipf@asdfasd.com',
    isActive: true
  },
  {
    id: 9,
    name: 'TestUser a',
    company: 'Lookated HO',
    mobile: '9231203910',
    email: 'test82926@yomail.com',
    isActive: true
  },
  {
    id: 10,
    name: 'asjdf fasijdf',
    company: 'Lookated HO',
    mobile: '2234789274',
    email: 'asdf@dfjkasdf.com',
    isActive: true
  }
];

export const OccupantUsersDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = occupantUsersData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    navigate('/setup/occupant-users/add');
  };

  return (
    <SetupLayout>
      <div className="p-6 bg-[#f6f4ee] min-h-screen">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span>Setup</span>
            <span>&gt;</span>
            <span>Occupant Users</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-6">OCCUPANT USERS LIST</h1>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">👥</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">1016</div>
                  <div className="text-sm opacity-90">Total Users</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">✓</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">576</div>
                  <div className="text-sm opacity-90">Approved</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">⏳</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">437</div>
                  <div className="text-sm opacity-90">Pending</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-400 to-red-500 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">✗</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm opacity-90">Rejected</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg">⚙️</span>
                </div>
                <div>
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-sm opacity-90">App downloaded</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            {/* Action Buttons */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-wrap gap-3 items-center">
                <Button 
                  onClick={handleAddUser}
                  className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button variant="outline" className="border-gray-300">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" className="border-gray-300">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" className="border-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                <div className="flex-1 flex justify-end items-center gap-3">
                  <Input
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button className="bg-purple-700 hover:bg-purple-800 text-white">
                    Go!
                  </Button>
                  <Button variant="outline" className="border-gray-300">
                    Reset
                  </Button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-center">Sr No.</TableHead>
                    <TableHead className="text-center">View</TableHead>
                    <TableHead className="text-center">Active / In-Active Users</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Email ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch checked={user.isActive} />
                      </TableCell>
                      <TableCell>{user.company}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.mobile}</TableCell>
                      <TableCell className="max-w-xs truncate" title={user.email}>
                        {user.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </SetupLayout>
  );
};
