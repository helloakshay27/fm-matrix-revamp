import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarClock, Ban, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  fetchAvailableSlotTimes,
  fetchClassBooking,
  rescheduleClassBooking,
  type ClassBookingDetail,
  type SlotTimeOption,
} from "./classPurchaseApi";

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

  const load = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await fetchClassBooking(id);
      setBooking(data);
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

      <section className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
            <CalendarClock className="w-4 h-4" />
          </div>
          <span className="font-semibold text-lg text-gray-800">Booking Details</span>
        </div>
        <div className="p-6 bg-white grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
      </section>

      <div className="flex items-center gap-2 justify-center pt-2">
        {booking.status === "booked" && (
          <>
            <Button
              variant="outline"
              onClick={() => setShowCancel(true)}
              disabled={actionBusy}
              className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <Ban className="w-4 h-4" /> Cancel Booking
            </Button>
            <Button variant="outline" onClick={openReschedule} disabled={actionBusy} className="gap-2">
              <RefreshCcw className="w-4 h-4" /> Reschedule
            </Button>
          </>
        )}
      </div>

      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TextField
              label="New date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <div>
              <h2 className="text-sm font-semibold mb-2">
                New Slot<span className="text-red-500"> *</span>
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
                        } ${isSelected ? "border-[#C72030] ring-1 ring-[#C72030]" : ""}`}
                      >
                        <input
                          type="checkbox"
                          id={`reschedule-slot-${slot.id}`}
                          checked={isSelected}
                          onChange={() => setNewSlotId(isSelected ? "" : slot.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReschedule(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={actionBusy} className="fm-button-fix fm-button-brand">
              Reschedule
            </Button>
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
          <AlertDialogFooter>
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
