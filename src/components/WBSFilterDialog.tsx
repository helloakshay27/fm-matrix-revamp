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

export interface WBSFilters {
  plantCode: string;
  category: string;
  wbsName: string;
  wbsCode: string;
  site: string;
}

interface WBSFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: WBSFilters;
  onApplyFilters: (filters: WBSFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: WBSFilters = {
  plantCode: "",
  category: "",
  wbsName: "",
  wbsCode: "",
  site: "",
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

export const WBSFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: WBSFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<WBSFilters>(filters);

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
      <DialogContent className="w-full sm:max-w-[500px] bg-white overflow-visible">
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
            label="Plant Code"
            value={localFilters.plantCode}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                plantCode: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            label="Category"
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
            label="WBS Name"
            value={localFilters.wbsName}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                wbsName: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            label="WBS Code"
            value={localFilters.wbsCode}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                wbsCode: e.target.value,
              }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
          />

          <TextField
            label="Site"
            value={localFilters.site}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, site: e.target.value }))
            }
            fullWidth
            variant="outlined"
            sx={fieldStyles}
            className="sm:col-span-2"
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
