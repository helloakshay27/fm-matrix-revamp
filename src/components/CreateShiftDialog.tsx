import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG, getAuthHeader } from "@/config/apiConfig";
import {
  FormControl,
  MenuItem,
  Select as MuiSelect,
} from "@mui/material";

interface CreateShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShiftCreated?: () => void;
}

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    height: 45,
    backgroundColor: "white",
    borderRadius: "8px",
    "& fieldset": { borderColor: "#d1d5db" },
    "&:hover fieldset": { borderColor: "#9ca3af" },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-primary)",
      borderWidth: "2px",
    },
  },
  "& .MuiSelect-select": {
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      overflowY: "auto" as const,
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 1500,
    },
    onWheel: (e: React.WheelEvent) => {
      e.stopPropagation();
    },
    onMouseDown: (e: React.MouseEvent) => {
      e.stopPropagation();
    },
  },
  MenuListProps: {
    style: {
      maxHeight: 224,
      overflowY: "auto" as const,
      paddingTop: 4,
      paddingBottom: 4,
    },
    onWheel: (e: React.WheelEvent) => {
      e.stopPropagation();
    },
  },
  // Portal to body so menu positions correctly (dialog uses CSS transform)
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
  style: { zIndex: 1500 },
};

const placeholderText = (text: string) => (
  <span style={{ color: "#9ca3af" }}>{text}</span>
);

const HOURS = [
  "12",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
];
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

export const CreateShiftDialog = ({
  open,
  onOpenChange,
  onShiftCreated,
}: CreateShiftDialogProps) => {
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [fromAmPm, setFromAmPm] = useState<string>("AM");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [toAmPm, setToAmPm] = useState<string>("PM");
  const [checkInMargin, setCheckInMargin] = useState<boolean>(false);
  const [hourMargin, setHourMargin] = useState<string>("0");
  const [minMargin, setMinMargin] = useState<string>("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertTo24Hour = (hour: string, ampm: string) => {
    let hourNum = parseInt(hour, 10);
    if (ampm === "AM" && hourNum === 12) {
      hourNum = 0;
    } else if (ampm === "PM" && hourNum !== 12) {
      hourNum += 12;
    }
    return String(hourNum).padStart(2, "0");
  };

  const validateForm = () => {
    if (
      !fromHour ||
      !fromMinute ||
      !fromAmPm ||
      !toHour ||
      !toMinute ||
      !toAmPm
    ) {
      toast.error("Please fill in all time fields");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const startHour24 = convertTo24Hour(fromHour, fromAmPm);
    const endHour24 = convertTo24Hour(toHour, toAmPm);

    const payload = {
      user_shift: {
        start_hour: startHour24,
        start_min: fromMinute,
        end_hour: endHour24,
        end_min: toMinute,
        hour_margin: checkInMargin ? hourMargin : "00",
        min_margin: checkInMargin ? minMargin : "00",
      },
      check_in_margin: checkInMargin,
    };

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/admin/user_shifts.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      toast.success("Shift created successfully!");
      resetForm();
      onOpenChange(false);
      onShiftCreated?.();
    } catch (error: any) {
      console.error("Error creating shift:", error);
      toast.error(`Failed to create shift: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFromHour("");
    setFromMinute("");
    setFromAmPm("AM");
    setToHour("");
    setToMinute("");
    setToAmPm("PM");
    setCheckInMargin(false);
    setHourMargin("0");
    setMinMargin("0");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="sm:max-w-lg bg-white"
        onPointerDownOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              ".MuiPopover-root, .MuiModal-root, .MuiMenu-root, .MuiList-root, .MuiPaper-root"
            )
          ) {
            e.preventDefault();
          }
        }}
        onInteractOutside={(e) => {
          if (
            (e.target as HTMLElement).closest(
              ".MuiPopover-root, .MuiModal-root, .MuiMenu-root, .MuiList-root, .MuiPaper-root"
            )
          ) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
            Create Shift
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Timings From <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <MuiSelect
                  displayEmpty
                  value={fromHour}
                  onChange={(e) => setFromHour(e.target.value as string)}
                  MenuProps={selectMenuProps}
                  renderValue={(selected) =>
                    selected
                      ? String(selected)
                      : placeholderText("Hr")
                  }
                >
                  {HOURS.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <span className="text-gray-500 px-1">:</span>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <MuiSelect
                  displayEmpty
                  value={fromMinute}
                  onChange={(e) => setFromMinute(e.target.value as string)}
                  MenuProps={selectMenuProps}
                  renderValue={(selected) =>
                    selected
                      ? String(selected)
                      : placeholderText("mm")
                  }
                >
                  {MINUTES.map((minute) => (
                    <MenuItem key={minute} value={minute}>
                      {minute}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                variant="outlined"
                sx={{ ...fieldStyles, minWidth: 88, width: 88 }}
              >
                <MuiSelect
                  displayEmpty
                  value={fromAmPm}
                  onChange={(e) => setFromAmPm(e.target.value as string)}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Timings To <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 items-center">
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <MuiSelect
                  displayEmpty
                  value={toHour}
                  onChange={(e) => setToHour(e.target.value as string)}
                  MenuProps={selectMenuProps}
                  renderValue={(selected) =>
                    selected
                      ? String(selected)
                      : placeholderText("Hr")
                  }
                >
                  {HOURS.map((hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <span className="text-gray-500 px-1">:</span>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <MuiSelect
                  displayEmpty
                  value={toMinute}
                  onChange={(e) => setToMinute(e.target.value as string)}
                  MenuProps={selectMenuProps}
                  renderValue={(selected) =>
                    selected
                      ? String(selected)
                      : placeholderText("mm")
                  }
                >
                  {MINUTES.map((minute) => (
                    <MenuItem key={minute} value={minute}>
                      {minute}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
              <FormControl
                variant="outlined"
                sx={{ ...fieldStyles, minWidth: 88, width: 88 }}
              >
                <MuiSelect
                  displayEmpty
                  value={toAmPm}
                  onChange={(e) => setToAmPm(e.target.value as string)}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="check-in-margin"
                checked={checkInMargin}
                onCheckedChange={(checked) =>
                  setCheckInMargin(checked as boolean)
                }
              />
              <label
                htmlFor="check-in-margin"
                className="text-sm font-medium text-gray-700"
              >
                Check In Margin
              </label>
            </div>

            {checkInMargin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Margin Time
                </label>
                <div className="flex gap-2 items-center">
                  <FormControl
                    variant="outlined"
                    sx={{ ...fieldStyles, minWidth: 88, width: 88 }}
                  >
                    <MuiSelect
                      displayEmpty
                      value={hourMargin}
                      onChange={(e) =>
                        setHourMargin(e.target.value as string)
                      }
                      MenuProps={selectMenuProps}
                    >
                      {Array.from({ length: 13 }, (_, i) => String(i)).map(
                        (hour) => (
                          <MenuItem key={hour} value={hour}>
                            {hour}
                          </MenuItem>
                        )
                      )}
                    </MuiSelect>
                  </FormControl>
                  <span className="text-sm text-gray-500">hours</span>

                  <FormControl
                    variant="outlined"
                    sx={{ ...fieldStyles, minWidth: 88, width: 88 }}
                  >
                    <MuiSelect
                      displayEmpty
                      value={minMargin}
                      onChange={(e) => setMinMargin(e.target.value as string)}
                      MenuProps={selectMenuProps}
                    >
                      {Array.from({ length: 60 }, (_, i) => String(i)).map(
                        (minute) => (
                          <MenuItem key={minute} value={minute}>
                            {minute}
                          </MenuItem>
                        )
                      )}
                    </MuiSelect>
                  </FormControl>
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="bg-brand hover:bg-brand-hover text-white px-8 disabled:!opacity-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
