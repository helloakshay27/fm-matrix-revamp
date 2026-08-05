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

export interface InvoiceApprovalsFilters {
  id: string;
  functionName: string;
  createdBy: string;
  status: string;
}

interface InvoiceApprovalsFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InvoiceApprovalsFilters;
  onApplyFilters: (filters: InvoiceApprovalsFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: InvoiceApprovalsFilters = {
  id: "",
  functionName: "",
  createdBy: "",
  status: "",
};

export const InvoiceApprovalsFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: InvoiceApprovalsFilterDialogProps) => {
  const [localFilters, setLocalFilters] =
    useState<InvoiceApprovalsFilters>(filters);

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
            <Label htmlFor="invoice-approval-id">Id</Label>
            <Input
              id="invoice-approval-id"
              placeholder="Enter Id"
              value={localFilters.id}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, id: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-function">Function</Label>
            <Input
              id="invoice-function"
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
            <Label htmlFor="invoice-created-by">Created By</Label>
            <Input
              id="invoice-created-by"
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

          <div className="space-y-2">
            <Label htmlFor="invoice-status">Status</Label>
            <Select
              value={localFilters.status || "all"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? "" : value,
                }))
              }
            >
              <SelectTrigger id="invoice-status">
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
