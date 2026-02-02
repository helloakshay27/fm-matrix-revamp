import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import {
  FacilityBookingDetails,
  fetchBookingDetails,
  getLogs,
} from "@/store/slices/facilityBookingsSlice";
import { ArrowLeft, Logs, Ticket, CreditCard, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CustomTabs } from "@/components/CustomTabs";
import { LogsTimeline } from "@/components/LogTimeline";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export const AmenityBookingDetailsClubPage = () => {
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

  // Payment modal state
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState('online');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentLoading, setPaymentLoading] = useState(false);
  // Payment API handler
  const handlePayment = async () => {
    if (!id) return;
    setPaymentLoading(true);
    try {
      const response = await axios.post(
        `https://club-uat-api.lockated.com/pms/admin/facility_bookings/${id}/payment`,
        {
          lock_payment: {
            payment_mode: paymentMode,
            payment_method: paymentMethod
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Payment request sent successfully!');
      setOpenPaymentModal(false);
      fetchDetails();
    } catch (error) {
      toast.error('Failed to send payment request');
      console.error('Payment error:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Cancel Booking API handler
  const handleCancelBooking = async () => {
    if (!id || !bookings?.user_id) {
      toast.error('User ID not found in booking details. Cannot cancel booking.');
      return;
    }
    try {
      await axios.patch(
        `https://club-uat-api.lockated.com/pms/admin/facility_bookings/${id}`,
        {
          facility_booking: {
            canceled_by: 'user',
            canceler_id: bookings.user_id,
            comment: 'User cancelled via API',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success('Booking cancelled successfully!');
      fetchDetails();
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error('Cancel booking error:', error);
    }
  };

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

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

  const handleDownloadInvoice = async () => {
    const loadingToast = toast.loading('Generating invoice...');
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/admin/facility_bookings/${id}/invoice.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Important for PDF download
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      link.download = `facility_booking_invoice_${id}_${date}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Invoice downloaded successfully', { id: loadingToast });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice', { id: loadingToast });
    }
  };

  console.log(logs)

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
            className="grid grid-cols-3 gap-8 px-3"
          >

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booking ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.id}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Comment</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title={bookings?.comment}>
                  {bookings?.comment}
                </span>
              </div>
              {/* <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Status</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className={`text-gray-900 px-2 py-[2px] flex items-center gap-2 text-sm ${bookings?.current_status === "Cancelled"
                  ? "bg-red-100"
                  : bookings?.current_status === "Confirmed"
                    ? "bg-green-100"
                    : "bg-yellow-100"
                  }`} title={bookings?.comment} style={{ borderRadius: "4px" }}>
                  <span className={`rounded-full w-2 h-2 inline-block ${bookings?.current_status === "Cancelled"
                    ? "bg-[#D92E14]"
                    : bookings?.current_status === "Confirmed"
                      ? "bg-[#16B364]"
                      : "bg-[#D9CA20]"
                    }`}></span>
                  {bookings?.current_status}
                </span>
              </div> */}

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
                  {bookings?.payment_method === "NA"
                    ? "Complimentory"
                    : bookings?.payment_method
                        ?.split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booked by</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.booked_by_name}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">GST</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.gst || "-"}%
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Scheduled Date</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.startdate
                    ? (() => {
                        const d = bookings.startdate.split(" ")[0];
                        const [year, month, day] = d.split("-");
                        return `${day}/${month}/${year.slice(-2)}`;
                      })()
                    : "-"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Schedule Slot</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title={bookings?.show_schedule_24_hour}>
                  {bookings?.show_schedule_24_hour}
                </span>
              </div>

              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">SGST</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.sgst || "-"}%
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booked On</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.created_at
                    ? new Date(bookings.created_at.replace(' +0530', '').replace(/-/g, '/')).toLocaleString('en-GB', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      value: "payment",
      label: "Payment Details",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
                <CreditCard className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">PAYMENT DETAILS</h3>
            </div>
            <Button
              onClick={handleDownloadInvoice}
              className="bg-[#C72030] hover:bg-[#A01020] text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
              
              {/* Number of Slots Selected */}
              {bookings?.selected_slots && bookings.selected_slots.length > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 bg-blue-50">
                  <span className="text-gray-700 font-medium">Number of Slots Selected</span>
                  <span className="font-semibold text-blue-600">{bookings.selected_slots.length}</span>
                </div>
              )}

              {/* Member Charge */}
              {bookings?.member_count != null && bookings.member_count > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Member Charge</span>
                    <span className="text-sm text-gray-500">({bookings.member_count} member{bookings.member_count > 1 ? 's' : ''})</span>
                  </div>
                  <span className="font-medium">₹{((bookings?.member_charges || 0)).toFixed(2)}</span>
                </div>
              )}

              {/* Guest Charge */}
              {bookings?.guest_count != null && bookings.guest_count > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Guest Charge</span>
                    <span className="text-sm text-gray-500">({bookings.guest_count} guest{bookings.guest_count > 1 ? 's' : ''})</span>
                  </div>
                  <span className="font-medium">₹{((bookings?.guest_charges || 0)).toFixed(2)}</span>
                </div>
              )}

              {/* Slot Charges */}
              {bookings?.slot_charges != null && bookings.slot_charges > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Slot Charges</span>
                    <span className="text-sm text-gray-500">({bookings.selected_slots?.length || 0} slot{(bookings.selected_slots?.length || 0) > 1 ? 's' : ''})</span>
                  </div>
                  <span className="font-medium">₹{bookings.slot_charges.toFixed(2)}</span>
                </div>
              )}

              {/* Subtotal */}
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700 font-medium">Subtotal</span>
                <span className="text-gray-900 font-medium">₹{(((bookings?.member_charges || 0) + (bookings?.guest_charges || 0)).toFixed(2))}</span>
              </div>

              {/* Discount */}
              {bookings?.discount != null && bookings.discount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600 font-medium"> ₹{bookings.discount.toFixed(2)}</span>
                </div>
              )}

              {/* Subtotal After Discount */}
              {bookings?.discount != null && bookings.discount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Subtotal After Discount</span>
                  <span className="font-medium">₹{((bookings.sub_total || 0) )}</span>
                </div>
              )}

              {/* CGST */}
              {bookings?.cgst_amount != null && bookings.cgst_amount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">CGST</span>
                    {bookings?.gst != null && <span className="text-sm text-gray-500">({bookings.gst}%)</span>}
                  </div>
                  <span className="text-gray-900 font-medium">₹{bookings.cgst_amount.toFixed(2)}</span>
                </div>
              )}

              {/* SGST */}
              {bookings?.sgst_amount != null && bookings.sgst_amount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">SGST</span>
                    {bookings?.sgst != null && <span className="text-sm text-gray-500">({bookings.sgst}%)</span>}
                  </div>
                  <span className="text-gray-900 font-medium">₹{bookings.sgst_amount.toFixed(2)}</span>
                </div>
              )}

              {/* Convenience Charge */}
              {bookings?.conv_charge && bookings.conv_charge > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Convenience Charge</span>
                  <span className="text-gray-900 font-medium">₹{bookings.conv_charge.toFixed(2)}</span>
                </div>
              )}

              {/* Grand Total */}
              <div className="flex justify-between items-center py-3 bg-[#8B4B8C] bg-opacity-10 px-4 rounded-lg mt-2">
                <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>Grand Total</span>
                <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>₹{bookings?.amount_full?.toFixed(2) || '0.00'}</span>
              </div>
            </div>

            {/* Payment Information */}
            {/* <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Payment Status</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    bookings?.payment_status === 'Paid' 
                      ? 'bg-green-100 text-green-800' 
                      : bookings?.payment_status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {bookings?.payment_status || 'NA'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Payment Method</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.payment_method === "NA" ? "Complimentary" : bookings?.payment_method || '-'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Payment Mode</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.payment_mode || 'NA'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Amount Paid</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.amount_paid ? `₹${bookings.amount_paid.toFixed(2)}` : 'NA'}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">PG State</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.pg_state || 'NA'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Transaction ID</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium break-all">
                    {bookings?.pg_transaction_id || 'NA'}
                  </span>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[150px]">Response Code</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">
                    {bookings?.pg_response_code || 'NA'}
                  </span>
                </div>

                {bookings?.deposit_amount && bookings.deposit_amount > 0 && (
                  <div className="flex items-start">
                    <span className="text-gray-500 min-w-[150px]">Deposit Amount</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">
                      ₹{bookings.deposit_amount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div> */}

            {/* Booked Members */}
            {bookings?.booked_members && bookings.booked_members.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Booked Members</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#E5E0D3]">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sr No.</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Mobile</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Type</th>
                        <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Charge</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.booked_members.map((member: { booked_member: { id: number; name: string | null; mobile: string | null; oftype: string; charge: number | null; total: number; total_charge: number } }, index: number) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3">{index + 1}</td>
                          <td className="border border-gray-300 px-4 py-3">
                            {member.booked_member?.name || '-'}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            {member.booked_member?.mobile || '-'}
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              member.booked_member?.oftype === 'primary' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.booked_member?.oftype || '-'}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-right">
                            ₹{member.booked_member?.total_charge?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
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
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>
      <>
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-[24px] font-semibold text-[#1a1a1a]">
            {bookings.facility_name}
          </h1>
        </div>


        {/* Payment & Cancel Button for Pending/Confirmed Status */}
        {(bookings?.current_status === 'Pending' || bookings?.current_status === 'Confirmed') && (
          <div className="flex justify-end mt-6 mb-4 gap-2">
            {bookings?.current_status === 'Pending' && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpenPaymentModal(true)}>
                Payment
              </Button>
            )}
            {bookings?.current_status === 'Confirmed' && (
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCancelBooking}>
                Cancel Booking
              </Button>
            )}
          </div>
        )}


        <div className="bg-white rounded-lg border-2 border-gray-200">
          <CustomTabs tabs={tabs} defaultValue="details" onValueChange={setActiveTab} />
        </div>

       
        {/* Payment Modal */}
        <Dialog open={openPaymentModal} onOpenChange={setOpenPaymentModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Make Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payment_mode">Payment Mode</Label>
                <Select
                  value={paymentMode}
                  onValueChange={setPaymentMode}
                  disabled={paymentLoading}
                >
                  <SelectTrigger className="w-full mt-1" id="payment_mode">
                    <SelectValue placeholder="Select Payment Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  disabled={paymentLoading}
                >
                  <SelectTrigger className="w-full mt-1" id="payment_method">
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handlePayment} disabled={paymentLoading} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                {paymentLoading ? 'Processing...' : 'Submit Payment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
};
