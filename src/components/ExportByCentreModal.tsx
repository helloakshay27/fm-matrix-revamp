
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, createTheme, ThemeProvider, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { X } from 'lucide-react';

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
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
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
          },
          // Mobile breakpoint
          '@media (max-width: 768px)': {
            '& .MuiOutlinedInput-root': {
              height: '36px',
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
    sites: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSiteSelection = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      sites: event.target.value
    }));
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
                  type="date"
                  label="Start"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ 
                    shrink: true,
                  }}
                />
                
                <TextField
                  type="date"
                  label="End"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ 
                    shrink: true,
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Choose Sites</h3>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="sites-select-label">Select sites</InputLabel>
                <Select
                  labelId="sites-select-label"
                  id="sites-select"
                  value={formData.sites}
                  onChange={handleSiteSelection}
                  label="Select sites"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      },
                    },
                  }}
                >
                  {availableSites.map((site) => (
                    <MenuItem key={site.value} value={site.value}>
                      {site.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
