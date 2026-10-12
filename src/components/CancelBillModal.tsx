import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CancelBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitting?: boolean;
  onSubmit: (cancelNote: string) => void;
}

export const CancelBillModal = ({
  isOpen,
  onClose,
  isSubmitting = false,
  onSubmit,
}: CancelBillModalProps) => {
  const [cancelNote, setCancelNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      setCancelNote("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!cancelNote.trim()) {
      toast.error("Please enter a reason for cancellation");
      return;
    }
    onSubmit(cancelNote.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm rounded-[8px] sm:rounded-[8px]">
        <DialogHeader>
          <DialogTitle>Cancel Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <Label>
            Cancel Reason<span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={cancelNote}
            onChange={(e) => setCancelNote(e.target.value)}
            placeholder="Write reason for cancellation"
            rows={3}
          />
        </div>

        <DialogFooter className="flex flex-row justify-end gap-3 pt-4 sm:space-x-0">
          <Button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            variant="outline"
            className="h-[42px] sm:h-[42px] px-[22px] text-[13px] font-semibold rounded-[8px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="fm-action-primary"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
