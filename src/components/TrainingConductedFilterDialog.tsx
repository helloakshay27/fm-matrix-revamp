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
  height: { xs: 36, sm: 40, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px 12px", sm: "10px 14px", md: "12px 14px" },
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
  },
};

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
        className="w-full sm:max-w-[500px] bg-white overflow-visible"
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
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
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
            className="sm:col-span-2"
          />

          <FormControl fullWidth variant="outlined" className="sm:col-span-2">
            <InputLabel id="training-conducted-status-label">Status</InputLabel>
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
              sx={fieldStyles}
              MenuProps={selectMenuProps}
            >
              <MenuItem value="">
                <em>All</em>
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

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button
            onClick={handleApply}
            className="bg-brand hover:bg-brand-hover text-white px-8 w-full sm:w-auto"
          >
            APPLY
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-brand text-brand px-8 w-full sm:w-auto"
          >
            RESET
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
