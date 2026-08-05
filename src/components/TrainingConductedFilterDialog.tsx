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

export interface TrainingConductedFilters {
  trainingName: string;
  status: string;
  site: string;
  conductedBy: string;
}

interface TrainingConductedFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TrainingConductedFilters;
  onApplyFilters: (filters: TrainingConductedFilters) => void;
  onResetFilters: () => void;
}

const emptyFilters: TrainingConductedFilters = {
  trainingName: "",
  status: "",
  site: "",
  conductedBy: "",
};

export const TrainingConductedFilterDialog = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: TrainingConductedFilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<TrainingConductedFilters>(filters);

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
            <Label htmlFor="training-name">Training Name</Label>
            <Input
              id="training-name"
              placeholder="Enter Training Name"
              value={localFilters.trainingName}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, trainingName: e.target.value }))
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
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

          <div className="space-y-2">
            <Label htmlFor="conducted-by">Conducted By</Label>
            <Input
              id="conducted-by"
              placeholder="Enter Conducted By"
              value={localFilters.conductedBy}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, conductedBy: e.target.value }))
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
