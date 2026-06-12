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

interface VendorInvoiceFilters {
  invoiceNumber: string;
  invoiceDate: string;
  supplierName: string;
  approvalStatus: string;
}

interface VendorInvoicesFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: VendorInvoiceFilters;
  setFilters: (filters: VendorInvoiceFilters) => void;
  onApplyFilters: (filters: VendorInvoiceFilters) => void;
}

export const VendorInvoicesFilterDialog: React.FC<VendorInvoicesFilterDialogProps> = ({
  open,
  onOpenChange,
  filters,
  setFilters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<VendorInvoiceFilters>(filters);

  const handleApply = () => {
    setFilters(localFilters);
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const empty: VendorInvoiceFilters = {
      invoiceNumber: "",
      invoiceDate: "",
      supplierName: "",
      approvalStatus: "",
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
          <DialogTitle>Filter Invoices</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Invoice Number</Label>
            <Input
              placeholder="Enter invoice number"
              value={localFilters.invoiceNumber}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  invoiceNumber: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Invoice Date</Label>
            <Input
              type="date"
              value={localFilters.invoiceDate}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  invoiceDate: e.target.value,
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
          <div className="space-y-1">
            <Label>Approval Status</Label>
            <Select
              value={localFilters.approvalStatus || "all"}
              onValueChange={(val) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  approvalStatus: val === "all" ? "" : val,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
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
