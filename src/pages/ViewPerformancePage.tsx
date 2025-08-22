import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { toast } from 'sonner';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { Autocomplete, TextField } from '@mui/material';

// Helper to get last month's start and end dates in yyyy-mm-dd and dd/mm/yyyy
function getLastMonthRange() {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayLastMonth = new Date(firstDayThisMonth.getTime() - 1);
  const firstDayLastMonth = new Date(lastDayLastMonth.getFullYear(), lastDayLastMonth.getMonth(), 1);
  // Format as yyyy-mm-dd and dd/mm/yyyy
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy_mm_dd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dd_mm_yyyy = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  return {
    start: yyyy_mm_dd(firstDayLastMonth),
    end: yyyy_mm_dd(lastDayLastMonth),
    startDMY: dd_mm_yyyy(firstDayLastMonth),
    endDMY: dd_mm_yyyy(lastDayLastMonth),
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
  // Get custom_form_code and asset_id from navigation state or query param
  const customFormCode = location.state?.formCode || location.state?.custom_form_code;
  // asset_id will be selected from dropdown, but can default to first in task_options

  // Date state
  const lastMonth = getLastMonthRange();
  const [startDate, setStartDate] = useState(lastMonth.start);
  const [endDate, setEndDate] = useState(lastMonth.end);
  const [selectedTaskId, setSelectedTaskId] = useState<string | number>('');
  const [dropdownOptions, setDropdownOptions] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setStartDate(lastMonth.start);
    setEndDate(lastMonth.end);
    if (dropdownOptions.length > 0) {
      setSelectedTaskId(dropdownOptions[0].task_of_id);
    }
    fetchPerformance({ start: lastMonth.start, end: lastMonth.end, asset_id: dropdownOptions[0]?.task_of_id });
  };

  // Table data
  const tableData = performanceData?.table_data;
  const dateHeaders = tableData?.date_headers || [];
  const activities = tableData?.activities || [];
  const assetName = performanceData?.asset_name || '';
  const formName = performanceData?.form_name || '';

  return (
    <div className="p-6 mx-auto">
      <div className="flex gap-4 mb-4 items-center">
        <div className="flex flex-col w-48">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={
                <span>
                  Start Date *
                </span>
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', md: '45px' }
                    }
                  }
                }
              }}
              value={startDate ? new Date(startDate) : null}
              onChange={handleStartDateChange}
              maxDate={endDate ? new Date(endDate) : undefined}
            />
          </LocalizationProvider>
        </div>
        
        <div className="flex flex-col w-48">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date *"
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      height: { xs: '36px', md: '45px' }
                    }
                  },
                  error: startDate && endDate && endDate < startDate,
                  helperText: startDate && endDate && endDate < startDate
                    ? "End date cannot be before start date"
                    : ""
                }
              }}
              value={endDate ? new Date(endDate) : null}
              onChange={handleEndDateChange}
              minDate={startDate ? new Date(startDate) : undefined}
            />
          </LocalizationProvider>
        </div>

        {/* Autocomplete for task/asset */}
        <div className="flex flex-col w-64">
          <Autocomplete
            options={dropdownOptions}
            getOptionLabel={(option) => option.name}
            value={dropdownOptions.find(opt => opt.task_of_id.toString() === selectedTaskId.toString()) || null}
            onChange={(_, value) => setSelectedTaskId(value ? value.task_of_id : '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Asset/Task *"
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: { xs: '36px', md: '45px' }
                  }
                }}
                InputLabelProps={{ shrink: true }}
              />
            )}
            disablePortal
            disabled={dropdownOptions.length === 0}
          />
        </div>
        
        <Button 
          className="bg-green-600 text-white px-6" 
          onClick={handleApply}
        >
          Apply
        </Button>
        
        <Button className="bg-yellow-500 text-white px-6" onClick={handleReset}>Reset</Button>

        <Button className="bg-[#3B82F6] text-white px-6" onClick={async () => {
          if (!customFormCode || !selectedTaskId) {
            toast.error('Missing form code or asset selection. Please ensure all fields are selected.', {
              position: 'top-right',
              duration: 4000,
            });
            return;
          }

          // Validate date range before export
          if (!validateDatesOnApply(startDate, endDate)) {
            return;
          }

          try {
            // Use current date range in dd/mm/yyyy
            const startDMY = formatDMY(startDate);
            const endDMY = formatDMY(endDate);
            
            // Build the export URL with proper encoding
            const exportUrl = `${API_CONFIG.BASE_URL}/pms/custom_forms/${customFormCode}/export_performance`;
            const params = new URLSearchParams({
              asset_id: selectedTaskId.toString(),
              'q[start_date_gteq]': startDMY,
              'q[start_date_lteq]': endDMY,
              access_token: API_CONFIG.TOKEN || ''
            });
            
            const fullUrl = `${exportUrl}?${params.toString()}`;
            
            console.log('Export URL:', fullUrl); // Debug log
            
            const res = await fetch(fullUrl, {
              method: 'GET',
              headers: {
                'Authorization': getAuthHeader(),
                'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, */*',
              },
            });
            
            console.log('Export response status:', res.status); // Debug log
            console.log('Export response headers:', Object.fromEntries(res.headers.entries())); // Debug log
            
            if (!res.ok) {
              const errorText = await res.text();
              console.error('Export error response:', errorText);
              throw new Error(`Failed to export performance data: ${res.status} ${res.statusText}`);
            }

            // Check if response is actually a file
            const contentType = res.headers.get('content-type');
            console.log('Content-Type:', contentType); // Debug log
            
            if (!contentType || (!contentType.includes('spreadsheet') && !contentType.includes('excel') && !contentType.includes('octet-stream'))) {
              const responseText = await res.text();
              console.error('Unexpected response format:', responseText);
              throw new Error('Server returned unexpected response format. Expected Excel file.');
            }

            const blob = await res.blob();
            console.log('Blob size:', blob.size); // Debug log
            
            if (blob.size === 0) {
              throw new Error('Export file is empty. No data available for the selected criteria.');
            }

            // Try to get filename from content-disposition header
            let filename = 'performance_export.xlsx';
            const disposition = res.headers.get('content-disposition');
            if (disposition && disposition.indexOf('filename=') !== -1) {
              const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '').trim();
              }
            }
            
            // Create and trigger download
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
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
        }}>Export</Button>
      </div>
      
      {/* Remove the date error message display since we're using toast */}

      <h2 className="text-xl font-bold mb-2 text-black">{formName || 'Performance Checklist'}</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="bg-[#334155] text-center border-r border-gray-300">Asset/Service Name</TableHead>
              <TableHead className="bg-[#334155] text-center border-r border-gray-300">Activity</TableHead>
              {dateHeaders.map((date: any, idx: number) => (
                <TableHead key={idx} className="bg-[#F3F4F6] text-gray-900 text-center border-r border-gray-300">{date.date_formatted || date.date}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Asset row */}
            <TableRow>
              <TableCell className="border-r border-gray-300 text-center font-semibold">{assetName}</TableCell>
              <TableCell className="border-r border-gray-300"></TableCell>
              {dateHeaders.map((_, idx: number) => (
                <TableCell key={idx} className="border-r border-gray-300"></TableCell>
              ))}
            </TableRow>
            {/* Activities */}
            {activities.map((activity: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell className="border-r border-gray-300"></TableCell>
                <TableCell className="border-r border-gray-300 text-left">{activity.label}</TableCell>
                {activity.date_data.map((dateObj: any, dIdx: number) => (
                  <TableCell key={dIdx} className="border-r border-gray-300">
                    {/* If there are time slots, show value(s) */}
                    {dateObj.time_slot_data && dateObj.time_slot_data.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {dateObj.time_slot_data.map((slot: any, sIdx: number) => (
                          <div key={sIdx} className="text-xs">
                            <span className="font-semibold">{slot.time_slot}:</span> {slot.value ?? '-'}
                            {slot.comment && <span className="ml-1 text-gray-400">({slot.comment})</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewPerformancePage;
