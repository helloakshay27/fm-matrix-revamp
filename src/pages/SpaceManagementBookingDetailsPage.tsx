import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, MapPin, User, Building, Mail, Phone, Briefcase, ChevronDown, ChevronUp, MessageSquare, FileText, History } from "lucide-react";

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

export const SpaceManagementBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

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

  // Static booking data - in real app, fetch from API
  const [booking, setBooking] = useState<BookingDetails>({
    id: "142179",
    employeeId: "73974",
    employeeName: "HO Occupant 2",
    employeeEmail: "hooccupant2@locatard.com",
    employeePhone: "+91 98765 43210",
    scheduleDate: "29 December 2023",
    day: "Friday",
    category: "Angular War",
    building: "Jyoti Tower",
    floor: "2nd Floor",
    designation: "Senior Developer",
    department: "Technology",
    slotsAndSeat: "10:00 AM to 08:00 PM - HR 1",
    status: "Confirmed",
    createdOn: "15/02/2023, 5:44 PM",
    checkInTime: "10:15 AM",
    checkOutTime: "07:45 PM",
    notes: "Window seat preferred"
  });

  // Activity log data
  const activityLogs = [
    {
      id: 1,
      action: "Booking Created",
      performedBy: "HO Occupant 2",
      timestamp: "15/02/2023, 5:44 PM",
      details: "Booking created for 29 December 2023"
    },
    {
      id: 2,
      action: "Booking Confirmed",
      performedBy: "System",
      timestamp: "15/02/2023, 5:45 PM",
      details: "Booking automatically confirmed"
    },
    {
      id: 3,
      action: "Check-In",
      performedBy: "HO Occupant 2",
      timestamp: "29/12/2023, 10:15 AM",
      details: "Employee checked in"
    },
    {
      id: 4,
      action: "Check-Out",
      performedBy: "HO Occupant 2",
      timestamp: "29/12/2023, 07:45 PM",
      details: "Employee checked out"
    }
  ];

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
                Booking #{booking.id}
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white p-1 rounded-lg mb-6" style={{ border: '1px solid #E5E7EB' }}>
            <TabsTrigger 
              value="details" 
              className="px-6 py-2 rounded transition-all"
              style={{
                backgroundColor: activeTab === 'details' ? '#C72030' : 'transparent',
                color: activeTab === 'details' ? '#FFFFFF' : '#6B7280',
                fontWeight: activeTab === 'details' ? '500' : '400'
              }}
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="px-6 py-2 rounded transition-all"
              style={{
                backgroundColor: activeTab === 'activity' ? '#C72030' : 'transparent',
                color: activeTab === 'activity' ? '#FFFFFF' : '#6B7280',
                fontWeight: activeTab === 'activity' ? '500' : '400'
              }}
            >
              Activity Log
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
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
                      <p className="text-sm" style={{ color: '#2563EB' }}>{booking.employeeEmail}</p>
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
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card className="shadow-sm bg-white" style={{ border: '1px solid #E5E7EB' }}>
              <CardHeader style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <CardTitle className="text-base font-semibold flex items-center gap-2" style={{ color: '#1A1A1A' }}>
                  <History className="w-5 h-5" style={{ color: '#C72030' }} />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activityLogs.map((log, index) => (
                    <div key={log.id} className="flex gap-4 relative">
                      {/* Timeline line */}
                      {index !== activityLogs.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-0 w-0.5" style={{ backgroundColor: '#E5E7EB' }}></div>
                      )}
                      
                      {/* Timeline dot */}
                      <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
                          <History className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      {/* Activity content */}
                      <div className="flex-1 pb-4">
                        <div className="rounded-lg p-4" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{log.action}</h4>
                            <span className="text-xs" style={{ color: '#6B7280' }}>{log.timestamp}</span>
                          </div>
                          <p className="text-sm mb-1" style={{ color: '#6B7280' }}>{log.details}</p>
                          <p className="text-xs" style={{ color: '#9CA3AF' }}>By: {log.performedBy}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          {booking.status !== 'Cancelled' && (
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
          )}
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
    </div>
  );
};
