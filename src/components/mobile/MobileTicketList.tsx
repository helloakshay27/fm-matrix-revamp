import React, { useState, useEffect } from 'react';
import { Star, Clock, Filter, History, Plus, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ticketManagementAPI, TicketResponse } from '@/services/ticketManagementAPI';
import { useToast } from '@/hooks/use-toast';
import { MobileCreateTicketModal } from './MobileCreateTicketModal';

interface MobileTicketListProps {
  onTicketSelect: (ticket: TicketResponse) => void;
}

export const MobileTicketList: React.FC<MobileTicketListProps> = ({ onTicketSelect }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'my' | 'golden' | 'flagged' | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'approaching' | 'within'>('all');
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [starredTickets, setStarredTickets] = useState<Set<number>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketManagementAPI.getTickets(1, 50, {});
      setTickets(response.complaints || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStarToggle = (ticketId: number) => {
    setStarredTickets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-green-600';
      case 'pending': return 'bg-orange-500';
      case 'in progress': return 'bg-blue-600';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    let tabFilter = true;
    
    switch (activeTab) {
      case 'my':
        // Filter for current user's tickets (you may need to implement user context)
        tabFilter = true; // Show all for now
        break;
      case 'golden':
        tabFilter = starredTickets.has(ticket.id) || ticket.priority === 'High';
        break;
      case 'flagged':
        tabFilter = ticket.priority === 'Critical' || ticket.issue_status === 'Open';
        break;
      case 'all':
      default:
        tabFilter = true;
        break;
    }

    let statusFilter = true;
    switch (activeFilter) {
      case 'approaching':
        statusFilter = ticket.issue_status === 'Approaching TAT';
        break;
      case 'within':
        statusFilter = ticket.issue_status === 'Within TAT';
        break;
      case 'all':
      default:
        statusFilter = true;
        break;
    }

    return tabFilter && statusFilter;
  });

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Tickets</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-red-600 hover:text-red-700"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-4">
          {[
            { key: 'my' as const, label: 'My', icon: null },
            { key: 'golden' as const, label: 'Golden', icon: Star },
            { key: 'flagged' as const, label: 'Flagged', icon: Flag },
            { key: 'all' as const, label: 'All', icon: null }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-none border-b-2 transition-colors flex items-center gap-1
                ${activeTab === tab.key 
                  ? 'text-red-600 border-red-600' 
                  : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
            >
              {tab.icon && (
                <tab.icon 
                  className={`h-4 w-4 ${
                    tab.key === 'golden' 
                      ? (activeTab === tab.key ? 'text-yellow-500' : 'text-gray-400')
                      : activeTab === tab.key ? 'text-red-600' : 'text-gray-400'
                  }`}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-4">
          {[
            { key: 'all' as const, label: 'All' },
            { key: 'approaching' as const, label: 'Approaching TAT' },
            { key: 'within' as const, label: 'Within TAT' }
          ].map(filter => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className={`text-xs h-8 ${
                activeFilter === filter.key 
                  ? 'bg-orange-400 text-white border-orange-400' 
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="bg-gray-200 px-3 py-2 rounded text-sm text-gray-700">
          {filteredTickets.length} records found
        </div>

        {/* History and Filters Row */}
        <div className="flex justify-between items-center mt-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
            <History className="h-4 w-4" />
            History
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No tickets found</div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-stone-100 rounded-lg p-4 shadow-sm border border-stone-200 relative"
              onClick={() => onTicketSelect(ticket)}
            >
              {/* Top Row: Ticket ID, Time, Status */}
              <div className="flex justify-between items-start mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Ticket ID
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">09:06</span>
                  </div>
                  <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                    Open
                  </Badge>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Title
              </h3>

              {/* Category */}
              <p className="text-sm text-gray-700 mb-2">
                Category
              </p>

              {/* Assigned to */}
              <p className="text-sm text-gray-700 mb-4">
                Assigned to:
              </p>

              {/* Date in top right corner */}
              <div className="absolute top-16 right-4">
                <span className="text-sm text-gray-600">
                  24 May 2025
                </span>
              </div>

              {/* Bottom Row: Star, View Details Button, Icon */}
              <div className="flex justify-between items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStarToggle(ticket.id);
                  }}
                  className="p-1"
                >
                  <Star 
                    className={`h-6 w-6 ${
                      starredTickets.has(ticket.id) 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-yellow-500 fill-current'
                    }`}
                  />
                </button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm h-8 px-4 border-red-400 text-red-600 hover:bg-red-50 bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTicketSelect(ticket);
                  }}
                >
                  View Details
                </Button>

                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <div className="w-3 h-3 border border-gray-500"></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      <MobileCreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchTickets();
        }}
      />
    </div>
  );
};