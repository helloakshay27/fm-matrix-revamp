
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Calendar, Clock, Users } from 'lucide-react';

export const CRMEventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample event data - in a real app, this would be fetched based on the ID
  const eventData = {
    id: 1,
    title: 'Test Event',
    venue: 'Demo Venue',
    description: 'Demo',
    createdBy: 'Godrej Living',
    startDate: '08/04/2024',
    startTime: '11:00 AM',
    endDate: '09/04/2024',
    endTime: '12:00 PM',
    eventType: 'General',
    status: 'Published',
    expired: false,
    attendeeCount: 0,
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=400&fit=crop'
  };

  const handleDisable = () => {
    console.log('Disable event clicked');
    // Implement disable functionality
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/crm/events')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Button>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex">
          {/* Left side - Image */}
          <div className="w-1/2">
            <img
              src={eventData.image}
              alt={eventData.title}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Right side - Event details */}
          <div className="w-1/2 p-8">
            {/* Title and action buttons */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{eventData.title}</h1>
                <p className="text-gray-600 mb-4">
                  Created by {eventData.createdBy} on {eventData.startDate}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-green-600 text-white">{eventData.eventType}</Badge>
                  <Badge className="bg-green-600 text-white">{eventData.status}</Badge>
                </div>
              </div>
              <Button
                onClick={handleDisable}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2"
              >
                Disable
              </Button>
            </div>

            {/* Event details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{eventData.venue}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{eventData.startDate} To {eventData.endDate}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{eventData.startTime} To {eventData.endTime}</span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <Users className="w-5 h-5 text-gray-400" />
                <span>{eventData.attendeeCount}</span>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              <div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                </div>
                <p className="text-gray-700">{eventData.description}</p>
              </div>

              <div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">RSVP</h3>
                </div>
                <p className="text-gray-700">No RSVP data available</p>
              </div>

              <div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Files</h3>
                </div>
                <p className="text-gray-700">No files attached</p>
              </div>

              <div className="flex gap-8">
                <div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Shared With (Member)</h3>
                  </div>
                  <p className="text-gray-700">No members shared</p>
                </div>

                <div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Shared With (Group)</h3>
                  </div>
                  <p className="text-gray-700">No groups shared</p>
                </div>
              </div>

              <div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback</h3>
                </div>
                <p className="text-gray-700">No feedback available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer branding */}
      <div className="text-center text-xs text-gray-500 mt-8">
        <p>Powered by</p>
        <div className="flex items-center justify-center mt-1">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
            L
          </div>
          <span className="font-semibold">LOCATED</span>
        </div>
      </div>
    </div>
  );
};
