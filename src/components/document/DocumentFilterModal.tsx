import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";

interface DocumentFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    createdDate: string;
    createdBy: string;
    category: string;
    status: string;
  };
  onApplyFilters: (filters: any) => void;
}

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D5DbDB",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#C72030",
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
    },
  },
};

export const DocumentFilterModal: React.FC<DocumentFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      createdDate: "",
      createdBy: "",
      category: "",
      status: "",
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed bg-white rounded-lg shadow-2xl z-50 w-full max-w-2xl"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">FILTER BY</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Created Date */}
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel>Created Date</InputLabel>
              <MuiSelect
                value={localFilters.createdDate}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    createdDate: e.target.value,
                  })
                }
                label="Created Date"
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Created Date</em>
                </MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="last_7_days">Last 7 Days</MenuItem>
                <MenuItem value="last_30_days">Last 30 Days</MenuItem>
                <MenuItem value="last_90_days">Last 90 Days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </MuiSelect>
            </FormControl>

            {/* Created By */}
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel>Created By</InputLabel>
              <MuiSelect
                value={localFilters.createdBy}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    createdBy: e.target.value,
                  })
                }
                label="Created By"
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Enter Created By</em>
                </MenuItem>
                <MenuItem value="john_doe">John Doe</MenuItem>
                <MenuItem value="rohan_desai">Rohan Desai</MenuItem>
                <MenuItem value="priya_kulkarni">Priya Kulkarni</MenuItem>
                <MenuItem value="admin_system">Admin System</MenuItem>
                <MenuItem value="mahesh_patil">Mahesh Patil</MenuItem>
              </MuiSelect>
            </FormControl>

            {/* Category */}
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel>Category</InputLabel>
              <MuiSelect
                value={localFilters.category}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, category: e.target.value })
                }
                label="Category"
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                <MenuItem value="tenant">Tenant / Legal</MenuItem>
                <MenuItem value="lease">Lease / Legal</MenuItem>
                <MenuItem value="identity">Identity / Verification</MenuItem>
                <MenuItem value="safety">Safety & Compliance</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="templates">Templates</MenuItem>
              </MuiSelect>
            </FormControl>

            {/* Status */}
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel>Status</InputLabel>
              <MuiSelect
                value={localFilters.status}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, status: e.target.value })
                }
                label="Status"
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>Select Status</em>
                </MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="bg-[#C72030] hover:bg-[#A01828] text-white"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};
