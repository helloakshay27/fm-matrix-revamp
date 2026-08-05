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

export interface VisitorGateFilters {
  society: string;
  tower: string;
  gateName: string;
  userName: string;
  status: string;
}

interface VisitorGateFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VisitorGateFilters;
  onApplyFilters: (filters: VisitorGateFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: VisitorGateFilters = {
  society: "",
  tower: "",
  gateName: "",
  userName: "",
  status: "",
};

export const VisitorGateFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: VisitorGateFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<VisitorGateFilters>(filters);

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
            <Label htmlFor="visitor-gate-society">Society</Label>
            <Input
              id="visitor-gate-society"
              placeholder="Enter Society"
              value={localFilters.society}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, society: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitor-gate-tower">Tower</Label>
            <Input
              id="visitor-gate-tower"
              placeholder="Enter Tower"
              value={localFilters.tower}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, tower: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitor-gate-name">Gate Name</Label>
            <Input
              id="visitor-gate-name"
              placeholder="Enter Gate Name"
              value={localFilters.gateName}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  gateName: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitor-gate-user">User Name</Label>
            <Input
              id="visitor-gate-user"
              placeholder="Enter User Name"
              value={localFilters.userName}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  userName: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitor-gate-status">Status</Label>
            <Select
              value={localFilters.status || "all"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger id="visitor-gate-status">
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
