import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { useToast } from '@/hooks/use-toast';

interface Filters {
  type: string;
  scheduleType: string;
  scheduleFor: string;
  group: string;
  subGroup: string;
  assignedTo: string;
  supplier: string;
}

interface TaskAdvancedFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: Filters) => void;
}

export const TaskAdvancedFilterDialog: React.FC<TaskAdvancedFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    type: '',
    scheduleType: '',
    scheduleFor: '',
    group: '',
    subGroup: '',
    assignedTo: '',
    supplier: ''
  });

  const handleApply = () => {
    console.log('Applying Advanced filters:', filters);
    onApply(filters);
    toast({
      title: 'Success',
      description: 'Filters applied successfully!',
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      type: '',
      scheduleType: '',
      scheduleFor: '',
      group: '',
      subGroup: '',
      assignedTo: '',
      supplier: ''
    });
  };

  const handleSelectChange = (field: keyof Filters) => (event: SelectChangeEvent<string>) => {
    setFilters({ ...filters, [field]: event.target.value });
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Advanced Filter</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="type-select-label" shrink>Type</InputLabel>
                <MuiSelect
                  labelId="type-select-label"
                  label="Type"
                  value={filters.type}
                  onChange={handleSelectChange('type')}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Type</em></MenuItem>
                  <MenuItem value="ppm">PPM</MenuItem>
                  <MenuItem value="breakdown">Breakdown</MenuItem>
                  <MenuItem value="preventive">Preventive</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
            
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="schedule-type-select-label" shrink>Schedule Type</InputLabel>
                <MuiSelect
                  labelId="schedule-type-select-label"
                  label="Schedule Type"
                  value={filters.scheduleType}
                  onChange={handleSelectChange('scheduleType')}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Schedule Type</em></MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TextField
                label="Schedule For"
                placeholder="Enter Schedule For"
                value={filters.scheduleFor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilters({ ...filters, scheduleFor: e.target.value })}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                sx={{ mt: 1 }}
              />
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="group-select-label" shrink>Group</InputLabel>
                <MuiSelect
                  labelId="group-select-label"
                  label="Group"
                  value={filters.group}
                  onChange={handleSelectChange('group')}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Group</em></MenuItem>
                  <MenuItem value="cleaning">Cleaning</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="sub-group-select-label" shrink>Sub Group</InputLabel>
                <MuiSelect
                  labelId="sub-group-select-label"
                  label="Sub Group"
                  value={filters.subGroup}
                  onChange={handleSelectChange('subGroup')}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                  <MenuItem value="washroom">Washroom</MenuItem>
                  <MenuItem value="lobby">Lobby</MenuItem>
                  <MenuItem value="lift">Lift</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="assigned-to-select-label" shrink>Assigned To</InputLabel>
                <MuiSelect
                  labelId="assigned-to-select-label"
                  label="Assigned To"
                  value={filters.assignedTo}
                  onChange={handleSelectChange('assignedTo')}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Assigned To</em></MenuItem>
                  <MenuItem value="vinayak-mane">Vinayak Mane</MenuItem>
                  <MenuItem value="john-doe">John Doe</MenuItem>
                  <MenuItem value="jane-smith">Jane Smith</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Fourth Row */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="supplier-select-label" shrink>Supplier</InputLabel>
                <MuiSelect
                  labelId="supplier-select-label"
                  label="Supplier"
                  value={filters.supplier}
                  onChange={handleSelectChange('supplier')}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Supplier</em></MenuItem>
                  <MenuItem value="supplier-1">Supplier 1</MenuItem>
                  <MenuItem value="supplier-2">Supplier 2</MenuItem>
                  <MenuItem value="supplier-3">Supplier 3</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-8"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};