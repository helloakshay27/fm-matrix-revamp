import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Chip, OutlinedInput, SelectChangeEvent, CircularProgress } from '@mui/material';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  ticketManagementAPI, 
  TicketFilters, 
  CategoryOption, 
  SubcategoryOption, 
  DepartmentOption, 
  SiteOption, 
  UnitOption, 
  StatusOption, 
  UserOption 
} from '@/services/ticketManagementAPI';

interface TicketsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: TicketFilters) => void;
}

interface FilterDialogState {
  loading: {
    categories: boolean;
    subcategories: boolean;
    departments: boolean;
    sites: boolean;
    units: boolean;
    statuses: boolean;
    users: boolean;
  };
  data: {
    categories: CategoryOption[];
    subcategories: SubcategoryOption[];
    departments: DepartmentOption[];
    sites: SiteOption[];
    units: UnitOption[];
    statuses: StatusOption[];
    users: UserOption[];
  };
  errors: Record<string, string | null>;
}

const priorityOptions = [
  { value: 'p1', label: 'P1 - Critical' },
  { value: 'p2', label: 'P2 - Very High' },
  { value: 'p3', label: 'P3 - High' },
  { value: 'p4', label: 'P4 - Medium' },
  { value: 'p5', label: 'P5 - Low' }
];

export const TicketsFilterDialog = ({ isOpen, onClose, onApplyFilters }: TicketsFilterDialogProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<TicketFilters>({
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

  const [state, setState] = useState<FilterDialogState>({
    loading: {
      categories: false,
      subcategories: false,
      departments: false,
      sites: false,
      units: false,
      statuses: false,
      users: false,
    },
    data: {
      categories: [],
      subcategories: [],
      departments: [],
      sites: [],
      units: [],
      statuses: [],
      users: [],
    },
    errors: {},
  });

  // Filtered subcategories based on selected category
  const filteredSubcategories = useMemo(() => {
    if (!filters.category_type_id_eq) {
      return state.data.subcategories;
    }
    return state.data.subcategories.filter(sub => sub.category_id === filters.category_type_id_eq);
  }, [state.data.subcategories, filters.category_type_id_eq]);

  // Load initial data when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    const loadingUpdates = {
      categories: true,
      departments: true,
      sites: true,
      units: true,
      statuses: true,
      users: true,
    };

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, ...loadingUpdates },
      errors: {},
    }));

    try {
      const [categories, subcategories, departments, sites, units, statuses, users] = await Promise.allSettled([
        ticketManagementAPI.getHelpdeskCategories(),
        ticketManagementAPI.getHelpdeskSubcategories(),
        ticketManagementAPI.getDepartments(),
        ticketManagementAPI.getAllSites(),
        ticketManagementAPI.getUnits(),
        ticketManagementAPI.getComplaintStatuses(),
        ticketManagementAPI.getFMUsers(),
      ]);

      setState(prev => ({
        ...prev,
        loading: {
          categories: false,
          subcategories: false,
          departments: false,
          sites: false,
          units: false,
          statuses: false,
          users: false,
        },
        data: {
          categories: categories.status === 'fulfilled' ? categories.value : [],
          subcategories: subcategories.status === 'fulfilled' ? subcategories.value : [],
          departments: departments.status === 'fulfilled' ? departments.value : [],
          sites: sites.status === 'fulfilled' ? sites.value : [],
          units: units.status === 'fulfilled' ? units.value : [],
          statuses: statuses.status === 'fulfilled' ? statuses.value : [],
          users: users.status === 'fulfilled' ? users.value : [],
        },
        errors: {
          categories: categories.status === 'rejected' ? 'Failed to load categories' : null,
          subcategories: subcategories.status === 'rejected' ? 'Failed to load subcategories' : null,
          departments: departments.status === 'rejected' ? 'Failed to load departments' : null,
          sites: sites.status === 'rejected' ? 'Failed to load sites' : null,
          units: units.status === 'rejected' ? 'Failed to load units' : null,
          statuses: statuses.status === 'rejected' ? 'Failed to load statuses' : null,
          users: users.status === 'rejected' ? 'Failed to load users' : null,
        },
      }));

      // Show error toast if any API calls failed
      const failedCalls = [categories, subcategories, departments, sites, units, statuses, users]
        .filter(result => result.status === 'rejected');
      
      if (failedCalls.length > 0) {
        toast({
          title: "Warning",
          description: `Failed to load some filter options. Some dropdowns may be empty.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading filter data:', error);
      toast({
        title: "Error",
        description: "Failed to load filter options. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (key: keyof TicketFilters, value: any) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // Clear subcategory when category changes
      if (key === 'category_type_id_eq') {
        newFilters.sub_category_id_eq = undefined;
      }
      
      return newFilters;
    });
  };

  const handleMultiSelectChange = (key: keyof TicketFilters, event: SelectChangeEvent<number[]>) => {
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
    } else if (newRange[0] || newRange[1]) {
      // Keep partial date range
      setFilters(prev => ({
        ...prev,
        date_range: `${newRange[0] || ''}+-+${newRange[1] || ''}`
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        date_range: ''
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
        (acc as any)[key] = value;
      }
      return acc;
    }, {} as TicketFilters);

    console.log('Applying filters:', cleanFilters);
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

  const getUserNameById = (id: number): string => {
    const user = state.data.users.find(u => u.id === id);
    return user ? user.name : `User ${id}`;
  };

  const getStatusNameById = (id: number): string => {
    const status = state.data.statuses.find(s => s.id === id);
    return status ? status.name : `Status ${id}`;
  };

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
            <FormControl fullWidth variant="outlined" disabled={state.loading.categories}>
              <InputLabel id="category-select-label" shrink>Category</InputLabel>
              <MuiSelect
                labelId="category-select-label"
                label="Category"
                displayEmpty
                value={filters.category_type_id_eq || ''}
                onChange={(e) => handleFilterChange('category_type_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
                startAdornment={state.loading.categories ? <CircularProgress size={20} /> : undefined}
              >
                <MenuItem value=""><em>Select Category</em></MenuItem>
                {state.data.categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" disabled={state.loading.subcategories}>
              <InputLabel id="subcategory-select-label" shrink>Sub Category</InputLabel>
              <MuiSelect
                labelId="subcategory-select-label"
                label="Sub Category"
                displayEmpty
                value={filters.sub_category_id_eq || ''}
                onChange={(e) => handleFilterChange('sub_category_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
                startAdornment={state.loading.subcategories ? <CircularProgress size={20} /> : undefined}
                disabled={!filters.category_type_id_eq}
              >
                <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                {filteredSubcategories.map((subcategory) => (
                  <MenuItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" disabled={state.loading.departments}>
              <InputLabel id="department-select-label" shrink>Department</InputLabel>
              <MuiSelect
                labelId="department-select-label"
                label="Department"
                displayEmpty
                value={filters.dept_id_eq || ''}
                onChange={(e) => handleFilterChange('dept_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
                startAdornment={state.loading.departments ? <CircularProgress size={20} /> : undefined}
              >
                <MenuItem value=""><em>Select Department</em></MenuItem>
                {state.data.departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.department_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" disabled={state.loading.sites}>
              <InputLabel id="site-select-label" shrink>Site</InputLabel>
              <MuiSelect
                labelId="site-select-label"
                label="Site"
                displayEmpty
                value={filters.site_id_eq || ''}
                onChange={(e) => handleFilterChange('site_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
                startAdornment={state.loading.sites ? <CircularProgress size={20} /> : undefined}
              >
                <MenuItem value=""><em>Select Site</em></MenuItem>
                {state.data.sites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.site_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          {/* Row 3 */}
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" disabled={state.loading.units}>
              <InputLabel id="unit-select-label" shrink>Unit</InputLabel>
              <MuiSelect
                labelId="unit-select-label"
                label="Unit"
                displayEmpty
                value={filters.unit_id_eq || ''}
                onChange={(e) => handleFilterChange('unit_id_eq', e.target.value ? Number(e.target.value) : undefined)}
                sx={fieldStyles}
                startAdornment={state.loading.units ? <CircularProgress size={20} /> : undefined}
              >
                <MenuItem value=""><em>Select Unit</em></MenuItem>
                {state.data.units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" disabled={state.loading.statuses}>
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
                      <Chip key={value} label={getStatusNameById(value)} size="small" />
                    ))}
                  </div>
                )}
                sx={fieldStyles}
                startAdornment={state.loading.statuses ? <CircularProgress size={20} /> : undefined}
              >
                {state.data.statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
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
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
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
            <FormControl fullWidth variant="outlined" disabled={state.loading.users}>
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
                      <Chip key={value} label={getUserNameById(value)} size="small" />
                    ))}
                  </div>
                )}
                sx={fieldStyles}
                startAdornment={state.loading.users ? <CircularProgress size={20} /> : undefined}
              >
                {state.data.users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
            disabled={Object.values(state.loading).some(loading => loading)}
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
