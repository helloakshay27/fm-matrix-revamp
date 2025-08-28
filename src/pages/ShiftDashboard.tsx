import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { EditShiftDialog } from '@/components/EditShiftDialog';
import { CreateShiftDialog } from '@/components/CreateShiftDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for the shift data
interface ShiftItem {
  id: number;
  timings: string; // Changed from 'timing' to 'timings' to match EditShiftDialog
  totalHours: number;
  checkInMargin: string;
  createdOn: string;
  createdBy: string;
  active: boolean;
}

interface ApiResponse {
  success: boolean;
  data: ShiftItem[];
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
    key: 'timings', // Changed from 'timing' to 'timings'
    label: 'Timings',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'totalHours',
    label: 'Total Hour',
    sortable: true,
    hideable: true,
    draggable: true
  },
  {
    key: 'checkInMargin',
    label: 'Check In Margin',
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
  
];

// Mock data for shift management (similar to the image provided)
const mockShiftData: ShiftItem[] = [
  {
    id: 1,
    timings: '08:00 AM to 05:00 PM', // Changed from 'timing' to 'timings'
    totalHours: 9,
    checkInMargin: '0h:0m',
    createdOn: '19/03/2024',
    createdBy: '',
    active: true
  },
  {
    id: 2,
    timings: '02:00 AM to 06:00 AM',
    totalHours: 4,
    checkInMargin: '1h:0m',
    createdOn: '05/05/2023',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 3,
    timings: '10:15 AM to 07:30 PM',
    totalHours: 9,
    checkInMargin: '0h:0m',
    createdOn: '05/05/2023',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 4,
    timings: '10:00 AM to 07:00 PM',
    totalHours: 9,
    checkInMargin: '0h:0m',
    createdOn: '29/11/2022',
    createdBy: '',
    active: true
  },
  {
    id: 5,
    timings: '09:00 AM to 06:00 PM',
    totalHours: 9,
    checkInMargin: '0h:0m',
    createdOn: '28/11/2022',
    createdBy: '',
    active: true
  },
  {
    id: 6,
    timings: '10:30 AM to 06:30 PM',
    totalHours: 8,
    checkInMargin: '0h:0m',
    createdOn: '28/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 7,
    timings: '10:00 AM to 11:00 AM',
    totalHours: 1,
    checkInMargin: '0h:0m',
    createdOn: '21/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 8,
    timings: '01:00 AM to 11:00 PM',
    totalHours: 22,
    checkInMargin: '0h:0m',
    createdOn: '21/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 9,
    timings: '03:15 AM to 11:15 PM',
    totalHours: 20,
    checkInMargin: '0h:0m',
    createdOn: '22/06/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 10,
    timings: '10:00 AM to 08:00 PM',
    totalHours: 10,
    checkInMargin: '3h:0m',
    createdOn: '09/08/2021',
    createdBy: 'Robert Day2',
    active: true
  }
];

export const ShiftDashboard = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<ShiftItem | null>(null);
  
  // Pagination states - matching RosterDashboard pattern
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Changed to constant like RosterDashboard
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchQuery = useDebounce(searchTerm, 1000);
  const [allShiftData, setAllShiftData] = useState<ShiftItem[]>([]); // Store all data
  const [loading, setLoading] = useState(true);

  // API call to fetch shift data
  const fetchShiftData = async () => {
    setLoading(true);
    try {
      const apiUrl = getFullUrl('/pms/admin/user_shifts.json');
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

      const data = await response.json();
      console.log('API Response:', data);

      // Transform API data to match our interface
      const transformedData: ShiftItem[] = (data.user_shifts || []).map((item: any) => ({
        id: item.id,
        timings: item.timings || 'Not specified', // Changed from 'timing' to 'timings'
        totalHours: item.total_hour || 0,
        checkInMargin: item.check_in_margin || '0h:0m',
        createdOn: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : 'Not available',
        createdBy: item.created_by?.name || 'System',
        active: item.active !== undefined ? item.active : true
      }));

      setAllShiftData(transformedData);
      console.log('Transformed Data Count:', transformedData.length);
    } catch (error: any) {
      console.error('Error fetching shift data:', error);
      toast.error(`Failed to load shift data: ${error.message}`, {
        duration: 5000,
      });
      
      // Fallback to mock data on API error
      setAllShiftData(mockShiftData);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchShiftData();
  }, []);

  // Reset pagination when shift data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allShiftData.length]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Filter and paginate data
  const filteredShiftData = useMemo(() => {
    if (!allShiftData || !Array.isArray(allShiftData)) return [];
    
    return allShiftData.filter(item => {
      if (!debouncedSearchQuery.trim()) return true;
      
      const searchLower = debouncedSearchQuery.toLowerCase();
      return (
        item.timings.toLowerCase().includes(searchLower) ||
        item.createdBy.toLowerCase().includes(searchLower) ||
        item.createdOn.includes(debouncedSearchQuery) ||
        item.checkInMargin.toLowerCase().includes(searchLower)
      );
    });
  }, [allShiftData, debouncedSearchQuery]);

  // Pagination calculations
  const totalItems = filteredShiftData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentShiftData = filteredShiftData.slice(startIndex, endIndex);

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
  const renderRow = (shift: ShiftItem) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleEdit(shift.id)} 
          className="p-1 text-blue-600 hover:bg-blue-50 rounded" 
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    ),
    timings: (
      <div className="font-medium text-gray-900">{shift.timings}</div>
    ),
    totalHours: (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
        {shift.totalHours}
      </span>
    ),
    checkInMargin: (
      <span className="text-sm text-gray-600">{shift.checkInMargin}</span>
    ),
    createdOn: (
      <span className="text-sm text-gray-600">{shift.createdOn}</span>
    ),
    createdBy: (
      <span className="text-sm text-gray-600">{shift.createdBy || '-'}</span>
    )
  });

  const handleEdit = (id: number) => {
    const shiftToEdit = allShiftData.find(shift => shift.id === id);
    if (shiftToEdit) {
      setSelectedShift(shiftToEdit);
      setIsEditDialogOpen(true);
    } else {
      toast.error('Shift not found');
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
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
          <div className="w-10 h-10 rounded-full bg-[#C72030]/10 text-[#C72030] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide uppercase">Shift Management</h1>
            <p className="text-gray-600">Manage work shifts and schedules</p>
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
            data={currentShiftData}
            columns={columns}
            renderRow={renderRow}
            storageKey="shift-management-table"
            enableSearch={true}
            searchPlaceholder="Search shifts..."
            onSearchChange={handleSearch}
            enableExport={false}
            exportFileName="shift-data"
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
            emptyMessage="No shifts found. Create your first shift to get started."
          />

          {/* Pagination Controls - matching RosterDashboard style */}
          {allShiftData.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} shifts
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

      {/* Modals */}
      <CreateShiftDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onShiftCreated={() => {
          setIsAddModalOpen(false);
          fetchShiftData();
        }}
      />

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

      <EditShiftDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        shift={selectedShift}
        onShiftUpdated={() => {
          // Refresh the shifts data when a shift is updated
          fetchShiftData();
          setIsEditDialogOpen(false);
          toast.success('Shift data refreshed');
        }}
      />
    </div>
  );
};
