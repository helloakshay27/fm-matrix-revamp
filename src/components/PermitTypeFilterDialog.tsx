import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export interface PermitTypeFilters {
  name: string;
}

interface PermitTypeFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PermitTypeFilters;
  onApplyFilters: (filters: PermitTypeFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: PermitTypeFilters = {
  name: "",
};

export const PermitTypeFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: PermitTypeFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<PermitTypeFilters>(filters);

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
      <DialogContent className="max-w-md">
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

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="permit-type-name">Permit Type</Label>
            <Input
              id="permit-type-name"
              placeholder="Enter Permit Type"
              value={localFilters.name}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
