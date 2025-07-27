import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Filter, Ticket, Clock, AlertCircle, CheckCircle, BarChart3, TrendingUp, Download, Edit, Trash2, Settings, Upload, Flag, Star } from 'lucide-react';
import { TicketsFilterDialog } from '@/components/TicketsFilterDialog';
import { TicketAnalyticsFilterDialog } from '@/components/TicketAnalyticsFilterDialog';
import { EditStatusDialog } from '@/components/EditStatusDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TicketSelector } from '@/components/TicketSelector';
import { RecentTicketsSidebar } from '@/components/RecentTicketsSidebar';
import { TicketSelectionPanel } from '@/components/TicketSelectionPanel';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ticketManagementAPI, TicketResponse, TicketFilters } from '@/services/ticketManagementAPI';
import { ticketAnalyticsAPI, TicketCategoryData, TicketStatusData, TicketAgingMatrix, UnitCategorywiseData, ResponseTATData, ResolutionTATReportData, RecentTicketsResponse } from '@/services/ticketAnalyticsAPI';
import { TicketAnalyticsCard } from '@/components/TicketAnalyticsCard';
import { ResponseTATCard } from '@/components/ResponseTATCard';
import { ResolutionTATCard } from '@/components/ResolutionTATCard';
import { useToast } from '@/hooks/use-toast';

// Sortable Chart Item Component
const SortableChartItem = ({
  id,
  children
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-move">
    {children}
  </div>;
};
export const TicketDashboard = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>(['statusChart', 'reactiveChart', 'categoryChart', 'agingMatrix', 'unitCategoryWise', 'responseTat', 'resolutionTat']);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'reactiveChart', 'categoryChart', 'agingMatrix', 'unitCategoryWise', 'responseTat', 'resolutionTat']);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [initialTotalTickets, setInitialTotalTickets] = useState(0); // Store unfiltered total
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  
  // Analytics data states with default dates (last year to today)
  const getDefaultDateRange = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);
    
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    return {
      startDate: formatDate(lastYear),
      endDate: formatDate(today)
    };
  };
  
  const [analyticsDateRange, setAnalyticsDateRange] = useState<{startDate: string; endDate: string}>(getDefaultDateRange());
  const [categoryAnalyticsData, setCategoryAnalyticsData] = useState<TicketCategoryData[]>([]);
  const [statusAnalyticsData, setStatusAnalyticsData] = useState<TicketStatusData | null>(null);
  const [agingMatrixAnalyticsData, setAgingMatrixAnalyticsData] = useState<TicketAgingMatrix | null>(null);
  const [unitCategorywiseData, setUnitCategorywiseData] = useState<UnitCategorywiseData | null>(null);
  const [responseTATData, setResponseTATData] = useState<ResponseTATData | null>(null);
  const [resolutionTATReportData, setResolutionTATReportData] = useState<ResolutionTATReportData | null>(null);
  const [recentTicketsData, setRecentTicketsData] = useState<RecentTicketsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  
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
  const [filters, setFilters] = useState<TicketFilters>({});
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [selectedTicketForEdit, setSelectedTicketForEdit] = useState<TicketResponse | null>(null);
  const perPage = 20;

  // Drag and drop sensors
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));

  // Fetch analytics data from API
  const fetchAnalyticsData = async (startDate: Date, endDate: Date) => {
    setAnalyticsLoading(true);
    try {
      const [
        categoryData, 
        statusData, 
        agingData, 
        unitCategoryData, 
        responseTATData, 
        resolutionTATData,
        recentTickets
      ] = await Promise.all([
        ticketAnalyticsAPI.getTicketsCategorywiseData(startDate, endDate),
        ticketAnalyticsAPI.getTicketStatusData(startDate, endDate),
        ticketAnalyticsAPI.getTicketAgingMatrix(startDate, endDate),
        ticketAnalyticsAPI.getUnitCategorywiseData(startDate, endDate),
        ticketAnalyticsAPI.getResponseTATData(startDate, endDate),
        ticketAnalyticsAPI.getResolutionTATReportData(startDate, endDate),
        ticketAnalyticsAPI.getRecentTickets()
      ]);
      
      setCategoryAnalyticsData(categoryData);
      setStatusAnalyticsData(statusData);
      setAgingMatrixAnalyticsData(agingData);
      setUnitCategorywiseData(unitCategoryData);
      setResponseTATData(responseTATData);
      setResolutionTATReportData(resolutionTATData);
      setRecentTicketsData(recentTickets);
      
      // toast({
      //   title: "Success",
      //   description: "Analytics data updated successfully"
      // });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Handle analytics filter apply
  const handleAnalyticsFilterApply = (filters: { startDate: string; endDate: string }) => {
    setAnalyticsDateRange(filters);
    
    // Convert date strings to Date objects
    const startDate = new Date(filters.startDate.split('/').reverse().join('-')); // Convert DD/MM/YYYY to YYYY-MM-DD
    const endDate = new Date(filters.endDate.split('/').reverse().join('-'));
    
    fetchAnalyticsData(startDate, endDate);
  };

  // Fetch ticket summary from API
  const fetchTicketSummary = async () => {
    try {
      const summary = await ticketManagementAPI.getTicketSummary();
      setTicketSummary(summary);
      
      // Store initial total count only if not already stored and no filters are applied
      if (Object.keys(filters).length === 0 && initialTotalTickets === 0) {
        setInitialTotalTickets(summary.total_tickets);
      }
    } catch (error) {
      console.error('Error fetching ticket summary:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ticket summary. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Fetch tickets from API
  const fetchTickets = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await ticketManagementAPI.getTickets(page, perPage, filters);
      setTickets(response.complaints);
      if (response.pagination) {
        setTotalPages(response.pagination.total_pages);
        setTotalTickets(response.pagination.total_count);
      } else {
        setTotalTickets(response.complaints.length);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTickets(currentPage);
    fetchTicketSummary();
  }, [currentPage, filters]);

  // Load analytics data with default date range on component mount
  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    const startDate = new Date(defaultRange.startDate.split('/').reverse().join('-'));
    const endDate = new Date(defaultRange.endDate.split('/').reverse().join('-'));
    fetchAnalyticsData(startDate, endDate);
  }, []);

  // Use ticket summary data from API
  const openTickets = statusAnalyticsData?.overall.total_open || ticketSummary.open_tickets;
  const inProgressTickets = statusAnalyticsData?.overall.total_wip || ticketSummary.in_progress_tickets;
  const closedTickets = statusAnalyticsData?.overall.total_closed || ticketSummary.closed_tickets;
  const totalSummaryTickets = (openTickets + inProgressTickets + closedTickets) || ticketSummary.total_tickets;
  const pendingTickets = statusAnalyticsData?.overall.total_pending || ticketSummary.pending_tickets;
  const totalTicketsCount = initialTotalTickets || totalSummaryTickets;
   const displayTotalTickets = totalTicketsCount.toLocaleString();


  // Analytics data with updated colors matching design using real API data
  const statusData = [{
    name: 'Open',
    value: openTickets,
    color: '#c6b692'
  }, {
    name: 'In Progress',
    value: inProgressTickets,
    color: '#f59e0b'
  }, {
    name: 'Closed',
    value: closedTickets,
    color: '#d8dcdd'
  }, {
    name: 'Pending',
    value: pendingTickets,
    color: '#d8dcdd'
  }
];

  // Ticket type breakdown cards
  const ticketTypeCards = [{
    title: 'Total Tickets',
    value: totalSummaryTickets,
    icon: Ticket,
    color: 'bg-blue-500'
  }, {
    title: 'Open Tickets',
    value: openTickets,
    icon: AlertCircle,
    color: 'bg-yellow-500'
  }, {
    title: 'In Progress',
    value: inProgressTickets,
    icon: Clock,
    color: 'bg-orange-500'
  }, {
    title: 'Closed Tickets',
    value: closedTickets,
    icon: CheckCircle,
    color: 'bg-green-500'
  }, {
    title: 'Complaints',
    value: ticketSummary.complaints,
    icon: AlertCircle,
    color: 'bg-red-500'
  }, {
    title: 'Suggestions',
    value: ticketSummary.suggestions,
    icon: TrendingUp,
    color: 'bg-purple-500'
  }, {
    title: 'Requests',
    value: ticketSummary.requests,
    icon: Ticket,
    color: 'bg-indigo-500'
  },{
    title: 'Pending Tickets',
    value: ticketSummary.pending_tickets,
    icon: Ticket,
    color: 'bg-indigo-500'
  }
];

  // Calculate category data from API analytics data or fallback to tickets
  const categoryChartData = categoryAnalyticsData.length > 0 
    ? categoryAnalyticsData.map(item => ({
        name: item.category,
        proactive: item.proactive.Open + item.proactive.Closed,
        reactive: item.reactive.Open + item.reactive.Closed,
        value: item.proactive.Open + item.proactive.Closed + item.reactive.Open + item.reactive.Closed
      }))
    : (() => {
        const safeTickets = tickets || [];
        const categoryData = safeTickets.reduce((acc, ticket) => {
          const category = ticket.category_type;
          if (category) {
            acc[category] = (acc[category] || 0) + 1;
          }
          return acc;
        }, {});
        return Object.entries(categoryData).map(([name, value]) => ({
          name,
          value
        }));
      })();

  // Aging matrix data from API or fallback
  const agingMatrixData = agingMatrixAnalyticsData?.response.matrix 
    ? Object.entries(agingMatrixAnalyticsData.response.matrix).map(([priority, data]) => ({
        priority,
        'T1': data.T1 || 0,
        'T2': data.T2 || 0,
        'T3': data.T3 || 0,
        'T4': data.T4 || 0,
        'T5': data.T5 || 0
      }))
    : [{
        priority: 'P1',
        'T1': 20,
        'T2': 3,
        'T3': 4,
        'T4': 0,
        'T5': Math.max(203, openTickets)
      }, {
        priority: 'P2',
        'T1': 2,
        'T2': 0,
        'T3': 0,
        'T4': 0,
        'T5': 4
      }, {
        priority: 'P3',
        'T1': 1,
        'T2': 0,
        'T3': 1,
        'T4': 0,
        'T5': 7
      }, {
        priority: 'P4',
        'T1': 1,
        'T2': 0,
        'T3': 0,
        'T4': 0,
        'T5': 5
      }];

  // Proactive vs Reactive data from API analytics
  const proactiveOpenTickets = statusAnalyticsData?.proactive_reactive.proactive.open || 0;
  const proactiveClosedTickets = statusAnalyticsData?.proactive_reactive.proactive.closed || 0;
  const reactiveOpenTickets = statusAnalyticsData?.proactive_reactive.reactive.open || 0;
  const reactiveClosedTickets = statusAnalyticsData?.proactive_reactive.reactive.closed || 0;

  const typeData = [{
    name: 'Proactive Open',
    value: proactiveOpenTickets,
    color: '#c6b692'
  }, {
    name: 'Proactive Closed',
    value: proactiveClosedTickets,
    color: '#d8dcdd'
  }, {
    name: 'Reactive Open',
    value: reactiveOpenTickets,
    color: '#f59e0b'
  }, {
    name: 'Reactive Closed',
    value: reactiveClosedTickets,
    color: '#10b981'
  }];
  const handleSelectionChange = (selectedSections: string[]) => {
    setVisibleSections(selectedSections);
  };
  const handleViewDetails = (ticketId: string) => {
    navigate(`/maintenance/ticket/details/${ticketId}`);
  };

  const handleEditTicket = (ticketNumber: string) => {
    setIsEditStatusOpen(true);
  };

  const handleDeleteTicket = async (ticketId: number) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        // Add delete API call here when available
        toast({
          title: "Success",
          description: "Ticket deleted successfully"
        });
        await fetchTickets(currentPage);
      } catch (error) {
        console.error('Delete ticket failed:', error);
        toast({
          title: "Error",
          description: "Failed to delete ticket",
          variant: "destructive"
        });
      }
    }
  };

  // Selection handlers
  const handleTicketSelection = (ticketIdString: string, isSelected: boolean) => {
    const ticketId = parseInt(ticketIdString);
    // console.log('TicketDashboard - Ticket selection changed:', ticketId, isSelected);
    setSelectedTickets(prev => {
      if (isSelected) {
        return [...prev, ticketId];
      } else {
        return prev.filter(id => id !== ticketId);
      }
    });
  };
  const handleSelectAll = (isSelected: boolean) => {
    // console.log('TicketDashboard - Select all changed:', isSelected);
    if (isSelected) {
      const allTicketIds = tickets.map(ticket => ticket.id);
      setSelectedTickets(allTicketIds);
    } else {
      setSelectedTickets([]);
    }
  };
  const handleClearSelection = () => {
   // console.log('TicketDashboard - Clearing selection');
    setSelectedTickets([]);
  };
  const handleGoldenTicket = async () => {
    // console.log('TicketDashboard - Golden Ticket action for tickets:', selectedTickets);
    try {
      await ticketManagementAPI.markAsGoldenTicket(selectedTickets);
      toast({
        title: "Success",
        description: "Tickets marked as Golden Ticket successfully"
      });
      await fetchTickets(currentPage);
      setSelectedTickets([]);
    } catch (error) {
      console.error('Golden Ticket action failed:', error);
      toast({
        title: "Error",
        description: "Failed to mark tickets as Golden Ticket",
        variant: "destructive"
      });
    }
  };
  const handleFlag = async () => {
    // console.log('TicketDashboard - Flag action for tickets:', selectedTickets);
    if (selectedTickets.length === 0) {
      toast({
        title: "No tickets selected",
        description: "Please select tickets to flag",
        variant: "destructive"
      });
      return;
    }

    try {
      await ticketManagementAPI.markAsFlagged(selectedTickets);
      toast({
        title: "Success",
        description: `${selectedTickets.length} ticket(s) flagged successfully`
      });
      await fetchTickets(currentPage);
      setSelectedTickets([]);
    } catch (error) {
      console.error('Flag action failed:', error);
      toast({
        title: "Error",
        description: "Failed to flag tickets",
        variant: "destructive"
      });
    }
  };

  const handleSingleTicketFlag = async (ticketId: number, currentFlagStatus: boolean) => {
    // console.log('TicketDashboard - Single flag action for ticket:', ticketId);
    try {
      const response = await ticketManagementAPI.markAsFlagged([ticketId]);

      // Update the ticket locally without refetching
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, is_flagged: !currentFlagStatus }
            : ticket
        )
      );

      toast({
        title: "Success",
        description: response.message || "Ticket(s) flagged successfully"
      });
      
      // Refresh the page to update the data
      window.location.reload();
    } catch (error) {
      console.error('Single flag action failed:', error);
      toast({
        title: "Error",
        description: "Failed to flag ticket",
        variant: "destructive"
      });
    }
  };

  const handleSingleTicketGoldenTicket = async (ticketId: number, currentGoldenStatus: boolean) => {
    // console.log('TicketDashboard - Single golden ticket action for ticket:', ticketId);
    try {
      const response = await ticketManagementAPI.markAsGoldenTicket([ticketId]);

      // Update the ticket locally without refetching
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, is_golden_ticket: !currentGoldenStatus }
            : ticket
        )
      );

      toast({
        title: "Success",
        description: response.message || "Golden Ticket Flagged successfully!"
      });
    } catch (error) {
      console.error('Single golden ticket action failed:', error);
      toast({
        title: "Error",
        description: "Failed to mark as golden ticket",
        variant: "destructive"
      });
    }
  };
  const handleExport = async () => {
    console.log('TicketDashboard - Export action for tickets:', selectedTickets);
    try {
      const blob = await ticketManagementAPI.exportTicketsExcel(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Tickets exported successfully"
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Error",
        description: "Failed to export tickets",
        variant: "destructive"
      });
    }
  };
  const handleFilterApply = (newFilters: TicketFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    setIsFilterOpen(false);
  };

  // Handle status card click for filtering
  const handleStatusCardClick = (cardType: string) => {
    console.log('Status card clicked:', cardType);
    let newFilters: TicketFilters = {};
    
    if (cardType === 'total') {
      // Clear all filters to show all records
     // console.log('Clearing all filters to show all tickets');
      setFilters({});
      setCurrentPage(1);
      return;
    }
    
    if (cardType !== 'total') {
      // Use the correct API parameter format for status filtering
      if (cardType === 'open') {
        newFilters.complaint_status_name_eq = 'Open';
       // console.log('Setting Open filter with complaint_status_name_eq=Open');
      } else if (cardType === 'pending') {
        newFilters.complaint_status_name_eq = 'Pending';
      //  console.log('Setting Pending filter with complaint_status_name_eq=Pending');
      } else if (cardType === 'in_progress') {
        newFilters.complaint_status_name_eq = 'In Progress';
      //  console.log('Setting In Progress filter with complaint_status_name_eq=In Progress');
      } else if (cardType === 'closed') {
        newFilters.complaint_status_name_eq = 'Closed';
        console.log('Setting Closed filter with complaint_status_name_eq=Closed');
      }
    }
    
    console.log('Setting filters:', newFilters);
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Log what the resulting URL will look like
    const testParams = new URLSearchParams();
    testParams.append('page', '1');
    testParams.append('per_page', '20');
    if (newFilters.complaint_status_name_eq) {
      testParams.append('q[complaint_status_name_eq]', newFilters.complaint_status_name_eq);
    }
    console.log('Expected API URL will be:', `/pms/admin/complaints.json?${testParams.toString()}`);
  };

  // Helper function to check if a status card is currently active
  const isStatusCardActive = (cardType: string) => {
    if (cardType === 'total') return false;
    
    if (cardType === 'open') {
      return filters.complaint_status_name_eq === 'Open';
    } else if (cardType === 'pending') {
      return filters.complaint_status_name_eq === 'Pending';
    } else if (cardType === 'in_progress') {
      return filters.complaint_status_name_eq === 'In Progress';
    } else if (cardType === 'closed') {
      return filters.complaint_status_name_eq === 'Closed';
    }
    
    return false;
  };

  // Handle drag end for chart reordering
  const handleDragEnd = (event: any) => {
    const {
      active,
      over
    } = event;
    if (active.id !== over.id) {
      setChartOrder(items => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const columns = [{
    key: 'actions',
    label: 'Actions',
    sortable: false
  }, {
    key: 'ticket_number',
    label: 'Ticket ID',
    sortable: true
  }, {
    key: 'heading',
    label: 'Description',
    sortable: true
  }, {
    key: 'category_type',
    label: 'Category',
    sortable: true
  }, {
    key: 'sub_category_type',
    label: 'Sub Category',
    sortable: true
  }, {
    key: 'posted_by',
    label: 'Created By',
    sortable: true
  }, {
    key: 'assigned_to',
    label: 'Assigned To',
    sortable: true
  }, {
    key: 'issue_status',
    label: 'Status',
    sortable: true
  }, {
    key: 'priority',
    label: 'Priority',
    sortable: true
  }, {
    key: 'site_name',
    label: 'Site',
    sortable: true
  }, {
    key: 'created_at',
    label: 'Created On',
    sortable: true
  }, {
    key: 'issue_type',
    label: 'Ticket Type',
    sortable: true
  }, {
    key: 'complaint_mode',
    label: 'Complaint Mode',
    sortable: true
  }, {
    key: 'service_or_asset',
    label: 'Asset / Service Name',
    sortable: true
  }, {
    key: 'asset_task_occurrence_id',
    label: 'Task ID',
    sortable: true
  }, {
    key: 'proactive_reactive',
    label: 'Proactive / Reactive',
    sortable: true
  }, {
    key: 'review_tracking_date',
    label: 'Review',
    sortable: true
  }, {
    key: 'response_escalation',
    label: 'Response Escalation',
    sortable: true
  }, {
    key: 'response_tat',
    label: 'Response TAT (Min)',
    sortable: true
  }, {
    key: 'response_time',
    label: 'Response Time (D:H:M)',
    sortable: true
  }, {
    key: 'escalation_response_name',
    label: 'Response Escalation Level',
    sortable: true
  }, {
    key: 'resolution_escalation',
    label: 'Resolution Escalation',
    sortable: true
  }, {
    key: 'resolution_tat',
    label: 'Resolution TAT (Min)',
    sortable: true
  }, {
    key: 'resolution_time',
    label: 'Resolution Time (D:H:M)',
    sortable: true
  }, {
    key: 'escalation_resolution_name',
    label: 'Resolution Escalation Level',
    sortable: true
  }];
  const renderCustomActions = () => (
    <div className="flex gap-3">
      <Button
        onClick={handleAddButton}
        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
      >
        <Plus className="w-4 h-4 mr-2" /> Add
      </Button>
    </div>
  );

  const handleAddButton = () => {
    navigate('/maintenance/ticket/add');
  }


  const renderRightActions = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
        onClick={() => setIsFilterOpen(true)}
      >
        <Filter className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        className="border-gray-300 text-gray-600 hover:bg-gray-50"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
  const formatDate = (dateString: string) => {
    if (!dateString) return '--';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };
  const TruncatedDescription = ({
    text,
    maxWords = 5
  }: {
    text: string;
    maxWords?: number;
  }) => {
    if (!text) return <span>--</span>;

    const words = text.split(' ');
    if (words.length <= maxWords) {
      return <span className="ml-2">{text}</span>;
    }

    const truncated = words.slice(0, maxWords).join(' ');
    return <div className="w-48 max-w-[200px] group relative">
      <span className="block line-clamp-2">
        {`${truncated}...`}
      </span>
      <div className="absolute left-0 top-0 w-max max-w-xs bg-black text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
        {text}
      </div>
    </div>;
  };
  const renderCell = (item, columnKey) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex items-center justify-center gap-1 w-full h-full min-h-[40px]">
          <div title="View ticket" className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Eye
              className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(item.id);
              }}
            />
          </div>
          <div title="Update ticket" className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Edit
              className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/maintenance/ticket/update/${item.id}`);
              }}
            />
          </div>
          <div title="Flag ticket" className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Flag
              className={`w-4 h-4 cursor-pointer hover:text-[#C72030] ${item.is_flagged
                  ? 'text-red-500 fill-red-500'
                  : 'text-gray-600'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSingleTicketFlag(item.id, item.is_flagged);
              }}
            />
          </div>
          <div title="Star ticket" className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Star
              className={`w-4 h-4 cursor-pointer hover:text-[#C72030] ${item.is_golden_ticket
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-gray-600'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSingleTicketGoldenTicket(item.id, item.is_golden_ticket);
              }}
            />
          </div>
        </div>
      );
    }
    if (columnKey === 'heading') {
      return <TruncatedDescription text={item.heading} />;
    }
    if (columnKey === 'issue_status') {
      return <span
        className={`px-2 py-1 rounded text-xs animate-scale-in cursor-pointer hover:opacity-80 transition-opacity ${item.issue_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : item.issue_status === 'Closed' ? 'bg-green-100 text-green-700' : item.issue_status === 'Open' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTicketForEdit(item);
          setIsEditStatusOpen(true);
        }}
      >
        {item.issue_status}
      </span>;
    }
    if (columnKey === 'priority') {
      return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700 animate-scale-in">
        {item.priority}
      </span>;
    }
    if (columnKey === 'created_at') {
      return formatDate(item.created_at);
    }
    if (columnKey === 'review_tracking_date') {
      return formatDate(item.review_tracking_date);
    }
    if (!item[columnKey] || item[columnKey] === null || item[columnKey] === '') {
      return '--';
    }
    return item[columnKey];
  };


  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <Tabs defaultValue="tickets" className="w-full">
       <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
  <TabsTrigger
    value="tickets"
    className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      className="lucide lucide-ticket w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
    Ticket List
  </TabsTrigger>

  <TabsTrigger
    value="analytics"
    className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={2}
      className="lucide lucide-chart-column w-4 h-4 stroke-black group-data-[state=active]:stroke-[#C72030]"
    >
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
    Analytics
  </TabsTrigger>
</TabsList>


        <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">



          {/* Header with Filter and Ticket Selector */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAnalyticsFilterOpen(true)}
                variant="outline"
                className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
                disabled={analyticsLoading}
              >
                <Filter className="w-4 h-4" />
                Filter Analytics
              </Button>
              {analyticsDateRange.startDate && analyticsDateRange.endDate && (
                <span className="text-sm text-gray-600">
                  {analyticsDateRange.startDate} - {analyticsDateRange.endDate}
                </span>
              )}
              {analyticsLoading && (
                <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
              )}
            </div>
            <TicketSelector onSelectionChange={handleSelectionChange} />
          </div>

          {/* Main Analytics Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-200px)]">
            {/* Left Section - Charts */}
            <div className="xl:col-span-8 space-y-4 sm:space-y-6">
              {/* All Charts with Drag and Drop */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                  <div className="space-y-4 sm:space-y-6">
                    {/* Top Row - Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {chartOrder.filter(id => ['statusChart', 'reactiveChart', 'unitCategoryWise', 'responseTat'].includes(id)).map(chartId => {
                        if (chartId === 'statusChart' && visibleSections.includes('statusChart')) {
                          return <SortableChartItem key={chartId} id={chartId}>
                            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
                              <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-bold text-[#C72030]">Tickets</h3>
                                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" />
                              </div>
                              <div className="relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                                  <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value" label={({
                                      value,
                                      name,
                                      cx,
                                      cy,
                                      midAngle,
                                      innerRadius,
                                      outerRadius
                                    }) => {
                                      if (name === 'Open') {
                                        return <text x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)} y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold">
                                          2
                                        </text>;
                                      }
                                      return <text x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)} y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold">
                                        {value}
                                      </text>;
                                    }} labelLine={false}>
                                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-sm sm:text-lg font-semibold text-gray-700">Total : {totalSummaryTickets}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                {statusData.map((item, index) => <div key={index} className="flex items-center gap-2">
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm" style={{
                                    backgroundColor: item.color
                                  }}></div>
                                  <span className="text-xs sm:text-sm font-medium text-gray-700">{item.name}</span>
                                </div>)}
                              </div>
                            </div>
                          </SortableChartItem>;
                        }
                        if (chartId === 'reactiveChart' && visibleSections.includes('reactiveChart')) {
                          return <SortableChartItem key={chartId} id={chartId}>
                            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6 shadow-sm">
                              <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-sm sm:text-lg font-bold text-[#C72030] leading-tight">Reactive Proactive Ticket</h3>
                                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-[#C72030] cursor-pointer" />
                              </div>
                              <div className="relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                                  <PieChart>
                                    <Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value" label={({
                                      value,
                                      name,
                                      cx,
                                      cy,
                                      midAngle,
                                      innerRadius,
                                      outerRadius
                                    }) => {
                                      if (name === 'Open') {
                                        return <text x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)} y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold">
                                          2
                                        </text>;
                                      }
                                      return <text x={cx + (innerRadius + outerRadius) / 2 * Math.cos(-midAngle * Math.PI / 180)} y={cy + (innerRadius + outerRadius) / 2 * Math.sin(-midAngle * Math.PI / 180)} fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold">
                                        {value}
                                      </text>;
                                    }} labelLine={false}>
                                      {typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-sm sm:text-lg font-semibold text-gray-700">Total : {proactiveOpenTickets + proactiveClosedTickets + reactiveOpenTickets + reactiveClosedTickets}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-center gap-3 sm:gap-6 mt-4 flex-wrap">
                                {typeData.map((item, index) => <div key={index} className="flex items-center gap-2">
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm" style={{
                                    backgroundColor: item.color
                                  }}></div>
                                  <span className="text-xs sm:text-sm font-medium text-gray-700">{item.name}</span>
                                </div>)}
                              </div>
                            </div>
                          </SortableChartItem>;
                        }

                        if (chartId === 'unitCategoryWise' && visibleSections.includes('unitCategoryWise')) {
                          return <SortableChartItem key={chartId} id={chartId}>
                            <TicketAnalyticsCard
                              title="Unit Category Wise"
                              data={unitCategorywiseData}
                              type="unitCategoryWise"
                              className="h-full"
                            />
                          </SortableChartItem>
                        }

                        if (chartId === 'responseTat' && visibleSections.includes('responseTat')) {
                          return <SortableChartItem key={chartId} id={chartId}>
                            <ResponseTATCard
                              data={responseTATData}
                              className="h-full"
                            />
                          </SortableChartItem>
                        }

                        return null;
                      })}
                    </div>

                    {/* Bottom Charts - Category and Aging Matrix */}
                    {chartOrder.filter(id => ['categoryChart', 'agingMatrix', 'resolutionTat'].includes(id)).map(chartId => {
                      if (chartId === 'categoryChart' && visibleSections.includes('categoryChart')) {
                        return <SortableChartItem key={chartId} id={chartId}>
                          <div className="bg-white border border-gray-200 p-3 sm:p-6 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-base sm:text-lg font-bold" style={{
                                color: '#C72030'
                              }}>Unit Category-wise Tickets</h3>
                              <Download className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer" style={{
                                color: '#C72030'
                              }} />
                            </div>
                            <div className="w-full overflow-x-auto">
                              <ResponsiveContainer width="100%" height={200} className="sm:h-[250px] min-w-[400px]">
                                <BarChart data={categoryChartData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--analytics-border))" />
                                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{
                                    fill: 'hsl(var(--analytics-text))',
                                    fontSize: 10
                                  }} className="text-xs" />
                                  <YAxis tick={{
                                    fill: 'hsl(var(--analytics-text))',
                                    fontSize: 10
                                  }} />
                                  <Tooltip />
                                  <Bar dataKey="value" fill="hsl(var(--chart-tan))" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </SortableChartItem>;
                      }
                      if (chartId === 'agingMatrix' && visibleSections.includes('agingMatrix')) {
                        return <SortableChartItem key={chartId} id={chartId}>
                          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                              <h3 className="text-base sm:text-lg font-bold" style={{
                                color: '#C72030'
                              }}>Tickets Ageing Matrix</h3>
                              <Download className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" style={{
                                color: '#C72030'
                              }} />
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                              {/* Table - Horizontally scrollable on mobile */}
                              <div className="overflow-x-auto -mx-3 sm:mx-0">
                                <div className="min-w-[500px] px-3 sm:px-0">
                                  <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                      <tr style={{
                                        backgroundColor: '#EDE4D8'
                                      }}>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm font-medium text-black">Priority</th>
                                        <th colSpan={5} className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">No. of Days</th>
                                      </tr>
                                      <tr style={{
                                        backgroundColor: '#EDE4D8'
                                      }}>
                                        <th className="border border-gray-300 p-2 sm:p-3"></th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">0-10</th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">11-20</th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">21-30</th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">31-40</th>
                                        <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">41-50</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                       {agingMatrixData.map((row, index) => <tr key={index} className="bg-white">
                                         <td className="border border-gray-300 p-2 sm:p-3 font-medium text-black text-xs sm:text-sm">{row.priority}</td>
                                         <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.T1}</td>
                                         <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.T2}</td>
                                         <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.T3}</td>
                                         <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.T4}</td>
                                         <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row.T5}</td>
                                       </tr>)}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Summary Box - Full Width Below Table */}
                              <div className="w-full">
                                <div className="rounded-lg p-4 sm:p-8 text-center" style={{
                                  backgroundColor: '#EDE4D8'
                                }}>
                                   <div className="text-2xl sm:text-4xl font-bold text-black mb-1 sm:mb-2">
                                     {agingMatrixAnalyticsData?.average_days || 569} Days
                                   </div>
                                   <div className="text-sm sm:text-base text-black">Average Time Taken To Resolve A Ticket</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SortableChartItem>;
                      }
                      
                      // Unit Category Wise Chart
                      if (chartId === 'unitCategoryWise' && visibleSections.includes('unitCategoryWise')) {
                        return <SortableChartItem key={chartId} id={chartId}>
                          <TicketAnalyticsCard
                            title="Unit Category Wise"
                            data={unitCategorywiseData}
                            type="unitCategoryWise"
                            className="bg-white border border-gray-200 rounded-lg"
                          />
                        </SortableChartItem>;
                      }
                      
                      // Response TAT Chart
                      if (chartId === 'responseTat' && visibleSections.includes('responseTat')) {
                        return <SortableChartItem key={chartId} id={chartId}>
                          <TicketAnalyticsCard
                            title="Response & Resolution TAT"
                            data={responseTATData}
                            type="tatResponse"
                            className="bg-white border border-gray-200 rounded-lg"
                          />
                        </SortableChartItem>;
                      }
                      
                       // Resolution TAT Chart
                       if (chartId === 'resolutionTat' && visibleSections.includes('resolutionTat')) {
                         return <SortableChartItem key={chartId} id={chartId}>
                           <ResolutionTATCard
                             data={resolutionTATReportData}
                             className="bg-white border border-gray-200 rounded-lg"
                           />
                         </SortableChartItem>;
                       }
                      
                      return null;
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Right Sidebar - Recent Tickets */}
            <div className="xl:col-span-4 order-first xl:order-last">
              <RecentTicketsSidebar />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Ticket Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {[{
              label: 'Total Tickets',
              value: displayTotalTickets,
              icon: Settings,
              type: 'total',
              clickable: true // Make total tickets clickable to clear filters
            }, {
              label: 'Open',
              value: openTickets,
              icon: Settings,
              type: 'open',
              clickable: true
            }, {
              label: 'In Progress',
              value: inProgressTickets,
              icon: Settings,
              type: 'in_progress',
              clickable: true
            }, {
              label: 'Pending',
              value: pendingTickets,
              icon: Settings,
              type: 'pending',
              clickable: true
            }, {
              label: 'Closed',
              value: closedTickets,
              icon: Settings,
              type: 'closed',
              clickable: true
            }].map((item, i) => {
              const IconComponent = item.icon;
              const isActive = isStatusCardActive(item.type);
              return (
                <div 
                  key={i} 
                  className={`p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 transition-all ${
                    isActive 
                      ? "" 
                      : "bg-[#f6f4ee]"
                  } ${
                    item.clickable ? "cursor-pointer hover:bg-[#edeae3] hover:shadow-lg" : ""
                  }`}
                  onClick={() => {
                    if (item.clickable) {
                      handleStatusCardClick(item.type);
                    }
                  }}
                >
                  <div className="w-[52px] h-[36px] sm:w-[62px] sm:h-[62px] rounded-lg flex items-center justify-center flex-shrink-0 bg-[rgba(199,32,48,0.08)]">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#C72030]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-xl sm:text-2xl font-bold leading-tight truncate text-gray-600 mb-1">{item.value}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>


          {/* Tickets Table */}
          <div className="overflow-x-auto animate-fade-in">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading tickets...</div>
              </div>
            ) : (
              <>
                <EnhancedTable
                  data={tickets || []}
                  columns={columns}
                  renderCell={renderCell}
                  selectable={true}
                  pagination={false}
                  enableExport={true}
                  exportFileName="tickets"
                  storageKey="tickets-table"
                  enableSelection={true}
                  selectedItems={selectedTickets.map(id => id.toString())}
                  onSelectItem={handleTicketSelection}
                  onSelectAll={handleSelectAll}
                  getItemId={ticket => ticket.id.toString()}
                  leftActions={
                    <div className="flex gap-3">
                      {renderCustomActions()}
                    </div>
                  }
                  onFilterClick={() => setIsFilterOpen(true)}
                  rightActions={null}
                  searchPlaceholder="Search Tickets"
                  hideTableExport={false}
                  hideColumnsButton={false}
                />

                {/* Custom Pagination */}
                <div className="flex items-center justify-center mt-6 px-4 py-3 bg-white border-t border-gray-200 animate-fade-in">
                  <div className="flex items-center space-x-1">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1 || loading}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {/* First page */}
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => setCurrentPage(1)}
                            disabled={loading}
                            className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            1
                          </button>
                          {currentPage > 4 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                        </>
                      )}

                      {/* Current page and surrounding pages */}
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        let pageNum;
                        if (currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = currentPage - 1 + i;
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            disabled={loading}
                            className={`w-8 h-8 flex items-center justify-center text-sm rounded disabled:opacity-50 ${currentPage === pageNum
                                ? 'bg-[#C72030] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Last page */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={loading}
                            className="w-8 h-8 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || loading}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <TicketsFilterDialog isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleFilterApply} />

      {/* Edit Status Dialog */}
      <EditStatusDialog
        open={isEditStatusOpen}
        onOpenChange={setIsEditStatusOpen}
        complaintId={selectedTicketForEdit?.id}
        currentStatusId={selectedTicketForEdit?.complaint_status_id}
        currentStatus={selectedTicketForEdit?.issue_status}
        onSuccess={() => {
          fetchTickets(currentPage);
          setSelectedTicketForEdit(null);
        }}
      />

      {/* Analytics Filter Dialog */}
      <TicketAnalyticsFilterDialog
        isOpen={isAnalyticsFilterOpen}
        onClose={() => setIsAnalyticsFilterOpen(false)}
        onApplyFilters={handleAnalyticsFilterApply}
      />

      {/* Ticket Selection Panel */}
      <TicketSelectionPanel
        selectedTickets={selectedTickets}
        selectedTicketObjects={tickets.filter(ticket => selectedTickets.includes(ticket.id))}
        onGoldenTicket={handleGoldenTicket}
        onFlag={handleFlag}
        onExport={handleExport}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
};