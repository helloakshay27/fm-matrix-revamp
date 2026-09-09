import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LockAccountBillRecord, markLockAccountBillPayment } from "./lockAccountBillInvoiceUtils";

const PAYMENT_METHOD_OPTIONS = ["UPI", "Credit Card", "Bank Transfer", "Bank Remittance", "Cash", "Cheque"];

interface LockAccountBillMarkPaymentDialogProps {
  bill: LockAccountBillRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const LockAccountBillMarkPaymentDialog: React.FC<LockAccountBillMarkPaymentDialogProps> = ({
  bill,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [paymentMode, setPaymentMode] = useState("online");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [pgTransactionId, setPgTransactionId] = useState("");
  const [billingMonth, setBillingMonth] = useState("");
  const [sendMail, setSendMail] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setPaymentMode("online");
      setPaymentMethod("");
      setPgTransactionId("");
      setBillingMonth("");
      setSendMail(true);
    }
  }, [open, bill?.id]);

  const handleSubmit = async () => {
    if (!bill) return;
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    setSubmitting(true);
    try {
      await markLockAccountBillPayment(bill, { paymentMode, paymentMethod, pgTransactionId, billingMonth, sendMail });
      toast.success("Payment recorded successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error marking payment:", error);
      const apiError = (error as { response?: { data?: { error?: string | string[] } } })?.response?.data?.error;
      const apiMessage = Array.isArray(apiError) ? apiError.join(", ") : apiError;
      toast.error(apiMessage || (error instanceof Error ? error.message : "Failed to record payment"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Payment</DialogTitle>
        </DialogHeader>
        {bill && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Bill {bill.bill_number || `#${bill.id}`} — ₹
              {Number(bill.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div>
              <Label>Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>
                Payment Method<span className="text-brand">*</span>
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHOD_OPTIONS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mp-txn-id">Transaction ID (optional)</Label>
              <Input
                id="mp-txn-id"
                value={pgTransactionId}
                onChange={(e) => setPgTransactionId(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="mp-month">Billing Month</Label>
              <Input
                id="mp-month"
                type="month"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Defaults to the current month — pick an earlier month if this payment is being recorded late, so
                the invoice number reflects the month the service was actually billed for.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="mp-send-mail"
                checked={sendMail}
                onCheckedChange={(checked) => setSendMail(!!checked)}
              />
              <Label htmlFor="mp-send-mail" className="cursor-pointer font-normal">
                Send confirmation email
              </Label>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting} className="fm-button-fix fm-button-brand">
            {submitting ? "Recording..." : "Mark as Paid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LockAccountBillMarkPaymentDialog;
