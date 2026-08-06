import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextField,
} from "@mui/material";
import { X } from "lucide-react";

export interface SacHsnFilters {
  type: string;
  category: string;
  code: string;
  createdBy: string;
}

interface SacHsnFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SacHsnFilters;
  onApplyFilters: (filters: SacHsnFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: SacHsnFilters = {
  type: "",
  category: "",
  code: "",
  createdBy: "",
};

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 14px" },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting the Radix Dialog's translate transform (which mispositions it).
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const SacHsnFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: SacHsnFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<SacHsnFilters>(filters);

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

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
          if ((e.target as HTMLElement).closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root")) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if ((e.target as HTMLElement).closest(".MuiPopover-root, .MuiModal-root, .MuiMenu-root")) {
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
            <InputLabel id="sac-hsn-type-label">Type</InputLabel>
            <MuiSelect
              labelId="sac-hsn-type-label"
              label="Type"
              value={localFilters.type || "all"}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  type: e.target.value === "all" ? "" : e.target.value,
                }))
              }
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Product">Product</MenuItem>
              <MenuItem value="Service">Service</MenuItem>
            </MuiSelect>
          </FormControl>

          <TextField
            id="sac-hsn-category"
            label="Category"
            placeholder="Enter Category"
            value={localFilters.category}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            id="sac-hsn-code"
            label="SAC/HSN Code"
            placeholder="Enter Code"
            value={localFilters.code}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, code: e.target.value }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            id="sac-hsn-created-by"
            label="Created By"
            placeholder="Enter Created By"
            value={localFilters.createdBy}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                createdBy: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button
            onClick={handleApply}
            className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-brand text-brand px-8 w-full sm:w-auto"
          >
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
