
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Eye } from 'lucide-react';
import { EventsFilterModal } from '@/components/EventsFilterModal';
import { AddEventForm } from '@/components/AddEventForm';

const EventsDashboard = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Diwali Celebration",
      unit: "",
      createdBy: "",
      startDate: "13/06/2025 1:45 PM",
      endDate: "16/06/2025 3:00 AM",
      eventType: "General",
      status: "Published",
      expired: false,
      attachments: "",
      createdOn: "11/06/2025"
    },
    {
      id: 2,
      title: "test",
      unit: "",
      createdBy: "Ankit Gupta",
      startDate: "27/06/2025 12:15 PM",
      endDate: "28/06/2025 12:00 PM",
      eventType: "General",
      status: "Published",
      expired: false,
      attachments: "",
      createdOn: "11/06/2025"
    },
    {
      id: 3,
      title: "Diwali Celebration",
      unit: "",
      createdBy: "",
      startDate: "12/06/2025 11:45 AM",
      endDate: "14/06/2025 3:00 AM",
      eventType: "General",
      status: "Published",
      expired: false,
      attachments: "",
      createdOn: "11/06/2025"
    },
    {
      id: 4,
      title: "New Test",
      unit: "",
      createdBy: "Atharv Karnekar",
      startDate: "30/05/2025 5:00 PM",
      endDate: "31/05/2025 5:01 AM",
      eventType: "Personal",
      status: "Published",
      expired: true,
      attachments: "",
      createdOn: "29/05/2025"
    },
    {
      id: 5,
      title: "aks",
      unit: "",
      createdBy: "Ankit Gupta",
      startDate: "22/05/2025 4:54 PM",
      endDate: "29/05/2025 6:56 PM",
      eventType: "Personal",
      status: "Published",
      expired: true,
      attachments: "",
      createdOn: "10/05/2025"
    }
  ];

  if (showAddForm) {
    return <AddEventForm onBack={() => setShowAddForm(false)} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span>Events</span>
          <span className="mx-2">›</span>
          <span>Event List</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">EVENT LIST</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created by</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expired</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachments</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Eye className="h-4 w-4 text-gray-400" />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    {event.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.unit}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.createdBy}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.startDate}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.endDate}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      event.eventType === 'General' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {event.expired && (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.attachments}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.createdOn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EventsFilterModal 
        isOpen={showFilterModal} 
        onClose={() => setShowFilterModal(false)} 
      />
    </div>
  );
};

export default EventsDashboard;
