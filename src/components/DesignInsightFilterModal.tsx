
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

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

export const DesignInsightFilterModal: React.FC<DesignInsightFilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilters 
}) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterState>({
    dateRange: '',
    zone: '',
    category: '',
    subCategory: '',
    mustHave: '',
    createdBy: ''
  });

  // Sample data for suggestions - in real app this would come from API/props
  const zoneSuggestions = ['Mumbai', 'NCR', 'Bangalore', 'Chennai', 'Delhi'];
  const categorySuggestions = ['Landscape', 'Façade', 'Security & surveillance', 'Inside Units', 'Electrical', 'Plumbing'];
  const subCategorySuggestions = ['Access Control', 'CCTV', 'Bedroom', 'Entry-Exit', 'Kitchen', 'Bathroom'];
  const createdBySuggestions = ['Sony Bhosle', 'Robert Day2', 'Sanket Patil', 'Devesh Jain', 'Admin User'];

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    
    // Check if any filters are selected
    const hasActiveFilters = Object.values(filters).some(value => value !== '');
    
    if (!hasActiveFilters) {
      toast({
        title: "No filters selected",
        description: "Please select at least one filter to apply.",
        variant: "destructive"
      });
      return;
    }

    // Call the callback function to apply filters
    if (onApplyFilters) {
      onApplyFilters(filters);
    }

    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: '',
      zone: '',
      category: '',
      subCategory: '',
      mustHave: '',
      createdBy: ''
    });
    
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared.",
    });
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filter Design Insights</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          <TextField
            label="Date Range"
            placeholder="Select Date Range"
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="zone-label" shrink>Zone</InputLabel>
            <MuiSelect
              labelId="zone-label"
              label="Zone"
              displayEmpty
              value={filters.zone}
              onChange={(e) => handleFilterChange('zone', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Zone</em></MenuItem>
              {zoneSuggestions.map((zone) => (
                <MenuItem key={zone} value={zone.toLowerCase()}>{zone}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="category-label" shrink>Category</InputLabel>
            <MuiSelect
              labelId="category-label"
              label="Category"
              displayEmpty
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Category</em></MenuItem>
              {categorySuggestions.map((category) => (
                <MenuItem key={category} value={category.toLowerCase()}>{category}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="sub-category-label" shrink>Sub-category</InputLabel>
            <MuiSelect
              labelId="sub-category-label"
              label="Sub-category"
              displayEmpty
              value={filters.subCategory}
              onChange={(e) => handleFilterChange('subCategory', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select Sub Category</em></MenuItem>
              {subCategorySuggestions.map((subCategory) => (
                <MenuItem key={subCategory} value={subCategory.toLowerCase()}>{subCategory}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="must-have-label" shrink>Must have</InputLabel>
            <MuiSelect
              labelId="must-have-label"
              label="Must have"
              displayEmpty
              value={filters.mustHave}
              onChange={(e) => handleFilterChange('mustHave', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </MuiSelect>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="created-by-label" shrink>Created by</InputLabel>
            <MuiSelect
              labelId="created-by-label"
              label="Created by"
              displayEmpty
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select</em></MenuItem>
              {createdBySuggestions.map((creator) => (
                <MenuItem key={creator} value={creator.toLowerCase()}>{creator}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline"
            onClick={handleReset}
            className="px-6"
          >
            Reset
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
