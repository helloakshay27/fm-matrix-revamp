
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface CampaignFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  onReset: () => void;
}

// Field styles matching AssetFilterDialog's MUI Select/Input sizing
const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

// Shared MenuProps so Select dropdowns render correctly (positioned under the
// field, not detached) and match the brand-consistent styling used elsewhere
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

export const CampaignFilterModal = ({ isOpen, onClose, onApply, onReset }: CampaignFilterModalProps) => {
  const [filters, setFilters] = useState({
    referredBy: '',
    status: '',
    createdOn: undefined as Date | undefined
  });

  const handleFilterChange = (field: string, value: string | Date | undefined) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    console.log('Apply filters clicked with data:', filters);
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    console.log('Reset filters clicked');
    const resetFilters = {
      referredBy: '',
      status: '',
      createdOn: undefined as Date | undefined
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent className="max-w-md w-full bg-white border border-gray-300 shadow-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-left">Filter</DialogTitle>
          <DialogDescription className="sr-only">
            Filter campaigns by referred by, status, and created date
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-6">
          <div className="space-y-4 mb-6">
            <FormControl fullWidth>
              <InputLabel shrink id="referred-by-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Referred By
              </InputLabel>
              <Select
                labelId="referred-by-label"
                value={filters.referredBy}
                onChange={(e: SelectChangeEvent<string>) => handleFilterChange('referredBy', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Referred By</em>
                </MenuItem>
                <MenuItem value="deepak-gupta">Deepak Gupta</MenuItem>
                <MenuItem value="godrej-living">Godrej Living</MenuItem>
                <MenuItem value="kshitij-rasal">Kshitij Rasal</MenuItem>
                <MenuItem value="samay-seth">Samay Seth</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel shrink id="status-label" sx={{ backgroundColor: 'white', px: 1 }}>
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                value={filters.status}
                onChange={(e: SelectChangeEvent<string>) => handleFilterChange('status', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Status</em>
                </MenuItem>
                <MenuItem value="hot">Hot</MenuItem>
                <MenuItem value="warm">Warm</MenuItem>
                <MenuItem value="cold">Cold</MenuItem>
                <MenuItem value="active">Active</MenuItem>
              </Select>
            </FormControl>

            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 justify-start text-left font-normal border border-gray-300 focus:border-brand focus:ring-1 focus:ring-brand bg-white hover:bg-gray-50",
                      !filters.createdOn && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.createdOn ? format(filters.createdOn, "MM/dd/yyyy") : "Created on"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.createdOn}
                    onSelect={(date) => handleFilterChange('createdOn', date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={handleApply}
              className="fm-button-fix fm-button-brand px-4 py-2"
            >
              Apply Filters
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-brand text-brand hover:bg-brand-selected hover:text-brand"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
