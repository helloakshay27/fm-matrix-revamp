
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid2 as Grid,
} from '@mui/material';
import { X } from 'lucide-react';

interface SurveyResponseFilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply?: (filters: FilterData) => void;
}

interface FilterData {
  surveyTitle: string;
  surveyType: string;
  fromDate: string;
  toDate: string;
}

export const SurveyResponseFilterModal: React.FC<SurveyResponseFilterModalProps> = ({
  open,
  onClose,
  onApply
}) => {
  const [filters, setFilters] = useState<FilterData>({
    surveyTitle: '',
    surveyType: '',
    fromDate: '',
    toDate: ''
  });

  const handleInputChange = (field: keyof FilterData, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      surveyTitle: '',
      surveyType: '',
      fromDate: '',
      toDate: ''
    });
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    if (onApply) {
      onApply(filters);
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          maxWidth: '800px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        pb: 2,
        fontSize: '1.5rem',
        fontWeight: 'normal',
        color: '#333'
      }}>
        FILTER BY
        <Button
          onClick={onClose}
          sx={{ 
            minWidth: 'auto', 
            p: 1,
            color: '#666'
          }}
        >
          <X size={20} />
        </Button>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#C72030', 
              mb: 3, 
              fontSize: '1.2rem',
              fontWeight: 600
            }}
          >
            Survey Details
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Survey Title"
                placeholder="Enter Title"
                value={filters.surveyTitle}
                onChange={(e) => handleInputChange('surveyTitle', e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Survey Type"
                placeholder="Enter Type"
                value={filters.surveyType}
                onChange={(e) => handleInputChange('surveyType', e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Grid>
          </Grid>

          <Typography 
            variant="h6" 
            sx={{ 
              color: '#C72030', 
              mb: 3, 
              fontSize: '1.2rem',
              fontWeight: 600
            }}
          >
            Date Range
          </Typography>
          
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="From"
                placeholder="dd/mm/yyyy"
                value={filters.fromDate}
                onChange={(e) => handleInputChange('fromDate', e.target.value)}
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="To"
                placeholder="dd/mm/yyyy"
                value={filters.toDate}
                onChange={(e) => handleInputChange('toDate', e.target.value)}
                variant="outlined"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        justifyContent: 'center', 
        gap: 3, 
        pb: 4, 
        pt: 2 
      }}>
        <Button
          onClick={handleReset}
          variant="outlined"
          sx={{
            color: '#C72030',
            borderColor: '#C72030',
            backgroundColor: '#f5f5f5',
            borderRadius: 0,
            px: 4,
            py: 1.5,
            minWidth: '120px',
            '&:hover': {
              backgroundColor: '#e0e0e0',
              borderColor: '#C72030'
            }
          }}
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          sx={{
            backgroundColor: '#C72030',
            color: 'white',
            borderRadius: 0,
            px: 4,
            py: 1.5,
            minWidth: '120px',
            '&:hover': {
              backgroundColor: '#a01826'
            }
          }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};
