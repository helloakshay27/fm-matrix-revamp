import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { MonthPicker } from './MonthPicker';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDepartmentData } from '@/store/slices/departmentSlice';
import { fetchSites } from '@/store/slices/siteSlice';
import { getFullUrl, getAuthHeader } from '@/config/apiConfig';

interface AttendanceExportModalProps {
  open: boolean;
  onClose: () => void;
}

export const AttendanceExportModal: React.FC<AttendanceExportModalProps> = ({
  open,
  onClose
}) => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { data: departments, loading: departmentsLoading } = useAppSelector((state) => state.department);
  const { sites, loading: sitesLoading } = useAppSelector((state) => state.site);
  
  const [site, setSite] = useState('');
  const [userType, setUserType] = useState('');
  const [department, setDepartment] = useState('');
  const [month, setMonth] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const userTypes = ['All', 'Occupants', 'Admin', 'Technician', 'Security'];

  useEffect(() => {
    if (open) {
      if (!departments || (Array.isArray(departments) && departments.length === 0)) {
        dispatch(fetchDepartmentData());
      }
      if (!sites || sites.length === 0) {
        dispatch(fetchSites());
      }
    }
  }, [open, dispatch, departments, sites]);

  const handleDepartmentChange = (event: any) => {
    setDepartment(event.target.value);
  };

  const handleExport = async () => {
    if (!site || !userType || !department || !month) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('site_id[]', site);
      params.append('department_id[]', department);
      params.append('user_type', userType);
      params.append('month', month);

      const url = `${getFullUrl('/pms/attendances/attendances_report.xlsx')}?${params.toString()}`;
      
      // Make the API call to download the Excel file
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Generate filename with current timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `attendance_report_${timestamp}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      
      console.log('Export completed successfully');
      
      // Show success toast
      toast({
        title: "Export Successful",
        description: "Attendance report has been exported successfully."
      });
      
      // Clear all fields after successful export
      setSite('');
      setUserType('');
      setDepartment('');
      setMonth('');
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export attendance report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setSite('');
    setUserType('');
    setDepartment('');
    setMonth('');
    setIsExporting(false);
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
          borderRadius: 2
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
            disabled={sitesLoading}
            sx={{
              '& .MuiInputBase-root': {
                height: { xs: '36px', md: '45px' }
              }
            }}
          >
            <MenuItem value="">
              <em>Select Site</em>
            </MenuItem>
            {sites.map((siteOption) => (
              <MenuItem key={siteOption.id} value={siteOption.id}>
                {siteOption.name}
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
            sx={{
              '& .MuiInputBase-root': {
                height: { xs: '36px', md: '45px' }
              }
            }}
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

          {/* Department Single-select */}
          <TextField
            select
            label="Department"
            value={department}
            onChange={handleDepartmentChange}
            variant="outlined"
            fullWidth
            disabled={departmentsLoading}
            sx={{
              '& .MuiInputBase-root': {
                height: { xs: '36px', md: '45px' }
              }
            }}
          >
            <MenuItem value="">
              <em>Select Department</em>
            </MenuItem>
            {Array.isArray(departments) && departments.filter(dept => dept.active).map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.department_name}
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
            disabled={isExporting || !site || !userType || !department || !month}
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
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};