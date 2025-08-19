import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for the roster data
interface RosterItem {
  id: number;
  template: string;
  location: string;
  department: string;
  shift: string;
  rosterType: string;
  createdOn: string;
  createdBy: string;
  active: boolean;
}

interface ApiResponse {
  success: boolean;
  data: RosterItem[];
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
const columns: ColumnConfig[] = [
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    hideable: false,
    draggable: false
  },
  {
    key: 'template',
    label: 'Template',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'location',
    label: 'Location',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'shift',
    label: 'Shift',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'rosterType',
    label: 'Roster Type',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'createdOn',
    label: 'Created On',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'createdBy',
    label: 'Created By',
    sortable: true,
    hideable: true,
    draggable: true
  }
];

// Mock data for roster management (based on the image provided)
const mockRosterData: RosterItem[] = [
  {
    id: 1,
    template: 'Mon, Tue, Wed',
    location: 'Lockated',
    department: 'Tech',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '18/04/2023',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 2,
    template: 'MON,TUE,WED',
    location: 'Lockated',
    department: 'Tech',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '13/03/2023',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 3,
    template: 'Operations',
    location: 'Lockated',
    department: 'Operations',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '09/02/2023',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 4,
    template: '2023',
    location: 'Lockated',
    department: 'Operations',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '09/02/2023',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 5,
    template: 'Monday,Wednesday,Friday',
    location: 'Lockated',
    department: 'Operations',
    shift: '10:00 AM to 07:00 PM',
    rosterType: 'Permanent',
    createdOn: '29/11/2022',
    createdBy: '',
    active: true
  },
  {
    id: 6,
    template: 'Mon,Wed,Fri',
    location: 'Lockated',
    department: 'Operations',
    shift: '10:30 AM to 06:30 PM',
    rosterType: 'Permanent',
    createdOn: '28/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 7,
    template: 'operations',
    location: 'Lockated',
    department: 'Operations',
    shift: '09:00 AM to 06:00 PM',
    rosterType: 'Permanent',
    createdOn: '28/11/2022',
    createdBy: '',
    active: true
  },
  {
    id: 8,
    template: 'tech',
    location: 'Lockated',
    department: 'Operations',
    shift: '10:30 AM to 06:30 PM',
    rosterType: 'Permanent',
    createdOn: '28/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 9,
    template: 'Monday to Saturday',
    location: 'Lockated',
    department: 'Operations',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '25/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 10,
    template: 'ho',
    location: 'Lockated',
    department: 'Operations',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '16/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 11,
    template: 'IOS',
    location: 'Lockated',
    department: 'IOS',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '09/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 12,
    template: 'Roster R (Mon,Wed,Thu,Fri)',
    location: 'Lockated',
    department: 'Marketing',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '12/10/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 13,
    template: 'Roster Z',
    location: 'Lockated',
    department: 'Sales,HR',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '15/09/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 14,
    template: 'Mon,Tue, Wed, Thurs,Fri',
    location: 'Lockated',
    department: 'kitchen',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '14/09/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 15,
    template: 'Monday, Wednesday, Friday',
    location: 'Lockated',
    department: 'HR',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '14/09/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 16,
    template: 'Tuesday,Thursday,Sat',
    location: 'Lockated',
    department: 'Sales,HR,Operations,IR,Tech,Accounts,RM ,BMS,Electrical,IBMS,Housekeeping,kitchen,Finance',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '13/09/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 17,
    template: 'QA',
    location: 'Lockated',
    department: 'Sales,HR,Operations,IR,Tech,Accounts,RM ,BMS,Electrical,IBMS,Housekeeping',
    shift: '03:15 AM to 11:15 PM',
    rosterType: 'Permanent',
    createdOn: '22/06/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 18,
    template: 'IR Roster',
    location: 'Lockated',
    department: 'IR',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '06/01/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 19,
    template: 'Weekly Roster 4 (Sales,Accounts)',
    location: 'Lockated',
    department: 'Sales',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '13/08/2021',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 20,
    template: 'Weekly Roster 3 (Tech)',
    location: 'Lockated',
    department: 'Tech',
    shift: '10:00 AM to 08:00 PM',
    rosterType: 'Permanent',
    createdOn: '13/08/2021',
    createdBy: 'Robert Day2',
    active: true
  }
];

export const RosterDashboard = () => {
  const navigate = useNavigate();
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRosterId, setSelectedRosterId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20); // Show 20 per page like in the image
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [rosterData, setRosterData] = useState<RosterItem[]>(mockRosterData);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total_pages: 1,
    total_count: mockRosterData.length,
    has_next_page: false,
    has_prev_page: false
  });

  // Mock API call - replace with actual API when backend is ready
  const fetchRosterData = async (page = 1, per_page = 20, search = '') => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter data based on search term
      let filteredData = mockRosterData;
      if (search.trim()) {
        filteredData = mockRosterData.filter(item =>
          item.template.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase()) ||
          item.department.toLowerCase().includes(search.toLowerCase()) ||
          item.shift.toLowerCase().includes(search.toLowerCase()) ||
          item.createdBy.toLowerCase().includes(search.toLowerCase()) ||
          item.createdOn.includes(search)
        );
      }

      // Paginate data
      const startIndex = (page - 1) * per_page;
      const paginatedData = filteredData.slice(startIndex, startIndex + per_page);

      setRosterData(paginatedData);
      setPagination({
        current_page: page,
        per_page: per_page,
        total_pages: Math.ceil(filteredData.length / per_page),
        total_count: filteredData.length,
        has_next_page: page < Math.ceil(filteredData.length / per_page),
        has_prev_page: page > 1
      });
    } catch (error: any) {
      console.error('Error fetching roster data:', error);
      toast.error(`Failed to load roster data: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when page/perPage/filters change
  useEffect(() => {
    fetchRosterData(currentPage, perPage, debouncedSearchQuery);
  }, [currentPage, perPage, debouncedSearchQuery]);

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

  const totalRecords = pagination.total_count;
  const totalPages = pagination.total_pages;

  // Render row function for enhanced table
  const renderRow = (roster: RosterItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleEdit(roster.id)} 
          className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    ),
    template: (
      <div className="font-medium text-gray-900 max-w-xs truncate" title={roster.template}>
        {roster.template}
      </div>
    ),
    location: (
      <span className="text-sm text-gray-600">{roster.location}</span>
    ),
    department: (
      <div className="text-sm text-gray-600 max-w-xs truncate" title={roster.department}>
        {roster.department}
      </div>
    ),
    shift: (
      <span className="text-sm text-gray-600 whitespace-nowrap">{roster.shift}</span>
    ),
    rosterType: (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {roster.rosterType}
      </span>
    ),
    createdOn: (
      <span className="text-sm text-gray-600">{roster.createdOn}</span>
    ),
    createdBy: (
      <span className="text-sm text-gray-600">{roster.createdBy || '-'}</span>
    )
  });

  const handleEdit = (id: number) => {
    console.log('Edit roster:', id);
    // TODO: Implement edit functionality
    toast.info('Edit functionality will be implemented');
  };

  const handleAdd = () => {
    navigate('/roster/create');
  };

  const handleExport = () => {
    setIsExportOpen(true);
  };

  const handleBulkUpload = () => {
    setIsBulkUploadOpen(true);
  };

  const handleFilter = () => {
    setIsFilterOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
            <Calendar className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Roster Management</h1>
            <p className="text-gray-600">Manage roster templates and schedules</p>
          </div>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
        </div>
      )}

      {!loading && (
        <EnhancedTable
          data={rosterData}
          columns={columns}
          renderRow={renderRow}
          storageKey="roster-management-table"
          enableSearch={true}
          searchPlaceholder="Search rosters..."
          onSearchChange={handleSearch}
          enableExport={false}
          exportFileName="roster-data"
          leftActions={
            <Button 
              onClick={handleAdd} 
              className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          }
          pagination={true}
          pageSize={perPage}
          loading={loading}
          emptyMessage="No rosters found. Create your first roster to get started."
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1 to {Math.min(perPage, totalRecords)} of {totalRecords} rows
          </div>
          <TicketPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
            perPage={perPage}
            onPerPageChange={handlePerPageChange}
            isLoading={loading}
          />
        </div>
      )}

      {/* Modals */}
      {isBulkUploadOpen && (
        <BulkUploadModal
          isOpen={isBulkUploadOpen}
          onClose={() => setIsBulkUploadOpen(false)}
        />
      )}

      {isExportOpen && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
};
