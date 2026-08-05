import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from "@mui/material";
import { X } from "lucide-react";

export interface InventoryTypeFilters {
  name: string;
  code: string;
  category: string;
  status: string;
}

interface InventoryTypeFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InventoryTypeFilters;
  onApplyFilters: (filters: InventoryTypeFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: InventoryTypeFilters = {
  name: "",
  code: "",
  category: "",
  status: "",
};

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

export const InventoryTypeFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: InventoryTypeFilterDialogProps) => {
  const [localFilters, setLocalFilters] =
    useState<InventoryTypeFilters>(filters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleChange = (key: keyof InventoryTypeFilters, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters(emptyFilters);
    onResetFilters();
  };

  return (
    // modal={false} lets portaled MUI Select menus receive clicks/scroll
    // (Radix modal mode otherwise traps pointer events outside DialogContent).
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="w-full sm:max-w-[500px] bg-white overflow-visible"
        onPointerDownOutside={(e) => {
          // Keep dialog open when interacting with the MUI select menu
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
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">FILTER BY</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <FormControl fullWidth variant="outlined">
            <TextField
              id="inventory-type-name"
              label="Name"
              placeholder="Enter Name"
              value={localFilters.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <TextField
              id="inventory-type-code"
              label="Code"
              placeholder="Enter Code"
              value={localFilters.code}
              onChange={(e) => handleChange("code", e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <TextField
              id="inventory-type-category"
              label="Category"
              placeholder="Enter Category"
              value={localFilters.category}
              onChange={(e) => handleChange("category", e.target.value)}
              fullWidth
              variant="outlined"
              sx={fieldStyles}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="inventory-type-status">Status</InputLabel>
            <MuiSelect
              labelId="inventory-type-status"
              id="inventory-type-status-select"
              label="Status"
              value={localFilters.status}
              onChange={(e) => handleChange("status", e.target.value)}
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value=""><em>Select Status</em></MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <Button
            onClick={handleApply}
            className="bg-brand text-white hover:bg-brand-hover px-4 py-2"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-brand text-brand hover:bg-brand-selected hover:text-brand"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
