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

export interface GDNFilters {
  status: string;
  createdBy: string;
  handedOverTo: string;
  id: string;
}

interface GDNFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: GDNFilters;
  onApplyFilters: (filters: GDNFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: GDNFilters = {
  status: "",
  createdBy: "",
  handedOverTo: "",
  id: "",
};

export const GDNFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: GDNFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<GDNFilters>(filters);

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
            <Label htmlFor="gdn-id">ID</Label>
            <Input
              id="gdn-id"
              placeholder="Enter ID"
              value={localFilters.id}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, id: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={localFilters.status || undefined}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="created-by">Created By</Label>
            <Input
              id="created-by"
              placeholder="Enter Created By"
              value={localFilters.createdBy}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, createdBy: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handed-over-to">Handed Over To</Label>
            <Input
              id="handed-over-to"
              placeholder="Enter Handed Over To"
              value={localFilters.handedOverTo}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  handedOverTo: e.target.value,
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
