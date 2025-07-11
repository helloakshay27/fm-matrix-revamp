
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, createTheme, ThemeProvider, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { AsyncSearchableDropdown } from './AsyncSearchableDropdown';

interface ExportByCentreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Custom theme for MUI TextFields with responsive heights
const textFieldTheme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px', // rounded-md equivalent
            backgroundColor: '#FFFFFF',
            // Desktop height (default)
            height: '45px',
            '& fieldset': {
              borderColor: '#E0E0E0',
              borderRadius: '6px',
            },
            '&:hover fieldset': {
              borderColor: '#1A1A1A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8B4B8C',
              borderWidth: 2,
            },
            '& input': {
              padding: '12px 14px',
              fontSize: '14px',
            },
          },
          // Mobile breakpoint
          '@media (max-width: 768px)': {
            '& .MuiOutlinedInput-root': {
              height: '36px',
              '& input': {
                padding: '8px 14px',
                fontSize: '12px',
              },
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
            color: '#8B4B8C',
          },
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
            backgroundColor: '#FFFFFF',
            padding: '0 4px',
          },
          // Mobile breakpoint
          '@media (max-width: 768px)': {
            fontSize: '12px',
          },
        },
      },
    },
  },
});

// Date options for dropdown
const dateOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-7-days', label: 'Last 7 Days' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'custom', label: 'Custom Date' }
];

// Available sites/centers data
const availableSites = [
  { value: 'lockated', label: 'Lockated' },
  { value: 'godrej-eternity', label: 'Godrej Eternity' },
  { value: 'godrej-summit-gurgaon', label: 'Godrej Summit,Gurgaon' },
  { value: 'godrej-prime-gurgaon', label: 'Godrej Prime,Gurgaon' },
  { value: 'runwal-elegante', label: 'Runwal Elegante' },
  { value: 'runwal-the-reserve', label: 'Runwal The Reserve' },
  { value: 'runwal-my-city', label: 'Runwal My City' },
  { value: 'godrej-oasis', label: 'Godrej Oasis' },
  { value: 'sai-radhe-bund-garden', label: 'Sai Radhe, Bund Garden' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'suneel-test', label: 'Suneel Test' }
];

export const ExportByCentreModal: React.FC<ExportByCentreModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    sites: null as any
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSiteSelection = (selectedSite: any) => {
    setFormData(prev => ({
      ...prev,
      sites: selectedSite
    }));
  };

  const handleSiteSearch = async (searchTerm: string) => {
    // Filter sites based on search term
    if (!searchTerm.trim()) {
      return availableSites;
    }
    
    return availableSites.filter(site => 
      site.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleExport = () => {
    console.log('Export by centre data:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-bold">Select Sites to Export</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ThemeProvider theme={textFieldTheme}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>
              <div className="space-y-4">
                <TextField
                  select
                  label="Start"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ 
                    shrink: true,
                  }}
                >
                  {dateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  select
                  label="End"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ 
                    shrink: true,
                  }}
                >
                  {dateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Sites</h3>
              <AsyncSearchableDropdown
                placeholder="Select sites"
                onSearch={handleSiteSearch}
                onChange={handleSiteSelection}
                defaultOptions={availableSites}
                className="w-full"
                noOptionsMessage="No sites found"
              />
            </div>

            <div className="flex justify-start pt-4">
              <Button 
                onClick={handleExport}
                className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white px-8"
              >
                Export
              </Button>
            </div>
          </div>
        </ThemeProvider>
      </DialogContent>
    </Dialog>
  );
};
