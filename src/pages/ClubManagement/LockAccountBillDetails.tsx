import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, AlertTriangle, Download, FileText, Package, Paperclip, Receipt, FileMinus, CreditCard } from "lucide-react";
import { LockAccountBillMarkPaymentDialog } from "./LockAccountBillMarkPaymentDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LockAccountBillRecord,
  RESOURCE_TYPE_LABELS,
  downloadLockAccountBillInvoice,
} from "./lockAccountBillInvoiceUtils";

// Mirrors the line_item_type values the Credit Note / Invoice flows already use
// (CreditNoteClubAdd.tsx) so a credit note raised here shows up tagged the same way.
const LINE_ITEM_TYPE_BY_RESOURCE: Record<string, string> = {
  FacilityBooking: "facility_booking",
  ClubMemberAllocation: "membership",
};

const CREDIT_NOTE_REASONS = [
  "Sales Return",
  "Post Sale Discount",
  "Deficiency in service",
  "Correction in invoice",
  "Change in POS",
  "Finalization of Provisional assessment",
  "Others",
];

interface LockAccountBillCharge {
  id: number;
  // item_name only resolves when the charge is linked to a LockAccountItem master record —
  // charges created off a Facility Booking (FacilityBooking#create_lock_bill) never link one,
  // and only set the charge's own `name` (e.g. "Padel", "Squash"). Fall back to that.
  item_name?: string;
  name?: string;
  quantity?: number;
  rate?: number;
  total_amount?: number;
  tax_group?: unknown;
}

interface LockAccountBillAttachment {
  id: number;
  document_file_name?: string;
  attachment_url?: string;
}

interface LockAccountBillDetail extends LockAccountBillRecord {
  taxable_amount?: number;
  sub_total_amount?: number;
  discount_amount?: number;
  charge_amount?: number;
  order_number?: string;
  subject?: string;
  vendor_name?: string;
  billed_to?: number | null;
  billed_to_type?: string | null;
  bank_master?: { bank_name?: string; account_number?: string; beneficiary_name?: string; ifsc_code?: string } | null;
  item_details?: LockAccountBillCharge[];
  attachments?: LockAccountBillAttachment[];
}

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return "-";
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const LockAccountBillDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState<LockAccountBillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [creditNoteOpen, setCreditNoteOpen] = useState(false);
  const [creditReason, setCreditReason] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditSubmitting, setCreditSubmitting] = useState(false);

  const [markPaymentOpen, setMarkPaymentOpen] = useState(false);

  const fetchBill = async () => {
    setLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");

      const params = new URLSearchParams({ show: "true" });
      if (lockAccountId) params.append("lock_account_id", lockAccountId);

      const response = await axios.get(
        `https://${baseUrl}/lock_account_bills/${id}.json?${params.toString()}`,
        { headers: { Authorization: token ? `Bearer ${token}` : undefined } }
      );
      setBill(response.data);
    } catch (error) {
      console.error("Error fetching lock account bill:", error);
      toast.error("Failed to fetch lock account bill");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDownload = async () => {
    if (!bill) return;
    setDownloading(true);
    const loadingToast = toast.loading("Downloading invoice PDF...");
    try {
      await downloadLockAccountBillInvoice(bill);
      toast.success("Invoice PDF downloaded");
    } catch (error) {
      console.error("Error downloading invoice PDF:", error);
      toast.error(error instanceof Error ? error.message : "Failed to download invoice PDF");
    } finally {
      toast.dismiss(loadingToast);
      setDownloading(false);
    }
  };

  const canCreateCreditNote = !!bill && bill.billed_to_type === "User" && !!bill.billed_to;
  // "Other" bills (plain Invoices with no linked Facility Booking / Club Member Allocation) have
  // no resource_id — they're marked paid through the Invoice's own add_payment flow instead.
  const canMarkPayment =
    !!bill &&
    !!bill.resource_id &&
    (bill.total_amount ?? 0) > 0 &&
    !["paid", "part payment"].includes(String(bill.status).toLowerCase());

  const openCreditNoteDialog = () => {
    if (!bill) return;
    setCreditReason("");
    setCreditAmount(String(bill.total_amount ?? 0));
    setCreditNoteOpen(true);
  };

  const handleCreateCreditNote = async () => {
    if (!bill) return;
    if (!creditReason) {
      toast.error("Please select a reason");
      return;
    }
    const amount = Number(creditAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid credit amount");
      return;
    }

    setCreditSubmitting(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const lockAccountId = localStorage.getItem("lock_account_id");
      const resourceLabel = (bill.resource_type && RESOURCE_TYPE_LABELS[bill.resource_type]) || bill.resource_type;
      const lineItemName =
        bill.item_details?.[0]?.item_name || bill.item_details?.[0]?.name || `${resourceLabel || "Bill"} #${bill.resource_id ?? bill.id}`;

      const response = await axios.post(
        `https://${baseUrl}/lock_accounts/${lockAccountId}/credit_notes.json`,
        {
          credit_note: {
            user_id: bill.billed_to,
            resource_type: bill.resource_type,
            resource_id: bill.resource_id,
            reason: creditReason,
            subject: `Credit Note for Bill ${bill.bill_number || `#${bill.id}`}`,
          },
          line_items: [
            {
              name: lineItemName,
              line_item_type: (bill.resource_type && LINE_ITEM_TYPE_BY_RESOURCE[bill.resource_type]) || "other",
              line_item_reference_id: bill.resource_id,
              quantity: 1,
              rate: amount,
              amount,
            },
          ],
        },
        { headers: { Authorization: token ? `Bearer ${token}` : undefined, "Content-Type": "application/json" } }
      );

      toast.success("Credit note created");
      setCreditNoteOpen(false);
      navigate(`/club-management/credit-note/details/${response.data.id}`);
    } catch (error) {
      console.error("Error creating credit note:", error);
      const errors = (error as { response?: { data?: { errors?: string[] } } })?.response?.data?.errors;
      toast.error(errors?.length ? errors.join(", ") : "Failed to create credit note");
    } finally {
      setCreditSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading bill...</p>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Lock account bill not found</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate("/club-management/lock-account-bills")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lock Account Bills
          </Button>
        </div>
      </div>
    );
  }

  const resourceLabel = (bill.resource_type && RESOURCE_TYPE_LABELS[bill.resource_type]) || bill.resource_type;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/club-management/lock-account-bills")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Receipt className="h-6 w-6 text-primary" />
                Bill {bill.bill_number ? `#${bill.bill_number}` : `#${bill.id}`}
              </h1>
              {resourceLabel && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
                  Linked to {resourceLabel} #{bill.resource_id}
                  {bill.resource_exists === false && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-brand-error-bg text-brand-error">
                      <AlertTriangle className="w-3 h-3" /> Deleted
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {bill.status && (
              <Badge className="bg-gray-100 text-gray-800 border-gray-200 border">
                {String(bill.status).replace(/_/g, " ").toUpperCase()}
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMarkPaymentOpen(true)}
              disabled={!canMarkPayment}
              title={
                canMarkPayment
                  ? undefined
                  : !bill.resource_id
                    ? "Other (Invoice) bills are marked paid from the Invoice's own payment flow"
                    : "Only bills with a billable amount that aren't already paid can be marked as paid"
              }
              className="gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Mark Payment
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={openCreditNoteDialog}
              disabled={!canCreateCreditNote}
              title={canCreateCreditNote ? undefined : "Credit notes can only be raised for bills billed to a user"}
              className="gap-2"
            >
              <FileMinus className="h-4 w-4" />
              Create Credit Note
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={downloading || bill.resource_exists === false}
              title={bill.resource_exists === false ? "Linked resource was deleted — invoice can't be generated" : undefined}
              className="gap-2 fm-button-fix fm-button-brand"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Downloading..." : "Download Invoice"}
            </Button>
          </div>
        </div>

        {/* Bill Information */}
        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Bill Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resource Type</p>
                <p className="text-base font-semibold mt-1">{resourceLabel || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resource Id</p>
                <p className="text-base font-semibold mt-1">{bill.resource_id ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                <p className="text-base font-semibold mt-1">{bill.order_number || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bill Date</p>
                <p className="text-base font-semibold mt-1">{formatDate(bill.bill_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p className="text-base font-semibold mt-1">{formatDate(bill.due_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                <p className="text-base font-semibold mt-1">{bill.vendor_name || "-"}</p>
              </div>
              {bill.subject && (
                <div className="lg:col-span-3">
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p className="text-base font-semibold mt-1 break-all">{bill.subject}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Amount Summary */}
        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <Receipt className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Amount Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sub Total</p>
                <p className="text-base font-semibold mt-1">{formatCurrency(bill.sub_total_amount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Discount</p>
                <p className="text-base font-semibold mt-1">{formatCurrency(bill.discount_amount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-base font-semibold mt-1">{formatCurrency(bill.total_amount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Balance Amount</p>
                <p className="text-base font-semibold mt-1 text-red-600">{formatCurrency(bill.balance_amount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <Package className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Item Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            {bill.item_details && bill.item_details.length > 0 ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bill.item_details.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-semibold">{item.item_name || item.name || "-"}</TableCell>
                        <TableCell className="text-right">{item.quantity ?? "-"}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(item.total_amount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No items found</p>
            )}
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <Paperclip className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Attachments</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            {bill.attachments && bill.attachments.length > 0 ? (
              <div className="space-y-2">
                {bill.attachments.map((file, idx) => (
                  <div
                    key={file.id ?? idx}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium">{file.document_file_name || `Attachment ${idx + 1}`}</p>
                    </div>
                    {file.attachment_url && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(file.attachment_url, "_blank")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No attachments</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={creditNoteOpen} onOpenChange={setCreditNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Credit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For {resourceLabel} #{bill.resource_id} — Bill {bill.bill_number || `#${bill.id}`}
            </p>
            <div>
              <Label>Reason</Label>
              <Select value={creditReason} onValueChange={setCreditReason}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {CREDIT_NOTE_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="credit-amount">Credit Amount</Label>
              <Input
                id="credit-amount"
                type="number"
                min="0"
                step="0.01"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreditNoteOpen(false)} disabled={creditSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateCreditNote} disabled={creditSubmitting} className="fm-button-fix fm-button-brand">
              {creditSubmitting ? "Creating..." : "Create Credit Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LockAccountBillMarkPaymentDialog
        bill={bill}
        open={markPaymentOpen}
        onOpenChange={setMarkPaymentOpen}
        onSuccess={fetchBill}
      />
    </div>
  );
};

export default LockAccountBillDetails;
