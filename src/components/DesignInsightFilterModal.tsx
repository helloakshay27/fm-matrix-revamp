import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextField,
} from '@mui/material';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface DesignInsightFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

interface FilterState {
  dateRange: string;
  zone: string;
  category: string;
  subCategory: string;
  mustHave: string;
  createdBy: string;
}

const emptyFilters: FilterState = {
  dateRange: '',
  zone: '',
  category: '',
  subCategory: '',
  mustHave: '',
  createdBy: '',
};

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    '& fieldset': { borderColor: '#e5e7eb' },
    '&:hover fieldset': { borderColor: '#C72030' },
    '&.Mui-focused fieldset': { borderColor: '#C72030' },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#C72030',
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const DesignInsightFilterModal: React.FC<DesignInsightFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const zoneSuggestions = ['Mumbai', 'NCR', 'Bangalore', 'Chennai', 'Delhi'];
  const categorySuggestions = [
    'Landscape',
    'Façade',
    'Security & surveillance',
    'Inside Units',
    'Electrical',
    'Plumbing',
  ];
  const subCategorySuggestions = [
    'Access Control',
    'CCTV',
    'Bedroom',
    'Entry-Exit',
    'Kitchen',
    'Bathroom',
  ];
  const createdBySuggestions = [
    'Sony Bhosle',
    'Robert Day2',
    'Sanket Patil',
    'Devesh Jain',
    'Admin User',
  ];

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    const hasActiveFilters = Object.values(filters).some((value) => value !== '');

    if (!hasActiveFilters) {
      toast({
        title: 'No filters selected',
        description: 'Please select at least one filter to apply.',
        variant: 'destructive',
      });
      return;
    }

    if (onApplyFilters) {
      onApplyFilters(filters);
    }

    toast({
      title: 'Success',
      description: 'Filters applied successfully!',
    });

    onClose();
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    toast({
      title: 'Filters Reset',
      description: 'All filters have been cleared.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="max-w-2xl bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              '.MuiPopover-root, .MuiModal-root, .MuiMenu-root'
            )
          ) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              '.MuiPopover-root, .MuiModal-root, .MuiMenu-root'
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Filter Design Insights</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <TextField
            label="Date Range"
            type="date"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel id="zone-label">Zone</InputLabel>
            <MuiSelect
              labelId="zone-label"
              label="Zone"
              value={filters.zone}
              onChange={(e) => handleFilterChange('zone', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Zone</em>
              </MenuItem>
              {zoneSuggestions.map((zone) => (
                <MenuItem key={zone} value={zone.toLowerCase()}>
                  {zone}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-label">Category</InputLabel>
            <MuiSelect
              labelId="category-label"
              label="Category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Category</em>
              </MenuItem>
              {categorySuggestions.map((category) => (
                <MenuItem key={category} value={category.toLowerCase()}>
                  {category}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="subCategory-label">Sub-category</InputLabel>
            <MuiSelect
              labelId="subCategory-label"
              label="Sub-category"
              value={filters.subCategory}
              onChange={(e) => handleFilterChange('subCategory', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select Sub Category</em>
              </MenuItem>
              {subCategorySuggestions.map((subCategory) => (
                <MenuItem key={subCategory} value={subCategory.toLowerCase()}>
                  {subCategory}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="mustHave-label">Must have</InputLabel>
            <MuiSelect
              labelId="mustHave-label"
              label="Must have"
              value={filters.mustHave}
              onChange={(e) => handleFilterChange('mustHave', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="createdBy-label">Created by</InputLabel>
            <MuiSelect
              labelId="createdBy-label"
              label="Created by"
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {createdBySuggestions.map((creator) => (
                <MenuItem key={creator} value={creator.toLowerCase()}>
                  {creator}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6 border-[#C72030] text-[#C72030] hover:bg-[#EDEAE3]"
          >
            Reset
          </Button>
          <Button
            className="bg-brand hover:bg-brand-hover text-white px-8"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
