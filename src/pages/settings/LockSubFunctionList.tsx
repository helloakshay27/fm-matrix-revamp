import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2, Key, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { CreateLockSubFunctionDialog } from './LockSubFunctionCreate';
import { CreateSubFunctionDialog } from './CreateSubFunctionDialog';
import { lockSubFunctionService, LockSubFunctionItem as ApiLockSubFunctionItem } from '@/services/lockSubFunctionService';

// Type definitions for the lock sub function data
interface LockSubFunctionItem {
  id: number;
  subFunctionName: string;
  parentFunction: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  conditions: string[];
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
    key: 'subFunctionName',
    label: 'Sub Function Name',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'parentFunction',
    label: 'Parent Function',
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
    key: 'priority',
    label: 'Priority',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'conditions',
    label: 'Conditions',
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

// Mock data for lock sub function management
const mockLockSubFunctionData: LockSubFunctionItem[] = [
  {
    id: 1,
    subFunctionName: 'Failed Login Attempts',
    parentFunction: 'User Account Lock',
    description: 'Lock user after 3 failed login attempts',
    priority: 'HIGH',
    conditions: ['Failed attempts >= 3', 'Within 15 minutes'],
    createdOn: '15/08/2024',
    createdBy: 'System Admin',
    active: true
  },
  {
    id: 2,
    subFunctionName: 'Database Backup Lock',
    parentFunction: 'Maintenance Mode Lock',
    description: 'Prevent data modifications during backup',
    priority: 'CRITICAL',
    conditions: ['Backup process running', 'Admin authorization required'],
    createdOn: '12/08/2024',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 3,
    subFunctionName: 'Asset Transfer Lock',
    parentFunction: 'Asset Modification Lock',
    description: 'Lock asset during transfer process',
    priority: 'MEDIUM',
    conditions: ['Transfer in progress', 'Approval pending'],
    createdOn: '10/08/2024',
    createdBy: 'Asset Manager',
    active: true
  },
  {
    id: 4,
    subFunctionName: 'Invoice Approval Lock',
    parentFunction: 'Financial Report Lock',
    description: 'Lock invoice after final approval',
    priority: 'HIGH',
    conditions: ['Approved by finance head', 'Payment processed'],
    createdOn: '08/08/2024',
    createdBy: 'Finance Head',
    active: false
  },
  {
    id: 5,
    subFunctionName: 'Idle Session Detection',
    parentFunction: 'Session Timeout Lock',
    description: 'Detect inactive sessions for automatic logout',
    priority: 'LOW',
    conditions: ['No activity for 30 minutes', 'Warning sent'],
    createdOn: '05/08/2024',
    createdBy: 'Security Team',
    active: true
  }
];

export const LockSubFunctionList = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Same as ShiftDashboard
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [allLockSubFunctionData, setAllLockSubFunctionData] = useState<LockSubFunctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // API call to fetch lock sub function data
  const fetchLockSubFunctionData = async () => {
    setLoading(true);
    try {
      const data = await lockSubFunctionService.fetchLockSubFunctions();
      setAllLockSubFunctionData(data);
      console.log('Lock Sub Function Data Count:', data.length);
    } catch (error: any) {
      console.error('Error fetching lock sub function data:', error);
      toast.error(`Failed to load lock sub function data: ${error.message}`, {
        duration: 5000,
      });
      
      // Fallback to mock data on API error for development
      setAllLockSubFunctionData(mockLockSubFunctionData);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLockSubFunctionData();
  }, []);

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allLockSubFunctionData.length]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Filter and paginate data
  const filteredLockSubFunctionData = useMemo(() => {
    if (!allLockSubFunctionData || !Array.isArray(allLockSubFunctionData)) return [];
    
    return allLockSubFunctionData.filter(item => {
      if (!debouncedSearchQuery.trim()) return true;
      
      const searchLower = debouncedSearchQuery.toLowerCase();
      return (
        item.subFunctionName.toLowerCase().includes(searchLower) ||
        item.parentFunction.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.priority.toLowerCase().includes(searchLower) ||
        item.createdBy.toLowerCase().includes(searchLower) ||
        item.createdOn.includes(debouncedSearchQuery)
      );
    });
  }, [allLockSubFunctionData, debouncedSearchQuery]);

  // Pagination calculations
  const totalItems = filteredLockSubFunctionData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLockSubFunctionData = filteredLockSubFunctionData.slice(startIndex, endIndex);

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
  const renderRow = (lockSubFunction: LockSubFunctionItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleEdit(lockSubFunction.id)} 
          className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleView(lockSubFunction.id)} 
          className="p-1 text-green-600 hover:bg-green-50 rounded" 
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleDelete(lockSubFunction.id)} 
          className="p-1 text-red-600 hover:bg-red-50 rounded" 
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    subFunctionName: (
      <div className="font-medium text-gray-900">{lockSubFunction.subFunctionName}</div>
    ),
    parentFunction: (
      <div className="text-sm text-gray-600 font-medium">{lockSubFunction.parentFunction}</div>
    ),
    description: (
      <div className="text-sm text-gray-600 max-w-xs truncate" title={lockSubFunction.description}>
        {lockSubFunction.description}
      </div>
    ),
    priority: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        lockSubFunction.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
        lockSubFunction.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
        lockSubFunction.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }`}>
        {lockSubFunction.priority}
      </span>
    ),
    conditions: (
      <div className="text-sm text-gray-600">
        <div className="flex flex-wrap gap-1">
          {lockSubFunction.conditions.slice(0, 2).map((condition, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
            >
              {condition}
            </span>
          ))}
          {lockSubFunction.conditions.length > 2 && (
            <span className="text-xs text-gray-500">
              +{lockSubFunction.conditions.length - 2} more
            </span>
          )}
        </div>
      </div>
    ),
    createdOn: (
      <span className="text-sm text-gray-600">{lockSubFunction.createdOn}</span>
    ),
    createdBy: (
      <span className="text-sm text-gray-600">{lockSubFunction.createdBy || '-'}</span>
    ),
    active: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        lockSubFunction.active 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {lockSubFunction.active ? 'Active' : 'Inactive'}
      </span>
    )
  });

  const handleView = (id: number) => {
    console.log('View lock sub function:', id);
    navigate(`/settings/account/lock-sub-function/view/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit lock sub function:', id);
    navigate(`/settings/account/lock-sub-function/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lock sub function?')) {
      try {
        await lockSubFunctionService.deleteLockSubFunction(id);
        setAllLockSubFunctionData(prev => prev.filter(item => item.id !== id));
        toast.success('Lock sub function deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting lock sub function:', error);
        toast.error(`Failed to delete lock sub function: ${error.message}`);
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
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Lock Sub Function Management</h1>
            <p className="text-gray-600">Manage system lock sub functions and conditions</p>
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
            data={currentLockSubFunctionData}
            columns={columns}
            renderRow={renderRow}
            storageKey="lock-sub-function-table"
            enableSearch={true}
            searchPlaceholder="Search lock sub functions..."
            onSearchChange={handleSearch}
            enableExport={false}
            exportFileName="lock-sub-function-data"
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
            emptyMessage="No lock sub functions found. Create your first lock sub function to get started."
          />

          {/* Pagination Controls - matching ShiftDashboard style */}
          {allLockSubFunctionData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} lock sub functions
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

      {/* Create Lock Sub Function Dialog */}
      <CreateLockSubFunctionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onLockSubFunctionCreated={() => {
          setIsCreateDialogOpen(false);
          fetchLockSubFunctionData();
        }}
      />
    </div>
  );
};
