import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RejectNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function RejectNotificationDialog({
  open,
  onOpenChange,
  reason,
  onReasonChange,
  onConfirm,
  isSubmitting,
}: RejectNotificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Notification</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Reason for rejection <span className="text-brand-error">*</span>
          </label>
          <Textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Explain why this notification is being rejected..."
            rows={4}
          />
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
            onClick={onConfirm}
            disabled={isSubmitting}
            className="!bg-brand-error hover:!bg-brand-error/90 !text-white"
          >
            {isSubmitting ? "Rejecting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
