// ticket dahboard


import React, { useState, useEffect, useCallback, useRef, useMemo, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Filter, Ticket, Clock, AlertCircle, CheckCircle, BarChart3, TrendingUp, Download, Edit, Trash2, Settings, Upload, Flag, Star, Calendar } from 'lucide-react';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { TicketsFilterDialog } from '@/components/TicketsFilterDialog';
import { TicketAnalyticsFilterDialog } from '@/components/TicketAnalyticsFilterDialog';
import { EditStatusDialog } from '@/components/EditStatusDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TicketSelector } from '@/components/TicketSelector';
import { RecentTicketsSidebar } from '@/components/RecentTicketsSidebar';
import { TicketSelectionPanel } from '@/components/TicketSelectionPanel';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ticketManagementAPI, EscalationInfo } from '@/services/ticketManagementAPI';
import { employeeTicketAPI, EmployeeTicketResponse, EmployeeTicketFilters } from '@/services/employeeTicketAPI';
import { ticketAnalyticsAPI, TicketCategoryData, TicketStatusData, TicketAgingMatrix, UnitCategorywiseData, ResponseTATData, ResolutionTATReportData, RecentTicketsResponse } from '@/services/ticketAnalyticsAPI';
import { ticketAnalyticsDownloadAPI } from '@/services/ticketAnalyticsDownloadAPI';
import { TicketAnalyticsCard } from '@/components/TicketAnalyticsCard';
import { ResponseTATCard } from '@/components/ResponseTATCard';
import { ResolutionTATCard } from '@/components/ResolutionTATCard';
import {
  TicketStatusOverviewCard,
  ProactiveReactiveCard,
  CategoryWiseProactiveReactiveCard,
  UnitCategoryWiseCard,
  TicketAgingMatrixCard
} from '@/components/ticket-analytics';
import { useDebounce } from '@/hooks/useDebounce';
import { toast as sonnerToast } from 'sonner';

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

  // Handle pointer down to prevent drag on button/icon clicks
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Check if the click is on a button, icon, or download element
    if (
      target.closest('button') ||
      target.closest('[data-download]') ||
      target.closest('svg') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SVG' ||
      target.closest('.download-btn') ||
      target.closest('[data-download-button]')
    ) {
      e.stopPropagation();
      return;
    }
    // For other elements, proceed with drag
    if (listeners?.onPointerDown) {
      listeners.onPointerDown(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
      className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md group"
    >
      {children}
    </div>
  );
};

// Section Loader Component
const SectionLoader: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ loading, children, className }) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 z-10 rounded-lg bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

export const TicketDashboardEmployee = () => {
  const navigate = useNavigate();
  // Initialize permission hook
  const { shouldShow } = useDynamicPermissions();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>(['statusChart', 'reactiveChart', 'responseTat', 'categoryWiseProactiveReactive', 'categoryChart', 'agingMatrix', 'resolutionTat']);
  const [chartOrder, setChartOrder] = useState<string[]>(['statusChart', 'reactiveChart', 'responseTat', 'categoryWiseProactiveReactive', 'categoryChart', 'agingMatrix', 'resolutionTat']);
  const [tickets, setTickets] = useState<EmployeeTicketResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
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

  const [analyticsDateRange, setAnalyticsDateRange] = useState<{ startDate: string; endDate: string }>(getDefaultDateRange());
  const [categoryAnalyticsData, setCategoryAnalyticsData] = useState<TicketCategoryData[]>([]);
  const [categorywiseTicketsData, setCategorywiseTicketsData] = useState<TicketCategoryData[]>([]);
  const [statusAnalyticsData, setStatusAnalyticsData] = useState<TicketStatusData | null>(null);
  const [agingMatrixAnalyticsData, setAgingMatrixAnalyticsData] = useState<TicketAgingMatrix | null>(null);
  const [unitCategorywiseData, setUnitCategorywiseData] = useState<UnitCategorywiseData | null>(null);
  const [responseTATData, setResponseTATData] = useState<ResponseTATData | null>(null);
  const [resolutionTATReportData, setResolutionTATReportData] = useState<ResolutionTATReportData | null>(null);
  const [recentTicketsData, setRecentTicketsData] = useState<RecentTicketsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsLoaded, setAnalyticsLoaded] = useState(false); // Track if analytics data has been loaded
  
  // Individual loading states for each analytics card
  const [loadingStates, setLoadingStates] = useState({
    statusChart: false,
    reactiveChart: false,
    responseTat: false,
    categoryWiseProactiveReactive: false,
    categoryChart: false,
    agingMatrix: false,
    resolutionTat: false
  });

  // Utility function to convert DD/MM/YYYY to Date object
  const convertDateStringToDate = (dateString: string): Date => {
    try {
      const [day, month, year] = dateString.split('/');
      // Create date at noon UTC to avoid timezone issues
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0, 0);
      console.log('convertDateStringToDate:', { input: dateString, output: date, formatted: date.toISOString() });
      return date;
    } catch (error) {
      console.error('Error converting date string:', dateString, error);
      return new Date(); // Fallback to current date
    }
  };

  // Test case for date conversion
  React.useEffect(() => {
    // Test the date conversion with your example
    const testStartDate = '28/07/2025';
    const testEndDate = '29/07/2025';
    const convertedStart = convertDateStringToDate(testStartDate);
    const convertedEnd = convertDateStringToDate(testEndDate);

    const formatDateForAPI = (date: Date): string => {
      // Use UTC methods to avoid timezone issues
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const day = date.getUTCDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    console.log('Date Conversion Test:', {
      input: { start: testStartDate, end: testEndDate },
      converted: { start: convertedStart, end: convertedEnd },
      apiFormat: {
        start: formatDateForAPI(convertedStart),
        end: formatDateForAPI(convertedEnd)
      }
    });
  }, []);

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
  const [filters, setFilters] = useState<EmployeeTicketFilters>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Optimized debounce timing
  const isSearchingRef = useRef(false);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);
  const [selectedTicketForEdit, setSelectedTicketForEdit] = useState<EmployeeTicketResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const perPage = 20;

  // Drag and drop sensors
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));

  // Fetch analytics data from API
  const fetchAnalyticsData = useCallback(async (startDate: Date, endDate: Date) => {
    setAnalyticsLoading(true);
    
    // Set all individual cards to loading
    setLoadingStates({
      statusChart: true,
      reactiveChart: true,
      responseTat: true,
      categoryWiseProactiveReactive: true,
      categoryChart: true,
      agingMatrix: true,
      resolutionTat: true
    });
    
    try {
      // Fetch all data in parallel but update states individually as they complete
      const promises = [
        ticketAnalyticsAPI.getTicketsCategorywiseData(startDate, endDate).then(data => {
          setCategoryAnalyticsData(data);
          setCategorywiseTicketsData(data);
          setLoadingStates(prev => ({ ...prev, categoryWiseProactiveReactive: false, categoryChart: false }));
          return data;
        }),
        ticketAnalyticsAPI.getTicketStatusData(startDate, endDate).then(data => {
          setStatusAnalyticsData(data);
          setLoadingStates(prev => ({ ...prev, statusChart: false, reactiveChart: false }));
          return data;
        }),
        ticketAnalyticsAPI.getTicketAgingMatrix(startDate, endDate).then(data => {
          setAgingMatrixAnalyticsData(data);
          setLoadingStates(prev => ({ ...prev, agingMatrix: false }));
          return data;
        }),
        ticketAnalyticsAPI.getUnitCategorywiseData(startDate, endDate).then(data => {
          setUnitCategorywiseData(data);
          return data;
        }),
        ticketAnalyticsAPI.getResponseTATData(startDate, endDate).then(data => {
          setResponseTATData(data);
          setLoadingStates(prev => ({ ...prev, responseTat: false }));
          return data;
        }),
        ticketAnalyticsAPI.getResolutionTATReportData(startDate, endDate).then(data => {
          setResolutionTATReportData(data);
          setLoadingStates(prev => ({ ...prev, resolutionTat: false }));
          return data;
        }),
        ticketAnalyticsAPI.getRecentTickets().then(data => {
          setRecentTicketsData(data);
          return data;
        })
      ];

      await Promise.all(promises);
      setAnalyticsLoaded(true); // Mark analytics as loaded

      // toast({
      //   title: "Success",
      //   description: "Analytics data updated successfully"
      // });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      
      // Reset all loading states on error
      setLoadingStates({
        statusChart: false,
        reactiveChart: false,
        responseTat: false,
        categoryWiseProactiveReactive: false,
        categoryChart: false,
        agingMatrix: false,
        resolutionTat: false
      });
      
      sonnerToast.error("Failed to fetch analytics data. Please try again.");
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // Handle analytics filter apply
  const handleAnalyticsFilterApply = (filters: { startDate: string; endDate: string }) => {
    setAnalyticsDateRange(filters);

    // Convert date strings to Date objects using utility function
    const startDate = convertDateStringToDate(filters.startDate);
    const endDate = convertDateStringToDate(filters.endDate);

    fetchAnalyticsData(startDate, endDate);
    
    // Apply date range to ticket summary cards
    const dateRangeParam = `${filters.startDate} - ${filters.endDate}`;
    // The API will automatically wrap date_range with q[] so just pass date_range
    const summaryFilters: EmployeeTicketFilters = {
      date_range: dateRangeParam
    };
    fetchTicketSummary(summaryFilters);
  };

  // Fetch ticket summary from API - accepts optional filter object
  const fetchTicketSummary = useCallback(async (filters?: EmployeeTicketFilters) => {
    try {
      // Summary cards should show overall counts by default
      // Only pass filters when explicitly provided
      // Status filters should NEVER be passed to ticket_summary API
      const summaryFilters: EmployeeTicketFilters = filters || {};
      
      const summary = await employeeTicketAPI.getTicketSummary(summaryFilters);
      setTicketSummary(summary);

      // Store initial total count only on first load without filters
      if (!filters && initialTotalTickets === 0) {
        setInitialTotalTickets(summary.total_tickets);
      }
    } catch (error) {
      console.error('Error fetching ticket summary:', error);
      sonnerToast.error("Failed to fetch ticket summary. Please try again.");
    }
  }, [initialTotalTickets]);

  // Fetch tickets from API - Optimized for faster loading
  const fetchTickets = useCallback(async (page: number = 1) => {
    // Use different loading states based on whether it's a search operation
    const isSearch = filters.search_all_fields_cont;
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setLoading(true);
    }

    try {
      // Start API call immediately without delays
      const response = await employeeTicketAPI.getTickets(page, perPage, filters);

      // Optimize sorting with early return for performance
      const sortedTickets = response.complaints.length > 0 
        ? [...response.complaints].sort((a, b) => {
            // Flagged tickets always come first
            if (a.is_flagged !== b.is_flagged) {
              return a.is_flagged ? -1 : 1;
            }

            // Among non-flagged tickets, golden tickets come first
            if (!a.is_flagged && !b.is_flagged && a.is_golden_ticket !== b.is_golden_ticket) {
              return a.is_golden_ticket ? -1 : 1;
            }

            return 0; // Maintain original order for same priority
          })
        : [];

      // Batch state updates for better performance - Use React.startTransition for non-urgent updates
      startTransition(() => {
        setTickets(sortedTickets);
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages);
          setTotalTickets(response.pagination.total_count);
        } else {
          setTotalTickets(response.complaints.length);
        }
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      sonnerToast.error("Failed to fetch tickets. Please try again.");
    } finally {
      // Clear loading states immediately
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [filters, perPage]);

  // Handle search input change
  const handleSearch = useCallback((query: string) => {
    isSearchingRef.current = true;
    setSearchQuery(query);
  }, []);

  // Effect to handle debounced search - Optimized
  useEffect(() => {
    // Skip if search query is the same as current filter
    const currentSearch = filters.search_all_fields_cont || '';
    const newSearch = debouncedSearchQuery.trim();

    if (currentSearch === newSearch) {
      return; // No change needed
    }

    // Update filters when debounced search query changes
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (newSearch) {
        newFilters.search_all_fields_cont = newSearch;
      } else {
        delete newFilters.search_all_fields_cont;
      }
      return newFilters;
    });

    // Reset to first page when searching, but only if it's a new search
    if (isSearchingRef.current || (newSearch && !currentSearch)) {
      setCurrentPage(1);
      isSearchingRef.current = false;
    }
  }, [debouncedSearchQuery, filters.search_all_fields_cont]);

  useEffect(() => {
    // Always fetch tickets when currentPage or filters change
    fetchTickets(currentPage);
  }, [currentPage, filters, fetchTickets]);

  // Summary should NEVER be affected by filters
  // It's only fetched once on component mount (see useEffect below)

  // Load analytics data with default date range on component mount - Only when analytics tab is active
  useEffect(() => {
    // Only load analytics data when explicitly needed to improve initial load time
    // Analytics data will be loaded when user switches to analytics tab
  }, []);

  // Initial load effect - fetch summary on component mount
  useEffect(() => {
    // Initial fetch of summary data
    const loadInitialData = async () => {
      try {
        const summary = await employeeTicketAPI.getTicketSummary();
        setTicketSummary(summary);
        setInitialTotalTickets(summary.total_tickets);
      } catch (error) {
        console.error('Error fetching initial ticket summary:', error);
        sonnerToast.error("Failed to fetch ticket summary. Please try again.");
      }
    };
    
    loadInitialData();
  }, []);

  // Use ticket summary data from API
  const openTickets = ticketSummary.open_tickets || 0;
  const inProgressTickets = ticketSummary.in_progress_tickets || 0;
  const closedTickets = ticketSummary.closed_tickets || 0;
  const totalSummaryTickets = ticketSummary.total_tickets || 0;
  const pendingTickets = ticketSummary.pending_tickets || 0; // Use ticket summary for pending as it's not in analytics
  // Always use the current totalSummaryTickets from API to ensure the count is up-to-date
  const displayTotalTickets = totalSummaryTickets.toLocaleString();


  // Memoized calculations for better performance
  const statusData = useMemo(() => [{
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
  }], [openTickets, inProgressTickets, closedTickets, pendingTickets]);

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
  }, {
    title: 'Pending Tickets',
    value: ticketSummary.pending_tickets,
    icon: Ticket,
    color: 'bg-indigo-500'
  }
  ];

  // Calculate category data from API analytics data only - Memoized for performance
  const categoryChartData = useMemo(() => {
    return categoryAnalyticsData.length > 0
      ? categoryAnalyticsData.map(item => ({
        name: item.category,
        proactive: item.proactive.Open + item.proactive.Closed,
        reactive: item.reactive.Open + item.reactive.Closed,
        value: item.proactive.Open + item.proactive.Closed + item.reactive.Open + item.reactive.Closed
      }))
      : []; // No fallback to tickets data
  }, [categoryAnalyticsData]);

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
  const openticketanalyticsData = statusAnalyticsData?.overall.total_open || 0;
  const closedticketanalyticsData = statusAnalyticsData?.overall.total_closed || 0;

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
    // Navigate to employee-specific ticket details page
    navigate(`/maintenance/ticket/employee/details/${ticketId}`);
  };

  const handleEditTicket = (ticketNumber: string) => {
    setIsEditStatusOpen(true);
  };

  const handleDeleteTicket = async (ticketId: number) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        // Add delete API call here when available
        sonnerToast.success("Ticket deleted successfully!");
        await fetchTickets(currentPage);
      } catch (error) {
        console.error('Delete ticket failed:', error);
        sonnerToast.error("Failed to delete ticket");
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
      await employeeTicketAPI.markAsGoldenTicket(selectedTickets);

      // Update tickets locally and sort
      setTickets(prevTickets => {
        const updatedTickets = prevTickets.map(ticket =>
          selectedTickets.includes(ticket.id)
            ? { ...ticket, is_golden_ticket: true }
            : ticket
        );

        // Sort tickets: flagged first, then golden tickets, then regular tickets
        const sortedTickets = [...updatedTickets].sort((a, b) => {
          // Flagged tickets always come first
          if (a.is_flagged && !b.is_flagged) return -1;
          if (!a.is_flagged && b.is_flagged) return 1;

          // Among non-flagged tickets, golden tickets come first
          if (!a.is_flagged && !b.is_flagged) {
            if (a.is_golden_ticket && !b.is_golden_ticket) return -1;
            if (!a.is_golden_ticket && b.is_golden_ticket) return 1;
          }

          return 0; // Maintain original order for same priority
        });

        return sortedTickets;
      });

      sonnerToast.success("Tickets marked as Golden Ticket successfully!");

      setSelectedTickets([]);
      fetchTicketSummary();
    } catch (error) {
      console.error('Golden Ticket action failed:', error);
      sonnerToast.error("Failed to mark tickets as Golden Ticket");
    }
  };
  const handleFlag = async () => {
    // console.log('TicketDashboard - Flag action for tickets:', selectedTickets);
    if (selectedTickets.length === 0) {
      sonnerToast.error("Please select tickets to flag");
      return;
    }

    try {
      await employeeTicketAPI.markAsFlagged(selectedTickets);

      // Refresh from API to get proper positioning after flag toggle
      await fetchTickets(currentPage);

      sonnerToast.success(`${selectedTickets.length} ticket(s) flag status updated successfully!`);

      setSelectedTickets([]);
      fetchTicketSummary();
    } catch (error) {
      console.error('Flag action failed:', error);
      sonnerToast.error("Failed to update flag status");
    }
  };

  // Unified refresh function for both tickets and summary
  const refreshTicketsAndSummary = useCallback(async () => {
    try {
      // Refresh both ticket list and summary simultaneously
      await Promise.all([
        fetchTickets(currentPage),
        fetchTicketSummary()
      ]);
    } catch (error) {
      console.error('Error refreshing tickets and summary:', error);
    }
  }, [fetchTickets, fetchTicketSummary, currentPage]);

  const handleSingleTicketFlag = async (ticketId: number, currentFlagStatus: boolean) => {
    // console.log('TicketDashboard - Single flag action for ticket:', ticketId);
    try {
      const response = await employeeTicketAPI.markAsFlagged([ticketId]);

      // If flagging a ticket, update immediately for responsive UI
      if (!currentFlagStatus) {
        setTickets(prevTickets => {
          const updatedTickets = prevTickets.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, is_flagged: true }
              : ticket
          );

          // Find the newly flagged ticket and move it to the very top
          const newlyFlaggedTicket = updatedTickets.find(ticket => ticket.id === ticketId);
          const otherTickets = updatedTickets.filter(ticket => ticket.id !== ticketId);

          return [newlyFlaggedTicket, ...otherTickets];
        });
      } else {
        // If unflagging, refresh from API to get proper positioning
        await fetchTickets(currentPage);
      }

      sonnerToast.success(response.message || `Ticket ${!currentFlagStatus ? 'flagged' : 'unflagged'} successfully!`);

      // Refresh ticket summary to keep counts in sync
      fetchTicketSummary();
    } catch (error) {
      console.error('Single flag action failed:', error);
      sonnerToast.error("Failed to flag ticket");
    }
  };

  const handleSingleTicketGoldenTicket = async (ticketId: number, currentGoldenStatus: boolean) => {
    // console.log('TicketDashboard - Single golden ticket action for ticket:', ticketId);
    try {
      const response = await employeeTicketAPI.markAsGoldenTicket([ticketId]);

      // Update the ticket locally and move newly golden tickets appropriately
      setTickets(prevTickets => {
        const updatedTickets = prevTickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, is_golden_ticket: !currentGoldenStatus }
            : ticket
        );

        // If marking as golden ticket, position it correctly
        if (!currentGoldenStatus) {
          const newlyGoldenTicket = updatedTickets.find(ticket => ticket.id === ticketId);
          const otherTickets = updatedTickets.filter(ticket => ticket.id !== ticketId);

          // Find the position after all flagged tickets but before regular tickets
          const flaggedTickets = otherTickets.filter(ticket => ticket.is_flagged);
          const nonFlaggedTickets = otherTickets.filter(ticket => !ticket.is_flagged);

          // Put golden ticket at the top of non-flagged tickets
          return [...flaggedTickets, newlyGoldenTicket, ...nonFlaggedTickets];
        } else {
          // If removing golden status, sort normally
          return [...updatedTickets].sort((a, b) => {
            // Flagged tickets always come first
            if (a.is_flagged && !b.is_flagged) return -1;
            if (!a.is_flagged && b.is_flagged) return 1;

            // Among non-flagged tickets, golden tickets come first
            if (!a.is_flagged && !b.is_flagged) {
              if (a.is_golden_ticket && !b.is_golden_ticket) return -1;
              if (!a.is_golden_ticket && b.is_golden_ticket) return 1;
            }

            return 0; // Maintain original order for same priority
          });
        }
      });

      sonnerToast.success(response.message || `Golden Ticket ${!currentGoldenStatus ? 'marked' : 'unmarked'} successfully!`);

      // Optionally refresh ticket summary to keep counts in sync
      fetchTicketSummary();
    } catch (error) {
      console.error('Single golden ticket action failed:', error);
      sonnerToast.error("Failed to mark as golden ticket");
    }
  };
  const handleExport = async () => {
    console.log('TicketDashboard - Export action for tickets:', selectedTickets);
    
    if (isExporting) {
      return; // Prevent multiple simultaneous exports
    }
    
    setIsExporting(true);
    
    // Show loading toast
    const loadingToastId = sonnerToast.loading("Preparing export file...", {
      duration: Infinity, // Keep it visible until we dismiss it
    });
    
    try {
      const blob = await employeeTicketAPI.exportTicketsExcel(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Dismiss loading toast and show success
      sonnerToast.dismiss(loadingToastId);
      sonnerToast.success("Tickets exported successfully!");
      
    } catch (error) {
      console.error('Export failed:', error);
      
      // Dismiss loading toast and show error
      sonnerToast.dismiss(loadingToastId);
      sonnerToast.error("Failed to export tickets. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  const handleFilterApply = (newFilters: EmployeeTicketFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    setIsFilterOpen(false);
    
    // Update ticket summary cards with the applied filters
    // Extract only the date_range filter for the summary API
    const dateRange = newFilters.date_range;
    
    if (dateRange) {
      // Pass only date filter to ticket summary API
      // The API will automatically wrap it with q[] so just pass date_range
      const summaryFilters: EmployeeTicketFilters = {
        date_range: dateRange
      };
      fetchTicketSummary(summaryFilters);
    } else {
      // If no date filter, refresh summary to show overall counts
      fetchTicketSummary();
    }
  };

  // Handle status card click for filtering
  const handleStatusCardClick = (cardType: string) => {
    console.log('Status card clicked:', cardType);

    if (cardType === 'total') {
      // Clear only status filters, keep other filters like date_range
      setFilters(prevFilters => {
        const { 
          complaint_status_fixed_state_eq, 
          complaint_status_fixed_state_not_eq, 
          complaint_status_fixed_state_null, 
          m, 
          g, // Remove nested group structure
          ...otherFilters 
        } = prevFilters;
        console.log('Total card - Clearing status filters, keeping:', otherFilters);
        return otherFilters;
      });
      setCurrentPage(1);
      return;
    }

    // Preserve existing filters (like date_range) and only update status filters
    setFilters(prevFilters => {
      // Remove any existing status filters first (including nested group structure)
      const { 
        complaint_status_fixed_state_eq, 
        complaint_status_fixed_state_not_eq, 
        complaint_status_fixed_state_null, 
        m, 
        g, // Remove nested group structure
        ...otherFilters 
      } = prevFilters;

      const newFilters: EmployeeTicketFilters = { ...otherFilters };

      // Add the new status filter
      if (cardType === 'open') {
        // Use nested group structure for open tickets as per API requirement
        // q[m]=and&q[g][0][m]=or&q[g][0][complaint_status_fixed_state_not_eq]=closed&q[g][0][complaint_status_fixed_state_null]=1
        newFilters.m = 'and';
        newFilters.g = [{
          m: 'or',
          complaint_status_fixed_state_not_eq: 'closed',
          complaint_status_fixed_state_null: '1'
        }];
        console.log('✅ Open card - Combined filters with date_range:', newFilters);
      } else if (cardType === 'pending') {
        newFilters.complaint_status_fixed_state_eq = 'Pending';
        console.log('✅ Pending card - Combined filters with date_range:', newFilters);
      } else if (cardType === 'in_progress') {
        newFilters.complaint_status_fixed_state_eq = 'In Progress';
        console.log('✅ In Progress card - Combined filters with date_range:', newFilters);
      } else if (cardType === 'closed') {
        newFilters.complaint_status_fixed_state_eq = 'Closed';
        console.log('✅ Closed card - Combined filters with date_range:', newFilters);
      }

      return newFilters;
    });

    setCurrentPage(1);
    
    // DO NOT call fetchTicketSummary here - status card clicks should only filter the ticket list,
    // not affect the summary counts which should remain unfiltered
  };

  // Helper function to check if a status card is currently active
  const isStatusCardActive = (cardType: string) => {
    if (cardType === 'total') return false;

    if (cardType === 'open') {
      // Check for nested group structure
      return filters.m === 'and' &&
        filters.g?.[0]?.m === 'or' &&
        filters.g?.[0]?.complaint_status_fixed_state_not_eq === 'closed' &&
        filters.g?.[0]?.complaint_status_fixed_state_null === '1';
    } else if (cardType === 'pending') {
      return filters.complaint_status_fixed_state_eq === 'Pending';
    } else if (cardType === 'in_progress') {
      return filters.complaint_status_fixed_state_eq === 'In Progress';
    } else if (cardType === 'closed') {
      return filters.complaint_status_fixed_state_eq === 'Closed';
    }

    return false;
  };

  // Handle drag end for chart reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    if (active.id !== over?.id) {
      setChartOrder(items => {
        const oldIndex = items.indexOf(active.id.toString());
        const newIndex = items.indexOf(over?.id.toString() || '');
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const columns = [{
    key: 'actions',
    label: 'Actions',
    sortable: false
  }, 
  {
    key: 'ticket_number',
    label: 'Ticket ID',
    sortable: true
  }, 
  {
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
  },  {
    key: 'assigned_to',
    label: 'Assigned To',
    sortable: true
  }, {
    key: 'issue_status',
    label: 'Status',
    sortable: true
  }, 
  // {
  //   key: 'priority',
  //   label: 'Priority',
  //   sortable: true
  // }, 
  {
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
  }, 
  // {
  //   key: 'asset_or_service_name',
  //   label: 'Asset / Service Name',
  //   sortable: true
  // }, 
  {

    key: 'asset_task_occurrence_id',
    label: 'Task ID',
    sortable: true
  }, 
  // {
  //   key: 'proactive_reactive',
  //   label: 'Proactive / Reactive',
  //   sortable: true
  // }, 
  // {
  //   key: 'review_tracking_date',
  //   label: 'Review Date',
  //   sortable: true
  // }, 
  // {
  //   key: 'response_escalation',
  //   label: 'Response Escalation',
  //   sortable: true
  // }, {
  //   key: 'response_tat',
  //   label: 'Response TAT (Min)',
  //   sortable: true
  // }, {
  //   key: 'response_time',
  //   label: 'Response Time (D:H:M)',
  //   sortable: true
  // }, {
  //   key: 'escalation_response_name',
  //   label: 'Response Escalation Level',
  //   sortable: true
  // }, {
  //   key: 'resolution_escalation',
  //   label: 'Resolution Escalation',
  //   sortable: true
  // }, {
  //   key: 'resolution_tat',
  //   label: 'Resolution TAT (Min)',
  //   sortable: true
  // }, {
  //   key: 'resolution_time',
  //   label: 'Resolution Time (D:H:M)',
  //   sortable: true
  // }, {
  //   key: 'escalation_resolution_name',
  //   label: 'Resolution Escalation Level',
  //   sortable: true
  // }
];
  const renderCustomActions = () => (
    <div className="flex gap-3">
      {shouldShow("tickets", "add") && (
        <Button
          onClick={handleAddButton}
          className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" /> Add
        </Button>
      )}
    </div>
  );

  const handleAddButton = () => {
    // navigate('/maintenance/ticket/add');
    const currentPath = window.location.pathname;

    if (currentPath.includes("tickets")) {
      navigate("/tickets/add");
    } else {
      navigate("/maintenance/ticket/employee/add");
    }
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
    try {
      // Parse the ISO string to extract date and time parts directly
      // Format: "2025-11-19T12:01:19.000+04:00"
      const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
      if (match) {
        const [, year, month, day, hours, minutes, seconds] = match;
        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
      }
      // Fallback to Date object if regex doesn't match
      const date = new Date(dateString);
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      const h = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const sec = String(date.getSeconds()).padStart(2, '0');
      return `${d}/${m}/${y}, ${h}:${min}:${sec}`;
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to format escalation data
  const formatEscalationData = (escalation: EscalationInfo | null | undefined) => {
    if (!escalation) return null;
    
    const { minutes, is_overdue, users, escalation_name, escalation_time } = escalation;
    
    return {
      minutes: minutes || 0,
      isOverdue: is_overdue || false,
      users: users || [],
      escalationName: escalation_name || '--',
      escalationTime: escalation_time || '--'
    };
  };

  // Helper function to format escalation display
  const formatEscalationDisplay = (escalation: EscalationInfo | null | undefined, type: 'response' | 'resolution') => {
    if (!escalation) return '--';
    
    const formatted = formatEscalationData(escalation);
    return formatted?.escalationName || '--';
  };

  // Helper function to format escalation minutes
  const formatEscalationMinutes = (escalation: EscalationInfo | null | undefined) => {
    if (!escalation) return '--';
    const formatted = formatEscalationData(escalation);
    return formatted?.minutes.toString() || '--';
  };

  // Helper function to format escalation time in D:H:M format
  const formatEscalationTime = (escalation: EscalationInfo | null | undefined) => {
    if (!escalation || !escalation.minutes) return '--';
    
    const totalMinutes = escalation.minutes;
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    
    return `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Helper function to format escalation level
  const formatEscalationLevel = (escalation: EscalationInfo | null | undefined) => {
    if (!escalation) return '--';
    const formatted = formatEscalationData(escalation);
    return formatted?.escalationName || '--';
  };
  const TruncatedDescription = ({
    text,
    maxCharacters = 15
  }: {
    text: string;
    maxCharacters?: number;
  }) => {
    if (!text) return <span>--</span>;

    if (text.length <= maxCharacters) {
      return <span className="ml-2">{text}</span>;
    }

    const truncated = text.substring(0, maxCharacters);
    return (
      <div className="w-32 max-w-[150px]" title={text}>
        <span className="block truncate">
          {`${truncated}...`}
        </span>
      </div>
    );
  };
  const renderCell = (item, columnKey) => {
    if (columnKey === 'actions') {
      return (
        <div className="flex items-center justify-center gap-1 w-full h-full min-h-[40px]">
          <div title="View ticket" className="p-1 hover:bg-gray-100 rounded transition-colors">
             {shouldShow("tickets", "view") && (
            <Eye
              className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(item.id);
              }}
            />
             )}
          </div>
          {/* <div title="Update ticket" className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Edit
              className="w-4 h-4 text-gray-600 cursor-pointer hover:text-[#C72030]"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/maintenance/ticket/update/${item.id}`);
              }}
            />
          </div> */}
          {/* <div title={`${item.is_flagged ? 'Unflag' : 'Flag'} ticket`} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Flag
              className={`w-4 h-4 cursor-pointer transition-all duration-200 hover:text-[#C72030] hover:scale-110 ${item.is_flagged
                ? 'text-red-500 fill-red-500'
                : 'text-gray-600'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSingleTicketFlag(item.id, item.is_flagged);
              }}
            />
          </div> */}
          {/* <div title={`${item.is_golden_ticket ? 'Remove' : 'Mark as'} Golden Ticket`} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Star
              className={`w-4 h-4 cursor-pointer transition-all duration-200 hover:text-[#C72030] hover:scale-110 ${item.is_golden_ticket
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-600'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                handleSingleTicketGoldenTicket(item.id, item.is_golden_ticket);
              }}
            />
          </div> */}
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
    if (columnKey === 'response_tat') {
      return item.response_tat?.toString() || '--';
    }
    if (columnKey === 'response_time') {
      return item.response_time || '--';
    }
    if (columnKey === 'escalation_response_name') {
      return item.escalation_response_name || '--';
    }
    if (columnKey === 'resolution_tat') {
      return item.resolution_tat?.toString() || '--';
    }
    if (columnKey === 'resolution_time') {
      return item.resolution_time || '--';
    }
    if (columnKey === 'escalation_resolution_name') {
      return item.escalation_resolution_name || '--';
    }
    if (!item[columnKey] || item[columnKey] === null || item[columnKey] === '') {
      return '--';
    }
    return item[columnKey];
  };


  // Handle tab change and load analytics data only when needed
  const handleTabChange = (value: string) => {
    if (value === 'analytics' && !analyticsLoaded) {
      const defaultRange = getDefaultDateRange();
      const startDate = convertDateStringToDate(defaultRange.startDate);
      const endDate = convertDateStringToDate(defaultRange.endDate);
      fetchAnalyticsData(startDate, endDate);
      
      // Also fetch ticket summary with date range for analytics tab
      const dateRangeParam = `${defaultRange.startDate} - ${defaultRange.endDate}`;
      // The API will automatically wrap date_range with q[] so just pass date_range
      const summaryFilters: EmployeeTicketFilters = {
        date_range: dateRangeParam
      };
      fetchTicketSummary(summaryFilters);
    } else if (value === 'tickets') {
      // Reset to show all tickets without date filter when switching to tickets tab
      fetchTicketSummary();
    }
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      <Tabs defaultValue="tickets" className="w-full" onValueChange={handleTabChange}>
      

        <TabsContent value="analytics" className="space-y-4 sm:space-y-4 mt-4">
          {/* Header with Filter and Ticket Selector */}
          <div className="flex justify-end items-center gap-2">

            <Button
              variant="outline"
              onClick={() => setIsAnalyticsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
            >
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {analyticsDateRange.startDate} - {analyticsDateRange.endDate}
              </span>
              <Filter className="w-4 h-4 text-gray-600" />
            </Button>

            <TicketSelector onSelectionChange={handleSelectionChange} />
          </div>

          {/* Main Analytics Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 min-h-[calc(100vh-200px)]">
            {/* Left Section - Charts */}
            <div className="xl:col-span-8 space-y-4 sm:space-y-6">
              {/* All Charts with Drag and Drop */}
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                  <div className="space-y-4 sm:space-y-2">
                    {/* First Row - Ticket Status and ProActive/Reactive */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {chartOrder.filter(id => ['statusChart', 'reactiveChart'].includes(id)).map(chartId => {
                        if (chartId === 'statusChart' && visibleSections.includes('statusChart')) {
                          return (
                            <SortableChartItem key={chartId} id={chartId}>
                              <SectionLoader loading={loadingStates.statusChart}>
                                <TicketStatusOverviewCard
                                  openTickets={openticketanalyticsData}
                                  closedTickets={closedticketanalyticsData}
                                />
                              </SectionLoader>
                            </SortableChartItem>
                          );
                        }
                        if (chartId === 'reactiveChart' && visibleSections.includes('reactiveChart')) {
                          return (
                            <SortableChartItem key={chartId} id={chartId}>
                              <SectionLoader loading={loadingStates.reactiveChart}>
                                <ProactiveReactiveCard
                                  proactiveOpenTickets={proactiveOpenTickets}
                                  proactiveClosedTickets={proactiveClosedTickets}
                                  reactiveOpenTickets={reactiveOpenTickets}
                                  reactiveClosedTickets={reactiveClosedTickets}
                                />
                              </SectionLoader>
                            </SortableChartItem>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Second Row - Response TAT */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {visibleSections.includes('responseTat') && (
                        <SortableChartItem key="responseTat" id="responseTat">
                          <SectionLoader loading={loadingStates.responseTat}>
                            <ResponseTATCard
                              data={responseTATData}
                              className="h-full"
                              dateRange={{
                                startDate: convertDateStringToDate(analyticsDateRange.startDate),
                                endDate: convertDateStringToDate(analyticsDateRange.endDate)
                              }}
                            />
                          </SectionLoader>
                        </SortableChartItem>
                      )}
                    </div>

                    {/* Third Row - Category Wise ProActive/Reactive (Dual-bar chart) */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {visibleSections.includes('categoryWiseProactiveReactive') && (
                        <SortableChartItem key="categoryWiseProactiveReactive" id="categoryWiseProactiveReactive">
                          <SectionLoader loading={loadingStates.categoryWiseProactiveReactive}>
                            <CategoryWiseProactiveReactiveCard
                              data={categorywiseTicketsData}
                              dateRange={{
                                startDate: convertDateStringToDate(analyticsDateRange.startDate),
                                endDate: convertDateStringToDate(analyticsDateRange.endDate)
                              }}
                            />
                          </SectionLoader>
                        </SortableChartItem>
                      )}
                    </div>

                    {/* Fourth Row - Unit Category-wise Tickets */}
                    {/* <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {visibleSections.includes('categoryChart') && (
                        <SortableChartItem key="categoryChart" id="categoryChart">
                          <UnitCategoryWiseCard
                            data={unitCategorywiseData}
                            dateRange={{
                              startDate: convertDateStringToDate(analyticsDateRange.startDate),
                              endDate: convertDateStringToDate(analyticsDateRange.endDate)
                            }}
                          />
                        </SortableChartItem>
                      )}
                    </div> */}

                    {/* Fifth Row - Tickets Aging Matrix */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {visibleSections.includes('agingMatrix') && (
                        <SortableChartItem key="agingMatrix" id="agingMatrix">
                          <SectionLoader loading={loadingStates.agingMatrix}>
                            <TicketAgingMatrixCard
                              data={agingMatrixAnalyticsData}
                              agingMatrixData={agingMatrixData}
                              dateRange={{
                                startDate: convertDateStringToDate(analyticsDateRange.startDate),
                                endDate: convertDateStringToDate(analyticsDateRange.endDate)
                              }}
                            />
                          </SectionLoader>
                        </SortableChartItem>
                      )}
                    </div>

                    {/* Sixth Row - Resolution TAT Report */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6">
                      {visibleSections.includes('resolutionTat') && (
                        <SortableChartItem key="resolutionTat" id="resolutionTat">
                          <SectionLoader loading={loadingStates.resolutionTat}>
                            <ResolutionTATCard
                              data={resolutionTATReportData}
                              className="bg-white border border-gray-200 rounded-lg"
                              dateRange={{
                                startDate: convertDateStringToDate(analyticsDateRange.startDate),
                                endDate: convertDateStringToDate(analyticsDateRange.endDate)
                              }}
                            />
                          </SectionLoader>
                        </SortableChartItem>
                      )}
                    </div>
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {/* Right Sidebar - Recent Tickets */}
            <div className="xl:col-span-4 order-first xl:order-last">
              <RecentTicketsSidebar onTicketUpdate={refreshTicketsAndSummary} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4 sm:space-y-4 mt-4 sm:mt-6">
          {/* Ticket Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6">
            {[{
              label: 'Total Tickets',
              value: displayTotalTickets,
              icon: Settings,
              type: 'total',
              clickable: true
            }, {
              label: 'Open',
              value: openTickets,
              icon: Settings,
              type: 'open',
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
                  className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 ${item.clickable ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
                  onClick={() => item.clickable && handleStatusCardClick(item.type)}
                >
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-[#C72030]" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-[#1A1A1A]">
                      {item.value}
                    </div>
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tickets Table */}
          <div className="overflow-x-auto animate-fade-in">
            {/* {searchLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Searching tickets...</span>
                </div>
              </div>
            )} */}
            <EnhancedTable
              data={tickets || []}
              columns={columns}
              renderCell={renderCell}
              // selectable={true}
              pagination={false}
              enableExport={true}
              exportFileName="tickets"
              handleExport={handleExport}
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
              onSearchChange={handleSearch}
              hideTableExport={false}
              hideColumnsButton={false}
              className="transition-all duration-500 ease-in-out"
              loading={loading}
              loadingMessage="Loading tickets..."
            />

                {/* Add custom CSS for smooth row transitions */}
                <style>{`
                  @keyframes slideInFromTop {
                    from {
                      opacity: 0;
                      transform: translateY(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  
                  .table-row-transition {
                    animation: slideInFromTop 0.4s ease-out;
                    transition: all 0.3s ease-in-out;
                  }
                  
                  .flagged-row {
                    background-color: rgba(239, 68, 68, 0.05) !important;
                    border-left: 3px solid #ef4444;
                  }
                  
                  .golden-row {
                    background-color: rgba(245, 158, 11, 0.05) !important;
                    border-left: 3px solid #f59e0b;
                  }
                `}</style>

                {/* Custom Pagination */}
                <div className="flex items-center justify-center mt-6 px-4 py-3 bg-white border-t border-gray-200 animate-fade-in">
                  <div className="flex items-center space-x-1">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1 || loading || searchLoading}
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
                            disabled={loading || searchLoading}
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
                            disabled={loading || searchLoading}
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
                            disabled={loading || searchLoading}
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
                      disabled={currentPage === totalPages || loading || searchLoading}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Add custom CSS for smooth row transitions */}
                <style>{`
                  @keyframes slideInFromTop {
                    from {
                      opacity: 0;
                      transform: translateY(-10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  
                  .table-row-transition {
                    animation: slideInFromTop 0.4s ease-out;
                    transition: all 0.3s ease-in-out;
                  }
                  
                  .flagged-row {
                    background-color: rgba(239, 68, 68, 0.05) !important;
                    border-left: 3px solid #ef4444;
                  }
                  
                  .golden-row {
                    background-color: rgba(245, 158, 11, 0.05) !important;
                    border-left: 3px solid #f59e0b;
                  }
                `}</style>
          </div>
        </TabsContent>
      </Tabs>

      <TicketsFilterDialog isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} onApplyFilters={handleFilterApply} />

      {/* Edit Status Dialog */}
      {/* <EditStatusDialog
        open={isEditStatusOpen}
        onOpenChange={setIsEditStatusOpen}
        complaintId={selectedTicketForEdit?.id}
        currentStatusId={selectedTicketForEdit?.complaint_status_id}
        currentStatus={selectedTicketForEdit?.issue_status}
        onSuccess={() => {
          fetchTickets(currentPage);
          setSelectedTicketForEdit(null);
        }}
      /> */}

      {/* Analytics Filter Dialog */}
      <TicketAnalyticsFilterDialog
        isOpen={isAnalyticsFilterOpen}
        onClose={() => setIsAnalyticsFilterOpen(false)}
        onApplyFilters={handleAnalyticsFilterApply}
        currentStartDate={analyticsDateRange.startDate}
        currentEndDate={analyticsDateRange.endDate}
      />

      {/* Ticket Selection Panel */}
      {selectedTickets.length > 0 && shouldShow("tickets", "manage") && (
        <TicketSelectionPanel
          selectedTickets={selectedTickets}
          selectedTicketObjects={tickets.filter(ticket => selectedTickets.includes(ticket.id))}
          onGoldenTicket={handleGoldenTicket}
          onFlag={handleFlag}
          onExport={handleExport}
          onClearSelection={handleClearSelection}
        />
      )}
    </div>
  );
};