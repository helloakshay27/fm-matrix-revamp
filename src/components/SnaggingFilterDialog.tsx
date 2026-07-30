import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface SnaggingFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterValues) => void;
}

interface FilterValues {
  tower: string;
  floor: string;
  flat: string;
  stage: string;
}

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
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

export const SnaggingFilterDialog = ({ open, onOpenChange, onApplyFilters }: SnaggingFilterDialogProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterValues>({
    tower: '',
    floor: '',
    flat: '',
    stage: ''
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters = { tower: '', floor: '', flat: '', stage: '' };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    // modal={false} lets portaled MUI Select menus receive clicks/scroll
    // (Radix modal mode otherwise traps pointer events outside DialogContent).
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="w-full sm:max-w-[500px] bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          // Keep dialog open when interacting with the MUI select menu
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest('.MuiPopover-root, .MuiModal-root, .MuiMenu-root')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Responsive Grid: 1 column on mobile, 2 on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="tower-label">Tower</InputLabel>
            <MuiSelect
              labelId="tower-label"
              label="Tower"
              value={filters.tower}
              onChange={(e) => handleFilterChange('tower', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value=""><em>Select Tower</em></MenuItem>
              <MenuItem value="A">Tower A</MenuItem>
              <MenuItem value="B">Tower B</MenuItem>
              <MenuItem value="C">Tower C</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="floor-label">Floor</InputLabel>
            <MuiSelect
              labelId="floor-label"
              label="Floor"
              value={filters.floor}
              onChange={(e) => handleFilterChange('floor', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value=""><em>Select Floor</em></MenuItem>
              <MenuItem value="1st">1st Floor</MenuItem>
              <MenuItem value="2nd">2nd Floor</MenuItem>
              <MenuItem value="3rd">3rd Floor</MenuItem>
              <MenuItem value="4th">4th Floor</MenuItem>
              <MenuItem value="5th">5th Floor</MenuItem>
              <MenuItem value="6th">6th Floor</MenuItem>
              <MenuItem value="7th">7th Floor</MenuItem>
              <MenuItem value="8th">8th Floor</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="flat-label">Flat</InputLabel>
            <MuiSelect
              labelId="flat-label"
              label="Flat"
              value={filters.flat}
              onChange={(e) => handleFilterChange('flat', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value=""><em>Select Flat</em></MenuItem>
              <MenuItem value="101">101</MenuItem>
              <MenuItem value="103">103</MenuItem>
              <MenuItem value="301">301</MenuItem>
              <MenuItem value="501">501</MenuItem>
              <MenuItem value="601">601</MenuItem>
              <MenuItem value="801">801</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="stage-label">Stage</InputLabel>
            <MuiSelect
              labelId="stage-label"
              label="Stage"
              value={filters.stage}
              onChange={(e) => handleFilterChange('stage', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value=""><em>Select Stage</em></MenuItem>
              <MenuItem value="Units Snagging">Units Snagging</MenuItem>
              <MenuItem value="Common Area Snagging">Common Area Snagging</MenuItem>
              <MenuItem value="Pre-handover Snagging">Pre-handover Snagging</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button
            onClick={handleApply}
            className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
          >
            APPLY
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-brand text-brand px-8 w-full sm:w-auto"
          >
            RESET
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
