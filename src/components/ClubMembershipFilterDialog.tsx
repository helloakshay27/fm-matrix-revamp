import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';

export interface ClubMembershipFilters {
  search?: string;
  clubMemberEnabled?: string;
  accessCardEnabled?: string;
  startDate?: string;
  endDate?: string;
}

export interface ClubMembershipFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ClubMembershipFilters) => void;
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

export const ClubMembershipFilterDialog: React.FC<ClubMembershipFilterDialogProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  // Filter states
  const [search, setSearch] = useState("");
  const [clubMemberEnabled, setClubMemberEnabled] = useState("");
  const [accessCardEnabled, setAccessCardEnabled] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Date validation function
  const validateDates = (fromDate: string, toDate: string): string => {
    if (!fromDate && !toDate) {
      return "";
    }

    if (fromDate && !toDate) {
      return 'Please select an "End Date"';
    }

    if (!fromDate && toDate) {
      return 'Please select a "Start Date"';
    }

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (from > to) {
        return '"Start Date" cannot be later than "End Date"';
      }
    }

    return "";
  };

  // Handle date changes with validation
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    const error = validateDates(value, endDate);
    setDateError(error);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    const error = validateDates(startDate, value);
    setDateError(error);
  };

  const handleApply = async () => {
    // Validate dates before applying
    const dateValidationError = validateDates(startDate, endDate);
    if (dateValidationError) {
      setDateError(dateValidationError);
      toast.error(dateValidationError);
      return;
    }

    setIsLoading(true);
    try {
      const filters: ClubMembershipFilters = {
        ...(search && { search }),
        ...(clubMemberEnabled && { clubMemberEnabled }),
        ...(accessCardEnabled && { accessCardEnabled }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      };

      console.log("Applying club membership filters:", filters);
      onApply(filters);
      onClose();

      toast.success("Filters applied successfully");
    } catch (error) {
      console.error("Error applying filters:", error);
      toast.error("Failed to apply filters");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearch("");
    setClubMemberEnabled("");
    setAccessCardEnabled("");
    setStartDate("");
    setEndDate("");
    setDateError("");

    onApply({});
    toast.success("Filters cleared successfully");
  };

  // Format date to DD/MM/YYYY for API
  const formatDateForAPI = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white z-50"
        aria-describedby="club-membership-filter-dialog-description"
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            FILTER CLUB MEMBERSHIPS
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
          <div id="club-membership-filter-dialog-description" className="sr-only">
            Filter club memberships by search term, membership status, access card status, and date range
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Search Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Search
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <TextField
                label="Search by Name, Email, or Mobile"
                placeholder="Enter name, email, or mobile number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>
          </div>

          {/* Membership Status Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Membership Status
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Club Member Enabled</InputLabel>
                <MuiSelect
                  value={clubMemberEnabled}
                  onChange={(e) => setClubMemberEnabled(e.target.value)}
                  label="Club Member Enabled"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="true">Enabled</MenuItem>
                  <MenuItem value="false">Disabled</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Access Card Enabled</InputLabel>
                <MuiSelect
                  value={accessCardEnabled}
                  onChange={(e) => setAccessCardEnabled(e.target.value)}
                  label="Access Card Enabled"
                  displayEmpty
                  MenuProps={selectMenuProps}
                  sx={fieldStyles}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value="true">Enabled</MenuItem>
                  <MenuItem value="false">Disabled</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          {/* Date Range Section */}
          <div>
            <h3 className="text-sm font-medium text-[#C72030] mb-4">
              Membership Date Range
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                error={!!dateError && dateError.includes("Start")}
                helperText={
                  dateError && dateError.includes("Start") ? dateError : ""
                }
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: fieldStyles }}
                error={!!dateError && dateError.includes("End")}
                helperText={
                  dateError && dateError.includes("End") ? dateError : ""
                }
              />
            </div>
            {dateError &&
              !dateError.includes("Start") &&
              !dateError.includes("End") && (
                <div className="mt-2 text-sm text-red-600">{dateError}</div>
              )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button
            onClick={handleApply}
            disabled={isLoading}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90 flex-1 h-11"
          >
            {isLoading ? 'Applying...' : 'Apply Filter'}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex-1 h-11"
          >
            Clear All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
