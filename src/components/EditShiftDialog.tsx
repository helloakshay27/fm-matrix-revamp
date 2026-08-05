import React, { useState, useEffect } from "react";
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

interface ShiftData {
  id: number;
  timings: string;
  totalHours: number;
  checkInMargin: string;
  createdOn: string;
  createdBy: string;
}

interface EditShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: ShiftData | null;
  onShiftUpdated?: () => void;
}

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    height: "45px !important",
    backgroundColor: "#ffffff !important",
    borderRadius: "8px !important",
    "& fieldset": {
      borderColor: "#d1d5db",
      borderRadius: "8px",
    },
    "&:hover fieldset": { borderColor: "#9ca3af" },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-primary)",
      borderWidth: "2px",
    },
  },
  "& .MuiSelect-select": {
    padding: "10px 14px !important",
    display: "flex",
    alignItems: "center",
    backgroundColor: "transparent !important",
  },
  "& .MuiSvgIcon-root": {
    color: "#6b7280",
  },
};

const selectMenuProps = {
  PaperProps: {
    className: "disable-mui-select-search",
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
    "data-disable-mui-select-search": "true",
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

export const EditShiftDialog = ({
  open,
  onOpenChange,
  shift,
  onShiftUpdated,
}: EditShiftDialogProps) => {
  const [fromHour, setFromHour] = useState<string>("");
  const [fromMinute, setFromMinute] = useState<string>("");
  const [fromAmPm, setFromAmPm] = useState<string>("AM");
  const [toHour, setToHour] = useState<string>("");
  const [toMinute, setToMinute] = useState<string>("");
  const [toAmPm, setToAmPm] = useState<string>("AM");
  const [checkInMargin, setCheckInMargin] = useState<boolean>(false);
  const [hourMargin, setHourMargin] = useState<string>("0");
  const [minMargin, setMinMargin] = useState<string>("0");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const convertTo12Hour = (hour24: string) => {
    const hourNum = parseInt(hour24, 10);
    if (hourNum === 0) {
      return { hour: "12", ampm: "AM" };
    } else if (hourNum === 12) {
      return { hour: "12", ampm: "PM" };
    } else if (hourNum < 12) {
      return { hour: String(hourNum).padStart(2, "0"), ampm: "AM" };
    } else {
      return { hour: String(hourNum - 12).padStart(2, "0"), ampm: "PM" };
    }
  };

  const convertTo24Hour = (hour: string, ampm: string) => {
    let hourNum = parseInt(hour, 10);
    if (ampm === "AM" && hourNum === 12) {
      hourNum = 0;
    } else if (ampm === "PM" && hourNum !== 12) {
      hourNum += 12;
    }
    return String(hourNum).padStart(2, "0");
  };

  useEffect(() => {
    if (shift && open) {
      const timingParts = shift.timings.split(" to ");
      if (timingParts.length === 2) {
        const fromTime = timingParts[0].trim();
        const toTime = timingParts[1].trim();

        const parseTime = (timeStr: string) => {
          const parts = timeStr.split(" ");
          if (parts.length === 2) {
            const [time, period] = parts;
            const [hours, minutes] = time.split(":");
            return {
              hour: hours.padStart(2, "0"),
              minute: minutes,
              ampm: period,
            };
          } else {
            const [hours, minutes] = timeStr.split(":");
            const hour24 = hours.padStart(2, "0");
            const converted = convertTo12Hour(hour24);
            return {
              hour: converted.hour,
              minute: minutes,
              ampm: converted.ampm,
            };
          }
        };

        const fromParsed = parseTime(fromTime);
        const toParsed = parseTime(toTime);

        setFromHour(fromParsed.hour);
        setFromMinute(fromParsed.minute);
        setFromAmPm(fromParsed.ampm);
        setToHour(toParsed.hour);
        setToMinute(toParsed.minute);
        setToAmPm(toParsed.ampm);
      }

      const hasMargin =
        shift.checkInMargin &&
        shift.checkInMargin !== "0h:0m" &&
        shift.checkInMargin !== "0h0m";
      setCheckInMargin(!!hasMargin);

      if (hasMargin && shift.checkInMargin) {
        const marginMatch = shift.checkInMargin.match(/(\d+)h:?(\d+)m?/);
        if (marginMatch) {
          setHourMargin(marginMatch[1]);
          setMinMargin(marginMatch[2]);
        }
      } else {
        setHourMargin("0");
        setMinMargin("0");
      }
    }
  }, [shift, open]);

  const validateForm = () => {
    if (!fromHour || !fromMinute || !toHour || !toMinute) {
      toast.error("Please fill in all time fields");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm() || !shift) return;

    setIsLoading(true);

    const startHour24 = convertTo24Hour(fromHour, fromAmPm);
    const endHour24 = convertTo24Hour(toHour, toAmPm);

    try {
      const payload = {
        user_shift: {
          start_hour: startHour24,
          start_min: fromMinute.padStart(2, "0"),
          end_hour: endHour24,
          end_min: toMinute.padStart(2, "0"),
          hour_margin: checkInMargin ? hourMargin.padStart(2, "0") : "00",
          min_margin: checkInMargin ? minMargin.padStart(2, "0") : "00",
        },
        check_in_margin: checkInMargin,
      };

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/pms/admin/user_shifts/${shift.id}.json`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
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
      toast.success("Shift updated successfully");
      onShiftUpdated?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating shift:", error);
      toast.error("Failed to update shift. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;

    onOpenChange(false);
    setFromHour("");
    setFromMinute("");
    setFromAmPm("AM");
    setToHour("");
    setToMinute("");
    setToAmPm("AM");
    setCheckInMargin(false);
    setHourMargin("0");
    setMinMargin("0");
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
            Edit Shift
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
                  disabled={isLoading}
                  renderValue={(selected) =>
                    selected ? String(selected) : placeholderText("Hr")
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
                  disabled={isLoading}
                  renderValue={(selected) =>
                    selected ? String(selected) : placeholderText("mm")
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  renderValue={(selected) =>
                    selected ? String(selected) : placeholderText("Hr")
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
                  disabled={isLoading}
                  renderValue={(selected) =>
                    selected ? String(selected) : placeholderText("mm")
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
                  disabled={isLoading}
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
                id="check-in-margin-edit"
                checked={checkInMargin}
                onCheckedChange={(checked) =>
                  setCheckInMargin(checked as boolean)
                }
                disabled={isLoading}
              />
              <label
                htmlFor="check-in-margin-edit"
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
              onClick={handleUpdate}
              disabled={isLoading}
              className="bg-brand hover:bg-brand-hover text-white px-8 disabled:!opacity-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
