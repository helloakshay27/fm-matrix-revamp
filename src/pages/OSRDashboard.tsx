import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Eye, FileText, Plus, Filter, RefreshCw, Grid3X3, MoreHorizontal } from 'lucide-react';
import { CreateScheduleModal } from '@/components/CreateScheduleModal';
import { OSRDashboardFilterModal } from '@/components/OSRDashboardFilterModal';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { toast } from 'sonner';

export const OSRDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'id', label: 'ID', visible: true },
    { key: 'schedule', label: 'Schedule', visible: true },
    { key: 'amountPaid', label: 'Amount Paid', visible: true },
    { key: 'paymentStatus', label: 'Payment Status', visible: true },
    { key: 'paymentMode', label: 'Payment Mode', visible: true },
    { key: 'createdBy', label: 'Created By', visible: true },
    { key: 'flat', label: 'Flat', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'subCategory', label: 'Sub Category', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'rating', label: 'Rating', visible: true },
    { key: 'createdOn', label: 'Created On', visible: true }
  ]);

  // Sample data matching the image structure
  const osrData = [
    {
      id: '1244',
      schedule: '24/06/2025 17:00 To 18:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Mosquito Mesh Sta...',
      subCategory: 'Residential Apart...',
      status: 'Work Pending',
      rating: '',
      createdOn: '23/06/2025'
    },
    {
      id: '1243',
      schedule: '24/06/2025 10:00 To 13:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Invisible Grill',
      subCategory: 'Residential Apart...',
      status: 'Payment Pending',
      rating: '',
      createdOn: '23/06/2025'
    },
    {
      id: '1242',
      schedule: '23/06/2025 15:00 To 16:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Pest Control',
      subCategory: '4D Cockroach Cont...',
      status: 'Payment Pending',
      rating: '',
      createdOn: '23/06/2025'
    },
    {
      id: '1241',
      schedule: '21/04/2025 10:00 To 15:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Deepak Gupta',
      flat: 'FM - Office',
      category: 'Civil & Mason Works',
      subCategory: 'Grouting Of Tiles',
      status: 'Payment Pending',
      rating: '',
      createdOn: '19/04/2025'
    },
    {
      id: '1240',
      schedule: '15/04/2025 11:00 To 13:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Deep Cleaning',
      subCategory: 'Sofa Cleaning',
      status: 'Payment Pending',
      rating: '',
      createdOn: '14/04/2025'
    },
    {
      id: '1239',
      schedule: '30/03/2025 06:00 To 09:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Deepak Gupta',
      flat: 'A - 104',
      category: 'Pest Control',
      subCategory: 'Standard Cockroac...',
      status: 'Payment Pending',
      rating: '',
      createdOn: '29/03/2025'
    },
    {
      id: '1238',
      schedule: '06/03/2025 06:00 To 08:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Deep Cleaning',
      subCategory: 'Bathroom Cleaning',
      status: 'Payment Pending',
      rating: '',
      createdOn: '05/03/2025'
    },
    {
      id: '1237',
      schedule: '15/02/2025 06:00 To 08:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Deep Cleaning',
      subCategory: 'Bathroom Cleaning',
      status: 'Payment Pending',
      rating: '',
      createdOn: '14/02/2025'
    },
    {
      id: '1236',
      schedule: '13/02/2025 06:00 To 09:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Deepak Gupta',
      flat: 'A - 101',
      category: 'Pest Control',
      subCategory: 'Standard Cockroac...',
      status: 'Payment Pending',
      rating: '',
      createdOn: '12/02/2025'
    }
  ];

  // Filter data based on search term
  const filteredData = osrData.filter(entry =>
    Object.values(entry).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleViewDetails = (id: string) => {
    console.log('Navigating to OSR details for ID:', id);
    console.log('Target route:', `/vas/osr/details/${id}`);
    navigate(`/vas/osr/details/${id}`);
  };

  const handleGenerateReceipt = () => {
    console.log('Generate Receipt clicked');
    navigate('/vas/osr/generate-receipt');
    toast.success('Navigating to Generate Receipt page');
  };

  const handleCreateSchedule = (data: any) => {
    console.log('Creating schedule with data:', data);
    toast.success('Schedule created successfully!');
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying filters:', filters);
    toast.success('Filters applied successfully!');
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    toast.success('Filters reset successfully!');
  };

  const handleRefresh = () => {
    console.log('Refreshing data');
    toast.success('Data refreshed successfully!');
  };

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
    toast.success(`Column ${visible ? 'shown' : 'hidden'}: ${columns.find(c => c.key === columnKey)?.label}`);
  };

  const handleMoreActions = () => {
    console.log('More actions clicked');
    toast.info('More actions menu');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Work Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Payment Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isColumnVisible = (columnKey: string) => {
    return columns.find(col => col.key === columnKey)?.visible ?? true;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header with Action Buttons */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Button 
              onClick={handleGenerateReceipt}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Receipt
            </Button>
            
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
            
            <Button 
              onClick={() => setShowFilterModal(true)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Search and Action Icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-gray-300 rounded-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-2" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <ColumnVisibilityDropdown
                columns={columns}
                onColumnToggle={handleColumnToggle}
              />
              <Button variant="ghost" size="sm" className="p-2" onClick={handleMoreActions}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                {isColumnVisible('actions') && <TableHead className="text-left font-semibold">Actions</TableHead>}
                {isColumnVisible('id') && <TableHead className="text-left font-semibold">ID</TableHead>}
                {isColumnVisible('schedule') && <TableHead className="text-left font-semibold">Schedule</TableHead>}
                {isColumnVisible('amountPaid') && <TableHead className="text-left font-semibold">Amount Paid</TableHead>}
                {isColumnVisible('paymentStatus') && <TableHead className="text-left font-semibold">Payment Status</TableHead>}
                {isColumnVisible('paymentMode') && <TableHead className="text-left font-semibold">Payment Mode</TableHead>}
                {isColumnVisible('createdBy') && <TableHead className="text-left font-semibold">Created By</TableHead>}
                {isColumnVisible('flat') && <TableHead className="text-left font-semibold">Flat</TableHead>}
                {isColumnVisible('category') && <TableHead className="text-left font-semibold">Category</TableHead>}
                {isColumnVisible('subCategory') && <TableHead className="text-left font-semibold">Sub Category</TableHead>}
                {isColumnVisible('status') && <TableHead className="text-left font-semibold">Status</TableHead>}
                {isColumnVisible('rating') && <TableHead className="text-left font-semibold">Rating</TableHead>}
                {isColumnVisible('createdOn') && <TableHead className="text-left font-semibold">Created On</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50">
                  {isColumnVisible('actions') && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(entry.id)}
                        className="p-1"
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </Button>
                    </TableCell>
                  )}
                  {isColumnVisible('id') && (
                    <TableCell className="font-medium text-blue-600">
                      <button
                        onClick={() => handleViewDetails(entry.id)}
                        className="text-blue-600 hover:underline"
                      >
                        {entry.id}
                      </button>
                    </TableCell>
                  )}
                  {isColumnVisible('schedule') && <TableCell>{entry.schedule}</TableCell>}
                  {isColumnVisible('amountPaid') && <TableCell>{entry.amountPaid}</TableCell>}
                  {isColumnVisible('paymentStatus') && (
                    <TableCell>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        {entry.paymentStatus}
                      </span>
                    </TableCell>
                  )}
                  {isColumnVisible('paymentMode') && <TableCell>{entry.paymentMode}</TableCell>}
                  {isColumnVisible('createdBy') && <TableCell>{entry.createdBy}</TableCell>}
                  {isColumnVisible('flat') && <TableCell>{entry.flat}</TableCell>}
                  {isColumnVisible('category') && <TableCell>{entry.category}</TableCell>}
                  {isColumnVisible('subCategory') && <TableCell>{entry.subCategory}</TableCell>}
                  {isColumnVisible('status') && (
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </TableCell>
                  )}
                  {isColumnVisible('rating') && <TableCell>{entry.rating}</TableCell>}
                  {isColumnVisible('createdOn') && <TableCell>{entry.createdOn}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <div className="text-sm text-gray-600">
            Powered by <span className="font-semibold">LOCKATED</span>
          </div>
        </div>
      </div>

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSchedule}
      />

      {/* Filter Modal */}
      <OSRDashboardFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};
