import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookingsFilterDialog } from "@/components/BookingsFilterDialog";
import { SpaceManagementImportDialog } from "@/components/SpaceManagementImportDialog";
import { SpaceManagementRosterExportDialog } from "@/components/SpaceManagementRosterExportDialog";
import { SpaceManagementExportDialog } from "@/components/SpaceManagementExportDialog";
import { EditBookingDialog } from "@/components/EditBookingDialog";
import { CancelBookingDialog } from "@/components/CancelBookingDialog";
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
export const SpaceManagementBookingsDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isRosterExportOpen, setIsRosterExportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  interface BookingRow {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    scheduleDate: string;
    day: string;
    category: string;
    building: string;
    floor: string;
    designation: string;
    department: string;
    slotsAndSeat: string;
    status: string;
    createdOn: string;
  }
  type ApiBooking = Record<string, unknown>;

  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingData, setBookingData] = useState<BookingRow[]>([]);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [errorBookings, setErrorBookings] = useState<string | null>(null);

  // Fetch bookings from external API on mount
  useEffect(() => {
    const fetchBookings = async (pageNumber: number) => {
      setLoadingBookings(true);
      setErrorBookings(null);
      try {
        const url = 'https://fm-uat-api.lockated.com/pms/admin/seat_bookings.json';

        // Try to read token from localStorage under common keys, fall back to demo token
        let token = '';
        try {
          token = (
            localStorage.getItem('token') ||
            localStorage.getItem('accessToken') ||
            localStorage.getItem('access_token') ||
            localStorage.getItem('authToken') ||
            ''
          );
        } catch (e) {
          token = '';
        }

        if (!token) {
          token = 'SaIVkU1mrRwyCeqMxNqPGb0c-GtpOqt3xSuUi58HP4E';
        }

        const params = new URLSearchParams();
        params.set('page', String(pageNumber));

        const response = await fetch(`${url}?${params.toString()}`, {
          method: 'GET',
          headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: `Bearer ${token}` } : {}),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch seat bookings: ${response.status} ${text}`);
        }

        const result = await response.json();

        // API returns { pagination: {...}, seat_bookings: [...] }
        const items = result?.seat_bookings || result?.seatBookings || result?.seat_bookings || [];

        const mapped: BookingRow[] = Array.isArray(items)
          ? items.map((it: ApiBooking) => ({
              id: it['id'] ? String(it['id']) : '',
              employeeId: it['user_id'] ? String(it['user_id']) : String(it['employee_id'] || it['employeeId'] || ''),
              employeeName: String(it['user_name'] || it['employee_name'] || it['userName'] || it['name'] || ''),
              employeeEmail: String(it['user_email'] || it['employeeEmail'] || it['email'] || ''),
              scheduleDate: String(it['booking_date'] || it['schedule_date'] || it['from_date'] || it['to_date'] || ''),
              day: String(it['booking_day'] || it['day'] || ''),
              category: String(it['category'] || it['event'] || ''),
              building: String(it['building'] || it['site_name'] || it['site'] || ''),
              floor: String(it['floor'] || it['floor_name'] || ''),
              designation: String(it['designation'] || ''),
              department: String(it['department'] || it['dept'] || ''),
              slotsAndSeat: String(it['slots'] || it['slots_and_seat'] || it['slot'] || it['time'] || ''),
              status: String(it['status'] || it['booking_status'] || ''),
              createdOn: String(it['created_at'] || it['createdAt'] || ''),
            }))
          : [];

        setBookingData(mapped);

        // pagination
        const pagination = result?.pagination;
        if (pagination) {
          setPage(pagination.current_page || pageNumber);
          setTotalPages(pagination.total_pages || 1);
        } else {
          setTotalPages(1);
        }
      } catch (err) {
        // keep message for user, avoid leaking internal error objects to console in prod
        setErrorBookings((err as Error)?.message || 'Failed to fetch bookings');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings(page);
  }, [page]);
  const handleFilterApply = (filters: Record<string, unknown>) => {
    // apply filters server-side if needed; currently placeholder
    setIsFilterOpen(false);
  };
  const handleEditBooking = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setIsEditOpen(true);
  };
  const handleViewBooking = (bookingId: string) => {
    navigate(`/vas/space-management/bookings/details/${bookingId}`);
  };
  const handleCancelBooking = (booking: BookingRow) => {
    setSelectedBooking(booking);
    setIsCancelOpen(true);
  };
  const handleConfirmCancel = (bookingId: string, reason: string) => {
    console.warn('Cancelling booking:', bookingId, 'Reason:', reason);

    // Update the booking status to Cancelled
    const updatedBookings = bookingData.map(booking => booking.id === bookingId ? { ...booking, status: 'Cancelled' } : booking);
    setBookingData(updatedBookings);
    console.warn('Booking cancelled successfully');
  };

  // Filter bookings based on search term (safe coercion to string)
  const safe = (v: unknown) => (v === undefined || v === null) ? '' : String(v).toLowerCase();
  const q = searchTerm.toLowerCase();
  const filteredBookingData = bookingData.filter(booking =>
    safe(booking.id).includes(q) ||
    safe(booking.employeeId).includes(q) ||
    safe(booking.employeeName).includes(q) ||
    safe(booking.employeeEmail).includes(q) ||
    safe(booking.building).includes(q) ||
    safe(booking.category).includes(q) ||
    safe(booking.status).includes(q)
  );

  // Columns config for EnhancedTable
  const columns: ColumnConfig[] = [
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
    { key: 'slots', label: 'Slots & Seat No.' },
    { key: 'status', label: 'Status' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'cancel', label: 'Cancel' },
  ];

  

  const renderCell = (item: BookingRow, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleViewBooking(item.id)}>
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        );
      case 'id':
        return <span className="font-medium">{item.id}</span>;
      case 'employeeId':
        return item.employeeId || '-';
      case 'employeeName':
        return <span className="text-[#1a1a1a]">{item.employeeName || '-'}</span>;
      case 'employeeEmail':
        return <span className="text-[#1a1a1a]">{item.employeeEmail || '-'}</span>;
      case 'scheduleDate':
        return item.scheduleDate || '-';
      case 'day':
        return item.day || '-';
      case 'category':
        return item.category || '-';
      case 'building':
        return item.building || '-';
      case 'floor':
        return item.floor || '-';
      case 'designation':
        return item.designation || '-';
      case 'department':
        return item.department || '-';
      case 'slots':
        return item.slotsAndSeat || '-';
      case 'status':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Cancelled' ? 'bg-red-100 text-red-800' : item.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {item.status || '-'}
          </span>
        );
      case 'createdOn':
        return item.createdOn || '-';
      case 'cancel':
        return (
          <Button size="sm" onClick={() => handleCancelBooking(item)} className="bg-[#C72030] hover:bg-[#B01E2A] text-white" disabled={item.status === 'Cancelled'}>
            {item.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}
          </Button>
        );
      default:
        return '-';
    }
  };

  return <div className="p-6 min-h-screen bg-white">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Space</span>
          <span>&gt;</span>
          <span>Seat Booking List</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">SEAT BOOKING LIST</h1>
        
       

        {/* Table */}
          <div className="overflow-x-auto">
            <EnhancedTable
              loading={loadingBookings}
              data={bookingData}
              columns={columns}
              renderCell={renderCell}
              pagination={false}
              enableSearch={true}
              searchTerm={searchTerm}
              onSearchChange={(q: string) => setSearchTerm(q)}
              onFilterClick={() => setIsFilterOpen(true)}
              getItemId={(item: BookingRow) => item.id}
              storageKey="seat-bookings-table"
            />
          </div>
        
        {errorBookings && (
          <div className="py-4 text-center text-red-600">{errorBookings}</div>
        )}

        {/* Pagination controls (matching ParkingDashboard style) */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => { if (page > 1) setPage(page - 1); }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink className="cursor-pointer" onClick={() => setPage(p)} isActive={page === p}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalPages > 10 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => { if (page < totalPages) setPage(page + 1); }}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

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