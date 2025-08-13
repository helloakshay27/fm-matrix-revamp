import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { PatrollingFilterModal } from '@/components/PatrollingFilterModal';
import { AddPatrollingModal } from '@/components/AddPatrollingModal';
import { EditPatrollingModal } from '@/components/EditPatrollingModal';
import { DeletePatrollingModal } from '@/components/DeletePatrollingModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';

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
  key: 'shift_type',
  label: 'Shift Type',
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
  const [patrollingData, setPatrollingData] = useState<PatrollingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_count: 0,
    has_next_page: false,
    has_prev_page: false
  });

  // Fetch patrolling data from API
  const fetchPatrollingData = async (page = 1, per_page = 10, search = '') => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      if (!baseUrl || !token) {
        throw new Error('API configuration is missing');
      }

      // Build API URL with search parameter if provided
      let apiUrl = getFullUrl(`/patrolling/setup.json?page=${page}&per_page=${per_page}`);
      if (search.trim()) {
        apiUrl += `&search=${encodeURIComponent(search.trim())}`;
      }
      
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
        setPagination(result.pagination);
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

  // Load data on component mount and when page/perPage changes
  useEffect(() => {
    fetchPatrollingData(currentPage, perPage, searchTerm);
  }, [currentPage, perPage, searchTerm]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
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

  // Helper function to get shift type (frequency type)
  const getShiftType = (schedules: PatrollingItem['schedules']) => {
    if (schedules.length === 0) return 'No shifts';
    // Get unique frequency types
    const frequencies = [...new Set(schedules.map(s => s.frequency_type))];
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
      <button onClick={() => handleView(patrol.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View">
        <Eye className="w-4 h-4" />
      </button>
      <button onClick={() => handleEdit(patrol.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Edit">
        <Edit className="w-4 h-4" />
      </button>
      <button onClick={() => handleDelete(patrol.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>,
    name: <div className="font-medium">{patrol.name}</div>,
    checkpoints: <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {patrol.checkpoints.length}
    </span>,
    shift_type: <div className="text-sm text-gray-600">{getShiftType(patrol.schedules)}</div>,
    grace_time: <span className="text-sm text-gray-600">{patrol.grace_period_minutes} min</span>,
    status: <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      patrol.active 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {patrol.active ? 'Active' : 'Inactive'}
    </span>
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
      fetchPatrollingData(currentPage, perPage, searchTerm);
      setIsDeleteModalOpen(false);
      setSelectedPatrollingId(null);
    } catch (error: any) {
      console.error('Error deleting patrolling:', error);
      toast.error(`Failed to delete patrolling: ${error.message}`, {
        duration: 5000,
      });
    }
  };
  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patrolling List</h1>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading patrolling data...</span>
        </div>
      )}

      {!loading && (
        <>
          <EnhancedTable
            data={displayedData}
            columns={columns}
            renderRow={renderRow}
            storageKey="patrolling-dashboard-v3"
            hideTableExport={true}
            hideTableSearch={false}
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
            leftActions={(
              <Button variant="outline" onClick={() => navigate('/security/patrolling/create')}>
                <Plus className="w-4 h-4 mr-2" /> New
              </Button>
            )}
          />

          <TicketPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            perPage={perPage}
            isLoading={loading}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        </>
      )}

      <PatrollingFilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
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