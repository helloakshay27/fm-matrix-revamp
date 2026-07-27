
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, X, Upload, Car, Bike, MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import { BulkUploadModal } from "@/components/BulkUploadModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useNavigate,useLocation } from "react-router-dom";
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';
import { fetchParkingBookings, ParkingBookingClient, ParkingBookingSummary } from '@/services/parkingConfigurationsAPI';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";

const tableColumns: ColumnConfig[] = [
  { key: 'name', label: 'Client Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'two_wheeler_count', label: 'No. of 2 Wheeler', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'four_wheeler_count', label: 'No. of 4 Wheeler', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'free_parking', label: 'Free Parking', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'paid_parking', label: 'Paid Parking', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'available_parking_slots', label: 'Available Parking Slots', sortable: true, hideable: true, draggable: true, defaultVisible: true },
];

const ParkingDashboard = () => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();

  const location = useLocation();
  const { isSidebarCollapsed } = useLayout();
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

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const renderCell = (row: ParkingBookingClient, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return <span className="font-medium">{row.name}</span>;
      case 'two_wheeler_count':
        return row.two_wheeler_count;
      case 'four_wheeler_count':
        return row.four_wheeler_count;
      case 'free_parking':
        return row.free_parking;
      case 'paid_parking':
        return row.paid_parking;
      case 'available_parking_slots':
        return row.available_parking_slots;
      default:
        return row[columnKey as keyof ParkingBookingClient] ?? '--';
    }
  };

  const renderActions = (row: ParkingBookingClient) =>
    shouldShow("Parking", "show") ? (
      <button
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
        onClick={() => handleViewDetails(row.id)}
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
    ) : null;

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PARKING BOOKING LIST</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 7 }).map((_, index) => (
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
                  style={{ color: '#DA7756' }}
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

      <EnhancedTable
        data={filteredParkingData}
        columns={tableColumns}
        renderCell={renderCell}
        renderActions={renderActions}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        disableClientSearch={true}
        storageKey="parking-allocation-table"
        emptyMessage={
          error
            ? error
            : searchTerm.trim()
              ? `No clients found matching "${searchTerm}"`
              : 'No parking data available'
        }
        searchPlaceholder="Search clients..."
        hideTableExport={true}
        loading={loading}
        pagination={true}
        pageSize={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        leftActions={
          shouldShow("Parking", "create") ? (
            <Button
              className="fm-button-fix fm-button-brand px-4 py-2"
              variant="ghost"
              onClick={handleActionClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              Action
            </Button>
          ) : undefined
        }
      />

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
          className={`fixed z-50 flex items-end justify-center pb-8 sm:pb-[16rem] pointer-events-none transition-all duration-300 ${
            isSidebarCollapsed ? 'left-16' : 'left-64'
          } right-0 bottom-0`}
        >
          {/* Main panel + right bar container */}
          <div className="flex max-w-full pointer-events-auto bg-white border border-gray-200 rounded-lg shadow-lg mx-4 overflow-hidden">
            {/* Right vertical bar */}
            <div className="hidden sm:flex w-8 bg-[#C4B89D54] items-center justify-center text-red-600 font-semibold text-sm">
            </div>

            {/* Main content */}
            <div ref={panelRef} className="p-4 sm:p-6 w-full sm:w-auto">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-6 sm:gap-12">
                {/* Add Booking */}
                {/* <button
                  onClick={handleAddBooking}
                  className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">Add Booking</span>
                </button> */}

                {/* Import */}
                <button
                  onClick={handleExport}
                  className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">Import</span>
                </button>

                {/* View Bookings */}
                <button
                  onClick={handleViewBookings}
                  className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                >
                  <Eye className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">View Bookings</span>
                </button>

                {/* Vertical divider */}
                <div className="w-px h-8 bg-black opacity-20 mx-2 sm:mx-4" />

                {/* Close icon */}
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
    </div>
  );
};

export default ParkingDashboard;
