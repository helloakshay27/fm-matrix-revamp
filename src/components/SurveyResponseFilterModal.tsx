
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            padding: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: '#C72030',
          pb: 2
        }}>
          Filter Survey Responses
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              {/* Survey Title Filter */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Survey Title"
                  variant="outlined"
                  value={filters.surveyTitle}
                  onChange={(e) => handleInputChange('surveyTitle', e.target.value)}
                  placeholder="Enter survey title..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#C72030',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#C72030',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#C72030',
                    },
                  }}
                />
              </Grid>

              {/* Survey Type Filter */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel
                    sx={{
                      '&.Mui-focused': {
                        color: '#C72030',
                      },
                    }}
                  >
                    Survey Type
                  </InputLabel>
                  <Select
                    value={filters.surveyType}
                    onChange={(e) => handleInputChange('surveyType', e.target.value)}
                    label="Survey Type"
                    sx={{
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#C72030',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#C72030',
                      },
                    }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="feedback">Feedback</MenuItem>
                    <MenuItem value="evaluation">Evaluation</MenuItem>
                    <MenuItem value="satisfaction">Satisfaction</MenuItem>
                    <MenuItem value="research">Research</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Start Date Filter */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#C72030',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C72030',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#C72030',
                        },
                      }
                    }
                  }}
                />
              </Grid>

              {/* End Date Filter */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleInputChange('endDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#C72030',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C72030',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#C72030',
                        },
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleReset}
            variant="outlined"
            sx={{
              borderColor: '#C72030',
              color: '#C72030',
              '&:hover': {
                borderColor: '#C72030',
                backgroundColor: 'rgba(199, 32, 48, 0.04)',
              },
            }}
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            sx={{
              backgroundColor: '#C72030',
              '&:hover': {
                backgroundColor: '#A01828',
              },
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
