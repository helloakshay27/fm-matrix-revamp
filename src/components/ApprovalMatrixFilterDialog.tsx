import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
            <Label htmlFor="approval-id">Id</Label>
            <Input
              id="approval-id"
              placeholder="Enter Id"
              value={localFilters.id}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, id: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="function-name">Function</Label>
            <Input
              id="function-name"
              placeholder="Enter Function"
              value={localFilters.functionName}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  functionName: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="created-by">Created By</Label>
            <Input
              id="created-by"
              placeholder="Enter Created By"
              value={localFilters.createdBy}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  createdBy: e.target.value,
                }))
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
