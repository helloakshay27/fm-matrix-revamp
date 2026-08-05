import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl as MuiFormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';
import { X } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

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

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  currentFilters?: FilterState;
}

interface FilterState {
  surveyName: string;
  categoryId: string;
  checkType: string;
}

interface Category {
  id: number;
  name: string;
}

export const SurveyListFilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApplyFilters,
  onResetFilters,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterState>({
    surveyName: '',
    categoryId: 'all',
    checkType: 'all'
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories when modal opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Initialize filters with current applied filters when modal opens
  useEffect(() => {
    if (open) {
      if (currentFilters) {
        setFilters(currentFilters);
      } else {
        // Reset to default if no current filters
        setFilters({
          surveyName: '',
          categoryId: 'all',
          checkType: 'all'
        });
      }
    }
  }, [open, currentFilters]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await apiClient.get('/pms/admin/helpdesk_categories.json');
      console.log('Categories API response:', response.data);
      
      // Handle different response structures
      let categoriesData = [];
      if (Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response.data && Array.isArray(response.data.helpdesk_categories)) {
        categoriesData = response.data.helpdesk_categories;
      } else if (response.data && Array.isArray(response.data.categories)) {
        categoriesData = response.data.categories;
      }
      
      setCategories(categoriesData || []);
    } catch (error: any) {
      console.error('Error fetching ticket categories:', error);
      toast.error('Failed to fetch ticket categories');
      setCategories([]); // Ensure it's always an array
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleReset = () => {
    setFilters({
      surveyName: '',
      categoryId: 'all',
      checkType: 'all'
    });
    onResetFilters();
    toast.success('Filters reset successfully');
  };

  const handleApply = () => {
    onApplyFilters(filters);
    toast.success('Filters applied successfully');
    onClose();
  };

  const handleInputChange = (field: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="max-w-2xl min-h-[200px] bg-white overflow-visible"
        onPointerDownOutside={(e) => {
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
        <DialogHeader className="relative">
          <DialogTitle className="text-xl text-slate-950 font-normal">FILTER BY</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>
        
        <div className="py-4">
          {/* Survey Filter Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#C72030] mb-4">Question Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Survey Name Filter */}
              <div>
                <TextField
                  id="surveyName"
                  label="Title"
                  variant="outlined"
                  fullWidth
                  placeholder="Enter Title"
                  value={filters.surveyName}
                  onChange={(e) => handleInputChange('surveyName', e.target.value)}
                  sx={fieldStyles}
                />
              </div>

              {/* Category Filter */}
              <div>
                <MuiFormControl fullWidth variant="outlined">
                  <InputLabel id="filter-category-label">Ticket Category</InputLabel>
                  <MuiSelect
                    labelId="filter-category-label"
                    label="Ticket Category"
                    value={filters.categoryId}
                    onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    disabled={loadingCategories}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {Array.isArray(categories) && categories.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </MuiFormControl>
              </div>

              {/* Check Type Filter */}
              <div>
                <MuiFormControl fullWidth variant="outlined">
                  <InputLabel id="filter-check-type-label">Check Type</InputLabel>
                  <MuiSelect
                    labelId="filter-check-type-label"
                    label="Check Type"
                    value={filters.checkType}
                    onChange={(e) => handleInputChange('checkType', e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="patrolling">Patrolling</MenuItem>
                    <MenuItem value="survey">Survey</MenuItem>
                  </MuiSelect>
                </MuiFormControl>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button 
            onClick={handleReset} 
            variant="outline" 
            className="fm-button-fix px-8"
          >
            Reset
          </Button>
          <Button 
            onClick={handleApply} 
            variant="ghost"
            className="fm-button-fix fm-button-brand px-8"
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
