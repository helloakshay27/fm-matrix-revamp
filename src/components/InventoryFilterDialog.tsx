import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { useToast } from '@/hooks/use-toast';

interface InventoryFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

export const InventoryFilterDialog: React.FC<InventoryFilterDialogProps> = ({
  open,
  onOpenChange,
  onApply,
}) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    name: '',
    code: '',
    category: '',
    criticality: '',
    inventoryType: ''
  });

  const handleApply = () => {
    console.log('Applying Inventory filters:', filters);
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    });
    onApply(filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      code: '',
      category: '',
      criticality: '',
      inventoryType: ''
    });
  };

  const handleExport = () => {
    console.log('Exporting with filters:', filters);
    toast({
      title: "Success",
      description: "Export functionality executed with current filters",
    });
  };

  // Responsive styles for TextField and Select
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
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TextField
                label="Name"
                placeholder="Enter Name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
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
            
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="category-select-label" shrink>Category</InputLabel>
                <MuiSelect
                  labelId="category-select-label"
                  label="Category"
                  displayEmpty
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="consumable">Consumable</MenuItem>
                  <MenuItem value="equipment">Equipment</MenuItem>
                  <MenuItem value="furniture">Furniture</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TextField
                label="Code"
                placeholder="Find Code"
                value={filters.code}
                onChange={(e) => setFilters({ ...filters, code: e.target.value })}
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

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="criticality-select-label" shrink>Criticality</InputLabel>
                <MuiSelect
                  labelId="criticality-select-label"
                  label="Criticality"
                  displayEmpty
                  value={filters.criticality}
                  onChange={(e) => setFilters({ ...filters, criticality: e.target.value })}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Criticality</em></MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="non-critical">Non-Critical</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="inventory-type-select-label" shrink>Inventory Type</InputLabel>
                <MuiSelect
                  labelId="inventory-type-select-label"
                  label="Inventory Type"
                  displayEmpty
                  value={filters.inventoryType}
                  onChange={(e) => setFilters({ ...filters, inventoryType: e.target.value })}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Inventory Type</em></MenuItem>
                  <MenuItem value="asset">Asset</MenuItem>
                  <MenuItem value="consumable">Consumable</MenuItem>
                  <MenuItem value="spare-part">Spare Part</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleExport}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-6"
          >
            Export
          </Button>
          <Button 
            onClick={handleApply}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90 px-6"
          >
            Apply
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="px-6"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};