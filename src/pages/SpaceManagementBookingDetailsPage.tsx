
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const SpaceManagementBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock booking database
  const bookingDatabase = {
    '142179': {
      id: "142179",
      title: "Angular War Meeting Room",
      employeeId: "73974",
      employeeName: "HO Occupant 2",
      employeeEmail: "hooccupant2@locatard.com",
      scheduleDate: "29 December 2023",
      day: "Friday",
      category: "Angular War",
      building: "Jyoti Tower",
      floor: "2nd Floor",
      designation: "",
      department: "",
      slotsAndSeat: "10:00 AM to 08:00 PM - HR 1",
      status: "Cancelled",
      createdOn: "15/02/2023, 5:44 PM",
      comment: "Business meeting for Q4 review",
      gst: "18.0",
      sgst: "9.0",
      paymentMethod: "Credit Card"
    },
    '142150': {
      id: "142150",
      title: "Angular War Conference Room",
      employeeId: "71905",
      employeeName: "Prashant P",
      employeeEmail: "889853791@gmail.com",
      scheduleDate: "29 December 2023",
      day: "Friday",
      category: "Angular War",
      building: "Jyoti Tower",
      floor: "2nd Floor",
      designation: "",
      department: "",
      slotsAndSeat: "10:00 AM to 08:00 PM - S7",
      status: "Cancelled",
      createdOn: "15/02/2023, 5:43 PM",
      comment: "Team standup meeting",
      gst: "18.0",
      sgst: "9.0",
      paymentMethod: "Debit Card"
    },
    '142219': {
      id: "142219",
      title: "Tech Development Room",
      employeeId: "71903",
      employeeName: "Bilal Shaikh",
      employeeEmail: "bilal.shaikh@locatard.com",
      scheduleDate: "29 December 2023",
      day: "Friday",
      category: "Angular War",
      building: "Jyoti Tower",
      floor: "2nd Floor",
      designation: "Sr. Flutter developer",
      department: "Tech",
      slotsAndSeat: "10:00 AM to 08:00 PM - S4",
      status: "Confirmed",
      createdOn: "15/02/2023, 5:44 PM",
      comment: "Sprint planning session",
      gst: "18.0",
      sgst: "9.0",
      paymentMethod: "Online Payment"
    },
    '142094': {
      id: "142094",
      title: "Technology Hub Meeting Room",
      employeeId: "73975",
      employeeName: "HO Occupant 3",
      employeeEmail: "hooccupant3@locatard.com",
      scheduleDate: "29 December 2023",
      day: "Friday",
      category: "Angular War",
      building: "Jyoti Tower",
      floor: "2nd Floor",
      designation: "",
      department: "Technology",
      slotsAndSeat: "10:00 AM to 08:00 PM - Technology",
      status: "Confirmed",
      createdOn: "15/02/2023, 5:44 PM",
      comment: "Technology roadmap discussion",
      gst: "18.0",
      sgst: "9.0",
      paymentMethod: "Cash"
    },
    '305213': {
      id: "305213",
      title: "Urbanwrk Meeting Room 100",
      employeeId: "71902",
      employeeName: "Abdul G",
      employeeEmail: "abdul.g@locatard.com",
      scheduleDate: "7 February 2025",
      day: "Friday",
      category: "Meeting Room",
      building: "Urbanwrk",
      floor: "1st Floor",
      designation: "Project Manager",
      department: "Operations",
      slotsAndSeat: "04:45 PM to 05:00 PM , 05:00 PM to 05:15 PM , 05:15 PM to 05:30 PM , 05:30 PM to 05:45 PM",
      status: "Pending",
      createdOn: "7/02/2025, 4:45 PM",
      comment: "-",
      gst: "5.0",
      sgst: "5.0",
      paymentMethod: "-"
    }
  };

  // Get booking data based on ID from URL
  const booking = bookingDatabase[id as keyof typeof bookingDatabase] || {
    id: id || 'Unknown',
    title: 'Booking Not Found',
    employeeId: 'N/A',
    employeeName: 'Unknown',
    employeeEmail: 'unknown@email.com',
    scheduleDate: 'N/A',
    day: 'N/A',
    category: 'N/A',
    building: 'N/A',
    floor: 'N/A',
    designation: 'N/A',
    department: 'N/A',
    slotsAndSeat: 'N/A',
    status: 'Unknown',
    createdOn: 'N/A',
    comment: 'N/A',
    gst: '0.0',
    sgst: '0.0',
    paymentMethod: 'N/A'
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <span>Bookings</span>
        <span>&gt;</span>
        <span>Facility Booking Details</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">
          {booking.title}
        </h1>
      </div>

      {/* Booking Details Card */}
      <Card className="mb-6">
        <CardHeader className="bg-[#C72030] text-white">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="w-6 h-6 bg-white text-[#C72030] rounded-full flex items-center justify-center text-sm font-bold">
              B
            </span>
            BOOKING DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-600 w-32">Booking ID</span>
                <span className="font-medium">: {booking.id}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Booked by</span>
                <span className="font-medium">: {booking.employeeName}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Employee ID</span>
                <span className="font-medium">: {booking.employeeId}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Email</span>
                <span className="font-medium">: {booking.employeeEmail}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Schedule Slot</span>
                <span className="font-medium">: {booking.slotsAndSeat}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Comment</span>
                <span className="font-medium">: {booking.comment}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">GST</span>
                <span className="font-medium">: {booking.gst}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">SGST</span>
                <span className="font-medium">: {booking.sgst}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-600 w-32">Status</span>
                <span className={`font-medium px-2 py-1 rounded-none text-xs ${
                  booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                  booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>: {booking.status}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Scheduled Date</span>
                <span className="font-medium">: {booking.scheduleDate}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Day</span>
                <span className="font-medium">: {booking.day}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Category</span>
                <span className="font-medium">: {booking.category}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Building</span>
                <span className="font-medium">: {booking.building}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Floor</span>
                <span className="font-medium">: {booking.floor}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Booked On</span>
                <span className="font-medium text-blue-600">: {booking.createdOn}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Payment Method</span>
                <span className="font-medium">: {booking.paymentMethod}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Card */}
      <Card>
        <CardHeader className="bg-[#C72030] text-white">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="w-6 h-6 bg-white text-[#C72030] rounded-full flex items-center justify-center text-sm font-bold">
              L
            </span>
            LOGS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-gray-500 text-center py-8">
            No logs available for this booking.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
