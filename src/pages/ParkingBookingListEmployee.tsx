import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Download, 
  Filter, 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Car,
  Bike,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { getFullUrl, getAuthenticatedFetchOptions, API_CONFIG } from '@/config/apiConfig';
import { useLayout } from '@/contexts/LayoutContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { ColumnVisibilityDropdown } from '@/components/ColumnVisibilityDropdown';
import { TextField, MenuItem } from '@mui/material';
import { ParkingAnalyticsCard } from '@/components/ParkingAnalyticsCard';
import { ParkingStatisticsCard } from '@/components/parking-analytics/ParkingStatisticsCard';
import { ParkingOccupancyChart } from '@/components/parking-analytics/ParkingOccupancyChart';
import { FloorWiseOccupancyChart } from '@/components/parking-analytics/FloorWiseOccupancyChart';
import { ParkingAnalyticsSelector } from '@/components/ParkingAnalyticsSelector';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

// Interface definitions
interface ParkingBookingUser {
  id: number;
  full_name: string;
  department_name: string;
  designation: string;
  email: string;
}

interface ParkingCategory {
  id: number;
  name: string;
}

interface ParkingConfiguration {
  id: number;
  building_name: string;
  floor_name: string;
  parking_category: ParkingCategory;
}

interface Attendance {
  punched_in_at: string | null;
  punched_out_at: string | null;
  formatted_punched_in_at: string | null;
  formatted_punched_out_at: string | null;
}

interface QRCode {
  id: number;
  document_url: string;
}

interface CanCancel {
  allowed: boolean;
  reason: string;
}

interface ParkingBooking {
  id: number;
  user_id: number;
  booking_date: string;
  status: string;
  booking_schedule: string;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  user: ParkingBookingUser;
  parking_configuration: ParkingConfiguration;
  attendance: Attendance;
  cancelled_by: string | null;
  qr_code: QRCode | null; // Allow null
  can_cancel: CanCancel;
  url: string;
  booking_schedule_time: string;
  booking_schedule_slot_time: string;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
}

interface ParkingBookingApiResponse {
  cards: {
    total_slots: number;
    two_total: number;
    four_total: number;
    two_booked: number;
    four_available: number;
    two_available: number;
    alloted: number;
    vacant: number;
    four_booked: number;
  };
  parking_bookings: ParkingBooking[];
  pagination: PaginationInfo;
}

interface ParkingBookingEmployee {
  id: number;
  schedule_date: string;
  booking_schedule: string;
  booking_schedule_time: string;
  booking_schedule_slot_time: string;
  category: string;
  building: string;
  floor: string;
  slot_parking_no: string;
  status: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  created_on: string;
  qr_code_url: string;
  cancel?: boolean;
}

interface ParkingBookingEmployeeSummary {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  checked_in_count: number;
  checked_out_count: number;
}

// Section Loader Component
const SectionLoader: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ loading, children, className }) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 z-10 rounded-lg bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

const ParkingBookingListEmployee = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayout();
  const isInitialLoadRef = useRef(true);

  // API state
  const [bookings, setBookings] = useState<ParkingBooking[]>([]);
  const [bookingData, setBookingData] = useState<ParkingBookingEmployee[]>([]);
  const [summary, setSummary] = useState<ParkingBookingEmployeeSummary | null>(null);
  const [cards, setCards] = useState<{
    total_slots: number;
    two_total: number;
    four_total: number;
    four_booked: number;
    two_available: number;
    four_available: number;
    two_booked: number;
    alloted: number;
    vacant: number;
    two_cancelled: number;
    four_cancelled: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiPagination, setApiPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 1,
    per_page: 20
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

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

  // Transform API data to match UI structure
  const transformApiDataToBookings = (parkingBookings: ParkingBooking[]): ParkingBookingEmployee[] => {
    return parkingBookings.map((booking) => ({
      id: booking.id,
      schedule_date: booking.booking_date,
      booking_schedule: booking.booking_schedule,
      booking_schedule_time: booking.booking_schedule_time,
      booking_schedule_slot_time: booking.booking_schedule_slot_time,
      category: booking.parking_configuration.parking_category.name,
      building: booking.parking_configuration.building_name,
      floor: booking.parking_configuration.floor_name,
      slot_parking_no: `Slot-${booking.id}`,
      status: booking.status,
      checked_in_at: booking.attendance.formatted_punched_in_at,
      checked_out_at: booking.attendance.formatted_punched_out_at,
      created_on: booking.created_at,
      qr_code_url: booking.qr_code?.document_url || '', // Handle null qr_code
      cancel: booking.can_cancel.allowed
    }));
  };

  // Generate summary from API data
  const generateSummaryFromBookings = (parkingBookings: ParkingBooking[]): ParkingBookingEmployeeSummary => {
    const total_bookings = parkingBookings.length;
    const confirmed_bookings = parkingBookings.filter(b => b.status === 'confirmed').length;
    const cancelled_bookings = parkingBookings.filter(b => b.status === 'cancelled').length;
    const checked_in_count = parkingBookings.filter(b => b.attendance.punched_in_at !== null).length;
    const checked_out_count = parkingBookings.filter(b => b.attendance.punched_out_at !== null).length;

    return {
      total_bookings,
      confirmed_bookings,
      cancelled_bookings,
      checked_in_count,
      checked_out_count
    };
  };

  // Helper function to convert date from YYYY-MM-DD to DD/MM/YYYY format
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Default today's date values
  const getTodayYMD = (): string => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    scheduled_on_from: getTodayYMD(),
    scheduled_on_to: getTodayYMD(),
  });

  const [appliedFilters, setAppliedFilters] = useState({
    status: 'all',
    category: 'all',
    scheduled_on_from: getTodayYMD(),
    scheduled_on_to: getTodayYMD(),
  });

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'sr_no', label: 'Sr No.', visible: true },
    { key: 'schedule_date', label: 'Schedule Date', visible: true },
    { key: 'booking_schedule_time', label: 'Booking Time', visible: true },
    { key: 'booking_schedule_slot_time', label: 'Booking Slots', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'building', label: 'Building', visible: true },
    { key: 'floor', label: 'Floor', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'checked_in_at', label: 'Checked In At', visible: true },
    { key: 'checked_out_at', label: 'Checked Out At', visible: true },
    { key: 'created_on', label: 'Created On', visible: true },
    { key: 'qr_code', label: 'QR Code', visible: true },
    { key: 'cancel', label: 'Cancel', visible: true }
  ]);

  // Analytics state
  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>([
    'peak_hour_trends',
    'booking_patterns',
    'occupancy_rate',
    'average_duration',
    'parking_statistics',
    'two_four_occupancy',
    'floor_wise_occupancy'
  ]);

  // Analytics date range state
  const getDefaultAnalyticsDateRange = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      startDate: formatDate(lastYear),
      endDate: formatDate(today)
    };
  };

  const [analyticsDateRange, setAnalyticsDateRange] = useState<{ startDate: string; endDate: string }>(getDefaultAnalyticsDateRange());

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Fetch employee's parking bookings from API
  const fetchParkingBookings = async (page = 1, searchQuery = '', filterParams: any = {}) => {
    try {
      const url = getFullUrl('/pms/admin/parking_bookings.json'); // Admin endpoint
      const options = getAuthenticatedFetchOptions();
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      
      // Add current user ID filter to show only employee's own bookings
      const currentUserId = getCurrentUserId();
      if (currentUserId) {
        params.append('q[user_id_in][]', currentUserId);
        console.log('🔍 Filtering by current user ID:', currentUserId);
      }
      
      // Add search query - intelligently route to email, first name, or last name
      if (searchQuery.trim()) {
        console.log('🔍 Search Query Debug:');
        console.log('Search query value:', searchQuery);
        const trimmedQuery = searchQuery.trim();
        
        // Check if it's an email (contains @)
        if (trimmedQuery.includes('@')) {
          console.log('🔍 Detected email search');
          params.append('q[user_email_eq]', trimmedQuery);
        }
        // Check if it contains a space (first name and last name)
        else if (trimmedQuery.includes(' ')) {
          const nameParts = trimmedQuery.split(' ').filter(part => part.length > 0);
          if (nameParts.length >= 2) {
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            console.log('🔍 Detected full name search');
            params.append('q[user_firstname_eq]', firstName);
            params.append('q[user_last_name_eq]', lastName);
          } else {
            console.log('🔍 Detected single name search (first name)');
            params.append('q[user_firstname_eq]', nameParts[0]);
          }
        }
        // Single word without @ - treat as first name
        else {
          console.log('🔍 Detected single name search (first name)');
          params.append('q[user_firstname_eq]', trimmedQuery);
        }
      }
      
      // Add filter parameters
      // Status filter
      if (filterParams.status && filterParams.status !== 'all') {
        console.log('🔍 Status Filter:', filterParams.status);
        params.append('q[status_in][]', filterParams.status);
      }
      
      // Category filter
      if (filterParams.category && filterParams.category !== 'all') {
        console.log('🔍 Category Filter:', filterParams.category);
        params.append('q[parking_configuration_parking_category_id_eq]', filterParams.category);
      }
      
      // Date range filter - use both date_range and q[date_range1] like site-wise
      if (filterParams.scheduled_date_range) {
        console.log('🔍 Date Range Filter:', filterParams.scheduled_date_range);
        params.append('date_range', filterParams.scheduled_date_range);
        params.append('q[date_range1]', filterParams.scheduled_date_range);
      }
      
      const fullUrl = `${url}?${params.toString()}`;
      console.log('🔍 Fetching employee bookings from:', fullUrl);
      console.log('🔍 Query Parameters:', params.toString());
      console.log('🔍 Filter Params:', filterParams);
      
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ParkingBookingApiResponse = await response.json();
      console.log('🔍 API Response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching employee parking bookings:', error);
      throw error;
    }
  };

  // Load booking data from API
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        const isInitialLoad = isInitialLoadRef.current;
        setLoading(true);
        setError(null);
        
        const buildApiFilterParams = () => {
          const apiParams: any = {};
          
          if (appliedFilters.status !== 'all') {
            apiParams.status = appliedFilters.status;
          }
          
          if (appliedFilters.category !== 'all') {
            apiParams.category = appliedFilters.category;
          }
          
          if (appliedFilters.scheduled_on_from.trim() || appliedFilters.scheduled_on_to.trim()) {
            const fromDate = appliedFilters.scheduled_on_from.trim() ? formatDateForAPI(appliedFilters.scheduled_on_from.trim()) : formatDateForAPI(appliedFilters.scheduled_on_to.trim());
            const toDate = appliedFilters.scheduled_on_to.trim() ? formatDateForAPI(appliedFilters.scheduled_on_to.trim()) : formatDateForAPI(appliedFilters.scheduled_on_from.trim());
            apiParams.scheduled_date_range = `${fromDate} - ${toDate}`;
          }
          
          return apiParams;
        };
        
        const response = await fetchParkingBookings(currentPage, debouncedSearchTerm, buildApiFilterParams());
        
        // Set raw API data
        setBookings(response.parking_bookings);
        
        // Transform for UI
        const transformedBookings = transformApiDataToBookings(response.parking_bookings);
        setBookingData(transformedBookings);
        
        // Generate summary
        const generatedSummary = generateSummaryFromBookings(response.parking_bookings);
        setSummary(generatedSummary);
        
        // Set cards data from API response cards object
        console.log('📊 Cards data from API:', response.cards);
        if (response.cards) {
          // Calculate cancelled slots for each category from bookings data
          const twoCancelled = response.parking_bookings.filter(b => 
            b.status === 'cancelled' && 
            (b.parking_configuration.parking_category.name.toLowerCase().includes('two') ||
             b.parking_configuration.parking_category.name.toLowerCase().includes('bike'))
          ).length;
          
          const fourCancelled = response.parking_bookings.filter(b => 
            b.status === 'cancelled' && 
            (b.parking_configuration.parking_category.name.toLowerCase().includes('four') ||
             b.parking_configuration.parking_category.name.toLowerCase().includes('car'))
          ).length;

          setCards({
            total_slots: response.cards.total_slots,
            two_total: response.cards.two_total,
            four_total: response.cards.four_total,
            four_booked: response.cards.four_booked,
            two_available: response.cards.two_available,
            four_available: response.cards.four_available,
            two_booked: response.cards.two_booked,
            alloted: response.cards.alloted,
            vacant: response.cards.vacant,
            two_cancelled: twoCancelled,
            four_cancelled: fourCancelled,
          });
        } else {
          // Fallback if cards object is not available
          setCards({
            total_slots: 0,
            two_total: 0,
            four_total: 0,
            four_booked: 0,
            two_available: 0,
            four_available: 0,
            two_booked: 0,
            alloted: 0,
            vacant: 0,
            two_cancelled: 0,
            four_cancelled: 0,
          });
        }
        
        // Set pagination
        setApiPagination({
          current_page: response.pagination.current_page,
          total_count: response.pagination.total_count,
          total_pages: response.pagination.total_pages,
          per_page: 20
        });
        
        if (isInitialLoad) {
          isInitialLoadRef.current = false;
        }
        
      } catch (error) {
        console.error('❌ Error loading booking data:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        setError('Failed to load parking booking data');
        toast.error('Failed to load parking booking data');
        
        // Set empty data on error
        setBookingData([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [currentPage, debouncedSearchTerm, appliedFilters]);

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: number) => {
    setBookingToCancel(bookingId);
    setShowCancelConfirmation(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    try {
      toast.info(`Cancelling booking ${bookingToCancel}...`);
      
      const url = getFullUrl(`/pms/admin/parking_bookings/${bookingToCancel}`);
      const options = getAuthenticatedFetchOptions();
      
      const response = await fetch(url, {
        ...options,
        method: 'PUT',
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parking_booking: {
            status: "cancelled"
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      toast.success(`Booking ${bookingToCancel} cancelled successfully!`);
      
      // Update local state
      setBookingData(prevData => 
        prevData.map(booking => 
          booking.id === bookingToCancel 
            ? { ...booking, status: 'cancelled', cancel: false }
            : booking
        )
      );
      
      // Update summary
      if (summary) {
        setSummary(prev => prev ? {
          ...prev,
          confirmed_bookings: prev.confirmed_bookings - 1,
          cancelled_bookings: prev.cancelled_bookings + 1
        } : null);
      }
      
      setShowCancelConfirmation(false);
      setBookingToCancel(null);
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking. Please try again.');
      setShowCancelConfirmation(false);
      setBookingToCancel(null);
    }
  };

  // Handle page change
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setShowFiltersModal(false);
    toast.success('Filters applied successfully!');
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      status: 'all',
      category: 'all',
      scheduled_on_from: '',
      scheduled_on_to: '',
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    setCurrentPage(1);
  };

  // Handle column visibility
  const isColumnVisible = (columnKey: string) => {
    return columns.find(col => col.key === columnKey)?.visible ?? true;
  };

  const totalPages = apiPagination.total_pages;

  // Generate parking stats from cards data (matching site-wise structure)
  const parkingStats = useMemo(() => {
    if (!cards) {
      return [
        // First row - Car parking stats
        { title: "Total Parking Slots", count: 0, icon: Car, vehicle: 'four' as const, metric: 'total' as const },
        { title: "Booked Parking", count: 0, icon: CheckCircle, vehicle: 'four' as const, metric: 'booked' as const },
        { title: "Vacant Parking", count: 0, icon: AlertTriangle, vehicle: 'four' as const, metric: 'vacant' as const },
        { title: "Cancelled Booking", count: 0, icon: XCircle, vehicle: 'four' as const, metric: 'cancelled' as const },
        // Second row - Bike parking stats
        { title: "Total Parking Slots", count: 0, icon: Bike, vehicle: 'two' as const, metric: 'total' as const },
        { title: "Booked Parking", count: 0, icon: CheckCircle, vehicle: 'two' as const, metric: 'booked' as const },
        { title: "Vacant Parking", count: 0, icon: AlertTriangle, vehicle: 'two' as const, metric: 'vacant' as const },
        { title: "Cancelled Booking", count: 0, icon: XCircle, vehicle: 'two' as const, metric: 'cancelled' as const }
      ];
    }

    return [
      // First row - Car parking stats
      { title: "Total Parking Slots", count: cards.four_total, icon: Car, vehicle: 'four' as const, metric: 'total' as const },
      { title: "Booked Slots", count: cards.four_booked, icon: CheckCircle, vehicle: 'four' as const, metric: 'booked' as const },
      { title: "Vacant Slots", count: cards.four_available, icon: AlertTriangle, vehicle: 'four' as const, metric: 'vacant' as const },
      { title: "Cancelled Slots", count: cards.four_cancelled, icon: XCircle, vehicle: 'four' as const, metric: 'cancelled' as const },
      // Second row - Bike parking stats
      { title: "Total Parking Slots", count: cards.two_total, icon: Bike, vehicle: 'two' as const, metric: 'total' as const },
      { title: "Booked Slots", count: cards.two_booked, icon: CheckCircle, vehicle: 'two' as const, metric: 'booked' as const },
      { title: "Vacant Slots", count: cards.two_available, icon: AlertTriangle, vehicle: 'two' as const, metric: 'vacant' as const },
      { title: "Cancelled Slots", count: cards.two_cancelled, icon: XCircle, vehicle: 'two' as const, metric: 'cancelled' as const }
    ];
  }, [cards]);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Tabs */}
      <Tabs defaultValue="parking" className="w-full">
        {/* <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="parking"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2}
              className="lucide lucide-car w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            My Bookings
          </TabsTrigger>

          <TabsTrigger
            value="analytics"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2}
              className="lucide lucide-chart-column w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
            >
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg>
            Analytics
          </TabsTrigger>
        </TabsList> */}

        {/* Parking List Tab Content */}
        <TabsContent value="parking" className="mt-6 space-y-6">
          {/* Stats Cards */}
          <SectionLoader loading={cardsLoading} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
            {!cards ? (
              // Show skeleton loading only on initial load when cards are null
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 animate-pulse"
                >
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-gray-400">0</div>
                    <div className="text-sm font-medium text-gray-400">Loading...</div>
                  </div>
                </div>
              ))
            ) : (
              // Show actual card data once loaded
              parkingStats.map((stat, index) => {
                const IconComponent = stat.icon;
                const isClickable = stat.metric === 'booked' || stat.metric === 'cancelled';
                return (
                  <div
                    key={index}
                    className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 ${isClickable ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
                  >
                    <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#C72030]" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-[#1A1A1A]">
                        {stat.count}
                      </div>
                      <div className="text-sm font-medium text-[#1A1A1A]">
                        {stat.title}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </SectionLoader>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left Side Controls */}
            <div className="flex gap-2">
              {/* Placeholder for future actions */}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 w-64"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {/* Search Results Counter */}
                {searchTerm.trim() && (
                  <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                    {bookingData.filter(booking => {
                      const searchLower = searchTerm.toLowerCase().trim();
                      return (
                        booking.id.toString().includes(searchLower) ||
                        booking.status.toLowerCase().includes(searchLower) ||
                        booking.building.toLowerCase().includes(searchLower) ||
                        booking.floor.toLowerCase().includes(searchLower) ||
                        booking.category.toLowerCase().includes(searchLower)
                      );
                    }).length} result{bookingData.filter(booking => {
                      const searchLower = searchTerm.toLowerCase().trim();
                      return (
                        booking.id.toString().includes(searchLower) ||
                        booking.status.toLowerCase().includes(searchLower) ||
                        booking.building.toLowerCase().includes(searchLower) ||
                        booking.floor.toLowerCase().includes(searchLower) ||
                        booking.category.toLowerCase().includes(searchLower)
                      );
                    }).length !== 1 ? 's' : ''} found
                  </div>
                )}
              </div>

              {/* Filter Button */}
              <Button 
                variant="outline"
                onClick={() => setShowFiltersModal(true)}
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 w-10 h-10 p-0"
              >
                <Filter className="w-4 h-4" />
              </Button>

              {/* Column Visibility */}
              <ColumnVisibilityDropdown
                columns={columns}
                onColumnToggle={(columnKey, visible) => {
                  setColumns(prev => 
                    prev.map(col => col.key === columnKey ? { ...col, visible } : col)
                  );
                }}
              />
            </div>
          </div>

          {/* Data Table */}
          <SectionLoader loading={loading && cards !== null} className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {isColumnVisible('sr_no') && <TableHead className="font-semibold">Sr No.</TableHead>}
                  {isColumnVisible('schedule_date') && <TableHead className="font-semibold">Schedule Date</TableHead>}
                  {isColumnVisible('booking_schedule_time') && <TableHead className="font-semibold">Booking Time</TableHead>}
                  {isColumnVisible('booking_schedule_slot_time') && <TableHead className="font-semibold">Booking Slots</TableHead>}
                  {isColumnVisible('category') && <TableHead className="font-semibold">Category</TableHead>}
                  {isColumnVisible('building') && <TableHead className="font-semibold">Building</TableHead>}
                  {isColumnVisible('floor') && <TableHead className="font-semibold">Floor</TableHead>}
                  {isColumnVisible('status') && <TableHead className="font-semibold">Status</TableHead>}
                  {isColumnVisible('checked_in_at') && <TableHead className="font-semibold">Checked In At</TableHead>}
                  {isColumnVisible('checked_out_at') && <TableHead className="font-semibold">Checked Out At</TableHead>}
                  {isColumnVisible('created_on') && <TableHead className="font-semibold">Created On</TableHead>}
                  {isColumnVisible('qr_code') && <TableHead className="font-semibold">QR Code</TableHead>}
                  {isColumnVisible('cancel') && <TableHead className="font-semibold">Cancel</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && !cards ? (
                  <TableRow>
                    <TableCell colSpan={columns.filter(col => col.visible).length} className="text-center py-8 text-gray-500">
                      Loading parking booking data...
                    </TableCell>
                  </TableRow>
                ) : bookingData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.filter(col => col.visible).length} className="text-center py-8 text-gray-500">
                      {error ? error :
                       searchTerm.trim() ? (
                         <div>
                           <p>No bookings found matching "<strong>{searchTerm}</strong>"</p>
                           <p className="text-sm mt-1 text-gray-400">
                             Searched in: ID, Status, Building, Floor, and Category
                           </p>
                         </div>
                       ) : 'No parking booking data available'}
                    </TableCell>
                  </TableRow>
                ) : (
                  bookingData.filter(booking => {
                    if (!searchTerm.trim()) return true;
                    const searchLower = searchTerm.toLowerCase().trim();
                    return (
                      booking.id.toString().includes(searchLower) ||
                      booking.status.toLowerCase().includes(searchLower) ||
                      booking.building.toLowerCase().includes(searchLower) ||
                      booking.floor.toLowerCase().includes(searchLower) ||
                      booking.category.toLowerCase().includes(searchLower)
                    );
                  }).map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      {isColumnVisible('sr_no') && <TableCell className="font-medium">{(apiPagination.current_page - 1) * apiPagination.per_page + index + 1}</TableCell>}
                      {isColumnVisible('schedule_date') && <TableCell>{row.schedule_date}</TableCell>}
                      {isColumnVisible('booking_schedule_time') && <TableCell>{row.booking_schedule_time}</TableCell>}
                      {isColumnVisible('booking_schedule_slot_time') && <TableCell>{row.booking_schedule_slot_time}</TableCell>}
                      {isColumnVisible('category') && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {row.category}
                          </div>
                        </TableCell>
                      )}
                      {isColumnVisible('building') && <TableCell>{row.building}</TableCell>}
                      {isColumnVisible('floor') && <TableCell>{row.floor}</TableCell>}
                      {isColumnVisible('status') && (
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.status.toLowerCase() === 'confirmed' || row.status.toLowerCase() === 'approved'
                              ? 'bg-green-100 text-green-800' 
                              : row.status.toLowerCase() === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                          </span>
                        </TableCell>
                      )}
                      {isColumnVisible('checked_in_at') && <TableCell>{row.checked_in_at || '-'}</TableCell>}
                      {isColumnVisible('checked_out_at') && <TableCell>{row.checked_out_at || '-'}</TableCell>}
                      {isColumnVisible('created_on') && <TableCell>{row.created_on}</TableCell>}
                      {isColumnVisible('qr_code') && (
                        <TableCell>
                          {row.qr_code_url ? (
                            <a href={row.qr_code_url} target="_blank" rel="noopener noreferrer" className="text-[#C72030] hover:underline">
                              View QR
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      )}
                      {isColumnVisible('cancel') && (
                        <TableCell>
                          {row.cancel && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                              onClick={() => handleCancelBooking(row.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </SectionLoader>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                {/* Placeholder for additional info */}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        if (apiPagination.current_page > 1) {
                          handlePageChange(apiPagination.current_page - 1);
                        }
                      }}
                      className={
                        apiPagination.current_page === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {(() => {
                    // Calculate pagination range
                    const maxVisiblePages = 10;
                    let startPage = 1;
                    let endPage = Math.min(totalPages, maxVisiblePages);

                    if (totalPages > maxVisiblePages) {
                      // Calculate start and end pages to center around current page
                      const halfRange = Math.floor(maxVisiblePages / 2);
                      startPage = Math.max(1, apiPagination.current_page - halfRange);
                      endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                      
                      // Adjust start page if we're near the end
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }
                    }

                    const pages = [];
                    
                    // Show first page and ellipsis if needed
                    if (startPage > 1) {
                      pages.push(
                        <PaginationItem key={1}>
                          <PaginationLink
                            onClick={() => handlePageChange(1)}
                            isActive={apiPagination.current_page === 1}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      );
                      
                      if (startPage > 2) {
                        pages.push(
                          <PaginationItem key="ellipsis-start">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                    }

                    // Show visible page range
                    for (let page = startPage; page <= endPage; page++) {
                      // Skip page 1 if we already added it
                      if (page === 1 && startPage > 1) continue;
                      
                      pages.push(
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={apiPagination.current_page === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    // Show ellipsis and last page if needed
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(
                          <PaginationItem key="ellipsis-end">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      
                      pages.push(
                        <PaginationItem key={totalPages}>
                          <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            isActive={apiPagination.current_page === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    return pages;
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        if (apiPagination.current_page < totalPages) {
                          handlePageChange(apiPagination.current_page + 1);
                        }
                      }}
                      className={
                        apiPagination.current_page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <div className="flex justify-end">
            <ParkingAnalyticsSelector
              onSelectionChange={(selected) => setSelectedAnalytics(selected)}
            />
          </div>

          {selectedAnalytics.includes('parking_statistics') && (
            <ParkingStatisticsCard
              data={{
                total_slots: 0,
                occupied: 0,
                vacant: 0,
                checked_in: summary?.checked_in_count || 0,
                checked_out: summary?.checked_out_count || 0,
                utilization: 0,
                two_wheeler: { total: 0, occupied: 0, vacant: 0 },
                four_wheeler: { total: 0, occupied: 0, vacant: 0 },
              }}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedAnalytics.includes('peak_hour_trends') && (
              <ParkingAnalyticsCard
                title="Peak Hour Trends"
                data={{}}
                type="peakHourTrends"
                startDate={analyticsDateRange.startDate}
                endDate={analyticsDateRange.endDate}
              />
            )}
            {selectedAnalytics.includes('booking_patterns') && (
              <ParkingAnalyticsCard
                title="Booking Patterns (2-Year Comparison)"
                data={{}}
                type="bookingPatterns"
              />
            )}
            {selectedAnalytics.includes('occupancy_rate') && (
              <ParkingAnalyticsCard
                title="Occupancy Rate"
                data={{}}
                type="occupancyRate"
                startDate={analyticsDateRange.startDate}
                endDate={analyticsDateRange.endDate}
              />
            )}
            {selectedAnalytics.includes('average_duration') && (
              <ParkingAnalyticsCard
                title="Average Duration"
                data={{}}
                type="averageDuration"
                startDate={analyticsDateRange.startDate}
                endDate={analyticsDateRange.endDate}
              />
            )}
          </div>

          {selectedAnalytics.includes('two_four_occupancy') && (
            <ParkingOccupancyChart
              startDate={analyticsDateRange.startDate}
              endDate={analyticsDateRange.endDate}
            />
          )}

          {selectedAnalytics.includes('floor_wise_occupancy') && (
            <FloorWiseOccupancyChart
              startDate={analyticsDateRange.startDate}
              endDate={analyticsDateRange.endDate}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Filters Dialog */}
      <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Filter Bookings</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <TextField
              select
              label="Status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              sx={fieldStyles}
              SelectProps={{ MenuProps: selectMenuProps }}
              fullWidth
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
            <TextField
              label="Scheduled From"
              type="date"
              value={filters.scheduled_on_from}
              onChange={(e) => handleFilterChange('scheduled_on_from', e.target.value)}
              sx={fieldStyles}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Scheduled To"
              type="date"
              value={filters.scheduled_on_to}
              onChange={(e) => handleFilterChange('scheduled_on_to', e.target.value)}
              sx={fieldStyles}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleClearFilters} className="border-gray-300">
              Clear Filters
            </Button>
            <Button onClick={handleApplyFilters} className="bg-[#C72030] hover:bg-[#A01828] text-white">
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirmation && (
        <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Cancel Booking</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">Are you sure you want to cancel this booking? This action cannot be undone.</p>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowCancelConfirmation(false)}
                className="border-gray-300"
              >
                No, Keep It
              </Button>
              <Button 
                onClick={confirmCancelBooking} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Cancel Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ParkingBookingListEmployee;
