import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { Close } from '@mui/icons-material';

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
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDepartmentChange = (event: SelectChangeEvent<string[]>) => {
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
          <FormControl fullWidth>
            <InputLabel>Site</InputLabel>
            <Select
              value={site}
              label="Site"
              onChange={(e) => setSite(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Site</em>
              </MenuItem>
              {sites.map((siteOption) => (
                <MenuItem key={siteOption} value={siteOption}>
                  {siteOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* User Type Dropdown */}
          <FormControl fullWidth>
            <InputLabel>User Type</InputLabel>
            <Select
              value={userType}
              label="User Type"
              onChange={(e) => setUserType(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select User Type</em>
              </MenuItem>
              {userTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Department Multi-select */}
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select<string[]>
              multiple
              value={departments}
              onChange={handleDepartmentChange}
              input={<OutlinedInput label="Department" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              sx={{ minHeight: '56px' }}
            >
              {departmentOptions.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Month Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={(e) => setMonth(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Month</em>
              </MenuItem>
              {months.map((monthOption) => (
                <MenuItem key={monthOption} value={monthOption}>
                  {monthOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Export Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="contained"
            onClick={handleExport}
            sx={{
              backgroundColor: '#6b21a8',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#5b1a9b'
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