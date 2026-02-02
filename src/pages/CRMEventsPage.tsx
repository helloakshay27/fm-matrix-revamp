import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Edit, Calendar, IndianRupee, CalendarCheck, AlertCircle, CalendarClock, FileCheck, CalendarRange } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import { fetchEvents, updateEvent } from '@/store/slices/eventSlice';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { CRMEventsFilterModal } from '@/components/CRMEventsFilterModal';
import { Switch as MuiSwitch } from '@mui/material';

export const CRMEventsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem("token");

  const { loading } = useAppSelector(state => state.fetchEvents)

  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    created_at: '',
    created_by: '',
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});
  const [cardData, setCardData] = useState({
    total_events: "",
    upcoming_events: "",
    past_events: "",
    complementary_events: "",
    paid_events: "",
    requestable_events: "",
    pending_requests: "",
    total_registrations: ""
  });

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
          is_paid: event.is_paid,
          event_type: event.shared === 0 ? "General" : "Personal",
          event_location: event.event_at,
          amount: event.amount_per_member,
          member_capacity: event.capacity,
          active: event.active,
          status: event.status,
          is_expired: event.is_expired === 1,
          attachments: event.documents || [],
          created_at: event.created_at,
        }));
        setEvents(mappedEvents);
        setCardData({
          total_events: response.dashboard.total_events || "0",
          upcoming_events: response.dashboard.upcoming_events || "0",
          past_events: response.dashboard.past_events || "0",
          complementary_events: response.dashboard.complementary_events || "0",
          paid_events: response.dashboard.paid_events || "0",
          requestable_events: response.dashboard.requestable_events || "0",
          pending_requests: response.dashboard.pending_requests || "0",
          total_registrations: response.dashboard.total_registrations || "0"
        });
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
    { key: 'event_name', label: 'Event Name', sortable: true, defaultVisible: true },
    { key: 'event_date', label: 'Event Date', sortable: true, defaultVisible: true },
    { key: 'event_time', label: 'Event Time', sortable: true, defaultVisible: true },
    { key: 'event_category', label: 'Event Category', sortable: true, defaultVisible: true },
    { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
    { key: 'event_location', label: 'Event Location', sortable: true, defaultVisible: true },
    // { key: 'pulse_category', label: 'Pulse Category', sortable: true, defaultVisible: true },
    // { key: 'requestable', label: 'Requestable', sortable: true, defaultVisible: true },
    // { key: 'approval_pending', label: 'Approval Pending', sortable: true, defaultVisible: true },
    { key: 'amount', label: 'Amount', sortable: true, defaultVisible: true },
    { key: 'member_capacity', label: 'Member Capacity', sortable: true, defaultVisible: true },
    // { key: 'seat_remaining', label: 'Seat Remaining', sortable: true, defaultVisible: true },
    // { key: 'member_per_limit', label: 'Member Per Limit', sortable: true, defaultVisible: true },
    { key: 'created_at', label: 'Event Created On', sortable: true, defaultVisible: true },
    { key: 'created_by', label: 'Event Created By', sortable: true, defaultVisible: true },
    // { key: 'interested_count', label: 'Interested', sortable: true, defaultVisible: true },
    // { key: 'registered_count', label: 'Registered', sortable: true, defaultVisible: true },
    // { key: 'waitlist_count', label: 'Waitlist', sortable: true, defaultVisible: true },
  ];

  // Handle filter modal
  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleApplyFilters = async (filterData: { status?: string; created_at?: string; created_by?: string }) => {
    // Update local filters state
    setFilters({
      status: filterData.status || '',
      created_at: filterData.created_at || '',
      created_by: filterData.created_by || '',
    });

    // Build filter params for API
    const filterParams: any = {};

    if (filterData.status) {
      filterParams["q[active_eq]"] = filterData.status;
    }

    if (filterData.created_at) {
      const formattedDate = format(new Date(filterData.created_at), "yyyy-MM-dd");
      filterParams["q[created_at_eq]"] = formattedDate;
    }

    if (filterData.created_by) {
      filterParams["q[created_by]"] = filterData.created_by;
    }

    const queryString = new URLSearchParams(filterParams).toString();

    try {
      const response = await dispatch(fetchEvents({ baseUrl, token, params: queryString, page: pagination.current_page, per_page: 10 })).unwrap();
      console.log(response.classifieds)
      const mappedEvents = response.classifieds.map(event => ({
        id: event.id,
        event_name: event.event_name,
        unit: event.event_at || '-',
        created_by: event.created_by || 'Unknown',
        from_time: event.from_time,
        to_time: event.to_time,
        is_paid: event.is_paid,
        event_type: event.shared === 0 ? "General" : "Personal",
        event_location: event.event_at,
        amount: event.amount_per_member,
        member_capacity: event.capacity,
        active: event.active,
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
  };

  const handleAdd = () => {
    navigate("/pulse/events/add");
  };

  const handleView = (id: number) => {
    navigate(`/pulse/events/details/${id}`);
  }

  const handleEdit = (id: number) => {
    navigate(`/pulse/events/edit/${id}`);
  }

  const handleStatusChange = async (item: any, checked: boolean) => {
    // 1: Published, 2: Disabled
    const newStatus = checked ? 1 : 0;

    // Optimistic update
    setUpdatingStatus((prev) => ({ ...prev, [item.id]: true }));

    // Update events list optimistically
    setEvents((prev) =>
      prev.map((event) =>
        event.id === item.id ? { ...event, active: newStatus } : event
      )
    );

    try {
      await dispatch(
        updateEvent({
          id: item.id,
          data: { event: { active: newStatus } },
          baseUrl,
          token,
        })
      ).unwrap();

      toast.success("Event status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update event status");

      // Revert optimistic update on error
      setEvents((prev) =>
        prev.map((event) =>
          event.id === item.id ? { ...event, active: item.active } : event
        )
      );
    } finally {
      setUpdatingStatus((prev) => {
        const newState = { ...prev };
        delete newState[item.id];
        return newState;
      });
    }
  };

  // Render cell content
  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case 'event_date':
        return new Intl.DateTimeFormat("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(item.from_time));
      case 'event_time':
        return new Intl.DateTimeFormat("en-GB", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }).format(new Date(item.from_time));
      case "event_category":
        return item.is_paid ? "Paid" : "Complimentary";
      case 'event_type':
        return (
          <span>{item.event_type}</span>
        );
      case 'amount':
        return (
          <span>{item.amount}</span>
        );
      case "status":
        const isChecked = item.active;

        return (
          <div className="flex items-center gap-2">
            <MuiSwitch
              checked={isChecked}
              onChange={(e) => handleStatusChange(item, e.target.checked)}
              disabled={updatingStatus[item.id]}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase': {
                  color: '#ef4444',
                  '&.Mui-checked': {
                    color: '#22c55e',
                  },
                  '&.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#22c55e',
                  },
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#ef4444',
                },
              }}
            />
            {isChecked ? "Active" : "Inactive"}
          </div>
        );
      case 'is_expired':
        return item.is_expired ? (
          <Badge className="bg-red-600 text-white">Expired</Badge>
        ) : (
          <Badge className="bg-green-600 text-white">Active</Badge>
        );
      case 'attachments':
        return item.attachments.length > 0 ? (
          <div className='bg-gray-100'>
            <img
              style={{ width: "100%", height: "50px" }}
              className='object-contain'
              src={item.attachments[0].document}
            />
          </div>
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
        event_type: event.shared === 0 ? "General" : "Personal",
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
    <div className="flex">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleView(item.id)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleEdit(item.id)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );



  const cardValues = [
    { title: "Total Events", value: cardData.total_events, icon: <Calendar className="w-5 h-5" color="#C72030" /> },
    { title: "Upcoming Events", value: cardData.upcoming_events, icon: <CalendarRange className="w-5 h-5" color="#C72030" /> },
    { title: "Past Events", value: cardData.past_events, icon: <CalendarClock className="w-5 h-5" color="#C72030" /> },
    { title: "Complementary Events", value: cardData.complementary_events, icon: <CalendarCheck className="w-5 h-5" color="#C72030" /> },
    { title: "Paid Events", value: cardData.paid_events, icon: <IndianRupee className="w-5 h-5" color="#C72030" /> },
    { title: "Requestable Events", value: cardData.requestable_events, icon: <FileCheck className="w-5 h-5" color="#C72030" /> },
    { title: "Pending Requests", value: cardData.pending_requests, icon: <AlertCircle className="w-5 h-5" color="#C72030" /> },
    { title: "Total Registrations", value: cardData.total_registrations, icon: <FileCheck className="w-5 h-5" color="#C72030" /> },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardValues.map((card, index) => (
          <div key={index}>
            <div
              className={`bg-[#F6F4EE] p-6 rounded-lg shadow-sm flex items-center gap-4`}
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded-[3px]">
                {card.icon}
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {card.value || 0}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">
                  {card.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Modal */}
      <CRMEventsFilterModal
        open={openFilterModal}
        onOpenChange={setOpenFilterModal}
        onApply={handleApplyFilters}
      />

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
        enableSearch={true}
        loading={loading}
        leftActions={
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white w-[106px] h-[36px] py-[10px] px-[20px]"
              onClick={handleAdd}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        }
        onFilterClick={handleOpenFilterModal}
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