import React, { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { toast } from "sonner";

interface DocumentFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    title?: string;
    folderName?: string;
    categoryName?: string;
    createdBy?: string;
    fileName?: string;
    fileType?: string;
    createdDateFrom?: string;
    createdDateTo?: string;
    status?: string;
  };
  onApplyFilters: (filters: any) => void;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const DocumentFilterModal: React.FC<DocumentFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [dateError, setDateError] = useState<string>("");

  // Date validation function
  const validateDates = (fromDate: string, toDate: string): string => {
    if (!fromDate && !toDate) {
      return "";
    }

    if (fromDate && !toDate) {
      return 'Please select a "To Date"';
    }

    if (!fromDate && toDate) {
      return 'Please select a "From Date"';
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (from > to) {
        return '"From Date" cannot be later than "To Date"';
      }
    }

    return "";
  };

  // Handle date changes with validation
  const handleDateFromChange = (value: string) => {
    setLocalFilters({ ...localFilters, createdDateFrom: value });
    const error = validateDates(value, localFilters.createdDateTo || "");
    setDateError(error);
  };

  const handleDateToChange = (value: string) => {
    setLocalFilters({ ...localFilters, createdDateTo: value });
    const error = validateDates(localFilters.createdDateFrom || "", value);
    setDateError(error);
  };

  const handleApply = () => {
    // Validate dates before applying
    const dateValidationError = validateDates(
      localFilters.createdDateFrom || "",
      localFilters.createdDateTo || ""
    );
    if (dateValidationError) {
      setDateError(dateValidationError);
      toast.error(dateValidationError);
      return;
    }

    onApplyFilters(localFilters);
    onClose();
    toast.success("Filters applied successfully");
  };

  const handleReset = () => {
    const resetFilters = {
      title: "",
      folderName: "",
      categoryName: "",
      createdBy: "",
      fileName: "",
      fileType: "",
      createdDateFrom: "",
      createdDateTo: "",
      status: "",
    };
    setLocalFilters(resetFilters);
    setDateError(""); // Clear date error
    onApplyFilters(resetFilters);
    toast.success("Filters cleared successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50"
        aria-describedby="document-filter-dialog-description"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            FILTER DOCUMENTS
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="document-filter-dialog-description" className="sr-only">
            Filter documents by title, folder name, category, created by, file
            name, file type, created date range, and status
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Information Section */}

          {/* Organization & Status Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Organization & Status
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <TextField
                label="Folder Name"
                placeholder="Search by folder name..."
                value={localFilters.folderName || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    folderName: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Category Name"
                placeholder="Search by category..."
                value={localFilters.categoryName || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    categoryName: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Status</InputLabel>
                <MuiSelect
                  value={localFilters.status || ""}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, status: e.target.value })
                  }
                  label="Status"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All Status</em>
                  </MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Creator & Date Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Creator & Date Range
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <TextField
                label="Created By"
                placeholder="Search by creator name..."
                value={localFilters.createdBy || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    createdBy: e.target.value,
                  })
                }
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Created From"
                type="date"
                value={localFilters.createdDateFrom || ""}
                onChange={(e) => handleDateFromChange(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                error={!!dateError && !!localFilters.createdDateFrom}
              />
              <TextField
                label="Created To"
                type="date"
                value={localFilters.createdDateTo || ""}
                onChange={(e) => handleDateToChange(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                error={!!dateError && !!localFilters.createdDateTo}
              />
            </div>
            {dateError && (
              <p className="text-red-500 text-sm mt-2">{dateError}</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            className="px-6 py-2 bg-[#C72030] hover:bg-[#A01828] text-white"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
