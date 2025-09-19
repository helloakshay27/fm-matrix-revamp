import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { CreateLockFunctionDialog } from './CreateLockFunctionDialog';
import { CreateFunctionDialog } from './CreateFunctionDialog';
import { lockFunctionService, LockFunction as ApiLockFunctionItem } from '@/services/lockFunctionService';

// Type definitions for the lock function data
interface LockFunctionItem {
  id: number;
  functionName: string;
  description: string;
  lockType: 'SYSTEM' | 'USER' | 'ADMIN' | 'TEMPORARY';
  duration: string; // e.g., "30 days", "Permanent", "1 hour"
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
    key: 'functionName',
    label: 'Function Name',
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
    key: 'lockType',
    label: 'Lock Type',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'duration',
    label: 'Duration',
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
  },
  {
    key: 'active',
    label: 'Status',
    sortable: true,
    hideable: true,
    draggable: true
  }
];

// Mock data for lock function management
const mockLockFunctionData: LockFunctionItem[] = [
  {
    id: 1,
    functionName: 'User Account Lock',
    description: 'Lock user account after failed login attempts',
    lockType: 'SYSTEM',
    duration: 'Permanent',
    createdOn: '15/08/2024',
    createdBy: 'System Admin',
    active: true
  },
  {
    id: 2,
    functionName: 'Maintenance Mode Lock',
    description: 'Lock system during maintenance operations',
    lockType: 'ADMIN',
    duration: '2 hours',
    createdOn: '12/08/2024',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 3,
    functionName: 'Asset Modification Lock',
    description: 'Prevent asset modifications during audit',
    lockType: 'USER',
    duration: '24 hours',
    createdOn: '10/08/2024',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 4,
    functionName: 'Financial Report Lock',
    description: 'Lock financial reports after approval',
    lockType: 'SYSTEM',
    duration: 'Permanent',
    createdOn: '08/08/2024',
    createdBy: 'Finance Head',
    active: false
  },
  {
    id: 5,
    functionName: 'Session Timeout Lock',
    description: 'Lock session after inactivity period',
    lockType: 'TEMPORARY',
    duration: '30 minutes',
    createdOn: '05/08/2024',
    createdBy: 'Security Team',
    active: true
  }
];

// Transform API data to frontend format
const transformLockFunctionData = (apiData: ApiLockFunctionItem[]): LockFunctionItem[] => {
  return apiData.map(item => ({
    id: item.id,
    functionName: item.name,
    description: item.action_name || 'No description available',
    lockType: item.parent_function ? item.parent_function.toUpperCase() as 'SYSTEM' | 'USER' | 'ADMIN' | 'TEMPORARY' : 'SYSTEM',
    duration: 'N/A', // API doesn't provide duration, might need to be added to backend
    createdOn: new Date(item.created_at).toLocaleDateString('en-GB'),
    createdBy: 'System', // API doesn't provide created_by, might need to be added to backend
    active: Boolean(item.active)
  }));
};

export const LockFunctionList = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Same as ShiftDashboard
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [allLockFunctionData, setAllLockFunctionData] = useState<LockFunctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API call to fetch lock function data
  const fetchLockFunctionData = async () => {
    setLoading(true);
    try {
      const apiData = await lockFunctionService.fetchLockFunctions();
      const transformedData = transformLockFunctionData(apiData);
      setAllLockFunctionData(transformedData);
      console.log('Lock Function Data Count:', transformedData.length);
    } catch (error: any) {
      console.error('Error fetching lock function data:', error);
      toast.error(`Failed to load lock function data: ${error.message}`, {
        duration: 5000,
      });
      
      // Fallback to mock data on API error for development
      setAllLockFunctionData(mockLockFunctionData);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLockFunctionData();
  }, []);

  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allLockFunctionData.length]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Filter and paginate data
  const filteredLockFunctionData = useMemo(() => {
    if (!allLockFunctionData || !Array.isArray(allLockFunctionData)) return [];
    
    return allLockFunctionData.filter(item => {
      if (!debouncedSearchQuery.trim()) return true;
      
      const searchLower = debouncedSearchQuery.toLowerCase();
      return (
        item.functionName.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.lockType.toLowerCase().includes(searchLower) ||
        item.createdBy.toLowerCase().includes(searchLower) ||
        item.createdOn.includes(debouncedSearchQuery)
      );
    });
  }, [allLockFunctionData, debouncedSearchQuery]);

  // Pagination calculations
  const totalItems = filteredLockFunctionData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLockFunctionData = filteredLockFunctionData.slice(startIndex, endIndex);

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
  const renderRow = (lockFunction: LockFunctionItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleEdit(lockFunction.id)} 
          className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleView(lockFunction.id)} 
          className="p-1 text-green-600 hover:bg-green-50 rounded" 
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button 
          onClick={() => handleDelete(lockFunction.id)} 
          className="p-1 text-red-600 hover:bg-red-50 rounded" 
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    functionName: (
      <div className="font-medium text-gray-900">{lockFunction.functionName}</div>
    ),
    description: (
      <div className="text-sm text-gray-600 max-w-xs truncate" title={lockFunction.description}>
        {lockFunction.description}
      </div>
    ),
    lockType: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        lockFunction.lockType === 'SYSTEM' ? 'bg-purple-100 text-purple-800' :
        lockFunction.lockType === 'ADMIN' ? 'bg-red-100 text-red-800' :
        lockFunction.lockType === 'USER' ? 'bg-blue-100 text-blue-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {lockFunction.lockType}
      </span>
    ),
    duration: (
      <span className="text-sm text-gray-600">{lockFunction.duration}</span>
    ),
    createdOn: (
      <span className="text-sm text-gray-600">{lockFunction.createdOn}</span>
    ),
    createdBy: (
      <span className="text-sm text-gray-600">{lockFunction.createdBy || '-'}</span>
    ),
    active: (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        lockFunction.active 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {lockFunction.active ? 'Active' : 'Inactive'}
      </span>
    )
  });

  const handleView = (id: number) => {
    console.log('View lock function:', id);
    navigate(`/settings/account/lock-function/view/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit lock function:', id);
    navigate(`/settings/account/lock-function/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lock function?')) {
      try {
        await lockFunctionService.deleteLockFunction(id);
        setAllLockFunctionData(prev => prev.filter(item => item.id !== id));
        toast.success('Lock function deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting lock function:', error);
        toast.error(`Failed to delete lock function: ${error.message}`);
      }
    }
  };

  const handleAdd = () => {
    setIsCreateDialogOpen(true);
  };

  // Handle Excel file import
  const handleImportExcel = async (file: File) => {
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('excel_file', file);

      // Using fetch since we need multipart/form-data
      const response = await fetch('http://localhost:3000/lock_modules/import_from_excel', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Import failed' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      toast.success('Excel file imported successfully!', {
        description: `Imported ${result.count || 'data'} from Excel file`,
        duration: 4000,
      });

      // Refresh the data after successful import
      await fetchLockFunctionData();
      
    } catch (error: any) {
      console.error('Error importing Excel file:', error);
      toast.error('Failed to import Excel file', {
        description: error.message || 'Please check your file format and try again',
        duration: 5000,
      });
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Please select an Excel file (.xlsx or .xls)',
          duration: 4000,
        });
        return;
      }

      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File too large', {
          description: 'Please select a file smaller than 10MB',
          duration: 4000,
        });
        return;
      }

      handleImportExcel(file);
    }
  };

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Lock Function Management</h1>
            <p className="text-gray-600">Manage system lock functions and restrictions</p>
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
            data={currentLockFunctionData}
            columns={columns}
            renderRow={renderRow}
            storageKey="lock-function-table"
            enableSearch={true}
            searchPlaceholder="Search lock functions..."
            onSearchChange={handleSearch}
            enableExport={false}
            exportFileName="lock-function-data"
            leftActions={
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleAdd} 
                  className="flex items-center gap-2 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
                <Button
                  onClick={handleImportClick}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white"
                  disabled={importing}
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import Excel
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileInputChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            }
            pagination={false} // Disable built-in pagination since we're adding custom
            loading={loading}
            emptyMessage="No lock functions found. Create your first lock function to get started."
          />

          {/* Pagination Controls - matching ShiftDashboard style */}
          {allLockFunctionData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} lock functions
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

      {/* Create Lock Function Dialog */}
      <CreateLockFunctionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onLockFunctionCreated={() => {
          setIsCreateDialogOpen(false);
          fetchLockFunctionData();
        }}
      />
    </div>
  );
};
