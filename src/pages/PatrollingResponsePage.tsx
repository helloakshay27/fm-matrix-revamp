import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Filter, Download, Loader2, Shield, CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Session {
  id: number;
  route_name: string;
  assigned_guard: string;
  guard_id: number;
  status: string;
  scheduled_start: string;
  actual_start: string;
}

interface Checkpoint {
  id: number;
  name: string;
  description: string;
  order_sequence: number;
  building_name: string | null;
  location_path: string;
}

interface Answer {
  id: number;
  question_id: number | null;
  question_text: string | null;
  answer: string | null;
  option_id: number | null;
  option_text: string | null;
  is_negative: boolean;
  answered_at: string;
}

interface Ticket {
  id: number;
  ticket_number: string;
  heading: string;
  category: string | null;
  priority: string;
  status: string;
  type: string;
  created_at: string;
  assigned_to: number | null;
}

interface PatrollingVisit {
  id: number;
  session: Session;
  checkpoint: Checkpoint;
  visited_at: string;
  notes: string;
  qr_code_scanned: string;
  was_in_sequence: boolean;
  attachments: any[];
  answers: Answer[];
  tickets: Ticket[];
  tickets_count: number;
  issues_count: number;
}

interface PatrollingResponse {
  id: number;
  route_name: string;
  checkpoint_name: string;
  guard_name: string;
  location_path: string;
  visited_at: string;
  session_status: string;
  answers_count: number;
  tickets_count: number;
  qr_scanned: boolean;
  in_sequence: boolean;
}

export const PatrollingResponsePage = () => {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState<PatrollingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_count: 0,
    total_pages: 1,
  });
  const [summaryStats, setSummaryStats] = useState({
    total_visits: 0,
    total_sessions: 0,
    total_checkpoints_visited: 0,
    total_tickets_raised: 0,
  });

  // Column visibility state
  const [columns, setColumns] = useState([
    { key: 'actions', label: 'Actions', visible: true },
    { key: 'route_name', label: 'Route Name', visible: true },
    { key: 'checkpoint_name', label: 'Checkpoint Name', visible: true },
    { key: 'guard_name', label: 'Guard Name', visible: true },
    { key: 'location_path', label: 'Location', visible: true },
    { key: 'visited_at', label: 'Visited At', visible: true },
    { key: 'answers_count', label: 'Answers', visible: true },
    { key: 'tickets_count', label: 'Tickets', visible: true },
    { key: 'session_status', label: 'Status', visible: true },
  ]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Transform API data to table format
  const transformVisitsToResponses = (visits: PatrollingVisit[]): PatrollingResponse[] => {
    return visits.map((visit) => ({
      id: visit.id,
      route_name: visit.session.route_name,
      checkpoint_name: visit.checkpoint.name,
      guard_name: visit.session.assigned_guard,
      location_path: visit.checkpoint.location_path || '-',
      visited_at: visit.visited_at,
      session_status: visit.session.status,
      answers_count: visit.answers.length,
      tickets_count: visit.tickets_count,
      qr_scanned: visit.qr_code_scanned === '1',
      in_sequence: visit.was_in_sequence,
    }));
  };

  // Fetch patrolling responses
  const fetchPatrollingResponses = useCallback(async (page: number = 1, searchQuery?: string, status?: string | null) => {
    const isSearch = searchQuery && searchQuery.trim() !== '';
    if (isSearch) {
      setSearchLoading(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const url = getFullUrl('/patrolling/visits/all');
      const urlWithParams = new URL(url);
      
      urlWithParams.searchParams.append('page', page.toString());
      urlWithParams.searchParams.append('per_page', '20');
      
      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }

      if (status) {
        urlWithParams.searchParams.append('status', status);
      }
      
      if (searchQuery && searchQuery.trim()) {
        urlWithParams.searchParams.append('search', searchQuery.trim());
      }

      const options = getAuthenticatedFetchOptions();
      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        throw new Error('Failed to fetch patrolling visits');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch data');
      }

      const transformedData = transformVisitsToResponses(result.data.visits || []);
      setResponseData(transformedData);
      
      if (result.data.pagination) {
        setPagination({
          current_page: parseInt(result.data.pagination.current_page),
          per_page: parseInt(result.data.pagination.per_page),
          total_count: result.data.pagination.total_count,
          total_pages: result.data.pagination.total_pages,
        });
      }

      if (result.data.summary) {
        setSummaryStats({
          total_visits: result.data.summary.total_visits || 0,
          total_sessions: result.data.summary.total_sessions || 0,
          total_checkpoints_visited: result.data.summary.total_checkpoints_visited || 0,
          total_tickets_raised: result.data.summary.total_tickets_raised || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching patrolling visits:', error);
      toast.error('Failed to load patrolling visits');
      setResponseData([]);
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPatrollingResponses(currentPage, debouncedSearchTerm, selectedStatus);
  }, [currentPage, debouncedSearchTerm, selectedStatus, fetchPatrollingResponses]);

  const handleViewDetails = (item: PatrollingResponse) => {
    navigate(`/security/patrolling/response/details/${item.id}`, {
      state: { responseData: item },
    });
  };

  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusCardClick = (status: string | null) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const url = getFullUrl('/patrolling/visits/all');
      const urlWithParams = new URL(url);

      urlWithParams.searchParams.append('export', 'true');

      if (API_CONFIG.TOKEN) {
        urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
      }

      if (selectedStatus) {
        urlWithParams.searchParams.append('status', selectedStatus);
      }

      if (debouncedSearchTerm) {
        urlWithParams.searchParams.append('search', debouncedSearchTerm);
      }

      const options = getAuthenticatedFetchOptions();
      const response = await fetch(urlWithParams.toString(), options);

      if (!response.ok) {
        throw new Error('Failed to export patrolling visits');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `patrolling-visits-${timestamp}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('Patrolling visits exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export patrolling visits. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Column visibility handlers
  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns((prev) =>
      prev.map((col) => (col.key === columnKey ? { ...col, visible } : col))
    );
  };

  const isColumnVisible = useCallback(
    (columnKey: string) => {
      const column = columns.find((col) => col.key === columnKey);
      return column?.visible ?? true;
    },
    [columns]
  );

  const handleResetColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible: true })));
    toast.success('All columns have been restored to default visibility');
  };

  // Enhanced table columns
  const enhancedTableColumns = React.useMemo(() => {
    const allColumns = [
    //   {
    //     key: 'actions',
    //     label: 'Actions',
    //     sortable: false,
    //     draggable: false,
    //     defaultVisible: true,
    //     visible: isColumnVisible('actions'),
    //     hideable: false,
    //   },
      {
        key: 'route_name',
        label: 'Route Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible('route_name'),
        hideable: true,
      },
      {
        key: 'checkpoint_name',
        label: 'Checkpoint Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible('checkpoint_name'),
        hideable: true,
      },
      {
        key: 'guard_name',
        label: 'Guard Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible('guard_name'),
        hideable: true,
      },
      {
        key: 'location_path',
        label: 'Location',
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible('location_path'),
        hideable: true,
      },
      {
        key: 'visited_at',
        label: 'Visited At',
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible('visited_at'),
        hideable: true,
      },
      {
        key: 'answers_count',
        label: 'Answers',
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible('answers_count'),
        hideable: true,
      },
      {
        key: 'tickets_count',
        label: 'Tickets',
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible('tickets_count'),
        hideable: true,
      },
      {
        key: 'session_status',
        label: 'Status',
        sortable: true,
        draggable: true,
        defaultVisible: true,
        visible: isColumnVisible('session_status'),
        hideable: true,
      },
    ];

    return allColumns.filter((col) => col.visible);
  }, [isColumnVisible]);

  // Transform columns for dropdown
  const dropdownColumns = React.useMemo(
    () => columns.filter((col) => col.key !== 'actions'),
    [columns]
  );

  const renderCell = (item: PatrollingResponse, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetails(item)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'route_name':
        return <span className="font-medium">{item.route_name}</span>;
      case 'checkpoint_name':
        return <span>{item.checkpoint_name}</span>;
      case 'guard_name':
        return <span>{item.guard_name}</span>;
      case 'location_path':
        return (
          <span className="text-sm" title={item.location_path}>
            {item.location_path || '-'}
          </span>
        );
      case 'visited_at':
        return (
          <span>
            {item.visited_at
              ? new Date(item.visited_at).toLocaleString()
              : '-'}
          </span>
        );
      case 'answers_count':
        return (
          <div className="flex items-center justify-center">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.answers_count}
            </span>
          </div>
        );
      case 'tickets_count':
        return (
          <div className="flex items-center justify-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.tickets_count > 0 
                ? 'bg-red-100 text-red-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.tickets_count}
            </span>
          </div>
        );
      case 'session_status':
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.session_status === 'completed'
                ? 'bg-green-100 text-green-800'
                : item.session_status === 'partially_completed'
                ? 'bg-yellow-100 text-yellow-800'
                : item.session_status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : item.session_status === 'scheduled'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {item.session_status.replace('_', ' ').toUpperCase()}
          </span>
        );
      default:
        return item[columnKey as keyof PatrollingResponse] || '-';
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      {/* <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patrolling Response</h1>
            <p className="text-sm text-gray-600">View and manage patrolling checkpoint responses</p>
          </div>
        </div>
      </div> */}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Response List
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList> */}

        {/* List Tab */}
        <TabsContent value="list" className="mt-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {/* Total Visits Card */}
            <div 
              onClick={() => handleStatusCardClick(null)}
              className={`bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedStatus === null
                  ? "shadow-lg transition-shadow shadow-[0px_1px_8px_rgba(45,45,45,0.05)]"
                  : ""
              }`}
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {summaryStats.total_visits}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">
                  Total Visits
                </div>
              </div>
            </div>

            {/* Total Sessions Card */}
            <div 
              className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {summaryStats.total_sessions}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">
                  Total Sessions
                </div>
              </div>
            </div>

            {/* Total Tickets Card */}
            <div 
              className="bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#C72030]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#1A1A1A]">
                  {summaryStats.total_tickets_raised}
                  {isLoading && (
                    <span className="ml-1 text-xs animate-pulse">...</span>
                  )}
                </div>
                <div className="text-sm font-medium text-[#1A1A1A]">
                  Tickets Raised
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Data Table */}
          <div className="overflow-x-auto animate-fade-in">
            <EnhancedTable
              data={responseData}
              columns={enhancedTableColumns}
              renderCell={renderCell}
              storageKey="patrolling-response-table"
              enableExport={true}
              exportFileName="patrolling-response-data"
              handleExport={handleExport}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search responses..."
              pagination={false}
              pageSize={pagination.per_page}
              hideColumnsButton={false}
              hideTableExport={false}
              loading={isLoading}
              leftActions={null}
              rightActions={null}
            />

            {/* Server-side Pagination Controls */}
            {pagination.total_pages > 1 && (
              <div className="mt-6">
                <div className="flex items-center justify-between px-4 py-3 bg-white border-t rounded-lg">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1 || isLoading || searchLoading}
                      className={
                        pagination.current_page === 1 || isLoading || searchLoading
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    >
                      Previous
                    </Button>
                    {Array.from(
                      { length: Math.min(pagination.total_pages, 10) },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (!isLoading && !searchLoading) {
                            handlePageChange(page);
                          }
                        }}
                        disabled={isLoading || searchLoading}
                        className={
                          isLoading || searchLoading
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        {page}
                      </Button>
                    ))}
                    {pagination.total_pages > 10 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.total_pages || isLoading || searchLoading}
                      className={
                        pagination.current_page === pagination.total_pages || isLoading || searchLoading
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <div className="text-center mt-2 text-sm text-gray-600">
                  Showing page {currentPage} of {pagination.total_pages} (
                  {pagination.total_count} total visits)
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patrolling Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
