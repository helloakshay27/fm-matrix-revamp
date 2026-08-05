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

export interface InventoryTypeFilters {
  name: string;
  code: string;
  category: string;
  status: string;
}

interface InventoryTypeFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InventoryTypeFilters;
  onApplyFilters: (filters: InventoryTypeFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: InventoryTypeFilters = {
  name: "",
  code: "",
  category: "",
  status: "",
};

export const InventoryTypeFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: InventoryTypeFilterDialogProps) => {
  const [localFilters, setLocalFilters] =
    useState<InventoryTypeFilters>(filters);

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
            <Label htmlFor="inventory-type-name">Name</Label>
            <Input
              id="inventory-type-name"
              placeholder="Enter Name"
              value={localFilters.name}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory-type-code">Code</Label>
            <Input
              id="inventory-type-code"
              placeholder="Enter Code"
              value={localFilters.code}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, code: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory-type-category">Category</Label>
            <Input
              id="inventory-type-category"
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
            <Label htmlFor="inventory-type-status">Status</Label>
            <Select
              value={localFilters.status || "all"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger id="inventory-type-status">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
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
