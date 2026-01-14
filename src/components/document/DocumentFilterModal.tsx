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
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title Search */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Title
              </label>
              <input
                type="text"
                placeholder="Search by title..."
                value={localFilters.title || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
            </div>

            {/* Folder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folder Name
              </label>
              <input
                type="text"
                placeholder="Search by folder name..."
                value={localFilters.folderName || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, folderName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
            </div>

            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                placeholder="Search by category..."
                value={localFilters.categoryName || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, categoryName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
            </div>

            {/* Created By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created By
              </label>
              <input
                type="text"
                placeholder="Search by creator name..."
                value={localFilters.createdBy || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, createdBy: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
            </div>

            {/* File Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Name
              </label>
              <input
                type="text"
                placeholder="Search by file name..."
                value={localFilters.fileName || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, fileName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
            </div>

            {/* File Type */}
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel>File Type</InputLabel>
              <MuiSelect
                value={localFilters.fileType || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, fileType: e.target.value })
                }
                label="File Type"
                MenuProps={selectMenuProps}
              >
                <MenuItem value="">
                  <em>All Types</em>
                </MenuItem>
                <MenuItem value="application/pdf">PDF</MenuItem>
                <MenuItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">Word (DOCX)</MenuItem>
                <MenuItem value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">Excel (XLSX)</MenuItem>
                <MenuItem value="application/vnd.openxmlformats-officedocument.presentationml.presentation">PowerPoint (PPTX)</MenuItem>
                <MenuItem value="image/jpeg">JPEG Image</MenuItem>
                <MenuItem value="image/png">PNG Image</MenuItem>
              </MuiSelect>
            </FormControl>

            {/* Created Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created From
              </label>
              <input
                type="date"
                value={localFilters.createdDateFrom || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, createdDateFrom: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
            </div>

            {/* Created Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created To
              </label>
              <input
                type="date"
                value={localFilters.createdDateTo || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, createdDateTo: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C72030] focus:border-transparent"
              />
            </div>

            {/* Status */}
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel>Status</InputLabel>
              <MuiSelect
                value={localFilters.status || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, status: e.target.value })
                }
                label="Status"
                MenuProps={selectMenuProps}
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
