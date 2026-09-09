import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import {
  FacilityBookingDetails,
  fetchBookingDetails,
  getLogs,
} from "@/store/slices/facilityBookingsSlice";
import { usePulseEvents } from "@/components/PostHogPulseEvents";
import { ArrowLeft, Logs, Receipt, Ticket } from "lucide-react";
import { CustomTabs } from "@/components/CustomTabs";
import { LogsTimeline } from "@/components/LogTimeline";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useGaFunnelEvents } from "@/components/PostHogGaFunnelEvents";

const formatCurrency = (value?: number | null) =>
  typeof value === "number" ? `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-";

// cancellation_tiers[].min_before comes from the API in minutes — render as days/hours/minutes.
const formatMinutesDuration = (minutes?: number | null) => {
  if (typeof minutes !== "number" || Number.isNaN(minutes)) return "-";
  const totalMinutes = Math.round(Math.abs(minutes));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const mins = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins} minute${mins !== 1 ? "s" : ""}`);

  return parts.join(" ");
};

const getTaxAmounts = (bookings: FacilityBookingDetails | null) => {
  const total = bookings?.total ?? bookings?.amount_full;
  const subTotal = bookings?.sub_total;
  const gstRate = bookings?.gst;
  const sgstRate = bookings?.sgst;

  if (total == null || subTotal == null || gstRate == null || sgstRate == null || gstRate + sgstRate <= 0) {
    return { cgstAmount: null as number | null, sgstAmount: null as number | null };
  }

  const taxableAmount = subTotal - (bookings?.discount ?? 0);
  const totalTaxAmount = total - taxableAmount;
  const rateSum = gstRate + sgstRate;

  return {
    cgstAmount: totalTaxAmount * (gstRate / rateSum),
    sgstAmount: totalTaxAmount * (sgstRate / rateSum),
  };
};

export const BookingDetailsPage = () => {
  const gaEvents = useGaFunnelEvents();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<FacilityBookingDetails | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [logs, setLogs] = useState([
    {
      id: "",
      description: "",
      timestamp: "",
    }
  ]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelMode, setCancelMode] = useState<'free' | 'paid'>('free');
  const [freeCancellationReason, setFreeCancellationReason] = useState('');
  const [selectedTierPercentage, setSelectedTierPercentage] = useState<number | null>(null);
  const [reasonError, setReasonError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const reasonInputRef = useRef<HTMLTextAreaElement>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const pulseEvents = usePulseEvents();

  useEffect(() => {
    pulseEvents.onModuleViewed({
      module: "Amenities",
      package: "Pulse Privilege",
      screen: "pulse_amenity_detail",
      guard: true,
    });
  }, [pulseEvents]);

  const fetchDetails = async () => {
    try {
      const response = await dispatch(
        fetchBookingDetails({ baseUrl, token, id })
      ).unwrap();
      setBookings(response);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await dispatch(
        getLogs({ baseUrl, token, id })
      ).unwrap();
      setLogs(response.logs.map((log, index) => ({
        id: index,
        description: log.text,
        timestamp: log.date + " " + log.time,
      })));
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchLogs();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    setStatusUpdating(id);
    try {
      await axios.patch(
        `https://${baseUrl}/pms/admin/facility_bookings/${id}.json`,
        { current_status: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`Booking ${id} status updated to ${newStatus}`);
      fetchDetails();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setStatusUpdating(null);
    }
  };

  const openCancelModal = () => {
    setCancelMode(bookings?.cancellation_tiers?.length ? 'paid' : 'free');
    setFreeCancellationReason('');
    setSelectedTierPercentage(null);
    setReasonError('');
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    gaEvents.onMyBookingCancelClicked("employee", id);
    if (!id || !bookings?.user_id) {
      toast.error('User ID not found in booking details. Cannot cancel booking.');
      return;
    }

    if (cancelMode === 'free' && !freeCancellationReason.trim()) {
      setReasonError('Reason is required for free cancellation.');
      reasonInputRef.current?.focus();
      return;
    }
    if (cancelMode === 'paid' && selectedTierPercentage == null) {
      toast.error('Please select a cancellation tier.');
      return;
    }

    const facilityBookingPayload =
      cancelMode === 'free'
        ? {
          canceled_by: 'user',
          canceler_id: bookings.user_id,
          cancellation_type: 'free',
          free_cancellation_reason: freeCancellationReason.trim(),
        }
        : {
          canceled_by: 'user',
          canceler_id: bookings.user_id,
          cancellation_type: 'paid',
          return_percentage: selectedTierPercentage,
        };

    setIsCancelling(true);
    try {
      await axios.patch(
        `https://${baseUrl}/pms/admin/facility_bookings/${id}.json`,
        { facility_booking: facilityBookingPayload },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Booking cancelled successfully!');
      gaEvents.onMyBookingCancelSuccess("employee", id);
      setShowCancelModal(false);
      fetchDetails();
    } catch (error) {
      const status = error?.response?.status;
      const message: string =
        error?.response?.data?.error || error?.response?.data?.message || '';

      if (status === 500 || /can not cancel/i.test(message)) {
        // Cancellability likely changed underneath us — refresh so the
        // Cancel button re-hides itself if can_cancel_bool is now false.
        toast.error(message || 'This booking can no longer be cancelled.');
        setShowCancelModal(false);
        fetchDetails();
      } else if (/reason is required/i.test(message)) {
        setReasonError(message);
        reasonInputRef.current?.focus();
      } else if (/invalid cancellation percentage/i.test(message)) {
        toast.error(`${message} Please reselect a tier.`);
        setSelectedTierPercentage(null);
        fetchDetails();
      } else {
        toast.error(message || 'Failed to cancel booking');
      }
      console.error('Cancel booking error:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const { cgstAmount, sgstAmount } = getTaxAmounts(bookings);

  const tabs = [
    {
      value: "details",
      label: "Details",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">BOOKING DETAILS</h3>
          </div>
          <div
            className="grid grid-cols-3 gap-x-8 gap-y-4 px-3"
          >
            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Booking ID</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {bookings?.id}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Booked by</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {bookings?.created_by_name}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Schedule Slot</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title={bookings?.show_schedule_24_hour}>
                {bookings?.show_schedule_24_hour}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Comment</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title={bookings?.comment}>
                {bookings?.comment}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Scheduled Date</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {bookings?.startdate.split(" ")[0]}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Booked On</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {bookings?.created_at?.split(" ")[0] || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Status</span>
              <span className="text-gray-500 mx-2">:</span>

              <Select
                value={bookings?.current_status}
                onValueChange={(newStatus) => handleStatusChange(newStatus)}
              >
                <SelectTrigger className="border-none bg-transparent p-0 h-auto [&>svg]:hidden">
                  <div
                    className={`text-gray-900 px-2 py-[2px] flex items-center gap-2 text-sm cursor-pointer ${bookings?.current_status === "Cancelled"
                      ? "bg-red-100"
                      : bookings?.current_status === "Confirmed"
                        ? "bg-green-100"
                        : "bg-yellow-100"
                      }`}
                    style={{ borderRadius: "4px" }}
                    title={bookings?.comment}
                  >
                    <span
                      className={`rounded-full w-2 h-2 inline-block ${bookings?.current_status === "Cancelled"
                        ? "bg-[#D92E14]"
                        : bookings?.current_status === "Confirmed"
                          ? "bg-[#16B364]"
                          : "bg-[#D9CA20]"
                        }`}
                    ></span>
                    {bookings?.current_status}
                  </div>
                </SelectTrigger>
                {
                  bookings?.fac_type === "Request" && <SelectContent>
                    <SelectItem value="Pending">
                      Pending
                    </SelectItem>

                    <SelectItem value="Confirmed">
                      Confirmed
                    </SelectItem>

                    <SelectItem value="Cancelled">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                }
              </Select>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Payment Method</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {bookings?.payment_method === "NA" ? "Complimentory" : bookings?.payment_method}
              </span>
            </div>
          </div>

          {bookings?.current_status === "Cancelled" && bookings?.cancellation_type && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold uppercase text-gray-500 mb-3 px-3">
                Cancellation Details
              </h4>
              <div className="grid grid-cols-3 gap-x-8 gap-y-4 px-3">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Cancellation Type</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {bookings.cancellation_type}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Return %</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings.return_percentage != null ? `${bookings.return_percentage}%` : "-"}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Returned Amount</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(bookings.returned_amount)}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Reason</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span
                    className="text-gray-900 font-medium truncate max-w-[200px]"
                    title={bookings.free_cancellation_reason || bookings.comment}
                  >
                    {bookings.free_cancellation_reason || bookings.comment || "-"}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Cancelled On</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings.cancelled_on || "-"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      value: "charges",
      label: "Charges",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">CHARGES DETAILS</h3>
          </div>

          <div className="px-3 space-y-6">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Particulars</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-gray-900">
                      Facility Charge{bookings?.charge_type ? ` (${bookings.charge_type})` : ""}
                    </TableCell>
                    <TableCell className="text-right">1</TableCell>
                    <TableCell className="text-right">{formatCurrency(bookings?.facility_charge)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(bookings?.facility_charge)}</TableCell>
                  </TableRow>
                  {bookings?.facility_booking_accessories?.map(({ facility_booking_accessory: acc }) => (
                    <TableRow key={acc.id}>
                      <TableCell className="text-gray-900">{acc.name}</TableCell>
                      <TableCell className="text-right">{acc.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(acc.price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(acc.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Sub Total</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(bookings?.sub_total)}</span>
                </div>

                {!!bookings?.discount && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Discount{bookings?.coupon?.code ? ` (${bookings.coupon.code})` : ""}
                    </span>
                    <span className="text-brand-error font-medium">- {formatCurrency(bookings.discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">CGST {bookings?.gst != null ? `(${bookings.gst}%)` : ""}</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(cgstAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">SGST {bookings?.sgst != null ? `(${bookings.sgst}%)` : ""}</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(sgstAmount)}</span>
                </div>

                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-gray-900 font-semibold">Total</span>
                  <span className="text-gray-900 font-semibold">
                    {formatCurrency(bookings?.total ?? bookings?.amount_full)}
                  </span>
                </div>

                {/* <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.payment_method === "NA" ? "Complimentary" : bookings?.payment_method || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Payment Status</span>
                  <span className="text-gray-900 font-medium">{bookings?.payment_status || "-"}</span>
                </div>
                {bookings?.amount_paid != null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(bookings.amount_paid)}</span>
                  </div>
                )}
                {bookings?.deposit_amount != null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Deposit Amount</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(bookings.deposit_amount)}</span>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      value: "logs",
      label: "Logs",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Logs className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">LOGS</h3>
          </div>
          <div className="overflow-x-auto px-3">
            <LogsTimeline logs={logs} />
          </div>
        </div>
      )
    }
  ]

  if (!bookings) {
    return <div className="p-10 text-gray-600">Loading booking details...</div>;
  }

  return (
    <div className="p-[30px] min-h-screen bg-transparent">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
        <button
          onClick={() => navigate(`/pulse/amenity`)}
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>
      <>
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-[24px] font-semibold text-[#1a1a1a]">
            {bookings.facility_name}
          </h1>

          {bookings?.current_status === 'Confirmed' && bookings?.can_cancel_bool && (
            <Button
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-red-50"
              onClick={openCancelModal}
            >
              Cancel Booking
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200">
          <CustomTabs tabs={tabs} defaultValue="details" onValueChange={setActiveTab} />
        </div>

        {/* Cancel Booking Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent className="sm:max-w-[460px]">
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700 text-base">
                Are you sure you want to cancel this booking?
              </p>

              {!!bookings?.cancellation_tiers?.length && (
                <div className="flex gap-2 border-b pb-3">
                  <button
                    type="button"
                    onClick={() => setCancelMode('free')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${cancelMode === 'free'
                      ? 'bg-[#C72030] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Free Cancellation
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancelMode('paid')}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${cancelMode === 'paid'
                      ? 'bg-[#C72030] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Paid Cancellation
                  </button>
                </div>
              )}

              {cancelMode === 'free' ? (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Reason for cancellation
                  </label>
                  <textarea
                    ref={reasonInputRef}
                    value={freeCancellationReason}
                    onChange={(e) => {
                      setFreeCancellationReason(e.target.value);
                      if (reasonError) setReasonError('');
                    }}
                    rows={3}
                    placeholder="Enter reason for full refund cancellation..."
                    className={`w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-1 ${reasonError
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-[#C72030]'
                      }`}
                  />
                  {reasonError && <p className="text-xs text-red-600">{reasonError}</p>}
                  <p className="text-xs text-gray-500">
                    A full refund (100%) of{' '}
                    <b>{formatCurrency(bookings?.total ?? bookings?.amount_full)}</b> will be issued.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookings?.cancellation_tiers?.length ? (
                    bookings.cancellation_tiers.map((tier, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center justify-between border rounded-md p-3 cursor-pointer ${selectedTierPercentage === tier.return_percentage
                          ? 'border-[#C72030] bg-red-50'
                          : 'border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="cancellation-tier"
                            checked={selectedTierPercentage === tier.return_percentage}
                            onChange={() => setSelectedTierPercentage(tier.return_percentage)}
                          />
                          <span className="text-sm text-gray-800">
                            {tier.min_before ? `Before ${formatMinutesDuration(tier.min_before)}` : ''}
                          </span>
                        </div>
                        <div className="text-sm text-right">
                          <div className="font-medium text-gray-900">{tier.return_percentage}%</div>
                          <div className="text-gray-500">{formatCurrency(tier.amount)}</div>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No paid cancellation tiers available.</p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCancelModal(false)} disabled={isCancelling}>
                Go Back
              </Button>
              <Button
                onClick={handleCancelBooking}
                disabled={
                  isCancelling ||
                  (cancelMode === 'free' && !freeCancellationReason.trim()) ||
                  (cancelMode === 'paid' && selectedTierPercentage == null)
                }
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
};