import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TextField } from "@mui/material";
import { X } from "lucide-react";

export interface ApprovalMatrixFilters {
  functionName: string;
  createdBy: string;
  id: string;
}

interface ApprovalMatrixFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ApprovalMatrixFilters;
  onApplyFilters: (filters: ApprovalMatrixFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: ApprovalMatrixFilters = {
  functionName: "",
  createdBy: "",
  id: "",
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

export const ApprovalMatrixFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: ApprovalMatrixFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<ApprovalMatrixFilters>(filters);

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
            id="approval-id"
            label="Id"
            placeholder="Enter Id"
            value={localFilters.id}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, id: e.target.value }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            id="function-name"
            label="Function"
            placeholder="Enter Function"
            value={localFilters.functionName}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                functionName: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            id="created-by"
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
