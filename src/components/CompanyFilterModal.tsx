import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import { Filter, Building, X } from 'lucide-react';

export interface CompanyFilters {
  organizationId?: string;
  countryId?: string;
  billing_rate?: string;
  live_date_from?: string;
  live_date_to?: string;
}

interface CompanyFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: CompanyFilters) => void;
  organizationsDropdown: Array<{ id: number; name: string }>;
  countriesDropdown: Array<{ id: number; name: string }>;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

const selectMenuProps = {
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
};

export const CompanyFilterModal: React.FC<CompanyFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  organizationsDropdown,
  countriesDropdown
}) => {
  const [filters, setFilters] = useState<CompanyFilters>({
    organizationId: '',
    countryId: '',
    billing_rate: '',
    live_date_from: '',
    live_date_to: '',
  });

  const handleFilterChange = (field: keyof CompanyFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    // Remove empty filters
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== undefined)
    );
    
    console.log('🔍 Applying company filters:', cleanFilters);
    onApply(cleanFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      organizationId: '',
      countryId: '',
      billing_rate: '',
      live_date_from: '',
      live_date_to: '',
    });
  };

  const handleClose = () => {
    onClose();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== undefined);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Companies
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organization Filter */}
            <FormControl fullWidth>
              <InputLabel>Organization</InputLabel>
              <MuiSelect
                value={filters.organizationId || ''}
                onChange={(e) => handleFilterChange('organizationId', e.target.value)}
                label="Organization"
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>All Organizations</em>
                </MenuItem>
                {organizationsDropdown.map((org) => (
                  <MenuItem key={org.id} value={org.id.toString()}>
                    {org.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Country Filter */}
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <MuiSelect
                value={filters.countryId || ''}
                onChange={(e) => handleFilterChange('countryId', e.target.value)}
                label="Country"
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>All Countries</em>
                </MenuItem>
                {countriesDropdown.map((country) => (
                  <MenuItem key={country.id} value={country.id.toString()}>
                    {country.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Billing Rate Filter */}
            <TextField
              label="Billing Rate"
              value={filters.billing_rate || ''}
              onChange={(e) => handleFilterChange('billing_rate', e.target.value)}
              placeholder="Enter billing rate"
              fullWidth
              sx={fieldStyles}
            />

            {/* Live Date From */}
            <TextField
              label="Live Date From"
              type="date"
              value={filters.live_date_from || ''}
              onChange={(e) => handleFilterChange('live_date_from', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />

            {/* Live Date To */}
            <TextField
              label="Live Date To"
              type="date"
              value={filters.live_date_to || ''}
              onChange={(e) => handleFilterChange('live_date_to', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.organizationId && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    <Building className="w-3 h-3" />
                    Organization: {organizationsDropdown.find(o => o.id.toString() === filters.organizationId)?.name}
                    <button 
                      onClick={() => handleFilterChange('organizationId', '')}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {filters.countryId && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Country: {countriesDropdown.find(c => c.id.toString() === filters.countryId)?.name}
                    <button 
                      onClick={() => handleFilterChange('countryId', '')}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filters.billing_rate && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    Billing Rate: {filters.billing_rate}
                    <button 
                      onClick={() => handleFilterChange('billing_rate', '')}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filters.live_date_from && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    From: {filters.live_date_from}
                    <button 
                      onClick={() => handleFilterChange('live_date_from', '')}
                      className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filters.live_date_to && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    To: {filters.live_date_to}
                    <button 
                      onClick={() => handleFilterChange('live_date_to', '')}
                      className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="text-gray-600"
          >
            Clear All
          </Button>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleApply}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
