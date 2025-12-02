import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast, Toaster } from 'sonner';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { Autocomplete, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ArrowLeft, Filter, Download, Calendar, BarChart3, Plus, X } from 'lucide-react';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { SelectionPanel } from '@/components/water-asset-details/PannelTab';

// Helper to get current month's start and end dates in yyyy-mm-dd and dd/mm/yyyy
function getCurrentMonthRange() {
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  // Format as yyyy-mm-dd and dd/mm/yyyy
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy_mm_dd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dd_mm_yyyy = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  return {
    start: yyyy_mm_dd(firstDayCurrentMonth),
    end: yyyy_mm_dd(lastDayCurrentMonth),
    startDMY: dd_mm_yyyy(firstDayCurrentMonth),
    endDMY: dd_mm_yyyy(lastDayCurrentMonth),
  };
}

function formatDateInput(date: string) {
  // Accepts yyyy-mm-dd or dd/mm/yyyy, returns yyyy-mm-dd
  if (date.includes('/')) {
    const [dd, mm, yyyy] = date.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }
  return date;
}

function formatDMY(date: string) {
  // Accepts yyyy-mm-dd, returns dd/mm/yyyy
  if (date.includes('-')) {
    const [yyyy, mm, dd] = date.split('-');
    return `${dd}/${mm}/${yyyy}`;
  }
  return date;
}

export const ViewPerformancePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const customFormCode = location.state?.formCode || location.state?.custom_form_code;

  // Date state - use current month instead of last month
  const currentMonth = getCurrentMonthRange();
  const [startDate, setStartDate] = useState(currentMonth.start);
  const [endDate, setEndDate] = useState(currentMonth.end);
  const [selectedTaskId, setSelectedTaskId] = useState<string | number>('');
  const [dropdownOptions, setDropdownOptions] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    startDate: currentMonth.start,
    endDate: currentMonth.end,
    selectedTaskId: ''
  });

  // Date validation function - only for apply action
  const validateDatesOnApply = (start: string, end: string) => {
    if (start && end) {
      const startDateObj = new Date(start);
      const endDateObj = new Date(end);
      
      if (endDateObj < startDateObj) {
        toast.error('End date cannot be before start date. Please select a valid date range.', {
          position: 'top-right',
          duration: 4000,
        });
        return false;
      }
    }
    return true;
  };

  // Handle start date change - automatically adjust end date if needed
  const handleStartDateChange = (date: Date | null) => {
    const newStartDate = date ? format(date, 'yyyy-MM-dd') : '';
    setStartDate(newStartDate);
    
    // If end date is before new start date, automatically set end date to start date
    if (endDate && newStartDate && new Date(endDate) < new Date(newStartDate)) {
      setEndDate(newStartDate);
      toast.info('End date has been automatically updated to match the start date.', {
        position: 'top-right',
        duration: 3000,
      });
    }
  };

  // Handle end date change - no validation, just set value
  const handleEndDateChange = (date: Date | null) => {
    const newEndDate = date ? format(date, 'yyyy-MM-dd') : '';
    setEndDate(newEndDate);
  };

  // Fetch performance data
  const fetchPerformance = async (params?: { start?: string, end?: string, asset_id?: string | number }) => {
    if (!customFormCode) return;
    setLoading(true);
    setError(null);
    try {
      // Use params or state
      const startDMY = params?.start ? formatDMY(params.start) : formatDMY(startDate);
      const endDMY = params?.end ? formatDMY(params.end) : formatDMY(endDate);
      const assetId = params?.asset_id || selectedTaskId;
      const url = `${API_CONFIG.BASE_URL}/pms/custom_forms/${customFormCode}/performance.json?q[start_date_gteq]=${startDMY}&q[start_date_lteq]=${endDMY}&asset_id=${assetId}&access_token=${API_CONFIG.TOKEN}`;
      const res = await fetch(url, {
        headers: {
          Authorization: getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch performance data');
      const data = await res.json();
      setPerformanceData(data);
      // Set dropdown options and default selected
      if (data.task_options && data.task_options.length > 0) {
        setDropdownOptions(data.task_options);
        const selected = data.task_options.find((t: any) => t.selected) || data.task_options[0];
        setSelectedTaskId(selected.task_of_id);
      }
    } catch (e: any) {
      setError(e.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // On mount, fetch with default last month and first asset
  useEffect(() => {
    fetchPerformance();
    // eslint-disable-next-line
  }, [customFormCode]);

  // On dropdown change, refetch
  useEffect(() => {
    if (selectedTaskId && performanceData) {
      fetchPerformance({ asset_id: selectedTaskId });
    }
    // eslint-disable-next-line
  }, [selectedTaskId]);

  // Handlers
  const handleApply = () => {
    // Validate dates only when apply is clicked
    if (!validateDatesOnApply(startDate, endDate)) {
      return; // Stop execution if validation fails
    }
    
    // Additional validation for empty dates
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.', {
        position: 'top-right',
        duration: 4000,
      });
      return;
    }
    
    fetchPerformance({ start: startDate, end: endDate, asset_id: selectedTaskId });
  };

  const handleReset = () => {
    setStartDate(currentMonth.start);
    setEndDate(currentMonth.end);
    if (dropdownOptions.length > 0) {
      setSelectedTaskId(dropdownOptions[0].task_of_id);
    }
    fetchPerformance({ start: currentMonth.start, end: currentMonth.end, asset_id: dropdownOptions[0]?.task_of_id });
  };

  // Table data - moved before useMemo hooks
  const tableData = performanceData?.table_data;
  const dateHeaders = tableData?.date_headers || [];
  const activities = tableData?.activities || [];
  const assetName = performanceData?.asset_name || '';
  const formName = performanceData?.form_name || '';

  // Enhanced table columns for performance data
  const performanceColumns = React.useMemo(() => {
    const baseColumns = [
      { key: 'assetName', label: 'Asset/Service Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
      { key: 'activity', label: 'Activity', sortable: true, hideable: true, draggable: true, defaultVisible: true }
    ];
    
    const dateColumns = (dateHeaders || []).map((date: any, idx: number) => ({
      key: `date_${idx}`,
      label: date.date_formatted || date.date,
      sortable: false,
      hideable: true,
      draggable: true,
      defaultVisible: true
    }));
    
    return [...baseColumns, ...dateColumns];
  }, [dateHeaders]);

  // Prepare data for enhanced table
  const performanceTableData = React.useMemo(() => {
    if (!activities || activities.length === 0) return [];
    
    const data = activities.map((activity: any, activityIdx: number) => {
      const rowData: any = {
        id: activityIdx.toString(),
        assetName: assetName || '--',
        activity: activity.label || '--'
      };
      
      // Add date columns data
      activity.date_data?.forEach((dateObj: any, dateIdx: number) => {
        rowData[`date_${dateIdx}`] = dateObj.time_slot_data && dateObj.time_slot_data.length > 0
          ? dateObj.time_slot_data.map((slot: any) => 
              `${slot.time_slot}: ${slot.value ?? '-'}${slot.comment ? ` (${slot.comment})` : ''}`
            ).join(', ')
          : '-';
      });
      
      return rowData;
    });

    // Add asset header row if data exists
    if (data.length > 0) {
      const headerRow: any = {
        id: 'asset-header',
        assetName: assetName || '--',
        activity: '',
        isHeaderRow: true
      };
      
      // Fill date columns for header row
      (dateHeaders || []).forEach((_, dateIdx: number) => {
        headerRow[`date_${dateIdx}`] = '';
      });
      
      return [headerRow, ...data];
    }
    
    return data;
  }, [activities, assetName, dateHeaders]);

  const renderPerformanceCell = (item: any, columnKey: string) => {
    if (item.isHeaderRow) {
      if (columnKey === 'assetName') {
        return <span className="font-bold text-center">{item[columnKey]}</span>;
      }
      return '';
    }

    if (columnKey === 'assetName') {
      return '';
    }
    
    if (columnKey.startsWith('date_')) {
      const value = item[columnKey];
      if (value === '-') return <span className="text-center">-</span>;
      
      return (
        <div className="text-xs">
          {value.split(', ').map((slot: string, idx: number) => (
            <div key={idx} className="text-center">{slot}</div>
          ))}
        </div>
      );
    }
    return item[columnKey] || '--';
  };

  // Export handler for performance data
  const handlePerformanceExport = async () => {
    if (!customFormCode || !selectedTaskId) {
      toast.error('Missing form code or asset selection. Please ensure all fields are selected.', {
        position: 'top-right',
        duration: 4000,
      });
      return;
    }

    if (!validateDatesOnApply(startDate, endDate)) {
      return;
    }

    try {
      const startDMY = formatDMY(startDate);
      const endDMY = formatDMY(endDate);
      
      const exportUrl = `${API_CONFIG.BASE_URL}/pms/custom_forms/${customFormCode}/export_performance`;
      const params = new URLSearchParams({
        asset_id: selectedTaskId.toString(),
        'q[start_date_gteq]': startDMY,
        'q[start_date_lteq]': endDMY,
        access_token: API_CONFIG.TOKEN || ''
      });
      
      const fullUrl = `${exportUrl}?${params.toString()}`;
      
      const res = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
          'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, */*',
        },
      });
      
      if (!res.ok) {
        throw new Error(`Failed to export performance data: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || (!contentType.includes('spreadsheet') && !contentType.includes('excel') && !contentType.includes('octet-stream'))) {
        throw new Error('Server returned unexpected response format. Expected Excel file.');
      }

      const blob = await res.blob();
      if (blob.size === 0) {
        throw new Error('Export file is empty. No data available for the selected criteria.');
      }

      let filename = 'performance_export.xlsx';
      const disposition = res.headers.get('content-disposition');
      if (disposition && disposition.indexOf('filename=') !== -1) {
        const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '').trim();
        }
      }
      
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('Performance data exported successfully!', {
        position: 'top-right',
        duration: 4000,
      });
      
    } catch (e: any) {
      console.error('Export error:', e);
      toast.error(e.message || 'Export failed. Please try again.', {
        position: 'top-right',
        duration: 5000,
      });
    }
  };

  // Action panel handlers
  const handleActionClick = () => {
    setShowActionPanel((prev) => !prev);
  };

  const selectionActions = [
    { 
      label: 'View Details', 
      icon: BarChart3, 
      onClick: () => navigate(-1)
    },
  ];

  const renderCustomActions = () => (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <Button 
        onClick={handleActionClick}
        className="bg-[#C72030] text-white hover:bg-[#C72030]/90 h-9 px-4 text-sm font-medium"
      >
        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
        Action
      </Button>
    </div>
  );

  // Filter handlers
  const handleOpenFilterModal = () => {
    setTempFilters({
      startDate,
      endDate,
      selectedTaskId: selectedTaskId.toString()
    });
    setShowFilterModal(true);
  };

  const handleApplyFilters = () => {
    // Validate dates
    if (!validateDatesOnApply(tempFilters.startDate, tempFilters.endDate)) {
      return;
    }
    
    if (!tempFilters.startDate || !tempFilters.endDate) {
      toast.error('Please select both start and end dates.', {
        position: 'top-right',
        duration: 4000,
      });
      return;
    }
    
    // Apply filters
    setStartDate(tempFilters.startDate);
    setEndDate(tempFilters.endDate);
    setSelectedTaskId(tempFilters.selectedTaskId);
    
    fetchPerformance({ 
      start: tempFilters.startDate, 
      end: tempFilters.endDate, 
      asset_id: tempFilters.selectedTaskId 
    });
    
    setShowFilterModal(false);
    
    toast.success('Filters applied successfully!', {
      position: 'top-right',
      duration: 3000,
    });
  };

  const handleResetFilters = () => {
    const resetFilters = {
      startDate: currentMonth.start,
      endDate: currentMonth.end,
      selectedTaskId: dropdownOptions.length > 0 ? dropdownOptions[0].task_of_id.toString() : ''
    };
    
    setTempFilters(resetFilters);
    setStartDate(resetFilters.startDate);
    setEndDate(resetFilters.endDate);
    setSelectedTaskId(resetFilters.selectedTaskId);
    
    fetchPerformance({ 
      start: resetFilters.startDate, 
      end: resetFilters.endDate, 
      asset_id: resetFilters.selectedTaskId 
    });
    
    setShowFilterModal(false);
    
    toast.info('Filters reset to default values.', {
      position: 'top-right',
      duration: 3000,
    });
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Schedule List</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {formName || 'Performance Checklist'}
            </h1>
            <div className="text-sm text-gray-600">
              Form Code: {customFormCode} • Asset: {assetName || 'Not Selected'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      {showActionPanel && (
        <div className="mb-4">
          <SelectionPanel
            actions={selectionActions}
            onClearSelection={() => setShowActionPanel(false)}
          />
        </div>
      )}

      {/* Performance Table */}
      <Card className="w-full pt-8">
        <CardContent>
          {performanceTableData.length > 0 ? (
            <EnhancedTable
              data={performanceTableData}
              columns={performanceColumns}
              renderCell={renderPerformanceCell}
              storageKey="performance-table"
              emptyMessage="No performance data available"
              enableSearch={true}
              enableExport={true}
              handleExport={handlePerformanceExport}
              searchPlaceholder="Search activities..."
              exportFileName="performance-data"
              leftActions={renderCustomActions()}
              onFilterClick={handleOpenFilterModal}
              loading={loading}
              loadingMessage="Loading performance data..."
              selectedItems={selectedItems}
              onSelectItem={(id, checked) => setSelectedItems(checked ? [...selectedItems, id] : selectedItems.filter(i => i !== id))}
              onSelectAll={checked => setSelectedItems(checked ? performanceTableData.map(d => d.id) : [])}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              {loading ? "Loading performance data..." : "No performance data available"}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="sm:max-w-md" id="performance-filter-modal-root">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilterModal(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Start Date */}
            <div className="flex flex-col">
              <TextField
                label={
                  <span>
                    Start Date <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                id="startDate"
                type="date"
                fullWidth
                variant="outlined"
                value={tempFilters.startDate}
                onChange={(e) => {
                  const newStartDate = e.target.value;
                  setTempFilters(prev => ({ ...prev, startDate: newStartDate }));
                  
                  // Auto-adjust end date if needed
                  if (tempFilters.endDate && newStartDate && new Date(tempFilters.endDate) < new Date(newStartDate)) {
                    setTempFilters(prev => ({ ...prev, endDate: newStartDate }));
                    toast.info('End date has been automatically updated to match the start date.', {
                      position: 'top-right',
                      duration: 3000,
                    });
                  }

                  // Auto-apply filter when date changes
                  setTimeout(() => {
                    if (newStartDate && tempFilters.endDate && tempFilters.selectedTaskId) {
                      const adjustedEndDate = (tempFilters.endDate && newStartDate && new Date(tempFilters.endDate) < new Date(newStartDate)) 
                        ? newStartDate 
                        : tempFilters.endDate;
                      
                      setStartDate(newStartDate);
                      setEndDate(adjustedEndDate);
                      fetchPerformance({ 
                        start: newStartDate, 
                        end: adjustedEndDate, 
                        asset_id: tempFilters.selectedTaskId 
                      });
                    }
                  }, 100);
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ 
                  sx: {
                    height: '40px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      fontSize: '14px',
                      '& fieldset': {
                        borderColor: '#ddd',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C72030',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#C72030',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      '&.Mui-focused': {
                        color: '#C72030',
                      },
                    },
                  }
                }}
                sx={{ mt: 1 }}
                placeholder="Select Start Date"
                inputProps={{
                  max: tempFilters.endDate || undefined,
                }}
              />
            </div>
            
            {/* End Date */}
            <div className="flex flex-col">
              <TextField
                label={
                  <span>
                    End Date <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                id="endDate"
                type="date"
                fullWidth
                variant="outlined"
                value={tempFilters.endDate}
                onChange={(e) => {
                  const newEndDate = e.target.value;
                  setTempFilters(prev => ({ ...prev, endDate: newEndDate }));

                  // Auto-apply filter when date changes
                  setTimeout(() => {
                    if (tempFilters.startDate && newEndDate && tempFilters.selectedTaskId) {
                      setEndDate(newEndDate);
                      fetchPerformance({ 
                        start: tempFilters.startDate, 
                        end: newEndDate, 
                        asset_id: tempFilters.selectedTaskId 
                      });
                    }
                  }, 100);
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ 
                  sx: {
                    height: '40px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    '& .MuiOutlinedInput-root': {
                      height: '40px',
                      fontSize: '14px',
                      '& fieldset': {
                        borderColor: '#ddd',
                      },
                      '&:hover fieldset': {
                        borderColor: '#C72030',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#C72030',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      '&.Mui-focused': {
                        color: '#C72030',
                      },
                    },
                  }
                }}
                sx={{ mt: 1 }}
                placeholder="Select End Date"
                inputProps={{
                  min: tempFilters.startDate || undefined,
                }}
                error={tempFilters.startDate && tempFilters.endDate && tempFilters.endDate < tempFilters.startDate}
                helperText={
                  tempFilters.startDate && tempFilters.endDate && tempFilters.endDate < tempFilters.startDate
                    ? "End date cannot be before start date"
                    : ""
                }
              />
            </div>

            {/* Asset/Task Selection */}
            <div className="flex flex-col">
              <FormControl variant="outlined" sx={{ 
                height: { xs: 28, sm: 36, md: 45 },
                backgroundColor: 'white',
                '& .MuiInputBase-input, & .MuiSelect-select': {
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                  backgroundColor: 'white',
                },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                }
              }}>
                <InputLabel id="asset-task-label" shrink>
                  Select Asset/Task <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <Select
                  native
                  labelId="asset-task-label"
                  label="Select Asset/Task *"
                  displayEmpty
                  value={tempFilters.selectedTaskId}
                  onChange={(e) => {
                    const newTaskId = e.target.value;
                    setTempFilters(prev => ({ 
                      ...prev, 
                      selectedTaskId: newTaskId 
                    }));

                    // Auto-apply filter when asset changes
                    setTimeout(() => {
                      if (tempFilters.startDate && tempFilters.endDate && newTaskId) {
                        setSelectedTaskId(newTaskId);
                        fetchPerformance({ 
                          start: tempFilters.startDate, 
                          end: tempFilters.endDate, 
                          asset_id: newTaskId 
                        });
                      }
                    }, 100);
                  }}
                  disabled={dropdownOptions.length === 0}
                  MenuProps={{
                    disablePortal: true,
                    container: () => document.getElementById('performance-filter-modal-root') || document.body
                  }}
                >
                  <option value="">Select Asset/Task</option>
                  {dropdownOptions && dropdownOptions.map(option => (
                    <option key={option.task_of_id} value={option.task_of_id.toString()}>
                      {option.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              {dropdownOptions.length === 0 && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                  No assets/tasks available...
                </Typography>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-10">
              <Button
                onClick={handleApplyFilters}
                className="px-8 bg-[#C72030] text-white hover:bg-[#C72030]/90"
              >
                Apply Filters
              </Button>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="px-8 border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
              >
                Reset
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewPerformancePage;
