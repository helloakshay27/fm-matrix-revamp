
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  TextField, 
  createTheme, 
  ThemeProvider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { X } from 'lucide-react';

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

  const handleInputChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <TextField
                  fullWidth
                  label="Select date range"
                  placeholder="Select Date Range"
                  value={filters.dateRange}
                  onChange={(e) => handleInputChange('dateRange', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
