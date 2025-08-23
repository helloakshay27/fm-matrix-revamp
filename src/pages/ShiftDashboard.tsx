import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2, Loader2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { API_CONFIG, getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for the shift data
interface ShiftItem {
  id: number;
  timing: string;
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
  // {
  //   key: 'actions',
  //   label: 'Actions',
  //   sortable: false,
  //   hideable: false,
  //   draggable: false
  // },
  {
    key: 'timing',
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
    timing: '08:00 AM to 05:00 PM',
    totalHours: 9,
    checkInMargin: '0h:0m',
    createdOn: '19/03/2024',
    createdBy: '',
    active: true
  },
  {
    id: 2,
    timing: '02:00 AM to 06:00 AM',
    totalHours: 4,
    checkInMargin: '1h:0m',
    createdOn: '05/05/2023',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 3,
    timing: '10:15 AM to 07:30 PM',
    totalHours: 9,
    checkInMargin: '0h:0m',
    createdOn: '05/05/2023',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 4,
    timing: '10:00 AM to 07:00 PM',
    totalHours: 9,
    checkInMargin: '0h:0m',
    createdOn: '29/11/2022',
    createdBy: '',
    active: true
  },
  {
    id: 5,
    timing: '09:00 AM to 06:00 PM',
    totalHours: 9,
    checkInMargin: '0h:0m',
    createdOn: '28/11/2022',
    createdBy: '',
    active: true
  },
  {
    id: 6,
    timing: '10:30 AM to 06:30 PM',
    totalHours: 8,
    checkInMargin: '0h:0m',
    createdOn: '28/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 7,
    timing: '10:00 AM to 11:00 AM',
    totalHours: 1,
    checkInMargin: '0h:0m',
    createdOn: '21/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 8,
    timing: '01:00 AM to 11:00 PM',
    totalHours: 22,
    checkInMargin: '0h:0m',
    createdOn: '21/11/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 9,
    timing: '03:15 AM to 11:15 PM',
    totalHours: 20,
    checkInMargin: '0h:0m',
    createdOn: '22/06/2022',
    createdBy: 'Robert Day2',
    active: true
  },
  {
    id: 10,
    timing: '10:00 AM to 08:00 PM',
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
        timing: item.timings || 'Not specified',
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
        item.timing.toLowerCase().includes(searchLower) ||
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
    timing: (
      <div className="font-medium text-gray-900">{shift.timing}</div>
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
    console.log('Edit shift:', id);
    // TODO: Implement edit functionality
    toast.info('Edit functionality will be implemented');
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
      {isAddModalOpen && (
        <AddShiftModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchShiftData();
          }}
        />
      )}

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

// Add Shift Modal Component
const AddShiftModal = ({ isOpen, onClose, onSuccess }: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [fromHour, setFromHour] = useState('04');
  const [fromMinute, setFromMinute] = useState('00');
  const [toHour, setToHour] = useState('12');
  const [toMinute, setToMinute] = useState('00');
  const [checkInMargin, setCheckInMargin] = useState(false);
  const [hourMargin, setHourMargin] = useState('00');
  const [minMargin, setMinMargin] = useState('00');

  if (!isOpen) return null;

  // Generate hour options (00-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return (
      <option key={hour} value={hour}>
        {hour}
      </option>
    );
  });

  // Generate minute options (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, '0');
    return (
      <option key={minute} value={minute}>
        {minute}
      </option>
    );
  });

  const handleCreate = async () => {
    // Build API payload
    const payload = {
      user_shift: {
        start_hour: fromHour,
        start_min: fromMinute,
        end_hour: toHour,
        end_min: toMinute,
        hour_margin: checkInMargin ? hourMargin : '00',
        min_margin: checkInMargin ? minMargin : '00'
      },
      check_in_margin: checkInMargin
    };
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/admin/user_shifts.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to create shift');
      toast.success('Shift created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error('Failed to create shift');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Shift</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Shift Timings
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2">From</label>
                <div className="flex gap-2">
                  <select
                    value={fromHour}
                    onChange={(e) => setFromHour(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  >
                    {hourOptions}
                  </select>
                  <select
                    value={fromMinute}
                    onChange={(e) => setFromMinute(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  >
                    {minuteOptions}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">To</label>
                <div className="flex gap-2">
                  <select
                    value={toHour}
                    onChange={(e) => setToHour(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  >
                    {hourOptions}
                  </select>
                  <select
                    value={toMinute}
                    onChange={(e) => setToMinute(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  >
                    {minuteOptions}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={checkInMargin}
                onChange={(e) => setCheckInMargin(e.target.checked)}
                className="rounded border-gray-300 text-[#C72030] focus:ring-[#C72030]"
                style={{
                  accentColor: '#C72030'
                }}
              />
              <span className="text-sm text-gray-700">Check In Margin</span>
            </label>
            {checkInMargin && (
              <div className="flex gap-2 mt-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Hour Margin</label>
                  <select
                    value={hourMargin}
                    onChange={e => setHourMargin(e.target.value)}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  >
                    {hourOptions}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Minute Margin</label>
                  <select
                    value={minMargin}
                    onChange={e => setMinMargin(e.target.value)}
                    className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                  >
                    {minuteOptions}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};
