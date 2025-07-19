import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch } from '@/store/hooks';
import { FacilityBookingDetails, fetchBookingDetails } from '@/store/slices/facilityBookingsSlice';

export const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [bookings, setBookings] = useState<FacilityBookingDetails | null>(null);

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await dispatch(fetchBookingDetails({ baseUrl, token, id })).unwrap();
        setBookings(response);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    }

    fetchDetails();
  }, [])

  const handleBack = () => {
    navigate('/vas/booking/list');
  };

  return <div className="p-6 min-h-screen bg-transparent">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <span>Bookings</span>
      <span>&gt;</span>
      <span>Facility Booking Details</span>
    </div>

    {/* Header */}
    {
      bookings &&
      <>
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={handleBack} variant="ghost" size="sm" className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            {bookings.facility_name}
          </h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[#C72030]">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                  <span className="font-medium">: {bookings.id}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Booked by</span>
                  <span className="font-medium">: {bookings.booked_by_name}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Schedule Slot</span>
                  <span className="font-medium">: {bookings.show_schedule_24_hour}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Comment</span>
                  <span className="font-medium">: {bookings.comment}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">GST</span>
                  <span className="font-medium">: {bookings.gst}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">SGST</span>
                  <span className="font-medium">: {bookings.sgst}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <span className="text-gray-600 w-32">Status</span>
                  <span className={`font-medium px-2 py-1 rounded-none text-xs ${bookings.current_status === 'Cancelled' ? 'bg-red-100 text-red-800' : bookings.current_status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>: {bookings.current_status}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Scheduled Date</span>
                  <span className="font-medium">: {bookings.startdate.split(' ')[0]}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Booked On</span>
                  <span className="font-medium">: {bookings.created_at.split(' ')[0]}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-32">Payment Method</span>
                  <span className="font-medium">: {bookings.payment_method}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    }
    {/* Logs Card */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-[#C72030]">
          <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm font-bold">
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
  </div>;
};