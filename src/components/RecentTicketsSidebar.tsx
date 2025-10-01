import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Flag, ChevronRight, Building2, User, Globe, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCommentModal } from './AddCommentModal';
import { useNavigate } from 'react-router-dom';
import { ticketAnalyticsAPI } from '@/services/ticketAnalyticsAPI';
import { apiClient } from '@/utils/apiClient';
import { useToast } from '@/hooks/use-toast';
interface RecentTicketsSidebarProps {
  onTicketUpdate?: () => void; // Callback to refresh parent data
}

export const RecentTicketsSidebar: React.FC<RecentTicketsSidebarProps> = ({ 
  onTicketUpdate 
}) => {
  const { toast } = useToast();
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    ticketId: string;
  }>({
    isOpen: false,
    ticketId: ''
  });
  // Initialize state from localStorage
  const [flaggedTickets, setFlaggedTickets] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('flaggedTickets');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  
  const [goldenTickets, setGoldenTickets] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('goldenTickets');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('flaggedTickets', JSON.stringify(Array.from(flaggedTickets)));
  }, [flaggedTickets]);

  useEffect(() => {
    localStorage.setItem('goldenTickets', JSON.stringify(Array.from(goldenTickets)));
  }, [goldenTickets]);

  const fetchRecentTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAnalyticsAPI.getRecentTickets();
      const mappedTickets = response.complaints.map((ticket: any) => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        title: ticket.heading,
        category: ticket.category_type,
        subCategory: ticket.sub_category_type,
        assigneeName: ticket.assigned_to || 'Unassigned',
        site: ticket.site_name,
        priority: ticket.priority,
        tat: ticket.response_escalation,
        status: ticket.issue_status,
        nextStatus: ticket.status.name,
        handledBy: ticket.updated_by,
        is_flagged: ticket.is_flagged || false,
        is_golden_ticket: ticket.is_golden_ticket || false
      }));
      setRecentTickets(mappedTickets);
      
      // Initialize localStorage sets with actual API data
      const newFlaggedTickets = new Set<string>();
      const newGoldenTickets = new Set<string>();
      
      mappedTickets.forEach((ticket: any) => {
        const ticketId = ticket.id.toString();
        if (ticket.is_flagged) {
          newFlaggedTickets.add(ticketId);
        }
        if (ticket.is_golden_ticket) {
          newGoldenTickets.add(ticketId);
        }
      });
      
      // Update state with API data (this will override localStorage)
      setFlaggedTickets(newFlaggedTickets);
      setGoldenTickets(newGoldenTickets);
      
      // Debug logging
      console.log('API Response - Flagged tickets from server:', 
        mappedTickets.filter(t => t.is_flagged).map(t => ({ id: t.id, is_flagged: t.is_flagged }))
      );
      console.log('API Response - Golden tickets from server:', 
        mappedTickets.filter(t => t.is_golden_ticket).map(t => ({ id: t.id, is_golden_ticket: t.is_golden_ticket }))
      );
      console.log('Updated localStorage - Flagged:', Array.from(newFlaggedTickets));
      console.log('Updated localStorage - Golden:', Array.from(newGoldenTickets));
      
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
  const handleFlag = async (ticketId: string | number) => {
    const ticketIdStr = ticketId.toString();
    const currentlyFlagged = flaggedTickets.has(ticketIdStr);
    
    console.log(`Flag clicked - Ticket ID: ${ticketIdStr}, Currently flagged: ${currentlyFlagged}`);
    
    try {
      // Update local state first for immediate UI feedback
      setFlaggedTickets(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ticketIdStr)) {
          newSet.delete(ticketIdStr);
          console.log(`Removed ${ticketIdStr} from flagged tickets`);
        } else {
          newSet.add(ticketIdStr);
          console.log(`Added ${ticketIdStr} to flagged tickets`);
        }
        console.log(`Flag state updated - New flagged tickets:`, Array.from(newSet));
        return newSet;
      });

      // Make API call
      await apiClient.post(`/pms/admin/complaints/mark_as_flagged.json?ids=[${ticketId}]`);
      
      toast({
        title: "Success",
        description: `Ticket ${!currentlyFlagged ? 'flagged' : 'unflagged'} successfully`
      });

      // Notify parent to refresh data
      if (onTicketUpdate) {
        onTicketUpdate();
      }
      
    } catch (error) {
      console.error('Error flagging ticket:', error);
      
      toast({
        title: "Error",
        description: "Failed to update flag status",
        variant: "destructive"
      });
      
      // Revert state on error
      setFlaggedTickets(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ticketIdStr)) {
          newSet.delete(ticketIdStr);
        } else {
          newSet.add(ticketIdStr);
        }
        return newSet;
      });
    }
  };
  const handleGoldenTicket = async (ticketId: string | number) => {
    const ticketIdStr = ticketId.toString();
    const currentlyGolden = goldenTickets.has(ticketIdStr);
    
    console.log(`Golden ticket clicked - Ticket ID: ${ticketIdStr}, Currently golden: ${currentlyGolden}`);
    
    try {
      // Update local state first for immediate UI feedback
      setGoldenTickets(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ticketIdStr)) {
          newSet.delete(ticketIdStr);
          console.log(`Removed ${ticketIdStr} from golden tickets`);
        } else {
          newSet.add(ticketIdStr);
          console.log(`Added ${ticketIdStr} to golden tickets`);
        }
        console.log(`Golden state updated - New golden tickets:`, Array.from(newSet));
        return newSet;
      });

      // Make API call
      await apiClient.post(`/pms/admin/complaints/mark_as_golden_ticket.json?ids=[${ticketId}]`);
      
      toast({
        title: "Success",
        description: `Golden Ticket ${!currentlyGolden ? 'marked' : 'unmarked'} successfully`
      });

      // Notify parent to refresh data
      if (onTicketUpdate) {
        onTicketUpdate();
      }
      
    } catch (error) {
      console.error('Error marking as golden ticket:', error);
      
      toast({
        title: "Error",
        description: "Failed to update golden ticket status",
        variant: "destructive"
      });
      
      // Revert state on error
      setGoldenTickets(prev => {
        const newSet = new Set(prev);
        if (newSet.has(ticketIdStr)) {
          newSet.delete(ticketIdStr);
        } else {
          newSet.add(ticketIdStr);
        }
        return newSet;
      });
    }
  };
  const handleViewDetails = (ticketId: string) => {
    navigate(`details/${ticketId}`);
  };
  return <>
     <div className="w-full bg-[#fff] border-l p-4 h-full xl:max-h-[1208px] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: "#c72030" }}>
            Recent Tickets
          </h2>
          {/* <div className="text-sm font-medium text-gray-800">
            14/07/2025
          </div> */}
        </div>
        
        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {recentTickets.map((ticket, index) => {
            // Debug logging for each ticket
            const isCurrentlyFlagged = flaggedTickets.has(ticket.id.toString());
            const isCurrentlyGolden = goldenTickets.has(ticket.id.toString());
            console.log(`Ticket ${ticket.id} - API flagged: ${ticket.is_flagged}, localStorage flagged: ${isCurrentlyFlagged}, API golden: ${ticket.is_golden_ticket}, localStorage golden: ${isCurrentlyGolden}`);
            
            return <div key={`${ticket.id}-${index}`} className="bg-[#fff] rounded-lg p-4 shadow-sm border border-[#C4B89D] border-opacity-60" style={{ borderWidth: '0.6px' }}>
              {/* Header with ID, Star, and Priority */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800 text-sm">{ticket.ticketNumber}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleGoldenTicket(ticket.id);
                    }}
                    className="transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <Star className={`h-5 w-5 cursor-pointer transition-all duration-200 hover:opacity-80 ${
                      goldenTickets.has(ticket.id.toString()) 
                        ? 'text-yellow-500 fill-yellow-500 drop-shadow-sm' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`} />
                  </button>
                  <span
  className="text-pink-800 px-6 py-1 rounded-full text-xs font-medium"
  style={{ backgroundColor: "#FFCFCF" }}
>
  {ticket.priority}
</span>


                </div>
              </div>
              
              {/* Title and TAT */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-base">{ticket.title}</h3>
                {/* <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-700">TAT :</span>
                  <span className="text-sm font-bold" style={{ color: "#c72030" }}>
  {ticket.tat}
</span>
                </div> */}
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
                  <Building2 className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700 min-w-[100px]">TAT :</span>
                  <span className="text-sm text-gray-700">:</span>
                  <span className="text-sm text-gray-900">{ticket.tat}</span>
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
                    {/* <ChevronRight className="h-3 w-3 text-gray-600" /> */}
                    {/* <span className="italic text-gray-600">{ticket.nextStatus}</span> */}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 ml-7">
                  (Handled By {ticket.handledBy})
                </div>
              </div>
              
              {/* Action Buttons */}
              {/* <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-6">
                  <button 
                    className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80" 
                    onClick={() => handleAddComment(ticket.id)}
                  >
                    <MessageSquare className="h-4 w-4 text-red-500" />
                    Add Comment
                  </button>
                  
                  <button 
                    type="button"
                    className={`flex items-center gap-2 text-black text-sm font-medium transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95 ${
                      flaggedTickets.has(ticket.id.toString()) ? 'opacity-75' : ''
                    }`} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFlag(ticket.id);
                    }}
                  >
                    <Flag className={`h-4 w-4 transition-all duration-200 ${
                      flaggedTickets.has(ticket.id.toString()) 
                        ? 'text-red-600 fill-red-600 drop-shadow-sm' 
                        : 'text-red-500 hover:text-red-600 hover:fill-red-100'
                    }`} />
                    <span className="transition-colors duration-200">
                      {flaggedTickets.has(ticket.id.toString()) ? 'Flag Issue' : 'Flag Issue'}
                    </span>
                  </button>
                </div>
                
                <button
  className="text-sm font-medium underline hover:opacity-80"
  style={{ color: "#c72030" }}
  onClick={() => handleViewDetails(ticket.id)}
>
  View Detail&gt;&gt;
</button>

              </div> */}
<div className="flex items-center w-full">
  {/* Left space or any content can go here if needed */}

  {/* Buttons aligned to the right */}
  <div className="flex items-center gap-3 ml-auto">
   
    
  <button 
                    type="button"
                    className={`flex items-center text-black text-sm font-medium transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95 ${
                      flaggedTickets.has(ticket.id.toString()) ? 'opacity-75' : ''
                    }`} 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFlag(ticket.id);
                    }}
                  >
                    <Flag className={`h-5 w-5 transition-all duration-200 ${
                      flaggedTickets.has(ticket.id.toString()) 
                        ? 'text-red-600 fill-red-600 drop-shadow-sm' 
                        : 'text-red-500 hover:text-red-600 hover:fill-red-100'
                    }`} />
                    <span className="transition-colors duration-200">
                      {flaggedTickets.has(ticket.id.toString()) ? '' : ''}
                    </span>
                  </button>
<button 
      className="flex items-center gap-2 text-black text-sm font-medium hover:opacity-80" 
      onClick={() => handleAddComment(ticket.id)}
    >
      <MessageSquare className="h-5 w-5 " style={{ color: "#c72030" }}/>
    </button>


    {/* Eye icon at the very end */}
    <button
      className="hover:opacity-80"
      onClick={() => handleViewDetails(ticket.id)}
    >
      <Eye className="w-5 h-5" style={{ color: "#c72030" }} />
    </button>
  </div>
</div>


            </div>;
          })}
        </div>
      </div>

      <AddCommentModal isOpen={commentModal.isOpen} onClose={() => setCommentModal({
      isOpen: false,
      ticketId: ''
    })} itemId={commentModal.ticketId} itemType="ticket" />
    </>;
} 