import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Filter, Eye } from "lucide-react";
import { BookingSetupFilterModal } from "@/components/BookingSetupFilterModal";
import { apiClient } from "@/utils/apiClient";
import { toast } from "sonner";
export const BookingSetupDashboard = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bookingSetupData, setBookingSetupData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleFilterApply = (filters: any) => {
    console.log('Applied booking setup filters:', filters);
  };

  // Format dhm object to string like "0D • 0H • 4M"
  const formatDHM = (dhm: { d: number; h: number; m: number } | null) => {
    if (!dhm) return "";
    return `${dhm.d}D • ${dhm.h}H • ${dhm.m}M`;
  };

  // Format date string to "22/11/2022 12:36 PM" format
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(',', '');
    } catch {
      return dateString;
    }
  };

  // Fetch booking setup data from API
  const fetchBookingSetupData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/pms/admin/facility_setups.json');
      
      if (response.data && response.data.facility_setups) {
        const formattedData = response.data.facility_setups.map((item: any) => ({
          id: item.id.toString(),
          name: item.fac_name || "",
          type: item.fac_type || "",
          department: item.department_name || "",
          bookBy: item.book_by || "",
          bookBefore: formatDHM(item.bb_dhm),
          advanceBooking: formatDHM(item.ab_dhm),
          createdOn: formatDate(item.create_at),
          createdBy: item.create_by_user || "",
          status: item.active || false
        }));
        setBookingSetupData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching booking setup data:', error);
      toast.error('Failed to fetch booking setup data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingSetupData();
  }, []);
  const handleAddBooking = () => {
    navigate('/settings/vas/booking/setup/add');
  };
  const handleStatusToggle = (id: string) => {
    setBookingSetupData(prevData => prevData.map(booking => booking.id === id ? {
      ...booking,
      status: !booking.status
    } : booking));
  };

  const handleViewDetails = (id: string) => {
    navigate(`/vas/booking/setup/details/${id}`);
  };
  return <div className="p-6 bg-gray-50 min-h-screen">
      <div className="rounded-lg shadow-sm p-1 bg-transparent">

        <div className="flex items-center gap-2 mb-6">
          <Button onClick={handleAddBooking} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Action
          </Button>
          <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                <TableHead className="font-semibold text-gray-700">ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Department</TableHead>
                <TableHead className="font-semibold text-gray-700">Book by</TableHead>
                <TableHead className="font-semibold text-gray-700">Book before</TableHead>
                <TableHead className="font-semibold text-gray-700">Advance Booking</TableHead>
                <TableHead className="font-semibold text-gray-700">Created On</TableHead>
                <TableHead className="font-semibold text-gray-700">Created by</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Loading booking data...
                  </TableCell>
                </TableRow>
              ) : bookingSetupData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No booking data found
                  </TableCell>
                </TableRow>
              ) : (
                bookingSetupData.map((booking, index) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewDetails(booking.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-black font-medium">{booking.id}</TableCell>
                    <TableCell className="text-black">{booking.name}</TableCell>
                    <TableCell>{booking.type}</TableCell>
                    <TableCell>{booking.department}</TableCell>
                    <TableCell>{booking.bookBy}</TableCell>
                    <TableCell>{booking.bookBefore}</TableCell>
                    <TableCell>{booking.advanceBooking}</TableCell>
                    <TableCell>{booking.createdOn}</TableCell>
                    <TableCell>{booking.createdBy}</TableCell>
                    <TableCell>
                      <Switch checked={booking.status} onCheckedChange={() => handleStatusToggle(booking.id)} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Filter Modal */}
        <BookingSetupFilterModal open={isFilterOpen} onOpenChange={setIsFilterOpen} onApply={handleFilterApply} />
      </div>
    </div>;
};