import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { CreateRoleConfigDialog } from './CreateRoleConfigDialog';
import { roleConfigService, RoleConfigItem as ApiRoleConfigItem } from '@/services/roleConfigService';

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

// Transform API data to frontend format
const transformRoleConfigData = (apiData: ApiRoleConfigItem[]): RoleConfigItem[] => {
  return apiData.map(item => ({
    id: item.id,
    roleName: item.roleName || 'Unnamed Role',
    description: item.description || 'No description available',
    permissions: item.permissions || [],
    createdOn: item.createdOn || new Date().toLocaleDateString('en-GB'),
    createdBy: item.createdBy || 'System',
    active: Boolean(item.active)
  }));
};

export const RoleConfigList = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Same as ShiftDashboard
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [allRoleConfigData, setAllRoleConfigData] = useState<RoleConfigItem[]>([]);
  const [loading, setLoading] = useState(true);

  // API call to fetch role config data
  const fetchRoleConfigData = async () => {
    setLoading(true);
    try {
      const apiData = await roleConfigService.fetchRoleConfigs();
      const transformedData = transformRoleConfigData(apiData);
      setAllRoleConfigData(transformedData);
      console.log('Role Config Data Count:', transformedData.length);
    } catch (error: any) {
      console.error('Error fetching role config data:', error);
      
      // Check if it's a 404 error and show specific message
      if (error.message.includes('404')) {
        toast.error('Role configuration API endpoint not found. Using mock data for development.', {
          duration: 3000,
        });
      } else {
        toast.error(`Failed to load role configuration data: ${error.message}`, {
          duration: 5000,
        });
      }
      
      // Fallback to mock data on API error for development
      setAllRoleConfigData(mockRoleConfigData);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRoleConfigData();
  }, []);

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allRoleConfigData.length]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Filter and paginate data
  const filteredRoleConfigData = useMemo(() => {
    if (!allRoleConfigData || !Array.isArray(allRoleConfigData)) return [];
    
    return allRoleConfigData.filter(item => {
      if (!debouncedSearchQuery.trim()) return true;
      
      const searchLower = debouncedSearchQuery.toLowerCase();
      return (
        item.roleName.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.createdBy.toLowerCase().includes(searchLower) ||
        item.createdOn.includes(debouncedSearchQuery)
      );
    });
  }, [allRoleConfigData, debouncedSearchQuery]);

  // Pagination calculations
  const totalItems = filteredRoleConfigData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRoleConfigData = filteredRoleConfigData.slice(startIndex, endIndex);

  // Pagination functions
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Render row function for enhanced table
  const renderRow = (roleConfig: RoleConfigItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleEdit(roleConfig.id)} 
          className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleView(roleConfig.id)} 
          className="p-1 text-green-600 hover:bg-green-50 rounded" 
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleDelete(roleConfig.id)} 
          className="p-1 text-red-600 hover:bg-red-50 rounded" 
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    roleName: (
      <div className="font-medium text-gray-900">{roleConfig.roleName}</div>
    ),
    description: (
      <div className="text-sm text-gray-600 max-w-xs truncate">
        {roleConfig.description || 'No description available'}
      </div>
    ),
    permissions: (
      <div className="flex flex-wrap gap-1">
        {roleConfig.permissions.slice(0, 3).map((permission, index) => (
          <span 
            key={index}
            className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700"
          >
            {permission}
          </span>
        ))}
        {roleConfig.permissions.length > 3 && (
          <span className="text-xs text-gray-500">
            +{roleConfig.permissions.length - 3} more
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
    navigate(`/settings/account/role-config/view/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit role config:', id);
    navigate(`/settings/account/role-config/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role configuration?')) {
      try {
        await roleConfigService.deleteRoleConfig(id);
        setAllRoleConfigData(prev => prev.filter(item => item.id !== id));
        toast.success('Role configuration deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting role config:', error);
        toast.error(`Failed to delete role configuration: ${error.message}`);
      }
    }
  };

  const handleAdd = () => {
    setIsCreateDialogOpen(true);
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
        <div className="">
          <EnhancedTable
            data={currentRoleConfigData}
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
            pagination={false} // Disable built-in pagination since we're adding custom
            loading={loading}
            emptyMessage="No role configurations found. Create your first role configuration to get started."
          />

          {/* Pagination Controls - matching ShiftDashboard style */}
          {allRoleConfigData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} role configurations
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(1)}
                        className="w-8 h-8 p-0"
                      >
                        1
                      </Button>
                      {currentPage > 4 && <span className="px-2">...</span>}
                    </>
                  )}

                  {/* Show pages around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => page >= currentPage - 2 && page <= currentPage + 2)
                    .map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}

                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Role Config Dialog */}
      <CreateRoleConfigDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onRoleConfigCreated={() => {
          setIsCreateDialogOpen(false);
          fetchRoleConfigData();
        }}
      />
    </div>
  );
};

export default RoleConfigList;
