
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Filter, Eye, Search } from 'lucide-react';
import { AddEventForm } from '@/components/AddEventForm';
import { EventsFilterModal } from '@/components/EventsFilterModal';

interface Event {
  id: number;
  title: string;
  unit: string;
  createdBy: string;
  startDate: string;
  endDate: string;
  eventType: 'General' | 'Personal';
  status: 'Published' | 'Draft';
  expired: boolean;
  attachments: number;
  createdOn: string;
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Diwali Celebration',
    unit: '',
    createdBy: '',
    startDate: '13/06/2025 1:45 PM',
    endDate: '16/06/2025 3:00 AM',
    eventType: 'General',
    status: 'Published',
    expired: false,
    attachments: 0,
    createdOn: '11/06/2025'
  },
  {
    id: 2,
    title: 'test',
    unit: '',
    createdBy: 'Ankit Gupta',
    startDate: '27/06/2025 12:15 PM',
    endDate: '28/06/2025 12:00 PM',
    eventType: 'General',
    status: 'Published',
    expired: false,
    attachments: 0,
    createdOn: '11/06/2025'
  },
  {
    id: 3,
    title: 'Diwali Celebration',
    unit: '',
    createdBy: '',
    startDate: '12/06/2025 11:45 AM',
    endDate: '14/06/2025 3:00 AM',
    eventType: 'General',
    status: 'Published',
    expired: false,
    attachments: 0,
    createdOn: '11/06/2025'
  },
  {
    id: 4,
    title: 'New Test',
    unit: '',
    createdBy: 'Akshy Karnekar',
    startDate: '30/05/2025 5:00 PM',
    endDate: '31/05/2025 5:01 AM',
    eventType: 'Personal',
    status: 'Published',
    expired: true,
    attachments: 0,
    createdOn: '29/05/2025'
  }
];

export const EventsDashboard: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [events] = useState<Event[]>(mockEvents);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showAddForm) {
    return <AddEventForm onBack={() => setShowAddForm(false)} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>Events</span>
          <span className="mx-2">{'>'}</span>
          <span>Event List</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">EVENT LIST</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setShowFilterModal(true)}
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
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
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.title}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.unit}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.createdBy}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.startDate}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.endDate}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge 
                      variant={event.eventType === 'General' ? 'default' : 'secondary'}
                      className={event.eventType === 'General' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                    >
                      {event.eventType}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge 
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {event.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {event.expired && (
                      <Badge variant="destructive" className="bg-red-100 text-red-800">
                        Expired
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.attachments}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.createdOn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <EventsFilterModal 
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
};

export default EventsDashboard;
