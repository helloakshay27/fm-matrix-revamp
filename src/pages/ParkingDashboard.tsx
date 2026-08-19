
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Download, Eye, Grid3x3, X, Upload, MoreHorizontal, Car, Bike, MapPin, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
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
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { useNavigate,useLocation } from "react-router-dom";
import { toast } from 'sonner';
import { fetchParkingBookings, ParkingBookingClient, ParkingBookingSummary } from '@/services/parkingConfigurationsAPI';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
const ParkingDashboard = () => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();

  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);

  // API state
  const [parkingData, setParkingData] = useState<ParkingBookingClient[]>([]);
  const [summary, setSummary] = useState<ParkingBookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
 const [currentPage, setCurrentPage] = useState(() => {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('page')) || 1;
});
  const [itemsPerPage] = useState(10);

  // Table column config
  const columns = [
    { key: 'action', label: 'Action', sortable: false },
    { key: 'clientName', label: 'Client Name', sortable: true },
    { key: 'twoWheeler', label: 'No. of 2 Wheeler', sortable: true },
    { key: 'fourWheeler', label: 'No. of 4 Wheeler', sortable: true },
    { key: 'freeParking', label: 'Free Parking', sortable: true },
    { key: 'paidParking', label: 'Paid Parking', sortable: true },
    { key: 'availableSlots', label: 'Available Parking Slots', sortable: true }
  ];
  
  useEffect(() => {
  navigate(`${location.pathname}?page=${currentPage}`, {
    replace: true,
  });
}, [currentPage]);


  // Fetch parking bookings data on component mount
  useEffect(() => {
    const loadParkingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchParkingBookings();
        setParkingData(response.clients);
        setSummary(response.summary);
      } catch (error) {
        console.error('Error loading parking data:', error);
        setError('Failed to load parking data');
        toast.error('Failed to load parking data');
      } finally {
        setLoading(false);
      }
    };

    loadParkingData();
  }, []);

  const handleViewDetails = (clientId: number) => {
  navigate(
    `/vas/parking/details/${encodeURIComponent(clientId.toString())}?page=${currentPage}`
  );
};

  // Generate parking stats from summary data
  const parkingStats = useMemo(() => {
    if (!summary) {
      return [
        { title: "Total Slots", count: 0, icon: MapPin },
        { title: "Vacant Two Wheeler", count: 0, icon: Bike },
        { title: "Vacant Four Wheeler", count: 0, icon: Car },
        { title: "Alloted Slots", count: 0, icon: CheckCircle },
        { title: "Vacant Slots", count: 0, icon: AlertTriangle },
        { title: "Two Wheeler Allotted", count: 0, icon: Bike },
        { title: "Four Wheeler Allotted", count: 0, icon: Car }
      ];
    }

    return [
      { title: "Total Slots", count: summary.total_slots, icon: MapPin },
      { title: "Vacant Two Wheeler", count: summary.vacant_two_wheeler, icon: Bike },
      { title: "Vacant Four Wheeler", count: summary.vacant_four_wheeler, icon: Car },
      { title: "Alloted Slots", count: summary.alloted_slots, icon: CheckCircle },
      { title: "Vacant Slots", count: summary.vacant_slots, icon: AlertTriangle },
      { title: "Two Wheeler Allotted", count: summary.two_wheeler_allotted, icon: Bike },
      { title: "Four Wheeler Allotted", count: summary.four_wheeler_allotted, icon: Car }
    ];
  }, [summary]);

  const handleViewBookings = () => {
    navigate('/vas/parking/bookings');
    setShowActionPanel(false);
  };

  const handleExport = () => {
    setIsBulkUploadOpen(true);
    setShowActionPanel(false);
  };

  const handleFileImport = async (file: File) => {
    try {
      // Show loading toast
      toast.info('Importing parking bookings...');
      
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Construct the API URL
      const url = getFullUrl('/pms/manage/parking_bookings/import.json');
      const options = getAuthenticatedFetchOptions();
      
      // Set up the request with FormData
      const requestOptions = {
        ...options,
        method: 'POST',
        body: formData,
        // Remove Content-Type header to let browser set it with boundary for FormData
        headers: {
          ...options.headers,
        }
      };
      
      // Remove Content-Type to let browser handle it for FormData
      delete requestOptions.headers['Content-Type'];
      
      console.log('🚀 Calling parking bookings import API:', url);
      
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Import API Error Response:', errorText);
        throw new Error(`Failed to import parking bookings: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Parking bookings imported successfully:', data);
      
      // Show success toast
      toast.success('Parking bookings imported successfully!');
      
      // Refresh the parking data
      const refreshedData = await fetchParkingBookings();
      setParkingData(refreshedData.clients);
      setSummary(refreshedData.summary);
      
    } catch (error) {
      console.error('❌ Error importing parking bookings:', error);
      toast.error('Failed to import parking bookings. Please try again.');
      throw error; // Re-throw to let the modal handle the error state
    }
  };

  const handleAddBooking = () => {
    navigate('/vas/parking/create');
    setShowActionPanel(false);
  };

  const handleActionClick = () => {
    setShowActionPanel(!showActionPanel);
  };

  const handleClearSelection = () => {
    setShowActionPanel(false);
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

  // Filter parking data based on search term
  const filteredParkingData = useMemo(() => {
    if (!searchTerm.trim()) return parkingData;
    
    const searchLower = searchTerm.toLowerCase();
    return parkingData.filter(row => 
      row.name.toLowerCase().includes(searchLower) ||
      row.id.toString().toLowerCase().includes(searchLower)
    );
  }, [searchTerm, parkingData]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredParkingData.slice(startIndex, endIndex);
  }, [filteredParkingData, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredParkingData.length / itemsPerPage);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Render cell content per column
  const renderCell = (item: ParkingBookingClient, columnKey: string) => {
    if (columnKey === 'action') {
      return (
        shouldShow("Parking", "show") && (
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(item.id);
            }}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        )
      );
    }
    if (columnKey === 'clientName') return item.name;
    if (columnKey === 'twoWheeler') return item.two_wheeler_count;
    if (columnKey === 'fourWheeler') return item.four_wheeler_count;
    if (columnKey === 'freeParking') return item.free_parking;
    if (columnKey === 'paidParking') return item.paid_parking;
    if (columnKey === 'availableSlots') return item.available_parking_slots;
    return null;
  };

  const renderActionButton = () => (
    shouldShow("Parking", "create") && (
      <Button
        className="fm-button-fix fm-button-brand px-4 py-2"
        variant="ghost"
        onClick={handleActionClick}
      >
        <Plus className="w-4 h-4 mr-2" />
        Action
      </Button>
    )
  );

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PARKING BOOKING LIST</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 7 }).map((_, index) => (
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
          parkingStats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-[#C72030]" />
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
          ))
        )}
      </div>

      {/* Data Table */}
      <EnhancedTable
        data={paginatedData}
        columns={columns}
        renderCell={renderCell}
        storageKey="parking-bookings-table"
        emptyMessage={
          error ? error :
          searchTerm.trim() ? `No clients found matching "${searchTerm}"` : 'No parking data available'
        }
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        disableClientSearch={true}
        searchPlaceholder="Search clients..."
        leftActions={renderActionButton()}
        loading={loading}
        loadingMessage="Loading..."
        className="transition-all duration-500 ease-in-out"
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 || loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={loading || currentPage === 1}
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(totalPages, 10) },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page} className="cursor-pointer">
                  <PaginationLink
                    onClick={() => !loading && setCurrentPage(page)}
                    isActive={currentPage === page}
                    aria-disabled={loading}
                    className={loading ? 'pointer-events-none opacity-50' : ''}
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
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages || loading
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  aria-disabled={loading || currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* <div className="text-center mt-2 text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} ({filteredParkingData.length} total clients)
          </div> */}
        </div>
      )}

      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)}
        title="Import Parking Bookings"
        description="Upload a file to import parking booking data"
        onImport={handleFileImport}
      />

      {/* Action Panel */}
      {showActionPanel && (
        <div
          ref={panelRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-lg z-50 flex h-[105px]"
        >
          {/* Beige left strip */}
          <div className="w-[44px] bg-[#C4B59A] rounded-l-lg flex flex-col items-center justify-center" />

          {/* Main content */}
          <div className="flex items-center justify-between gap-4 px-6 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#1a1a1a]">Action</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Import */}
              <Button
                onClick={handleExport}
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
              >
                <Upload className="w-6 h-6 text-black" />
                <span className="text-xs text-gray-600">Import</span>
              </Button>

              {/* View Bookings */}
              <Button
                onClick={handleViewBookings}
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-50 transition-colors duration-200"
              >
                <Eye className="w-6 h-6 text-black" />
                <span className="text-xs text-gray-600">View Bookings</span>
              </Button>
            </div>
          </div>

          {/* Close strip */}
          <div className="w-[44px] flex items-center justify-center border-l border-gray-200">
            <button
              onClick={handleClearSelection}
              className="w-full h-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingDashboard;
