import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Popover,
  TextField
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface MonthPickerProps {
  value: string;
  onChange: (month: string) => void;
  label: string;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange, label }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedYear, setSelectedYear] = useState(2025);
  
  const months = [
    { short: 'Jan', full: 'January' },
    { short: 'Feb', full: 'February' },
    { short: 'Mar', full: 'March' },
    { short: 'Apr', full: 'April' },
    { short: 'May', full: 'May' },
    { short: 'Jun', full: 'June' },
    { short: 'Jul', full: 'July' },
    { short: 'Aug', full: 'August' },
    { short: 'Sep', full: 'September' },
    { short: 'Oct', full: 'October' },
    { short: 'Nov', full: 'November' },
    { short: 'Dec', full: 'December' }
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMonthSelect = (month: string) => {
    onChange(month);
    handleClose();
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setSelectedYear(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TextField
        label={label}
        value={value}
        onClick={handleClick}
        variant="outlined"
        fullWidth
        placeholder="Select Month"
        InputProps={{
          readOnly: true,
          style: { cursor: 'pointer' }
        }}
        sx={{
          '& .MuiInputBase-root': {
            height: { xs: '36px', md: '45px' }
          }
        }}
      />
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 3,
            border: '1px solid #e0e0e0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            minWidth: '320px'
          }
        }}
      >
        <Box>
          {/* Year Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2,
            px: 1
          }}>
            <IconButton 
              size="small" 
              onClick={() => handleYearChange('prev')}
              sx={{ color: '#666' }}
            >
              <ChevronLeft />
            </IconButton>
            
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
              {selectedYear}
            </Typography>
            
            <IconButton 
              size="small" 
              onClick={() => handleYearChange('next')}
              sx={{ color: '#666' }}
            >
              <ChevronRight />
            </IconButton>
          </Box>

          {/* Month Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: 1,
            maxWidth: '280px'
          }}>
            {months.map((month) => (
              <Button
                key={month.short}
                variant={value === month.full ? "contained" : "text"}
                onClick={() => handleMonthSelect(month.full)}
                sx={{
                  minWidth: '60px',
                  height: '48px',
                  fontSize: '14px',
                  fontWeight: 500,
                  borderRadius: 2,
                  backgroundColor: value === month.full ? '#1976d2' : 'transparent',
                  color: value === month.full ? 'white' : '#333',
                  '&:hover': {
                    backgroundColor: value === month.full ? '#1565c0' : 'rgba(0,0,0,0.04)',
                  },
                  textTransform: 'none'
                }}
              >
                {month.short}
              </Button>
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};