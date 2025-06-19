
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const SpaceManagementBookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from an API based on the ID
  const bookingDetails = {
    title: "Urbanwrk Meeting Room 100",
    bookingId: "305213",
    bookedBy: "Abdul G",
    scheduleSlot: "04:45 PM to 05:00 PM , 05:00 PM to 05:15 PM , 05:15 PM to 05:30 PM , 05:30 PM to 05:45 PM",
    comment: "-",
    gst: "5.0",
    sgst: "5.0",
    status: "Pending",
    scheduledDate: "7 February 2025",
    bookedOn: "7 February 2025 4:45 PM",
    paymentMethod: "-"
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
          {bookingDetails.title}
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
                <span className="font-medium">: {bookingDetails.bookingId}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Booked by</span>
                <span className="font-medium">: {bookingDetails.bookedBy}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Schedule Slot</span>
                <span className="font-medium">: {bookingDetails.scheduleSlot}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Comment</span>
                <span className="font-medium">: {bookingDetails.comment}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">GST</span>
                <span className="font-medium">: {bookingDetails.gst}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">SGST</span>
                <span className="font-medium">: {bookingDetails.sgst}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-600 w-32">Status</span>
                <span className="font-medium">: {bookingDetails.status}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Scheduled Date</span>
                <span className="font-medium">: {bookingDetails.scheduledDate}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Booked On</span>
                <span className="font-medium text-blue-600">: {bookingDetails.bookedOn}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-32">Payment Method</span>
                <span className="font-medium">: {bookingDetails.paymentMethod}</span>
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
