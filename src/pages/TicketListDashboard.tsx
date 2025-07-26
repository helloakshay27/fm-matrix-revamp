
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Eye, Plus, Filter, Upload, Users, AlertTriangle, CheckCircle, MessageSquare, FileText, Edit, Trash2, Settings, X } from 'lucide-react';
import { TicketsFilterDialog } from '../components/TicketsFilterDialog';
import { TicketPagination } from '../components/TicketPagination';
import { TicketSelectionPanel } from '../components/TicketSelectionPanel';
import { ticketManagementAPI, TicketResponse, TicketListResponse, TicketFilters } from '../services/ticketManagementAPI';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

const TruncatedDescription = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 50;
  
  if (!text || text.length <= maxLength) {
    return <span>{text || '--'}</span>;
  }
  
  return (
    <div className="w-48">
      <span className="block">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[#C72030] text-xs hover:underline mt-1"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
};

export const TicketListDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [activeFilters, setActiveFilters] = useState<TicketFilters>({});
  const [ticketSummary, setTicketSummary] = useState({
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    closed_tickets: 0,
    complaints: 0,
    suggestions: 0,
    requests: 0,
    pending_tickets: 0
  });
  const [isExporting, setIsExporting] = useState(false);
  const navigate = useNavigate();

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoize the combined filters
  const combinedFilters = useMemo(() => {
    const filters: TicketFilters = { ...activeFilters };
    
    if (debouncedSearchTerm) {
      filters.search_all_fields_cont = debouncedSearchTerm;
    }
    
    console.log('Combined filters:', filters);
    return filters;
  }, [activeFilters, debouncedSearchTerm]);

  const fetchTickets = useCallback(async (page: number, itemsPerPage: number, filters: TicketFilters = {}) => {
    setIsLoading(true);
    console.log('Fetching tickets with:', { page, itemsPerPage, filters });
    try {
      const response: TicketListResponse = await ticketManagementAPI.getTickets(page, itemsPerPage, filters);
      console.log('Tickets response:', response);
      setTickets(response.complaints || []);
      
      // Log first few tickets to see their status values
      if (response.complaints && response.complaints.length > 0) {
        console.log('Sample ticket statuses:', response.complaints.slice(0, 3).map(t => ({
          id: t.id,
          ticket_number: t.ticket_number,
          issue_status: t.issue_status
        })));
      }
      
      if (response.pagination) {
        setTotalPages(response.pagination.total_pages || 1);
        setTotalRecords(response.pagination.total_count || 0);
        setCurrentPage(response.pagination.current_page || 1);
      }
    } catch (error) {
      toast.error('Failed to fetch tickets');
      console.error('Error fetching tickets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTicketSummary = useCallback(async (filters: TicketFilters = {}) => {
    try {
      const summary = await ticketManagementAPI.getTicketSummary(filters);
      setTicketSummary(summary);
    } catch (error) {
      console.error('Error fetching ticket summary:', error);
    }
  }, []);

  // Fetch tickets when filters or pagination changes
  useEffect(() => {
    fetchTickets(currentPage, perPage, combinedFilters);
    // Only apply filters to summary for specific status cards, not total
    fetchTicketSummary(combinedFilters);
  }, [fetchTickets, fetchTicketSummary, currentPage, perPage, combinedFilters]);

  // Fetch overall summary without filters for total count
  const [overallSummary, setOverallSummary] = useState({
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    closed_tickets: 0,
    complaints: 0,
    suggestions: 0,
    requests: 0,
    pending_tickets: 0
  });

  useEffect(() => {
    const fetchOverallSummary = async () => {
      try {
        const summary = await ticketManagementAPI.getTicketSummary({});
        setOverallSummary(summary);
      } catch (error) {
        console.error('Error fetching overall summary:', error);
      }
    };
    fetchOverallSummary();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '--';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  const formatTimeValue = (value: string | null) => {
    return value || '--';
  };

  const handleFilterApply = (filters: TicketFilters) => {
    console.log('Applied filters:', filters);
    setActiveFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleAddTicket = () => {
    navigate('/maintenance/tickets/add');
  };

  const handleViewTicket = (ticketNumber: string) => {
    navigate(`/maintenance/ticket/${ticketNumber}`);
  };

  const handleEditTicket = (ticketNumber: string) => {
    navigate(`/maintenance/ticket/edit/${ticketNumber}`);
  };

  const handleDeleteTicket = async (ticketId: number) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        // Add delete API call here when available
        toast.success('Ticket deleted successfully');
        await fetchTickets(currentPage, perPage, combinedFilters);
      } catch (error) {
        toast.error('Failed to delete ticket');
        console.error('Error deleting ticket:', error);
      }
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await ticketManagementAPI.exportTicketsExcel(combinedFilters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tickets_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Tickets exported successfully');
    } catch (error) {
      toast.error('Failed to export tickets');
      console.error('Error exporting tickets:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setActiveFilters({});
    setCurrentPage(1);
  };

  const handleSelectTicket = (ticketId: number, checked: boolean) => {
    setSelectedTickets(prev => {
      const newSelection = checked 
        ? [...prev, ticketId]
        : prev.filter(id => id !== ticketId);
      
      setSelectAll(newSelection.length === tickets.length && tickets.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedTickets(tickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleGoldenTicket = async () => {
    try {
      await ticketManagementAPI.markAsGoldenTicket(selectedTickets);
      toast.success(`${selectedTickets.length} ticket(s) marked as Golden Ticket successfully`);
      setSelectedTickets([]);
      setSelectAll(false);
      await fetchTickets(currentPage, perPage, combinedFilters);
    } catch (error) {
      toast.error('Failed to mark tickets as Golden Ticket');
      console.error('Error marking as golden ticket:', error);
    }
  };

  const handleFlag = async () => {
    try {
      await ticketManagementAPI.markAsFlagged(selectedTickets);
      toast.success(`${selectedTickets.length} ticket(s) flagged successfully`);
      setSelectedTickets([]);
      setSelectAll(false);
      await fetchTickets(currentPage, perPage, combinedFilters);
    } catch (error) {
      toast.error('Failed to flag tickets');
      console.error('Error flagging tickets:', error);
    }
  };

  const handleExportSelected = async () => {
    if (selectedTickets.length === 0) {
      toast.error('No tickets selected for export');
      return;
    }

    setIsExporting(true);
    try {
      // For selected tickets, we could add a specific filter or handle differently
      // For now, we'll export the current filtered view
      const blob = await ticketManagementAPI.exportTicketsExcel(combinedFilters);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `selected_tickets_${selectedTickets.length}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Selected tickets exported successfully`);
    } catch (error) {
      toast.error('Failed to export selected tickets');
      console.error('Error exporting selected tickets:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedTickets([]);
    setSelectAll(false);
  };

  const handleStatusCardClick = (status: string) => {
    console.log('Status card clicked:', status);
    let newFilters: TicketFilters = {};
    
    if (status !== 'all') {
      // Use the correct API parameter format
      if (status === 'open') {
        newFilters.complaint_status_name_eq = 'Open';
        console.log('Setting Open filter with complaint_status_name_eq=Open');
      } else if (status === 'pending') {
        newFilters.complaint_status_name_eq = 'Pending';
        console.log('Setting Pending filter with complaint_status_name_eq=Pending');
      } else if (status === 'in progress') {
        newFilters.complaint_status_name_eq = 'In Progress';
        console.log('Setting In Progress filter with complaint_status_name_eq=In Progress');
      } else if (status === 'closed') {
        newFilters.complaint_status_name_eq = 'Closed';
        console.log('Setting Closed filter with complaint_status_name_eq=Closed');
      } else if (status === 'complaints' || status === 'suggestions' || status === 'requests') {
        // For ticket types, use search filter
        newFilters.search_all_fields_cont = status;
        console.log('Setting search filter for:', status);
      }
    }
    
    console.log('Setting filters:', newFilters);
    console.log('Previous active filters:', activeFilters);
    
    // Log what the resulting URL will look like
    const testParams = new URLSearchParams();
    testParams.append('page', '1');
    testParams.append('per_page', '20');
    if (newFilters.complaint_status_name_eq) {
      testParams.append('q[complaint_status_name_eq]', newFilters.complaint_status_name_eq);
    }
    console.log('Expected API URL will be:', `/pms/admin/complaints.json?${testParams.toString()}`);
    
    setActiveFilters(newFilters);
    setCurrentPage(1);
    setSearchTerm(''); // Clear search when clicking status cards
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedTicketObjects = tickets.filter(ticket => 
    selectedTickets.includes(ticket.id)
  );

  const statusCards = [
    { 
      title: 'Total Tickets', 
      count: overallSummary.total_tickets, // Use overall summary for total
      color: 'bg-gray-600', 
      icon: FileText, 
      status: 'all',
      clickable: false // Total tickets shouldn't filter
    },
    { 
      title: 'Open Tickets', 
      count: ticketSummary.open_tickets, 
      color: 'bg-green-600', 
      icon: AlertTriangle, 
      status: 'open',
      clickable: true
    },
    { 
      title: 'Pending Tickets', 
      count: ticketSummary.pending_tickets, 
      color: 'bg-yellow-600', 
      icon: AlertTriangle, 
      status: 'pending',
      clickable: true
    },
    { 
      title: 'In Progress', 
      count: ticketSummary.in_progress_tickets, 
      color: 'bg-blue-600', 
      icon: Users, 
      status: 'in progress',
      clickable: true
    },
    { 
      title: 'Closed Tickets', 
      count: ticketSummary.closed_tickets, 
      // color: 'bg-[#8B4513]', 
      icon: CheckCircle, 
      status: 'closed',
      clickable: true
    },
    { 
      title: 'Complaints', 
      count: ticketSummary.complaints, 
      color: 'bg-orange-500', 
      icon: MessageSquare, 
      status: 'complaints',
      clickable: true
    },
    { 
      title: 'Suggestions', 
      count: ticketSummary.suggestions, 
      color: 'bg-orange-400', 
      icon: FileText, 
      status: 'suggestions',
      clickable: true
    },
    { 
      title: 'Requests', 
      count: ticketSummary.requests, 
      color: 'bg-[#C72030]', 
      icon: Users, 
      status: 'requests',
      clickable: true
    }
  ];

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchTerm.length > 0;

  // Helper function to check if a status card is currently active
  const isStatusCardActive = (status: string) => {
    if (status === 'all') return false;
    
    if (status === 'open') {
      return activeFilters.complaint_status_name_eq === 'Open';
    } else if (status === 'pending') {
      return activeFilters.complaint_status_name_eq === 'Pending';
    } else if (status === 'in progress') {
      return activeFilters.complaint_status_name_eq === 'In Progress';
    } else if (status === 'closed') {
      return activeFilters.complaint_status_name_eq === 'Closed';
    } else if (status === 'complaints' || status === 'suggestions' || status === 'requests') {
      return activeFilters.search_all_fields_cont === status;
    }
    
    return false;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">TICKET LIST</h1>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
        {statusCards.map((card, index) => {
          const isActive = isStatusCardActive(card.status);
          return (
            <div
              key={index}
              className={`p-4 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-3 ${
                isActive 
                  ? "bg-blue-50 border-2" 
                  : "bg-[#F6F4EE]"
              } ${
                card.clickable ? "cursor-pointer hover:shadow-lg transition-all" : ""
              }`}
              onClick={() => {
                if (card.clickable) {
                  handleStatusCardClick(card.status);
                }
              }}
            >
              <div className={`w-12 h-12 ${card.color} rounded-full flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A1A]">{card.count}</div>
                <div className="text-sm font-medium text-[#1A1A1A]">{card.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Filters Indicator */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              Filters active ({Object.keys(activeFilters).length} filter{Object.keys(activeFilters).length !== 1 ? 's' : ''})
              {searchTerm && ` • Search: "${searchTerm}"`}
              {searchTerm && ` • Found ${totalRecords} result${totalRecords !== 1 ? 's' : ''}`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Search Results Indicator */}
      {searchTerm && !hasActiveFilters && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-800">
              Search: "{searchTerm}" • Found {totalRecords} result{totalRecords !== 1 ? 's' : ''}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="text-green-600 border-green-300 hover:bg-green-100"
            >
              Clear Search
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={handleAddTicket}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button 
          onClick={handleExport}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
          disabled={isExporting}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Excel'}
        </Button>
        <div className="ml-auto flex gap-2">
          <div className="relative">
            <Input 
              placeholder="Search by ticket ID, description, or any field..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pr-8"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Columns
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">
            {searchTerm ? `Searching for "${searchTerm}"...` : 'Loading tickets...'}
          </div>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead className="w-48">Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Created On</TableHead>
                  <TableHead>Ticket Type</TableHead>
                  <TableHead>Complaint Mode</TableHead>
                  <TableHead>Associated To</TableHead>
                  <TableHead>Asset / Service Name</TableHead>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Proactive / Reactive</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Response Escalation</TableHead>
                  <TableHead>Response TAT (Min)</TableHead>
                  <TableHead>Response Time (D:H:M)</TableHead>
                  <TableHead>Response Escalation Level</TableHead>
                  <TableHead>Resolution Escalation</TableHead>
                  <TableHead>Resolution TAT (Min)</TableHead>
                  <TableHead>Resolution Time (D:H:M)</TableHead>
                  <TableHead>Resolution Escalation Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <div title="View ticket">
                          <Eye 
                            className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]" 
                            onClick={() => handleViewTicket(ticket.ticket_number)}
                          />
                        </div>
                        <div title="Edit ticket">
                          <Edit 
                            className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]" 
                            onClick={() => handleEditTicket(ticket.ticket_number)}
                          />
                        </div>
                        <div title="Delete ticket">
                          <Trash2 
                            className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-600" 
                            onClick={() => handleDeleteTicket(ticket.id)}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                    <TableCell>
                      <TruncatedDescription text={ticket.heading} />
                    </TableCell>
                    <TableCell>{ticket.category_type || '--'}</TableCell>
                    <TableCell>{ticket.sub_category_type || '--'}</TableCell>
                    <TableCell>{ticket.posted_by || '--'}</TableCell>
                    <TableCell>{ticket.assigned_to || '--'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(ticket.issue_status)}>
                        {ticket.issue_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.priority || '--'}</TableCell>
                    <TableCell>{ticket.site_name || '--'}</TableCell>
                    <TableCell>{formatDate(ticket.created_at)}</TableCell>
                    <TableCell>{ticket.issue_type || '--'}</TableCell>
                    <TableCell>{ticket.complaint_mode || '--'}</TableCell>
                    <TableCell>{ticket.assigned_to || '--'}</TableCell>
                    <TableCell>{ticket.service_or_asset || '--'}</TableCell>
                    <TableCell>{ticket.asset_task_occurrence_id || '--'}</TableCell>
                    <TableCell>{ticket.proactive_reactive || '--'}</TableCell>
                    <TableCell>{formatTimeValue(ticket.review_tracking_date)}</TableCell>
                    <TableCell>{ticket.response_escalation || '--'}</TableCell>
                    <TableCell>{ticket.response_tat || '--'}</TableCell>
                    <TableCell>{formatTimeValue(ticket.response_time)}</TableCell>
                    <TableCell>{ticket.escalation_response_name || '--'}</TableCell>
                    <TableCell>{ticket.resolution_escalation || '--'}</TableCell>
                    <TableCell>{ticket.resolution_tat || '--'}</TableCell>
                    <TableCell>{formatTimeValue(ticket.resolution_time)}</TableCell>
                    <TableCell>{ticket.escalation_resolution_name || '--'}</TableCell>
                  </TableRow>
                ))}
                {tickets.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={27} className="text-center py-12">
                      <div className="flex flex-col items-center text-gray-500">
                        <div className="text-lg font-medium mb-2">
                          {searchTerm ? 'No tickets found' : 'No tickets available'}
                        </div>
                        <div className="text-sm mb-4">
                          {searchTerm 
                            ? `No results found for "${searchTerm}"` 
                            : 'There are no tickets to display'
                          }
                        </div>
                        {searchTerm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchTerm('')}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          <TicketPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            perPage={perPage}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      <TicketsFilterDialog 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleFilterApply}
      />

      <TicketSelectionPanel
        selectedTickets={selectedTickets}
        selectedTicketObjects={selectedTicketObjects}
        onGoldenTicket={handleGoldenTicket}
        onFlag={handleFlag}
        onExport={handleExportSelected}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};
