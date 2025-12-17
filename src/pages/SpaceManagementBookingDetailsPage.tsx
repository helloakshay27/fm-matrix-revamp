import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, MapPin, User, ChevronDown, ChevronUp } from "lucide-react";
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

interface BookingDetails {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeePhone: string;
  scheduleDate: string;
  day: string;
  category: string;
  building: string;
  floor: string;
  designation: string;
  department: string;
  slotsAndSeat: string;
  status: string;
  createdOn: string;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}

// API Response Interface
interface SeatBookingApiResponse {
  id: number;
  resource_id: number;
  resource_type: string;
  user_id: number;
  booking_date: string;
  status: string;
  cancelled_by_id: number | null;
  cancelled_at: string | null;
  seat_configuration_id: number;
  user_name: string;
  user_email: string;
  booking_day: string;
  category: string;
  building: string;
  floor: string;
  designation: string;
  department: string;
  slots: string;
  created_at: string;
}

export const SpaceManagementBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    bookingInfo: true,
    employeeInfo: true,
    locationInfo: true,
    attendanceInfo: true,
    activityLog: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Booking data state
  const [booking, setBooking] = useState<BookingDetails>({
    id: "",
    employeeId: "",
    employeeName: "",
    employeeEmail: "",
    employeePhone: "",
    scheduleDate: "",
    day: "",
    category: "",
    building: "",
    floor: "",
    designation: "",
    department: "",
    slotsAndSeat: "",
    status: "",
    createdOn: "",
  });

  // Fetch booking details from API
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get current user ID from localStorage
        const userData = localStorage.getItem('user');
        let currentUserId = null;
        if (userData) {
          try {
            const user = JSON.parse(userData);
            currentUserId = user.id ? user.id.toString() : null;
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
        
        const url = getFullUrl(`/pms/admin/seat_bookings/${id}.json`);
        const options = getAuthenticatedFetchOptions();
        
        // Add query parameter for user_id
        const params = new URLSearchParams();
        if (currentUserId) {
          params.append('q[user_id_eq]', currentUserId);
        }
        
        const fullUrl = `${url}?${params.toString()}`;
        console.log('🔍 Fetching booking details from:', fullUrl);
        
        const response = await fetch(fullUrl, options);
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Response error:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('❌ Non-JSON response:', responseText);
          throw new Error('Response is not JSON');
        }
        
        const responseText = await response.text();
        console.log('📄 Response text:', responseText);
        
        if (!responseText || responseText.trim() === '') {
          console.error('❌ Empty response');
          throw new Error('Empty response from server');
        }
        
        const data: SeatBookingApiResponse = JSON.parse(responseText);
        console.log('📊 Booking details data:', data);
        
        // Transform API data to match UI structure
        setBooking({
          id: data.id.toString(),
          employeeId: data.user_id.toString(),
          employeeName: data.user_name,
          employeeEmail: data.user_email,
          employeePhone: "+91 98765 43210", // Not available in API, using placeholder
          scheduleDate: data.booking_date,
          day: data.booking_day,
          category: data.category,
          building: data.building,
          floor: data.floor,
          designation: data.designation,
          department: data.department,
          slotsAndSeat: data.slots,
          status: data.status,
          createdOn: data.created_at,
          checkInTime: undefined, // Not available in current API response
          checkOutTime: undefined, // Not available in current API response
          notes: undefined // Not available in current API response
        });
        
      } catch (error) {
        console.error('❌ Error fetching booking details:', error);
        toast.error('Failed to load booking details');
        navigate('/employee/space-management/bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'white' }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-gray-600 animate-spin" />
        </div>
      ) : (
      <div className="mb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6B7280' }}>
          <span>Space</span>
          <span>&gt;</span>
          <span 
            className="cursor-pointer"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C72030'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
            onClick={() => navigate('/employee/space-management/bookings')}
          >
            Seat Booking List
          </span>
          <span>&gt;</span>
          <span>Booking Details</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/employee/space-management/bookings')}
              className="hover:bg-gray-100"
              style={{ color: '#1A1A1A' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>
                Booking 
                {/* #{booking.id} */}
              </h1>
              <p className="text-sm" style={{ color: '#6B7280' }}>{booking.employeeName}</p>
            </div>
          </div>
          <Badge 
            className="px-3 py-1 text-sm font-medium" 
            style={{
              backgroundColor: booking.status === 'Cancelled' ? '#FEE2E2' : booking.status === 'Confirmed' ? '#D1FAE5' : '#DBEAFE',
              color: booking.status === 'Cancelled' ? '#991B1B' : booking.status === 'Confirmed' ? '#065F46' : '#1E40AF',
              border: 'none'
            }}
          >
            {booking.status}
          </Badge>
        </div>

        {/* Details Section - No Tabs */}
        <div className="space-y-4">
          {/* Booking Information Section */}
          <Card className="shadow-sm bg-white" style={{ border: '1px solid #E5E7EB' }}>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ backgroundColor: '#f6f4ee', borderBottom: '1px solid #E5E7EB' }}
                onClick={() => toggleSection('bookingInfo')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                    <Calendar className="w-5 h-5" style={{ color: '#C72030' }} />
                    Booking Information
                  </CardTitle>
                  {expandedSections.bookingInfo ? <ChevronUp className="w-5 h-5" style={{ color: '#6B7280' }} /> : <ChevronDown className="w-5 h-5" style={{ color: '#6B7280' }} />}
                </div>
              </CardHeader>
              {expandedSections.bookingInfo && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Booking ID</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Schedule Date</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.scheduleDate}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Day</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.day}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Category</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.category}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Time Slot</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.slotsAndSeat}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Created On</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.createdOn}</p>
                    </div>
                    {booking.notes && (
                      <div className="md:col-span-3">
                        <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Notes</p>
                        <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Employee Information Section */}
            <Card className="shadow-sm bg-white" style={{ border: '1px solid #E5E7EB' }}>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ backgroundColor: '#f6f4ee', borderBottom: '1px solid #E5E7EB' }}
                onClick={() => toggleSection('employeeInfo')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                    <User className="w-5 h-5" style={{ color: '#C72030' }} />
                    Employee Information
                  </CardTitle>
                  {expandedSections.employeeInfo ? <ChevronUp className="w-5 h-5" style={{ color: '#6B7280' }} /> : <ChevronDown className="w-5 h-5" style={{ color: '#6B7280' }} />}
                </div>
              </CardHeader>
              {expandedSections.employeeInfo && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Employee ID</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.employeeId}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Employee Name</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.employeeName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Email</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.employeeEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Phone</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.employeePhone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Designation</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.designation || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Department</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.department || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Location Information Section */}
            <Card className="shadow-sm bg-white" style={{ border: '1px solid #E5E7EB' }}>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ backgroundColor: '#f6f4ee', borderBottom: '1px solid #E5E7EB' }}
                onClick={() => toggleSection('locationInfo')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                    <MapPin className="w-5 h-5" style={{ color: '#C72030' }} />
                    Location Information
                  </CardTitle>
                  {expandedSections.locationInfo ? <ChevronUp className="w-5 h-5" style={{ color: '#6B7280' }} /> : <ChevronDown className="w-5 h-5" style={{ color: '#6B7280' }} />}
                </div>
              </CardHeader>
              {expandedSections.locationInfo && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Building</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.building}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Floor</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.floor}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Seat Details</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.slotsAndSeat}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Attendance Information Section */}
            <Card className="shadow-sm bg-white" style={{ border: '1px solid #E5E7EB' }}>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
                style={{ backgroundColor: '#f6f4ee', borderBottom: '1px solid #E5E7EB' }}
                onClick={() => toggleSection('attendanceInfo')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                    <Clock className="w-5 h-5" style={{ color: '#C72030' }} />
                    Attendance Information
                  </CardTitle>
                  {expandedSections.attendanceInfo ? <ChevronUp className="w-5 h-5" style={{ color: '#6B7280' }} /> : <ChevronDown className="w-5 h-5" style={{ color: '#6B7280' }} />}
                </div>
              </CardHeader>
              {expandedSections.attendanceInfo && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Check-In Time</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.checkInTime || 'Not checked in yet'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Check-Out Time</p>
                      <p className="text-sm" style={{ color: '#1A1A1A' }}>{booking.checkOutTime || 'Not checked out yet'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase mb-1" style={{ color: '#9CA3AF' }}>Status</p>
                      <Badge 
                        className="px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: booking.status === 'Cancelled' ? '#FEE2E2' : booking.status === 'Confirmed' ? '#D1FAE5' : '#DBEAFE',
                          color: booking.status === 'Cancelled' ? '#991B1B' : booking.status === 'Confirmed' ? '#065F46' : '#1E40AF',
                          border: 'none'
                        }}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {/* {booking.status !== 'Cancelled' && (
            <Button
              className="hover:opacity-90 px-6 py-2 rounded"
              style={{
                backgroundColor: '#C72030',
                color: '#FFFFFF',
                border: 'none'
              }}
            >
              Cancel Booking
            </Button>
          )} */}
          <Button
            variant="outline"
            className="px-6 py-2 rounded hover:bg-gray-50 bg-white"
            style={{ 
              borderColor: '#D1D5DB',
              color: '#1A1A1A'
            }}
            onClick={() => navigate('/employee/space-management/bookings')}
          >
            Back to List
          </Button>
        </div>
      </div>
      )}
    </div>
  );
};
