import React, { useState } from 'react';
import { Clock, User, MapPin, Flag, MessageSquare, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCommentModal } from './AddCommentModal';
import { useNavigate } from 'react-router-dom';

const recentTickets = [
  {
    id: 'TIC001',
    number: '234-87654',
    description: 'Floor not clean',
    category: 'Housekeeping',
    subCategory: 'Common Area',
    assigneeName: 'Arman',
    site: 'GoPayBrat',
    status: 'In Progress',
    tat: '1D',
    tatStatus: 'success',
    flow: 'In Progress → Closed',
    priority: 'P1'
  },
  {
    id: 'TIC002', 
    number: '234-87654',
    description: 'Floor not clean',
    category: 'Housekeeping',
    subCategory: 'Common Area',
    assigneeName: 'Arman',
    site: 'GoPayBrat',
    status: 'In Progress',
    tat: '1D',
    tatStatus: 'success',
    flow: 'In Progress → Closed',
    priority: 'P1'
  },
  {
    id: 'TIC003',
    number: '234-87654',
    description: 'Floor not clean',
    category: 'Housekeeping',
    subCategory: 'Common Area',
    assigneeName: 'Arman',
    site: 'GoPayBrat',
    status: 'In Progress',
    tat: '1D',
    tatStatus: 'success',
    flow: 'In Progress → Closed',
    priority: 'P1'
  }
];

export function RecentTicketsSidebar() {
  const [commentModal, setCommentModal] = useState<{ isOpen: boolean; ticketId: string }>({
    isOpen: false,
    ticketId: ''
  });
  const [flaggedTickets, setFlaggedTickets] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const handleAddComment = (ticketId: string) => {
    setCommentModal({ isOpen: true, ticketId });
  };

  const handleFlag = (ticketId: string) => {
    setFlaggedTickets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  const handleViewDetails = (ticketId: string) => {
    navigate(`/maintenance/ticket-details/${ticketId}`);
  };

  return (
    <>
      <div className="bg-[#F5F4F0] h-full overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-600">Recent Tickets</h2>
          <div className="text-xs text-gray-500 mt-1">16/07/2025</div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {recentTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border border-gray-200 rounded-sm mb-2 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-gray-800">#{ticket.number}</span>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                    {ticket.priority}
                  </span>
                  <button className="w-4 h-4 text-yellow-500">
                    ★
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-700 mb-3 font-medium">
                {ticket.description}
              </p>
              
              <div className="space-y-1.5 mb-3 text-xs">
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Category</span>
                  <span className="text-gray-500 mr-2">:</span>
                  <span className="text-gray-800">{ticket.category}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Sub-Category</span>
                  <span className="text-gray-500 mr-2">:</span>
                  <span className="text-gray-800">{ticket.subCategory}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Assignee Name</span>
                  <span className="text-gray-500 mr-2">:</span>
                  <span className="text-gray-800">{ticket.assigneeName}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Site</span>
                  <span className="text-gray-500 mr-2">:</span>
                  <span className="text-gray-800">{ticket.site}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 w-16">Update</span>
                  <span className="text-gray-500 mr-2">:</span>
                  <span className="text-gray-800">{ticket.status}</span>
                  <div className="flex items-center ml-2">
                    <span className="text-xs">→</span>
                    <span className="text-xs ml-1 text-gray-600">Closed</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (Handled by {ticket.assigneeName})
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">TAT:</span>
                  <span className="text-xs font-medium text-green-600">{ticket.tat}</span>
                </div>
              </div>
              
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs h-7 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleAddComment(ticket.id)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Add Comment
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`flex-1 text-xs h-7 border-red-200 hover:bg-red-50 ${
                    flaggedTickets.has(ticket.id) 
                      ? 'bg-red-100 text-red-700 border-red-300' 
                      : 'text-red-600'
                  }`}
                  onClick={() => handleFlag(ticket.id)}
                >
                  <Flag className="h-3 w-3 mr-1" />
                  Flag Issue
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 text-xs h-7 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleViewDetails(ticket.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddCommentModal
        isOpen={commentModal.isOpen}
        onClose={() => setCommentModal({ isOpen: false, ticketId: '' })}
        ticketId={commentModal.ticketId}
      />
    </>
  );
}