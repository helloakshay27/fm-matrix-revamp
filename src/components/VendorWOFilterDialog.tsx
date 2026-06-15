import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface VendorWOFilters {
  referenceNumber: string;
  poNumber: string;
  supplierName: string;
}

interface VendorWOFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: VendorWOFilters;
  setFilters: (filters: VendorWOFilters) => void;
  onApplyFilters: (filters: VendorWOFilters) => void;
}

export const VendorWOFilterDialog: React.FC<VendorWOFilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  setFilters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<VendorWOFilters>(filters);

  const handleApply = () => {
    setFilters(localFilters);
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const empty: VendorWOFilters = {
      referenceNumber: "",
      poNumber: "",
      supplierName: "",
    };
    setLocalFilters(empty);
    setFilters(empty);
    onApplyFilters(empty);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Work Orders</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Reference Number</Label>
            <Input
              placeholder="Enter reference number"
              value={localFilters.referenceNumber}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  referenceNumber: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>WO Number</Label>
            <Input
              placeholder="Enter WO number"
              value={localFilters.poNumber}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  poNumber: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Supplier Name</Label>
            <Input
              placeholder="Enter supplier name"
              value={localFilters.supplierName}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  supplierName: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
