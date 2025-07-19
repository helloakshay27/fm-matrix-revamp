import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { MonthPicker } from './MonthPicker';

interface AttendanceExportModalProps {
  open: boolean;
  onClose: () => void;
}

export const AttendanceExportModal: React.FC<AttendanceExportModalProps> = ({
  open,
  onClose
}) => {
  const [site, setSite] = useState('');
  const [userType, setUserType] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [month, setMonth] = useState('');

  const sites = ['Site 1', 'Site 2', 'Site 3'];
  const userTypes = ['Occupants', 'Employees', 'Visitors'];
  const departmentOptions = ['Frontend', 'Backend', 'DevOps', 'Support', 'HR', 'Finance'];

  const handleDepartmentChange = (event: any) => {
    const value = event.target.value;
    setDepartments(typeof value === 'string' ? value.split(',') : value);
  };

  const handleExport = () => {
    console.log('Exporting attendance with filters:', {
      site,
      userType,
      departments,
      month
    });
    // Here you would implement the actual export logic
    onClose();
  };

  const handleClose = () => {
    // Reset form
    setSite('');
    setUserType('');
    setDepartments([]);
    setMonth('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          minHeight: '400px'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component={DialogTitle} sx={{ p: 0, fontWeight: 600 }}>
            Export
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'grey.500' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Form Fields */}
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* Site Dropdown */}
          <TextField
            select
            label="Site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="">
              <em>Select Site</em>
            </MenuItem>
            {sites.map((siteOption) => (
              <MenuItem key={siteOption} value={siteOption}>
                {siteOption}
              </MenuItem>
            ))}
          </TextField>

          {/* User Type Dropdown */}
          <TextField
            select
            label="User Type"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="">
              <em>Select User Type</em>
            </MenuItem>
            {userTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {/* Department Multi-select */}
          <TextField
            select
            label="Department"
            value={departments.length > 0 ? departments : []}
            onChange={handleDepartmentChange}
            variant="outlined"
            fullWidth
            SelectProps={{
              multiple: true,
              renderValue: (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              ),
            }}
            sx={{ minHeight: '56px' }}
          >
            {departmentOptions.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>

          {/* Month Picker */}
          <MonthPicker
            value={month}
            onChange={setMonth}
            label="Month"
          />
        </Box>

        {/* Export Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleExport}
            startIcon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            }
            sx={{
              backgroundColor: '#F2EEE9',
              color: '#BF213E',
              px: 4,
              py: 1.5,
              height: '36px',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#F2EEE9',
                opacity: 0.9,
                boxShadow: 'none'
              }
            }}
          >
            Export
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};