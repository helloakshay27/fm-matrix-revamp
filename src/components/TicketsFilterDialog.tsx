import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FilterData {
  createdDate: string;
  category: string;
  subcategory: string;
  department: string;
  site: string;
  unit: string;
  status: string;
  adminPriority: string;
  createdBy: string;
  assignedTo: string;
}

interface TicketsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterData) => void;
}

export const TicketsFilterDialog = ({ isOpen, onClose, onApplyFilters }: TicketsFilterDialogProps) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterData>({
    createdDate: '',
    category: '',
    subcategory: '',
    department: '',
    site: '',
    unit: '',
    status: '',
    adminPriority: '',
    createdBy: '',
    assignedTo: ''
  });

  const handleFilterChange = (key: keyof FilterData, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setFilters({
      createdDate: '',
      category: '',
      subcategory: '',
      department: '',
      site: '',
      unit: '',
      status: '',
      adminPriority: '',
      createdBy: '',
      assignedTo: ''
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onClose();
  };

  // Responsive styles for TextField and Select
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
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
          {/* Row 1 */}
          <div className="space-y-2">
            <TextField
              label="Created Date"
              type="date"
              value={filters.createdDate}
              onChange={(e) => handleFilterChange('createdDate', e.target.value)}
              placeholder="Select Created Date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                sx: fieldStyles
              }}
            />
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-select-label" shrink>Category</InputLabel>
              <MuiSelect
                labelId="category-select-label"
                label="Category"
                displayEmpty
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Category Type</em></MenuItem>
                <MenuItem value="air-conditioner">Air Conditioner</MenuItem>
                <MenuItem value="fire-system">FIRE SYSTEM</MenuItem>
                <MenuItem value="cleaning">Cleaning</MenuItem>
                <MenuItem value="electrical">Electrical</MenuItem>
                <MenuItem value="printer">Printer</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="subcategory-select-label" shrink>Subcategory</InputLabel>
              <MuiSelect
                labelId="subcategory-select-label"
                label="Subcategory"
                displayEmpty
                value={filters.subcategory}
                onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select SubCategory</em></MenuItem>
                <MenuItem value="test">test</MenuItem>
                <MenuItem value="na">NA</MenuItem>
                <MenuItem value="fire">fire</MenuItem>
                <MenuItem value="dentry">dentry</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="department-select-label" shrink>Department</InputLabel>
              <MuiSelect
                labelId="department-select-label"
                label="Department"
                displayEmpty
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Department</em></MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="facility">Facility</MenuItem>
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
                value={filters.site}
                onChange={(e) => handleFilterChange('site', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Site</em></MenuItem>
                <MenuItem value="lockated">Lockated</MenuItem>
                <MenuItem value="mumbai">Mumbai</MenuItem>
                <MenuItem value="pune">Pune</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="unit-select-label" shrink>Unit</InputLabel>
              <MuiSelect
                labelId="unit-select-label"
                label="Unit"
                displayEmpty
                value={filters.unit}
                onChange={(e) => handleFilterChange('unit', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Unit</em></MenuItem>
                <MenuItem value="unit1">Unit 1</MenuItem>
                <MenuItem value="unit2">Unit 2</MenuItem>
                <MenuItem value="unit3">Unit 3</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          {/* Row 3 */}
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-select-label" shrink>Status</InputLabel>
              <MuiSelect
                labelId="status-select-label"
                label="Status"
                displayEmpty
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Status</em></MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl fullWidth variant="outlined">
              <InputLabel id="admin-priority-select-label" shrink>Admin Priority</InputLabel>
              <MuiSelect
                labelId="admin-priority-select-label"
                label="Admin Priority"
                displayEmpty
                value={filters.adminPriority}
                onChange={(e) => handleFilterChange('adminPriority', e.target.value)}
                sx={fieldStyles}
              >
                <MenuItem value=""><em>Select Admin Priority</em></MenuItem>
                <MenuItem value="p1">P1</MenuItem>
                <MenuItem value="p2">P2</MenuItem>
                <MenuItem value="p3">P3</MenuItem>
                <MenuItem value="p4">P4</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>

          <div className="space-y-2">
            <TextField
              label="Created By"
              placeholder="Enter Created By"
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                sx: fieldStyles
              }}
            />
          </div>

          {/* Row 4 */}
          <div className="space-y-2">
            <TextField
              label="Assigned To"
              placeholder="Enter Assigned To"
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                sx: fieldStyles
              }}
            />
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