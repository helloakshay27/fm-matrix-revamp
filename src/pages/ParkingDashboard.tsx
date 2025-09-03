
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Download, Eye, Search, Grid3x3, X, Upload, MoreHorizontal } from "lucide-react";
import { BulkUploadModal } from "@/components/BulkUploadModal";
import { ColumnVisibilityDropdown } from "@/components/ColumnVisibilityDropdown";
import { useNavigate } from "react-router-dom";
import { useLayout } from '@/contexts/LayoutContext';
import { toast } from 'sonner';
import { fetchParkingBookings, ParkingBookingClient, ParkingBookingSummary } from '@/services/parkingConfigurationsAPI';

const ParkingDashboard = () => {
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionPanel, setShowActionPanel] = useState(false);
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useLayout();
  const panelRef = useRef<HTMLDivElement>(null);

  // API state
  const [parkingData, setParkingData] = useState<ParkingBookingClient[]>([]);
  const [summary, setSummary] = useState<ParkingBookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'action', label: 'Action', visible: true },
    { key: 'clientName', label: 'Client Name', visible: true },
    { key: 'twoWheeler', label: 'No. of 2 Wheeler', visible: true },
    { key: 'fourWheeler', label: 'No. of 4 Wheeler', visible: true },
    { key: 'freeParking', label: 'Free Parking', visible: true },
    { key: 'paidParking', label: 'Paid Parking', visible: true },
    { key: 'availableSlots', label: 'Available Parking Slots', visible: true }
  ]);

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
    navigate(`/vas/parking/details/${encodeURIComponent(clientId.toString())}`);
  };

  // Generate parking stats from summary data
  const parkingStats = useMemo(() => {
    if (!summary) {
      return [
        { title: "Total Slots", count: 0, color: "bg-blue-500" },
        { title: "Vacant Two Wheeler", count: 0, color: "bg-green-500" },
        { title: "Vacant Four Wheeler", count: 0, color: "bg-green-500" },
        { title: "Alloted Slots", count: 0, color: "bg-red-500" },
        { title: "Vacant Slots", count: 0, color: "bg-purple-500" },
        { title: "Two Wheeler Allotted", count: 0, color: "bg-orange-500" },
        { title: "Four Wheeler Allotted", count: 0, color: "bg-orange-500" }
      ];
    }

    return [
      { title: "Total Slots", count: summary.total_slots, color: "bg-blue-500" },
      { title: "Vacant Two Wheeler", count: summary.vacant_two_wheeler, color: "bg-green-500" },
      { title: "Vacant Four Wheeler", count: summary.vacant_four_wheeler, color: "bg-green-500" },
      { title: "Alloted Slots", count: summary.alloted_slots, color: "bg-red-500" },
      { title: "Vacant Slots", count: summary.vacant_slots, color: "bg-purple-500" },
      { title: "Two Wheeler Allotted", count: summary.two_wheeler_allotted, color: "bg-orange-500" },
      { title: "Four Wheeler Allotted", count: summary.four_wheeler_allotted, color: "bg-orange-500" }
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

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PARKING BOOKING LIST</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {loading ? (
          Array.from({ length: 7 }).map((_, index) => (
            <Card
              key={index}
              className="flex items-center justify-between gap-4 px-4 py-3 bg-[#F2F0EB] shadow-[0px_2px_18px_rgba(45,45,45,0.1)] rounded-xl md:h-[132px] animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="text-sm text-gray-400 text-right leading-tight">Loading...</div>
            </Card>
          ))
        ) : (
          parkingStats.map((stat, index) => (
            <Card
              key={index}
              className="flex items-center justify-between gap-4 px-4 py-3 bg-[#F2F0EB] shadow-[0px_2px_18px_rgba(45,45,45,0.1)] rounded-xl md:h-[132px]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#D92818]">{stat.count}</span>
              </div>
              <div className="text-sm text-gray-600 text-right leading-tight">{stat.title}</div>
            </Card>
          ))
        )}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Action Button */}
        <div className="flex gap-2">
          <Button 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded-none border-none shadow-none" 
            onClick={handleActionClick}
          >
             <Plus className="w-4 h-4 mr-2" />
           
            Action
          </Button>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Column Visibility */}
          <ColumnVisibilityDropdown
            columns={columns}
            onColumnToggle={handleColumnToggle}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {isColumnVisible('action') && <TableHead className="font-semibold">Action</TableHead>}
              {isColumnVisible('clientName') && <TableHead className="font-semibold">Client Name</TableHead>}
              {isColumnVisible('twoWheeler') && <TableHead className="font-semibold text-center">No. of 2 Wheeler</TableHead>}
              {isColumnVisible('fourWheeler') && <TableHead className="font-semibold text-center">No. of 4 Wheeler</TableHead>}
              {isColumnVisible('freeParking') && <TableHead className="font-semibold text-center">Free Parking</TableHead>}
              {isColumnVisible('paidParking') && <TableHead className="font-semibold text-center">Paid Parking</TableHead>}
              {isColumnVisible('availableSlots') && <TableHead className="font-semibold text-center">Available Parking Slots</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParkingData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.filter(col => col.visible).length} className="text-center py-8 text-gray-500">
                  {loading ? 'Loading parking data...' : 
                   error ? error :
                   searchTerm.trim() ? `No clients found matching "${searchTerm}"` : 'No parking data available'}
                </TableCell>
              </TableRow>
            ) : (
              filteredParkingData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-50">
                  {isColumnVisible('action') && (
                    <TableCell>
                      <button 
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
                        onClick={() => handleViewDetails(row.id)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </TableCell>
                  )}
                  {isColumnVisible('clientName') && <TableCell className="font-medium">{row.name}</TableCell>}
                  {isColumnVisible('twoWheeler') && <TableCell className="text-center">{row.two_wheeler_count}</TableCell>}
                  {isColumnVisible('fourWheeler') && <TableCell className="text-center">{row.four_wheeler_count}</TableCell>}
                  {isColumnVisible('freeParking') && <TableCell className="text-center">{row.free_parking}</TableCell>}
                  {isColumnVisible('paidParking') && <TableCell className="text-center">{row.paid_parking}</TableCell>}
                  {isColumnVisible('availableSlots') && <TableCell className="text-center">{row.available_parking_slots}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
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
                <button
                  onClick={handleAddBooking}
                  className="flex flex-col items-center justify-center cursor-pointer text-[#374151] hover:text-black w-16 sm:w-auto"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-sm font-medium text-center">Add Booking</span>
                </button>

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
