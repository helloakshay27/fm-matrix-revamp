
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Filter, Eye, Edit, FileText, QrCode, Search, Trash2 } from 'lucide-react';
import { StaffsFilterModal } from '@/components/StaffsFilterModal';
import { AddStaffModal } from '@/components/AddStaffModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

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

// Column configuration for the enhanced table
const columns: ColumnConfig[] = [
  { key: 'actions', label: 'Action', sortable: false, hideable: false, draggable: false },
  { key: 'id', label: 'Staff ID', sortable: true, hideable: true, draggable: true },
  { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true },
  { key: 'unit', label: 'Unit', sortable: true, hideable: true, draggable: true },
  { key: 'department', label: 'Department', sortable: true, hideable: true, draggable: true },
  { key: 'email', label: 'Email', sortable: true, hideable: true, draggable: true },
  { key: 'mobile', label: 'Mobile', sortable: true, hideable: true, draggable: true },
  { key: 'workType', label: 'Work Type', sortable: true, hideable: true, draggable: true },
  { key: 'vendorName', label: 'Vendor Name', sortable: true, hideable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true },
  { key: 'validTill', label: 'Valid Till', sortable: true, hideable: true, draggable: true },
  { key: 'checkIn', label: 'Check In', sortable: true, hideable: true, draggable: true },
  { key: 'checkOut', label: 'Check Out', sortable: true, hideable: true, draggable: true }
];

const getStatusBadgeColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-600 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    case 'rejected':
      return 'bg-red-100 text-red-600 border-red-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

export const StaffsDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);

  const handlePrintQR = () => {
    console.log('Printing QR codes for selected staff...');
    // Mock QR generation logic
    const selectedStaffs = allStaffsData.slice(0, 1); // Mock selected staff
    
    const qrData = selectedStaffs.map(staff => ({
      id: staff.id,
      name: staff.name,
      mobile: staff.mobile,
      qrCode: `STAFF-${staff.id}-${Date.now()}`
    }));
    
    console.log('Generated QR codes:', qrData);
    
    // In a real app, this would integrate with a QR code library
    alert(`Generated QR codes for ${qrData.length} staff member(s)`);
  };

  const handlePrintAllQR = () => {
    console.log('Printing QR codes for all staff...');
    
    const qrData = allStaffsData.map(staff => ({
      id: staff.id,
      name: staff.name,
      mobile: staff.mobile,
      qrCode: `STAFF-${staff.id}-${Date.now()}`
    }));
    
    console.log('Generated QR codes for all staff:', qrData);
    
    // In a real app, this would integrate with a QR code library
    alert(`Generated QR codes for all ${qrData.length} staff members`);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
    // Search functionality is already implemented via filteredData
  };

  const handleViewStaff = (staffId: string) => {
    navigate(`/security/staff/details/${staffId}`);
  };

  const handleEditStaff = (staffId: string) => {
    navigate(`/security/staff/edit/${staffId}`);
  };

  const handleDeleteStaff = (staffId: string) => {
    console.log('Deleting staff:', staffId);
    // Add delete functionality here
  };

  const handleStaffSelection = (staffId: string, checked: boolean) => {
    setSelectedStaffs(prev => 
      checked 
        ? [...prev, staffId]
        : prev.filter(id => id !== staffId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedStaffs(checked ? filteredData().map(staff => staff.id) : []);
  };

  const filteredData = () => {
    if (activeTab === 'history') {
      return historyData.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.mobile.includes(searchTerm)
      );
    }
    
    const baseData = activeTab === 'in' 
      ? allStaffsData.filter(staff => staff.isIn)
      : activeTab === 'out'
      ? allStaffsData.filter(staff => !staff.isIn)
      : allStaffsData;
    
    return baseData.filter(staff =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.mobile.includes(searchTerm) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.id.includes(searchTerm)
    );
  };

  const renderRow = (staff: any) => ({
    actions: (
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleViewStaff(staff.id);
          }}
          className="p-2 h-8 w-8 hover:bg-accent"
          title="View staff"
        >
          <Eye className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleEditStaff(staff.id);
          }}
          className="p-2 h-8 w-8 hover:bg-accent"
          title="Edit staff"
        >
          <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteStaff(staff.id);
          }}
          className="p-2 h-8 w-8 hover:bg-accent"
          title="Delete staff"
        >
          <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
        </Button>
      </div>
    ),
    id: <span className="font-medium text-blue-600">{staff.id}</span>,
    name: staff.name,
    unit: staff.unit,
    department: staff.department,
    email: staff.email ? <span className="text-blue-600">{staff.email}</span> : '--',
    mobile: staff.mobile,
    workType: staff.workType,
    vendorName: staff.vendorName || '--',
    status: (
      <Badge className={getStatusBadgeColor(staff.status)}>
        {staff.status}
      </Badge>
    ),
    validTill: staff.validTill || '--',
    checkIn: staff.checkIn || '--',
    checkOut: staff.checkOut || '--'
  });

  const renderHistoryView = () => {
    const data = filteredData();
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f6f4ee]">
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
            {data.map((staff, index) => (
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
    const data = filteredData();

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {data.map((staff, index) => (
          <div key={staff.id || index} className="bg-white rounded-none border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-none flex items-center justify-center">
              <span className="text-white font-bold">👤</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{staff.name}</h3>
              <p className="text-sm text-gray-600">{staff.mobile}</p>
              <p className="text-sm font-medium text-gray-800">{staff.workType}</p>
              <p className="text-sm text-gray-600">{staff.department}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded-none text-xs font-medium">
                {activeTab === 'in' ? 'In' : 'Out'}
              </span>
              {activeTab === 'out' && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded-none"
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
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        
        <div className="bg-white rounded-none border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-work-sans font-semibold text-base sm:text-lg lg:text-xl leading-auto tracking-normal mb-4 text-[#1a1a1a] uppercase">SOCIETY STAFFS</h2>
            
            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
              <Button 
                onClick={() => setIsFilterModalOpen(true)}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button 
                onClick={handlePrintQR}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Print QR
              </Button>
              <Button 
                onClick={handlePrintAllQR}
                style={{ backgroundColor: '#C72030' }}
                className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none"
              >
                <FileText className="w-4 h-4 mr-2" />
                Print ALL QR
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-gray-200 p-1 rounded-none w-fit mb-4">
              <Button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-none text-sm font-medium transition-colors ${
                  activeTab === 'history' 
                    ? 'text-white shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'history' ? { backgroundColor: '#C72030' } : {}}
              >
                History
              </Button>
              <Button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-none text-sm font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'text-white shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'all' ? { backgroundColor: '#C72030' } : {}}
              >
                All
              </Button>
              <Button 
                onClick={() => setActiveTab('in')}
                className={`px-4 py-2 rounded-none text-sm font-medium transition-colors ${
                  activeTab === 'in' 
                    ? 'text-white shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'in' ? { backgroundColor: '#C72030' } : {}}
              >
                In
              </Button>
              <Button 
                onClick={() => setActiveTab('out')}
                className={`px-4 py-2 rounded-none text-sm font-medium transition-colors ${
                  activeTab === 'out' 
                    ? 'text-white shadow-sm' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
                style={activeTab === 'out' ? { backgroundColor: '#C72030' } : {}}
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
                    className="pl-10 bg-white h-10 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030] text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  style={{ backgroundColor: '#C72030' }}
                  className="hover:bg-[#C72030]/90 text-white px-6 py-2 h-10 rounded-none text-sm font-medium border-0"
                >
                  Go!
                </Button>
              </div>
            )}

          </div>

          {/* Content */}
          <div className="overflow-x-auto animate-fade-in">
            {(activeTab === 'in' || activeTab === 'out') ? (
              renderCardView()
            ) : activeTab === 'history' ? (
              renderHistoryView()
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <EnhancedTable
                  data={filteredData()}
                  columns={columns}
                  renderRow={renderRow}
                  enableSearch={false}
                  enableSelection={true}
                  enableExport={true}
                  storageKey="staff-table"
                  emptyMessage="No staff found"
                  exportFileName="staff-records"
                  selectedItems={selectedStaffs}
                  getItemId={(staff) => staff.id}
                  onSelectItem={handleStaffSelection}
                  onSelectAll={handleSelectAll}
                  leftActions={
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => setIsAddModalOpen(true)}
                        style={{ backgroundColor: '#C72030' }}
                        className="hover:bg-[#C72030]/90 text-white px-4 py-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                      <Button 
                        onClick={handlePrintQR}
                        style={{ backgroundColor: '#C72030' }}
                        className="hover:bg-[#C72030]/90 text-white px-4 py-2"
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        Print QR
                      </Button>
                      <Button 
                        onClick={handlePrintAllQR}
                        style={{ backgroundColor: '#C72030' }}
                        className="hover:bg-[#C72030]/90 text-white px-4 py-2"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Print ALL QR
                      </Button>
                    </div>
                  }
                  onFilterClick={() => setIsFilterModalOpen(true)}
                  searchPlaceholder="Search staff by name, ID, email or mobile"
                  hideTableExport={false}
                  hideColumnsButton={false}
                />
              </div>
            )}
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
