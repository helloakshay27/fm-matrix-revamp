
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  TextField,
  createTheme,
  ThemeProvider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingSetupFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: {
    dateRange: string;
    facilityType: string;
    bookingMethod: string;
  }) => void;
}

// Custom theme for MUI text fields with responsive heights
const muiTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px', // rounded-md equivalent
            backgroundColor: '#FFFFFF',
            height: '45px', // Desktop height
            '& fieldset': {
              borderColor: '#E0E0E0',
              borderRadius: '6px',
            },
            '&:hover fieldset': {
              borderColor: '#1A1A1A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C72030',
              borderWidth: 2,
            },
            '&.Mui-disabled': {
              opacity: 0.5,
            },
          },
          // Mobile breakpoint - 36px height
          '@media (max-width: 768px)': {
            '& .MuiOutlinedInput-root': {
              height: '36px',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#1A1A1A',
          fontWeight: 500,
          fontSize: '14px',
          '&.Mui-focused': {
            color: '#C72030',
          },
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            backgroundColor: '#FFFFFF',
            padding: '0 4px',
          },
          // Mobile adjustments
          '@media (max-width: 768px)': {
            fontSize: '12px',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: '#1A1A1A',
          fontSize: '14px',
          fontWeight: 400,
          padding: '12px 14px',
          '&::placeholder': {
            color: '#1A1A1A',
            opacity: 0.54,
          },
          // Mobile adjustments
          '@media (max-width: 768px)': {
            fontSize: '12px',
            padding: '8px 12px',
          },
        },
      },
    },
  },
});

export const BookingSetupFilterModal: React.FC<BookingSetupFilterModalProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const [filters, setFilters] = useState({
    dateRange: '',
    facilityType: '',
    bookingMethod: ''
  });

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateRangeSelect = (range: { from?: Date; to?: Date }) => {
    if (range?.from) {
      setDateFrom(range.from);
    }
    if (range?.to) {
      setDateTo(range.to);
      // Close picker when both dates are selected
      if (range.from && range.to) {
        const formattedRange = `${format(range.from, 'dd/MM/yyyy')} - ${format(range.to, 'dd/MM/yyyy')}`;
        setFilters(prev => ({ ...prev, dateRange: formattedRange }));
        setIsDatePickerOpen(false);
      }
    }
  };

  const getDateRangeDisplayValue = () => {
    if (dateFrom && dateTo) {
      return `${format(dateFrom, 'dd/MM/yyyy')} - ${format(dateTo, 'dd/MM/yyyy')}`;
    }
    if (dateFrom) {
      return format(dateFrom, 'dd/MM/yyyy');
    }
    return '';
  };

  const handleApply = () => {
    console.log('Applying Booking Setup filters:', filters);
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      dateRange: '',
      facilityType: '',
      bookingMethod: ''
    });
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-0">
        <ThemeProvider theme={muiTheme}>
          <div className="p-6">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <TextField
                        fullWidth
                        label="Select date range"
                        placeholder="Select Date Range"
                        value={getDateRangeDisplayValue()}
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                          ),
                        }}
                        onClick={() => setIsDatePickerOpen(true)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border shadow-lg z-50"
                    align="start"
                    sideOffset={4}
                  >
                    <div className="p-4">
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateFrom,
                          to: dateTo,
                        }}
                        onSelect={handleDateRangeSelect}
                        numberOfMonths={2}
                        className={cn("pointer-events-auto")}
                      />
                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="text-sm text-gray-600">
                          {getDateRangeDisplayValue() || 'Select date range'}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDateFrom(undefined);
                              setDateTo(undefined);
                              setFilters(prev => ({ ...prev, dateRange: '' }));
                              setIsDatePickerOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (dateFrom && dateTo) {
                                const formattedRange = `${format(dateFrom, 'dd/MM/yyyy')} - ${format(dateTo, 'dd/MM/yyyy')}`;
                                setFilters(prev => ({ ...prev, dateRange: formattedRange }));
                              }
                              setIsDatePickerOpen(false);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <TextField
                  fullWidth
                  label="Facility Type"
                  placeholder=""
                  value={filters.facilityType}
                  onChange={(e) => handleInputChange('facilityType', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>

              <div>
                <TextField
                  fullWidth
                  label="Booking Method"
                  placeholder=""
                  value={filters.bookingMethod}
                  onChange={(e) => handleInputChange('bookingMethod', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleApply}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </ThemeProvider>
      </DialogContent>
    </Dialog>
  );
};
