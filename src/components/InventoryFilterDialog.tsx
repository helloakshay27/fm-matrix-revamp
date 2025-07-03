import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
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
    inventoryType: '',
  });

  const handleApply = () => {
    toast({
      title: 'Success',
      description: 'Filters applied successfully!',
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
      inventoryType: '',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Success',
      description: 'Export functionality executed with current filters',
    });
  };

  // Consistent field styling
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl overflow-visible">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Name"
              placeholder="Enter Name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <FormControl fullWidth>
              <InputLabel id="category-label" shrink>
                Category
              </InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                value={filters.category}
                displayEmpty
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="consumable">Consumable</MenuItem>
                <MenuItem value="equipment">Equipment</MenuItem>
                <MenuItem value="furniture">Furniture</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Code"
              placeholder="Find Code"
              value={filters.code}
              onChange={(e) => setFilters({ ...filters, code: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
            />

            <FormControl fullWidth>
              <InputLabel id="criticality-label" shrink>
                Criticality
              </InputLabel>
              <Select
                labelId="criticality-label"
                label="Criticality"
                value={filters.criticality}
                displayEmpty
                onChange={(e) =>
                  setFilters({ ...filters, criticality: e.target.value })
                }
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Criticality</em>
                </MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
                <MenuItem value="non-critical">Non-Critical</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel id="inventory-type-label" shrink>
                Inventory Type
              </InputLabel>
              <Select
                labelId="inventory-type-label"
                label="Inventory Type"
                value={filters.inventoryType}
                displayEmpty
                onChange={(e) =>
                  setFilters({ ...filters, inventoryType: e.target.value })
                }
                sx={fieldStyles}
              >
                <MenuItem value="">
                  <em>Select Inventory Type</em>
                </MenuItem>
                <MenuItem value="asset">Asset</MenuItem>
                <MenuItem value="consumable">Consumable</MenuItem>
                <MenuItem value="spare-part">Spare Part</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Actions */}
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
          <Button onClick={handleReset} variant="outline" className="px-6">
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
