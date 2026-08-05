import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
            <Label htmlFor="sac-hsn-type">Type</Label>
            <Select
              value={localFilters.type || "all"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  type: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger id="sac-hsn-type">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sac-hsn-category">Category</Label>
            <Input
              id="sac-hsn-category"
              placeholder="Enter Category"
              value={localFilters.category}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sac-hsn-code">SAC/HSN Code</Label>
            <Input
              id="sac-hsn-code"
              placeholder="Enter Code"
              value={localFilters.code}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, code: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sac-hsn-created-by">Created By</Label>
            <Input
              id="sac-hsn-created-by"
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
