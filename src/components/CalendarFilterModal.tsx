import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'sonner';
interface CalendarFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: CalendarFilters) => void;
}

export interface CalendarFilters {
  dateFrom: string;
  dateTo: string;
  's[task_custom_form_schedule_type_eq]': string;
  's[task_task_of_eq]': string;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};
export const CalendarFilterModal: React.FC<CalendarFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  // Helper function to get default date range (today to one week ago)
  const getDefaultDateRange = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    return {
      dateFrom: formatDate(oneWeekAgo),
      dateTo: formatDate(today)
    };
  };

  const [filters, setFilters] = useState<CalendarFilters>(() => {
    const defaultRange = getDefaultDateRange();
    return {
      dateFrom: defaultRange.dateFrom,
      dateTo: defaultRange.dateTo,
      's[task_custom_form_schedule_type_eq]': '',
      's[task_task_of_eq]': ''
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState<string>('');

  // Date validation function
  const validateDates = (fromDate: string, toDate: string): string => {
    if (!fromDate && !toDate) {
      return '';
    }

    if (fromDate && !toDate) {
      return 'Please select an "End Date"';
    }

    if (!fromDate && toDate) {
      return 'Please select a "Start Date"';
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (from > to) {
        return '"Start Date" cannot be later than "End Date"';
      }

      // Check if date range exceeds 1 year
      const oneYear = 365 * 24 * 60 * 60 * 1000; // milliseconds in a year
      if (to.getTime() - from.getTime() > oneYear) {
        return 'Date range cannot exceed 1 year';
      }
    }

    return '';
  };

  const handleFilterChange = (key: keyof CalendarFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));

    // Validate dates when date fields change
    if (key === 'dateFrom' || key === 'dateTo') {
      const newFromDate = key === 'dateFrom' ? value : filters.dateFrom;
      const newToDate = key === 'dateTo' ? value : filters.dateTo;
      const error = validateDates(newFromDate, newToDate);
      setDateError(error);
    }
  };
  const handleApply = async () => {
    // Validate dates before applying
    const dateValidationError = validateDates(filters.dateFrom, filters.dateTo);
    if (dateValidationError) {
      setDateError(dateValidationError);
      toast.error(dateValidationError);
      return;
    }

    setIsLoading(true);
    try {
      // Convert YYYY-MM-DD to DD/MM/YYYY for API
      const formatForAPI = (dateStr: string) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      };

      const apiFilters: CalendarFilters = {
        dateFrom: formatForAPI(filters.dateFrom),
        dateTo: formatForAPI(filters.dateTo),
        's[task_custom_form_schedule_type_eq]': filters['s[task_custom_form_schedule_type_eq]'],
        's[task_task_of_eq]': filters['s[task_task_of_eq]']
      };

      onApplyFilters(apiFilters);
      onClose();
      toast.success('Filters applied successfully');
    } catch (error) {
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };
  const handleClear = () => {
    const defaultRange = getDefaultDateRange();
    const clearedFilters: CalendarFilters = {
      dateFrom: defaultRange.dateFrom,
      dateTo: defaultRange.dateTo,
      's[task_custom_form_schedule_type_eq]': '',
      's[task_task_of_eq]': ''
    };
    setFilters(clearedFilters);
    setDateError(''); // Clear date error
    
    // Convert to DD/MM/YYYY for API
    const formatForAPI = (dateStr: string) => {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    const apiFilters: CalendarFilters = {
      dateFrom: formatForAPI(clearedFilters.dateFrom),
      dateTo: formatForAPI(clearedFilters.dateTo),
      's[task_custom_form_schedule_type_eq]': '',
      's[task_task_of_eq]': ''
    };

    onApplyFilters(apiFilters);
    onClose();
    toast.success('Filters cleared successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50" aria-describedby="calendar-filter-dialog-description">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER CALENDAR TASKS</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="calendar-filter-dialog-description" className="sr-only">
            Filter calendar tasks by date range, type, and schedule type
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Date Range Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Date Range</h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Start Date"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                error={!!dateError && dateError.includes('Start')}
                helperText={dateError && dateError.includes('Start') ? dateError : ''}
              />
              <TextField
                label="End Date"
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                error={!!dateError && dateError.includes('End')}
                helperText={dateError && dateError.includes('End') ? dateError : ''}
              />
            </div>
            {dateError && !dateError.includes('Start') && !dateError.includes('End') && (
              <div className="mt-2 text-sm text-red-600">{dateError}</div>
            )}
          </div>

          {/* Filter Options Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">Filter Options</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Select Type</InputLabel>
                <MuiSelect
                  value={filters['s[task_custom_form_schedule_type_eq]']}
                  onChange={(e) => handleFilterChange('s[task_custom_form_schedule_type_eq]', e.target.value)}
                  label="Select Type"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Type</em>
                  </MenuItem>
                  <MenuItem value="PPM">PPM</MenuItem>
                  <MenuItem value="AMC">AMC</MenuItem>
                  <MenuItem value="Preparedness">Preparedness</MenuItem>
                  <MenuItem value="Routine">Routine</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Schedule Type</InputLabel>
                <MuiSelect
                  value={filters['s[task_task_of_eq]']}
                  onChange={(e) => handleFilterChange('s[task_task_of_eq]', e.target.value)}
                  label="Schedule Type"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>Select Schedule Type</em>
                  </MenuItem>
                  <MenuItem value="Pms::Asset">Asset</MenuItem>
                  <MenuItem value="Pms::Service">Service</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button 
            onClick={handleApply} 
            disabled={isLoading} 
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 flex-1 h-11"
          >
            {isLoading ? 'Applying...' : 'Apply Filter'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleClear} 
            disabled={isLoading} 
            className="flex-1 h-11"
          >
            Clear All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};