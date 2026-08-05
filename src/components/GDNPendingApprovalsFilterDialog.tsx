import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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
            <Label htmlFor="gdn-id">GDN ID</Label>
            <Input
              id="gdn-id"
              placeholder="Enter GDN ID"
              value={localFilters.gdnId}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, gdnId: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              placeholder="Enter Site Name"
              value={localFilters.siteName}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  siteName: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Input
              id="level"
              placeholder="Enter Level"
              value={localFilters.level}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, level: e.target.value }))
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
