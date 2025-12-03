import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { PatrollingFilterModal, PatrollingFilters } from '@/components/PatrollingFilterModal';
import { AddPatrollingModal } from '@/components/AddPatrollingModal';
import { EditPatrollingModal } from '@/components/EditPatrollingModal';
import { DeletePatrollingModal } from '@/components/DeletePatrollingModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';
import { EnhancedTaskTable } from '@/components/enhanced-table/EnhancedTaskTable';
import { useDebounce } from '@/hooks/useDebounce';
import { userService, User } from '@/services/userService';

// Type definitions for the API response
interface PatrollingItem {
  id: number;
  name: string;
  description: string;
  estimated_duration_minutes: number;
  auto_ticket: boolean;
  validity_start_date: string;
  validity_end_date: string;
  grace_period_minutes: number;
  active: boolean;
  resource_type: string;
  resource_id: number;
  created_by_id: number;
  created_at: string;
  updated_at: string;
  questions: Array<{
    id: number;
    task: string;
    type: string;
    mandatory: boolean;
    options: string[];
  }>;
  schedules: Array<{
    id: number;
    name: string;
    frequency_type: string;
    start_time: string;
    start_date: string;
    end_date: string | null;
    assigned_guard_id: number;
    supervisor_id: number;
    active: boolean;
  }>;
  checkpoints: Array<{
    id: number;
    name: string;
    description: string;
    order_sequence: number;
    building_id: number | null;
    wing_id: number | null;
    floor_id: number | null;
    room_id: number | null;
    estimated_time_minutes: number;
    schedule_ids: number[];
  }>;
  summary: {
    questions_count: number;
    schedules_count: number;
    checkpoints_count: number;
  };
}

interface ApiResponse {
  success: boolean;
  data: PatrollingItem[];
  pagination: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
    has_next_page: boolean;
    has_prev_page: boolean;
  };
}
// Column configuration for the enhanced table
const columns: ColumnConfig[] = [{
  key: 'actions',
  label: 'Action',
  sortable: false,
  hideable: false,
  draggable: false
}, {
  key: 'name',
  label: 'Patrol Name',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'checkpoints',
  label: 'No. of Checkpoints',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'start_date',
  label: 'Start Date',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'end_date',
  label: 'End Date',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'assignee',
  label: 'Assignee',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'supervisor',
  label: 'Supervisor',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'grace_time',
  label: 'Grace Time',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'status',
  label: 'Status',
  sortable: true,
  hideable: true,
  draggable: true
}];
export const PatrollingDashboard = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatrollingId, setSelectedPatrollingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [appliedFilters, setAppliedFilters] = useState<PatrollingFilters>({});
  const [patrollingData, setPatrollingData] = useState<PatrollingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next_page: false,
    has_prev_page: false
  });

  // Fetch patrolling data from API
  const fetchPatrollingData = async (page = 1, per_page = 10, search = '', filters: PatrollingFilters = {}) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error('API configuration is missing');
      }

      // Build API URL with parameters
      let apiUrl = getFullUrl(`/patrolling/setup.json?page=${page}&per_page=${per_page}`);

      // Add search parameter
      if (search.trim()) {
        apiUrl += `&q[search_all_fields_cont]=${encodeURIComponent(search.trim())}`;
      }

      // Add filter parameters based on the API structure you provided
      if (filters.buildingId) {
        apiUrl += `&q[patrolling_checkpoints_building_id_eq]=${filters.buildingId}`;
      }

      if (filters.wingId) {
        apiUrl += `&q[patrolling_checkpoints_wing_id_eq]=${filters.wingId}`;
      }

      if (filters.areaId) {
        apiUrl += `&q[patrolling_checkpoints_area_id_eq]=${filters.areaId}`;
      }

      if (filters.floorId) {
        apiUrl += `&q[patrolling_checkpoints_floor_id_eq]=${filters.floorId}`;
      }

      if (filters.roomId) {
        apiUrl += `&q[patrolling_checkpoints_room_id_eq]=${filters.roomId}`;
      }

      // Handle status filter
      if (filters.status) {
        const isActive = filters.status === 'active';
        apiUrl += `&q[active_eq]=${isActive}`;
      }

      console.log('🔗 API URL with filters:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        setPatrollingData(result.data);
        
        // Calculate correct pagination values to handle edge cases
        const totalCount = result.pagination.total_count || 0;
        
        // If no data, set pagination to show nothing
        if (totalCount === 0) {
          setPagination({
            current_page: 1,
            per_page: per_page,
            total_pages: 0,
            total_count: 0,
            has_next_page: false,
            has_prev_page: false
          });
        } else {
          const actualTotalPages = Math.ceil(totalCount / per_page);
          const currentPageNum = Math.min(page, actualTotalPages);
          
          setPagination({
            current_page: currentPageNum,
            per_page: per_page,
            total_pages: actualTotalPages,
            total_count: totalCount,
            has_next_page: currentPageNum < actualTotalPages,
            has_prev_page: currentPageNum > 1
          });

          // If current page exceeds total pages after filter/search, reset to page 1
          if (page > actualTotalPages) {
            setCurrentPage(1);
          }
        }
      } else {
        throw new Error('Failed to fetch patrolling data');
      }
    } catch (error: any) {
      console.error('Error fetching patrolling data:', error);
      toast.error(`Failed to load patrolling data: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await userService.getEscalateToUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, []);

  // Load data on component mount and when page/perPage/filters change
  useEffect(() => {
    console.log('Effect triggered - debouncedSearchQuery:', debouncedSearchQuery); // Debug log
    fetchPatrollingData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
  }, [currentPage, perPage, debouncedSearchQuery, appliedFilters]);

  // Handle filter application
  const handleApplyFilters = (filters: PatrollingFilters) => {
    console.log('📊 Applying filters:', filters);
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when applying filters
  };  // Handle search
  const handleSearch = (term: string) => {
    console.log('Search query:', term); // Debug log
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
    // Force immediate search if query is empty (for clear search)
    if (!term.trim()) {
      fetchPatrollingData(1, perPage, '', appliedFilters);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Helper function to get user name by ID
  const getUserName = (userId: number | null | undefined): string => {
    if (!userId) return '—';
    const user = users.find(u => u.id === userId);
    return user ? user.full_name : `User ${userId}`;
  };

  // Helper function to get shift type (frequency type)
  const getShiftType = (schedules: PatrollingItem['schedules']) => {
    if (schedules.length === 0) return 'No shifts';
    // Get unique frequency types, filtering out null/undefined values
    const frequencies = [...new Set(schedules.map(s => s.frequency_type).filter(f => f != null && f !== ''))];
    if (frequencies.length === 0) return 'No frequency set';
    if (frequencies.length === 1) {
      return frequencies[0].charAt(0).toUpperCase() + frequencies[0].slice(1);
    }
    return `${frequencies[0]} +${frequencies.length - 1} more`;
  };

  const totalRecords = pagination.total_count;
  const totalPages = pagination.total_pages;
  // Use API data directly instead of client-side filtering
  const displayedData = patrollingData;

  // Render row function for enhanced table
  const renderRow = (patrol: PatrollingItem) => ({
    actions: <div className="flex items-center gap-2">
      <button onClick={() => handleView(patrol.id)} className="p-1 text-black hover:bg-gray-100 rounded" title="View">
        <Eye className="w-4 h-4" />
      </button>
      <button onClick={() => handleEdit(patrol.id)} className="p-1 text-black hover:bg-gray-100 rounded" title="Edit">
        <Edit className="w-4 h-4" />
      </button>
      <button onClick={() => handleDelete(patrol.id)} className="p-1 text-black hover:bg-gray-100 rounded" title="Delete">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>,
    name: <div className="font-medium">{patrol.name}</div>,
    checkpoints: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-black">
      {patrol.checkpoints.length}
    </span>,
    start_date: <span className="text-sm text-gray-600">
      {patrol.validity_start_date ? new Date(patrol.validity_start_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) : '—'}
    </span>,
    end_date: <span className="text-sm text-gray-600">
      {patrol.validity_end_date ? new Date(patrol.validity_end_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) : '—'}
    </span>,
    assignee: <span className="text-sm text-gray-600">
      {patrol.schedules.length > 0 ? getUserName(patrol.schedules[0].assigned_guard_id) : '—'}
    </span>,
    supervisor: <span className="text-sm text-gray-600">
      {patrol.schedules.length > 0 ? getUserName(patrol.schedules[0].supervisor_id) : '—'}
    </span>,
    shift_type: <div className="text-sm text-gray-600">{getShiftType(patrol.schedules)}</div>,
    grace_time: <span className="text-sm text-gray-600">{patrol.grace_period_minutes} min</span>,
    status: <div className="flex items-center justify-center">
      <Switch
        checked={patrol.active}
        onCheckedChange={() => handleToggleStatus(patrol.id, patrol.active)}
      />
    </div>
  });
  const handleView = (id: number) => {
    console.log('View patrolling:', id);
    navigate(`/security/patrolling/details/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit patrolling:', id);
    navigate(`/security/patrolling/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    console.log('Delete patrolling:', id);
    setSelectedPatrollingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPatrollingId) return;

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error('API configuration is missing');
      }

      const apiUrl = getFullUrl(`/patrolling/setup/${selectedPatrollingId}.json`);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success('Patrolling deleted successfully!', {
        duration: 3000,
      });

      // Refresh the data
      fetchPatrollingData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
      setIsDeleteModalOpen(false);
      setSelectedPatrollingId(null);
    } catch (error: any) {
      console.error('Error deleting patrolling:', error);
      toast.error(`Failed to delete patrolling: ${error.message}`, {
        duration: 5000,
      });
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;

      if (!baseUrl || !token) {
        throw new Error('API configuration is missing');
      }

      const apiUrl = getFullUrl(`/patrolling/setup/${id}.json`);

      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify({
          patrolling: {
            active: !currentStatus
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state optimistically
      setPatrollingData(prev => prev.map(patrol =>
        patrol.id === id ? { ...patrol, active: !currentStatus } : patrol
      ));

      toast.success(`Patrolling ${!currentStatus ? 'activated' : 'deactivated'} successfully!`, {
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error toggling patrolling status:', error);
      toast.error(`Failed to update status: ${error.message}`, {
        duration: 5000,
      });
      // Refresh data on error to ensure consistency
      fetchPatrollingData(currentPage, perPage, debouncedSearchQuery, appliedFilters);
    }
  };
  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patrolling List</h1>
      </header>

      <EnhancedTaskTable
        data={displayedData}
        columns={columns}
        renderRow={renderRow}
        storageKey="patrolling-dashboard-v3"
        hideTableExport={true}
        hideTableSearch={false}
        enableSearch={true}
        isLoading={loading}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onFilterClick={() => setIsFilterOpen(true)}
        leftActions={(
          <Button className='bg-primary text-primary-foreground hover:bg-primary/90'  onClick={() => navigate('/security/patrolling/create')}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        )}
      />

      {totalRecords > 0 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          perPage={perPage}
          isLoading={loading}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      )}

      <PatrollingFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
      {selectedPatrollingId !== null && (
        <DeletePatrollingModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPatrollingId(null);
          }}
          onConfirm={handleDeleteConfirm}
          patrollingId={selectedPatrollingId}
        />
      )}
    </div>
  );
};