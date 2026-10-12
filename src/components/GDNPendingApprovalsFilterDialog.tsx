import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TextField } from "@mui/material";

export interface GDNPendingApprovalFilters {
  gdnId: string;
  siteName: string;
  level: string;
}

interface GDNPendingApprovalsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: GDNPendingApprovalFilters;
  onApplyFilters: (filters: GDNPendingApprovalFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: GDNPendingApprovalFilters = {
  gdnId: "",
  siteName: "",
  level: "",
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

export const GDNPendingApprovalsFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: GDNPendingApprovalsFilterDialogProps) => {
  const [localFilters, setLocalFilters] =
    useState<GDNPendingApprovalFilters>(filters);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-[500px] bg-white overflow-visible rounded-[8px] sm:rounded-[8px]">
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
            label="GDN ID"
            value={localFilters.gdnId}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, gdnId: e.target.value }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            label="Site Name"
            value={localFilters.siteName}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                siteName: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            label="Level"
            value={localFilters.level}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, level: e.target.value }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
            className="sm:col-span-2"
          />
        </div>

        <div className="flex gap-3 pt-4 items-center justify-end">
          <Button
            onClick={handleReset}
            variant="outline"
            className="h-[42px] sm:h-[42px] px-[22px] text-[13px] font-semibold rounded-[8px]"
          >
            RESET
          </Button>
          <Button
            onClick={handleApply}
            className="fm-action-primary"
          >
            APPLY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
