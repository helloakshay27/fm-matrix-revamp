import React from 'react';
import { MessageSquare, Flag, Eye, Clock, User, Building, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const recentTickets = [
  {
    id: '2189-11106',
    description: 'Air conditioner not working in conference room',
    category: 'HVAC',
    assignee: 'Vinayak Mane',
    location: 'J1 - Wings - Floor 1',
    priority: 'P1',
    status: 'Pending',
    time: '2 hours ago',
    avatar: 'VM'
  },
  {
    id: '2189-11105',
    description: 'Fire system maintenance required',
    category: 'Fire Safety',
    assignee: 'Deepak Gupta',
    location: 'J1 - Wings - Floor 1',
    priority: 'P2',
    status: 'In Progress',
    time: '4 hours ago',
    avatar: 'DG'
  },
  {
    id: '2189-11104',
    description: 'Office cleaning request for workspace',
    category: 'Cleaning',
    assignee: 'Vinayak Mane',
    location: 'J2 - East - Floor 2',
    priority: 'P3',
    status: 'Open',
    time: '6 hours ago',
    avatar: 'VM'
  },
];

export function RecentTicketsSidebar() {
  return (
    <div className="bg-white border border-[hsl(var(--analytics-border))] h-fit">
      <div className="p-4 border-b border-[hsl(var(--analytics-border))]">
        <h3 className="font-semibold text-[hsl(var(--analytics-text))]">Recent Tickets</h3>
      </div>
      
      <div className="p-4 space-y-4">
        {recentTickets.map((ticket) => (
          <div key={ticket.id} className="border-b border-[hsl(var(--analytics-border))] pb-4 last:border-b-0">
            {/* Ticket Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[hsl(var(--analytics-text))]">#{ticket.id}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  ticket.priority === 'P1' ? 'bg-red-100 text-red-700' :
                  ticket.priority === 'P2' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {ticket.priority}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[hsl(var(--analytics-muted))]">
                <Clock className="w-3 h-3" />
                {ticket.time}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[hsl(var(--analytics-text))] mb-2 line-clamp-2">
              {ticket.description}
            </p>

            {/* Category */}
            <div className="flex items-center gap-1 mb-2">
              <Building className="w-3 h-3 text-[hsl(var(--analytics-muted))]" />
              <span className="text-xs text-[hsl(var(--analytics-muted))]">{ticket.category}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3 text-[hsl(var(--analytics-muted))]" />
              <span className="text-xs text-[hsl(var(--analytics-muted))]">{ticket.location}</span>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[hsl(var(--analytics-accent))] flex items-center justify-center">
                <span className="text-xs font-medium text-white">{ticket.avatar}</span>
              </div>
              <span className="text-xs text-[hsl(var(--analytics-text))]">{ticket.assignee}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {ticket.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs h-7 px-2 border-[hsl(var(--analytics-border))]">
                <MessageSquare className="w-3 h-3 mr-1" />
                Add Comment
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7 px-2 border-[hsl(var(--analytics-border))]">
                <Flag className="w-3 h-3 mr-1" />
                Flag Issue
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7 px-2 border-[hsl(var(--analytics-border))]">
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}