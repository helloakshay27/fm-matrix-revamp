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

export interface GroupsFilters {
  groupName: string;
  subGroupName: string;
  status: string;
}

interface GroupsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: GroupsFilters;
  onApplyFilters: (filters: GroupsFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: GroupsFilters = {
  groupName: "",
  subGroupName: "",
  status: "",
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

export const GroupsFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: GroupsFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<GroupsFilters>(filters);

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
          <TextField
            id="groups-group-name"
            label="Group Name"
            placeholder="Enter Group Name"
            value={localFilters.groupName}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                groupName: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            id="groups-sub-group-name"
            label="Sub Group Name"
            placeholder="Enter Sub Group Name"
            value={localFilters.subGroupName}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                subGroupName: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel id="groups-status-label">Status</InputLabel>
            <MuiSelect
              labelId="groups-status-label"
              label="Status"
              value={localFilters.status || "all"}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: e.target.value === "all" ? "" : e.target.value,
                }))
              }
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </MuiSelect>
          </FormControl>
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
