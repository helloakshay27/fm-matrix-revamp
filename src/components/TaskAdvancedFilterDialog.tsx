import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

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
  onApply: (filters: Filters & { dateFrom: string; dateTo: string; searchTaskId: string; searchChecklist: string }) => void;
  dateFrom?: string;
  dateTo?: string;
  searchTaskId?: string;
  searchChecklist?: string;
}

export const TaskAdvancedFilterDialog: React.FC<TaskAdvancedFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
  dateFrom = '',
  dateTo = '',
  searchTaskId = '',
  searchChecklist = ''
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
  
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  const [localDateTo, setLocalDateTo] = useState(dateTo);
  const [localSearchTaskId, setLocalSearchTaskId] = useState(searchTaskId);
  const [localSearchChecklist, setLocalSearchChecklist] = useState(searchChecklist);

  const handleApply = () => {
    const allFilters = {
      ...filters,
      dateFrom: localDateFrom,
      dateTo: localDateTo,
      searchTaskId: localSearchTaskId,
      searchChecklist: localSearchChecklist
    };
    console.log('Applying Advanced filters:', allFilters);
    onApply(allFilters);
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
        <DialogHeader className="relative">
          <DialogTitle className="text-lg font-semibold">Advanced Filter</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Date Range and Search Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TextField
                label="Date From"
                type="date"
                value={localDateFrom ? localDateFrom.split('/').reverse().join('-') : ''}
                onChange={(e) => setLocalDateFrom(e.target.value.split('-').reverse().join('/'))}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 1 }}
              />
            </div>
            <div>
              <TextField
                label="Date To"
                type="date"
                value={localDateTo ? localDateTo.split('/').reverse().join('-') : ''}
                onChange={(e) => setLocalDateTo(e.target.value.split('-').reverse().join('/'))}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 1 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <TextField
                label="Search Task ID"
                placeholder="Enter Task ID"
                value={localSearchTaskId}
                onChange={(e) => setLocalSearchTaskId(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 1 }}
              />
            </div>
            <div>
              <TextField
                label="Search Checklist"
                placeholder="Enter checklist name or assigned to"
                value={localSearchChecklist}
                onChange={(e) => setLocalSearchChecklist(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ mt: 1 }}
              />
            </div>
          </div>

          {/* Filter Options */}
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
