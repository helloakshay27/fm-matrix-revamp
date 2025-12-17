import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Download, Upload, FileText, Eye, Search, X } from "lucide-react";
import { BookingsFilterDialog } from "@/components/BookingsFilterDialog";
import { SpaceManagementImportDialog } from "@/components/SpaceManagementImportDialog";
import { SpaceManagementRosterExportDialog } from "@/components/SpaceManagementRosterExportDialog";
import { SpaceManagementExportDialog } from "@/components/SpaceManagementExportDialog";
import { EditBookingDialog } from "@/components/EditBookingDialog";
import { CancelBookingDialog } from "@/components/CancelBookingDialog";
import { ColumnVisibilityDropdown } from "@/components/ColumnVisibilityDropdown";
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

  const [bookingData, setBookingData] = useState([{
    id: "142179",
    employeeId: "73974",
    employeeName: "HO Occupant 2",
    employeeEmail: "hooccupant2@locatard.com",
    scheduleDate: "29 December 2023",
    day: "Friday",
    category: "Angular War",
    building: "Jyoti Tower",
    floor: "2nd Floor",
    designation: "",
    department: "",
    slotsAndSeat: "10:00 AM to 08:00 PM - HR 1",
    status: "Cancelled",
    createdOn: "15/02/2023, 5:44 PM"
  }, {
    id: "142150",
    employeeId: "71905",
    employeeName: "Prashant P",
    employeeEmail: "889853791@gmail.com",
    scheduleDate: "29 December 2023",
    day: "Friday",
    category: "Angular War",
    building: "Jyoti Tower",
    floor: "2nd Floor",
    designation: "",
    department: "",
    slotsAndSeat: "10:00 AM to 08:00 PM - S7",
    status: "Cancelled",
    createdOn: "15/02/2023, 5:43 PM"
  }, {
    id: "142219",
    employeeId: "71903",
    employeeName: "Bilal Shaikh",
    employeeEmail: "bilal.shaikh@locatard.com",
    scheduleDate: "29 December 2023",
    day: "Friday",
    category: "Angular War",
    building: "Jyoti Tower",
    floor: "2nd Floor",
    designation: "Sr. Flutter developer",
    department: "Tech",
    slotsAndSeat: "10:00 AM to 08:00 PM - S4",
    status: "Confirmed",
    createdOn: "15/02/2023, 5:44 PM"
  }, {
    id: "142094",
    employeeId: "73975",
    employeeName: "HO Occupant 3",
    employeeEmail: "hooccupant3@locatard.com",
    scheduleDate: "29 December 2023",
    day: "Friday",
    category: "Angular War",
    building: "Jyoti Tower",
    floor: "2nd Floor",
    designation: "",
    department: "Technology",
    slotsAndSeat: "10:00 AM to 08:00 PM - Technology",
    status: "Confirmed",
    createdOn: "15/02/2023, 5:44 PM"
  }, {
    id: "305213",
    employeeId: "71902",
    employeeName: "Abdul G",
    employeeEmail: "abdul.g@locatard.com",
    scheduleDate: "7 February 2025",
    day: "Friday",
    category: "Meeting Room",
    building: "Urbanwrk",
    floor: "1st Floor",
    designation: "Project Manager",
    department: "Operations",
    slotsAndSeat: "04:45 PM to 05:45 PM - Meeting Room 100",
    status: "Pending",
    createdOn: "7/02/2025, 4:45 PM"
  }]);
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
    { key: 'cancel', label: 'Cancel' }
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
            {/* <Button onClick={() => setIsImportOpen(true)} style={{
            backgroundColor: '#C72030',
            color: 'white'
          }} className="hover:opacity-90 px-4 py-2 rounded flex items-center gap-2 border-0">
              <Upload className="w-4 h-4" />
              Import
            </Button> */}
            {/* <Button onClick={() => setIsExportOpen(true)} style={{
            backgroundColor: '#C72030',
            color: 'white'
          }} className="hover:opacity-90 px-4 py-2 rounded flex items-center gap-2 border-0">
              <Download className="w-4 h-4" />
              Export
            </Button> */}
            {/* <Button onClick={() => setIsRosterExportOpen(true)} style={{
            backgroundColor: '#C72030',
            color: 'white'
          }} className="hover:opacity-90 px-4 py-2 rounded flex items-center gap-2 border-0">
              <FileText className="w-4 h-4" />
              Roster Export
            </Button> */}
            {/* <Button onClick={() => setIsFilterOpen(true)} style={{
            backgroundColor: '#C72030',
            color: 'white'
          }} className="hover:opacity-90 px-4 py-2 rounded flex items-center gap-2 border-0">
              <Filter className="w-4 h-4" />
              Filters
            </Button> */}
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
                  {visibleColumns.includes('cancel') && <TableHead className="font-semibold text-gray-700">Cancel</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookingData.length === 0 ? <TableRow>
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
                      {visibleColumns.includes('employeeName') && <TableCell className="text-blue-600">{booking.employeeName}</TableCell>}
                      {visibleColumns.includes('employeeEmail') && <TableCell className="text-blue-600">{booking.employeeEmail}</TableCell>}
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
                      {visibleColumns.includes('cancel') && (
                        <TableCell>
                          <Button size="sm" onClick={() => handleCancelBooking(booking)} className="bg-[#C72030] hover:bg-[#B01E2A] text-white" disabled={booking.status === 'Cancelled'}>
                            {booking.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}
                          </Button>
                        </TableCell>
                      )}
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
