import React, { useState } from 'react';
import { Clock, User, MapPin, Flag, MessageSquare, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddCommentModal } from './AddCommentModal';
import { useNavigate } from 'react-router-dom';

const recentTickets = [
  {
    id: 'TIC001',
    description: 'Network connectivity issue in main office building requiring immediate attention',
    category: 'Infrastructure',
    location: 'Main Office',
    assignee: 'John Smith',
    priority: 'P1',
    status: 'In Progress',
    tat: '2 Days',
    tatStatus: 'warning',
    flow: 'In Progress → Closed'
  },
  {
    id: 'TIC002', 
    description: 'Printer malfunction in accounting department affecting daily operations',
    category: 'Hardware',
    location: 'Accounting Dept',
    assignee: 'Sarah Johnson',
    priority: 'P2',
    status: 'Open',
    tat: '1 Day',
    tatStatus: 'success',
    flow: 'Open → In Progress'
  },
  {
    id: 'TIC003',
    description: 'Software installation request for new employee onboarding process',
    category: 'Software',
    location: 'HR Department',
    assignee: 'Mike Wilson',
    priority: 'P3',
    status: 'Pending',
    tat: '5 Days',
    tatStatus: 'error',
    flow: 'Pending → Open'
  },
  {
    id: 'TIC004',
    description: 'Email server configuration issue affecting multiple departments',
    category: 'Infrastructure',
    location: 'IT Department',
    assignee: 'David Lee',
    priority: 'P1',
    status: 'In Progress',
    tat: '3 Days',
    tatStatus: 'warning',
    flow: 'In Progress → Closed'
  },
  {
    id: 'TIC005',
    description: 'Access card replacement request for security system',
    category: 'Security',
    location: 'Security Desk',
    assignee: 'Emma Davis',
    priority: 'P2',
    status: 'Open',
    tat: '2 Days',
    tatStatus: 'success',
    flow: 'Open → In Progress'
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

  const getTatColor = (tatStatus: string) => {
    switch (tatStatus) {
      case 'success':
        return 'text-[hsl(var(--analytics-success))]';
      case 'warning':
        return 'text-[hsl(var(--analytics-warning))]';
      case 'error':
        return 'text-[hsl(var(--analytics-error))]';
      default:
        return 'text-[hsl(var(--analytics-text))]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'P2':
        return 'bg-[hsl(var(--analytics-warning))]/20 text-[hsl(var(--analytics-warning))] border border-[hsl(var(--analytics-warning))]/30';
      case 'P3':
        return 'bg-[hsl(var(--analytics-success))]/20 text-[hsl(var(--analytics-success))] border border-[hsl(var(--analytics-success))]/30';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <>
      <div className="
        w-full sm:w-80 lg:w-[420px] xl:w-[450px] 2xl:w-[520px]
        bg-[hsl(var(--analytics-background))] 
        border-l border-[hsl(var(--analytics-border))] 
        p-3 sm:p-4 lg:p-5 xl:p-6
        h-full overflow-hidden flex flex-col
      ">
        <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[hsl(var(--analytics-text))] mb-3 sm:mb-4 lg:mb-5">
          Recent Tickets
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 lg:space-y-5 pr-1 sm:pr-2">
          {recentTickets.map((ticket) => (
            <div key={ticket.id} className="border border-[hsl(var(--analytics-border))] rounded-lg p-3 sm:p-4 lg:p-5 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <span className="font-medium text-[hsl(var(--analytics-text))] text-sm sm:text-base lg:text-lg">#{ticket.id}</span>
                <span className={`px-2 py-1 lg:px-3 lg:py-1.5 rounded text-xs lg:text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm lg:text-base text-[hsl(var(--analytics-text))] mb-2 sm:mb-3 lg:mb-4 line-clamp-2 leading-relaxed">
                {ticket.description}
              </p>
              
              <div className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 mb-2 sm:mb-3 lg:mb-4">
                <div className="flex items-center text-xs lg:text-sm text-[hsl(var(--analytics-text))]">
                  <span className="font-medium mr-2">Category:</span>
                  <span className="bg-[hsl(var(--analytics-chart-1))]/20 px-2 py-1 lg:px-3 lg:py-1.5 rounded text-[hsl(var(--analytics-chart-1))] text-xs lg:text-sm">
                    {ticket.category}
                  </span>
                </div>
                <div className="flex items-center text-xs lg:text-sm text-[hsl(var(--analytics-text))]">
                  <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{ticket.location}</span>
                </div>
                <div className="flex items-center text-xs lg:text-sm text-[hsl(var(--analytics-text))]">
                  <User className="h-3 w-3 lg:h-4 lg:w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{ticket.assignee}</span>
                </div>
                <div className="flex items-center justify-between text-xs lg:text-sm flex-wrap gap-2">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4 mr-2 text-[hsl(var(--analytics-text))] flex-shrink-0" />
                    <span className="bg-[hsl(var(--analytics-background))] px-2 py-1 lg:px-3 lg:py-1.5 rounded border border-[hsl(var(--analytics-border))] text-[hsl(var(--analytics-text))] text-xs lg:text-sm">
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[hsl(var(--analytics-text))] mr-1">TAT:</span>
                    <span className={`font-medium ${getTatColor(ticket.tatStatus)}`}>
                      {ticket.tat}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-xs lg:text-sm text-[hsl(var(--analytics-text))]">
                  <span className="mr-2">Flow:</span>
                  <div className="flex items-center min-w-0 flex-1">
                    <span className="truncate">{ticket.flow.split(' → ')[0]}</span>
                    <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4 mx-1 flex-shrink-0" />
                    <span className="truncate">{ticket.flow.split(' → ')[1]}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs lg:text-sm border-[hsl(var(--analytics-border))] text-[hsl(var(--analytics-text))] hover:bg-[hsl(var(--analytics-chart-1))]/20 hover:border-[hsl(var(--analytics-chart-1))] min-w-0 px-2 lg:px-3"
                  onClick={() => handleAddComment(ticket.id)}
                >
                  <MessageSquare className="h-3 w-3 lg:h-4 lg:w-4 mr-1 flex-shrink-0" />
                  <span className="hidden sm:inline lg:inline">Comment</span>
                  <span className="sm:hidden lg:hidden">Add</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className={`text-xs lg:text-sm border-[hsl(var(--analytics-border))] hover:bg-[hsl(var(--analytics-chart-2))]/20 hover:border-[hsl(var(--analytics-chart-2))] min-w-0 px-2 lg:px-3 ${
                    flaggedTickets.has(ticket.id) 
                      ? 'bg-[hsl(var(--analytics-error))]/20 text-[hsl(var(--analytics-error))] border-[hsl(var(--analytics-error))]' 
                      : 'text-[hsl(var(--analytics-text))]'
                  }`}
                  onClick={() => handleFlag(ticket.id)}
                >
                  <Flag className="h-3 w-3 lg:h-4 lg:w-4 mr-1 flex-shrink-0" />
                  <span className="hidden sm:inline lg:inline">Flag</span>
                  <span className="sm:hidden lg:hidden">F</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs lg:text-sm border-[hsl(var(--analytics-border))] text-[hsl(var(--analytics-text))] hover:bg-[hsl(var(--analytics-chart-3))]/20 hover:border-[hsl(var(--analytics-chart-3))] min-w-0 px-2 lg:px-3"
                  onClick={() => handleViewDetails(ticket.id)}
                >
                  <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-1 flex-shrink-0" />
                  <span className="hidden sm:inline lg:inline">View</span>
                  <span className="sm:hidden lg:hidden">V</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddCommentModal
        isOpen={commentModal.isOpen}
        onClose={() => setCommentModal({ isOpen: false, ticketId: '' })}
        itemId={commentModal.ticketId}
        itemType="ticket"
      />
    </>
  );
}
