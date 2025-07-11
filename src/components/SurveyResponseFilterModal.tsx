import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
}
interface FilterState {
  surveyTitle: string;
  surveyType: string;
  startDate: Date | null;
  endDate: Date | null;
}
export const SurveyResponseFilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<FilterState>({
    surveyTitle: '',
    surveyType: '',
    startDate: null,
    endDate: null
  });
  const handleReset = () => {
    setFilters({
      surveyTitle: '',
      surveyType: '',
      startDate: null,
      endDate: null
    });
  };
  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };
  const handleInputChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Common field styling for consistent height across desktop and mobile
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      height: {
        xs: '36px',
        sm: '45px'
      },
      borderRadius: '6px',
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
  return <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-950 font-normal">FILTER BY</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {/* Survey Details Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#C72030] mb-4">Survey Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Survey Title Filter */}
                <Box>
                  <TextField fullWidth label="Survey Title" variant="outlined" value={filters.surveyTitle} onChange={e => handleInputChange('surveyTitle', e.target.value)} placeholder="Enter Title" sx={fieldSx} />
                </Box>

                {/* Survey Type Filter */}
                <Box>
                  <FormControl fullWidth variant="outlined" sx={fieldSx}>
                    <InputLabel>Survey Type</InputLabel>
                    <Select value={filters.surveyType} onChange={e => handleInputChange('surveyType', e.target.value)} label="Survey Type">
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="feedback">Feedback</MenuItem>
                      <MenuItem value="evaluation">Evaluation</MenuItem>
                      <MenuItem value="satisfaction">Satisfaction</MenuItem>
                      <MenuItem value="research">Research</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </div>
            </div>

            {/* Date Range Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#C72030] mb-4">Date Range</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From Date */}
                <Box>
                  <DateField label="From Date" value={filters.startDate} onChange={date => handleInputChange('startDate', date)} format="dd/MM/yyyy" variant="outlined" fullWidth sx={fieldSx} />
                </Box>

                {/* To Date */}
                <Box>
                  <DateField label="To Date" value={filters.endDate} onChange={date => handleInputChange('endDate', date)} format="dd/MM/yyyy" variant="outlined" fullWidth sx={fieldSx} />
                </Box>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button onClick={handleReset} variant="outline" className="text-[#C72030] border-[#C72030] hover:bg-[#C72030] hover:text-white px-8">
              Reset
            </Button>
            <Button onClick={handleApply} className="bg-[#C72030] text-white hover:bg-[#A01828] px-8">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>;
};