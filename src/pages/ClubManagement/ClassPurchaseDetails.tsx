import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Users, CalendarClock, FileDown, Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import {
  cancelClassPurchase,
  classPurchaseInvoicePdfUrl,
  extendClassPurchaseValidity,
  fetchClassPurchase,
  payClassPurchase,
  updateClassPurchaseStatus,
  type ClassPurchaseDetail,
  type PurchaseStatus,
} from "./classPurchaseApi";
import { ClassFormSection, RequiredLabel, classFieldStyles } from "./ClassFormSection";

const menuProps = {
  anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
  transformOrigin: { vertical: "top" as const, horizontal: "left" as const },
  PaperProps: {
    className: "disable-mui-select-search",
    style: { maxHeight: 300, zIndex: 1500 },
    onWheel: (e: React.WheelEvent) => e.stopPropagation(),
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
  },
  MenuListProps: { "data-disable-mui-select-search": "true" } as Record<string, string>,
};

const badgeClass = (variant: "green" | "yellow" | "gray" | "red") =>
  ({
    green: "bg-[#C7EDDA] text-gray-800",
    yellow: "bg-[#F2EBC9] text-gray-800",
    gray: "bg-gray-100 text-gray-700",
    red: "bg-[#F2C8C4] text-gray-800",
  })[variant];

const paymentBadge = (status: string) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${badgeClass(status === "paid" ? "green" : status === "pending" ? "yellow" : status === "failed" ? "red" : "gray")}`}>
    {status}
  </span>
);

const statusBadge = (status: string) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${badgeClass(status === "active" ? "green" : status === "expired" ? "gray" : "red")}`}>
    {status}
  </span>
);

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start">
    <span className="text-gray-500 min-w-[140px]">{label}</span>
    <span className="text-gray-500 mx-2">:</span>
    <span className="text-gray-900 font-medium">{value ?? "-"}</span>
  </div>
);

export const ClassPurchaseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [purchase, setPurchase] = useState<ClassPurchaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const [showExtend, setShowExtend] = useState(false);
  const [newTill, setNewTill] = useState("");
  const [extendReason, setExtendReason] = useState("");

  const [nextStatus, setNextStatus] = useState<PurchaseStatus>("active");
  const [showCancel, setShowCancel] = useState(false);

  const load = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await fetchClassPurchase(id);
      setPurchase(data);
      setNextStatus(data.status);
    } catch (error) {
      console.error("Failed to load class purchase", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (notFound || !purchase) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Class purchase not found.</p>
        <Button variant="link" onClick={() => navigate("/club-management/class-purchase")}>
          Back to Class Purchases
        </Button>
      </div>
    );
  }

  const handlePay = async () => {
    setActionBusy(true);
    try {
      await payClassPurchase(purchase.id);
      toast.success("Marked as paid");
      load();
    } catch (error) {
      console.error("Failed to mark as paid", error);
      toast.error("Failed to mark as paid");
    } finally {
      setActionBusy(false);
    }
  };

  const handleStatusChange = async () => {
    setActionBusy(true);
    try {
      await updateClassPurchaseStatus(purchase.id, { status: nextStatus });
      toast.success("Status updated");
      load();
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    } finally {
      setActionBusy(false);
    }
  };

  const handleExtend = async () => {
    if (!newTill) {
      toast.error("Pick a new validity date");
      return;
    }
    setActionBusy(true);
    try {
      await extendClassPurchaseValidity(purchase.id, newTill, extendReason);
      toast.success("Validity extended");
      setShowExtend(false);
      setNewTill("");
      setExtendReason("");
      load();
    } catch (error) {
      console.error("Failed to extend validity", error);
      toast.error("Failed to extend validity");
    } finally {
      setActionBusy(false);
    }
  };

  const handleCancel = async () => {
    setActionBusy(true);
    try {
      await cancelClassPurchase(purchase.id);
      toast.success("Purchase cancelled");
      setShowCancel(false);
      load();
    } catch (error) {
      console.error("Failed to cancel purchase", error);
      toast.error("Failed to cancel purchase");
    } finally {
      setActionBusy(false);
    }
  };

  const handleInvoicePdf = async () => {
    try {
      const res = await apiClient.get(classPurchaseInvoicePdfUrl(purchase.id), { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      window.open(url, "_blank");
    } catch (error) {
      console.error("Failed to open invoice", error);
      toast.error("Failed to open invoice PDF");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <button
          onClick={() => navigate("/club-management/class-purchase")}
          className="flex items-center gap-2 text-black font-medium mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Class Purchases
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold">Purchase #{purchase.id}</h1>
          {paymentBadge(purchase.paymentStatus)}
          {/* {statusBadge(purchase.status)} */}
        </div>
      </div>

      <ClassFormSection title="Purchase Details" icon={<ShoppingCart />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <InfoRow label="Member" value={purchase.userName} />
          <InfoRow label="Class / Package" value={`${purchase.className} - ${purchase.packageName}`} />
          <InfoRow label="Credits" value={`${purchase.remainingSessions} of ${purchase.totalSessions} left`} />
          <InfoRow label="Validity" value={`${purchase.validityStartDate} - ${purchase.validityEndDate}`} />
          <InfoRow label="Invoice" value={purchase.invoiceNumber ?? "Not issued yet"} />
          <InfoRow label="Subtotal" value={`₹${purchase.subtotal.toLocaleString("en-IN")}`} />
          <InfoRow label="Discount" value={`₹${purchase.discount.toLocaleString("en-IN")}`} />
          <InfoRow label={`CGST (${purchase.cgstRate}%)`} value={`₹${purchase.cgst.toLocaleString("en-IN")}`} />
          <InfoRow label={`SGST (${purchase.sgstRate}%)`} value={`₹${purchase.sgst.toLocaleString("en-IN")}`} />
          <InfoRow label="Total" value={<span className="text-[#C72030] font-bold">₹{purchase.total.toLocaleString("en-IN")}</span>} />
        </div>
      </ClassFormSection>

      <ClassFormSection
        title="Members"
        icon={<Users />}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/club-management/class-booking`)}
          >
            View Bookings
          </Button>
        }
      >
        <div className="space-y-4">
         

          {purchase.members.length === 0 ? (
            <p className="text-sm text-gray-500">No members recorded.</p>
          ) : (
            <div className="space-y-2">
              {purchase.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between border border-gray-200 rounded-md p-3">
                  <span className="text-sm font-medium text-gray-900">{m.userName}</span>
                  <span className="text-xs text-gray-500 capitalize">{m.relationshipToBuyer}</span>
                </div>
              ))}
            </div>
          )}

           <div className="flex flex-wrap items-end gap-3">
            <FormControl variant="outlined" sx={{ minWidth: 220 }}>
              <InputLabel shrink sx={{ backgroundColor: "white", px: 1 }}>
                <RequiredLabel>Status</RequiredLabel>
              </InputLabel>
              <Select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value as PurchaseStatus)}
                displayEmpty
                label="Status *"
                sx={classFieldStyles}
                MenuProps={{
                  ...menuProps,
                  PaperProps: {
                    ...menuProps.PaperProps,
                    style: { ...menuProps.PaperProps.style, maxHeight: 300 },
                  },
                }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <Button
              onClick={handleStatusChange}
              disabled={actionBusy || nextStatus === purchase.status}
            >
              Update Status
            </Button>
          </div>
        </div>
      </ClassFormSection>

      <div className="flex items-center gap-2 flex-wrap justify-center pt-2">
        {purchase.paymentStatus === "pending" && (
          <Button onClick={handlePay} disabled={actionBusy} className="gap-2">
            <CheckCircle2 className="w-4 h-4" /> Mark as Paid
          </Button>
        )}
        <Button variant="outline" onClick={() => setShowExtend(true)} disabled={actionBusy} className="gap-2">
          <CalendarClock className="w-4 h-4" /> Extend Validity
        </Button>
        {purchase.status !== "cancelled" && (
          <Button
            variant="outline"
            onClick={() => setShowCancel(true)}
            disabled={actionBusy}
            className="gap-2"
          >
            <Ban className="w-4 h-4" /> Cancel Purchase
          </Button>
        )}
        <Button variant="outline" onClick={handleInvoicePdf} className="gap-2">
          <FileDown className="w-4 h-4" /> Invoice PDF
        </Button>
      </div>

      <Dialog open={showExtend} onOpenChange={setShowExtend}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Validity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TextField
              label={<RequiredLabel>New validity end date</RequiredLabel>}
              type="date"
              value={newTill}
              onChange={(e) => setNewTill(e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <div>
              <div className="relative">
                <textarea
                  className="peer w-full rounded-md border border-gray-300 p-3 focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756] resize-y"
                  rows={4}
                  value={extendReason}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setExtendReason(e.target.value);
                  }}
                  placeholder="Enter Reason"
                  maxLength={500}
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal text-black/60 peer-focus:text-[#DA7756]">
                  Reason
                </label>
              </div>
              <div className="mt-1 text-right text-xs text-gray-400">{extendReason.length}/500</div>
            </div>
          </div>
          <DialogFooter className="fm-action-bar">
            <button type="button" onClick={() => setShowExtend(false)} className="fm-action-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleExtend} disabled={actionBusy} className="fm-action-primary">
              Extend
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Cancel this purchase? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="fm-action-bar">
            <AlertDialogCancel disabled={actionBusy}>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              disabled={actionBusy}
              className="btn-delete-confirm"
            >
              Yes, Cancel Purchase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassPurchaseDetails;
