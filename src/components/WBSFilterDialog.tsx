import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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
            <Label htmlFor="plant-code">Plant Code</Label>
            <Input
              id="plant-code"
              placeholder="Enter Plant Code"
              value={localFilters.plantCode}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, plantCode: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="Enter Category"
              value={localFilters.category}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, category: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wbs-name">WBS Name</Label>
            <Input
              id="wbs-name"
              placeholder="Enter WBS Name"
              value={localFilters.wbsName}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, wbsName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wbs-code">WBS Code</Label>
            <Input
              id="wbs-code"
              placeholder="Enter WBS Code"
              value={localFilters.wbsCode}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, wbsCode: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Input
              id="site"
              placeholder="Enter Site"
              value={localFilters.site}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, site: e.target.value }))
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
