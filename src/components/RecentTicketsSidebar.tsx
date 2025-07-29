import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Flag, ChevronRight, Building2, User, Globe, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCommentModal } from './AddCommentModal';
import { useNavigate } from 'react-router-dom';
import { ticketAnalyticsAPI } from '@/services/ticketAnalyticsAPI';
import { apiClient } from '@/utils/apiClient';
export function RecentTicketsSidebar() {
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    ticketId: string;
  }>({
    isOpen: false,
    ticketId: ''
  });
  const [flaggedTickets, setFlaggedTickets] = useState<Set<string>>(new Set());
  const [goldenTickets, setGoldenTickets] = useState<Set<string>>(new Set());
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecentTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAnalyticsAPI.getRecentTickets();
      const mappedTickets = response.complaints.map((ticket: any) => ({
        id: ticket.id,
        title: ticket.heading,
        category: ticket.category_type,
        subCategory: ticket.sub_category_type,
        assigneeName: ticket.assigned_to || 'Unassigned',
        site: ticket.site_name,
        priority: ticket.priority,
        tat: ticket.response_escalation,
        status: ticket.issue_status,
        nextStatus: ticket.status.name,
        handledBy: ticket.updated_by
      }));
      setRecentTickets(mappedTickets);
    } catch (error) {
      console.error('Error fetching recent tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTickets();
  }, []);
  const handleAddComment = (ticketId: string) => {
    setCommentModal({
      isOpen: true,
      ticketId
    });
  };
  const handleFlag = async (ticketId: string) => {
    try {
      await apiClient.post(`/pms/admin/complaints/mark_as_flagged.json?ids=[${ticketId}]`);
      
      setFlaggedTickets(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ticketId)) {
          newSet.delete(ticketId);
        } else {
          newSet.add(ticketId);
        }
        return newSet;
      });
      
      // Refresh the entire page like other list pages
      window.location.reload();
    } catch (error) {
      console.error('Error flagging ticket:', error);
    }
  };
  const handleGoldenTicket = async (ticketId: string) => {
    try {
      await apiClient.post(`/pms/admin/complaints/mark_as_golden_ticket.json?ids=[${ticketId}]`);
      
      setGoldenTickets(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ticketId)) {
          newSet.delete(ticketId);
        } else {
          newSet.add(ticketId);
        }
        return newSet;
      });
      
      // Refresh the entire page like other list pages
      window.location.reload();
    } catch (error) {
      console.error('Error marking as golden ticket:', error);
    }
  };
  const handleViewDetails = (ticketId: string) => {
    navigate(`details/${ticketId}`);
  };
  return <>
      <div className="w-full bg-[#C4B89D]/25 border-l border-gray-200 p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Recent Tickets
          </h2>
          {/* <div className="text-sm font-medium text-gray-800">
            14/07/2025
          </div> */}
        </div>
        
        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {recentTickets.map((ticket, index) => <div key={`${ticket.id}-${index}`} className="bg-[#C4B89D]/20 rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60" style={{ borderWidth: '0.6px' }}>
              {/* Header with ID, Star, and Priority */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800 text-sm">{ticket.id}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleGoldenTicket(ticket.id)}>
                    <Star className={`h-5 w-5 ${goldenTickets.has(ticket.id) ? 'text-yellow-600 fill-yellow-600' : 'text-yellow-500 fill-yellow-500'} cursor-pointer hover:opacity-80`} />
                  </button>
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
                    <Flag className={`h-4 w-4 ${flaggedTickets.has(ticket.id) ? 'text-red-600 fill-red-600' : 'text-red-500'}`} />
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