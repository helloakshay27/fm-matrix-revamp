import React, { useState } from 'react';
import { Star, MessageSquare, Flag, ChevronRight, Building2, User, Globe, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCommentModal } from './AddCommentModal';
import { useNavigate } from 'react-router-dom';
const recentTickets = [{
  id: '234-87654',
  title: 'Floor not clean',
  category: 'Housekeeping',
  subCategory: 'Common Area',
  assigneeName: 'Arman',
  site: 'GoPhygital',
  priority: 'P1',
  tat: 'A',
  status: 'In Progress',
  nextStatus: 'Closed',
  handledBy: 'Arman'
}, {
  id: '234-87654',
  title: 'Floor not clean',
  category: 'Housekeeping',
  subCategory: 'Common Area',
  assigneeName: 'Arman',
  site: 'GoPhygital',
  priority: 'P1',
  tat: 'A',
  status: 'In Progress',
  nextStatus: 'Closed',
  handledBy: 'Arman'
}, {
  id: '234-87654',
  title: 'Floor not clean',
  category: 'Housekeeping',
  subCategory: 'Common Area',
  assigneeName: 'Arman',
  site: 'GoPhygital',
  priority: 'P1',
  tat: 'A',
  status: 'In Progress',
  nextStatus: 'Closed',
  handledBy: 'Arman'
}];
export function RecentTicketsSidebar() {
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    ticketId: string;
  }>({
    isOpen: false,
    ticketId: ''
  });
  const [flaggedTickets, setFlaggedTickets] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const handleAddComment = (ticketId: string) => {
    setCommentModal({
      isOpen: true,
      ticketId
    });
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
  return <>
      <div className="w-full bg-[#E8E0D4] border-l border-gray-200 p-4 h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Recent Tickets
          </h2>
          <div className="text-sm font-medium text-gray-800">
            14/07/2025
          </div>
        </div>
        
        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {recentTickets.map((ticket, index) => <div key={`${ticket.id}-${index}`} className="bg-[#E8E0D4] rounded-lg p-4 shadow-sm">
              {/* Header with ID, Star, and Priority */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800 text-sm">{ticket.id}</span>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="bg-pink-300 text-pink-800 px-2 py-1 rounded text-xs font-medium">
                    {ticket.priority}
                  </span>
                </div>
              </div>
              
              {/* Title and TAT */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-base">{ticket.title}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-700">TAT :</span>
                  <span className="text-sm font-bold text-blue-600">"{ticket.tat}"</span>
                </div>
              </div>
              
              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Category</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{ticket.category}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Sub-Category</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{ticket.subCategory}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Assignee Name</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{ticket.assigneeName}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Site</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{ticket.site}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">Update</span>
                  <span className="text-sm text-gray-700">:</span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="italic text-gray-600">{ticket.status}</span>
                    <ChevronRight className="h-3 w-3 text-gray-600" />
                    <span className="italic text-gray-600">{ticket.nextStatus}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 ml-7">
                  (Handled By {ticket.handledBy})
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-6">
                  <button 
                    className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80" 
                    onClick={() => handleAddComment(ticket.id)}
                  >
                    <MessageSquare className="h-4 w-4 text-red-500" />
                    Add Comment
                  </button>
                  
                  <button 
                    className={`flex items-center gap-2 text-black text-sm font-medium hover:opacity-80 ${flaggedTickets.has(ticket.id) ? 'opacity-60' : ''}`} 
                    onClick={() => handleFlag(ticket.id)}
                  >
                    <Flag className="h-4 w-4 text-red-500" />
                    Flag Issue
                  </button>
                </div>
                
                <button 
                  className="text-blue-600 text-sm font-medium underline hover:text-blue-800" 
                  onClick={() => handleViewDetails(ticket.id)}
                >
                  View Detail&gt;&gt;
                </button>
              </div>
            </div>)}
        </div>
      </div>

      <AddCommentModal isOpen={commentModal.isOpen} onClose={() => setCommentModal({
      isOpen: false,
      ticketId: ''
    })} itemId={commentModal.ticketId} itemType="ticket" />
    </>;
}