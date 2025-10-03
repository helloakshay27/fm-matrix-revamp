import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Filter, X } from 'lucide-react';

export interface CountryFilters {
  countryId?: string;
  companyId?: string;
  status?: 'active' | 'inactive';
}

interface CountryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: CountryFilters) => void;
  countriesDropdown: any[];
  companiesDropdown: any[];
}

export const CountryFilterModal: React.FC<CountryFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  countriesDropdown,
  companiesDropdown
}) => {
  const [filters, setFilters] = useState<CountryFilters>({});

  const handleFilterChange = (key: keyof CountryFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({});
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Countries
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Country</InputLabel>
            <MuiSelect
              value={filters.countryId || ''}
              onChange={(e) => handleFilterChange('countryId', e.target.value)}
              label="Country"
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 9999,
                  },
                },
                disablePortal: false,
                disableAutoFocus: true,
                disableEnforceFocus: true,
              }}
              sx={{
                height: { xs: 28, sm: 36, md: 45 },
                '& .MuiInputBase-input, & .MuiSelect-select': {
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                },
              }}
            >
              <MenuItem value="">All Countries</MenuItem>
              {countriesDropdown.map((country) => (
                <MenuItem key={country.id} value={country.id.toString()}>
                  {country.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Company</InputLabel>
            <MuiSelect
              value={filters.companyId || ''}
              onChange={(e) => handleFilterChange('companyId', e.target.value)}
              label="Company"
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 9999,
                  },
                },
                disablePortal: false,
                disableAutoFocus: true,
                disableEnforceFocus: true,
              }}
              sx={{
                height: { xs: 28, sm: 36, md: 45 },
                '& .MuiInputBase-input, & .MuiSelect-select': {
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                },
              }}
            >
              <MenuItem value="">All Companies</MenuItem>
              {companiesDropdown.map((company) => (
                <MenuItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Status</InputLabel>
            <MuiSelect
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as 'active' | 'inactive')}
              label="Status"
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 224,
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 9999,
                  },
                },
                disablePortal: false,
                disableAutoFocus: true,
                disableEnforceFocus: true,
              }}
              sx={{
                height: { xs: 28, sm: 36, md: 45 },
                '& .MuiInputBase-input, & .MuiSelect-select': {
                  padding: { xs: '8px', sm: '10px', md: '12px' },
                },
              }}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="ghost" 
            onClick={handleClear}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleApply} className="bg-[#C72030] hover:bg-[#A01020] text-white">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
