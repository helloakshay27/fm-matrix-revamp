
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

export const SnaggingFilterDialog = ({ open, onOpenChange, onApplyFilters }: SnaggingFilterDialogProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterValues>({
    tower: '',
    floor: '',
    flat: '',
    stage: ''
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    tower: false,
    floor: false,
    flat: false,
    stage: false
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDropdownToggle = (dropdown: keyof typeof openDropdowns) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const handleDropdownClose = (dropdown: keyof typeof openDropdowns) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdown]: false
    }));
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
    setOpenDropdowns({ tower: false, floor: false, flat: false, stage: false });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="tower-label" shrink>Tower</InputLabel>
            <MuiSelect
              labelId="tower-label"
              label="Tower"
              open={openDropdowns.tower}
              onOpen={() => handleDropdownToggle('tower')}
              onClose={() => handleDropdownClose('tower')}
              value={filters.tower}
              onChange={(e) => handleFilterChange('tower', e.target.value)}
              sx={{
                ...fieldStyles,
                '& .MuiSelect-icon': {
                  transform: openDropdowns.tower ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select Tower</em>
              </MenuItem>
              <MenuItem value="A">Tower A</MenuItem>
              <MenuItem value="B">Tower B</MenuItem>
              <MenuItem value="C">Tower C</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="floor-label" shrink>Floor</InputLabel>
            <MuiSelect
              labelId="floor-label"
              label="Floor"
              open={openDropdowns.floor}
              onOpen={() => handleDropdownToggle('floor')}
              onClose={() => handleDropdownClose('floor')}
              value={filters.floor}
              onChange={(e) => handleFilterChange('floor', e.target.value)}
              sx={{
                ...fieldStyles,
                '& .MuiSelect-icon': {
                  transform: openDropdowns.floor ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select Floor</em>
              </MenuItem>
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

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="flat-label" shrink>Flat</InputLabel>
            <MuiSelect
              labelId="flat-label"
              label="Flat"
              open={openDropdowns.flat}
              onOpen={() => handleDropdownToggle('flat')}
              onClose={() => handleDropdownClose('flat')}
              value={filters.flat}
              onChange={(e) => handleFilterChange('flat', e.target.value)}
              sx={{
                ...fieldStyles,
                '& .MuiSelect-icon': {
                  transform: openDropdowns.flat ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select Flat</em>
              </MenuItem>
              <MenuItem value="101">101</MenuItem>
              <MenuItem value="103">103</MenuItem>
              <MenuItem value="301">301</MenuItem>
              <MenuItem value="501">501</MenuItem>
              <MenuItem value="601">601</MenuItem>
              <MenuItem value="801">801</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="stage-label" shrink>Stage</InputLabel>
            <MuiSelect
              labelId="stage-label"
              label="Stage"
              open={openDropdowns.stage}
              onOpen={() => handleDropdownToggle('stage')}
              onClose={() => handleDropdownClose('stage')}
              value={filters.stage}
              onChange={(e) => handleFilterChange('stage', e.target.value)}
              sx={{
                ...fieldStyles,
                '& .MuiSelect-icon': {
                  transform: openDropdowns.stage ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select a stage</em>
              </MenuItem>
              <MenuItem value="Units Snagging">Units Snagging</MenuItem>
              <MenuItem value="Common Area Snagging">Common Area Snagging</MenuItem>
              <MenuItem value="Pre-handover Snagging">Pre-handover Snagging</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            onClick={handleApply}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
          >
            APPLY
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-8"
          >
            RESET
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
