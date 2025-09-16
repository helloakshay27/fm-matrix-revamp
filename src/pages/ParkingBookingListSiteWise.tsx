import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Download, Eye, Search, Grid3x3, X, Upload, MoreHorizontal, Car, Bike, MapPin, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Filter } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

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
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_count: number;
}

interface ParkingBookingApiResponse {
  parking_bookings: ParkingBooking[];
  pagination: PaginationInfo;
}

// Transform API data to match our UI structure
interface ParkingBookingSite {
  id: number;
  employee_name: string;
  schedule_date: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayout();
  const panelRef = useRef<HTMLDivElement>(null);

  // API state
  const [bookings, setBookings] = useState<ParkingBooking[]>([]);
  const [bookingData, setBookingData] = useState<ParkingBookingSite[]>([]);
  const [summary, setSummary] = useState<ParkingBookingSiteSummary | null>(null);
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

  // Transform API data to match UI structure
  const transformApiDataToBookings = (parkingBookings: ParkingBooking[]): ParkingBookingSite[] => {
    return parkingBookings.map((booking, index) => ({
      id: booking.id,
      employee_name: booking.user.full_name,
      schedule_date: booking.booking_date,
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

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    building: '',
    floor: '',
    status: '',
    department: ''
  });

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'id', label: 'ID', visible: true },
    { key: 'employee_name', label: 'Employee Name', visible: true },
    { key: 'schedule_date', label: 'Schedule Date', visible: true },
    { key: 'category', label: 'Category', visible: true },
    { key: 'building', label: 'Building', visible: true },
    { key: 'floor', label: 'Floor', visible: true },
    { key: 'designation', label: 'Designation', visible: true },
    { key: 'department', label: 'Department', visible: true },
    { key: 'slot_parking_no', label: 'Slot & Parking No.', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'checked_in_at', label: 'Checked In At', visible: true },
    { key: 'checked_out_at', label: 'Checked Out At', visible: true },
    { key: 'created_on', label: 'Created On', visible: true },
    { key: 'cancel', label: 'Cancel', visible: true }
  ]);

  // Fetch parking bookings from API
  const fetchParkingBookings = async (page = 1) => {
    try {
      const url = getFullUrl('/pms/admin/parking_bookings.json');
      const options = getAuthenticatedFetchOptions();
      
      console.log('🔍 API Debug Info:');
      console.log('Base URL from config:', API_CONFIG.BASE_URL);
      console.log('Full URL being called:', `${url}?page=${page}`);
      console.log('Auth options:', options);
      
      const response = await fetch(`${url}?page=${page}`, options);
      
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
        
        const response = await fetchParkingBookings();
        
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
  }, [currentPage, itemsPerPage]);

  // Generate parking stats from summary data
  const parkingStats = useMemo(() => {
    if (!summary) {
      return [
        { title: "Total Slots", count: 0, icon: MapPin },
        { title: "Total Bookings", count: 0, icon: MapPin },
        { title: "Confirmed", count: 0, icon: CheckCircle },
        { title: "Cancelled", count: 0, icon: AlertTriangle },
        { title: "Two Wheeler Booked", count: 0, icon: Bike },
        { title: "Two Wheeler Available", count: 0, icon: Bike },
        { title: "Four Wheeler Booked", count: 0, icon: Car },
        { title: "Four Wheeler Available", count: 0, icon: Car },
        { title: "Checked In", count: 0, icon: CheckCircle },
        { title: "Checked Out", count: 0, icon: AlertTriangle }
      ];
    }

    // Calculate slot availability (assuming total slots based on booking data)
    const totalSlots = 100; // This should come from API or configuration
    const twoWheelerTotalSlots = 60; // This should come from API or configuration
    const fourWheelerTotalSlots = 40; // This should come from API or configuration
    
    const twoWheelerAvailable = twoWheelerTotalSlots - summary.two_wheeler_bookings;
    const fourWheelerAvailable = fourWheelerTotalSlots - summary.four_wheeler_bookings;

    return [
      { title: "Total Slots", count: totalSlots, icon: MapPin },
      { title: "Total Bookings", count: summary.total_bookings, icon: MapPin },
      { title: "Confirmed", count: summary.confirmed_bookings, icon: CheckCircle },
      { title: "Cancelled", count: summary.cancelled_bookings, icon: AlertTriangle },
      { title: "Two Wheeler Booked", count: summary.two_wheeler_bookings, icon: Bike },
      { title: "Two Wheeler Available", count: Math.max(0, twoWheelerAvailable), icon: Bike },
      { title: "Four Wheeler Booked", count: summary.four_wheeler_bookings, icon: Car },
      { title: "Four Wheeler Available", count: Math.max(0, fourWheelerAvailable), icon: Car },
      { title: "Checked In", count: summary.checked_in_count, icon: CheckCircle },
      { title: "Checked Out", count: summary.checked_out_count, icon: AlertTriangle }
    ];
  }, [summary]);

  const handleExport = () => {
    setIsBulkUploadOpen(true);
    setShowActionPanel(false);
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      building: '',
      floor: '',
      status: '',
      department: ''
    });
    setCurrentPage(1);
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

  // Filter booking data based on search term and filters (client-side filtering)
  const filteredBookingData = useMemo(() => {
    let filtered = bookingData;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(row => 
        row.employee_name.toLowerCase().includes(searchLower) ||
        row.id.toString().toLowerCase().includes(searchLower) ||
        row.designation.toLowerCase().includes(searchLower) ||
        row.building.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.category) {
      filtered = filtered.filter(row => row.category === filters.category);
    }
    if (filters.building) {
      filtered = filtered.filter(row => row.building === filters.building);
    }
    if (filters.floor) {
      filtered = filtered.filter(row => row.floor === filters.floor);
    }
    if (filters.status) {
      filtered = filtered.filter(row => row.status === filters.status);
    }
    if (filters.department) {
      filtered = filtered.filter(row => row.department === filters.department);
    }

    return filtered;
  }, [searchTerm, bookingData, filters]);

  // Use API pagination - show all filtered data since API handles pagination
  const paginatedData = filteredBookingData;

  // Use API pagination for total pages
  const totalPages = apiPagination.total_pages;
  const currentApiPage = apiPagination.current_page;

  // Handle page change - this will trigger API call
  const handlePageChange = async (page: number) => {
    try {
      setCurrentPage(page);
      setLoading(true);
      
      const response = await fetchParkingBookings(page);
      
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
      console.error('Error changing page:', error);
      toast.error('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Note: For server-side search, you might want to trigger API call here
    // setCurrentPage(1); // Reset to first page when searching
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
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
          </div>

          {/* Filter Button */}
          <Button 
            variant="outline"
            onClick={handleToggleFilters}
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          >
            <Filter className="w-4 h-4" />
          </Button>

          {/* Column Visibility */}
          <ColumnVisibilityDropdown
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />
        </div>
      </div>

      {/* Filters Section */}
      {/* Filters are now in a modal - see below */}

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {/* {isColumnVisible('id') && <TableHead className="font-semibold">ID</TableHead>} */}
              {isColumnVisible('employee_name') && <TableHead className="font-semibold">Employee Name</TableHead>}
              {isColumnVisible('schedule_date') && <TableHead className="font-semibold">Schedule Date</TableHead>}
              {isColumnVisible('category') && <TableHead className="font-semibold">Category</TableHead>}
              {isColumnVisible('building') && <TableHead className="font-semibold">Building</TableHead>}
              {isColumnVisible('floor') && <TableHead className="font-semibold">Floor</TableHead>}
              {isColumnVisible('designation') && <TableHead className="font-semibold">Designation</TableHead>}
              {isColumnVisible('department') && <TableHead className="font-semibold">Department</TableHead>}
              {isColumnVisible('slot_parking_no') && <TableHead className="font-semibold">Slot & Parking No.</TableHead>}
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
                   searchTerm.trim() ? `No bookings found matching "${searchTerm}"` : 'No parking booking data available'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {/* {isColumnVisible('id') && <TableCell className="font-medium">{row.id}</TableCell>} */}
                  {isColumnVisible('employee_name') && <TableCell>{row.employee_name}</TableCell>}
                  {isColumnVisible('schedule_date') && <TableCell>{row.schedule_date}</TableCell>}
                  {isColumnVisible('category') && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {row.category === 'Two Wheeler' ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                        {row.category}
                      </div>
                    </TableCell>
                  )}
                  {isColumnVisible('building') && <TableCell>{row.building}</TableCell>}
                  {isColumnVisible('floor') && <TableCell>{row.floor}</TableCell>}
                  {isColumnVisible('designation') && <TableCell>{row.designation}</TableCell>}
                  {isColumnVisible('department') && <TableCell>{row.department || '-'}</TableCell>}
                  {isColumnVisible('slot_parking_no') && <TableCell>{row.slot_parking_no}</TableCell>}
                  {isColumnVisible('status') && (
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : row.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.status}
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
            <div className="text-sm text-gray-700">
              Showing page {apiPagination.current_page} of {apiPagination.total_pages} 
              ({apiPagination.total_count} total items)
            </div>
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
      <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Parking Bookings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                >
                  <option value="">All Categories</option>
                  {getUniqueValues('category').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
                <select
                  value={filters.building}
                  onChange={(e) => handleFilterChange('building', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                >
                  <option value="">All Buildings</option>
                  {getUniqueValues('building').map(building => (
                    <option key={building} value={building}>{building}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                <select
                  value={filters.floor}
                  onChange={(e) => handleFilterChange('floor', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                >
                  <option value="">All Floors</option>
                  {getUniqueValues('floor').map(floor => (
                    <option key={floor} value={floor}>{floor}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                >
                  <option value="">All Statuses</option>
                  {getUniqueValues('status').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                >
                  <option value="">All Departments</option>
                  {getUniqueValues('department').map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.category || filters.building || filters.floor || filters.status || filters.department) && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Category: {filters.category}
                      <button onClick={() => handleFilterChange('category', '')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.building && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Building: {filters.building}
                      <button onClick={() => handleFilterChange('building', '')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.floor && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Floor: {filters.floor}
                      <button onClick={() => handleFilterChange('floor', '')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.status && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Status: {filters.status}
                      <button onClick={() => handleFilterChange('status', '')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.department && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#C72030] text-white text-xs rounded-full">
                      Department: {filters.department}
                      <button onClick={() => handleFilterChange('department', '')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="border-gray-300"
            >
              Clear All Filters
            </Button>
            <Button
              onClick={() => setShowFiltersModal(false)}
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParkingBookingListSiteWise;
