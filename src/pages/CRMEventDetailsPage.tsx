
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
        <Button
          onClick={handleDisable}
          className="ml-auto bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2"
        >
          Disable
        </Button>
      </div>

      {/* Event Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            E
          </div>
          <h2 className="text-lg font-bold text-gray-900">EVENT DETAILS</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm">Event ID</span>
              <p className="text-gray-900 font-medium">{eventData.id}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Created by</span>
              <p className="text-gray-900 font-medium">{eventData.createdBy}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Event Type</span>
              <p className="text-gray-900 font-medium">{eventData.eventType}</p>
            </div>
            
            <div>
              <span className="text-gray-500 text-sm">Title</span>
              <p className="text-gray-900 font-medium">{eventData.title}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Venue</span>
              <p className="text-gray-900 font-medium">{eventData.venue}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Attendees</span>
              <p className="text-gray-900 font-medium">{eventData.attendeeCount}</p>
            </div>
            
            <div>
              <span className="text-gray-500 text-sm">Status</span>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {eventData.status}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Start Date</span>
              <p className="text-gray-900 font-medium">{eventData.startDate}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">End Date</span>
              <p className="text-gray-900 font-medium">{eventData.endDate}</p>
            </div>
            
            <div>
              <span className="text-gray-500 text-sm">Start Time</span>
              <p className="text-gray-900 font-medium">{eventData.startTime}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">End Time</span>
              <p className="text-gray-900 font-medium">{eventData.endTime}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Description</span>
              <p className="text-gray-900 font-medium">{eventData.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <h2 className="text-lg font-bold text-gray-900">ATTACHMENTS</h2>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            No attachments available for this event.
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
            L
          </div>
          <h2 className="text-lg font-bold text-gray-900">LOGS</h2>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8 text-gray-500">
            No logs available for this event.
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
