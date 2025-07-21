
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Chip, OutlinedInput, SelectChangeEvent } from '@mui/material';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FilterData {
  date_range?: string;
  category_type_id_eq?: number;
  sub_category_id_eq?: number;
  dept_id_eq?: number;
  site_id_eq?: number;
  unit_id_eq?: number;
  issue_status_in?: number[];
  priority_eq?: string;
  user_firstname_or_user_lastname_cont?: string;
  assigned_to_in?: number[];
}

interface TicketsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
}

export const TicketsFilterDialog = ({ isOpen, onClose, onApplyFilters }: TicketsFilterDialogProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterData>({
    date_range: '',
    category_type_id_eq: undefined,
    sub_category_id_eq: undefined,
    dept_id_eq: undefined,
    site_id_eq: undefined,
    unit_id_eq: undefined,
    issue_status_in: [],
    priority_eq: '',
    user_firstname_or_user_lastname_cont: '',
    assigned_to_in: []
  });

  const handleFilterChange = (key: keyof FilterData, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMultiSelectChange = (key: keyof FilterData, event: SelectChangeEvent<number[]>) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      [key]: typeof value === 'string' ? value.split(',').map(Number) : value
    }));
  };

  const handleDateRangeChange = (type: 'from' | 'to', value: string) => {
    const currentRange = filters.date_range?.split('+-+') || ['', ''];
    const newRange = type === 'from' 
      ? [value, currentRange[1]] 
      : [currentRange[0], value];
    
    if (newRange[0] && newRange[1]) {
      setFilters(prev => ({
        ...prev,
        date_range: `${newRange[0]}+-+${newRange[1]}`
      }));
    }
  };

  const handleReset = () => {
    setFilters({
      date_range: '',
      category_type_id_eq: undefined,
      sub_category_id_eq: undefined,
      dept_id_eq: undefined,
      site_id_eq: undefined,
      unit_id_eq: undefined,
      issue_status_in: [],
      priority_eq: '',
      user_firstname_or_user_lastname_cont: '',
      assigned_to_in: []
    });
  };

  const handleApply = () => {
    // Clean up empty filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '' && 
          !(Array.isArray(value) && value.length === 0)) {
        acc[key as keyof FilterData] = value;
      }
      return acc;
    }, {} as FilterData);

    onApplyFilters(cleanFilters);
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const currentRange = filters.date_range?.split('+-+') || ['', ''];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">FILTER BY</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          {/* Row 1 - Date Range */}
          <div className="space-y-2">
            <TextField
              label="Date From"
              type="date"
              value={currentRange[0] || ''}
              onChange={(e) => handleDateRangeChange('from', e.target.value)}
              placeholder="Select From Date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          <div className="space-y-2">
            <TextField
              label="Date To"
              type="date"
              value={currentRange[1] || ''}
              onChange={(e) => handleDateRangeChange('to', e.target.value)}
              placeholder="Select To Date"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-select-label" shrink>Category</InputLabel>
              <MuiSelect
                labelId="category-select-label"
                label="Category"
                displayEmpty
                value={filters.category_type_id_eq || ''}
                onChange={(e) => handleFilterChange('category_type_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Category</em></MenuItem>
                <MenuItem value={682}>Air Conditioner</MenuItem>
                <MenuItem value={683}>FIRE SYSTEM</MenuItem>
                <MenuItem value={684}>Cleaning</MenuItem>
                <MenuItem value={685}>Electrical</MenuItem>
                <MenuItem value={686}>Printer</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="subcategory-select-label" shrink>Sub Category</InputLabel>
              <MuiSelect
                labelId="subcategory-select-label"
                label="Sub Category"
                displayEmpty
                value={filters.sub_category_id_eq || ''}
                onChange={(e) => handleFilterChange('sub_category_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                <MenuItem value={746}>Test</MenuItem>
                <MenuItem value={747}>NA</MenuItem>
                <MenuItem value={748}>Fire</MenuItem>
                <MenuItem value={749}>Dentry</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="department-select-label" shrink>Department</InputLabel>
              <MuiSelect
                labelId="department-select-label"
                label="Department"
                displayEmpty
                value={filters.dept_id_eq || ''}
                onChange={(e) => handleFilterChange('dept_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Department</em></MenuItem>
                <MenuItem value={3}>Technician</MenuItem>
                <MenuItem value={4}>Maintenance</MenuItem>
                <MenuItem value={5}>Facility</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="site-select-label" shrink>Site</InputLabel>
              <MuiSelect
                labelId="site-select-label"
                label="Site"
                displayEmpty
                value={filters.site_id_eq || ''}
                onChange={(e) => handleFilterChange('site_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Site</em></MenuItem>
                <MenuItem value={7}>Lockated</MenuItem>
                <MenuItem value={8}>Mumbai</MenuItem>
                <MenuItem value={9}>Pune</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Row 3 */}
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="unit-select-label" shrink>Unit</InputLabel>
              <MuiSelect
                labelId="unit-select-label"
                label="Unit"
                displayEmpty
                value={filters.unit_id_eq || ''}
                onChange={(e) => handleFilterChange('unit_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Unit</em></MenuItem>
                <MenuItem value={46}>Unit 1</MenuItem>
                <MenuItem value={47}>Unit 2</MenuItem>
                <MenuItem value={48}>Unit 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-select-label" shrink>Status</InputLabel>
              <MuiSelect
                labelId="status-select-label"
                label="Status"
                multiple
                displayEmpty
                value={filters.issue_status_in || []}
                onChange={handleMultiSelectChange.bind(null, 'issue_status_in')}
                input={<OutlinedInput label="Status" />}
                renderValue={(selected) => (
                  <div className="flex flex-wrap gap-1">
                    {(selected as number[]).map((value) => (
                      <Chip key={value} label={value === 323 ? 'Pending' : value === 325 ? 'Open' : value === 326 ? 'Closed' : value} size="small" />
                    ))}
                  </div>
                )}
                sx={fieldStyles}
              >
                <MenuItem value={323}>Pending</MenuItem>
                <MenuItem value={325}>Open</MenuItem>
                <MenuItem value={326}>Closed</MenuItem>
                <MenuItem value={327}>In Progress</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="priority-select-label" shrink>Priority</InputLabel>
              <MuiSelect
                labelId="priority-select-label"
                label="Priority"
                displayEmpty
                value={filters.priority_eq || ''}
                onChange={(e) => handleFilterChange('priority_eq', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Priority</em></MenuItem>
                <MenuItem value="p1">P1</MenuItem>
                <MenuItem value="p2">P2</MenuItem>
                <MenuItem value="p3">P3</MenuItem>
                <MenuItem value="p4">P4</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Row 4 */}
          <div className="space-y-2">
            <TextField
              label="Created By"
              placeholder="Enter Created By Name"
              value={filters.user_firstname_or_user_lastname_cont || ''}
              onChange={(e) => handleFilterChange('user_firstname_or_user_lastname_cont', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="assigned-to-select-label" shrink>Assigned To</InputLabel>
              <MuiSelect
                labelId="assigned-to-select-label"
                label="Assigned To"
                multiple
                displayEmpty
                value={filters.assigned_to_in || []}
                onChange={handleMultiSelectChange.bind(null, 'assigned_to_in')}
                input={<OutlinedInput label="Assigned To" />}
                renderValue={(selected) => (
                  <div className="flex flex-wrap gap-1">
                    {(selected as number[]).map((value) => (
                      <Chip key={value} label={value === 35905 ? 'John Doe' : value === 35948 ? 'Jane Smith' : value} size="small" />
                    ))}
                  </div>
                )}
                sx={fieldStyles}
              >
                <MenuItem value={35905}>John Doe</MenuItem>
                <MenuItem value={35948}>Jane Smith</MenuItem>
                <MenuItem value={35949}>Mike Johnson</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
          >
            Apply
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="px-8"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
