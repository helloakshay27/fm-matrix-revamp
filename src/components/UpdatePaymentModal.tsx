import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAYMENT_MODE_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit Card" },
  { value: "neft", label: "NEFT" },
  { value: "Card Swipe", label: "Card Swipe" },
  { value: "cheque", label: "Cheque" },
  { value: "rtgs", label: "RTGS" },
];

export interface UpdatePaymentSubmitData {
  amountPaid: number;
  paymentMode: string;
  transactionNumber: string;
  paymentDate: string;
  note: string;
}

interface UpdatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAmount: number;
  isSubmitting?: boolean;
  onSubmit: (data: UpdatePaymentSubmitData) => void;
}

export const UpdatePaymentModal = ({
  isOpen,
  onClose,
  pendingAmount,
  isSubmitting = false,
  onSubmit,
}: UpdatePaymentModalProps) => {
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmountPaid("");
      setPaymentMode("");
      setTransactionNumber("");
      setPaymentDate("");
      setNote("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!amountPaid || Number(amountPaid) <= 0) {
      toast.error("Please enter a valid amount paid");
      return;
    }
    if (!paymentMode) {
      toast.error("Please select a payment mode");
      return;
    }
    if (!paymentDate) {
      toast.error("Please select a payment date");
      return;
    }
    if (!note.trim()) {
      toast.error("Please enter a note");
      return;
    }

    onSubmit({
      amountPaid: Number(amountPaid),
      paymentMode,
      transactionNumber: transactionNumber.trim(),
      paymentDate,
      note: note.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm max-h-[85vh] p-0 flex flex-col gap-0">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle>Update Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 px-6 py-3 overflow-y-auto">
          <div className="space-y-1">
            <Label>
              Pending Amount<span className="text-red-500">*</span>
            </Label>
            <Input type="text" value={pendingAmount} disabled />
          </div>

          <div className="space-y-1">
            <Label>
              Amount Paid<span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>
              Payment Mode<span className="text-red-500">*</span>
            </Label>
            <Select value={paymentMode} onValueChange={setPaymentMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select Mode" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_MODE_OPTIONS.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Cheque/Transaction Number</Label>
            <Input
              type="text"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>
              Payment Date<span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>
              Note<span className="text-red-500">*</span>
            </Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write note"
              rows={2}
              className="min-h-[60px]"
            />
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-2 shrink-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand hover:bg-brand-hover text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
