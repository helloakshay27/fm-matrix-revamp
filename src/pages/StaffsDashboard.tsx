
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Filter, Eye, Edit, FileText, QrCode } from 'lucide-react';
import { StaffsFilterModal } from '@/components/StaffsFilterModal';
import { AddStaffModal } from '@/components/AddStaffModal';

// Sample data for the staffs table
const staffsData = [
  {
    id: '38969',
    name: 'Avdesh Tiwari',
    unit: '512',
    department: 'Operations',
    email: 'avdesh.tiwari@example.com',
    mobile: '9987654390',
    workType: 'Other',
    vendorName: '',
    status: 'Approved'
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
    status: 'Approved'
  },
  {
    id: '37144',
    name: '',
    unit: '',
    department: '',
    email: '',
    mobile: '',
    workType: '',
    vendorName: '',
    status: 'Approved'
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
    status: 'Approved'
  },
  {
    id: '36954',
    name: '',
    unit: '',
    department: '',
    email: '',
    mobile: '',
    workType: '',
    vendorName: '',
    status: 'Approved'
  }
];

export const StaffsDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>visitors</span>
          <span>&gt;</span>
          <span>Staffs</span>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <span>Staffs</span>
              <span>&gt;</span>
              <span>Society Staffs</span>
            </div>
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
            <div className="flex gap-1 bg-gray-200 p-1 rounded-lg w-fit">
              <Button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'history' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </Button>
              <Button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </Button>
              <Button 
                onClick={() => setActiveTab('in')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'in' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                In
              </Button>
              <Button 
                onClick={() => setActiveTab('out')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'out' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Out
              </Button>
            </div>
          </div>

          {/* Table */}
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
                {staffsData.map((staff, index) => (
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
