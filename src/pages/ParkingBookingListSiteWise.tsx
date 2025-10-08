import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Car, CheckCircle, AlertTriangle, MapPin, Bike, Plus, Download, Upload, Search, Eye, Filter, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BulkUploadModal } from "@/components/BulkUploadModal";
import { ColumnVisibilityDropdown } from "@/components/ColumnVisibilityDropdown";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

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
      zIndex: 9999, // High z-index to ensure dropdown appears above other elements
    },
  },
  // Prevent focus conflicts with Dialog
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

// Define the data structure based on the actual API response
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
  qr_code: QRCode;
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

// Interface for users API response
interface User {
  id: number;
  full_name: string;
}

interface UsersApiResponse {
  users: User[];
}

// Interface for parking categories API response
interface ParkingCategoryImage {
  id: number;
  relation: string;
  relation_id: number;
  document: string;
}

interface ParkingCategoryResponse {
  id: number;
  name: string;
  resource_id: number;
  resource_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  image_url: string;
  parking_image: ParkingCategoryImage;
}

interface ParkingCategoriesApiResponse {
  parking_categories: ParkingCategoryResponse[];
}

// Interface for API filter parameters
interface ApiFilterParams {
  category?: string;
  user_ids?: string[];
  parking_slot?: string;
  statuses?: string[];
  scheduled_date_range?: string;
  booked_date_range?: string;
}

// Transform API data to match our UI structure
interface ParkingBookingSite {
  id: number;
  employee_name: string;
  employee_email: string;
  schedule_date: string;
  booking_schedule: string;
  category: string;
  building: string;
  floor: string;
  designation: string;
  department: string;
  slot_parking_no: string;
  status: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  created_on: string;
  cancel?: boolean;
}

interface ParkingBookingSiteSummary {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  two_wheeler_bookings: number;
  four_wheeler_bookings: number;
  checked_in_count: number;
  checked_out_count: number;
}

const ParkingBookingListSiteWise = () => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayout();
  const panelRef = useRef<HTMLDivElement>(null);

  // API state
  const [bookings, setBookings] = useState<ParkingBooking[]>([]);
  const [bookingData, setBookingData] = useState<ParkingBookingSite[]>([]);
  const [summary, setSummary] = useState<ParkingBookingSiteSummary | null>(null);
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
  } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [parkingCategories, setParkingCategories] = useState<ParkingCategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiPagination, setApiPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 1
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Card-only filter override (applies only when clicking cards)
  const [cardFilter, setCardFilter] = useState<{
    active: boolean;
    categoryId?: string;
    status?: string;
  } | null>(null);

  // Transform API data to match UI structure
  const transformApiDataToBookings = (parkingBookings: ParkingBooking[]): ParkingBookingSite[] => {
    return parkingBookings.map((booking, index) => ({
      id: booking.id,
      employee_name: booking.user.full_name,
      employee_email: booking.user.email,
      schedule_date: booking.booking_date,
      booking_schedule: booking.booking_schedule,
      booking_schedule_time: booking.booking_schedule_time,
      booking_schedule_slot_time: booking.booking_schedule_slot_time,
      category: booking.parking_configuration.parking_category.name,
      building: booking.parking_configuration.building_name,
      floor: booking.parking_configuration.floor_name,
      designation: booking.user.designation,
      department: booking.user.department_name,
      slot_parking_no: `Slot-${booking.id}`, // Using booking ID as slot number
      status: booking.status,
      checked_in_at: booking.attendance.formatted_punched_in_at,
      checked_out_at: booking.attendance.formatted_punched_out_at,
      created_on: booking.created_at,
      cancel: booking.can_cancel.allowed
    }));
  };

  // Generate summary from API data
  const generateSummaryFromBookings = (parkingBookings: ParkingBooking[]): ParkingBookingSiteSummary => {
    const total_bookings = parkingBookings.length;
    const confirmed_bookings = parkingBookings.filter(b => b.status === 'confirmed').length;
    const cancelled_bookings = parkingBookings.filter(b => b.status === 'cancelled').length;
    const two_wheeler_bookings = parkingBookings.filter(b => 
      b.parking_configuration.parking_category.name.toLowerCase().includes('two') ||
      b.parking_configuration.parking_category.name.toLowerCase().includes('bike')
    ).length;
    const four_wheeler_bookings = parkingBookings.filter(b => 
      b.parking_configuration.parking_category.name.toLowerCase().includes('four') ||
      b.parking_configuration.parking_category.name.toLowerCase().includes('car')
    ).length;
    const checked_in_count = parkingBookings.filter(b => b.attendance.punched_in_at !== null).length;
    const checked_out_count = parkingBookings.filter(b => b.attendance.punched_out_at !== null).length;

    return {
      total_bookings,
      confirmed_bookings,
      cancelled_bookings,
      two_wheeler_bookings,
      four_wheeler_bookings,
      checked_in_count,
      checked_out_count
    };
  };

  // Helper function to convert date from YYYY-MM-DD to DD/MM/YYYY format (zero-padded)
  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear());
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
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
    category: 'all',
    user: 'all',
    parking_slot: '',
    status: 'all',
    // Default Scheduled On to today
    scheduled_on_from: getTodayYMD(),
    scheduled_on_to: getTodayYMD(),
    booked_on_from: '',
    booked_on_to: ''
  });

  // Export date range states
  const [exportDateRange, setExportDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'sr_no', label: 'Sr No.', visible: true },
    // { key: 'id', label: 'ID', visible: true },
    { key: 'employee_name', label: 'Employee Name', visible: true },
    { key: 'employee_email', label: 'Employee Email ID', visible: true },
    { key: 'schedule_date', label: 'Schedule Date', visible: true },
    { key: 'booking_schedule_time', label: 'Booking Time', visible: true },
    { key: 'booking_schedule_slot_time', label: 'Booking Slots', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'building', label: 'Building', visible: true },
    { key: 'floor', label: 'Floor', visible: true },
    { key: 'designation', label: 'Designation', visible: true },
    { key: 'department', label: 'Department', visible: true },
    // { key: 'slot_parking_no', label: 'Slot & Parking No.', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'checked_in_at', label: 'Checked In At', visible: true },
    { key: 'checked_out_at', label: 'Checked Out At', visible: true },
    { key: 'created_on', label: 'Created On', visible: true },
    { key: 'cancel', label: 'Cancel', visible: true }
  ]);

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔍 Debounce Effect Debug:');
      console.log('Original searchTerm:', searchTerm);
      console.log('Setting debouncedSearchTerm to:', searchTerm);
      setDebouncedSearchTerm(searchTerm);
      // Reset to first page when search term changes
      if (searchTerm !== debouncedSearchTerm) {
        setCurrentPage(1);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm]);

  // Fetch parking bookings from API
  const fetchParkingBookings = async (page = 1, searchQuery = '', filterParams: ApiFilterParams = {}) => {
    try {
      const url = getFullUrl('/pms/admin/parking_bookings.json');
      const options = getAuthenticatedFetchOptions();
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      
      // Add search query
      if (searchQuery.trim()) {
        console.log('🔍 Search Query Debug:');
        console.log('Search query value:', searchQuery);
        console.log('Search query trimmed:', searchQuery.trim());
        console.log('Search query type:', typeof searchQuery);
        params.append('q[user_full_name_or_user_email_or_user_designation_cont]', searchQuery.trim());
      }
      
      // Add filter parameters
      // Category filter
      if (filterParams.category && filterParams.category !== 'all') {
        console.log('🔍 Category Filter Debug:');
        console.log('Category filter value:', filterParams.category);
        console.log('Category filter type:', typeof filterParams.category);
        // Try with _id_eq suffix since we're passing the category ID
        params.append('q[parking_configuration_parking_category_id_eq]', filterParams.category);
      }
      
      if (filterParams.user_ids && filterParams.user_ids.length > 0) {
        filterParams.user_ids.forEach(userId => {
          params.append('q[user_id_in][]', userId);
        });
      }
      
      if (filterParams.parking_slot) {
        console.log('🔍 Parking Slot Filter Debug:');
        console.log('Parking slot filter value:', filterParams.parking_slot);
        console.log('Parking slot filter type:', typeof filterParams.parking_slot);
        params.append('q[parking_number_name_cont]', filterParams.parking_slot);
      }
      
      // Status filter
      if (filterParams.statuses && filterParams.statuses.length > 0) {
        filterParams.statuses.forEach(status => {
          params.append('q[status_in][]', status);
        });
      }
      
      if (filterParams.scheduled_date_range) {
        // Cards filter needs plain date_range; keep q[date_range1] for current date filter
        params.append('date_range', filterParams.scheduled_date_range);
        params.append('q[date_range1]', filterParams.scheduled_date_range);
      }
      
      if (filterParams.booked_date_range) {
        // Preserve booked range under q[date_range] to avoid clashing with current date filter
        params.append('q[date_range]', filterParams.booked_date_range);
      }
      
      const fullUrl = `${url}?${params.toString()}`;
      
      console.log('🔍 API Debug Info:');
      console.log('Base URL from config:', API_CONFIG.BASE_URL);
      console.log('Full URL being called:', fullUrl);
      console.log('Query Parameters:', params.toString());
      console.log('Filter Params passed:', filterParams);
      console.log('Auth options:', options);
      
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ParkingBookingApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching parking bookings:', error);
      throw error;
    }
  };

  // Fetch users from API for filter dropdown
  const fetchUsers = async () => {
    try {
      const url = getFullUrl('/pms/users/get_escalate_to_users.json');
      const options = getAuthenticatedFetchOptions();
      
      console.log('🔍 Fetching users from:', url);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: UsersApiResponse = await response.json();
      return data.users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  // Fetch parking categories from API for filter dropdown
  const fetchParkingCategories = async () => {
    try {
      const url = getFullUrl('/pms/admin/parking_categories.json');
      const options = getAuthenticatedFetchOptions();
      
      console.log('🔍 Fetching parking categories from:', url);
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ParkingCategoriesApiResponse = await response.json();
      return data.parking_categories;
    } catch (error) {
      console.error('Error fetching parking categories:', error);
      throw error;
    }
  };

  // Load booking data from API
  useEffect(() => {
    const loadBookingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Additional debugging for URL construction
        console.log('🔍 Detailed URL Debug:');
        console.log('Raw Base URL from API_CONFIG:', API_CONFIG.BASE_URL);
        console.log('Raw endpoint:', '/pms/admin/parking_bookings.json');
        
        // Convert UI filters to API filter parameters
        const buildApiFilterParamsBase = (): ApiFilterParams => {
          const apiParams: ApiFilterParams = {};
          
          // Only apply dialog category if not overridden by card filter
          if (filters.category !== 'all' && !cardFilter?.active) {
            console.log('🔍 Building API Filter - Category:');
            console.log('UI Filter category value:', filters.category);
            console.log('UI Filter category type:', typeof filters.category);
            apiParams.category = filters.category;
          }
          // Do not apply card overrides to base (cards should stay original)
          
          if (filters.user !== 'all') {
            apiParams.user_ids = [filters.user];
          }
          
          if (filters.parking_slot.trim()) {
            console.log('🔍 Building API Filter - Parking Slot:');
            console.log('UI Filter parking_slot value:', filters.parking_slot);
            console.log('UI Filter parking_slot trimmed:', filters.parking_slot.trim());
            apiParams.parking_slot = filters.parking_slot.trim();
          }
          
          // Only dialog status in base
          if (filters.status !== 'all') {
            // Map UI status to API status
            const statusMap: { [key: string]: string } = {
              'Confirmed': 'confirmed',
              'Cancelled': 'cancelled',
              'confirmed': 'confirmed',
              'cancelled': 'cancelled'
            };
            const apiStatus = statusMap[filters.status] || filters.status;
            apiParams.statuses = [apiStatus];
          }
          
          if (filters.scheduled_on_from.trim() || filters.scheduled_on_to.trim()) {
            // Build date range for scheduled_on with proper date formatting
            const fromDate = filters.scheduled_on_from.trim() ? formatDateForAPI(filters.scheduled_on_from.trim()) : formatDateForAPI(filters.scheduled_on_to.trim());
            const toDate = filters.scheduled_on_to.trim() ? formatDateForAPI(filters.scheduled_on_to.trim()) : formatDateForAPI(filters.scheduled_on_from.trim());
            apiParams.scheduled_date_range = `${fromDate} - ${toDate}`;
            console.log('🔍 Formatted Scheduled Date Range:', apiParams.scheduled_date_range);
          }
          
          if (filters.booked_on_from.trim() || filters.booked_on_to.trim()) {
            // Build date range for booked_on with proper date formatting
            const fromDate = filters.booked_on_from.trim() ? formatDateForAPI(filters.booked_on_from.trim()) : formatDateForAPI(filters.booked_on_to.trim());
            const toDate = filters.booked_on_to.trim() ? formatDateForAPI(filters.booked_on_to.trim()) : formatDateForAPI(filters.booked_on_from.trim());
            apiParams.booked_date_range = `${fromDate} - ${toDate}`;
            console.log('🔍 Formatted Booked Date Range:', apiParams.booked_date_range);
          }
          
          return apiParams;
        };

        const buildApiFilterParamsEffective = (): ApiFilterParams => {
          const base = buildApiFilterParamsBase();
          const effective: ApiFilterParams = { ...base };
          if (cardFilter?.active && cardFilter.categoryId) {
            effective.category = cardFilter.categoryId;
          }
          if (cardFilter?.active && cardFilter.status) {
            effective.statuses = [cardFilter.status];
          }
          return effective;
        };
        
        // Fetch both parking bookings and users in parallel
        const [cardsResponse, response, usersData, categoriesData] = await Promise.all([
          fetchParkingBookings(1, debouncedSearchTerm, buildApiFilterParamsBase()),
          fetchParkingBookings(currentPage, debouncedSearchTerm, buildApiFilterParamsEffective()),
          fetchUsers(),
          fetchParkingCategories()
        ]);
        
        // Set users data
        setUsers(usersData);
        
        // Set parking categories data
        setParkingCategories(categoriesData);
        
        // Cards stay original (base filters only)
        setCards(cardsResponse.cards);
        
        // Set raw API data
        setBookings(response.parking_bookings);
        
        // Transform for UI
        const transformedBookings = transformApiDataToBookings(response.parking_bookings);
        setBookingData(transformedBookings);
        
        // Generate summary
        const generatedSummary = generateSummaryFromBookings(response.parking_bookings);
        setSummary(generatedSummary);
        
        // Set pagination
        setApiPagination({
          current_page: response.pagination.current_page,
          total_count: response.pagination.total_count,
          total_pages: response.pagination.total_pages
        });
        
      } catch (error) {
        console.error('Error loading booking data:', error);
        setError('Failed to load parking booking data');
        toast.error('Failed to load parking booking data');
      } finally {
        setLoading(false);
      }
    };

    loadBookingData();
  }, [currentPage, itemsPerPage, debouncedSearchTerm, filters, cardFilter]);

  // Generate parking stats from cards data
  const parkingStats = useMemo(() => {
    if (!cards) {
      return [
        // First row - Car parking stats
        { title: "Total Parking", count: 0, icon: Car, vehicle: 'four' as const, metric: 'total' as const },
        { title: "Total Booked Parking", count: 0, icon: CheckCircle, vehicle: 'four' as const, metric: 'booked' as const },
        { title: "Total Vacant Parking", count: 0, icon: AlertTriangle, vehicle: 'four' as const, metric: 'vacant' as const },
        // Second row - Bike parking stats
        { title: "Total Parking", count: 0, icon: Bike, vehicle: 'two' as const, metric: 'total' as const },
        { title: "Total Booked Parking", count: 0, icon: CheckCircle, vehicle: 'two' as const, metric: 'booked' as const },
        { title: "Total Vacant Parking", count: 0, icon: AlertTriangle, vehicle: 'two' as const, metric: 'vacant' as const }
      ];
    }

    return [
      // First row - Car parking stats
      { title: "Total Parking", count: cards.four_total, icon: Car, vehicle: 'four' as const, metric: 'total' as const },
      { title: "Total Booked Parking", count: cards.four_booked, icon: CheckCircle, vehicle: 'four' as const, metric: 'booked' as const },
      { title: "Total Vacant Parking", count: cards.four_available, icon: AlertTriangle, vehicle: 'four' as const, metric: 'vacant' as const },
      // Second row - Bike parking stats
      { title: "Total Parking", count: cards.two_total, icon: Bike, vehicle: 'two' as const, metric: 'total' as const },
      { title: "Total Booked Parking", count: cards.two_booked, icon: CheckCircle, vehicle: 'two' as const, metric: 'booked' as const },
      { title: "Total Vacant Parking", count: cards.two_available, icon: AlertTriangle, vehicle: 'two' as const, metric: 'vacant' as const }
    ];
  }, [cards]);

  // Resolve category ids for two/four wheeler from loaded categories
  const twoWheelerCategoryId = useMemo(() => {
    const match = parkingCategories.find(cat => {
      const lower = cat.name.toLowerCase();
      return lower.includes('two') || lower.includes('2') || lower.includes('bike');
    });
    return match ? match.id.toString() : null;
  }, [parkingCategories]);

  const fourWheelerCategoryId = useMemo(() => {
    const match = parkingCategories.find(cat => {
      const lower = cat.name.toLowerCase();
      return lower.includes('four') || lower.includes('4') || lower.includes('car');
    });
    return match ? match.id.toString() : null;
  }, [parkingCategories]);

  const getCategoryIdForVehicle = (vehicle: 'two' | 'four'): string | null => {
    return vehicle === 'two' ? twoWheelerCategoryId : fourWheelerCategoryId;
  };

  // Handle card clicks to filter table data
  const handleStatCardClick = (vehicle: 'two' | 'four', metric: 'total' | 'booked' | 'vacant') => {
    // Only apply filter for Total Booked Parking cards as requested
    if (metric !== 'booked') return;
    const categoryId = getCategoryIdForVehicle(vehicle) || undefined;
    setCardFilter({ active: true, categoryId, status: 'confirmed' });
    setCurrentPage(1);
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
    setShowActionPanel(false);
  };

  const handleExportWithDateRange = async () => {
    try {
      if (!exportDateRange.startDate || !exportDateRange.endDate) {
        toast.error('Please select both start and end dates');
        return;
      }

      if (new Date(exportDateRange.startDate) > new Date(exportDateRange.endDate)) {
        toast.error('Start date cannot be after end date');
        return;
      }

      toast.info('Exporting parking bookings...');
      
      // Use the dedicated export API endpoint
      const exportUrl = getFullUrl('/parking_booking/export.xlsx');
      const options = getAuthenticatedFetchOptions();
      
      // Build query parameters for the export API
      const params = new URLSearchParams();
      params.append('start_date', exportDateRange.startDate);
      params.append('end_date', exportDateRange.endDate);
      
      const fullExportUrl = `${exportUrl}?${params.toString()}`;
      
      console.log('🔍 Export API Debug Info:');
      console.log('Export URL:', fullExportUrl);
      console.log('Start Date:', exportDateRange.startDate);
      console.log('End Date:', exportDateRange.endDate);
      
      const response = await fetch(fullExportUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if the response is actually an Excel file
      const contentType = response.headers.get('Content-Type');
      console.log('Response Content-Type:', contentType);
      
      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const link = document.createElement('a');
      const downloadUrl = URL.createObjectURL(blob);
      link.setAttribute('href', downloadUrl);
      
      // Set filename with date range
      const filename = `parking_bookings_${exportDateRange.startDate}_to_${exportDateRange.endDate}.xlsx`;
      link.setAttribute('download', filename);
      
      // Trigger download
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(downloadUrl);
      
      toast.success('Parking bookings exported successfully!');
      setIsExportModalOpen(false);
      
      // Reset date range
      setExportDateRange({
        startDate: '',
        endDate: ''
      });
      
    } catch (error) {
      console.error('Error exporting parking bookings:', error);
      toast.error('Failed to export parking bookings. Please try again.');
    }
  };

  const handleCancelExport = () => {
    setIsExportModalOpen(false);
    setExportDateRange({
      startDate: '',
      endDate: ''
    });
  };

  const handleFileImport = async (file: File) => {
    try {
      toast.info('Importing parking bookings...');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const url = getFullUrl('/pms/admin/parking_bookings/import');
      const options = getAuthenticatedFetchOptions();
      
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Site-wise parking bookings imported successfully:', result);
      
      toast.success('Site-wise parking bookings imported successfully!');
      
      // Refresh the data
      const refreshedData = await fetchParkingBookings();
      
      // Set raw API data
      setBookings(refreshedData.parking_bookings);
      
      // Set cards data from API response
      setCards(refreshedData.cards);
      
      // Transform for UI
      const transformedBookings = transformApiDataToBookings(refreshedData.parking_bookings);
      setBookingData(transformedBookings);
      
      // Generate summary
      const generatedSummary = generateSummaryFromBookings(refreshedData.parking_bookings);
      setSummary(generatedSummary);
      
    } catch (error) {
      console.error('❌ Error importing site-wise parking bookings:', error);
      toast.error('Failed to import parking bookings. Please try again.');
      throw error;
    }
  };

  const handleActionClick = () => {
    setShowActionPanel(!showActionPanel);
  };

  const handleClearSelection = () => {
    setShowActionPanel(false);
  };

  const handleToggleFilters = () => {
    setShowFiltersModal(!showFiltersModal);
  };

  const handleCancelBooking = async (bookingId: number) => {
    // Show confirmation dialog
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking #${bookingId}? This action cannot be undone.`
    );
    
    if (!confirmCancel) {
      return;
    }

    try {
      toast.info(`Cancelling booking ${bookingId}...`);
      
      const url = getFullUrl(`/pms/admin/parking_bookings/${bookingId}`);
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
      
      const result = await response.json();
      console.log('✅ Booking cancelled successfully:', result);
      
      toast.success(`Booking ${bookingId} cancelled successfully!`);
      
      // Update the local state to reflect the cancellation
      setBookingData(prevData => 
        prevData.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled', cancel: false }
            : booking
        )
      );
      
      // Update summary counts
      if (summary) {
        setSummary(prev => prev ? {
          ...prev,
          confirmed_bookings: prev.confirmed_bookings - 1,
          cancelled_bookings: prev.cancelled_bookings + 1
        } : null);
      }
      
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      toast.error('Failed to cancel booking. Please try again.');
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowActionPanel(false);
      }
    };
    
    if (showActionPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActionPanel]);

  // Client-side search filtering for immediate feedback
  // Filter data based on search term across multiple fields
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return bookingData;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    console.log('🔍 Client-side Search Debug:');
    console.log('Search term:', searchTerm);
    console.log('Search term lowercased:', searchLower);
    console.log('Total bookings to search:', bookingData.length);

    const filtered = bookingData.filter(booking => {
      const searchableFields = [
        booking.employee_name,
        booking.employee_email,
        booking.designation,
        booking.department,
        booking.category,
        booking.building,
        booking.floor,
        booking.status,
        booking.slot_parking_no,
        booking.schedule_date,
        booking.booking_schedule,
        booking.id.toString()
      ].filter(Boolean); // Remove null/undefined values

      const matches = searchableFields.some(field => 
        field.toLowerCase().includes(searchLower)
      );

      if (matches) {
        console.log('🔍 Match found:', {
          id: booking.id,
          employee_name: booking.employee_name,
          designation: booking.designation,
          department: booking.department
        });
      }

      return matches;
    });

    console.log('🔍 Filtered results count:', filtered.length);
    return filtered;
  }, [bookingData, searchTerm]);

  // Use filtered data for display
  const paginatedData = filteredData;

  // Use API pagination for total pages
  const totalPages = apiPagination.total_pages;
  const currentApiPage = apiPagination.current_page;

  // Handle page change - this will trigger API call
  const handlePageChange = async (page: number) => {
    try {
      setCurrentPage(page);
      setLoading(true);
      
      // Convert UI filters to API filter parameters
      const buildApiFilterParams = (): ApiFilterParams => {
        const apiParams: ApiFilterParams = {};
        
        if (filters.category !== 'all') {
          console.log('🔍 Building API Filter (Page Change) - Category:');
          console.log('UI Filter category value:', filters.category);
          console.log('UI Filter category type:', typeof filters.category);
          apiParams.category = filters.category;
        }
        
        if (filters.user !== 'all') {
          apiParams.user_ids = [filters.user];
        }
        
        if (filters.parking_slot.trim()) {
          console.log('🔍 Building API Filter (Page Change) - Parking Slot:');
          console.log('UI Filter parking_slot value:', filters.parking_slot);
          console.log('UI Filter parking_slot trimmed:', filters.parking_slot.trim());
          apiParams.parking_slot = filters.parking_slot.trim();
        }
        
        if (filters.status !== 'all') {
          // Map UI status to API status
          const statusMap: { [key: string]: string } = {
            'Confirmed': 'confirmed',
            'Cancelled': 'cancelled',
            'confirmed': 'confirmed',
            'cancelled': 'cancelled'
          };
          const apiStatus = statusMap[filters.status] || filters.status;
          apiParams.statuses = [apiStatus];
        }
        
        if (filters.scheduled_on_from.trim() || filters.scheduled_on_to.trim()) {
          // Build date range for scheduled_on with proper date formatting
          const fromDate = filters.scheduled_on_from.trim() ? formatDateForAPI(filters.scheduled_on_from.trim()) : formatDateForAPI(filters.scheduled_on_to.trim());
          const toDate = filters.scheduled_on_to.trim() ? formatDateForAPI(filters.scheduled_on_to.trim()) : formatDateForAPI(filters.scheduled_on_from.trim());
          apiParams.scheduled_date_range = `${fromDate} - ${toDate}`;
          console.log('🔍 Formatted Scheduled Date Range (Page Change):', apiParams.scheduled_date_range);
        }
        
        if (filters.booked_on_from.trim() || filters.booked_on_to.trim()) {
          // Build date range for booked_on with proper date formatting
          const fromDate = filters.booked_on_from.trim() ? formatDateForAPI(filters.booked_on_from.trim()) : formatDateForAPI(filters.booked_on_to.trim());
          const toDate = filters.booked_on_to.trim() ? formatDateForAPI(filters.booked_on_to.trim()) : formatDateForAPI(filters.booked_on_from.trim());
          apiParams.booked_date_range = `${fromDate} - ${toDate}`;
          console.log('🔍 Formatted Booked Date Range (Page Change):', apiParams.booked_date_range);
        }
        
        return apiParams;
      };
      
      const response = await fetchParkingBookings(page, debouncedSearchTerm, buildApiFilterParams());
      
      // Set raw API data
      setBookings(response.parking_bookings);
      
      // Set cards data from API response
      setCards(response.cards);
      
      // Transform for UI
      const transformedBookings = transformApiDataToBookings(response.parking_bookings);
      setBookingData(transformedBookings);
      
      // Generate summary
      const generatedSummary = generateSummaryFromBookings(response.parking_bookings);
      setSummary(generatedSummary);
      
      // Set pagination
      setApiPagination({
        current_page: response.pagination.current_page,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages
      });
      
    } catch (error) {
      console.error('Error changing page:', error);
      toast.error('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to capitalize first letter of status
  const capitalizeStatus = (status: string): string => {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Handle search
  const handleSearch = (term: string) => {
    console.log('🔍 Search Handler Debug:');
    console.log('Search term received:', term);
    console.log('Search term type:', typeof term);
    console.log('Search term length:', term.length);
    setSearchTerm(term);
    // Note: The useEffect will trigger API call automatically due to dependency changes
    // Page reset happens in the debounce effect to avoid unnecessary resets
  };

  // Column visibility functions
  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
  };

  const isColumnVisible = (columnKey: string) => {
    return columns.find(col => col.key === columnKey)?.visible ?? true;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
    // Note: The useEffect will trigger API call automatically due to dependency changes
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      user: 'all',
      parking_slot: '',
      status: 'all',
      scheduled_on_from: '',
      scheduled_on_to: '',
      booked_on_from: '',
      booked_on_to: ''
    });
    // Also clear any card overrides
    setCardFilter(null);
    setCurrentPage(1);
    // Note: The useEffect will trigger API call automatically due to dependency changes
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key: keyof ParkingBookingSite) => {
    return Array.from(new Set(bookingData.map(item => {
      const value = item[key];
      return typeof value === 'string' ? value : '';
    }).filter(Boolean)));
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PARKING BOOKING LIST</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 animate-pulse bg-[#f6f4ee]"
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-300 rounded"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate text-gray-400">0</div>
                <div className="text-xs sm:text-sm font-medium leading-tight text-gray-400">Loading...</div>
              </div>
            </div>
          ))
        ) : (
          parkingStats.map((stat, index) => (
            <div
              key={index}
              className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee] hover:bg-[#e6e2da] transition-all duration-200"
              onClick={() => handleStatCardClick(stat.vehicle, stat.metric)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStatCardClick(stat.vehicle, stat.metric); }}
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54]">
                <stat.icon
                  className="w-4 h-4 sm:w-6 sm:h-6"
                  style={{ color: '#C72030' }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                  {stat.count}
                </div>
                <div className="text-xs sm:text-sm font-medium leading-tight text-muted-foreground">
                  {stat.title}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side Controls */}
        <div className="flex gap-2">
          {/* <Button 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none border-none shadow-none" 
            onClick={handleActionClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Action
          </Button> */}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
            {/* Search Results Counter */}
            {searchTerm.trim() && (
              <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
                {filteredData.length} result{filteredData.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>

          {/* Filter Button */}
          <Button 
            variant="outline"
            onClick={handleToggleFilters}
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 w-10 h-10 p-0"
          >
            <Filter className="w-4 h-4" />
          </Button>

          {/* Export Button */}
         

          {/* Column Visibility */}
          <ColumnVisibilityDropdown
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />

           <Button 
            variant="outline"
            onClick={handleExport}
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10 w-10 h-10 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      {/* Filters are now in a modal - see below */}

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {isColumnVisible('sr_no') && <TableHead className="font-semibold">Sr No.</TableHead>}
              {/* {isColumnVisible('id') && <TableHead className="font-semibold">ID</TableHead>} */}
              {isColumnVisible('employee_name') && <TableHead className="font-semibold">Employee Name</TableHead>}
              {isColumnVisible('employee_email') && <TableHead className="font-semibold">Employee Email ID</TableHead>}
              {isColumnVisible('schedule_date') && <TableHead className="font-semibold">Schedule Date</TableHead>}
              {isColumnVisible('booking_schedule_time') && <TableHead className="font-semibold">Booking Time</TableHead>}
              {isColumnVisible('booking_schedule_slot_time') && <TableHead className="font-semibold">Booking Slots</TableHead>}
              {isColumnVisible('category') && <TableHead className="font-semibold">Category</TableHead>}
              {isColumnVisible('building') && <TableHead className="font-semibold">Building</TableHead>}
              {isColumnVisible('floor') && <TableHead className="font-semibold">Floor</TableHead>}
              {isColumnVisible('designation') && <TableHead className="font-semibold">Designation</TableHead>}
              {isColumnVisible('department') && <TableHead className="font-semibold">Department</TableHead>}
              {/* {isColumnVisible('slot_parking_no') && <TableHead className="font-semibold">Slot & Parking No.</TableHead>} */}
              {isColumnVisible('status') && <TableHead className="font-semibold">Status</TableHead>}
              {isColumnVisible('checked_in_at') && <TableHead className="font-semibold">Checked In At</TableHead>}
              {isColumnVisible('checked_out_at') && <TableHead className="font-semibold">Checked Out At</TableHead>}
              {isColumnVisible('created_on') && <TableHead className="font-semibold">Created On</TableHead>}
              {isColumnVisible('cancel') && <TableHead className="font-semibold">Cancel</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.filter(col => col.visible).length} className="text-center py-8 text-gray-500">
                  Loading parking booking data...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.filter(col => col.visible).length} className="text-center py-8 text-gray-500">
                  {error ? error :
                   searchTerm.trim() ? (
                     <div>
                       <p>No bookings found matching "<strong>{searchTerm}</strong>"</p>
                       <p className="text-sm mt-1 text-gray-400">
                         Searched in: Employee Name, Designation, Department, Category, Building, Floor, Status, and Slot Number
                       </p>
                     </div>
                   ) : 'No parking booking data available'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {isColumnVisible('sr_no') && <TableCell className="font-medium">{(currentApiPage - 1) * itemsPerPage + index + 1}</TableCell>}
                  {/* {isColumnVisible('id') && <TableCell className="font-medium">{row.id}</TableCell>} */}
                  {isColumnVisible('employee_name') && (
                    <TableCell>{row.employee_name}</TableCell>
                  )}
                  {isColumnVisible('employee_email') && (
                    <TableCell>{row.employee_email}</TableCell>
                  )}
                  {isColumnVisible('schedule_date') && <TableCell>{row.schedule_date}</TableCell>}
                  {isColumnVisible('booking_schedule_time') && <TableCell>{row.booking_schedule_time}</TableCell>}
                  {isColumnVisible('booking_schedule_slot_time') && <TableCell>{row.booking_schedule_slot_time}</TableCell>}
                  {isColumnVisible('category') && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {/* {row.category === 'Two Wheeler' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />} */}
                        {row.category}
                      </div>
                    </TableCell>
                  )}
                  {isColumnVisible('building') && <TableCell>{row.building}</TableCell>}
                  {isColumnVisible('floor') && <TableCell>{row.floor}</TableCell>}
                  {isColumnVisible('designation') && <TableCell>{row.designation}</TableCell>}
                  {isColumnVisible('department') && <TableCell>{row.department || '-'}</TableCell>}
                  {/* {isColumnVisible('slot_parking_no') && <TableCell>{row.slot_parking_no}</TableCell>} */}
                  {isColumnVisible('status') && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status.toLowerCase() === 'confirmed' || row.status.toLowerCase() === 'approved'
                          ? 'bg-green-100 text-green-800' 
                          : row.status.toLowerCase() === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {capitalizeStatus(row.status)}
                      </span>
                    </TableCell>
                  )}
                  {isColumnVisible('checked_in_at') && <TableCell>{row.checked_in_at || '-'}</TableCell>}
                  {isColumnVisible('checked_out_at') && <TableCell>{row.checked_out_at || '-'}</TableCell>}
                  {isColumnVisible('created_on') && <TableCell>{row.created_on}</TableCell>}
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
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            {/* <div className="text-sm text-gray-700">
              Showing page {apiPagination.current_page} of {apiPagination.total_pages} 
              ({apiPagination.total_count} total items)
            </div> */}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentApiPage > 1) {
                      handlePageChange(currentApiPage - 1);
                    }
                  }}
                  className={
                    currentApiPage === 1
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(totalPages, 10) },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentApiPage === page}
                  >
                    {page}
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
                  onClick={() => {
                    if (currentApiPage < totalPages) {
                      handlePageChange(currentApiPage + 1);
                    }
                  }}
                  className={
                    currentApiPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)}
        title="Import Site-wise Parking Bookings"
        description="Upload a file to import site-wise parking booking data"
        onImport={handleFileImport}
      />

      {/* Export Modal */}
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
            <DialogTitle className="text-xl font-bold text-[hsl(var(--analytics-text))]">Export Parking Bookings</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleCancelExport}>
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">Start Date *</Label>
              <Input
                type="date"
                value={exportDateRange.startDate}
                onChange={(e) => setExportDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="h-10 rounded-md border border-[hsl(var(--analytics-border))] bg-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[hsl(var(--analytics-text))]">End Date *</Label>
              <Input
                type="date"
                value={exportDateRange.endDate}
                onChange={(e) => setExportDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="h-10 rounded-md border border-[hsl(var(--analytics-border))] bg-white"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleCancelExport}
              className="text-[hsl(var(--analytics-text))] border-[hsl(var(--analytics-border))]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExportWithDateRange}
              className="bg-[hsl(var(--analytics-primary))] hover:bg-[hsl(var(--analytics-primary))]/90 text-white"
              disabled={!exportDateRange.startDate || !exportDateRange.endDate}
            >
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Panel */}
      {showActionPanel && (
        <div
          className={`fixed z-50 flex items-end justify-center pb-8 sm:pb-[16rem] pointer-events-none transition-all duration-300 ${
            isSidebarCollapsed ? 'left-16' : 'left-64'
          } right-0 bottom-0`}
        >
          <div className="flex max-w-full pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg mx-4 overflow-hidden">
            <div className="hidden sm:flex w-8 bg-[#C4B89D54] items-center justify-center text-red-600 font-semibold text-sm">
            </div>

            <div ref={panelRef} className="p-4 sm:p-6 w-full sm:w-auto">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 sm:gap-12">
                <button
                  onClick={handleExport}
                  className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">Import</span>
                </button>

                <div className="w-px h-8 bg-black opacity-20 mx-2 sm:mx-4" />

                <div
                  onClick={handleClearSelection}
                  className="flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 w-16 sm:w-auto"
                >
                  <X className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">Close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal} modal={false}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white" aria-describedby="parking-filter-dialog-description">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFiltersModal(false)}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
            <div id="parking-filter-dialog-description" className="sr-only">
              Filter parking bookings by category, user, parking slot, status, and date ranges
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Filter Options Section */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">Filter Options</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Category */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="category-label" shrink>Category</InputLabel>
                  <MuiSelect
                    labelId="category-label"
                    label="Category"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="all"><em>All Categories</em></MenuItem>
                    {parkingCategories.map(category => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                {/* User */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="user-label" shrink>User</InputLabel>
                  <MuiSelect
                    labelId="user-label"
                    label="User"
                    value={filters.user}
                    onChange={(e) => handleFilterChange('user', e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="all"><em>All Users</em></MenuItem>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id.toString()}>
                        {user.full_name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                {/* Parking Slot */}
                <TextField
                  label="Parking Slot"
                  placeholder="Enter parking slot"
                  value={filters.parking_slot}
                  onChange={(e) => handleFilterChange('parking_slot', e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="status-label" shrink>Status</InputLabel>
                  <MuiSelect
                    labelId="status-label"
                    label="Status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="all"><em>All Statuses</em></MenuItem>
                    {getUniqueValues('status').map(status => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-4">
                {/* Status */}
              </div>
            </div>

            {/* Date Filters Section */}
            <div>
              <h3 className="text-sm font-medium text-[#C72030] mb-4">Date Filters</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Scheduled On */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">Scheduled On</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <TextField
                      label="From Date"
                      type="date"
                      value={filters.scheduled_on_from}
                      onChange={(e) => handleFilterChange('scheduled_on_from', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ max: "9999-12-31" }}
                      InputProps={{ sx: fieldStyles }}
                    />
                    <TextField
                      label="To Date"
                      type="date"
                      value={filters.scheduled_on_to}
                      onChange={(e) => handleFilterChange('scheduled_on_to', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ 
                        min: filters.scheduled_on_from || undefined,
                        max: "9999-12-31"
                      }}
                      InputProps={{ sx: fieldStyles }}
                    />
                  </div>
                </div>

                {/* Booked On */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">Booked On</Label>
                  <div className="grid grid-cols-1 gap-3">
                    <TextField
                      label="From Date"
                      type="date"
                      value={filters.booked_on_from}
                      onChange={(e) => handleFilterChange('booked_on_from', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ max: "9999-12-31" }}
                      InputProps={{ sx: fieldStyles }}
                    />
                    <TextField
                      label="To Date"
                      type="date"
                      value={filters.booked_on_to}
                      onChange={(e) => handleFilterChange('booked_on_to', e.target.value)}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ 
                        min: filters.booked_on_from || undefined,
                        max: "9999-12-31"
                      }}
                      InputProps={{ sx: fieldStyles }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.category !== 'all' || filters.user !== 'all' || filters.parking_slot.trim() || filters.status !== 'all' || filters.scheduled_on_from.trim() || filters.scheduled_on_to.trim() || filters.booked_on_from.trim() || filters.booked_on_to.trim()) && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.category !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Category: {parkingCategories.find(cat => cat.id.toString() === filters.category)?.name || filters.category}
                      <button onClick={() => handleFilterChange('category', 'all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.user !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      User: {users.find(u => u.id.toString() === filters.user)?.full_name || filters.user}
                      <button onClick={() => handleFilterChange('user', 'all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.parking_slot.trim() && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Parking Slot: {filters.parking_slot}
                      <button onClick={() => handleFilterChange('parking_slot', '')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.status !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Status: {filters.status}
                      <button onClick={() => handleFilterChange('status', 'all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.scheduled_on_from.trim() || filters.scheduled_on_to.trim()) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Scheduled On: {filters.scheduled_on_from && filters.scheduled_on_to ? `${filters.scheduled_on_from} to ${filters.scheduled_on_to}` : filters.scheduled_on_from || filters.scheduled_on_to}
                      <button onClick={() => {
                        handleFilterChange('scheduled_on_from', '');
                        handleFilterChange('scheduled_on_to', '');
                      }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {(filters.booked_on_from.trim() || filters.booked_on_to.trim()) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Booked On: {filters.booked_on_from && filters.booked_on_to ? `${filters.booked_on_from} to ${filters.booked_on_to}` : filters.booked_on_from || filters.booked_on_to}
                      <button onClick={() => {
                        handleFilterChange('booked_on_from', '');
                        handleFilterChange('booked_on_to', '');
                      }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button 
                variant="secondary" 
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 h-11"
              >
                Apply
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                className="flex-1 h-11"
              >
                Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParkingBookingListSiteWise;
