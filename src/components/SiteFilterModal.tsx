import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Filter, MapPin, X } from 'lucide-react';

export interface SiteFilters {
  companyId?: string;
  regionId?: string;
  countryId?: string;
  site_type?: string;
  status?: string;
}

interface SiteFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: SiteFilters) => void;
  companiesDropdown: Array<{ id: number; name: string }>;
  regionsDropdown: Array<{ id: number; name: string }>;
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
};

export const SiteFilterModal: React.FC<SiteFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  companiesDropdown,
  regionsDropdown,
  countriesDropdown
}) => {
  const [filters, setFilters] = useState<SiteFilters>({
    companyId: '',
    regionId: '',
    countryId: '',
    site_type: '',
    status: '',
  });

  const handleFilterChange = (field: keyof SiteFilters, value: string) => {
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
    
    console.log('🔍 Applying site filters:', cleanFilters);
    onApply(cleanFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      companyId: '',
      regionId: '',
      countryId: '',
      site_type: '',
      status: '',
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
            Filter Sites
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Filter */}
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <MuiSelect
                value={filters.companyId || ''}
                onChange={(e) => handleFilterChange('companyId', e.target.value)}
                label="Company"
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>All Companies</em>
                </MenuItem>
                {companiesDropdown.map((company) => (
                  <MenuItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Region Filter */}
            <FormControl fullWidth>
              <InputLabel>Region</InputLabel>
              <MuiSelect
                value={filters.regionId || ''}
                onChange={(e) => handleFilterChange('regionId', e.target.value)}
                label="Region"
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>All Regions</em>
                </MenuItem>
                {regionsDropdown.map((region) => (
                  <MenuItem key={region.id} value={region.id.toString()}>
                    {region.name}
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

            {/* Site Type Filter */}
            <FormControl fullWidth>
              <InputLabel>Site Type</InputLabel>
              <MuiSelect
                value={filters.site_type || ''}
                onChange={(e) => handleFilterChange('site_type', e.target.value)}
                label="Site Type"
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>All Site Types</em>
                </MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Factory">Factory</MenuItem>
                <MenuItem value="Warehouse">Warehouse</MenuItem>
                <MenuItem value="Store">Store</MenuItem>
                <MenuItem value="Branch">Branch</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </MuiSelect>
            </FormControl>

            {/* Status Filter */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <MuiSelect
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                label="Status"
                MenuProps={selectMenuProps}
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>All Status</em>
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.companyId && (
                  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    <MapPin className="w-3 h-3" />
                    Company: {companiesDropdown.find(c => c.id.toString() === filters.companyId)?.name}
                    <button 
                      onClick={() => handleFilterChange('companyId', '')}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                
                {filters.regionId && (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    Region: {regionsDropdown.find(r => r.id.toString() === filters.regionId)?.name}
                    <button 
                      onClick={() => handleFilterChange('regionId', '')}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filters.countryId && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    Country: {countriesDropdown.find(c => c.id.toString() === filters.countryId)?.name}
                    <button 
                      onClick={() => handleFilterChange('countryId', '')}
                      className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filters.site_type && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    Type: {filters.site_type}
                    <button 
                      onClick={() => handleFilterChange('site_type', '')}
                      className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {filters.status && (
                  <div className="flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    Status: {filters.status === 'active' ? 'Active' : 'Inactive'}
                    <button 
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1 hover:bg-red-200 rounded-full p-0.5"
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
