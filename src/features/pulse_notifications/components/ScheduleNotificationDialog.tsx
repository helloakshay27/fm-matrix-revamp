import { useState } from "react";
import { format, isAfter } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ScheduleNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (scheduledAt: string, expiresAt: string) => void;
  isSubmitting: boolean;
}

// "yyyy-MM-dd'T'HH:mm:ssXXX" renders the local UTC offset (e.g. +05:30),
// matching the confirmed curl's "2026-08-21T09:30:00+05:30" format exactly.
const ISO_WITH_OFFSET_FORMAT = "yyyy-MM-dd'T'HH:mm:ssXXX";

// <input type="datetime-local"> values (e.g. "2026-08-21T09:30") have no
// timezone info — `new Date(...)` on that exact string form is specified to
// parse it as local time, which is exactly what we want here.
const inputClassName =
  "w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand";

export function ScheduleNotificationDialog({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: ScheduleNotificationDialogProps) {
  const [scheduledAt, setScheduledAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const handleConfirm = () => {
    if (!scheduledAt) {
      toast.error("Please select a scheduled date & time");
      return;
    }
    if (!expiresAt) {
      toast.error("Please select an expiry date & time");
      return;
    }

    const scheduledDate = new Date(scheduledAt);
    const expiresDate = new Date(expiresAt);

    if (!isAfter(expiresDate, scheduledDate)) {
      toast.error("Expiry date & time must be after the scheduled date & time");
      return;
    }

    onConfirm(
      format(scheduledDate, ISO_WITH_OFFSET_FORMAT),
      format(expiresDate, ISO_WITH_OFFSET_FORMAT)
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          setScheduledAt("");
          setExpiresAt("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Notification</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Scheduled At <span className="text-brand-error">*</span>
            </Label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-gray-700">
              Expires At <span className="text-brand-error">*</span>
            </Label>
            <input
              type="datetime-local"
              value={expiresAt}
              min={scheduledAt || undefined}
              onChange={(e) => setExpiresAt(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="!bg-brand hover:!bg-brand-hover !text-white"
          >
            {isSubmitting ? "Scheduling..." : "Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
