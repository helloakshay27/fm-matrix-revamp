import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Download, Upload, FileText, Eye, Search, X, Plus } from "lucide-react";
import { BookingsFilterDialog } from "@/components/BookingsFilterDialog";
import { SpaceManagementImportDialog } from "@/components/SpaceManagementImportDialog";
import { SpaceManagementRosterExportDialog } from "@/components/SpaceManagementRosterExportDialog";
import { SpaceManagementExportDialog } from "@/components/SpaceManagementExportDialog";
import { EditBookingDialog } from "@/components/EditBookingDialog";
import { CancelBookingDialog } from "@/components/CancelBookingDialog";
import { ColumnVisibilityDropdown } from "@/components/ColumnVisibilityDropdown";
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

// API Response Interfaces
interface SeatBooking {
  id: number;
  resource_id: number;
  resource_type: string;
  user_id: number;
  booking_date: string;
  status: string;
  cancelled_by_id: number | null;
  cancelled_at: string | null;
  seat_configuration_id: number;
  user_name: string;
  user_email: string;
  booking_day: string;
  category: string;
  building: string;
  floor: string;
  designation: string;
  department: string;
  slots: string;
  created_at: string;
}

interface SeatBookingsApiResponse {
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
  seat_bookings: SeatBooking[];
}

export const SpaceManagementBookingsDashboardEmployee = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isRosterExportOpen, setIsRosterExportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 1
  });
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'actions',
    'id',
    'employeeId',
    'employeeName',
    'employeeEmail',
    'scheduleDate',
    'day',
    'category',
    'building',
    'floor',
    'designation',
    'department',
    'slotsAndSeat',
    'status',
    'createdOn',
    'cancel'
  ]);

  const [bookingData, setBookingData] = useState<any[]>([]);

  // Get current user ID from localStorage
  const getCurrentUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id ? user.id.toString() : null;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  };

  // Fetch seat bookings from API
  const fetchSeatBookings = async (page = 1) => {
    try {
      setLoading(true);
      const currentUserId = getCurrentUserId();
      
      if (!currentUserId) {
        toast.error('User not found. Please log in again.');
        return;
      }

      const url = getFullUrl('/pms/admin/seat_bookings.json');
      const options = getAuthenticatedFetchOptions();
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('q[user_id_eq]', currentUserId);
      
      const fullUrl = `${url}?${params.toString()}`;
      console.log('🔍 Fetching seat bookings from:', fullUrl);
      
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: SeatBookingsApiResponse = await response.json();
      console.log('📊 Seat bookings data:', data);
      
      // Transform API data to match UI structure
      const transformedBookings = data.seat_bookings.map((booking) => ({
        id: booking.id.toString(),
        employeeId: booking.user_id.toString(),
        employeeName: booking.user_name,
        employeeEmail: booking.user_email,
        scheduleDate: booking.booking_date,
        day: booking.booking_day,
        category: booking.category,
        building: booking.building,
        floor: booking.floor,
        designation: booking.designation,
        department: booking.department,
        slotsAndSeat: booking.slots,
        status: booking.status,
        createdOn: booking.created_at
      }));
      
      setBookingData(transformedBookings);
      setPagination(data.pagination);
      
    } catch (error) {
      console.error('❌ Error fetching seat bookings:', error);
      toast.error('Failed to load seat bookings');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchSeatBookings(currentPage);
  }, [currentPage]);

  const handleFilterApply = (filters: any) => {
    console.log('Applied filters:', filters);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleColumnVisibilityChange = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsEditOpen(true);
  };
  const handleViewBooking = (bookingId: string) => {
    console.log('Navigating to booking details for ID:', bookingId);
    navigate(`/vas/space-management/bookings/details/${bookingId}`);
  };
  const handleCancelBooking = (booking: any) => {
    console.log('Opening cancel dialog for booking:', booking.id);
    setSelectedBooking(booking);
    setIsCancelOpen(true);
  };
  const handleConfirmCancel = (bookingId: string, reason: string) => {
    console.log('Cancelling booking:', bookingId, 'Reason:', reason);

    // Update the booking status to Cancelled
    const updatedBookings = bookingData.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: "Cancelled"
        };
      }
      return booking;
    });
    setBookingData(updatedBookings);
    console.log('Booking cancelled successfully');
    toast.success('Booking cancelled successfully');
    
    // Refresh data from API
    fetchSeatBookings(currentPage);
  };

  // Filter bookings based on search term
  const filteredBookingData = bookingData.filter(booking => booking.id.toLowerCase().includes(searchTerm.toLowerCase()) || booking.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) || booking.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || booking.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase()) || booking.building.toLowerCase().includes(searchTerm.toLowerCase()) || booking.category.toLowerCase().includes(searchTerm.toLowerCase()) || booking.status.toLowerCase().includes(searchTerm.toLowerCase()));

  // Define columns for visibility control
  const columns = [
    { key: 'actions', label: 'Actions' },
    { key: 'id', label: 'ID' },
    { key: 'employeeId', label: 'Employee ID' },
    { key: 'employeeName', label: 'Employee Name' },
    { key: 'employeeEmail', label: 'Employee Email' },
    { key: 'scheduleDate', label: 'Schedule Date' },
    { key: 'day', label: 'Day' },
    { key: 'category', label: 'Category' },
    { key: 'building', label: 'Building' },
    { key: 'floor', label: 'Floor' },
    { key: 'designation', label: 'Designation' },
    { key: 'department', label: 'Department' },
    { key: 'slotsAndSeat', label: 'Slots & Seat No.' },
    { key: 'status', label: 'Status' },
    { key: 'createdOn', label: 'Created On' },
    // { key: 'cancel', label: 'Cancel' }
  ];

  return <div className="p-6 min-h-screen bg-white">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Space</span>
          <span>&gt;</span>
          <span>Seat Booking List</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">SEAT BOOKING LIST</h1>
        
        {/* Action Buttons and Search Bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/vas/space-management/bookings/employee/add')}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Booking
            </Button>
          </div>

          {/* Right side - Search and Column Visibility */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Result Counter */}
            {searchTerm && (
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Found {filteredBookingData.length} result{filteredBookingData.length !== 1 ? 's' : ''}
              </div>
            )}

            {/* Column Visibility Dropdown */}
            <ColumnVisibilityDropdown
              columns={columns}
              visibleColumns={visibleColumns}
              onVisibilityChange={handleColumnVisibilityChange}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {visibleColumns.includes('actions') && <TableHead className="font-semibold text-gray-700">Actions</TableHead>}
                  {visibleColumns.includes('id') && <TableHead className="font-semibold text-gray-700">ID</TableHead>}
                  {visibleColumns.includes('employeeId') && <TableHead className="font-semibold text-gray-700">Employee ID</TableHead>}
                  {visibleColumns.includes('employeeName') && <TableHead className="font-semibold text-gray-700">Employee Name</TableHead>}
                  {visibleColumns.includes('employeeEmail') && <TableHead className="font-semibold text-gray-700">Employee Email</TableHead>}
                  {visibleColumns.includes('scheduleDate') && <TableHead className="font-semibold text-gray-700">Schedule Date</TableHead>}
                  {visibleColumns.includes('day') && <TableHead className="font-semibold text-gray-700">Day</TableHead>}
                  {visibleColumns.includes('category') && <TableHead className="font-semibold text-gray-700">Category</TableHead>}
                  {visibleColumns.includes('building') && <TableHead className="font-semibold text-gray-700">Building</TableHead>}
                  {visibleColumns.includes('floor') && <TableHead className="font-semibold text-gray-700">Floor</TableHead>}
                  {visibleColumns.includes('designation') && <TableHead className="font-semibold text-gray-700">Designation</TableHead>}
                  {visibleColumns.includes('department') && <TableHead className="font-semibold text-gray-700">Department</TableHead>}
                  {visibleColumns.includes('slotsAndSeat') && <TableHead className="font-semibold text-gray-700">Slots & Seat No.</TableHead>}
                  {visibleColumns.includes('status') && <TableHead className="font-semibold text-gray-700">Status</TableHead>}
                  {visibleColumns.includes('createdOn') && <TableHead className="font-semibold text-gray-700">Created On</TableHead>}
                  {/* {visibleColumns.includes('cancel') && <TableHead className="font-semibold text-gray-700">Cancel</TableHead>} */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredBookingData.length === 0 ? <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No bookings found matching your search.' : 'No bookings found.'}
                    </TableCell>
                  </TableRow> : filteredBookingData.map((booking, index) => <TableRow key={booking.id}>
                      {visibleColumns.includes('actions') && (
                        <TableCell>
                          <Button size="sm" variant="ghost" onClick={() => handleViewBooking(booking.id)} className="hover:bg-gray-100">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                      {visibleColumns.includes('id') && <TableCell>{booking.id}</TableCell>}
                      {visibleColumns.includes('employeeId') && <TableCell>{booking.employeeId}</TableCell>}
                      {visibleColumns.includes('employeeName') && <TableCell className="text-black">{booking.employeeName}</TableCell>}
                      {visibleColumns.includes('employeeEmail') && <TableCell className="text-black">{booking.employeeEmail}</TableCell>}
                      {visibleColumns.includes('scheduleDate') && <TableCell>{booking.scheduleDate}</TableCell>}
                      {visibleColumns.includes('day') && <TableCell>{booking.day}</TableCell>}
                      {visibleColumns.includes('category') && <TableCell>{booking.category}</TableCell>}
                      {visibleColumns.includes('building') && <TableCell>{booking.building}</TableCell>}
                      {visibleColumns.includes('floor') && <TableCell>{booking.floor}</TableCell>}
                      {visibleColumns.includes('designation') && <TableCell>{booking.designation}</TableCell>}
                      {visibleColumns.includes('department') && <TableCell>{booking.department}</TableCell>}
                      {visibleColumns.includes('slotsAndSeat') && <TableCell>{booking.slotsAndSeat}</TableCell>}
                      {visibleColumns.includes('status') && (
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {booking.status}
                          </span>
                        </TableCell>
                      )}
                      {visibleColumns.includes('createdOn') && <TableCell>{booking.createdOn}</TableCell>}
                      {/* {visibleColumns.includes('cancel') && (
                        <TableCell>
                          <Button size="sm" onClick={() => handleCancelBooking(booking)} className="bg-[#C72030] hover:bg-[#B01E2A] text-white" disabled={booking.status === 'Cancelled'}>
                            {booking.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}
                          </Button>
                        </TableCell>
                      )} */}
                    </TableRow>)}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Dialogs */}
        <BookingsFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleFilterApply} />
        
        <SpaceManagementImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} />
        
        <SpaceManagementRosterExportDialog open={isRosterExportOpen} onOpenChange={setIsRosterExportOpen} />
        
        <SpaceManagementExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />

        <EditBookingDialog open={isEditOpen} onOpenChange={setIsEditOpen} booking={selectedBooking} />

        <CancelBookingDialog open={isCancelOpen} onOpenChange={setIsCancelOpen} booking={selectedBooking} onCancel={handleConfirmCancel} />
      </div>
    </div>;
};
