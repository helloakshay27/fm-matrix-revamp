import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { X } from 'lucide-react';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast } from 'sonner';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters?: () => void;
}

interface FilterState {
  surveyTitle: string;
  surveyMappingId: string;
  surveyType: string;
  startDate: Date | null;
  endDate: Date | null;
}

export const SurveyResponseFilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApplyFilters,
  onResetFilters
}) => {
  const [filters, setFilters] = useState<FilterState>({
    surveyTitle: '',
    surveyMappingId: '',
    surveyType: '',
    startDate: null,
    endDate: null
  });

  const handleReset = () => {
    setFilters({
      surveyTitle: '',
      surveyMappingId: '',
      surveyType: '',
      startDate: null,
      endDate: null
    });
    if (onResetFilters) {
      onResetFilters();
    }
    onClose();
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleInputChange = (field: keyof FilterState, value: string | Date | null) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Common field styling for consistent height across desktop and mobile
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      height: '45px',
      borderRadius: '6px',
      '& input': {
        height: '45px',
        padding: '10px 14px',
        boxSizing: 'border-box'
      },
      '&:hover fieldset': {
        borderColor: '#C72030'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030'
      }
    },
    '& .MuiInputLabel-root': {
      '&.Mui-focused': {
        color: '#C72030'
      }
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)'
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="relative pb-4">
            <DialogTitle className="text-xl text-slate-950 font-normal">FILTER BY</DialogTitle>
            <button
              onClick={onClose}
              className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Survey Details Section */}
            <div>
              <h3 className="text-lg font-semibold text-[#C72030] mb-4">Survey Details</h3>
              <div className="space-y-4">
                {/* Survey Title Filter */}
                <Box>
                  <TextField 
                    fullWidth 
                    label="Survey Title" 
                    variant="outlined" 
                    value={filters.surveyTitle} 
                    onChange={e => handleInputChange('surveyTitle', e.target.value)} 
                    placeholder="Enter Title" 
                    sx={fieldSx}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-center items-center gap-3 pt-4 w-full">
            <Button 
              onClick={handleReset} 
              variant="outline" 
              className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white px-8"
            >
              Reset
            </Button>
            <Button 
              onClick={handleApply} 
              className="bg-[#C72030] text-white hover:bg-[#A01828] px-8"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};
