import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from "@mui/material";

export interface TrainingConductedFilters {
  trainingName: string;
  status: string;
  site: string;
  conductedBy: string;
}

interface TrainingConductedFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TrainingConductedFilters;
  onApplyFilters: (filters: TrainingConductedFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: TrainingConductedFilters = {
  trainingName: "",
  status: "",
  site: "",
  conductedBy: "",
};

const fieldStyles = {
  height: { xs: 40, sm: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
};

const selectMenuProps = {
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
  disableScrollLock: true,
  anchorOrigin: {
    vertical: "bottom" as const,
    horizontal: "left" as const,
  },
  transformOrigin: {
    vertical: "top" as const,
    horizontal: "left" as const,
  },
  style: {
    zIndex: 10001,
  },
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 10001,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const TrainingConductedFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: TrainingConductedFilterDialogProps) => {
  const [localFilters, setLocalFilters] =
    useState<TrainingConductedFilters>(filters);

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
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="max-h-[90vh] max-w-4xl overflow-y-auto bg-white"
        aria-describedby="training-conducted-filter-description"
        onPointerDownOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              ".MuiPopover-root, .MuiModal-root, .MuiMenu-root"
            )
          ) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              ".MuiPopover-root, .MuiModal-root, .MuiMenu-root"
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">FILTER BY</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="training-conducted-filter-description" className="sr-only">
            Filter conducted training by training name, status, site, and conductor
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="mb-4 text-sm font-medium text-brand">Training Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <TextField
            label="Training Name"
            value={localFilters.trainingName}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                trainingName: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel id="training-conducted-status-label" shrink>Status</InputLabel>
            <MuiSelect
              labelId="training-conducted-status-label"
              label="Status"
              value={localFilters.status}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: e.target.value as string,
                }))
              }
              displayEmpty
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </MuiSelect>
          </FormControl>

          <TextField
            label="Site"
            value={localFilters.site}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, site: e.target.value }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            label="Conducted By"
            value={localFilters.conductedBy}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                conductedBy: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-6">
          <Button
            onClick={handleApply}
            className="bg-brand px-4 py-2 text-white hover:bg-brand-hover"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-brand px-4 py-2 text-brand hover:bg-brand-selected hover:text-brand"
          >
            RESET
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
