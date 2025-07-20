import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Eye, Plus, Filter, Upload, Users, AlertTriangle, CheckCircle, MessageSquare, FileText } from 'lucide-react';
import { TicketsFilterDialog } from '../components/TicketsFilterDialog';
import { TicketPagination } from '../components/TicketPagination';
import { TicketSelectionPanel } from '../components/TicketSelectionPanel';
import { ticketManagementAPI, TicketResponse, TicketListResponse } from '../services/ticketManagementAPI';
import { toast } from 'sonner';

const statusCards = [
  { title: 'Closed Tickets', count: 301, color: 'bg-[#8B4513]', icon: CheckCircle },
  { title: 'Open Tickets', count: 738, color: 'bg-green-600', icon: AlertTriangle },
  { title: 'Complaint', count: 617, color: 'bg-orange-500', icon: MessageSquare },
  { title: 'Suggestion', count: 110, color: 'bg-orange-400', icon: FileText },
  { title: 'Request', count: 308, color: 'bg-[#C72030]', icon: Users }
];

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
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const fetchTickets = useCallback(async (page: number, itemsPerPage: number) => {
    setIsLoading(true);
    try {
      const response: TicketListResponse = await ticketManagementAPI.getTickets(page, itemsPerPage);
      setTickets(response.complaints || []);
      
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

  useEffect(() => {
    fetchTickets(currentPage, perPage);
  }, [fetchTickets, currentPage, perPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
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

  const handleFilterApply = (filters: any) => {
    console.log('Applied filters:', filters);
    // TODO: Implement filter functionality with API
  };

  const handleAddTicket = () => {
    navigate('/maintenance/tickets/add');
  };

  const handleViewTicket = (ticketNumber: string) => {
    navigate(`/maintenance/ticket/${ticketNumber}`);
  };

  const handleExport = () => {
    console.log('Exporting tickets...');
    if (tickets.length === 0) {
      toast.error('No tickets to export');
      return;
    }

    // Create CSV content with real data
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Ticket ID,Description,Category,Sub Category,Created By,Assigned To,Status,Priority,Site,Created On,Ticket Type,Complaint Mode,Associated To,Asset/Service Name,Task ID,Proactive/Reactive,Review,Response Escalation,Response TAT (Min),Response Time (D:H:M),Response Escalation Level,Resolution Escalation,Resolution TAT (Min),Resolution Time (D:H:M),Resolution Escalation Level\n"
      + tickets.map(ticket => 
          `"${ticket.ticket_number}","${ticket.heading}","${ticket.category_type}","${ticket.sub_category_type || ''}","${ticket.posted_by}","${ticket.assigned_to || ''}","${ticket.issue_status}","${ticket.priority}","${ticket.site_name}","${formatDate(ticket.created_at)}","${ticket.issue_type}","${ticket.complaint_mode || ''}","${ticket.assigned_to || ''}","${ticket.service_or_asset || ''}","${ticket.asset_task_occurrence_id || ''}","${ticket.proactive_reactive || ''}","${ticket.review_tracking_date || ''}","${ticket.response_escalation}","${ticket.response_tat}","${ticket.response_time || ''}","${ticket.escalation_response_name || ''}","${ticket.resolution_escalation}","${ticket.resolution_tat || ''}","${ticket.resolution_time || ''}","${ticket.escalation_resolution_name || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ticket_list.csv");
    link.click();
  };

  const handleSelectTicket = (ticketNumber: string, checked: boolean) => {
    setSelectedTickets(prev => {
      const newSelection = checked 
        ? [...prev, ticketNumber]
        : prev.filter(id => id !== ticketNumber);
      
      // Update select all state
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
      await fetchTickets(currentPage, perPage);
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
      await fetchTickets(currentPage, perPage);
    } catch (error) {
      toast.error('Failed to flag tickets');
      console.error('Error flagging tickets:', error);
    }
  };

  const handleExportSelected = () => {
    if (selectedTickets.length === 0) {
      toast.error('No tickets selected for export');
      return;
    }

    const selectedTicketData = tickets.filter(ticket => 
      selectedTickets.includes(ticket.id)
    );

    // Create CSV content with selected tickets
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Ticket ID,Description,Category,Sub Category,Created By,Assigned To,Status,Priority,Site,Created On,Ticket Type,Complaint Mode,Associated To,Asset/Service Name,Task ID,Proactive/Reactive,Review,Response Escalation,Response TAT (Min),Response Time (D:H:M),Response Escalation Level,Resolution Escalation,Resolution TAT (Min),Resolution Time (D:H:M),Resolution Escalation Level\n"
      + selectedTicketData.map(ticket => 
          `"${ticket.ticket_number}","${ticket.heading}","${ticket.category_type}","${ticket.sub_category_type || ''}","${ticket.posted_by}","${ticket.assigned_to || ''}","${ticket.issue_status}","${ticket.priority}","${ticket.site_name}","${formatDate(ticket.created_at)}","${ticket.issue_type}","${ticket.complaint_mode || ''}","${ticket.assigned_to || ''}","${ticket.service_or_asset || ''}","${ticket.asset_task_occurrence_id || ''}","${ticket.proactive_reactive || ''}","${ticket.review_tracking_date || ''}","${ticket.response_escalation}","${ticket.response_tat}","${ticket.response_time || ''}","${ticket.escalation_response_name || ''}","${ticket.resolution_escalation}","${ticket.resolution_tat || ''}","${ticket.resolution_time || ''}","${ticket.escalation_resolution_name || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `selected_tickets_${selectedTickets.length}.csv`);
    link.click();

    toast.success(`Exported ${selectedTickets.length} selected tickets`);
  };

  const handleClearSelection = () => {
    setSelectedTickets([]);
    setSelectAll(false);
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Tickets</span>
          <span>&gt;</span>
          <span>Ticket List</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">TICKET LIST</h1>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {statusCards.map((card, index) => (
          <Card key={index} className={`${card.color} text-white`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{card.count}</div>
                <div className="text-sm opacity-90">{card.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
          variant="outline" 
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Button 
          onClick={handleExport}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90"
          disabled={tickets.length === 0}
        >
          <Upload className="w-4 h-4 mr-2" />
          Export
        </Button>
        <div className="ml-auto flex gap-2">
          <Input 
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button 
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Go!
          </Button>
          <Button variant="outline">Reset</Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Loading tickets...</div>
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
                  <TableHead>View</TableHead>
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
                      <Eye 
                        className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]" 
                        onClick={() => handleViewTicket(ticket.ticket_number)}
                      />
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
                {tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={27} className="text-center py-8 text-gray-500">
                      No tickets found
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
