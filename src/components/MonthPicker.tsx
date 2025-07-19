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
    { short: 'Jan', full: 'January', number: '01' },
    { short: 'Feb', full: 'February', number: '02' },
    { short: 'Mar', full: 'March', number: '03' },
    { short: 'Apr', full: 'April', number: '04' },
    { short: 'May', full: 'May', number: '05' },
    { short: 'Jun', full: 'June', number: '06' },
    { short: 'Jul', full: 'July', number: '07' },
    { short: 'Aug', full: 'August', number: '08' },
    { short: 'Sep', full: 'September', number: '09' },
    { short: 'Oct', full: 'October', number: '10' },
    { short: 'Nov', full: 'November', number: '11' },
    { short: 'Dec', full: 'December', number: '12' }
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMonthSelect = (monthNumber: string) => {
    const monthValue = `${selectedYear}-${monthNumber}`;
    onChange(monthValue);
    handleClose();
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setSelectedYear(prev => direction === 'next' ? prev + 1 : prev - 1);
  };

  // Get display value from YYYY-MM format
  const getDisplayValue = () => {
    if (!value) return '';
    if (value.includes('-')) {
      const [year, monthNum] = value.split('-');
      const monthObj = months.find(m => m.number === monthNum);
      return monthObj ? `${monthObj.full} ${year}` : value;
    }
    return value;
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TextField
        label={label}
        value={getDisplayValue()}
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
            {months.map((month) => {
              const isSelected = value === `${selectedYear}-${month.number}`;
              return (
                <Button
                  key={month.short}
                  variant={isSelected ? "contained" : "text"}
                  onClick={() => handleMonthSelect(month.number)}
                  sx={{
                    minWidth: '60px',
                    height: '48px',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: 2,
                    backgroundColor: isSelected ? '#1976d2' : 'transparent',
                    color: isSelected ? 'white' : '#333',
                    '&:hover': {
                      backgroundColor: isSelected ? '#1565c0' : 'rgba(0,0,0,0.04)',
                    },
                    textTransform: 'none'
                  }}
                >
                  {month.short}
                </Button>
              );
            })}
          </Box>
        </Box>
      </Popover>
    </>
  );
};