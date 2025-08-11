import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import { fetchEvents } from '@/store/slices/eventSlice';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export const CRMEventsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem("token");

  const { loading } = useAppSelector(state => state.fetchEvents)

  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    unit: '',
    dateRange: {
      from: undefined,
      to: undefined,
    },
    status: '',
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchEvents({ baseUrl, token, page: pagination.current_page, per_page: 10 })).unwrap();
        const mappedEvents = response.classifieds.map(event => ({
          id: event.id,
          event_name: event.event_name,
          unit: event.event_at || '-',
          created_by: event.created_by || 'Unknown',
          from_time: event.from_time,
          to_time: event.to_time,
          event_type: event.event_type || '-',
          status: event.status,
          is_expired: event.is_expired === 1,
          attachments: event.documents || [],
          created_at: event.created_at,
        }));
        setEvents(mappedEvents);
        setPagination({
          current_page: response.pagination.current_page,
          total_count: response.pagination.total_count,
          total_pages: response.pagination.total_pages
        })
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch data');
      }
    }

    fetchData();
  }, [])

  const columns = [
    { key: 'event_name', label: 'Title', sortable: true, defaultVisible: true },
    { key: 'unit', label: 'Unit', sortable: true, defaultVisible: true },
    { key: 'created_by', label: 'Created By', sortable: true, defaultVisible: true },
    { key: 'from_time', label: 'Start Date', sortable: true, defaultVisible: true },
    { key: 'to_time', label: 'End Date', sortable: true, defaultVisible: true },
    { key: 'event_type', label: 'Event Type', sortable: true, defaultVisible: true },
    { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
    { key: 'is_expired', label: 'Expired', sortable: true, defaultVisible: true },
    { key: 'attachments', label: 'Attachments', sortable: true, defaultVisible: true },
    { key: 'created_at', label: 'Created On', sortable: true, defaultVisible: true },
  ];

  // Handle view event
  const handleViewEvent = (event) => {
    navigate(`/crm/events/details/${event.id}`);
  };

  // Handle add event
  const handleAddEvent = () => {
    navigate('/crm/events/add');
  };

  // Handle filter dialog
  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleApplyFilters = async () => {
    const formatedStartDate = filters.dateRange.from ? format(new Date(filters.dateRange.from), "MM/dd/yyyy") : null;
    const formatedEndDate = filters.dateRange.to ? format(new Date(filters.dateRange.to), "MM/dd/yyyy") : null;

    const filterParams = {
      "q[publish_in]": filters.status,
      ...(formatedStartDate && formatedEndDate && { "q[date_range]": `${formatedStartDate} - ${formatedEndDate}` }),
    };

    const queryString = new URLSearchParams(filterParams).toString();

    try {
      const response = await dispatch(fetchEvents({ baseUrl, token, params: queryString, page: pagination.current_page, per_page: 10 })).unwrap();
      const mappedEvents = response.classifieds.map(event => ({
        id: event.id,
        event_name: event.event_name,
        unit: event.event_at || '-',
        created_by: event.created_by || 'Unknown',
        from_time: event.from_time,
        to_time: event.to_time,
        event_type: event.event_type || '-',
        status: event.status,
        is_expired: event.is_expired === 1,
        attachments: event.documents || [],
        created_at: event.created_at,
      }));
      setEvents(mappedEvents);
      setPagination({
        current_page: response.pagination.current_page,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages
      })
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch data');
    }
    setOpenFilterDialog(false);
  };

  const handleResetFilters = () => {
    setFilters({
      unit: '',
      dateRange: undefined,
      status: '',
    });
  };

  // Render cell content
  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case 'status':
        return (
          <Badge className="bg-green-600 text-white">{item.status}</Badge>
        );
      case 'event_type':
        return (
          <Badge className="bg-blue-600 text-white">{item.event_type}</Badge>
        );
      case 'is_expired':
        return item.is_expired ? (
          <Badge className="bg-red-600 text-white">Expired</Badge>
        ) : (
          <Badge className="bg-green-600 text-white">Active</Badge>
        );
      case 'attachments':
        return item.attachments.length > 0 ? (
          <img
            style={{ width: "100%", height: "50px" }}
            src={item.attachments[0].document}
          />
        ) : (
          'None'
        );
      case 'from_time':
      case 'to_time':
      case 'created_at':
        return item[columnKey] ? format(new Date(item[columnKey]), 'MM/dd/yyyy HH:mm') : 'N/A';
      default:
        return item[columnKey] || 'N/A';
    }
  };

  const handlePageChange = async (page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    try {
      const response = await dispatch(fetchEvents({ baseUrl, token, page: page, per_page: 10 })).unwrap();
      const mappedEvents = response.classifieds.map(event => ({
        id: event.id,
        event_name: event.event_name,
        unit: event.event_at || '-',
        created_by: event.created_by || 'Unknown',
        from_time: event.from_time,
        to_time: event.to_time,
        event_type: event.event_type || '-',
        status: event.status,
        is_expired: event.is_expired === 1,
        attachments: event.documents || [],
        created_at: event.created_at,
      }));
      setEvents(mappedEvents);
      setPagination({
        current_page: response.pagination.current_page,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages
      })
    } catch (error) {
      toast.error('Failed to fetch bookings');
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
            disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // Render actions
  const renderActions = (item) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-blue-600"
      onClick={() => handleViewEvent(item)}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  const getDateRangeLabel = () => {
    const { from, to } = filters.dateRange;
    if (from && to) {
      return `${format(from, 'MM/dd/yyyy')} - ${format(to, 'MM/dd/yyyy')}`;
    } else if (from) {
      return `${format(from, 'MM/dd/yyyy')} - ...`;
    } else {
      return 'Select Date Range';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Event List</h1>
      </div>

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Filter Events</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-4">

            {/* Date Range Picker */}
            <FormControl fullWidth>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !filters.dateRange?.from && 'text-gray-400'
                    )}
                    style={{ border: "1px solid #ccc", padding: "25px 15px", borderRadius: "3px" }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateRangeLabel()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 9999 }}>
                  <Calendar
                    mode="range"
                    selected={filters.dateRange}
                    onSelect={(range) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: {
                          from: range?.from,
                          to: range?.to,
                        },
                      }))
                    }
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>

            {/* Status Filter */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                label="Status"
              >
                <MenuItem value="Select" disabled>Select Status</MenuItem>
                <MenuItem value="1">Published</MenuItem>
                <MenuItem value="2">Disabled</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleResetFilters} color="secondary">
            Reset
          </Button>
          <Button onClick={() => handleApplyFilters(filters)} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Table */}
      <EnhancedTable
        data={events || []}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="crm-events-table"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search events..."
        enableExport={true}
        exportFileName="events"
        pagination={true}
        pageSize={10}
        enableSearch={true}
        loading={loading}
        leftActions={
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white w-[106px] h-[36px] py-[10px] px-[20px]"
              onClick={handleAddEvent}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        }
        onFilterClick={handleOpenFilterDialog}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};