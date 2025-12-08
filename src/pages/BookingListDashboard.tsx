import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Download, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TextField, MenuItem, createTheme, ThemeProvider, Dialog, DialogContent, FormControl, InputLabel, Select as MuiSelect } from '@mui/material';
import { ExportByCentreModal } from '@/components/ExportByCentreModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import type { ColumnConfig } from '@/hooks/useEnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { exportReport, fetchFacilityBookingsData, filterBookings } from '@/store/slices/facilityBookingsSlice';
import type { BookingData } from '@/services/bookingService';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

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
      return 'default';
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
  const [scheduledDateFrom, setScheduledDateFrom] = useState<string>('');
  const [scheduledDateTo, setScheduledDateTo] = useState<string>('');
  const [createdOnDateFrom, setCreatedOnDateFrom] = useState<string>('');
  const [createdOnDateTo, setCreatedOnDateTo] = useState<string>('');
  const [isFiltering, setIsFiltering] = useState(false)
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

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

  useEffect(() => {
    setIsPageLoading(true);
    dispatch(fetchFacilityBookingsData({ baseUrl, token, pageSize: 10, currentPage: pagination.current_page }))
      .then(() => setIsPageLoading(false))
      .catch(() => {
        setIsPageLoading(false);
        toast.error('Failed to fetch bookings');
      });
  }, [dispatch, baseUrl, token]);

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    setStatusUpdating(bookingId);
    try {
      await axios.patch(
        `https://${baseUrl}/pms/admin/facility_bookings/${bookingId}.json`,
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

  const handleScheduledDateFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setScheduledDateFrom(newValue);
    if (newValue && scheduledDateTo) {
      const fromDate = parse(newValue, 'yyyy-MM-dd', new Date());
      const toDate = parse(scheduledDateTo, 'yyyy-MM-dd', new Date());
      if (fromDate > toDate) {
        setScheduledDateTo(newValue);
      }
      const formattedRange = `${format(fromDate, 'dd/MM/yyyy')} - ${format(toDate, 'dd/MM/yyyy')}`;
      handleFilterChange('scheduledDateRange', formattedRange);
    } else {
      handleFilterChange('scheduledDateRange', '');
    }
  };

  const handleScheduledDateToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setScheduledDateTo(newValue);
    if (scheduledDateFrom && newValue) {
      const fromDate = parse(scheduledDateFrom, 'yyyy-MM-dd', new Date());
      const toDate = parse(newValue, 'yyyy-MM-dd', new Date());
      if (toDate < fromDate) {
        setScheduledDateFrom(newValue);
      }
      const formattedRange = `${format(fromDate, 'dd/MM/yyyy')} - ${format(toDate, 'dd/MM/yyyy')}`;
      handleFilterChange('scheduledDateRange', formattedRange);
    } else {
      handleFilterChange('scheduledDateRange', '');
    }
  };

  const handleCreatedOnDateFromChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCreatedOnDateFrom(newValue);
    if (newValue && createdOnDateTo) {
      const fromDate = parse(newValue, 'yyyy-MM-dd', new Date());
      const toDate = parse(createdOnDateTo, 'yyyy-MM-dd', new Date());
      if (fromDate > toDate) {
        setCreatedOnDateTo(newValue);
      }
      const formattedRange = `${format(fromDate, 'dd/MM/yyyy')} - ${format(toDate, 'dd/MM/yyyy')}`;
      handleFilterChange('createdOnDateRange', formattedRange);
    } else {
      handleFilterChange('createdOnDateRange', '');
    }
  };

  const handleCreatedOnDateToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCreatedOnDateTo(newValue);
    if (createdOnDateFrom && newValue) {
      const fromDate = parse(createdOnDateFrom, 'yyyy-MM-dd', new Date());
      const toDate = parse(newValue, 'yyyy-MM-dd', new Date());
      if (toDate < fromDate) {
        setCreatedOnDateFrom(newValue);
      }
      const formattedRange = `${format(fromDate, 'dd/MM/yyyy')} - ${format(toDate, 'dd/MM/yyyy')}`;
      handleFilterChange('createdOnDateRange', formattedRange);
    } else {
      handleFilterChange('createdOnDateRange', '');
    }
  };

  const handleApplyFilters = async () => {
    const formatedScheduleStartDate = scheduledDateFrom ? format(parse(scheduledDateFrom, 'yyyy-MM-dd', new Date()), "MM/dd/yyyy") : null;
    const formatedScheduleEndDate = scheduledDateTo ? format(parse(scheduledDateTo, 'yyyy-MM-dd', new Date()), "MM/dd/yyyy") : null;
    const formatedCreatedStartDate = createdOnDateFrom ? format(parse(createdOnDateFrom, 'yyyy-MM-dd', new Date()), "MM/dd/yyyy") : null;
    const formatedCreatedEndDate = createdOnDateTo ? format(parse(createdOnDateTo, 'yyyy-MM-dd', new Date()), "MM/dd/yyyy") : null;

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
    setIsFiltering(true);
    try {
      const response = await dispatch(filterBookings({ baseUrl, token, queryString })).unwrap();
      const updatedResponse = response.facility_bookings.map((item: any) => ({
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
        current_page: response.pagination.current_page || 1,
        total_count: response.pagination.total_count || 0,
        total_pages: response.pagination.total_pages || 0,
      });
      setIsFilterModalOpen(false);
      toast.success('Filters applied successfully');
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    } finally {
      setIsFiltering(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      facilityName: '',
      status: '',
      scheduledDateRange: '',
      createdOnDateRange: '',
    });
    setScheduledDateFrom('');
    setScheduledDateTo('');
    setCreatedOnDateFrom('');
    setCreatedOnDateTo('');
    setPagination({
      ...pagination,
      current_page: 1,
    });
    toast.info('Filters reset');
  };

  const handleAddBooking = () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes("bookings")) {
      navigate('/bookings/add');
    } else {
      navigate('/vas/booking/add');
    }
  };

  const handlePageChange = async (page: number) => {
    setIsPageLoading(true);
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));

    try {
      // Check if any filters are applied
      const areFiltersApplied =
        filters.facilityName ||
        filters.status ||
        scheduledDateFrom ||
        scheduledDateTo ||
        createdOnDateFrom ||
        createdOnDateTo;

      if (areFiltersApplied) {
        // Format dates for filterBookings if needed
        const formatedScheduleStartDate = scheduledDateFrom
          ? format(parse(scheduledDateFrom, 'yyyy-MM-dd', new Date()), 'MM/dd/yyyy')
          : null;
        const formatedScheduleEndDate = scheduledDateTo
          ? format(parse(scheduledDateTo, 'yyyy-MM-dd', new Date()), 'MM/dd/yyyy')
          : null;
        const formatedCreatedStartDate = createdOnDateFrom
          ? format(parse(createdOnDateFrom, 'yyyy-MM-dd', new Date()), 'MM/dd/yyyy')
          : null;
        const formatedCreatedEndDate = createdOnDateTo
          ? format(parse(createdOnDateTo, 'yyyy-MM-dd', new Date()), 'MM/dd/yyyy')
          : null;

        // Construct filter parameters, including page for pagination
        const filterParams = {
          page: page.toString(),
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

        // Call filterBookings with the constructed query string
        const response = await dispatch(filterBookings({ baseUrl, token, queryString })).unwrap();
        const updatedResponse = response.facility_bookings.map((item: any) => ({
          bookedBy: item.book_by,
          bookedFor: item.book_for || '-',
          bookingStatus: item.current_status,
          companyName: item.company_name,
          createdOn: item.created_at.split(' ')[0],
          facility: item.facility_name,
          facilityType: item.fac_type,
          id: item.id,
          scheduledDate: item.startdate.split('T')[0],
          scheduledTime: item.show_schedule_24_hour,
          source: item.source,
        }));

        setBookingData(updatedResponse);
        setPagination({
          current_page: response.pagination.current_page || page,
          total_count: response.pagination.total_count || 0,
          total_pages: response.pagination.total_pages || 0,
        });
      } else {
        // Call fetchFacilityBookingsData if no filters are applied
        await dispatch(fetchFacilityBookingsData({ baseUrl, token, pageSize: 10, currentPage: page })).unwrap();
      }
    } catch (error) {
      console.error('Error fetching bookings for page change:', error);
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

            {item.facilityType === "Request" && (
              <SelectContent>
                <SelectItem value="Pending">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#F4C790]" />
                    Pending
                  </div>
                </SelectItem>

                <SelectItem value="Confirmed">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#A3E4DB]" />
                    Confirmed
                  </div>
                </SelectItem>

                <SelectItem value="Cancelled">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#E4626F]" />
                    Cancelled
                  </div>
                </SelectItem>
              </SelectContent>
            )}
          </Select>
        );
      default:
        return item[columnKey as keyof BookingData];
    }
  };

  const handleView = (id: number) => {
    navigate(`/club-management/amenities-booking/${id}`);
  };

  const renderActions = (item: BookingData) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleView(item.id)}
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
    <div className="space-y-6">
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

      <Dialog open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent className="[&>button]:hidden">
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
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Facility Name</InputLabel>
                    <MuiSelect
                      label="Facility Name"
                      value={filters.facilityName}
                      onChange={(e) => handleFilterChange('facilityName', e.target.value)}
                      displayEmpty
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="">Select Facility</MenuItem>
                      {facilities.map((facility) => (
                        <MenuItem key={facility.id} value={facility.id}>
                          {facility.fac_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Status</InputLabel>
                    <MuiSelect
                      label="Status"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      displayEmpty
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <TextField
                      label="Booked Scheduled Date From"
                      type="date"
                      value={scheduledDateFrom}
                      onChange={handleScheduledDateFromChange}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <span className="text-gray-500">–</span>
                    <TextField
                      label="Booked Scheduled Date To"
                      type="date"
                      value={scheduledDateTo}
                      onChange={handleScheduledDateToChange}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <TextField
                      label="Created On From"
                      type="date"
                      value={createdOnDateFrom}
                      onChange={handleCreatedOnDateFromChange}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                    <span className="text-gray-500">–</span>
                    <TextField
                      label="Created On To"
                      type="date"
                      value={createdOnDateTo}
                      onChange={handleCreatedOnDateToChange}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
                  disabled={isFiltering}
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