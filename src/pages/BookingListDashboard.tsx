import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Filter, Download, ChevronDown, X, Calendar, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TextField, MenuItem } from '@mui/material';
import { ExportByCentreModal } from '@/components/ExportByCentreModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import type { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { exportReport, fetchFacilityBookingsData } from '@/store/slices/facilityBookingsSlice';
import type { BookingData } from '@/services/bookingService';
import { toast } from 'sonner';

const exportColumns = [
  { id: 'selectAll', label: 'Select All' },
  { id: 'id', label: 'Id' },
  { id: 'centreName', label: 'Centre Name' },
  { id: 'bookedBy', label: 'Booked By' },
  { id: 'bookedFor', label: 'Booked For' },
  { id: 'companyName', label: 'Company Name' },
  { id: 'facility', label: 'Facility' },
  { id: 'scheduledOn', label: 'Scheduled On' },
  { id: 'slot', label: 'Slot' },
  { id: 'duration', label: 'Duration (Minutes)' },
  { id: 'bookingStatus', label: 'Booking Status' },
  { id: 'perSlotCharge', label: 'Per Slot Charge' },
  { id: 'amountPaid', label: 'Amount Paid' },
  { id: 'paymentStatus', label: 'Payment Status' },
  { id: 'paymentType', label: 'Payment Type' },
  { id: 'bookedOn', label: 'Booked On' },
  { id: 'source', label: 'Source' },
  { id: 'comment', label: 'Comment' }
];

// Define columns for EnhancedTable with drag and drop support
const enhancedTableColumns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, draggable: true },
  { key: 'bookedBy', label: 'Booked By', sortable: true, draggable: true },
  { key: 'bookedFor', label: 'Booked For', sortable: true, draggable: true },
  { key: 'companyName', label: 'Company Name', sortable: true, draggable: true },
  { key: 'facility', label: 'Facility', sortable: true, draggable: true },
  { key: 'facilityType', label: 'Facility Type', sortable: true, draggable: true },
  { key: 'scheduledDate', label: 'Scheduled Date', sortable: true, draggable: true },
  { key: 'scheduledTime', label: 'Scheduled Time', sortable: true, draggable: true },
  { key: 'bookingStatus', label: 'Booking Status', sortable: true, draggable: true },
  { key: 'createdOn', label: 'Created On', sortable: true, draggable: true },
  { key: 'source', label: 'Source', sortable: true, draggable: true }
];

const BookingListDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  // Get data from Redux store
  const { data: bookings = [], loading, error } = useAppSelector((state) => state.facilityBookings);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportPopoverOpen, setIsExportPopoverOpen] = useState(false);
  const [isExportByCentreModalOpen, setIsExportByCentreModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['id', 'bookedBy']);
  const [filters, setFilters] = useState({
    facilityName: '',
    status: '',
    scheduledDate: '',
    createdOn: ''
  });

  const itemsPerPage = 5;

  // Fetch data from API on component mount using Redux
  useEffect(() => {
    dispatch(fetchFacilityBookingsData());
  }, [dispatch]);

  const handleAddBooking = () => {
    navigate('/vas/booking/add');
  };

  // Cell renderer for custom content like badges and buttons
  const renderCell = (item: BookingData, columnKey: string) => {
    switch (columnKey) {
      case 'bookingStatus':
        return (
          <Badge variant={getStatusBadgeVariant(item.bookingStatus)}>
            {item.bookingStatus}
          </Badge>
        );
      default:
        return item[columnKey as keyof BookingData];
    }
  };

  // Actions renderer for the eye button
  const renderActions = (item: BookingData) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(`/vas/bookings/details/${item.id}`)}
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    setIsFilterModalOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      facilityName: '',
      status: '',
      scheduledDate: '',
      createdOn: ''
    });
  };

  const handleColumnToggle = (columnId: string) => {
    if (columnId === 'selectAll') {
      if (selectedColumns.length === exportColumns.length - 1) {
        setSelectedColumns([]);
      } else {
        setSelectedColumns(exportColumns.slice(1).map(col => col.id));
      }
    } else {
      setSelectedColumns(prev =>
        prev.includes(columnId)
          ? prev.filter(id => id !== columnId)
          : [...prev, columnId]
      );
    }
  };

  const handleDownload = async () => {
    try {
      const response = await dispatch(exportReport({ baseUrl, token })).unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "facility_bookings.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error)
      toast.error('Error downloading file');
    } finally {
      setIsExportPopoverOpen(false);
    }
  };

  const isAllSelected = selectedColumns.length === exportColumns.length - 1;

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Booking &gt; Booking List
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">BOOKING LIST</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Available Slots */}
        <div className="bg-[#f6f4ee] rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">3</div>
              <div className="text-gray-600 text-sm">Total Available Slots</div>
            </div>
          </div>
        </div>

        {/* Total Booked */}
        <div className="bg-[#f6f4ee] rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">5</div>
              <div className="text-gray-600 text-sm">Total Booked</div>
            </div>
          </div>
        </div>

        {/* Total Vacant */}
        <div className="bg-[#f6f4ee] rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Circle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">4</div>
              <div className="text-gray-600 text-sm">Total Vacant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button
          className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
          onClick={handleAddBooking}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>

        <Button
          variant="outline"
          className="border-[#8B4B8C] text-[#8B4B8C] hover:bg-[#8B4B8C] hover:text-white"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>

        <Popover open={isExportPopoverOpen} onOpenChange={setIsExportPopoverOpen}>
          <PopoverTrigger asChild>
            <Button className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-white border border-gray-200 shadow-lg z-50" align="start">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select columns to export:</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {exportColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={column.id}
                      checked={column.id === 'selectAll' ? isAllSelected : selectedColumns.includes(column.id)}
                      onCheckedChange={() => handleColumnToggle(column.id)}
                    />
                    <label
                      htmlFor={column.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleDownload}
                className="w-full bg-[#5D2A4B] hover:bg-[#4A2139] text-white"
              >
                Download
              </Button>
            </div>
          </PopoverContent>
        </Popover>

      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p>Error loading bookings: {error}</p>
          <Button
            onClick={() => dispatch(fetchFacilityBookingsData())}
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      )}

      {/* Enhanced Table with Drag and Drop */}
      <EnhancedTable
        data={bookings}
        columns={enhancedTableColumns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="booking-list-table"
        pagination={true}
        pageSize={itemsPerPage}
        loading={loading}
        emptyMessage={loading ? "Loading bookings..." : "No bookings found"}
      />

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterModalOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm font-medium text-red-500 mb-4">Facility Bookings</div>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                select
                label="Facility Name"
                value={filters.facilityName}
                onChange={(e) => handleFilterChange('facilityName', e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    height: { xs: '36px', sm: '45px' }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000'
                  }
                }}
              >
                <MenuItem value="">Select Facility</MenuItem>
                <MenuItem value="admin-meeting-room">Admin Meeting Room</MenuItem>
                <MenuItem value="conference-hall">Conference Hall</MenuItem>
                <MenuItem value="board-room">Board Room</MenuItem>
              </TextField>

              <TextField
                select
                label="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    height: { xs: '36px', sm: '45px' }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000'
                  }
                }}
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                type="date"
                label="Booked Scheduled Date"
                value={filters.scheduledDate}
                onChange={(e) => handleFilterChange('scheduledDate', e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Scheduled on"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    height: { xs: '36px', sm: '45px' }
                  }
                }}
              />

              <TextField
                type="date"
                label="Created On"
                value={filters.createdOn}
                onChange={(e) => handleFilterChange('createdOn', e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Booked on"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '6px',
                    height: { xs: '36px', sm: '45px' }
                  }
                }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleApplyFilters}
              className="flex-1 bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
            >
              Apply
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export By Centre Modal */}
      <ExportByCentreModal
        isOpen={isExportByCentreModalOpen}
        onClose={() => setIsExportByCentreModalOpen(false)}
      />
    </div>
  );
};

export default BookingListDashboard;
