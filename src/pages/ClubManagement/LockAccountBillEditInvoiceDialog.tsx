import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LockAccountBillRecord } from "./lockAccountBillInvoiceUtils";

// Header fields shown on both the Lock Account Bills list and the bill details page
// (see _lock_account_bill.json.jbuilder). invoice_format is "bill_booking" for a manually-created Invoice.
type EditableBill = LockAccountBillRecord & {
  order_number?: string | null;
  subject?: string | null;
  invoice_format?: string | null;
};

interface InvoiceEditForm {
  bill_number: string;
  bill_date: string;
  due_date: string;
  order_number: string;
  subject: string;
}

interface LockAccountBillEditInvoiceDialogProps {
  bill: EditableBill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// API dates arrive as "yyyy-mm-dd" (or a full ISO timestamp) — <input type="date"> needs the first 10 chars
const toDateInput = (value?: string | null) => (value ? String(value).slice(0, 10) : "");

const EMPTY_FORM: InvoiceEditForm = { bill_number: "", bill_date: "", due_date: "", order_number: "", subject: "" };

// Edits the invoice header (number, dates, order number, subject) of any lock account bill through
// lock_account_bills#update. Line items stay as they are — for a manually-created Invoice they're
// edited on its full Invoice edit page instead.
export const LockAccountBillEditInvoiceDialog: React.FC<LockAccountBillEditInvoiceDialogProps> = ({
  bill,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [form, setForm] = useState<InvoiceEditForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && bill) {
      setForm({
        bill_number: bill.bill_number || "",
        bill_date: toDateInput(bill.bill_date),
        due_date: toDateInput(bill.due_date),
        order_number: bill.order_number || "",
        subject: bill.subject || "",
      });
    }
  }, [open, bill]);

  const updateField = (field: keyof InvoiceEditForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!bill) return;
    const billNumber = form.bill_number.trim();
    if (bill.bill_number && !billNumber) {
      toast.error("Invoice number cannot be removed once assigned");
      return;
    }
    if (!form.bill_date) {
      toast.error("Invoice date is required");
      return;
    }
    if (form.due_date && form.due_date < form.bill_date) {
      toast.error("Due date cannot be earlier than Invoice date");
      return;
    }

    setSubmitting(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const params = new URLSearchParams();
      if (lockAccountId) params.append("lock_account_id", lockAccountId);

      await axios.patch(
        `https://${baseUrl}/lock_account_bills/${bill.id}.json?${params.toString()}`,
        {
          lock_account_bill: {
            // Sent only when filled in — a blank invoice number is minted automatically once the bill is paid
            ...(billNumber ? { bill_number: billNumber } : {}),
            bill_date: form.bill_date,
            due_date: form.due_date || null,
            order_number: form.order_number.trim(),
            subject: form.subject.trim(),
          },
        },
        { headers: { Authorization: token ? `Bearer ${token}` : undefined, "Content-Type": "application/json" } }
      );

      toast.success("Invoice updated");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating invoice:", error);
      // lock_account_bills#update returns the model errors hash, e.g. { base: ["Invoice number ... is already used ..."] }
      const data = (error as { response?: { data?: Record<string, unknown> } })?.response?.data;
      const messages = data
        ? Object.values(data).flatMap((value) => (Array.isArray(value) ? value.map(String) : []))
        : [];
      toast.error(messages.length ? messages.join(", ") : "Failed to update invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-invoice-number">Invoice Number</Label>
            <Input
              id="edit-invoice-number"
              value={form.bill_number}
              onChange={(e) => updateField("bill_number", e.target.value)}
              placeholder="Assigned automatically on payment"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-invoice-date">Invoice Date</Label>
              <Input
                id="edit-invoice-date"
                type="date"
                value={form.bill_date}
                onChange={(e) => updateField("bill_date", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="edit-invoice-due-date">Due Date</Label>
              <Input
                id="edit-invoice-due-date"
                type="date"
                min={form.bill_date || undefined}
                value={form.due_date}
                onChange={(e) => updateField("due_date", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-invoice-order-number">Order Number</Label>
            <Input
              id="edit-invoice-order-number"
              value={form.order_number}
              onChange={(e) => updateField("order_number", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="edit-invoice-subject">Subject</Label>
            <Input
              id="edit-invoice-subject"
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              className="mt-1"
            />
          </div>
          {bill?.invoice_format === "bill_booking" && (
            <p className="text-sm text-muted-foreground">
              To change line items, open the{" "}
              <button
                type="button"
                className="underline text-brand"
                onClick={() => navigate(`/club-management/invoice/edit/${bill.id}`)}
              >
                full invoice edit page
              </button>
              .
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitting} className="fm-button-fix fm-button-brand">
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
