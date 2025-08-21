import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for the role config data
interface RoleConfigItem {
  id: number;
  roleName: string;
  description: string;
  permissions: string[];
  createdOn: string;
  createdBy: string;
  active: boolean;
}

interface ApiResponse {
  success: boolean;
  data: RoleConfigItem[];
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
    key: 'roleName',
    label: 'Role Name',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'permissions',
    label: 'Permissions',
    sortable: false,
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
  },
  {
    key: 'active',
    label: 'Status',
    sortable: true,
    hideable: true,
    draggable: true
  }
];

// Mock data for role configuration management
const mockRoleConfigData: RoleConfigItem[] = [
  {
    id: 1,
    roleName: 'Super Admin',
    description: 'Full system access and administration rights',
    permissions: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE_USERS'],
    createdOn: '15/08/2024',
    createdBy: 'System Admin',
    active: true
  },
  {
    id: 2,
    roleName: 'Facility Manager',
    description: 'Manage facility operations and maintenance',
    permissions: ['READ', 'UPDATE', 'MANAGE_TICKETS', 'MANAGE_ASSETS'],
    createdOn: '12/08/2024',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 3,
    roleName: 'Maintenance Staff',
    description: 'Handle maintenance tasks and updates',
    permissions: ['READ', 'UPDATE', 'MANAGE_TASKS'],
    createdOn: '10/08/2024',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 4,
    roleName: 'Security Officer',
    description: 'Monitor security and access control',
    permissions: ['READ', 'MANAGE_VISITORS', 'MANAGE_SECURITY'],
    createdOn: '08/08/2024',
    createdBy: 'Robert Day2',
    active: false
  },
  {
    id: 5,
    roleName: 'Accountant',
    description: 'Handle financial operations and approvals',
    permissions: ['READ', 'MANAGE_FINANCE', 'APPROVE_INVOICES'],
    createdOn: '05/08/2024',
    createdBy: 'Finance Head',
    active: true
  }
];

export const RoleConfigList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [roleConfigData, setRoleConfigData] = useState<RoleConfigItem[]>(mockRoleConfigData);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total_pages: 1,
    total_count: mockRoleConfigData.length,
    has_next_page: false,
    has_prev_page: false
  });

  // Mock API call - replace with actual API when backend is ready
  const fetchRoleConfigData = async (page = 1, per_page = 20, search = '') => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter data based on search term
      let filteredData = mockRoleConfigData;
      if (search.trim()) {
        filteredData = mockRoleConfigData.filter(item =>
          item.roleName.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.createdBy.toLowerCase().includes(search.toLowerCase()) ||
          item.createdOn.includes(search)
        );
      }

      // Paginate data
      const startIndex = (page - 1) * per_page;
      const paginatedData = filteredData.slice(startIndex, startIndex + per_page);

      setRoleConfigData(paginatedData);
      setPagination({
        current_page: page,
        per_page: per_page,
        total_pages: Math.ceil(filteredData.length / per_page),
        total_count: filteredData.length,
        has_next_page: page < Math.ceil(filteredData.length / per_page),
        has_prev_page: page > 1
      });
    } catch (error: any) {
      console.error('Error fetching role config data:', error);
      toast.error(`Failed to load role configuration data: ${error.message}`, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when page/perPage/filters change
  useEffect(() => {
    fetchRoleConfigData(currentPage, perPage, debouncedSearchQuery);
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
  const renderRow = (roleConfig: RoleConfigItem) => ({
    roleName: (
      <div className="font-medium text-gray-900">{roleConfig.roleName}</div>
    ),
    description: (
      <div className="text-sm text-gray-600 max-w-xs truncate" title={roleConfig.description}>
        {roleConfig.description}
      </div>
    ),
    permissions: (
      <div className="flex flex-wrap gap-1">
        {roleConfig.permissions.slice(0, 2).map((permission, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#C72030]/10 text-[#C72030]"
          >
            {permission}
          </span>
        ))}
        {roleConfig.permissions.length > 2 && (
          <span className="text-xs text-gray-500">
            +{roleConfig.permissions.length - 2} more
          </span>
        )}
      </div>
    ),
    createdOn: (
      <span className="text-sm text-gray-600">{roleConfig.createdOn}</span>
    ),
    createdBy: (
      <span className="text-sm text-gray-600">{roleConfig.createdBy || '-'}</span>
    ),
    active: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        roleConfig.active 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {roleConfig.active ? 'Active' : 'Inactive'}
      </span>
    )
  });

  const handleView = (id: number) => {
    console.log('View role config:', id);
    navigate(`/settings/role-config/view/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit role config:', id);
    navigate(`/settings/role-config/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this role configuration?')) {
      setRoleConfigData(prev => prev.filter(item => item.id !== id));
      toast.success('Role configuration deleted successfully!');
    }
  };

  const handleAdd = () => {
    navigate('/settings/role-config/create');
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Role Configuration</h1>
            <p className="text-gray-600">Manage role permissions and configurations</p>
          </div>
        </div>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
        </div>
      )}

      {!loading && (
        <EnhancedTable
          data={roleConfigData}
          columns={columns}
          renderRow={renderRow}
          storageKey="role-config-table"
          enableSearch={true}
          searchPlaceholder="Search role configurations..."
          onSearchChange={handleSearch}
          enableExport={false}
          exportFileName="role-config-data"
          leftActions={
            <Button 
              onClick={handleAdd} 
              className="flex items-center gap-2 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          }
          rightActions={
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleView(roleConfigData[0]?.id || 1)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-[#C72030]/20 text-[#C72030] hover:bg-[#C72030]/5"
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
              <Button
                onClick={() => handleEdit(roleConfigData[0]?.id || 1)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-[#C72030]/20 text-[#C72030] hover:bg-[#C72030]/5"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(roleConfigData[0]?.id || 1)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          }
          pagination={true}
          pageSize={perPage}
          loading={loading}
          emptyMessage="No role configurations found. Create your first role configuration to get started."
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
    </div>
  );
};
