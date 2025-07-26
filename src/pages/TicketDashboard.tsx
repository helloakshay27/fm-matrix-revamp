import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Filter, Ticket, Clock, AlertCircle, CheckCircle, BarChart3, TrendingUp, Download, Edit, Trash2, Settings, Upload, Flag, Star } from 'lucide-react';
import { TicketsFilterDialog } from '@/components/TicketsFilterDialog';
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
import { useToast } from '@/hooks/use-toast';

const ticketData = [{
  id: '2189-11106',
  taskNumber: 'test',
  description: 'Test description',
  category: 'Air Conditioner',
  subCategory: 'test',
  createdBy: 'Abhishek Sharma',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'Wings',
  floor: '1',
  area: '',
  room: '',
  priority: 'p1',
  status: 'Pending',
  createdOn: '16/06/2025 5:17 PM',
  mode: 'Call'
}, {
  id: '2189-11105',
  taskNumber: 'Test 1234',
  description: 'Another test',
  category: 'FIRE SYSTEM',
  subCategory: 'NA',
  createdBy: 'Vishal Vora',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'Wings',
  floor: '1',
  area: '',
  room: '',
  priority: 'p2',
  status: 'Closed',
  createdOn: '15/06/2025 3:30 PM',
  mode: 'Email'
}, {
  id: '2189-11104',
  taskNumber: 'Cleaning Request',
  description: 'Office cleaning',
  category: 'Cleaning',
  subCategory: 'Office',
  createdBy: 'John Doe',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'East',
  floor: '2',
  area: '',
  room: '',
  priority: 'p3',
  status: 'Pending',
  createdOn: '14/06/2025 10:15 AM',
  mode: 'Web'
}, {
  id: '2189-11103',
  taskNumber: 'Electrical Issue',
  description: 'Power outage in conference room',
  category: 'Electrical',
  subCategory: 'Power',
  createdBy: 'Sarah Johnson',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'West',
  floor: '3',
  area: 'Conference Room',
  room: 'CR-301',
  priority: 'p1',
  status: 'In Progress',
  createdOn: '13/06/2025 2:45 PM',
  mode: 'App'
}, {
  id: '2189-11102',
  taskNumber: 'Plumbing Fix',
  description: 'Leaky faucet in restroom',
  category: 'Plumbing',
  subCategory: 'Faucet',
  createdBy: 'Mike Wilson',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'North',
  floor: '1',
  area: 'Restroom',
  room: 'RR-101',
  priority: 'p2',
  status: 'Open',
  createdOn: '12/06/2025 11:30 AM',
  mode: 'Call'
}, {
  id: '2189-11101',
  taskNumber: 'HVAC Maintenance',
  description: 'Routine HVAC system check',
  category: 'HVAC',
  subCategory: 'Maintenance',
  createdBy: 'Lisa Chen',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'Central',
  floor: '2',
  area: 'Mechanical Room',
  room: 'MR-201',
  priority: 'p3',
  status: 'Pending',
  createdOn: '11/06/2025 9:00 AM',
  mode: 'Web'
}, {
  id: '2189-11100',
  taskNumber: 'Security Issue',
  description: 'Broken door lock',
  category: 'Security',
  subCategory: 'Lock',
  createdBy: 'Robert Davis',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'South',
  floor: '3',
  area: 'Office',
  room: 'OF-305',
  priority: 'p1',
  status: 'Closed',
  createdOn: '10/06/2025 4:20 PM',
  mode: 'Email'
}, {
  id: '2189-11099',
  taskNumber: 'Network Issue',
  description: 'Internet connectivity problem',
  category: 'IT',
  subCategory: 'Network',
  createdBy: 'Emma Brown',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'East',
  floor: '1',
  area: 'IT Room',
  room: 'IT-101',
  priority: 'p2',
  status: 'In Progress',
  createdOn: '09/06/2025 1:15 PM',
  mode: 'App'
}, {
  id: '2189-11098',
  taskNumber: 'Furniture Repair',
  description: 'Broken office chair',
  category: 'Furniture',
  subCategory: 'Chair',
  createdBy: 'David Miller',
  assignedTo: 'Vinayak Mane',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J2',
  wing: 'West',
  floor: '2',
  area: 'Workspace',
  room: 'WS-201',
  priority: 'p3',
  status: 'Open',
  createdOn: '08/06/2025 10:45 AM',
  mode: 'Call'
}, {
  id: '2189-11097',
  taskNumber: 'Lighting Fix',
  description: 'Flickering lights in hallway',
  category: 'Electrical',
  subCategory: 'Lighting',
  createdBy: 'Jennifer Taylor',
  assignedTo: 'Deepak Gupta',
  unit: 'Lockated',
  site: 'Lockated',
  building: 'J1',
  wing: 'North',
  floor: '2',
  area: 'Hallway',
  room: '',
  priority: 'p2',
  status: 'Pending',
  createdOn: '07/06/2025 3:00 PM',
  mode: 'Web'
}];

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
  const [visibleSections, setVisibleSections] = useState<string[]>(['statusChart', 'reactiveChart', 'categoryChart', 'agingMatrix']);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'reactiveChart', 'categoryChart', 'agingMatrix']);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);
  
  const [ticketSummary, setTicketSummary] = useState({
    total_tickets: 0,
    open_tickets: 0,
    in_progress_tickets: 0,
    closed_tickets: 0,
    complaints: 0,
    suggestions: 0,
    requests: 0
  });
  const [filters, setFilters] = useState<TicketFilters>({});
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [selectedTicketForEdit, setSelectedTicketForEdit] = useState<TicketResponse | null>(null);
  const perPage = 20;

  // Drag and drop sensors
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));

  // Fetch ticket summary from API
  const fetchTicketSummary = async () => {
    try {
      const summary = await ticketManagementAPI.getTicketSummary();
      setTicketSummary(summary);
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

  // Use ticket summary data from API
  const openTickets = ticketSummary.open_tickets;
  const inProgressTickets = ticketSummary.in_progress_tickets;
  const closedTickets = ticketSummary.closed_tickets;
  const totalSummaryTickets = ticketSummary.total_tickets;

  // Analytics data with updated colors matching design
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
  }];

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
  }];

  // Calculate category data from tickets
  const safeTickets = tickets || [];
  const categoryData = safeTickets.reduce((acc, ticket) => {
    const category = ticket.category_type;
    if (category) {
      acc[category] = (acc[category] || 0) + 1;
    }
    return acc;
  }, {});
  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));
  const agingMatrixData = [{
    priority: 'P1',
    '0-10': 20,
    '11-20': 3,
    '21-30': 4,
    '31-40': 0,
    '41-50': Math.max(203, openTickets)
  }, {
    priority: 'P2',
    '0-10': 2,
    '11-20': 0,
    '21-30': 0,
    '31-40': 0,
    '41-50': 4
  }, {
    priority: 'P3',
    '0-10': 1,
    '11-20': 0,
    '21-30': 1,
    '31-40': 0,
    '41-50': 7
  }, {
    priority: 'P4',
    '0-10': 1,
    '11-20': 0,
    '21-30': 0,
    '31-40': 0,
    '41-50': 5
  }];
  const reactiveTickets = Math.floor(safeTickets.length * 0.7);
  const proactiveTickets = safeTickets.length - reactiveTickets;
  const typeData = [{
    name: 'Open',
    value: reactiveTickets,
    color: '#c6b692'
  }, {
    name: 'Closed',
    value: proactiveTickets,
    color: '#d8dcdd'
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
    console.log('TicketDashboard - Ticket selection changed:', ticketId, isSelected);
    setSelectedTickets(prev => {
      if (isSelected) {
        return [...prev, ticketId];
      } else {
        return prev.filter(id => id !== ticketId);
      }
    });
  };
  const handleSelectAll = (isSelected: boolean) => {
    console.log('TicketDashboard - Select all changed:', isSelected);
    if (isSelected) {
      const allTicketIds = tickets.map(ticket => ticket.id);
      setSelectedTickets(allTicketIds);
    } else {
      setSelectedTickets([]);
    }
  };
  const handleClearSelection = () => {
    console.log('TicketDashboard - Clearing selection');
    setSelectedTickets([]);
  };
  const handleGoldenTicket = async () => {
    console.log('TicketDashboard - Golden Ticket action for tickets:', selectedTickets);
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
    console.log('TicketDashboard - Flag action for tickets:', selectedTickets);
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
    console.log('TicketDashboard - Single flag action for ticket:', ticketId);
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
    console.log('TicketDashboard - Single golden ticket action for ticket:', ticketId);
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
          <TabsTrigger value="tickets" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-ticket w-4 h-4" data-lov-id="src\pages\TicketDashboard.tsx:872:12" data-lov-name="Ticket" data-component-path="src\pages\TicketDashboard.tsx" data-component-line="872" data-component-file="TicketDashboard.tsx" data-component-name="Ticket" data-component-content="%7B%22className%22%3A%22w-4%20h-4%22%7D"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>
            Ticket List
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C72030" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chart-column w-4 h-4" data-lov-id="src\pages\TicketDashboard.tsx:868:12" data-lov-name="BarChart3" data-component-path="src\pages\TicketDashboard.tsx" data-component-line="868" data-component-file="TicketDashboard.tsx" data-component-name="BarChart3" data-component-content="%7B%22className%22%3A%22w-4%20h-4%22%7D"><path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">



          {/* Header with Ticket Selector */}
          <div className="flex justify-end">
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
                    {/* Top Row - Two Donut Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {chartOrder.filter(id => ['statusChart', 'reactiveChart'].includes(id)).map(chartId => {
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
                                    <div className="text-sm sm:text-lg font-semibold text-gray-700">Total : {reactiveTickets + proactiveTickets}</div>
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
                        return null;
                      })}
                    </div>

                    {/* Bottom Charts - Category and Aging Matrix */}
                    {chartOrder.filter(id => ['categoryChart', 'agingMatrix'].includes(id)).map(chartId => {
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
                                        <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['0-10']}</td>
                                        <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['11-20']}</td>
                                        <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['21-30']}</td>
                                        <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['31-40']}</td>
                                        <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">{row['41-50']}</td>
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
                                  <div className="text-2xl sm:text-4xl font-bold text-black mb-1 sm:mb-2">569 Days</div>
                                  <div className="text-sm sm:text-base text-black">Average Time Taken To Resolve A Ticket</div>
                                </div>
                              </div>
                            </div>
                          </div>
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
              value: totalTickets,
              icon: Settings
            }, {
              label: 'Open',
              value: openTickets,
              icon: Settings
            }, {
              label: 'In Progress',
              value: inProgressTickets,
              icon: Settings
            }, {
              label: 'Pending',
              value: inProgressTickets,
              icon: Settings
            }, {
              label: 'Closed',
              value: closedTickets,
              icon: Settings
            }].map((item, i) => {
              const IconComponent = item.icon;
              return <div key={i} className="p-3 sm:p-4 rounded-lg shadow-[0px_2px_18px_rgba(45,45,45,0.1)] h-[100px] sm:h-[132px] flex items-center gap-3 sm:gap-4 bg-[#f6f4ee]">
                <div className="w-[52px] h-[36px] sm:w-[62px] sm:h-[62px] rounded-lg flex items-center justify-center flex-shrink-0 bg-[rgba(199,32,48,0.08)]">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#C72030]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="text-xl sm:text-2xl font-bold leading-tight truncate text-gray-600 mb-1">{item.value}</div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium leading-tight">{item.label}</div>
                </div>
              </div>;
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
                  data={safeTickets}
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