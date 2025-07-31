import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Filter, Download, X, Loader2, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TextField, MenuItem, createTheme, ThemeProvider, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { ExportByCentreModal } from '@/components/ExportByCentreModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import type { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { exportReport, fetchFacilityBookingsData, filterBookings } from '@/store/slices/facilityBookingsSlice';
import type { BookingData } from '@/services/bookingService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

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
  { id: 'comment', label: 'Comment' },
];

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
  { key: 'source', label: 'Source', sortable: true, draggable: true },
];

const muiTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            height: { xs: '36px', sm: '45px' },
            '& fieldset': {
              borderColor: '#E0E0E0',
            },
            '&:hover fieldset': {
              borderColor: '#1A1A1A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B4B8C',
              borderWidth: 2,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#000000',
            fontWeight: 500,
            fontSize: { xs: '12px', sm: '14px' },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#8B4B8C',
          },
          '& .MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            backgroundColor: '#FFFFFF',
            padding: '0 4px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: '#1A1A1A',
          fontSize: '14px',
          fontWeight: 400,
          padding: '12px 14px',
          '&::placeholder': {
            color: '#1A1A1A',
            opacity: 0.54,
          },
          '@media (max-width: 768px)': {
            fontSize: '12px',
            padding: '8px 12px',
          },
        },
      },
    },
  },
});

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Confirmed':
      return 'success';
    case 'Pending':
      return 'warning';
    case 'Cancelled':
      return 'destructive';
    case 'Completed':
      return 'default'; // Custom styling applied for blue
    default:
      return 'default';
  }
};

const BookingListDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const { data: bookings, loading, error } = useAppSelector((state) => state.facilityBookings);

  const [bookingData, setBookingData] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportByCentreModalOpen, setIsExportByCentreModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    facilityName: '',
    status: '',
    scheduledDateRange: '',
    createdOnDateRange: '',
  });
  const [scheduledDateFrom, setScheduledDateFrom] = useState<Date | undefined>();
  const [scheduledDateTo, setScheduledDateTo] = useState<Date | undefined>();
  const [createdOnDateFrom, setCreatedOnDateFrom] = useState<Date | undefined>();
  const [createdOnDateTo, setCreatedOnDateTo] = useState<Date | undefined>();
  const [isScheduledDatePickerOpen, setIsScheduledDatePickerOpen] = useState(false);
  const [isCreatedOnDatePickerOpen, setIsCreatedOnDatePickerOpen] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  // Fetch facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get(`https://${baseUrl}/pms/admin/facility_setups.json`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFacilities(response.data.facility_setups);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        toast.error('Failed to fetch facilities');
      }
    };

    fetchFacilities();
  }, [baseUrl, token]);

  // Update booking data and pagination when bookings change
  useEffect(() => {
    if (error) {
      setBookingData([]);
      setPagination({
        current_page: 1,
        total_count: 0,
        total_pages: 0,
      });
    } else if (bookings) {
      setBookingData(bookings.bookings || []);
      setPagination({
        current_page: bookings.pagination?.current_page || 1,
        total_count: bookings.pagination?.total_count || 0,
        total_pages: bookings.pagination?.total_pages || 0,
      });
    }
  }, [bookings, error]);

  // Fetch bookings data when page changes
  useEffect(() => {
    setIsPageLoading(true);
    dispatch(fetchFacilityBookingsData({ baseUrl, token, pageSize: 10, currentPage: pagination.current_page }))
      .then(() => setIsPageLoading(false))
      .catch(() => {
        setIsPageLoading(false);
        toast.error('Failed to fetch bookings');
      });
  }, [dispatch, baseUrl, token]);

  // Handle status change with API call
  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    setStatusUpdating(bookingId);
    try {
      await axios.patch(
        `https://${baseUrl}/pms/admin/bookings/${bookingId}`,
        { current_status: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookingData((prevData) =>
        prevData.map((booking) =>
          booking.id === bookingId ? { ...booking, bookingStatus: newStatus } : booking
        )
      );
      toast.success(`Booking ${bookingId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleScheduledDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    if (range?.from) {
      setScheduledDateFrom(range.from);
    }
    if (range?.to) {
      setScheduledDateTo(range.to);
      if (range.from && range.to) {
        const formattedRange = `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`;
        handleFilterChange('scheduledDateRange', formattedRange);
        setIsScheduledDatePickerOpen(false);
      }
    }
  };

  const handleCreatedOnDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    if (range?.from) {
      setCreatedOnDateFrom(range.from);
    }
    if (range?.to) {
      setCreatedOnDateTo(range.to);
      if (range.from && range.to) {
        const formattedRange = `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`;
        handleFilterChange('createdOnDateRange', formattedRange);
        setIsCreatedOnDatePickerOpen(false);
      }
    }
  };

  const getScheduledDateRangeDisplayValue = () => {
    if (scheduledDateFrom && scheduledDateTo) {
      return `${format(scheduledDateFrom, 'dd/MM/yyyy')} - ${format(scheduledDateTo, 'dd/MM/yyyy')}`;
    }
    if (scheduledDateFrom) {
      return format(scheduledDateFrom, 'dd/MM/yyyy');
    }
    return filters.scheduledDateRange || 'Select date range';
  };

  const getCreatedOnDateRangeDisplayValue = () => {
    if (createdOnDateFrom && createdOnDateTo) {
      return `${format(createdOnDateFrom, 'dd/MM/yyyy')} - ${format(createdOnDateTo, 'dd/MM/yyyy')}`;
    }
    if (createdOnDateFrom) {
      return format(createdOnDateFrom, 'dd/MM/yyyy');
    }
    return filters.createdOnDateRange || 'Select date range';
  };

  const handleApplyFilters = async () => {
    const formatedScheduleStartDate = scheduledDateFrom ? format(new Date(scheduledDateFrom), "MM/dd/yyyy") : null;
    const formatedScheduleEndDate = scheduledDateTo ? format(new Date(scheduledDateTo), "MM/dd/yyyy") : null;
    const formatedCreatedStartDate = createdOnDateFrom ? format(new Date(createdOnDateFrom), "MM/dd/yyyy") : null;
    const formatedCreatedEndDate = createdOnDateTo ? format(new Date(createdOnDateTo), "MM/dd/yyyy") : null;

    const filterParams = {
      "q[facility_id_in]": filters.facilityName,
      "q[current_status_cont]": filters.status,
      ...(formatedCreatedStartDate && formatedCreatedEndDate && {
        "q[date_range]": `${formatedCreatedStartDate} - ${formatedCreatedEndDate}`,
      }),
      ...(formatedScheduleStartDate && formatedScheduleEndDate && {
        "q[date_range1]": `${formatedScheduleStartDate} - ${formatedScheduleEndDate}`,
      }),
    };

    const queryString = new URLSearchParams(filterParams).toString();

    try {
      const response = await dispatch(filterBookings({ baseUrl, token, queryString })).unwrap();
      const updatedResponse = response.map((item: any) => ({
        bookedBy: item.book_by,
        bookedFor: item.book_for || "-",
        bookingStatus: item.current_status,
        companyName: item.company_name,
        createdOn: item.created_at.split(" ")[0],
        facility: item.facility_name,
        facilityType: item.fac_type,
        id: item.id,
        scheduledDate: item.startdate.split("T")[0],
        scheduledTime: item.show_schedule_24_hour,
        source: item.source,
      }));
      setBookingData(updatedResponse);
      setPagination({
        current_page: 1,
        total_count: response.pagination?.total_count || 0,
        total_pages: response.pagination?.total_pages || 0,
      });
      setIsFilterModalOpen(false);
      toast.success('Filters applied successfully');
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      facilityName: '',
      status: '',
      scheduledDateRange: '',
      createdOnDateRange: '',
    });
    setScheduledDateFrom(undefined);
    setScheduledDateTo(undefined);
    setCreatedOnDateFrom(undefined);
    setCreatedOnDateTo(undefined);
    setPagination({
      ...pagination,
      current_page: 1,
    });
    toast.info('Filters reset');
  };

  const handleAddBooking = () => {
    navigate('/vas/booking/add');
  };

  const handlePageChange = async (page: number) => {
    setIsPageLoading(true);
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    try {
      await dispatch(fetchFacilityBookingsData({ baseUrl, token, pageSize: 10, currentPage: page })).unwrap();
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setIsPageLoading(false);
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className='cursor-pointer'>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            disabled={isPageLoading}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1" >
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                disabled={isPageLoading}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                disabled={isPageLoading}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className='cursor-pointer'>
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  disabled={isPageLoading}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              disabled={isPageLoading}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              disabled={isPageLoading}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const renderCell = (item: BookingData, columnKey: string) => {
    switch (columnKey) {
      case 'bookingStatus':
        if (statusUpdating === item.id) {
          return <Loader2 className="w-4 h-4 animate-spin" />;
        }
        return (
          <Select
            value={item.bookingStatus}
            onValueChange={(newStatus) => handleStatusChange(item.id, newStatus)}
            disabled={statusUpdating === item.id}
          >
            <SelectTrigger className="w-[140px] border-none bg-transparent flex justify-center items-center [&>svg]:hidden">
              <SelectValue asChild>
                <Badge
                  variant={getStatusBadgeVariant(item.bookingStatus)}
                  className={cn(
                    'cursor-pointer',
                    item.bookingStatus === 'Pending' && 'bg-[#F4C790] hover:bg-[#F4C790] text-black',
                    item.bookingStatus === 'Confirmed' && 'bg-[#A3E4DB] hover:bg-[#8CDAD1] text-black',
                    item.bookingStatus === 'Cancelled' && 'bg-[#E4626F] hover:bg-[#E4626F] text-white'
                  )}
                >
                  {item.bookingStatus}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return item[columnKey as keyof BookingData];
    }
  };

  const renderActions = (item: BookingData) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(`/vas/bookings/details/${item.id}`)}
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownload = async () => {
    setExportLoading(true);
    try {
      const response = await dispatch(exportReport({ baseUrl, token })).unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'facility_bookings.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error downloading file');
    } finally {
      setExportLoading(false);
    }
  };

  const selectionActions = [
    {
      label: 'Export',
      icon: Download,
      onClick: handleDownload,
      variant: 'outline' as const,
      loading: exportLoading,
    },
  ];

  return (
    <div className="p-[30px] space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <p>Error loading bookings: {error}</p>
          <Button
            onClick={() => dispatch(fetchFacilityBookingsData({ baseUrl, token, pageSize: 10, currentPage: 1 }))}
            variant="outline"
            size="sm"
            className="mt-2"
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Retry'}
          </Button>
        </div>
      )}

      {showActionPanel && (
        <SelectionPanel
          actions={selectionActions}
          onAdd={handleAddBooking}
          onClearSelection={() => setShowActionPanel(false)}
        />
      )}

      <EnhancedTable
        data={bookingData}
        columns={enhancedTableColumns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="booking-list-table"
        loading={loading || isPageLoading}
        onFilterClick={() => setIsFilterModalOpen(true)}
        emptyMessage={loading || isPageLoading ? 'Loading bookings...' : 'No bookings found'}
        leftActions={
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white w-[106px] h-[36px] py-[10px] px-[20px]"
              onClick={() => setShowActionPanel(true)}
            >
              <Plus className="w-4 h-4" />
              Action
            </Button>
          </div>
        }
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || isPageLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || isPageLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <ThemeProvider theme={muiTheme}>
            <div>
              <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                <h3 className="text-lg font-semibold">FILTER BY</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    select
                    label="Facility Name"
                    value={filters.facilityName}
                    onChange={(e) => handleFilterChange('facilityName', e.target.value)}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="">Select Facility</MenuItem>
                    {facilities.map((facility) => (
                      <MenuItem key={facility.id} value={facility.id}>
                        {facility.fac_name}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </TextField>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <Popover open={isScheduledDatePickerOpen} onOpenChange={setIsScheduledDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <TextField
                            fullWidth
                            label="Booked Scheduled Date"
                            placeholder="Select date range"
                            value={getScheduledDateRangeDisplayValue()}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              readOnly: true,
                              endAdornment: <CalendarIcon className="h-4 w-4 text-gray-400" />,
                            }}
                            onClick={() => setIsScheduledDatePickerOpen(true)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto top-[50%] p-0 bg-white border shadow-lg z-[1500]" align="start">
                        <div className="p-4">
                          <Calendar
                            mode="range"
                            selected={{ from: scheduledDateFrom, to: scheduledDateTo }}
                            onSelect={handleScheduledDateRangeSelect}
                            numberOfMonths={2}
                            className={cn('pointer-events-auto')}
                          />
                          <div className="flex justify-between items-center pt-4 border-t">
                            <span className="text-sm text-gray-600">
                              {getScheduledDateRangeDisplayValue()}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setScheduledDateFrom(undefined);
                                  setScheduledDateTo(undefined);
                                  handleFilterChange('scheduledDateRange', '');
                                  setIsScheduledDatePickerOpen(false);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (scheduledDateFrom && scheduledDateTo) {
                                    const formattedRange = `${format(scheduledDateFrom, 'dd/MM/yyyy')} - ${format(scheduledDateTo, 'dd/MM/yyyy')}`;
                                    handleFilterChange('scheduledDateRange', formattedRange);
                                  }
                                  setIsScheduledDatePickerOpen(false);
                                }}
                                className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex-1">
                    <Popover open={isCreatedOnDatePickerOpen} onOpenChange={setIsCreatedOnDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <TextField
                            fullWidth
                            label="Created On"
                            placeholder="Select date range"
                            value={getCreatedOnDateRangeDisplayValue()}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              readOnly: true,
                              endAdornment: <CalendarIcon className="h-4 w-4 text-gray-400" />,
                            }}
                            onClick={() => setIsCreatedOnDatePickerOpen(true)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-[1500]" align="start" sideOffset={4}>
                        <div className="p-4">
                          <Calendar
                            mode="range"
                            selected={{ from: createdOnDateFrom, to: createdOnDateTo }}
                            onSelect={handleCreatedOnDateRangeSelect}
                            numberOfMonths={2}
                            className={cn('pointer-events-auto')}
                          />
                          <div className="flex justify-between items-center pt-4 border-t">
                            <span className="text-sm text-gray-600">
                              {getCreatedOnDateRangeDisplayValue()}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setCreatedOnDateFrom(undefined);
                                  setCreatedOnDateTo(undefined);
                                  handleFilterChange('createdOnDateRange', '');
                                  setIsCreatedOnDatePickerOpen(false);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (createdOnDateFrom && createdOnDateTo) {
                                    const formattedRange = `${format(createdOnDateFrom, 'dd/MM/yyyy')} - ${format(createdOnDateTo, 'dd/MM/yyyy')}`;
                                    handleFilterChange('createdOnDateRange', formattedRange);
                                  }
                                  setIsCreatedOnDatePickerOpen(false);
                                }}
                                className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
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
            </div>
          </ThemeProvider>
        </DialogContent>
      </Dialog>

      <ExportByCentreModal
        isOpen={isExportByCentreModalOpen}
        onClose={() => setIsExportByCentreModalOpen(false)}
      />
    </div>
  );
};

export default BookingListDashboard;