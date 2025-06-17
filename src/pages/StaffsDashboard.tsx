
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Plus, Filter, Eye, Edit, FileText, QrCode, Search } from 'lucide-react';
import { StaffsFilterModal } from '@/components/StaffsFilterModal';
import { AddStaffModal } from '@/components/AddStaffModal';

// Sample data for different views
const allStaffsData = [
  {
    id: '38969',
    name: 'Avdesh Tiwari',
    unit: '512',
    department: 'Operations',
    email: 'avdesh.tiwari@example.com',
    mobile: '9987654390',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validTill: '01/02/2023',
    checkIn: null,
    checkOut: null,
    isIn: false
  },
  {
    id: '37764',
    name: 'Avdesh Tiwari',
    unit: 'HELP DESK',
    department: 'HR',
    email: 'avdesh.tiwari@vodafoneidea.com',
    mobile: '9876567665',
    workType: 'Vendor',
    vendorName: '',
    status: 'Approved',
    validTill: '01/02/2023',
    checkIn: '28/07/2023 3:47 PM',
    checkOut: '28/07/2023 3:48 PM',
    isIn: true
  },
  {
    id: '37143',
    name: 'Sohail Ansari',
    unit: 'HELP DESK',
    department: 'Operations',
    email: '',
    mobile: '7715088437',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validTill: '01/02/2023',
    checkIn: '28/07/2023 3:45 PM',
    checkOut: '28/07/2023 3:47 PM',
    isIn: true
  },
  {
    id: '36954',
    name: 'Chandan Kumar',
    unit: 'Reception',
    department: 'ACCOUNTS',
    email: 'chandanthakur22988@gmail.com',
    mobile: '8489599800',
    workType: 'Other',
    vendorName: '',
    status: 'Approved',
    validTill: '01/02/2023',
    checkIn: null,
    checkOut: null,
    isIn: false
  }
];

const historyData = [
  {
    name: 'Jems J',
    mobile: '9483728392',
    workType: 'Vendor',
    unit: '',
    department: '',
    vendorName: '',
    validTill: '01/02/2023',
    checkIn: '28/07/2023 3:47 PM',
    checkOut: '28/07/2023 3:48 PM',
    gate: 'Gate'
  },
  {
    name: 'Jems J',
    mobile: '9483728392',
    workType: 'Vendor',
    unit: '',
    department: '',
    vendorName: '',
    validTill: '01/02/2023',
    checkIn: '28/07/2023 3:45 PM',
    checkOut: '28/07/2023 3:47 PM',
    gate: 'Gate'
  }
];

export const StaffsDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const renderTableView = () => {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <input type="checkbox" className="rounded" />
              </TableHead>
              <TableHead>View</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Staff Id</TableHead>
              <TableHead>Work type</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allStaffsData.map((staff, index) => (
              <TableRow key={staff.id} className="hover:bg-gray-50">
                <TableCell>
                  <input type="checkbox" className="rounded" />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 text-green-600" />
                  </Button>
                </TableCell>
                <TableCell className="text-blue-600">{staff.id}</TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.unit}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell className="text-blue-600">{staff.email}</TableCell>
                <TableCell>{staff.mobile}</TableCell>
                <TableCell></TableCell>
                <TableCell>{staff.workType}</TableCell>
                <TableCell>{staff.vendorName}</TableCell>
                <TableCell>
                  <span className="text-green-600 font-medium">{staff.status}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderHistoryView = () => {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Work Type</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Check-In</TableHead>
              <TableHead>Check-Out</TableHead>
              <TableHead>In</TableHead>
              <TableHead>Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((staff, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="text-blue-600">{staff.name}</TableCell>
                <TableCell>{staff.mobile}</TableCell>
                <TableCell>{staff.workType}</TableCell>
                <TableCell>{staff.unit}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.vendorName}</TableCell>
                <TableCell>{staff.validTill}</TableCell>
                <TableCell>{staff.checkIn}</TableCell>
                <TableCell>{staff.checkOut}</TableCell>
                <TableCell>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">{staff.gate}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-600">{staff.gate}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderCardView = () => {
    const inStaffs = allStaffsData.filter(staff => staff.isIn);
    const outStaffs = allStaffsData.filter(staff => !staff.isIn);
    const dataToShow = activeTab === 'in' ? inStaffs : outStaffs;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {dataToShow.map((staff, index) => (
          <div key={staff.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👤</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{staff.name}</h3>
              <p className="text-sm text-gray-600">{staff.mobile}</p>
              <p className="text-sm font-medium text-gray-800">{staff.workType}</p>
              <p className="text-sm text-gray-600">{staff.department}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                {activeTab === 'in' ? 'In' : 'Out'}
              </span>
              {activeTab === 'out' && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                >
                  Check In
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Staffs</span>
          <span>&gt;</span>
          <span>Society Staffs</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">SOCIETY STAFFS</h2>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-4 py-2 rounded-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button 
                onClick={() => setIsFilterModalOpen(true)}
                variant="outline" 
                className="border-gray-300 px-4 py-2 rounded-md"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" className="border-gray-300 px-4 py-2 rounded-md">
                <FileText className="w-4 h-4 mr-2" />
                Print QR
              </Button>
              <Button variant="outline" className="border-gray-300 px-4 py-2 rounded-md">
                <FileText className="w-4 h-4 mr-2" />
                Print ALL QR
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-gray-200 p-1 rounded-lg w-fit mb-4">
              <Button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'history' 
                    ? 'bg-[#8B4B8C] text-white shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </Button>
              <Button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-[#8B4B8C] text-white shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </Button>
              <Button 
                onClick={() => setActiveTab('in')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'in' 
                    ? 'bg-[#8B4B8C] text-white shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                In
              </Button>
              <Button 
                onClick={() => setActiveTab('out')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'out' 
                    ? 'bg-[#8B4B8C] text-white shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Out
              </Button>
            </div>

            {/* Search Bar for In/Out tabs */}
            {(activeTab === 'in' || activeTab === 'out') && (
              <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search using staff's name or mobile number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  className="bg-[#8B4B8C] hover:bg-[#7A4077] text-white px-4 py-2 rounded-md"
                >
                  Go!
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            {activeTab === 'history' && renderHistoryView()}
            {activeTab === 'all' && renderTableView()}
            {(activeTab === 'in' || activeTab === 'out') && renderCardView()}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <StaffsFilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* Add Staff Modal */}
      <AddStaffModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
