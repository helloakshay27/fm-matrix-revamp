import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, Ban, RefreshCcw, CreditCard, Download, Logs } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomTabs } from "@/components/CustomTabs";
import { LogsTimeline } from "@/components/LogTimeline";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { TextField } from "@mui/material";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  cancelClassBooking,
  downloadClassPurchaseInvoice,
  fetchAvailableSlotTimes,
  fetchClassBooking,
  fetchClassBookingLogs,
  fetchClassPurchase,
  MANUAL_PAYMENT_METHODS,
  payClassPurchase,
  rescheduleClassBooking,
  type ClassBookingDetail,
  type ClassBookingLogEntry,
  type ClassPurchaseDetail,
  type ManualPaymentMethod,
  type SlotTimeOption,
} from "./classPurchaseApi";
import { ClassFormSection, RequiredLabel } from "./ClassFormSection";

const statusBadgeClass = (status: string) =>
  status === "booked"
    ? "bg-[#C7EDDA] text-gray-800"
    : status === "attended"
      ? "bg-gray-100 text-gray-700"
      : status === "no_show"
        ? "bg-[#F2EBC9] text-gray-800"
        : "bg-[#F2C8C4] text-gray-800";

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start">
    <span className="text-gray-500 min-w-[160px]">{label}</span>
    <span className="text-gray-500 mx-2">:</span>
    <span className="text-gray-900 font-medium">{value ?? "-"}</span>
  </div>
);

const formatTime = (iso: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const inr = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const paymentBadgeClass = (status: string) =>
  status === "paid"
    ? "bg-[#C7EDDA] text-gray-800"
    : status === "pending"
      ? "bg-[#F2EBC9] text-gray-800"
      : status === "failed"
        ? "bg-[#F2C8C4] text-gray-800"
        : "bg-gray-100 text-gray-700";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  upi: "UPI",
  cheque: "Cheque",
  manual: "Manual",
  wallet: "Wallet",
  easebuzz: "Online (Easebuzz)",
  pay_at_facility: "Pay at facility",
};

const paymentMethodLabel = (method: string | null) => (method ? (PAYMENT_METHOD_LABELS[method] ?? method) : "-");

const SummaryRow = ({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) => (
  <div className={`flex justify-between items-center py-2 border-b border-gray-200 ${className}`}>
    <span className="text-gray-700">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

export const ClassBookingDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<ClassBookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState<SlotTimeOption[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [newSlotId, setNewSlotId] = useState<number | "">("");

  // Payment and the invoice belong to the purchase (package) this booking draws a credit from.
  const [purchase, setPurchase] = useState<ClassPurchaseDetail | null>(null);
  const [purchaseError, setPurchaseError] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [payMethod, setPayMethod] = useState<ManualPaymentMethod>("cash");
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const [logs, setLogs] = useState<ClassBookingLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState(false);

  // The purchase and the logs load on their own so a failure in either never takes the page down.
  const loadPurchase = async (purchaseId: string) => {
    if (!purchaseId) return;
    try {
      setPurchase(await fetchClassPurchase(purchaseId));
      setPurchaseError(false);
    } catch (error) {
      console.error("Failed to load class purchase", error);
      setPurchaseError(true);
    }
  };

  const loadLogs = async (bookingId: string) => {
    setLogsLoading(true);
    try {
      setLogs(await fetchClassBookingLogs(bookingId));
      setLogsError(false);
    } catch (error) {
      console.error("Failed to load class booking logs", error);
      setLogsError(true);
    } finally {
      setLogsLoading(false);
    }
  };

  const load = async () => {
    if (!id) return;
    setIsLoading(true);
    setPurchase(null);
    setPurchaseError(false);
    setLogs([]);
    try {
      const data = await fetchClassBooking(id);
      setBooking(data);
      loadPurchase(data.classPurchaseId);
      loadLogs(id);
    } catch (error) {
      console.error("Failed to load class booking", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!showReschedule || !newDate || !booking) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    fetchAvailableSlotTimes(booking.trainerId, newDate, booking.clubClassId)
      .then(setSlots)
      .catch((error) => {
        console.error("Failed to load available slots", error);
        toast.error("Failed to load available slots for that date");
      })
      .finally(() => setLoadingSlots(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showReschedule, newDate, booking]);

  if (isLoading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (notFound || !booking) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Class booking not found.</p>
        <Button variant="link" onClick={() => navigate("/club-management/class-booking")}>
          Back to Class Bookings
        </Button>
      </div>
    );
  }

  const handleCancel = async () => {
    setActionBusy(true);
    try {
      await cancelClassBooking(booking.id, cancelReason);
      toast.success("Booking cancelled");
      setShowCancel(false);
      setCancelReason("");
      load();
    } catch (error) {
      console.error("Failed to cancel booking", error);
      toast.error("Failed to cancel booking");
    } finally {
      setActionBusy(false);
    }
  };

  // Staff recording that the package was paid (e.g. a "pay at facility" purchase). Marks the whole purchase
  // paid, which also issues its invoice number.
  const handlePayment = async () => {
    if (!purchase) return;
    setActionBusy(true);
    try {
      await payClassPurchase(purchase.id, payMethod);
      toast.success("Payment recorded");
      setShowPayment(false);
      load();
    } catch (error: any) {
      console.error("Failed to record payment", error);
      toast.error(error?.response?.data?.message || "Failed to record payment");
    } finally {
      setActionBusy(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!purchase) return;
    const toastId = toast.loading("Generating invoice...");
    setDownloadingInvoice(true);
    try {
      await downloadClassPurchaseInvoice(purchase.id, purchase.invoiceNumber);
      toast.success("Invoice downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Failed to download invoice", error);
      toast.error("Failed to download invoice", { id: toastId });
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const openReschedule = async () => {
    setShowReschedule(true);
    setNewDate("");
    setNewSlotId("");
    setSlots([]);
  };

  const handleReschedule = async () => {
    if (!newDate || newSlotId === "") {
      toast.error("Pick a new date and slot");
      return;
    }
    const slot = slots.find((s) => s.id === newSlotId);
    if (!slot) return;
    setActionBusy(true);
    try {
      const startTime = `${newDate}T00:00:00`;
      const endTime = `${newDate}T00:00:00`;
      const rescheduled = await rescheduleClassBooking(booking.id, newDate, startTime, endTime);
      toast.success("Booking rescheduled");
      setShowReschedule(false);
      navigate(`/club-management/class-booking/${rescheduled.id}`);
    } catch (error: any) {
      console.error("Failed to reschedule booking", error);
      const message = error?.response?.data?.errors?.join(", ") || "Failed to reschedule booking";
      toast.error(message);
    } finally {
      setActionBusy(false);
    }
  };

  // A "pay at facility" purchase stays pending until staff collect the money; only then is there anything to record.
  const canPay = purchase?.paymentStatus === "pending" && purchase.status !== "cancelled";

  const tabs = [
    {
      value: "details",
      label: "Details",
      content: (
        <ClassFormSection title="Booking Details" icon={<CalendarClock />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <InfoRow label="Member" value={booking.userName} />
            <InfoRow label="Class" value={booking.className} />
            <InfoRow label="Trainer" value={booking.trainerName} />
            <InfoRow label="Date / Time" value={`${booking.bookingDate}, ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`} />
            <InfoRow label="Credits left after booking" value={booking.remainingCredits} />
            <InfoRow label="Amount" value={`₹${booking.baseAmount.toLocaleString("en-IN")}`} />
            <InfoRow label="CGST + SGST" value={`₹${(booking.cgst + booking.sgst).toLocaleString("en-IN")}`} />
            <InfoRow label="Total" value={<span className="text-[#C72030] font-bold">₹{booking.landedAmount.toLocaleString("en-IN")}</span>} />
            <InfoRow label="Attendance" value={booking.attendance?.status ?? "Not marked"} />
            {booking.status === "cancelled" && (
              <>
                <InfoRow label="Cancelled at" value={booking.cancelledAt} />
                <InfoRow label="Cancel reason" value={booking.cancelledReason} />
              </>
            )}
          </div>
        </ClassFormSection>
      ),
    },
    {
      value: "payment",
      label: "Payment Details",
      content: (
        <ClassFormSection
          title="Payment Details"
          icon={<CreditCard />}
          actions={
            purchase ? (
              <Button onClick={handleDownloadInvoice} disabled={downloadingInvoice} className="gap-2">
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
            ) : undefined
          }
        >
          {!booking.classPurchaseId ? (
            <p className="text-sm text-gray-500">This booking is not linked to a purchase, so there are no payment details to show.</p>
          ) : !purchase ? (
            <p className="text-sm text-gray-500">
              {purchaseError
                ? `Could not load the payment details for Purchase #${booking.classPurchaseId}. Try refreshing the page.`
                : "Loading payment details..."}
            </p>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900">Payment Summary</h4>
                <p className="text-xs text-gray-500 mb-3">
                  Value of this booking's session. Payment is taken for the whole package (Purchase #{purchase.id}), shown below.
                </p>
                <SummaryRow label="Amount" value={inr(booking.baseAmount)} />
                {booking.discount > 0 && (
                  <SummaryRow label="Discount" value={<span className="text-green-600">{inr(booking.discount)}</span>} />
                )}
                {booking.cgst > 0 && <SummaryRow label="CGST" value={inr(booking.cgst)} />}
                {booking.sgst > 0 && <SummaryRow label="SGST" value={inr(booking.sgst)} />}
                <div className="flex justify-between items-center py-3 bg-[#f5f4f0] px-4 rounded-lg mt-2">
                  <span className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>Grand Total</span>
                  <span className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>{inr(booking.landedAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <InfoRow
                  label="Purchase"
                  value={
                    <button
                      type="button"
                      onClick={() => navigate(`/club-management/class-purchase/${purchase.id}`)}
                      className="text-[#C72030] underline underline-offset-2"
                    >
                      #{purchase.id}
                    </button>
                  }
                />
                <InfoRow label="Package" value={purchase.packageName} />
                <InfoRow
                  label="Payment Status"
                  value={
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${paymentBadgeClass(purchase.paymentStatus)}`}>
                      {purchase.paymentStatus}
                    </span>
                  }
                />
                <InfoRow label="Payment Method" value={paymentMethodLabel(purchase.paymentMethod)} />
                <InfoRow label="Invoice" value={purchase.invoiceNumber ?? "Not issued yet"} />
                <InfoRow label="Package Total" value={inr(purchase.total)} />
                <InfoRow label="Credits" value={`${purchase.remainingSessions} of ${purchase.totalSessions} remaining`} />
                <InfoRow label="Validity" value={`${purchase.validityStartDate} - ${purchase.validityEndDate}`} />
              </div>
            </div>
          )}
        </ClassFormSection>
      ),
    },
    {
      value: "logs",
      label: "Logs",
      content: (
        <ClassFormSection title="Logs" icon={<Logs />}>
          {logsLoading ? (
            <p className="text-sm text-gray-500">Loading logs...</p>
          ) : logsError ? (
            <p className="text-sm text-gray-500">The logs could not be loaded. Try refreshing the page.</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-gray-500">No activity recorded yet.</p>
          ) : (
            <div className="overflow-x-auto px-3">
              <LogsTimeline logs={logs} />
            </div>
          )}
        </ClassFormSection>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <button
          onClick={() => navigate("/club-management/class-booking")}
          className="flex items-center gap-2 text-black font-medium mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Class Bookings
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Booking #{booking.id}</h1>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBadgeClass(booking.status)}`}>
            {booking.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end flex-wrap">
        {canPay && (
          <Button variant="outline" onClick={() => setShowPayment(true)} disabled={actionBusy} className="gap-2">
            <CreditCard className="w-4 h-4" /> Payment
          </Button>
        )}
        {booking.status === "booked" && (
          <>
            <Button
              variant="outline"
              onClick={() => setShowCancel(true)}
              disabled={actionBusy}
              className="gap-2"
            >
              <Ban className="w-4 h-4" /> Cancel Booking
            </Button>
            <Button variant="outline" onClick={openReschedule} disabled={actionBusy} className="gap-2">
              <RefreshCcw className="w-4 h-4" /> Reschedule
            </Button>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200">
        <CustomTabs tabs={tabs} defaultValue="details" />
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] bg-white">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
          </DialogHeader>
          {purchase && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Purchase</span>
                  <span className="font-medium text-right">#{purchase.id} · {purchase.packageName}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Amount to collect</span>
                  <span className="font-bold" style={{ color: "var(--color-primary)" }}>{inr(purchase.total)}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="class-payment-method">Payment Method</Label>
                <Select value={payMethod} onValueChange={(value) => setPayMethod(value as ManualPaymentMethod)} disabled={actionBusy}>
                  <SelectTrigger className="w-full mt-1" id="class-payment-method">
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {MANUAL_PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {paymentMethodLabel(method)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-gray-500">
                This marks the whole package purchase as paid and issues its invoice number.
              </p>
            </div>
          )}
          <DialogFooter className="fm-action-bar">
            <button type="button" onClick={() => setShowPayment(false)} disabled={actionBusy} className="fm-action-secondary">
              Cancel
            </button>
            <button type="button" onClick={handlePayment} disabled={actionBusy} className="fm-action-primary">
              {actionBusy ? "Processing..." : "Submit Payment"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TextField
              label={<RequiredLabel>New date</RequiredLabel>}
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <div>
              <h2 className="text-sm font-semibold mb-2">
                New Slot<span className="ml-0.5">*</span>
              </h2>
              {slots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {slots.map((slot) => {
                    const isFull = slot.isBooked || slot.available <= 0;
                    const isSelected = newSlotId === slot.id;
                    return (
                      <div
                        key={slot.id}
                        className={`flex items-center space-x-2 p-3 border rounded-lg ${
                          isFull ? "bg-red-50 opacity-60 border-red-300" : "hover:bg-gray-50"
                        } ${isSelected ? "border-brand ring-1 ring-brand" : ""}`}
                      >
                        <input
                          type="checkbox"
                          id={`reschedule-slot-${slot.id}`}
                          checked={isSelected}
                          onChange={() => setNewSlotId(isSelected ? "" : slot.id)}
                          className="w-4 h-4 accent-brand text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                          disabled={isFull}
                        />
                        <Label
                          htmlFor={`reschedule-slot-${slot.id}`}
                          className={`cursor-pointer text-sm font-medium flex items-center gap-2 ${isFull ? "text-red-600" : ""}`}
                        >
                          {slot.label}
                          {isFull && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                              </svg>
                              Booked
                            </span>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  {newDate ? "No slots available for the selected date" : "Pick a date first"}
                </p>
              )}
              {loadingSlots && <p className="text-sm text-gray-500 mt-2">Loading slots...</p>}
            </div>
          </div>
          <DialogFooter className="fm-action-bar">
            <button type="button" onClick={() => setShowReschedule(false)} className="fm-action-secondary">
              Cancel
            </button>
            <button type="button" onClick={handleReschedule} disabled={actionBusy} className="fm-action-primary">
              Reschedule
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <div className="relative">
              <textarea
                className="peer w-full rounded-md border border-gray-300 p-3 focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756] resize-y"
                rows={4}
                value={cancelReason}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setCancelReason(e.target.value);
                }}
                placeholder="Enter Reason"
                maxLength={500}
              />
              <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal text-black/60 peer-focus:text-[#DA7756]">
                Reason
              </label>
            </div>
            <div className="mt-1 text-right text-xs text-gray-400">{cancelReason.length}/500</div>
          </div>
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
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassBookingDetails;
